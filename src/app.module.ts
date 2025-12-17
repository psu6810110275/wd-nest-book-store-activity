import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCategoryModule } from './book-category/book-category.module';
import { BookCategory } from './book-category/entities/book-category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'bookstore_dev',
      entities: [BookCategory], // เราจะเพิ่ม Entities ที่นี่ในภายหลัง
      synchronize: true, // สร้าง Table อัตโนมัติ (ใช้สำหรับ Dev เท่านั้น)
    }),
    BookCategoryModule,
  ],
})
export class AppModule {}


