import { NestFactory } from '@nestjs/core';
import { AppModule } from '@root/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  // api 접근 시 /api/가 들어가도록 함
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // origin의 value값만 접근 가능
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ skipMissingProperties: true, transform: true }),
  );

  // swagger 설정
  const config = new DocumentBuilder()
    .setTitle('엘리스랩 예약 시스템 api')
    .setDescription('엘리스랩 예약 시스템에서 사용하는 api 문서입니다.')
    .setVersion('1.0')
    .addTag('elicelab')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port: number = configService.get('SERVER_PORT') || 9000;
  await app.listen(port);
}
bootstrap();
