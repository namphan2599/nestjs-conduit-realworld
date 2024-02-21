import {
  Controller,
  Get,
  Req,
  Body,
  Post,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dto/user-create';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { SkipAuth } from 'src/shared/decorators/SkipAuth.decorator';
import UpdateUserDto from './dto/user-update';

class TestDTO {
  username: string;
  userpass: string;
}

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserInfo(@User('name') userName) {
    return this.userService.findOne(userName);
  }

  @SkipAuth()
  @Post()
  async register(@Body() bd: CreateUserDto) {
    console.log('create user', bd);
    return this.userService.create(bd);
  }

  @Put()
  async update(@User('id') userId, @Body() db: UpdateUserDto) {
    return this.userService.update(userId, db);
  }

  @Post('/test')
  async test(@Body() bd: TestDTO) {
    const rs = await this.userService.test(bd.username, bd.userpass);

    console.log(rs);

    return { yes: 'yes' };
  }
}
