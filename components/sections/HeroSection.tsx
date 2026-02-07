import Link from "next/link";
import { defineQuery } from "next-sanity";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ProfileImage } from "./ProfileImage";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Sparkles,
  ArrowRight,
  Code2,
  Palette,
  Rocket,
  Star,
  Zap,
  BookOpen,
  MessageCircle,
} from "lucide-react";

const HERO_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  headline,
  headlineStaticText,
  headlineAnimatedWords,
  headlineAnimationDuration,
  shortBio,
  email,
  phone,
  location,
  availability,
  socialLinks,
  yearsOfExperience,
  profileImage
}`);

export async function HeroSection() {
  const { data: profile } = await sanityFetch({ query: HERO_QUERY });

  if (!profile) {
    return null;
  }

  // Build WhatsApp URL
  const phoneNumber = profile.phone?.replace(/\D/g, "") || "";
  const whatsappMessage = encodeURIComponent(
    "Olá! Vi seu portfólio e gostaria de conversar sobre um projeto."
  );
  const whatsappUrl = `https://wa.me/${5579999383543}?text=${whatsappMessage}`;

  const socialIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    github: Github,
    linkedin: Linkedin,
    devto: BookOpen,
    website: Globe,
  };

  const socialColors: Record<string, string> = {
    github: "hover:bg-gray-800 hover:text-white hover:border-gray-700",
    linkedin: "hover:bg-blue-600 hover:text-white hover:border-blue-500",
    twitter: "hover:bg-sky-500 hover:text-white hover:border-sky-400",
    website:
      "hover:bg-primary hover:text-primary-foreground hover:border-primary",
  };

  const hasAnimatedWords =
    profile.headlineStaticText &&
    profile.headlineAnimatedWords &&
    profile.headlineAnimatedWords.length > 0;

  const stats = [
    {
      value: `${profile.yearsOfExperience || 3}+`,
      label: "Anos de Exp.",
      icon: Sparkles,
    },
    { value: "50+", label: "Projetos", icon: Rocket },
    { value: "100%", label: "Satisfação", icon: Star },
  ];

  const floatingIcons = [
    {
      icon: Code2,
      position: "top-[15%] left-[8%]",
      delay: "",
      duration: "7s",
    },
    {
      icon: Palette,
      position: "top-[25%] right-[10%]",
      delay: "1.5s",
      duration: "8s",
    },
    {
      icon: Rocket,
      position: "bottom-[20%] left-[12%]",
      delay: "3s",
      duration: "9s",
    },
    {
      icon: Zap,
      position: "bottom-[30%] right-[6%]",
      delay: "4.5s",
      duration: "6s",
    },
  ];

  const iconColors = [
    "text-primary/60",
    "text-purple-500/60",
    "text-primary/60",
    "text-amber-500/60",
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ═══════════ BACKGROUND LAYERS ═══════════ */}

      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-primary/5" />

      {/* Ripple effect - hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-20 hidden sm:block">
        <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />
      </div>

      {/* Animated orbs - smaller on mobile */}
      <div className="absolute top-20 -left-20 sm:-left-32 w-48 sm:w-80 h-48 sm:h-80 bg-primary/15 rounded-full blur-[80px] sm:blur-[100px] animate-float" />
      <div className="absolute bottom-20 -right-20 sm:-right-32 w-56 sm:w-96 h-56 sm:h-96 bg-purple-500/15 rounded-full blur-[80px] sm:blur-[100px] animate-float-delay-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary/5 rounded-full blur-[80px] sm:blur-[120px] animate-float-delay-4" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating tech icons (desktop only) */}
      <div className="hidden lg:block">
        {floatingIcons.map((item, i) => {
          const FloatIcon = item.icon;
          return (
            <div
              key={i}
              className={`absolute ${item.position} p-3 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm opacity-40 animate-float-icon`}
              style={{
                animationDuration: item.duration,
                animationDelay: item.delay,
              }}
            >
              <FloatIcon className={`w-5 h-5 ${iconColors[i]}`} />
            </div>
          );
        })}
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 items-center">
            {/* ═══ TEXT CONTENT ═══ */}
            <div className="space-y-5 sm:space-y-7 lg:space-y-8 order-2 lg:order-1 text-center lg:text-left">
              {/* Availability Badge */}
              {profile.availability && (
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm animate-fade-in">
                    <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500" />
                    </span>
                    {profile.availability}
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-3 sm:space-y-5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] animate-fade-in-up">
                  <span className="block text-foreground">
                    {profile.firstName || ""}
                  </span>
                  <span className="block mt-1 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-hero-gradient">
                    {profile.lastName || ""}
                  </span>
                </h1>

                {/* Headline */}
                <div className="animate-fade-in-up animation-delay-200">
                  {hasAnimatedWords ? (
                    <LayoutTextFlip
                      text={profile.headlineStaticText ?? ""}
                      words={profile.headlineAnimatedWords || []}
                      duration={profile.headlineAnimationDuration || 3000}
                      className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground font-medium"
                    />
                  ) : (
                    <p className="text-lg sm:text-2xl lg:text-3xl text-muted-foreground font-medium">
                      {profile.headline || ""}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.shortBio && (
                <p className="text-sm sm:text-lg text-muted-foreground/80 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-300">
                  {profile.shortBio}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in-up animation-delay-400">
                {/* WhatsApp Button */}
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 bg-green-600 text-white rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-green-600/20 hover:bg-green-500 active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.15)_45%,rgba(255,255,255,0.15)_55%,transparent_60%)] bg-[length:200%_100%] animate-shimmer" />
                  <MessageCircle className="w-4 h-4" />
                  <span>Fale Comigo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="#projects"
                  className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 border-2 border-border/60 bg-card/50 backdrop-blur-sm rounded-2xl font-semibold text-sm sm:text-base text-foreground transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:bg-accent active:scale-[0.98]"
                >
                  <Rocket className="w-4 h-4 text-primary" />
                  <span>Ver Projetos</span>
                </Link>
              </div>

              {/* Social Links */}
              {profile.socialLinks && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fade-in-up animation-delay-500">
                  {Object.entries(profile.socialLinks).map(
                    ([platform, url]) => {
                      if (!url) return null;
                      const Icon =
                        socialIcons[platform as keyof typeof socialIcons];
                      const colorClass =
                        socialColors[platform as keyof typeof socialColors] ||
                        "hover:bg-accent";

                      return (
                        <Link
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group relative p-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg ${colorClass}`}
                          aria-label={platform}
                        >
                          {Icon && (
                            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-current transition-colors" />
                          )}
                          <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-lg shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap scale-90 group-hover:scale-100">
                            {platform.charAt(0).toUpperCase() +
                              platform.slice(1)}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-popover" />
                          </span>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}

              {/* Contact Info Cards */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-3 sm:gap-4 animate-fade-in-up animation-delay-600">
                {profile.email && (
                  <Link
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm hover:bg-accent hover:border-primary/30 transition-all w-full sm:w-auto"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {profile.email}
                    </span>
                  </Link>
                )}

                {profile.location && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm w-full sm:w-auto">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {profile.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ═══ PROFILE IMAGE ═══ */}
            <div className="order-1 lg:order-2 animate-fade-in-up animation-delay-200">
              {profile.profileImage && (
                <div className="relative group max-w-[280px] sm:max-w-sm md:max-w-md mx-auto lg:max-w-none">
                  {/* Outer glow */}
                  <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-[1.5rem] sm:rounded-[2rem] opacity-15 blur-2xl sm:blur-3xl group-hover:opacity-25 transition-opacity duration-700 bg-[length:200%_auto] animate-hero-gradient" />

                  {/* Image container */}
                  <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/10">
                    <ProfileImage
                      imageUrl={urlFor(profile.profileImage)
                        .width(800)
                        .height(800)
                        .quality(95)
                        .url()}
                      firstName={profile.firstName || ""}
                      lastName={profile.lastName || ""}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Stats cards - mobile: row below image */}
                  <div className="flex justify-center gap-2.5 sm:gap-3 mt-4 sm:hidden">
                    {stats.map((stat, i) => {
                      const StatIcon = stat.icon;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 bg-card/90 backdrop-blur-md shadow-md"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                            <StatIcon className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-foreground leading-none">
                              {stat.value}
                            </div>
                            <div className="text-[9px] text-muted-foreground font-medium mt-0.5">
                              {stat.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stats cards - desktop floating */}
                  <div className="hidden sm:block">
                    {stats.map((stat, i) => {
                      const StatIcon = stat.icon;
                      const positions = [
                        "-top-4 -left-6 lg:-left-10",
                        "-bottom-4 -right-6 lg:-right-10",
                        "-bottom-4 -left-4 lg:-left-8",
                      ];

                      return (
                        <div
                          key={i}
                          className={`absolute ${positions[i]} z-20 animate-float-card`}
                          style={{ animationDelay: `${i * 2}s` }}
                        >
                          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50 bg-card/90 backdrop-blur-md shadow-lg">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                              <StatIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-lg font-extrabold text-foreground leading-none">
                                {stat.value}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">
                                {stat.label}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary/30 rounded-tr-lg hidden sm:block" />
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary/30 rounded-bl-lg hidden sm:block" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ SCROLL INDICATOR ═══════════ */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in animation-delay-1000">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
          Scroll
        </span>
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-border/30 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}