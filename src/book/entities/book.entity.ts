import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BookCategory } from '../../book-category/entities/book-category.entity';
// 👇 1. Import User เข้ามา
import { User } from '../../users/entities/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => BookCategory, (category) => category.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: BookCategory;

  @Column({ nullable: true })
  categoryId: string;

  // 👇 2. เพิ่มความสัมพันธ์ ManyToMany และสร้างตารางกลาง
  @ManyToMany(() => User, (user) => user.likedBooks)
  @JoinTable() // 👈 ตัวนี้สำคัญมาก! มันจะสร้างตารางชื่อ book_liked_by_user ให้เอง
  likedBy: User[];
}