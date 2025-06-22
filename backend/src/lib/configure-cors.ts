import { AppOpenAPI } from "@/types";
import { cors } from "hono/cors";

const configureCORS = (app: AppOpenAPI) => {
    const allowedOrigins = ['http://localhost:5173', "http://localhost:4173"];

    app.use("/api/v1/*", cors({
        origin: (origin) => {
            if (!origin) {
                return null;
            }
            const isAllowed = allowedOrigins.includes(origin);
            return isAllowed ? origin : null;
        },
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }))
}

export default configureCORS;