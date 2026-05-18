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

export default function Notification() {
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
    <div style={{ all: 'revert' }}>
      <style>{`
        .notif-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: 999999 !important;
          pointer-events: none !important;
          font-family: Arial, sans-serif !important;
        }
        .notif-viewer {
          position: fixed !important;
          top: 80px !important;
          right: 24px !important;
          background: rgba(20, 27, 43, 0.95) !important;
          border: 1px solid #2e3545 !important;
          padding: 8px 16px !important;
          border-radius: 24px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
        }
        .notif-popup {
          position: fixed !important;
          left: 24px !important;
          bottom: -120px !important;
          z-index: 999999 !important;
          max-width: 340px !important;
          transition: bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .notif-popup-show {
          bottom: 24px !important;
        }
        .notif-card {
          background: #191f2f !important;
          border: 1px solid #2e3545 !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.6) !important;
        }
        .notif-inner {
          padding: 16px !important;
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .notif-avatar {
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #F97316, #FBBF24) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #552100 !important;
          font-weight: 800 !important;
          font-size: 16px !important;
          flex-shrink: 0 !important;
        }
        .notif-text {
          flex: 1 !important;
          min-width: 0 !important;
        }
        .notif-name {
          color: #dce2f7 !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          margin: 0 !important;
        }
        .notif-sub {
          color: #a78b7d !important;
          font-size: 12px !important;
          margin: 2px 0 0 0 !important;
        }
        .notif-badge {
          background: rgba(34, 197, 94, 0.15) !important;
          padding: 6px 12px !important;
          border-radius: 20px !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
          flex-shrink: 0 !important;
        }
        .notif-badge-dot {
          width: 6px !important;
          height: 6px !important;
          border-radius: 50% !important;
          background: #22c55e !important;
        }
        .notif-badge-text {
          color: #4ade80 !important;
          font-size: 12px !important;
          font-weight: 700 !important;
        }
        .notif-bar {
          height: 4px !important;
          background: #0c1322 !important;
        }
        .notif-progress {
          height: 100% !important;
          background: linear-gradient(to right, #F97316, #FBBF24) !important;
          transition: width 3s linear !important;
        }
        .notif-viewer-dot {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #ef4444 !important;
          animation: notif-blink 1s infinite !important;
        }
        .notif-viewer-text {
          color: #dce2f7 !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          margin: 0 !important;
        }
        .notif-viewer-label {
          color: #a78b7d !important;
          font-size: 12px !important;
          margin: 0 !important;
        }
        @keyframes notif-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 767px) {
          .notif-container { display: block !important; }
          .notif-viewer {
            top: 72px !important;
            right: 16px !important;
            padding: 6px 12px !important;
            border-radius: 20px !important;
            gap: 6px !important;
          }
          .notif-viewer-text { font-size: 13px !important; }
          .notif-viewer-label { font-size: 11px !important; }
          .notif-viewer-dot { width: 6px !important; height: 6px !important; }
          .notif-popup {
            left: 12px !important;
            right: 12px !important;
            max-width: none !important;
            bottom: -120px !important;
          }
          .notif-popup-show {
            bottom: 82px !important;
          }
          .notif-card { border-radius: 12px !important; }
          .notif-inner { padding: 10px 14px !important; gap: 10px !important; }
          .notif-avatar { width: 34px !important; height: 34px !important; font-size: 13px !important; }
          .notif-name { font-size: 13px !important; }
          .notif-sub { font-size: 11px !important; }
          .notif-badge { padding: 4px 8px !important; border-radius: 16px !important; gap: 4px !important; }
          .notif-badge-dot { width: 5px !important; height: 5px !important; }
          .notif-badge-text { font-size: 11px !important; }
          .notif-bar { height: 3px !important; }
        }
      `}</style>
      
      <div className="notif-container">
        <div className="notif-viewer">
          <span className="notif-viewer-dot"></span>
          <span className="notif-viewer-text">{viewers}</span>
          <span className="notif-viewer-label">viewing now</span>
        </div>

        <div className={"notif-popup" + (show ? " notif-popup-show" : "")}>
          <div className="notif-card">
            <div className="notif-inner">
              <div className="notif-avatar">{person.name.charAt(0)}</div>
              <div className="notif-text">
                <p className="notif-name">{person.name}</p>
                <p className="notif-sub">from {person.city} · just now</p>
              </div>
              <div className="notif-badge">
                <span className="notif-badge-dot"></span>
                <span className="notif-badge-text">purchased</span>
              </div>
            </div>
            <div className="notif-bar">
              <div className="notif-progress" style={{ width: show ? '100%' : '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}