import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follow {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    followerId: number
    
    @Column()
    followingId: number
}