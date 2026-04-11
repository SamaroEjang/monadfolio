import React from 'react';
import WalletInput from './components/WalletInput';
import PortfolioDashboard from './components/PortfolioDashboard';
import { usePortfolio } from './hooks/usePortfolio';

const styles = {
  app: {
    minHeight: '100vh',
    padding: '40px 20px 80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoMark: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'var(--purple)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '-1px',
  },
  logoText: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '15px',
    color: 'var(--text-muted)',
    maxWidth: '420px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    background: 'rgba(131,110,249,0.1)',
    border: '1px solid var(--border)',
    borderRadius: '99px',
    fontSize: '12px',
    color: 'var(--purple)',
    fontWeight: '500',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--purple)',
  },
  errorBox: {
    maxWidth: '600px',
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.25)',
    borderRadius: '12px',
    color: 'var(--red)',
    fontSize: '14px',
    textAlign: 'center',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
    fontSize: '14px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid var(--border)',
    borderTop: '3px solid var(--purple)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const globalKeyframes = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function App() {
  const { data, loading, error, fetchPortfolio } = usePortfolio();

  return (
    <>
      <style>{globalKeyframes}</style>
      <div style={styles.app}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoMark}>M</div>
            <span style={styles.logoText}>MonadFolio</span>
          </div>
          <p style={styles.tagline}>
            Track your shMON liquid staking position on Monad Mainnet
          </p>
          <span style={styles.badge}>
            <span style={styles.dot} />
            Monad Mainnet · Chain ID 143
          </span>
        </header>

        {/* Search */}
        <WalletInput onSearch={fetchPortfolio} loading={loading} />

        {/* States */}
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <span>Fetching on-chain data...</span>
          </div>
        )}

        {error && !loading && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        {data && !loading && (
          <PortfolioDashboard data={data} />
        )}
      </div>
    </>
  );
}
