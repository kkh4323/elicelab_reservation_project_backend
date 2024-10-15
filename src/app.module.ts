import { Module } from '@nestjs/common';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { AppConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { RedisModule } from '@redis/redis.module';
import { SpaceModule } from '@space/space.module';
import { EmailModule } from '@email/email.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    RedisModule,
    SpaceModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
