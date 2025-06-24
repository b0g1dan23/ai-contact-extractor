import createClient from 'openapi-fetch';
import type { paths } from '@/types/api';
import env from '@/env';

export const apiClient = createClient<paths>({
    baseUrl: env.VITE_API_URL || 'http://localhost:8080',
});

export type Contact = paths['/v1/contacts']['get']['responses']['200']['content']['application/json'][0];
export type ContactInput = NonNullable<paths['/v1/contacts']['post']['requestBody']>['content']['application/json'];
export type ExtractedContact = paths['/v1/extract/text']['post']['responses']['200']['content']['application/json'][0];
