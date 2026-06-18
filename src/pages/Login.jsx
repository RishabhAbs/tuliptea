import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';


const TeaLeaf = ({ style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.89L5.71 21l1-2.3A4.49 4.49 0 0 0 8 19C19 19 22 10 22 10S21 8 17 8z" />
  </svg>
);

export default function Login() {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [installEvt,  setInstallEvt]  = useState(null);
  const [installed,   setInstalled]   = useState(false);
  const navigate = useNavigate();
  const { setEmployee } = useApp();

  useEffect(() => {
    const handler = e => { e.preventDefault(); setInstallEvt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    const { outcome } = await installEvt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setInstallEvt(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        return;
      }
      setEmployee({ id: data.id, name: data.name, email: data.email, initials: data.initials, role: data.role });
      navigate(data.role === 'admin' ? '/dashboard' : '/employee/batches');
    } catch {
      setError('Cannot reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mob-screen" style={{ justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Floating leaves */}
      {[
        { l: '5%',  t: '10%', r: 0,   s: 0.9, d: 0,   c: 'rgba(240,68,56,0.09)'  },
        { l: '78%', t: '8%',  r: 25,  s: 0.75,d: 1.2, c: 'rgba(255,190,11,0.08)'  },
        { l: '12%', t: '72%', r: 15,  s: 0.65,d: 2.0, c: 'rgba(240,68,56,0.07)'   },
        { l: '80%', t: '65%', r: 45,  s: 0.8, d: 0.8, c: 'rgba(255,190,11,0.07)'  },
        { l: '45%', t: '88%', r: 320, s: 0.55,d: 1.5, c: 'rgba(240,68,56,0.06)'   },
      ].map((leaf, i) => (
        <div key={i} style={{
          position: 'fixed', left: leaf.l, top: leaf.t, pointerEvents: 'none',
          color: leaf.c,
          transform: `rotate(${leaf.r}deg) scale(${leaf.s})`,
          animation: `floatOrb ${7 + i * 1.2}s ease-in-out ${leaf.d}s infinite`,
        }}>
          <TeaLeaf style={{ width: 52, height: 52 }} />
        </div>
      ))}

      <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: 400, padding: '44px 36px', position: 'relative', zIndex: 10 }}>
        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.45), transparent)', borderRadius: '0 0 2px 2px' }} />

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <img src="/logo.png" alt="ABS Logo" style={{ width: 90, height: 'auto', objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.025em', marginBottom: 6 }}>
            Tulip Tea
          </h1>
          <p style={{ fontSize: 13, color: 'var(--tx-500)', lineHeight: 1.4 }}>
            Sign in to access your portal
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 18 }}>
            <AlertCircle size={14} color="#f87171" />
            <span style={{ fontSize: 13, color: '#f87171' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <div style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-500)', pointerEvents: 'none' }}>
              <Mail size={15} />
            </div>
            <input type="email" className="glass-input" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <div style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-500)', pointerEvents: 'none' }}>
              <Lock size={15} />
            </div>
            <input type={showPass ? 'text' : 'password'} className="glass-input" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: 46 }} autoComplete="current-password" />
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-500)', padding: 4, display: 'flex', alignItems: 'center' }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button type="submit" className="clay-btn" disabled={loading}>
            {loading ? (
              <>
                <div style={{ width: 15, height: 15, border: '2px solid rgba(5,46,22,0.25)', borderTop: '2px solid #052e16', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                Signing in…
              </>
            ) : (
              <> Sign In <ArrowRight size={15} /> </>
            )}
          </button>
        </form>

        {/* PWA Install button */}
        {!installed && installEvt && (
          <button onClick={handleInstall} style={{
            marginTop: 22, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 9, padding: '13px 16px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 14, fontWeight: 700, border: '1.5px solid rgba(240,68,56,0.25)',
            background: 'rgba(240,68,56,0.06)', color: '#F04438', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,68,56,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,68,56,0.06)'}
          >
            <Download size={15} /> Install App
          </button>
        )}
        {installed && (
          <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: '#4ade80', fontWeight: 600 }}>
            ✓ App installed successfully
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFBE0B', boxShadow: '0 0 10px rgba(255,190,11,0.7)' }} />
          <span style={{ fontSize: 11.5, color: 'var(--tx-700)' }}>Enterprise-grade security</span>
        </div>
      </div>
    </div>
  );
}
