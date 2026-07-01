# Assignment: Kiểm thử chức năng đăng ký học phần

**Thời lượng:** 90 phút  
**Chủ đề:** Phân hoạch lớp tương đương, phân tích giá trị biên, thiết kế test case và kiểm thử tự động  
**Mức độ:** Cơ bản đến trung bình  
**Hình thức:** Cá nhân  
**Tổng điểm:** 10 điểm

---

## 1. Mục tiêu bài tập

1. Xác định được **điều kiện kiểm thử** từ một đặc tả yêu cầu đơn giản.
2. Áp dụng được kỹ thuật **phân hoạch lớp tương đương** để chia miền dữ liệu đầu vào thành các lớp hợp lệ và không hợp lệ.
3. Áp dụng được kỹ thuật **phân tích giá trị biên** để chọn các dữ liệu kiểm thử nằm gần ranh giới giữa vùng hợp lệ và không hợp lệ.
4. Thiết kế được bảng **test case** có đầy đủ input, expected result và tag bao phủ.
5. Viết được hàm kiểm tra logic và một số **unit test** cho các trường hợp biên.

---

## 2. Nội dung tham khảo

Bài tập này bám sát các nội dung chính trong phần kỹ thuật kiểm thử hộp đen:

- **Equivalence Partitioning**: phân chia miền dữ liệu đầu vào thành các lớp tương đương.
- **Boundary Value Analysis**: chọn giá trị tại biên và gần biên để kiểm thử.
- **Test case design**: thiết kế test case có input, expected outcome và tag bao phủ.
- **Test script / Unit test**: triển khai kiểm thử tự động bằng code.

Trong bài này, sinh viên cần đặc biệt chú ý đến cách trình bày theo mẫu:

| Conditions | Valid Partitions | Tag | Invalid Partitions | Tag | Valid Boundaries | Tag |
| ---------- | ---------------- | --- | ------------------ | --- | ---------------- | --- |

và bảng test case theo mẫu:

| Test Case | Input | Expected Outcome | New Tags Covered |
| --------- | ----- | ---------------- | ---------------- |

---

## 3. Mô tả bài toán

Hệ thống đăng ký học phần của Trường Đại học UTH cho phép sinh viên gửi yêu cầu đăng ký học phần.

Một yêu cầu đăng ký được xem là **hợp lệ** khi tất cả các điều kiện sau đồng thời thỏa mãn:

| Biến đầu vào | Ý nghĩa                           | Kiểu dữ liệu | Miền giá trị hợp lệ |
| ------------ | --------------------------------- | ------------ | ------------------- |
| `tinChi`     | Số tín chỉ sinh viên muốn đăng ký | Số nguyên    | Từ 10 đến 25        |
| `gpa`        | Điểm trung bình tích lũy hiện tại | Số thực      | Từ 2.0 đến 4.0      |
| `monNo`      | Số môn sinh viên đang nợ          | Số nguyên    | Từ 0 đến 3          |
| `hocKy`      | Học kỳ hiện tại của sinh viên     | Số nguyên    | Từ 1 đến 10         |

Hệ thống trả về:

- `True` hoặc thông báo **Hợp lệ** nếu tất cả điều kiện đều đúng.
- `False` hoặc thông báo **Không hợp lệ** nếu có ít nhất một điều kiện sai.

---

## 4. Giả định của bài toán

Để tránh hiểu nhầm, bài tập sử dụng các giả định sau:

1. Chỉ xét dữ liệu đầu vào là dữ liệu số.
2. Không xét dữ liệu `null`, rỗng, chuỗi ký tự hoặc định dạng sai.
3. `tinChi`, `monNo`, `hocKy` là số nguyên.
4. `gpa` là số thực, có thể có phần thập phân.
5. Một yêu cầu đăng ký hợp lệ khi và chỉ khi **tất cả** biến đầu vào nằm trong miền hợp lệ.

