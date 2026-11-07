'use client';
import { useState } from 'react';
import Header from '@/app/components/Header';

export default function IntakePage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('https://formspree.io/f/xrppvpbe', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) { setStatus('done'); form.reset(); }
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 7, padding: '0.75rem 1rem', color: 'var(--text)',
    fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', marginTop: '0.4rem',
  };
  const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 100, resize: 'vertical' };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem', letterSpacing: '0.06em',
    color: 'var(--text2)', marginBottom: '0.2rem',
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '0.5rem' }}>
            CLIENT INTAKE
          </div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '0.5rem' }}>
            Website <span style={{ color: 'var(--accent)' }}>Discovery</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>
            Tell us about your project. We'll review your answers before our first call.
          </p>
        </div>

        {status === 'done' ? (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--accent)', borderRadius: 12, padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Received.</div>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>We'll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            <Section label="01 — THE WEBSITE" />

            <Field label="What does the site need to do — sell direct, generate leads, or establish credibility?" name="site_goal" textarea required />
            <Field label="What sites do you love the look and feel of? Share 2–3 examples." name="site_examples" textarea required />

            <Section label="02 — THE GOALS" />

            <Field label="What does success look like 90 days after launch?" name="success_90" textarea required />
            <Field label="What is the #1 action you want a visitor to take?" name="primary_action" required />
            <Field label="What has stopped people from buying so far?" name="buying_barrier" textarea />

            <Section label="03 — THE MARKET" />

            <Field label="Who are the biggest players in the signed sports collectible space right now?" name="competitors" textarea required />
            <Field label="What do they do well that you want to match or beat?" name="competitor_strengths" textarea />
            <Field label="What gap in the market does your product fill that nobody else does?" name="market_gap" textarea required />

            <Section label="04 — THE BUSINESS" />

            <Field label="What is your price point and who is the buyer?" name="price_buyer" required />
            <Field label="Are you selling direct, through retailers, or both?" name="sales_channel" required />
            <Field label="What is your launch timeline and budget?" name="timeline_budget" required />

            <div style={{ marginTop: '0.75rem' }}>
              <label style={labelStyle}>YOUR NAME</label>
              <input name="name" required style={inputStyle} />
            </div>
            <div style={{ marginTop: '0.75rem', marginBottom: '2rem' }}>
              <label style={labelStyle}>YOUR EMAIL</label>
              <input name="email" type="email" required style={inputStyle} />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              style={{ background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', padding: '0.9rem 2rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', opacity: status === 'sending' ? 0.6 : 1 }}
            >
              {status === 'sending' ? 'SENDING…' : 'SUBMIT →'}
            </button>

            {status === 'error' && (
              <p style={{ marginTop: '1rem', color: '#e55', fontSize: '0.8rem' }}>Something went wrong. Try again or email directly.</p>
            )}
          </form>
        )}
      </main>
    </>
  );
}

function Section({ label }: { label: string }) {
  return (
    <div style={{ borderTop: '1px solid var(--border)', margin: '2rem 0 1.25rem', paddingTop: '1.25rem', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--accent)', fontWeight: 700 }}>
      {label}
    </div>
  );
}

function Field({ label, name, textarea, required }: { label: string; name: string; textarea?: boolean; required?: boolean }) {
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 7, padding: '0.75rem 1rem', color: 'var(--text)',
    fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', marginTop: '0.4rem',
  };
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: '0.2rem' }}>
        {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 3 }}>*</span>}
      </label>
      {textarea
        ? <textarea name={name} required={required} style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} />
        : <input name={name} required={required} style={inputStyle} />
      }
    </div>
  );
}
