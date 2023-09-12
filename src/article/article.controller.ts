import {
  Controller,
  UseGuards,
  Get,
  Body,
  Post,
  Req,
  Query,
  Put,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { SkipAuth } from 'src/shared/decorators/SkipAuth.decorator';
import { ArticleService } from './article.service';
import { User } from 'src/shared/decorators/user.decorator';
import CreateCommentDto from './dto/create-comment.dto';
import CreateArticleDto from './dto/create-article.dto';
import UpdateArticleDto from './dto/update-article.dto';

@UseGuards(AuthGuard)
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  @SkipAuth()
  getAllArticle(@Query() query) {
    return this.articleService.getAllArticle(query);
  }

  @Get('/feed')
  getFeed(@User('id') userId) {
    return this.articleService.getFeed(userId);
  }

  @Get(':slug')
  @SkipAuth()
  async findOne(@Param('slug') slug, @User('id') userId: number) {
    const article = await this.articleService.findOne(slug, userId);

    if (!article) {
      throw new NotFoundException('Article does not exist.');
    }

    return article;
  }

  @Post()
  createArticle(@User('id') userId, @Body() createData: CreateArticleDto) {
    return this.articleService.createArticle(userId, createData);
  }

  @Put(':slug')
  updateArticle(@Param('slug') slug, @Body() updateData: UpdateArticleDto) {
    return this.articleService.updateArticle(slug, updateData);
  }

  @Post(':slug/comments')
  createComment(@User('id') userId, @Param('slug') slug, @Body() commentData: CreateCommentDto) {
    return this.articleService.createComment(
      slug,
      userId,
      commentData,
    );
  }

  @Post(':slug/favorite')
  favorite(@User('id') userId, @Param('slug') slug: string) {
    return this.articleService.favorite(slug, userId);
  }

  @Delete(':slug/favorite')
  unfavorite(@User('id') userId, @Param('slug') slug: string) {
    return this.articleService.unfavorite(slug, userId);
  }

  @Delete(':slug')
  deleteArticle(@User('id') userId: number, @Param('slug') slug: string) {
    return this.articleService.deleteArticle(userId, slug)
  }

  @Get('/test')
  test() {
    return this.articleService.getArticleByAuthor('namphan');
  }
}
