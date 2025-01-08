import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindEmailDto {
  @ApiProperty({ example: '김강호' })
  @IsString()
  username: string;

  @ApiProperty({ example: '01086134323' })
  @IsString()
  phone: string;
}
