CREATE TABLE "upvotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"upvoter_id" uuid NOT NULL,
	"blog_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "upvotes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_upvoter_id_users_id_fk" FOREIGN KEY ("upvoter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "upvotes_user_blog_unique_idx" ON "upvotes" USING btree ("upvoter_id","blog_id");--> statement-breakpoint
CREATE POLICY "select_upvotes" ON "upvotes" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "insert_own_upvote" ON "upvotes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (upvoter_id = auth.uid());--> statement-breakpoint
CREATE POLICY "remove_own_upvote" ON "upvotes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (upvoter_id = auth.uid());