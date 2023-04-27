import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
var slug = require('slug');

@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(Article) private articleRepository: Repository<Article>,
				@InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async getAllArticle() {
        return await this.articleRepository.find();
    }

    async createArticle(title, body, authorId) {
        const author = await this.userRepository.findOneBy({ id: authorId });

				if(!author) {
					console.log('user not found');
				}

				let newArticle = new Article();
				newArticle.title = title;
				newArticle.body = body;
				// should use uuid or something instead of Date.now
				newArticle.slug = slug(title) + '-' + Date.now();
				newArticle.tagList = [];  
				newArticle.comments = [];
				newArticle.authorId = author.id;

				return this.articleRepository.save(newArticle);
    }

		async updateArticle(newTitle, newBody, PSlug: string) {
			const article = await this.articleRepository.findOne({where: {slug: PSlug}});

			if(!article) {
				return {
					status: 'error',
					mess: 'Article not found.'
				}
			}

			article.title = newTitle;
			article.body = newBody;
			article.slug = slug(newTitle) + '-' + PSlug.split('-').pop();

			return this.articleRepository.save(article);
		}
}
