# Kiểm thử hàm `PatientAuthenticationService.register()`

> **Hàm nguồn:** `web/src/main/java/com/e_health_care/web/patient/service/PatientAuthenticationService.java`
> **Luồng:** Tester xây dựng EP/BVA → Thiết kế test case → Viết JUnit Test → Tạo Bug Report (nếu có lỗi) → Dev fix → Tester verify → Đóng ticket

---

## Câu 1. Xác định lớp tương đương (Equivalence Partitioning)

| Biến đầu vào | Lớp hợp lệ | Tag | Lớp không hợp lệ | Tag |
|---|---|---|---|---|
| email | Đúng định dạng email, chưa tồn tại trong DB | V1 | Sai định dạng email (không có @, không có domain) | X1 |
| | | | Email đã tồn tại trong DB | X2 |
| | | | Email rỗng / null | X3 |
| password | 8 ≤ length ≤ 50 | V2 | length < 8 | X4 |
| | | | length > 50 | X5 |
| | | | password rỗng / null | X6 |
| firstName | 1 ≤ length ≤ 50, không rỗng | V3 | firstName rỗng / null | X7 |
| | | | length > 50 | X8 |
| lastName | 1 ≤ length ≤ 50, không rỗng | V4 | lastName rỗng / null | X9 |
| | | | length > 50 | X10 |
| phone | 0 ≤ length ≤ 10 (nullable) | V5 | length > 10 | X11 |

### Giải thích Tag

| Tag | Ý nghĩa |
|---|---|
| V1 | Email hợp lệ và chưa tồn tại |
| V2 | Password hợp lệ (8–50 ký tự) |
| V3 | firstName hợp lệ |
| V4 | lastName hợp lệ |
| V5 | Phone hợp lệ (≤ 10 ký tự) |
| X1 | Email sai định dạng |
| X2 | Email đã tồn tại trong hệ thống |
| X3 | Email rỗng hoặc null |
| X4 | Password quá ngắn (< 8 ký tự) |
| X5 | Password quá dài (> 50 ký tự) |
| X6 | Password rỗng hoặc null |
| X7 | firstName rỗng hoặc null |
| X8 | firstName quá dài (> 50 ký tự) |
| X9 | lastName rỗng hoặc null |
| X10 | lastName quá dài (> 50 ký tự) |
| X11 | Phone quá dài (> 10 ký tự) |

---

## Câu 2. Phân tích giá trị biên (Boundary Value Analysis)

| Biến đầu vào | min | min+ | nominal | max- | max | Tag biên |
|---|---|---|---|---|---|---|
| password (length) | 8 | 9 | 29 | 49 | 50 | B1–B5 |
| firstName (length) | 1 | 2 | 25 | 49 | 50 | B6–B10 |
| lastName (length) | 1 | 2 | 25 | 49 | 50 | B11–B15 |
| phone (length) | 0 | 1 | 5 | 9 | 10 | B16–B20 |

### Ý nghĩa Tag biên

| Tag | Giá trị |
|---|---|
| B1 | password = 8 ký tự |
| B2 | password = 9 ký tự |
| B3 | password = 29 ký tự |
| B4 | password = 49 ký tự |
| B5 | password = 50 ký tự |
| B6 | firstName = 1 ký tự |
| B7 | firstName = 2 ký tự |
| B8 | firstName = 25 ký tự |
| B9 | firstName = 49 ký tự |
| B10 | firstName = 50 ký tự |
| B11 | lastName = 1 ký tự |
| B12 | lastName = 2 ký tự |
| B13 | lastName = 25 ký tự |
| B14 | lastName = 49 ký tự |
| B15 | lastName = 50 ký tự |
| B16 | phone = 0 ký tự (null/rỗng) |
| B17 | phone = 1 ký tự |
| B18 | phone = 5 ký tự |
| B19 | phone = 9 ký tự |
| B20 | phone = 10 ký tự |

---

## Câu 3. Thiết kế Test Case

