CREATE TYPE "public"."account_type_enum" AS ENUM('student', 'org', 'guest', 'admin');--> statement-breakpoint
CREATE TYPE "public"."blog_discoverable_enum" AS ENUM('public', 'campus', 'private');--> statement-breakpoint
CREATE TYPE "public"."campus_enum" AS ENUM('MC', 'IRC', 'CVC', 'CARC', 'CLC', 'CBZRC', 'MRC', 'BRC', 'WVC', 'CVisC', 'EVC', 'CMC', 'SMC', 'SRC', 'CRC', 'ZRC');--> statement-breakpoint
CREATE TYPE "public"."friend_status_enum" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."grade_enum" AS ENUM('7', '8', '9', '10', '11', '12');--> statement-breakpoint
CREATE TYPE "public"."info_privacy_enum" AS ENUM('public', 'private', 'friends-only');--> statement-breakpoint
CREATE TYPE "public"."privacy_enum" AS ENUM('public', 'private', 'friends-only');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(32) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"profile_handle" varchar(100) NOT NULL,
	"campus" "campus_enum" NOT NULL,
	"grade_level" "grade_enum" NOT NULL,
	"account_type" "account_type_enum" DEFAULT 'student' NOT NULL,
	"bio" varchar(300),
	"profile_pic_url" text,
	"privacy_level" "privacy_enum" DEFAULT 'public' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_profile_handle_unique" UNIQUE("profile_handle")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "friends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requester_id" uuid NOT NULL,
	"addressee_id" uuid NOT NULL,
	"status" "friend_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "friends" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(300) NOT NULL,
	"content" text NOT NULL,
	"published_at" timestamp,
	"is_discoverable" "blog_discoverable_enum" DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "blogs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_addressee_id_users_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "friends_requester_idx" ON "friends" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "friends_addressee_idx" ON "friends" USING btree ("addressee_id");--> statement-breakpoint
CREATE INDEX "friends_status_idx" ON "friends" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "blogs_author_slug_idx" ON "blogs" USING btree ("author_id","slug");--> statement-breakpoint
CREATE INDEX "blogs_discoverable_idx" ON "blogs" USING btree ("is_discoverable");--> statement-breakpoint
CREATE INDEX "blogs_author_idx" ON "blogs" USING btree ("author_id");--> statement-breakpoint
CREATE POLICY "select_own_user" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING (id = auth.uid());--> statement-breakpoint
CREATE POLICY "select_public_profiles" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING (privacy_level = 'public');--> statement-breakpoint
CREATE POLICY "update_own_user" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (id = auth.uid()) WITH CHECK (id = auth.uid());--> statement-breakpoint
CREATE POLICY "insert_user_service_only" ON "users" AS PERMISSIVE FOR INSERT TO "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "select_own_friendships" ON "friends" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    );--> statement-breakpoint
CREATE POLICY "insert_friend_request" ON "friends" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
      requester_id = auth.uid()
    );--> statement-breakpoint
CREATE POLICY "update_friendship_status" ON "friends" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    ) WITH CHECK (
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    );--> statement-breakpoint
CREATE POLICY "delete_own_friendship" ON "friends" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
      requester_id = auth.uid()
      OR addressee_id = auth.uid()
    );--> statement-breakpoint
CREATE POLICY "select_blogs" ON "blogs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (deleted_at IS NULL AND (is_discoverable = true OR author_id = auth.uid()));--> statement-breakpoint
CREATE POLICY "insert_own_blog" ON "blogs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (author_id = auth.uid());--> statement-breakpoint
CREATE POLICY "update_own_blog" ON "blogs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());--> statement-breakpoint
CREATE POLICY "delete_own_blog" ON "blogs" AS PERMISSIVE FOR DELETE TO "authenticated" USING (author_id = auth.uid());