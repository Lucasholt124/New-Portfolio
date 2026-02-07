import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Star,
  Building2,
  Clock,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const EXPERIENCE_QUERY = defineQuery(`*[_type == "experience"] | order(startDate desc){
  company,
  position,
  employmentType,
  location,
  startDate,
  endDate,
  current,
  description,
  responsibilities,
  achievements,
  technologies[]->{name, category},
  companyLogo,
  companyWebsite
}`);

export async function ExperienceSection() {
  const { data: experiences } = await sanityFetch({ query: EXPERIENCE_QUERY });

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (start: string, end?: string | null, current?: boolean | null) => {
    const startDate = new Date(start);
    const endDate = current ? new Date() : end ? new Date(end) : new Date();
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`;
    if (remainingMonths === 0) return `${years} ${years === 1 ? "ano" : "anos"}`;
    return `${years} ${years === 1 ? "ano" : "anos"} e ${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`;
  };

  // Calculate stats
  const totalYears = (() => {
    if (!experiences.length) return 0;
    const oldestDate = experiences[experiences.length - 1]?.startDate;
    return oldestDate
      ? new Date().getFullYear() - new Date(oldestDate).getFullYear()
      : 0;
  })();

  const totalCompanies = new Set(experiences.map((e) => e.company)).size;
  const currentRole = experiences.find((exp) => exp.current);
  const totalTechnologies = new Set(
    experiences.flatMap((e) =>
      (e.technologies || [])
        .filter((t) => t !== null)
        .map((t) => t.name)
        .filter(Boolean)
    )
  ).size;

  const stats = [
    {
      icon: Clock,
      value: `${totalYears}+`,
      label: "Anos de Exp.",
    },
    {
      icon: Building2,
      value: totalCompanies.toString(),
      label: totalCompanies === 1 ? "Empresa" : "Empresas",
    },
    {
      icon: TrendingUp,
      value: totalTechnologies.toString(),
      label: "Tecnologias",
    },
  ];

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-20 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto max-w-6xl">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <Briefcase className="w-3.5 h-3.5" />
              Carreira
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              Experiência
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              Profissional
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Minha trajetória e as empresas onde contribuí com meu trabalho
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

            {/* Current role indicator */}
            {currentRole && (
              <>
                <div className="hidden sm:block h-8 w-px bg-border/50" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-foreground leading-none">
                      Empregado
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                      {currentRole.company}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══════════ TIMELINE ═══════════ */}
        <div className="relative space-y-6 sm:space-y-8 lg:space-y-10">
          {experiences.map((exp, index) => {
            const duration = exp.startDate
              ? calculateDuration(exp.startDate, exp.endDate, exp.current)
              : null;

            return (
              <div
                key={`${exp.company}-${exp.position}-${exp.startDate}`}
                className="relative pl-8 sm:pl-12 lg:pl-16"
              >
                {/* Timeline line */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-[7px] sm:left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-border/30" />
                )}

                {/* Timeline dot */}
                <div
                  className={`absolute left-0 sm:left-1 top-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-4 ring-background shadow-lg transition-colors ${
                    exp.current
                      ? "bg-green-500 ring-green-500/20"
                      : "bg-primary ring-primary/10"
                  }`}
                >
                  {exp.current && (
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
                  )}
                </div>

                {/* Card */}
                <div className="group bg-card border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 sm:mb-6">
                    {/* Company Logo */}
                    {exp.companyLogo && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 border-border/50 shrink-0 bg-background group-hover:border-primary/30 transition-colors">
                        <Image
                          src={urlFor(exp.companyLogo).width(160).height(160).url()}
                          alt={`${exp.company} logo`}
                          fill
                          sizes="(max-width: 640px) 56px, (max-width: 1024px) 64px, 80px"
                          className="object-contain p-2"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Position */}
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                          {exp.position}
                        </h3>
                        {exp.current && (
                          <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-semibold border border-green-500/20">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                            </span>
                            Atual
                          </span>
                        )}
                      </div>

                      {/* Company & Type */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        {exp.companyWebsite ? (
                          <Link
                            href={exp.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-base sm:text-lg font-semibold text-primary hover:underline underline-offset-4"
                          >
                            {exp.company}
                            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                          </Link>
                        ) : (
                          <p className="text-base sm:text-lg font-semibold text-primary">
                            {exp.company}
                          </p>
                        )}

                        {exp.employmentType && (
                          <>
                            <span className="text-muted-foreground/40 hidden sm:inline">
                              •
                            </span>
                            <span className="px-2.5 py-0.5 text-xs sm:text-sm rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                              {exp.employmentType}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Date & Location */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                          {exp.startDate && formatDate(exp.startDate)} –{" "}
                          {exp.current
                            ? "Presente"
                            : exp.endDate
                              ? formatDate(exp.endDate)
                              : "N/A"}
                          {duration && (
                            <span className="text-muted-foreground/50 text-xs">
                              ({duration})
                            </span>
                          )}
                        </span>

                        {exp.location && (
                          <>
                            <span className="hidden sm:inline text-muted-foreground/30">
                              •
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-5 sm:mb-6 text-muted-foreground leading-relaxed">
                      <PortableText value={exp.description} />
                    </div>
                  )}

                  {/* Responsibilities & Achievements grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
                    {/* Responsibilities */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="rounded-xl bg-muted/30 border border-border/30 p-4 sm:p-5">
                        <h4 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2 text-foreground">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          </div>
                          Responsabilidades
                        </h4>
                        <ul className="space-y-2.5">
                          {exp.responsibilities.map((resp, idx) => (
                            <li
                              key={`${exp.company}-resp-${idx}`}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                            >
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 sm:p-5">
                        <h4 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2 text-foreground">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                          </div>
                          Conquistas
                        </h4>
                        <ul className="space-y-2.5">
                          {exp.achievements.map((achievement, idx) => (
                            <li
                              key={`${exp.company}-achievement-${idx}`}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-0.5" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="pt-4 sm:pt-5 border-t border-border/40">
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIdx) => {
                          const techData =
                            tech &&
                            typeof tech === "object" &&
                            "name" in tech
                              ? tech
                              : null;
                          return techData?.name ? (
                            <span
                              key={`${exp.company}-tech-${techIdx}`}
                              className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-accent/80 hover:bg-primary/10 hover:text-primary font-medium transition-all duration-200 border border-transparent hover:border-primary/20 cursor-default"
                            >
                              {techData.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}