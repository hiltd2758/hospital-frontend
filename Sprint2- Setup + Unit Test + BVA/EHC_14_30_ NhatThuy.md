# Test Report — Sprint 2
**Tác giả:** Tống Nhật Thúy  
**Jira Tasks:** EHC-14 · EHC-30  
**Sprint:** Sprint 2 — Unit Test & BVA  
**Project:** E-HealthCare System  
**Ngày thực hiện:** 11/06/2026  

---

## 1. Tổng quan

| Thông tin | Chi tiết |
|---|---|
| **Họ tên** | Tống Nhật Thúy |
| **Tasks phụ trách** | EHC-14, EHC-30 |
| **Phương pháp** | Unit Test (JUnit 5 + Mockito) · BVA (Boundary Value Analysis) |
| **Công cụ** | JUnit 5, Mockito, Jakarta Validation, BvaValidationHelper |
| **Database** | H2 In-Memory (test profile) |
| **Tổng test cases** | 17 |
| **Passed** | ✅ 17 |
| **Failed** | ❌ 0 |
| **Thời gian chạy** | 1.842s |

---

## 2. Phạm vi kiểm thử

### EHC-14 — DoctorService

| Class | Method | Loại | Test Cases |
|---|---|---|---|
| `DoctorService` | `updateDoctorProfile()` | Unit Test | 2 |
| `DoctorService` | `getDoctorByEmail()` | Unit Test | 2 |
| | | **Subtotal** | **4** |

### EHC-30 (Bổ sung EHC-14) — BVA AppointmentRequestDTO

| Class | Method | Loại | Test Cases |
|---|---|---|---|
| `AppointmentRequestDTO` | BVA `patientId` | BVA | 4 |
| `AppointmentRequestDTO` | BVA `doctorId` | BVA | 4 |
| `AppointmentRequestDTO` | BVA `scheduleTime` | BVA | 5 |
| | | **Subtotal** | **13** |

---

## 3. Equivalence Partitioning — AppointmentRequestDTO

| Condition | Valid Partitions | Tag | Invalid Partitions | Tag |
|---|---|---|---|---|
| `patientId` value | > 0 | V1 | `null` | X1 |
| `doctorId` value | > 0 | V2 | `null` | X2 |
| `scheduleTime` value | Thời gian ở tương lai | V3 | `null` | X3 |
| | | | Thời gian ở quá khứ/hiện tại | X4 |

---

## 4. Boundary Value Analysis — AppointmentRequestDTO

| Field | min-1 | min | nominal | max | max+1 | Tag |
|---|---|---|---|---|---|---|
| `patientId` | `null` | `1L` | `500L` | `Long.MAX_VALUE` | N/A | B1–B3, X1 |
| `doctorId` | `null` | `1L` | `500L` | `Long.MAX_VALUE` | N/A | B4–B6, X2 |
| `scheduleTime` | Quá khứ | Hiện tại | Tương lai gần | Tương lai xa | `null` | B7-B9, X3-X4 |

> **Áp dụng 4n+1:** Đã bổ sung đầy đủ test case cho từng trường theo quy tắc 4n+1, bao phủ toàn bộ các mức Valid và Invalid.

---

## 5. Chi tiết Test Cases

### 5.1 DoctorService

| Test ID | Tên Test Case | Precondition | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| UT-EHC14-01 | updateDoctorProfile_DoctorIdExists | ID hợp lệ | `DoctorDTO (id=1L)` | `save()` được gọi 1 lần | N | ✅ PASS |
| UT-EHC14-02 | updateDoctorProfile_DoctorIdDoesNotExist| ID ảo | `DoctorDTO (id=99L)` | `RuntimeException` | N | ✅ PASS |
| UT-EHC14-03 | getDoctorByEmail_EmailExists | Email tồn tại | `email="test@doctor.com"` | Trả về `DoctorDTO` | N | ✅ PASS |
| UT-EHC14-04 | getDoctorByEmail_EmailDoesNotExist | Email ảo | `email="notfound@test"` | `null` | N | ✅ PASS |

### 5.2 BVA — AppointmentRequestDTO

| Test ID | Tên Test Case | Input | Expected Result | Type (N/A/B) | Tag | Status |
|---|---|---|---|---|---|---|
| BVA-EHC30-01 | patientId null | `patientId=null` | Invalid | B | X1 | ✅ PASS |
| BVA-EHC30-02 | patientId min | `patientId=1L` | Valid | B | B1 | ✅ PASS |
| BVA-EHC30-03 | patientId nominal | `patientId=500L` | Valid | N | V1 | ✅ PASS |
| BVA-EHC30-04 | patientId max | `patientId=Long.MAX_VALUE` | Valid | B | B2 | ✅ PASS |
| BVA-EHC30-05 | doctorId null | `doctorId=null` | Invalid | B | X2 | ✅ PASS |
| BVA-EHC30-06 | doctorId min | `doctorId=1L` | Valid | B | B4 | ✅ PASS |
| BVA-EHC30-07 | doctorId nominal | `doctorId=500L` | Valid | N | V2 | ✅ PASS |
| BVA-EHC30-08 | doctorId max | `doctorId=Long.MAX_VALUE` | Valid | B | B5 | ✅ PASS |
| BVA-EHC30-09 | scheduleTime null | `scheduleTime=null` | Invalid | B | X3 | ✅ PASS |
| BVA-EHC30-10 | scheduleTime past (min-1) | `now().minusDays(1)` | Invalid | B | X4 | ✅ PASS |
| BVA-EHC30-11 | scheduleTime present (min) | `now()` | Invalid | B | X5 | ✅ PASS |
| BVA-EHC30-12 | scheduleTime nearFuture | `now().plusMinutes(5)` | Valid | N | V3 | ✅ PASS |
| BVA-EHC30-13 | scheduleTime farFuture (max)| `now().plusDays(30)` | Valid | B | B8 | ✅ PASS |

---

## 6. Kết quả chạy

```text
[INFO] Running AppointmentRequestDTOBvaTest
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.215s

[INFO] Running DoctorServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.627s

[INFO] Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS — Total time: 1.842s
```

---

## 7. Cấu trúc file test

```text
src/test/java/com/e_health_care/web/
├── doctor/service/
│   └── DoctorServiceTest.java                    # EHC-14 — Unit Test
└── patient/service/dto/
    └── AppointmentRequestDTOBvaTest.java         # EHC-30 — BVA Test
```

---

*Report được tạo ngày 11/06/2026 — Tống Nhật Thúy*
