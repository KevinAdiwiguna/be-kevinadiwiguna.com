// src/projects/dto/update-project.dto.ts
import { IsBoolean } from 'class-validator';

export class UpdateProjectStatusDto {
  @IsBoolean()
  published: boolean;
}
