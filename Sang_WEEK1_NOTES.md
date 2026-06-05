# GHI CHÚ THAY ĐỔI CODE
**Thành viên 1 – Tuần 1 Backend | POS & Inventory Management**

> Tổng cộng: **16 file** | Tạo mới: **7** | Sửa lại: **9**

---

## 1. Tổng quan kiến trúc sau khi sửa

Luồng xử lý chuẩn sau khi hoàn thành 16 file:

```
Client  →  Controller  →  Service Interface  →  ServiceImpl  →  Repository  →  Database
```

Chiều ngược lại (trả về):

```
Database  →  Entity  →  Mapper  →  Response DTO  →  Controller  →  Client (JSON)
```

**3 nguyên tắc cốt lõi:**
- Lỗi bất kỳ đều đi qua `GlobalExceptionHandler` → trả `ErrorResponse` nhất quán
- Controller **không bao giờ** chạm vào Entity trực tiếp
- Service **không bao giờ** trả Entity ra ngoài

---

## 2. Chi tiết từng file đã thay đổi

---

### File 1/16 — `BusinessException.java`
**Package:** `com.pos.exception` | **Thao tác:** 🟢 TẠO MỚI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc dùng `RuntimeException` chung cho mọi lỗi → không phân biệt được lỗi nghiệp vụ với lỗi kỹ thuật. |
| **Tác dụng** | Tạo loại exception riêng cho lỗi nghiệp vụ (vd: SKU trùng). Có thêm `errorCode` để frontend biết chính xác lỗi gì mà xử lý. |
| **Kết nối đến** | `GlobalExceptionHandler` bắt exception này và trả về HTTP 422. |
| **Công nghệ** | `Java` · `RuntimeException` |

---

### File 2/16 — `ErrorResponse.java`
**Package:** `com.pos.exception` | **Thao tác:** 🟢 TẠO MỚI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc dùng `Map<String,Object>` tay để build response lỗi → dễ thiếu field, mỗi nơi format khác nhau. |
| **Tác dụng** | Chuẩn hóa cấu trúc JSON lỗi: luôn có `timestamp`, `status`, `errorCode`, `message`, `path`, `fieldErrors`. Frontend chỉ cần parse 1 kiểu duy nhất. |
| **Kết nối đến** | `GlobalExceptionHandler` tạo object này và trả về client dưới dạng JSON. |
| **Công nghệ** | `Java POJO` · `Jackson (JSON serialization)` |

---

### File 3/16 — `GlobalExceptionHandler.java`
**Package:** `com.pos.exception` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc thiếu handler cho 401/403, dùng Map tay, không xử lý `ConstraintViolationException` cho `@PathVariable`/`@RequestParam`. |
| **Tác dụng** | Bắt tập trung 7 loại lỗi: Validation, ConstraintViolation, ResourceNotFound, BusinessException, AuthenticationException, AccessDeniedException, Exception catch-all. Mỗi loại trả đúng HTTP status. |
| **Kết nối đến** | Nhận exception từ tất cả Controller. Dùng `ErrorResponse` (file 2), `BusinessException` (file 1), `ResourceNotFoundException` có sẵn. |
| **Công nghệ** | `Spring @ControllerAdvice` · `Spring Security` · `Bean Validation` · `Jakarta Validation` |

---

### File 4/16 — `CategoryRequest.java`
**Package:** `com.pos.dto.request` | **Thao tác:** 🔵 SỬA NHẸ

| | |
|---|---|
| **Tại sao thay đổi** | Đã gần đúng nhưng thiếu `@Size min` và chưa trim khoảng trắng khi set tên. |
| **Tác dụng** | Khuôn nhận dữ liệu từ client khi tạo/sửa Category. `@NotBlank` và `@Size` tự động kiểm tra trước khi vào Service. |
| **Kết nối đến** | `CategoryController` nhận vào → `CategoryService` xử lý → `CategoryMapper` map sang Entity. |
| **Công nghệ** | `Bean Validation` · `@NotBlank` · `@Size` |

---

### File 5/16 — `ProductRequest.java`
**Package:** `com.pos.dto.request` | **Thao tác:** 🟢 TẠO MỚI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc Controller nhận thẳng Entity → không có validation, lộ cấu trúc DB, dễ bị gán sai field. |
| **Tác dụng** | Khuôn nhận dữ liệu Product từ client. Validation chặt: SKU/tên không trống, giá bán > 0, giá vốn >= 0, reorderLevel >= 0. `categoryId`/`supplierId` là UUID để Service tự lookup. |
| **Kết nối đến** | `ProductController` nhận → `ProductServiceImpl` xử lý → `ProductMapper` dùng để map sang Entity. |
| **Công nghệ** | `Bean Validation` · `@NotBlank` · `@NotNull` · `@DecimalMin` · `@Min` · `@Size` |

---

