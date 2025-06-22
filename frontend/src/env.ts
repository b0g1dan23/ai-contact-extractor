import { z } from "zod";

const EnvSchema = z.object({
    VITE_API_URL: z.string().url('Invalid API URL').default('http://localhost:8080/api/v1'),
});

type Env = z.infer<typeof EnvSchema>;
let env: Env;
try {
    env = EnvSchema.parse(import.meta.env);
} catch (err) {
    console.error('Environment variables validation failed:', err);
    console.error('Application will now exit due to invalid environment configuration');
    throw new Error('Invalid environment configuration');
}

export default env;