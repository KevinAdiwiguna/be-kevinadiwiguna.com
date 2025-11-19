import { IsOptional } from "class-validator";

export class EmptyDto {
  @IsOptional()
  any?: string;
  @IsOptional()
  any2?: number
}