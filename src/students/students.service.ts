import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { Student } from './student.entity.js';
import { STUDENT_STORE, StudentStore } from './store/student-store.js';
import { AppLogger } from '../common/logger/app.logger.js';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(STUDENT_STORE) private readonly studentStore: StudentStore,
    private readonly logger: AppLogger,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentStore.readAll();
  }

  async findByRollNumber(rollNumber: string): Promise<Student | undefined> {
    const students = await this.studentStore.readAll();
    return students.find((s) => s.rollNumber.toUpperCase() === rollNumber.toUpperCase());
  }

  async getOne(rollNumber: string): Promise<Student> {
    const student = await this.findByRollNumber(rollNumber);
    if (!student) {
      throw new NotFoundException(`Student with roll number ${rollNumber} not found`);
    }
    return student;
  }

  async create(student: Student): Promise<Student> {
    const students = await this.studentStore.readAll();
    const existing = students.find((s) => s.rollNumber.toUpperCase() === student.rollNumber.toUpperCase());
    if (existing) {
      throw new ConflictException(`Student with roll number ${student.rollNumber} already exists`);
    }
    students.push(student);
    await this.studentStore.writeAll(students);
    this.logger.log(`Created student ${student.rollNumber}`);
    return student;
  }

  async delete(rollNumber: string): Promise<boolean> {
    const students = await this.studentStore.readAll();
    const index = students.findIndex((s) => s.rollNumber.toUpperCase() === rollNumber.toUpperCase());
    if (index === -1) {
      throw new NotFoundException(`Student with roll number ${rollNumber} not found`);
    }
    students.splice(index, 1);
    await this.studentStore.writeAll(students);
    this.logger.log(`Deleted student ${rollNumber}`);
    return true;
  }
}
