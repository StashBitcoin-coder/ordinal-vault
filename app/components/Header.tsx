'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 1.5rem',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/pocketmountz-logo.jpg"
              alt="Pocket Mountz"
              style={{ height: 40, width: 'auto', borderRadius: 4, display: 'block' }}
            />
            <span style={{
              fontFamily: "Oswald, sans-serif",
              fontWeight: 800,
              fontSize: '1.1rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>
              ORDINAL<span style={{ color: 'var(--accent)' }}>VAULT</span>
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/" style={{
            color: 'var(--text2)', fontSize: '0.75rem',
            letterSpacing: '0.08em', textDecoration: 'none',
          }}>GALLERY</Link>
          <Link href="/guide" style={{
            color: 'var(--text2)', fontSize: '0.75rem',
            letterSpacing: '0.08em', textDecoration: 'none',
          }}>GUIDE</Link>
          <button onClick={toggleTheme} style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text)',
            cursor: 'pointer',
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            fontFamily: 'inherit',
          }}>
            {theme === 'dark' ? '☀ LIGHT' : '☾ DARK'}
          </button>
        </div>
      </div>
    </header>
  );
}
