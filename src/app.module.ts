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
import { MinioClientModule } from '@minio-client/minio-client.module';
import { ReservationModule } from '@reservation/reservation.module';
import { NoticeModule } from '@notice/notice.module';
import { CommentModule } from '@comment/comment.module';
import { BannerModule } from '@banner/banner.module';
import { QuestionModule } from '@question/question.module';
import { TermOfUseModule } from './term-of-use/term-of-use.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    RedisModule,
    SpaceModule,
    EmailModule,
    MinioClientModule,
    ReservationModule,
    NoticeModule,
    CommentModule,
    BannerModule,
    QuestionModule,
    TermOfUseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
