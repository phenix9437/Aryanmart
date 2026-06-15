export interface PaymentOrder {
  paymentOrderId: string;
  amount: number;
  currency: string;
  status: 'created';
}

export interface PaymentVerification {
  success: boolean;
  paymentId: string;
  status: 'paid' | 'failed';
}

export async function createPaymentOrder(
  amount: number,
  currency: string = 'INR'
): Promise<PaymentOrder> {
  // TODO: Replace with razorpay.orders.create() when real keys are available
  const paymentOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    paymentOrderId,
    amount,
    currency,
    status: 'created',
  };
}

export async function verifyPayment(
  paymentOrderId: string,
  mockOutcome: 'success' | 'failure' = 'success'
): Promise<PaymentVerification> {
  // TODO: Replace with razorpay.payments.fetch() + signature verification when real keys are available
  void paymentOrderId;

  if (mockOutcome === 'success') {
    return {
      success: true,
      paymentId: `mock_pay_${Date.now()}`,
      status: 'paid',
    };
  }

  return {
    success: false,
    paymentId: '',
    status: 'failed',
  };
}
