import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';
import { Follow } from 'src/follow/follow.entity';
import CreateCommentDto from './dto/create-comment.dto';
import CreateArticleDto from './dto/create-article.dto';
import UpdateArticleDto from './dto/update-article.dto';
var slugify = require('slug');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
  ) {}

  async getAllArticle(query) {
    const limit = 5;
    const queryBuild = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    queryBuild.where('1=1');

    if ('page' in query) {
      queryBuild.skip(limit * (parseInt(query.page) - 1));
    }

    if ('author' in query) {
      const author = await this.userRepository.findOneBy({
        username: query.author,
      });
      
      queryBuild.andWhere('article.authorId = :authorId', {
        authorId: author.id,
      });
    }

    if ('favorite' in query) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorite },
        relations: { favorites: true },
      });

      const favoriteIds = author.favorites.map(el => el.id)

      queryBuild.andWhere('article.id IN (:ids)', {ids: favoriteIds})
    }

    const articlesCount = await queryBuild.getCount();

    queryBuild.take(limit);

    const articles = await queryBuild
      .orderBy('article.created', 'DESC')
      .getMany();

    return {
      articles,
      articlesCount,
    };
  }

  async getFeed(userId: number) {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const ids = follows.map((follow) => follow.followingId);

    const articles = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.authorId in (:ids)', { ids })
      .orderBy('article.created', 'DESC')
      .getMany();

    return { articles: articles, articlesCount: articles.length };
  }

  async createArticle(authorId: number, createData: CreateArticleDto) {
    const author = await this.userRepository.findOneBy({ id: authorId });

    if (!author) {
      return {
        status: 'error',
        mess: 'User not found',
      };
    }

    let newArticle = new Article();

    newArticle.title = createData.title;
    newArticle.body = createData.body;
    // should use uuid or something instead of Date.now
    newArticle.slug = slugify(createData.title) + '-' + Date.now();
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

  async updateArticle(slug: string, updateData: UpdateArticleDto) {
    const article = await this.articleRepository.findOne({
      where: { slug: slug },
    });

    if (!article) {
      return {
        status: 'error',
        mess: 'Article not found.',
      };
    }

    article.title = updateData.title;
    article.body = updateData.body;
    article.slug = slugify(updateData.title) + '-' + slug.split('-').pop();

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

  async findOne(slug: string) {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.slug = :slug', { slug: slug })
      .getOne();
  }

  async createComment(
    slug: string,
    userID: number,
    commentData: CreateCommentDto,
  ) {
    const author = await this.userRepository.findOneBy({ id: userID });
    const article = await this.articleRepository.findOneBy({ slug: slug });

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

  async favorite(slug: string, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: { favorites: true },
    });
    let article = await this.articleRepository.findOneBy({ slug: slug });

    if (!user.favorites) {
      user.favorites = [];
    }

    const isNewFavorite =
      user.favorites.findIndex(
        (favoriteArticle) => favoriteArticle.id === article.id,
      ) < 0;

    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      let savedUser = await this.userRepository.save(user);

      console.log(savedUser);

      article = await this.articleRepository.save(article);
    }

    return article;
  }

  async unfavorite(slug: string, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: { favorites: true },
    });

    console.log(user);
    let article = await this.articleRepository.findOneBy({ slug: slug });

    const deleteIndex = user.favorites.findIndex(
      (favoriteArticle) => favoriteArticle.id === article.id,
    );

    if (deleteIndex >= 0) {
      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);

      article = await this.articleRepository.save(article);
    }

    return article;
  }
}
