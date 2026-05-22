# Handoff Prompt for Other AI

Copy everything below and give it to the other AI to set up your new site's backend and deployment.

---

## TASK

Set up a Next.js landing page project with Razorpay payment integration, email confirmation via Resend, and Vercel deployment. The UI/code is ready — I only need the backend payment flow and deployment config.

## PROJECT SETUP

```bash
npx create-next-app@latest my-site --typescript --tailwind --app --eslint --src-dir=false
cd my-site
npm install razorpay resend
```

## FILE STRUCTURE TO CREATE

```
app/
├── api/
│   ├── create-order/
│   │   └── route.ts       # POST: creates Razorpay order
│   ├── verify-payment/
│   │   └── route.ts       # POST: verifies Razorpay signature + sends email
│   └── webhook/
│       └── route.ts       # POST: Razorpay webhook (backup email trigger)
lib/
├── razorpay.ts            # Razorpay SDK singleton
├── resend.ts              # Resend SDK singleton
└── email.ts               # sendConfirmationEmail() function
```

## EXACT CODE FOR EACH FILE

### lib/razorpay.ts
```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default razorpay;
```

### lib/resend.ts
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
```

### lib/email.ts
```typescript
import resend from './resend';

export async function sendConfirmationEmail(
  to: string,
  paymentId: string,
  amount: number
) {
  const driveLink = process.env.GOOGLE_DRIVE_ACCESS_LINK!;
  const formattedAmount = (amount / 100).toFixed(2);

  await resend.emails.send({
    from: process.env.SENDER_EMAIL!,
    to,
    subject: 'Payment Successful - Access Your Bundle',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Payment Successful!</h1>
        <p>Thank you for your purchase.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Amount:</strong> ₹${formattedAmount}</p>
        </div>
        <p>Click the button below to access your bundle:</p>
        <a href="${driveLink}" style="display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
          Access Your Bundle
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          If you have any questions, reply to this email.
        </p>
      </div>
    `,
  });
}
```

### app/api/create-order/route.ts
```typescript
import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const { amount, currency, email } = await request.json();

    const order = await razorpay.orders.create({
      amount,
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        email,
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
```

### app/api/verify-payment/route.ts
```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } =
      await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Send confirmation email
    await sendConfirmationEmail(email, razorpay_payment_id, 0);

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
```

### app/api/webhook/route.ts
```typescript
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle payment.captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const email = payment.notes?.email;

      if (email) {
        await sendConfirmationEmail(email, payment.id, payment.amount);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

## ENVIRONMENT VARIABLES (.env.local)

```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
SENDER_EMAIL=onboarding@resend.dev
GOOGLE_DRIVE_ACCESS_LINK=https://drive.google.com/your-file-link
```

## FRONTEND PAYMENT FLOW (add to any page component)

```typescript
'use client';

import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script in useEffect:
// const script = document.createElement('script');
// script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// script.async = true;
// document.body.appendChild(script);

const handlePayment = async () => {
  // 1. Create order (amount in paise — ₹499 = 49900)
  const orderResponse = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 49900, currency: 'INR', email: '' }),
  });
  const { orderId } = await orderResponse.json();

  // 2. Open Razorpay modal
  const rzp = new window.Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: 49900,
    currency: 'INR',
    name: 'Your Brand Name',
    description: 'Your product description',
    order_id: orderId,
    handler: async (response: any) => {
      // 3. After payment, collect email then verify
      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...response, email: userEmail }),
      });
      const result = await verifyResponse.json();
      if (result.success) {
        // redirect to success page
      }
    },
    theme: { color: '#F97316' },
  });
  rzp.open();
};
```

## DEPLOYMENT (Vercel)

1. Push code to GitHub
2. Import repo on vercel.com
3. Add all environment variables from `.env.local` in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

### Razorpay Webhook Setup (after deployment):
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Set URL to: `https://your-domain.com/api/webhook`
3. Select event: `payment.captured`
4. Copy the webhook secret → set as `RAZORPAY_WEBHOOK_SECRET` in Vercel

## AMOUNT REFERENCE (paise to rupees)

| Rupees | Paise (send to API) |
|--------|---------------------|
| ₹99    | 9900                |
| ₹199   | 19900               |
| ₹299   | 29900               |
| ₹499   | 49900               |
| ₹999   | 99900               |
| ₹1499  | 149900              |
| ₹1999  | 199900              |

## IMPORTANT NOTES

- Amount is always in **paise** (₹1 = 100 paise)
- The `NEXT_PUBLIC_RAZORPAY_KEY_ID` must match `RAZORPAY_KEY_ID` — one for server, one for client
- `SENDER_EMAIL` must be a verified domain in Resend (or use `onboarding@resend.dev` for testing)
- `GOOGLE_DRIVE_ACCESS_LINK` is what the customer receives in the email — change per product
- For production: switch from `rzp_test_` keys to `rzp_live_` keys
- Run `npm run build` to verify everything compiles before deploying
