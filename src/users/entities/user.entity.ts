import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn({ name: "user_seq" })
    userSeq: number;

    @Column({
        name: "user_email",
        type: "varchar",
        length: 100,
        unique: true,
    })
    userEmail: string;

    @Column({
        name: "user_pw",
        type: "varchar",
        length: 255,
    })
    userPw: string;

    @Column({
        name: "user_name",
        type: "varchar",
        length: 10,
        nullable: true,
    })
    userName: string;

    @Column({
        name: "user_phone",
        type: "varchar",
        length: 20,
        nullable: true,
    })
    userPhone: string;

    @Column({
        name: "user_level",
        type: "tinyint",
        default: 1,
    })
    userLevel: number;

    @Column({
        name: "last_login_dt",
        type: "datetime",
        nullable: true,
    })
    lastLoginDt: Date;

    @CreateDateColumn({
        name: "create_dt",
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP",
    })
    createDt: Date;

    @UpdateDateColumn({
        name: "update_dt",
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updateDt: Date;

    @Column({
        name: "user_note",
        type: "varchar",
        length: 50,
        nullable: true,
    })
    userNote: string;
}