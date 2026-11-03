"""
Utility script to prepare media assets for Cinematic Home Showcase.
- Automatically trims any trailing/leading black frames and extracts evenly
  spaced, WebP-optimized frames from Assets/Videos/panorama.mp4 into
  src/frontend/public/showcase/frames/ for smooth scroll-scrubbing.
- Generates a manifest.json with frame metadata.
- Copies promotional media, cleans semi-transparent halo on logo_transparent.png,
  and copies team photos to src/frontend/public/showcase/.

Usage:
  .\\src\\analytics\\.venv\\Scripts\\python.exe src/analytics/scripts/extract_showcase_frames.py
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path
import cv2
import numpy as np


def clean_logo_transparent(src_path: Path, dst_path: Path) -> None:
    """Removes semi-transparent off-white circular background residue around logo_transparent.png."""
    img = cv2.imread(str(src_path), cv2.IMREAD_UNCHANGED)
    if img is None or img.shape[2] < 4:
        shutil.copy2(src_path, dst_path)
        return

    b = img[:, :, 0].astype(np.float32)
    g = img[:, :, 1].astype(np.float32)
    r = img[:, :, 2].astype(np.float32)
    a = img[:, :, 3].astype(np.float32)

    # Identify neutral/whitish background residue (low color saturation, high brightness)
    min_rgb = np.minimum(np.minimum(r, g), b)
    max_rgb = np.maximum(np.maximum(r, g), b)
    saturation = max_rgb - min_rgb

    # Pixels that are whitish/grayish residue from incomplete background removal
    is_whitish_halo = (min_rgb > 200) & (saturation < 28) & (a < 235)
    a[is_whitish_halo] = 0.0

    # Any remaining opaque white pixels inside/around the emblem become pure #FFFFFF so they match white bg 1:1
    is_pure_white = (min_rgb > 225) & (saturation < 22) & (a >= 235)
    b[is_pure_white] = 255.0
    g[is_pure_white] = 255.0
    r[is_pure_white] = 255.0

    cleaned = np.stack([b, g, r, a], axis=2).astype(np.uint8)
    cv2.imwrite(str(dst_path), cleaned)


def main() -> None:
    repo_root = Path(__file__).resolve().parents[3]
    assets_videos = repo_root / "Assets" / "Videos"
    assets_images = repo_root / "Assets" / "Images"
    public_showcase = repo_root / "src" / "frontend" / "public" / "showcase"
    frames_dir = public_showcase / "frames"

    public_showcase.mkdir(parents=True, exist_ok=True)
    frames_dir.mkdir(parents=True, exist_ok=True)

    # 1. Copy promotional video, illustrations, and team profile photos
    files_to_copy = [
        (assets_videos / "reklama.mp4", public_showcase / "reklama.mp4"),
        (assets_videos / "panorama.mp4", public_showcase / "panorama.mp4"),
        (assets_images / "rodzina.jpg", public_showcase / "rodzina.jpg"),
        (assets_images / "rodzina-2.jpg", public_showcase / "rodzina-2.jpg"),
        (assets_images / "kacper.jpg", public_showcase / "kacper.jpg"),
        (assets_images / "filip.jpg", public_showcase / "filip.jpg"),
    ]
    for src, dst in files_to_copy:
        if src.exists():
            shutil.copy2(src, dst)
            print(f"[OK] Copied {src.name} -> {dst.relative_to(repo_root)}")

    logo_src = assets_images / "logo_transparent.png"
    logo_dst = public_showcase / "logo_transparent.png"
    if logo_src.exists():
        clean_logo_transparent(logo_src, logo_dst)
        print(f"[OK] Cleaned & copied {logo_src.name} -> {logo_dst.relative_to(repo_root)}")

    # 2. Extract frames from panorama.mp4 for Canvas Scroll-Scrubbing
    panorama_path = assets_videos / "panorama.mp4"
    if not panorama_path.exists():
        raise FileNotFoundError(f"Missing video file: {panorama_path}")

    cap = cv2.VideoCapture(str(panorama_path))
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 30.0)
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    all_frames: list[np.ndarray] = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        # Keep only visible frames (automatically strip black fade-outs at start/end)
        if float(np.mean(frame)) > 15.0:
            all_frames.append(frame)
    cap.release()

    usable_count = len(all_frames)
    target_frame_count = min(250, usable_count)
    target_w = 1600
    target_h = int(round(orig_h * (target_w / orig_w))) if orig_w > 0 else 900

    # Clean old frames first
    for old_file in frames_dir.glob("frame_*.webp"):
        old_file.unlink()

    saved_count = 0
    for i in range(target_frame_count):
        src_idx = min(usable_count - 1, int(round(i * (usable_count - 1) / max(1, target_frame_count - 1))))
        resized = cv2.resize(all_frames[src_idx], (target_w, target_h), interpolation=cv2.INTER_AREA)
        out_path = frames_dir / f"frame_{i + 1:04d}.webp"
        cv2.imwrite(str(out_path), resized, [cv2.IMWRITE_WEBP_QUALITY, 82])
        saved_count += 1

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
    print(
        f"[OK] Extracted {saved_count} non-black WebP frames ({target_w}x{target_h}) "
        f"from {usable_count} usable frames -> {frames_dir.relative_to(repo_root)}"
    )


if __name__ == "__main__":
    main()
