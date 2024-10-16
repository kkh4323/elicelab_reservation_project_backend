import { User } from '@user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Space } from '@space/entities/space.entity';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    type: () => User,
  })
  @IsNotEmpty({ message: '사용자는 필수 항목입니다.' })
  @IsObject()
  user: User;

  @ApiProperty({
    type: () => Space,
  })
  @IsNotEmpty({ message: '공간은 필수 항목입니다.' })
  @IsObject()
  space: Space;

  @ApiProperty({
    example: '2024-10-16',
  })
  @IsNotEmpty({ message: '예약 날짜는 필수 항목입니다.' })
  @IsDateString({}, { message: '유효한 날짜 형식이어야 합니다.' })
  reservationDate: Date;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray({ message: '좌석 번호는 배열 형식이어야 합니다.' })
  @IsInt({ each: true, message: '각 좌석 번호는 정수여야 합니다.' })
  seatNumber: number[];

  @ApiProperty({
    example: '09:00',
  })
  @IsNotEmpty({ message: '시작 시간은 필수 항목입니다.' })
  @IsString({ message: '시작 시간은 문자열이어야 합니다.' })
  startTime: string;

  @ApiProperty({
    example: '12:00',
  })
  @IsNotEmpty({ message: '종료 시간은 필수 항목입니다.' })
  @IsString({ message: '종료 시간은 문자열이어야 합니다.' })
  endTime: string;
}
