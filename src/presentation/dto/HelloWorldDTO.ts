import { IsNotEmpty, IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class HelloWorldRequestBodyDTO {
  @IsNumber()
  @Min(1)
  tenantId!: number;

  @IsNumber()
  @Min(1)
  projectId!: number;
}

export class HelloWorldRequestDTO {
  @IsNumber()
  @Min(1)
  userId!: number;

  @IsNumber()
  @Min(1)
  tenantId!: number;

  @IsNumber()
  @Min(1)
  projectId!: number;
}

export class HelloWorldResponseDTO {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsNumber()
  userId!: number;

  @IsNumber()
  tenantId!: number;

  @IsNumber()
  projectId!: number;
}
