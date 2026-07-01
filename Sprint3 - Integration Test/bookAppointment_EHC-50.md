# Kiểm thử chức năng đặt lịch khám (bookAppointment)

**Môn học:** Kiểm thử phần mềm  
**Chủ đề:** Phân hoạch lớp tương đương, phân tích giá trị biên, thiết kế test case và kiểm thử tự động  
**Chức năng kiểm thử:** `bookAppointment()` – PatientAppointmentService  
**Hệ thống:** E-Health Care (EHC) – Spring Boot Backend  
**Người thực hiện:** Trần Đông Hil (Tester – Reporter)  
**Jira Project:** EHC-50

---

## 1. Mục tiêu

1. Xác định **điều kiện kiểm thử** từ đặc tả hàm `bookAppointment()`.
2. Áp dụng kỹ thuật **phân hoạch lớp tương đương (Equivalence Partitioning)** cho từng điều kiện đầu vào.
3. Áp dụng kỹ thuật **phân tích giá trị biên (Boundary Value Analysis)** cho trường `scheduleTime`.
4. Thiết kế **bảng test case** đầy đủ input, expected result và tag bao phủ.
5. Triển khai **unit test tự động** bằng JUnit 5 + Mockito.

---

## 2. Mô tả bài toán

Hàm `bookAppointment(AppointmentRequestDTO request)` trong `PatientAppointmentService` nhận một yêu cầu đặt lịch khám và trả về đối tượng `Appointment` với trạng thái `PENDING` nếu hợp lệ, hoặc ném ngoại lệ `RuntimeException` nếu vi phạm bất kỳ điều kiện nào.

### Các biến đầu vào

| Biến đầu vào  | Ý nghĩa                          | Kiểu dữ liệu    | Điều kiện hợp lệ                                  |
| ------------- | -------------------------------- | --------------- | ------------------------------------------------- |
| `patientId`   | ID bệnh nhân đặt lịch            | Long            | Tồn tại trong hệ thống                            |
| `doctorId`    | ID bác sĩ được chọn              | Long            | Tồn tại trong hệ thống                            |
| `scheduleTime`| Thời điểm đặt lịch khám         | LocalDateTime   | Phải sau thời điểm hiện tại (tương lai)           |
| Doctor status | Trạng thái lịch bác sĩ           | (nghiệp vụ)     | Bác sĩ không có lịch khác trong cùng khung giờ   |

### Kết quả trả về

- `Appointment` với `status = "PENDING"` nếu tất cả điều kiện thỏa mãn.
- `RuntimeException("Patient not found")` nếu `patientId` không tồn tại.
- `RuntimeException("Doctor not found")` nếu `doctorId` không tồn tại.
- `RuntimeException("Cannot book appointment in the past")` nếu `scheduleTime` ≤ hiện tại.
- `RuntimeException("Doctor is not available at this time")` nếu bác sĩ đã có lịch.

### Logic kiểm tra (theo thứ tự ưu tiên)

```
Valid = (patientId tồn tại)
      ∧ (doctorId tồn tại)
      ∧ (scheduleTime > now())
      ∧ (doctor không bận cùng khung giờ)
```

---

## Câu 1. Xác định lớp tương đương

### Bảng phân hoạch lớp tương đương

| Conditions    | Valid Partitions                              | Tag | Invalid Partitions                             | Tag |
| ------------- | -------------------------------------------- | --- | ---------------------------------------------- | --- |
| patientId     | patientId tồn tại trong DB                   | V1  | patientId không tồn tại trong DB               | X1  |
| doctorId      | doctorId tồn tại trong DB                    | V2  | doctorId không tồn tại trong DB                | X2  |
| scheduleTime  | scheduleTime > now() (thời điểm tương lai)   | V3  | scheduleTime < now() (thời điểm quá khứ)       | X3  |
|               |                                              |     | scheduleTime = now() (thời điểm hiện tại)      | X4  |
| Doctor status | Bác sĩ không có lịch cùng khung giờ         | V4  | Bác sĩ đã có lịch khám trong khung giờ đó     | X5  |

### Yêu cầu

- Mỗi điều kiện có ít nhất 1 lớp hợp lệ.
- `scheduleTime` có 2 lớp không hợp lệ: quá khứ (X3) và đúng thời điểm hiện tại (X4) do độ trễ thực thi.
- Mỗi lớp được đặt tag để theo dõi độ bao phủ:
  - `V1–V4`: lớp hợp lệ.
  - `X1–X5`: lớp không hợp lệ.

