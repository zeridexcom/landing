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

export default function DesktopNotification() {
  const [show, setShow] = useState(false);
  const [person, setPerson] = useState({ name: NAMES[0], city: CITIES[0] });
  const [viewers, setViewers] = useState(187);
  const idx = useRef(0);

  useEffect(() => {
    const showNext = () => {
      setPerson({
        name: NAMES[idx.current % NAMES.length],
        city: CITIES[idx.current % CITIES.length],
      });
      setShow(true);
      idx.current++;

      setTimeout(() => setShow(false), 3000);
    };

    const firstTimer = setTimeout(showNext, 2000);
    const interval = setInterval(showNext, 5000);

    const viewerTimer = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(142, Math.min(234, prev + change));
      });
    }, 4000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      clearInterval(viewerTimer);
    };
  }, []);

  return (
    <div className="hidden md:block">
      {/* Viewer count - top right */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 100,
        }}
      >
        <div
          style={{
            background: 'rgba(20, 27, 43, 0.95)',
            border: '1px solid #2e3545',
            padding: '8px 16px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
              animation: 'blink 1s infinite',
            }}
          />
          <span style={{ color: '#dce2f7', fontSize: '14px', fontWeight: '700' }}>
            {viewers}
          </span>
          <span style={{ color: '#a78b7d', fontSize: '12px' }}>viewing now</span>
        </div>
      </div>

      {/* Notification - bottom left */}
      <div
        style={{
          position: 'fixed',
          left: '24px',
          bottom: show ? '24px' : '-120px',
          zIndex: 100,
          maxWidth: '340px',
          transition: 'bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            background: '#191f2f',
            border: '1px solid #2e3545',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F97316, #FBBF24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#552100',
                fontWeight: '800',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              {person.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#dce2f7', fontSize: '14px', fontWeight: '700', margin: 0 }}>
                {person.name}
              </p>
              <p style={{ color: '#a78b7d', fontSize: '12px', margin: '2px 0 0 0' }}>
                from {person.city} · just now
              </p>
            </div>
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                padding: '6px 12px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: '700' }}>
                purchased
              </span>
            </div>
          </div>

          <div style={{ height: '4px', background: '#0c1322' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(to right, #F97316, #FBBF24)',
                width: show ? '100%' : '0%',
                transition: show ? 'width 3s linear' : 'none',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
