import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
// 👇 1. Import Book เข้ามา (ระวัง path ให้ถูกนะครับ)
import { Book } from '../../book/entities/book.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  // 👇 2. เพิ่มความสัมพันธ์ ManyToMany
  @ManyToMany(() => Book, (book) => book.likedBy)
  likedBooks: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}