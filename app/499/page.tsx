'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileNotification from '@/components/MobileNotification';
import DesktopNotification from '@/components/DesktopNotification';
import ExitPopup from '@/components/ExitPopup';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CountdownTimer() {
  const [time, setTime] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <span className="text-urgency-red font-bold font-label-bold text-label-bold">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}

const courseItems = [
  'Canva Templates',
  'Faceless Reusable Instagram Reels',
  'Resume Templates',
  'Social Media Post Templates',
  'Business Document Templates',
  'Video Editing Presets',
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Freelance Designer',
    city: 'Mumbai',
    text: 'The Canva templates alone saved me hours of work. I now deliver designs to clients 3x faster!',
    earning: '₹45,000/month',
  },
  {
    name: 'Priya Patel',
    role: 'College Student',
    city: 'Delhi',
    text: 'Started my Instagram page using the faceless reels. Already at 10K followers in 2 months!',
    earning: '₹15,000/month',
  },
  {
    name: 'Amit Kumar',
    role: 'Content Creator',
    city: 'Bangalore',
    text: 'The resume templates helped me land my dream job. Best ₹499 I ever spent.',
    earning: '₹8 LPA Job',
  },
  {
    name: 'Sneha Reddy',
    role: 'Digital Marketer',
    city: 'Hyderabad',
    text: 'Using these templates for my clients. The ROI is insane. Everyone should get this bundle.',
    earning: '₹35,000/month',
  },
  {
    name: 'Vikash Singh',
    role: 'Small Business Owner',
    city: 'Jaipur',
    text: 'My social media presence transformed completely. Customers take us seriously now.',
    earning: '₹2,00,000/month',
  },
  {
    name: 'Anjali Menon',
    role: 'Housewife turned Freelancer',
    city: 'Kochi',
    text: 'Started freelancing from home using these templates. Now earning more than my previous job!',
    earning: '₹50,000/month',
  },
];

