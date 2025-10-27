import { IconAward, IconCalendar, IconExternalLink, IconBook } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

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

  // Stats
  const totalDegrees = education.length;
  const currentStudies = education.filter(e => e.current).length;
  const totalAchievements = education.reduce((acc, edu) => acc + (edu.achievements?.length || 0), 0);

  return (
    <section
      id="education"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <IconBook className="w-4 h-4" />
              Formação
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
            Educação
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
            Minha formação acadêmica
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                {totalDegrees}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {totalDegrees === 1 ? "Curso" : "Cursos"}
              </div>
            </div>

            {totalAchievements > 0 && (
              <>
                <div className="hidden sm:block w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                    {totalAchievements}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Conquistas</div>
                </div>
              </>
            )}

            {currentStudies > 0 && (
              <>
                <div className="hidden sm:block w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm sm:text-base font-semibold">Em andamento</span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {currentStudies} {currentStudies === 1 ? "curso" : "cursos"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {education.map((edu) => (
            <div
              key={`${edu.institution}-${edu.degree}-${edu.startDate}`}
              className="group relative bg-card border rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300"
            >
              {/* Accent gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30" />

              <div className="p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 sm:mb-6">
                  {/* Logo */}
                  {edu.logo && (
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 border-primary/20 shrink-0 bg-background group-hover:border-primary/40 group-hover:scale-105 transition-all duration-300">
                      <Image
                        src={urlFor(edu.logo).width(80).height(80).url()}
                        alt={`${edu.institution} logo`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1 sm:mb-2">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors">
                        {edu.degree}
                      </h3>
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-primary mb-1">
                      {edu.institution}
                    </p>
                    {edu.fieldOfStudy && (
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {edu.fieldOfStudy}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs sm:text-sm font-medium">
                    <IconCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="whitespace-nowrap">
                      {edu.startDate && formatDate(edu.startDate)} -{" "}
                      {edu.current ? "Presente" : edu.endDate ? formatDate(edu.endDate) : "N/A"}
                    </span>
                  </div>

                  {edu.gpa && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold">
                      <IconAward className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span>Média: {edu.gpa}</span>
                    </div>
                  )}

                  {edu.current && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs sm:text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span>Em andamento</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    {edu.description}
                  </p>
                )}

                {/* Achievements */}
                {edu.achievements && edu.achievements.length > 0 && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-accent/50 border border-border/50 backdrop-blur-sm">
                    <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10">
                        <IconAward className="w-4 h-4 text-primary shrink-0" />
                      </span>
                      Conquistas e Honrarias
                    </h4>
                    <ul className="space-y-2">
                      {edu.achievements.map((achievement, idx) => (
                        <li
                          key={`${edu.institution}-achievement-${idx}`}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="flex-1 leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Website link */}
                {edu.website && (
                  <div className="pt-4 sm:pt-6 border-t border-border">
                    <Link
                      href={edu.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm sm:text-base text-primary hover:underline underline-offset-4 font-medium group/link"
                    >
                      <span>Visite o site da instituição</span>
                      <IconExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}