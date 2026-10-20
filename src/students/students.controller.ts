import { Controller, Get, Post, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { Student } from './student.entity.js';

@Controller('api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':rollNumber')
  findOne(@Param('rollNumber') rollNumber: string) {
    return this.studentsService.getOne(rollNumber);
  }

  @Post()
  @HttpCode(201)
  create(@Body() student: Student) {
    return this.studentsService.create(student);
  }

  @Delete(':rollNumber')
  @HttpCode(204)
  async remove(@Param('rollNumber') rollNumber: string) {
    await this.studentsService.delete(rollNumber);
  }
}
