import { createRouter } from "@/lib/create-app";
import * as routes from '@/routes/extract/extract.routes';
import * as handlers from '@/routes/extract/extract.handlers';

const extractRoutes = createRouter()
    .openapi(routes.extractFromTextRoute, handlers.extractFromTextHandler)

export default extractRoutes;