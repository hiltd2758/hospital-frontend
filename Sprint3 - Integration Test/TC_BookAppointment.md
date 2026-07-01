# Kiểm thử hàm `PatientAppointmentService.bookAppointment()`

> **Hàm nguồn:** `web/src/main/java/com/e_health_care/web/patient/service/PatientAppointmentService.java`
> **Luồng:** Tester xây dựng EP/BVA → Thiết kế test case → Viết JUnit Test → Tạo Bug Report (nếu có lỗi) → Dev fix → Tester verify → Đóng ticket

---

## Câu 1. Xác định lớp tương đương (Equivalence Partitioning)

| Biến đầu vào | Lớp hợp lệ | Tag | Lớp không hợp lệ | Tag |
|---|---|---|---|---|
| patientId | Tồn tại trong DB | V1 | Không tồn tại trong DB | X1 |
| doctorId | Tồn tại trong DB | V2 | Không tồn tại trong DB | X2 |
| scheduleTime | Thời điểm trong **tương lai** (> now) | V3 | Thời điểm trong **quá khứ** (< now) | X3 |
| | | | Thời điểm hiện tại (= now) | X4 |
| Tình trạng bác sĩ | Bác sĩ **rảnh** trong khung giờ đó | V4 | Bác sĩ **bận** trong khung giờ đó (đã có lịch hẹn chồng) | X5 |

### Giải thích Tag

| Tag | Ý nghĩa |
|---|---|
| V1 | patientId tồn tại |
| V2 | doctorId tồn tại |
| V3 | scheduleTime hợp lệ (tương lai) |
| V4 | Bác sĩ rảnh trong khung giờ |
| X1 | patientId không tìm thấy trong DB |
| X2 | doctorId không tìm thấy trong DB |
| X3 | scheduleTime là thời điểm trong quá khứ |
| X4 | scheduleTime là thời điểm hiện tại (= now) |
| X5 | Bác sĩ đã có lịch hẹn trùng giờ |

---

## Câu 2. Phân tích giá trị biên (Boundary Value Analysis)

| Biến đầu vào | min (không hợp lệ) | min+ (hợp lệ) | nominal | max- | max | Tag biên |
|---|---|---|---|---|---|---|
| scheduleTime (offset từ now) | now - 1 giây | now + 1 giây | now + 1 ngày | now + 364 ngày | now + 365 ngày | B1–B5 |
| scheduleTime (conflict window) | start - 1 giây (không conflict) | start (= đúng giờ → conflict) | start + 30 phút (conflict) | start + 59 phút (conflict) | start + 60 phút (= end, không conflict) | B6–B10 |

### Ý nghĩa Tag biên

| Tag | Giá trị |
|---|---|
| B1 | scheduleTime = now - 1 giây (quá khứ, không hợp lệ) |
| B2 | scheduleTime = now + 1 giây (tương lai gần nhất, hợp lệ) |
| B3 | scheduleTime = now + 1 ngày (nominal) |
| B4 | scheduleTime = now + 364 ngày |
| B5 | scheduleTime = now + 365 ngày |
| B6 | scheduleTime = giờ bác sĩ bắt đầu - 1 giây (không conflict) |
| B7 | scheduleTime = đúng giờ bác sĩ bắt đầu (conflict) |
| B8 | scheduleTime = giờ bắt đầu + 30 phút (conflict) |
| B9 | scheduleTime = giờ bắt đầu + 59 phút (conflict) |
| B10 | scheduleTime = giờ bắt đầu + 60 phút (= end, không conflict) |

---

## Câu 3. Thiết kế Test Case

