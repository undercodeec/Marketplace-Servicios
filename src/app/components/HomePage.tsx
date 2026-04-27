import React from 'react';
import { Hero } from './Hero';
import { CategoryNav } from './CategoryNav';
import { PopularServices } from './PopularServices';
import { VideoSection } from './VideoSection';
import { TrustedBy } from './TrustedBy';
import { ProSection } from './ProSection';
import { Features } from './Features';
import { Knowledge } from './Knowledge';
import { FAQ } from './FAQ';
import { CTABanner } from './CTABanner';
import { ExplorePills } from './ExplorePills';
import { ProCTA } from './ProCTA';

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryNav />
      <PopularServices />
      <VideoSection />
      <TrustedBy />
      <ProSection />
      <Features />
      <Knowledge />
      <FAQ />
      <CTABanner />
      <ExplorePills />
      <ProCTA />
    </>
  );
}