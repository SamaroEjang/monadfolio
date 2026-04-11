import React from 'react';

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text)',
    lineHeight: 1.2,
  },
  sub: {
    fontSize: '13px',
    color: 'var(--text-muted)',
  },
};

export default function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      ...styles.card,
      borderColor: accent ? 'var(--border)' : 'var(--border-subtle)',
    }}>
      <span style={styles.label}>{label}</span>
      <span style={{
        ...styles.value,
        color: accent || 'var(--text)',
      }}>{value}</span>
      {sub && <span style={styles.sub}>{sub}</span>}
    </div>
  );
}
