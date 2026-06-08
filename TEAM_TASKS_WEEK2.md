# Phân chia công việc Tuần 2

## Tổng quan
Tuần 2 sẽ làm đúng những gì hiện chưa có trong dự án: trang POS, trang báo cáo, trang đơn nhập kho, trang tồn kho, backend báo cáo, và workflow bán hàng/nhập kho thực tế. Không lặp lại các CRUD đã sẵn có như Product/Category/Supplier/Branch.

---

## Thành viên 1 (Backend core)

### Mục tiêu tuần 2
Hoàn thiện các API và quy trình chưa có:
- sale/purchase order với DTO và validation
- inventory adjustment tự động
- báo cáo backend
- phân quyền endpoint

### Công việc

#### 1. Hoàn thiện sale workflow
- Chuyển `SaleInvoiceController` từ nhận trực tiếp entity sang dùng `SaleInvoiceRequest`/`SaleInvoiceResponse`.
- Kiểm tra và xử lý `Inventory` khi tạo hoá đơn: trừ tồn kho, ghi `InventoryTransaction`.
- Thêm validation `@Valid` cho số lượng, giá, và kiểm tra tồn kho đủ.
- Thêm quyền truy cập cho endpoint `/api/sales`.

#### 2. Hoàn thiện purchase-order workflow
- Chuyển `PurchaseOrderController` sang DTO request/response.
- Triển khai trạng thái đơn nhập `DRAFT`, `SUBMITTED`, `RECEIVED`.
- Khi nhận hàng vào kho, cập nhật số lượng tồn kho và ghi lịch sử.
- Thêm endpoint `/api/purchase-orders/{id}/receive` và quyền truy cập rõ ràng.

#### 3. Thêm backend báo cáo
- Tạo `ReportController`/`ReportService` cho các endpoint:
  - `GET /api/reports/revenue`
  - `GET /api/reports/profit`
  - `GET /api/reports/best-sellers`
  - `GET /api/reports/low-stock`
- Trả dữ liệu đúng cấu trúc frontend đang dùng.
- Xây response DTO cho báo cáo.

#### 4. Phân quyền và error handling
- Thực hiện RBAC cho sale/purchase/inventory:
  - `CASHIER`/`MANAGER` được tạo hoá đơn
  - `WAREHOUSE_STAFF`/`MANAGER` được nhận hàng và điều chỉnh tồn kho
  - `ADMIN` có toàn quyền
- Cập nhật `GlobalExceptionHandler` để trả lỗi validation/logic rõ ràng.

#### 5. Test backend
- Viết unit test cho service sale, purchase order, inventory.
- Viết integration test cho endpoint sale, purchase order, báo cáo.
- Test workflow: tạo hoá đơn, tạo đơn nhập, nhận hàng, cập nhật tồn kho.

#### Deliverable
- API sale/purchase/report chưa có trong dự án hiện hoạt động.
- Workflow điều chỉnh tồn kho tự động.
- RBAC và lỗi backend rõ ràng.
- Test cho các phần mới.

---

## Thành viên 2 (Frontend integration)

### Mục tiêu tuần 2
Xây dựng các trang hiện vẫn placeholder và kết nối chúng với backend mới.

### Công việc

#### 1. PosPage
- Xây dựng UI POS thực tế, không còn chỉ là placeholder.
- Tìm kiếm sản phẩm theo tên/mã, chọn chi nhánh, thêm sản phẩm vào giỏ.
- Cho phép chỉnh số lượng và xoá mặt hàng khỏi giỏ.
- Gọi `saleService.createSale` để tạo hoá đơn từ frontend.
- Hiển thị thông báo lỗi nếu backend trả lỗi.

#### 2. ReportsPage
- Xây trang báo cáo dữ liệu thực tế, không chỉ mô tả.
- Gọi `reportService` để hiển thị doanh thu, lợi nhuận, bán chạy, tồn kho thấp.
- Nếu backend chưa trả dữ liệu, hiện trạng thái chờ/kết nối.

#### 3. PurchaseOrdersPage
- Xây trang quản lý đơn nhập kho.
- Hiển thị danh sách đơn, tạo đơn mới, sửa trạng thái, nhận hàng.
- Kết nối với `purchaseOrderService` để gọi API thực.
- Hiển thị trạng thái `DRAFT`, `SUBMITTED`, `RECEIVED`.

#### 4. InventoryPage
- Xây trang tồn kho với bảng theo chi nhánh và mặt hàng.
- Hiển thị số lượng hiện tại, mức đặt lại, cảnh báo tồn kho thấp.
- Thêm chức năng điều chỉnh tồn kho thủ công nếu cần.

#### Deliverable
- Các trang còn thiếu hiện đã có dữ liệu thực tế và logic.
- POS/Reports/PurchaseOrders/Inventory kết nối backend.
- Xử lý lỗi API được hiển thị rõ ràng cho người dùng.

---

## Thành viên 3 (Frontend lead)

### Mục tiêu tuần 2
Hoàn thiện giao diện và trải nghiệm cho các trang mới chưa có.

### Công việc

#### 1. Hoàn thiện layout và UX
- Chuẩn hoá layout cho các trang admin.
- Đảm bảo các trang mới có visual nhất quán: POS, báo cáo, đơn nhập và tồn kho.
- Cải thiện responsive cho giao diện mobile/tablet.

#### 2. Dashboard và report widget
- Hoàn thiện dashboard hiện có để dùng dữ liệu backend thực.
- Thiết kế lại các card KPI nếu cần, dùng dữ liệu doanh thu/thống kê thực tế.
- Thêm biểu đồ rõ ràng cho doanh thu và sản phẩm bán chạy.

#### 3. Component dùng chung
- Hoàn thiện các component phổ biến đang dùng trong dự án:
  - `DataTable`
  - `ConfirmModal`
  - `LoadingSpinner`
  - `EmptyState`
  - `StatCard`
  - `TableRowActions`
- Đảm bảo các component hỗ trợ trạng thái loading, empty, error.

#### Deliverable
- Giao diện các trang mới đã hoàn chỉnh và dễ dùng.
- Dashboard hoạt động thực sự với backend.
- Component chung ổn định, tái sử dụng được.

---

## Kết quả mong muốn cuối tuần 2

- Dự án có thêm các phần hoàn toàn mới chưa từng triển khai trước đó.
- POS, báo cáo, đơn nhập kho và tồn kho được xây dựng.
- Backend có API report và workflow sale/purchase chưa có.
- Frontend không còn placeholder cho trang chính.
