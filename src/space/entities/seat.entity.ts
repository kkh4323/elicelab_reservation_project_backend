import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { Space } from '@space/entities/space.entity';

@Entity()
export class Seat extends BaseEntity {
  @Column()
  public number: number;

  @ManyToOne(() => Space, (space) => space.seats)
  public space: Space;
}
