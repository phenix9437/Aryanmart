'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const steps = ['Product Requirements', 'Delivery & Business', 'Review & Submit'];

export default function RFQPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [rfqId] = useState(() => `RFQ-${Date.now().toString().slice(-8)}`);

  if (submitted) {
    return (
      <div className="container-content max-w-2xl py-12 text-center">
        <h1 className="text-display-xl text-primary">RFQ Submitted</h1>
        <p className="mt-4 text-body-lg">Your RFQ ID: <strong className="font-mono">{rfqId}</strong></p>
        <p className="mt-2 text-body-md text-text-muted">Expected response within 2 business hours.</p>
        <div className="mt-8 flex justify-center gap-4">
          <a href={`/rfq/track/${rfqId}`}>
            <Button>Track RFQ</Button>
          </a>
          <a href="/products">
            <Button variant="secondary">Continue Shopping</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-content max-w-2xl py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Request Quote' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">Request for Quotation</h1>

      <div className="mt-8 flex gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={cn(
              'flex-1 rounded-md px-3 py-2 text-center text-body-sm font-medium',
              i === step ? 'bg-primary text-white' : i < step ? 'bg-primary/20 text-primary' : 'bg-surface text-text-muted'
            )}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <form
        className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 2) setStep(step + 1);
          else setSubmitted(true);
        }}
      >
        {step === 0 && (
          <>
            <Input placeholder="Product name or SKU" required />
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Quantity" required />
              <Input placeholder="Unit (pcs, m, box)" />
            </div>
            <textarea
              placeholder="Specs / notes"
              className="min-h-[100px] w-full rounded-md border border-border p-3 text-body-md"
            />
            <button type="button" className="text-body-md text-accent hover:underline">+ Add Another Item</button>
          </>
        )}
        {step === 1 && (
          <>
            <Input placeholder="Delivery pincode" required />
            <Input type="date" required />
            <Input placeholder="GSTIN (15 characters)" maxLength={15} />
            <Input placeholder="Contact name" required />
            <Input type="email" placeholder="Email" required />
            <Input type="tel" placeholder="Phone" required />
            <textarea placeholder="Additional requirements" className="min-h-[80px] w-full rounded-md border border-border p-3" />
          </>
        )}
        {step === 2 && (
          <div className="space-y-2 text-body-md text-text-muted">
            <p>Review your RFQ details before submitting.</p>
            <p className="font-semibold text-text-primary">Expected response within 2 business hours.</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
          )}
          <Button type="submit" className="ml-auto">
            {step < 2 ? 'Next' : 'Submit RFQ'}
          </Button>
        </div>
      </form>
    </div>
  );
}
