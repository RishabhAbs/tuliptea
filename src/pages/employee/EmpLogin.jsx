import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Lock, Mail, Users, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const TeaLeaf = ({ style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.89L5.71 21l1-2.3A4.49 4.49 0 0 0 8 19C19 19 22 10 22 10S21 8 17 8z" />
  </svg>
);

export default function EmpLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    navigate('/employee/batches');
  };

  return (
    <div className="mob-screen" style={{ justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
      {/* Background */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Floating leaves */}
      {[
        { l: '8%',  t: '12%', r: 0,   s: 0.9, d: 0   },
        { l: '78%', t: '8%',  r: 30,  s: 0.7, d: 1.2 },
        { l: '82%', t: '65%', r: 50,  s: 0.85,d: 0.8 },
        { l: '12%', t: '72%', r: 15,  s: 0.65,d: 2.0 },
      ].map((leaf, i) => (
        <div key={i} style={{
          position: 'fixed', left: leaf.l, top: leaf.t,
          pointerEvents: 'none', color: 'rgba(74,222,128,0.07)',
          transform: `rotate(${leaf.r}deg) scale(${leaf.s})`,
          animation: `floatOrb ${7 + i * 1.3}s ease-in-out ${leaf.d}s infinite`,
        }}>
          <TeaLeaf style={{ width: 52, height: 52 }} />
        </div>
      ))}

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', top: 20, left: 20, zIndex: 20,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(10,22,12,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: 12, padding: '8px 14px',
          color: 'var(--tx-500)', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.18s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--tx-300)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--tx-500)'}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Card */}
      <div
        className="glass-card fade-in-up"
        style={{ width: '100%', maxWidth: 400, padding: '44px 36px', position: 'relative', zIndex: 10 }}
      >
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)',
          borderRadius: '0 0 2px 2px',
        }} />

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 68, height: 68,
            background: 'linear-gradient(145deg, #4ade80, #22c55e 50%, #15803d)',
            borderRadius: 22, marginBottom: 16,
            boxShadow: '0 10px 0 #15803d, 0 14px 28px rgba(21,128,61,0.42), inset 0 2px 5px rgba(255,255,255,0.32)',
          }}>
            <Leaf size={32} color="#052e16" strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--tx-100)', letterSpacing: '-0.025em', marginBottom: 8 }}>
            Tulip Tea
          </h1>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(145deg, rgba(74,222,128,0.12), rgba(34,197,94,0.07))',
            border: '1px solid rgba(74,222,128,0.22)',
            borderRadius: 99, padding: '5px 14px',
          }}>
            <Users size={11} color="#4ade80" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em' }}>
              EMPLOYEE PORTAL
            </span>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--tx-500)', fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>
          Sign in to manage your tea batches
        </p>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(248,113,113,0.09)', border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 12, padding: '10px 14px', marginBottom: 18,
          }}>
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
            <input
              type="email" className="glass-input"
              placeholder="Employee email"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <div style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx-500)', pointerEvents: 'none' }}>
              <Lock size={15} />
            </div>
            <input
              type={showPass ? 'text' : 'password'} className="glass-input"
              placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: 46 }} autoComplete="current-password"
            />
            <button
              type="button" onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-500)', padding: 4, display: 'flex', alignItems: 'center' }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--tx-500)' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: '#22c55e', width: 14, height: 14 }} />
              Remember me
            </label>
            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: 'var(--tx-300)', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className="clay-btn" disabled={loading}>
            {loading ? (
              <>
                <div style={{ width: 15, height: 15, border: '2px solid rgba(5,46,22,0.25)', borderTop: '2px solid #052e16', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                Signing in...
              </>
            ) : (
              <>
                <Users size={15} />
                Sign In
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px rgba(74,222,128,0.7)', animation: 'pulse-glow 2.5s ease-in-out infinite' }} />
          <span style={{ fontSize: 12, color: 'var(--tx-700)' }}>Secure employee access</span>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: 16, padding: '9px 14px', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: 12, textAlign: 'center' }}>
          <span style={{ fontSize: 11.5, color: 'var(--tx-700)' }}>Demo: any email + password to proceed</span>
        </div>
      </div>
    </div>
  );
}
