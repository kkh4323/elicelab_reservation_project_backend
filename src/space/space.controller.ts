import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SpaceService } from '@space/space.service';
import { CreateSpaceDto } from '@space/dto/create-space.dto';
import { RoleGuard } from '@auth/guardies/role.guard';
import { Role } from '@user/entities/role.enum';
import { Space } from '@space/entities/space.entity';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { BufferedFile } from '@minio-client/file.model';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from '@minio-client/minio-client.service';
import { SpacePageOptionsDto } from '@root/common/dto/space-page-options.dto';

@Controller('space')
@ApiTags('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly minioClientService: MinioClientService,
  ) {}

  @Post('/create')
  @UseGuards(RoleGuard(Role.ADMIN))
  @UseInterceptors(FilesInterceptor('spaceImgs')) // Allow up to 5 files
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSpaceDto })
  async createSpace(
    @Req() req: RequestWithUserInterface,
    @Body() createSpaceDto?: CreateSpaceDto,
    @UploadedFiles() spaceImgs?: BufferedFile[],
  ): Promise<Space> {
    return await this.spaceService.createSpace(createSpaceDto, spaceImgs);
  }

  @Get()
  async getSpaces(@Query() spacePageOptionsDto: SpacePageOptionsDto) {
    return await this.spaceService.getSpaces(spacePageOptionsDto);
  }

  @Get('/:id')
  async getSpaceById(@Param('id') id: string): Promise<Space> {
    return await this.spaceService.getSpaceById(id);
  }

  @Put('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async updateSpaceById(
    @Param('id') id: string,
    @Body() updateSpaceDto: CreateSpaceDto,
  ): Promise<string> {
    return await this.spaceService.updateSpaceById(id, updateSpaceDto);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async deleteSpaceById(@Param('id') id: string): Promise<string> {
    return await this.spaceService.deleteSpaceById(id);
  }
}
