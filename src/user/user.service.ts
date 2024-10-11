import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // [관리자] 전체 유저 가져오는 로직
  async getUserDatas(): Promise<User[]> {
    const users: User[] = await this.userRepository.find();
    return users;
  }

  // 유저 생성하는 로직
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  // 이메일로 검색하는 로직
  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ email });
    if (user) return user;
    throw new HttpException('user is not exists', HttpStatus.NOT_FOUND);
  }

  // 아이디로 검색하는 로직
  async getUserById(id: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (user) return user;
    throw new HttpException('user is not exists', HttpStatus.NOT_FOUND);
  }

  // RefreshToken 매칭 하는 로직
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);
    const getUserIdFromRedis: string = await this.cacheManager.get(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      getUserIdFromRedis,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }
}
