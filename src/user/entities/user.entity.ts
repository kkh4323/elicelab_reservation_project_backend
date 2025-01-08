import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { Exclude } from 'class-transformer';
import { Provider } from '@user/entities/provider.enum';
import { Role } from '@user/entities/role.enum';
import { Reservation } from '@reservation/entities/reservation.entity';
import { Notice } from '@notice/entities/notice.entity';
import { Comment } from '@comment/entities/comment.entity';
import { TermOfUse } from '@root/term-of-use/entities/term-of-use.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  @Exclude() // 값 return할 때 password 숨겨줌
  public password?: string;

  @Column()
  public username: string;

  @Column({ nullable: true })
  public phone?: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  provider: Provider;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  @Exclude()
  public roles: Role[];

  @OneToMany(() => Reservation, (reservation: Reservation) => reservation.user)
  public reservations?: string[];

  @OneToMany(() => Notice, (notice: Notice) => notice.user)
  public notices?: string[];

  @OneToMany(() => Comment, (comment: Comment) => comment.notice)
  public comments?: string[];

  @OneToOne(() => TermOfUse, (termOfUse: TermOfUse) => termOfUse.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public termOfUse: TermOfUse;

  @BeforeInsert()
  async beforeSaveFunction() {
    if (this.provider !== Provider.LOCAL) {
      return;
    } else {
      // password 암호화
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
      // 기본 프로필 이미지 자동 생성
      this.profileImg = gravatar.url(this.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
        protocol: 'https',
      });
    }
  }
}
