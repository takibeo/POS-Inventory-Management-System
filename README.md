# POS-Inventory-Management-System

## Tổng quan

Dự án này là một hệ thống quản lý bán hàng và tồn kho (POS + Inventory Management System) với:
- Backend: Spring Boot + Java
- Frontend: React + TypeScript + Vite
- Cơ sở dữ liệu: PostgreSQL
- Xác thực: JWT + refresh token
- Quản lý người dùng, sản phẩm, tồn kho, đơn hàng mua, hóa đơn bán hàng và báo cáo

## Kiến trúc dự án

### Backend

Thư mục: `backend/`

- `src/main/java/com/pos/`
  - `config/`: cấu hình Swagger và khởi tạo dữ liệu ban đầu
  - `controller/`: REST API controllers cho auth, users, products, categories, suppliers, inventory, purchase orders, sale invoices, branches, reports
  - `service/`: interface service
  - `service/impl/`: implementation logic
  - `repository/`: Spring Data JPA repository
  - `entity/`: JPA entity mô hình hóa bảng dữ liệu
  - `dto/`: các DTO request/response
  - `security/`: cấu hình Spring Security, JWT filter, user details, auth entry point
  - `utils/`: helper JWT
  - `validation/`: validation tùy chỉnh nếu cần
  - `specification/`: bộ lọc nâng cao cho truy vấn (nếu mở rộng)

- `src/main/resources/`
  - `application.yml`: cấu hình datasource, JWT, Flyway
  - `db/migration/`: migration Flyway khởi tạo schema và bảng

- `pom.xml`: dependencies Spring Boot, security, JPA, PostgreSQL, Flyway, JWT, Lombok, MapStruct, OpenAPI

### Frontend

Thư mục: `frontend/`

- `src/`
  - `api/`: cấu hình Axios instance, interceptor lấy token và refresh token tự động
  - `contexts/`: AuthContext quản lý trạng thái đăng nhập và lưu token vào localStorage
  - `services/`: gọi API backend cho auth, products, categories, suppliers, inventory, v.v.
  - `types/`: kiểu TypeScript cho dữ liệu
  - `components/`: các component chung như `ProtectedRoute`
  - `layouts/`: layout giao diện cho auth và admin
  - `pages/`: trang chức năng như `LoginPage`, `ProductsPage`, `DashboardPage`, `CategoriesPage`, `SuppliersPage`, `InventoryPage`, `PurchaseOrdersPage`, `BranchesPage`, `ReportsPage`, `PosPage`
  - `routes/`: định tuyến `react-router-dom`

- `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`: cấu hình frontend

## Yêu cầu hệ thống

- Java 17+ hoặc Java 21/24 tương thích với Spring Boot đang dùng
- Maven
- Node.js 18+
- PostgreSQL

## Cài đặt và chạy

### 1. Cài đặt PostgreSQL

1. Tạo database:
   - `pos_inventory`
2. Cấu hình user/password trong `backend/src/main/resources/application.yml` nếu khác mặc định:
   - `username: postgres`
   - `password: postgres`
3. Flyway sẽ tự động tạo bảng khi chạy ứng dụng.

### 2. Chạy backend

1. Mở terminal tại `backend/`
2. Build ứng dụng:
   - `mvn clean package -DskipTests`
3. Chạy ứng dụng:
   - `mvn spring-boot:run`
4. Mặc định backend lắng nghe trên `http://localhost:8080`

### 3. Chạy frontend

1. Mở terminal tại `frontend/`
2. Cài dependencies:
   - `npm install`
3. Chạy dev server:
   - `npm run dev`
4. Mặc định frontend lắng nghe trên `http://localhost:5173`

### 4. Sử dụng ứng dụng

- Truy cập `http://localhost:5173`
- Đăng nhập bằng tài khoản mặc định:
  - Username: `admin`
  - Password: `admin123`

## API auth

- `POST /api/auth/login`: đăng nhập
- `POST /api/auth/refresh`: lấy token mới
- `POST /api/auth/logout`: đăng xuất

## Trạng thái hiện tại

Dự án đã có nền tảng backend và frontend hoạt động, với các chức năng chính về:
- Auth và phân quyền
- Quản lý sản phẩm, danh mục, nhà cung cấp, chi nhánh
- Quản lý kho và giao dịch tồn kho
- Đơn nhập kho, hóa đơn bán hàng
- Báo cáo doanh thu/lợi nhuận/tồn kho thấp

Các phần đã được cải thiện gần đây:
- Edge case handling cho báo cáo và inventory
- Test coverage cho các service cốt lõi
- Swagger/OpenAPI docs cho các endpoint quan trọng

### Tổng quan hệ thống

Hệ thống được thiết kế để hỗ trợ quy trình bán hàng và quản lý kho trong môi trường cửa hàng hoặc doanh nghiệp vừa và nhỏ, với các chức năng chính gồm:
- Quản lý người dùng, phân quyền và đăng nhập an toàn
- Quản lý sản phẩm, danh mục, nhà cung cấp và chi nhánh
- Theo dõi tồn kho, điều chỉnh hàng hóa và xử lý nhập/xuất kho
- Quản lý đơn đặt hàng và hóa đơn bán hàng
- Cung cấp báo cáo doanh thu, lợi nhuận và các mặt hàng tồn kho thấp

## Điểm cần hoàn thiện

Các mục còn tiếp tục cải thiện:
- Form validation chi tiết với React Hook Form + Zod
- CRUD frontend hoàn thiện cho một số module còn thiếu
- Bổ sung thêm integration test và E2E test
- Tối ưu UI/UX và trải nghiệm demo

## Thông tin thêm

- Swagger backend: `http://localhost:8080/swagger-ui.html` hoặc `http://localhost:8080/swagger-ui/index.html`
- API docs: `http://localhost:8080/v3/api-docs`

## Khởi động

- Backend: chạy Maven trong `backend`
- Frontend: chạy `npm install` và `npm run dev` trong `frontend`

## Chạy test

### Backend

Từ thư mục `backend`:

```bash
mvn test
```

Chạy một lớp test cụ thể:

```bash
mvn -Dtest=ReportServiceImplTest test
```

### Frontend

Từ thư mục `frontend`:

```bash
npm test
```

Nếu chưa cài đặt test runner hoặc project chưa cấu hình test, bạn có thể dùng:

```bash
npm run build
```

### Chạy bằng Docker (PostgreSQL + Adminer)

Nếu bạn chưa cài PostgreSQL cục bộ, dùng Docker Compose để khởi động cơ sở dữ liệu nhanh:

1. Đảm bảo đã cài Docker và Docker Compose.
2. Từ thư mục gốc của dự án, chạy:

```bash
docker-compose up -d --build
```

3. Kiểm tra container:

```bash
docker-compose ps
```

4. Truy cập Adminer (giao diện quản trị nhẹ) tại: `http://localhost:8081`

Kết nối đến DB:
- Host: `localhost`
- Port: `5432`
- Database: `pos_inventory`
- User: `postgres`
- Password: `postgres`

Để dừng và xoá containers & volumes:

```bash
docker-compose down -v
```

## Tài khoản mặc định

- Username: `admin`
- Password: `admin123`

Backend sẽ khởi tạo role và tài khoản admin nếu chưa tồn tại.