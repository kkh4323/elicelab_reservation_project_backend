import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { User } from '@user/entities/user.entity';
import { Space } from '@space/entities/space.entity';

@Entity()
@Unique(['user', 'space', 'reservationDate'])
export class Reservation extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Space, { eager: true, cascade: true, nullable: false })
  @JoinColumn({ name: 'spaceId' })
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
