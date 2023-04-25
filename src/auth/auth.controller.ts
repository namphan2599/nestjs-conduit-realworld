import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthUserLoginDto from './dto/auth-user-login';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signIn')
  async signIn(@Body() bd: AuthUserLoginDto) {
    const rs = await this.authService.signIn(bd.username, bd.password);

    return rs;
  }

  @UseGuards(AuthGuard)
  @Get('testJwt')
  test(@Request() req) {
    if (req.user) {
      return {
        status: 'ok',
      };
    } else {
			throw new UnauthorizedException();
		}
  }
}
