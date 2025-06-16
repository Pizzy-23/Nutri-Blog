import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    subtitulo: string;

    @Column('text')
    conteudo: string;

    @Column()
    imagemUrl: string;

    @Column({ default: false })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
