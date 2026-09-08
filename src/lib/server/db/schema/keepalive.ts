/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */

import { pgTable, integer, pgPolicy } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
 
 export const keepalive = pgTable('keepalive', {
	id: integer('id').primaryKey(),
 }, () => [
	pgPolicy('Allow public read for keepalive', {
		for: 'select',
		to: ['anon', 'authenticated'],
		using: sql`true`,
	}),
]).enableRLS();
 