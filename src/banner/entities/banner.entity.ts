import { BaseEntity } from '@root/common/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Banner extends BaseEntity {
  @Column('text', { array: true, nullable: true })
  public bannerImgs: string[];

  @Column({ nullable: true })
  public description?: string;

  @Column('text', { array: true, nullable: true })
  public tags?: string[];
}
