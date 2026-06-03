CREATE TABLE "saved_locations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"zoom" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_locations" ADD CONSTRAINT "saved_locations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;