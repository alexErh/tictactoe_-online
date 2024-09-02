import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./User";

@Entity()
export class GameTable {
    @ApiProperty({ example: "d16fe161-169e-4b92-80d8-64808466fb88" })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @OneToOne(() => User)
    @JoinColumn()
    player1: User;

    @ApiProperty()
    @OneToOne(() => User)
    @JoinColumn()
    player2: User;

    @ApiProperty()
    @Column()
    winner: string;
}