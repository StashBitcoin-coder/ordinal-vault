'use client';
import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import { VaultRecord } from '@/app/types';

const FIELDS = [
  { key: 'assetName', label: 'ASSET NAME', placeholder: 'Card #47', mono: false },
  { key: 'walletAddress', label: 'VAULT WALLET ADDRESS', placeholder: 'bc1p...', mono: true },
  { key: 'inscriptionNumber', label: 'INSCRIPTION NUMBER', placeholder: '12345678', mono: true },
  { key: 'inscriptionId', label: 'INSCRIPTION ID', placeholder: '01b0dd65...i0', mono: true },
] as const;

const empty = { assetName: '', walletAddress: '', inscriptionNumber: '', inscriptionId: '' };

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<'add' | 'manage'>('add');

  const [form, setForm] = useState({ ...empty });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [lastAdded, setLastAdded] = useState<VaultRecord | null>(null);
  const [count, setCount] = useState(0);

  const [vaults, setVaults] = useState<VaultRecord[]>([]);
  const [loadingVaults, setLoadingVaults] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<Record<string, 'loading' | 'done' | 'error'>>({});
  const [manageSearch, setManageSearch] = useState('');

  function handleAuth() {
    if (!secret.trim()) { setAuthError('Enter the admin secret'); return; }
    setAuthed(true);
  }

  async function loadVaults() {
    setLoadingVaults(true);
    try {
      const res = await fetch('/api/vaults');
      const data = await res.json();
      setVaults(data);
    } catch { /* ignore */ }
    setLoadingVaults(false);
  }

  useEffect(() => {
    if (authed && tab === 'manage') loadVaults();
  }, [authed, tab]);

  async function handleSubmit() {
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/vaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ ...form, inscriptionNumber: Number(form.inscriptionNumber) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setLastAdded(data);
      setCount((c) => c + 1);
      setStatus('success');
      setMessage(`✓ Registered: ${data.assetName}`);
      setForm((f) => ({ ...empty, walletAddress: f.walletAddress }));
      setTimeout(() => {
        (document.getElementById('field-assetName') as HTMLInputElement)?.focus();
      }, 100);
    } catch (e: any) {
      setStatus('error');
      setMessage(e.message);
    }
  }

  async function handleDelete(vault: VaultRecord) {
    if (!confirm(`Delete "${vault.assetName}"? This cannot be undone.`)) return;
    setDeleteStatus((s) => ({ ...s, [vault.id]: 'loading' }));
    try {
      const res = await fetch(`/api/vaults?id=${vault.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': secret },
      });
      if (!res.ok) throw new Error();
      setVaults((v) => v.filter((r) => r.id !== vault.id));
      setDeleteStatus((s) => ({ ...s, [vault.id]: 'done' }));
    } catch {
      setDeleteStatus((s) => ({ ...s, [vault.id]: 'error' }));
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) handleSubmit();
  };

  const filteredVaults = vaults.filter((v) =>
    !manageSearch.trim() ||
    v.assetName.toLowerCase().includes(manageSearch.toLowerCase()) ||
    String(v.inscriptionNumber).includes(manageSearch)
  );

  if (!authed) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 440, margin: '6rem auto', padding: '0 1.5rem' }}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: 12, padding: '2rem',
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontWeight: 700,
              fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text)',
            }}>Admin Access</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '1.5rem' }}>
              Enter your admin secret to register vault records.
            </p>
            <input
              type="password" value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="Admin secret" style={inputStyle} autoFocus
            />
            {authError && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>{authError}</p>
            )}
            <button onClick={handleAuth} style={{ ...btnStyle, marginTop: '1rem', width: '100%' }}>
              UNLOCK →
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.5rem 6rem' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: '1.6rem', letterSpacing: '-0.01em', color: 'var(--text)',
          }}>Vault Admin</h1>
          {count > 0 && (
            <div style={{
              background: 'var(--accent)', color: '#000', borderRadius: 8,
              padding: '0.4rem 0.9rem', fontWeight: 700, fontSize: '0.85rem',
              fontFamily: "'Oswald', sans-serif",
            }}>{count} added this session</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['add', 'manage'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? 'var(--accent)' : 'var(--bg3)',
              color: tab === t ? '#000' : 'var(--text2)',
              border: '1px solid var(--border)', borderRadius: 7,
              padding: '0.5rem 1.2rem', fontFamily: "'Space Mono', monospace",
              fontSize: '0.72rem', letterSpacing: '0.06em',
              cursor: 'pointer', fontWeight: tab === t ? 700 : 400,
            }}>
              {t === 'add' ? '+ ADD VAULT' : '✎ MANAGE / DELETE'}
            </button>
          ))}
        </div>

        {tab === 'add' && (
          <>
            <p style={{ fontSize: '0.72rem', color: 'var(--text2)', marginBottom: '1.25rem' }}>
              ⌘ + Enter to submit quickly
            </p>
            <div style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: 12, padding: '1.75rem', marginBottom: '1.25rem',
            }}>
              {FIELDS.map(({ key, label, placeholder, mono }) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    id={`field-${key}`} type="text" value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    onKeyDown={handleKey} placeholder={placeholder}
                    style={{
                      ...inputStyle,
                      fontFamily: mono ? "'Space Mono', monospace" : 'inherit',
                      fontSize: mono ? '0.78rem' : '0.88rem',
                    }}
                  />
                </div>
              ))}

              {form.inscriptionId.trim() && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={labelStyle}>PREVIEW</div>
                  <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={`https://ordinals.com/content/${form.inscriptionId.trim()}`}
                      alt="Preview"
                      style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 6, objectFit: 'contain' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || !form.assetName || !form.walletAddress || !form.inscriptionId || !form.inscriptionNumber}
                style={{
                  ...btnStyle, width: '100%',
                  opacity: (!form.assetName || !form.walletAddress || !form.inscriptionId || !form.inscriptionNumber) ? 0.5 : 1,
                }}
              >
                {status === 'loading' ? 'REGISTERING…' : 'REGISTER VAULT →'}
              </button>
            </div>

            {message && (
              <div style={{
                padding: '0.9rem 1.25rem', borderRadius: 8,
                background: status === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${status === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: status === 'success' ? 'var(--success)' : '#ef4444',
                fontSize: '0.8rem', letterSpacing: '0.04em',
              }}>{message}</div>
            )}

            {lastAdded && (
              <div style={{
                marginTop: '1.25rem', background: 'var(--bg3)', borderRadius: 8,
                padding: '1rem 1.25rem', fontSize: '0.72rem',
                color: 'var(--text2)', fontFamily: "'Space Mono', monospace",
              }}>
                <div style={{ color: 'var(--text)', fontWeight: 700, marginBottom: '0.4rem' }}>Last registered:</div>
                <div>{lastAdded.assetName} · #{lastAdded.inscriptionNumber}</div>
                <div style={{ wordBreak: 'break-all', marginTop: '0.25rem' }}>{lastAdded.inscriptionId}</div>
              </div>
            )}

            <div style={{
              marginTop: '1.5rem', padding: '1rem 1.25rem',
              border: '1px dashed var(--border)', borderRadius: 8,
              fontSize: '0.72rem', color: 'var(--text2)', lineHeight: 1.8,
            }}>
              <strong style={{ color: 'var(--text)' }}>Batch tip:</strong> The wallet address stays filled after each submit.
              If multiple cards share the same vault address, just update the name, inscription #, and ID and keep hitting Register.
            </div>
          </>
        )}

        {tab === 'manage' && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
              <input
                type="text" value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                placeholder="Search by name or inscription #"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={loadVaults} style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 7, color: 'var(--text2)', cursor: 'pointer',
                padding: '0.6rem 0.9rem', fontFamily: 'inherit',
                fontSize: '0.72rem', whiteSpace: 'nowrap',
              }}>↻ REFRESH</button>
            </div>

            {loadingVaults ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)', fontSize: '0.82rem' }}>
                Loading…
              </div>
            ) : filteredVaults.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '3rem',
                border: '1px dashed var(--border)', borderRadius: 12,
                color: 'var(--text2)', fontSize: '0.82rem',
              }}>
                {vaults.length === 0 ? 'No vaults registered yet.' : 'No results match your search.'}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text2)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  {filteredVaults.length} RECORD{filteredVaults.length !== 1 ? 'S' : ''}
                </div>
                {filteredVaults.map((vault) => (
                  <div key={vault.id} style={{
                    background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                    borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '0.6rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                    <img
                      src={`https://ordinals.com/content/${vault.inscriptionId}`}
                      alt={vault.assetName}
                      style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: 'var(--bg3)' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                        fontSize: '0.95rem', color: 'var(--text)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{vault.assetName}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontFamily: "'Space Mono', monospace" }}>
                        #{vault.inscriptionNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(vault)}
                      disabled={deleteStatus[vault.id] === 'loading'}
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                        padding: '0.4rem 0.8rem', fontFamily: "'Space Mono', monospace",
                        fontSize: '0.7rem', letterSpacing: '0.05em',
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      {deleteStatus[vault.id] === 'loading' ? 'DELETING…' : 'DELETE ✕'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg3)',
  border: '1px solid var(--border)', borderRadius: 7,
  padding: '0.75rem 1rem', color: 'var(--text)',
  fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', outline: 'none',
};

const btnStyle: React.CSSProperties = {
  background: 'var(--accent)', color: '#000', border: 'none',
  borderRadius: 7, padding: '0.85rem 1.5rem',
  fontFamily: "'Space Mono', monospace", fontWeight: 700,
  fontSize: '0.78rem', letterSpacing: '0.08em', cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.62rem',
  letterSpacing: '0.12em', color: 'var(--text2)', marginBottom: '0.5rem',
};