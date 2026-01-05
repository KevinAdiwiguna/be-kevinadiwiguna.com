import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsBoolean()
  published: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techs?: string[];
}
