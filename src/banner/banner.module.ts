import { Module } from '@nestjs/common';
import { BannerController } from '@banner/banner.controller';
import { BannerService } from '@banner/banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '@banner/entities/banner.entity';
import { MinioClientModule } from '@minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), MinioClientModule],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
