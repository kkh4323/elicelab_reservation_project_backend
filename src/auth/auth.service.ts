import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { User } from '@user/entities/user.entity';
import { LoginUserDto } from '@user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from '@auth/interfaces/TokenPayloadInterface';
import { Provider } from '@user/entities/provider.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  // accessToken 생성
  public generateAccessToken(userId: string): string {
    const payload: TokenPayloadInterface = { userId };
    const accessToken: string = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECURITY'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return accessToken;
  }
}
