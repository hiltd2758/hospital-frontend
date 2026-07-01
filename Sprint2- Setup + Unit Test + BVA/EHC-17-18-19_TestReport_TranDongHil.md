# Test Report — Sprint 2
**Tác giả:** Trần Đông Hil  
**Jira Tasks:** EHC-17 · EHC-18 · EHC-19  
**Sprint:** Sprint 2 — Unit Test & BVA  
**Project:** E-HealthCare System  
**Ngày thực hiện:** 10/06/2026  

---

## 1. Tổng quan

| Thông tin | Chi tiết |
|---|---|
| **Họ tên** | Trần Đông Hil |
| **Tasks phụ trách** | EHC-17, EHC-18, EHC-19 |
| **Phương pháp** | Unit Test (JUnit 5 + Mockito) · BVA (Boundary Value Analysis) |
| **Công cụ** | JUnit 5, Mockito, Jakarta Validation, BvaValidationHelper |
| **Database** | H2 In-Memory (test profile) |
| **Tổng test cases** | 28 |
| **Passed** | ✅ 28 |
| **Failed** | ❌ 0 |
| **Thời gian chạy** | 21.088s |

---

## 2. Phạm vi kiểm thử

### EHC-17 — PatientRecordService · DoctorViewPatientService · BVA PasswordUpdateDTO

| Class | Method | Loại | Test Cases |
|---|---|---|---|
| `PatientRecordService` | `getClinicalForEdit()` | Unit Test | 2 |
| `DoctorViewPatientService` | `getAllPatients()` | Unit Test | 2 |
| `DoctorViewPatientService` | `getPatientProfile()` | Unit Test | 2 |
| `DoctorViewPatientService` | `getPatientClinicalInfo()` | Unit Test | 2 |
| `DoctorViewPatientService` | `updatePatientClinicalInfo()` | Unit Test | 3 |
| `PasswordUpdateDTO` | BVA `newPassword` | BVA | 7 |
| | | **Subtotal** | **18** |

### EHC-18 — PatientService

| Class | Method | Loại | Test Cases |
|---|---|---|---|
| `PatientService` | `getAllPatients()` | Unit Test | 2 |
| `PatientService` | `getPatientById()` | Unit Test | 2 |
| `PatientService` | `getPatientByEmail()` | Unit Test | 2 |
| | | **Subtotal** | **6** |

### EHC-19 — PatientUpdateProfileService

| Class | Method | Loại | Test Cases |
|---|---|---|---|
| `PatientUpdateProfileService` | `getPatientById()` | Unit Test | 2 |
| `PatientUpdateProfileService` | `updatePatient()` | Unit Test | 2 |
| | | **Subtotal** | **4** |

---

## 3. Equivalence Partitioning — PasswordUpdateDTO

| Condition | Valid Partitions | Tag | Invalid Partitions | Tag |
|---|---|---|---|---|
| `newPassword` length | 8 ≤ length ≤ 50 | V1 | length < 8 | X1 |
| | | | length > 50 | X2 |
| `newPassword` value | Non-blank string | V2 | null | X3 |
| | | | empty `""` | X4 |

---

## 4. Boundary Value Analysis — PasswordUpdateDTO

| Field | min-1 | min | nominal | max | max+1 | Tag |
|---|---|---|---|---|---|---|
| `newPassword` | 7 chars | 8 chars | 25 chars | 50 chars | 51 chars | B1–B5 |

> **Áp dụng 4n+1:** n=1 field → cần 5 test cases. Thực tế có 7 (bao gồm null và empty) → vượt yêu cầu ✅

---

## 5. Chi tiết Test Cases

### 5.1 PatientRecordService — `getClinicalForEdit()`

| Test ID | Tên Test Case | Precondition | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| UT-EHC17-01 | getClinicalForEdit — found | `PatientClinicalInfor` tồn tại | `patientId = 1` | Trả về `PatientClinicalInforDTO` với `bloodType = "A+"` | N | ✅ PASS |
| UT-EHC17-02 | getClinicalForEdit — not found | Không có record | `patientId = 99` | Trả về DTO rỗng với `id = 99` | N | ✅ PASS |

### 5.2 DoctorViewPatientService — `getAllPatients()`

| Test ID | Tên Test Case | Precondition | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| UT-EHC17-03 | getAllPatients — has data | Có patient trong DB | `findAll()` trả về list | List `PatientSummaryDTO` size = 1 | N | ✅ PASS |
| UT-EHC17-04 | getAllPatients — empty | DB rỗng | `findAll()` trả về `[]` | Empty list, không throw exception | N | ✅ PASS |

### 5.3 DoctorViewPatientService — `getPatientProfile()`

| Test ID | Tên Test Case | Precondition | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| UT-EHC17-05 | getPatientProfile — found | Patient tồn tại | `patientId = 1` | `PatientDTO` với email đúng | N | ✅ PASS |
| UT-EHC17-06 | getPatientProfile — not found | Patient không tồn tại | `patientId = 99` | `null` | N | ✅ PASS |

### 5.4 DoctorViewPatientService — `getPatientClinicalInfo()`

