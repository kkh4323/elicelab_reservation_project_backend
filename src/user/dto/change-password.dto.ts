import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, Matches} from "class-validator";

export class ChangePasswordDto {
    @ApiProperty()
    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/)
    @IsNotEmpty()
    newPassword: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}