import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({
    description: 'Banner Images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  @IsArray()
  bannerImgs?: any[];
}
