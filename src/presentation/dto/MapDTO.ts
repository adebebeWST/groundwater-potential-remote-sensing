import { IsString, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FeatureInfoQueryDTO {
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon!: number;
}

export class CandidateAreasQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsIn([1, 2, 3])
  priority?: number;

  @IsOptional()
  @IsString()
  woreda?: string;
}

export class WoredaSearchQueryDTO {
  @IsString()
  q!: string;
}

export class BboxQueryDTO {
  @IsOptional()
  @IsString()
  bbox?: string; // "minLng,minLat,maxLng,maxLat"
}

export class LayersQueryDTO {
  @IsOptional()
  @IsString()
  @IsIn(['ssp126', 'ssp245', 'ssp370', 'ssp585'])
  scenario?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsIn([2030, 2050, 2080])
  year?: number;
}

export class GEEComputeScenarioDTO {
  @IsString()
  @IsIn(['ssp126', 'ssp245', 'ssp370', 'ssp585'])
  scenario!: string;

  @IsNumber()
  @IsIn([2030, 2050, 2080])
  year!: number;

  @IsOptional()
  @IsString()
  bbox?: string;
}

export class GenerateReportDTO {
  @IsOptional()
  mapState?: {
    center?: [number, number];
    zoom?: number;
    layers?: string[];
  };

  @IsOptional()
  candidateSelections?: number[];

  @IsOptional()
  @IsString()
  scenario?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  userEmail?: string;
}
