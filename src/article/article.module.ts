import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from './article.entity';
import { Comment } from 'src/comment/comment.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/user/user.entity';
import { Follow } from 'src/follow/follow.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Article, Comment, User, Follow]), AuthModule],
    controllers: [ArticleController],
    providers: [ArticleService]
})
export class ArticleModule {}
