import { Department } from '../students/student.entity.js';

export interface Course {
  code: string;
  title: string;
  creditHours: number;
  instructor: string;
  department: Department;
  description?: string;
  tags?: string[];
}
