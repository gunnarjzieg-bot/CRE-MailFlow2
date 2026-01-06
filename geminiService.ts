// src/geminiServices.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BuyingCriteria, MailerDesign } from "./types";

// Vite env var (client-side). For production: move this to a serverless route.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

// Initialize client only if key exists
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

function formatLocation(criteria: BuyingCriteria): string {
  const city = (criteria.targetCity || "").trim();
  const state = (criteria.targetState || "").trim();
  if (city && state) return `${city}, ${state}`;
  return city || state || "your target market";
}

// Remove common markdown fences
function stripCodeFences(raw: string): string {
  return (raw || "")
    .trim()
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

// Extract the first COMPLETE JSON array by balancing brackets (robust to extra text)
function extractFirstJsonArray(raw: string): string {
  const s = stripCodeFences(raw);
  const start = s.indexOf("[");
  if (start === -1) throw new Error("No JSON array start found");

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < s.length; i++) {
    const ch = s[i];

    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') inString = true;
    if (ch === "[") depth++;
    if (ch === "]") depth--;

    if (depth === 0) return s.slice(start, i + 1);
  }

  throw new Error("Unterminated JSON array in response");
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

// Minimal shape checks to prevent UI crashes
function isDesignLike(d: any): d is MailerDesign {
  return (
    d &&
    isNonEmptyString(d.id) &&
    isNonEmptyString(d.name) &&
    isNonEmptyString(d.style) &&
    d.front &&
    isNonEmptyString(d.front.headline) &&
    isNonEmptyString(d.front.subHeadline) &&
    isNonEmptyString(d.front.bodyCopy) &&
    isNonEmptyString(d.front.cta) &&
    d.back &&
    isNonEmptyString(d.back.headline) &&
    Array.isArray(d.back.benefits) &&
    d.back.benefits.length === 4 &&
    d.back.benefits.every(isNonEmptyString) &&
    isNonEmptyString(d.back.socialProof) &&
    isNonEmptyString(d.back.testimonial) &&
    isNonEmptyString(d.back.guarantee) &&
    isNonEmptyString(d.back.secondaryCta)
  );
}

/** Gemini sometimes returns extra text. This extracts and validates JSON. */
function safeParseDesigns(text: string): MailerDesign[] {
  const cleaned = stripCodeFences(text);
  if (!cleaned) throw new Error("Empty Gemini response");

  // Try direct JSON parse first (best case)
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed as MailerDesign[];
  } catch {
    // fall through
  }

  // Robust extraction parse
  const jsonArray = extractFirstJsonArray(cleaned);
  const parsed = JSON.parse(jsonArray);

  if (!Array.isArray(parsed)) throw new Error("Parsed content is not an array");
  return parsed as MailerDesign[];
}

// --- Fallback Data Generator ---
const getFallbackContent = (criteria: BuyingCriteria): MailerDesign[] => {
  const location = formatLocation(criteria);

  return [
    {
      id: "fallback_1",
      name: "Professional & Direct",
      style: "modern",
      front: {
        headline: `Acquiring ${criteria.propertyType} Assets`,
        subHeadline: "Fair Market Valuations",
        bodyCopy: `We are actively expanding our portfolio in ${location} and have identified your property as a strong fit.`,
        cta: "Contact Us",
      },
      back: {
        headline: "Why Sell Off-Market?",
        benefits: ["No Broker Fees", "As-Is Purchase", "Flexible Timeline", "Cash Closing"],
        socialProof: "Trusted by over 500 property owners since 2015.",
        testimonial: "Professional, fast, and effective.",
        guarantee: "No obligation — simple and affordable.",
        secondaryCta: "Visit our website for more info.",
      },
    },
    {
      id: "fallback_2",
      name: "The Problem Solver",
      style: "bold",
      front: {
        headline: "Tired of Management Headaches?",
        subHeadline: "We Buy Complex Assets",
        bodyCopy:
          "Deferred maintenance? High vacancy? Partnership disputes? We provide clean exits for challenging properties.",
        cta: "Get Solutions",
      },
      back: {
        headline: "Simplify Your Exit Today",
        benefits: ["We Take On The Risk", "No Repairs Needed", "Guaranteed Closing", "We Handle Evictions"],
        socialProof: "Solving complex real estate problems for 10+ years.",
        testimonial: "They solved a 2-year probate issue in weeks.",
        guarantee: "100% Confidential Process.",
        secondaryCta: "Scan to see our track record.",
      },
    },
    {
      id: "fallback_3",
      name: "Local Expert",
      style: "classic",
      front: {
        headline: `Your ${criteria.propertyType} Partner`,
        subHeadline: "Building Community Value",
        bodyCopy: "We specialize in unlocking value for owners like you. Let's discuss your asset's potential.",
        cta: "Visit Website",
      },
      back: {
        headline: "A Partnership Approach",
        benefits: ["Market Expertise", "Confidential Process", "Owner-to-Owner", "Local Knowledge"],
        socialProof: "Over $50M in local assets acquired.",
        testimonial: "Fair price and smooth transaction.",
        guarantee: "Your satisfaction is our priority.",
        secondaryCta: "Learn more about us.",
      },
    },
  ];
};

export const generateMailerCopy = async (criteria: BuyingCriteria): Promise<MailerDesign[]> => {
  // If API key missing, return fallback immediately
  if (!genAI) {
    console.warn("Gemini API key is missing. Using fallback content.");
    return getFallbackContent(criteria);
  }

  const location = formatLocation(criteria);

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
    "cta": "Subtle call to action (NO 'SCAN' CTA on front)"
  },
  "back": {
    "headline": "Secondary headline for the back side",
    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
    "socialProof": "Credibility statement (e.g. Trusted by 500+ owners)",
    "testimonial": "Short 1-sentence quote",
    "guarantee": "Reassurance line (e.g. No fees, no obligation)",
    "secondaryCta": "Secondary CTA (e.g. Scan to visit website)"
  }
}

Return ONLY valid JSON, no markdown formatting, no commentary.
`.trim();

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const designs = safeParseDesigns(text);

    // Strong sanity checks
    if (designs.length !== 3 || !designs.every(isDesignLike)) {
      console.warn("Gemini returned unexpected shape. Using fallback.");
      return getFallbackContent(criteria);
    }

    return designs;
  } catch (error) {
    console.error("Error generating copy:", error);
    return getFallbackContent(criteria);
  }
};
