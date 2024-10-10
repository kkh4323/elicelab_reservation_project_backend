import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { User } from '@user/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '@auth/guardies/local-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입
  @Post('/signup')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signinUser(createUserDto);
  }

  // 로그인
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async loginUser(
    @Req() req: RequestWithUserInterface,
  ): Promise<{ user: User; accessToken: string }> {
    const user: User = await req.user;
    const accessToken: string = await this.authService.generateAccessToken(
      user.id,
    );
    return { user, accessToken };
  }

  // 로그인한 유저 프로필 정보 가져오기
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getUserInfoByToken(
    @Req() req: RequestWithUserInterface,
  ): Promise<User> {
    return req.user;
  }
}
