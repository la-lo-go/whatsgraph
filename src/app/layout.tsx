import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: process.env.PRO ? "WhatsGraph" : "[DEV] WhatsGraph",
	description: "Easily visualize your WhatsApp conversations data",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<link rel="icon" href="/favicon.svg" />
			<body className={inter.className}>
				<Navbar />
				<main className="flex min-h-screen flex-col items-center justify-between px-20 p-8 max-lg:px-4">
					{children}
				</main>
			</body>
		</html>
	);
}
