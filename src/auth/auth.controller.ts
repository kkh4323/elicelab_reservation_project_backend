import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { User } from '@user/entities/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '@auth/guardies/local-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';

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
  async loginUser(@Req() req: RequestWithUserInterface): Promise<User> {
    return await this.authService.loginUser(req.user);
  }
}
