import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({
    description: 'Banner Images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  @IsArray()
  bannerImgs?: any[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
  })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
