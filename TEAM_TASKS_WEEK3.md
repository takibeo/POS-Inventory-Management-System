# Phân chia công việc Tuần 3 — Hoàn thiện requirement + Core Features

## Tổng quan
Tuần 3 tập trung vào:
1. **Requirement không thể thiếu**: Testing (8+ test cases), Charts/Visualization, InventoryTransaction page, BranchSelector global filter
2. **Tính năng hữu ích**: Search, filter, print, export, modal, responsive
3. **Mục tiêu**: Đạt 95% requirement assignment + hoàn thiện code quality

---

## Thành viên 1 (Backend — Testing + API Enhancement)

### Mục tiêu: Testing (8+ test cases yêu cầu assignment) + Search/Filter/Validate

### Công việc

#### 1. **Unit Testing — PRIORITY HIGH** (trung bình - khó)
Viết test cases cho 5 service chính (requirement: ≥8 test cases):
- **ProductServiceImplTest**: test CRUD, getByCategory, getBySupplier, search by name/SKU
- **CategoryServiceImplTest**: test CRUD, getAll, getById
- **SupplierServiceImplTest**: test CRUD, getAll
- **SaleInvoiceServiceImplTest**: test create sale (check stock), update status, delete
- **PurchaseOrderServiceImplTest**: test create order, update status, receive (update inventory)

Mỗi test file ≥2-3 test case (happy path + error case + edge case).
Implementation:
```java
@SpringBootTest
@DataJpaTest
class ProductServiceImplTest {
  @MockBean private ProductRepository productRepository;
  private ProductServiceImpl productService;
  
  @Test
  void testCreateProduct() { ... }
  
  @Test
  void testCreateProductThrowsException() { ... }
}
```

Target: 8-10 test file, ≥20 test case

#### 2. **Search Endpoint** (dễ)
- `GET /api/products/search?q=name` → search sản phẩm theo tên, SKU
- Implementation: `WHERE name LIKE %q% OR sku LIKE %q%`

#### 3. **Filter Query Param** (dễ)
- **Products**: `?categoryId=uuid&supplierId=uuid&active=true`
- **SaleInvoice**: `?status=PENDING` (nếu có)
- **PurchaseOrder**: `?supplierId=uuid&status=DRAFT`
- **Inventory**: `?branchId=uuid`

#### 4. **Better Error Message** (dễ)
- Error format: `{ code: "ERROR_CODE", message: "Tiếng Việt" }`
- Example: `{ code: "INSUFFICIENT_STOCK", message: "Sản phẩm X không đủ hàng" }`
- Validate khi bán: check `quantity <= availableQuantity`
- Validate khi nhập: check `price > 0`, `quantity > 0`

#### 5. **Audit Log Đơn giản** (trung bình)
- Table `AuditLog`: userId, action (CREATE/UPDATE/DELETE), entity, description, timestamp
- Log khi: tạo sale, nhận đơn nhập
- Endpoint: `GET /api/audit-logs` → xem lịch sử

