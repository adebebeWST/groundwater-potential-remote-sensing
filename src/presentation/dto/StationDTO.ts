import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min, Max, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStationRequestDTO {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  code!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @IsOptional()
  @IsNumber()
  @Min(-500)
  @Max(9000)
  altitude?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsNumber()
  @Min(1)
  tenantId!: number;
}

export class UpdateStationRequestDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  code?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-500)
  @Max(9000)
  altitude?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StationResponseDTO {
  id!: number;
  name!: string;
  code!: string;
  latitude!: number;
  longitude!: number;
  altitude?: number;
  description?: string;
  isActive!: boolean;
  tenantId!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class StationListResponseDTO {
  stations!: StationResponseDTO[];
  total!: number;
}

export class StationsNearLocationRequestDTO {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @IsNumber()
  @Min(0.001)
  @Max(10)
  radius!: number; // in degrees

  @IsNumber()
  @Min(1)
  tenantId!: number;
}
