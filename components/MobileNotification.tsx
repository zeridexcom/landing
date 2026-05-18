'use client';

import { useEffect, useState, useRef } from 'react';

const NAMES = [
  'Ramesh K.', 'Suresh M.', 'Amit S.', 'Priya R.', 'Vikram T.',
  'Anjali P.', 'Rajesh G.', 'Deepa N.', 'Karthik V.', 'Meena D.',
  'Arjun B.', 'Lakshmi S.', 'Venkat R.', 'Sita P.', 'Ravi K.',
  'Pooja M.', 'Manoj S.', 'Kavita R.', 'Sanjay L.', 'Anita G.',
];

const CITIES = [
  'Bangalore', 'Hyderabad', 'Delhi', 'Mumbai', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Bhopal', 'Nagpur', 'Indore', 'Patna', 'Vadodara',
];

export default function MobileNotification() {
  const [show, setShow] = useState(false);
  const [person, setPerson] = useState({ name: NAMES[0], city: CITIES[0] });
  const [viewers, setViewers] = useState(187);
  const [isMobile, setIsMobile] = useState(false);
  const idx = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const showNext = () => {
      setPerson({
        name: NAMES[idx.current % NAMES.length],
        city: CITIES[idx.current % CITIES.length],
      });
      setShow(true);
      idx.current++;

      timerRef.current = setTimeout(() => {
        setShow(false);
      }, 3000);
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
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '72px',
        right: '16px',
        background: 'rgba(20, 27, 43, 0.95)',
        border: '1px solid #2e3545',
        padding: '6px 12px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        fontFamily: 'Arial, sans-serif',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#ef4444',
          animation: 'blink 1s infinite',
        }} />
        <span style={{ color: '#dce2f7', fontSize: '13px', fontWeight: '700' }}>{viewers}</span>
        <span style={{ color: '#a78b7d', fontSize: '11px' }}>viewing</span>
      </div>

      <div style={{
        position: 'absolute',
        left: '12px',
        right: '12px',
        bottom: show ? '82px' : '-120px',
        transition: 'bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{
          background: '#191f2f',
          border: '1px solid #2e3545',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.5)',
        }}>
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F97316, #FBBF24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#552100',
              fontWeight: '800',
              fontSize: '13px',
            }}>
              {person.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#dce2f7', fontSize: '13px', fontWeight: '700', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {person.name} from {person.city}
              </p>
              <p style={{ color: '#a78b7d', fontSize: '11px', margin: '1px 0 0 0' }}>just purchased</p>
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '4px 8px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700' }}>✓</span>
            </div>
          </div>
          <div style={{ height: '3px', background: '#0c1322' }}>
            <div style={{ height: '100%', background: 'linear-gradient(to right, #F97316, #FBBF24)', width: show ? '100%' : '0%', transition: 'width 3s linear' }} />
          </div>
        </div>
      </div>

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}