import type { Config } from 'drizzle-kit';

const cfConfig = {
	schema: './src/schema.ts',
	out: './drizzle/migrations',
	driver: 'd1',
	dbCredentials: {
		wranglerConfigPath: 'wrangler.toml',
		dbName: 'penguin-hack-2024',
	},
	verbose: false,
	strict: true,
} satisfies Config;

const localConfig = {
	schema: './src/schema.ts',
	out: './drizzle/migrations',
	driver: 'better-sqlite',
	dbCredentials: {
		url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/74edd68106547ec2a7f84dc7b9556ef33d700c874345e25ac6e70e351794625c.sqlite',
	},
} satisfies Config;

export default process.env.NODE_ENV === 'production' ? cfConfig : localConfig;
