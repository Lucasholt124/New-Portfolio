import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import {
  Sparkles,
  ArrowRight,
  Code2,
  User,
  TrendingUp,
  Quote,
  Zap,
  Heart,
  Target,
  Award,
} from "lucide-react";

const ABOUT_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  fullBio,
  yearsOfExperience,
  stats,
  email,
  phone,
  location
}`);

// Map stat labels to icons
const statIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  projetos: TrendingUp,
  clientes: Heart,
  experiência: Sparkles,
  tecnologias: Code2,
  satisfação: Award,
  anos: Sparkles,
};

function getStatIcon(label: string) {
  const lower = label.toLowerCase();
  for (const [key, icon] of Object.entries(statIconMap)) {
    if (lower.includes(key)) return icon;
  }
  return Target;
}

// Color palette for stats
const statColors = [
  {
    gradient: "from-primary to-purple-500",
    bg: "bg-primary/10",
    text: "text-primary",
    glow: "bg-primary/20",
    border: "border-primary/20",
  },
  {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    glow: "bg-blue-500/20",
    border: "border-blue-500/20",
  },
  {
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    glow: "bg-amber-500/20",
    border: "border-amber-500/20",
  },
  {
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-500/10",
    text: "text-green-500",
    glow: "bg-green-500/20",
    border: "border-green-500/20",
  },
];

export async function AboutSection() {
  const { data: profile } = await sanityFetch({ query: ABOUT_QUERY });

  if (!profile) {
    return null;
  }

  return (
    <section
      id="about"
      className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Decorative orbs */}
        <div className="absolute top-20 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 -left-32 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] animate-float-delay-2" />
      </div>

      <div className="container relative mx-auto max-w-6xl">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm animate-fade-in">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Sobre Mim
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-5 tracking-tight animate-fade-in-up">
            <span className="text-foreground">Conheça quem está </span>
            <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-hero-gradient">
              por trás do código
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Transformando ideias complexas em experiências digitais
            elegantes e funcionais
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-8 animate-fade-in-up animation-delay-300">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/30" />
            <Sparkles className="w-4 h-4 text-primary/40" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
        </div>

        {/* ═══════════ BIO CONTENT ═══════════ */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          {profile.fullBio && (
            <div className="relative max-w-4xl mx-auto">
              {/* Decorative quote */}
              <div className="absolute -top-6 -left-4 lg:-left-10 opacity-[0.06]">
                <Quote className="w-20 h-20 lg:w-28 lg:h-28 text-primary" />
              </div>

              {/* Left accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />

              <div className="lg:pl-10">
                <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                  <PortableText
                    value={profile.fullBio}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="text-muted-foreground/90 leading-[1.8] mb-5 sm:mb-6 text-base sm:text-lg">
                            {children}
                          </p>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-10 sm:mt-14 mb-4 sm:mb-5 text-foreground flex items-center gap-3">
                            <span className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-purple-500 shrink-0" />
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-8 sm:mt-10 mb-3 sm:mb-4 text-foreground">
                            {children}
                          </h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="relative border-l-4 border-primary/40 bg-primary/5 rounded-r-xl pl-5 sm:pl-6 pr-5 py-4 sm:py-5 italic my-6 sm:my-8 text-base sm:text-lg text-muted-foreground">
                            <Quote className="absolute top-3 right-3 w-5 h-5 text-primary/15" />
                            {children}
                          </blockquote>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => (
                          <strong className="font-bold text-foreground">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-primary/80">
                            {children}
                          </em>
                        ),
                        link: ({ children, value }) => {
                          const href = value?.href || "";
                          const isExternal = href.startsWith("http");
                          return (
                            <Link
                              href={href}
                              target={isExternal ? "_blank" : undefined}
                              rel={
                                isExternal
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className="text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 hover:decoration-primary/60 transition-all font-semibold"
                            >
                              {children}
                            </Link>
                          );
                        },
                      },
                      list: {
                        bullet: ({ children }) => (
                          <ul className="space-y-3 sm:space-y-4 mb-5 sm:mb-6 ml-1">
                            {children}
                          </ul>
                        ),
                        number: ({ children }) => (
                          <ol className="space-y-3 sm:space-y-4 mb-5 sm:mb-6 ml-1 counter-reset-custom">
                            {children}
                          </ol>
                        ),
                      },
                      listItem: {
                        bullet: ({ children }) => (
                          <li className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-muted-foreground">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 mt-0.5">
                              <Zap className="h-3 w-3 text-primary" />
                            </span>
                            <span>{children}</span>
                          </li>
                        ),
                        number: ({ children }) => (
                          <li className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-muted-foreground">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold mt-0.5">
                              •
                            </span>
                            <span>{children}</span>
                          </li>
                        ),
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════ STATS GRID ═══════════ */}
        {profile.stats && profile.stats.length > 0 && (
          <div className="relative">
            {/* Section divider */}
            <div className="flex items-center gap-4 mb-12 sm:mb-16">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-muted-foreground">
                  Em Números
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {profile.stats.map(
                  (stat, idx: number) => {
                    if (!stat?.value || !stat?.label) return null;
                    
                    const color = statColors[idx % statColors.length];
                    const StatIcon = getStatIcon(stat.label);
  
                    return (
                      <div
                        key={`${stat.label}-${idx}`}
                      className="group relative animate-fade-in-up"
                      style={{
                        animationDelay: `${400 + idx * 100}ms`,
                      }}
                    >
                      {/* Glow on hover */}
                      <div
                        className={`absolute -inset-1 rounded-2xl ${color.glow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none`}
                      />

                      <div
                        className={`relative h-full text-center p-6 sm:p-8 rounded-2xl border ${color.border} bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
                      >
                        {/* Corner accent */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        />

                        {/* Background decoration */}
                        <div
                          className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${color.glow} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl`}
                        />

                        {/* Icon */}
                        <div
                          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${color.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <StatIcon
                            className={`w-5 h-5 ${color.text}`}
                          />
                        </div>

                        {/* Value */}
                        <div
                          className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300 inline-block`}
                        >
                          {stat.value}
                        </div>

                        {/* Label */}
                        <div className="text-xs sm:text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                          {stat.label}
                        </div>

                        {/* Bottom bar on hover */}
                        <div className="mt-4 h-1 w-full rounded-full bg-border/30 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${color.gradient} w-0 group-hover:w-full transition-all duration-700 ease-out`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* CTA after stats */}
            <div className="mt-12 sm:mt-16 text-center animate-fade-in-up animation-delay-600">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-semibold text-base transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]"
              >
                <span>Vamos trabalhar juntos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-3 text-sm text-muted-foreground/60">
                Disponível para projetos freelance
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}