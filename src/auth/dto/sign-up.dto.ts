import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, isNotEmpty } from 'class-validator';

export class SignUpDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(72)
    password: string;

    @IsOptional()
    @MaxLength(50)
    name?: string;
}
