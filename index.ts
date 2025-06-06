// Import các thư viện cần thiết
import { ethers } from 'ethers';
import * as readlineSync from 'readline-sync';

// ABI tối thiểu cho hợp đồng ERC20 (chỉ bao gồm các hàm cần thiết)
const ERC20_ABI = [
  // Hàm balanceOf - trả về số dư token của một địa chỉ
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  // Hàm decimals - trả về số thập phân của token
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  // Hàm symbol - trả về ký hiệu của token
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  // Hàm name - trả về tên đầy đủ của token
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  }
];

// URL của node RPC Ronin Saigon Testnet
const RPC_URL = 'https://saigon-testnet.roninchain.com/rpc';

// Một số địa chỉ token ERC20 mẫu trên Ronin Saigon Testnet (nếu có)
const SAMPLE_TOKENS = {
  // Đây là các ví dụ, bạn cần thay thế bằng địa chỉ thực tế trên mạng Ronin Saigon
  // Bạn có thể tìm các token trên https://saigon-app.roninchain.com/
  'RON': 'Token gốc của mạng (không cần địa chỉ hợp đồng)'
};

/**
 * Hàm để định dạng số dư token với số thập phân phù hợp
 * @param balance Số dư token dạng BigNumber
 * @param decimals Số thập phân của token
 * @returns Chuỗi biểu diễn số dư đã định dạng
 */
function formatTokenBalance(balance: ethers.BigNumber, decimals: number): string {
  // Chuyển đổi từ đơn vị nhỏ nhất sang đơn vị token thông thường
  const formatted = ethers.utils.formatUnits(balance, decimals);
  
  // Loại bỏ số 0 thừa ở cuối (ví dụ: 10.5000 -> 10.5)
  return formatted.replace(/\.?0+$/, '');
}

/**
 * Hàm kiểm tra tính hợp lệ của địa chỉ Ethereum
 * @param address Địa chỉ cần kiểm tra
 * @returns true nếu địa chỉ hợp lệ, false nếu không
 */
function isValidAddress(address: string): boolean {
  return ethers.utils.isAddress(address);
}

/**
 * Hàm chính để kiểm tra số dư token ERC20
 */
async function kiemTraSoDuToken() {
  console.log('===== ỨNG DỤNG KIỂM TRA SỐ DƯ TOKEN ERC20 TRÊN RONIN SAIGON =====');
  console.log('Lưu ý: Ứng dụng này kết nối trực tiếp với blockchain thông qua RPC');
  console.log('---------------------------------------------------------------');

  try {
    // Kết nối đến mạng Ronin Saigon thông qua RPC
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    
    // Kiểm tra kết nối
    try {
      const network = await provider.getNetwork();
      console.log(`✅ Đã kết nối thành công đến mạng ${network.name} (chainId: ${network.chainId})`);
    } catch (error) {
      throw new Error('Không thể kết nối đến mạng Ronin Saigon. Vui lòng kiểm tra kết nối internet của bạn.');
    }

    // Hiển thị một số token mẫu nếu có
    if (Object.keys(SAMPLE_TOKENS).length > 0) {
      console.log('\n📋 Một số token mẫu trên Ronin Saigon:');
      for (const [symbol, info] of Object.entries(SAMPLE_TOKENS)) {
        console.log(`- ${symbol}: ${info}`);
      }
    }

    // Nhập địa chỉ ví
    const walletAddress = readlineSync.question('\nNhập địa chỉ ví (0x...): ');
    
    // Kiểm tra địa chỉ ví có hợp lệ không
    if (!isValidAddress(walletAddress)) {
      throw new Error('Địa chỉ ví không hợp lệ. Địa chỉ phải bắt đầu bằng 0x và có độ dài 42 ký tự.');
    }

    // Nhập địa chỉ hợp đồng token ERC20
    const tokenAddress = readlineSync.question('Nhập địa chỉ hợp đồng token ERC20 (0x...): ');
    
    // Kiểm tra địa chỉ hợp đồng có hợp lệ không
    if (!isValidAddress(tokenAddress)) {
      throw new Error('Địa chỉ hợp đồng không hợp lệ. Địa chỉ phải bắt đầu bằng 0x và có độ dài 42 ký tự.');
    }

    console.log('\nĐang truy vấn thông tin token...');

    // Tạo đối tượng hợp đồng ERC20 từ địa chỉ và ABI
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    // Lấy thông tin token (tên, ký hiệu, số thập phân)
    const [tokenName, tokenSymbol, tokenDecimals, balance] = await Promise.all([
      tokenContract.name().catch(() => 'Unknown Token'),
      tokenContract.symbol().catch(() => '???'),
      tokenContract.decimals().catch(() => 18),
      tokenContract.balanceOf(walletAddress)
    ]);

    // Tính toán số dư thực tế (có tính đến số thập phân)
    const formattedBalance = formatTokenBalance(balance, tokenDecimals);

    // Hiển thị kết quả
    console.log('\n===== THÔNG TIN TOKEN =====');
    console.log(`Tên token: ${tokenName}`);
    console.log(`Ký hiệu: ${tokenSymbol}`);
    console.log(`Số thập phân: ${tokenDecimals}`);
    console.log(`Địa chỉ hợp đồng: ${tokenAddress}`);
    console.log('\n===== SỐ DƯ =====');
    console.log(`Địa chỉ ví: ${walletAddress}`);
    console.log(`Số dư: ${formattedBalance} ${tokenSymbol}`);

    // Hiển thị thông tin bổ sung
    console.log('\n💡 Thông tin thêm:');
    console.log(`- Số dư dạng raw: ${balance.toString()} (${tokenDecimals} số thập phân)`);
    console.log(`- Xem giao dịch của ví này: https://saigon-app.roninchain.com/address/${walletAddress}`);
    console.log(`- Xem thông tin token: https://saigon-app.roninchain.com/address/${tokenAddress}`);

  } catch (error) {
    console.error('\n❌ LỖI:', error.message || 'Đã xảy ra lỗi không xác định');
  }
}

// Hàm để kiểm tra xem người dùng có muốn tiếp tục kiểm tra token khác không
function askToContinue(): boolean {
  const answer = readlineSync.question('\nBạn có muốn kiểm tra token khác không? (y/n): ');
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

// Hàm main để chạy ứng dụng
async function main() {
  console.clear(); // Xóa màn hình console
  
  do {
    await kiemTraSoDuToken();
  } while (askToContinue());
  
  console.log('\nCảm ơn bạn đã sử dụng ứng dụng! Chúc bạn học tốt về blockchain.');
}

// Gọi hàm main
main().catch(error => {
  console.error('Lỗi không xử lý được:', error);
});