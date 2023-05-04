import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Article } from '../article/article.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(type => Article, article => article.comments)
  article: Article;

  @ManyToOne(() => User, (user: User) => user.comments, { eager: true })
  author: User;

  // toJSON() {
  //   return {
  //     id: this.id,
  //     body: this.body,
  //     author: this.author && this.author.toJSON(),
  //   }
  // }
}