Công thức logic tổng quát:

$$
Valid =
(10 \leq tinChi \leq 25)
\land
(2.0 \leq gpa \leq 4.0)
\land
(0 \leq monNo \leq 3)
\land
(1 \leq hocKy \leq 10)
$$

---

# PHẦN A. ĐỀ BÀI GIAO CHO SINH VIÊN

---

## Câu 1. Xác định lớp tương đương

**Điểm:** 2 điểm

Hãy xác định các lớp tương đương hợp lệ và không hợp lệ cho từng biến đầu vào.

Sinh viên cần điền vào bảng sau:

| Biến đầu vào | Lớp hợp lệ       | Tag | Lớp không hợp lệ | Tag |
| ------------ | ---------------- | --- | ---------------- | --- |
| Số tín chỉ   | 10 ≤ tinChi ≤ 25 | V1  | tinChi < 10      | X1  |
|              |                  |     | tinChi > 25      | X2  |
| GPA          | 2.0 ≤ gpa ≤ 4.0  | V2  | gpa < 2.0        | X3  |
|              |                  |     | gpa > 4.0        | X4  |
| Số môn nợ    | 0 ≤ monNo ≤ 3    | V3  | monNo < 0        | X5  |
|              |                  |     | monNo > 3        | X6  |
| Học kỳ       | 1 ≤ hocKy ≤ 10   | V4  | hocKy < 1        | X7  |
|              |                  |     | hocKy > 10       | X8  |

### Yêu cầu

- Mỗi biến cần có ít nhất 1 lớp hợp lệ.
- Mỗi biến cần có ít nhất 2 lớp không hợp lệ:
  - Nhỏ hơn giá trị nhỏ nhất.
  - Lớn hơn giá trị lớn nhất.
- Mỗi lớp cần được đặt tag để phục vụ theo dõi độ bao phủ.
- Có thể đặt tag theo mẫu:
  - `V1`, `V2`, `V3`, ... cho lớp hợp lệ.
  - `X1`, `X2`, `X3`, ... cho lớp không hợp lệ.

---

## Câu 2. Phân tích giá trị biên

**Điểm:** 2 điểm

Áp dụng kỹ thuật **Standard Boundary Value Analysis** để xác định các giá trị cần kiểm thử cho từng biến.

Với mỗi biến có miền giá trị:

$$
[min, max]
$$

cần xác định 5 giá trị:

| Ký hiệu   | Ý nghĩa                               |
| --------- | ------------------------------------- |
| `min`     | Giá trị nhỏ nhất hợp lệ               |
| `min+`    | Giá trị ngay trên giá trị nhỏ nhất    |
| `nominal` | Giá trị đại diện nằm giữa miền hợp lệ |
| `max-`    | Giá trị ngay dưới giá trị lớn nhất    |
| `max`     | Giá trị lớn nhất hợp lệ               |

Sinh viên cần điền vào bảng sau:

| Biến đầu vào | min | min+ | nominal | max- | max | Tag biên |
| ------------ | --: | ---: | ------: | ---: | --: | -------- |
| Số tín chỉ   |  10 |   11 |      18 |   24 |  25 | B1–B5    |
| GPA          | 2.0 |  2.1 |     3.0 |  3.9 | 4.0 | B6–B10   |
| Số môn nợ    |   0 |    1 |       2 |    2 |   3 | B11–B15  |
| Học kỳ       |   1 |    2 |       5 |    9 |  10 | B16–B20  |

### Gợi ý chọn nominal

| Biến       | Miền hợp lệ | Có thể chọn nominal |
| ---------- | ----------: | ------------------: |
| Số tín chỉ |   10 đến 25 |                  18 |
| GPA        | 2.0 đến 4.0 |                 3.0 |
| Số môn nợ  |     0 đến 3 |                   2 |
| Học kỳ     |    1 đến 10 |                   5 |

### Lưu ý

