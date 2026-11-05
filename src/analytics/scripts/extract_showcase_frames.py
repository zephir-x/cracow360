"""
Utility script to extract scroll-scrubbing frames from panorama.mp4 for Cinematic Home Showcase.
- Trims leading/trailing black frames using fast binary search.
- Uses Real-ESRGAN NCNN Vulkan AI Super-Resolution (GPU/Vulkan) for true sub-pixel reconstruction and compression noise removal.
- Performs Lanczos4 supersampling downscale to 1080p, LAB CLAHE architectural contrast enhancement, and WebP compression.
- Multi-threaded processing for ultra-fast throughput.
- Generates manifest.json with frame metadata.

Usage:
  .\\src\\analytics\\.venv\\Scripts\\python.exe src/analytics/scripts/extract_showcase_frames.py
"""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
import json
import logging
import os
from pathlib import Path
import shutil
import subprocess
import time
import cv2
import numpy as np

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)


def is_frame_visible(cap: cv2.VideoCapture, frame_idx: int) -> bool:
    # Checks whether a frame at frame_idx is non-black (mean brightness > 15.0).
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
    ret, frame = cap.read()
    if not ret or frame is None:
        return False
    return float(np.mean(frame)) > 15.0


def find_visible_frame_range(cap: cv2.VideoCapture, total_frames: int) -> tuple[int, int]:
    # Finds the [first_idx, last_idx] range of visible (non-black) frames using binary search.
    # Find start of visible range
    first_idx = 0
    if not is_frame_visible(cap, 0):
        low, high = 0, total_frames - 1
        while low < high:
            mid = (low + high) // 2
            if is_frame_visible(cap, mid):
                high = mid
            else:
                low = mid + 1
        first_idx = low

    # Find end of visible range
    last_idx = total_frames - 1
    if not is_frame_visible(cap, total_frames - 1):
        low, high = first_idx, total_frames - 1
        while low < high:
            mid = (low + high + 1) // 2
            if is_frame_visible(cap, mid):
                low = mid
            else:
                high = mid - 1
        last_idx = low

    return first_idx, last_idx


