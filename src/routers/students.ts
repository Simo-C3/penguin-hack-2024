import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';

import classRouter from './classes';
import { students } from '../db/schema';

import { StudentInsert } from '../schema/students';

import { HTTPException } from 'hono/http-exception';

import { eq } from 'drizzle-orm';

type Bindings = {
	DB: D1Database;
};

const studentRouter = new Hono<{ Bindings: Bindings }>();

studentRouter.get('/', async (c) => {
	const db = drizzle(c.env.DB);
	const result = await db.select().from(students).all();

	return c.json(result);
});

studentRouter.get('/:id', async (c) => {
	const id = parseInt(c.req.param('id'));

	if (isNaN(id)) {
		throw new HTTPException(400, { message: 'Invalid ID' });
	}

	const db = drizzle(c.env.DB);
	const result = await db.select().from(students).where(eq(students.id, id)).get();

	if (!result) {
		throw new HTTPException(404, { message: 'Student not found' });
	}

	return c.json(result);
});

studentRouter.post('/', async (c) => {
	const body = await c.req.json<StudentInsert>();

	const db = drizzle(c.env.DB);
	const result = await db.insert(students).values({ name: body.name, memo: body.memo }).execute();

	return c.json(result);
});

studentRouter.put('/:id', async (c) => {
	const id = parseInt(c.req.param('id'));

	if (isNaN(id)) {
		throw new HTTPException(400, { message: 'Invalid ID' });
	}

	const body = await c.req.json<StudentInsert>();

	const db = drizzle(c.env.DB);

	const result = await db
		.update(students)
		.set({ name: body.name, memo: body.memo })
		.where(eq(students.id, id))
		.returning({ updatedId: students.id })
		.get();

	if (!result) {
		throw new HTTPException(404, { message: 'Student not found' });
	}

	return c.json(result);
});

studentRouter.delete('/:id', async (c) => {
	const id = parseInt(c.req.param('id'));

	if (isNaN(id)) {
		throw new HTTPException(400, { message: 'Invalid ID' });
	}

	const db = drizzle(c.env.DB);
	const result = await db.delete(students).where(eq(students.id, id)).returning({ deletedId: students.id }).get();

	if (!result) {
		throw new HTTPException(404, { message: 'Student not found' });
	}

	return c.json(result);
});

studentRouter.route('/', classRouter);

export default studentRouter;
