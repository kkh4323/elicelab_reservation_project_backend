import { Module } from '@nestjs/common';
import { SpaceController } from '@space/space.controller';
import { SpaceService } from '@space/space.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from '@space/entities/space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Space])],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
