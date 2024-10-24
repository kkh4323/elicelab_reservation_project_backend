import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { NoticeService } from '@notice/notice.service';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@auth/guardies/role.guard';
import { Role } from '@user/entities/role.enum';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { CreateNoticeDto } from '@notice/dto/create-notice.dto';
import { Notice } from '@notice/entities/notice.entity';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post('/create')
  @UseGuards(RoleGuard(Role.ADMIN))
  async createNotice(
    @Req() req: RequestWithUserInterface,
    @Body() createNoticeDto: CreateNoticeDto,
  ): Promise<Notice> {
    return await this.noticeService.createNotice(req.user, createNoticeDto);
  }

  @Get()
  async getNotices(): Promise<Notice[]> {
    return await this.noticeService.getNotices();
  }

  @Get('/:id')
  async getNoticeById(@Param('id') id: string): Promise<Notice> {
    return await this.noticeService.getNoticeById(id);
  }

  @Put('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async updateNoticeById(
    @Param('id') id: string,
    @Body() updateNoticeDto: CreateNoticeDto,
  ): Promise<string> {
    return await this.noticeService.updateNoticeById(id, updateNoticeDto);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async deleteNoticeById(@Param('id') id: string): Promise<string> {
    return await this.noticeService.deleteNoticeById(id);
  }
}
