import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailUserDto {
  @ApiProperty({ example: 'kkh4323@naver.com' })
  @IsEmail()
  email: string;
}
