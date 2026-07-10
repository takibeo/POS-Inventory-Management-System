# POS Inventory Frontend

Frontend cho hệ thống POS và quản lý tồn kho, xây dựng bằng React, TypeScript, Vite và TailwindCSS.

## Tech stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query
- React Hook Form
- Axios
- React Hot Toast
- Recharts
- lucide-react

## Setup local

### 1. Cài dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` nếu cần tùy chỉnh URL backend:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Nếu không cấu hình, ứng dụng sẽ mặc định dùng `http://localhost:8080/api`.

### 3. Chạy ứng dụng

```bash
npm run dev
```

### 4. Build production

```bash
npm run build
```

### 5. Preview bản build

```bash
npm run preview
```

## Project structure

```text
src/
  api/          Axios instance và interceptor
  components/   UI chung, charts, sidebar, branch selector
  contexts/     Auth/Branch context
  layouts/      Layout cho auth và admin
  pages/        Các màn hình chính
  routes/       Khai báo router
  services/     Lớp gọi API
  types/        Kiểu dữ liệu TypeScript
  utils/        Helper format và tiện ích
```

## Key features

- Đăng nhập và bảo vệ route theo phiên đăng nhập
- Dashboard tổng quan doanh thu, lợi nhuận, best sellers và cảnh báo tồn kho
- POS bán hàng với giỏ hàng, tìm sản phẩm, tính tiền và in hóa đơn
- Quản lý sản phẩm, danh mục, nhà cung cấp và chi nhánh
- Quản lý đơn nhập kho, nhận hàng và export CSV
- Quản lý tồn kho và lịch sử biến động kho theo chi nhánh
- Báo cáo doanh thu, lợi nhuận, bán chạy, tồn kho thấp
- Responsive layout cho desktop, tablet và mobile
- Loading, empty state và error state thống nhất
- Giao diện hiện đại với sidebar, header, branch selector và modal xác nhận

## API integration

Ứng dụng dùng `axios` với base URL từ `VITE_API_BASE_URL`.

- Request interceptor tự gắn `Authorization: Bearer <token>` nếu có access token
- Response interceptor unwrap payload theo format API của backend
- Tự refresh token khi gặp `401` nếu có refresh token hợp lệ
- `403` sẽ hiển thị toast thông báo không có quyền truy cập

Một số endpoint tiêu biểu:

- `POST /auth/login`
- `GET /branches`
- `GET /products`
- `GET /reports/revenue`
- `GET /reports/profit`
- `GET /reports/best-sellers`
- `GET /reports/low-stock`
- `GET /purchase-orders`
- `POST /purchase-orders`
- `POST /purchase-orders/{id}/receive`
- `GET /inventories/{branchId}/transactions`

## Troubleshooting

### 1. Không gọi được API

- Kiểm tra backend đã chạy chưa
- Kiểm tra `VITE_API_BASE_URL`
- Đảm bảo CORS đã được bật ở backend

### 2. Bị chuyển về trang login

- Access token có thể đã hết hạn
- Kiểm tra refresh token còn hợp lệ không

### 3. Báo cáo hiển thị lỗi

- Một số endpoint báo cáo có thể chưa được backend triển khai đầy đủ
- Kiểm tra tab báo cáo tương ứng để xác định endpoint lỗi

### 4. Giao diện bị lệch trên mobile

- Kiểm tra width màn hình 375px
- Ưu tiên các layout có `overflow-x-auto`, grid responsive và button stack dọc

### 5. Dữ liệu chi nhánh không đồng bộ

- Hãy đảm bảo đã chọn chi nhánh ở thanh selector trên cùng
- Tải lại trang nếu vừa thêm chi nhánh mới từ backend

## Notes

- Nếu backend trả về payload theo wrapper `{ success, data }`, axios instance sẽ tự unwrap.
- Một số màn hình có thể hiển thị mock fallback cho trend chart nếu endpoint trend chưa sẵn sàng.
