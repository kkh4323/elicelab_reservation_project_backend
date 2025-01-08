import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UserService} from '@user/user.service';
import {CreateUserDto} from '@user/dto/create-user.dto';
import {User} from '@user/entities/user.entity';
import {LoginUserDto} from '@user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {TokenPayloadInterface} from '@auth/interfaces/TokenPayloadInterface';
import {Provider} from '@user/entities/provider.enum';
import {Cache} from 'cache-manager';
import {CACHE_MANAGER} from '@nestjs/common/cache';
import {EmailService} from '@email/email.service';
import {VerifyEmailDto} from '@user/dto/verify-email.dto';
import {SendEmailDto} from '@user/dto/send-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // 회원가입 로직
  async signinUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser: User = await this.userService.createUser({
        ...createUserDto,
        provider: Provider.LOCAL,
      });

      await this.emailService.sendMail({
        to: createUserDto.email,
        subject: '엘리스Lab 회원가입',
        text: `엘리스Lab 회원 가입이 완료되었습니다. ID는 ${createUserDto.email}입니다.`,
      });
      return createdUser;
    } catch (err) {
      if (err?.code === '23505') {
        throw new HttpException(
          `ID ${createUserDto.email} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

  async sendEmail(sendEmailDto: SendEmailDto): Promise<void> {
    const generatedNumber: string = this.generateOTP();

    await this.cacheManager.set(sendEmailDto.email, generatedNumber);
    await this.emailService.sendMail({
      to: sendEmailDto.email,
      subject: '[엘리스Lab] 가입 인증 메일입니다.',
      text: `엘리스랩 가입 인증 메일입니다. 인증번호는 ${generatedNumber}입니다.`,
    });
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<boolean> {
    const emailCodeByRedis = await this.cacheManager.get(verifyEmailDto.email);
    if (emailCodeByRedis !== verifyEmailDto.code) {
      throw new HttpException('Wrong Code Provided.', HttpStatus.BAD_REQUEST);
    }
    await this.cacheManager.del(verifyEmailDto.email);
    return true;
  }

  // 비밀번호 찾는 이메일 보내기
  async findPasswordSendEmail(email: string): Promise<string> {
    const payload = { email };
    const user: User = await this.userService.getUserByEmail(email);

    if (user.provider !== Provider.LOCAL) {
      throw new HttpException(
          'you can change the password for the part you registerd as a social login',
          HttpStatus.BAD_REQUEST,
      );
    }

    const token: string = this.jwtService.sign(payload, {
      secret: this.configService.get('FIND_PASSWORD_TOKEN_SECURITY'),
      expiresIn: this.configService.get('FIND_PASSWORD_TOKEN_EXPIRATION_TIME'),
    });

    const url: string = `${this.configService.get('EMAIL_BASE_URL')}/change/password?token=${token}`;

    await this.emailService.sendMail({
      to: email,
      subject: `[엘리스Lab] ${email} 비밀번호 찾기`,
      text: `비밀번호 찾기 링크: ${url}`,
    });

    return 'sent email and please check your email';
  }

  async changePassword(user: User, newPassword: string) {
    const existedUser = await this.userService.getUserByEmail(user.email)
    if (existedUser.provider !== Provider.LOCAL) {
      throw new HttpException(
          'you have logged in by social ID',
          HttpStatus.NOT_ACCEPTABLE,
      );
    } else {
      return this.userService.saveNewPassword(user, newPassword);
    }
  }

  async changePasswordBeforeLogin(newPassword: string, token: string) {
    const { email } = await this.jwtService.verify(
        token,
        {
          secret: this.configService.get('FIND_PASSWORD_TOKEN_SECURITY'),
        },
    );
    console.log(email);
    const user = await this.userService.getUserByEmail(email);

    return this.changePassword(user, newPassword);
  }

  generateOTP() {
    let OTP: string = '';
    for (let i: number = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
