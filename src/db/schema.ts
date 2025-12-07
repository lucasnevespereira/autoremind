import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from "drizzle-orm/pg-core";

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  resource: text("resource").notNull(),
  reminderDate: timestamp("reminder_date", { mode: "date" }).notNull(),
  reminderSent: boolean("reminder_sent").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Settings table - one row per user with structured fields
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id)
    .unique(), // Ensure one settings row per user

  // Business settings
  businessName: text("business_name"),
  businessContact: text("business_contact"),
  reminderDaysBefore: integer("reminder_days_before").default(7),

  // Twilio settings
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  twilioPhoneNumber: text("twilio_phone_number"),
  useManagedSms: boolean("use_managed_sms").default(false).notNull(),

  // SMS template
  smsTemplate: text("sms_template"),

  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Subscriptions table - one row per user for Stripe subscription tracking
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id)
    .unique(), // Ensure one subscription row per user

  // Stripe IDs
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),

  // Subscription details
  planType: text("plan_type").notNull().default("free"), // "free" | "starter" | "pro"
  status: text("status").notNull().default("active"), // "active" | "canceled" | "past_due" | "incomplete"
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// User table for better-auth
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// Session table for better-auth
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

// Account table for better-auth
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: "date" }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    mode: "date",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

// Verification table for better-auth
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Types
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
