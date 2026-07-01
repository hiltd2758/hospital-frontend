# Assignment: Kiểm thử chức năng cập nhật bệnh nhân (`updatePatient`)

## Thông tin chung

- **Chức năng kiểm thử:** `updatePatient()` – `AdminManagementService`
- **Người thực hiện:** Khả Như - Nhật Thúy
- **Jira Project:** EHC 57

---

# 1. Mô tả bài toán

Hàm `updatePatient(Patient patient)` trong `AdminManagementService` cho phép Admin cập nhật thông tin của một bệnh nhân đã tồn tại trong hệ thống.

## Input

| Biến đầu vào | Ý nghĩa             | Kiểu      | Điều kiện hợp lệ                                                 |
| ------------ | ------------------- | --------- | ---------------------------------------------------------------- |
| `patient`    | Đối tượng bệnh nhân | `Patient` | Không null, ID phải tồn tại trong hệ thống                       |
| `email`      | Email bệnh nhân     | `String`  | Không được trùng với email của một bệnh nhân khác trong Database |

## Kết quả mong đợi

- Trả về đối tượng `Patient` sau khi cập nhật thành công.
- Ném `RuntimeException` nếu:
  - Bệnh nhân không tồn tại.
  - Email mới bị trùng với bệnh nhân khác.

---

# 2. Xác định lớp tương đương (Equivalence Partitioning)

| Conditions | Valid Partitions                                     | Tag | Invalid Partitions                    | Tag |
| ---------- | ---------------------------------------------------- | --- | ------------------------------------- | --- |
| ID         | ID bệnh nhân tồn tại trong Database                  | V1  | ID không tồn tại hoặc `null`          | X1  |
| Email      | Giữ nguyên email hoặc đổi sang email chưa ai sử dụng | V2  | Đổi sang email của một bệnh nhân khác | X2  |

---

# 3. Phân tích giá trị biên (Boundary Value Analysis)

BVA tập trung vào ranh giới quyền sở hữu email khi thực hiện cập nhật.

| Ký hiệu | Ý nghĩa                            | Giá trị đại diện              | Tag |
| ------- | ---------------------------------- | ----------------------------- | --- |
| `min`   | Email hiện tại của chính bệnh nhân | Giữ nguyên email → hợp lệ     | B1  |
| `min+`  | Email thuộc về bệnh nhân khác      | Email trùng → Throw exception | B2  |

---

# 4. Thiết kế Test Case

| STT | Tên Test Case             | Input                                              | Kết quả mong đợi               | Tag        |
| --- | ------------------------- | -------------------------------------------------- | ------------------------------ | ---------- |
| 01  | Cập nhật thông tin hợp lệ | ID = 1, Email giữ nguyên                           | Trả về Patient đã cập nhật     | V1, V2, B1 |
| 02  | Bệnh nhân không tồn tại   | ID = 999                                           | Throw `"Patient not found"`    | X1         |
| 03  | Cập nhật email trùng      | ID = 1, Email = `"taken@example.com"` (của ID = 2) | Throw exception, chặn cập nhật | X2, B2     |

---

# 5. Triển khai kiểm thử tự động

## File Test

`AdminUpdatePatientTest.java`

```java
package com.e_health_care.web.admin.service;

import com.e_health_care.web.BaseServiceTest;
import com.e_health_care.web.patient.model.Patient;
import com.e_health_care.web.patient.repository.PatientRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminUpdatePatientTest extends BaseServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private AdminManagementService service;

    // TC01 — V1, V2, B1
    @Test
    @DisplayName("TC01 [V1, V2, B1]: Cập nhật thông tin hợp lệ -> thành công")
    void tc01_updatePatient_validInfo_shouldSucceed() {

        Patient p = new Patient();
        p.setId(1L);
        p.setEmail("valid@example.com");
        p.setFirstName("Old");

        when(patientRepository.existsById(1L)).thenReturn(true);
        when(patientRepository.save(p)).thenReturn(p);

        Patient result = service.updatePatient(p);

        assertNotNull(result);
        assertEquals(1L, result.getId());

        verify(patientRepository).save(p);
    }

    // TC02 — X1
    @Test
    @DisplayName("TC02 [X1]: Bệnh nhân không tồn tại -> throw 'Patient not found'")
    void tc02_updatePatient_notFound_shouldThrow() {

        Patient p = new Patient();
        p.setId(999L);
        p.setEmail("notfound@example.com");

        when(patientRepository.existsById(999L)).thenReturn(false);

        Exception ex = assertThrows(
                RuntimeException.class,
                () -> service.updatePatient(p)
        );

        assertEquals("Patient not found", ex.getMessage());

        verify(patientRepository, never()).save(any());
    }

    // TC03_Bug — X2, B2
    @Test
    @DisplayName("TC03_Bug [X2, B2]: Cập nhật email trùng với ID khác -> kỳ vọng throw Exception")
    void tc03_updatePatient_duplicateEmail_shouldThrowException() {

        Patient patientToUpdate = new Patient();
        patientToUpdate.setId(1L);
        patientToUpdate.setEmail("taken@example.com");

        Patient existingPatientInDb = new Patient();
        existingPatientInDb.setId(2L);
        existingPatientInDb.setEmail("taken@example.com");

        when(patientRepository.existsById(1L))
                .thenReturn(true);

        when(patientRepository.findByEmail("taken@example.com"))
                .thenReturn(Optional.of(existingPatientInDb));

        // BUG: updatePatient chưa kiểm tra email trùng nên test sẽ FAIL
        assertThrows(RuntimeException.class, () -> {
            service.updatePatient(patientToUpdate);
        }, "Hệ thống phải chặn cập nhật email trùng với tài khoản khác!");
    }
}
```

