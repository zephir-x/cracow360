"""
GOAL / PURPOSE:
    Step 03 in the Krakow360 Python analytics pipeline.
    Processes urban accessibility data for people with disabilities, seniors, and parents
    with baby strollers across all 18 Krakow administrative districts.

DATA SOURCES INTEGRATED (100% Real Municipal Open Data):
    1. `Miejsca postojowe dla osob z niepelnosprawnosciami w Krakowie.csv` (ZDMK - Niebieskie Koperty):
       - 862 locations, 1,709 designated PRM parking stalls across 18 districts.
    2. `Dostepnosc architektoniczna obiektow publicznych w Krakowie.csv` (UMK / MFiPR Accessibility Audit):
       - 25 municipal headquarters, branches, and cultural centres with audits of ramps, elevators,
         PRM accessible toilets, hearing loops (pętle indukcyjne), and Polish Sign Language (PJM) support.
    3. `Przystanki_Komunikacji_Miejskiej_w_Krakowie...csv` (KMK / ZTP):
       - 1,378 transit stops evaluated for Kassel-kerb platform boarding curbs and tactile paving guidance strips.
    4. `Centra Aktywnosci Seniora w Krakowie.csv` (UMK / DlaSeniora):
       - 53 Senior Activity Centres (CAS) serving the elderly population across all 18 districts.

OUTPUTS:
    - `data/contracts/krakow_accessibility_profiles.json` (Contract consumed by frontend Civic Accessibility Navigator)
    - `src/analytics/data_processed/districts_accessibility.json` (Intermediate processed dataset)
"""

from __future__ import annotations

import csv
from datetime import datetime, timezone
import json
import math
from pathlib import Path
import re
import sys

# Ensure script-level imports resolve config cleanly regardless of execution working directory
sys.path.append(str(Path(__file__).resolve().parent))

from matplotlib.path import Path as MplPath
import numpy as np

from config import (
    CONTRACTS_OUTPUT_DIR,
    KRAKOW_DISTRICTS,
    PROCESSED_DATA_DIR,
    RAW_DATA_DIR,
    epsg3857_to_wgs84,
    min_max_normalize_0_100,
)


def load_district_polygons(geojson_path: Path) -> dict[int, list[MplPath]]:
    # Loads WGS84 multi-polygon boundaries for point-in-polygon assignment of transit stops.
    with open(geojson_path, "r", encoding="utf-8") as f:
        gj = json.load(f)

    district_polys: dict[int, list[MplPath]] = {}
    for feat in gj["features"]:
        did = int(feat["properties"]["districtId"])
        geom = feat["geometry"]
        polys: list[MplPath] = []
        if geom["type"] == "Polygon":
            polys.append(MplPath(geom["coordinates"][0]))
        elif geom["type"] == "MultiPolygon":
            for poly in geom["coordinates"]:
                polys.append(MplPath(poly[0]))
        district_polys[did] = polys

    return district_polys


def find_raw_file(pattern: str) -> Path:
    # Finds a raw data file matching a regex pattern.
    regex = re.compile(pattern, re.IGNORECASE)
    for p in RAW_DATA_DIR.iterdir():
        if p.is_file() and regex.search(p.name):
            return p
    raise FileNotFoundError(f"Could not find raw file matching pattern: '{pattern}' in {RAW_DATA_DIR}")


def rescale_band(values: list[float], low: float = 45.0, high: float = 95.0, invert: bool = False) -> list[float]:
    # Maps values to a calibrated urban index band [low, high].
    norm = min_max_normalize_0_100(values, invert=invert)
    return [round(low + (x / 100.0) * (high - low), 1) for x in norm]


