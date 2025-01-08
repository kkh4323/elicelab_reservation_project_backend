import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TermOfUse } from '@term-of-use/entities/term-of-use.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from '@user/user.service';
import { User } from '@user/entities/user.entity';
import { CreateTermOfUseDto } from '@term-of-use/dto/create-term-of-use.dto';

@Injectable()
export class TermOfUseService {
  constructor(
    @InjectRepository(TermOfUse)
    private termOfUseRepository: Repository<TermOfUse>,
    private readonly userService: UserService,
  ) {}

  // 이용약관 등록하는 로직
  async createTermOfUse(
    user: User,
    createTermOfUseDto: CreateTermOfUseDto,
  ): Promise<TermOfUse> {
    const newTermOfUse: TermOfUse = await this.termOfUseRepository.create({
      ...createTermOfUseDto,
      user,
    });
    await this.termOfUseRepository.save(newTermOfUse);
    return newTermOfUse;
  }

  // 이용약관 수정하는 로직
  async updateTermOfUse(
    user: User,
    updateTermOfUseDto: CreateTermOfUseDto,
  ): Promise<UpdateResult> {
    const existedUser: User = await this.userService.getUserByEmail(user.email);
    return await this.termOfUseRepository.update(
      { id: existedUser.termOfUse.id },
      updateTermOfUseDto,
    );
  }
}
