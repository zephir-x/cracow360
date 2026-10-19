export interface SystemHelloDto {
  message: string;
  projectName: string;
  competition: string;
  environment: string;
  databaseProvider: string;
  databaseConnected: boolean;
  seededDistrictsCount: number;
  seededPoisCount: number;
  serverTimeUtc: string;
}

export interface DistrictScoresDto {
  mobilityScore: number;
  educationScore: number;
  greeneryScore: number;
  cultureAndSeniorScore: number;
  environmentScore: number;
}

export interface DistrictSummaryDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  areaKm2: number;
  scores: DistrictScoresDto;
  totalPopulation: number;
  weightedQualityOfLifeIndex: number;
}

export interface QualityWeights {
  mobility: number;
  education: number;
  greenery: number;
  culture: number;
  environment: number;
}

export interface ResidentPreset {
  id: string;
  label: string;
  description: string;
  weights: QualityWeights;
}
