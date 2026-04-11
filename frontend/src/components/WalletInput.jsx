import React, { useState } from 'react';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  inputRow: {
    display: 'flex',
    width: '100%',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '14px 24px',
    background: 'var(--purple)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s, opacity 0.2s',
    whiteSpace: 'nowrap',
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-dim)',
    textAlign: 'center',
  },
};

export default function WalletInput({ onSearch, loading }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={styles.wrapper}>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter wallet address (0x...)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          onFocus={(e) => (e.target.style.borderColor = 'var(--purple)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: loading || !value.trim() ? 0.6 : 1,
            cursor: loading || !value.trim() ? 'not-allowed' : 'pointer',
          }}
          disabled={loading || !value.trim()}
        >
          {loading ? 'Loading...' : 'Check Portfolio'}
        </button>
      </div>
      <p style={styles.hint}>Read-only · No wallet connection required · Monad Mainnet</p>
    </form>
  );
}
