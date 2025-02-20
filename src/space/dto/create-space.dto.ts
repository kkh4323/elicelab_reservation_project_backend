import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Location } from '@space/entities/location.enum';
import { Zone } from '@space/entities/zone.enum';

export class CreateSpaceDto {
  @ApiProperty({
    example: '미팅룸 A',
  })
  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력사항입니다.' })
  name: string;

  @ApiProperty({
    example: '엘리스랩 서울센터의 미팅룸 A입니다.',
  })
  @IsString()
  @IsNotEmpty({ message: '설명은 필수 입력사항입니다.' })
  description: string;

  @ApiProperty({
    example: [Location.SEOUL],
    enum: Location,
    isArray: true,
  })
  @IsArray({ message: '위치는 배열이어야 합니다.' })
  @IsEnum(Location, { each: true, message: '유효한 위치를 선택하세요.' })
  @IsNotEmpty({ message: '위치는 필수 입력사항입니다.' })
  location: Location[];

  @ApiProperty({
    example: [Zone.MEETING],
    enum: Zone,
    isArray: true,
  })
  @IsArray({ message: '구역은 배열이어야 합니다.' })
  @IsEnum(Zone, { each: true, message: '유효한 구역을 선택하세요.' })
  @IsNotEmpty({ message: '구역은 필수 입력사항입니다.' })
  zone: Zone[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '최대 인원 수는 숫자여야 합니다.' })
  maxPeople?: number;

  @ApiProperty({
    description: 'Space Images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  @IsArray({ message: '이미지는 배열이어야 합니다.' })
  spaceImgs?: any[];
}