| STT | Tên Test Case | email | password | firstName | lastName | phone | Kết quả mong đợi | Tag |
|---|---|---|---|---|---|---|---|---|
| 01 | Nominal – tất cả hợp lệ | new@test.com | Pass1234 | Nguyen | Van A | 0901234567 | Đăng ký thành công, trả về Patient object | V1,V2,V3,V4,V5,B3 |
| 02 | password = min (8 ký tự) | p2@test.com | Aa123456 | Nguyen | Van A | 0901234567 | Đăng ký thành công | B1 |
| 03 | password = min+ (9 ký tự) | p3@test.com | Aa1234567 | Nguyen | Van A | 0901234567 | Đăng ký thành công | B2 |
| 04 | password = max- (49 ký tự) | p4@test.com | Aa1234567890123456789012345678901234567890123456 | Nguyen | Van A | 0901234567 | Đăng ký thành công | B4 |
| 05 | password = max (50 ký tự) | p5@test.com | Aa12345678901234567890123456789012345678901234567 | Nguyen | Van A | 0901234567 | Đăng ký thành công | B5 |
| 06 | firstName = min (1 ký tự) | p6@test.com | Pass1234 | A | Van A | 0901234567 | Đăng ký thành công | B6 |
| 07 | firstName = max (50 ký tự) | p7@test.com | Pass1234 | Nguyen12345678901234567890123456789012345678901 | Van A | 0901234567 | Đăng ký thành công | B10 |
| 08 | lastName = min (1 ký tự) | p8@test.com | Pass1234 | Nguyen | A | 0901234567 | Đăng ký thành công | B11 |
| 09 | lastName = max (50 ký tự) | p9@test.com | Pass1234 | Nguyen | VanA12345678901234567890123456789012345678901234 | 0901234567 | Đăng ký thành công | B15 |
| 10 | phone = min (rỗng) | p10@test.com | Pass1234 | Nguyen | Van A | (rỗng) | Đăng ký thành công (phone nullable) | B16 |
| 11 | phone = max (10 ký tự) | p11@test.com | Pass1234 | Nguyen | Van A | 0901234567 | Đăng ký thành công | B20 |
| 12 | Email sai định dạng | not-an-email | Pass1234 | Nguyen | Van A | 0901234567 | Không hợp lệ – email sai định dạng | X1 |
| 13 | Email đã tồn tại | existing@test.com | Pass1234 | Nguyen | Van A | 0901234567 | Ném RuntimeException "Email is already used" | X2 |
| 14 | Email rỗng | (rỗng) | Pass1234 | Nguyen | Van A | 0901234567 | Không hợp lệ – email rỗng | X3 |
| 15 | password < min (7 ký tự) | p15@test.com | Aa12345 | Nguyen | Van A | 0901234567 | Không hợp lệ – password quá ngắn | X4 |
| 16 | password > max (51 ký tự) | p16@test.com | Aa123456789012345678901234567890123456789012345678 | Nguyen | Van A | 0901234567 | Không hợp lệ – password quá dài | X5 |
| 17 | password rỗng | p17@test.com | (rỗng) | Nguyen | Van A | 0901234567 | Không hợp lệ – password rỗng | X6 |
| 18 | firstName rỗng | p18@test.com | Pass1234 | (rỗng) | Van A | 0901234567 | Không hợp lệ – firstName rỗng | X7 |
| 19 | firstName > max (51 ký tự) | p19@test.com | Pass1234 | Nguyen123456789012345678901234567890123456789012 | Van A | 0901234567 | Không hợp lệ – firstName quá dài | X8 |
| 20 | lastName rỗng | p20@test.com | Pass1234 | Nguyen | (rỗng) | 0901234567 | Không hợp lệ – lastName rỗng | X9 |
| 21 | phone > max (11 ký tự) | p21@test.com | Pass1234 | Nguyen | Van A | 09012345678 | Không hợp lệ – phone quá dài | X11 |

---

## Câu 4. Unit Test Code (JUnit 5 + Mockito)

