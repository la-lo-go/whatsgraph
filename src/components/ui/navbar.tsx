import { ModeToggle } from "@/components/ui/mode-toggle"
import { ThemeProvider } from "@/components/ui/theme-provider";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-8 py-2 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-tr from-emerald-200 to-emerald-400 bg-clip-text text-transparent">WhatsGraph</h1>
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
  )
}