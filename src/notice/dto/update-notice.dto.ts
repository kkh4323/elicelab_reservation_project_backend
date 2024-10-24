import { PartialType } from '@nestjs/swagger';
import { CreateNoticeDto } from '@notice/dto/create-notice.dto';
export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {}
