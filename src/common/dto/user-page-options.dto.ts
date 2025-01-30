import { ApiPropertyOptional } from '@nestjs/swagger';
import { Order } from '@root/common/constants/order.constant';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Role } from '@user/entities/role.enum';

export class UserPageOptionsDto {
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
  readonly username?: string = '';

  @ApiPropertyOptional({ default: '' })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly email?: string = '';

  @ApiPropertyOptional({ default: '' })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly phone?: string = '';

  @ApiPropertyOptional({
    enum: Role,
    isArray: true,
    default: [],
  })
  @IsArray()
  @Type(() => String)
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  readonly roles?: Role[] = [];

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
