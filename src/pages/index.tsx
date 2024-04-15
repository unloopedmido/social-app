import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { extractUsernameFromEmail, timeAgo } from "@/lib/utils";
import { api } from "@/utils/api";
import type { NextPage } from "next";
import {
	HeartFilledIcon,
	HeartIcon,
	ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { MdVerified } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

type Inputs = {
	content: string;
};

const HomePage: NextPage = () => {
	const { data: session, status } = useSession();
	const { data, isLoading, isRefetching, refetch } =
		api.post.getLatest.useQuery(undefined, {
			refetchOnWindowFocus: false,
		});
	const { mutate: createPost } = api.post.create.useMutation({
		onSuccess: async () => {
			await refetch();
		},
	});
	const { mutate: toggleLike } = api.post.like.useMutation({
		onSuccess: async () => {
			await refetch();
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		createPost({ content: data.content });
	};

	return (
		<div className="container mt-10">
			<h1 className="text-3xl font-bold mb-5 text-center">Latest Posts</h1>
			<div className="flex flex-col max-w-[600px] mx-auto">
				{status === "authenticated" && (
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex p-7 border-[0.5px] border-foreground/10 items-center w-full rounded-none"
					>
						<Avatar>
							<AvatarImage src={session.user.image as string | undefined} />
							<AvatarFallback>{session.user.name}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col w-full">
							<input
								{...register("content", {
									required: true,
									maxLength: 140,
									minLength: 5,
								})}
								type="text"
								placeholder="What is happening?!"
								className="focus:outline-none p-3 bg-inherit w-full h-full placeholder-foreground/40"
							/>
							{/* Write an error for if the text is not between 5-140 words or no text */}
							{errors.content?.type === "required" && (
								<p className="text-red-500">This field is required</p>
							)}
							{errors.content?.type === "maxLength" && (
								<p className="text-red-500">This field is too long</p>
							)}
							{errors.content?.type === "minLength" && (
								<p className="text-red-500">This field is too short</p>
							)}
						</div>
						<Button disabled={!!errors.content} type="submit">
							Post
						</Button>
					</form>
				)}
				{!isLoading &&
					!isRefetching &&
					data?.map((p) => (
						<Card key={p.id} className="rounded-none flex-col">
							<CardHeader className="items-center flex-row gap-x-4">
								<Avatar>
									<AvatarImage src={p.author.image!} />
									<AvatarFallback>{p.author.name}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col md:flex-row md:gap-2">
									<p className="font-semibold flex items-center gap-x-1">
										{p.author.name}
										{p.author.verified && (
											<MdVerified className="text-blue-500" />
										)}
									</p>
									<p className="hidden md:block text-foreground/50">
										@{extractUsernameFromEmail(p.author.email!)}
									</p>
									<p className="text-foreground/50">{timeAgo(p.createdAt)}</p>
								</div>
							</CardHeader>
							<CardContent>
								<p>{p.content}</p>
							</CardContent>
							<CardFooter>
								<Button variant="outline" className="gap-4">
									<ChatBubbleIcon />
									<p>0</p>
								</Button>
								<Button
									variant="outline"
									className="gap-4"
									onClick={() => toggleLike(p.id)}
								>
									{p.userLiked ? <HeartFilledIcon /> : <HeartIcon />}
									<p>{p.likes.length}</p>
								</Button>
							</CardFooter>
						</Card>
					))}
			</div>
		</div>
	);
};

export default HomePage;