Với biến GPA là số thực, sinh viên có thể chọn `min+` và `max-` theo độ chính xác giả định.

Ví dụ nếu giả định GPA lấy 1 chữ số thập phân:

| Biên    | Giá trị |
| ------- | ------: |
| min     |     2.0 |
| min+    |     2.1 |
| nominal |     3.0 |
| max-    |     3.9 |
| max     |     4.0 |

Nếu muốn kiểm thử mạnh hơn, có thể bổ sung các giá trị ngoài biên như `1.9` và `4.1`, nhưng phần này thuộc hướng **Robustness BVA**.

---

## Câu 3. Thiết kế test case

**Điểm:** 3 điểm

Dựa trên kết quả Câu 1 và Câu 2, hãy thiết kế bảng test case để kiểm thử chức năng đăng ký học phần.

### Yêu cầu

- Thiết kế tối thiểu 8 test case.
- Phải có cả test case hợp lệ và không hợp lệ.
- Phải có test case kiểm tra tại giá trị biên.
- Mỗi test case cần ghi rõ tag được bao phủ.
- Kết quả mong đợi phải ghi rõ:
  - **Hợp lệ**, hoặc
  - **Không hợp lệ**, kèm lý do.

Sinh viên điền vào bảng sau:

| STT | Tên test case             | Số tín chỉ | GPA | Số môn nợ | Học kỳ | Kết quả mong đợi               | Tag được bao phủ  |
| --: | ------------------------- | ---------: | --: | --------: | -----: | ------------------------------ | ----------------- |
|   1 | Tất cả giá trị trung bình |         18 | 3.0 |         2 |      5 | **Hợp lệ**                     | V1, V2, V3, V4    |
|   2 | Biên dưới hợp lệ (Min)    |         10 | 2.0 |         0 |      1 | **Hợp lệ**                     | B1, B6, B11, B16  |
|   3 | Biên trên hợp lệ (Max)    |         25 | 4.0 |         3 |     10 | **Hợp lệ**                     | B5, B10, B15, B20 |
|   4 | Số tín chỉ quá thấp       |          9 | 3.0 |         1 |      4 | **Không hợp lệ** (tinChi < 10) | X1                |
|   5 | GPA không đủ              |         20 | 1.9 |         0 |      2 | **Không hợp lệ** (gpa < 2.0)   | X3                |
|   6 | Quá số môn nợ             |         15 | 3.5 |         4 |      6 | **Không hợp lệ** (monNo > 3)   | X6                |
|   7 | Học kỳ ngoài phạm vi      |         12 | 2.5 |         2 |     11 | **Không hợp lệ** (hocKy > 10)  | X8                |
|   8 | Sát biên trên hợp lệ      |         24 | 3.9 |         2 |      9 | **Hợp lệ**                     | B4, B9, B14, B19  |
|   9 | Số tín chỉ quá cao        |         26 | 3.0 |         1 |      5 | **Không hợp lệ** (tinChi > 25) | X2                |
|  10 | Học kỳ dưới mức tối thiểu |         15 | 3.0 |         1 |      0 | **Không hợp lệ** (hocKy < 1)   | X7                |

---

## Câu 4. Triển khai kiểm thử tự động

**Điểm:** 3 điểm

Hãy viết chương trình kiểm tra logic của hàm:

```python
ValidateDangKy(tinChi, gpa, monNo, hocKy)
```

Hàm trả về:

- `True` nếu tất cả đầu vào hợp lệ.
- `False` nếu có ít nhất một đầu vào không hợp lệ.

Sinh viên có thể chọn một trong các ngôn ngữ sau:

| Ngôn ngữ | Framework gợi ý          |
| -------- | ------------------------ |
| Python   | `unittest` hoặc `pytest` |
| Java     | `JUnit`                  |
| C#       | `NUnit` hoặc `xUnit`     |

### Yêu cầu bắt buộc

