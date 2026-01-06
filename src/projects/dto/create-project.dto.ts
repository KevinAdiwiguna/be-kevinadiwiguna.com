import { IsBoolean, IsOptional, IsString, IsUrl, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @IsString()
  thumbnail: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  techs?: string[];
}
