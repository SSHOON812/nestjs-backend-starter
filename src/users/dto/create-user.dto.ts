import { IsEmail, IsString, Length, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 30)
    password: string;

    @IsString()
    @Length(1, 10)
    name: string;

    @IsOptional()
    @IsString()
    @Length(10, 20)
    phoneNumber?: string;
}