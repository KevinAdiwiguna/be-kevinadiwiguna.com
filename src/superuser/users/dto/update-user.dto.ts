import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsEmail,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isDisabled?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  roleId?: number;
}
