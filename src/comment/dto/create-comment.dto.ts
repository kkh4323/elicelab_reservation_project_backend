import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Notice } from '@notice/entities/notice.entity';

export class CreateCommentDto {
  @ApiProperty({ example: '좋습니다.' })
  @IsNotEmpty({ message: '댓글 내용은 필수 항목입니다.' })
  @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
  description: string;

  @ApiProperty({ example: '398aa8cb-d927-4446-b6c0-1b4213800357' })
  notice: Notice;
}
