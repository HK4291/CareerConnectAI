# CareerPilot AI Backend API Documentation

## Overview

- Base URL prefix: `/api/v1`
- Default request body format: `application/json`
- Resume upload request body format: `multipart/form-data`
- Protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

## Response Format

Most successful responses use:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Some ATS endpoints return:

```json
{
  "success": true,
  "message": "Resume analyzed successfully.",
  "data": {}
}
```

Error responses use:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field": ["Error message"]
  }
}
```

## Authentication

### Register

`POST /api/v1/auth/register`

Creates a user and starts email verification.

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123",
  "phone": "+919876543210",
  "role": "CANDIDATE"
}
```

Notes:

- `phone` is optional.
- `role` is optional. Allowed values: `CANDIDATE`, `RECRUITER`, `ADMIN`.
- Password must be 8-128 characters and include uppercase, lowercase, and a number.

### Verify Email

`POST /api/v1/auth/verify-email`

Verifies signup OTP and sets `accessToken` and `refreshToken` HTTP-only cookies.

Request body:

```json
{
  "email": "jane@example.com",
  "otp": "123456"
}
```

### Login

`POST /api/v1/auth/login`

Authenticates a user and sets `accessToken` and `refreshToken` HTTP-only cookies.

Request body:

```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```

### Refresh Token

`POST /api/v1/auth/refresh-token`

Refreshes the auth token pair.

Request body:

```json
{
  "refreshToken": "<refresh-token>"
}
```

### Logout

`POST /api/v1/auth/logout`

Protected: Yes

Revokes the provided refresh token.

Request body:

```json
{
  "refreshToken": "<refresh-token>"
}
```

### Forgot Password

`POST /api/v1/auth/forgot-password`

Starts password reset flow.

Request body:

```json
{
  "email": "jane@example.com"
}
```

### Reset Password

`POST /api/v1/auth/reset-password`

Completes password reset with token and OTP.

Request body:

```json
{
  "token": "<reset-token>",
  "otp": "123456",
  "newPassword": "NewPassword123"
}
```

## Health

### Health Check

`GET /api/v1/health`

Checks service health.

Protected: No

## Candidate Profile

All candidate endpoints are protected.

### Get My Profile

`GET /api/v1/candidate/me`

Returns the authenticated candidate profile.

### Update Profile

`PATCH /api/v1/candidate`

Updates authenticated candidate profile fields.

Request body:

```json
{
  "headline": "Backend Developer",
  "bio": "Software engineer with experience building APIs.",
  "preferredRole": "Node.js Developer",
  "preferredLocation": "Remote",
  "expectedSalary": 1200000,
  "experienceYears": 3
}
```

All fields are optional.

### Delete Profile

`DELETE /api/v1/candidate`

Deletes the authenticated candidate profile.

### Get Profile Stats

`GET /api/v1/candidate/stats`

Returns candidate profile completion and related stats.

## Education

All education endpoints are protected.

### Create Education

`POST /api/v1/education`

Request body:

```json
{
  "institution": "University Name",
  "degree": "B.Tech",
  "fieldOfStudy": "Computer Science",
  "grade": "8.5 CGPA",
  "startDate": "2020-08-01",
  "endDate": "2024-06-01",
  "currentlyStudying": false,
  "description": "Relevant coursework and achievements."
}
```

Required: `institution`, `degree`, `fieldOfStudy`, `startDate`.

### Get Educations

`GET /api/v1/education`

Returns education records for the authenticated candidate.

### Update Education

`PATCH /api/v1/education/:id`

Updates an education record. `id` must be a CUID.

Request body: any subset of create education fields.

### Delete Education

`DELETE /api/v1/education/:id`

Deletes an education record. `id` must be a CUID.

## Experience

All experience endpoints are protected.

Allowed `employmentType` values:

`FULL_TIME`, `PART_TIME`, `INTERN`, `CONTRACT`, `FREELANCE`, `SELF_EMPLOYED`, `TRAINEE`

### Create Experience

`POST /api/v1/experience`

Request body:

```json
{
  "company": "Acme Inc",
  "designation": "Software Engineer",
  "employmentType": "FULL_TIME",
  "location": "Bengaluru",
  "isCurrent": true,
  "startDate": "2023-01-01",
  "endDate": "2024-01-01",
  "description": "Worked on backend APIs and integrations."
}
```

Required: `company`, `designation`, `startDate`.

### Get Experiences

`GET /api/v1/experience`

Returns experience records for the authenticated candidate.

### Update Experience

`PATCH /api/v1/experience/:id`

Updates an experience record. `id` must be a CUID.

Request body: any subset of create experience fields.

### Delete Experience

`DELETE /api/v1/experience/:id`

Deletes an experience record. `id` must be a CUID.

## Skills

All skill endpoints are protected.

Allowed `level` values:

`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`

### Create Skill

`POST /api/v1/skills`

Request body:

```json
{
  "name": "Node.js",
  "category": "Backend",
  "level": "ADVANCED",
  "experienceYears": 3
}
```

Required: `name`.

### Get Skills

`GET /api/v1/skills`

Returns skills for the authenticated candidate.

### Update Skill

`PATCH /api/v1/skills/:id`

Updates a skill mapping. `id` must be a CUID.

