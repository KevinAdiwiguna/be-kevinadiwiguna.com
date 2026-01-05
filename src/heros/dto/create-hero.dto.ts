import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateHeroDto {
    @IsString()
    title: string;

    @IsString()
    imageUrl: string;
    
    @IsString()
    description: string;

    @IsUrl()
    githubLink: string;

    @IsUrl()
    cvLink: string;

    @IsString()
    phoneNumber: string;

    @IsOptional()
    @IsBoolean()
    isPrimary?: boolean;

}
