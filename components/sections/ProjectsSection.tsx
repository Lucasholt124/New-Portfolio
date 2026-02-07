import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  FolderKanban,
  ExternalLink,
  Github,
  Rocket,
  Layers,
  ArrowRight,
  Eye,
  Code2,
} from "lucide-react";

const PROJECTS_QUERY = defineQuery(`*[_type == "project" && featured == true] | order(order asc)[0...6]{
  title,
  slug,
  tagline,
  category,
  liveUrl,
  githubUrl,
  coverImage,
  technologies[]->{name, category, color}
}`);

export async function ProjectsSection() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  if (!projects || projects.length === 0) {
    return null;
  }

  // Calculate stats
  const uniqueCategories = new Set(
    projects.map((p) => p.category).filter(Boolean)
  ).size;
  const totalTechnologies = new Set(
    projects.flatMap((p) =>
      (p.technologies || [])
        .filter(
          (t): t is { name: string | null; category: "ai-ml" | "devops" | "other" | "backend" | "cloud" | "database" | "design" | "frontend" | "mobile" | "soft-skills" | "testing" | "tools" | null; color: string | null } =>
            t !== null
        )
        .map((t) => t.name)
        .filter(Boolean)
    )
  ).size;

  const stats = [
    {
      icon: FolderKanban,
      value: projects.length.toString(),
      label: "Em Destaque",
    },
    {
      icon: Layers,
      value: uniqueCategories.toString(),
      label: uniqueCategories === 1 ? "Categoria" : "Categorias",
    },
    {
      icon: Code2,
      value: totalTechnologies.toString(),
      label: "Tecnologias",
    },
  ];

  return (
    <section
      id="projects"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-muted/30" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-20 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <Rocket className="w-3.5 h-3.5" />
              Portfolio
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              Projetos em
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              Destaque
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Uma seleção dos meus melhores trabalhos e contribuições
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* ═══════════ STATS ═══════════ */}
        <div className="mb-10 sm:mb-14 lg:mb-16">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                    <StatIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground leading-none tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                      {stat.label}
                    </div>
                  </div>

                  {/* Separator */}
                  {i < stats.length - 1 && (
                    <div className="hidden sm:block ml-4 sm:ml-6 lg:ml-8 h-8 w-px bg-border/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════ PROJECTS GRID ═══════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {projects.map((project) => (
            <div
              key={project.slug?.current}
              className="group bg-card border rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300"
            >
              {/* Project Image */}
              {project.coverImage && (
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={urlFor(project.coverImage)
                      .width(800)
                      .height(450)
                      .quality(90)
                      .url()}
                    alt={project.title || "Project image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Category Badge */}
                  {project.category && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-background/90 backdrop-blur-md text-primary text-xs sm:text-sm font-semibold border border-primary/20 shadow-lg">
                        {project.category}
                      </span>
                    </div>
                  )}

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/50 backdrop-blur-sm">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-110 shadow-lg"
                        aria-label="Ver demonstração"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-3 rounded-full bg-background border-2 border-border hover:border-primary/50 transition-all hover:scale-110 shadow-lg"
                        aria-label="Ver código fonte"
                      >
                        <Github className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Project Content */}
              <div className="p-4 sm:p-5 lg:p-6 space-y-4">
                {/* Title & Tagline */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1.5 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {project.title || "Untitled Project"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Tech Stack */}
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.technologies.slice(0, 4).map((tech, idx) => {
                        const techData =
                          tech &&
                          typeof tech === "object" &&
                          "name" in tech
                            ? tech
                            : null;
                        return techData?.name ? (
                          <span
                            key={`${project.slug?.current}-tech-${idx}`}
                            className="px-2.5 py-1 text-xs rounded-lg bg-accent/80 border border-border/50 font-medium hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-200 cursor-default"
                          >
                            {techData.name}
                          </span>
                        ) : null;
                      })}
                      {project.technologies.length > 4 && (
                        <span className="px-2.5 py-1 text-xs rounded-lg bg-accent/80 border border-border/50 font-medium text-muted-foreground">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-3 border-t border-border/40">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 text-sm font-medium group/btn hover:shadow-lg hover:shadow-primary/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Demo</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card/50 hover:bg-accent hover:border-primary/30 transition-all duration-200 text-sm font-medium ${
                        !project.liveUrl ? "flex-1" : ""
                      }`}
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Código</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════ BOTTOM NOTE ═══════════ */}
        <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Mais projetos em desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}