import EthereumWallet from './wallet.js';

// Export for use as CDN
export default EthereumWallet;

// Also attach to window for easy CDN usage
if (typeof window !== 'undefined') {
  window.EthereumWallet = EthereumWallet;
}
