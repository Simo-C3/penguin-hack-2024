import { Hono } from 'hono';

import studentRouter from './students';

const routers = new Hono();

routers.route('/students', studentRouter);

export default routers;
