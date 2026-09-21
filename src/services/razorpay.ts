/* --------------------------------------------------------------------------
   RAZORPAY CHECKOUT SERVICE — PRAVYN ICT
   Handles dynamic SDK script loading, option configuration, and payment flows
   -------------------------------------------------------------------------- */

export interface MentorshipPlan {
  id: 'online-mastery' | 'online-mentorship' | 'offline-slingshot'
  name: string
  mode: string
  price: number // in INR (e.g. 9999)
  description: string
  tag: string
  colorVariant: 'cyan' | 'blue' | 'gold'
}

export const MENTORSHIP_PLANS: Record<string, MentorshipPlan> = {
  mastery: {
    id: 'online-mastery',
    name: 'ICT Mastery Mentorship',
    mode: 'Online · Live Batch (Sep 29)',
    price: 9999,
    description: '11-Day Intensive Live Batch with Live Trading Sessions after classes',
    tag: 'ONLINE · LIVE BATCH',
    colorVariant: 'cyan',
  },
  online: {
    id: 'online-mentorship',
    name: 'Personal Mentorship',
    mode: 'Online · 1-on-1 Zoom',
    price: 24999,
    description: '1-to-1 Personal Mentorship Program with dedicated live sessions',
    tag: 'ONLINE · 1-ON-1',
    colorVariant: 'blue',
  },
  offline: {
    id: 'offline-slingshot',
    name: 'Slingshot Model',
    mode: 'Offline · Chennai',
    price: 19999,
    description: 'Intensive Classroom Bootcamp on XAUUSD execution in Chennai',
    tag: 'OFFLINE · CHENNAI',
    colorVariant: 'gold',
  },
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

export interface CheckoutCustomerInfo {
  name?: string
  email?: string
  phone?: string
}

export interface RazorpayCheckoutParams {
  plan: MentorshipPlan
  customer?: CheckoutCustomerInfo
  onSuccess: (data: RazorpayPaymentSuccessResponse, plan: MentorshipPlan) => void
  onDismiss?: () => void
  onError?: (error: any) => void
}

/**
 * Dynamically loads the official Razorpay Checkout SDK if not already present.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    // Check if script already exists on window
    if ((window as any).Razorpay) {
      resolve(true)
      return
    }

    // Check if script tag is already in DOM
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true))
      existingScript.addEventListener('error', () => resolve(false))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK from https://checkout.razorpay.com/v1/checkout.js')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

/**
 * Gets the configured Razorpay Key ID from environment or returns placeholder key
 */
export function getRazorpayKey(): string {
  const envKey = import.meta.env.VITE_RAZORPAY_KEY_ID
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim()
  }
  return 'rzp_test_placeholder_key'
}

/**
 * Initiates Razorpay checkout for a mentorship plan
 */
export async function initiateRazorpayCheckout({
  plan,
  customer,
  onSuccess,
  onDismiss,
  onError,
}: RazorpayCheckoutParams): Promise<boolean> {
  try {
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded) {
      const err = new Error('Could not load Razorpay payment gateway. Please check your internet connection.')
      onError?.(err)
      return false
    }

    const key = getRazorpayKey()
    const amountInPaise = Math.round(plan.price * 100)

    const options = {
      key,
      amount: amountInPaise,
      currency: 'INR',
      name: 'PRAVYN ICT',
      description: `${plan.name} (${plan.mode})`,
      image: '/logo/logo.png',
      handler: function (response: RazorpayPaymentSuccessResponse) {
        onSuccess(response, plan)
      },
      prefill: {
        name: customer?.name || '',
        email: customer?.email || '',
        contact: customer?.phone || '',
      },
      notes: {
        programme_id: plan.id,
        programme_name: plan.name,
        mode: plan.mode,
        enrollment_type: 'Direct Mentorship Enrollment',
      },
      theme: {
        color: plan.colorVariant === 'gold' ? '#eab308' : '#0284c7',
        backdrop_color: '#030712',
      },
      modal: {
        ondismiss: function () {
          onDismiss?.()
        },
        escape: true,
        backdropclose: false,
      },
    }

    const rzp = new (window as any).Razorpay(options)

    rzp.on('payment.failed', function (response: any) {
      console.warn('Razorpay payment failed:', response.error)
      onError?.(response.error)
    })

    rzp.open()
    return true
  } catch (error) {
    console.error('Error opening Razorpay checkout:', error)
    onError?.(error)
    return false
  }
}
