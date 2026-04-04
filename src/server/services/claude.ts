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
  bidEstimate?: { totalFees: number; breakdown: Array<{ permit: string; fee: number; notes: string }> };
  conflictAnalysis?: { hasConflicts: boolean; conflicts: Array<{ permits: string[]; issue: string; resolution: string }> };
  inspectionSequence?: Array<{ stage: string; timing: string; permits: string[]; notes: string }>;
  timelinePrediction?: string;
}

export async function parseNaturalLanguageProject(input: string, jurisdiction: string): Promise<{
  projectName: string;
  projectType: string;
  description: string;
  squareFootage?: number;
  estimatedValue?: number;
  isCommercial: boolean;
  existingStructure: boolean;
  inHistoric: boolean;
  inFloodZone: boolean;
  address?: string;
  confidence: number;
  clarifyingQuestions: string[];
}> {
  const prompt = `You are a permit intake specialist. A contractor or homeowner described their project in plain English.

Extract structured project information from this description:
"${input}"

Jurisdiction: ${jurisdiction}

Return ONLY valid JSON matching this structure:
{
  "projectName": "short descriptive name for the project",
  "projectType": "one of: room_addition|new_construction|garage|adu|deck_patio|roof_replacement|electrical_upgrade|plumbing_modification|hvac_replacement|fence|pool|demolition|commercial_remodel|other",
  "description": "cleaned up detailed description",
  "squareFootage": number or null,
  "estimatedValue": number or null,
  "isCommercial": boolean,
  "existingStructure": boolean,
  "inHistoric": false,
  "inFloodZone": false,
  "address": "address if mentioned or null",
  "confidence": 0.0-1.0,
  "clarifyingQuestions": ["questions needed to complete the intake"]
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export async function analyzeProject(intake: ProjectIntake, jurisdictionData: any): Promise<PermitAnalysis> {
  const prompt = `You are a permit expediting expert with deep knowledge of Texas building codes and local permit requirements.

PROJECT DESCRIPTION: ${intake.description}
ADDRESS: ${intake.address}
JURISDICTION: ${intake.jurisdiction}
SQUARE FOOTAGE: ${intake.squareFootage ?? 'not specified'}
ESTIMATED VALUE: ${intake.estimatedValue ? `$${intake.estimatedValue}` : 'not specified'}
IS COMMERCIAL: ${intake.isCommercial}
INVOLVES EXISTING STRUCTURE: ${intake.existingStructure}

JURISDICTION DATA:
${JSON.stringify(jurisdictionData, null, 2)}

Analyze this project thoroughly. Return ONLY valid JSON:
{
  "projectClassification": "precise project type classification",
  "requiredPermits": [
    {
      "name": "full permit name",
      "code": "BLDG|ELEC|MECH|PLMB|POOL|DECK|ROOF|FENCE|FNCE|GAS|DEMO|SIGN|COMM|FIRE",
      "reason": "plain English explanation",
      "priority": "required|likely_required|may_be_required"
    }
  ],
  "redFlags": [
    "specific warnings about setbacks, HOA, historic districts, flood zones, survey requirements, etc."
  ],
  "estimatedTimeline": "realistic timeline from application to approval with specifics",
  "plainEnglishSummary": "2-3 sentence summary a homeowner can understand",
  "questionsForContractor": ["clarifying questions that affect permit requirements"],
  "bidEstimate": {
    "totalFees": estimated total permit fees in dollars,
    "breakdown": [
      { "permit": "permit name", "fee": estimated fee, "notes": "fee basis explanation" }
    ]
  },
  "conflictAnalysis": {
    "hasConflicts": boolean,
    "conflicts": [
      { "permits": ["permit1", "permit2"], "issue": "description of conflict", "resolution": "how to resolve" }
    ]
  },
  "inspectionSequence": [
    { "stage": "inspection name", "timing": "when in project", "permits": ["which permits"], "notes": "what inspector checks" }
  ],
  "timelinePrediction": "detailed week-by-week timeline prediction including plan review, corrections, inspections"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text.replace(/```json|```/g, '').trim()) as PermitAnalysis;
}

export async function generatePreFillData(intake: ProjectIntake, permitType: any): Promise<Record<string, string>> {
  const prompt = `You are filling out a building permit application form.

PROJECT INFO:
${JSON.stringify(intake, null, 2)}

PERMIT FORM FIELDS:
${JSON.stringify(permitType.formFields ?? [], null, 2)}

Extract and infer values for each form field from the project info.
Return a JSON object where keys are field names and values are the pre-filled answers.
If a field cannot be determined, set the value to "REQUIRED — please complete".
Only return valid JSON.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export async function generateApplicationPacket(project: any, permits: any[], jurisdiction: any): Promise<{
  coverSheet: string;
  submissionInstructions: string;
  documentChecklist: Array<{ document: string; required: boolean; notes: string; whereToGet: string }>;
  feePaymentInstructions: string;
  estimatedTotalFees: number;
}> {
  const prompt = `You are a permit expediter creating a complete application packet for a contractor.

PROJECT: ${project.name}
ADDRESS: ${project.address}
JURISDICTION: ${jurisdiction.name}
PORTAL: ${jurisdiction.portalUrl || 'contact city directly'}
SUBMISSION METHOD: ${jurisdiction.submissionMethod || 'check with city'}
PERMITS NEEDED: ${permits.map((p: any) => p.pt?.name || p.name).join(', ')}

Create a complete application packet guide. Return ONLY valid JSON:
{
  "coverSheet": "formatted cover sheet text the contractor can print",
  "submissionInstructions": "step by step how to submit to this specific jurisdiction",
  "documentChecklist": [
    {
      "document": "document name",
      "required": true|false,
      "notes": "specific requirements for this document",
      "whereToGet": "how/where to obtain this document"
    }
  ],
  "feePaymentInstructions": "how to pay permit fees in this jurisdiction",
  "estimatedTotalFees": total estimated fees as number
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}
