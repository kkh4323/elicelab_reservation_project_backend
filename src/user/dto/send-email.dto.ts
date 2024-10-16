import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    example: 'kkh4323@naver.com',
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 사항입니다.' })
  email: string;
}