Request body:

```json
{
  "level": "EXPERT",
  "experienceYears": 4
}
```

### Delete Skill

`DELETE /api/v1/skills/:id`

Deletes a skill mapping. `id` must be a CUID.

## Projects

All project endpoints are protected.

### Create Project

`POST /api/v1/projects`

Request body:

```json
{
  "title": "CareerPilot AI",
  "description": "AI career assistant platform.",
  "githubUrl": "https://github.com/example/project",
  "liveUrl": "https://example.com",
  "technologies": ["Node.js", "PostgreSQL", "Prisma"],
  "startDate": "2024-01-01",
  "endDate": "2024-06-01"
}
```

Required: `title`.

### Get Projects

`GET /api/v1/projects`

Returns projects for the authenticated candidate.

### Update Project

`PATCH /api/v1/projects/:id`

Updates a project. `id` must be a CUID.

Request body: any subset of create project fields.

### Delete Project

`DELETE /api/v1/projects/:id`

Deletes a project. `id` must be a CUID.

## Certificates

All certificate endpoints are protected.

### Create Certificate

`POST /api/v1/certificate`

Request body:

```json
{
  "name": "AWS Certified Developer",
  "issuer": "AWS",
  "issueDate": "2024-01-01",
  "expiryDate": "2027-01-01",
  "credentialId": "ABC123",
  "credentialUrl": "https://example.com/certificate"
}
```

Required: `name`, `issuer`, `issueDate`.

### Get Certificates

`GET /api/v1/certificate`

Returns certificates for the authenticated candidate.

### Update Certificate

`PATCH /api/v1/certificate/:id`

Updates a certificate. `id` must be a CUID.

Request body: any subset of create certificate fields.

### Delete Certificate

`DELETE /api/v1/certificate/:id`

Deletes a certificate. `id` must be a CUID.

## Resumes

All resume endpoints are protected.

Upload constraints:

- Field name: `resume`
- Supported MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Maximum file size: 5 MB

### Upload Resume

`POST /api/v1/resumes`

Uploads, parses, stores, and marks a resume active.

Request body: `multipart/form-data`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `resume` | file | Yes | PDF or DOCX resume |

Processing:

- Extracts raw text from PDF/DOCX.
- Sends text to NVIDIA AI for structured resume parsing.
- Stores `rawText`, `parsedData`, and `parseStatus`.
- Uploads the file to the configured storage provider.

### Get Resumes

`GET /api/v1/resumes`

Returns all resumes for the authenticated candidate.

### Get Active Resume

`GET /api/v1/resumes/active`

Returns the active resume for the authenticated candidate.

### Delete Resume

`DELETE /api/v1/resumes/:resumeId`

Deletes a resume. `resumeId` must reference a resume owned by the authenticated candidate.

### Import Parsed Resume Data

`POST /api/v1/resumes/:resumeId/import`

Imports parsed resume data into candidate profile modules.

Request body:

```json
{
  "skills": true,
  "education": true,
  "experience": true,
  "projects": true,
  "certificates": true
}
```

All fields are optional booleans and default to enabled in the DTO.

### Get Resume Versions

`GET /api/v1/resumes/:resumeId/versions`

Returns version snapshots for a resume.

## ATS

All ATS endpoints are protected.

### Analyze Saved Resume

`POST /api/v1/ats/analyze/:resumeId`

Analyzes an already uploaded resume.

Processing:

- Validates resume ownership.
- Requires `parseStatus` to be `SUCCESS`.
- Requires stored `rawText` and `parsedData`.
- Sends parsed resume data to NVIDIA AI for ATS scoring.
- Upserts a `resume_analyses` record.

Response data shape:

```json
{
  "overallScore": 78,
  "breakdown": {
    "contactInformation": 9,
    "summary": 7,
    "education": 8,
    "experience": 8,
    "projects": 7,
    "skills": 8,
    "formatting": 7,
    "atsCompatibility": 8
  },
  "strengths": ["Clear technical skills section"],
  "weaknesses": ["Limited quantified impact"],
  "missingSections": ["Certifications"],
  "suggestions": ["Add measurable achievements to experience bullets"],
  "priorityImprovements": ["Quantify project and work experience outcomes"]
}
```

### Quick Analyze Uploaded Resume

`POST /api/v1/ats/analyze`

Uploads a resume and returns ATS analysis without saving the resume record.

Request body: `multipart/form-data`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `resume` | file | Yes | PDF or DOCX resume |

Processing:

- Extracts raw text from the uploaded file.
- Sends text to NVIDIA AI for structured resume parsing.
- Sends parsed resume data to NVIDIA AI for ATS scoring.
- Returns the ATS analysis response directly.

## Common Status Codes

| Status | Meaning |
| --- | --- |
| `200` | Request completed successfully |
| `201` | Resource created successfully |
| `400` | Validation failed or invalid file type |
| `401` | Missing or invalid authorization |
| `403` | Authenticated user does not own the resource |
| `404` | Resource not found |
| `409` | Resume parsing state is not ready for analysis |
| `429` | AI provider rate limit exceeded |
| `500` | Internal server error or invalid AI key configuration |
| `502` | AI provider failed, timed out, or returned invalid output |
