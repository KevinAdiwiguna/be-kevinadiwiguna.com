// src/features/blogs/dto/update-blog-status.dto.ts
import { IsBoolean } from "class-validator";

export class UpdateBlogStatusDto {
  @IsBoolean()
  published: boolean;
}
