import { PartialType } from '@nestjs/swagger';
import { CreateTermOfUseDto } from '@term-of-use/dto/create-term-of-use.dto';

export class UpdateTermOfUseDto extends PartialType(CreateTermOfUseDto) {}
