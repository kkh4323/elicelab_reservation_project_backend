import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { User } from '@user/entities/user.entity';

@Entity()
export class Notice extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.notices)
  public user: User;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  public tags: string[];
}
