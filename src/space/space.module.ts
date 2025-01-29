import { Module } from '@nestjs/common';
import { SpaceController } from '@space/space.controller';
import { SpaceService } from '@space/space.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from '@space/entities/space.entity';
import { MinioClientModule } from '@minio-client/minio-client.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Space]), MinioClientModule, ConfigModule],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
