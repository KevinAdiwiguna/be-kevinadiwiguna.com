import { IsOptional, IsString, IsBoolean, IsUrl } from 'class-validator';

export class UpdateHeroDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  githubLink?: string;

  @IsOptional()
  @IsUrl()
  cvLink?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
