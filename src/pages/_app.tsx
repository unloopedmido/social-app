import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<main className={`font-sans antialiased ${inter.variable}`}>
					<div className="h-[5vh]">
						<Navbar />
					</div>
					<div className="h-[95vh]">
						<Component {...pageProps} />
					</div>
				</main>
			</ThemeProvider>
		</SessionProvider>
	);
};

export default api.withTRPC(MyApp);
