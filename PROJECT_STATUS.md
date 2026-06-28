# Project Status — POS Inventory Management System

**Cập nhật: 2026-06-28 (Sau tuần 3 / đầu tuần 4)**

## 1. Mục tiêu dự án

Dự án hướng tới kiến trúc tách biệt hoàn toàn giữa:
- Backend: Spring Boot + Java 17+
- Frontend: React + TypeScript + Vite
- Database: PostgreSQL
- Authentication: JWT + Refresh Token

Frontend và backend giao tiếp qua REST API.

Đồ án thiết kế theo chuẩn doanh nghiệp, gồm:
- **Backend service**: auth, quản lý người dùng, sản phẩm, danh mục, nhà cung cấp, chi nhánh, tồn kho, đơn nhập, hóa đơn bán hàng, báo cáo, thống kê.
- **Frontend SPA**: dashboard KPI, POS bán hàng, quản lý tồn kho, đơn nhập kho, báo cáo, quản lý master data.

## 2. Trạng thái hiện tại (Sau tuần 3 - 2026-06-28)

### 2.1 Backend — ✅ ~92% hoàn thành

#### Đã hoàn thành
- ✅ Authentication & Security: JWT, refresh token, RBAC (`ADMIN`, `MANAGER`, `CASHIER`, `WAREHOUSE`)
- ✅ All Controllers: Auth, User, Product, Category, Supplier, Branch, Inventory, PurchaseOrder, SaleInvoice, Report
- ✅ All Services (interface & impl): đầy đủ cho các module chính
- ✅ DTO request/response: chuẩn hóa cho sale, purchase order, reports
- ✅ Entity & Repository: đầy đủ cho các entity chính
- ✅ Sale workflow: tạo hóa đơn, kiểm tra tồn kho, ghi lịch sử bán hàng
- ✅ Purchase Order workflow: tạo đơn, update trạng thái, nhận hàng và cập nhật tồn kho
- ✅ Inventory workflow: điều chỉnh tồn kho, ghi transaction
- ✅ Report endpoints: revenue, profit, best-sellers, low-stock
- ✅ GlobalExceptionHandler và response wrapper cho lỗi API
- ✅ Audit log API và entity cơ bản
- ✅ Search/filter query param cho product, sale, purchase order
- ✅ Unit test cho nhiều service và controller chính

### 2.2 Frontend — ✅ ~95% hoàn thành

#### Đã hoàn thành
- ✅ Routing & Layout: protected routes, AuthLayout, AdminLayout
- ✅ Authentication: login/logout, JWT token management, auto refresh
- ✅ Master data CRUD: Products, Categories, Suppliers, Branches
- ✅ POS page: tìm kiếm sản phẩm, giỏ hàng, tính tiền, tạo hóa đơn
- ✅ PurchaseOrdersPage: tạo đơn nhập, submit, receive, xem chi tiết
- ✅ InventoryPage: xem tồn kho theo chi nhánh, lọc dữ liệu, cảnh báo tồn kho thấp
- ✅ ReportsPage: 4 loại báo cáo với tab navigation
- ✅ DashboardPage: KPI cards, bảng best-sellers, low-stock và các biểu đồ Recharts
- ✅ StockMovementLog: lịch sử tồn kho với filter và export CSV
- ✅ BranchSelector global filter và lưu lựa chọn vào localStorage
- ✅ Print/Export cho invoice và purchase order
- ✅ UI components chung, toast notification, modal confirm

## 3. Tiến độ hiện tại theo nhóm công việc

### Thành viên 1 (Backend)
- **Hoàn thành**: các module core backend đã sẵn sàng và hoạt động ổn định
- **Điểm nổi bật**: authentication, inventory, sale, purchase order, report và audit log đã có đầy đủ

### Thành viên 2 (Frontend core)
- **Hoàn thành**: các trang chính đã triển khai đầy đủ và kết nối với API
- **Điểm nổi bật**: POS, purchase orders, inventory, reports và stock movement đều hoạt động

### Thành viên 3 (Frontend lead)
- **Hoàn thành**: dashboard và biểu đồ đã được tích hợp
- **Điểm nổi bật**: có các chart chính và UI components dùng chung cho toàn hệ thống

## 4. Công nghệ & Dependencies

### Backend
- Spring Boot 3.x, Spring Security, Spring Data JPA
- JWT (jjwt), MapStruct, Lombok
- PostgreSQL, Flyway, OpenAPI/Swagger
- JUnit 5, Mockito (test)

### Frontend
- React 18+, TypeScript, Vite
- React Router, React Query (@tanstack/react-query)
- React Hook Form, Zod (validation)
- Tailwind CSS, React Hot Toast
- Axios, Dayjs, Recharts

## 6. Đánh giá tổng quát

**Tiến độ dự án hiện tại: ~93–95% codebase chính**

- Core functionality đã hoàn thành đầy đủ
- Backend và frontend đều có thể chạy các flow nghiệp vụ chính
- Dự án đang ở giai đoạn hoàn thiện và chuẩn bị cho demo / submission
- Mục tiêu tiếp theo là tiếp tục polish chất lượng và làm rõ hồ sơ documentation