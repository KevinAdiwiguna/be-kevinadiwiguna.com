import { IsString, IsOptional, IsUrl, IsInt, IsDateString } from 'class-validator';
export class CreateExperienceDto {
    @IsString()
    companyName: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUrl()
    url?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsInt()
    durationMonths?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}
