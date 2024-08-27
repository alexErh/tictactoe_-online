import { Column, Entity, PrimaryColumn, Unique } from "typeorm";

@Entity()
@Unique(["nickname"])
export class User {
    @PrimaryColumn()
    nickname: string;

    @Column()
    password: string;

    @Column({ default: 1000 })
    score: number;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({
        type: 'blob'
    })
    img: Buffer;
}