import React from 'react';
import { ProHero } from './ProHero';
import { ProHowItWorks } from './ProHowItWorks';
import { ProFAQ } from './ProFAQ';
import { ProCTA } from './ProCTA';

export function ProPage() {
  return (
    <div className="bg-white">
      <ProHero />
      <ProHowItWorks />
      <ProFAQ />
      <ProCTA />
    </div>
  );
}