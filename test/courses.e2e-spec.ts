import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { COURSE_STORE, InMemoryCourseStore } from '../src/courses/store/course-store.js';
import { createValidationPipe } from '../src/common/validation.pipe.js';
import { Department } from '../src/students/student.entity.js';
import { Course } from '../src/courses/course.entity.js';

describe('CoursesController (e2e)', () => {
  let app: INestApplication;

  const mockCourses: Course[] = [
    {
      code: 'CS-101',
      title: 'Introduction to Computing',
      creditHours: 3,
      instructor: 'Dr. Ali Raza',
      department: Department.COMPUTER_SCIENCE,
      tags: ['intro'],
    },
    {
      code: 'CS-201',
      title: 'Data Structures',
      creditHours: 3,
      instructor: 'Dr. Usman Tariq',
      department: Department.COMPUTER_SCIENCE,
      tags: ['dsa'],
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(COURSE_STORE)
      .useValue(new InMemoryCourseStore(mockCourses))
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/courses should return 200 and list of courses', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('GET /api/courses/stats should return 200 and stats object', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalCourses: 2,
      totalCredits: 6,
      overloaded: false,
    });
  });

  it('GET /api/courses/:code with invalid pattern should return 400 validation error', async () => {
    const res = await request(app.getHttpServer()).get('/api/courses/abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toContain('code must look like CS-301 or CS-301L');
  });

  it('POST /api/courses should create course and return 201 with cleaned data', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .send({
        code: ' cs-420 ',
        title: ' Compilers ',
        creditHours: 3,
        instructor: 'Dr. Hamza Rauf',
        department: Department.COMPUTER_SCIENCE,
        tags: ['Theory', 'CORE'],
      });

    expect(res.status).toBe(201);
    expect(res.body.code).toBe('CS-420');
    expect(res.body.title).toBe('Compilers');
    expect(res.body.tags).toEqual(['theory', 'core']);
  });

  it('POST /api/courses with duplicate code should return 409 conflict', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/courses')
      .send({
        code: 'CS-101',
        title: 'Intro Computing Duplicate',
        creditHours: 3,
        instructor: 'Dr. Ali Raza',
        department: Department.COMPUTER_SCIENCE,
      });

    expect(res.status).toBe(409);
  });

  it('PATCH /api/courses/:code with forbidden non-whitelisted code should return 400', async () => {
    const res = await request(app.getHttpServer())
      .patch('/api/courses/CS-101')
      .send({
        code: 'CS-999',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('DELETE /api/courses/:code should delete course and return 204', async () => {
    const res = await request(app.getHttpServer()).delete('/api/courses/CS-420');
    expect(res.status).toBe(204);
  });
});
