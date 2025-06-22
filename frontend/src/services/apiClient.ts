import createClient from 'openapi-fetch';
import type { paths } from '@/types/api';

export const apiClient = createClient<paths>({
    baseUrl: 'http://localhost:8080'
});

export type Contact = paths['/api/v1/contacts']['get']['responses']['200']['content']['application/json'][0];
export type ContactInput = NonNullable<paths['/api/v1/contacts']['post']['requestBody']>['content']['application/json'];
export type ExtractedContact = paths['/api/v1/extract/text']['post']['responses']['200']['content']['application/json'][0];
