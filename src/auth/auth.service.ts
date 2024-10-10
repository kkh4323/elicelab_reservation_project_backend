import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { User } from '@user/entities/user.entity';
import { LoginUserDto } from '@user/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // 회원가입 로직
  async signinUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  // 로그인 로직
  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const user: User = await this.userService.getUserByEmail(
      loginUserDto.email,
    );
    const isPasswordMatched: boolean = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new HttpException(
        'password do not matched',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
