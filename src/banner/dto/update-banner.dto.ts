import { PartialType } from '@nestjs/swagger';
import { CreateBannerDto } from '@banner/dto/create-banner.dto';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