### File 6/16 — `ProductResponse.java`
**Package:** `com.pos.dto.response` | **Thao tác:** 🟢 TẠO MỚI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc trả thẳng Entity ra ngoài → lộ cấu trúc DB, gây `LazyInitializationException` với quan hệ JPA. |
| **Tác dụng** | Khuôn dữ liệu trả về cho client. Flatten `categoryName` và `supplierName` vào luôn → client không cần gọi thêm API. Không lộ Entity. |
| **Kết nối đến** | `ProductMapper` (file 7) tạo ra object này. `ProductController` trả về client dưới dạng JSON. |
| **Công nghệ** | `Java POJO` · `Jackson (JSON serialization)` |

---

### File 7/16 — `ProductMapper.java`
**Package:** `com.pos.mapper` | **Thao tác:** 🟢 TẠO MỚI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc Service tự set từng field thủ công → code lặp, dễ sót field khi thêm column mới. |
| **Tác dụng** | Tập trung logic chuyển đổi Entity↔DTO tại 1 chỗ. `toResponse()` chuyển Entity→Response. `updateEntityFromRequest()` áp Request lên Entity. |
| **Kết nối đến** | `ProductServiceImpl` gọi cả 2 method. Nhận `Product` entity, `ProductRequest`, `Category` entity, `Supplier` entity. |
| **Công nghệ** | `Java static method` · `OOP mapping pattern` |

---

### File 8/16 — `CategoryRepository.java`
**Package:** `com.pos.repository` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc chỉ extend `JpaRepository`, không có query check trùng tên → Service không thể validate duplicate. |
| **Tác dụng** | Thêm `existsByNameIgnoreCase` (check khi tạo) và `existsByNameIgnoreCaseAndIdNot` (check khi sửa, loại trừ chính nó). Spring Data JPA tự generate SQL từ tên method. |
| **Kết nối đến** | `CategoryServiceImpl` gọi 2 method này trước khi tạo/sửa Category. |
| **Công nghệ** | `Spring Data JPA` · `Query Derivation (tên method → SQL)` |

---

### File 9/16 — `ProductRepository.java`
**Package:** `com.pos.repository` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc dùng `findAll()` mặc định → N+1 queries khi load category/supplier của từng sản phẩm, không hỗ trợ filter. |
| **Tác dụng** | Thêm `findAllWithFilters` với `JOIN FETCH` để load category+supplier cùng 1 query. Hỗ trợ filter theo `categoryId` và `isActive`. Thêm `existsBySku` để check trùng. |
| **Kết nối đến** | `ProductServiceImpl` gọi `findAllWithFilters`, `findByIdWithRelations`, `existsBySku`, `existsBySkuAndIdNot`. |
| **Công nghệ** | `Spring Data JPA` · `JPQL @Query` · `JOIN FETCH (tránh N+1)` · `@Param` |

---

### File 10/16 — `CategoryService.java`
**Package:** `com.pos.service` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc `getAllCategories()` trả `List` → không hỗ trợ phân trang, load hết data một lúc. |
| **Tác dụng** | Đổi `getAllCategories(Pageable)` trả `Page<CategoryResponse>` → client kiểm soát được số trang, kích thước, thứ tự sắp xếp. |
| **Kết nối đến** | `CategoryController` gọi qua interface này (không biết đến impl). `CategoryServiceImpl` triển khai. |
| **Công nghệ** | `Spring Data Pageable` · `Page<T>` · `Dependency Inversion` |

---

### File 11/16 — `CategoryServiceImpl.java`
**Package:** `com.pos.service.impl` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc không check trùng tên, không dùng `@Transactional` đúng cách, trả `List` thay vì `Page`. |
| **Tác dụng** | `@Transactional(readOnly=true)` mặc định tối ưu performance đọc. Check trùng tên trước tạo/sửa. Method write tự override `@Transactional` để có quyền ghi DB. |
| **Kết nối đến** | Gọi `CategoryRepository` (file 8), `CategoryMapper` có sẵn. Ném `BusinessException` và `ResourceNotFoundException`. |
| **Công nghệ** | `Spring @Service` · `@Transactional` · `Spring Data Page/Pageable` · `BusinessException` |

---

### File 12/16 — `ProductService.java`
**Package:** `com.pos.service` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc nhận/trả Entity, `getAllProducts` không có tham số filter hay phân trang. |
| **Tác dụng** | Định nghĩa contract đúng chuẩn: nhận/trả DTO, `getAllProducts` có 3 tham số (`categoryId` filter, `isActive` filter, `Pageable`). |
| **Kết nối đến** | `ProductController` gọi qua interface này. `ProductServiceImpl` triển khai. |
| **Công nghệ** | `Spring Data Pageable` · `Page<T>` · `Dependency Inversion` |

---

