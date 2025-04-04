import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class SeatDto {
  @ApiProperty({ example: 1, description: '좌석 번호' })
  @IsNumber({ message: '좌석 번호는 숫자여야 합니다.' })
  seatNumber: number;

  @ApiProperty({ example: true, description: '대화 가능 여부' })
  @IsOptional()
  isAvailable: boolean;
}
