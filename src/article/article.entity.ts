import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
  AfterUpdate,
  BeforeUpdate,
  ManyToMany,
} from 'typeorm';

import { User } from 'src/user/user.entity';
import { Comment } from 'src/comment/comment.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToOne((type) => User, (user) => user.articles)
  author: User;

  @OneToMany((type) => Comment, (comment) => comment.article, { eager: true })
  @JoinColumn()
  comments: Comment[];

  @Column({ default: 0 })
  favoriteCount: number;

  toJSON() {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      author: this.author && this.author.toJSON(),
      created: this.created,
      updated: this.updated,
      favoriteCount: this.favoriteCount,
    };
  }
}
