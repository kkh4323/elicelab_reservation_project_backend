import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '@auth/guardies/role.guard';
import { Role } from '@user/entities/role.enum';
import { User } from '@user/entities/user.entity';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { BufferedFile } from '@minio-client/file.model';
import { UserPageOptionsDto } from '@root/common/dto/user-page-options.dto';
import { PageDto } from '@root/common/dto/page.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // [관리자] 전체 유저 정보 가져오는 api
  @Get()
  @UseGuards(RoleGuard(Role.ADMIN))
  async getUserList(
    @Query() userPageOptionsDto: UserPageOptionsDto,
  ): Promise<PageDto<User>> {
    console.log('userPageOptionsDto: ', userPageOptionsDto);
    return await this.userService.getUserDatas(userPageOptionsDto);
  }

  @Get('/all')
  @UseGuards(RoleGuard(Role.ADMIN))
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getUserList();
  }

  // [관리자] 상세 유저 정보 가져오는 api
  @Get('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  async getUserById(@Param('id') id: string): Promise<User> {
    // return await this.userService.getUserById(id);
    return await this.userService.getUserBy('id', id);
  }

  // 유저 정보 수정하는 api
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @ApiBody({
    description: 'A single image file with additional member data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
        username: {
          type: 'string',
          description: 'username',
        },
        phone: {
          type: 'string',
          description: 'phone',
        },
      },
    },
  })
  async updateUserById(
    @Req() req: RequestWithUserInterface,
    @UploadedFile() image?: BufferedFile,
    @Body() updateUserDto?: CreateUserDto,
  ) {
    return await this.userService.updateUserById(
      req.user,
      image,
      updateUserDto,
    );
  }

  @Put('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiOperation({
    summary: 'update user by admin',
    description: 'admin user management(update)',
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @ApiBody({
    description: 'A single image file with additional member data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Profile image file',
        },
        username: {
          type: 'string',
          description: 'username',
        },
        phone: {
          type: 'string',
          description: 'phone',
        },
      },
    },
  })
  async updateUserByIdAdmin(
    @Param('id') id: string,
    @UploadedFile() image?: BufferedFile,
    @Body() updateUserDto?: CreateUserDto,
  ) {
    console.log(image);
    console.log(updateUserDto);
    try {
      const existedUser = await this.userService.getUserBy('id', id);
      return await this.userService.updateUserById(
        existedUser,
        image,
        updateUserDto,
      );
    } catch (err) {
      console.log('error: ', err);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'user delete by user',
    description: 'user delete',
  })
  async deleteUserById(@Req() req: RequestWithUserInterface): Promise<string> {
    const userId: string = req.user.id;
    return await this.userService.deleteUserById(userId);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard(Role.ADMIN))
  @ApiOperation({
    summary: 'user delete by admin',
    description: 'admin user management(delete)',
  })
  async deleteUserByIdAdmin(@Param('id') id: string): Promise<string> {
    return await this.userService.deleteUserById(id);
  }
}
