import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { classes } from '../db/schema';
import { ClassInsert } from '../schema/classes';

import { HTTPException } from 'hono/http-exception';

import { eq, and, desc } from 'drizzle-orm';

type Bindings = {
	DB: D1Database;
};

const classRouter = new Hono<{ Bindings: Bindings }>();

classRouter.get('/:student_id/classes', async (c) => {
	const student_id = parseInt(c.req.param('student_id'));

	const db = drizzle(c.env.DB);
	const result = await db.select().from(classes).where(eq(classes.studentId, student_id)).all();

	return c.json(result);
});

classRouter.get('/:student_id/classes/latest', async (c) => {
	const student_id = parseInt(c.req.param('student_id'));

	const db = drizzle(c.env.DB);
	const result = await db.select().from(classes).where(eq(classes.studentId, student_id)).orderBy(desc(classes.createdAt)).get();

	if (!result) {
		throw new HTTPException(404, { message: 'Class not found' });
	}

	return c.json(result);
});

classRouter.get('/:student_id/classes/:class_id', async (c) => {
	const student_id = parseInt(c.req.param('student_id'));
	const class_id = parseInt(c.req.param('class_id'));

	if (isNaN(class_id)) {
		throw new HTTPException(400, { message: 'Invalid ID' });
	}

	const db = drizzle(c.env.DB);
	const result = await db
		.select()
		.from(classes)
		.where(and(eq(classes.studentId, student_id), eq(classes.id, class_id)))
		.get();

	if (!result) {
		throw new HTTPException(404, { message: 'Class not found' });
	}

	return c.json(result);
});

classRouter.post('/:student_id/classes', async (c) => {
	const body = await c.req.json<ClassInsert>();

	const db = drizzle(c.env.DB);
	const result = await db
		.insert(classes)
		.values({
			studentId: parseInt(c.req.param('student_id')),
			title: body.title,
			test: body.test,
			homework: body.homework,
			activityType: body.activityType,
			activity: body.activity,
			comprehension: body.comprehension,
		})
		.execute();

	return c.json(result);
});

classRouter.put('/:student_id/classes/:class_id', async (c) => {
	const student_id = parseInt(c.req.param('student_id'));
	const class_id = parseInt(c.req.param('class_id'));

	if (isNaN(class_id) || isNaN(student_id)) {
		throw new HTTPException(400, { message: 'Invalid ID' });
	}

	const body = await c.req.json<ClassInsert>();

	const db = drizzle(c.env.DB);
	const result = await db
		.update(classes)
		.set({
			title: body.title,
			test: body.test,
			homework: body.homework,
			activityType: body.activityType,
			activity: body.activity,
			comprehension: body.comprehension,
		})
		.where(and(eq(classes.studentId, student_id), eq(classes.id, class_id)))
		.returning({ class_id: classes.id })
		.get();

	if (!result) {
		throw new HTTPException(404, { message: 'Class not found' });
	}

	return c.json(result);
});

classRouter.delete('/:student_id/classes/:class_id', async (c) => {
	const class_id = parseInt(c.req.param('class_id'));
	const student_id = parseInt(c.req.param('student_id'));

	if (isNaN(class_id) || isNaN(student_id)) {
		throw new HTTPException(400, { message: 'Invalid ID' });
	}

	const db = drizzle(c.env.DB);
	const result = await db
		.delete(classes)
		.where(and(eq(classes.studentId, student_id), eq(classes.id, class_id)))
		.returning({ class_id: classes.id })
		.get();

	if (!result) {
		throw new HTTPException(404, { message: 'Class not found' });
	}

	return c.json(result);
});

export default classRouter;