| STT | Tên Test Case | patientId | doctorId | scheduleTime | Tình trạng bác sĩ | Kết quả mong đợi | Tag |
|---|---|---|---|---|---|---|---|
| 01 | Nominal – tất cả hợp lệ | 1 (tồn tại) | 1 (tồn tại) | now + 1 ngày | Rảnh | Đặt lịch thành công, status = PENDING | V1,V2,V3,V4,B3 |
| 02 | scheduleTime = now + 1 giây (biên min+) | 1 | 1 | now + 1s | Rảnh | Đặt lịch thành công | B2 |
| 03 | scheduleTime = now + 364 ngày | 1 | 1 | now + 364 ngày | Rảnh | Đặt lịch thành công | B4 |
| 04 | scheduleTime = now + 365 ngày | 1 | 1 | now + 365 ngày | Rảnh | Đặt lịch thành công | B5 |
| 05 | Bác sĩ rảnh (không trùng giờ) | 1 | 1 | start - 1 giây | Rảnh (không trùng) | Đặt lịch thành công | B6 |
| 06 | Bác sĩ rảnh (sau end window) | 1 | 1 | start + 60 phút | Rảnh (sau window) | Đặt lịch thành công | B10 |
| 07 | scheduleTime quá khứ (now - 1 giây) | 1 | 1 | now - 1s | Rảnh | Ném RuntimeException "Cannot book appointment in the past" | X3,B1 |
| 08 | scheduleTime = now (thời điểm hiện tại) | 1 | 1 | now (chính xác) | Rảnh | Ném RuntimeException "Cannot book appointment in the past" | X4 |
| 09 | patientId không tồn tại | 999 | 1 | now + 1 ngày | Rảnh | Ném RuntimeException "Patient not found" | X1 |
| 10 | doctorId không tồn tại | 1 | 999 | now + 1 ngày | Rảnh | Ném RuntimeException "Doctor not found" | X2 |
| 11 | Bác sĩ bận đúng giờ (conflict = start) | 1 | 1 | start (bác sĩ bận từ start) | Bận | Ném RuntimeException "Doctor is not available at this time" | X5,B7 |
| 12 | Bác sĩ bận giữa window (+30 phút) | 1 | 1 | start + 30 phút | Bận | Ném RuntimeException "Doctor is not available at this time" | X5,B8 |
| 13 | Bác sĩ bận gần cuối window (+59 phút) | 1 | 1 | start + 59 phút | Bận | Ném RuntimeException "Doctor is not available at this time" | X5,B9 |

---

## Câu 4. Unit Test Code (JUnit 5 + Mockito)

