import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
// 👇 Import Decorator ที่เราสร้างไว้
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 🔒 POST: สร้างหนังสือ (ADMIN Only)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  // 🔓 GET: ดูทั้งหมด
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  // 🔓 GET: ดูเล่มเดียว
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  // 🔒 PATCH: Toggle Like (เปลี่ยนจาก incrementLikes เป็น toggleLike)
  @Patch(':id/like')
  @UseGuards(AuthGuard('jwt')) // ต้อง Login ถึงจะกดได้
  async toggleLike(@Param('id') id: string, @CurrentUser() user: any) {
    // ส่งทั้ง id หนังสือ และ id คนกด ไปให้ Service
    return this.bookService.toggleLike(id, user.userId);
  }

  // 🔒 PATCH: แก้ไข (ADMIN Only)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  // 🔒 DELETE: ลบ (ADMIN Only)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}