"use client"

import { ModeToggle } from "@/components/ui/mode-toggle";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useRouter } from "next/navigation";

export function Navbar() {
	const router = useRouter();

	const handleLogoClick = (e: React.MouseEvent) => {
		e.preventDefault();
		if (window.location.pathname !== '/') {
			router.push('/');
		}
	};
	
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
			<div className="container mx-auto px-8 py-2 flex justify-between items-center">
				<a href="/" onClick={handleLogoClick} className="text-2xl font-bold bg-gradient-to-tr from-emerald-200 to-emerald-400 bg-clip-text text-transparent">
					WhatsGraph
				</a>
				
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ModeToggle />
				</ThemeProvider>
			</div>
		</nav>
	);
}