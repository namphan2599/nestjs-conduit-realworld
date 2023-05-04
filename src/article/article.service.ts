import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';
var slug = require('slug');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Comment) private commentRepository: Repository<Comment>,
		
  ) {}

  async getAllArticle() {
    return await this.articleRepository.find();
  }

  async createArticle(title, body, authorId) {
    const author = await this.userRepository.findOneBy({ id: authorId });

    if (!author) {
      return {
        status: 'error',
        mess: 'User not found',
      };
    }

    let newArticle = new Article();
    newArticle.title = title;
    newArticle.body = body;
    // should use uuid or something instead of Date.now
    newArticle.slug = slug(title) + '-' + Date.now();
    newArticle.tagList = [];
    newArticle.comments = [];

    let savedArticle = await this.articleRepository.save(newArticle);

    const user = await this.userRepository.findOne({
      where: { id: authorId },
      relations: { articles: true },
    });
    user.articles.push(newArticle);

    await this.userRepository.save(user);

    return savedArticle;
  }

  async updateArticle(newTitle, newBody, PSlug: string) {
    const article = await this.articleRepository.findOne({
      where: { slug: PSlug },
    });

    if (!article) {
      return {
        status: 'error',
        mess: 'Article not found.',
      };
    }

    article.title = newTitle;
    article.body = newBody;
    article.slug = slug(newTitle) + '-' + PSlug.split('-').pop();

    return this.articleRepository.save(article);
  }

  async getArticleByAuthor(authorName: string) {
    let rs = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .select(['article', 'author.id', 'author.username'])
      .where('author.username = :name', { name: authorName })
      .getMany();

    return rs;
  }

	async createComment(slug, userID, commentData) {
		const author = await this.userRepository.findOneBy({id: userID});
		const article = await this.articleRepository.findOneBy({slug: slug});


		console.log(author);
		let newComment = new Comment();

		newComment.article = article;
		newComment.author = author;
		newComment.body = commentData.body;

		article.comments.push(newComment);

		await this.articleRepository.save(article);

		const savedComment = await this.commentRepository.save(newComment);

		return savedComment;
	}
}
