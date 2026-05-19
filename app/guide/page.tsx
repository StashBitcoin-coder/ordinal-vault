'use client';
import Header from '@/app/components/Header';
import Link from 'next/link';

const ACCENT = 'var(--accent)';

export default function GuidePage() {
  return (
    <>
      <Header />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem 7rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.2em',
            color: ACCENT, marginBottom: '0.75rem',
          }}>
            COLLECTOR GUIDE
          </div>
          <h1 style={{
            fontFamily: "Oswald, sans-serif", fontWeight: 800,
            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
            letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            How to Verify &<br />
            <span style={{ color: ACCENT }}>Resell Your Ordinal</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.8 }}>
            This guide covers two things every collector should know:
            how to check whether an ordinal has moved out of the wallet it was minted in,
            and how to list it for sale on the three major Bitcoin ordinal marketplaces. T
            The private key embedded in the art gives one control of the Ordinal. 
          </p>
        </div>

        {/* ── SECTION 1: Verify Movement ── */}
        <Section
          number="01"
          title="Has My Ordinal Moved?"
          subtitle="How to check if the Ordinal is still in its original wallet"
        >
          <StepCard step={1} title="Find the inscription on Ordinals.com">
            <p style={bodyText}>
              Click the link to Ordinals.com in the popup. Then check if the wallet matches
              the one listed on this site. If it is the same listed here the Ordinal has not
              moved and is most likely still vaulted inside the original collectable fine art
              trading card.
            </p>
          </StepCard>

          <StepCard step={2} title="Cross-check on a marketplace">
            <p style={bodyText}>
              For a second confirmation, search the Inscription ID - not the Inscription number - on any of the three marketplaces
              below. The listing page will show the current holder's wallet address and full
              transfer history.
            </p>
            <MarketplaceChip name="Gamma" url="https://gamma.io" note="Ownership tab" />
            <MarketplaceChip name="UniSat" url="https://unisat.io" note="History tab" />
            <MarketplaceChip name="Ordinals Wallet" url="https://ordinalswallet.com" note="Activity tab" />
          </StepCard>

          <InfoBox title="What does 'swept the vault' mean?">
            If a collector moves an Ordinal from one wallet to another, that's called sweeping
            the vault. The Ordinal still exists. It just lives at a new wallet address. The
            registry here reflects the original wallet address where the Ordinal was minted. Always use
            Ordinals.com as the source of truth for current location.
          </InfoBox>
        </Section>

        <Divider />

        {/* ── SECTION 2: Resell ── */}
        <Section
          number="02"
          title="How to Resell Your Ordinal"
          subtitle="Listing on Gamma, UniSat, and Ordinals Wallet"
        >
          <p style={bodyText}>
            To sell an ordinal you must control the wallet that holds it — meaning you have the
            private key or seed phrase. If the ordinal is in a vault you own, follow these steps
            for each marketplace.
          </p>

          <InfoBox title="Before you list — things to know">
            Bitcoin ordinal marketplaces work differently from Ethereum NFT platforms. You connect
            a Bitcoin-native wallet (not MetaMask). The three most widely used are{' '}
            <ExternalLink href="https://unisat.io">UniSat</ExternalLink>,{' '}
            <ExternalLink href="https://www.xverse.app">Xverse</ExternalLink>, and{' '}
            <ExternalLink href="https://leather.io">Leather (formerly Hiro)</ExternalLink>.
            Have one installed and funded with a small amount of BTC to cover network fees before listing.
          </InfoBox>

          {/* Gamma */}
          <MarketplaceSection
            name="Gamma"
            url="https://gamma.io"
            color="#9945FF"
            steps={[
              'Go to gamma.io and click Connect Wallet (top right). Choose UniSat, Xverse, or Leather.',
              'Once connected, click your profile icon → My Ordinals. Your inscriptions will appear.',
              'Click the ordinal you want to sell → List for Sale.',
              'Enter your asking price in BTC and set the expiry. Gamma takes a 2% marketplace fee.',
              'Sign the listing transaction in your wallet. The ordinal is now publicly listed.',
              'To delist or update price, go back to My Ordinals → Manage Listing.',
            ]}
            tip="Gamma has the largest buyer base for art-focused ordinals and supports collection pages — good for visibility."
          />

          {/* UniSat */}
          <MarketplaceSection
            name="UniSat"
            url="https://unisat.io"
            color="#F7931A"
            steps={[
              'Install the UniSat browser extension from unisat.io or the Chrome Web Store.',
              'Create or import your wallet using your seed phrase. Ensure your ordinal is in this wallet.',
              'Go to unisat.io → Marketplace → My Assets.',
              'Find your inscription and click List.',
              'Set your price in sats (satoshis). UniSat charges a 2.5% service fee on sale.',
              'Confirm the listing signature. Your ordinal is live on the market.',
            ]}
            tip="UniSat is the most widely used Bitcoin wallet + marketplace combo. High liquidity and active buyers."
          />

          {/* Ordinals Wallet */}
          <MarketplaceSection
            name="Ordinals Wallet"
            url="https://ordinalswallet.com"
            color="#22c55e"
            steps={[
              'Go to ordinalswallet.com and click Connect. Supports UniSat, Xverse, and Leather wallets.',
              'Navigate to Profile → My Inscriptions.',
              'Select the inscription you want to list → click List for Sale.',
              'Enter price in BTC. Ordinals Wallet charges a 2% fee on sale.',
              'Approve the signature request in your wallet.',
              'Your listing is live. You can update or cancel from your profile at any time.',
            ]}
            tip="Ordinals Wallet has a clean collector-friendly UI and strong search — good for buyers browsing by collection."
          />

          <InfoBox title="Selling tips">
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 2, color: 'var(--text2)', fontSize: '0.82rem' }}>
              <li>List on all three platforms simultaneously — each has different buyer pools.</li>
              <li>Include the inscription number and this registry URL in your listing description for provenance.</li>
              <li>Network (miner) fees vary — list when Bitcoin fees are low (check mempool.space).</li>
              <li>Once sold, the marketplace handles the transfer automatically. No manual sending needed.</li>
            </ul>
          </InfoBox>
        </Section>

        <Divider />

        {/* Back links */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <Link href="/" style={{ fontSize: '0.78rem', color: ACCENT, letterSpacing: '0.06em' }}>
            ← Gallery
          </Link>
        </div>

      </main>
    </>
  );
}

