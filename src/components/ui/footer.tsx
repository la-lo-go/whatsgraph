import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
            Made by
          <Link
            href="https://github.com/la-lo-go"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 font-medium underline hover:text-foreground"
          >
            la-lo-go
          </Link>
        </p>
        <Link
          href="https://github.com/la-lo-go/whatsgraph"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github size={24} />
        </Link>
      </div>
    </footer>
  );
}