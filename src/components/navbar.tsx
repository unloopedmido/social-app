import Link from "next/link";
import { Angkor } from "next/font/google";
import { cn } from "@/lib/utils";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme-changer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSession } from "next-auth/react";

const titleFont = Angkor({
	subsets: ["latin"],
	weight: "400",
});

export default function Navbar() {
	const { data: session, status } = useSession();

	return (
		<nav className="w-[80%] mx-auto flex justify-between items-center p-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="lg:hidden" variant="outline" size="icon">
						<Menu />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					{getPages().map((page) => (
						<DropdownMenuItem key={page.name} asChild>
							<Link href={page.href}>{page.name}</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator/>
					<DropdownMenuItem asChild>
						<Link href={"/api/auth/" + (status === "authenticated" ? "signout" : "signin")}>
							{"Log" + (status === "authenticated" ? "out" : "in")}
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<div className="flex gap-x-5 items-center">
				<Link href="/" className={cn("text-lg", titleFont.className)}>
					BladeForge
				</Link>
				<div className="hidden lg:flex items-center gap-4 text-sm lg:gap-6">
					{getPages().map((p) => (
						<Link
							className="transition-colors hover:text-foreground/80 text-foreground/60"
							key={p.name}
							href={p.href}
						>
							{p.name}
						</Link>
					))}
				</div>
			</div>
			<div className="flex gap-2 items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="hidden sm:flex" variant="outline">
							{session ? session.user.name : "Guest"}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{status === "authenticated" ? (
							<>
								<DropdownMenuItem asChild>
									<Link href="/profile">Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/settings">Settings</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/api/auth/signout">Logout</Link>
								</DropdownMenuItem>
							</>
						) : (
							<DropdownMenuItem asChild>
								<Link href="/api/auth/signin">Login</Link>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button asChild size={"icon"} variant={"outline"}>
					<Link className="hidden sm:flex" href="https://discord.gg">
						<FaDiscord size={20} />
					</Link>
				</Button>
				<Button asChild size={"icon"} variant={"outline"}>
					<Link
						className="hidden sm:flex"
						href="https://github.com/unloopedmido"
					>
						<FaGithub size={20} />
					</Link>
				</Button>
				<ModeToggle />
			</div>
		</nav>
	);
}

export function getPages() {
	return ["Home", "Explore", "Profile", "Settings"].map((p) => ({
		name: p,
		href: `/${p.toLowerCase()}`,
	}));
}
