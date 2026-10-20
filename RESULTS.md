# Lab 08 Task 3 — Validation Results

This document records the actual responses for the valid and invalid test cases described in Task 3, showing the decorators responsible for each message and verifying the behavior of `whitelist` and `forbidNonWhitelisted`.

---

## Summary Table

| Request | Expected Status | Real Status | Reason / Decorators Producing Message |
| :--- | :---: | :---: | :--- |
| **1. POST** `{ code: "cs-420", title: " Compilers ", ... }` | 201 Created | 201 Created | `@Transform` trimmed title, converted code to uppercase (`CS-420`), and lowercased all tags. |
| **2. POST** with `creditHours: "3"` (text) | 400 Bad Request | 400 Bad Request | `@IsInt` failed because text string `"3"` was sent without conversion. |
| **3. POST** with `code: "CS3", title: "AI", creditHours: 9` | 400 Bad Request | 400 Bad Request | Three messages produced: `@Matches` on code, `@MinLength(3)` on title, and `@Max(4)` on creditHours. |
| **4. POST** with 6 tags | 400 Bad Request | 400 Bad Request | `@ArrayMaxSize(5)` failed because more than 5 tags were sent in the array. |
| **5. GET** `/api/courses?minCredits=abc` | 400 Bad Request | 400 Bad Request | `@Type(() => Number)` converted `"abc"` to `NaN`, failing `@IsInt`, `@Min`, and `@Max`. |
| **6. GET** `/api/courses?sort=title` | 400 Bad Request | 400 Bad Request | `@IsIn(['creditHours'])` failed because only `creditHours` is allowed as a sorting property. |
| **7. GET** `/api/courses/abc` | 400 Bad Request | 400 Bad Request | `CodeParamDto`'s `@Matches` pattern failed on route param before reaching the service (400, not 404). |
| **8. GET** `/api/fees/BSCS-023` (no creditHours) | 400 Bad Request | 400 Bad Request | `FeeQueryDto`'s `@IsDefined` failed because `creditHours` is a required query parameter. |
| **9. PATCH** `/api/courses/CS-301L` with `{ "code": "CS-999" }` | 400 Bad Request | 400 Bad Request | `forbidNonWhitelisted` triggered because `code` was omitted from `UpdateCourseDto` (`OmitType`). |
| **10. POST** with extra property `"isAdmin": true` | 400 Bad Request | 400 Bad Request | `forbidNonWhitelisted` triggered because `"isAdmin"` is not a whitelisted property in `CreateCourseDto`. |

---

## Detailed Responses and Decorator Analysis

### 1. Valid Course (Cleaned by class-transformer)
**Request:**
`POST /api/courses`
```json
{
  "code": " cs-420 ",
  "title": " Compilers ",
  "creditHours": 3,
  "instructor": "Dr. Hamza Rauf",
  "department": "Computer Science",
  "tags": ["Theory", "CORE"]
}
```
**Response: `201 Created`**
```json
{
  "code": "CS-420",
  "title": "Compilers",
  "creditHours": 3,
  "instructor": "Dr. Hamza Rauf",
  "department": "Computer Science",
  "tags": [
    "theory",
    "core"
  ]
}
```
**Comment:** `@Transform` cleaned all values: `code` was trimmed and capitalized to `CS-420`, `title` was trimmed to `Compilers`, and the elements in `tags` were converted to lowercase `["theory", "core"]`.

---

### 2. Number Sent as Text
**Request:**
`POST /api/courses`
```json
{
  "code": "CS-421",
  "title": "Compilers II",
  "creditHours": "3",
  "instructor": "Dr. Hamza Rauf",
  "department": "Computer Science"
}
```
**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "creditHours must be at most 4",
    "creditHours must be at least 1",
    "creditHours must be an integer"
  ]
}
```
**Comment:** Produced by `@IsInt({ message: 'creditHours must be an integer' })`. Because `CreateCourseDto` intentionally avoids `@Type(() => Number)`, text `"3"` is rejected as non-numeric.

---

### 3. Multiple Field Validation Errors
**Request:**
`POST /api/courses`
```json
{
  "code": "CS3",
  "title": "AI",
  "creditHours": 9,
  "instructor": "Dr. Hamza",
  "department": "Data Science"
}
```
**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "code must look like CS-301 or CS-301L",
    "title must be at least 3 characters",
    "creditHours must be at most 4"
  ]
}
```
**Comment:** 
- `code must look like CS-301 or CS-301L`: Produced by `@Matches(/^CS-\\d{3}L?$/)`.
- `title must be at least 3 characters`: Produced by `@MinLength(3)`.
- `creditHours must be at most 4`: Produced by `@Max(4)`.

---

### 4. Too Many Tags
**Request:**
`POST /api/courses`
```json
{
  "code": "CS-422",
  "title": "Advanced AI",
  "creditHours": 3,
  "instructor": "Dr. Hamza",
  "department": "Data Science",
  "tags": ["t1", "t2", "t3", "t4", "t5", "t6"]
}
```
**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "tags cannot contain more than 5 items"
  ]
}
```
**Comment:** Produced by `@ArrayMaxSize(5, { message: 'tags cannot contain more than 5 items' })`.

---

### 5. Non-Numeric minCredits in Query
**Request:**
`GET /api/courses?minCredits=abc`

**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "minCredits must be at most 4",
    "minCredits must be at least 1",
    "minCredits must be an integer"
  ]
}
```
**Comment:** Produced by `@Type(() => Number)` converting `"abc"` into `NaN`, causing `@IsInt` to fail.

---

### 6. Invalid Sort Field
**Request:**
`GET /api/courses?sort=title`

**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "sort must be creditHours"
  ]
}
```
**Comment:** Produced by `@IsIn(['creditHours'], { message: 'sort must be creditHours' })`.

---

### 7. Invalid Code Pattern in Route Parameter
**Request:**
`GET /api/courses/abc`

**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "code must look like CS-301 or CS-301L"
  ]
}
```
**Comment:** Produced by `CodeParamDto`'s `@Matches(/^CS-\\d{3}L?$/)`. The request is rejected at the DTO validation layer with status 400 before attempting any database lookup (which would have returned 404).

---

### 8. Missing Required Query Parameter for Fees
**Request:**
`GET /api/fees/BSCS-023`

**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "creditHours is required",
    "creditHours must be at most 24",
    "creditHours must be at least 1",
    "creditHours must be an integer"
  ]
}
```
**Comment:** Produced by `FeeQueryDto`'s `@IsDefined({ message: 'creditHours is required' })`.

---

### 9. Omitted Property Sent to PATCH (Whitelist Enforcement)
**Request:**
`PATCH /api/courses/CS-301L`
```json
{
  "code": "CS-999"
}
```
**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "property code should not exist"
  ]
}
```
**Comment:** Produced by `forbidNonWhitelisted: true`. Because `UpdateCourseDto` uses `OmitType(CreateCourseDto, ['code'] as const)`, `code` is omitted from the allowed properties list.

---

### 10. Extra Non-Whitelisted Property Sent to POST
**Request:**
`POST /api/courses`
```json
{
  "code": "CS-423",
  "title": "Cloud Computing",
  "creditHours": 3,
  "instructor": "Dr. Hamza",
  "department": "Computer Science",
  "isAdmin": true
}
```
**Response: `400 Bad Request`**
```json
{
  "statusCode": 400,
  "error": "Validation failed",
  "details": [
    "property isAdmin should not exist"
  ]
}
```
**Comment:** Produced by `forbidNonWhitelisted: true`. The property `"isAdmin"` is not defined on `CreateCourseDto` and is rejected.