// ── Sub-components ──

function Section({ number, title, subtitle, children }: {
  number: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.7rem', color: ACCENT, letterSpacing: '0.1em',
        }}>{number}</span>
        <h2 style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 800,
          fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--text)',
        }}>{title}</h2>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '1.75rem' }}>{subtitle}</p>
      {children}
    </section>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderRadius: 10, padding: '1.25rem', marginBottom: '1rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: ACCENT, color: '#000',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "Oswald, sans-serif", fontWeight: 800, fontSize: '0.78rem',
          flexShrink: 0,
        }}>{step}</div>
        <h3 style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700,
          fontSize: '0.95rem', color: 'var(--text)',
        }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MarketplaceSection({ name, url, color, steps, tip }: {
  name: string; url: string; color: string; steps: string[]; tip: string;
}) {
  return (
    <div style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderRadius: 12, overflow: 'hidden', marginBottom: '1.25rem',
    }}>
      {/* Header bar */}
      <div style={{
        background: `${color}18`, borderBottom: `1px solid ${color}33`,
        padding: '0.9rem 1.25rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 800,
          fontSize: '1rem', color: color,
        }}>{name}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{
          fontSize: '0.65rem', color: color, letterSpacing: '0.08em', textDecoration: 'none',
        }}>
          {url.replace('https://', '')} ↗
        </a>
      </div>
      {/* Steps */}
      <div style={{ padding: '1.25rem' }}>
        <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
          {steps.map((s, i) => (
            <li key={i} style={{
              fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.75,
              marginBottom: i < steps.length - 1 ? '0.4rem' : 0,
            }}>{s}</li>
          ))}
        </ol>
        <div style={{
          marginTop: '1rem', background: 'var(--bg3)',
          borderRadius: 7, padding: '0.65rem 0.9rem',
          fontSize: '0.75rem', color: 'var(--text2)', lineHeight: 1.6,
          borderLeft: `3px solid ${color}`,
        }}>
          <strong style={{ color: 'var(--text)' }}>Tip: </strong>{tip}
        </div>
      </div>
    </div>
  );
}

function MarketplaceChip({ name, url, note }: { name: string; url: string; note: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      border: '1px solid var(--border)', borderRadius: 6,
      padding: '0.4rem 0.8rem', textDecoration: 'none',
      fontSize: '0.72rem', color: 'var(--text2)',
      marginRight: '0.5rem', marginBottom: '0.5rem',
    }}>
      <span style={{ color: 'var(--text)' }}>{name}</span>
      <span>·</span>
      <span>{note}</span>
      <span style={{ color: ACCENT }}>↗</span>
    </a>
  );
}

function Callout({ type, children }: { type: 'success' | 'warning'; children: React.ReactNode }) {
  const colors = {
    success: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', text: '#22c55e' },
    warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
  }[type];
  return (
    <div style={{
      background: colors.bg, border: `1px solid ${colors.border}`,
      borderRadius: 7, padding: '0.75rem 1rem',
      fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.6,
      marginTop: '0.75rem',
    }}>
      {children}
    </div>
  );
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px dashed var(--border)',
      borderRadius: 10, padding: '1.25rem', marginTop: '1.25rem',
    }}>
      <div style={{
        fontFamily: "Oswald, sans-serif", fontWeight: 700,
        fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.6rem',
      }}>
        ⓘ {title}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />;
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color: ACCENT, textDecoration: 'none' }}>
      {children}
    </a>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.78em',
      background: 'var(--bg3)',
      padding: '0.1em 0.4em',
      borderRadius: 4,
      color: 'var(--text)',
    }}>{children}</code>
  );
}

const bodyText: React.CSSProperties = {
  fontSize: '0.84rem',
  color: 'var(--text2)',
  lineHeight: 1.8,
  marginBottom: '0.75rem',
};
