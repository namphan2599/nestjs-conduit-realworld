import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get('auth'),
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports:[AuthService, JwtModule]
})
export class AuthModule {}
