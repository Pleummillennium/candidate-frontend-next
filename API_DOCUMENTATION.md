# Candidate Management System - API Documentation

เอกสารการใช้งาน API สำหรับ Frontend Developers

---

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Candidates (Tasks)](#candidates-tasks-endpoints)
  - [Comments](#comments-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Overview

Backend API เป็น RESTful API ที่พัฒนาด้วย Go (Gin Framework) ใช้สำหรับจัดการข้อมูล Candidates ในระบบสัมภาษณ์งาน

**Tech Stack:**
- Language: Go
- Framework: Gin
- Database: PostgreSQL
- Authentication: JWT (JSON Web Token)

---

## Base URL

### Production
```
https://candidate-backend-api-production.up.railway.app
```

### Local Development
```
http://localhost:8080
```

---

## Authentication

API ใช้ **JWT (Bearer Token)** สำหรับการ authentication

### วิธีการใช้งาน:

1. **Login/Register** เพื่อรับ Token
2. **เก็บ Token** ใน localStorage
3. **ส่ง Token** ใน Header ทุก request (ยกเว้น public routes)

### Header Format:
```http
Authorization: Bearer <your-jwt-token>
```

### Public Routes (ไม่ต้อง Token):
- `POST /auth/register`
- `POST /auth/login`
- `GET /health`

### Protected Routes (ต้องมี Token):
- ทุก endpoint ที่ขึ้นต้นด้วย `/api/*`

---

## Endpoints

---

## Authentication Endpoints

### 1. Register (สมัครสมาชิก)

**จุดประสงค์:** สร้าง account ใหม่สำหรับผู้ใช้

**Endpoint:**
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```http
Status: 201 Created
```
```json
{
  "message": "User registered successfully"
}
```

**Response (Error):**
```json
{
  "error": "Email already exists"
}
```

**Frontend Usage:**
```typescript
const response = await authService.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});
```

---

### 2. Login (เข้าสู่ระบบ)

**จุดประสงค์:** เข้าสู่ระบบและรับ JWT Token

**Endpoint:**
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```http
Status: 200 OK
```
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-23T10:00:00Z",
    "updated_at": "2025-01-23T10:00:00Z"
  }
}
```

**Frontend Usage:**
```typescript
const { token, user } = await authService.login({
  email: "john@example.com",
  password: "password123"
});

// เก็บ token ใน localStorage
localStorage.setItem('auth_token', token);
localStorage.setItem('user', JSON.stringify(user));
```

---

## Candidates (Tasks) Endpoints

> **Note:** Backend เรียก resource นี้ว่า "Tasks" แต่ใน Frontend เราใช้คำว่า "Candidates"

---

### 3. Get All Candidates (รายการผู้สมัครทั้งหมด)

**จุดประสงค์:** ดึงรายการ Candidates ทั้งหมด (ไม่รวมที่ถูก archive)

**Endpoint:**
```http
GET /api/tasks
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | หน้าที่ต้องการ | `?page=1` |
| `limit` | number | จำนวนรายการต่อหน้า | `?limit=10` |
| `search` | string | ค้นหาจากชื่อ | `?search=john` |
| `status` | string | Filter ตาม status | `?status=To Do` |

**Response:**
```http
Status: 200 OK
```
```json
[
  {
    "id": 1,
    "title": "John Doe",
    "description": "Senior Developer, 5 years exp in React",
    "status": "To Do",
    "creator_id": 1,
    "creator_name": "HR Manager",
    "due_date": "2025-02-01T14:00:00Z",
    "archived": false,
    "created_at": "2025-01-23T10:00:00Z",
    "updated_at": "2025-01-23T10:00:00Z"
  },
  {
    "id": 2,
    "title": "Jane Smith",
    "description": "Frontend Developer",
    "status": "In Progress",
    "creator_id": 1,
    "creator_name": "HR Manager",
    "due_date": "2025-01-25T10:00:00Z",
    "archived": false,
    "created_at": "2025-01-22T09:00:00Z",
    "updated_at": "2025-01-23T11:00:00Z"
  }
]
```