| Test ID | Tên Test Case | Precondition | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| UT-EHC17-07 | getPatientClinicalInfo — found | ClinicalInfor tồn tại | `patientId = 1` | DTO với `bloodType = "B+"` | N | ✅ PASS |
| UT-EHC17-08 | getPatientClinicalInfo — not found | Không có record | `patientId = 99` | `null` | N | ✅ PASS |

### 5.5 DoctorViewPatientService — `updatePatientClinicalInfo()`

| Test ID | Tên Test Case | Precondition | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|---|
| UT-EHC17-09 | updatePatientClinicalInfo — doctor not found | Doctor không tồn tại | `email = "notfound@test.com"` | `UsernameNotFoundException` | N | ✅ PASS |
| UT-EHC17-10 | updatePatientClinicalInfo — patient not found | Doctor tồn tại, patient không có | `patientId = 99` | `RuntimeException` | N | ✅ PASS |
| UT-EHC17-11 | updatePatientClinicalInfo — success | Doctor và patient tồn tại | `patientId = 1`, `email = "doctor@test.com"` | `save()` được gọi 1 lần | N | ✅ PASS |

### 5.6 BVA — PasswordUpdateDTO `newPassword`

| Test ID | Tên Test Case | Input | Expected Result | Type (N/A/B) | Tag | Status |
|---|---|---|---|---|---|---|
| BVA-EHC17-01 | newPassword null | `null` | Invalid | B | X3 | ✅ PASS |
| BVA-EHC17-02 | newPassword empty | `""` | Invalid | B | X4 | ✅ PASS |
| BVA-EHC17-03 | newPassword 7 chars (min-1) | `"1234567"` | Invalid | B | X1 | ✅ PASS |
| BVA-EHC17-04 | newPassword 8 chars (min) | `"12345678"` | Valid | B | B1 | ✅ PASS |
| BVA-EHC17-05 | newPassword 25 chars (nominal) | `"a" × 25` | Valid | N | V1 | ✅ PASS |
| BVA-EHC17-06 | newPassword 50 chars (max) | `"a" × 50` | Valid | B | B5 | ✅ PASS |
| BVA-EHC17-07 | newPassword 51 chars (max+1) | `"a" × 51` | Invalid | B | X2 | ✅ PASS |

### 5.7 PatientService

| Test ID | Tên Test Case | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|
| UT-EHC18-01 | getAllPatients — has data | `findAll()` có data | List size = 1 | N | ✅ PASS |
| UT-EHC18-02 | getAllPatients — empty | `findAll()` rỗng | Empty list | N | ✅ PASS |
| UT-EHC18-03 | getPatientById — found | `patientId = 1` | `Optional.present` | N | ✅ PASS |
| UT-EHC18-04 | getPatientById — not found | `patientId = 99` | `Optional.empty` | N | ✅ PASS |
| UT-EHC18-05 | getPatientByEmail — found | `email = "patient@test.com"` | `Optional.present` | N | ✅ PASS |
| UT-EHC18-06 | getPatientByEmail — not found | `email = "notfound@test.com"` | `Optional.empty` | N | ✅ PASS |

### 5.8 PatientUpdateProfileService

| Test ID | Tên Test Case | Input | Expected Result | Type | Status |
|---|---|---|---|---|---|
| UT-EHC19-01 | getPatientById — found | `patientId = 1` | `PatientDTO` với email đúng | N | ✅ PASS |
| UT-EHC19-02 | getPatientById — not found | `patientId = 99` | `RuntimeException` | N | ✅ PASS |
| UT-EHC19-03 | updatePatient — success | `patientId = 1`, DTO hợp lệ | `save()` được gọi 1 lần | N | ✅ PASS |
| UT-EHC19-04 | updatePatient — not found | `patientId = 99` | `RuntimeException` | N | ✅ PASS |

---

## 6. Kết quả chạy

```
[INFO] Running PasswordUpdateDTOBvaTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.384s

[INFO] Running DoctorViewPatientServiceTest
[INFO] Tests run: 9, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 2.946s

[INFO] Running PatientRecordServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.037s

[INFO] Running PatientServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.044s

[INFO] Running PatientUpdateProfileServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.043s

[INFO] Tests run: 28, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS — Total time: 21.088s
```

---

## 7. Cấu trúc file test

```
src/test/java/com/e_health_care/web/
├── BaseServiceTest.java                          # Base class (EHC-10)
├── BvaValidationHelper.java                      # Validation helper (EHC-10)
├── admin/dto/
│   └── PasswordUpdateDTOBvaTest.java             # EHC-17 — BVA
├── doctor/service/
│   └── DoctorViewPatientServiceTest.java         # EHC-17 — Unit Test
└── patient/service/
    ├── PatientRecordServiceTest.java             # EHC-17 — Unit Test
    ├── PatientServiceTest.java                   # EHC-18 — Unit Test
    └── PatientUpdateProfileServiceTest.java      # EHC-19 — Unit Test
```

---



*Report được tạo ngày 11/06/2026 — Trần Đông Hil*
