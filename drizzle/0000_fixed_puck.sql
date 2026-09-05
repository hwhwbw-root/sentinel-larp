CREATE TYPE "public"."device_type" AS ENUM('CO2', 'H2');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('Superadmin', 'Admin', 'Viewer');--> statement-breakpoint
CREATE TABLE "device_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"box_id" text NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"box_id" text NOT NULL,
	"device_type" "device_type" NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"alias" text,
	"alert_threshold" double precision,
	"dangerous_threshold" double precision,
	"cal_a" double precision,
	"cal_b" double precision,
	"api_key_hash" text NOT NULL,
	"last_seen" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "devices_box_id_unique" UNIQUE("box_id")
);
--> statement-breakpoint
CREATE TABLE "environment_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"box_id" text NOT NULL,
	"gas_value" double precision NOT NULL,
	"temperature" double precision,
	"humidity" double precision,
	"alert" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"receive_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "firmware_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" text NOT NULL,
	"blob_url" text NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "firmware_versions_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'Viewer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "firmware_versions" ADD CONSTRAINT "firmware_versions_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "device_logs_box_id_created_at_idx" ON "device_logs" USING btree ("box_id","created_at");--> statement-breakpoint
CREATE INDEX "environment_data_box_id_created_at_idx" ON "environment_data" USING btree ("box_id","created_at");