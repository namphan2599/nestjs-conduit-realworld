import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signToken(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);

    if (!user) {
      throw new NotFoundException();
    }

    let passwordMatched = await bcrypt.compare(user.password, pass);

    if (passwordMatched) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '90d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const { iat, exp, ...payload } = await this.jwtService.verifyAsync(token,{
          secret: process.env.JWT_SECRET,
        },
      );

      return await this.jwtService.signAsync(payload, {expiresIn: '15s'});
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }
}
