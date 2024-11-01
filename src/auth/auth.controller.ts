import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { LoginUserDto } from '@user/dto/login-user.dto';
import { User } from '@user/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '@auth/guardies/local-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { GoogleAuthGuard } from '@auth/guardies/google-auth.guard';
import { NaverAuthGuard } from '@auth/guardies/naver-auth.guard';
import { Response } from 'express';
import { RefreshTokenGuard } from '@auth/guardies/refresh-token.guard';
import { VerifyEmailDto } from '@user/dto/verify-email.dto';
import { SendEmailDto } from '@user/dto/send-email.dto';
import { KakaoAuthGuard } from '@auth/guardies/kakao-auth.guard';

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
  async loginUser(@Req() req: RequestWithUserInterface, @Res() res: Response) {
    const user: User = await req.user;
    const { accessToken, accessCookie } =
      await this.authService.generateAccessToken(user.id);
    const { refreshToken, refreshCookie } =
      await this.authService.generateRefreshToken(user.id);
    await this.authService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    res.send({ user });
  }

  // refreshToken 생성
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refresh(@Req() req: RequestWithUserInterface) {
    const { accessToken, accessCookie } =
      await this.authService.generateAccessToken(req.user.id);
    req.res.setHeader('Set-Cookie', accessCookie);
    return { user: req.user, accessToken };
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

  // [관리자] 이메일 전송
  @Post('/email/send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<void> {
    return await this.authService.sendEmail(sendEmailDto);
  }

  // 인증코드 비교
  @Post('/email/verify')
  async verifyEmailWithCode(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<boolean> {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  // 구글 로그인
  @HttpCode(200)
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  // 구글 로그인 콜백
  @HttpCode(200)
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(
    @Req() req: RequestWithUserInterface,
    @Res() res: Response,
  ) {
    const user = req.user;

    const { accessToken, accessCookie } =
      await this.authService.generateAccessToken(user.id);
    const { refreshToken, refreshCookie } =
      await this.authService.generateRefreshToken(user.id);
    await this.authService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    res.send({ user });
  }

  // 네이버 로그인
  @HttpCode(200)
  @Get('/naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return HttpStatus.OK;
  }

  // 네이버 로그인 콜백
  @HttpCode(200)
  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(
    @Req() req: RequestWithUserInterface,
    @Res() res: Response,
  ) {
    const user = req.user;

    const { accessToken, accessCookie } =
      await this.authService.generateAccessToken(user.id);
    const { refreshToken, refreshCookie } =
      await this.authService.generateRefreshToken(user.id);
    await this.authService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    res.send({ user });
  }

  // 카카오 로그인
  @HttpCode(200)
  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  // 카카오 로그인 콜백
  @HttpCode(200)
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallback(
    @Req() req: RequestWithUserInterface,
    @Res() res: Response,
  ) {
    const user = req.user;

    const { accessToken, accessCookie } =
      await this.authService.generateAccessToken(user.id);
    const { refreshToken, refreshCookie } =
      await this.authService.generateRefreshToken(user.id);
    await this.authService.setCurrentRefreshTokenToRedis(refreshToken, user.id);

    res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
    res.send({ user });
  }
}
