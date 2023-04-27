import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from './article.entity';
import { Comment } from 'src/comment/comment.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Article, Comment, User]), AuthModule],
    controllers: [ArticleController],
    providers: [ArticleService]
})
export class ArticleModule {}
