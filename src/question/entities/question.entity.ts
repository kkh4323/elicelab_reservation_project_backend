import { Column, Entity } from 'typeorm';
import { Zone } from '@space/entities/zone.enum';
import { Location } from '@space/entities/location.enum';
import { BaseEntity } from '@root/common/base.entity';

@Entity()
export class Question extends BaseEntity {
  @Column()
  public email: string;

  @Column()
  public name: string;

  @Column()
  public group: string;

  @Column()
  public eventName: string;

  @Column()
  public eventDate: Date;

  @Column()
  public participantCount: number;

  @Column({
    type: 'enum',
    enum: Location,
    default: Location.SEOUL,
  })
  public location: Location;

  @Column({
    type: 'enum',
    enum: Zone,
    array: true,
    default: [Zone.MEETING],
  })
  public zone: Zone[];

  @Column()
  public document: string;

  @Column()
  public personalInfo: boolean;

  @Column({ default: false })
  public confirm: boolean;
}