**Status Values:**
- `"To Do"` - รอสัมภาษณ์
- `"In Progress"` - กำลังสัมภาษณ์
- `"Done"` - สัมภาษณ์เสร็จแล้ว

**Frontend Usage:**
```typescript
const candidates = await taskService.getAll({
  page: 1,
  limit: 10,
  status: 'To Do'
});
```

---

### 4. Get Archived Candidates (รายการที่ Archive แล้ว)

**จุดประสงค์:** ดึงรายการ Candidates ที่ถูก archive

**Endpoint:**
```http
GET /api/tasks/archived
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```http
Status: 200 OK
```
```json
[
  {
    "id": 5,
    "title": "Old Candidate",
    "description": "Archived candidate",
    "status": "Done",
    "archived": true,
    ...
  }
]
```

**Frontend Usage:**
```typescript
const archivedCandidates = await taskService.getArchived();
```

---

### 5. Get Single Candidate (ดูรายละเอียด)

**จุดประสงค์:** ดึงข้อมูลรายละเอียด Candidate คนเดียว

**Endpoint:**
```http
GET /api/tasks/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | Candidate ID |

**Example:**
```http
GET /api/tasks/1
```

**Response:**
```http
Status: 200 OK
```
```json
{
  "id": 1,
  "title": "John Doe",
  "description": "Senior Developer, 5 years exp in React",
  "status": "To Do",
  "creator_id": 1,
  "creator_name": "HR Manager",
  "due_date": "2025-02-01T14:00:00Z",
  "archived": false,
  "created_at": "2025-01-23T10:00:00Z",
  "updated_at": "2025-01-23T10:00:00Z"
}
```

**Frontend Usage:**
```typescript
const candidate = await taskService.getById(1);
```

---

### 6. Create Candidate (เพิ่ม Candidate ใหม่)

**จุดประสงค์:** สร้าง Candidate ใหม่

**Endpoint:**
```http
POST /api/tasks
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "John Doe",
  "description": "Senior React Developer with 5 years experience",
  "status": "To Do",
  "due_date": "2025-02-01T14:00:00Z"
}
```

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ Yes | ชื่อ Candidate |
| `description` | string | ❌ No | รายละเอียด/Resume |
| `status` | string | ❌ No | Default: "To Do" |
| `due_date` | string (ISO) | ❌ No | วันสัมภาษณ์ |

**Response:**
```http
Status: 201 Created
```
```json
{
  "id": 3,
  "title": "John Doe",
  "description": "Senior React Developer with 5 years experience",
  "status": "To Do",
  "creator_id": 1,
  "creator_name": "HR Manager",
  "due_date": "2025-02-01T14:00:00Z",
  "archived": false,
  "created_at": "2025-01-23T15:00:00Z",
  "updated_at": "2025-01-23T15:00:00Z"
}
```

**Frontend Usage:**
```typescript
const newCandidate = await taskService.create({
  title: "John Doe",
  description: "Senior React Developer",
  status: "To Do",
  due_date: "2025-02-01T14:00:00Z"
});
```

---

### 7. Update Candidate (แก้ไขข้อมูล)

**จุดประสงค์:** แก้ไขข้อมูล Candidate

**Endpoint:**
```http
PUT /api/tasks/:id
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (ส่งแค่ field ที่ต้องการแก้):**
```json
{
  "title": "John Doe (Updated)",
  "status": "In Progress"
}
```

**Response:**
```http
Status: 200 OK
```
```json
{
  "id": 1,
  "title": "John Doe (Updated)",
  "description": "Senior Developer, 5 years exp in React",
  "status": "In Progress",
  "creator_id": 1,
  "creator_name": "HR Manager",
  "due_date": "2025-02-01T14:00:00Z",
  "archived": false,
  "created_at": "2025-01-23T10:00:00Z",
  "updated_at": "2025-01-23T16:00:00Z"
}
```

**Frontend Usage:**
```typescript
const updated = await taskService.update(1, {
  status: "In Progress"
});
```

---

### 8. Delete Candidate (ลบ)

**จุดประสงค์:** ลบ Candidate (soft delete)

**Endpoint:**
```http
DELETE /api/tasks/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```http
Status: 200 OK
```
```json
{
  "message": "Task deleted successfully"
}
```

