const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const { getShMonBalance } = require('../services/onchain');
const { getMarketData } = require('../services/market');
const { generateNarration } = require('../services/narration');

// Validate Ethereum address
function isValidAddress(address) {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

// GET /api/portfolio/:wallet
router.get('/portfolio/:wallet', async (req, res) => {
  const { wallet } = req.params;

  if (!isValidAddress(wallet)) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    // Fetch on-chain data and market data in parallel
    const [onchain, market] = await Promise.all([
      getShMonBalance(wallet),
      getMarketData(),
    ]);

    const { shmon, nativeMon } = onchain;
    const { monPrice, apy, tvlUsd } = market;

    // Calculate USD values
    const usdValue = monPrice !== null ? shmon.underlyingMon * monPrice : null;
    const nativeMonUsd = monPrice !== null ? nativeMon * monPrice : null;
    const estimatedAnnualYieldUsd =
      usdValue !== null && apy !== null ? (usdValue * apy) / 100 : null;
    const estimatedDailyYieldUsd =
      estimatedAnnualYieldUsd !== null ? estimatedAnnualYieldUsd / 365 : null;

    const portfolioData = {
      shmon,
      nativeMon,
      monPrice,
      apy,
      usdValue,
      nativeMonUsd,
      estimatedAnnualYieldUsd,
      estimatedDailyYieldUsd,
      tvlUsd,
    };

    // Generate AI narration
    const narration = await generateNarration(portfolioData);

    return res.json({
      wallet,
      timestamp: new Date().toISOString(),
      network: 'Monad Mainnet',
      shmon: {
        balance: shmon.balance,
        underlyingMon: shmon.underlyingMon,
        symbol: shmon.symbol,
        contractAddress: shmon.contractAddress,
        usdValue,
      },
      nativeMon: {
        balance: nativeMon,
        usdValue: nativeMonUsd,
      },
      market: {
        monPriceUsd: monPrice,
        apy,
        tvlUsd,
      },
      yields: {
        estimatedAnnualUsd: estimatedAnnualYieldUsd,
        estimatedDailyUsd: estimatedDailyYieldUsd,
      },
      narration,
    });
  } catch (err) {
    console.error('Portfolio fetch error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/market — standalone market data endpoint
router.get('/market', async (req, res) => {
  try {
    const data = await getMarketData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