export default function MegaBonusBundle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [time, setTime] = useState(299);
  const [spotsLeft, setSpotsLeft] = useState(12);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  useEffect(() => {
    setSpotsLeft(Math.floor(Math.random() * 15) + 5);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = 'https://edufast.in';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handlePayment = async () => {
    setLoading(true);

    try {
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 49900, currency: 'INR', email: email || '' }),
      });

      const { orderId } = await orderResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 49900,
        currency: 'INR',
        name: 'Edufast',
        description: 'Mega Bonus Bundle - Canva, Reels, Resume Templates & More',
        order_id: orderId,
        handler: async (response: any) => {
          setPaymentData(response);
          setShowEmailPopup(true);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        prefill: email ? { email } : undefined,
        theme: { color: '#F97316' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;

    setLoading(true);

    try {
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...paymentData, email }),
      });

      const result = await verifyResponse.json();

      if (result.success) {
        setPaymentStatus('success');
        setTimeout(() => router.push('/success'), 2000);
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Verify error:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-lg shadow-xl hidden md:flex flex justify-between items-center px-gutter w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Edufast" className="h-10 w-auto" />
          <h1 className="font-display-xl text-primary font-extrabold tracking-tighter text-headline-lg-mobile md:text-headline-lg">Edufast</h1>
        </div>
        <div className="flex items-center gap-2">
          <CountdownTimer />
        </div>
      </header>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 w-full z-50 h-16 bg-surface/90 backdrop-blur-md shadow-md md:hidden flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Edufast" className="h-8 w-auto" />
          <span className="font-display-xl text-primary font-extrabold tracking-tighter text-headline-lg-mobile">Edufast</span>
        </div>
        <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full border border-urgency-red/30">
          <span className="material-symbols-outlined text-urgency-red text-sm">timer</span>
          <span className="text-urgency-red font-bold font-label-bold text-label-bold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <main className="w-full max-w-container-max mx-auto pt-20 md:pt-24 px-gutter flex flex-col gap-stack-gap">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-6 mt-4">
          <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
            <img
              alt="Edufast - Mega Bonus Bundle"
              className="w-full h-auto object-cover aspect-video"
              src="/499-hero.jpeg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span>Home</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span>E-Learning</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary">Mega Bonus Bundle</span>
          </div>

          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Mega Bonus Bundle
          </h2>

          {/* Course Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-on-surface-variant text-sm">
            <span className="bg-primary-container/20 text-primary-container px-3 py-1 rounded-full font-label-bold">GradFast</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span>20 hours</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">signal_cellular_alt</span>
              <span>Intermediate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">category</span>
              <span>business</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant line-through text-xl opacity-60">₹624</span>
            <span className="font-price-display text-price-display text-primary-container">₹499</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || paymentStatus === 'success'}
            className="buy-button w-full md:w-auto min-h-[56px] px-8 py-4 bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end rounded-full font-label-bold text-label-bold text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-[0_4px_14px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {loading ? 'Processing...' : 'Buy for ₹499'}
          </button>
          {paymentStatus === 'success' && (
            <div className="w-full md:w-auto px-4 py-3 rounded-lg bg-green-600 text-white text-center font-semibold">
              ✓ Payment Successful! Redirecting...
            </div>
          )}
          {paymentStatus === 'failed' && (
            <div className="w-full md:w-auto px-4 py-3 rounded-lg bg-red-600 text-white text-center font-semibold">
              ✕ Payment Failed. Please try again.
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-on-surface-variant text-xs">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-green-500">lock</span>
              <span>Secure Razorpay Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-green-500">bolt</span>
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-green-500">devices</span>
              <span>Learn Anywhere</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-green-500">workspace_premium</span>
              <span>Certificate of Completion</span>
            </div>
          </div>

          <p className="text-urgency-red font-bold text-sm animate-pulse" suppressHydrationWarning>Only {spotsLeft} spots left at this price!</p>
        </section>

        {/* About This Course */}
        <section className="mt-8 p-8 bg-surface-container-low rounded-2xl border border-surface-container-high">
          <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6">
            About This Course
          </h3>
          <p className="text-on-surface-variant font-body-lg mb-6">
            Mega Course Bundle with:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface-dark p-4 rounded-xl border border-surface-container-high">
                <div className="bg-primary-container/20 p-2 rounded-full text-primary-container">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <span className="text-on-surface font-body-md">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Course Materials Section */}
        <section className="mt-8 p-8 bg-surface-container-low rounded-2xl border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-urgency-red text-white px-4 py-1 rounded-bl-xl font-label-bold text-label-bold animate-pulse">
            LIMITED TIME
          </div>
          <div className="text-center mb-6">
            <span className="material-symbols-outlined text-primary text-5xl mb-3">folder_open</span>
            <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              Course Materials & Files
            </h3>
            <p className="text-on-surface-variant font-body-lg">Enroll to access all course materials</p>
          </div>
          <p className="text-on-surface-variant font-body-md text-center mb-6">
            Get full lifetime access to downloadable resources, assignments, and exclusive files when you purchase this course.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-on-surface-variant line-through text-xl opacity-60">₹624</span>
            <span className="font-price-display text-price-display text-gold-gradient-start">₹499</span>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="buy-button w-full md:w-auto min-h-[56px] px-8 py-4 bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end rounded-full font-label-bold text-label-bold text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-[0_4px_14px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">bolt</span>
              {loading ? 'Processing...' : 'Buy for ₹499'}
            </button>
          </div>
          <p className="font-body-md text-body-md text-urgency-red mt-4 text-center">Hurry! Offer ends in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-surface-dark p-6 rounded-xl flex items-start gap-4 shadow-lg border border-surface-container-high">
            <div className="bg-primary-container/20 p-3 rounded-full text-primary-container">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface mb-1">100% Authentic Content</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Carefully curated and verified by industry experts.</p>
            </div>
          </div>
          <div className="bg-surface-dark p-6 rounded-xl flex items-start gap-4 shadow-lg border border-surface-container-high">
            <div className="bg-primary-container/20 p-3 rounded-full text-primary-container">
              <span className="material-symbols-outlined">all_inclusive</span>
            </div>
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface mb-1">Lifetime Access</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Pay once, access forever. No recurring fees.</p>
            </div>
          </div>
          <div className="bg-surface-dark p-6 rounded-xl flex items-start gap-4 shadow-lg border border-surface-container-high">
            <div className="bg-primary-container/20 p-3 rounded-full text-primary-container">
              <span className="material-symbols-outlined">devices</span>
            </div>
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface mb-1">Instant Access on All Devices</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Learn anytime, anywhere on mobile, tablet, or desktop.</p>
            </div>
          </div>
          <div className="bg-surface-dark p-6 rounded-xl flex items-start gap-4 shadow-lg border border-surface-container-high">
            <div className="bg-primary-container/20 p-3 rounded-full text-primary-container">
              <span className="material-symbols-outlined">lock</span>
            </div>
            <div>
              <h3 className="font-label-bold text-label-bold text-on-surface mb-1">Secure Razorpay Payment</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">100% safe and encrypted transaction process.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-8">
          <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface text-center mb-8">
            What Our Students Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface-dark p-6 rounded-xl border border-surface-container-high">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end flex items-center justify-center text-on-primary font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-on-surface font-bold text-sm">{t.name}</p>
                    <p className="text-on-surface-variant text-xs">{t.role} &bull; {t.city}</p>
                  </div>
                </div>
                <p className="text-on-surface-variant font-body-md text-sm mb-3">&ldquo;{t.text}&rdquo;</p>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 inline-block">
                  <span className="text-green-500 font-bold text-sm">Now earning: {t.earning}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="mt-8 p-8 bg-surface-container-low rounded-2xl border border-surface-container-high">
          <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface text-center mb-8">
            100% Safe & Secure
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">shield</span>
              <p className="text-on-surface font-bold text-sm">SSL Encrypted</p>
              <p className="text-on-surface-variant text-xs">256-bit security</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">verified_user</span>
              <p className="text-on-surface font-bold text-sm">Razorpay Secured</p>
              <p className="text-on-surface-variant text-xs">PCI DSS compliant</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">replay</span>
              <p className="text-on-surface font-bold text-sm">7-Day Refund</p>
              <p className="text-on-surface-variant text-xs">No questions asked</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">support_agent</span>
              <p className="text-on-surface font-bold text-sm">24/7 Support</p>
              <p className="text-on-surface-variant text-xs">Always here to help</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">lock</span>
              <span className="text-on-surface-variant text-xs font-bold">256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
              <span className="text-on-surface-variant text-xs font-bold">Visa</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
              <span className="text-on-surface-variant text-xs font-bold">Mastercard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
              <span className="text-on-surface-variant text-xs font-bold">UPI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">account_balance_wallet</span>
              <span className="text-on-surface-variant text-xs font-bold">Net Banking</span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-8 mb-8 text-center">
          <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
            Don't Miss This Opportunity
          </h3>
          <p className="text-on-surface-variant font-body-lg mb-6">
            Join thousands of students who are already building their careers with this bundle. This offer won't last forever.
          </p>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="buy-button w-full md:w-auto min-h-[56px] px-12 py-4 bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end rounded-full font-label-bold text-label-bold text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-[0_4px_14px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            {loading ? 'Processing...' : 'GET INSTANT ACCESS - ₹499'}
          </button>
        </section>
      </main>

      {/* Live Notifications */}
      <MobileNotification />
      <DesktopNotification />

      {/* Exit Intent Popup */}
      <ExitPopup />

      {/* Email Popup Modal — shown AFTER payment */}
      {showEmailPopup && (
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
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
          }}
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
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              padding: '20px',
              textAlign: 'center',
            }}>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0' }}>
                PAYMENT SUCCESSFUL!
              </p>
              <p style={{ color: '#fff', fontSize: '20px', fontWeight: '800', margin: 0 }}>
                Get Your Course Access
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
              {/* Warning */}
              <div style={{
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#f97316', fontSize: '20px' }}>mail</span>
                <p style={{ color: '#fdba74', fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
                  Your course download link will be sent to this email. Please enter a valid email.
                </p>
              </div>

              {/* Email input */}
              <input
                type="email"
                placeholder="Enter your email to receive course"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleEmailSubmit(); }}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #2e3545',
                  background: '#0c1322',
                  color: '#dce2f7',
                  fontSize: '16px',
                  marginBottom: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {/* Submit button */}
              <button
                onClick={handleEmailSubmit}
                disabled={loading || !email.trim()}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: (loading || !email.trim()) ? '#555' : 'linear-gradient(to right, #22c55e, #16a34a)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: (loading || !email.trim()) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(34,197,94,0.4)',
                  opacity: (loading || !email.trim()) ? 0.6 : 1,
                }}
              >
                {loading ? 'Sending...' : 'SEND MY COURSE LINK'}
              </button>

              <p style={{ color: '#a78b7d', fontSize: '11px', textAlign: 'center', margin: '10px 0 0 0' }}>
                Check your spam folder if you don't see the email.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-surface-container-lowest py-8 border-t border-surface-container-high w-full px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-sm">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Edufast" className="h-10 w-auto" />
                <span className="font-display-xl text-primary font-extrabold tracking-tighter text-headline-lg-mobile">Edufast</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Excellence in accelerated education. We are a premier educational institution committed to delivering accredited degree programs through innovative academic methodologies.
              </p>
              <p className="text-on-surface-variant text-sm">Contact us: info@edufast.in</p>
              <p className="text-on-surface-variant text-sm">Course Support: 9538095333</p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8 text-center md:text-left">
              <div>
                <h4 className="text-on-surface font-bold text-sm mb-4">Academic Programs</h4>
                <ul className="flex flex-col gap-2 text-on-surface-variant text-sm">
                  <li><a className="hover:text-primary transition-colors" href="https://edufast.in">Home</a></li>
                  <li><a className="hover:text-primary transition-colors" href="https://edufast.in">Degree Programs</a></li>
                  <li><a className="hover:text-primary transition-colors" href="https://edufast.in">About Institution</a></li>
                  <li><a className="hover:text-primary transition-colors" href="https://edufast.in">Admissions</a></li>
                  <li><a className="hover:text-primary transition-colors" href="https://edufast.in">Student Resources</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-on-surface font-bold text-sm mb-4">Legal & Policies</h4>
                <ul className="flex flex-col gap-2 text-on-surface-variant text-sm">
                  <li><a className="hover:text-primary transition-colors" href="#">Terms & Conditions</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Refund Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-surface-container-high pt-6 flex flex-col items-center text-center gap-2">
            <p className="text-on-surface-variant text-xs">
              &copy; 2026 Edufast Educational Institute. All rights reserved. | Accredited Academic Programs | Professional Excellence
            </p>
            <p className="text-on-surface-variant text-xs opacity-60">
              Website created and maintained by Autumic Solutions. contact website-autumicsolutions.space
            </p>
          </div>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Sticky Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-6 bg-surface-container/90 dark:bg-surface-container/90 backdrop-blur-xl rounded-t-xl h-[72px] bg-surface-container-high dark:bg-surface-container-high shadow-[0_-4px_20px_rgba(0,0,0,0.5)] shadow-2xl">
        <div className="flex items-center gap-2 text-urgency-red font-bold">
          <span className="material-symbols-outlined">timer</span>
          <span className="font-label-bold text-label-bold text-gold-gradient-start text-urgency-red">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
        <div
          onClick={handlePayment}
          className="flex flex-row items-center gap-2 bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end text-on-primary px-6 py-3 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:brightness-110 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="font-label-bold text-label-bold">
            {loading ? 'Processing...' : 'Buy - ₹499'}
          </span>
        </div>
      </nav>
    </>
  );
}
