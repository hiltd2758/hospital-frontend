# Integration Test Report — DoctorApiController

**Tác giả:** Lê Đức Huy
**Jira Task:** EHC-23 - DoctorApiController Integration Test
**Sprint:** Sprint 4 — Integration Test
**Project:** E-HealthCare System
**Ngày thực hiện:** 17/06/2026

---

## 1. Tổng quan

| Thông tin               | Chi tiết                                    |
| ----------------------- | ------------------------------------------- |
| Loại kiểm thử           | Integration Test                            |
| Controller              | DoctorApiController                         |
| Công cụ                 | JUnit 5, Spring Boot Test, TestRestTemplate |
| Database                | H2 In-Memory Database                       |
| Mock Service/Repository | Không sử dụng                               |
| Tổng số test cases      | 6                                           |

---

## 2. Phạm vi kiểm thử

| Endpoint                       | Chức năng             |
| ------------------------------ | --------------------- |
| POST /api/doctor/login         | Đăng nhập bác sĩ      |
| GET /api/doctor/profile        | Xem hồ sơ bác sĩ      |
| PUT /api/doctor/profile/update | Cập nhật hồ sơ bác sĩ |

---

## 3. Kiến trúc kiểm thử

```text
Client Request
      │
      ▼
DoctorApiController
      │
      ▼
DoctorAuthenticationService
DoctorService
      │
      ▼
DoctorRepository
      │
      ▼
H2 In-Memory Database
```

---

## 4. Dữ liệu kiểm thử

Dữ liệu bác sĩ được tạo trong phương thức `@BeforeEach`.

| Field      | Giá trị                         |
| ---------- | ------------------------------- |
| Email      | doctor.{timestamp}@ehealth.test |
| Password   | Doctor@123                      |
| First Name | Nguyen                          |
| Last Name  | An                              |
| Field      | Cardiology                      |
| Phone      | 0901234567                      |

Password được mã hóa bằng BCryptPasswordEncoder trước khi lưu vào H2 Database.

---

## 5. Danh sách Test Cases

### Login API

| Test ID   | Test Case                                  | Expected Result      | Status |
| --------- | ------------------------------------------ | -------------------- | ------ |
| IT-DOC-01 | login_shouldReturn200_whenValidCredentials | HTTP 200 + JWT Token | PASS   |
| IT-DOC-02 | login_shouldReturn401_whenWrongPassword    | HTTP 401             | PASS   |
| IT-DOC-03 | login_shouldReturn401_whenEmailNotFound    | HTTP 401             | PASS   |

### Profile API

| Test ID   | Test Case                                    | Expected Result      | Status |
| --------- | -------------------------------------------- | -------------------- | ------ |
| IT-DOC-04 | getProfile_shouldReturn200_whenAuthenticated | HTTP 200 + DoctorDTO | PASS   |
| IT-DOC-05 | getProfile_shouldReturn401_whenNoToken       | HTTP 401             | PASS   |

### Update Profile API

| Test ID   | Test Case                               | Expected Result                | Status |
| --------- | --------------------------------------- | ------------------------------ | ------ |
| IT-DOC-06 | updateProfile_shouldReturn200_whenValid | HTTP 200 + cập nhật thành công | PASS   |

---

## 6. Kết quả thực hiện

| Tổng số test | Passed | Failed |
| ------------ | ------ | ------ |
| 6            | 6      | 0      |

---

## 7. Cấu trúc file

```text
src/test/java/com/e_health_care/web/api/
└── DoctorApiControllerIT.java
```

---

## 8. Kết luận

Đã thực hiện Integration Test cho DoctorApiController bằng Spring Boot Test và H2 In-Memory Database.

Các chức năng được kiểm thử:

- Đăng nhập bác sĩ.
- Xác thực JWT Token.
- Xem hồ sơ bác sĩ.
- Cập nhật hồ sơ bác sĩ.

Tất cả các test case đều PASS và hoạt động đúng với luồng API thực tế của hệ thống.
