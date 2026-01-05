import { IsString, IsOptional, IsUrl, IsDateString } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  companyName: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  url: string;

  @IsString()
  image: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
