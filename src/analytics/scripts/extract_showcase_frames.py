"""
Utility script to prepare media assets for Cinematic Home Showcase.
- Automatically trims any trailing/leading black frames and extracts evenly
  spaced, WebP-optimized frames from Assets/Videos/panorama.mp4 into
  src/frontend/public/showcase/frames/ for ultra-smooth 60 FPS scroll-scrubbing.
- Generates a manifest.json with frame metadata.
- Copies promotional media to src/frontend/public/showcase/.

Usage:
  .\\src\\analytics\\.venv\\Scripts\\python.exe src/analytics/scripts/extract_showcase_frames.py
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path
import cv2
import numpy as np


def main() -> None:
    repo_root = Path(__file__).resolve().parents[3]
    assets_videos = repo_root / "Assets" / "Videos"
    assets_images = repo_root / "Assets" / "Images"
    public_showcase = repo_root / "src" / "frontend" / "public" / "showcase"
    frames_dir = public_showcase / "frames"

    public_showcase.mkdir(parents=True, exist_ok=True)
    frames_dir.mkdir(parents=True, exist_ok=True)

    # 1. Copy promotional video and illustrations
    files_to_copy = [
        (assets_videos / "reklama.mp4", public_showcase / "reklama.mp4"),
        (assets_videos / "panorama.mp4", public_showcase / "panorama.mp4"),
        (assets_images / "rodzina.jpg", public_showcase / "rodzina.jpg"),
        (assets_images / "rodzina-2.jpg", public_showcase / "rodzina-2.jpg"),
    ]
    for src, dst in files_to_copy:
        if src.exists():
            shutil.copy2(src, dst)
            print(f"[OK] Copied {src.name} -> {dst.relative_to(repo_root)}")

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
    target_frame_count = min(150, usable_count)
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
