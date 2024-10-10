import { Controller } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
