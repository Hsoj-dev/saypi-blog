CREATE TYPE "public"."notification_type_enum" AS ENUM('friend_request', 'friend_accept', 'blog_upvote', 'admin_announcement', 'profile_milestone');--> statement-breakpoint
ALTER TYPE "public"."friend_status_enum" ADD VALUE 'blocked';--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" uuid NOT NULL,
	"actor_id" uuid,
	"type" "notification_type_enum" NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_blog_upvote_notification" ON "notifications" USING btree ("recipient_id","actor_id","entity_id","type");--> statement-breakpoint
CREATE INDEX "notifications_recipient_idx" ON "notifications" USING btree ("recipient_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_unread_idx" ON "notifications" USING btree ("recipient_id","read_at");--> statement-breakpoint
CREATE POLICY "read_own_notifications" ON "notifications" AS PERMISSIVE FOR SELECT TO "authenticated" USING (recipient_id = auth.uid());--> statement-breakpoint
CREATE POLICY "update_own_notifications" ON "notifications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (recipient_id = auth.uid()) WITH CHECK (recipient_id = auth.uid());