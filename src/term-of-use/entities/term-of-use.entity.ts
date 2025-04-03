import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import { User } from '@user/entities/user.entity';
import { IsBoolean } from 'class-validator';

@Entity()
export class TermOfUse extends BaseEntity {
  @OneToOne(() => User, (user: User) => user.termOfUse)
  public user?: User;

  @IsBoolean()
  @Column({ default: false })
  public termOfUseElice: boolean;

  @IsBoolean()
  @Column({ default: false })
  public overTwenty: boolean;

  @IsBoolean()
  @Column({ default: false })
  public personalInfo: boolean;

  @IsBoolean()
  @Column({ default: false })
  public marketingAgree: boolean;

  @IsBoolean()
  @Column({ default: false })
  public etc: boolean;
}
