import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import Image from "next/image";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border/40 bg-background/95 mt-24">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-2">
                        <Image 
                            src="/logo.png" 
                            alt="Portfolio Logo" 
                            width={24} 
                            height={24} 
                            className="object-contain"
                        />
                        <span className="font-bold text-lg tracking-tight">PORTFOLIO</span>
                        <span className="text-muted-foreground">© {currentYear}</span>
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground">
                        <Link href="https://github.com" target="_blank" className="hover:text-foreground transition-colors" aria-label="GitHub">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="https://linkedin.com" target="_blank" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link href="https://twitter.com" target="_blank" className="hover:text-foreground transition-colors" aria-label="Twitter">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="mailto:contact@example.com" className="hover:text-foreground transition-colors" aria-label="Email">
                            <Mail className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
