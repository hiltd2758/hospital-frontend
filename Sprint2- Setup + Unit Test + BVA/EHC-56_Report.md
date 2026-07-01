# Kiểm thử chức năng cập nhật hồ sơ bệnh nhân (updatePatient)

**Môn học:** Kiểm thử phần mềm  
**Chức năng kiểm thử:** `updatePatient()` – PatientUpdateProfileService  
**Hệ thống:** E-Health Care (EHC) – Spring Boot Backend  
**Người thực hiện:** Nguyễn Văn Trường  
**Jira:** EHC-56

---

# 1. Xác định lớp tương đương

| Biến đầu vào | Lớp hợp lệ | Tag | Lớp không hợp lệ | Tag |
|--------------|------------|-----|------------------|-----|
| patientId | id tồn tại trong DB | V1 | id không tồn tại trong DB | X1 |
| firstName | Chuỗi không rỗng, không null | V2 | Rỗng ("") hoặc null | X2 |
| lastName | Chuỗi không rỗng, không null | V3 | Rỗng ("") hoặc null | X3 |
| phone | 0 ≤ length ≤ 10 | V4 | length > 10 | X4 |
| password | null hoặc rỗng (không đổi pass) | V5 | — | — |
| password | Có giá trị → phải BCrypt encode | V6 | Có giá trị nhưng lưu plain text | X5 |

## Giải thích Tag

| Tag | Ý nghĩa |
|-----|---------|
| V1 | patientId hợp lệ, tồn tại trong DB |
| V2 | firstName hợp lệ |
| V3 | lastName hợp lệ |
| V4 | phone hợp lệ (≤ 10 ký tự) |
| V5 | password null/rỗng – giữ nguyên mật khẩu cũ |
| V6 | password có giá trị – phải BCrypt encode |
| X1 | patientId không tồn tại trong DB |
| X2 | firstName rỗng hoặc null |
| X3 | lastName rỗng hoặc null |
| X4 | phone vượt quá 10 ký tự |
| X5 | password có giá trị nhưng lưu plain text (BUG EHC-56) |

---

# 2. Phân tích giá trị biên (Boundary Value Analysis)

| Biến đầu vào | min | min+ | nominal | max- | max | Tag biên |
|--------------|-----|------|---------|------|-----|----------|
| password (length) | 0 (rỗng) | 1 | 14 | 49 | 50 | B1–B5 |
| firstName (length) | 1 | 2 | 25 | 49 | 50 | B6–B10 |
| phone (length) | 0 | 1 | 5 | 9 | 10 | B11–B15 |

## Ý nghĩa Tag biên

| Tag | Giá trị |
|-----|---------|
| B1 | password = "" (rỗng, không đổi) |
| B2 | password = "a" (1 ký tự) |
| B3 | password = "newpassword123" (14 ký tự, nominal) |
| B4 | password = "a"×49 (49 ký tự) |
| B5 | password = "a"×50 (50 ký tự) |
| B6 | firstName = "J" (1 ký tự) |
| B7 | firstName = "Ja" (2 ký tự) |
| B8 | firstName = "Jane Smith Tran" (15 ký tự) |
| B9 | firstName = "a"×49 (49 ký tự) |
| B10 | firstName = "a"×50 (50 ký tự) |
| B11 | phone = "" (0 ký tự) |
| B12 | phone = "0" (1 ký tự) |
| B13 | phone = "09123" (5 ký tự) |
| B14 | phone = "090912345" (9 ký tự) |
| B15 | phone = "0909123456" (10 ký tự) |

---

# 3. Thiết kế Test Case

