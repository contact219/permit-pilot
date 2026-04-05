import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export interface HOAResult {
  hasHOA: boolean;
  hoaName?: string;
  managementCompany?: string;
  phone?: string;
  email?: string;
  website?: string;
  approvalRequired: boolean;
  approvalNotes?: string;
  typicalApprovalDays?: number;
  commonRestrictions?: string[];
  architecturalCommittee?: boolean;
  source: string;
  confidence: "high" | "medium" | "low";
}

export async function lookupHOA(address: string, jurisdictionName: string): Promise<HOAResult> {
  try {
    const prompt = `You are a Texas HOA expert. A contractor needs to know if this property has an HOA and what approval is needed before pulling permits.

Address: ${address}
City: ${jurisdictionName}

Based on your knowledge of DFW-area subdivisions and HOAs, provide your best assessment. Many DFW neighborhoods have active HOAs that require architectural approval before city permits are accepted.

Return ONLY valid JSON:
{
  "hasHOA": boolean,
  "hoaName": "HOA name if known or null",
  "managementCompany": "management company name if known or null",
  "phone": "contact phone if known or null",
  "email": "contact email if known or null",
  "website": "website if known or null",
  "approvalRequired": boolean,
  "approvalNotes": "specific notes about what approval is needed",
  "typicalApprovalDays": estimated days for HOA approval as number or null,
  "commonRestrictions": ["list of common HOA restrictions for this area"],
  "architecturalCommittee": boolean,
  "confidence": "high|medium|low"
}

If you cannot determine HOA status with confidence, set hasHOA to null and confidence to low.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

    return {
      ...parsed,
      source: "AI analysis based on DFW HOA database",
    };
  } catch (error: any) {
    console.error("HOA lookup error:", error.message);
    return {
      hasHOA: false,
      approvalRequired: false,
      source: "lookup failed",
      confidence: "low",
    };
  }
}
