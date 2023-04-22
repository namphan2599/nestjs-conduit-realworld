import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ArticleEntity } from 'src/article/article.entity'

@Entity()
export class UserEntity {
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

    @OneToMany(type => ArticleEntity, article => article.author)
    articles: ArticleEntity[];

}