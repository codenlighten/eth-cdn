import { ethers } from 'ethers';
import * as bip39 from 'bip39';

/**
 * Ethereum Wallet Creator with USDT Support
 */
class EthereumWallet {
  constructor() {
    this.wallet = null;
    this.provider = null;
    // USDT Contract Address on Ethereum Mainnet
    this.USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    
    // USDT ABI (ERC-20 Standard functions)
    this.USDT_ABI = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function transfer(address to, uint amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function approve(address spender, uint amount) returns (bool)'
    ];
  }

  /**
   * Generate a new random wallet
   * @returns {Object} Wallet information
   */
  createNewWallet() {
    // Generate random mnemonic (12 words)
    const mnemonic = bip39.generateMnemonic();
    
    // Create wallet from mnemonic
    this.wallet = ethers.Wallet.fromPhrase(mnemonic);
    
    return {
      address: this.wallet.address,
      privateKey: this.wallet.privateKey,
      mnemonic: mnemonic,
      publicKey: this.wallet.signingKey.publicKey
    };
  }

  /**
   * Import wallet from private key
   * @param {string} privateKey - Private key to import
   * @returns {Object} Wallet information
   */
  importFromPrivateKey(privateKey) {
    try {
      this.wallet = new ethers.Wallet(privateKey);
      
      return {
        address: this.wallet.address,
        privateKey: this.wallet.privateKey,
        publicKey: this.wallet.signingKey.publicKey
      };
    } catch (error) {
      throw new Error('Invalid private key: ' + error.message);
    }
  }

