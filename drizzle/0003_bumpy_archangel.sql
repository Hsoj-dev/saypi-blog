CREATE TYPE "public"."sex_enum" AS ENUM('male', 'female');--> statement-breakpoint
ALTER TYPE "public"."account_type_enum" ADD VALUE 'mod' BEFORE 'admin';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sex" "sex_enum" NOT NULL;