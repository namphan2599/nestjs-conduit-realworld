import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthUserLoginDto from './dto/auth-user-login';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signIn')
    async signIn(@Body() bd: AuthUserLoginDto) {
        const rs = await this.authService.signIn(bd.username, bd.password);
        
        return rs;
    }
    
}
