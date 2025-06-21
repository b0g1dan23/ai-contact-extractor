import { createRouter } from "@/lib/create-app";
import * as routes from '@/routes/contacts/contacts.routes';
import * as handlers from '@/routes/contacts/contacts.handlers';

const contactsRouter = createRouter()
    .openapi(routes.getContactsRoute, handlers.getContactsHandler);

export default contactsRouter;