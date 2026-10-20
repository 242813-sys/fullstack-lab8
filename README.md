# Full Stack Web Development — Lab 08: Dependency Injection, Providers & Validation

This repository contains the complete implementation for Lab 08 NestJS project, featuring dynamic stores with custom factory providers, pluggable fee policies, DTO validation with class-validator/class-transformer, automated unit/e2e testing suites, and a complete Postman collection.

---

## 🛠️ Prerequisites & Installation

- **Node.js**: v20+ or v24+
- **npm**: v10+

Install dependencies:
```bash
npm install
```

---

## 🚀 Running the Application

### 1. Default Development Mode
```bash
npm run start:dev
```

### 2. Environment Variables

The application is controlled by three environment variables:

| Variable | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `STORAGE` | `file`, `memory` | `file` | Dynamic storage selection via `useFactory` for `COURSE_STORE` and `STUDENT_STORE`. |
| `LOG_TO_FILE` | `true`, `false` | `false` | When `true`, `AppLogger` logs output to `logs/app.log` in addition to stdout. |
| `FEE_POLICY` | `standard`, `merit` | `standard` | Pluggable fee calculation strategy via `useFactory` for `FEE_POLICY`. |

#### Running with Environment Variables (PowerShell):

- **In-Memory Storage with File Logging:**
  ```powershell
  $env:STORAGE="memory"; $env:LOG_TO_FILE="true"; npm run start
  ```

- **Pluggable Fee Policy — Standard (5000 / credit hour):**
  ```powershell
  $env:FEE_POLICY="standard"; npm run start
  ```

- **Pluggable Fee Policy — Merit (Up to 50% discount for CGPA >= 3.5):**
  ```powershell
  $env:FEE_POLICY="merit"; npm run start
  ```

#### Running with Environment Variables (Bash / macOS / Linux):
```bash
STORAGE=memory LOG_TO_FILE=true FEE_POLICY=merit npm run start
```

---

## 🧪 Running Automated Tests

### 1. Unit Tests (Services, Policies, DTOs)
Runs at least 22 tests across 3 suites:
```bash
npm test
```
- `src/courses/courses.service.spec.ts` (CRUD, stores, logger, conflict/not found exceptions)
- `src/fees/fee-policies.spec.ts` (Standard and Merit policies, CGPA boundaries 3.0, 3.5, and below 3.0)
- `src/courses/dto/create-course.dto.spec.ts` (plainToInstance, validation constraints, whitelist, tags rules)

### 2. End-to-End (E2E) Tests
Runs e2e test suite overriding `COURSE_STORE` with an in-memory store and registering global `createValidationPipe()`:
```bash
npm run test:e2e
```

---

## 📬 Postman Collection & Runner

The automated Postman suite is located at:
```
postman/Lab08_Tasks.postman_collection.json
```

### Running in Postman:
1. Open Postman and click **Import** -> Select `postman/Lab08_Tasks.postman_collection.json`.
2. Confirm the collection variables:
   - `baseUrl`: `http://localhost:3000`
   - `newCode`: `CS-450`
3. Click the **Run Collection** button.
4. Select all 18 requests and click **Run Lab 08 Tasks**.
5. All 18 requests (including 12 negative tests for status 400, 404, 409) will pass (100% green).
6. The collection is re-runnable: Request 3 creates course `CS-450` and saves `newCode`, while Request 18 issues a `DELETE /api/courses/{{newCode}}` to clean it up. Running it twice consecutively yields 0 failures.

### Running via Newman CLI:
```bash
npx -y newman run postman/Lab08_Tasks.postman_collection.json
```

---

## 📸 Screenshots

Located in `screenshots/`:
- `screenshots/npm-test.png`: All unit tests green (3 test suites passed).
- `screenshots/e2e.png`: E2E tests green with supertest.
- `screenshots/runner.png`: Postman collection runner results with 18/18 requests passing.

---

## 📌 API Endpoints Overview

### Courses API (`/api/courses`)
- `GET /api/courses/stats`: Returns course statistics (`totalCourses`, `totalCredits`, `overloaded`).
- `GET /api/courses`: Returns all courses (supports `search`, `department`, `minCredits`, `sort`, `order`, `limit`).
- `GET /api/courses/:code`: Returns a single course by code (validated with `CodeParamDto`).
- `POST /api/courses`: Creates a course (status 201; status 409 on duplicate code).
- `PUT /api/courses/:code`: Replaces course fields except code.
- `PATCH /api/courses/:code`: Partial update for course fields.
- `DELETE /api/courses/:code`: Deletes course by code (status 204).

### Fees API (`/api/fees`)
- `GET /api/fees/info`: Returns active fee policy and rate per credit hour (injected via `FEE_CALCULATOR` alias).
- `GET /api/fees/:rollNumber?creditHours=12`: Calculates semester fee for student based on CGPA and active policy.

### Students API (`/api/students`)
- `GET /api/students`: Lists all students.
- `GET /api/students/:rollNumber`: Returns student by roll number.
- `POST /api/students`: Creates student.
- `DELETE /api/students/:rollNumber`: Deletes student.
