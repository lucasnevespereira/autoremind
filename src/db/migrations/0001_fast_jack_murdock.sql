ALTER TABLE "clients" RENAME COLUMN "car" TO "resource";--> statement-breakpoint
ALTER TABLE "clients" RENAME COLUMN "revision_date" TO "reminder_date";--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "email" text;