import Link from "next/link";
import { defineQuery } from "next-sanity";
import WorldMapDemo from "@/components/world-map-demo";
import { sanityFetch } from "@/sanity/lib/live";
import { ContactForm } from "./ContactForm";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  BookOpen,
  Youtube,
  MessageSquare,
  Clock,
  Zap,
  Send,
} from "lucide-react";

const PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  email,
  phone,
  location,
  socialLinks
}`);

const socialConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
  }
> = {
  github: {
    icon: Github,
    label: "GitHub",
    color: "hover:bg-gray-800 hover:text-white hover:border-gray-700",
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    color: "hover:bg-blue-600 hover:text-white hover:border-blue-500",
  },
  twitter: {
    icon: Twitter,
    label: "Twitter",
    color: "hover:bg-sky-500 hover:text-white hover:border-sky-400",
  },
  website: {
    icon: Globe,
    label: "Website",
    color: "hover:bg-primary hover:text-primary-foreground hover:border-primary",
  },
  medium: {
    icon: BookOpen,
    label: "Medium",
    color: "hover:bg-zinc-800 hover:text-white hover:border-zinc-700",
  },
  devto: {
    icon: BookOpen,
    label: "Dev.to",
    color: "hover:bg-zinc-800 hover:text-white hover:border-zinc-700",
  },
  youtube: {
    icon: Youtube,
    label: "YouTube",
    color: "hover:bg-red-600 hover:text-white hover:border-red-500",
  },
};

const contactItems = [
  {
    key: "email",
    icon: Mail,
    label: "Email",
    gradient: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "phone",
    icon: Phone,
    label: "Telefone",
    gradient: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    key: "location",
    icon: MapPin,
    label: "Localização",
    gradient: "from-purple-500/10 to-purple-600/10",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
] as const;

export async function ContactSection() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });

  if (!profile) {
    return null;
  }

  const getContactValue = (key: string) => {
    switch (key) {
      case "email":
        return profile.email;
      case "phone":
        return profile.phone;
      case "location":
        return profile.location;
      default:
        return null;
    }
  };

  const getContactHref = (key: string, value: string) => {
    switch (key) {
      case "email":
        return `mailto:${value}`;
      case "phone":
        return `tel:${value}`;
      default:
        return null;
    }
  };

  return (
    <section
      id="contact"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-36 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />

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

      {/* World Map */}
      <WorldMapDemo />

      <div className="container relative mx-auto max-w-6xl z-10">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              Vamos conversar
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              Entre em
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              Contato
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            De qualquer lugar do mundo, vamos criar algo incrível juntos
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
            <div className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-foreground leading-none">
                  Resposta Rápida
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                  Em até 24h
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-border/50" />

            <div className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/15 transition-colors">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-foreground leading-none">
                  Disponível
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                  Para novos projetos
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-border/50" />

            <div className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-foreground leading-none">
                  Remoto
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                  Qualquer lugar do mundo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ CONTENT GRID ═══════════ */}
        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* ═══ CONTACT INFO ═══ */}
            <div className="@container/info space-y-5 sm:space-y-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Send className="h-4 w-4 text-primary" />
                  </div>
                  Informações de Contato
                </h3>

                <div className="space-y-5 sm:space-y-6">
                  {contactItems.map((item) => {
                    const value = getContactValue(item.key);
                    if (!value) return null;

                    const href = getContactHref(item.key, value);
                    const ContactIcon = item.icon;

                    return (
                      <div
                        key={item.key}
                        className="flex items-start gap-3 sm:gap-4 group"
                      >
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 border border-border/30`}
                        >
                          <ContactIcon
                            className={`h-4 w-4 sm:h-5 sm:w-5 ${item.iconColor}`}
                          />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <h4 className="font-semibold mb-0.5 text-sm text-foreground">
                            {item.label}
                          </h4>
                          {href ? (
                            <Link
                              href={href}
                              className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm truncate block group-hover:underline underline-offset-4"
                            >
                              {value}
                            </Link>
                          ) : (
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              {value}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Social Links */}
                {profile.socialLinks && (
                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/40">
                    <h4 className="font-semibold mb-4 text-sm text-foreground flex items-center gap-2">
                      <div className="h-1 w-4 bg-primary rounded-full" />
                      Conecte-se Comigo
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.socialLinks).map(
                        ([key, url]) => {
                          if (!url) return null;
                          const config = socialConfig[key] || {
                            icon: Globe,
                            label: key.charAt(0).toUpperCase() + key.slice(1),
                            color:
                              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                          };
                          const SocialIcon = config.icon;

                          return (
                            <Link
                              key={key}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`group/social relative inline-flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 text-xs sm:text-sm font-medium hover:scale-105 hover:-translate-y-0.5 hover:shadow-md ${config.color}`}
                            >
                              <SocialIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors" />
                              <span className="hidden sm:inline">
                                {config.label}
                              </span>

                              {/* Tooltip for mobile (icon only) */}
                              <span className="sm:hidden absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-popover text-popover-foreground text-[10px] font-medium rounded-md shadow-lg border border-border/50 opacity-0 group-hover/social:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {config.label}
                              </span>
                            </Link>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Response time card */}
              <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Tempo médio de resposta
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Normalmente respondo em até{" "}
                      <span className="font-semibold text-primary">
                        24 horas úteis
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ CONTACT FORM ═══ */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>

        {/* ═══════════ BOTTOM NOTE ═══════════ */}
        <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
             Disponível para contratação CLT, PJ, freelance ou consultoria — vamos conversar!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}