1. Viết hàm `ValidateDangKy`.
2. Viết ít nhất 2 unit test cho trường hợp biên.
3. Các unit test phải dựa trên giá trị biên đã xác định ở Câu 2.
4. Có ít nhất:
   - 1 test case hợp lệ tại biên.
   - 1 test case không hợp lệ ngoài biên.

---

### Bài làm – Python (`unittest`)

**File:** `validate_dang_ky.py`

```python
"""
validate_dang_ky.py
===================
Kiểm thử chức năng đăng ký học phần – UTH.

"""

from __future__ import annotations

import time
import pytest

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import box
from rich.text import Text

def validate_dang_ky(tin_chi: int, gpa: float, mon_no: int, hoc_ky: int) -> bool:
    return (
        10 <= tin_chi <= 25
        and 2.0 <= gpa <= 4.0
        and 0 <= mon_no <= 3
        and 1 <= hoc_ky <= 10
    )


console = Console(width=130)

TEST_CASES: list[tuple[str, int, float, int, int, bool, str]] = [
    ("TC01-nominal",         18, 3.0, 2,  5,  True,  "V1,V2,V3,V4"),
    ("TC02-bien_min",        10, 2.0, 0,  1,  True,  "B1,B6,B11,B16"),
    ("TC03-bien_max",        25, 4.0, 3,  10, True,  "B5,B10,B15,B20"),
    ("TC04-tinchi_qua_thap",  9, 3.0, 1,  4,  False, "X1"),
    ("TC05-gpa_khong_du",    20, 1.9, 0,  2,  False, "X3"),
    ("TC06-qua_mon_no",      15, 3.5, 4,  6,  False, "X6"),
    ("TC07-hocky_ngoai_pv",  12, 2.5, 2,  11, False, "X8"),
    ("TC08-sat_bien_tren",   24, 3.9, 2,  9,  True,  "B4,B9,B14,B19"),
    ("TC09-tinchi_qua_cao",   26, 3.0, 1,  5,  False, "X2"),
("TC10-hocky_qua_thap",   15, 3.0, 1,  0,  False, "X7"),
]


@pytest.mark.parametrize(
    "tc_id,tin_chi,gpa,mon_no,hoc_ky,expected,tags",
    TEST_CASES,
    ids=[tc[0] for tc in TEST_CASES],
)
def test_validate_dang_ky(
    tc_id: str,
    tin_chi: int,
    gpa: float,
    mon_no: int,
    hoc_ky: int,
    expected: bool,
    tags: str,
) -> None:
    """Parametrized test – TC01 đến TC08."""
    result = validate_dang_ky(tin_chi, gpa, mon_no, hoc_ky)
    assert result == expected, (
        f"[{tc_id}] validate_dang_ky({tin_chi}, {gpa}, {mon_no}, {hoc_ky}) "
        f"= {result}, expected {expected}  |  tags: {tags}"
    )

# ---------------------------------------------------------------------------
# Tag coverage data
# ---------------------------------------------------------------------------
ALL_TAGS: list[str] = [
    "V1",  "V2",  "V3",  "V4",
    "X1",  "X2",  "X3",  "X4",  "X5",  "X6",  "X7",  "X8",
    "B1",  "B2",  "B3",  "B4",  "B5",
    "B6",  "B7",  "B8",  "B9",  "B10",
    "B11", "B12", "B13", "B14", "B15",
    "B16", "B17", "B18", "B19", "B20",
]

TAG_DESC: dict[str, str] = {
    "V1": "tinChi hợp lệ",    "V2": "gpa hợp lệ",
    "V3": "monNo hợp lệ",     "V4": "hocKy hợp lệ",
    "X1": "tinChi < 10",      "X2": "tinChi > 25",
    "X3": "gpa < 2.0",        "X4": "gpa > 4.0",
    "X5": "monNo < 0",        "X6": "monNo > 3",
    "X7": "hocKy < 1",        "X8": "hocKy > 10",
    "B1":  "tinChi=min(10)",   "B2":  "tinChi=min+(11)",  "B3":  "tinChi=nom(18)",
    "B4":  "tinChi=max-(24)",  "B5":  "tinChi=max(25)",
    "B6":  "gpa=min(2.0)",     "B7":  "gpa=min+(2.1)",    "B8":  "gpa=nom(3.0)",
    "B9":  "gpa=max-(3.9)",    "B10": "gpa=max(4.0)",
    "B11": "monNo=min(0)",     "B12": "monNo=min+(1)",    "B13": "monNo=nom(2)",
    "B14": "monNo=max-(2)",    "B15": "monNo=max(3)",
    "B16": "hocKy=min(1)",     "B17": "hocKy=min+(2)",   "B18": "hocKy=nom(5)",
    "B19": "hocKy=max-(9)",    "B20": "hocKy=max(10)",
}


def _covered_tags() -> set[str]:
    covered: set[str] = set()
    for *_, tags_str in TEST_CASES:
        for t in tags_str.split(","):
            covered.add(t.strip())
    return covered

# ---------------------------------------------------------------------------
# Rich runner
# ---------------------------------------------------------------------------

def run_with_rich() -> None:
    # ── Test results table ──────────────────────────────────────────────────
    tbl = Table(
        box=box.ROUNDED, show_header=True,
        header_style="bold white on grey23",
        border_style="grey50", expand=True,
    )
    tbl.add_column("ID",      style="dim",  width=5,   justify="center")
    tbl.add_column("Test ID",               min_width=24)
    tbl.add_column("Input (tinChi,gpa,monNo,hocKy)", min_width=30)
    tbl.add_column("Expected",              width=14,  justify="center")
    tbl.add_column("Kết quả",               width=12,  justify="center")
    tbl.add_column("Tag",     style="cyan", min_width=18)

    passed = failed = 0
    start  = time.perf_counter()

    for tc_id, tin_chi, gpa, mon_no, hoc_ky, expected, tags in TEST_CASES:
        actual = validate_dang_ky(tin_chi, gpa, mon_no, hoc_ky)
        ok = actual == expected
        if ok:
            badge = Text("  PASS  ", style="bold black on green"); passed += 1
        else:
            badge = Text("  FAIL  ", style="bold white on red");   failed += 1

        exp_text = Text("Hợp lệ" if expected else "Không hợp lệ",
                        style="green" if expected else "red")
        tbl.add_row(tc_id[:4], tc_id, f"({tin_chi}, {gpa}, {mon_no}, {hoc_ky})",
                    exp_text, badge, tags)

    elapsed = time.perf_counter() - start

    console.print()
    console.print(Panel(
        "[bold cyan]Kiểm thử đăng ký học phần – UTH[/bold cyan]\n"
        "[dim]@pytest.mark.parametrize  |  pytest-cov  |  pytest-html[/dim]",
        border_style="cyan", padding=(0, 2),
    ))
    console.print(tbl)

    total = passed + failed
    s = "bold green" if failed == 0 else "bold red"
    console.print(
        f"\n  [{s}]{'✓' if failed == 0 else '✗'}  {passed}/{total} passed[/{s}]"
        f"  [dim]· {elapsed*1000:.1f} ms[/dim]\n"
    )

    # ── Tag coverage table ──────────────────────────────────────────────────
    covered = _covered_tags()

    ctbl = Table(
        title="[bold]Tag Coverage Summary[/bold]",
        box=box.SIMPLE_HEAVY, show_header=True,
        header_style="bold white on grey23",
        border_style="grey50", expand=False,
    )
    ctbl.add_column("Tag",  style="cyan", width=7,   justify="center")
    ctbl.add_column("Mô tả",              min_width=22)
    ctbl.add_column("Status",             width=14,  justify="center")

    n_covered = 0
    for tag in ALL_TAGS:
        if tag in covered:
            status = Text("✓  covered", style="bold green"); n_covered += 1
        else:
            status = Text("✗  missing", style="dim red")
        ctbl.add_row(tag, TAG_DESC.get(tag, ""), status)

    pct = n_covered / len(ALL_TAGS) * 100
    ps  = "bold green" if pct >= 80 else "bold yellow" if pct >= 50 else "bold red"
    ctbl.caption = f"[{ps}]{n_covered}/{len(ALL_TAGS)} tags covered ({pct:.0f}%) với {total} test case tối thiểu[/{ps}]"
    console.print(ctbl)
if __name__ == "__main__":
    run_with_rich()
```

