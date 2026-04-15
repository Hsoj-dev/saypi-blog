CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_campus_idx" ON "users" USING btree ("campus");--> statement-breakpoint
CREATE INDEX "users_grade_idx" ON "users" USING btree ("grade_level");