ALTER TABLE "notifications" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."notification_type_enum";--> statement-breakpoint
CREATE TYPE "public"."notification_type_enum" AS ENUM('friend_request', 'friend_accept', 'blog_upvote', 'admin_announcement');--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "type" SET DATA TYPE "public"."notification_type_enum" USING "type"::"public"."notification_type_enum";--> statement-breakpoint
CREATE INDEX "users_privacy_level_idx" ON "users" USING btree ("privacy_level");--> statement-breakpoint
ALTER POLICY "select_visible_profiles" ON "user_profiles" TO authenticated USING (
      user_id = auth.uid()
    
      OR EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = user_profiles.user_id
          AND (
            u.privacy_level = 'public'
            OR (
              u.privacy_level = 'friends-only'
              AND is_friend(auth.uid(), user_profiles.user_id)
            )
          )
      )
    );--> statement-breakpoint
ALTER POLICY "select_blogs" ON "blogs" TO authenticated USING (deleted_at IS NULL AND (is_discoverable = 'public' OR author_id = auth.uid()));