'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { heroSlides } from '@/lib/data/catalog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const trustStats = ['100K+ Products', '500+ Brands', 'GeM Listed', 'ISO Certified', 'Pan India Delivery'];

export function HeroBanner() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  return (
    <section className="container-content py-6">
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative h-hero-mobile md:h-hero-desktop">
          <Image src={slide.image} alt="" fill className="object-cover" priority sizes="1360px" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
            <h1 className="max-w-xl text-display-xl text-white md:text-display-2xl">{slide.title}</h1>
            <p className="mt-3 max-w-lg text-body-lg text-white/90">{slide.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={slide.ctaPrimary.href}>
                <Button size="lg">{slide.ctaPrimary.label}</Button>
              </Link>
              <Link href={slide.ctaSecondary.href}>
                <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  {slide.ctaSecondary.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                i === active ? 'w-6 bg-accent' : 'bg-white/50'
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-4 rounded-md border border-border bg-card px-4 py-3 md:gap-8">
        {trustStats.map((stat) => (
          <span key={stat} className="text-body-sm font-semibold text-primary md:text-body-md">
            {stat}
          </span>
        ))}
      </div>
    </section>
  );
}
