import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, authConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    ArticleModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
