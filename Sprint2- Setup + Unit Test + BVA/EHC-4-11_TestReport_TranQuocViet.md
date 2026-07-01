# Test Report — Sprint 2
**Tác giả:** Trần Quốc Việt  
**Jira Tasks:** EHC-4 · EHC-11  
**Sprint:** Sprint 2 — Unit Test, BVA & API Test  
**Project:** E-HealthCare System  
**Ngày thực hiện:** 13/06/2026  

---

## 1. Tổng quan

| Thông tin | Chi tiết |
|---|---|
| **Họ tên** | Trần Quốc Việt |
| **Tasks phụ trách** | EHC-4, EHC-11 |
| **Phương pháp** | Unit Test (JUnit 5 + Mockito) · BVA (Boundary Value Analysis) · API Test (Postman) |
| **Công cụ** | JUnit 5, Mockito, BvaValidationHelper, Postman |
| **Database** | H2 In-Memory (test profile) |
| **Tổng test cases** | 30 |
| **Passed** | ✅ 30 |
| **Failed** | ❌ 0 |

---

## 2. Phạm vi kiểm thử

### EHC-4 — Admin Patient CRUD & Dashboard

| Feature | Endpoint | Loại | Test Cases |
|---|---|---|---|
| READ | `GET /admin/api/patients` | API Test | 1 |
| READ | `GET /admin/api/patients/{id}` | API Test | 1 |
| CREATE | `POST /admin/api/patients` | API Test | 2 |
| UPDATE | `PUT /admin/api/patients/{id}` | API Test | 2 |
| UPDATE | `PUT /admin/api/patients/{id}/password` | API Test | 1 |
| DELETE | `DELETE /admin/api/patients/{id}` | API Test | 2 |
| | | **Subtotal** | **9** |

### EHC-11 — PatientAuthenticationService · BVA DoctorDTO

| Class | Method | Loại | Test Cases |
|---|---|---|---|
| `PatientAuthenticationService` | `register()` | Unit Test | 2 |
| `PatientAuthenticationService` | `verify()` | Unit Test | 2 |
| `DoctorDTO` | BVA `email`, `password`, `firstName`, `phone` | BVA | 17 |
| | | **Subtotal** | **21** |

---

## 3. Equivalence Partitioning — DoctorDTO

| Condition | Valid Partitions | Tag | Invalid Partitions | Tag |
|---|---|---|---|---|
| `email` format | Định dạng email hợp lệ | V1 | Null | X1 |
| | | | Sai định dạng (vd: `ab.c`) | X2 |
| `password` length | 8 ≤ length ≤ 50 | V2 | length < 8 | X3 |
| | | | length > 50 | X4 |
| `firstName` length | 1 ≤ length ≤ 50 | V3 | empty `""` | X5 |
| | | | length > 50 | X6 |
| `phone` length | length = 10 | V4 | length = 9 | X7 |
| | | | length = 11 | X8 |

---

## 4. Boundary Value Analysis — DoctorDTO

| Field | min-1 | min | nominal | max | max+1 |
|---|---|---|---|---|---|
| `password` | 7 chars | 8 chars | - | 50 chars | 51 chars |
| `firstName` | 0 chars (`""`) | 1 char | - | 50 chars | 51 chars |
| `phone` | 9 chars | 10 chars | - | 10 chars | 11 chars |

---

## 5. Chi tiết Test Cases

### 5.1 Postman API Testing — Admin Patient CRUD (EHC-4)

| Test ID | Tên Test Case | Method | Endpoint | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| API-EHC4-01 | GET All Patients | GET | `/admin/api/patients` | Status 200, mảng patients | N | ✅ PASS |
| API-EHC4-02 | GET Patient by ID | GET | `/admin/api/patients/{id}` | Status 200 hoặc 404 | N | ✅ PASS |
| API-EHC4-03 | POST Create New Patient | POST | `/admin/api/patients` | Status 201 Created | N | ✅ PASS |
| API-EHC4-04 | POST Create - Missing Email | POST | `/admin/api/patients` | Status 400 Bad Request | E | ✅ PASS |
| API-EHC4-05 | PUT Update Patient Info | PUT | `/admin/api/patients/{id}` | Status 200 Updated | N | ✅ PASS |
| API-EHC4-06 | PUT Update Patient Password | PUT | `/admin/api/patients/{id}/password`| Status 200 Password Updated | N | ✅ PASS |
| API-EHC4-07 | PUT Update Patient - Not Found| PUT | `/admin/api/patients/{id}` | Status 404 Not Found | E | ✅ PASS |
| API-EHC4-08 | DELETE Patient by ID | DELETE | `/admin/api/patients/{id}` | Status 200 Deleted | N | ✅ PASS |
| API-EHC4-09 | DELETE Patient - Not Found | DELETE | `/admin/api/patients/{id}` | Status 404 Not Found | E | ✅ PASS |

