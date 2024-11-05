import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@auth/guardies/role.guard';
import { Role } from '@user/entities/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateBannerDto } from '@banner/dto/create-banner.dto';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { BufferedFile } from '@minio-client/file.model';
import { Banner } from '@banner/entities/banner.entity';

@Controller('banner')
@ApiTags('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('/create')
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseInterceptors(FilesInterceptor('bannerImgs'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBannerDto })
  async createBanner(
    @Req() req: RequestWithUserInterface,
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFiles() bannerImgs: BufferedFile[],
  ): Promise<Banner> {
    return await this.bannerService.createBanner(createBannerDto, bannerImgs);
  }

  @Get()
  async getBanners(): Promise<Banner[]> {
    return await this.bannerService.getBanners();
  }

  @Get('/:id')
  async getBannerById(@Param('id') id: string) {
    return await this.bannerService.getBannerById(id);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async deleteBannerById(@Param('id') id: string): Promise<string> {
    return await this.bannerService.deleteBannerById(id);
  }
}
