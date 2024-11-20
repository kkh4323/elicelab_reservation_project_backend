import { Module } from '@nestjs/common';
import { QuestionController } from '@question/question.controller';
import { QuestionService } from '@question/question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@question/entities/question.entity';
import { MinioClientModule } from '@minio-client/minio-client.module';
import { EmailModule } from '@email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    MinioClientModule,
    EmailModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
