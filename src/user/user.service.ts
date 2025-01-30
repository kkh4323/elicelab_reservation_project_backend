import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcryptjs';
import { MinioClientService } from '@minio-client/minio-client.service';
import { BufferedFile } from '@minio-client/file.model';
import { UserPageOptionsDto } from '@root/common/dto/user-page-options.dto';
import { PageDto } from '@root/common/dto/page.dto';
import { PageMetaDto } from '@root/common/dto/page-meta.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly minioClientService: MinioClientService,
  ) {}

  // [관리자] 전체 유저 가져오는 로직
  async getUserDatas(
    userPageOptionsDto: UserPageOptionsDto,
  ): Promise<PageDto<User>> {
    // const users: User[] = await this.userRepository.find();
    // return users;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (userPageOptionsDto.username) {
      queryBuilder.andWhere('user.username = :username', {
        username: userPageOptionsDto.username,
      });
    }
    if (userPageOptionsDto.email) {
      queryBuilder.andWhere('user.email = :email', {
        email: userPageOptionsDto.email,
      });
    }
    if (userPageOptionsDto.phone) {
      queryBuilder.andWhere('user.phone = :phone', {
        phone: userPageOptionsDto.phone,
      });
    }
    // if (userPageOptionsDto.roles) {
    //   queryBuilder.andWhere('user.roles = :roles', {
    //     roles: userPageOptionsDto.roles,
    //   });
    // }
    // if (userPageOptionsDto.roles) {
    //   queryBuilder.andWhere(`array_to_string(user.roles, ',') ILIKE :roles`, {
    //     roles: `[${userPageOptionsDto.roles}]`,
    //   });
    // }
    if (userPageOptionsDto.roles && userPageOptionsDto.roles.length > 0) {
      queryBuilder.andWhere('user.roles && :roles', {
        roles: [userPageOptionsDto.roles], // 반드시 배열로 변환
      });
    }
    queryBuilder
      // .leftJoinAndSelect('user.agreeOfTerm', 'agreeOfTerm')
      .orderBy('user.createdAt', userPageOptionsDto.order)
      .skip(userPageOptionsDto.skip)
      .take(userPageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: userPageOptionsDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  // 유저 생성하는 로직
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  // // 이메일로 검색하는 로직
  // async getUserByEmail(email: string): Promise<User> {
  //   const user: User = await this.userRepository.findOneBy({ email });
  //   if (user) return user;
  //   throw new HttpException('user is not exists', HttpStatus.NOT_FOUND);
  // }
  //
  // // 아이디로 검색하는 로직
  // async getUserById(id: string): Promise<User> {
  //   const user: User = await this.userRepository.findOneBy({ id });
  //   if (user) return user;
  //   throw new HttpException('user is not exists', HttpStatus.NOT_FOUND);
  // }

  async getUserBy(
    key: 'id' | 'email' | 'username',
    value: string,
  ): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ [key]: value });
    if (user) return user;
    throw new HttpException(
      `User with this ${key} does not exists`,
      HttpStatus.NOT_FOUND,
    );
  }

  // 이름, 전화번호로 유저 불러와 이메일 찾는 로직
  async getUserByUsernamePhone(username: string, phone: string): Promise<User> {
    const user: User = await this.getUserBy('username', username);
    if (user.phone === phone) return user;
    throw new HttpException(
      `User with this username and phone does not matched.`,
      HttpStatus.BAD_REQUEST,
    );
  }

  // 패스워드 저장
  async saveNewPassword(user: User, newPassword: string) {
    const existedUser = await this.getUserBy('email', user.email);
    const saltValue = await bcrypt.genSalt(10);
    existedUser.password = await bcrypt.hash(newPassword, saltValue);
    return await this.userRepository.save(existedUser);
  }

  // RefreshToken 매칭 하는 로직
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUserBy('id', userId);
    const getUserIdFromRedis: string = await this.cacheManager.get(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      getUserIdFromRedis,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  // 유저 정보 수정하는 로직
  async updateUserById(
    user: User,
    image?: BufferedFile,
    updateUserDto?: CreateUserDto,
  ) {
    const profileImg = await this.minioClientService.uploadProfileImg(
      user,
      image,
      'profile',
    );
    console.log(profileImg);
    return await this.userRepository.update(user.id, {
      ...updateUserDto,
      profileImg,
    });
  }

  // 아이디로 유저 삭제하는 로직
  async deleteUserById(userId: string): Promise<string> {
    const existedUser: User = await this.getUserBy('id', userId);

    if (existedUser) {
      await this.userRepository.delete({ id: existedUser.id });
      return `${existedUser.id} is deleted successfully`;
    }
    throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
  }
}