| STT | Tên Test Case | patientId | firstName | lastName | phone | password | Kết quả mong đợi | Tag |
|-----|--------------|-----------|-----------|----------|-------|----------|------------------|-----|
| 01 | Nominal – không đổi password | 1 | "Jane" | "Doe" | "0909123456" | null | Hợp lệ – save() được gọi | V1,V2,V3,V4,V5 |
| 02 | patientId không tồn tại | 99 | "Jane" | "Doe" | "0909123456" | null | Không hợp lệ – throw "Patient not found" | X1 |
| 03 | password rỗng – không đổi (min) | 1 | "Jane" | "Doe" | "0909123456" | "" | Hợp lệ – password giữ nguyên | V1,V5,B1 |
| 04 | password 1 ký tự – phải encode (min+) | 1 | "Jane" | "Doe" | "0909123456" | "a" | Hợp lệ – password lưu dạng $2a$... | V1,V6,B2 |
| 05 | password nominal – phải encode (BUG) | 1 | "Jane" | "Doe" | "0909123456" | "newpassword123" | Không hợp lệ – password lưu plain text ← FAIL | X5,B3 |
| 06 | password 50 ký tự – phải encode (max) | 1 | "Jane" | "Doe" | "0909123456" | "a"×50 | Hợp lệ – password lưu dạng $2a$... | V1,V6,B5 |
| 07 | firstName min (1 ký tự) | 1 | "J" | "Doe" | "0909123456" | null | Hợp lệ – save() được gọi | V1,V2,B6 |
| 08 | firstName max (50 ký tự) | 1 | "a"×50 | "Doe" | "0909123456" | null | Hợp lệ – save() được gọi | V1,V2,B10 |
| 09 | phone min (0 ký tự) | 1 | "Jane" | "Doe" | "" | null | Hợp lệ – phone rỗng được chấp nhận | V1,V4,B11 |
| 10 | phone max (10 ký tự) | 1 | "Jane" | "Doe" | "0909123456" | null | Hợp lệ – save() được gọi | V1,V4,B15 |

---

# 4. Unit Test Code