  /**
   * Import wallet from mnemonic phrase
   * @param {string} mnemonic - Mnemonic phrase (12 or 24 words)
   * @returns {Object} Wallet information
   */
  importFromMnemonic(mnemonic) {
    try {
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
      }
      
      this.wallet = ethers.Wallet.fromPhrase(mnemonic);
      
      return {
        address: this.wallet.address,
        privateKey: this.wallet.privateKey,
        mnemonic: mnemonic,
        publicKey: this.wallet.signingKey.publicKey
      };
    } catch (error) {
      throw new Error('Invalid mnemonic: ' + error.message);
    }
  }

  /**
   * Connect to Ethereum provider
   * @param {string} rpcUrl - RPC URL (e.g., Infura, Alchemy)
   */
  connectProvider(rpcUrl = 'https://eth.llamarpc.com') {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    if (this.wallet) {
      this.wallet = this.wallet.connect(this.provider);
    }
  }

  /**
   * Get ETH balance
   * @param {string} address - Ethereum address (optional, uses current wallet if not provided)
   * @returns {Promise<string>} Balance in ETH
   */
  async getEthBalance(address = null) {
    if (!this.provider) {
      throw new Error('Provider not connected. Call connectProvider() first.');
    }
    
    const targetAddress = address || this.wallet?.address;
    if (!targetAddress) {
      throw new Error('No address provided and no wallet loaded');
    }
    
    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  /**
   * Get USDT balance
   * @param {string} address - Ethereum address (optional, uses current wallet if not provided)
   * @returns {Promise<string>} Balance in USDT
   */
  async getUsdtBalance(address = null) {
    if (!this.provider) {
      throw new Error('Provider not connected. Call connectProvider() first.');
    }
    
    const targetAddress = address || this.wallet?.address;
    if (!targetAddress) {
      throw new Error('No address provided and no wallet loaded');
    }
    
    const usdtContract = new ethers.Contract(
      this.USDT_CONTRACT_ADDRESS,
      this.USDT_ABI,
      this.provider
    );
    
    const balance = await usdtContract.balanceOf(targetAddress);
    const decimals = await usdtContract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  }

  /**
   * Send ETH
   * @param {string} toAddress - Recipient address
   * @param {string} amount - Amount in ETH
   * @returns {Promise<Object>} Transaction receipt
   */
  async sendEth(toAddress, amount) {
    if (!this.wallet) {
      throw new Error('No wallet loaded');
    }
    
    if (!this.provider) {
      throw new Error('Provider not connected');
    }
    
    const tx = await this.wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount)
    });
    
    const receipt = await tx.wait();
    return receipt;
  }

  /**
   * Sign an ETH transaction (does not broadcast)
   * @param {Object} tx - Transaction fields ({ to, value, data, gasLimit, nonce, maxFeePerGas, maxPriorityFeePerGas, gasPrice, chainId })
   * @returns {Promise<string>} Serialized signed transaction (0x...)
   */
  async signEthTransaction(tx) {
    if (!this.wallet) {
      throw new Error('No wallet loaded');
    }

    const txRequest = { ...tx };

    // Normalize value if provided as a decimal string
    if (txRequest.value !== undefined && typeof txRequest.value === 'string') {
      txRequest.value = ethers.parseEther(txRequest.value);
    }

    // If no provider, require caller to supply chainId and nonce
    if (!this.provider) {
      if (txRequest.chainId === undefined) {
        throw new Error('chainId is required when provider is not connected');
      }
      if (txRequest.nonce === undefined) {
        throw new Error('nonce is required when provider is not connected');
      }
      return await this.wallet.signTransaction(txRequest);
    }

    // Provider is available: fill in missing fields when possible
    const network = await this.provider.getNetwork();
    if (txRequest.chainId === undefined) {
      txRequest.chainId = network.chainId;
    }

    if (txRequest.nonce === undefined) {
      txRequest.nonce = await this.provider.getTransactionCount(this.wallet.address);
    }

    if (txRequest.gasLimit === undefined) {
      try {
        txRequest.gasLimit = await this.provider.estimateGas({
          from: this.wallet.address,
          to: txRequest.to,
          data: txRequest.data,
          value: txRequest.value
        });
      } catch (err) {
        // If estimation fails, let signing proceed without gas limit
      }
    }

    // Populate fee data if caller didn't supply it
    const hasEip1559Fees = txRequest.maxFeePerGas !== undefined || txRequest.maxPriorityFeePerGas !== undefined;
    const hasLegacyFee = txRequest.gasPrice !== undefined;
    if (!hasEip1559Fees && !hasLegacyFee) {
      const feeData = await this.provider.getFeeData();
      if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
        txRequest.maxFeePerGas = feeData.maxFeePerGas;
        txRequest.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      } else if (feeData.gasPrice) {
        txRequest.gasPrice = feeData.gasPrice;
      }
    }

    return await this.wallet.signTransaction(txRequest);
  }

  /**
   * Send USDT
   * @param {string} toAddress - Recipient address
   * @param {string} amount - Amount in USDT
   * @returns {Promise<Object>} Transaction receipt
   */
  async sendUsdt(toAddress, amount) {
    if (!this.wallet) {
      throw new Error('No wallet loaded');
    }
    
    if (!this.provider) {
      throw new Error('Provider not connected');
    }
    
    const usdtContract = new ethers.Contract(
      this.USDT_CONTRACT_ADDRESS,
      this.USDT_ABI,
      this.wallet
    );
    
    const decimals = await usdtContract.decimals();
    const amountInUnits = ethers.parseUnits(amount, decimals);
    
    const tx = await usdtContract.transfer(toAddress, amountInUnits);
    const receipt = await tx.wait();
    
    return receipt;
  }

  /**
   * Get current wallet address
   * @returns {string|null} Wallet address
   */
  getAddress() {
    return this.wallet?.address || null;
  }

  /**
   * Sign a message
   * @param {string} message - Message to sign
   * @returns {Promise<string>} Signature
   */
  async signMessage(message) {
    if (!this.wallet) {
      throw new Error('No wallet loaded');
    }
    
    return await this.wallet.signMessage(message);
  }

  /**
   * Verify a signed message
   * @param {string} message - Original message
   * @param {string} signature - Signature to verify
   * @returns {string} Signer address
   */
  verifyMessage(message, signature) {
    return ethers.verifyMessage(message, signature);
  }

  /**
   * Export wallet as JSON (encrypted)
   * @param {string} password - Password to encrypt wallet
   * @returns {Promise<string>} Encrypted JSON wallet
   */
  async exportWallet(password) {
    if (!this.wallet) {
      throw new Error('No wallet loaded');
    }
    
    return await this.wallet.encrypt(password);
  }

  /**
   * Import wallet from encrypted JSON
   * @param {string} json - Encrypted JSON wallet
   * @param {string} password - Password to decrypt
   * @returns {Promise<Object>} Wallet information
   */
  async importFromJson(json, password) {
    try {
      this.wallet = await ethers.Wallet.fromEncryptedJson(json, password);
      
      if (this.provider) {
        this.wallet = this.wallet.connect(this.provider);
      }
      
      return {
        address: this.wallet.address,
        publicKey: this.wallet.signingKey.publicKey
      };
    } catch (error) {
      throw new Error('Failed to decrypt wallet: ' + error.message);
    }
  }

  /**
   * Get transaction history (requires provider with archive access)
   * @param {string} address - Address to get history for
   * @param {number} startBlock - Starting block number
   * @param {number} endBlock - Ending block number
   * @returns {Promise<Array>} Transaction history
   */
  async getTransactionHistory(address = null, startBlock = 0, endBlock = 'latest') {
    if (!this.provider) {
      throw new Error('Provider not connected');
    }
    
    const targetAddress = address || this.wallet?.address;
    if (!targetAddress) {
      throw new Error('No address provided and no wallet loaded');
    }
    
    // Note: This is a basic implementation. For production, use a service like Etherscan API
    const currentBlock = await this.provider.getBlockNumber();
    const logs = await this.provider.getLogs({
      fromBlock: startBlock,
      toBlock: endBlock === 'latest' ? currentBlock : endBlock,
      address: targetAddress
    });
    
    return logs;
  }
}

export default EthereumWallet;
