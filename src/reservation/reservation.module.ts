import { Module } from '@nestjs/common';
import { ReservationController } from '@reservation/reservation.controller';
import { ReservationService } from '@reservation/reservation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@reservation/entities/reservation.entity';
import { SpaceModule } from '@space/space.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    SpaceModule,
    HttpModule,
    ConfigModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
