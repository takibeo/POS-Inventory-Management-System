# Báo cáo dự án: POS Inventory Management System

## 1. Giới thiệu

Dự án POS Inventory Management System là một hệ thống phần mềm được xây dựng để hỗ trợ doanh nghiệp quản lý hoạt động bán hàng và tồn kho một cách hiệu quả. Hệ thống tích hợp các chức năng quản lý sản phẩm, nhà cung cấp, chi nhánh, đơn nhập kho, hóa đơn bán hàng và báo cáo doanh thu, lợi nhuận cũng như tình trạng tồn kho.

Mục tiêu chính của dự án là xây dựng một nền tảng quản lý bán hàng và kho hàng trực quan, dễ sử dụng và có khả năng mở rộng trong tương lai.

## 2. Mục tiêu của dự án

- Xây dựng hệ thống bán hàng và quản lý kho hàng hoàn chỉnh.
- Tự động hóa quy trình quản lý sản phẩm, tồn kho và giao dịch bán hàng.
- Hỗ trợ doanh nghiệp theo dõi doanh thu, lợi nhuận và tình trạng hàng tồn kho.
- Cung cấp giao diện người dùng thân thiện, dễ sử dụng.
- Xây dựng nền tảng có thể mở rộng cho các module nâng cao trong tương lai.

## 3. Phạm vi và chức năng chính

### 3.1 Quản lý đăng nhập và phân quyền
- Hỗ trợ đăng nhập người dùng.
- Sử dụng JWT để xác thực và bảo mật hệ thống.
- Phân quyền người dùng để kiểm soát quyền truy cập vào các chức năng khác nhau.

### 3.2 Quản lý sản phẩm
- Thêm, sửa, xóa và xem thông tin sản phẩm.
- Quản lý giá bán, giá vốn, tồn kho và mức cảnh báo nhập lại.
- Hỗ trợ quản lý sản phẩm theo từng chi nhánh.

### 3.3 Quản lý danh mục và nhà cung cấp
- Quản lý danh mục sản phẩm.
- Quản lý thông tin nhà cung cấp.
- Kết nối sản phẩm với nhà cung cấp và danh mục phù hợp.

### 3.4 Quản lý chi nhánh
- Quản lý thông tin chi nhánh.
- Hỗ trợ phân quyền và vận hành theo từng địa điểm kinh doanh.

### 3.5 Quản lý tồn kho
- Theo dõi số lượng hàng tồn kho.
- Hỗ trợ các giao dịch nhập/xuất kho.
- Cảnh báo các mặt hàng thấp hàng hoặc cần nhập bổ sung.

### 3.6 Quản lý đơn nhập kho
- Tạo và theo dõi đơn nhập kho.
- Hỗ trợ nhận hàng và cập nhật tồn kho tự động.

### 3.7 Quản lý hóa đơn bán hàng
- Xử lý giao dịch bán hàng nhanh chóng.
- Tự động cập nhật số lượng tồn kho sau khi bán.
- Hỗ trợ hiển thị thông tin hóa đơn và doanh thu.

### 3.8 Báo cáo và thống kê
- Báo cáo doanh thu.
- Báo cáo lợi nhuận.
- Báo cáo sản phẩm bán chạy.
- Báo cáo sản phẩm tồn kho thấp.

## 4. Công nghệ sử dụng

### 4.1 Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- TanStack Query
- React Hot Toast

### 4.2 Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- JWT
- Swagger / OpenAPI

### 4.3 Cơ sở dữ liệu
- PostgreSQL được sử dụng làm hệ quản trị cơ sở dữ liệu chính.
- Flyway dùng để quản lý migration schema.

## 5. Kiến trúc hệ thống

Hệ thống được thiết kế theo mô hình client-server với tách biệt rõ ràng giữa frontend và backend.

- Frontend: chịu trách nhiệm hiển thị giao diện và xử lý tương tác người dùng.
- Backend: xử lý nghiệp vụ, xác thực, truy vấn dữ liệu và cung cấp API.
- Database: lưu trữ dữ liệu quan trọng như người dùng, sản phẩm, đơn hàng, tồn kho và báo cáo.

Cấu trúc này giúp hệ thống dễ bảo trì, mở rộng và tích hợp với các hệ thống khác trong tương lai.

## 6. Quy trình hoạt động của hệ thống

1. Người dùng đăng nhập vào hệ thống bằng tài khoản và mật khẩu.
2. Sau khi xác thực thành công, hệ thống cấp JWT để truy cập các chức năng.
3. Người dùng quản lý sản phẩm, tồn kho, đơn nhập kho và bán hàng thông qua giao diện.
4. Hệ thống lưu trữ dữ liệu vào cơ sở dữ liệu PostgreSQL.
5. Các giao dịch bán hàng và nhập kho sẽ cập nhật trạng thái tồn kho.
6. Người dùng có thể xem các báo cáo doanh thu, lợi nhuận và tồn kho thấp trên giao diện hệ thống.

## 7. Kết quả đạt được

- Hoàn thành được nền tảng hệ thống POS và inventory management.
- Triển khai được các module cốt lõi phục vụ demo và kiểm thử.
- Hệ thống có thể chạy được ở cả backend và frontend.
- Hỗ trợ đăng nhập, quản lý dữ liệu và báo cáo cơ bản.
- Đã có các cải thiện liên quan đến xử lý báo cáo và quản lý tồn kho.
- Đã có test cho một số service backend quan trọng.

## 8. Điểm mạnh của dự án

- Hệ thống có cấu trúc rõ ràng và dễ hiểu.
- Backend và frontend được tách biệt tốt, thuận tiện cho phát triển và bảo trì.
- Có thể demo trực tiếp và kiểm tra các chức năng chính.
- Sử dụng các công nghệ phổ biến và phù hợp với nhu cầu thực tế.
- Có thể mở rộng thêm các tính năng như tích hợp thanh toán, xuất hóa đơn, báo cáo nâng cao.

## 9. Hạn chế và chưa hoàn thiện

- Một số lỗi frontend cần tiếp tục xử lý để build và vận hành ổn định hơn.
- Giao diện vẫn cần cải thiện về trải nghiệm người dùng và độ hoàn thiện UI/UX.
- Một số tính năng có thể tiếp tục được mở rộng để phù hợp hơn với môi trường doanh nghiệp thực tế.
- Cần bổ sung thêm kiểm thử tự động và kiểm thử end-to-end.

## 10. Hướng phát triển trong tương lai

- Hoàn thiện toàn bộ các màn hình và luồng nghiệp vụ còn thiếu.
- Tối ưu hóa giao diện và cải thiện trải nghiệm người dùng.
- Bổ sung các tính năng báo cáo nâng cao, phân tích dữ liệu và biểu đồ trực quan.
- Tích hợp thanh toán online và in hóa đơn tự động.
- Mở rộng hệ thống cho nhiều chi nhánh và nhiều tầng quản lý.
- Cải thiện bảo mật và kiểm thử hệ thống trước khi triển khai thực tế.

## 11. Kết luận

Dự án POS Inventory Management System đã xây dựng được một nền tảng quản lý bán hàng và tồn kho khá hoàn chỉnh, đáp ứng được các nhu cầu cơ bản của một doanh nghiệp vừa và nhỏ. Mặc dù vẫn còn một số hạn chế cần cải thiện, dự án đã đạt được các mục tiêu ban đầu về xây dựng hệ thống có thể vận hành, hỗ trợ quản lý dữ liệu và cung cấp báo cáo cơ bản. Đây là một nền tảng tốt để tiếp tục phát triển và hoàn thiện trong các giai đoạn tiếp theo.