**Kết quả chạy:**

_Bảng test case – 8/8 passed:_

![alt text](image-4.png)

_Tag Coverage Summary – 20/32 tags covered (62%):_

![alt text](image-5.png)

# PHẦN B. BẢNG CHẤM ĐIỂM CHI TIẾT

---

## Câu 1. Lớp tương đương: 2 điểm

| Tiêu chí                                   |    Điểm |
| ------------------------------------------ | ------: |
| Xác định đúng lớp hợp lệ cho 4 biến        |     0.8 |
| Xác định đúng lớp không hợp lệ nhỏ hơn min |     0.4 |
| Xác định đúng lớp không hợp lệ lớn hơn max |     0.4 |
| Có đặt tag rõ ràng cho các lớp             |     0.4 |
| **Tổng**                                   | **2.0** |

---

## Câu 2. Giá trị biên: 2 điểm

| Tiêu chí                          |    Điểm |
| --------------------------------- | ------: |
| Xác định đúng biên cho số tín chỉ |     0.5 |
| Xác định đúng biên cho GPA        |     0.5 |
| Xác định đúng biên cho số môn nợ  |     0.5 |
| Xác định đúng biên cho học kỳ     |     0.5 |
| **Tổng**                          | **2.0** |

---

## Câu 3. Test case: 3 điểm

