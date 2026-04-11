import React from 'react';

const styles = {
  card: {
    background: 'linear-gradient(135deg, #1A1430 0%, #13131A 100%)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  icon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--purple)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '16px',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--purple)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  text: {
    fontSize: '14px',
    color: 'var(--text)',
    lineHeight: 1.7,
  },
};

export default function NarrationCard({ narration }) {
  if (!narration) return null;
  return (
    <div style={styles.card}>
      <div style={styles.icon}>✦</div>
      <div style={styles.content}>
        <p style={styles.label}>AI Insight</p>
        <p style={styles.text}>{narration}</p>
      </div>
    </div>
  );
}