```java
package com.e_health_care.web.patient.service;

import com.e_health_care.web.patient.dto.PatientDTO;
import com.e_health_care.web.patient.model.Patient;
import com.e_health_care.web.patient.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PatientAuthenticationServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PatientAuthenticationService service;

    private PatientDTO buildDTO(String email, String password, String firstName, String lastName, String phone) {
        PatientDTO dto = new PatientDTO();
        dto.setEmail(email);
        dto.setPassword(password);
        dto.setFirstName(firstName);
        dto.setLastName(lastName);
        dto.setPhone(phone);
        return dto;
    }

    @BeforeEach
    void setUp() {
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(patientRepository.save(any(Patient.class))).thenAnswer(i -> i.getArgument(0));
    }

    // TC01 – Nominal: tất cả hợp lệ
    @Test
    void test_TC01_nominal_valid() {
        when(patientRepository.findByEmail("new@test.com")).thenReturn(Optional.empty());
        PatientDTO dto = buildDTO("new@test.com", "Pass1234", "Nguyen", "Van A", "0901234567");
        Patient result = service.register(dto);
        assertNotNull(result);
        assertEquals("new@test.com", result.getEmail());
    }

    // TC02 – password = min (8 ký tự)
    @Test
    void test_TC02_password_min_boundary() {
        when(patientRepository.findByEmail("p2@test.com")).thenReturn(Optional.empty());
        PatientDTO dto = buildDTO("p2@test.com", "Aa123456", "Nguyen", "Van A", "0901234567");
        assertDoesNotThrow(() -> service.register(dto));
    }

    // TC05 – password = max (50 ký tự)
    @Test
    void test_TC05_password_max_boundary() {
        when(patientRepository.findByEmail("p5@test.com")).thenReturn(Optional.empty());
        String pwd50 = "Aa" + "1".repeat(48); // 50 chars
        PatientDTO dto = buildDTO("p5@test.com", pwd50, "Nguyen", "Van A", "0901234567");
        assertDoesNotThrow(() -> service.register(dto));
    }

    // TC06 – firstName = min (1 ký tự)
    @Test
    void test_TC06_firstName_min_boundary() {
        when(patientRepository.findByEmail("p6@test.com")).thenReturn(Optional.empty());
        PatientDTO dto = buildDTO("p6@test.com", "Pass1234", "A", "Van A", "0901234567");
        assertDoesNotThrow(() -> service.register(dto));
    }

    // TC10 – phone rỗng (nullable)
    @Test
    void test_TC10_phone_empty_nullable() {
        when(patientRepository.findByEmail("p10@test.com")).thenReturn(Optional.empty());
        PatientDTO dto = buildDTO("p10@test.com", "Pass1234", "Nguyen", "Van A", "");
        assertDoesNotThrow(() -> service.register(dto));
    }

    // TC13 – Email đã tồn tại → ném RuntimeException
    @Test
    void test_TC13_email_already_exists() {
        Patient existing = new Patient();
        existing.setEmail("existing@test.com");
        when(patientRepository.findByEmail("existing@test.com")).thenReturn(Optional.of(existing));
        PatientDTO dto = buildDTO("existing@test.com", "Pass1234", "Nguyen", "Van A", "0901234567");
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.register(dto));
        assertTrue(ex.getMessage().contains("Email is already used"));
    }

    // TC15 – password < min (7 ký tự) — service không tự validate length (để Spring Validation làm),
    // nhưng nếu gọi thẳng service thì vẫn lưu được → test này verify hành vi hiện tại
    @Test
    void test_TC15_password_below_min_direct_call() {
        when(patientRepository.findByEmail("p15@test.com")).thenReturn(Optional.empty());
        PatientDTO dto = buildDTO("p15@test.com", "Aa123", "Nguyen", "Van A", "0901234567");
        // Gọi thẳng service (không qua @Valid): vẫn lưu được → ghi chú BUG nếu expect reject
        Patient result = service.register(dto);
        assertNotNull(result, "Service không tự validate password length – cần @Valid ở controller");
    }
}
```

**Kết quả chạy test (expected):**

```
test_TC01_nominal_valid .................................................. OK
test_TC02_password_min_boundary .......................................... OK
test_TC05_password_max_boundary .......................................... OK
test_TC06_firstName_min_boundary ......................................... OK
test_TC10_phone_empty_nullable ........................................... OK
test_TC13_email_already_exists ........................................... OK
test_TC15_password_below_min_direct_call ................................. OK

Tests run: 7, Failures: 0, Errors: 0
```

> **Ghi chú phát hiện:** `PatientAuthenticationService.register()` không tự kiểm tra độ dài password / firstName / lastName. Validation chỉ hoạt động qua `@Valid` tại Controller. Nếu gọi thẳng service layer thì dữ liệu không hợp lệ vẫn được lưu. Cần tạo Bug Report và assign cho Dev xem xét thêm validation tại service layer nếu cần.
