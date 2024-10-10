import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { UserModule } from '@user/user.module';
import { LocalAuthStrategy } from '@auth/strategies/local-auth.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthStrategy } from '@auth/strategies/jwt-auth.strategy';
import { GoogleAuthStrategy } from '@auth/strategies/google-auth.strategy';
import { NaverAuthStrategy } from '@auth/strategies/naver-auth.strategy';

@Module({
  imports: [UserModule, JwtModule.register({}), ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthStrategy,
    JwtAuthStrategy,
    GoogleAuthStrategy,
    NaverAuthStrategy,
  ],
})
export class AuthModule {}
