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

@UseGuards(AuthGuard)
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  @SkipAuth()
  getAllArticle() {
    return this.articleService.getAllArticle();
  }

  @Get(':slug')
  @SkipAuth()
  async getArticleBySlug(@Param('slug') slug) {
    const article = await this.articleService.findOne(slug);

    if (!article) {
      throw new NotFoundException('Article does not exist.');
    }

    return article;
  }

  @Post()
  createArticle(@Req() req, @Body() articleData) {
    console.log(req['user']);
    console.log(articleData);
    return this.articleService.createArticle(
      articleData.title,
      articleData.body,
      req['user'].sub,
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
  createComment(@Req() req, @Param('slug') slug, @Body() commentData) {
    return this.articleService.createComment(
      slug,
      req['user'].sub,
      commentData,
    );
  }

  @Post(':slug/favorite')
  favorite(@Req() req, @Param('slug') slug) {
    return this.articleService.favorite(slug, req['user'].sub);
  }

  @Delete(':slug/favorite')
  unfavorite(@Req() req, @Param('slug') slug) {
    return this.articleService.unfavorite(slug, req['user'].sub);
  }

  @Get('/test')
  test() {
    return this.articleService.getArticleByAuthor('namphan');
  }
}
