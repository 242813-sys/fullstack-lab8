import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { CreditService } from './credit.service.js';
import { COURSE_STORE, InMemoryCourseStore } from './store/course-store.js';
import { AppLogger } from '../common/logger/app.logger.js';
import { Department } from '../students/student.entity.js';
import { Course } from './course.entity.js';

describe('CoursesService', () => {
  let service: CoursesService;
  let mockLogger: { log: any; error: any; warn: any };

  const initialCourses: Course[] = [
    {
      code: 'CS-101',
      title: 'Introduction to Computing',
      creditHours: 3,
      instructor: 'Dr. Ali Raza',
      department: Department.COMPUTER_SCIENCE,
    },
    {
      code: 'CS-201',
      title: 'Data Structures',
      creditHours: 3,
      instructor: 'Dr. Usman Tariq',
      department: Department.COMPUTER_SCIENCE,
    },
  ];

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        CreditService,
        {
          provide: COURSE_STORE,
          useValue: new InMemoryCourseStore(initialCourses),
        },
        {
          provide: AppLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should list all courses (findAll)', async () => {
    const result = await service.findAll();
    expect(result.length).toBe(2);
    expect(result[0].code).toBe('CS-101');
    expect(result[1].code).toBe('CS-201');
  });

  it('should find one course by code (findByCode)', async () => {
    const course = await service.findByCode('CS-101');
    expect(course).toBeDefined();
    expect(course.title).toBe('Introduction to Computing');
  });

  it('should throw NotFoundException for unknown course code', async () => {
    await expect(service.findByCode('CS-999')).rejects.toThrow(NotFoundException);
  });

  it('should create a new course and return it', async () => {
    const newCourse = {
      code: 'CS-420',
      title: 'Compilers',
      creditHours: 3,
      instructor: 'Dr. Hamza Rauf',
      department: Department.COMPUTER_SCIENCE,
      tags: ['theory', 'core'],
    };

    const created = await service.create(newCourse);
    expect(created.code).toBe('CS-420');

    const all = await service.findAll();
    expect(all.length).toBe(3);
  });

  it('should throw ConflictException when creating a course with duplicate code', async () => {
    const duplicate = {
      code: 'CS-101',
      title: 'Duplicate Computing',
      creditHours: 3,
      instructor: 'Dr. John',
      department: Department.COMPUTER_SCIENCE,
    };

    await expect(service.create(duplicate)).rejects.toThrow(ConflictException);
  });

  it('should delete a course successfully', async () => {
    await service.delete('CS-101');
    const all = await service.findAll();
    expect(all.length).toBe(1);
    await expect(service.findByCode('CS-101')).rejects.toThrow(NotFoundException);
  });

  it('should call AppLogger when creating and deleting courses', async () => {
    const newCourse = {
      code: 'CS-430',
      title: 'Distributed Systems',
      creditHours: 3,
      instructor: 'Dr. Farooq Khan',
      department: Department.COMPUTER_SCIENCE,
    };

    await service.create(newCourse);
    expect(mockLogger.log).toHaveBeenCalledWith('Created course CS-430');

    await service.delete('CS-430');
    expect(mockLogger.log).toHaveBeenCalledWith('Deleted course CS-430');
  });
});
