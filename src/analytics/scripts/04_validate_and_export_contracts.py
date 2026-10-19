"""
================================================================================
SCRIPT 04: 04_validate_and_export_contracts.py
================================================================================
GOAL / PURPOSE:
    Automated Data Contract gatekeeper. Verifies that the JSON files generated
    by the Python analytics pipeline (`krakow_districts_master.json` and
    `krakow_poi_locations.json`) strictly conform to the schema expected by
    the .NET 9 EF Core DatabaseSeeder and the React TypeScript frontend.

WHEN TO RUN:
    Always run this script from `src/analytics/` BEFORE committing any changes to Git:
        python scripts/04_validate_and_export_contracts.py

WHAT THIS SCRIPT VALIDATES:
    1. Existence and valid UTF-8 JSON syntax of both contract files in `data/contracts/`.
    2. Presence of all 7 required sections (`scores`, `demographics`, `educationAndCare`,
       `mobilityAndTransport`, `greeneryAndSport`, `cultureAndSociety`, `forecastsAndB2B`)
       for every district in `krakow_districts_master.json`.
    3. All 5 Quality of Life scores are valid numbers within `[0.0, 100.0]`.
    4. All B2B/deficit classification fields use only `"LOW"`, `"MEDIUM"`, or `"HIGH"`.
    5. All POI records in `krakow_poi_locations.json` use allowed `subCategory` enums
       and have valid GPS coordinates (`lat`, `lng`) inside the Krakow bounding box.

EXIT CODE:
    - Returns `0` (`[OK]`) if all contract checks pass.
    - Returns `1` (`[ERROR]`) with a detailed list of violations if any check fails.
================================================================================
"""

import json
import sys
from pathlib import Path
from config import CONTRACTS_OUTPUT_DIR, ALLOWED_POI_SUBCATEGORIES, ALLOWED_POTENTIAL_LEVELS


def validate_districts_master(file_path: Path) -> list[str]:
    errors: list[str] = []
    if not file_path.exists():
        return [f"Missing file: {file_path}"]

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "metadata" not in data or "districts" not in data:
        errors.append("Missing root keys 'metadata' or 'districts'.")
        return errors

    required_sections = [
        "scores",
        "demographics",
        "educationAndCare",
        "mobilityAndTransport",
        "greeneryAndSport",
        "cultureAndSociety",
        "forecastsAndB2B",
    ]

    for idx, d in enumerate(data["districts"]):
        d_id = d.get("districtId", f"index_{idx}")
        for sec in required_sections:
            if sec not in d:
                errors.append(f"District {d_id}: missing section '{sec}'.")

        scores = d.get("scores", {})
        for score_key in ["mobilityScore", "educationScore", "greeneryScore", "cultureAndSeniorScore", "environmentScore"]:
            val = scores.get(score_key)
            if val is None or not (0.0 <= float(val) <= 100.0):
                errors.append(f"District {d_id}: '{score_key}' must be between 0 and 100 (current: {val}).")

        forecasts = d.get("forecastsAndB2B", {})
        for level_key in ["nurseryInvestmentPotentialB2B", "seniorInfrastructureDeficit", "greenSpaceDeficit"]:
            lvl = forecasts.get(level_key)
            if lvl not in ALLOWED_POTENTIAL_LEVELS:
                errors.append(
                    f"District {d_id}: '{level_key}' has invalid value '{lvl}'. Allowed: {ALLOWED_POTENTIAL_LEVELS}."
                )

    return errors


def validate_poi_locations(file_path: Path) -> list[str]:
    errors: list[str] = []
    if not file_path.exists():
        return [f"Missing file: {file_path}"]

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    pois = data.get("pointsOfInterest")
    if not isinstance(pois, list):
        return ["Missing 'pointsOfInterest' array in POI contract file."]

    for idx, poi in enumerate(pois):
        poi_id = poi.get("id", f"index_{idx}")
        sub_cat = poi.get("subCategory")
        if sub_cat not in ALLOWED_POI_SUBCATEGORIES:
            errors.append(f"POI '{poi_id}': invalid subCategory='{sub_cat}'.")
        lat, lng = poi.get("lat"), poi.get("lng")
        if lat is None or lng is None or not (49.9 <= float(lat) <= 50.2) or not (19.7 <= float(lng) <= 20.3):
            errors.append(f"POI '{poi_id}': coordinates ({lat}, {lng}) are outside the Krakow bounding box!")

    return errors


def main() -> int:
    districts_file = CONTRACTS_OUTPUT_DIR / "krakow_districts_master.json"
    poi_file = CONTRACTS_OUTPUT_DIR / "krakow_poi_locations.json"

    print("=== Krakow360 Data Contract Validation ===")
    d_errors = validate_districts_master(districts_file)
    p_errors = validate_poi_locations(poi_file)

    all_errors = d_errors + p_errors
    if all_errors:
        print("\n[ERROR] Data contract validation failed:")
        for err in all_errors:
            print(f"  - {err}")
        return 1

    print(f"[OK] {districts_file.name} is 100% compliant with the Data Contract! ({len(json.loads(districts_file.read_text(encoding='utf-8'))['districts'])} districts verified)")
    print(f"[OK] {poi_file.name} is 100% compliant with the Data Contract!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
