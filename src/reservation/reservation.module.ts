import { Module } from '@nestjs/common';
import { ReservationController } from '@reservation/reservation.controller';
import { ReservationService } from '@reservation/reservation.service';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
