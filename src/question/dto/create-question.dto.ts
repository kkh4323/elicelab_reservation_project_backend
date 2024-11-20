import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Location } from '@space/entities/location.enum';
import { Zone } from '@space/entities/zone.enum';

export class CreateQuestionDto {
  @ApiProperty({ example: 'kkh4323@naver.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '강호' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '엘리스' })
  @IsNotEmpty()
  @IsString()
  group: string;

  @ApiProperty({ example: '홈 커밍데이' })
  @IsNotEmpty()
  @IsString()
  eventName: string;

  @ApiProperty({
    type: Date,
  })
  eventDate: Date;

  @ApiProperty({ example: 30 })
  @IsNotEmpty()
  @IsNumber()
  participants: number;

  @ApiProperty({
    type: 'enum',
    description: 'location',
    default: Location.SEOUL,
    enum: Location,
  })
  location: Location;

  @ApiProperty({
    type: 'enum',
    description: 'zone',
    default: Zone.MEETING,
    enum: Zone,
  })
  zone: Zone[];

  @ApiProperty({ example: 'test' })
  document: string;

  @ApiProperty({ example: false })
  personalInfo: boolean;
}
