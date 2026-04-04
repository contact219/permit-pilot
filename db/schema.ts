import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, decimal } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("contractor"), // contractor | homeowner | admin
  companyName: text("company_name"),
  planTier: text("plan_tier").default("free"), // free | contractor | homeowner
  stripeCustomerId: text("stripe_customer_id"),
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
  verificationExpiry: timestamp("verification_expiry"),
  resetToken: text("reset_token"),
  resetExpiry: timestamp("reset_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jurisdictions = pgTable("jurisdictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),           // "Frisco, TX"
  state: text("state").notNull(),         // "TX"
  county: text("county"),
  city: text("city"),
  portalUrl: text("portal_url"),
  submissionMethod: text("submission_method"), // online | in-person | mail
  avgReviewDays: integer("avg_review_days"),
  lastVerified: timestamp("last_verified"),
  verifiedBy: text("verified_by"),        // scraper | human
  isActive: boolean("is_active").default(true),
});

export const permitTypes = pgTable("permit_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  jurisdictionId: uuid("jurisdiction_id").references(() => jurisdictions.id),
  name: text("name").notNull(),           // "Residential Addition - Building Permit"
  code: text("code"),                     // Internal code, e.g. "RES_ADD_BUILD"
  projectTypes: text("project_types").array(), // ["room_addition", "garage", ...]
  requiredDocs: jsonb("required_docs"),   // [{name, description, example_url}]
  feeBase: decimal("fee_base"),
  feePerSqft: decimal("fee_per_sqft"),
  inspectionStages: jsonb("inspection_stages"), // [{name, timing, notes}]
  formUrls: text("form_urls").array(),
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),  // Free-text user input
  projectType: text("project_type"),           // AI-classified
  jurisdictionId: uuid("jurisdiction_id").references(() => jurisdictions.id),
  squareFootage: integer("square_footage"),
  estimatedValue: decimal("estimated_value"),
  address: text("address"),
  status: text("status").default("draft"),     // draft | submitted | in_review | approved | active
  aiSummary: text("ai_summary"),               // Claude-generated plain English summary
  intakeData: jsonb("intake_data"),            // Raw form answers
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  shareToken: text("share_token"),
  naturalLanguageInput: text("natural_language_input"),
  bidEstimate: jsonb("bid_estimate"),
  conflictAnalysis: jsonb("conflict_analysis"),
  redFlags: jsonb("red_flags"),
  timelinePrediction: text("timeline_prediction"),
});

export const projectPermits = pgTable("project_permits", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  permitTypeId: uuid("permit_type_id").references(() => permitTypes.id),
  status: text("status").default("not_started"), // not_started | in_progress | submitted | approved
  applicationNumber: text("application_number"),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
  preFillData: jsonb("pre_fill_data"),
  inspectionReminderAt: timestamp("inspection_reminder_at"),
  reminderSent: boolean("reminder_sent").default(false),
  appliedAt: timestamp("applied_at"),
});

export const inspectionReminders = pgTable("inspection_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  projectPermitId: uuid("project_permit_id").references(() => projectPermits.id),
  userId: uuid("user_id").references(() => users.id),
  reminderType: text("reminder_type"),
  remindAt: timestamp("remind_at").notNull(),
  sentAt: timestamp("sent_at"),
  email: text("email"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scraperJobs = pgTable("scraper_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source"), // municipal, socrata, city-portals, or 'all'
  status: text("status").default("pending"), // pending | running | completed | failed
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  result: jsonb("result"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});
