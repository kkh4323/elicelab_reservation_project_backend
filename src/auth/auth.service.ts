import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { User } from '@user/entities/user.entity';
import { LoginUserDto } from '@user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from '@auth/interfaces/TokenPayloadInterface';
import { Provider } from '@user/entities/provider.enum';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common/cache';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원가입 로직
  async signinUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser({
      ...createUserDto,
      provider: Provider.LOCAL,
    });
  }

  // 로그인 로직
  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const user: User = await this.userService.getUserByEmail(
      loginUserDto.email,
    );
    if (!user) {
      throw new HttpException('User is not exists', HttpStatus.NOT_FOUND);
    }
    const isPasswordMatched: boolean = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException(
        'password do not matched',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  // accessToken 생성하는 함수
  public generateAccessToken(userId: string): {
    accessToken: string;
    accessCookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECURITY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    const accessCookie = `Authentication=${accessToken}; Path=/; Max-Age=${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return { accessToken, accessCookie };
  }

  // refreshToken 생성하는 함수
  public generateRefreshToken(userId: string): {
    refreshToken: string;
    refreshCookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECURITY'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    const refreshCookie = `Refresh=${refreshToken}; Path=/; Max-Age=${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return { refreshToken, refreshCookie };
  }

  // RefreshToken 암호화하여 Redis에 저장
  async setCurrentRefreshTokenToRedis(refreshToken: string, userId: string) {
    const saltValue = await bcrypt.genSalt(10);
    const currentHashedRefreshToken = await bcrypt.hash(
      refreshToken,
      saltValue,
    );
    await this.cacheManager.set(userId, currentHashedRefreshToken);
  }
}
