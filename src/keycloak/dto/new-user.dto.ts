import { IsString } from "class-validator";

export class newUserDto {
    @IsString()
    username: string;
    @IsString()
    firstName: string
    @IsString()
    lastName: string;
    @IsString()
    password: string;
}