'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  buttonText?: string;
  buttonClassName?: string;
  showIcon?: boolean;
  iconName?: string;
}

export default function RazorpayCheckout({
  buttonText = 'CLAIM OFFER NOW',
  buttonClassName = '',
  showIcon = true,
  iconName = 'shopping_cart',
}: RazorpayCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
        body: JSON.stringify({
          amount: 149900, // ₹1 in paise (testing)
          currency: 'INR',
          email,
        }),
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
          setLoading(true);
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                email,
              }),
            });

            const result = await verifyResponse.json();

            if (result.success) {
              setPaymentStatus('success');
              setTimeout(() => router.push('/success'), 2000);
            } else {
              setPaymentStatus('failed');
            }
          } catch (error) {
            setPaymentStatus('failed');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        prefill: {
          email,
        },
        theme: {
          color: '#F97316',
        },
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
    <div className="flex flex-col items-center gap-4">
      {paymentStatus === 'success' && (
        <div className="w-full md:w-auto min-w-[300px] px-4 py-3 rounded-lg bg-green-600 text-white text-center font-semibold">
          ✓ Payment Successful! Redirecting...
        </div>
      )}
      {paymentStatus === 'failed' && (
        <div className="w-full md:w-auto min-w-[300px] px-4 py-3 rounded-lg bg-red-600 text-white text-center font-semibold">
          ✕ Payment Failed. Please try again.
        </div>
      )}
      {showEmailInput && (
        <input
          type="email"
          placeholder="Enter your email to continue"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full md:w-auto min-w-[300px] px-4 py-3 rounded-lg bg-[#191f2f] border border-[#584237] text-[#dce2f7] placeholder-[#a78b7d] focus:outline-none focus:border-[#f97316]"
          required
        />
      )}
      <button
        onClick={handlePayment}
        disabled={loading || paymentStatus === 'success'}
        className={`buy-button ${buttonClassName}`}
      >
        {showIcon && <span className="material-symbols-outlined">{iconName}</span>}
        {loading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}