**Frontend Usage:**
```typescript
await taskService.delete(1);
```

---

### 9. Archive Candidate

**จุดประสงค์:** Archive Candidate (ซ่อนจากรายการหลัก)

**Endpoint:**
```http
POST /api/tasks/:id/archive
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```http
Status: 200 OK
```
```json
{
  "message": "Task archived successfully"
}
```

**Frontend Usage:**
```typescript
await taskService.archive(1);
```

---

### 10. Unarchive Candidate

**จุดประสงค์:** นำ Candidate กลับมาจาก archive

**Endpoint:**
```http
POST /api/tasks/:id/unarchive
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```http
Status: 200 OK
```
```json
{
  "message": "Task unarchived successfully"
}
```

**Frontend Usage:**
```typescript
await taskService.unarchive(1);
```

---

### 11. Get Task Logs (ประวัติการแก้ไข)

**จุดประสงค์:** ดูประวัติการเปลี่ยนแปลงของ Candidate

**Endpoint:**
```http
GET /api/tasks/:id/logs
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```http
Status: 200 OK
```
```json
[
  {
    "id": 1,
    "task_id": 1,
    "user_id": 1,
    "user_name": "HR Manager",
    "action": "UPDATE",
    "field_name": "status",
    "old_value": "To Do",
    "new_value": "In Progress",
    "created_at": "2025-01-23T16:00:00Z"
  },
  {
    "id": 2,
    "task_id": 1,
    "user_id": 1,
    "user_name": "HR Manager",
    "action": "CREATE",
    "field_name": null,
    "old_value": null,
    "new_value": null,
    "created_at": "2025-01-23T10:00:00Z"
  }
]
```

**Frontend Usage:**
```typescript
const logs = await taskService.getLogs(1);
```

---

## Comments Endpoints

---

### 12. Get Comments (ดึง Comments ของ Candidate)

**จุดประสงค์:** ดึงบันทึกการสัมภาษณ์/ความคิดเห็นทั้งหมดของ Candidate

**Endpoint:**
```http
GET /api/tasks/:id/comments
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```http
Status: 200 OK
```
```json
[
  {
    "id": 1,
    "task_id": 1,
    "user_id": 1,
    "user_name": "HR Manager",
    "content": "Good technical skills, passed first round",
    "created_at": "2025-01-23T11:00:00Z",
    "updated_at": "2025-01-23T11:00:00Z"
  },
  {
    "id": 2,
    "task_id": 1,
    "user_id": 2,
    "user_name": "Tech Lead",
    "content": "Strong problem-solving abilities",
    "created_at": "2025-01-23T14:00:00Z",
    "updated_at": "2025-01-23T14:00:00Z"
  }
]
```

**Frontend Usage:**
```typescript
const comments = await commentService.getByTaskId(1);
```

---

### 13. Create Comment (เพิ่ม Comment)

**จุดประสงค์:** เพิ่มบันทึกการสัมภาษณ์/ความคิดเห็น

**Endpoint:**
```http
POST /api/tasks/:id/comments
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Excellent communication skills, recommend for second round"
}
```

**Response:**
```http
Status: 201 Created
```
```json
{
  "id": 3,
  "task_id": 1,
  "user_id": 1,
  "user_name": "HR Manager",
  "content": "Excellent communication skills, recommend for second round",
  "created_at": "2025-01-23T15:30:00Z",
  "updated_at": "2025-01-23T15:30:00Z"
}
```

