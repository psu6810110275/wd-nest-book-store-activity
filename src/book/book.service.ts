import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
// 👇 Import User เพื่อใช้ในการ Cast Type
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    return this.bookRepository.save(createBookDto);
  }

  findAll() {
    return this.bookRepository.find({ relations: ['category'] });
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!book) throw new NotFoundException(`Book #${id} not found`);
    return book;
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(id, updateBookDto);
  }

  async remove(id: string) {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    return { message: `Book #${id} deleted successfully` };
  }

  // 👇 นี่คือพระเอกของเรา: Logic Toggle Like
  async toggleLike(bookId: string, userId: string) {
    // 1. ค้นหาหนังสือ พร้อมดึง list ของคนที่กดไลค์ (likedBy) มาด้วย
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['likedBy'], 
    });

    if (!book) throw new NotFoundException(`Book #${bookId} not found`);

    // 2. เช็คว่า User คนนี้ (userId) อยู่ใน list likedBy แล้วหรือยัง?
    const userIndex = book.likedBy.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      // 🟢 กรณี: เจอว่าเคยกดแล้ว -> ให้เอาออก (Unlike)
      book.likedBy.splice(userIndex, 1); // ลบออกจาก Array
      book.likeCount = Math.max(0, book.likeCount - 1); // ลดจำนวน (กันติดลบ)
    } else {
      // 🔴 กรณี: ยังไม่เคยกด -> ให้เพิ่มเข้า (Like)
      // สร้าง Object User หลอกๆ ขึ้นมาโดยมีแค่ ID เพื่อ push ใส่ array
      const user = { id: userId } as User; 
      book.likedBy.push(user);
      book.likeCount += 1;
    }

    // 3. บันทึกผลลง Database (TypeORM จะจัดการตารางกลางให้เอง)
    await this.bookRepository.save(book);

    return {
      message: userIndex !== -1 ? 'Unliked' : 'Liked', // บอกสถานะ
      currentLikes: book.likeCount,
    };
  }
}