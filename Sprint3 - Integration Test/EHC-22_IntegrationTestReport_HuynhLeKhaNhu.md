# Integration Test Report — Sprint 3

**Tác giả:** Huỳnh Lê Khả Như
**Jira Task:** EHC-22
**Sprint:** Sprint 3 — Integration Test
**Project:** E-HealthCare System
**Ngày thực hiện:** 15/06/2026

---

## 1. Tổng quan

| Thông tin           | Chi tiết                                                 |
| ------------------- | -------------------------------------------------------- |
| **Họ tên**          | Huỳnh Lê Khả Như                                         |
| **Task phụ trách**  | EHC-22                                                   |
| **Loại kiểm thử**   | Integration Test                                         |
| **Phương pháp**     | `@SpringBootTest` + `TestRestTemplate` + H2 In-Memory DB |
| **Công cụ**         | JUnit 5, Spring Boot Test, H2, PatientJwtService         |
| **Database**        | H2 In-Memory (`jdbc:h2:mem:testdb`)                      |
| **Tổng test cases** | 6                                                        |
| **Passed**          | ✅ 6                                                     |
| **Failed**          | ❌ 0                                                     |
| **Thời gian chạy**  | 2.159s                                                   |

---

## 2. Phạm vi kiểm thử

| Controller                        | Endpoint                                             | Test Cases |
| --------------------------------- | ---------------------------------------------------- | ---------- |
| `PatientAppointmentApiController` | `POST /api/patient/appointment/book`                 | 3          |
| `PatientAppointmentApiController` | `GET /api/patient/appointment/list`                  | 2          |
| `PatientAppointmentApiController` | `POST /api/patient/appointment/update/{id}/{status}` | 1          |
|                                   | **Tổng**                                             | **6**      |

---

## 3. Kiến trúc Integration Test

```text
HTTP Request
     │
     ▼
┌─────────────────────────────────────┐
│     Spring Security Filter Chain    │  ← JWT Cookie validation
│          (PatientJwtFilter)         │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│           REST Controller           │  ← PatientAppointmentApiController
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│            Service Layer            │  ← PatientAppointmentService
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│        H2 In-Memory Database        │  ← test profile
└─────────────────────────────────────┘
```

---

## 4. Luồng nghiệp vụ kiểm thử

### Luồng 1 — Patient quản lý lịch hẹn

```text
Tạo PatientJwtService  →  Tạo JWT token thật (validToken) cho Test Patient
     │
     ▼
POST /api/patient/appointment/book              →  đặt lịch hẹn mới
GET /api/patient/appointment/list               →  danh sách lịch hẹn
POST /api/patient/appointment/update/{id}/{s}   →  cập nhật trạng thái
với Cookie: jwt-patient-token={validToken}
     │
     ▼
Kiểm tra HTTP Status + response body
```

---

## 5. Seed Data

### Patient (tạo trong `@BeforeEach`):

| Field | Giá trị                 |
| ----- | ----------------------- |
| email | `patient_test@test.com` |

### Doctor (tạo trong `@BeforeEach`):

| Field      | Giá trị | Mục đích                                       |
| ---------- | ------- | ---------------------------------------------- |
| (Mặc định) | Rỗng    | Khởi tạo để lấy ID ráp vào Appointment Request |

### JWT Token (tạo trong `@BeforeEach`):

| Field        | Giá trị                                                           |
| ------------ | ----------------------------------------------------------------- |
| `validToken` | Generate từ `PatientJwtService` với email `patient_test@test.com` |

---

## 6. Chi tiết Test Cases

### 6.1 PatientAppointmentApiController — `POST /api/patient/appointment/book`

| Test ID     | Tên Test Case                                      | Input                            | Expected             | Type       | Status  |
| ----------- | -------------------------------------------------- | -------------------------------- | -------------------- | ---------- | ------- |
| IT-EHC22-01 | bookAppointment_shouldReturn200_whenValid          | Body hợp lệ, Cookie hợp lệ       | HTTP 200 OK          | Happy Path | ✅ PASS |
| IT-EHC22-02 | bookAppointment_shouldReturn400_whenDoctorNotFound | `doctorId = 9999`, Cookie hợp lệ | HTTP 400 Bad Request | Error Path | ✅ PASS |
| IT-EHC22-03 | bookAppointment_shouldReturn401_whenNoToken        | Body hợp lệ, Không có Cookie     | HTTP 401 / 403       | Auth Check | ✅ PASS |

### 6.2 PatientAppointmentApiController — `GET /api/patient/appointment/list`

| Test ID     | Tên Test Case                                     | Input           | Expected       | Type       | Status  |
| ----------- | ------------------------------------------------- | --------------- | -------------- | ---------- | ------- |
| IT-EHC22-04 | getAppointments_shouldReturn200_whenAuthenticated | Cookie hợp lệ   | HTTP 200 OK    | Happy Path | ✅ PASS |
| IT-EHC22-05 | getAppointments_shouldReturn401_whenNoToken       | Không có Cookie | HTTP 401 / 403 | Auth Check | ✅ PASS |

### 6.3 PatientAppointmentApiController — `POST /api/patient/appointment/update/{id}/{status}`

| Test ID     | Tên Test Case                                     | Input                               | Expected    | Type       | Status  |
| ----------- | ------------------------------------------------- | ----------------------------------- | ----------- | ---------- | ------- |
| IT-EHC22-06 | updateAppointmentStatus_shouldReturn200_whenValid | PathVariables hợp lệ, Cookie hợp lệ | HTTP 200 OK | Happy Path | ✅ PASS |

---

## 7. Kết quả chạy

```text
[INFO] Running com.e_health_care.web.api.PatientAppointmentApiControllerIT
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.159s

[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS — Total time: 2.159s
```

---

## 8. Cấu trúc file test

```text
src/test/java/com/e_health_care/web/
├── AbstractIntegrationTest.java                          # Base class
│   ├── @SpringBootTest(RANDOM_PORT)
│   ├── @ActiveProfiles("test")
│   ├── TestRestTemplate
│   └── Helper methods: patientCookieHeader(), jsonWithCookie()
└── api/
    └── PatientAppointmentApiControllerIT.java            # EHC-22 — 6 test cases
```

---

_Report được tạo ngày 15/06/2026 — Huỳnh Lê Khả Như_
