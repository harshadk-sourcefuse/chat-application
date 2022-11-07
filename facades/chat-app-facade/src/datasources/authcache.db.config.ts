import { AuthCacheSourceName } from "@sourceloop/core";

export const authcacheDbConfig = {
    name: AuthCacheSourceName,
    connector: 'kv-redis',
    url: '',
    host: process.env.AUTH_DB_HOST,
    port: process.env.AUTH_DB_PORT,
    password: process.env.AUTH_DB_PASSWORD,
    db: process.env.AUTH_DB_DATABASE,
};