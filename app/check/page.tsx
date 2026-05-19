'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/app/components/Header';
import VaultCard from '@/app/components/VaultCard';
import { VaultRecord } from '@/app/types';

function CheckerContent() {
  const searchParams = useSearchParams();
  const [address, setAddress] = useState('');
  const [results, setResults] = useState<VaultRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // NFC / URL param auto-lookup
  useEffect(() => {
    const vault = searchParams.get('vault');
    if (vault) {
      setAddress(vault);
      lookup(vault);
    }
  }, [searchParams]);

  async function lookup(addr?: string) {
    const q = (addr ?? address).trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    setResults(null);
    try {
      const res = await fetch(`/api/vaults?address=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') lookup();
  };

  return (
    <>
      <Header />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            color: 'var(--accent)',
            marginBottom: '1rem',
          }}>
            PROVENANCE REGISTRY · BTC ORDINALS
          </div>
          <h1 style={{
            fontFamily: "Oswald, sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 6vw, 3.2rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: '1rem',
          }}>
            Verify Your<br />
            <span style={{ color: 'var(--accent)' }}>Ordinal Vault</span>
          </h1>
          <p style={{
            color: 'var(--text2)',
            fontSize: '0.88rem',
            lineHeight: 1.7,
            maxWidth: 460,
            margin: '0 auto',
          }}>
            Paste a vault wallet address to verify authenticity and view
            on-chain provenance for fine art trading card inscriptions.
          </p>
        </div>

        {/* Search box */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 12,
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 0 60px var(--glow)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: 'var(--text2)',
            marginBottom: '0.6rem',
          }}>
            VAULT WALLET ADDRESS
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              ref={inputRef}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKey}
              placeholder="bc1p... or 0x..."
              style={{
                flex: 1,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 7,
                padding: '0.75rem 1rem',
                color: 'var(--text)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.78rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => lookup()}
              disabled={loading || !address.trim()}
              style={{
                background: loading ? 'var(--bg3)' : 'var(--accent)',
                color: loading ? 'var(--text2)' : '#000',
                border: 'none',
                borderRadius: 7,
                padding: '0.75rem 1.4rem',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                cursor: loading ? 'wait' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'CHECKING…' : 'CHECK →'}
            </button>
          </div>

          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.65rem',
            color: 'var(--text2)',
            letterSpacing: '0.05em',
          }}>
            NFC tags auto-populate this field · Tap your card to scan
          </p>
        </div>

        {/* Results */}
        {searched && !loading && results !== null && (
          <>
            {results.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                color: 'var(--text2)',
                border: '1px dashed var(--border)',
                borderRadius: 12,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⬡</div>
                <div style={{ fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text)' }}>
                  No vault found
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  This address is not registered in the Ordinal Vault registry.
                </div>
              </div>
            ) : (
              <>
                <div style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  color: 'var(--text2)',
                  marginBottom: '1rem',
                }}>
                  {results.length} RECORD{results.length !== 1 ? 'S' : ''} FOUND
                </div>
                {results.map((v) => <VaultCard key={v.id} vault={v} />)}
              </>
            )}
          </>
        )}

      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.65rem',
        color: 'var(--text2)',
        letterSpacing: '0.08em',
      }}>
        ORDINAL VAULT · PROVENANCE REGISTRY · BTC ORDINALS
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <CheckerContent />
    </Suspense>
  );
}
