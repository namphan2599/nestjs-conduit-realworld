import { Controller, Get, Req, Body, Post } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

class TestDTO {
    username: string;
    userpass: string;
}

@Controller('user')
export class UserController {
    
    constructor(private userService: UserService) {}

    @Post('/test')
    async test(@Body() bd: TestDTO) {
        
        const rs = await this.userService.test(bd.username, bd.userpass);
        
        console.log(rs);

        return { yes: 'yes'};
    }
}
