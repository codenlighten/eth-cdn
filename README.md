# Ethereum USDT Wallet Creator CDN

A complete client-side Ethereum wallet creator with USDT support, packaged as a CDN-ready JavaScript library.

## Features

✅ **Wallet Creation & Import**
- Generate new wallets with BIP39 mnemonic phrases
- Import wallets from private keys
- Import wallets from mnemonic phrases (12/24 words)
- Export encrypted JSON wallets

✅ **Ethereum Support**
- Check ETH balances
- Send ETH transactions
- Sign and verify messages

✅ **USDT (Tether) Support**
- Check USDT balances on Ethereum mainnet
- Send USDT (ERC-20) transactions
- Full ERC-20 token contract interaction

✅ **Security**
- Client-side only - your keys never leave your browser
- BIP39 standard mnemonic generation
- HD wallet support
- Encrypted wallet export

## Installation

### Development Setup

1. **Clone and Install Dependencies:**
```bash
npm install
```

2. **Run Development Server:**
```bash
npm run serve
```

3. **Build for Production:**
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### As a CDN

After building, include the script in your HTML:

```html
<script src="ethereum-usdt-wallet.js"></script>

<script>
  // Create wallet instance
  const wallet = new EthereumWallet();
  
  // Create new wallet
  const newWallet = wallet.createNewWallet();
  console.log('Address:', newWallet.address);
  console.log('Private Key:', newWallet.privateKey);
  console.log('Mnemonic:', newWallet.mnemonic);
</script>
```

### JavaScript Module

```javascript
import EthereumWallet from './ethereum-usdt-wallet.js';

const wallet = new EthereumWallet();
```

## API Reference

### Creating/Importing Wallets

```javascript
// Create new wallet
const walletInfo = wallet.createNewWallet();
// Returns: { address, privateKey, mnemonic, publicKey }

// Import from private key
const imported = wallet.importFromPrivateKey('0x...');
// Returns: { address, privateKey, publicKey }

// Import from mnemonic
const restored = wallet.importFromMnemonic('word1 word2 ... word12');
// Returns: { address, privateKey, mnemonic, publicKey }
```

### Connecting to Network

```javascript
// Connect to Ethereum network (default: public RPC)
wallet.connectProvider();

// Or use custom RPC
wallet.connectProvider('https://mainnet.infura.io/v3/YOUR-KEY');
```

### Checking Balances

```javascript
// Get ETH balance
const ethBalance = await wallet.getEthBalance();
console.log('ETH:', ethBalance);

// Get USDT balance
const usdtBalance = await wallet.getUsdtBalance();
console.log('USDT:', usdtBalance);

// Check balance for any address
const balance = await wallet.getEthBalance('0x...');
```

### Sending Transactions

```javascript
// Send ETH
const receipt = await wallet.sendEth(
  '0xRecipientAddress',
  '0.1' // amount in ETH
);
console.log('Transaction hash:', receipt.hash);

// Send USDT
const usdtReceipt = await wallet.sendUsdt(
  '0xRecipientAddress',
  '100' // amount in USDT
);
console.log('Transaction hash:', usdtReceipt.hash);
```

### Signing Messages

```javascript
// Sign a message
const signature = await wallet.signMessage('Hello, Ethereum!');

// Verify a signature
const signer = wallet.verifyMessage('Hello, Ethereum!', signature);
console.log('Signed by:', signer);
```

### Wallet Export/Import

```javascript
// Export encrypted wallet
const encryptedJson = await wallet.exportWallet('password123');

// Import encrypted wallet
const imported = await wallet.importFromJson(encryptedJson, 'password123');
```

## USDT Contract Details

- **Mainnet Address:** `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- **Standard:** ERC-20
- **Decimals:** 6

## Security Notes

⚠️ **IMPORTANT:**
- This wallet runs entirely in your browser
- **NEVER** share your private keys or mnemonic phrases
- Always backup your keys securely offline
- Test with small amounts first
- Verify transaction details before confirming

## RPC Providers

Default RPC: `https://eth.llamarpc.com` (public, rate-limited)

For production, consider:
- [Infura](https://infura.io/)
- [Alchemy](https://www.alchemy.com/)
- [QuickNode](https://www.quicknode.com/)

## Browser Compatibility

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Opera: ✅

## Technologies Used

- **Ethers.js v6** - Ethereum library
- **BIP39** - Mnemonic generation
- **Webpack 5** - Module bundler
- **HD Key** - Hierarchical Deterministic wallets

## License

MIT

## Disclaimer

This software is provided "as is" without warranty. Users are responsible for the security of their private keys and funds. Always audit the code before use in production.

## Development

### Project Structure
```
eth-webpack/
├── src/
│   ├── index.js        # Entry point
│   ├── wallet.js       # Wallet implementation
│   └── index.html      # Demo interface
├── dist/               # Built files (after npm run build)
├── webpack.config.js   # Webpack configuration
└── package.json        # Dependencies
```

### Scripts

- `npm run build` - Production build
- `npm run dev` - Development build with watch mode
- `npm run serve` - Start dev server with hot reload

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Made with ❤️ for the Ethereum community**
