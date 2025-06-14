# Kiểm thử chức năng mua hàng và tracking dữ liệu hành vi

## 1. Kiểm thử chức năng mua hàng

### 1.1. Kỹ thuật kiểm thử sử dụng
Để đảm bảo chất lượng của chức năng mua hàng, nhóm phát triển đã áp dụng các kỹ thuật kiểm thử sau: (i) Unit Testing sử dụng Jest và React Testing Library để kiểm thử các component riêng lẻ, (ii) Integration Testing để kiểm tra tương tác giữa các thành phần, (iii) End-to-End Testing với Cypress để kiểm tra toàn bộ luồng mua hàng, và (iv) Manual Testing để đánh giá trải nghiệm người dùng.

### 1.2. Các trường hợp kiểm thử

#### TC1: Thêm sản phẩm vào giỏ hàng
Mục tiêu của test case này là kiểm tra tính chính xác của chức năng thêm sản phẩm vào giỏ hàng. Quy trình kiểm thử bao gồm ba bước chính: (i) truy cập trang sản phẩm, (ii) chọn sản phẩm cần mua, và (iii) nhấn nút "Thêm vào giỏ hàng". Kết quả mong đợi bao gồm: sản phẩm được thêm thành công vào giỏ hàng, số lượng sản phẩm trong giỏ hàng tăng lên tương ứng, và hệ thống hiển thị thông báo thành công. Test case này được thực hiện bằng kết hợp Unit Testing và Integration Testing, và kết quả thực tế đạt yêu cầu.

#### TC2: Thanh toán đơn hàng
Test case này tập trung vào việc kiểm tra toàn bộ quy trình thanh toán. Quy trình kiểm thử bao gồm năm bước tuần tự: (i) đăng nhập vào tài khoản người dùng, (ii) thêm sản phẩm vào giỏ hàng, (iii) chuyển đến trang thanh toán, (iv) nhập đầy đủ thông tin thanh toán, và (v) xác nhận đơn hàng. Kết quả mong đợi bao gồm: đơn hàng được tạo thành công trong hệ thống, email xác nhận được gửi đến người dùng, và trạng thái đơn hàng được cập nhật chính xác. Test case này được thực hiện bằng End-to-End Testing với Cypress, và kết quả thực tế đạt yêu cầu.

#### TC3: Xử lý lỗi thanh toán
Mục tiêu của test case này là đánh giá khả năng xử lý lỗi của hệ thống khi thanh toán thất bại. Quy trình kiểm thử bao gồm hai bước chính: (i) thực hiện thanh toán với thẻ hết hạn, và (ii) quan sát phản hồi của hệ thống. Kết quả mong đợi bao gồm: hệ thống hiển thị thông báo lỗi phù hợp, không tạo đơn hàng mới trong database, và giữ nguyên trạng thái giỏ hàng của người dùng. Test case này được thực hiện bằng Integration Testing, và kết quả thực tế đạt yêu cầu.

## 2. Kiểm thử chức năng tracking dữ liệu hành vi

### 2.1. Kỹ thuật kiểm thử sử dụng
Để đảm bảo độ chính xác và hiệu năng của chức năng tracking, nhóm phát triển đã áp dụng các kỹ thuật kiểm thử sau: (i) Unit Testing với Jest để kiểm tra các hàm xử lý dữ liệu, (ii) Integration Testing để kiểm tra luồng dữ liệu, (iii) Performance Testing để đánh giá khả năng xử lý dữ liệu lớn, và (iv) Manual Testing để xác minh tính chính xác của dữ liệu.

### 2.2. Các trường hợp kiểm thử

#### TC1: Tracking sự kiện xem sản phẩm
Test case này tập trung vào việc kiểm tra khả năng ghi nhận sự kiện người dùng xem sản phẩm. Quy trình kiểm thử bao gồm ba bước: (i) truy cập trang sản phẩm, (ii) xem chi tiết sản phẩm, và (iii) kiểm tra dữ liệu tracking được lưu trữ. Kết quả mong đợi bao gồm: sự kiện được ghi nhận đầy đủ trong database, dữ liệu tracking chứa đầy đủ thông tin cần thiết như timestamp, product_id, và user_id. Test case này được thực hiện bằng kết hợp Unit Testing và Integration Testing, và kết quả thực tế đạt yêu cầu.

#### TC2: Tracking hành trình mua hàng
Mục tiêu của test case này là kiểm tra khả năng ghi nhận toàn bộ hành trình mua hàng của người dùng. Quy trình kiểm thử bao gồm hai bước chính: (i) thực hiện quy trình mua hàng hoàn chỉnh, và (ii) kiểm tra dữ liệu tracking được lưu trữ. Kết quả mong đợi bao gồm: hệ thống ghi nhận đầy đủ các bước trong hành trình mua hàng (xem sản phẩm, thêm vào giỏ, thanh toán), dữ liệu được lưu theo đúng format quy định, và timestamp được ghi nhận chính xác. Test case này được thực hiện bằng Integration Testing, và kết quả thực tế đạt yêu cầu.

#### TC3: Xử lý dữ liệu tracking với lưu lượng lớn
Test case này đánh giá hiệu năng của hệ thống khi xử lý nhiều sự kiện tracking đồng thời. Quy trình kiểm thử bao gồm hai bước: (i) mô phỏng 1000 người dùng truy cập đồng thời, và (ii) theo dõi hiệu năng hệ thống. Kết quả mong đợi bao gồm: hệ thống xử lý được tất cả sự kiện tracking mà không bị mất mát dữ liệu, và thời gian phản hồi của hệ thống luôn dưới 200ms. Test case này được thực hiện bằng Performance Testing, và kết quả thực tế đạt yêu cầu.

## 3. Tổng kết kết quả kiểm thử

### 3.1. Thống kê số lượng test case
Tổng cộng có 6 test case được thực hiện, trong đó: (i) 3 test case cho chức năng mua hàng, (ii) 3 test case cho chức năng tracking dữ liệu hành vi.

### 3.2. Kết quả tổng quan
Kết quả kiểm thử cho thấy: (i) 6/6 test case đạt yêu cầu (100%), (ii) không có test case nào không đạt yêu cầu (0%).

### 3.3. Phân tích
Phân tích kết quả kiểm thử cho thấy: (i) tất cả các test case đều đạt yêu cầu đề ra, (ii) không có trường hợp nào cần xử lý lỗi, (iii) các kỹ thuật kiểm thử được áp dụng phù hợp với từng loại chức năng, và (iv) hệ thống đáp ứng được các yêu cầu về chức năng và hiệu năng.

### 3.4. Đề xuất cải thiện
Để nâng cao chất lượng kiểm thử, nhóm phát triển đề xuất: (i) bổ sung thêm test case cho các trường hợp biên, (ii) tăng cường kiểm thử bảo mật, (iii) mở rộng phạm vi performance testing, và (iv) tự động hóa thêm các test case manual 