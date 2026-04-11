const { ethers } = require('ethers');

const SHMON_MAINNET_ADDRESS = '0x1B68626dCa36c7fE922fD2d55E4f631d962dE19c';
const MONAD_MAINNET_RPC = process.env.MONAD_RPC || 'https://rpc.monad.xyz';

// Minimal ABI — only what we need
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function symbol() view returns (string)',
];

// shMON-specific ABI additions for exchange rate
const SHMON_ABI = [
  ...ERC20_ABI,
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function totalAssets() view returns (uint256)',
];

let provider = null;

function getProvider() {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(MONAD_MAINNET_RPC);
  }
  return provider;
}

async function getShMonBalance(walletAddress) {
  try {
    const p = getProvider();
    const contract = new ethers.Contract(SHMON_MAINNET_ADDRESS, SHMON_ABI, p);

    const [rawBalance, decimals, symbol] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals(),
      contract.symbol(),
    ]);

    const balance = parseFloat(ethers.formatUnits(rawBalance, decimals));

    // Get underlying MON value (exchange rate)
    let underlyingMon = balance;
    try {
      if (rawBalance > 0n) {
        const assets = await contract.convertToAssets(rawBalance);
        underlyingMon = parseFloat(ethers.formatUnits(assets, decimals));
      }
    } catch {
      // convertToAssets not available — use 1:1 fallback
      underlyingMon = balance;
    }

    // Get native MON balance too
    const nativeRaw = await p.getBalance(walletAddress);
    const nativeMon = parseFloat(ethers.formatEther(nativeRaw));

    return {
      shmon: {
        balance,
        underlyingMon,
        symbol,
        contractAddress: SHMON_MAINNET_ADDRESS,
        network: 'Monad Mainnet',
      },
      nativeMon,
    };
  } catch (err) {
    console.error('Error fetching shMON balance:', err.message);
    throw new Error(`Failed to read on-chain data: ${err.message}`);
  }
}

module.exports = { getShMonBalance };
