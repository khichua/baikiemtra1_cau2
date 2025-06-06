# Ứng dụng Kiểm tra Số dư Token ERC20 trên Ronin Saigon

Ứng dụng này giúp bạn kiểm tra số dư token ERC20 trên mạng Ronin Saigon (mạng testnet tương thích EVM) bằng cách tương tác trực tiếp với blockchain thông qua node RPC công khai.

## Giới thiệu

Ứng dụng này được viết bằng TypeScript và sử dụng thư viện ethers.js để tương tác với blockchain. Nó cho phép bạn:

- Kiểm tra số dư token ERC20 của một địa chỉ ví
- Hiển thị thông tin về token (tên, ký hiệu, số thập phân)
- Tương tác trực tiếp với blockchain mà không cần thông qua API trung gian
- Kiểm tra nhiều token khác nhau trong một phiên làm việc
- Xem liên kết đến trình khám phá khối để theo dõi thêm thông tin

## Tính năng

- **Tương tác trực tiếp với blockchain**: Không sử dụng API trung gian, kết nối trực tiếp đến node RPC
- **Hiển thị thông tin đầy đủ**: Tên token, ký hiệu, số thập phân, số dư
- **Định dạng số dư**: Hiển thị số dư token với định dạng dễ đọc
- **Kiểm tra tính hợp lệ**: Xác thực địa chỉ ví và địa chỉ hợp đồng
- **Xử lý lỗi**: Phát hiện và thông báo lỗi một cách rõ ràng
- **Liên kết hữu ích**: Cung cấp URL đến trình khám phá khối để xem thêm thông tin
- **Chế độ lặp lại**: Cho phép kiểm tra nhiều token khác nhau trong một phiên làm việc

## Cài đặt

### Bước 1: Cài đặt Node.js và npm

Trước tiên, bạn cần cài đặt Node.js và npm (Node Package Manager). Đây là môi trường để chạy ứng dụng JavaScript/TypeScript.

1. Truy cập trang web chính thức của Node.js: https://nodejs.org/
2. Tải xuống phiên bản LTS (Long Term Support) - phiên bản ổn định dài hạn
3. Cài đặt theo hướng dẫn trên màn hình
4. Để kiểm tra cài đặt, mở Terminal (hoặc Command Prompt trên Windows) và gõ:

```bash
node --version
npm --version
```

Nếu cả hai lệnh đều hiển thị số phiên bản, bạn đã cài đặt thành công.

### Bước 2: Tải xuống hoặc sao chép mã nguồn

1. Tạo một thư mục mới cho dự án
2. Sao chép các file `index.ts`, `package.json` và `tsconfig.json` vào thư mục đó

### Bước 3: Cài đặt các thư viện cần thiết

Sau khi đã cài đặt Node.js và npm, bạn cần cài đặt các thư viện cần thiết cho dự án:

1. Mở Terminal (hoặc Command Prompt)
2. Di chuyển đến thư mục dự án (thư mục chứa file package.json)
3. Chạy lệnh sau để cài đặt tất cả các thư viện cần thiết:

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các thư viện được liệt kê trong file package.json, bao gồm:
- ethers.js: Thư viện tương tác với blockchain Ethereum/EVM
- readline-sync: Thư viện để nhận input từ người dùng
- typescript và ts-node: Để biên dịch và chạy mã TypeScript

## Cách sử dụng

Sau khi cài đặt xong, bạn có thể chạy ứng dụng bằng lệnh:

```bash
npm start
```

hoặc

```bash
ts-node index.ts
```

Ứng dụng sẽ:
1. Kết nối đến mạng Ronin Saigon
2. Hiển thị một số token mẫu (nếu có)
3. Yêu cầu bạn nhập địa chỉ ví (ví dụ: 0x...)
4. Yêu cầu bạn nhập địa chỉ hợp đồng token ERC20 (ví dụ: 0x...)
5. Truy vấn blockchain và hiển thị thông tin token và số dư
6. Hiển thị liên kết đến trình khám phá khối để xem thêm thông tin
7. Hỏi bạn có muốn kiểm tra token khác không

