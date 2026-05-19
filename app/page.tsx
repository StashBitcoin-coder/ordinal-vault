'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import { VaultRecord } from '@/app/types';

type SortOption = 'newest' | 'oldest' | 'name' | 'number';

export default function GalleryPage() {
  const [vaults, setVaults] = useState<VaultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('number');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<VaultRecord | null>(null);

  useEffect(() => {
    fetch('/api/vaults')
      .then((r) => r.json())
      .then((data) => { setVaults(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sorted = [...vaults]
    .filter((v) =>
      !search.trim() ||
      v.assetName.toLowerCase().includes(search.toLowerCase()) ||
      String(v.inscriptionNumber).includes(search)
    )
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'name') return a.assetName.localeCompare(b.assetName);
      return a.inscriptionNumber - b.inscriptionNumber;
    });

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.2em',
            color: 'var(--accent)', marginBottom: '0.6rem',
          }}>
            COMPLETE COLLECTION
          </div>
          <h1 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 800,
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            letterSpacing: '-0.03em', color: 'var(--text)',
            marginBottom: '0.4rem',
          }}>
            Ordinal <span style={{ color: 'var(--accent)' }}>Gallery</span>
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
            {loading ? 'Loading…' : `${vaults.length} inscriptions registered`}
          </p>
        </div>

        <div style={{
          display: 'flex', gap: '0.75rem', marginBottom: '2rem',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or inscription #"
            style={{
              flex: '1 1 200px', background: 'var(--bg3)',
              border: '1px solid var(--border)', borderRadius: 7,
              padding: '0.6rem 1rem', color: 'var(--text)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.76rem', outline: 'none', minWidth: 0,
            }}
          />
          <select
            value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 7, padding: '0.6rem 0.9rem', color: 'var(--text)',
              fontFamily: "'Space Mono', monospace", fontSize: '0.72rem',
              outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="number">Sort: Inscription #</option>
            <option value="name">Sort: Name A–Z</option>
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
          {search && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>
              {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text2)', fontSize: '0.85rem' }}>
            Loading vault registry…
          </div>
        ) : sorted.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem',
            border: '1px dashed var(--border)', borderRadius: 12,
            color: 'var(--text2)', fontSize: '0.85rem',
          }}>
            {vaults.length === 0 ? 'No vaults registered yet.' : 'No results match your search.'}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {sorted.map((vault) => (
              <GalleryCard key={vault.id} vault={vault} onClick={() => setSelected(vault)} />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <Modal vault={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function GalleryCard({ vault, onClick }: { vault: VaultRecord; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
        textAlign: 'left', padding: 0,
        transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px var(--glow)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{
        background: 'var(--bg3)', aspectRatio: '1 / 1',
        overflow: 'hidden', borderBottom: '1px solid var(--border)',
      }}>
        {imgError ? (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: 'var(--text2)',
          }}>🖼</div>
        ) : (
          <img
            src={`https://cdn.ordinalswallet.com/inscription/preview/${vault.inscriptionId}`}
            alt={vault.assetName}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <div style={{ padding: '0.75rem' }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.25rem',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {vault.assetName}
        </div>
        <div style={{
          fontSize: '0.65rem', color: 'var(--accent)',
          fontFamily: "'Space Mono', monospace", letterSpacing: '0.05em',
        }}>
          #{vault.inscriptionNumber}
        </div>
      </div>
    </button>
  );
}

function Modal({ vault, onClose }: { vault: VaultRecord; onClose: () => void }) {
  const ordinalsUrl = `https://ordinals.com/inscription/${vault.inscriptionId}`;
  const gammaUrl = `https://gamma.io/ordinals/inscription/${vault.inscriptionId}`;
  const unisatUrl = `https://unisat.io/inscription/${vault.inscriptionId}`;
  const ordinalsWalletUrl = `https://ordinalswallet.com/inscription/${vault.inscriptionId}`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 14, maxWidth: 560, width: '100%',
          maxHeight: '90vh', overflow: 'auto',
        }}
      >
        <div style={{
          background: 'var(--bg3)', padding: '1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'center',
        }}>
          <img
            src={`https://cdn.ordinalswallet.com/inscription/preview/${vault.inscriptionId}`}
            alt={vault.assetName}
            style={{ maxHeight: 300, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
          />
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 800,
            fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--text)',
          }}>
            {vault.assetName}
          </div>

          <DetailRow label="INSCRIPTION #" value={`#${vault.inscriptionNumber}`} />
          <DetailRow label="WALLET ADDRESS" value={vault.walletAddress} mono />
          <DetailRow label="INSCRIPTION ID" value={vault.inscriptionId} mono break />

          <a href={ordinalsUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'var(--accent)', color: '#000', fontWeight: 700,
            fontSize: '0.72rem', letterSpacing: '0.08em',
            padding: '0.6rem 1rem', borderRadius: 6, textDecoration: 'none',
            fontFamily: 'inherit', marginTop: '1.25rem', marginBottom: '1.25rem',
          }}>
            ↗ VERIFY ON ORDINALS.COM
          </a>

          <div style={{
            fontSize: '0.62rem', letterSpacing: '0.1em',
            color: 'var(--text2)', marginBottom: '0.6rem',
          }}>MARKETPLACE LINKS</div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {[
              { label: 'Gamma', url: gammaUrl },
              { label: 'UniSat', url: unisatUrl },
              { label: 'Ordinals Wallet', url: ordinalsWalletUrl },
            ].map(({ label, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '0.72rem', color: 'var(--text2)',
                border: '1px solid var(--border)', borderRadius: 5,
                padding: '0.35rem 0.75rem', textDecoration: 'none',
              }}>{label} ↗</a>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid var(--border)', paddingTop: '1rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Link href="/guide" style={{
              fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.06em',
            }}>
              How to verify or resell this ordinal →
            </Link>
            <button onClick={onClose} style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 6, color: 'var(--text2)', cursor: 'pointer',
              padding: '0.4rem 0.8rem', fontSize: '0.72rem', fontFamily: 'inherit',
            }}>
              CLOSE ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono, break: brk }: {
  label: string; value: string; mono?: boolean; break?: boolean;
}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '120px 1fr',
      gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'start',
    }}>
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--text2)', paddingTop: 2 }}>
        {label}
      </span>
      <span style={{
        fontSize: mono ? '0.7rem' : '0.85rem',
        fontFamily: mono ? "'Space Mono', monospace" : 'inherit',
        color: 'var(--text)', wordBreak: brk ? 'break-all' : 'normal',
      }}>
        {value}
      </span>
    </div>
  );
}