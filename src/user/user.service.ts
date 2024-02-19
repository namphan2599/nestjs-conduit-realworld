import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import CreateUserDto from './dto/user-create';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    const existedUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (existedUser) {
      throw new BadRequestException('The name is in use');
    }

    let saltRound = 10;

    let newUser = new User();
    newUser.username = user.username;
    newUser.password = await bcrypt.hash(user.password, saltRound);
    newUser.articles = [];
    newUser.favorites = [];

    await this.userRepository.save(newUser);

    return {
      status: 'ok',
    };
  }

  findOne(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  test(username: string, userpass: string): Promise<User | null> {
    const newUser = new User();
    newUser.username = username;
    newUser.password = userpass;

    return this.userRepository.save(newUser);
  }
}
