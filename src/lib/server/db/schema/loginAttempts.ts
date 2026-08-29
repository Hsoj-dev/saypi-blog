/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */

 import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
 
 export const loginAttempts = pgTable('login_attempts', {
   key: text("key").primaryKey(),
   count: integer("count").notNull().default(1),
   windowStart: timestamp("window_start").notNull().defaultNow()
 });
 