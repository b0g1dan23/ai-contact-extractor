import { z } from "zod";

const EnvSchema = z.object({
    VITE_API_URL: z.string().url('Invalid API URL'),
});

type Env = z.infer<typeof EnvSchema>;
let env: Env;
try {
    env = EnvSchema.parse(import.meta.env);
    console.log(env);
} catch (err) {
    console.error('Environment variables validation failed:', err);
    throw new Error('Invalid environment variables');
}

export default env;