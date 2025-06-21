import { AppRouteHandler } from "@/types";
import { GetContactsRoute } from "./contacts.routes";
import { OK } from "@/helpers/http-status-codes";
import db from "@/db";
import { contactsTable } from "@/db/schema";

export const getContactsHandler: AppRouteHandler<GetContactsRoute> = async (c) => {
    const res = await db.select().from(contactsTable);
    return c.json(res, OK);
}