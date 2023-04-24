import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Article } from 'src/article/article.entity'

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

}