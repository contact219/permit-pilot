import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export interface ProjectIntake {
  description: string;
  projectType?: string;
  squareFootage?: number;
  address: string;
  jurisdiction: string;
  estimatedValue?: number;
  isCommercial: boolean;
  existingStructure: boolean;
}

export interface PermitAnalysis {
  projectClassification: string;
  requiredPermits: Array<{
    name: string;
    code: string;
    reason: string;
    priority: 'required' | 'likely_required' | 'may_be_required';
  }>;
  redFlags: string[];
  estimatedTimeline: string;
  plainEnglishSummary: string;
  questionsForContractor: string[];
}

export async function analyzeProject(
  intake: ProjectIntake,
  jurisdictionData: any
): Promise<PermitAnalysis> {
  const prompt = `You are a permit expediting expert with deep knowledge of US building codes and local permit requirements.

A contractor or homeowner has described the following project:

PROJECT DESCRIPTION: ${intake.description}
ADDRESS: ${intake.address}
JURISDICTION: ${intake.jurisdiction}
SQUARE FOOTAGE: ${intake.squareFootage ?? 'not specified'}
ESTIMATED VALUE: ${intake.estimatedValue ? `$${intake.estimatedValue}` : 'not specified'}
IS COMMERCIAL: ${intake.isCommercial}
INVOLVES EXISTING STRUCTURE: ${intake.existingStructure}

JURISDICTION DATA FROM OUR DATABASE:
${JSON.stringify(jurisdictionData, null, 2)}

Analyze this project and respond with a JSON object matching this exact structure:
{
  "projectClassification": "string — classify the project type precisely",
  "requiredPermits": [
    {
      "name": "string — full permit name",
      "code": "string — short code like BLDG, ELEC, MECH, PLMB",
      "reason": "string — plain English explanation of why this permit is needed",
      "priority": "required | likely_required | may_be_required"
    }
  ],
  "redFlags": ["string — potential complications, special zones, unusual requirements"],
  "estimatedTimeline": "string — realistic timeline from application to approval",
  "plainEnglishSummary": "string — 2-3 sentence summary a non-expert can understand",
  "questionsForContractor": ["string — clarifying questions that would affect permit requirements"]
}

Be specific to this jurisdiction. If jurisdiction data is missing for a permit type, flag it in redFlags.
Only return valid JSON. No preamble or explanation outside the JSON.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as PermitAnalysis;
}

export async function generatePreFillData(
  intake: ProjectIntake,
  permitType: any
): Promise<Record<string, string>> {
  const prompt = `You are filling out a building permit application form.

PROJECT INFO:
${JSON.stringify(intake, null, 2)}

PERMIT FORM FIELDS (from the official application):
${JSON.stringify(permitType.formFields ?? [], null, 2)}

Extract and infer values for each form field from the project info.
Return a JSON object where keys are field names and values are the pre-filled answers.
If a field cannot be determined from the available info, set the value to "REQUIRED — please complete".
Only return valid JSON.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