| Tiêu chí                                           |    Điểm |
| -------------------------------------------------- | ------: |
| Có tối thiểu 8 test case                           |     0.5 |
| Có test case hợp lệ                                |     0.5 |
| Có test case không hợp lệ                          |     0.5 |
| Có test case tại biên hoặc gần biên                |     0.5 |
| Expected result rõ ràng, có lý do khi không hợp lệ |     0.5 |
| Có tag được bao phủ                                |     0.5 |
| **Tổng**                                           | **3.0** |

---

## Câu 4. Unit test: 3 điểm

| Tiêu chí                                  |    Điểm |
| ----------------------------------------- | ------: |
| Viết đúng hàm `ValidateDangKy`            |     1.0 |
| Có sử dụng framework unit test            |     0.5 |
| Có ít nhất 2 test case biên               |     0.5 |
| Có ít nhất 1 case hợp lệ tại biên         |     0.5 |
| Có ít nhất 1 case không hợp lệ ngoài biên |     0.5 |
| **Tổng**                                  | **3.0** |

---

# PHẦN C. NHẬN XÉT

## 1. Vì sao cần tag?

Tag giúp theo dõi test case nào đã bao phủ lớp nào hoặc biên nào.

Ví dụ:

| Tag | Ý nghĩa                |
| --- | ---------------------- |
| V1  | Số tín chỉ hợp lệ      |
| X1  | Số tín chỉ nhỏ hơn min |
| X2  | Số tín chỉ lớn hơn max |
| B1  | Số tín chỉ tại min     |
| B5  | Số tín chỉ tại max     |

Khi thiết kế test case, sinh viên có thể ghi:

| Test case | Tag bao phủ      |
| --------- | ---------------- |
| TC01      | V1, V2, V3, V4   |
| TC02      | B1, B6, B11, B16 |
| TC04      | X1               |

---
