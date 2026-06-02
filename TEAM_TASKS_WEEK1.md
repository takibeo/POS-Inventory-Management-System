# Phân chia công việc Tuần 1

## Tổng quan
Đây là kế hoạch phân chia nhiệm vụ cho 3 thành viên trong nhóm của dự án POS và Quản lý Tồn kho.
Mục tiêu tuần 1 là hoàn thiện nền tảng backend và phần CRUD frontend cơ bản, đồng thời xây dựng UI nền tảng.

---

## Thành viên 1 (Bạn - Trưởng nhóm / Backend Lead)

### Mục tiêu tuần 1
Hoàn thiện nền tảng Backend.

### Công việc

#### 1. Chuẩn hóa DTO
Hiện trạng: Controller đang dùng trực tiếp Entity.

Cần đổi thành:

```
Controller
   ↓
Request DTO
   ↓
Service
   ↓
Response DTO
```

Áp dụng cho:
- Product
- Category
- Supplier
- Branch

#### 2. Hoàn thiện Validation
Thêm các annotation vào request DTO:
- `@NotBlank`
- `@NotNull`
- `@Positive`
- `@Email`
- `@Size`

#### 3. Hoàn thiện GlobalExceptionHandler
Xử lý các lỗi:
- Validation Error
- Resource Not Found
- Business Exception
- Unauthorized

#### 4. Flyway Migration
Tạo migration đầy đủ:

```
V1__init_schema.sql
V2__seed_roles.sql
V3__seed_admin.sql
```

#### Deliverable
- Backend chạy ổn định
- Swagger test được
- CRUD Product hoàn chỉnh
- CRUD Category hoàn chỉnh

---

## Thành viên 2 (Backend + Frontend CRUD)

### Mục tiêu tuần 1
Hoàn thiện các module dữ liệu cơ bản.

### Backend
CRUD cho:
- Supplier
- Branch

Hoàn thiện:
```
Controller
Service
Repository
DTO
```

### Frontend
Tạo UI CRUD cho:
- CategoriesPage
  - Table
  - Add
  - Edit
  - Delete
- SuppliersPage
  - Table
  - Add
  - Edit
  - Delete
- BranchesPage
  - Table
  - Add
  - Edit
  - Delete

Sử dụng:
```
React Query
Axios
React Hook Form
```

#### Deliverable
- Category CRUD hoàn chỉnh
- Supplier CRUD hoàn chỉnh
- Branch CRUD hoàn chỉnh

---

## Thành viên 3 (Frontend Lead)

### Mục tiêu tuần 1
Xây dựng UI nền tảng.

### 1. Dashboard
Tạo:
```
DashboardPage
```

Hiển thị card:
- Tổng sản phẩm
- Tổng tồn kho
- Tổng đơn hàng
- Tổng doanh thu

Hiện tại có thể dùng mock data.

---

### 2. Product CRUD UI
Hoàn thiện:
```
ProductsPage
```

Bao gồm:
- Data table
- Search
- Pagination
- Add Product
- Edit Product
- Delete Product

---

### 3. Xây dựng Component dùng chung

#### DataTable
```
Reusable table
```

#### ConfirmModal
```
Xóa dữ liệu
```

#### LoadingSpinner

#### EmptyState

---

### Deliverable
- UI framework hoàn chỉnh
- Product CRUD UI hoàn chỉnh
- Dashboard UI hoàn chỉnh

---

## Kết quả mong muốn cuối tuần 1

### Backend
✅ DTO chuẩn hóa

✅ Validation

✅ Global Exception

✅ Product CRUD

✅ Category CRUD

✅ Supplier CRUD

✅ Branch CRUD

✅ Flyway Migration

---

### Frontend
✅ Product CRUD

✅ Category CRUD

✅ Supplier CRUD

✅ Branch CRUD

✅ Dashboard UI

✅ Shared Components
