/*
 * Part of the Saypi-Blog project.
 *
 * Copyright (c) 2026 Saypi Studio
 * Licensed under the Saypi-Blog Source Available License 1.0 (SSAL-1.0).
 *
 * See the LICENSE file in the project root for license information.
 */

 import { pgTable, integer } from 'drizzle-orm/pg-core';
 
 export const keepalive = pgTable('keepalive', {
	id: integer('id').primaryKey(),
 }).enableRLS();