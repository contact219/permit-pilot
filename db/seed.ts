import { db } from "../src/server/db";
import { jurisdictions, permitTypes } from "./schema";

const seedJurisdictions = [
  {
    name: "Frisco, TX",
    state: "TX",
    county: "Collin",
    city: "Frisco",
    portalUrl: "https://www.friscotexas.gov/1489/Building-Permits",
    submissionMethod: "online",
    avgReviewDays: 10,
    permitTypes: [
      {
        name: "Residential Building Permit",
        code: "RES_BLDG",
        projectTypes: ["room_addition", "new_construction", "garage", "adu"],
        requiredDocs: [
          { name: "Site Plan", description: "Dimensioned plot plan showing property lines, setbacks, and structure footprint" },
          { name: "Floor Plan", description: "Dimensioned drawings of all affected areas" },
          { name: "Elevation Drawings", description: "All four exterior elevations" },
          { name: "Energy Compliance", description: "Texas Energy Code compliance documentation (Manual J for HVAC)" }
        ],
        feeBase: 150,
        feePerSqft: 0.18,
        formUrls: [
          "https://www.friscotexas.gov/DocumentCenter/View/9383/Building-Permit-Application-PDF"
        ],
        inspectionStages: [
          { name: "Foundation", timing: "Before pour" },
          { name: "Frame", timing: "Before drywall" },
          { name: "Final", timing: "Before occupancy" }
        ]
      },
      {
        name: "Electrical Permit",
        code: "ELEC",
        projectTypes: ["room_addition", "electrical_upgrade", "new_construction"],
        requiredDocs: [
          { name: "Electrical Plan", description: "Panel schedule and circuit diagram" }
        ],
        feeBase: 75,
        feePerSqft: 0.05,
        formUrls: [
          "https://www.friscotexas.gov/DocumentCenter/View/9384/Electrical-Permit-Application-PDF"
        ]
      },
      {
        name: "Mechanical Permit",
        code: "MECH",
        projectTypes: ["hvac_replacement", "room_addition", "new_construction"],
        requiredDocs: [
          { name: "Equipment Specs", description: "Manufacturer specs for all HVAC equipment" },
          { name: "Manual J Calculation", description: "Load calculation for new/modified zones" }
        ],
        feeBase: 65,
        formUrls: [
          "https://www.friscotexas.gov/DocumentCenter/View/9385/Mechanical-Permit-Application-PDF"
        ]
      },
      {
        name: "Plumbing Permit",
        code: "PLMB",
        projectTypes: ["plumbing_modification", "room_addition", "new_construction"],
        requiredDocs: [
          { name: "Plumbing Plan", description: "Isometric diagram of all new/modified lines" }
        ],
        feeBase: 65,
        formUrls: [
          "https://www.friscotexas.gov/DocumentCenter/View/9386/Plumbing-Permit-Application-PDF"
        ]
      }
    ]
  },
  {
    name: "McKinney, TX",
    state: "TX",
    county: "Collin",
    city: "McKinney",
    portalUrl: "https://www.mckinneytexas.org/386/Building-Permits",
    submissionMethod: "online",
    avgReviewDays: 12
  },
  {
    name: "Allen, TX",
    state: "TX",
    county: "Collin",
    city: "Allen",
    portalUrl: "https://www.cityofallen.org/257/Building-Permits",
    submissionMethod: "online",
    avgReviewDays: 8
  },
  {
    name: "Plano, TX",
    state: "TX",
    county: "Collin",
    city: "Plano",
    portalUrl: "https://www.plano.gov/254/Building-Permits",
    submissionMethod: "online",
    avgReviewDays: 15
  },
  {
    name: "Wylie, TX",
    state: "TX",
    county: "Collin",
    city: "Wylie",
    portalUrl: "https://www.wylietexas.gov/186/Building-Permits",
    submissionMethod: "in-person",
    avgReviewDays: 7
  }
];

async function seed() {
  for (const j of seedJurisdictions) {
    const { permitTypes: ptData, ...jurisdictionData } = j;
    const [jurisdiction] = await db.insert(jurisdictions).values(jurisdictionData).returning();
    
    if (ptData) {
      for (const pt of ptData) {
        await db.insert(permitTypes as any).values({
          ...pt,
          jurisdictionId: jurisdiction.id
        });
      }
    }
  }
  console.log("Seeded jurisdictions and permit types");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});