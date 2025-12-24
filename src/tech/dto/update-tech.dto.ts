import { IsOptional, IsString } from 'class-validator';

export class UpdateTechDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  image?: string;
}