import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' }
        })
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
