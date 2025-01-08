import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { User } from '@user/entities/user.entity';

@Entity()
export class TermOfUse extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.termOfUse)
  public user?: User;

  @Column({ default: false })
  public termOfUseElice: boolean;

  @Column({ default: false })
  public overTwenty: boolean;

  @Column({ default: false })
  public personalInfo: boolean;

  @Column({ default: false })
  public marketingAgree: boolean;

  @Column({ default: false })
  public etc: boolean;
}