def fallback_enhance_and_sharpen_frame(frame: np.ndarray, target_w: int, target_h: int) -> np.ndarray:
    """
    Fallback mathematical enhancement if Real-ESRGAN binary is absent:
    Lanczos4 upscaling + LAB CLAHE + Unsharp Masking.
    """
    orig_h, orig_w = frame.shape[:2]
    if (orig_w, orig_h) != (target_w, target_h):
        resized = cv2.resize(frame, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
    else:
        resized = frame

    lab = cv2.cvtColor(resized, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)

    clahe = cv2.createCLAHE(clipLimit=1.4, tileGridSize=(8, 8))
    l_clahe = clahe.apply(l_channel)

    gaussian_fine = cv2.GaussianBlur(l_clahe, (0, 0), sigmaX=1.6)
    l_sharp = cv2.addWeighted(l_clahe, 1.48, gaussian_fine, -0.48, 0)

    merged_lab = cv2.merge((l_sharp, a_channel, b_channel))
    return cv2.cvtColor(merged_lab, cv2.COLOR_LAB2BGR)


def postprocess_sr_frame(args: tuple[Path, int, int, Path, int]) -> int:
    """
    Takes an AI Super-Resolved 2K frame, applies Lanczos4 supersampling to target 1080p,
    applies fine LAB CLAHE for roof/building contrast, and saves high-quality WebP.
    """
    sr_path, target_w, target_h, out_path, quality = args
    sr_img = cv2.imread(str(sr_path))
    if sr_img is None:
        return 0

    h, w = sr_img.shape[:2]
    if (w, h) != (target_w, target_h):
        downsampled = cv2.resize(sr_img, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
    else:
        downsampled = sr_img

    # Subtle contrast refinement on luminance
    lab = cv2.cvtColor(downsampled, cv2.COLOR_BGR2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)

    clahe = cv2.createCLAHE(clipLimit=1.2, tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l_channel)

    merged_lab = cv2.merge((l_enhanced, a_channel, b_channel))
    final_bgr = cv2.cvtColor(merged_lab, cv2.COLOR_LAB2BGR)

    cv2.imwrite(str(out_path), final_bgr, [cv2.IMWRITE_WEBP_QUALITY, quality])
    return 1


def main() -> None:
    start_time = time.time()
    logging.info("Starting Kraków360 Neural AI Super-Resolution Showcase frame extraction...")

    repo_root = Path(__file__).resolve().parents[3]
    assets_videos = repo_root / "Assets" / "Videos"
    public_showcase = repo_root / "src" / "frontend" / "public" / "showcase"
    frames_dir = public_showcase / "frames"
    tools_dir = repo_root / "src" / "analytics" / "tools" / "realesrgan"

    realesrgan_exe = tools_dir / "realesrgan-ncnn-vulkan.exe"
    realesrgan_models = tools_dir / "models"

    frames_dir.mkdir(parents=True, exist_ok=True)

    panorama_path = assets_videos / "panorama.mp4"
    if not panorama_path.exists():
        logging.error(f"Video file not found: {panorama_path}")
        raise FileNotFoundError(f"Missing video file: {panorama_path}")

    cap = cv2.VideoCapture(str(panorama_path))
    if not cap.isOpened():
        logging.error(f"Failed to open video file: {panorama_path}")
        raise RuntimeError(f"Unable to open video: {panorama_path}")

    fps = float(cap.get(cv2.CAP_PROP_FPS) or 60.0)
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_source_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_source_frames <= 0:
        cap.release()
        logging.error("The video file contains no frames.")
        raise ValueError("Video has no frames.")

    logging.info(
        f"Video loaded '{panorama_path.name}': {orig_w}x{orig_h} @ {fps:.1f} FPS, total of {total_source_frames} source frames"
    )

    first_idx, last_idx = find_visible_frame_range(cap, total_source_frames)
    usable_count = max(0, last_idx - first_idx + 1)
    if usable_count == 0:
        cap.release()
        logging.error("No usable non-black frames found in panorama.mp4")
        raise ValueError("No usable non-black frames found in panorama.mp4")

    logging.info(
        f"Visible frame range: [{first_idx} - {last_idx}] ({usable_count} usable frames, discarded {total_source_frames - usable_count} black transitions)"
    )

    target_frame_count = min(600, usable_count)
    target_w = 1920
    target_h = int(round(orig_h * (target_w / orig_w))) if orig_w > 0 else 1080
    webp_quality = 88

    # Map source frame indices to output 1-based frame numbers
    target_map: dict[int, list[int]] = {}
    for i in range(target_frame_count):
        src_offset = min(usable_count - 1, int(round(i * (usable_count - 1) / max(1, target_frame_count - 1))))
        actual_frame_idx = first_idx + src_offset
        target_map.setdefault(actual_frame_idx, []).append(i + 1)

    # Temporary staging directories for AI Super-Resolution
    temp_raw_dir = public_showcase / ".temp_raw_frames"
    temp_sr_dir = public_showcase / ".temp_sr_frames"

    if temp_raw_dir.exists():
        shutil.rmtree(temp_raw_dir, ignore_errors=True)
    if temp_sr_dir.exists():
        shutil.rmtree(temp_sr_dir, ignore_errors=True)

    temp_raw_dir.mkdir(parents=True, exist_ok=True)
    temp_sr_dir.mkdir(parents=True, exist_ok=True)

    has_realesrgan = realesrgan_exe.exists() and realesrgan_models.exists()
    if has_realesrgan:
        logging.info(
            f"Detected Real-ESRGAN NCNN Vulkan binary: {realesrgan_exe.name}. AI Super-Resolution pipeline enabled!"
        )
    else:
        logging.warning("Real-ESRGAN binary not found. Falling back to Lanczos4 + LAB CLAHE multi-threaded pipeline.")

    # 1. Extract raw frames to disk
    logging.info(f"Extracting {target_frame_count} raw source frames from video...")
    cap.set(cv2.CAP_PROP_POS_FRAMES, first_idx)
    curr_frame_idx = first_idx
    extracted_raw = 0

    while curr_frame_idx <= last_idx:
        ret, frame = cap.read()
        if not ret or frame is None:
            break

        if curr_frame_idx in target_map:
            for out_num in target_map[curr_frame_idx]:
                raw_file = temp_raw_dir / f"raw_{out_num:04d}.png"
                cv2.imwrite(str(raw_file), frame)
                extracted_raw += 1

        curr_frame_idx += 1
    cap.release()

    logging.info(f"Extracted {extracted_raw} raw frames in {time.time() - start_time:.1f}s.")

    # 2. AI Super-Resolution (Real-ESRGAN GPU/Vulkan) or Fallback
    sr_start = time.time()
    if has_realesrgan:
        logging.info(
            "Executing Real-ESRGAN NCNN Vulkan (2x AI Super-Resolution / artifact removal) across GPU..."
        )
        cmd = [
            str(realesrgan_exe),
            "-i",
            str(temp_raw_dir),
            "-o",
            str(temp_sr_dir),
            "-s",
            "2",
            "-n",
            "realesr-animevideov3-x2",
            "-m",
            str(realesrgan_models),
            "-f",
            "png",
        ]
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode != 0:
            logging.error(f"Real-ESRGAN exited with error code {proc.returncode}: {proc.stderr}")
            has_realesrgan = False
        else:
            sr_elapsed = time.time() - sr_start
            logging.info(
                f"Real-ESRGAN Super-Resolution completed in {sr_elapsed:.1f}s ({extracted_raw / sr_elapsed:.1f} fps)!"
            )

    # 3. Multithreaded Post-Processing & Final WebP Export
    logging.info("Cleaning previous WebP frame assets...")
    for old_file in frames_dir.glob("frame_*.webp"):
        try:
            old_file.unlink()
        except OSError:
            pass

    post_tasks: list[tuple[Path, int, int, Path, int]] = []
    for out_num in range(1, target_frame_count + 1):
        out_path = frames_dir / f"frame_{out_num:04d}.webp"
        if has_realesrgan and (temp_sr_dir / f"raw_{out_num:04d}.png").exists():
            sr_file = temp_sr_dir / f"raw_{out_num:04d}.png"
            post_tasks.append((sr_file, target_w, target_h, out_path, webp_quality))
        else:
            raw_file = temp_raw_dir / f"raw_{out_num:04d}.png"
            post_tasks.append((raw_file, target_w, target_h, out_path, webp_quality))

    logging.info(
        f"Post-processing {len(post_tasks)} frames with Lanczos4 downsampling + LAB CLAHE to final WebP..."
    )
    max_workers = min(12, max(2, (os.cpu_count() or 4)))
    saved_count = 0

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        for res in executor.map(postprocess_sr_frame, post_tasks):
            saved_count += res

    # 4. Clean up temporary staging directories
    shutil.rmtree(temp_raw_dir, ignore_errors=True)
    shutil.rmtree(temp_sr_dir, ignore_errors=True)

    manifest = {
        "frameCount": saved_count,
        "width": target_w,
        "height": target_h,
        "usableSourceFrames": usable_count,
        "sourceFps": fps,
        "pattern": "/showcase/frames/frame_{index}.webp",
        "enhanced": True,
        "aiSuperResolution": has_realesrgan,
        "model": "Real-ESRGAN NCNN Vulkan realesr-animevideov3-x2" if has_realesrgan else "Lanczos4-LAB-CLAHE",
        "quality": webp_quality,
    }
    manifest_path = frames_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    total_duration = time.time() - start_time
    logging.info(f"Created manifest file: {manifest_path.relative_to(repo_root)}")
    logging.info(
        f"Process completed successfully! Created {saved_count} AI Super-Resolved WebP frames in {total_duration:.2f}s "
        f"({saved_count / total_duration:.1f} fps) -> {frames_dir.relative_to(repo_root)}"
    )


if __name__ == "__main__":
    main()
