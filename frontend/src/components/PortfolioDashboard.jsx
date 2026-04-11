import React from 'react';
import StatCard from './StatCard';
import NarrationCard from './NarrationCard';
import YieldCalculator from './YieldCalculator';

function fmt(n, decimals = 4) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtUsd(n) {
  if (n === null || n === undefined) return '—';
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtApy(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toFixed(2) + '%';
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    animation: 'fadeIn 0.4s ease',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-dim)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
  },
  walletBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '10px',
    fontSize: '13px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--green)',
    flexShrink: 0,
  },
  address: {
    color: 'var(--text-muted)',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  networkBadge: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: 'var(--purple)',
    background: 'var(--purple-light)',
    padding: '3px 8px',
    borderRadius: '6px',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    background: 'var(--border-subtle)',
  },
  emptyShmon: {
    textAlign: 'center',
    padding: '32px',
    color: 'var(--text-muted)',
    fontSize: '14px',
    background: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
  },
};

export default function PortfolioDashboard({ data }) {
  const { wallet, shmon, nativeMon, market, yields, narration } = data;
  const hasShmon = shmon.balance > 0;

  return (
    <div style={styles.wrapper}>
      {/* Wallet header */}
      <div style={styles.walletBadge}>
        <div style={styles.dot} />
        <span style={styles.address}>{wallet}</span>
        <span style={styles.networkBadge}>Monad Mainnet</span>
      </div>

      {/* AI insight */}
      <NarrationCard narration={narration} />

      {/* shMON position */}
      <div>
        <p style={styles.sectionLabel}>shMON Position</p>
        {hasShmon ? (
          <div style={styles.grid4}>
            <StatCard
              label="shMON Balance"
              value={fmt(shmon.balance, 4)}
              sub="shMON tokens held"
              accent="var(--purple)"
            />
            <StatCard
              label="Underlying MON"
              value={fmt(shmon.underlyingMon, 4)}
              sub="MON value of stake"
            />
            <StatCard
              label="USD Value"
              value={fmtUsd(shmon.usdValue)}
              sub={market.monPriceUsd ? `@ ${fmtUsd(market.monPriceUsd)} / MON` : 'Price unavailable'}
            />
            <StatCard
              label="Current APY"
              value={fmtApy(market.apy)}
              sub="shMON staking yield"
              accent="var(--green)"
            />
          </div>
        ) : (
          <div style={styles.emptyShmon}>
            No shMON found in this wallet.{' '}
            <a
              href="https://shmonad.xyz"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--purple)' }}
            >
              Start staking →
            </a>
          </div>
        )}
      </div>

      {/* Yield estimates */}
      {hasShmon && (
        <div>
          <p style={styles.sectionLabel}>Estimated Yield</p>
          <div style={styles.grid2}>
            <StatCard
              label="Daily Yield"
              value={fmtUsd(yields.estimatedDailyUsd)}
              sub="Based on current APY"
              accent="var(--green)"
            />
            <StatCard
              label="Annual Yield"
              value={fmtUsd(yields.estimatedAnnualUsd)}
              sub="Projected at current APY"
              accent="var(--green)"
            />
          </div>
        </div>
      )}

      {/* Native MON + Market */}
      <div>
        <p style={styles.sectionLabel}>Wallet & Market</p>
        <div style={styles.grid4}>
          <StatCard
            label="Native MON"
            value={fmt(nativeMon.balance, 4)}
            sub={nativeMon.usdValue ? fmtUsd(nativeMon.usdValue) : undefined}
          />
          <StatCard
            label="MON Price"
            value={fmtUsd(market.monPriceUsd)}
            sub="CoinGecko"
          />
          <StatCard
            label="Protocol TVL"
            value={market.tvlUsd ? fmtUsd(market.tvlUsd) : '—'}
            sub="Total value locked"
          />
          <StatCard
            label="Contract"
            value="shMON"
            sub="0x282B...745C"
          />
        </div>
      </div>

      <div style={styles.divider} />

      <div>
        <p style={styles.sectionLabel}>Yield Calculator</p>
        <YieldCalculator apy={market.apy} monPrice={market.monPriceUsd} />
      </div>

      <div style={styles.divider} />
      <p style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center' }}>
        Data sourced from Monad Mainnet RPC · DefiLlama · CoinGecko · Updated {new Date(data.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}
