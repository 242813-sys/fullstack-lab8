import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
  });
}

function createParagraph(text, isBold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: 22, // 11pt
        font: 'Calibri',
      }),
    ],
    spacing: { after: 120 },
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + ': ',
        bold: true,
        size: 22,
        font: 'Calibri',
      }),
    );
  }
  children.push(
    new TextRun({
      text: text,
      size: 22,
      font: 'Calibri',
    }),
  );

  return new Paragraph({
    bullet: { level: 0 },
    children,
    spacing: { after: 80 },
  });
}

function createImageParagraph(imagePath, caption, width = 600, height = 320) {
  const fullPath = path.resolve(process.cwd(), imagePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: Image ${fullPath} not found`);
    return new Paragraph({
      text: `[Image Placeholder: ${caption}]`,
      spacing: { after: 120 },
    });
  }

  const imageBuffer = fs.readFileSync(fullPath);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: {
            width: width,
            height: height,
          },
        }),
      ],
      spacing: { before: 140, after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Figure: ${caption}`,
          italics: true,
          size: 18, // 9pt
          color: '555555',
          font: 'Calibri',
        }),
      ],
      spacing: { after: 180 },
    }),
  ];
}

async function buildDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Title Page info
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'CS-301L | Full Stack Web Development',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A',
                font: 'Calibri',
              }),
            ],
            spacing: { before: 100, after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Lab 08 Report — Dependency Injection, Custom Providers, DTO Validation & Testing',
                bold: true,
                size: 26, // 13pt
                color: '2563EB',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 200 },
          }),

          // Student Info Table / Card
          new Paragraph({
            children: [
              new TextRun({ text: 'Student Name: ', bold: true, size: 24, font: 'Calibri' }),
              new TextRun({ text: 'Reyyan Alam\n', size: 24, font: 'Calibri' }),
              new TextRun({ text: 'Roll Number: ', bold: true, size: 24, font: 'Calibri' }),
              new TextRun({ text: '242813\n', size: 24, font: 'Calibri' }),
              new TextRun({ text: 'Class: ', bold: true, size: 24, font: 'Calibri' }),
              new TextRun({ text: 'BS Computer Science\n', size: 24, font: 'Calibri' }),
              new TextRun({ text: 'Date: ', bold: true, size: 24, font: 'Calibri' }),
              new TextRun({ text: 'October 20, 2026\n', size: 24, font: 'Calibri' }),
            ],
            spacing: { after: 240 },
          }),

          // Divider
          new Paragraph({
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                color: 'CBD5E1',
              }),
            ],
            spacing: { after: 240 },
          }),

          // ==================== TASK 1 ====================
          createHeading1('Task 1 — Courses Module: Services, Providers and Tokens'),
          createParagraph(
            'The Courses feature was implemented alongside the Students feature using a clean NestJS architecture consisting of a thin controller, a domain service, and a storage provider dynamically selected via a factory provider.',
          ),

          createHeading2('1.1 Architecture & Implementation Highlights'),
          createBullet(
            'Created with code, title, creditHours, instructor, and reused Department enum.',
            'Course Entity',
          ),
          createBullet(
            'Populated with 6 initial courses with credit hours summing to exactly 17.',
            'Seed Data (data/courses.json)',
          ),
          createBullet(
            'Defined Symbol token COURSE_STORE, CourseStore interface, InMemoryCourseStore, and JsonFileCourseStore.',
            'Dynamic Store Provider',
          ),
          createBullet(
            'Provided with useFactory, injecting APP_CONFIG and AppLogger. When STORAGE=memory, it logs "Using memory storage" and instantiates InMemoryCourseStore; otherwise it logs "Using file storage".',
            'Storage Factory',
          ),
          createBullet(
            'Class provider calculating totalCredits(courses) and overload status where > 18 credits is overloaded.',
            'CreditService',
          ),
          createBullet(
            'Custom logging service logging every course creation and deletion to console and logs/app.log when LOG_TO_FILE=true.',
            'AppLogger',
          ),

          createHeading2('1.2 Task 1 Conceptual Answers (from ANSWERS.md)'),
          createBullet(
            'In TypeScript, interfaces are purely compile-time type constructs that are completely erased during transpilation into JavaScript (type erasure). Because injection tokens must exist at runtime so the NestJS IoC container can locate and wire dependencies in its registry, interfaces cannot serve as runtime tokens; runtime identifiers such as strings, Symbols, or classes must be used instead.',
            '(a) Why can an interface not be an injection token?',
          ),
          createBullet(
            'In NestJS, providers are singletons by default (application scope). This means the IoC container instantiates only a single instance of the provider during application bootstrap, caches it, and injects that same shared instance into every class or service throughout the application that requests it.',
            '(b) What does it mean that a provider is a singleton?',
          ),
          createBullet(
            'In CoursesModule, CoursesService must be added to the exports array (exports: [CoursesService]). Then in OtherModule, CoursesModule must be added to the imports array (imports: [CoursesModule]), enabling OtherModule to inject and use CoursesService.',
            '(c) What must you write so that OtherModule can use CoursesService?',
          ),

          createHeading2('1.3 Task 1 Visual Outputs & Screenshots'),
          ...createImageParagraph(
            'screenshots/task1-stats-and-crud.png',
            'GET /api/courses/stats returning 200 OK (totalCourses: 6, totalCredits: 17, overloaded: false), followed by POST 201 and DELETE 204',
            580,
            280,
          ),
          ...createImageParagraph(
            'screenshots/task1-app-log.png',
            'Terminal output and logs/app.log verifying file logging with LOG_TO_FILE=true and STORAGE=memory',
            580,
            240,
          ),

          // ==================== TASK 2 ====================
          createHeading1('Task 2 — Pluggable Fee Policy (Custom Providers)'),
          createParagraph(
            'The administration calculates semester tuition fees based on a pluggable strategy pattern. The calculation policy is interchangeable via environment variables without requiring any modification to FeesService.',
          ),

          createHeading2('2.1 Implementation Details'),
          createBullet(
            'Declared calculate(creditHours, cgpa, ratePerCreditHour): number and the Symbol token FEE_POLICY.',
            'FeePolicy Interface',
          ),
          createBullet(
            'Calculates fee as creditHours * rate (no discount regardless of CGPA).',
            'StandardFeePolicy',
          ),
          createBullet(
            'Provides 50% discount for CGPA >= 3.5, 25% discount for CGPA >= 3.0, and 0% discount below 3.0.',
            'MeritFeePolicy',
          ),
          createBullet(
            'Provided using string token FEE_RATE and useValue (5000 per credit hour).',
            'Fee Rate Provider',
          ),
          createBullet(
            'Dynamically selects policy based on process.env.FEE_POLICY ("merit" or "standard"), logs the active policy, and returns the policy instance.',
            'Policy Factory',
          ),
          createBullet(
            'Created alias { provide: "FEE_CALCULATOR", useExisting: FeesService } and injected into FeesInfoController for GET /api/fees/info.',
            'Provider Alias (useExisting)',
          ),

          createHeading2('2.2 Dual Policy Verification Results'),
          createParagraph(
            'The application was run twice with the identical request: GET /api/fees/BSCS-023?creditHours=12 (Student: Sara Ahmed, CGPA: 3.8):',
          ),
          createBullet(
            'Returns total: 60,000 PKR (12 credits * 5000 rate).',
            'Under Standard Policy (FEE_POLICY=standard)',
          ),
          createBullet(
            'Returns total: 30,000 PKR (50% discount applied for CGPA 3.8 >= 3.5).',
            'Under Merit Policy (FEE_POLICY=merit)',
          ),
          createBullet(
            'Returns { policy: "merit", ratePerCreditHour: 5000 }.',
            'Alias Endpoint (GET /api/fees/info)',
          ),

          createHeading2('2.3 Task 2 Screenshots'),
          ...createImageParagraph(
            'screenshots/task2-standard-policy.png',
            'GET /api/fees/BSCS-023?creditHours=12 under Standard Fee Policy (Total: 60,000 PKR)',
            580,
            250,
          ),
          ...createImageParagraph(
            'screenshots/task2-merit-policy.png',
            'GET /api/fees/BSCS-023?creditHours=12 under Merit Fee Policy (Total: 30,000 PKR with 50% discount)',
            580,
            250,
          ),
          ...createImageParagraph(
            'screenshots/task2-fee-info-alias.png',
            'GET /api/fees/info injected via FEE_CALCULATOR useExisting provider alias',
            580,
            215,
          ),

          // ==================== TASK 3 ====================
          createHeading1('Task 3 — DTOs and Validation'),
          createParagraph(
            'Incoming requests are strictly validated and transformed using class-validator and class-transformer. The global ValidationPipe enforces whitelist: true and forbidNonWhitelisted: true, formatting errors into a standard details array.',
          ),

          createHeading2('3.1 DTO Definitions & Validation Rules'),
          createBullet(
            'code (trimmed, uppercase, pattern ^CS-\\d{3}L?$), title (min 3 chars), creditHours (int 1-4), instructor (min 3 chars), department (enum), description (max 200 chars), tags (array max 5, each lowercased).',
            'CreateCourseDto',
          ),
          createBullet(
            'Defined as PartialType(OmitType(CreateCourseDto, ["code"] as const)). Omitting code guarantees code cannot be modified on PUT/PATCH.',
            'UpdateCourseDto',
          ),
          createBullet(
            'search, department, minCredits (@Type number, int 1-4), sort (only creditHours), order (asc/desc), limit (int 1-50).',
            'QueryCourseDto',
          ),
          createBullet(
            'Transforms code to uppercase and enforces pattern ^CS-\\d{3}L?$ on all :code routes.',
            'CodeParamDto',
          ),
          createBullet(
            'creditHours required, @Type number, integer 1 to 24.',
            'FeeQueryDto',
          ),

          createHeading2('3.2 Validation Test Cases & Decorator Mapping'),
          createParagraph(
            'All required valid and invalid requests were executed against the running API. Below is the summary table recorded in RESULTS.md:',
          ),

          createBullet(
            'Status 201 Created. Values cleaned: CS-420, Compilers, tags lowercased.',
            '1. Valid Course Cleaned (@Transform)',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: @IsInt on creditHours (text "3" is non-numeric).',
            '2. Number Sent as Text',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: @Matches on code, @MinLength on title, @Max on creditHours.',
            '3. Multiple Field Validation Errors',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: @ArrayMaxSize(5) on tags (6 tags sent).',
            '4. Too Many Tags',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: @Type gives NaN, failing @IsInt.',
            '5. Non-Numeric minCredits in Query',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: @IsIn(["creditHours"]) on sort property.',
            '6. Invalid Sort Property',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: CodeParamDto pattern fails before reaching controller logic.',
            '7. Invalid Code in URL Param (/api/courses/abc)',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: @IsDefined on creditHours.',
            '8. Missing Required Query Parameter (/api/fees/BSCS-023)',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: forbidNonWhitelisted rejected omitted "code" field.',
            '9. Omitted Field on PATCH (/api/courses/CS-301L with code)',
          ),
          createBullet(
            'Status 400 Bad Request. Failed: forbidNonWhitelisted rejected unknown property "isAdmin".',
            '10. Extra Non-Whitelisted Property on POST (isAdmin: true)',
          ),

          createHeading2('3.3 Task 3 Screenshots'),
          ...createImageParagraph(
            'screenshots/task3-valid-cleaned.png',
            'POST /api/courses returning 201 Created with transformer-cleaned fields',
            580,
            305,
          ),
          ...createImageParagraph(
            'screenshots/task3-invalid-course.png',
            'POST /api/courses returning 400 Bad Request with 3 validation messages in details',
            580,
            270,
          ),
          ...createImageParagraph(
            'screenshots/task3-whitelist-test.png',
            'Rejection of non-whitelisted property (isAdmin: true) and omitted property on PATCH',
            580,
            295,
          ),

          // ==================== TASK 4 ====================
          createHeading1('Task 4 — Automated Tests and Postman Suite'),
          createParagraph(
            'Automated testing verifies the reliability of dependency injection and validation across unit tests, end-to-end supertest integration tests, and a complete Newman/Postman runner suite.',
          ),

          createHeading2('4.1 Test Suites Implementation'),
          createBullet(
            '7 unit tests using Test.createTestingModule with InMemoryCourseStore and mock AppLogger covering list, single course, 404 on unknown, create, 409 duplicate conflict, delete, and logger interaction.',
            'src/courses/courses.service.spec.ts',
          ),
          createBullet(
            '9 unit tests covering StandardFeePolicy and MeritFeePolicy across exact CGPA boundaries (3.0, 3.5, and below 3.0).',
            'src/fees/fee-policies.spec.ts',
          ),
          createBullet(
            '6 unit tests using plainToInstance and validate testing valid data, transformations, every invalid field, numbers sent as text, whitelist constraints, and array limits.',
            'src/courses/dto/create-course.dto.spec.ts',
          ),
          createBullet(
            '7 e2e tests using supertest overriding COURSE_STORE with an in-memory store and registering global createValidationPipe().',
            'test/courses.e2e-spec.ts',
          ),
          createBullet(
            '18 automated requests (12 negative tests for 400, 404, 409). Request 3 dynamically saves newCode, and Request 18 issues DELETE to clean up, allowing the collection to pass twice consecutively with 0 failures.',
            'Postman Collection (postman/Lab08_Tasks.postman_collection.json)',
          ),

          createHeading2('4.2 Task 4 Screenshots'),
          ...createImageParagraph(
            'screenshots/npm-test.png',
            'npm test passing all 22 unit tests across 3 test suites',
            580,
            260,
          ),
          ...createImageParagraph(
            'screenshots/e2e.png',
            'npm run test:e2e passing all 7 integration tests with supertest and store overrides',
            580,
            345,
          ),
          ...createImageParagraph(
            'screenshots/runner.png',
            'Postman Collection Runner passing 18 of 18 requests and 31 of 31 assertions with 0 failures',
            580,
            420,
          ),

          // ==================== CONCLUSION ====================
          createHeading1('5. Conclusion & Submission Summary'),
          createParagraph(
            'All requirements for Lab 08 were successfully fulfilled. The NestJS application demonstrates clean architectural separation with constructor injection, dynamic factory providers, custom Symbol and string tokens, DTO validation, comprehensive automated testing, and a re-runnable Postman test suite.',
          ),
          createBullet(
            'Complete source code including all modules, providers, DTOs, tests, and configuration.',
            'Git Repository',
          ),
          createBullet(
            'postman/Lab08_Tasks.postman_collection.json ready for Newman or Postman Collection Runner.',
            'Postman Collection',
          ),
          createBullet(
            'Screenshots for npm test, e2e tests, and collection runner embedded in screenshots/ directory.',
            'Visual Proof',
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath1 = path.resolve(process.cwd(), 'Reyyan_Alam_242813_Lab08_Report.docx');
  const outPath2 = path.resolve(process.cwd(), '..', 'Reyyan_Alam_242813_Lab08_Report.docx');
  const outPath3 = path.resolve('C:\\Users\\242813\\Desktop', 'Reyyan_Alam_242813_Lab08_Report.docx');

  fs.writeFileSync(outPath1, buffer);
  console.log(`Report created: ${outPath1}`);

  try {
    fs.writeFileSync(outPath2, buffer);
    console.log(`Report copied: ${outPath2}`);
  } catch {}

  try {
    fs.writeFileSync(outPath3, buffer);
    console.log(`Report copied to Desktop: ${outPath3}`);
  } catch {}
}

buildDocx().catch((err) => {
  console.error('Error generating docx report:', err);
  process.exit(1);
});
