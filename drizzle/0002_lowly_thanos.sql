CREATE TABLE "firmware_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" text NOT NULL,
	"blob_url" text NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "firmware_versions_version_unique" UNIQUE("version")
);
--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "pending_command" text;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "pending_command_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "fast_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "firmware_versions" ADD CONSTRAINT "firmware_versions_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;