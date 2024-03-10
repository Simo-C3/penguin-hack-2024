import { sql, relations } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	memo: text('memo').default(''),
});

export const classes = sqliteTable('classes', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	studentId: integer('student_id', { mode: 'number' }).notNull(),
	title: text('title').notNull(),
	test: text('test'),
	homework: text('homework'),
	activityType: text('activity_type'),
	activity: text('activity'),
	comprehension: text('comprehension'),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const masterRelations = relations(students, ({ many }) => ({
	classes: many(classes),
}));

export const subRelations = relations(classes, ({ one }) => ({
	createdUser: one(students, {
		fields: [classes.studentId],
		references: [students.id],
	}),
}));
