import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getUser } from "@/server/functions";
import { TRPCError } from "@trpc/server";

export const followRouter = createTRPCRouter({
    follow: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const user = await getUser(ctx.session.user.id);
        const target = await getUser(input);

        if (user.id === target.id) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You can't follow yourself!",
            });
        }

        await ctx.db.follower.create({
            data: {
                userId: user.id,
                followingId: target.id,
            },
        })

        return target;
    })
})