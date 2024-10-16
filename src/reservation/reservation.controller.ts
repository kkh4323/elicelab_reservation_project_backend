import { Controller } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from '@reservation/dto/create-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
}
