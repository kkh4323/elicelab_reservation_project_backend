import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { User } from '@user/entities/user.entity';
import { Space } from '@space/entities/space.entity';

@Entity()
@Unique(['user', 'space', 'reservationDate'])
export class Reservation extends BaseEntity {
  public user: User;

  public space: Space;

  @Column()
  public reservationDate: Date;

  @Column('integer', {
    array: true,
    nullable: true,
  })
  public seatNumber?: number[];

  @Column()
  public startTime: string;

  @Column()
  public endTime: string;
}
