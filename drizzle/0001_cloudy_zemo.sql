CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"status_update" text,
	"pronouns" varchar(50),
	"home_city" varchar(100),
	"elementary_school" varchar(255),
	"section" varchar(100),
	"core_courses" text,
	"electives" text,
	"house" varchar(100),
	"personality" text,
	"hobbies" text,
	"interests" text,
	"likes" text,
	"dislikes" text,
	"goals" text,
	"about_me" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_info_privacy" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"basic" "info_privacy_enum" DEFAULT 'public' NOT NULL,
	"contact" "info_privacy_enum" DEFAULT 'public' NOT NULL,
	"student" "info_privacy_enum" DEFAULT 'public' NOT NULL,
	"personal" "info_privacy_enum" DEFAULT 'public' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_info_privacy" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_info_privacy" ADD CONSTRAINT "user_info_privacy_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select_visible_profiles" ON "user_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1
        FROM users u
        WHERE u.id = user_profiles.user_id
        AND u.privacy_level = 'public'
      )
    );--> statement-breakpoint
CREATE POLICY "update_own_profile" ON "user_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "insert_own_profile" ON "user_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "delete_own_profile" ON "user_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "select_own_privacy" ON "user_info_privacy" AS PERMISSIVE FOR SELECT TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "insert_own_privacy" ON "user_info_privacy" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "update_own_privacy" ON "user_info_privacy" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());