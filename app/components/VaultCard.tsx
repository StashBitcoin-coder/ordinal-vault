'use client';
import { VaultRecord } from '@/app/types';

interface Props {
  vault: VaultRecord;
}

export default function VaultCard({ vault }: Props) {
  const imageUrl = `https://ordinals.com/content/${vault.inscriptionId}`;
  const ordinalsUrl = `https://ordinals.com/inscription/${vault.inscriptionId}`;
  const gammaUrl = `https://gamma.io/ordinals/inscription/${vault.inscriptionId}`;
  const unisatUrl = `https://unisat.io/inscription/${vault.inscriptionId}`;
  const ordinalsWalletUrl = `https://ordinalswallet.com/inscription/${vault.inscriptionId}`;

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: '1.5rem',
      boxShadow: '0 0 40px var(--glow)',
    }}>
      {/* Image */}
      <div style={{
        background: 'var(--bg3)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        minHeight: 200,
      }}>
        <img
          src={imageUrl}
          alt={vault.assetName}
          style={{
            maxWidth: '100%',
            maxHeight: 340,
            borderRadius: 8,
            objectFit: 'contain',
            display: 'block',
          }}
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.style.display = 'none';
            t.parentElement!.innerHTML = `
              <div style="color:var(--text2);font-size:0.8rem;text-align:center;">
                <div style="font-size:2rem;margin-bottom:0.5rem;">🖼</div>
                Image loading from ordinals.com
              </div>`;
          }}
        />
      </div>

      {/* Details */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          fontFamily: "Oswald, sans-serif",
          fontWeight: 700,
          fontSize: '1.2rem',
          marginBottom: '1.25rem',
          color: 'var(--text)',
        }}>
          {vault.assetName}
        </div>

        <Row label="INSCRIPTION #" value={`#${vault.inscriptionNumber}`} />
        <Row label="WALLET ADDRESS" value={vault.walletAddress} mono />
        <Row label="INSCRIPTION ID" value={vault.inscriptionId} mono truncate />

        {/* Verify link */}
        <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
          <a
            href={ordinalsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--accent)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              padding: '0.6rem 1.1rem',
              borderRadius: 6,
              textDecoration: 'none',
              fontFamily: 'inherit',
            }}
          >
            ↗ VERIFY ON ORDINALS.COM
          </a>
        </div>

        {/* Marketplace links */}
        <div>
          <div style={{
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            color: 'var(--text2)',
            marginBottom: '0.6rem',
          }}>MARKETPLACE LINKS</div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Gamma', url: gammaUrl },
              { label: 'UniSat', url: unisatUrl },
              { label: 'Ordinals Wallet', url: ordinalsWalletUrl },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.05em',
                  color: 'var(--text2)',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  padding: '0.35rem 0.75rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = 'var(--accent)';
                  (e.target as HTMLElement).style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = 'var(--text2)';
                  (e.target as HTMLElement).style.borderColor = 'var(--border)';
                }}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '1.25rem',
          fontSize: '0.65rem',
          color: 'var(--text2)',
          letterSpacing: '0.05em',
        }}>
          Registered {new Date(vault.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, truncate }: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: '0.75rem',
      marginBottom: '0.75rem',
      alignItems: 'start',
    }}>
      <span style={{
        fontSize: '0.62rem',
        letterSpacing: '0.1em',
        color: 'var(--text2)',
        paddingTop: 2,
      }}>{label}</span>
      <span style={{
        fontSize: mono ? '0.72rem' : '0.85rem',
        fontFamily: mono ? "'Space Mono', monospace" : 'inherit',
        color: 'var(--text)',
        wordBreak: truncate ? 'break-all' : 'normal',
      }}>{value}</span>
    </div>
  );
}