### 5.2 PatientAuthenticationService (EHC-11)

| Test ID | Tên Test Case | Precondition | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| UT-EHC11-01 | register — email exists | Email đã tồn tại trong DB | `PatientDTO` với email cũ | `RuntimeException` | E | ✅ PASS |
| UT-EHC11-02 | register — success | Email chưa tồn tại | `PatientDTO` hợp lệ | `save()` được gọi, trả về `Patient` | N | ✅ PASS |
| UT-EHC11-03 | verify — wrong password | Mật khẩu không khớp | `email`, `wrong-password` | Trả về `null` | E | ✅ PASS |
| UT-EHC11-04 | verify — success | Mật khẩu đúng | `email`, `correct-password` | Trả về chuỗi JWT token | N | ✅ PASS |

### 5.3 BVA — DoctorDTO (EHC-11)

| Test ID | Tên Test Case | Input | Expected Result | Type (N/A/B) | Status |
|---|---|---|---|---|---|
| BVA-EHC11-01 | allNominal_shouldBeValid | DTO với tất cả fields hợp lệ | Valid | N | ✅ PASS |
| BVA-EHC11-02 | email_nominalShort_isValid | `a@b.com` | Valid | N | ✅ PASS |
| BVA-EHC11-03 | email_nominalLong_isValid | Email dài 40 ký tự | Valid | N | ✅ PASS |
| BVA-EHC11-04 | email null | `null` | Invalid | B | ✅ PASS |
| BVA-EHC11-05 | email valid format | `a@b.c` | Valid | B | ✅ PASS |
| BVA-EHC11-06 | email invalid format | `ab.c` | Invalid | B | ✅ PASS |
| BVA-EHC11-07 | password 7 chars (min-1) | `"1234567"` | Invalid | B | ✅ PASS |
| BVA-EHC11-08 | password 8 chars (min) | `"12345678"` | Valid | B | ✅ PASS |
| BVA-EHC11-09 | password 50 chars (max) | `"a" × 50` | Valid | B | ✅ PASS |
| BVA-EHC11-10 | password 51 chars (max+1) | `"b" × 51` | Invalid | B | ✅ PASS |
| BVA-EHC11-11 | firstName 0 chars (min-1) | `""` | Invalid | B | ✅ PASS |
| BVA-EHC11-12 | firstName 1 char (min) | `"A"` | Valid | B | ✅ PASS |
| BVA-EHC11-13 | firstName 50 chars (max) | `"x" × 50` | Valid | B | ✅ PASS |
| BVA-EHC11-14 | firstName 51 chars (max+1) | `"y" × 51` | Invalid | B | ✅ PASS |
| BVA-EHC11-15 | phone 9 chars (min-1) | `"012345678"` | Invalid | B | ✅ PASS |
| BVA-EHC11-16 | phone 10 chars (min/max) | `"0123456789"` | Valid | B | ✅ PASS |
| BVA-EHC11-17 | phone 11 chars (max+1) | `"01234567890"` | Invalid | B | ✅ PASS |

---

## 6. Kết quả chạy

```
[INFO] Running Postman API Tests (EHC-4)
[INFO] Tests run: 9, Failures: 0, Errors: 0

[INFO] Running DoctorDTOBvaTest
[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0

[INFO] Running PatientAuthenticationServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0

[INFO] Tests run: 30, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 7. Cấu trúc file test

```
postman/
└── Admin_Patient_CRUD_Dashboard.postman_collection.json  # EHC-4 — Postman API Test

src/test/java/com/e_health_care/web/
├── doctor/dto/
│   └── DoctorDTOBvaTest.java                             # EHC-11 — BVA
└── patient/service/
    └── PatientAuthenticationServiceTest.java             # EHC-11 — Unit Test
```

---



*Report được tạo ngày 13/06/2026 — Trần Quốc Việt*