**Frontend Usage:**
```typescript
const comment = await commentService.create(1, {
  content: "Great candidate!"
});
```

---

### 14. Update Comment (แก้ไข Comment)

**จุดประสงค์:** แก้ไข Comment ที่สร้างไว้

**Endpoint:**
```http
PUT /api/comments/:id
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Updated: Very strong technical background"
}
```

**Response:**
```http
Status: 200 OK
```
```json
{
  "id": 1,
  "task_id": 1,
  "user_id": 1,
  "user_name": "HR Manager",
  "content": "Updated: Very strong technical background",
  "created_at": "2025-01-23T11:00:00Z",
  "updated_at": "2025-01-23T16:00:00Z"
}
```

**Frontend Usage:**
```typescript
const updated = await commentService.update(1, {
  content: "Updated feedback"
});
```

---

### 15. Delete Comment (ลบ Comment)

**จุดประสงค์:** ลบ Comment

**Endpoint:**
```http
DELETE /api/comments/:id
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```http
Status: 200 OK
```
```json
{
  "message": "Comment deleted successfully"
}
```

**Frontend Usage:**
```typescript
await commentService.delete(1);
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200` | Success - Request ผ่าน |
| `201` | Created - สร้างข้อมูลสำเร็จ |
| `400` | Bad Request - ข้อมูลไม่ถูกต้อง |
| `401` | Unauthorized - ไม่มี Token หรือ Token หมดอายุ |
| `403` | Forbidden - ไม่มีสิทธิ์ |
| `404` | Not Found - ไม่พบข้อมูล |
| `500` | Internal Server Error - ระบบ Error |

### Error Response Format

```json
{
  "error": "Error message here",
  "message": "Detailed error description"
}
```

### ตัวอย่าง Error Responses:

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**400 Bad Request:**
```json
{
  "error": "Validation Error",
  "message": "Title is required"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Task with ID 999 not found"
}
```

---

## Examples

### Complete Flow Example

```typescript
// 1. Register
await authService.register({
  name: "Jane HR",
  email: "jane@company.com",
  password: "secure123"
});

// 2. Login
const { token, user } = await authService.login({
  email: "jane@company.com",
  password: "secure123"
});

// Token จะถูกเก็บอัตโนมัติใน localStorage

// 3. Get all candidates
const candidates = await taskService.getAll();

// 4. Create new candidate
const newCandidate = await taskService.create({
  title: "Sarah Developer",
  description: "Full-stack developer with 3 years experience",
  status: "To Do",
  due_date: "2025-02-15T10:00:00Z"
});

// 5. Add interview note
await commentService.create(newCandidate.id, {
  content: "Phone screening: Good technical background, schedule onsite"
});

// 6. Update status after interview
await taskService.update(newCandidate.id, {
  status: "In Progress"
});

// 7. Add final feedback
await commentService.create(newCandidate.id, {
  content: "Final round: Excellent fit, recommend hire"
});

// 8. Mark as done
await taskService.update(newCandidate.id, {
  status: "Done"
});

// 9. Archive old candidates
await taskService.archive(oldCandidateId);
```

---

## Notes

### Date Format
- ใช้ ISO 8601 format: `2025-01-23T10:00:00Z`
- JavaScript: `new Date().toISOString()`

### Pagination
- Default: `page=1, limit=10`
- Max limit: `100`

### Rate Limiting
- Backend มี rate limiting middleware
- ควรจัดการ retry logic ใน Frontend

### CORS
- Backend อนุญาต localhost และ vercel.app
- Production URL ต้องลงท้ายด้วย `.vercel.app`

---

## Support

หากพบปัญหาหรือต้องการความช่วยเหลือ:
- Backend Repository: [candidate-backend-api](https://github.com/Pleummillennium/candidate-backend-api)
- Frontend Repository: [candidate-frontend-next](https://github.com/Pleummillennium/candidate-frontend-next)

---

**Last Updated:** January 23, 2025
