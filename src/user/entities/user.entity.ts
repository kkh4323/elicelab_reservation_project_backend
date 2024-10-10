import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from '@root/common/base.entity';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  public email: string;

  @Column()
  @Exclude() // 값 return할 때 password 숨겨줌
  public password: string;

  @Column()
  public username: string;

  @Column()
  public phone: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @BeforeInsert()
  async beforeSaveFunction() {
    // password 암호화
    const saltValue = await bcrypt.getSalt('10');
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
