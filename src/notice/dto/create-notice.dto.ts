import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ example: '공지사항' })
  @IsNotEmpty({ message: '제목은 필수항목입니다.' })
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  title: string;

  @ApiProperty({ example: '공지사항입니다.' })
  @IsNotEmpty({ message: '내용은 필수항목입니다.' })
  @IsString({ message: '내용은 문자열이어야 합니다.' })
  description: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    example: ['공지사항', '원데이'],
  })
  @IsArray({ message: '태그는 배열 형식이어야 합니다.' })
  tags: string[];
}
