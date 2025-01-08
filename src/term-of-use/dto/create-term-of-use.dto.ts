import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateTermOfUseDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  termOfUse: boolean = true;

  @ApiProperty({ example: true })
  @IsBoolean()
  overTwenty: boolean = true;

  @ApiProperty({ example: true })
  @IsBoolean()
  personalInfo: boolean = true;

  @ApiProperty({ example: true })
  @IsBoolean()
  marketingAgree: boolean = true;

  @ApiProperty({ example: true })
  @IsBoolean()
  etc: boolean = true;
}
