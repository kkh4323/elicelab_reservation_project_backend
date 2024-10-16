import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 사항입니다.' })
  email: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsString({ message: '인증 코드는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '인증 코드는 필수 입력 사항입니다.' })
  @Length(6, 6, { message: '인증 코드는 6자리여야 합니다.' })
  code: string;
}
