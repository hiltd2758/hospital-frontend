# Assignment: Kiểm thử chức năng tạo bệnh nhân (`createPatient`)

## Thông tin chung

- **Chức năng kiểm thử:** `createPatient()` – `AdminManagementService`
- **Người thực hiện:** Khả Như - Nhật Thúy
- **Jira Project:** EHC 51

---

# 1. Mô tả bài toán

Hàm `createPatient(Patient patient)` trong `AdminManagementService` cho phép Admin tạo mới bệnh nhân.

## Input

| Biến đầu vào | Ý nghĩa             | Kiểu    | Điều kiện hợp lệ                                       |
| ------------ | ------------------- | ------- | ------------------------------------------------------ |
| `email`      | Email bệnh nhân     | String  | Đúng định dạng (có `@`) và chưa tồn tại trong hệ thống |
| `patient`    | Đối tượng bệnh nhân | Patient | Không null, đủ thông tin bắt buộc                      |

## Kết quả mong đợi

- Trả về đối tượng `Patient` đã được lưu nếu dữ liệu hợp lệ.
- Ném `RuntimeException` nếu:
  - Email đã tồn tại.
  - Email sai định dạng.

---

# 2. Xác định lớp tương đương (Equivalence Partitioning)

| Conditions | Valid Partitions                     | Tag | Invalid Partitions                 | Tag |
| ---------- | ------------------------------------ | --- | ---------------------------------- | --- |
| email      | Email đúng định dạng và chưa tồn tại | V1  | Email đã tồn tại trong DB          | X1  |
|            |                                      |     | Email sai định dạng (không có `@`) | X2  |
| patient    | Patient hợp lệ, đủ thông tin         | V2  | Patient = null                     | X3  |

---

# 3. Phân tích giá trị biên (Boundary Value Analysis)

Hàm `createPatient()` không có miền giá trị số liên tục, do đó BVA được áp dụng theo trạng thái tồn tại của email trong hệ thống.

| Ký hiệu | Ý nghĩa                     | Giá trị đại diện              | Tag |
| ------- | --------------------------- | ----------------------------- | --- |
| `min−`  | Email chưa tồn tại trong DB | Email mới                     | B1  |
| `min`   | Email vừa được lưu lần đầu  | Email mới → Save thành công   | B2  |
| `min+`  | Email được tạo lần thứ hai  | Email trùng → Throw exception | B3  |

---

# 4. Thiết kế Test Case

| STT | Tên Test Case             | Email              | Patient Object | Kết quả mong đợi                  | Tag        |
| --- | ------------------------- | ------------------ | -------------- | --------------------------------- | ---------- |
| 01  | Email mới, tạo thành công | `new@example.com`  | Hợp lệ         | Trả về Patient đã lưu             | V1, V2, B2 |
| 02  | Email đã tồn tại          | `dup@example.com`  | Hợp lệ         | Throw `"Email already exists"`    | X1, B3     |
| 03  | Email null                | `null`             | Thiếu email    | Throw exception                   | X3         |
| 04  | Email sai định dạng       | `"abcxyz"`         | Hợp lệ         | Throw exception, chặn lưu dữ liệu | X2         |
| 05  | Tạo lần 2 cùng email      | `same@example.com` | Hợp lệ         | Throw `"Email already exists"`    | X1, B3     |

---

# 5. Triển khai kiểm thử tự động

## File Test

`AdminCreatePatientEpBvaTest.java`

```java
package com.e_health_care.web.admin.service;

import com.e_health_care.web.BaseServiceTest;
import com.e_health_care.web.patient.model.Patient;
import com.e_health_care.web.patient.repository.PatientClinicalInforRepository;
import com.e_health_care.web.patient.repository.PatientRepository;
import com.e_health_care.web.doctor.repository.DoctorRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminCreatePatientEpBvaTest extends BaseServiceTest {

    @Mock private PatientRepository patientRepository;
    @Mock private DoctorRepository doctorRepository;
    @Mock private PatientClinicalInforRepository patientClinicalInforRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminManagementService service;

    private Patient patient(String email) {
        Patient p = new Patient();
        p.setEmail(email);
        p.setFirstName("Test");
        p.setLastName("User");
        return p;
    }

    @Test
    @DisplayName("TC01 [V1,V2,B2]: email chưa tồn tại -> tạo patient thành công")
    void tc01_newEmail_shouldCreatePatient() {
        Patient p = patient("new@example.com");

        when(patientRepository.findByEmail("new@example.com"))
                .thenReturn(Optional.empty());

        when(patientRepository.save(p))
                .thenReturn(p);

        Patient result = service.createPatient(p);

        assertNotNull(result);
        assertEquals("new@example.com", result.getEmail());

        verify(patientRepository).save(p);
    }

    @Test
    @DisplayName("TC02 [X1,B3]: email đã tồn tại -> throw 'Email already exists'")
    void tc02_duplicateEmail_shouldThrow() {
        Patient p = patient("dup@example.com");

        when(patientRepository.findByEmail("dup@example.com"))
                .thenReturn(Optional.of(new Patient()));

        Exception ex = assertThrows(
                RuntimeException.class,
                () -> service.createPatient(p)
        );

        assertTrue(ex.getMessage().contains("Email already exists"));

        verify(patientRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC_Bug [X2]: Email sai định dạng -> kỳ vọng throw Exception")
    void tc_invalidEmailFormat_shouldThrowException() {

        Patient patient = new Patient();
        patient.setEmail("abcxyz");
        patient.setFirstName("Bug");
        patient.setLastName("Nguyen Van");
        patient.setPassword("123456");

        when(patientRepository.findByEmail("abcxyz"))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            service.createPatient(patient);
        }, "Hệ thống phải ném lỗi khi email sai định dạng");
    }

    @Test
    @DisplayName("TC05 [X1,B3]: insert lần 2 cùng email -> throw 'Email already exists'")
    void tc05_insertSameEmailTwice_shouldThrowOnSecond() {

        Patient p = patient("same@example.com");

        when(patientRepository.findByEmail("same@example.com"))
                .thenReturn(Optional.of(new Patient()));

        Exception ex = assertThrows(
                RuntimeException.class,
                () -> service.createPatient(p)
        );

        assertTrue(ex.getMessage().contains("Email already exists"));
    }
}
```

