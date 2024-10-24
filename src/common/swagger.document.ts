import { DocumentBuilder } from '@nestjs/swagger';

export class BaseApiDocument {
  public builder: DocumentBuilder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('엘리스랩 예약 시스템 api')
      .setDescription('엘리스랩 예약 시스템에서 사용하는 api 문서입니다.')
      .addBearerAuth()
      .setVersion('1.0')
      .addTag('elicelab')
      .build();
  }
}
