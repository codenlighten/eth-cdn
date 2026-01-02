# Ethereum USDT Wallet CDN - Complete Usage Guide

## 🚀 Quick Start

### Method 1: Use the Built CDN

Simply include the built JavaScript file in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Ethereum App</title>
</head>
<body>
    <!-- Your content here -->
    
    <!-- Include the CDN -->
    <script src="./dist/ethereum-usdt-wallet.js"></script>
    
    <script>
        // Now you can use EthereumWallet
        const wallet = new EthereumWallet();
        const newWallet = wallet.createNewWallet();
        console.log('Address:', newWallet.address);
    </script>
</body>
</html>
```

### Method 2: Use the Development Server

Run the interactive interface:

```bash
npm run serve
```

This will open the full wallet interface at http://localhost:9000

## 📚 Complete API Documentation

### Constructor

```javascript
const wallet = new EthereumWallet();
```

Creates a new wallet manager instance.

---

### Creating Wallets

#### `createNewWallet()`

Generates a new random wallet with BIP39 mnemonic.

**Returns:**
```javascript
{
  address: "0x...",        // Ethereum address
  privateKey: "0x...",     // Private key
  mnemonic: "word1 word2 ...", // 12-word phrase
  publicKey: "0x..."       // Public key
}
```

**Example:**
```javascript
const wallet = new EthereumWallet();
const newWallet = wallet.createNewWallet();

// Save these securely!
console.log('Address:', newWallet.address);
console.log('Private Key:', newWallet.privateKey);
console.log('Mnemonic:', newWallet.mnemonic);
```

---

### Importing Wallets

#### `importFromPrivateKey(privateKey)`

Import an existing wallet using its private key.

**Parameters:**
- `privateKey` (string) - The private key (with or without 0x prefix)

**Returns:**
```javascript
{
  address: "0x...",
  privateKey: "0x...",
  publicKey: "0x..."
}
```

**Example:**
```javascript
const wallet = new EthereumWallet();
const imported = wallet.importFromPrivateKey(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
);
console.log('Imported address:', imported.address);
```

---

#### `importFromMnemonic(mnemonic)`

Import an existing wallet using its mnemonic phrase.

**Parameters:**
- `mnemonic` (string) - The 12 or 24 word mnemonic phrase

**Returns:**
```javascript
{
  address: "0x...",
  privateKey: "0x...",
  mnemonic: "word1 word2 ...",
  publicKey: "0x..."
}
```

**Example:**
```javascript
const wallet = new EthereumWallet();
const restored = wallet.importFromMnemonic(
  'test test test test test test test test test test test junk'
);
console.log('Restored address:', restored.address);
```

---

#### `importFromJson(json, password)`

Import a wallet from an encrypted JSON keystore file.

**Parameters:**
- `json` (string) - The encrypted JSON wallet
- `password` (string) - The password to decrypt

**Returns:** Promise
```javascript
{
  address: "0x...",
  publicKey: "0x..."
}
```

**Example:**
```javascript
const wallet = new EthereumWallet();
const decrypted = await wallet.importFromJson(encryptedJson, 'myPassword123');
console.log('Decrypted address:', decrypted.address);
```

---

### Network Connection

#### `connectProvider(rpcUrl)`

Connect to an Ethereum network via RPC.

**Parameters:**
- `rpcUrl` (string, optional) - RPC endpoint URL. Defaults to 'https://eth.llamarpc.com'

**Example:**
```javascript
// Use default public RPC
wallet.connectProvider();

// Or use custom RPC (Infura, Alchemy, etc.)
wallet.connectProvider('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');
```

**Popular RPC Providers:**
- **Infura:** `https://mainnet.infura.io/v3/YOUR-PROJECT-ID`
- **Alchemy:** `https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY`
- **QuickNode:** `https://YOUR-ENDPOINT.quiknode.pro/YOUR-KEY/`

---

### Checking Balances

#### `getEthBalance(address)`

Get ETH balance for an address.

**Parameters:**
- `address` (string, optional) - Ethereum address. Uses current wallet if not provided.