#### 6. **API Response Format Nhất quán** (dễ)
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2026-06-19T10:00:00Z"
}
```

### Deliverable Member 1
✅ 5 test file (≥20 test case tổng)  
✅ Search endpoint  
✅ Filter query param (3+ endpoint)  
✅ Error message rõ ràng, user-friendly  
✅ Audit log  
✅ API response format consistent  

---

## Thành viên 2 (Frontend — Core Features + InventoryTransaction)

### Mục tiêu: PRIORITY HIGH Features — InventoryTransaction page + BranchSelector + Print/Export

### Công việc

#### 0. **PRIORITY HIGH: InventoryTransaction Page** (trung bình)
Tạo trang mới `StockMovementLog.tsx` — hiển thị lịch sử tồn kho (requirement assignment):
- Route: `/stock-movement` hoặc `/inventory-history`
- UI: DataTable với column: Date, Product, Transaction Type (PURCHASE/SALE/ADJUSTMENT), Quantity, Remark, Branch
- Filter: by product, by branch, by transaction type, date range
- Call backend: `GET /api/inventories/{branchId}/transactions`
- Sort by date (newest first)
- Export to CSV button

Implementation:
```tsx
useQuery({
  queryKey: ['inventory-transactions', branchId],
  queryFn: () => inventoryService.getTransactionsByBranch(branchId)
})
```

#### 1. **PRIORITY HIGH: BranchSelector Global Dropdown** (trung bình)
Thêm dropdown ở top navbar để filter tất cả dữ liệu theo chi nhánh:
- Dropdown show danh sách branch
- Khi select → save vào React context hoặc localStorage
- Tất cả danh sách (products, sales, orders, inventory) **auto filter** theo branch selected
- Update AppContext hoặc AuthContext để share `selectedBranchId`

Components cần update:
- Navbar.tsx: thêm BranchSelector dropdown
- ProductsPage, SalesPage, InventorPage, PurchaseOrdersPage: add `branchId` filter param

#### 2. **Print Hoá đơn & Đơn nhập** (dễ)
- Dùng `react-to-print` library
- Button "In" ở detail view
- CSS `@media print` format A4 đẹp
- Include: invoice #, date, items, total, signature area

#### 3. **CSV Export** (dễ)
- Button "Export CSV" cho danh sách
- Sản phẩm, hoá đơn, đơn nhập, tồn kho
- Dùng `papaparse` hoặc `csv-stringify`

#### 4. **Search & Filter** (dễ-trung bình)
- Search sản phẩm real-time (debounce 300ms)
- Filter: products (active, category), sales (status), inventory (low-stock warning)

#### 5. **Modal Detail View** (dễ)
- Click row → mở modal với detail
- Thêm cho: product, sale, order

#### 6. **Quick Action Button** (dễ)
- Products: "Edit", "Delete"
- Sales: "Print"
- Orders: "Print", "Receive"

#### 7. **Autocomplete Product** (trung bình)
- Gõ product name → show suggestion (top 5)
- Click select → add vào form
- Debounce + backend search

#### 8. **Toast Notification Tốt hơn** (dễ)
- Stack toasts (show 3 cái cùng lúc)
- Auto-dismiss sau 3s
- Different colors

### Deliverable Member 2
✅ InventoryTransaction page (StockMovementLog)  
✅ BranchSelector global dropdown  
✅ Print hoá đơn & đơn nhập  
✅ CSV export (3+ loại)  
✅ Search & filter  
✅ Modal detail view  
✅ Quick action button  
✅ Autocomplete product  


---

## Thành viên 3 (Frontend Lead — Charts + UX Polish)

### Mục tiêu: PRIORITY HIGH — Charts/Visualization (requirement assignment) + UX Polish

### Công việc

#### 0. **PRIORITY HIGH: Dashboard Charts with Recharts** (trung bình - khó)
Implement 4 biểu đồ trên Dashboard (requirement assignment):

1. **Revenue Trend Line Chart** (30 days):
   - X-axis: ngày, Y-axis: doanh thu
   - Data from `reportService.getRevenueReport()` hoặc tạo mới endpoint `/api/reports/revenue-trend?days=30`
   - Color: green

2. **Profit Trend Line Chart** (30 days):
   - X-axis: ngày, Y-axis: lợi nhuận
   - Data from backend
   - Color: blue

3. **Top 5 Best-Sellers Bar Chart**:
   - X-axis: product name, Y-axis: quantity sold
   - Data from `reportService.getBestSellers()`
   - Color: orange

4. **Category Breakdown Pie Chart**:
   - Show distribution sản phẩm theo category
   - Data: query products, count by category
   - Color: multiple colors (auto)

Implementation with Recharts:
```tsx
import { LineChart, BarChart, PieChart } from 'recharts';

<LineChart width={600} height={300} data={revenueData}>
  <CartesianGrid />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="amount" stroke="#10b981" />