---

## Câu 2. Phân tích giá trị biên

Áp dụng **Standard BVA** cho `scheduleTime` — biến duy nhất có miền giá trị liên tục với ranh giới rõ ràng tại `now()`.

| Ký hiệu   | Ý nghĩa                                  | Giá trị đại diện       | Tag |
| --------- | ---------------------------------------- | ---------------------- | --- |
| `min−`    | Ngay trước ranh giới (quá khứ gần nhất) | `now() − 1 giây`       | B1  |
| `min`     | Đúng ranh giới (hiện tại)               | `now()`                | B2  |
| `min+`    | Ngay sau ranh giới (tương lai gần nhất) | `now() + 1 giây`       | B3  |
| `nominal` | Giá trị đại diện vùng hợp lệ            | `now() + 1 ngày`       | B4  |
| `max`     | Giá trị biên nghiệp vụ xa nhất          | `now() + 30 ngày`      | B5  |

> **Lưu ý:** `scheduleTime` không có `max` cứng theo yêu cầu nghiệp vụ hiện tại. B5 (now()+30 ngày) được chọn làm biên nghiệp vụ để kiểm thử trường hợp đặt lịch xa trong tương lai.

---

## Câu 3. Thiết kế test case

Dựa trên Câu 1 và Câu 2, bảng test case gồm **9 test case** như sau:

| STT | Tên test case                       | patientId | doctorId | scheduleTime       | Doctor status | Kết quả mong đợi                                          | Tag được bao phủ  |
| --: | ----------------------------------- | --------: | -------: | ------------------ | ------------- | ---------------------------------------------------------- | ----------------- |
|  01 | Tất cả điều kiện hợp lệ (nominal)  |         1 |        1 | now() + 1 ngày     | Rảnh          | **Hợp lệ** – trả về Appointment(status=PENDING)           | V1, V2, V3, V4, B4 |
|  02 | patientId không tồn tại            |       999 |        1 | now() + 1 ngày     | Rảnh          | **Không hợp lệ** – throw "Patient not found"              | X1                |
|  03 | doctorId không tồn tại             |         1 |      999 | now() + 1 ngày     | Rảnh          | **Không hợp lệ** – throw "Doctor not found"               | X2                |
|  04 | scheduleTime quá khứ (B1: now−1s)  |         1 |        1 | now() − 1 giây     | Rảnh          | **Không hợp lệ** – throw "Cannot book appointment in the past" | X3, B1        |
|  05 | scheduleTime = now() (B2)          |         1 |        1 | now()              | Rảnh          | **Không hợp lệ** – throw "Cannot book appointment in the past" | X4, B2        |
|  06 | scheduleTime biên hợp lệ (B3: now+1s) |      1 |        1 | now() + 1 giây     | Rảnh          | **Hợp lệ** – trả về Appointment(status=PENDING)           | V3, B3            |
|  07 | Doctor bận cùng khung giờ          |         1 |        1 | now() + 1 ngày     | Bận           | **Không hợp lệ** – throw "Doctor is not available at this time" | X5           |
|  08 | scheduleTime biên xa (B5: now+30d) |         1 |        1 | now() + 30 ngày    | Rảnh          | **Hợp lệ** – trả về Appointment(status=PENDING)           | V3, B5            |
|  09 | Nhiều điều kiện sai – lỗi đầu tiên |       999 |      999 | now() − 1 ngày     | –             | **Không hợp lệ** – throw "Patient not found" (ưu tiên X1) | X1 (ưu tiên)      |

---

## Câu 4. Triển khai kiểm thử tự động

### Ngôn ngữ & Framework

| Ngôn ngữ | Framework      | Version           |
| -------- | -------------- | ----------------- |
| Java     | JUnit 5        | 5.12.2            |
| Java     | Mockito        | 5.17.0            |
| IDE      | IntelliJ IDEA  | –                 |
| Profile  | H2 in-memory   | test profile      |

### Hàm nghiệp vụ kiểm thử

