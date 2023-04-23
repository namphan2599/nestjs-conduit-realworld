import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from './user.entity';
import CreateUserDto from './dto/user-create';

@Injectable()
export class        UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {}
    

    create(user: CreateUserDto) {

    }

    findOne(username: string): Promise<UserEntity | null> {
        return this.userRepository.findOneBy({ username });
    }

    test(username: string, userpass: string): Promise<UserEntity | null>  {
        const newUser = new UserEntity();
        newUser.username = username;
        newUser.password = userpass;

        return this.userRepository.save(newUser);
    }
}
