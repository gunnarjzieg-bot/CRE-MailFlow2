import { GoogleGenAI } from "@google/genai";
import { BuyingCriteria, MailerDesign } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMailerCopy = async (criteria: BuyingCriteria): Promise<MailerDesign[]> => {
  const location = criteria.targetCity 
    ? `${criteria.targetCity}, ${criteria.targetState}`
    : criteria.targetState;

  const prompt = `
    You are a professional commercial real estate copywriter.
    Create 3 DISTINCT direct mail postcard concepts to send to ${criteria.ownerType} owners of ${criteria.propertyType} properties in ${location}.
    
    Buying Criteria:
    - Buyer: ${criteria.companyName}
    - Seeking: ${criteria.propertyType}
    - Budget: ${criteria.priceRange}
    - Min SqFt: ${criteria.minSqFt}
    - Min Ownership: ${criteria.minYearsOwned} years
    
    Output a JSON array with exactly 3 objects. 
    1. Concept 1: "Professional & Direct" (Style: modern) - Subtle, corporate tone.
    2. Concept 2: "The Problem Solver" (Style: bold) - Focus on solving common ownership headaches (vacancy, management, capital improvements).
    3. Concept 3: "Relationship / Local Expert" (Style: classic)

    Each object must strictly follow this schema:
    {
      "id": "design_1",
      "name": "Professional & Direct",
      "style": "modern",
      "front": {
        "headline": "Bold headline (max 7 words)",
        "subHeadline": "Short supporting line",
        "bodyCopy": "2-3 persuasive sentences enticing them to sell.",
        "cta": "Subtle call to action (e.g. Inquire Today - NO 'SCAN' CTA on front)"
      },
      "back": {
        "headline": "Secondary headline for the back side",
        "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
        "socialProof": "Credibility statement (e.g. Trusted by 500+ owners)",
        "testimonial": "Short 1-sentence quote (e.g. 'Best experience ever.')",
        "guarantee": "Reassurance line (e.g. No fees, no obligation)",
        "secondaryCta": "Secondary CTA (e.g. Scan to visit website)"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as MailerDesign[];
  } catch (error) {
    console.error("Error generating copy:", error);
    // Fallback content in case of API failure
    return [
      {
        id: "fallback_1",
        name: "Professional & Direct",
        style: "modern",
        front: {
          headline: `Acquiring ${criteria.propertyType} Assets`,
          subHeadline: "Fair Market Valuations",
          bodyCopy: `We are actively expanding our portfolio in ${location} and have identified your property as a strong fit.`,
          cta: "Contact Us"
        },
        back: {
          headline: "Why Sell Off-Market?",
          benefits: ["No Broker Fees", "As-Is Purchase", "Flexible Timeline", "Cash Closing"],
          socialProof: "Trusted by over 500 property owners since 2015.",
          testimonial: "\"Professional, fast, and effective.\"",
          guarantee: "No obligation — simple and affordable.",
          secondaryCta: "Visit our website for more info."
        }
      },
      {
        id: "fallback_2",
        name: "The Problem Solver",
        style: "bold",
        front: {
          headline: "Tired of Management Headaches?",
          subHeadline: "We Buy Complex Assets",
          bodyCopy: "Deferred maintenance? High vacancy? Partnership disputes? We provide clean exits for challenging properties.",
          cta: "Get Solutions"
        },
        back: {
          headline: "Simplify Your Exit Today",
          benefits: ["We Take On The Risk", "No Repairs Needed", "Guaranteed Closing", "We Handle Evictions"],
          socialProof: "Solving complex real estate problems for 10+ years.",
          testimonial: "\"They solved a 2-year probate issue in weeks.\"",
          guarantee: "100% Confidential Process.",
          secondaryCta: "Scan to see our track record."
        }
      },
      {
        id: "fallback_3",
        name: "Local Expert",
        style: "classic",
        front: {
          headline: `Your ${criteria.propertyType} Partner`,
          subHeadline: "Building Community Value",
          bodyCopy: "We specialize in unlocking value for owners like you. Let's discuss your asset's potential.",
          cta: "Visit Website"
        },
        back: {
          headline: "A Partnership Approach",
          benefits: ["Market Expertise", "Confidential Process", "Owner-to-Owner", "Local Knowledge"],
          socialProof: "Over $50M in local assets acquired.",
          testimonial: "\"Fair price and smooth transaction.\"",
          guarantee: "Your satisfaction is our priority.",
          secondaryCta: "Learn more about us."
        }
      }
    ];
  }
};