import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCourseDto } from './create-course.dto.js';
import { Department } from '../../students/student.entity.js';

describe('CreateCourseDto', () => {
  it('should validate successfully with valid data', async () => {
    const plain = {
      code: 'CS-301',
      title: 'Web Application Development',
      creditHours: 3,
      instructor: 'Dr. Hamza Rauf',
      department: Department.COMPUTER_SCIENCE,
      description: 'Web development with NestJS and modern tools.',
      tags: ['web', 'backend'],
    };

    const dto = plainToInstance(CreateCourseDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should clean values using class-transformer (trim, uppercase code, lowercase tags)', async () => {
    const plain = {
      code: '  cs-420  ',
      title: '  Compilers  ',
      creditHours: 3,
      instructor: '  Dr. Hamza Rauf  ',
      department: Department.COMPUTER_SCIENCE,
      tags: ['THEORY', ' Core '],
    };

    const dto = plainToInstance(CreateCourseDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.code).toBe('CS-420');
    expect(dto.title).toBe('Compilers');
    expect(dto.instructor).toBe('Dr. Hamza Rauf');
    expect(dto.tags).toEqual(['theory', 'core']);
  });

  it('should fail validation on invalid fields (code pattern, short title, creditHours out of bounds, short instructor, bad department)', async () => {
    const plain = {
      code: 'CS3',
      title: 'AI',
      creditHours: 9,
      instructor: 'Dr',
      department: 'NonExistentDepartment',
    };

    const dto = plainToInstance(CreateCourseDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(4);

    const errorProperties = errors.map((e) => e.property);
    expect(errorProperties).toContain('code');
    expect(errorProperties).toContain('title');
    expect(errorProperties).toContain('creditHours');
    expect(errorProperties).toContain('instructor');
    expect(errorProperties).toContain('department');
  });

  it('should fail validation when creditHours is sent as text instead of a number', async () => {
    const plain = {
      code: 'CS-301',
      title: 'Compilers',
      creditHours: '3',
      instructor: 'Dr. Hamza',
      department: Department.COMPUTER_SCIENCE,
    };

    const dto = plainToInstance(CreateCourseDto, plain);
    const errors = await validate(dto);
    const creditError = errors.find((e) => e.property === 'creditHours');
    expect(creditError).toBeDefined();
    expect(creditError?.constraints?.isInt).toBeDefined();
  });

  it('should fail validation when extra properties are provided with forbidNonWhitelisted enabled', async () => {
    const plain = {
      code: 'CS-301',
      title: 'Compilers',
      creditHours: 3,
      instructor: 'Dr. Hamza',
      department: Department.COMPUTER_SCIENCE,
      isAdmin: true,
    };

    const dto = plainToInstance(CreateCourseDto, plain);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    const extraPropertyError = errors.find((e) => e.property === 'isAdmin');
    expect(extraPropertyError).toBeDefined();
    expect(
      extraPropertyError?.constraints?.whitelistValidation ||
        extraPropertyError?.constraints?.isWhitelisted,
    ).toBeDefined();
  });

  it('should fail validation when tags array has more than 5 items', async () => {
    const plain = {
      code: 'CS-301',
      title: 'Compilers',
      creditHours: 3,
      instructor: 'Dr. Hamza',
      department: Department.COMPUTER_SCIENCE,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
    };

    const dto = plainToInstance(CreateCourseDto, plain);
    const errors = await validate(dto);
    const tagsError = errors.find((e) => e.property === 'tags');
    expect(tagsError).toBeDefined();
    expect(tagsError?.constraints?.arrayMaxSize).toBeDefined();
  });
});