**Returns:** Promise<string> - Balance in ETH

**Example:**
```javascript
wallet.connectProvider();

// Check current wallet balance
const myBalance = await wallet.getEthBalance();
console.log('My ETH:', myBalance);

// Check any address
const otherBalance = await wallet.getEthBalance('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
console.log('Their ETH:', otherBalance);
```

---

#### `getUsdtBalance(address)`

Get USDT (Tether) balance for an address.

**Parameters:**
- `address` (string, optional) - Ethereum address. Uses current wallet if not provided.

**Returns:** Promise<string> - Balance in USDT

**Example:**
```javascript
wallet.connectProvider();

const usdtBalance = await wallet.getUsdtBalance();
console.log('USDT Balance:', usdtBalance);

// Check Binance hot wallet USDT balance
const binanceUsdt = await wallet.getUsdtBalance('0x28C6c06298d514Db089934071355E5743bf21d60');
console.log('Binance USDT:', binanceUsdt);
```

---

### Sending Transactions

#### `sendEth(toAddress, amount)`

Send ETH to an address.

**Parameters:**
- `toAddress` (string) - Recipient Ethereum address
- `amount` (string) - Amount in ETH (e.g., "0.1")

**Returns:** Promise<TransactionReceipt>

**Example:**
```javascript
wallet.connectProvider();

try {
  const receipt = await wallet.sendEth(
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    '0.01' // Send 0.01 ETH
  );
  console.log('Transaction hash:', receipt.hash);
  console.log('Block number:', receipt.blockNumber);
  console.log('Gas used:', receipt.gasUsed.toString());
} catch (error) {
  console.error('Transaction failed:', error.message);
}
```

---

#### `sendUsdt(toAddress, amount)`

Send USDT to an address.

**Parameters:**
- `toAddress` (string) - Recipient Ethereum address
- `amount` (string) - Amount in USDT (e.g., "100")

**Returns:** Promise<TransactionReceipt>

**Example:**
```javascript
wallet.connectProvider();

try {
  const receipt = await wallet.sendUsdt(
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    '50' // Send 50 USDT
  );
  console.log('USDT sent! Hash:', receipt.hash);
} catch (error) {
  console.error('Transaction failed:', error.message);
}
```

⚠️ **Note:** Make sure you have enough ETH for gas fees when sending USDT!

---

### Message Signing

#### `signMessage(message)`

Sign a message with the current wallet.

**Parameters:**
- `message` (string) - Message to sign

**Returns:** Promise<string> - Signature

**Example:**
```javascript
const signature = await wallet.signMessage('Hello, Ethereum!');
console.log('Signature:', signature);
```

---

#### `verifyMessage(message, signature)`

Verify a signed message and recover the signer's address.

**Parameters:**
- `message` (string) - Original message
- `signature` (string) - Message signature

**Returns:** string - Signer's Ethereum address

**Example:**
```javascript
const message = 'Hello, Ethereum!';
const signature = await wallet.signMessage(message);

// Verify the signature
const signer = wallet.verifyMessage(message, signature);
console.log('Signed by:', signer);
console.log('Is valid:', signer === wallet.getAddress());
```

---

### Wallet Export

#### `exportWallet(password)`

Export the wallet as an encrypted JSON keystore.

**Parameters:**
- `password` (string) - Password to encrypt the wallet

**Returns:** Promise<string> - Encrypted JSON

**Example:**
```javascript
// Export wallet with password protection
const encryptedJson = await wallet.exportWallet('mySecurePassword123');

// Save to file or storage
localStorage.setItem('myWallet', encryptedJson);
// or download as file, etc.
```

---

### Utility Methods

#### `getAddress()`

Get the current wallet's address.

**Returns:** string | null

**Example:**
```javascript
const address = wallet.getAddress();
console.log('Current address:', address);
```

---

## 🔒 Security Best Practices

### DO:
✅ Always backup your mnemonic phrase offline
✅ Use hardware wallets for large amounts
✅ Test with small amounts first
✅ Verify recipient addresses before sending
✅ Use encrypted JSON exports with strong passwords
✅ Keep private keys in secure, encrypted storage
✅ Use HTTPS for RPC connections

