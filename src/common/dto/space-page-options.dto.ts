import { ApiPropertyOptional } from '@nestjs/swagger';
import { Order } from '@root/common/constants/order.constant';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Zone } from '@space/entities/zone.enum';
import { Location } from '@space/entities/location.enum';

export class SpacePageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take?: number = 10;

  @ApiPropertyOptional({ default: '' })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly name?: string = '';

  @ApiPropertyOptional({ default: '' })
  @Type(() => String)
  @IsEnum(Zone)
  @IsOptional()
  readonly zone?: Zone = Zone.MEETING;

  @ApiPropertyOptional({ default: '' })
  @Type(() => String)
  @IsEnum(Location)
  @IsOptional()
  readonly location?: Location = Location.SEOUL;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
