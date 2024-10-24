import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { User } from '@user/entities/user.entity';
import { Notice } from '@notice/entities/notice.entity';

@Entity()
export class Comment extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.comments)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column()
  public description: string;

  @ManyToOne(() => Notice, (notice: Notice) => notice.comments)
  @JoinColumn({ name: 'noticeId' })
  public notice: Notice;
}
