import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  Trophy,
  ExternalLink,
  Star,
  Award,
  Mic2,
  BookOpen,
  GitBranch,
  Milestone,
  Medal,
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react";

const ACHIEVEMENTS_QUERY =
  defineQuery(`*[_type == "achievement"] | order(date desc){
  title,
  type,
  issuer,
  date,
  description,
  image,
  url,
  featured,
  order
}`);

export async function AchievementsSection() {
  const { data: achievements } = await sanityFetch({
    query: ACHIEVEMENTS_QUERY,
  });

  if (!achievements || achievements.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
    });
  };

  const typeConfig: Record<
    string,
    { color: string; border: string; icon: React.ComponentType<{ className?: string }>; label: string }
  > = {
    award: {
      color: "bg-yellow-500/10 text-yellow-500",
      border: "border-yellow-500/20",
      icon: Award,
      label: "Prêmio",
    },
    hackathon: {
      color: "bg-purple-500/10 text-purple-500",
      border: "border-purple-500/20",
      icon: Trophy,
      label: "Hackathon",
    },
    publication: {
      color: "bg-blue-500/10 text-blue-500",
      border: "border-blue-500/20",
      icon: BookOpen,
      label: "Publicação",
    },
    speaking: {
      color: "bg-green-500/10 text-green-500",
      border: "border-green-500/20",
      icon: Mic2,
      label: "Palestra",
    },
    "open-source": {
      color: "bg-orange-500/10 text-orange-500",
      border: "border-orange-500/20",
      icon: GitBranch,
      label: "Open Source",
    },
    milestone: {
      color: "bg-pink-500/10 text-pink-500",
      border: "border-pink-500/20",
      icon: Milestone,
      label: "Marco",
    },
    recognition: {
      color: "bg-cyan-500/10 text-cyan-500",
      border: "border-cyan-500/20",
      icon: Medal,
      label: "Reconhecimento",
    },
    other: {
      color: "bg-gray-500/10 text-gray-500",
      border: "border-gray-500/20",
      icon: Sparkles,
      label: "Outro",
    },
  };

  const getConfig = (type: string | null | undefined) => {
    return typeConfig[type || "other"] || typeConfig.other;
  };

  // Separate featured and regular
  const featured = achievements.filter((a) => a.featured);
  const regular = achievements.filter((a) => !a.featured);

  // Stats
  const totalAchievements = achievements.length;
  const uniqueTypes = new Set(achievements.map((a) => a.type).filter(Boolean)).size;
  const featuredCount = featured.length;

  const stats = [
    {
      icon: Trophy,
      value: totalAchievements.toString(),
      label: totalAchievements === 1 ? "Conquista" : "Conquistas",
    },
    {
      icon: Star,
      value: uniqueTypes.toString(),
      label: uniqueTypes === 1 ? "Categoria" : "Categorias",
    },
    ...(featuredCount > 0
      ? [
          {
            icon: Sparkles,
            value: featuredCount.toString(),
            label: "Em Destaque",
          },
        ]
      : []),
  ];

  return (
    <section
      id="achievements"
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
      <div className="absolute top-20 -right-32 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <Trophy className="w-3.5 h-3.5" />
              Conquistas
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              Conquistas &
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              Reconhecimentos
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Marcos importantes e reconhecimentos ao longo da minha carreira
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

        {/* ═══════════ FEATURED ACHIEVEMENTS ═══════════ */}
        {featured.length > 0 && (
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Em Destaque
              </h3>
              <div className="flex-1 h-px bg-border/40 hidden sm:block" />
            </div>

            <div className="@container">
              <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-5 sm:gap-6">
                {featured.map((achievement) => {
                  const config = getConfig(achievement.type);
                  const TypeIcon = config.icon;

                  return (
                    <div
                      key={`${achievement.title}-${achievement.date}`}
                      className="group bg-card border-2 border-primary/20 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300"
                    >
                      {/* Image */}
                      {achievement.image && (
                        <div className="relative w-full h-36 sm:h-44 lg:h-48 overflow-hidden bg-muted">
                          <Image
                            src={urlFor(achievement.image)
                              .width(800)
                              .height(400)
                              .quality(90)
                              .url()}
                            alt={achievement.title || "Achievement"}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                        </div>
                      )}

                      <div className="p-4 sm:p-5 lg:p-6">
                        {/* Type & Date */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {achievement.type && (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-semibold ${config.color} ${config.border} border`}
                            >
                              <TypeIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                          )}
                          {achievement.date && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(achievement.date)}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-lg sm:text-xl font-bold mb-1.5 group-hover:text-primary transition-colors leading-tight">
                          {achievement.title}
                        </h4>

                        {/* Issuer */}
                        {achievement.issuer && (
                          <p className="text-sm sm:text-base text-primary font-semibold mb-3">
                            {achievement.issuer}
                          </p>
                        )}

                        {/* Description */}
                        {achievement.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                            {achievement.description}
                          </p>
                        )}

                        {/* Link */}
                        {achievement.url && (
                          <Link
                            href={achievement.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline underline-offset-4"
                          >
                            Saber mais
                            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ ALL ACHIEVEMENTS ═══════════ */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Trophy className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Todas as Conquistas
                </h3>
                <div className="flex-1 h-px bg-border/40 hidden sm:block" />
              </div>
            )}

            <div className="@container">
              <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-5 sm:gap-6">
                {regular.map((achievement) => {
                  const config = getConfig(achievement.type);
                  const TypeIcon = config.icon;

                  return (
                    <div
                      key={`${achievement.title}-${achievement.date}`}
                      className="group bg-card border rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300 flex flex-col"
                    >
                      {/* Image */}
                      {achievement.image && (
                        <div className="relative w-full h-28 sm:h-36 overflow-hidden bg-muted">
                          <Image
                            src={urlFor(achievement.image)
                              .width(600)
                              .height(300)
                              .quality(85)
                              .url()}
                            alt={achievement.title || "Achievement"}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                        </div>
                      )}

                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        {/* Type Badge */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {achievement.type && (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-semibold ${config.color} ${config.border} border`}
                            >
                              <TypeIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                          )}
                          {achievement.date && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(achievement.date)}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-bold mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {achievement.title}
                          </h4>

                          {achievement.issuer && (
                            <p className="text-sm text-primary font-semibold mb-2 truncate">
                              {achievement.issuer}
                            </p>
                          )}

                          {achievement.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {achievement.description}
                            </p>
                          )}
                        </div>

                        {/* Link */}
                        {achievement.url && (
                          <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-border/40">
                            <Link
                              href={achievement.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex items-center gap-2 text-xs sm:text-sm text-primary font-medium hover:underline underline-offset-4"
                            >
                              Saber mais
                              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ BOTTOM NOTE ═══════════ */}
        <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Cada conquista é um passo na jornada de evolução contínua
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}