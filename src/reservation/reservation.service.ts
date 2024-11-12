import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from '@reservation/dto/create-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '@reservation/entities/reservation.entity';
import {
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { User } from '@user/entities/user.entity';
import { ReservationPageOptionsDto } from '@root/common/dto/reservation-page-options.dto';
import { PageMetaDto } from '@root/common/dto/page-meta.dto';
import { PageDto } from '@root/common/dto/page.dto';
import { Space } from '@space/entities/space.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // [관리자, 사용자] 예약 등록하는 로직
  async createReservation(
    user: User,
    space: Space,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const newReservation = await this.reservationRepository.create({
      ...createReservationDto,
      user,
      space,
    });
    await this.reservationRepository.save(newReservation);

    // ms calendar 연동
    await this.registerMSCalendar(
      user.username,
      space.name,
      createReservationDto.reservationDate,
      createReservationDto.startTime,
      createReservationDto.endTime,
    );

    return newReservation;
  }

  // [관리자, 사용자] 예약 조회하는 로직
  async getReservations(pageOptionsDto: ReservationPageOptionsDto) {
    const queryBuilder: SelectQueryBuilder<Reservation> =
      this.reservationRepository.createQueryBuilder('reservation');
    queryBuilder
      .orderBy('reservation.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount: number = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto: PageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  // [관리자, 사용자] id로 예약 데이터 하나 불러오는 로직
  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) throw new NotFoundException();
    return reservation;
  }

  // [관리자, 사용자] 예약 데이터 수정하는 로직
  async updateReservationById(
    id: string,
    updateReservationDto: CreateReservationDto,
  ): Promise<string> {
    const reservation: UpdateResult = await this.reservationRepository.update(
      id,
      updateReservationDto,
    );
    if (reservation.affected) return 'updated';
  }

  // [관리자, 사용자] 예약 데이터 삭제하는 로직
  async deleteReservationById(id: string): Promise<string> {
    const result: DeleteResult = await this.reservationRepository.delete({
      id,
    });
    if (result.affected) return `${id} is deleted successfully.`;
  }

  async registerMSCalendar(
    username: string,
    spaceName: string,
    reservationDate: Date,
    startTime: string,
    endTime: string,
  ) {
    const tokenEndPoint = `https://login.microsoftonline.com/${this.configService.get('MS_GRAPH_TENANT_ID')}/oauth2/v2.0/token`;
    const clientId = this.configService.get('MS_GRAPH_CLIENT_ID');
    const clientSecret = this.configService.get('MS_GRAPH_CLIENT_SECRET');

    const { data } = await this.httpService
      .post(
        tokenEndPoint,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://graph.microsoft.com/.default',
        }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      )
      .toPromise();

    const accessToken = data.access_token;
    const url: string = `https://graph.microsoft.com/v1.0/users/${this.configService.get('MS_GRAPH_EMAIL')}/events`;
    const eventData = {
      subject: `${username} - ${spaceName}`,
      start: {
        dateTime: `${reservationDate}T${startTime}:00`,
        timeZone: 'Asia/Seoul',
      },
      end: {
        dateTime: `${reservationDate}T${endTime}:00`,
        timeZone: 'Asia/Seoul',
      },
    };
    console.log('eventData: ', eventData);
    const { status } = await this.httpService
      .post(url, eventData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .toPromise();
    if (status === 200) {
      console.log('success');
    }
  }
}
