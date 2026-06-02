# Project Status — POS Inventory Management System

## 1. Mục tiêu dự án

Dự án hướng tới kiến trúc tách biệt hoàn toàn giữa:
- Backend: Spring Boot + Java
- Frontend: React + TypeScript

Frontend và backend giao tiếp qua REST API.

Đồ án thiết kế theo chuẩn doanh nghiệp, gồm:
- Backend service cho auth, quản lý người dùng, sản phẩm, danh mục, nhà cung cấp, kho, đơn nhập, hóa đơn bán hàng, báo cáo.
- Frontend SPA cho quản trị, POS, tồn kho, báo cáo.

## 2. Những gì dự án đã có

### 2.1 Backend

#### 2.1.1 Authentication và Security
- `AuthController` đã tồn tại với API:
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
- `SecurityConfig` đã cấu hình JWT, CORS, chế độ stateless.
- `JwtAuthenticationFilter` và `JwtAuthenticationEntryPoint` đã có trong mã nguồn.
- `GlobalExceptionHandler` đã được định nghĩa.

#### 2.1.2 Controllers và service core
Có các controller chính sau:
- `ProductController`
- `CategoryController`
- `SupplierController`
- `BranchController`
- `InventoryController`
- `PurchaseOrderController`
- `SaleInvoiceController`
- `UserController`

#### 2.1.3 Entity và repository
Các entity cơ bản trong backend đã có:
- `User`
- `Role`
- `Branch`
- `Product`
- `Category`
- `Supplier`
- `Inventory`
- `InventoryTransaction`
- `PurchaseOrder`
- `PurchaseOrderItem`
- `SaleInvoice`
- `SaleInvoiceItem`
- `RefreshToken`

Repository và service interface/impl cũng hiện diện cho hầu hết các module.

#### 2.1.4 Cấu hình và công cụ
- `application.yml` đã tồn tại với cấu hình datasource, JWT, Flyway.
- `Flyway` đã cấu hình trong dự án.
- Swagger/OpenAPI đã được tích hợp qua config.

### 2.2 Frontend

#### 2.2.1 Routing và layout
- `AppRoutes.tsx` đã định nghĩa router cho:
  - `/login`
  - `/dashboard`
  - `/pos`
  - `/products`
  - `/categories`
  - `/suppliers`
  - `/inventory`
  - `/purchase-orders`
  - `/branches`
  - `/reports`
- `ProtectedRoute` đã tồn tại và kiểm tra `isAuthenticated`.
- `AuthLayout` và `AdminLayout` đã có sẵn.

#### 2.2.2 Authentication
- `AuthContext` đã lưu token và trạng thái đăng nhập.
- `authService` đã gọi được API login/refresh/logout.
- `axiosInstance` đã cấu hình base URL, đính token vào header và tự động refresh access token khi 401.
- `LoginPage` đã có form đăng nhập hoạt động.

#### 2.2.3 Module frontend hiện có
- `ProductsPage` đã có kết nối `useQuery` và hiển thị danh sách sản phẩm.
- Các page khác đã tồn tại dưới dạng placeholder:
  - `CategoriesPage`
  - `BranchesPage`
  - `SuppliersPage`
  - `InventoryPage`
  - `PurchaseOrdersPage`
  - `ReportsPage`
  - `PosPage`
  - `DashboardPage`

#### 2.2.4 Service layer
Frontend đã có service module:
- `authService.ts`
- `productService.ts`
- `categoryService.ts`
- `supplierService.ts`
- `branchService.ts`
- `inventoryService.ts`
- `purchaseOrderService.ts`
- `saleService.ts`
- `reportService.ts`

## 3. So sánh với kế hoạch đã đề ra

### 3.1 Đã hoàn thành một số hạng mục chính
- Kiến trúc tách biệt backend/frontend đã có.
- REST API auth đã sẵn sàng.
- Frontend route bảo mật cơ bản đã xây dựng.
- Entity backend cơ bản đã hiện diện.
- Service và controller nhiều module đã xuất hiện.
- Frontend đã có auth flow, login page, và hiển thị sản phẩm.

### 3.2 Chưa hoàn thành hoặc cần hoàn thiện

#### Backend cần bổ sung
- Chưa chuẩn hóa DTO request/response trong controller; hiện đang ném trực tiếp entity.
- Chưa rõ RBAC theo role đã triển khai hoàn toàn chưa; cần kiểm soát `ADMIN`, `MANAGER`, `CASHIER`, `WAREHOUSE_STAFF`.
- Cần hoàn thiện validation `@Valid` và xử lý errors chi tiết.
- Cần hoàn thiện logic sale/inventory/purchase order thực tế.
- Cần thêm endpoint báo cáo và thống kê rõ ràng.
- Cần thêm unit test / integration test rõ ràng.

#### Frontend cần bổ sung
- Phần lớn pages là placeholder, chưa có form CRUD thực tế.
- Chưa có React Hook Form + Zod validation.
- Chưa có dashboard KPI thật sự và chart.
- Chưa có UI POS đầy đủ.
- Chưa có các component chuyên dụng như `POSSearchBar`, `InvoiceBuilder`, `StockAlertBadge`, `StockMovementLog`, `ProfitReportChart`, `BranchSelector`.

## 4. Tổng kết

### Hiện trạng
Dự án hiện đã có nền tảng rất tốt cho một hệ thống POS + quản lý tồn kho:
- Backend đã có module dữ liệu và auth cơ bản.
- Frontend đã có route và auth state framework.

### Cần tập trung tiếp theo
1. Hoàn thiện backend CRUD đúng chuẩn DTO + validation.
2. Hoàn thiện RBAC và logic nghiệp vụ: sale, nhập kho, điều chỉnh tồn kho.
3. Hoàn thiện frontend CRUD cho module branch/category/supplier/product.
4. Xây page báo cáo, dashboard và POS thực tế.
5. Viết test và hoàn chỉnh Swagger/API docs.

---

**Gợi ý đặt tên file:** `PROJECT_STATUS.md`

File này là bản tóm tắt trạng thái hiện tại của dự án so với kế hoạch đã đề ra.