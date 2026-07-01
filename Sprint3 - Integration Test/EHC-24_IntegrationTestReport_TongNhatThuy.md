# Integration Test Report — Sprint 3
**Tác giả:** Tống Nhật Thúy
**Jira Task:** EHC-24
**Sprint:** Sprint 3 — Integration Test
**Project:** E-HealthCare System
**Ngày thực hiện:** 15/06/2026
---

## 1. Tổng quan
| Thông tin | Chi tiết |
| --- | --- |
| **Họ tên** | Tống Nhật Thúy |
| **Task phụ trách** | EHC-24 |
| **Loại kiểm thử** | Integration Test |
| **Phương pháp** | `@SpringBootTest` + `TestRestTemplate` + H2 In-Memory DB |
| **Công cụ** | JUnit 5, Spring Boot Test, H2, BCryptPasswordEncoder |
| **Database** | H2 In-Memory (`jdbc:h2:mem:testdb`) |
| **Tổng test cases** | 6 |
| **Passed** | ✅ 6 |
| **Failed** | ❌ 0 |
| **Thời gian chạy** | 2.401s |
---

## 2. Phạm vi kiểm thử
| Controller | Endpoint | Test Cases |
| --- | --- | --- |
| `AdminApiController` | `POST /api/admin/login` | 4 |
| `AdminApiController` | `POST /api/admin/logout` | 2 |
|  | **Tổng** | **6** |
---

## 3. Kiến trúc Integration Test
```text
HTTP Request (TestRestTemplate)
     │
     ▼
┌─────────────────────────────────────┐
│     Spring Security Filter Chain    │  ← JWT Validation / Auth Check
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│         REST Controller             │  ← AdminApiController
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│            Service Layer            │  ← Admin AuthService
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│         H2 In-Memory Database       │  ← test profile
└─────────────────────────────────────┘
```
---

## 4. Luồng nghiệp vụ kiểm thử
### Luồng 1 — Admin đăng nhập hệ thống

```text
POST /api/admin/login
với Body: { "email": "...", "password": "..." }
     │
     ▼
Kiểm tra HTTP Status (200 OK / 401 UNAUTHORIZED) + Response Body (JWT Token)
```
### Luồng 2 — Admin đăng xuất hệ thống
```text
Admin login  →  lấy JWT token từ response
     │
     ▼
POST /api/admin/logout
với Header: Authorization: Bearer {token}
     │
     ▼
Kiểm tra HTTP Status (200 OK / 401 UNAUTHORIZED)
```
---

## 5. Seed Data
### Admin (tạo trong `@BeforeEach`):
| Field | Giá trị |
| --- | --- |
| email | `admin_it_test@example.com` |
| password | `AdminPassword123!` (BCrypt encoded) |
| role | `ADMIN` |
---

## 6. Chi tiết Test Cases
### 6.1 AdminApiController — `POST /api/admin/login`
| Test ID | Tên Test Case | Input | Expected | Type | Status |
| --- | --- | --- | --- | --- | --- |
| IT-EHC24-01 | login valid credentials | `email`, `password` hợp lệ | HTTP 200 + Trả về JWT Token | Happy Path | ✅ PASS |
| IT-EHC24-02 | login wrong password | `password` sai | HTTP 401 | Error Path | ✅ PASS |
| IT-EHC24-03 | login email not found | `email` không tồn tại | HTTP 401 | Error Path | ✅ PASS |
| IT-EHC24-04 | login missing fields | Không truyền `password` | HTTP 401 | Error Path | ✅ PASS |
### 6.2 AdminApiController — `POST /api/admin/logout`
| Test ID | Tên Test Case | Input | Expected | Type | Status |
| --- | --- | --- | --- | --- | --- |
| IT-EHC24-05 | logout authenticated | `POST` kèm Bearer Token hợp lệ | HTTP 200 | Happy Path | ✅ PASS |
| IT-EHC24-06 | logout no token | `POST` không kèm Header Token | HTTP 401 / 403 | Auth Check | ✅ PASS |
---

## 7. Kết quả chạy
```text
[INFO] Running com.e_health_care.web.api.AdminApiControllerAuthIT
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.401s

[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS — Total time: 8.920s
```
---

## 8. Cấu trúc file test
```text
src/test/java/com/e_health_care/web/
├── AbstractIntegrationTest.java                          # Base class (EHC-20)
│   ├── @SpringBootTest
│   └── TestRestTemplate
└── api/
    └── AdminApiControllerAuthIT.java                     # EHC-24 — 6 test cases
```
---

*Report được tạo ngày 15/06/2026 — Tống Nhật Thúy*
