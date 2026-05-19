'use client';

import { useEffect, useState, useRef } from 'react';

export default function ExitPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !shown.current) {
        shown.current = true;
        setShow(true);
      }
    };

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY < 100 && !shown.current) {
        shown.current = true;
        setShow(true);
      }
      lastScrollY = currentScrollY;
    };

    const timeout = setTimeout(() => {
      if (!shown.current) {
        shown.current = true;
        setShow(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    setSubmitted(true);
    setTimeout(() => setShow(false), 3000);
  };

  const handleClose = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#141b2b',
          border: '1px solid #2e3545',
          borderRadius: '16px',
          maxWidth: '400px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#a78b7d',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            zIndex: 1,
          }}
        >
          ✕
        </button>

        {!submitted ? (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #F97316, #FBBF24)',
              padding: '20px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#552100', fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>
                BEFORE YOU GO!
              </p>
              <p style={{ color: '#552100', fontSize: '22px', fontWeight: '800', margin: 0 }}>
                Upcoming Mega Bundles 🚀
              </p>
            </div>

            <div style={{ padding: '20px' }}>
              <p style={{ color: '#dce2f7', fontSize: '14px', textAlign: 'center', margin: '0 0 16px 0' }}>
                We're launching <strong>new mega bundles every month</strong> with fresh courses, tools, and resources. Be the first to know!
              </p>

              {/* Name input */}
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #2e3545',
                  background: '#0c1322',
                  color: '#dce2f7',
                  fontSize: '14px',
                  marginBottom: '10px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {/* Phone input */}
              <input
                type="tel"
                placeholder="WhatsApp number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #2e3545',
                  background: '#0c1322',
                  color: '#dce2f7',
                  fontSize: '14px',
                  marginBottom: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <button
                onClick={handleSubmit}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(to right, #F97316, #FBBF24)',
                  color: '#552100',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
                }}
              >
                NOTIFY ME FIRST
              </button>

              <p style={{ color: '#a78b7d', fontSize: '11px', textAlign: 'center', margin: '10px 0 0 0' }}>
                Get early access & exclusive offers. No spam, ever.
              </p>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <p style={{ color: '#dce2f7', fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>
              You're On The List!
            </p>
            <p style={{ color: '#a78b7d', fontSize: '14px', margin: 0 }}>
              We'll notify you on WhatsApp about new bundles first.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