---

# 6. Kết quả chạy Test

| Test Case | Input                                                  | Expected                    | Actual                                     | Kết quả |
| --------- | ------------------------------------------------------ | --------------------------- | ------------------------------------------ | ------- |
| TC01      | ID = 1, Email hợp lệ                                   | Patient cập nhật thành công | Patient cập nhật thành công                | ✅ PASS |
| TC02      | ID = 999                                               | Throw `"Patient not found"` | Throw `"Patient not found"`                | ✅ PASS |
| TC03_Bug  | ID = 1 cập nhật email `"taken@example.com"` của ID = 2 | Throw exception             | Không ném lỗi, vẫn gọi `repository.save()` | ❌ FAIL |

## Tổng kết

- TC01: PASS
- TC02: PASS
- TC03_Bug: FAIL

➡️ Phát hiện lỗ hổng kiểm tra trùng lặp email khi cập nhật.

➡️ Sinh Bug Report **EHC-57**.

---

# 7. Bug Report phát sinh từ TC03_Bug

## Thông tin Bug

| Field         | Value                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| Bug ID        | EHC-57                                                                      |
| Title         | `[AdminManagementService] Hàm updatePatient thiếu kiểm tra trùng lặp email` |
| Reporter      | TV1 (Tester)                                                                |
| Severity      | Major (Gây lỗi Unique Constraint ở Database)                                |
| Priority      | High                                                                        |
| Phát hiện qua | `tc03_updatePatient_duplicateEmail_shouldThrowException`                    |
| Branch Git    | `feature/EHC-57-update-patient-bug`                                         |

---

## Mô tả lỗi

Khi Admin cập nhật thông tin bệnh nhân, hàm `updatePatient()` chỉ kiểm tra sự tồn tại của ID bằng `existsById()` nhưng không kiểm tra xem email mới có đang thuộc về một bệnh nhân khác hay không.

Điều này khiến hệ thống cho phép cập nhật email trùng lặp và có thể gây lỗi `Unique Constraint` ở tầng Database.

---

## Steps to Reproduce

1. Tạo đối tượng `Patient` có:
   - `ID = 1`
   - `Email = "taken@example.com"`

2. Giả lập Database đã tồn tại một bệnh nhân khác:
   - `ID = 2`
   - `Email = "taken@example.com"`

3. Gọi:

```java
adminManagementService.updatePatient(patient);
```

4. Quan sát kết quả.

---

## Expected Result

- Phát hiện email thuộc về ID khác.
- Ném `RuntimeException("Email already exists")`.
- Không gọi `patientRepository.save()`.

---

## Actual Result

- Bỏ qua bước kiểm tra email.
- Tiếp tục gọi `patientRepository.save(patient)`.
- Test Case thất bại.

---

## Suggested Fix

```java
public Patient updatePatient(Patient patient) {

    if (patient == null
            || patient.getId() == null
            || !patientRepository.existsById(patient.getId())) {

        throw new RuntimeException("Patient not found");
    }

    Optional<Patient> existingPatient =
            patientRepository.findByEmail(patient.getEmail());

    if (existingPatient.isPresent()
            && !existingPatient.get().getId().equals(patient.getId())) {

        throw new RuntimeException(
                "Email already exists and belongs to another patient."
        );
    }

    return patientRepository.save(patient);
}
```
