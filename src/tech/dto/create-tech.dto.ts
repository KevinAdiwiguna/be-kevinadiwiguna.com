import { IsOptional, IsString } from 'class-validator';

export class CreateTechDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