### DON'T:
❌ Never share your private key or mnemonic
❌ Don't store keys in plain text
❌ Don't use public RPCs for sensitive operations
❌ Don't trust unverified addresses
❌ Don't skip transaction verification
❌ Don't use the same wallet for testing and production

---

## 🎯 Common Use Cases

### 1. Paper Wallet Generator
```javascript
const wallet = new EthereumWallet();
const newWallet = wallet.createNewWallet();

// Print or save these securely
console.log('=== PAPER WALLET ===');
console.log('Address:', newWallet.address);
console.log('Private Key:', newWallet.privateKey);
console.log('Mnemonic:', newWallet.mnemonic);
console.log('==================');
```

### 2. Balance Checker
```javascript
const checker = new EthereumWallet();
checker.connectProvider();

async function checkWallet(address) {
  const eth = await checker.getEthBalance(address);
  const usdt = await checker.getUsdtBalance(address);
  
  return { eth, usdt };
}

const balances = await checkWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
console.log(`ETH: ${balances.eth}, USDT: ${balances.usdt}`);
```

### 3. Batch Balance Checker
```javascript
async function checkMultipleWallets(addresses) {
  const checker = new EthereumWallet();
  checker.connectProvider();
  
  const results = [];
  for (const address of addresses) {
    const eth = await checker.getEthBalance(address);
    const usdt = await checker.getUsdtBalance(address);
    results.push({ address, eth, usdt });
  }
  
  return results;
}

const addresses = [
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  '0x28C6c06298d514Db089934071355E5743bf21d60'
];

const balances = await checkMultipleWallets(addresses);
console.table(balances);
```

### 4. Automated Payment System
```javascript
async function sendPayment(recipient, ethAmount, usdtAmount) {
  const wallet = new EthereumWallet();
  
  // Import your wallet
  wallet.importFromPrivateKey('YOUR_PRIVATE_KEY');
  wallet.connectProvider('YOUR_RPC_URL');
  
  // Send ETH
  if (ethAmount > 0) {
    const ethTx = await wallet.sendEth(recipient, ethAmount.toString());
    console.log('ETH sent:', ethTx.hash);
  }
  
  // Send USDT
  if (usdtAmount > 0) {
    const usdtTx = await wallet.sendUsdt(recipient, usdtAmount.toString());
    console.log('USDT sent:', usdtTx.hash);
  }
}

// Usage
await sendPayment('0xRecipient...', 0.01, 50);
```

---

## 🐛 Troubleshooting

### "Provider not connected" error
```javascript
// Make sure to connect before checking balances or sending
wallet.connectProvider();
await wallet.getEthBalance(); // Now this works
```

### "No wallet loaded" error
```javascript
// Create or import a wallet first
wallet.createNewWallet();
// or
wallet.importFromPrivateKey('0x...');
```

### "Insufficient funds" error
```javascript
// Check your ETH balance for gas fees
const balance = await wallet.getEthBalance();
console.log('ETH for gas:', balance);
```

### Transaction failing
```javascript
// Verify you have enough ETH for gas
// Try with a higher gas limit or check network congestion
```

---

## 📦 Production Deployment

### Hosting the CDN

1. **Build for production:**
```bash
npm run build
```

2. **Deploy the `dist/` folder to:**
   - Your own CDN (CloudFlare, AWS CloudFront)
   - Static hosting (GitHub Pages, Netlify, Vercel)
   - Your web server

3. **Include in your HTML:**
```html
<script src="https://your-cdn.com/ethereum-usdt-wallet.js"></script>
```

### Using with Node.js

```javascript
import EthereumWallet from './src/wallet.js';

const wallet = new EthereumWallet();
// Use as normal
```

---

## 📞 Support & Resources

- **Ethers.js Documentation:** https://docs.ethers.org/
- **Ethereum Developer Docs:** https://ethereum.org/developers
- **USDT Contract:** https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7

---

**Remember: With great power comes great responsibility. Always secure your private keys!** 🔐
