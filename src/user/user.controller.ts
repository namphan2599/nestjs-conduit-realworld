import { Controller, Get, Req, Body, Post } from '@nestjs/common';
import { Request } from 'express';
import { User } from './user.entity';
import { UserService } from './user.service';
import CreateUserDto from './dto/user-create';

class TestDTO {
    username: string;
    userpass: string;
}

@Controller('user')
export class UserController {
	
	constructor(private userService: UserService) {}

	@Post()
	async register(@Body() bd: CreateUserDto) {
		console.log(bd);
		const rs = await this.userService.create(bd);

		return rs;
	}

	@Post('/test')
	async test(@Body() bd: TestDTO) {
			
		const rs = await this.userService.test(bd.username, bd.userpass);
		
		console.log(rs);

		return { yes: 'yes'};
	}
}
