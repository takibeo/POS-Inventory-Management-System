# Phân chia công việc Tuần 4 — Final Polish + Documentation

## Tổng quan
Tuần 4 là giai đoạn cuối cùng để hoàn thiện dự án trước khi bàn giao.

### Mục tiêu chính
1. Polish & Bug Fixes: xử lý edge case, lỗi UX, lỗi nghiệp vụ còn sót.
2. Documentation: cập nhật README, Swagger/OpenAPI, comment code quan trọng.
3. Integration testing: test các flow end-to-end trước khi demo.
4. Demo preparation: chuẩn bị môi trường demo, slide, video (nếu cần).

---

## Thành viên 1 (Backend — Final Integration + Documentation)

### Mục tiêu
Hoàn thiện backend về test, error handling, API docs và chuẩn bị cho bàn giao.

### Công việc

#### 1. Hoàn thiện test cases
- Hoàn thiện test cho các service còn lại: UserService, BranchService, CategoryService, InventoryService.
- Mỗi test file tối thiểu 2 test case.
- Tổng cộng đạt tối thiểu 30 test case.

#### 2. Edge case & error handling
- Xử lý division by zero trong báo cáo.
- Xử lý NULL values cho các field optional.
- Xử lý concurrent inventory updates.
- Test invalid/malformed JSON input.

#### 3. API documentation upgrade
- Bổ sung description, example value cho các endpoint quan trọng.
- Document error response codes: 400, 401, 403, 404, 500.
- Document headers cần thiết: Authorization, Content-Type.
- Thêm request/response example cho sale và purchase order.

#### 4. Backend README
Tạo/ cập nhật file backend/README.md với nội dung:
- Tech stack
- Setup hướng dẫn chạy local
- Environment variables
- Hướng dẫn test và build
- Tổng quan endpoint chính
- Development guide

#### 5. Performance & security review
- Kiểm tra slow query và tối ưu nếu có.
- Review JWT expiration, CORS, input sanitization.
- Đảm bảo query dùng parameterized đúng cách.

### Deliverable Member 1
- ✅ 30+ test cases
- ✅ Edge case handling hoàn thiện
- ✅ Swagger/OpenAPI docs đầy đủ hơn
- ✅ Backend README hoàn chỉnh
- ✅ Security/performance checklist pass

---

## Thành viên 2 (Frontend — Integration + Polish)

### Mục tiêu
Đảm bảo frontend hoạt động trơn tru trên các flow chính và sẵn sàng cho demo.

### Công việc

#### 1. Feature completion & bug fix
- Test lại 4 trang chính: POS, Reports, InventoryTransaction, Purchase Orders.
- Fix lỗi render hoặc dữ liệu hiển thị sai.
- Test validation cho form: empty input, invalid format.
- Test handling lỗi mạng và lỗi API (401, 404, 500).

#### 2. Cross-page integration
- Test flow: Login → Dashboard → POS → Reports.
- Test flow: Create product → Create purchase order → Receive → Check inventory.
- Test flow: BranchSelector đổi chi nhánh → dữ liệu cập nhật đúng trên toàn bộ trang.
- Test flow: Filter/search/export đều hoạt động.

#### 3. Responsive testing
- Kiểm tra desktop 1920px, tablet 768px, mobile 375px.
- Đảm bảo form, button, table, modal, sidebar hoạt động tốt.

#### 4. Performance & UX polish
- Kiểm tra bundle size và tối ưu nếu cần.
- Cải thiện loading state, empty state, error message.
- Chuẩn hóa spacing, màu sắc, button size, hover/active state.

#### 5. Frontend README
Tạo/ cập nhật file frontend/README.md với nội dung:
- Tech stack
- Setup local
- Project structure
- Key features
- API integration
- Troubleshooting

### Deliverable Member 2
- ✅ Tất cả flow chính test lại thành công
- ✅ Không còn render error rõ ràng
- ✅ Form validation & error handling ổn định
- ✅ Responsive tốt trên desktop/tablet/mobile
- ✅ Frontend README hoàn chỉnh

---

## Thành viên 3 (Frontend — Polish + Demo Prep)

### Mục tiêu
Hoàn thiện trải nghiệm người dùng và chuẩn bị cho buổi demo.

### Công việc

#### 1. UX refinement
- Review các page để thống nhất visual consistency.
- Kiểm tra padding, margin, spacing, button, hover, active state.
- Đảm bảo animation/loading mượt mà.

#### 2. Chart & dashboard polish
- Kiểm tra biểu đồ hiển thị đúng với dữ liệu thật.
- Đảm bảo chart responsive khi resize màn hình.
- Bổ sung tooltip, legend, labels rõ ràng hơn.

#### 3. Form feedback & empty state
- Kiểm tra thông báo success/error rõ ràng.
- Đảm bảo loading button disable đúng lúc.
- Empty state có hướng dẫn rõ ràng khi không có dữ liệu.

#### 4. Demo flow preparation
Tạo file DEMO.md hoặc PRESENTATION.md với nội dung:
- Overview dự án
- Tính năng chính
- Công nghệ sử dụng
- Demo steps
- Kết quả mong đợi

#### 5. Slide / video demo (nếu cần)
- Chuẩn bị nội dung trình bày 5–10 phút.
- Ghi video demo ngắn nếu có thời gian.

### Deliverable Member 3
- ✅ Visual consistency tốt hơn
- ✅ Dashboard và charts ổn định
- ✅ Form feedback rõ ràng
- ✅ Demo flow và presentation ready

---

## Final Deliverables (Week 4 End)

### Code Quality
- ✅ 30+ test cases backend
- ✅ Không còn lỗi rõ ràng trong build
- ✅ UI/UX đã được polish

### Documentation
- ✅ Backend README
- ✅ Frontend README
- ✅ Swagger/OpenAPI docs cải thiện
- ✅ Demo guide / presentation file

### Features
- ✅ Các flow chính hoạt động end-to-end
- ✅ Responsive tốt cho desktop/tablet/mobile
- ✅ Dự án sẵn sàng cho demo / submission

---

## Timeline
- Day 1–2: Testing, bug fix, edge case handling
- Day 3–4: Documentation, README, Swagger docs
- Day 4–5: Polish UI/UX, demo prep, final review

---

## Handover Checklist
- [ ] All core features work end-to-end
- [ ] Backend tests passing
- [ ] README files complete
- [ ] Swagger docs updated
- [ ] Responsive design verified
- [ ] Demo flow tested
- [ ] Presentation slide ready
