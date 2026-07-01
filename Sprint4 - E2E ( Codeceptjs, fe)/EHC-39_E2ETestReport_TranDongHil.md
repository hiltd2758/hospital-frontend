# E2E Test Report — Sprint 4 (CodeceptJS)
**Tác giả:** Trần Đông Hil  
**Jira Task:** EHC-39 
**Sprint:** Sprint 4 — E2E Test (Frontend)  
**Project:** E-HealthCare System (Frontend: React + TypeScript)  
**Ngày thực hiện:** 14/06/2026  

---

## 1. Tổng quan

| Thông tin | Chi tiết |
|---|---|
| **Họ tên** | Trần Đông Hil |
| **Task phụ trách** | EHC-39 |
| **Loại kiểm thử** | E2E Test (Frontend) |
| **Trang kiểm thử** | Doctor Patient Detail (`/doctor/patient/:patientId`) |
| **Công cụ** | CodeceptJS v3.7.9, Playwright (Chromium), REST helper |
| **Pattern** | Page Object Model (`DoctorPatientDetailPage.cjs`) |
| **Tổng test cases (toàn suite)** | 27 |
| **Passed** | ✅ 27 |
| **Failed** | ❌ 0 |
| **Thời gian chạy (toàn suite)** | ~1 phút |

---

## 2. Phạm vi kiểm thử

| Feature | Test Cases |
|---|---|
| Admin Login | 5 |
| Doctor Login | 4 |
| **Doctor Patient Detail (EHC-39)** | **6** |
| Patient Login | 6 |
| Patient Register | 6 |
| **Tổng toàn suite** | **27** |

---

## 3. Kiến trúc E2E Test

```
CodeceptJS Test Runner
     │
     ▼
┌─────────────────────────────────────┐
│      Playwright (Chromium)          │  ← browser automation thật
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│   React Frontend (localhost:3000)   │  ← Vite dev server
│   - React Router (ProtectedRoute)   │
│   - Zustand (authStore, localStorage)│
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│  Spring Boot Backend (localhost:8080)│  ← API thật, không mock
│  - REST helper gọi trực tiếp        │
└─────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│         MySQL / H2 Database         │
└─────────────────────────────────────┘
```

---

## 4. Luồng nghiệp vụ kiểm thử — Doctor Patient Detail

```
Before each scenario:
  Doctor login (UI) → Zustand setAuth() → persist vào localStorage
       │
       ▼
  Navigate đến /doctor/patient/{id}
       │
       ▼
  Verify: hiển thị thông tin cá nhân + lâm sàng
       │
       ▼
  (Tùy scenario) Edit → Save / Cancel → Verify kết quả
```

---

## 5. Page Object — `DoctorPatientDetailPage.cjs`

| Method | Mục đích |
|---|---|
| `open(patientId)` | Navigate đến `/doctor/patient/{id}` |
| `seePatientLoaded()` | Chờ `p.text-lg.font-medium` xuất hiện |
| `clickEdit()` / `clickCancel()` / `clickSave()` / `clickBack()` | Tương tác UI |
| `fillClinicalField(label, value)` | Điền field lâm sàng theo label |
| `seeSaveSuccess()` / `seeSaveError()` | Verify thông báo kết quả lưu |

---

## 6. Chi tiết Test Cases — EHC-39

| Test ID | Tên Test Case | Bước thực hiện | Expected | Type | Status |
|---|---|---|---|---|---|
| E2E-EHC39-01 | Hiển thị lỗi khi patientId không tồn tại | `open(99999)` | Text "Không thể tải thông tin bệnh nhân" | Error Path | ✅ PASS |
| E2E-EHC39-02 | Hiển thị nút Quay lại và điều hướng đúng | `open(id)` → `clickBack()` | Redirect về `/doctor/dashboard` | Happy Path | ✅ PASS |
| E2E-EHC39-03 | Click Chỉnh sửa hiển thị form nhập liệu | `open(id)` → `clickEdit()` | Hiện nút "Lưu thay đổi" + "Huỷ" | Happy Path | ✅ PASS |
| E2E-EHC39-04 | Click Huỷ thoát khỏi chế độ chỉnh sửa | `clickEdit()` → `clickCancel()` | Quay lại hiện nút "Chỉnh sửa" | Happy Path | ✅ PASS |
| E2E-EHC39-05 | Cập nhật thông tin lâm sàng thành công | `clickEdit()` → `fillClinicalField()` → `clickSave()` | Thông báo lưu thành công | Happy Path | ✅ PASS |
| E2E-EHC39-06 | Trang chi tiết không truy cập được khi chưa đăng nhập | clear cookie + localStorage → `open(id)` | Redirect về `/login` | Auth Check | ✅ PASS |