</LineChart>
```

Install: `npm install recharts`

#### 1. **Loading Skeleton** (dễ)
- Thay thế LoadingSpinner
- Khi load danh sách → show skeleton rows (gray placeholder)
- Khi load form → show skeleton input
- Tự viết: `<div className="h-4 bg-gray-200 rounded animate-pulse"></div>`

#### 2. **Mobile Responsive** (trung bình)
Test & optimize cho 375px-768px:
- Sidebar: hamburger menu trên mobile
- Form: full-width input, stack vertically
- Table: card layout thay vì horizontal scroll
- Chart: responsive width (80% container)

#### 3. **Dashboard Widget** (dễ)
Thêm card vào dashboard:
- "Hôm nay bán bao nhiêu?" KPI
- "Đơn nhập chưa nhận" count
- "Sản phẩm sắp hết hàng" list

#### 4. **Form Validation & Auto-save** (dễ)
- Show error message đỏ ở dưới input
- Highlight invalid input (red border)
- Optional: auto-save draft vào localStorage

#### 5. **Color & Format Consistency** (dễ)
- Status badge: DRAFT=gray, SUBMITTED=yellow, RECEIVED=green
- Currency: "1.234.567 ₫" (Vietnamese)
- Date: "19/06/2026" (DD/MM/YYYY)
- Reuse helper function

#### 6. **Sidebar Menu Active State** (dễ)
- Highlight menu item matching current page
- Remember collapse/expand state ở localStorage

#### 7. **Bulk Action** (trung bình)
- Checkbox select multiple items → delete/update
- Checkbox ở header (select all)

### Deliverable Member 3
✅ 4 interactive charts (revenue, profit, best-sellers, category pie)  
✅ Loading skeleton  
✅ Mobile responsive <375px  
✅ Dashboard widget  
✅ Form validation & auto-save  
✅ Color/format consistency  
✅ Sidebar menu active state  
✅ Bulk action  


---

## Deliverable Cuối Tuần 3

### Backend (Member 1)
✅ 5 test file (20+ test case)  
✅ Search endpoint  
✅ Filter query param  
✅ Error message rõ ràng  
✅ Audit log  
✅ API response format consistent  

### Frontend (Member 2)
✅ InventoryTransaction page (StockMovementLog) — **PRIORITY HIGH**  
✅ BranchSelector global dropdown — **PRIORITY HIGH**  
✅ Print hoá đơn & đơn nhập  
✅ CSV export  
✅ Search & filter  
✅ Modal detail view  
✅ Quick action button  
✅ Autocomplete product  
✅ Toast notification  

### Frontend (Member 3)
✅ 4 Charts with Recharts — **PRIORITY HIGH**  
✅ Loading skeleton  
✅ Mobile responsive  
✅ Dashboard widget  
✅ Form validation & auto-save  
✅ Color/format consistency  
✅ Sidebar menu active state  
✅ Bulk action  

---

## Priority Ranking

### 🔴 MUST DO (Requirement assignment)
1. **Charts (Recharts)** — Member 3
2. **Testing (8+ test cases)** — Member 1
3. **InventoryTransaction page** — Member 2
4. **BranchSelector global filter** — Member 2
5. **Print functionality** — Member 2
6. **CSV export** — Member 2

### 🟡 SHOULD DO (High impact UX)
7. Search & filter
8. Mobile responsive
9. Form validation
10. Autocomplete product
11. Modal detail view
12. Loading skeleton

### 🟢 NICE TO HAVE (If time permits)
13. Bulk action
14. Sidebar active state
15. Dashboard widget
16. Toast improvement

---

## Estimate Timeline

| Task | Member | Days | Notes |
|------|--------|------|-------|
| Charts (4 loại) | 3 | 2-3 | High complexity |
| Testing (5 file) | 1 | 2-3 | Must have 8+ cases |
| InventoryTransaction | 2 | 1-2 | New page |
| BranchSelector | 2 | 1-2 | Global dropdown + filtering |
| Print + Export | 2 | 1-2 | Libraries ready |
| Search/Filter | 1,2 | 1-2 | Backend + Frontend |
| Mobile responsive | 3 | 1-2 | Test 375px-1920px |
| Skeleton loading | 3 | 1 | Simple CSS |
| Modal detail | 2 | 1 | Reuse component |
| Audit log | 1 | 1 | Optional, nice-to-have |

**Total: ~14-16 days of work → 3 members, 5 work-days/week → ✅ Feasible for Week 3**

---

## Ghi chú quan trọng

- **Charts là priority cao nhất** (assignment requirement)
- **Testing bắt buộc** (≥8 test case requirement)
- **InventoryTransaction page là feature mới** (không thể thiếu)
- **BranchSelector global filter** (multi-branch support)
- **Commit hằng ngày** vào main branch
- **Code review** qua lại giữa team member
- **Test locally** trước khi push
