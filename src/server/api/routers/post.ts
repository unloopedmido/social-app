import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
	getLatest: publicProcedure.query(async ({ ctx }) => {
		// Return the latest posts and add a "userLiked" field to each post to indicate if the current user has liked the post
		const posts = await ctx.db.post.findMany({
			include: {
				// comments: true,
				likes: true,
				author: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		});

		return posts.map((post) => {
			return {
				...post,
				userLiked: post.likes.some(
					(like) => like.userId === ctx.session?.user.id,
				),
			};
		});
	}),

	getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.db.post.findUnique({
			where: {
				id: input,
			},
			include: {
				// comments: true,
				likes: true,
				author: true,
			},
		});
	}),

	create: protectedProcedure
		.input(
			z.object({
				content: z.string(),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.db.post.create({
				data: {
					content: input.content,
					authorId: ctx.session.user.id,
				},
				include: {
					author: true,
					// comments: true,
					likes: true,
				},
			});
		}),

	like: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			// Check if the user has already liked the post
			const like = await ctx.db.like.findFirst({
				where: {
					userId: ctx.session.user.id,
					postId: input,
				},
			});

			if (like) {
				await ctx.db.post.update({
					where: {
						id: input,
					},
					data: {
						likes: {
							delete: {
								id: like.id,
							},
						},
					},
				});
			} else {
				await ctx.db.post.update({
					where: {
						id: input,
					},
					data: {
						likes: {
							create: {
								userId: ctx.session.user.id,
							},
						},
					},
				});
			}
		}),

	// Not implemented yet
	// comment: protectedProcedure
	// 	.input(z.object({ postId: z.string(), content: z.string() }))
	// 	.mutation(({ ctx, input }) => {
	// 		return ctx.db.post.update({
	// 			where: {
	// 				id: input.postId,
	// 			},
	// 			data: {
	// 				comments: {
	// 					create: {
	// 						content: input.content,
	// 						authorId: ctx.session.user.id,
	// 					},
	// 				},
	// 			},
	// 			include: {
	// 				comments: true,
	// 				likes: true,
	// 				author: true,
	// 			},
	// 		});
	// 	}),

	delete: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			const post = await ctx.db.post.findUnique({
				where: {
					id: input,
				},
			});

			if (!post) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Post not found",
				});
			}

			if (post.authorId !== ctx.session.user.id) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not allowed to delete this post",
				});
			}

			await ctx.db.post.delete({
				where: {
					id: input,
				},
			});
		}),
});
