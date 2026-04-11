const fetch = require('node-fetch');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

async function generateNarration(portfolioData) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "Add your Anthropic API key to enable AI portfolio insights.";
  }

  const { shmon, nativeMon, monPrice, apy, usdValue, estimatedAnnualYieldUsd } = portfolioData;

  const prompt = `You are a friendly DeFi portfolio assistant. Summarize this wallet's shMON staking position in exactly 2 sentences. Be specific with numbers. Keep it concise and encouraging.

Wallet data:
- shMON balance: ${shmon.balance.toFixed(4)} shMON
- Underlying MON value: ${shmon.underlyingMon.toFixed(4)} MON
- Native MON balance: ${nativeMon.toFixed(4)} MON
- Current APY: ${apy !== null ? apy.toFixed(2) + '%' : 'data unavailable'}
- USD value of shMON: ${usdValue !== null ? '$' + usdValue.toFixed(2) : 'price unavailable'}
- Estimated annual yield: ${estimatedAnnualYieldUsd !== null ? '$' + estimatedAnnualYieldUsd.toFixed(2) : 'unavailable'}
- Network: Monad Mainnet`;

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic API status ${res.status}`);
    const data = await res.json();
    return data?.content?.[0]?.text?.trim() || 'Unable to generate insight.';
  } catch (err) {
    console.warn('Narration failed:', err.message);
    return 'AI insights temporarily unavailable.';
  }
}

module.exports = { generateNarration };
