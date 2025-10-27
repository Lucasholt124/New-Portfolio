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
  ArrowRight
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

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
  };

  // Validação segura para headlineAnimatedWords
  const hasAnimatedWords = profile.headlineStaticText &&
                          profile.headlineAnimatedWords &&
                          profile.headlineAnimatedWords.length > 0;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />

      {/* Background Ripple Effect com opacidade ajustada */}
      <div className="absolute inset-0 opacity-30">
        <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />
      </div>

      {/* Animated gradient orbs for visual interest */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Text Content - Mobile First Approach */}
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">

              {/* Badge de Status */}
              {profile.availability && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium animate-fade-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {profile.availability}
                </div>
              )}

              {/* Nome com gradiente */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight animate-fade-in-up">
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {profile.firstName || ''}
                  </span>{" "}
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient bg-300%">
                    {profile.lastName || ''}
                  </span>
                </h1>

                {/* Headline Animada ou Estática */}
                <div className="animate-fade-in-up animation-delay-200">
                  {hasAnimatedWords ? (
                    <LayoutTextFlip
                      text={profile.headlineStaticText ?? ''}
                      words={profile.headlineAnimatedWords || [] }
                      duration={profile.headlineAnimationDuration || 3000}
                      className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium"
                    />
                  ) : (
                    <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium">
                      {profile.headline || ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio com melhor tipografia */}
              {profile.shortBio && (
                <p className="text-base sm:text-lg text-muted-foreground/90 leading-relaxed max-w-xl animate-fade-in-up animation-delay-300">
                  {profile.shortBio}
                </p>
              )}

              {/* Botão de Ação Principal */}
              <div className="animate-fade-in-up animation-delay-400">
                <Link
                  href="#contact"
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                >
                  <Mail className="w-4 h-4" />
                  <span>Entre em Contato</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Links Sociais com ícones modernos */}
              {profile.socialLinks && (
                <div className="flex flex-wrap gap-3 animate-fade-in-up animation-delay-500">
                  {Object.entries(profile.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform as keyof typeof socialIcons];

                    return (
                      <Link
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent hover:border-primary/50 transition-all hover:scale-110 hover:-translate-y-1"
                        aria-label={platform}
                      >
                        {Icon && <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}

                        {/* Tooltip */}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Informações de Contato com design moderno */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-4 animate-fade-in-up animation-delay-600">
                {profile.email && (
                  <Link
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                    <span className="truncate">{profile.email}</span>
                  </Link>
                )}

                {profile.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary/60" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.yearsOfExperience && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary/60" />
                    <span>{profile.yearsOfExperience}+ anos de experiência</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Image com efeitos modernos */}
            <div className="order-1 lg:order-2 animate-fade-in-up animation-delay-200">
              {profile.profileImage && (
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity animate-gradient bg-300%" />

                  {/* Container da imagem */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <ProfileImage
                      imageUrl={urlFor(profile.profileImage)
                        .width(800)
                        .height(800)
                        .quality(95)
                        .url()}
                      firstName={profile.firstName || ""}
                      lastName={profile.lastName || ""}
                    />
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}