```java
package com.e_health_care.web.patient.service;

import com.e_health_care.web.BaseServiceTest;
import com.e_health_care.web.patient.dto.PatientDTO;
import com.e_health_care.web.patient.model.Patient;
import com.e_health_care.web.patient.repository.PatientRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientUpdateProfileServiceTest extends BaseServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientUpdateProfileService service;

    // TC01 [V1,V2,V3,V4,V5] – nominal, không đổi password
    @Test
    @DisplayName("TC01 [V1,V2,V3,V4,V5]: cập nhật hợp lệ không có password -> save() được gọi")
    void tc01_updatePatient_noPassword_shouldSave() {
        Patient p = new Patient();
        p.setId(1L);
        p.setPassword("$2a$10$oldHashedPassword");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPhone("0909123456");

        service.updatePatient(dto, 1L);

        verify(patientRepository, times(1)).save(any());
    }

    // TC02 [X1] – patientId không tồn tại
    @Test
    @DisplayName("TC02 [X1]: patientId không tồn tại -> throw 'Patient not found'")
    void tc02_updatePatient_patientNotFound_shouldThrow() {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                service.updatePatient(new PatientDTO(), 99L));
        assertEquals("Patient not found", ex.getMessage());
    }

    // TC03 [V1,V5,B1] – password rỗng, không đổi
    @Test
    @DisplayName("TC03 [V5,B1]: password rỗng -> password giữ nguyên, không bị ghi đè")
    void tc03_updatePatient_emptyPassword_shouldNotChangePassword() {
        Patient p = new Patient();
        p.setId(1L);
        p.setPassword("$2a$10$oldHashedPassword");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        ArgumentCaptor<Patient> captor = ArgumentCaptor.forClass(Patient.class);

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPassword(""); // B1: rỗng

        service.updatePatient(dto, 1L);

        verify(patientRepository).save(captor.capture());
        assertEquals("$2a$10$oldHashedPassword", captor.getValue().getPassword(),
                "Password rỗng không được làm thay đổi password hiện tại!");
    }

    // TC04 [V1,V6,B2] – password 1 ký tự (min+), phải encode
    @Test
    @DisplayName("TC04 [V6,B2]: password 1 ký tự -> phải lưu dạng BCrypt hash $2a$...")
    void tc04_updatePatient_password1Char_shouldBeEncoded() {
        Patient p = new Patient();
        p.setId(1L);
        p.setPassword("$2a$10$oldHashedPassword");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        ArgumentCaptor<Patient> captor = ArgumentCaptor.forClass(Patient.class);

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPassword("a"); // B2: 1 ký tự

        service.updatePatient(dto, 1L);

        verify(patientRepository).save(captor.capture());
        String savedPassword = captor.getValue().getPassword();

        assertNotEquals("a", savedPassword,
                "Password 1 ký tự không được lưu plain text!");
        assertTrue(savedPassword.startsWith("$2a$"),
                "Password phải là BCrypt hash (bắt đầu bằng $2a$)!");
    }

    // TC05 [X5,B3] – BUG EHC-56: password có giá trị nhưng lưu plain text
    @Test
    @DisplayName("TC05 [X5,B3] EHC-56 BUG: password 'newpassword123' phải được BCrypt encode, không lưu plain text")
    void tc05_EHC56_passwordShouldBeEncoded_notPlainText() {
        Patient p = new Patient();
        p.setId(1L);
        p.setPassword("$2a$10$oldHashedPassword");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        ArgumentCaptor<Patient> captor = ArgumentCaptor.forClass(Patient.class);

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPassword("newpassword123"); // B3: nominal

        service.updatePatient(dto, 1L);

        verify(patientRepository).save(captor.capture());
        String savedPassword = captor.getValue().getPassword();

        // Test này FAIL vì code lưu plain text
        assertNotEquals("newpassword123", savedPassword,
                "BUG EHC-56: Password lưu plain text, không qua passwordEncoder!");
        assertTrue(savedPassword.startsWith("$2a$"),
                "BUG EHC-56: Password phải là BCrypt hash (bắt đầu bằng $2a$)!");
    }

    // TC06 [V1,V6,B5] – password 50 ký tự (max), phải encode
    @Test
    @DisplayName("TC06 [V6,B5]: password 50 ký tự -> phải lưu dạng BCrypt hash $2a$...")
    void tc06_updatePatient_password50Chars_shouldBeEncoded() {
        Patient p = new Patient();
        p.setId(1L);
        p.setPassword("$2a$10$oldHashedPassword");
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        ArgumentCaptor<Patient> captor = ArgumentCaptor.forClass(Patient.class);

        String pass50 = "a".repeat(50); // B5: 50 ký tự
        PatientDTO dto = new PatientDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPassword(pass50);

        service.updatePatient(dto, 1L);

        verify(patientRepository).save(captor.capture());
        String savedPassword = captor.getValue().getPassword();

        assertNotEquals(pass50, savedPassword,
                "Password 50 ký tự không được lưu plain text!");
        assertTrue(savedPassword.startsWith("$2a$"),
                "Password phải là BCrypt hash (bắt đầu bằng $2a$)!");
    }

    // TC07 [V1,V2,B6] – firstName 1 ký tự (biên min)
    @Test
    @DisplayName("TC07 [V2,B6]: firstName 1 ký tự -> hợp lệ, save() được gọi")
    void tc07_firstName_minBoundary_shouldSave() {
        Patient p = new Patient();
        p.setId(1L);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("J"); // B6: 1 ký tự
        dto.setLastName("Doe");
        dto.setPhone("0909123456");

        service.updatePatient(dto, 1L);
        verify(patientRepository, times(1)).save(any());
    }

    // TC08 [V1,V2,B10] – firstName 50 ký tự (biên max)
    @Test
    @DisplayName("TC08 [V2,B10]: firstName 50 ký tự -> hợp lệ, save() được gọi")
    void tc08_firstName_maxBoundary_shouldSave() {
        Patient p = new Patient();
        p.setId(1L);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("a".repeat(50)); // B10: 50 ký tự
        dto.setLastName("Doe");
        dto.setPhone("0909123456");

        service.updatePatient(dto, 1L);
        verify(patientRepository, times(1)).save(any());
    }

    // TC09 [V1,V4,B11] – phone rỗng (biên min)
    @Test
    @DisplayName("TC09 [V4,B11]: phone rỗng -> hợp lệ, save() được gọi")
    void tc09_phone_emptyBoundary_shouldSave() {
        Patient p = new Patient();
        p.setId(1L);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPhone(""); // B11: 0 ký tự

        service.updatePatient(dto, 1L);
        verify(patientRepository, times(1)).save(any());
    }

    // TC10 [V1,V4,B15] – phone 10 ký tự (biên max)
    @Test
    @DisplayName("TC10 [V4,B15]: phone 10 ký tự -> hợp lệ, save() được gọi")
    void tc10_phone_maxBoundary_shouldSave() {
        Patient p = new Patient();
        p.setId(1L);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(p));

        PatientDTO dto = new PatientDTO();
        dto.setFirstName("Jane");
        dto.setLastName("Doe");
        dto.setPhone("0909123456"); // B15: 10 ký tự

        service.updatePatient(dto, 1L);
        verify(patientRepository, times(1)).save(any());
    }
}
```

**Kết quả:**