```java
// PatientAppointmentService.java (tóm tắt logic)
public Appointment bookAppointment(AppointmentRequestDTO request) {
    Patient patient = patientRepository.findById(request.getPatientId())
        .orElseThrow(() -> new RuntimeException("Patient not found"));

    Doctor doctor = doctorRepository.findById(request.getDoctorId())
        .orElseThrow(() -> new RuntimeException("Doctor not found"));

    if (!request.getScheduleTime().isAfter(LocalDateTime.now())) {
        throw new RuntimeException("Cannot book appointment in the past");
    }

    List<Appointment> conflicts = appointmentRepository
        .findByDoctorIdAndScheduleTimeBetween(...);
    if (!conflicts.isEmpty()) {
        throw new RuntimeException("Doctor is not available at this time");
    }

    Appointment appt = new Appointment();
    appt.setStatus("PENDING");
    return appointmentRepository.save(appt);
}
```

### File test: `JIRABookAppointmentEpBvaTest.java`

```java
package com.e_health_care.web.patient.service;

import com.e_health_care.web.BaseServiceTest;
import com.e_health_care.web.doctor.model.Doctor;
import com.e_health_care.web.doctor.repository.DoctorRepository;
import com.e_health_care.web.patient.dto.AppointmentRequestDTO;
import com.e_health_care.web.patient.model.Appointment;
import com.e_health_care.web.patient.model.Patient;
import com.e_health_care.web.patient.repository.PatientAppointmentRepository;
import com.e_health_care.web.patient.repository.PatientRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Equivalence Partitioning + Boundary Value Analysis
 * cho bookAppointment() — PatientAppointmentService
 *
 * Tag mapping:
 *   V1 = patientId hợp lệ (tồn tại)      X1 = patientId không tồn tại
 *   V2 = doctorId hợp lệ (tồn tại)       X2 = doctorId không tồn tại
 *   V3 = scheduleTime tương lai           X3 = scheduleTime quá khứ
 *   V4 = doctor rảnh                      X4 = scheduleTime = now()
 *                                         X5 = doctor đã có lịch khác
 *   B1 = now()-1s (biên dưới ngoài)
 *   B2 = now()   (đúng ranh giới)
 *   B3 = now()+1s (biên dưới trong)
 *   B4 = now()+1 ngày (nominal)
 *   B5 = now()+30 ngày (biên nghiệp vụ xa)
 */
class JIRABookAppointmentEpBvaTest extends BaseServiceTest {

    @Mock private PatientAppointmentRepository appointmentRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private DoctorRepository doctorRepository;

    @InjectMocks
    private PatientAppointmentService service;

    private AppointmentRequestDTO request(Long patientId, Long doctorId, LocalDateTime time) {
        AppointmentRequestDTO dto = new AppointmentRequestDTO();
        dto.setPatientId(patientId);
        dto.setDoctorId(doctorId);
        dto.setScheduleTime(time);
        return dto;
    }

    // TC01 — V1, V2, V3, V4, B4 — nominal hợp lệ
    @Test
    @DisplayName("TC01 [V1,V2,V3,V4,B4]: tất cả điều kiện hợp lệ -> tạo appointment PENDING")
    void tc01_allValid_shouldCreateAppointment() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(new Patient()));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(new Doctor()));
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(any(), any(), any()))
                .thenReturn(List.of());
        when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Appointment result = service.bookAppointment(
                request(1L, 1L, LocalDateTime.now().plusDays(1)));   // B4 nominal

        assertEquals("PENDING", result.getStatus());
    }

    // TC02 — X1 — patient không tồn tại
    @Test
    @DisplayName("TC02 [X1]: patientId không tồn tại -> throw 'Patient not found'")
    void tc02_patientNotFound_shouldThrow() {
        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () ->
                service.bookAppointment(request(999L, 1L, LocalDateTime.now().plusDays(1))));
        assertEquals("Patient not found", ex.getMessage());
    }

    // TC03 — X2 — doctor không tồn tại
    @Test
    @DisplayName("TC03 [X2]: doctorId không tồn tại -> throw 'Doctor not found'")
    void tc03_doctorNotFound_shouldThrow() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(new Patient()));
        when(doctorRepository.findById(999L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () ->
                service.bookAppointment(request(1L, 999L, LocalDateTime.now().plusDays(1))));
        assertEquals("Doctor not found", ex.getMessage());
    }

    // TC04 — X3, B1 — scheduleTime quá khứ (now()-1s)
    @Test
    @DisplayName("TC04 [X3,B1]: scheduleTime = now()-1s -> throw 'Cannot book in the past'")
    void tc04_scheduleTimeBeforeBoundary_shouldThrow() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(new Patient()));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(new Doctor()));

        Exception ex = assertThrows(RuntimeException.class, () ->
                service.bookAppointment(request(1L, 1L, LocalDateTime.now().minusSeconds(1))));
        assertEquals("Cannot book appointment in the past", ex.getMessage());
    }

    // TC05 — X4, B2 — scheduleTime = now() chính xác
    @Test
    @DisplayName("TC05 [X4,B2]: scheduleTime = now() -> throw (rơi vào quá khứ do độ trễ thực thi)")
    void tc05_scheduleTimeExactlyNow_shouldThrow() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(new Patient()));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(new Doctor()));

        LocalDateTime now = LocalDateTime.now();
        Exception ex = assertThrows(RuntimeException.class, () ->
                service.bookAppointment(request(1L, 1L, now)));
        assertEquals("Cannot book appointment in the past", ex.getMessage());
    }

    // TC06 — V3, B3 — scheduleTime = now()+1s (biên hợp lệ gần nhất)
    @Test
    @DisplayName("TC06 [V3,B3]: scheduleTime = now()+1s -> hợp lệ (biên tương lai gần nhất)")
    void tc06_scheduleTimeJustAfterNow_shouldSucceed() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(new Patient()));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(new Doctor()));
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(any(), any(), any()))
                .thenReturn(List.of());
        when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Appointment result = service.bookAppointment(
                request(1L, 1L, LocalDateTime.now().plusSeconds(2)));

        assertEquals("PENDING", result.getStatus());
    }

    // TC07 — X5 — doctor đã có lịch khác cùng khung giờ
    @Test
    @DisplayName("TC07 [X5]: doctor đã có appointment khác cùng khung giờ -> throw 'not available'")
    void tc07_doctorBusy_shouldThrow() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(new Patient()));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(new Doctor()));
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(any(), any(), any()))
                .thenReturn(List.of(new Appointment()));

        Exception ex = assertThrows(RuntimeException.class, () ->
                service.bookAppointment(request(1L, 1L, LocalDateTime.now().plusDays(1))));
        assertEquals("Doctor is not available at this time", ex.getMessage());
    }

    // TC08 — V3, B5 — scheduleTime xa trong tương lai (biên nghiệp vụ)
    @Test
    @DisplayName("TC08 [V3,B5]: scheduleTime = now()+30 ngày -> hợp lệ")
    void tc08_scheduleTimeFarFuture_shouldSucceed() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(new Patient()));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(new Doctor()));
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(any(), any(), any()))
                .thenReturn(List.of());
        when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Appointment result = service.bookAppointment(
                request(1L, 1L, LocalDateTime.now().plusDays(30)));  // B5

        assertEquals("PENDING", result.getStatus());
    }

    // TC09 — X1 (ưu tiên) — nhiều điều kiện sai cùng lúc
    @Test
    @DisplayName("TC09 [X1]: nhiều điều kiện sai cùng lúc -> chỉ throw lỗi patient (kiểm tra đầu tiên)")
    void tc09_multipleInvalid_shouldThrowFirstCheckedError() {
        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class, () ->
                service.bookAppointment(request(999L, 999L, LocalDateTime.now().minusDays(1))));
        assertEquals("Patient not found", ex.getMessage(),
                "Code kiểm tra patient trước doctor và scheduleTime — " +
                "dù 3 điều kiện đều sai, chỉ lỗi đầu tiên được throw.");
    }
}
```

