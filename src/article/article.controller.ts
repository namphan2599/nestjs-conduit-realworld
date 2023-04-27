import { Controller, UseGuards, Get, Body, Post, Req, Put, Param} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipAuth } from 'src/auth/decorators/SkipAuth.decorator';
import { ArticleService } from './article.service';



@UseGuards(AuthGuard)
@Controller('article')
export class ArticleController {

    constructor(private articleService: ArticleService) {}

    @SkipAuth()
    @Get()
    getAllArticle() {
        return this.articleService.getAllArticle();
    }

    @Post()
    createArticle(@Req() req, @Body() articleData) {
        console.log(req['user']);
        console.log(articleData);
        return this.articleService.createArticle(articleData.title, articleData.body, req['user'].sub);
    }

    @Put(':slug')
    updateArticle(@Param() params, @Body() articleData) {
        return this.articleService.updateArticle(articleData.title, articleData.body, params.slug);
    }
}
