import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from '@question/dto/create-question.dto';
import { IsBoolean } from 'class-validator';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @ApiProperty({ example: true })
  @IsBoolean({ message: 'confirm 필드는 boolean 값이어야 합니다.' })
  confirm: boolean;
}
