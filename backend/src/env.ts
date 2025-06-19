import { z, ZodError } from 'zod';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

const EnvSchema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().default(8080),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']),
    DB_URL: z.string().url(),
    ADMIN_USERNAME: z.string().min(1),
    ADMIN_PASSWORD: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
}).transform((data) => {
    if (data.NODE_ENV === 'test') {
        return {
            ...data,
            DB_URL: 'file::memory:?cache=shared'
        };
    }
    return data;
});

export type envType = z.infer<typeof EnvSchema>;

let env: envType;
try {
    env = EnvSchema.parse(process.env);
} catch (err) {
    const e = err as ZodError;
    console.error("Invalid ENV: ");
    console.error(e.flatten().fieldErrors);
    process.exit(1);
}

export default env;