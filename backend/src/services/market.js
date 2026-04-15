const fetch = require('node-fetch');

const DEFILLAMA_POOLS_URL = 'https://yields.llama.fi/pools';
const DEFILLAMA_PRICE_URL = 'https://coins.llama.fi/prices/current/coingecko:monad?searchWidth=4h';
const SHMONAD_STATS_URL = 'https://api.shmonad.xyz/stats';
const FALLBACK_APY = null;

let cachedMarketData = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 3 * 60 * 1000;

async function getMonPrice() {

  // Source 0: Binance (no rate limit, no key needed)
  try {
    const res = await fetch(
      'https://api.binance.com/api/v3/ticker/price?symbol=MONUSDT',
      { timeout: 5000 }
    );
    if (res.ok) {
      const data = await res.json();
      const price = parseFloat(data?.price);
      if (price && price > 0) {
        console.log(`MON price from Binance: $${price}`);
        return price;
      }
    }
  } catch (err) { console.warn('Binance failed:', err.message); }
  // Source 1: DefiLlama (no rate limit, most reliable)
  try {
    const res = await fetch(DEFILLAMA_PRICE_URL, { timeout: 8000 });
    if (res.ok) {
      const data = await res.json();
      const price = data?.coins?.['coingecko:monad']?.price;
      if (price && price > 0) {
        console.log(`MON price from DefiLlama: $${price}`);
        return price;
      }
    }
  } catch (err) { console.warn('DefiLlama price failed:', err.message); }

  // Source 2: CoinGecko fallback
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=monad&vs_currencies=usd',
      { timeout: 5000 }
    );
    if (res.ok) {
      const data = await res.json();
      const price = data?.monad?.usd;
      if (price && price > 0) {
        console.log(`MON price from CoinGecko: $${price}`);
        return price;
      }
    }
  } catch (err) { console.warn('CoinGecko failed:', err.message); }

  console.warn('All price sources failed');
  return null;
}

async function getShMonApy() {
  try {
    const res = await fetch(SHMONAD_STATS_URL, { timeout: 5000 });
    if (res.ok) {
      const data = await res.json();
      const apy = data?.apy ?? data?.APY ?? data?.stakingApy ?? null;
      const tvlUsd = data?.tvl ?? data?.tvlUsd ?? data?.totalValueLocked ?? null;
      if (apy !== null) {
        console.log(`shMON APY from shMonad API: ${apy}%`);
        return { apy, apyBase: apy, tvlUsd };
      }
    }
  } catch (err) { console.warn('shMonad API failed:', err.message); }

  try {
    const res = await fetch(DEFILLAMA_POOLS_URL, { timeout: 20000 });
    if (res.ok) {
      const data = await res.json();
      const pools = data?.data || [];
      const shmonPool = pools.find(
        (p) =>
          p.symbol?.toLowerCase().includes('shmon') ||
          p.project?.toLowerCase().includes('shmonad') ||
          p.project?.toLowerCase().includes('fastlane')
      );
      if (shmonPool) {
        console.log(`shMON APY from DefiLlama: ${shmonPool.apy}%`);
        return {
          apy: shmonPool.apy ?? shmonPool.apyBase ?? null,
          apyBase: shmonPool.apyBase ?? null,
          tvlUsd: shmonPool.tvlUsd ?? null,
        };
      }
    }
  } catch (err) { console.warn('DefiLlama APY failed:', err.message); }

  return { apy: FALLBACK_APY, apyBase: FALLBACK_APY, tvlUsd: null };
}

async function getMarketData() {
  const now = Date.now();
  if (cachedMarketData && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedMarketData;
  }
  const [monPrice, apyData] = await Promise.all([getMonPrice(), getShMonApy()]);
  cachedMarketData = { monPrice, ...apyData };
  cacheTimestamp = now;
  return cachedMarketData;
}

module.exports = { getMarketData };