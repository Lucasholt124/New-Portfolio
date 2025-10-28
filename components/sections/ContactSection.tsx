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
  Sparkles
} from "lucide-react";

const PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  email,
  phone,
  location,
  socialLinks
}`);

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
  medium: BookOpen,
  devto: BookOpen,
  youtube: Youtube,
};

const socialLabels = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Website",
  medium: "Medium",
  devto: "Dev.to",
  youtube: "YouTube",
};

export async function ContactSection() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });

  if (!profile) {
    return null;
  }

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 pb-32 sm:pb-40 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <WorldMapDemo />

      <div className="container relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Vamos conversar
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Entre em Contato
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            De qualquer lugar do mundo, vamos criar algo incrível juntos
          </p>
        </div>

        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="@container/info space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 shadow-lg">
                <h3 className="text-xl @md/info:text-2xl font-bold mb-8 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  Informações de Contato
                </h3>

                <div className="space-y-6">
                  {profile.email && (
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 @md/info:w-14 @md/info:h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="h-5 w-5 @md/info:h-6 @md/info:w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold mb-1 text-sm @md/info:text-base text-foreground">
                          Email
                        </h4>
                        <Link
                          href={`mailto:${profile.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm truncate block group-hover:underline"
                        >
                          {profile.email}
                        </Link>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 @md/info:w-14 @md/info:h-14 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Phone className="h-5 w-5 @md/info:h-6 @md/info:w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold mb-1 text-sm @md/info:text-base text-foreground">
                          Telefone
                        </h4>
                        <Link
                          href={`tel:${profile.phone}`}
                          className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm group-hover:underline"
                        >
                          {profile.phone}
                        </Link>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-start gap-4 group">
                      <div className="w-12 h-12 @md/info:w-14 @md/info:h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="h-5 w-5 @md/info:h-6 @md/info:w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold mb-1 text-sm @md/info:text-base text-foreground">
                          Localização
                        </h4>
                        <p className="text-muted-foreground text-xs @md/info:text-sm">
                          {profile.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {profile.socialLinks && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h4 className="font-bold mb-5 text-sm @md/info:text-base text-foreground">
                      Conecte-se Comigo
                    </h4>
                    <div className="flex flex-wrap gap-2 @md/info:gap-3">
                      {Object.entries(profile.socialLinks).map(([key, url]) => {
                        if (!url) return null;
                        const Icon = socialIcons[key as keyof typeof socialIcons] || Globe;
                        const label = socialLabels[key as keyof typeof socialLabels] || key;

                        return (
                          <Link
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 @md/info:px-4 @md/info:py-2.5 rounded-xl border-2 hover:bg-accent hover:border-primary/50 transition-all text-xs @md/info:text-sm font-medium group hover:scale-105"
                          >
                            <Icon className="h-3.5 w-3.5 @md/info:h-4 @md/info:w-4 group-hover:text-primary transition-colors" />
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            ⚡ Resposta garantida em até 24 horas úteis
          </p>
        </div>
      </div>
    </section>
  );
}