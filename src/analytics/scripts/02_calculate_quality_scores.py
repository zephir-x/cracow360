"""
STEP 2: Computing normalized Quality of Life scores (0-100 scale) for the 18 Krakow districts.
Used in Module 1 (Resident Mode - Quality of Life Index).
"""

from config import min_max_normalize_0_100


def calculate_quality_scores_demo() -> None:
    sample_raw_stops = [48, 64, 58]
    normalized = min_max_normalize_0_100(sample_raw_stops, invert=False)
    print(f"[Scores] Sample Min-Max normalization (0-100): {sample_raw_stops} -> {normalized}")


if __name__ == "__main__":
    calculate_quality_scores_demo()
