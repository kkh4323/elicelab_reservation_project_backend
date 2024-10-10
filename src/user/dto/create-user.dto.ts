import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Provider } from '@user/entities/provider.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'kkh4323@naver.com', uniqueItems: true })
  @IsEmail({}, { message: '잘못된 이메일 주소입니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력사항입니다.' })
  email: string;

  @ApiProperty({ example: 'asdf123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'kangho' })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력사항입니다.' })
  username: string;

  @ApiProperty({ example: '01086134323' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://www.gravat.com/avatar/abc123' })
  @IsOptional()
  @IsString()
  profileImg?: string;

  @ApiProperty({
    enum: Provider,
    example: Provider.LOCAL,
  })
  @IsOptional()
  provider?: Provider;
}