---

## 7. Kết quả chạy (Doctor Patient Detail)

```
Doctor Patient Detail --
  √ Hiển thị lỗi khi patientId không tồn tại in 471ms
  √ Hiển thị nút Quay lại và điều hướng đúng in 836ms
  √ Click Chỉnh sửa hiển thị form nhập liệu in 855ms
  √ Click Huỷ thoát khỏi chế độ chỉnh sửa in 1153ms
  √ Cập nhật thông tin lâm sàng thành công in 1709ms
  √ Trang chi tiết không truy cập được khi chưa đăng nhập in 729ms
```

### Toàn suite:
```
OK | 27 passed // 1m
```

---

## 8. Seed Data

| Field | Giá trị |
|---|---|
| `VALID_PATIENT_ID` | `1` — `patient01@example.com` (đã seed sẵn, có clinical info) |
| `DOCTOR_EMAIL` | `doctor01@ehealth.com` |
| `DOCTOR_PASSWORD` | `Doctor@123` |

---

## 9. Cấu trúc file test

```
tests/
├── e2e/doctor/
│   └── patient_detail_test.js          # EHC-39 — 6 scenarios
├── pages/
│   └── DoctorPatientDetailPage.cjs     # Page Object Model
└── codecept.conf.cjs                   # Playwright + REST helper config
```

---

## 10. Ghi chú kỹ thuật & quá trình debug

> **Route path sai số ít/nhiều**  
> Page Object ban đầu gọi `/doctor/patients/{id}` (số nhiều) nhưng route thật khai báo `/doctor/patient/{id}` (số ít) → React Router fallback `NotFoundPage` → mọi `waitForElement` timeout. Fix: đổi đúng path số ít.

> **Auth lưu trong `localStorage`, không phải cookie**  
> `useAuthStore` (Zustand) dùng middleware `persist` lưu vào `localStorage` (key `auth-storage`), khác với JWT backend dùng cookie. `I.clearCookie()` không đủ để logout — phải thêm `I.executeScript(() => localStorage.clear())`.

> **Redirect khi unauthenticated là `/login`, không phải `/doctor/login`**  
> `ProtectedRoute` luôn redirect về `/login` (trang patient chung) bất kể role, vì route `/doctor/login` chỉ là trang login riêng cho doctor, không phải đích redirect của guard.

> **`I.wait(3)` sau khi login**  
> Cần chờ Zustand `setAuth()` hoàn tất ghi vào `localStorage` trước khi navigate, tránh race condition giữa state update và redirect.

> **Dùng patient có sẵn (`id=1`) thay vì seed runtime**  
> Ban đầu seed patient mới qua `POST /api/patient/register` mỗi `Before()`, nhưng gây nhiễu dữ liệu test (nhiều `test_xxx@hospital.com` xuất hiện trong Admin). Đổi sang dùng `patient01@example.com` (đã seed sẵn, có clinical info) để test ổn định và không tạo rác dữ liệu.

---

## 11. So sánh trước/sau khi fix

| Vấn đề | Trước | Sau |
|---|---|---|
| Route path | `/doctor/patients/{id}` ❌ | `/doctor/patient/{id}` ✅ |
| Logout trong test | `clearCookie()` only ❌ | `clearCookie()` + `localStorage.clear()` ✅ |
| Redirect URL khi chưa login | Assert `/doctor/login` ❌ | Assert `/login` ✅ |
| Seed patient | Dynamic register mỗi lần ❌ (tạo rác data) | Dùng patient có sẵn (`id=1`) ✅ |
| Kết quả | 0 passed, 7 failed | **6/6 PASS** |

---

*Report được tạo ngày 14/06/2026 — Trần Đông Hil*
