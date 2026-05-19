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

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Freelance Designer',
    city: 'Mumbai',
    text: 'This bundle changed my career. I learned video editing and landed 3 clients in the first month itself!',
    earning: '₹45,000/month',
  },
  {
    name: 'Priya Patel',
    role: 'College Student',
    city: 'Delhi',
    text: 'Best investment I ever made. The courses are so well structured, I got placed in a top company.',
    earning: '₹8 LPA Job',
  },
  {
    name: 'Amit Kumar',
    role: 'Content Creator',
    city: 'Bangalore',
    text: 'The assets alone are worth lakhs. I use them daily for my YouTube channel that now has 50K subscribers.',
    earning: '₹60,000/month',
  },
  {
    name: 'Sneha Reddy',
    role: 'Digital Marketer',
    city: 'Hyderabad',
    text: 'From zero knowledge to running ads for 5 clients. This bundle is a goldmine for anyone serious about earning.',
    earning: '₹35,000/month',
  },
  {
    name: 'Vikash Singh',
    role: 'Small Business Owner',
    city: 'Jaipur',
    text: 'I built my entire e-commerce store using the skills from this bundle. Sales increased 3x in 2 months.',
    earning: '₹2,00,000/month',
  },
  {
    name: 'Anjali Menon',
    role: 'Housewife turned Freelancer',
    city: 'Kochi',
    text: 'Started freelancing from home after learning from these courses. Now earning more than my previous job!',
    earning: '₹50,000/month',
  },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [time, setTime] = useState(299);
  const [spotsLeft, setSpotsLeft] = useState(12);

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
    if (!email) {
      setShowEmailInput(true);
      return;
    }

    setLoading(true);

    try {
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 149900, currency: 'INR', email }),
      });

      const { orderId } = await orderResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 149900,
        currency: 'INR',
        name: 'Edufast Mega Combo Bundle',
        description: '1000+ Courses, 30,000+ Assets, Lifetime Access',
        order_id: orderId,
        handler: async (response: any) => {
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, email }),
          });

          const result = await verifyResponse.json();

          if (result.success) {
            router.push('/success');
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { email },
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

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-lg shadow-xl hidden md:flex flex justify-between items-center px-gutter w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary dark:text-primary hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform cursor-pointer">bolt</span>
          <h1 className="font-display-xl text-primary font-extrabold tracking-tighter text-headline-lg-mobile md:text-headline-lg">Edufast Mega Combo</h1>
        </div>
        <div className="flex items-center gap-2">
          <CountdownTimer />
        </div>
      </header>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 w-full z-50 h-16 bg-surface/90 backdrop-blur-md shadow-md md:hidden flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">bolt</span>
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
              alt="Hero Image"
              className="w-full h-auto object-cover aspect-video"
              src="https://lh3.googleusercontent.com/aida/ADBb0uhPCGfZFFBz6-0XuGkc_w90EQL2RsN6yGvmrpm-8545dbrmqQf_tUKb-TQakAkGuzRTGz-hRbbPn3g5tohrtO63GtbzDRot-szI93V2S7JL75tPfzF_UrW1szJyP3E7moqNMf9vwJ1g6LjYiYOVubKmlLOWXnuUOvvo-Q753zEnaeFdxklr5VrVRkLzoxwmdkDmspRBj08A-3WR8Ja284qR9-QPN0D1pIXg1RTauJlhgL7UrLNdOgdx2hs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            GET THE MEGA COMBO BUNDLE: ALL YOU NEED FOR SUCCESS!
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            1000+ Courses, 30,000+ Assets, Lifetime Access. Today only for{' '}
            <span className="font-price-display text-price-display text-primary-container">₹1,499</span>.
          </p>

          {showEmailInput && (
            <input
              type="email"
              placeholder="Enter your email to continue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-auto min-w-[300px] px-4 py-3 rounded-lg bg-surface-container border border-outline text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              required
            />
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="buy-button w-full md:w-auto min-h-[56px] px-8 py-4 bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end rounded-full font-label-bold text-label-bold text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-[0_4px_14px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {loading ? 'Processing...' : 'CLAIM OFFER NOW - ₹1,499'}
          </button>
          <p className="text-urgency-red font-bold text-sm animate-pulse" suppressHydrationWarning>Only {spotsLeft} spots left at this price!</p>
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
              <p className="font-body-md text-body-md text-on-surface-variant">Pay once, learn forever. No recurring fees.</p>
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

        {/* Price Section */}
        <section className="flex flex-col items-center gap-6 mt-8 p-8 bg-surface-container-low rounded-2xl border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-urgency-red text-white px-4 py-1 rounded-bl-xl font-label-bold text-label-bold animate-pulse">
            99% OFF - TODAY ONLY
          </div>
          <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface text-center">Secure Your Future Today</h3>
          <div className="flex items-center gap-4">
            <span className="text-on-surface-variant line-through font-display-xl text-xl opacity-60">₹2,00,000</span>
            <span className="font-price-display text-price-display text-gold-gradient-start">₹1,499</span>
          </div>
          <p className="text-on-surface-variant text-sm">You save ₹1,98,501 (99% off)</p>

          {showEmailInput && (
            <input
              type="email"
              placeholder="Enter your email to continue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-auto min-w-[300px] px-4 py-3 rounded-lg bg-surface-container border border-outline text-on-surface placeholder-outline focus:outline-none focus:border-primary"
              required
            />
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="buy-button w-full md:w-auto min-h-[56px] px-8 py-4 bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end rounded-full font-label-bold text-label-bold text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-[0_4px_14px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">bolt</span>
            {loading ? 'Processing...' : 'CLAIM OFFER NOW - ₹1,499'}
          </button>
          <p className="font-body-md text-body-md text-urgency-red mt-2">Hurry! Offer ends in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
        </section>

        {/* Earning Potential Section */}
        <section className="mt-8 p-8 bg-surface-container-low rounded-2xl border border-green-500/20">
          <div className="text-center mb-8">
            <h3 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
              How You Can Earn <span className="text-green-500">₹50,000 - ₹2,00,000/month</span>
            </h3>
            <p className="text-on-surface-variant font-body-lg">After completing these courses, here are proven paths to earning lakhs:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-dark p-6 rounded-xl border border-surface-container-high text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="text-on-surface font-bold mb-2">Freelancing</h4>
              <p className="text-on-surface-variant text-sm mb-3">Graphic Design, Video Editing, Web Development</p>
              <p className="text-green-500 font-bold text-lg">₹30K - ₹1L/month</p>
            </div>
            <div className="bg-surface-dark p-6 rounded-xl border border-surface-container-high text-center">
              <div className="text-4xl mb-3">📱</div>
              <h4 className="text-on-surface font-bold mb-2">Content Creation</h4>
              <p className="text-on-surface-variant text-sm mb-3">YouTube, Instagram, Blogging</p>
              <p className="text-green-500 font-bold text-lg">₹50K - ₹2L/month</p>
            </div>
            <div className="bg-surface-dark p-6 rounded-xl border border-surface-container-high text-center">
              <div className="text-4xl mb-3">💼</div>
              <h4 className="text-on-surface font-bold mb-2">Digital Marketing Jobs</h4>
              <p className="text-on-surface-variant text-sm mb-3">SEO, Social Media, Ads Management</p>
              <p className="text-green-500 font-bold text-lg">₹4LPA - ₹12LPA</p>
            </div>
          </div>

          <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <p className="text-green-400 font-bold">
              Average ROI: Students earn back 10x-100x their investment within 3-6 months
            </p>
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
                    <p className="text-on-surface-variant text-xs">{t.role} • {t.city}</p>
                  </div>
                </div>
                <p className="text-on-surface-variant font-body-md text-sm mb-3">"{t.text}"</p>
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
            Join 10,000+ students who are already earning lakhs. This offer won't last forever.
          </p>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="buy-button w-full md:w-auto min-h-[56px] px-12 py-4 bg-gradient-to-r from-gold-gradient-start to-gold-gradient-end rounded-full font-label-bold text-label-bold text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] shadow-[0_4px_14px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            {loading ? 'Processing...' : 'START EARNING NOW - ₹1,499'}
          </button>
        </section>
      </main>

      {/* Live Notifications */}
      <MobileNotification />
      <DesktopNotification />

      {/* Exit Intent Popup */}
      <ExitPopup />

      {/* Footer */}
      <footer className="mt-16 bg-surface-container-lowest py-8 border-t border-surface-container-high w-full px-gutter">
        <div className="max-w-container-max mx-auto flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">bolt</span>
            <span className="font-display-xl text-primary font-extrabold tracking-tighter text-headline-lg-mobile">Edufast</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Empowering ambitious learners with high-quality, actionable resources for professional growth.</p>
          <div className="flex gap-4 mt-4 text-on-surface-variant font-label-bold text-label-bold text-sm">
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Contact Us</a>
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
            {loading ? 'Processing...' : 'Claim Offer - ₹1,499'}
          </span>
        </div>
      </nav>
    </>
  );
}
