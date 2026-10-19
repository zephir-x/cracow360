"""
================================================================================
SCRIPT 01: 01_etl_demographics_and_infrastructure.py
================================================================================
GOAL / PURPOSE:
    Extract, clean, geocode, and aggregate raw municipal datasets from the City
    of Krakow Open Data Portal (otwartedane.um.krakow.pl) and MSIP (msip.krakow.pl)
    into standardized intermediate tables for all 18 Krakow districts.

EXPECTED INPUTS (place raw files in `src/analytics/data_raw/`):
    1. Demographics (CSV / XLSX):
       - Permanent residents by district and age group (Mieszkańcy zameldowani na pobyt stały)
       - Temporary residents by district and age group (Mieszkańcy zameldowani na pobyt czasowy)
       - Foreigners registered in Krakow by district (Cudzoziemcy zameldowani na pobyt stały i czasowy)
       - Historical demographic statistics (births, deaths, migration balance, 3-year population change)
    2. Education & Early Care (CSV / XLSX):
       - Municipal nurseries (Żłobki samorządowe) - address + capacity (places)
       - Contracted nurseries (Żłobki prowadzone na zlecenie GMK) - address + capacity
       - Private nurseries (Żłobki prywatne) & Kids' clubs (Kluby dziecięce) - address + capacity
       - Parent Clubs for children under 3 (Kluby Rodziców z dziećmi do lat 3)
       - Kindergartens (Przedszkola) - number of facilities and places
       - Primary schools (Szkoły podstawowe) - number of schools, students, and classes (oddziały)
    3. Mobility & Transport (CSV / XLSX / GeoJSON):
       - KMK public transit stops (Przystanki KMK) & walking isochrone coverage %
       - Park & Ride (P+R) parking locations
       - Bike racks (Stojaki rowerowe) & bike lanes length in km (Infrastruktura rowerowa)
    4. Greenery & Sport (CSV / XLSX / GeoJSON):
       - City parks (Parki miejskie) & Pocket parks (Parki kieszonkowe) - area in hectares (ha) + location
       - School sports facilities (Infrastruktura sportowa szkół: fields, gyms, swimming pools)
    5. Culture & Society (CSV / XLSX):
       - Krakow Library branches (Filie Biblioteki Kraków)
       - Municipal Cultural Centers (Miejskie ośrodki i centra kultury - events count, municipal subsidies)
       - Senior Activity Centers (Centra Aktywności Seniora - CAS)
    6. Spatial Boundaries (GeoJSON):
       - Administrative boundaries of the 18 Krakow districts (`krakow_districts.geojson` from MSIP).

WHAT MUST BE CALCULATED / DONE IN THIS SCRIPT:
    A. District-Level Aggregation (for each of the 18 districts, `districtId` 1..18):
       1. `demographics`:
          - `permanentResidents`: sum of permanent residents in the district
          - `temporaryResidents`: sum of temporary residents in the district
          - `totalPopulation` = `permanentResidents` + `temporaryResidents`
          - `foreignersTotal`: total registered foreigners in the district
          - Age buckets: `age0to3`, `age4to6`, `age7to14`, `age15to64`, `age65Plus`
          - `populationGrowthRate3YrPct`: percentage population change over the last 3 years
            Formula: ((Pop_Current - Pop_3YearsAgo) / Pop_3YearsAgo) * 100
       2. `educationAndCare`:
          - Counts of facilities: `nurseriesPublicCount`, `nurseriesContractedCount`,
            `nurseriesPrivateCount`, `kidsClubsCount`, `parentClubsCount`,
            `kindergartensCount`, `primarySchoolsCount`
          - `totalCarePlaces0to3`: sum of capacity across all nurseries (public + contracted + private) and kids' clubs
          - `childrenPerCarePlaceRatio`:
            Formula: round(age0to3 / max(totalCarePlaces0to3, 1), 2)
          - `kindergartenPlacesTotal`: total places in kindergartens
          - `primarySchoolStudentsTotal`: total students in primary schools
          - `avgStudentsPerClass`:
            Formula: round(primarySchoolStudentsTotal / max(totalPrimarySchoolClasses, 1), 1)
       3. `mobilityAndTransport`:
          - `kmkStopsCount`: number of KMK tram/bus stops located within the district polygon
          - `isochroneCoveragePct`: % of district area within walking isochrone (300m/500m) of a KMK stop
          - `parkAndRideCount`: number of P+R facilities in the district
          - `bikeRacksCount`: number of municipal bike racks in the district
          - `bikeLanesLengthKm`: total length of cycle paths in the district (km)
       4. `greeneryAndSport`:
          - `cityParksCount`, `pocketParksCount`
          - `totalParksAreaHa`: sum of city parks and pocket parks area in hectares (1 ha = 10,000 m2)
          - `greenAreaM2PerCapita`:
            Formula: round((totalParksAreaHa * 10000.0) / max(totalPopulation, 1), 1)
          - `schoolSportsFacilitiesCount`, `schoolSwimmingPoolsCount`
       5. `cultureAndSociety`:
          - `libraryBranchesCount`, `culturalCentersCount`, `seniorActivityCentersCount`
          - `annualCulturalEventsCount`: total annual events organized by municipal cultural institutions
          - `municipalSubsidyPerCapitaPln`:
            Formula: round(totalCulturalAndSocialSubsidyPln / max(totalPopulation, 1), 2)

    B. Point-of-Interest (POI) Extraction & Geocoding:
       - For every individual facility (nurseries, parks, libraries, CAS, P+R, etc.),
         obtain its GPS coordinates (`lat`, `lng`) via MSIP geometry or `geopy` (Nominatim)
         and assign it to its `districtId` (1..18) using `geopandas.sjoin` (point-in-polygon).
       - Export the POI list to `data/contracts/krakow_poi_locations.json`.

EXPECTED OUTPUTS:
    - Intermediate cleaned dataframe/JSON in `src/analytics/data_processed/districts_aggregated.json`
    - Final POI contract file in `data/contracts/krakow_poi_locations.json`
================================================================================
"""

from config import RAW_DATA_DIR, PROCESSED_DATA_DIR, KRAKOW_DISTRICTS


def run_etl() -> None:
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[Step 01 - ETL] Raw data directory: {RAW_DATA_DIR}")
    print(f"[Step 01 - ETL] Configured Krakow districts count: {len(KRAKOW_DISTRICTS)}")
    print("[Step 01 - ETL] Place downloaded CSV/XLSX files in 'data_raw/' and implement aggregation logic here.")


if __name__ == "__main__":
    run_etl()