### File 13/16 — `ProductServiceImpl.java`
**Package:** `com.pos.service.impl` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc nhận/trả Entity, không check trùng SKU, không validate category/supplier tồn tại. |
| **Tác dụng** | Check trùng SKU trước tạo/sửa. `resolveCategory`/`resolveSupplier` tự lookup DB theo UUID, ném 404 nếu không tồn tại. `@Transactional` đúng chỗ. |
| **Kết nối đến** | Gọi `ProductRepository` (file 9), `CategoryRepository` (file 8), `SupplierRepository`. Dùng `ProductMapper` (file 7). |
| **Công nghệ** | `Spring @Service` · `@Transactional` · `BusinessException` · `ResourceNotFoundException` |

---

### File 14/16 — `CategoryController.java`
**Package:** `com.pos.controller` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc GET trả `List`, POST trả 200 thay vì 201, không có Swagger annotation, không có phân quyền. |
| **Tác dụng** | GET trả `Page` (phân trang). POST trả `201 Created` đúng chuẩn REST. `@PreAuthorize` phân quyền theo role. `@Operation` sinh tài liệu Swagger tự động. |
| **Kết nối đến** | Gọi `CategoryService` (file 10). Nhận `CategoryRequest` (file 4). Trả `CategoryResponse`. Lỗi qua `GlobalExceptionHandler` (file 3). |
| **Công nghệ** | `Spring MVC @RestController` · `Spring Security @PreAuthorize` · `Swagger @Operation` · `@Valid` · `ResponseEntity` |

---

### File 15/16 — `ProductController.java`
**Package:** `com.pos.controller` | **Thao tác:** 🟡 SỬA LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc nhận Entity thay vì DTO, GET không có filter/phân trang, POST trả 200 thay vì 201. |
| **Tác dụng** | GET hỗ trợ filter `categoryId` + `isActive` qua query param, phân trang qua `Pageable`. POST trả 201. `@PreAuthorize` phân quyền 3 cấp: xem / tạo-sửa / xóa. |
| **Kết nối đến** | Gọi `ProductService` (file 12). Nhận `ProductRequest` (file 5). Trả `ProductResponse` (file 6). Lỗi qua `GlobalExceptionHandler` (file 3). |
| **Công nghệ** | `Spring MVC @RestController` · `Spring Security @PreAuthorize` · `Swagger @Operation @Parameter` · `@Valid` · `@PageableDefault` |

---

### File 16/16 — `V1 / V2 / V3 Migration SQL`
**Package:** `resources/db/migration` | **Thao tác:** 🔴 VIẾT LẠI

| | |
|---|---|
| **Tại sao thay đổi** | Bản gốc có 4 file V1–V4 không nhất quán: V3 tạo cột rồi V4 lại xóa đi → schema lộn xộn, khó đọc. |
| **Tác dụng** | V1 tạo toàn bộ schema sạch với đầy đủ bảng + index. V2 seed 4 roles. V3 seed 3 user demo (admin/manager/cashier). Flyway chạy đúng thứ tự, không chạy lại. |
| **Kết nối đến** | Flyway đọc tự động khi app khởi động. Tạo bảng cho tất cả Entity trong project. |
| **Công nghệ** | `Flyway migration` · `PostgreSQL DDL` · `gen_random_uuid()` · `BCrypt password hash` |

---

## 3. Tổng hợp công nghệ đã dùng

| Công nghệ | Vai trò |
|---|---|
| **Spring Boot** | Framework chính. `@Service`, `@RestController`, `@ControllerAdvice` tự động scan và wire các bean. |
| **Spring Security** | `@PreAuthorize` kiểm tra role trước khi vào Controller method. Không cần if-else thủ công. |
| **Bean Validation** | `@NotBlank`, `@NotNull`, `@DecimalMin`, `@Min`, `@Size` trên DTO. Kích hoạt bằng `@Valid` ở Controller. |
| **Spring Data JPA** | `JpaRepository` cung cấp CRUD sẵn. Query Derivation tự generate SQL từ tên method. `@Query` cho JPQL phức tạp. |
| **Flyway** | Quản lý lịch sử thay đổi DB bằng file SQL đánh version. Tự chạy khi app khởi động, không chạy lại file đã chạy. |
| **Swagger/OpenAPI** | `@Tag`, `@Operation`, `@Parameter` trên Controller → tự sinh tài liệu API tại `/swagger-ui.html`. |
| **@Transactional** | Đảm bảo tính nhất quán DB. `readOnly=true` tối ưu query đọc. Write method override để có quyền ghi. |
| **Page/Pageable** | Spring Data. Client truyền `?page=0&size=20&sort=name,asc`. Server trả `Page` gồm data + tổng số trang. |

---

## 4. Tài khoản demo sau migration

| Username | Password | Role | Quyền |
|---|---|---|---|
| `admin` | `Admin@123456` | ROLE_ADMIN | Toàn quyền |
| `manager` | `Admin@123456` | ROLE_MANAGER | Xem báo cáo, quản lý sản phẩm |
| `cashier` | `Admin@123456` | ROLE_CASHIER | Tạo hóa đơn, xem sản phẩm |
