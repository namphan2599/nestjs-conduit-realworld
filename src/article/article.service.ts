import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';
import { Follow } from 'src/follow/follow.entity';
import CreateCommentDto from './dto/create-comment.dto';
import CreateArticleDto from './dto/create-article.dto';
import UpdateArticleDto from './dto/update-article.dto';
import { ArticleRO } from './article.interface';
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

      const favoriteIds = author.favorites.map((el) => el.id);

      if (favoriteIds.length === 0) {
        return { articles: [], articlesCount: 0 };
      }

      queryBuild.andWhere('article.id IN (:...ids)', { ids: favoriteIds });
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
    newArticle.description = createData.description;
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
    article.description = updateData.description;
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

  async findOne(slug: string, userId?: number) {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.slug = :slug', { slug: slug })
      .getOne();

    const articleRO: ArticleRO = {
      ...article.toJSON(),
      favorited: false,
    };

    if (userId) {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: { favorites: true },
      });

      articleRO.favorited =
        user.favorites.findIndex((article) => article.slug === slug) >= 0;
    }

    return articleRO;
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

    let article = await this.articleRepository.findOne({
      where: {
        slug: slug,
      },
      relations: {
        author: true,
      },
    });

    if (!user.favorites) {
      user.favorites = [];
    }

    const isNewFavorite =
      user.favorites.findIndex(
        (favoriteArticle) => favoriteArticle.id === article.id,
      ) < 0;

    let authorInfo = article.author;

    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      await this.userRepository.save(user);

      article = await this.articleRepository.save(article);
    }

    const articleRO: ArticleRO = {
      ...article.toJSON(),
      author: authorInfo,
      favorited: true,
    };

    return articleRO;
  }

   // need to do something with this
   async unfavorite(slug: string, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: { favorites: true },
    });

    let article = await this.articleRepository.findOne({
      where: {
        slug: slug,
      },
      relations: {
        author: true,
      },
    });

    const deleteIndex = user.favorites.findIndex(
      (favoriteArticle) => favoriteArticle.id === article.id,
    );

    let authorInfo = article.author;

    if (deleteIndex >= 0) {
      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);

      article = await this.articleRepository.save(article);
    }

    const articleRO: ArticleRO = {
      ...article.toJSON(),
      author: authorInfo,
      favorited: false,
    };

    return articleRO;
  }

  async deleteArticle(userId: number, slug: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { favorites: true },
    });
    const article = await this.articleRepository.findOneBy({ slug });

    if (!user || !article) {
      throw new NotFoundException('User or article not found');
    }

    let deleteIndex = user.favorites.findIndex(
      (article) => article.slug === slug,
    );
    user.favorites.splice(deleteIndex, 1);
    this.userRepository.save(user);

    const result = await this.articleRepository.remove(article);
    return result;
  }
}
