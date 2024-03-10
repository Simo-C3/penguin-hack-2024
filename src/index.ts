import { Hono } from 'hono';
import { VerifyFirebaseAuthConfig, VerifyFirebaseAuthEnv, verifyFirebaseAuth, getFirebaseToken } from '@hono/firebase-auth';
import routers from './routers';
import { cors } from 'hono/cors';

const config: VerifyFirebaseAuthConfig = {
	projectId: 'penguin-hack-2024',
};

const hono = new Hono<{ Bindings: VerifyFirebaseAuthEnv }>();

hono.use(
	'*',
	cors({
		origin: '*',
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Authorization'],
		allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

hono.get('/health', (c) => {
	return c.json({ message: 'Hello, World!' });
});

hono.use('/api/v1/*', verifyFirebaseAuth(config));

hono.route('/api/v1', routers);

export default hono;
