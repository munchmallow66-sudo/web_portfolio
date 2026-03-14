import Link from "next/link";

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
            <div className="text-8xl font-bold text-muted-foreground/30">404</div>
            <h1 className="text-3xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
