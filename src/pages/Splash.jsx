import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Shield, Users, ArrowRight } from 'lucide-react';

const TeaLeaf = ({ style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.89L5.71 21l1-2.3A4.49 4.49 0 0 0 8 19C19 19 22 10 22 10S21 8 17 8z" />
  </svg>
);

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="mob-screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Floating leaves */}
      {[
        { l: '6%',  t: '10%', r: 0,   s: 1.0, d: 0   },
        { l: '80%', t: '8%',  r: 30,  s: 0.8, d: 1.2 },
        { l: '15%', t: '75%', r: 15,  s: 0.7, d: 2.0 },
        { l: '75%', t: '70%', r: 50,  s: 0.9, d: 0.8 },
        { l: '45%', t: '88%', r: 320, s: 0.6, d: 1.5 },
        { l: '88%', t: '40%', r: 200, s: 0.75,d: 2.5 },
      ].map((leaf, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: leaf.l, top: leaf.t,
          pointerEvents: 'none',
          color: 'rgba(74,222,128,0.08)',
          transform: `rotate(${leaf.r}deg) scale(${leaf.s})`,
          animation: `floatOrb ${7 + i * 1.2}s ease-in-out ${leaf.d}s infinite`,
        }}>
          <TeaLeaf style={{ width: 56, height: 56 }} />
        </div>
      ))}

      {/* Content */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 32px', width: '100%', maxWidth: 360, position: 'relative', zIndex: 5,
      }}>
        {/* Logo */}
        <div style={{
          width: 90, height: 90,
          background: 'linear-gradient(145deg, #4ade80, #22c55e 50%, #15803d)',
          borderRadius: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 14px 0 #15803d, 0 20px 40px rgba(21,128,61,0.45), inset 0 3px 6px rgba(255,255,255,0.32)',
          marginBottom: 24,
          animation: 'floatOrb 4s ease-in-out infinite',
        }}>
          <Leaf size={42} color="#052e16" strokeWidth={2.5} />
        </div>

        {/* Company name */}
        <h1 style={{
          fontSize: 38, fontWeight: 900, color: 'var(--tx-100)',
          letterSpacing: '-0.03em', textAlign: 'center', lineHeight: 1,
          marginBottom: 8,
        }}>
          Tulip Tea
        </h1>

        <p style={{
          fontSize: 14, color: 'var(--tx-500)', textAlign: 'center',
          lineHeight: 1.5, marginBottom: 10,
        }}>
          Premium Tea Manufacturing &amp; Management
        </p>

        {/* Tagline pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(74,222,128,0.08)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: 99, padding: '5px 14px', marginBottom: 52,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.7)' }} />
          <span style={{ fontSize: 12, color: 'var(--tx-300)', fontWeight: 600, letterSpacing: '0.03em' }}>
            Est. 2019 · Darjeeling, India
          </span>
        </div>

        {/* Portal buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>

          {/* Admin Portal */}
          <button
            onClick={() => navigate('/admin/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '18px 22px',
              background: 'linear-gradient(145deg, #4ade80, #22c55e 60%, #15803d)',
              border: 'none', borderRadius: 20, cursor: 'pointer',
              boxShadow: '0 8px 0 #15803d, 0 12px 28px rgba(21,128,61,0.4), inset 0 2px 5px rgba(255,255,255,0.3)',
              transition: 'transform 0.12s, box-shadow 0.12s',
              fontFamily: 'inherit',
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'translateY(4px)';
              e.currentTarget.style.boxShadow = '0 4px 0 #15803d, 0 6px 14px rgba(21,128,61,0.3), inset 0 2px 5px rgba(255,255,255,0.25)';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 8px 0 #15803d, 0 12px 28px rgba(21,128,61,0.4), inset 0 2px 5px rgba(255,255,255,0.3)';
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: 'rgba(5,46,22,0.25)',
              border: '1px solid rgba(5,46,22,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={22} color="#052e16" strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#052e16', letterSpacing: '-0.01em' }}>
                Admin Portal
              </div>
              <div style={{ fontSize: 12, color: 'rgba(5,46,22,0.65)', marginTop: 2 }}>
                Dashboard · Batches · Users
              </div>
            </div>
            <ArrowRight size={18} color="#052e16" strokeWidth={2.5} />
          </button>

          {/* Employee Portal */}
          <button
            onClick={() => navigate('/employee/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '18px 22px',
              background: 'rgba(10,22,12,0.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: 20, cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(0,0,0,0.04)',
              transition: 'border-color 0.2s, transform 0.12s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.38)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)'}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={22} color="#4ade80" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx-100)', letterSpacing: '-0.01em' }}>
                Employee Portal
              </div>
              <div style={{ fontSize: 12, color: 'var(--tx-500)', marginTop: 2 }}>
                Batches · Sales · Dispatch
              </div>
            </div>
            <ArrowRight size={18} color="var(--tx-500)" />
          </button>
        </div>

        {/* Bottom note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 40 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
          <span style={{ fontSize: 11.5, color: 'var(--tx-700)' }}>Secure enterprise platform</span>
        </div>
      </div>
    </div>
  );
}
