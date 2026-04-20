CREATE TYPE "public"."entity_type_enum" AS ENUM('blog', 'user', 'announcement');--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "entity_type" SET DATA TYPE "public"."entity_type_enum" USING "entity_type"::"public"."entity_type_enum";--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "upvotes_count" integer DEFAULT 0 NOT NULL;