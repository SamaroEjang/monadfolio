import React, { useState, useEffect } from 'react';

function fmtUsd(n) {
  if (!n && n !== 0) return '$0.00';
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtMon(n) {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '16px',
    padding: '24px',
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--bg-card2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none',
  },
  unit: {
    padding: '12px 16px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    borderLeft: '1px solid var(--border-subtle)',
    background: 'var(--bg-card)',
    whiteSpace: 'nowrap',
  },
  slider: {
    width: '100%',
    marginTop: '8px',
  },
  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--text-dim)',
    marginTop: '4px',
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '10px',
    marginTop: '20px',
  },
  resultCard: {
    background: 'var(--bg-card2)',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  resultLabel: {
    fontSize: '11px',
    color: 'var(--text-dim)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  resultValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--green)',
  },
  resultSub: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  apyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: 'rgba(131,110,249,0.06)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '13px',
  },
  apyLabel: { color: 'var(--text-muted)' },
  apyValue: { color: 'var(--purple)', fontWeight: '600' },
  divider: {
    height: '1px',
    background: 'var(--border-subtle)',
    margin: '16px 0',
  },
  timeToggle: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px',
  },
  toggleBtn: (active) => ({
    padding: '6px 14px',
    borderRadius: '8px',
    border: active ? '1px solid var(--purple)' : '1px solid var(--border-subtle)',
    background: active ? 'rgba(131,110,249,0.1)' : 'transparent',
    color: active ? 'var(--purple)' : 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  }),
};

const TIME_PERIODS = [
  { label: '1 day', days: 1 },
  { label: '1 week', days: 7 },
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 182 },
  { label: '1 year', days: 365 },
];

export default function YieldCalculator({ apy, monPrice }) {
  const [monAmount, setMonAmount] = useState('1000');
  const [customApy, setCustomApy] = useState(apy ?? 13.25);
  const [activePeriod, setActivePeriod] = useState(365);

  useEffect(() => {
    if (apy) setCustomApy(parseFloat(apy.toFixed(2)));
  }, [apy]);

  const mon = parseFloat(monAmount) || 0;
  const apyFraction = customApy / 100;
  const usdValue = monPrice ? mon * monPrice : null;

  function calcYield(days) {
    const earned = mon * (Math.pow(1 + apyFraction / 365, days) - 1);
    const earnedUsd = monPrice ? earned * monPrice : null;
    return { mon: earned, usd: earnedUsd };
  }

  const activeYield = calcYield(activePeriod);
  const allPeriods = TIME_PERIODS.map((p) => ({ ...p, ...calcYield(p.days) }));

  return (
    <div style={styles.card}>
      <div style={styles.apyRow}>
        <span style={styles.apyLabel}>Current shMON APY</span>
        <span style={styles.apyValue}>{customApy.toFixed(2)}%</span>
      </div>

      <div style={styles.inputRow}>
        <span style={styles.label}>Amount to stake</span>
        <div style={styles.inputWrap}>
          <input
            type="number"
            style={styles.input}
            value={monAmount}
            min="0"
            step="100"
            onChange={(e) => setMonAmount(e.target.value)}
            placeholder="0"
          />
          <span style={styles.unit}>MON</span>
        </div>
        {usdValue !== null && (
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
            ≈ {fmtUsd(usdValue)} at current price
          </span>
        )}
      </div>

      <div style={styles.inputRow}>
        <span style={styles.label}>APY: {customApy.toFixed(2)}%</span>
        <input
          type="range"
          style={styles.slider}
          min="1"
          max="50"
          step="0.1"
          value={customApy}
          onChange={(e) => setCustomApy(parseFloat(e.target.value))}
        />
        <div style={styles.sliderLabels}>
          <span>1%</span>
          <span>25%</span>
          <span>50%</span>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.timeToggle}>
        {TIME_PERIODS.map((p) => (
          <button
            key={p.days}
            style={styles.toggleBtn(activePeriod === p.days)}
            onClick={() => setActivePeriod(p.days)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={styles.resultsGrid}>
        <div style={styles.resultCard}>
          <span style={styles.resultLabel}>MON earned</span>
          <span style={styles.resultValue}>{fmtMon(activeYield.mon)}</span>
          <span style={styles.resultSub}>MON</span>
        </div>
        <div style={styles.resultCard}>
          <span style={styles.resultLabel}>USD value</span>
          <span style={styles.resultValue}>
            {activeYield.usd !== null ? fmtUsd(activeYield.usd) : '—'}
          </span>
          <span style={styles.resultSub}>at current price</span>
        </div>
        <div style={styles.resultCard}>
          <span style={styles.resultLabel}>Total after</span>
          <span style={styles.resultValue}>{fmtMon(mon + activeYield.mon)}</span>
          <span style={styles.resultSub}>MON total</span>
        </div>
        <div style={styles.resultCard}>
          <span style={styles.resultLabel}>Yield %</span>
          <span style={styles.resultValue}>
            {mon > 0 ? ((activeYield.mon / mon) * 100).toFixed(3) : '0.000'}%
          </span>
          <span style={styles.resultSub}>of principal</span>
        </div>
      </div>

      <div style={styles.divider} />
      <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
        Full breakdown
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {allPeriods.map((p) => (
          <div
            key={p.days}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
              background: activePeriod === p.days ? 'rgba(131,110,249,0.06)' : 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => setActivePeriod(p.days)}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', width: '80px' }}>{p.label}</span>
            <span style={{ fontSize: '13px', color: 'var(--green)', fontWeight: '500' }}>
              +{fmtMon(p.mon)} MON
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {p.usd !== null ? fmtUsd(p.usd) : '—'}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '16px', textAlign: 'center' }}>
        Calculated using compound interest · MON price from CoinGecko · APY from DefiLlama
      </p>
    </div>
  );
}