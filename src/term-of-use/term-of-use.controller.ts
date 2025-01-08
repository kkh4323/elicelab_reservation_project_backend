import { Controller, Post, Body, UseGuards, Req, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TermOfUseService } from '@term-of-use/term-of-use.service';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { CreateTermOfUseDto } from '@term-of-use/dto/create-term-of-use.dto';
import { TermOfUse } from '@term-of-use/entities/term-of-use.entity';
import { UpdateResult } from 'typeorm';

@Controller('term-of-use')
@ApiTags('term-of-use')
export class TermOfUseController {
  constructor(private readonly termOfUseService: TermOfUseService) {}

  // 이용약관 등록
  @Post()
  @UseGuards(JwtAuthGuard)
  async addTermOfUse(
    @Req() req: RequestWithUserInterface,
    @Body() createTermOfUseDto: CreateTermOfUseDto,
  ): Promise<TermOfUse> {
    return await this.termOfUseService.createTermOfUse(
      req.user,
      createTermOfUseDto,
    );
  }

  // 이용약관 동의사항 변경
  @Put()
  @UseGuards(JwtAuthGuard)
  async updateTermOfUse(
    @Req() req: RequestWithUserInterface,
    @Body() updateTermOfUseDto: CreateTermOfUseDto,
  ): Promise<UpdateResult> {
    return await this.termOfUseService.updateTermOfUse(
      req.user,
      updateTermOfUseDto,
    );
  }
}
