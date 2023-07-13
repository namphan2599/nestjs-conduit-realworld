import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
	UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthUserLoginDto from './dto/auth-user-login';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signIn')
  async signIn(@Res({ passthrough: true }) res: Response, @Body() bd: AuthUserLoginDto) {
    const { accessToken, refreshToken } = await this.authService.signToken(bd.username, bd.password);
    
    const expireDate = new Date()
    expireDate.setMonth(expireDate.getMonth() + 3)

    res.cookie('refreshToken', refreshToken, { 
      expires: expireDate,
      httpOnly: true,
      sameSite: 'none'
    })

    return {
      accessToken
    }
  }

  @Get('/refreshToken')
  async refreshToken(@Req() req: Request) {
    const token = req.cookies['refreshToken'];
    return this.authService.refreshToken(token);
  }

  @UseGuards(AuthGuard)
  @Get('testJwt')
  test(@Req() req) {
    if (req.user) {
      return {
        status: 'ok',
      };
    } else {
			throw new UnauthorizedException();
		}
  }
}
