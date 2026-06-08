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

#### 2.1.3 DTO, validation và RBAC
- Backend đã có request/response DTO cho ít nhất `Product`, `Category`, `Supplier`, `Branch`.
- Endpoint đã sử dụng `@Valid` và `@PreAuthorize` để phân quyền theo role.
- Các API cơ bản đã được chuẩn hóa theo layer:
  - Controller → Request DTO → Service → Response DTO.

#### 2.1.4 Entity và repository
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

#### 2.1.5 Cấu hình và công cụ
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
- `ProductsPage` đã có CRUD danh sách sản phẩm với React Query và form.
- `CategoriesPage` đã có CRUD danh mục với `React Hook Form`, list, sửa, xóa.
- `BranchesPage` đã có CRUD chi nhánh với form, edit/delete và validation cơ bản.
- `SuppliersPage` có cấu trúc tương tự và đang tiến gần đến CRUD hoàn thiện.
- `InventoryPage`, `PurchaseOrdersPage`, `ReportsPage`, `PosPage`, `DashboardPage` vẫn cần hoàn thiện UX và data thực tế.

#### 2.2.4 Service layer
Frontend đã có module service:
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
- Backend đã bắt đầu áp dụng DTO, validation và RBAC cho module chính.
- Frontend CRUD cơ bản cho Categories, Branches, Products đã có form và tương tác API.
- Các component dùng chung như `DataTable`, `ConfirmModal`, `LoadingSpinner`, `PageHeader` đã hiện hữu.

### 3.2 Chưa hoàn thành hoặc cần hoàn thiện

#### Backend cần bổ sung
- Cần kiểm tra toàn bộ controller để đảm bảo DTO request/response nhất quán trên mọi module.
- Hoàn thiện RBAC role/mapping cho `ADMIN`, `MANAGER`, `CASHIER`, `WAREHOUSE_STAFF`.
- Hoàn thiện logic sale/inventory/purchase order thực tế, bao gồm cập nhật tồn kho khi bán và nhập hàng.
- Thêm endpoint báo cáo, thống kê, và dashboard backend.
- Bổ sung unit test / integration test cho API chính.

#### Frontend cần bổ sung
- Hoàn thiện UI CRUD cho Suppliers, Products, Categories, Branches và đảm bảo form validation chặt.
- Hoàn thiện dashboard KPI thật sự và chart hiển thị doanh thu / tồn kho / đơn hàng.
- Hoàn thiện UI POS, bao gồm chọn sản phẩm, giỏ hàng, thanh toán và in hoá đơn.
- Cải thiện component chung và tái sử dụng để giảm trùng lặp.
- Thêm xử lý lỗi và trải nghiệm người dùng khi API trả về lỗi.

## 4. Tổng kết

### Hiện trạng
Dự án đã đi qua giai đoạn nền tảng của tuần 1 và đã đạt được:
- Backend có auth, controller, DTO, service, repo và Flyway.
- Frontend có route bảo mật, login flow và CRUD cơ bản cho một số module.
- Nền tảng cho dashboard, POS và báo cáo đã được thiết lập.

### Cần tập trung tuần 2
1. Hoàn thiện backend CRUD cho `Product`, `Supplier`, `Branch`, `Category` và chuẩn hóa DTO.
2. Hoàn thiện logic nghiệp vụ `SaleInvoice`, `PurchaseOrder`, `InventoryTransaction` và báo cáo.
3. Hoàn thiện frontend CRUD hoàn chỉnh cho các module dữ liệu chính.
4. Xây dashboard KPI, POS page và báo cáo tương tác.
5. Tăng cường test, xử lý lỗi và document Swagger/API.

---

**Gợi ý đặt tên file:** `PROJECT_STATUS.md`

File này là bản tóm tắt trạng thái hiện tại của dự án so với kế hoạch đã đề ra.