def generate_accessibility_profiles() -> None:
    print("[INFO] Starting Step 03: ETL for Municipal Accessibility Profiles...")

    # 1. Load baseline district aggregates
    agg_path = PROCESSED_DATA_DIR / "districts_aggregated.json"
    if not agg_path.exists():
        raise FileNotFoundError(f"Missing {agg_path}. Run 01_etl_demographics_and_infrastructure.py first.")

    with open(agg_path, "r", encoding="utf-8") as f:
        agg_data = json.load(f)["districts"]

    base_districts = {d["districtId"]: d for d in agg_data}

    # 2. Ingest PRM Parking Spots (Niebieskie Koperty)
    prm_file = find_raw_file(r"Miejsca postojowe dla osob z niepelnosprawnosciami")
    print(f"[INFO] Ingesting PRM parking stalls from {prm_file.name}...")
    prm_spots = {d: 0 for d in range(1, 19)}
    prm_locations = {d: 0 for d in range(1, 19)}

    with open(prm_file, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            did = int(row["Nr_Dzielnicy"])
            count = int(row.get("Liczba_Miejsc_PRM", 1))
            prm_spots[did] += count
            prm_locations[did] += 1

    total_prm_spots = sum(prm_spots.values())
    print(f"[INFO] Parsed {total_prm_spots} designated PRM parking stalls across {sum(prm_locations.values())} locations.")

    # 3. Ingest Public Facilities Accessibility Audits
    fac_file = find_raw_file(r"Dostepnosc architektoniczna obiektow publicznych")
    print(f"[INFO] Ingesting public facility accessibility audits from {fac_file.name}...")
    facilities_by_district: dict[int, list[dict]] = {d: [] for d in range(1, 19)}

    with open(fac_file, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            did = int(row["Nr_Dzielnicy"])
            fac_item = {
                "name": row.get("Nazwa_Obiektu", "").strip(),
                "departments": row.get("Wydzialy_Referaty", "").strip(),
                "address": row.get("Adres", "").strip(),
                "wheelchairAccessible": row.get("Dostepnosc_Wozki", "").strip().upper(),
                "hasRamp": row.get("Rampa_Podjazd", "").strip().upper() == "TAK",
                "hasElevatorOrPlatform": row.get("Winda_Platforma", "").strip().upper() == "TAK",
                "accessibleToilet": row.get("Toaleta_Dostosowana_PRM", "").strip().upper() == "TAK",
                "hearingLoop": row.get("Petla_Indukcyjna", "").strip().upper() == "TAK",
                "signLanguageTranslator": row.get("Tlumacz_Jezyka_Migowego_PJM", "").strip().upper() == "TAK",
                "brailleOrTactile": row.get("Oznaczenia_Braille_Dotykowe", "").strip().upper() == "TAK",
                "auditDescription": row.get("Opis_Audytu_Dostepnosci", "").strip(),
            }
            facilities_by_district[did].append(fac_item)

    total_facilities = sum(len(v) for v in facilities_by_district.values())
    print(f"[INFO] Parsed {total_facilities} public facility accessibility audits.")

    # 4. Ingest KMK Transit Stops (Kassel-kerb curbs & tactile paving strips)
    geojson_path = CONTRACTS_OUTPUT_DIR / "krakow_districts.geojson"
    if not geojson_path.exists():
        raise FileNotFoundError(f"Missing {geojson_path}. Required official district boundaries.")

    district_polys = load_district_polygons(geojson_path)
    stops_file = find_raw_file(r"Przystanki_Komunikacji_Miejskiej")
    print(f"[INFO] Ingesting transit stops infrastructure from {stops_file.name}...")

    transit_stats = {d: {"total": 0, "kassel": 0, "tactile": 0} for d in range(1, 19)}
    with open(stops_file, "r", encoding="utf-8-sig", errors="ignore") as f:
        reader = csv.DictReader(f)
        col_names = reader.fieldnames or []
        kraw_col = next((c for c in col_names if "kraw" in c.lower()), None)
        pasy_col = next((c for c in col_names if "pasy" in c.lower()), None)

        for row in reader:
            if row.get("x") and row.get("y"):
                try:
                    lat, lng = epsg3857_to_wgs84(float(row["x"]), float(row["y"]))
                    pt = (lng, lat)
                    for did, polys in district_polys.items():
                        if any(p.contains_point(pt) for p in polys):
                            transit_stats[did]["total"] += 1
                            kraw = (row.get(kraw_col) or "").lower() if kraw_col else ""
                            if "kassel" in kraw:
                                transit_stats[did]["kassel"] += 1
                            pasy = (row.get(pasy_col) or "").lower() if pasy_col else ""
                            if "tak" in pasy:
                                transit_stats[did]["tactile"] += 1
                            break
                except (ValueError, TypeError):
                    continue

    print(f"[INFO] Ingested {sum(s['total'] for s in transit_stats.values())} transit stops with Kassel-kerb and tactile checks.")

    # 5. Ingest Senior Activity Centres (CAS)
    cas_file = find_raw_file(r"Centra Aktywnosci Seniora")
    print(f"[INFO] Ingesting Senior Activity Centres (CAS) from {cas_file.name}...")
    cas_counts = {d: 0 for d in range(1, 19)}
    with open(cas_file, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            did_str = row.get("Nr_Dzielnicy", "").strip()
            if did_str.isdigit():
                did = int(did_str)
                if 1 <= did <= 18:
                    cas_counts[did] += 1

    print(f"[INFO] Parsed {sum(cas_counts.values())} Centra Aktywności Seniora.")

    # 6. Aggregate indicators across all 18 districts
    district_profiles = []
    raw_mobility_scores = []
    raw_visual_scores = []
    raw_hearing_scores = []
    raw_senior_scores = []
    raw_stroller_scores = []

    for d_meta in KRAKOW_DISTRICTS:
        did = d_meta["districtId"]
        base = base_districts[did]
        pop = base["demographics"]["totalPopulation"]
        area = d_meta["areaKm2"]
        seniors = base["demographics"]["age65Plus"]
        parks = base["greeneryAndSport"]["cityParksCount"] + base["greeneryAndSport"]["pocketParksCount"]

        # PRM parking metrics
        spots = prm_spots[did]
        locs = prm_locations[did]
        spots_per_10k = round(spots / (pop / 10000.0), 1) if pop > 0 else 0.0
        spots_per_km2 = round(spots / area, 1)

        # Transit metrics
        t_stat = transit_stats[did]
        total_stops = t_stat["total"]
        kassel_count = t_stat["kassel"]
        kassel_pct = round((kassel_count / max(1, total_stops)) * 100.0, 1)
        tactile_count = t_stat["tactile"]
        tactile_pct = round((tactile_count / max(1, total_stops)) * 100.0, 1)

        # Public facilities metrics
        facs = facilities_by_district[did]
        audited_count = len(facs)
        wheelchair_full = sum(1 for f in facs if "PE" in f["wheelchairAccessible"] and "NA" in f["wheelchairAccessible"])
        wheelchair_part = sum(1 for f in facs if "CZ" in f["wheelchairAccessible"])
        elevators = sum(1 for f in facs if f["hasElevatorOrPlatform"])
        ramps = sum(1 for f in facs if f["hasRamp"])
        toilets = sum(1 for f in facs if f["accessibleToilet"])
        loops = sum(1 for f in facs if f["hearingLoop"])
        pjm = sum(1 for f in facs if f["signLanguageTranslator"])
        braille = sum(1 for f in facs if f["brailleOrTactile"])

        # CAS senior centers
        cas = cas_counts[did]
        cas_per_10k_seniors = round(cas / (seniors / 10000.0), 1) if seniors > 0 else 0.0

        # Subscore raw inputs:
        # A) Mobility (Wózek / Ruch):
        # Emphasizes step-free public transport boarding (kassel-kerb curbs), barrier-free municipal facilities,
        # and designated PRM parking.
        # Historic cobblestone pavement ("kocie łby") in District I poses a major physical barrier to wheelchair rolling.
        prm_dampened_10k = min(35.0, spots_per_10k)
        prm_dampened_km2 = min(25.0, spots_per_km2)
        prm_density_factor = math.log1p(prm_dampened_10k) * 14.0 + math.log1p(prm_dampened_km2) * 8.0
        fac_mobility_factor = (wheelchair_full * 20.0 + wheelchair_part * 10.0 + elevators * 10.0 + ramps * 10.0)
        fac_mobility_effective = min(60.0, fac_mobility_factor) if audited_count > 0 else 25.0

        raw_mob = (kassel_pct * 0.45) + (prm_density_factor * 0.25) + (fac_mobility_effective * 0.30)
        if did == 1:
            # Historic cobblestone street pavement penalty for manual & electric wheelchair users
            raw_mob -= 18.0
        raw_mobility_scores.append(raw_mob)

        # B) Visual: tactile guidance strips on stops + braille/tactile signage + walking isochrone safety
        isochrone = base["mobilityAndTransport"]["isochroneCoveragePct"]
        fac_braille_factor = min(50.0, braille * 20.0) if audited_count > 0 else 15.0
        raw_vis = (tactile_pct * 0.55) + (fac_braille_factor * 0.25) + (isochrone * 0.20)
        raw_visual_scores.append(raw_vis)

        # C) Hearing: hearing loop availability + Polish Sign Language (PJM) support
        # City hall central offices (Dzielnica I, II, XIII, XVIII) provide comprehensive certified PJM & loop service
        fac_hearing_factor = (loops * 25.0 + pjm * 20.0)
        fac_hearing_effective = min(90.0, 30.0 + fac_hearing_factor) if audited_count > 0 else 40.0
        raw_hearing_scores.append(fac_hearing_effective)

        # D) Senior: CAS per capita + low floor boarding (kassel) + PRM parking + park access
        park_density = math.log1p(parks / area) * 20.0
        raw_sen = (cas_per_10k_seniors * 18.0) + (kassel_pct * 0.35) + (math.log1p(prm_dampened_10k) * 10.0) + (park_density * 0.25)
        raw_senior_scores.append(raw_sen)

        # E) Family Stroller: step-free transit (kassel) + parks/greenery + elevators/ramps in public venues
        greenery_score = base["greeneryAndSport"]["cityParksCount"] * 8.0 + base["greeneryAndSport"]["pocketParksCount"] * 10.0
        raw_stroller = (kassel_pct * 0.42) + (min(50.0, greenery_score) * 0.38) + (fac_mobility_effective * 0.20)
        if did == 1:
            # Historic cobblestone jarring baby strollers
            raw_stroller -= 10.0
        raw_stroller_scores.append(raw_stroller)

        district_profiles.append({
            "districtId": did,
            "districtRoman": d_meta["districtRoman"],
            "districtName": d_meta["districtName"],
            "areaKm2": area,
            "totalPopulation": pop,
            "seniors65Plus": seniors,
            "metrics": {
                "prmParking": {
                    "totalSpots": spots,
                    "locationsCount": locs,
                    "spotsPer10kPop": spots_per_10k,
                    "spotsPerKm2": spots_per_km2,
                },
                "transit": {
                    "totalStops": total_stops,
                    "kasselKerbStops": kassel_count,
                    "kasselKerbPct": kassel_pct,
                    "tactilePavingStops": tactile_count,
                    "tactilePavingPct": tactile_pct,
                },
                "publicFacilities": {
                    "auditedTotal": audited_count,
                    "wheelchairFull": wheelchair_full,
                    "wheelchairPartial": wheelchair_part,
                    "elevators": elevators,
                    "ramps": ramps,
                    "accessibleToilets": toilets,
                    "hearingLoops": loops,
                    "signLanguagePJM": pjm,
                    "brailleTactile": braille,
                },
                "seniorCare": {
                    "casCount": cas,
                    "casPer10kSeniors": cas_per_10k_seniors,
                },
                "recreation": {
                    "cityParks": base["greeneryAndSport"]["cityParksCount"],
                    "pocketParks": base["greeneryAndSport"]["pocketParksCount"],
                },
            },
            "facilities": facs,
        })

    # Rescale raw scores to practical urban calibrated bands (scale 48.0 - 96.0)
    norm_mobility = rescale_band(raw_mobility_scores, low=52.0, high=95.0)
    norm_visual = rescale_band(raw_visual_scores, low=48.0, high=94.0)
    norm_hearing = rescale_band(raw_hearing_scores, low=50.0, high=96.0)
    norm_senior = rescale_band(raw_senior_scores, low=52.0, high=95.0)
    norm_stroller = rescale_band(raw_stroller_scores, low=50.0, high=95.0)

    # Attach computed scores and baseline strengths
    for idx, d in enumerate(district_profiles):
        mob = norm_mobility[idx]
        vis = norm_visual[idx]
        hea = norm_hearing[idx]
        sen = norm_senior[idx]
        strl = norm_stroller[idx]

        # Overall composite accessibility score
        overall = round((mob * 0.28 + vis * 0.22 + hea * 0.16 + sen * 0.18 + strl * 0.16), 1)

        d["scores"] = {
            "overallScore": overall,
            "mobilityScore": mob,
            "visualScore": vis,
            "hearingScore": hea,
            "seniorScore": sen,
            "familyStrollerScore": strl,
        }

        # Baseline strengths generation
        strengths = []
        m = d["metrics"]
        if m["transit"]["kasselKerbPct"] >= 20.0:
            strengths.append(f"Wygodne perony bez stopni ({m['transit']['kasselKerbPct']}% przystanków) ułatwiające wsiadanie z poziomu chodnika")
        if m["transit"]["tactilePavingPct"] >= 40.0:
            strengths.append(f"Wysokie bezpieczeństwo osób niewidomych – pasy i płyty dotykowe na {m['transit']['tactilePavingPct']}% przystanków")
        if m["prmParking"]["spotsPer10kPop"] >= 20.0 or m["prmParking"]["totalSpots"] >= 100:
            strengths.append(f"Wysoka dostępność miejsc postojowych PRM ({m['prmParking']['totalSpots']} niebieskich kopert w {m['prmParking']['locationsCount']} lokalizacjach)")
        if m["publicFacilities"]["hearingLoops"] >= 1 or m["publicFacilities"]["signLanguagePJM"] >= 1:
            strengths.append("Wsparcie dla osób niesłyszących (pętle indukcyjne oraz certyfikowana obsługa tłumacza PJM w magistracie)")
        if m["seniorCare"]["casCount"] >= 3 or m["seniorCare"]["casPer10kSeniors"] >= 3.0:
            strengths.append(f"Rozbudowana sieć wsparcia seniorów ({m['seniorCare']['casCount']} aktywne Centra Aktywności Seniora)")
        if m["recreation"]["cityParks"] + m["recreation"]["pocketParks"] >= 4:
            strengths.append("Liczne parki i ogrody kieszonkowe z alejkami bez barier architektonicznych")

        if not strengths:
            strengths.append("Podstawowe udogodnienia miejskie i stale modernizowana infrastruktura przystankowa KMK")

        d["keyStrengths"] = strengths[:3]

    # City-wide aggregates
    city_averages = {
        "totalPrmParkingSpots": total_prm_spots,
        "totalPrmLocations": sum(prm_locations.values()),
        "totalAuditedFacilities": total_facilities,
        "totalSeniorCenters": sum(cas_counts.values()),
        "avgKasselKerbPct": round(float(np.mean([d["metrics"]["transit"]["kasselKerbPct"] for d in district_profiles])), 1),
        "avgTactilePavingPct": round(float(np.mean([d["metrics"]["transit"]["tactilePavingPct"] for d in district_profiles])), 1),
        "avgOverallScore": round(float(np.mean([d["scores"]["overallScore"] for d in district_profiles])), 1),
    }

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "meta": {
            "title": "Profile Dostępności Architektonicznej i Społecznej Dzielnic Krakowa",
            "description": "Zintegrowane wskaźniki dostępności dla osób z niepełnosprawnościami, seniorów i rodzin z dziećmi oparte w 100% na danych ZDMK, UMK, ZTP i BDK.",
            "sources": [
                {
                    "id": "trans-5",
                    "name": "Miejsca postojowe dla osób z niepełnosprawnościami w Krakowie (ZDMK – Niebieskie Koperty)",
                    "url": "https://www.bip.krakow.pl/zalaczniki/dokumenty/n/598657/karta",
                },
                {
                    "id": "cult-4",
                    "name": "Dostępność architektoniczna obiektów publicznych w Krakowie (UMK / MFiPR)",
                    "url": "https://www.bip.krakow.pl/?dok_id=139318",
                },
                {
                    "id": "trans-1",
                    "name": "Komunikacja Miejska w Krakowie (KMK) – Przystanki, perony bez stopni i pasy dotykowe",
                    "url": "https://otwartedane.um.krakow.pl",
                },
                {
                    "id": "cult-1",
                    "name": "Centra Aktywności Seniora (CAS) w Krakowie",
                    "url": "https://dlaseniora.krakow.pl",
                },
            ],
            "profilesSupported": ["mobility", "visual", "hearing", "senior", "familyStroller"],
        },
        "cityAverages": city_averages,
        "districts": district_profiles,
    }

    # Save to intermediate processed data
    out_proc = PROCESSED_DATA_DIR / "districts_accessibility.json"
    with open(out_proc, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"[SUCCESS] Saved intermediate accessibility data to: {out_proc}")

    # Save to master contracts output directory
    out_contract = CONTRACTS_OUTPUT_DIR / "krakow_accessibility_profiles.json"
    with open(out_contract, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"[SUCCESS] Saved accessibility contract to: {out_contract}")


if __name__ == "__main__":
    generate_accessibility_profiles()
