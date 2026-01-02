# 🚀 Quick Start Guide

## Get Started in 3 Steps

### Step 1: Open the Demo
Open `dist/index.html` in your browser to see the full wallet interface.

Or run the development server:
```bash
npm run serve
```

### Step 2: Try the Examples
Open `example.html` in your browser for simple CDN usage examples.

### Step 3: Integrate into Your App

#### Option A: Include as CDN
```html
<script src="./dist/ethereum-usdt-wallet.js"></script>
<script>
    const wallet = new EthereumWallet();
    const newWallet = wallet.createNewWallet();
    console.log('Address:', newWallet.address);
</script>
```

#### Option B: Import as Module
```javascript
import EthereumWallet from './src/wallet.js';

const wallet = new EthereumWallet();
```

## 📖 What's Included

### Files You Can Use:
- **`dist/ethereum-usdt-wallet.js`** - Main CDN bundle (563KB)
- **`dist/index.html`** - Full wallet interface
- **`example.html`** - Simple usage examples

### Core Features:
✅ Create new wallets with BIP39 mnemonics  
✅ Import from private key or mnemonic  
✅ Check ETH and USDT balances  
✅ Send ETH and USDT transactions  
✅ Sign and verify messages  
✅ Export encrypted wallets  

## 🎯 Quick Examples

### Create a New Wallet
```javascript
const wallet = new EthereumWallet();
const newWallet = wallet.createNewWallet();

console.log('Address:', newWallet.address);
console.log('Private Key:', newWallet.privateKey);
console.log('Mnemonic:', newWallet.mnemonic);
```

### Check Balances
```javascript
const wallet = new EthereumWallet();
wallet.connectProvider(); // Connect to Ethereum network

const ethBalance = await wallet.getEthBalance('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
const usdtBalance = await wallet.getUsdtBalance('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

console.log('ETH:', ethBalance);
console.log('USDT:', usdtBalance);
```

### Send USDT
```javascript
const wallet = new EthereumWallet();
wallet.importFromPrivateKey('YOUR_PRIVATE_KEY');
wallet.connectProvider();

const receipt = await wallet.sendUsdt(
    '0xRecipientAddress',
    '100' // Send 100 USDT
);

console.log('Transaction hash:', receipt.hash);
```

## 🔐 Important Security Notes

⚠️ **NEVER share your private keys or mnemonic phrases!**

- This wallet runs entirely in your browser
- Always backup your keys securely offline
- Test with small amounts first
- Verify addresses before sending transactions

## 📚 Documentation

- **Full API Reference:** See `USAGE.md`
- **Project Details:** See `README.md`
- **Live Examples:** Open `example.html` in browser
- **Full Interface:** Open `dist/index.html` in browser

## 🛠️ Development Commands

```bash
npm install          # Install dependencies
npm run build        # Build for production
npm run dev          # Build with watch mode
npm run serve        # Start development server
```

## 🌐 What's Next?

1. **Test the demo:** Open `dist/index.html`
2. **Try examples:** Open `example.html`  
3. **Read the docs:** Check `USAGE.md` for complete API
4. **Integrate:** Add to your project using CDN or modules

## 📞 Need Help?

- Check the `USAGE.md` for detailed API documentation
- Look at `example.html` for working code samples
- Review `README.md` for project overview

---

**Ready to build? Start with `dist/index.html` or `example.html`!** 🚀
