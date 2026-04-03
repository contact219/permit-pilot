import { and, eq } from "drizzle-orm";
import { db } from "../src/server/db";
import { jurisdictions, permitTypes } from "./schema";
import seedJurisdictions from "./seeds/jurisdictions.json";

const targetNameArgIndex = process.argv.findIndex((arg) => arg === "--name");
const targetName =
  targetNameArgIndex >= 0 ? process.argv[targetNameArgIndex + 1] : undefined;

if (!targetName) {
  console.error("Usage: npm run db:seed:jurisdiction -- --name \"City, ST\"");
  process.exit(1);
}

const jurisdictionSeed = (seedJurisdictions as Array<any>).find(
  (j) => j.name.toLowerCase() === targetName.toLowerCase(),
);

if (!jurisdictionSeed) {
  console.error(`No seed data found for jurisdiction: ${targetName}`);
  process.exit(1);
}

async function run() {
  const { permitTypes: permitSeedData, ...jurisdictionData } = jurisdictionSeed;

  const existing = await db
    .select({ id: jurisdictions.id })
    .from(jurisdictions)
    .where(
      and(
        eq(jurisdictions.name, jurisdictionSeed.name),
        eq(jurisdictions.state, jurisdictionSeed.state),
      ),
    )
    .limit(1);

  const jurisdictionId = existing[0]?.id
    ? existing[0].id
    : (
        await db
          .insert(jurisdictions)
          .values(jurisdictionData)
          .returning({ id: jurisdictions.id })
      )[0].id;

  if (Array.isArray(permitSeedData)) {
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

      if (!existingPermit[0]?.id) {
        await db.insert(permitTypes as any).values({ ...permit, jurisdictionId } as any);
      }
    }
  }

  console.log(`Seeded jurisdiction: ${jurisdictionSeed.name}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
