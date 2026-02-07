import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { SkillsChart } from "./SkillsChart";
import { Code2, Layers, Sparkles, TrendingUp } from "lucide-react";

const SKILLS_QUERY = defineQuery(`*[_type == "skill"] | order(category asc, order asc){
  name,
  category,
  proficiency,
  percentage,
  yearsOfExperience,
  color
}`);

export async function SkillsSection() {
  const { data: skills } = await sanityFetch({ query: SKILLS_QUERY });

  if (!skills || skills.length === 0) {
    return null;
  }

  // Calculate stats
  const categories = [...new Set(skills.map((skill) => skill.category).filter(Boolean))];
  const totalSkills = skills.length;
  const avgProficiency = Math.round(
    skills.reduce((sum, s) => sum + (s.percentage || 0), 0) / totalSkills
  );
  const maxExperience = Math.max(
    ...skills.map((s) => s.yearsOfExperience || 0)
  );

  const stats = [
    {
      icon: Code2,
      value: totalSkills.toString(),
      label: totalSkills === 1 ? "Habilidade" : "Habilidades",
    },
    {
      icon: Layers,
      value: categories.length.toString(),
      label: categories.length === 1 ? "Categoria" : "Categorias",
    },
    {
      icon: TrendingUp,
      value: `${avgProficiency}%`,
      label: "Proficiência Média",
    },
    {
      icon: Sparkles,
      value: `${maxExperience}+`,
      label: "Anos de Exp. Máx.",
    },
  ];

  return (
    <section
      id="skills"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-muted/30" />

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

      <div className="container relative mx-auto max-w-7xl">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <Code2 className="w-3.5 h-3.5" />
              Expertise
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              Habilidades &
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              Competências
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Uma visão das tecnologias e ferramentas com as quais trabalho
            diariamente
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

        {/* ═══════════ SKILLS CHART ═══════════ */}
        <div className="w-full">
          <SkillsChart skills={skills} />
        </div>

        {/* ═══════════ BOTTOM NOTE ═══════════ */}
        <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sempre aprendendo e explorando novas tecnologias
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}