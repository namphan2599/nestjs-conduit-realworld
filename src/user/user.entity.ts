import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { Article } from 'src/article/article.entity'
import { Comment } from 'src/comment/comment.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column({ default: '' })
    bio: string

    @Column({ default: '' })
    image: string

    @OneToMany(type => Article, article => article.author)
    articles: Article[];

    @OneToMany(() => Comment, (comment: Comment) => comment.author)
    comments: Comment[];

    toJSON() {
        return {
            id: this.id,
            bio: this.bio,
            image: this.image,
        }
    }

}