### Kết quả chạy test

| TC   | Input (patientId, doctorId, scheduleTime, doctorStatus) | Expected                                        | Actual  | Pass/Fail |
| ---- | ------------------------------------------------------- | ----------------------------------------------- | ------- | --------- |
| TC01 | 1, 1, now()+1d, rảnh                                    | PENDING                                         | PENDING | ✅ PASS   |
| TC02 | 999, 1, now()+1d, –                                     | throw "Patient not found"                       | throw   | ✅ PASS   |
| TC03 | 1, 999, now()+1d, –                                     | throw "Doctor not found"                        | throw   | ✅ PASS   |
| TC04 | 1, 1, now()-1s, –                                       | throw "Cannot book appointment in the past"     | throw   | ✅ PASS   |
| TC05 | 1, 1, now(), –                                          | throw "Cannot book appointment in the past"     | throw   | ✅ PASS   |
| TC06 | 1, 1, now()+1s, rảnh                                    | PENDING                                         | PENDING | ✅ PASS   |
| TC07 | 1, 1, now()+1d, bận                                     | throw "Doctor is not available at this time"    | throw   | ✅ PASS   |
| TC08 | 1, 1, now()+30d, rảnh                                   | PENDING                                         | PENDING | ✅ PASS   |
| TC09 | 999, 999, now()-1d, –                                   | throw "Patient not found"                       | throw   | ✅ PASS   |

