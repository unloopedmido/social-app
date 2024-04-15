import { TRPCError } from "@trpc/server";
import { db } from "./db";

export async function getUser(id: string) {
    const user = await db.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
        });
    }

    return {
        ...user,
    };
}