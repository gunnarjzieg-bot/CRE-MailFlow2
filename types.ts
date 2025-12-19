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
  name: string; // e.g. "The Professional", "The Cash Offer"
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
    socialProof: string; // "Trusted by..."
    testimonial?: string; // "Best service..."
    guarantee?: string; // "No obligation..."
    secondaryCta?: string; // "Visit website..."
  };
}

export enum MailerType {
  LETTER = 'LETTER',
  POSTCARD_STD = 'POSTCARD_STD',
  POSTCARD_JUMBO = 'POSTCARD_JUMBO'
}

export interface PricingPlan {
  id: MailerType;
  name: string;
  pricePerUnit: number;
  description: string;
  dimensions: string;
}