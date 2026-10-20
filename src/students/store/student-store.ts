import { Student } from '../student.entity.js';
import * as fs from 'fs';
import * as path from 'path';

export const STUDENT_STORE = Symbol('STUDENT_STORE');

export interface StudentStore {
  readAll(): Promise<Student[]>;
  writeAll(students: Student[]): Promise<void>;
}

export class InMemoryStudentStore implements StudentStore {
  private students: Student[];

  constructor(initialStudents: Student[] = []) {
    this.students = JSON.parse(JSON.stringify(initialStudents));
  }

  async readAll(): Promise<Student[]> {
    return JSON.parse(JSON.stringify(this.students));
  }

  async writeAll(students: Student[]): Promise<void> {
    this.students = JSON.parse(JSON.stringify(students));
  }
}

export class JsonFileStudentStore implements StudentStore {
  private readonly filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath || path.resolve(process.cwd(), 'data', 'students.json');
  }

  async readAll(): Promise<Student[]> {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async writeAll(students: Student[]): Promise<void> {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(this.filePath, JSON.stringify(students, null, 2), 'utf8');
  }
}
