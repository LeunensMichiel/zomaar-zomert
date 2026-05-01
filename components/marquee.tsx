'use client';

import { useEffect, useState } from 'react';
import FastMarquee from 'react-fast-marquee';

type MarqueeProps = {
  slides: Array<{ url: string; alt?: string }>;
  speed: number;
  direction: 'left' | 'right';
};

export function Marquee({ slides, speed = 20, direction }: MarqueeProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div className='relative overflow-hidden before:absolute before:inset-0 before:z-[5] before:bg-[image:radial-gradient(rgba(255,255,255,0.2)_1px,rgba(0,0,0,0.15)_1px),radial-gradient(rgba(255,255,255,0.1)_1px,rgba(0,0,0,0.1)_1px)] before:[background-size:4px_4px] before:[background-position:0_0,2px_2px] before:content-[""]'>
      <FastMarquee
        direction={direction}
        speed={isMobile ? speed / 5 : speed}
        gradient={false}
      >
        {slides?.map((slide) => (
          <img
            src={slide.url}
            key={slide.url}
            className="h-[25vh] w-auto object-cover object-center md:h-[40vh]"
            alt={slide.alt}
            loading="lazy"
          />
        ))}
      </FastMarquee>
    </div>
  );
}
