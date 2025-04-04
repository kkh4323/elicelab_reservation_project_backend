import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { Zone } from '@space/entities/zone.enum';
import { Location } from '@space/entities/location.enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Seat } from '@space/entities/seat.entity';

@Entity()
export class Space extends BaseEntity {
  @IsString()
  @Column()
  public name: string;

  @IsString()
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

  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  public maxPeople?: number;

  @IsOptional()
  @Column('text', { array: true, nullable: true })
  public spaceImgs?: string[];

  @OneToMany(() => Seat, (seat) => seat.space, {
    nullable: true,
    cascade: true,
  })
  public seats?: Seat[];
}
