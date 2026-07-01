# Integration Test Report — Sprint 3
**Tác giả:** Phan Hoàng Đấu  
**Jira Task:** EHC-26  
**Sprint:** Sprint 3 — Integration Test  
**Project:** E-HealthCare System  
**Ngày thực hiện:** 16/06/2026  

---

## 1. Tổng quan

| Thông tin | Chi tiết |
|---|---|
| **Họ tên** | Phan Hoàng Đấu |
| **Task phụ trách** | EHC-26 |
| **Loại kiểm thử** | Integration Test |
| **Phương pháp** | `@SpringBootTest` + `TestRestTemplate` + H2 In-Memory DB |
| **Công cụ** | JUnit 5, Spring Boot Test, H2, BCryptPasswordEncoder |
| **Database** | H2 In-Memory (`jdbc:h2:mem:testdb`) |
| **Tổng test cases** | 9 |
| **Passed** | ✅ 9 |
| **Failed** | ❌ 0 |
| **Thời gian chạy** | 17.478s |

---

## 2. Phạm vi kiểm thử

| Controller | Endpoint | Test Cases |
|---|---|---|
| `PatientClinicalInforController` | `GET /api/patient/clinical-info/{id}` | 3 |
| `ConsultationApiController` | `GET /api/doctor/dashboard` | 2 |
| `ConsultationApiController` | `GET /api/doctor/patient/{id}` | 2 |
| `ConsultationApiController` | `POST /api/doctor/patient/{id}` | 2 |
| | **Tổng** | **9** |

---

## 3. Kiến trúc Integration Test

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────┐
│     Spring Security Filter Chain    │  ← JWT Cookie validation
│  (PatientJwtFilter / DoctorJwtFilter)│
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│         REST Controller             │  ← PatientClinicalInforController
│                                     │     ConsultationApiController
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│            Service Layer            │  ← PatientRecordService
│                                     │     DoctorViewPatientService
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│         H2 In-Memory Database       │  ← test profile
└─────────────────────────────────────┘
```

---

## 4. Luồng nghiệp vụ kiểm thử

### Luồng 1 — Patient xem thông tin lâm sàng
```
Patient login  →  lấy JWT token từ response
     │
     ▼
GET /api/patient/clinical-info/{id}
với Cookie: jwt-patient-token={token}
     │
     ▼
Kiểm tra HTTP Status + response body
```

### Luồng 2 — Doctor xem và cập nhật hồ sơ bệnh nhân
```
Doctor login  →  lấy JWT token từ response
     │
     ▼
GET /api/doctor/dashboard          →  danh sách bệnh nhân
GET /api/doctor/patient/{id}       →  chi tiết bệnh nhân + clinical info
POST /api/doctor/patient/{id}      →  cập nhật clinical info
với Cookie: jwt-doctor-token={token}
```

---

## 5. Seed Data

### Patient (tạo trong `@BeforeEach`):
| Field | Giá trị |
|---|---|
| email | `it_patient@test.com` (cho PatientClinicalInforControllerIT) <br> `it_patient2@test.com` (cho ConsultationApiControllerIT) |
| password | `Password123` (BCrypt encoded) |
| firstName | `IT` |
| lastName | `Patient` |
| phone | `0909123456` |

### Doctor (tạo trong `@BeforeEach`):
| Field | Giá trị |
|---|---|
| email | `it_doctor@test.com` |
| password | `Password123` (BCrypt encoded) |
| firstName | `IT` |
| lastName | `Doctor` |
| field | `General` |
| ROLE | `ROLE_DOCTOR` |

---

## 6. Chi tiết Test Cases

### 6.1 PatientClinicalInforController — `GET /api/patient/clinical-info/{id}`

| Test ID | Tên Test Case | Input | Expected | Type | Status |
|---|---|---|---|---|---|
| IT-EHC26-01 | getClinicalInfo — no token | `GET /api/patient/clinical-info/{id}` không có cookie | HTTP 401 | Auth Check | ✅ PASS |
| IT-EHC26-02 | getClinicalInfo — no record | `GET` với token hợp lệ, chưa có clinical record | HTTP 200 + DTO rỗng | Happy Path | ✅ PASS |
| IT-EHC26-03 | getClinicalInfo — has record | `GET` với token hợp lệ, có clinical record (bloodType="A+") | HTTP 200 + `bloodType="A+"` | Happy Path | ✅ PASS |

### 6.2 ConsultationApiController — `GET /api/doctor/dashboard`

| Test ID | Tên Test Case | Input | Expected | Type | Status |
|---|---|---|---|---|---|
| IT-EHC26-04 | getDashboard_shouldReturn401_whenNoToken | `GET /api/doctor/dashboard` không có cookie | HTTP 401 | Auth Check | ✅ PASS |
| IT-EHC26-05 | getDashboard_shouldReturn200_whenDoctorAuthenticated | `GET` với `jwt-doctor-token` hợp lệ | HTTP 200 + danh sách bệnh nhân | Happy Path | ✅ PASS |

### 6.3 ConsultationApiController — `GET /api/doctor/patient/{id}`

| Test ID | Tên Test Case | Input | Expected | Type | Status |
|---|---|---|---|---|---|
| IT-EHC26-06 | getPatientInfo_shouldReturn401_whenNoToken | `GET /api/doctor/patient/{id}` không có cookie | HTTP 401 hoặc 403 | Auth Check | ✅ PASS |
| IT-EHC26-07 | getPatientInfo_shouldReturn200_whenDoctorAuthenticated | `GET` với token hợp lệ, `patientId` tồn tại | HTTP 200 + `patient` + `clinicalInfo` keys | Happy Path | ✅ PASS |

### 6.4 ConsultationApiController — `POST /api/doctor/patient/{id}`

| Test ID | Tên Test Case | Input | Expected | Type | Status |
|---|---|---|---|---|---|
| IT-EHC26-08 | updatePatientClinical_shouldReturn200_whenValid | `POST` với token hợp lệ, body `{bloodType: "O+", ...}` | HTTP 200 + `"Cập nhật bệnh án thành công"` | Happy Path | ✅ PASS |
| IT-EHC26-09 | updatePatientClinical_shouldReturn400_whenPatientNotFound | `POST` với token hợp lệ, `patientId=999999` không tồn tại | HTTP 400 | Error Path | ✅ PASS |

---

## 7. Kết quả chạy

```
[INFO] Running com.e_health_care.web.api.PatientClinicalInforControllerIT
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.344s

[INFO] Running com.e_health_care.web.api.ConsultationApiControllerIT
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0

[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS — Total time: 17.478s
```

---

## 8. Cấu trúc file test

```
src/test/java/com/e_health_care/web/
├── AbstractIntegrationTest.java                          # Base class
│   ├── @SpringBootTest(RANDOM_PORT)
│   ├── @ActiveProfiles("test")
│   ├── TestRestTemplate
│   └── Helper methods: patientCookieHeader(), doctorCookieHeader(), jsonWithCookie()
└── api/
    ├── PatientClinicalInforControllerIT.java             # EHC-26 — 3 test cases
    └── ConsultationApiControllerIT.java                  # EHC-26 — 6 test cases
```

---

*Report được tạo ngày 16/06/2026 — Phan Hoàng Đấu*