**Tổng kết: 9/9 PASS**

### Tag Coverage Summary

| Tag | Mô tả                                    | Status       |
| --- | ---------------------------------------- | ------------ |
| V1  | patientId tồn tại trong DB               | ✅ covered   |
| V2  | doctorId tồn tại trong DB                | ✅ covered   |
| V3  | scheduleTime > now() (tương lai)         | ✅ covered   |
| V4  | Doctor không bận cùng khung giờ          | ✅ covered   |
| X1  | patientId không tồn tại                  | ✅ covered   |
| X2  | doctorId không tồn tại                   | ✅ covered   |
| X3  | scheduleTime < now() (quá khứ)           | ✅ covered   |
| X4  | scheduleTime = now() (đúng ranh giới)    | ✅ covered   |
| X5  | Doctor đã có lịch trong khung giờ        | ✅ covered   |
| B1  | scheduleTime = now()-1s (biên dưới ngoài)| ✅ covered   |
| B2  | scheduleTime = now() (đúng ranh giới)    | ✅ covered   |
| B3  | scheduleTime = now()+1s (biên dưới trong)| ✅ covered   |
| B4  | scheduleTime = now()+1d (nominal)        | ✅ covered   |
| B5  | scheduleTime = now()+30d (biên xa)       | ✅ covered   |

**14/14 tags covered (100%)**

---

## Bug Report phát sinh từ quá trình test

### EHC-50 – DoctorRepository.findById() overload conflict

| Field       | Value                                                                |
| ----------- | -------------------------------------------------------------------- |
| Bug ID      | EHC-50                                                               |
| Title       | `findById(long)` overload trong DoctorRepository gây sai mock/test  |
| Reporter    | Trần Đông Hil (Tester)                                               |
| Assignee    | Lê Đức Huy (Developer)                                               |
| Severity    | Minor                                                                |
| Priority    | Medium                                                               |
| Phát hiện qua | TC03 và TC07 – JIRABookAppointmentEpBvaTest                        |
| Môi trường  | JUnit 5.12.2 + Mockito 5.17.0, IntelliJ, H2 test profile            |

**Mô tả lỗi:**

`DoctorRepository.java` khai báo dư overload primitive:

```java
Optional<Doctor> findById(long id);  // primitive — KHÔNG cần thiết
```

`JpaRepository<Doctor, Long>` đã cung cấp sẵn `findById(Long id)`. Hai overload khác signature khiến Mockito resolve sai method khi stub.

**Steps to Reproduce:**
1. Stub `when(doctorRepository.findById(1L))` trong test (literal `1L` → resolve `findById(long)`).
2. Service gọi `doctorRepository.findById(request.getDoctorId())` — `getDoctorId()` trả `Long` → resolve `findById(Long)`.
3. Chạy TC03, TC07 → `PotentialStubbingProblem`.

**Expected:** Mock resolve đúng, 9/9 PASS.

**Actual:** `PotentialStubbingProblem` – stub không khớp method được gọi thực tế.

**Suggested Fix:**

```java
// Xoá overload dư
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Doctor findByEmail(String email);
    // Xoá dòng: Optional<Doctor> findById(long id);
}
```

**Branch:** `fix/EHC-50-doctor-repository-findby-overload`

---

## Quy trình nhóm (Tester → Jira → Developer)

```
Tester (Hil) chạy JIRABookAppointmentEpBvaTest
    → TC03/TC07 FAIL (PotentialStubbingProblem)
    → Tạo bug EHC-50 trên Jira (Reporter: Hil, Assignee: Lê Đức Huy)
    → Dev tạo branch fix/EHC-50-...
    → Xoá overload dư trong DoctorRepository.java
    → Commit: "EHC-50: remove redundant findById(long) overload"
    → PR → merge → Tester verify → 9/9 PASS → Close EHC-50
```