```java
package com.e_health_care.web.patient.service;

import com.e_health_care.web.doctor.model.Doctor;
import com.e_health_care.web.doctor.repository.DoctorRepository;
import com.e_health_care.web.patient.dto.AppointmentRequestDTO;
import com.e_health_care.web.patient.model.Appointment;
import com.e_health_care.web.patient.model.Patient;
import com.e_health_care.web.patient.repository.PatientAppointmentRepository;
import com.e_health_care.web.patient.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PatientAppointmentServiceTest {

    @Mock
    private PatientAppointmentRepository appointmentRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private PatientAppointmentService service;

    private Patient mockPatient;
    private Doctor mockDoctor;

    @BeforeEach
    void setUp() {
        mockPatient = new Patient();
        mockPatient.setId(1L);
        mockPatient.setEmail("test@patient.com");

        mockDoctor = new Doctor();
        mockDoctor.setId(1L);
        mockDoctor.setEmail("test@doctor.com");
    }

    private AppointmentRequestDTO buildRequest(Long patientId, Long doctorId, LocalDateTime scheduleTime) {
        AppointmentRequestDTO dto = new AppointmentRequestDTO();
        dto.setPatientId(patientId);
        dto.setDoctorId(doctorId);
        dto.setScheduleTime(scheduleTime);
        return dto;
    }

    // TC01 – Nominal: tất cả hợp lệ
    @Test
    void test_TC01_nominal_valid() {
        LocalDateTime future = LocalDateTime.now().plusDays(1);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(mockDoctor));
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(eq(1L), any(), any()))
            .thenReturn(Collections.emptyList());
        when(appointmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Appointment result = service.bookAppointment(buildRequest(1L, 1L, future));
        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
    }

    // TC02 – scheduleTime = now + 1 giây (biên min+)
    @Test
    void test_TC02_scheduleTime_min_plus_boundary() {
        LocalDateTime nearFuture = LocalDateTime.now().plusSeconds(1);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(mockDoctor));
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(eq(1L), any(), any()))
            .thenReturn(Collections.emptyList());
        when(appointmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> service.bookAppointment(buildRequest(1L, 1L, nearFuture)));
    }

    // TC07 – scheduleTime quá khứ (now - 1 giây)
    @Test
    void test_TC07_scheduleTime_past_below_min() {
        LocalDateTime past = LocalDateTime.now().minusSeconds(1);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(mockDoctor));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> service.bookAppointment(buildRequest(1L, 1L, past)));
        assertTrue(ex.getMessage().contains("Cannot book appointment in the past"));
    }

    // TC08 – scheduleTime = now (thời điểm hiện tại)
    @Test
    void test_TC08_scheduleTime_exact_now() {
        LocalDateTime now = LocalDateTime.now();
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(mockDoctor));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> service.bookAppointment(buildRequest(1L, 1L, now)));
        assertTrue(ex.getMessage().contains("Cannot book appointment in the past"));
    }

    // TC09 – patientId không tồn tại
    @Test
    void test_TC09_patient_not_found() {
        when(patientRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> service.bookAppointment(buildRequest(999L, 1L, LocalDateTime.now().plusDays(1))));
        assertTrue(ex.getMessage().contains("Patient not found"));
    }

    // TC10 – doctorId không tồn tại
    @Test
    void test_TC10_doctor_not_found() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> service.bookAppointment(buildRequest(1L, 999L, LocalDateTime.now().plusDays(1))));
        assertTrue(ex.getMessage().contains("Doctor not found"));
    }

    // TC11 – Bác sĩ bận (conflict đúng giờ)
    @Test
    void test_TC11_doctor_busy_conflict_at_start() {
        LocalDateTime bookedTime = LocalDateTime.now().plusDays(1).withHour(9).withMinute(0);
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(mockDoctor));
        Appointment conflicting = new Appointment();
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(eq(1L), any(), any()))
            .thenReturn(List.of(conflicting));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> service.bookAppointment(buildRequest(1L, 1L, bookedTime)));
        assertTrue(ex.getMessage().contains("Doctor is not available at this time"));
    }

    // TC05 – Bác sĩ rảnh (đặt trước window - không conflict)
    @Test
    void test_TC05_doctor_free_before_window() {
        LocalDateTime existingStart = LocalDateTime.now().plusDays(1).withHour(10);
        LocalDateTime newRequest = existingStart.minusSeconds(1); // Đặt trước window
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(mockDoctor));
        when(appointmentRepository.findByDoctorIdAndScheduleTimeBetween(eq(1L), any(), any()))
            .thenReturn(Collections.emptyList());
        when(appointmentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> service.bookAppointment(buildRequest(1L, 1L, newRequest)));
    }
}
```

**Kết quả chạy test (expected):**

```
test_TC01_nominal_valid .................................................. OK
test_TC02_scheduleTime_min_plus_boundary ................................. OK
test_TC05_doctor_free_before_window ...................................... OK
test_TC07_scheduleTime_past_below_min .................................... OK
test_TC08_scheduleTime_exact_now ......................................... OK
test_TC09_patient_not_found .............................................. OK
test_TC10_doctor_not_found ............................................... OK
test_TC11_doctor_busy_conflict_at_start .................................. OK

Tests run: 8, Failures: 0, Errors: 0
```

> **Ghi chú phát hiện:** Logic kiểm tra xung đột lịch dùng `findByDoctorIdAndScheduleTimeBetween(doctorId, start, end)` với `end = start + 1 giờ`. Nếu bác sĩ có lịch hẹn từ `start+1h` trở đi thì không bị đánh dấu conflict — hành vi này **đúng theo thiết kế**. Tuy nhiên, chưa kiểm tra trường hợp lịch mới **nằm trong window của lịch cũ** (lịch cũ đặt trước, lịch mới đặt sau 30 phút). Cần trao đổi thêm với Dev để xác nhận.
