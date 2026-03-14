import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getDictionary, Locale } from "@/lib/i18n";
import { ParticleNetwork } from "@/components/ui/ParticleNetwork";

export const revalidate = 3600; // ISR: revalidate every hour

async function getFeaturedProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/projects?limit=3&featured=true`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Failed to load featured projects", err);
    return [];
  }
}

function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    email: siteConfig.author.email,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
    ],
    jobTitle: "Software Engineer",
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function HomePage({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  const featuredProjects = await getFeaturedProjects();

  return (
    <>
      <PersonJsonLd />
      <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Particle Network Background Animation */}
        <div className="absolute inset-0 -z-30">
            <ParticleNetwork />
        </div>

        {/* Radial glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Text Content - Centered */}
        <div className="space-y-8 max-w-[900px] text-center z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-balance text-foreground">
            {dict.home.title.split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-400">
                  {word}
                </span>
              ) : `${word} `
            )}.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mx-auto max-w-2xl text-balance leading-relaxed">
            {dict.home.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center mt-12 z-10">
          <Link
            href={`/${params.lang}/projects`}
            className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 px-8 text-base font-semibold text-white shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {dict.home.viewProjects}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href={`/${params.lang}/contact`}
            className="inline-flex h-14 items-center justify-center rounded-xl border border-white/10 bg-[#111827]/80 backdrop-blur px-8 text-base font-medium shadow-sm hover:bg-[#1f2937] hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {dict.home.contactMe}
          </Link>
        </div>

        {/* Hero Image - Bottom Right Corner */}
        <div className="absolute -bottom-4 -right-4 w-[280px] h-[350px] md:w-[380px] md:h-[480px] lg:w-[480px] lg:h-[600px] z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/30 to-blue-400/20 rounded-tl-3xl blur-3xl" />
          <Image
            src="/image-removebg-preview.png"
            alt="Profile"
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            priority
          />
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Featured Projects Section (Server Component — zero JS shipped) */}
      {featuredProjects.length > 0 && (
        <section className="container mx-auto px-4 py-24 max-w-7xl space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tight text-foreground">{dict.home.featuredWork}</h2>
            <Link
              href={`/${params.lang}/projects`}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors group inline-flex items-center"
            >
              {dict.home.viewAll}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project: any) => (
              <Link
                key={project.id}
                href={`/${params.lang}/projects/${project.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 backdrop-blur shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="overflow-hidden aspect-video relative">
                  {project.images?.[0]?.url ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#111827] text-muted-foreground text-sm">
                      {dict.home.noImage}
                    </div>
                  )}
                  {/* bottom image gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/80 via-[#0B0F17]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                </div>
                <div className="p-8 flex-1 flex flex-col relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-indigo-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed line-clamp-2 mb-6">
                    {project.shortDescription}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300 group-hover:border-white/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
