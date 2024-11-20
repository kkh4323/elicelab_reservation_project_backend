import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@root/app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { BaseApiDocument } from '@root/common/swagger.document';
import { HttpExceptionFilter } from '@root/common/filters/http-exception.filter';
import { TransformInterceptor } from '@root/common/interceptors/transform.interceptor';

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
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  // swagger 설정
  const config: Omit<OpenAPIObject, 'paths'> =
    new BaseApiDocument().initializeOptions();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port: number = configService.get('SERVER_PORT') || 9000;
  await app.listen(port);
}
bootstrap();
