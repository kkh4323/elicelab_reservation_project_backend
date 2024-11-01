import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { User } from '@user/entities/user.entity';
import { Comment } from '@comment/entities/comment.entity';
import { Category } from '@notice/entities/category.enum';

@Entity()
export class Notice extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.notices, {
    onDelete: 'CASCADE',
  })
  public user: User;

  @Column({ type: 'enum', enum: Category, default: Category.NOTICE })
  public category: Category;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column('text', {
    array: true,
    nullable: true,
  })
  public tags: string[];

  @OneToMany(() => Comment, (comment: Comment) => comment.notice)
  public comments?: string[];
}
