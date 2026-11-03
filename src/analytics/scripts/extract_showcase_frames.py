"""
Utility script to extract scroll-scrubbing frames from panorama.mp4 for Cinematic Home Showcase.
- Trims leading/trailing black frames using fast binary search.
- Sequentially extracts evenly spaced, WebP-optimized frames into src/frontend/public/showcase/frames/.
- Operates in a low-memory streaming manner (zero full-video buffering in RAM).
- Generates manifest.json with frame metadata.

Usage:
  .\\src\\analytics\\.venv\\Scripts\\python.exe src/analytics/scripts/extract_showcase_frames.py
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
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


def main() -> None:
    start_time = time.time()
    logging.info("The process of extracting video frames for Kraków360 Showcase has begun...")

    repo_root = Path(__file__).resolve().parents[3]
    assets_videos = repo_root / "Assets" / "Videos"
    public_showcase = repo_root / "src" / "frontend" / "public" / "showcase"
    frames_dir = public_showcase / "frames"

    frames_dir.mkdir(parents=True, exist_ok=True)

    panorama_path = assets_videos / "panorama.mp4"
    if not panorama_path.exists():
        logging.error(f"Video file not found: {panorama_path}")
        raise FileNotFoundError(f"Missing video file: {panorama_path}")

    cap = cv2.VideoCapture(str(panorama_path))
    if not cap.isOpened():
        logging.error(f"Failed to open the video file: {panorama_path}")
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

    target_frame_count = min(500, usable_count)
    target_w = 1920
    target_h = int(round(orig_h * (target_w / orig_w))) if orig_w > 0 else 1080
    needs_resize = orig_w != target_w or orig_h != target_h

    # Map source frame indices to output 1-based frame numbers
    target_map: dict[int, list[int]] = {}
    for i in range(target_frame_count):
        src_offset = min(usable_count - 1, int(round(i * (usable_count - 1) / max(1, target_frame_count - 1))))
        actual_frame_idx = first_idx + src_offset
        target_map.setdefault(actual_frame_idx, []).append(i + 1)

    # Clean old WebP frames in destination directory
    for old_file in frames_dir.glob("frame_*.webp"):
        old_file.unlink()

    logging.info(
        f"Registration has begun {target_frame_count} WebP frames ({target_w}x{target_h}, quality 82) to directory {frames_dir.relative_to(repo_root)}..."
    )

    # Single sequential extraction pass from first_idx to last_idx
    cap.set(cv2.CAP_PROP_POS_FRAMES, first_idx)
    curr_frame_idx = first_idx
    saved_count = 0
    last_log_time = time.time()
    log_interval_seconds = 15.0

    while curr_frame_idx <= last_idx:
        ret, frame = cap.read()
        if not ret or frame is None:
            break

        if curr_frame_idx in target_map:
            frame_to_save = cv2.resize(frame, (target_w, target_h), interpolation=cv2.INTER_AREA) if needs_resize else frame
            for out_num in target_map[curr_frame_idx]:
                out_path = frames_dir / f"frame_{out_num:04d}.webp"
                cv2.imwrite(str(out_path), frame_to_save, [cv2.IMWRITE_WEBP_QUALITY, 82])
                saved_count += 1

                now = time.time()
                if now - last_log_time >= log_interval_seconds:
                    elapsed = now - start_time
                    progress_pct = (saved_count / target_frame_count * 100.0) if target_frame_count > 0 else 0.0
                    fps_speed = saved_count / elapsed if elapsed > 0 else 0.0
                    logging.info(
                        f"Extraction progress: created {saved_count}/{target_frame_count} frames ({progress_pct:.1f}%) "
                        f"| Time: {elapsed:.1f}s | Average speed: {fps_speed:.1f} fps"
                    )
                    last_log_time = now

        curr_frame_idx += 1
    cap.release()

    manifest = {
        "frameCount": saved_count,
        "width": target_w,
        "height": target_h,
        "usableSourceFrames": usable_count,
        "sourceFps": fps,
        "pattern": "/showcase/frames/frame_{index}.webp",
    }
    manifest_path = frames_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    total_duration = time.time() - start_time
    logging.info(f"Created manifest file: {manifest_path.relative_to(repo_root)}")
    logging.info(
        f"Process completed successfully! Created {saved_count} WebP frames in {total_duration:.2f}s "
        f"({saved_count / total_duration:.1f} fps) -> {frames_dir.relative_to(repo_root)}"
    )


if __name__ == "__main__":
    main()