## Giải thích kỹ thuật

### Cách hoạt động của hàm balanceOf và decimals

- **balanceOf(address)**: Đây là hàm tiêu chuẩn trong hợp đồng ERC20 dùng để truy vấn số dư token của một địa chỉ. Hàm này trả về một số nguyên lớn (BigNumber) biểu thị số lượng token nhỏ nhất (wei của token).

- **decimals()**: Hàm này trả về số thập phân của token, thường là 18 (giống như ETH). Số này cho biết cần chia số dư thô cho 10^decimals để có được số dư thực tế. Ví dụ, nếu balanceOf trả về 1000000000000000000 và decimals là 18, thì số dư thực tế là 1.0 token.

### Tương tác với blockchain

Ứng dụng sử dụng ethers.js để tương tác trực tiếp với blockchain thông qua node RPC của Ronin Saigon. Không có API trung gian nào được sử dụng, tất cả các truy vấn đều được gửi trực tiếp đến blockchain.

### Định dạng số dư token

Ứng dụng sử dụng hàm `formatTokenBalance` để định dạng số dư token một cách dễ đọc:

1. Chuyển đổi số dư từ đơn vị nhỏ nhất (wei) sang đơn vị token thông thường bằng cách chia cho 10^decimals
2. Loại bỏ các số 0 thừa ở cuối (ví dụ: 10.5000 -> 10.5)

## Tìm ABI hợp đồng ERC20

ABI (Application Binary Interface) là một tập hợp các định nghĩa hàm mà bạn cần để tương tác với hợp đồng thông minh. Trong dự án này, chúng ta đã sử dụng một ABI tối thiểu chỉ bao gồm các hàm cần thiết (balanceOf, decimals, symbol, name).

Nếu bạn cần ABI đầy đủ của một hợp đồng ERC20 cụ thể:

1. Truy cập trình khám phá khối (block explorer) của Ronin Saigon: https://saigon-app.roninchain.com/
2. Tìm kiếm địa chỉ hợp đồng token
3. Chuyển đến tab "Contract" hoặc "Code"
4. Tìm phần ABI hoặc Interface

## Địa chỉ hợp đồng ERC20 trên Ronin Saigon

Để thử nghiệm, bạn có thể sử dụng các token sau trên mạng Ronin Saigon:

- RON (Token gốc): Không cần địa chỉ hợp đồng (đây là token gốc của mạng)
- Các token khác: Bạn có thể tìm kiếm trên trình khám phá khối của Ronin Saigon

## Xử lý lỗi

Ứng dụng có khả năng xử lý các lỗi phổ biến như:
- Địa chỉ ví không hợp lệ
- Địa chỉ hợp đồng không hợp lệ
- Mất kết nối đến node RPC
- Hợp đồng không phải là token ERC20 hợp lệ

## Mở rộng dự án

Bạn có thể mở rộng dự án này bằng cách:

1. Thêm giao diện người dùng đồ họa (GUI) bằng React hoặc Vue.js
2. Hỗ trợ nhiều mạng blockchain khác nhau
3. Thêm tính năng theo dõi lịch sử giao dịch
4. Thêm tính năng chuyển token
5. Tích hợp với ví như MetaMask

## Lưu ý

- Đây là ứng dụng giáo dục để học về blockchain và tương tác với hợp đồng thông minh
- Ronin Saigon là mạng thử nghiệm (testnet), không phải mạng chính (mainnet)
- Các token trên mạng thử nghiệm không có giá trị thực
- Hãy cẩn thận khi làm việc với các địa chỉ ví và khóa riêng tư thực

## Tài nguyên học tập thêm

- [Tài liệu ethers.js](https://docs.ethers.io/)
- [Tiêu chuẩn ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
- [Ronin Blockchain](https://roninchain.com/)
- [Solidity Documentation](https://docs.soliditylang.org/)