import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Provider } from '@user/entities/provider.enum';
import { Role } from '@user/entities/role.enum';
import { CreateTermOfUseDto } from '@term-of-use/dto/create-term-of-use.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'kkh4323@naver.com', uniqueItems: true })
  @IsEmail({}, { message: '잘못된 이메일 주소입니다.' })
  @IsNotEmpty({ message: '이메일은 필수 입력사항입니다.' })
  email: string;

  @ApiProperty({ example: 'asdf123!', minLength: 8 })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/)
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'kangho' })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력사항입니다.' })
  username: string;

  @ApiProperty({ example: '01086134323' })
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsString()
  profileImg?: string;

  @IsOptional()
  @IsEnum(Provider, { message: '유효한 provider 값을 입력해주세요.' })
  provider?: Provider;

  @IsOptional()
  @IsEnum(Role, { message: '유효한 role 값을 입력해주세요.' })
  role?: Role;

  @ValidateNested()
  @Type(() => CreateTermOfUseDto)
  @ApiProperty({ type: CreateTermOfUseDto })
  termOfUse?: CreateTermOfUseDto;
}
