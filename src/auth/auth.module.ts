import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { UserModule } from '@user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
