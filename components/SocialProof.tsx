'use client';

import { useEffect, useState, useRef } from 'react';

const NAMES = [
  'Ramesh K.', 'Suresh M.', 'Amit S.', 'Priya R.', 'Vikram T.',
  'Anjali P.', 'Rajesh G.', 'Deepa N.', 'Karthik V.', 'Meena D.',
  'Arjun B.', 'Lakshmi S.', 'Venkat R.', 'Sita P.', 'Ravi K.',
];

const CITIES = [
  'Bangalore', 'Hyderabad', 'Delhi', 'Mumbai', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

export default function SocialProof() {
  const [show, setShow] = useState(false);
  const [person, setPerson] = useState({ name: '', city: '' });
  const [viewers, setViewers] = useState(187);
  const idx = useRef(0);

  useEffect(() => {
    // Show first notification after 2 seconds
    const firstTimer = setTimeout(() => {
      setPerson({ name: NAMES[0], city: CITIES[0] });
      setShow(true);
      idx.current = 1;

      // Hide after 3 seconds
      setTimeout(() => setShow(false), 3000);
    }, 2000);

    // Then every 5 seconds
    const interval = setInterval(() => {
      setPerson({ name: NAMES[idx.current % NAMES.length], city: CITIES[idx.current % CITIES.length] });
      setShow(true);
      idx.current++;

      setTimeout(() => setShow(false), 3000);
    }, 5000);

    // Update viewer count
    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(142, Math.min(234, prev + change));
      });
    }, 4000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      clearInterval(viewerInterval);
    };
  }, []);

  return (
    <>
      {/* Debug: Always visible test */}
      <div style={{ position: 'fixed', top: '100px', left: '10px', zIndex: 9999, background: 'red', color: 'white', padding: '10px', fontSize: '12px' }}>
        TEST: {show ? 'SHOWING' : 'HIDDEN'} | {person.name}
      </div>

      {/* Mobile notification bar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          zIndex: 55,
          bottom: show ? '84px' : '-100px',
          transition: 'bottom 0.4s ease-out',
          padding: '0 16px',
        }}
      >
        <div style={{
          background: '#232a3a',
          border: '1px solid #2e3545',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
        }}>
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(to right, #F97316, #FBBF24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#552100',
              fontWeight: 'bold',
              fontSize: '14px',
              flexShrink: 0,
            }}>
              {person.name ? person.name.charAt(0) : '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#dce2f7', fontSize: '14px', fontWeight: 'bold', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {person.name} from {person.city}
              </p>
              <p style={{ color: '#a78b7d', fontSize: '12px', margin: '2px 0 0 0' }}>just purchased</p>
            </div>
            <div style={{
              background: 'rgba(34,197,94,0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 'bold' }}>✓ bought</span>
            </div>
          </div>
          <div style={{ height: '4px', background: '#070e1d' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(to right, #F97316, #FBBF24)',
              width: show ? '100%' : '0%',
              transition: show ? 'width 3s linear' : 'none',
            }} />
          </div>
        </div>
      </div>

      {/* Live viewer count */}
      <div style={{
        position: 'fixed',
        top: '72px',
        right: '12px',
        zIndex: 55,
      }}>
        <div style={{
          background: 'rgba(35,42,58,0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #2e3545',
          padding: '6px 12px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <span style={{ position: 'relative', display: 'inline-flex', height: '8px', width: '8px' }}>
            <span style={{
              position: 'absolute',
              display: 'inline-flex',
              height: '100%',
              width: '100%',
              borderRadius: '50%',
              background: '#ef4444',
              opacity: 0.75,
              animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
            }}></span>
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', background: '#ef4444' }}></span>
          </span>
          <span style={{ color: '#dce2f7', fontSize: '12px', fontWeight: 'bold' }}>{viewers}</span>
          <span style={{ color: '#a78b7d', fontSize: '10px' }}>live</span>
        </div>
      </div>

      {/* Ping animation */}
      <style jsx global>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
