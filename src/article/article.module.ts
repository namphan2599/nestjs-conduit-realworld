import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from './article.entity';
import { Comment } from 'src/comment/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Article, Comment])]
})
export class ArticleModule {}
