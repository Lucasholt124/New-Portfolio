import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

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

  // Calculate total years of experience
  const calculateYears = () => {
  if (!experiences.length) return 0;
  const oldestDate = experiences[experiences.length - 1]?.startDate;
  const years = oldestDate ? new Date().getFullYear() - new Date(oldestDate).getFullYear() : 0;
  return years;
};

  const totalYears = calculateYears();
  const totalCompanies = experiences.length;
  const currentRole = experiences.find(exp => exp.current);

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img">
                <title>Ícone de Carreira</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Carreira
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
            Experiência de trabalho
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
            Minha jornada profissional
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                {totalYears}+
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Anos de experiência</div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-border" />

            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                {totalCompanies}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Empresas</div>
            </div>

            {currentRole && (
              <>
                <div className="hidden sm:block w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm sm:text-base font-semibold">Atual</span>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{currentRole.position}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Timeline - Same as Version 1 */}
        <div className="relative space-y-6 sm:space-y-8 lg:space-y-10">
          {experiences.map((exp, index) => (
            <div
              key={`${exp.company}-${exp.position}-${exp.startDate}`}
              className="relative pl-8 sm:pl-12 lg:pl-16"
            >
              {index !== experiences.length - 1 && (
                <div className="absolute left-[7px] sm:left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-border" />
              )}

              <div className="absolute left-0 sm:left-1 top-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary ring-4 ring-background shadow-lg" />

              <div className="group bg-card border rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 sm:mb-6">
                  {exp.companyLogo && (
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 border-border shrink-0 bg-background">
                      <Image
                        src={urlFor(exp.companyLogo).width(80).height(80).url()}
                        alt={`${exp.company} logo`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold group-hover:text-primary transition-colors">
                        {exp.position}
                      </h3>
                      {exp.current && (
                        <span className="px-2 py-1 text-xs rounded-md bg-green-500/10 text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
                          Atual
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="text-base sm:text-lg font-semibold text-primary">
                        {exp.company}
                      </p>
                      {exp.employmentType && (
                        <>
                          <span className="text-muted-foreground hidden sm:inline">•</span>
                          <span className="px-2 py-0.5 text-xs sm:text-sm rounded-md bg-primary/10 text-primary font-medium">
                            {exp.employmentType}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24  ">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {exp.startDate && formatDate(exp.startDate)} -{" "}
                        {exp.current ? "Presente" : exp.endDate ? formatDate(exp.endDate) : "N/A"}
                      </span>

                      {exp.location && (
                        <>
                          <span className="hidden sm:inline text-muted-foreground">•</span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-4 sm:mb-6 text-muted-foreground">
                    <PortableText value={exp.description} />
                  </div>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-primary rounded-full" />
                      Principais responsabilidades
                    </h4>
                    <ul className="space-y-2 ml-3">
                      {exp.responsibilities.map((resp, idx) => (
                        <li
                          key={`${exp.company}-resp-${idx}`}
                          className="flex items-start gap-2 text-sm sm:text-base text-muted-foreground"
                        >
                          <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-primary rounded-full" />
                      Conquistas
                    </h4>
                    <ul className="space-y-2 ml-3">
                      {exp.achievements.map((achievement, idx) => (
                        <li
                          key={`${exp.company}-achievement-${idx}`}
                          className="flex items-start gap-2 text-sm sm:text-base text-muted-foreground"
                        >
                          <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="pt-4 sm:pt-6 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIdx) => {
                        const techData = tech && typeof tech === "object" && "name" in tech ? tech : null;
                        return techData?.name ? (
                          <span
                            key={`${exp.company}-tech-${techIdx}`}
                            className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-accent hover:bg-primary/10 hover:text-primary font-medium transition-colors border border-transparent hover:border-primary/20"
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
          ))}
        </div>
      </div>
    </section>
  );
}