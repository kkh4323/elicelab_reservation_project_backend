import { Module } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserController } from '@user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@root/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
