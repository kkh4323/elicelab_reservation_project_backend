import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from '@reservation/reservation.service';
import { CreateReservationDto } from '@reservation/dto/create-reservation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guardies/jwt-auth.guard';
import { RequestWithUserInterface } from '@auth/interfaces/requestWithUser.interface';
import { ReservationPageOptionsDto } from '@root/common/dto/reservation-page-options.dto';
import { Reservation } from '@reservation/entities/reservation.entity';
import { SpaceService } from '@space/space.service';

@Controller('reservation')
@ApiTags('reservation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly spaceService: SpaceService,
  ) {}

  @Post('/create/:spaceId')
  async createReservation(
    @Req() req: RequestWithUserInterface,
    @Param('spaceId') spaceId: string,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const space = await this.spaceService.getSpaceById(spaceId);
    return await this.reservationService.createReservation(
      req.user,
      space,
      createReservationDto,
    );
  }

  // 전체 공간 예약 정보 가져오는 api
  @Get()
  async getReservations(@Query() pageOptionsDto: ReservationPageOptionsDto) {
    return await this.reservationService.getReservations(pageOptionsDto);
  }

  // 공간 예약 상세 정보 가져오는 api
  @Get('/:id')
  async getReservationById(@Param('id') id: string): Promise<Reservation> {
    return await this.reservationService.getReservationById(id);
  }

  // 공간 예약 변경하는 api
  @Put('/:id')
  async updateReservationById(
    @Param('id') id: string,
    @Body() updateReservationDto: CreateReservationDto,
  ): Promise<string> {
    return await this.reservationService.updateReservationById(
      id,
      updateReservationDto,
    );
  }

  // 공간 예약 삭제하는 api
  @Delete('/:id')
  async deleteReservationById(@Param('id') id: string): Promise<string> {
    return await this.reservationService.deleteReservationById(id);
  }
}