---

# 6. Kết quả chạy Test

| Test Case | Input              | Expected                       | Actual                         | Kết quả |
| --------- | ------------------ | ------------------------------ | ------------------------------ | ------- |
| TC01      | `new@example.com`  | Patient saved                  | Patient saved                  | ✅ PASS |
| TC02      | `dup@example.com`  | Throw `"Email already exists"` | Throw `"Email already exists"` | ✅ PASS |
| TC_Bug    | `"abcxyz"`         | Throw exception                | Không ném lỗi, lưu thành công  | ❌ FAIL |
| TC05      | `same@example.com` | Throw `"Email already exists"` | Throw `"Email already exists"` | ✅ PASS |

## Tổng kết

- TC01: PASS
- TC02: PASS
- TC05: PASS
- TC_Bug: FAIL

➡️ Phát hiện lỗ hổng Validation trong chức năng tạo bệnh nhân.

➡️ Sinh Bug Report: **EHC-51**

---

# 7. Bug Report phát sinh từ TC_Bug

## Thông tin Bug

| Field         | Value                                                                             |
| ------------- | --------------------------------------------------------------------------------- |
| Bug ID        | EHC-51                                                                            |
| Title         | [AdminManagementService] Hàm createPatient thiếu kiểm tra định dạng email đầu vào |
| Reporter      | Kha Nhu                                                                           |
| Severity      | Major                                                                             |
| Priority      | High                                                                              |
| Phát hiện qua | `tc_invalidEmailFormat_shouldThrowException`                                      |
| Branch Git    | `fix/create-patient-final-v3`                                                     |

---

## Mô tả lỗi

Khi Admin tạo mới bệnh nhân, hệ thống chỉ kiểm tra trùng lặp email nhưng không kiểm tra định dạng email.

Do đó các chuỗi không phải email (ví dụ: `abcxyz`) vẫn được chấp nhận và lưu xuống Database.

---

## Steps To Reproduce

1. Tạo đối tượng `Patient`.
2. Gán:

   ```java
   email = "abcxyz";
   ```

3. Gọi:

   ```java
   adminManagementService.createPatient(patient);
   ```

4. Quan sát kết quả.

---

## Expected Result

- Hệ thống phải ném `RuntimeException`.
- Không được gọi `repository.save()`.

---

## Actual Result

- Không có exception được ném.
- Dữ liệu vẫn được lưu xuống Database.

---

## Suggested Fix

```java
public Patient createPatient(Patient patient) {

    if (patient.getEmail() == null ||
        !patient.getEmail().contains("@")) {

        throw new RuntimeException("Invalid email format");
    }

    if (patientRepository
            .findByEmail(patient.getEmail())
            .isPresent()) {

        throw new RuntimeException(
            "Email already exists: " + patient.getEmail()
        );
    }

    return patientRepository.save(patient);
}
```

---

# 8. Quy trình nhóm trên Git & Jira

```text
1. TV1 viết và chạy AdminCreatePatientEpBvaTest trên nhánh local.

2. Phát hiện TC_Bug FAIL do code không validate email.

3. Chụp ảnh lỗi và tạo Jira Ticket EHC-51.

4. Tạo nhánh Git mới:

   git checkout -b fix/create-patient-final-v3

5. Đẩy code test lên remote:

   git add web/src/test/java/com/e_health_care/web/admin/service/AdminCreatePatientEpBvaTest.java

   git commit -m "Add unit test for createPatient validation"

   git push -u origin fix/create-patient-final-v3

6. Team review Pull Request.

7. Developer nhận EHC-51 và bổ sung validation cho email.

8. Chạy lại test -> TC_Bug PASS -> Đóng Ticket.
```
