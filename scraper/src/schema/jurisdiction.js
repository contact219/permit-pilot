// Shared schema definitions for scraper
// This would normally be imported from a shared package

export const jurisdictionSchema = {
  id: 'uuid',
  name: 'text',
  state: 'text',
  county: 'text',
  city: 'text',
  portalUrl: 'text',
  submissionMethod: 'text',
  avgReviewDays: 'integer',
  lastVerified: 'timestamp',
  verifiedBy: 'text',
  isActive: 'boolean',
};

// Helper to transform scraped data into database format
export function transformPermitData(rawData) {
  return {
    name: rawData.name,
    code: rawData.code,
    projectTypes: rawData.projectTypes || [],
    requiredDocs: rawData.requiredDocs || [],
    feeBase: parseFloat(rawData.feeBase) || null,
    feePerSqft: parseFloat(rawData.feePerSqft) || null,
    inspectionStages: rawData.inspectionStages || [],
    formUrls: rawData.formUrls || [],
    notes: rawData.notes || '',
    lastUpdated: new Date(),
  };
}