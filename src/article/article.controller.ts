import {
  Controller,
  UseGuards,
  Get,
  Body,
  Post,
  Req,
  Put,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipAuth } from 'src/auth/decorators/SkipAuth.decorator';
import { ArticleService } from './article.service';
import { User } from 'src/decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  @SkipAuth()
  getAllArticle() {
    return this.articleService.getAllArticle();
  }

  @Get('/feed')
  getFeed(@User('id') userId) {
    return this.articleService.getFeed(userId);
  }

  @Get(':slug')
  @SkipAuth()
  async findOne(@Param('slug') slug) {
    const article = await this.articleService.findOne(slug);

    if (!article) {
      throw new NotFoundException('Article does not exist.');
    }

    return article;
  }

  @Post()
  createArticle(@User('id') userId, @Body() articleData) {
    return this.articleService.createArticle(
      articleData.title,
      articleData.body,
      userId,
    );
  }

  @Put(':slug')
  updateArticle(@Param('slug') slug, @Body() articleData) {
    return this.articleService.updateArticle(
      articleData.title,
      articleData.body,
      slug,
    );
  }

  @Post(':slug/comments')
  createComment(@User('id') userId, @Param('slug') slug, @Body() commentData) {
    return this.articleService.createComment(
      slug,
      userId,
      commentData,
    );
  }

  @Post(':slug/favorite')
  favorite(@User('id') userId, @Param('slug') slug) {
    return this.articleService.favorite(slug, userId);
  }

  @Delete(':slug/favorite')
  unfavorite(@User('id') userId, @Param('slug') slug) {
    return this.articleService.unfavorite(slug, userId);
  }

  @Get('/test')
  test() {
    return this.articleService.getArticleByAuthor('namphan');
  }
}
