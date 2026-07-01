# Test Report — Sprint 2
**Tác giả:** Trần Quốc Việt  
**Jira Tasks:** EHC-21  
**Sprint:** Sprint 2 — Integration Test  
**Project:** E-HealthCare System  
**Ngày thực hiện:** 16/06/2026  

---

## 1. Tổng quan

| Thông tin | Chi tiết |
|---|---|
| **Họ tên** | Trần Quốc Việt |
| **Tasks phụ trách** | EHC-21 |
| **Phương pháp** | Integration Test |
| **Công cụ** | JUnit 5, Spring Boot Test, TestRestTemplate |
| **Database** | H2 In-Memory (test profile) |
| **Tổng test cases** | 7 |
| **Passed** | ✅ 7 |
| **Failed** | ❌ 0 |

---

## 2. Phạm vi kiểm thử

### EHC-21 — Patient Authentication API

| Feature | Endpoint | Loại | Test Cases |
|---|---|---|---|
| REGISTER | `POST /api/patient/register` | Integration Test | 3 |
| LOGIN | `POST /api/patient/login` | Integration Test | 3 |
| E2E | `POST /api/patient/register` -> `login` | Integration Test | 1 |
| | | **Subtotal** | **7** |

---

## 3. Chi tiết Test Cases

### 3.1 PatientAuthApiControllerIT (EHC-21)

| Test ID | Tên Test Case | Method | Endpoint / Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| IT-EHC21-01 | `register_shouldReturn200_whenValidInput` | POST | `/api/patient/register` (Valid Payload) | Status 200, Message "success", User lưu DB | N | ✅ PASS |
| IT-EHC21-02 | `register_shouldReturnError_whenEmailAlreadyExists` | POST | `/api/patient/register` (Email tồn tại) | Lỗi phía Server (Non-2xx), DB giữ 1 record | E | ✅ PASS |
| IT-EHC21-03 | `register_shouldReturnError_whenInvalidInput` | POST | `/api/patient/register` (Thiếu field) | Lỗi phía Server (Non-2xx) | E | ✅ PASS |
| IT-EHC21-04 | `login_shouldReturn200_whenValidCredentials` | POST | `/api/patient/login` (Valid Credentials)| Status 200, JWT Token, Set-Cookie header | N | ✅ PASS |
| IT-EHC21-05 | `login_shouldReturn401_whenWrongPassword` | POST | `/api/patient/login` (Sai password) | Status 401, Invalid credentials | E | ✅ PASS |
| IT-EHC21-06 | `login_shouldReturn401_whenEmailNotFound` | POST | `/api/patient/login` (Email sai) | Status 401, Invalid credentials | E | ✅ PASS |
| IT-EHC21-07 | `registerThenLogin_shouldSucceed_endToEnd` | POST | Register -> Login liên tiếp | Status 200 ở cả 2 bước, trả về Token | N | ✅ PASS |

---

## 4. Kết quả chạy

```
[INFO] Running PatientAuthApiControllerIT
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 5. Cấu trúc file test

```
src/test/java/com/e_health_care/web/
└── api/
    └── PatientAuthApiControllerIT.java                   # EHC-21 — Integration Test
```

---

## 6. Nhận xét & Đánh giá chất lượng Code

1. **Thiếu Validation tự động cho API Register:**
   - **Vấn đề:** Hàm `register` trong `PatientAuthApiController` thiếu annotation `@Valid` nên `PatientDTO` không được kiểm tra tính hợp lệ trước khi vào Service.
   - **Đề xuất:** Thêm `@Valid` vào tham số `@RequestBody PatientDTO patientDTO`.

2. **Xử lý Exception chưa đồng bộ (Email trùng lặp):**
   - **Vấn đề:** Khi đăng ký email đã tồn tại, `PatientAuthenticationService` ném ra `RuntimeException`, nhưng Controller không bắt nên hệ thống trả về HTTP 500 thay vì 400 Bad Request.
   - **Đề xuất:** Thêm khối `try-catch` hoặc `GlobalExceptionHandler` (`@RestControllerAdvice`).

---

*Report được tạo ngày 16/06/2026 — Trần Quốc Việt*
