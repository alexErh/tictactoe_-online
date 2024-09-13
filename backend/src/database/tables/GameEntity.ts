import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";

@Entity()
export class GameEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    player1: User;

    @OneToOne(() => User)
    @JoinColumn()
    player2: User;

    @Column({
        nullable: true
    })
    winner: string;
}