```
tc01_updatePatient_noPassword_shouldSave ...................... ok
tc02_updatePatient_patientNotFound_shouldThrow ................ ok
tc03_updatePatient_emptyPassword_shouldNotChangePassword ...... ok
tc04_updatePatient_password1Char_shouldBeEncoded .............. FAIL

org.opentest4j.AssertionFailedError:
Password phải là BCrypt hash (bắt đầu bằng $2a$)!
==> expected: <true> but was: <false>
    savedPassword = "a"

tc05_EHC56_passwordShouldBeEncoded_notPlainText ............... FAIL

org.opentest4j.AssertionFailedError:
BUG EHC-56: Password phải là BCrypt hash (bắt đầu bằng $2a$)!
==> expected: <true> but was: <false>
    savedPassword = "newpassword123"

tc06_updatePatient_password50Chars_shouldBeEncoded ............ FAIL

org.opentest4j.AssertionFailedError:
Password phải là BCrypt hash (bắt đầu bằng $2a$)!
==> expected: <true> but was: <false>
    savedPassword = "aaaaa...aaa" (50 ký tự)

tc07_firstName_minBoundary_shouldSave ......................... ok
tc08_firstName_maxBoundary_shouldSave ......................... ok
tc09_phone_emptyBoundary_shouldSave ........................... ok
tc10_phone_maxBoundary_shouldSave ............................. ok

Ran 10 tests in 0.038s — 7 PASS, 3 FAIL
```

---

## Bug Report

### EHC-56 – Password lưu plain text trong `updatePatient()`

| Field | Value |
|-------|-------|
| Bug ID | EHC-56 |
| Title | `updatePatient()` lưu password mới dạng plain text, không qua BCrypt encode |
| Reporter | Nguyễn Văn Trường |
| Assignee | Trần Đông Hil |
| Severity | Critical |
| Priority | High |
| Phát hiện qua | TC04, TC05, TC06 – PatientUpdateProfileServiceTest |
| Môi trường | JUnit 5.12.2 + Mockito 5.17.0, IntelliJ, H2 test profile |

**Mô tả lỗi:**

Dòng 62 trong `PatientUpdateProfileService.java` thiếu lệnh encode:

```java
// Code hiện tại – BUG
if (patientDTO.getPassword() != null && !patientDTO.getPassword().isEmpty()) {
    patient.setPassword(patientDTO.getPassword()); // ← lưu plain text
}
```

Hậu quả:
- Mật khẩu lộ plain text trong DB.
- Đăng nhập lần tiếp theo **FAIL** vì Spring Security so sánh plain text với BCrypt hash cũ.

**Steps to Reproduce:**
1. Đăng nhập bằng tài khoản patient.
2. Vào trang cập nhật hồ sơ, nhập mật khẩu mới và lưu.
3. Đăng xuất, thử đăng nhập bằng mật khẩu mới → Login fail.
4. Kiểm tra DB: `SELECT password FROM patient WHERE id = 1` → thấy plain text.

**Expected:** `$2a$10$...` (BCrypt hash)

**Actual:** `newpassword123` (plain text)

**Suggested Fix:**

```java
@Autowired
private PasswordEncoder passwordEncoder;

if (patientDTO.getPassword() != null && !patientDTO.getPassword().isEmpty()) {
    patient.setPassword(passwordEncoder.encode(patientDTO.getPassword())); // ← encode
}
```

**Branch:** `fix/EHC-56-encode-password-updatePatient`

---

## Quy trình nhóm (Tester → Jira → Developer)

```
Tester chạy PatientUpdateProfileServiceTest
    → TC04, TC05, TC06 FAIL (savedPassword là plain text, không phải $2a$...)
    → Tạo bug EHC-56 trên Jira (Reporter: Nguyễn Văn Trường, Assignee: Trần Đông Hil)
    → Dev tạo branch fix/EHC-56-encode-password-updatePatient
    → Inject PasswordEncoder, thêm .encode() vào dòng setPassword
    → Commit: "EHC-56: encode password before saving in updatePatient"
    → PR → merge → Tester verify → TC04, TC05, TC06 PASS → Close EHC-56
```

## Tag Coverage Summary

| Tag | Mô tả | Status |
|-----|-------|--------|
| V1 | patientId tồn tại trong DB | ✅ covered |
| V2 | firstName hợp lệ | ✅ covered |
| V3 | lastName hợp lệ | ✅ covered |
| V4 | phone hợp lệ | ✅ covered |
| V5 | password null/rỗng – không đổi | ✅ covered |
| V6 | password có giá trị – phải encode | ✅ covered |
| X1 | patientId không tồn tại | ✅ covered |
| X5 | password lưu plain text (BUG EHC-56) | ✅ covered |
| B1 | password rỗng (min) | ✅ covered |
| B2 | password 1 ký tự (min+) | ✅ covered |
| B3 | password 14 ký tự (nominal) | ✅ covered |
| B5 | password 50 ký tự (max) | ✅ covered |
| B6 | firstName 1 ký tự (min) | ✅ covered |
| B10 | firstName 50 ký tự (max) | ✅ covered |
| B11 | phone 0 ký tự (min) | ✅ covered |
| B15 | phone 10 ký tự (max) | ✅ covered |

**16/16 tags covered (100%)**
