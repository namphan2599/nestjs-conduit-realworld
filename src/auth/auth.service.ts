import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "src/user/user.service";


import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username);

        if(!user) {
            throw new NotFoundException();
        }
        
        let passwordMatched = await bcrypt.compare(user.password, pass);

        if(passwordMatched) {
            throw new UnauthorizedException();
        }

        const payload = { username: user.username, sub: user.id };

        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
}