export type Page = 'home' | 'setup' | 'pricing' | 'contact';

export interface BuyingCriteria {
  propertyType: string;
  targetState: string;
  targetCity?: string;
  minSqFt: string;
  minYearsOwned: string;
  priceRange: string;
  ownerType: string;
  companyName: string;
  website?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
}

export interface MailerSideContent {
  headline: string;
  subHeadline?: string;
  bodyCopy: string;
  cta?: string;
  benefits?: string[];
  socialProof?: string;
}

export interface MailerDesign {
  id: string;
  name: string;
  style: 'modern' | 'bold' | 'classic';
  front: {
    headline: string;
    subHeadline: string;
    bodyCopy: string;
    cta: string;
  };
  back: {
    headline: string;
    benefits: string[];
    socialProof: string;
    testimonial?: string;
    guarantee?: string;
    secondaryCta?: string;
  };
}

export enum MailerType {
  LETTER = 'LETTER',
  POSTCARD_STD = 'POSTCARD_STD',
  POSTCARD_JUMBO = 'POSTCARD_JUMBO',
}

export interface PricingPlan {
  id: MailerType;
  name: string;
  pricePerUnit: number;
  description: string;
  dimensions: string;
}
