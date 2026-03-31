import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(1, 10)
    name?: string;

    @IsOptional()
    @IsString()
    @Length(10, 20)
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    note?: string;
}