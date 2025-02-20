import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { Zone } from '@space/entities/zone.enum';
import { Location } from '@space/entities/location.enum';

@Entity()
export class Space extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column({
    type: 'enum',
    enum: Location,
    default: [Location.SEOUL],
  })
  public location: Location[];

  @Column({
    type: 'enum',
    enum: Zone,
    default: [Zone.MEETING],
  })
  public zone: Zone[];

  @Column({ nullable: true })
  public maxPeople?: number;

  @Column('text', { array: true, nullable: true })
  public spaceImgs?: string[];
}
