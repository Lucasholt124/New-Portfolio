import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  GraduationCap,
  Calendar,
  ExternalLink,
  Award,
  BookOpen,
  Trophy,
  CheckCircle2,
} from "lucide-react";

const EDUCATION_QUERY = defineQuery(`*[_type == "education"] | order(endDate desc, startDate desc){
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  current,
  gpa,
  description,
  achievements,
  logo,
  website,
  order
}`);

export async function EducationSection() {
  const { data: education } = await sanityFetch({ query: EDUCATION_QUERY });

  if (!education || education.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (
    start: string,
    end?: string | null,
    current?: boolean | null
  ) => {
    const startDate = new Date(start);
    const endDate = current ? new Date() : end ? new Date(end) : new Date();
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0)
      return `${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`;
    if (remainingMonths === 0)
      return `${years} ${years === 1 ? "ano" : "anos"}`;
    return `${years}a ${remainingMonths}m`;
  };

  // Stats
  const totalDegrees = education.length;
  const currentStudies = education.filter((e) => e.current).length;
  const totalAchievements = education.reduce(
    (acc, edu) => acc + (edu.achievements?.length || 0),
    0
  );

  const stats = [
    {
      icon: GraduationCap,
      value: totalDegrees.toString(),
      label: totalDegrees === 1 ? "Curso" : "Cursos",
    },
    ...(totalAchievements > 0
      ? [
          {
            icon: Trophy,
            value: totalAchievements.toString(),
            label: totalAchievements === 1 ? "Conquista" : "Conquistas",
          },
        ]
      : []),
  ];

  return (
    <section
      id="education"
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
      <div className="absolute top-20 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <BookOpen className="w-3.5 h-3.5" />
              Formação
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              Formação
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              Acadêmica
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Minha jornada educacional e as qualificações que fundamentam meu
            trabalho
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

            {/* Current studies indicator */}
            {currentStudies > 0 && (
              <>
                {stats.length > 0 && (
                  <div className="hidden sm:block h-8 w-px bg-border/50" />
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </span>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-foreground leading-none">
                      Estudando
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                      {currentStudies} {currentStudies === 1 ? "curso" : "cursos"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══════════ EDUCATION GRID ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {education.map((edu) => {
            const duration = edu.startDate
              ? calculateDuration(edu.startDate, edu.endDate, edu.current)
              : null;

            return (
              <div
                key={`${edu.institution}-${edu.degree}-${edu.startDate}`}
                className="group relative bg-card border rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300"
              >
                {/* Accent gradient bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    edu.current
                      ? "bg-gradient-to-r from-green-500 via-green-400 to-green-500/50"
                      : "bg-gradient-to-r from-primary via-primary/60 to-primary/30"
                  }`}
                />

                <div className="p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 sm:mb-6">
                    {/* Logo */}
                    {edu.logo && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 border-border/50 shrink-0 bg-background group-hover:border-primary/30 group-hover:scale-105 transition-all duration-300">
                        <Image
                          src={urlFor(edu.logo).width(160).height(160).url()}
                          alt={`${edu.institution} logo`}
                          fill
                          sizes="(max-width: 640px) 56px, (max-width: 1024px) 64px, 80px"
                          className="object-contain p-2"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors leading-tight">
                          {edu.degree}
                        </h3>
                        {edu.current && (
                          <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-semibold border border-green-500/20">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                            </span>
                            Cursando
                          </span>
                        )}
                      </div>

                      {/* Institution */}
                      {edu.website ? (
                        <Link
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-base sm:text-lg font-semibold text-primary hover:underline underline-offset-4 mb-1"
                        >
                          {edu.institution}
                          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                        </Link>
                      ) : (
                        <p className="text-base sm:text-lg font-semibold text-primary mb-1">
                          {edu.institution}
                        </p>
                      )}

                      {edu.fieldOfStudy && (
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {edu.fieldOfStudy}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    {/* Date badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/80 border border-border/30 text-xs sm:text-sm font-medium text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">
                        {edu.startDate && formatDate(edu.startDate)} –{" "}
                        {edu.current
                          ? "Presente"
                          : edu.endDate
                            ? formatDate(edu.endDate)
                            : "N/A"}
                      </span>
                      {duration && (
                        <span className="text-muted-foreground/50 text-xs">
                          ({duration})
                        </span>
                      )}
                    </div>

                    {/* GPA badge */}
                    {edu.gpa && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs sm:text-sm font-semibold">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span>Média: {edu.gpa}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                      {edu.description}
                    </p>
                  )}

                  {/* Achievements */}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4 sm:p-5">
                      <h4 className="text-sm sm:text-base font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        Conquistas e Honrarias
                      </h4>
                      <ul className="space-y-2.5">
                        {edu.achievements.map((achievement, idx) => (
                          <li
                            key={`${edu.institution}-achievement-${idx}`}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Website link (only if not already linked in institution name) */}
                  {edu.website && !edu.website && (
                    <div className="pt-4 sm:pt-5 border-t border-border/40 mt-5">
                      <Link
                        href={edu.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4 font-medium group/link"
                      >
                        <span>Visite o site da instituição</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════ BOTTOM NOTE ═══════════ */}
        <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Aprendizado contínuo é parte essencial da minha jornada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}