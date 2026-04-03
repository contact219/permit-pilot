import { and, eq } from "drizzle-orm";
import { db } from "../src/server/db";
import { jurisdictions, permitTypes } from "./schema";
import seedJurisdictions from "./seeds/jurisdictions.json";

type SeedPermitType = {
  name: string;
  code?: string;
  projectTypes?: string[];
  requiredDocs?: unknown;
  feeBase?: number;
  feePerSqft?: number;
  inspectionStages?: unknown;
  formUrls?: string[];
};

type SeedJurisdiction = {
  name: string;
  state: string;
  county?: string;
  city?: string;
  portalUrl?: string;
  submissionMethod?: string;
  avgReviewDays?: number;
  permitTypes?: SeedPermitType[];
};

async function upsertJurisdiction(seed: SeedJurisdiction) {
  const { permitTypes: permitSeedData, ...jurisdictionData } = seed;

  const existing = await db
    .select({ id: jurisdictions.id })
    .from(jurisdictions)
    .where(and(eq(jurisdictions.name, seed.name), eq(jurisdictions.state, seed.state)))
    .limit(1);

  const jurisdictionId = existing[0]?.id
    ? existing[0].id
    : (
        await db
          .insert(jurisdictions)
          .values(jurisdictionData)
          .returning({ id: jurisdictions.id })
      )[0].id;

  if (!permitSeedData?.length) {
    return;
  }

  for (const permit of permitSeedData) {
    const existingPermit = await db
      .select({ id: permitTypes.id })
      .from(permitTypes)
      .where(
        and(
          eq(permitTypes.jurisdictionId, jurisdictionId),
          eq(permitTypes.name, permit.name),
        ),
      )
      .limit(1);

    if (existingPermit[0]?.id) {
      continue;
    }

    await db.insert(permitTypes as any).values({ ...permit, jurisdictionId } as any);
  }
}

async function seed() {
  for (const jurisdiction of seedJurisdictions as SeedJurisdiction[]) {
    await upsertJurisdiction(jurisdiction);
  }

  console.log("Seeded jurisdiction data");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
