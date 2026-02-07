import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  Briefcase,
  Check,
  Clock,
  DollarSign,
  Star,
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(order asc, _createdAt desc){
  title,
  slug,
  icon,
  shortDescription,
  fullDescription,
  features,
  technologies[]->{name, category},
  deliverables,
  pricing,
  timeline,
  featured,
  order
}`);

export async function ServicesSection() {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });

  if (!services || services.length === 0) {
    return null;
  }

  const formatPrice = (pricing: {
    startingPrice?: number;
    priceType?: string;
    description?: string;
  }) => {
    if (!pricing) return null;

    const { startingPrice, priceType, description } = pricing;

    const priceTypeLabels: Record<string, string> = {
      hourly: "/hora",
      project: "/projeto",
      monthly: "/mês",
      custom: "",
    };

    if (priceType === "custom") {
      return (
        <span className="text-sm sm:text-base font-semibold text-primary">
          Orçamento personalizado
        </span>
      );
    }

    return (
      <div>
        {startingPrice && (
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm text-muted-foreground">
              A partir de
            </span>
            <span className="text-lg sm:text-xl font-bold text-primary tabular-nums">
              R$ {startingPrice.toLocaleString("pt-BR")}
            </span>
            {priceType && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                {priceTypeLabels[priceType]}
              </span>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground/70 mt-1">
            {description}
          </p>
        )}
      </div>
    );
  };

  const featured = services.filter((s) => s.featured);
  const regular = services.filter((s) => !s.featured);

  // Stats
  const totalServices = services.length;
  const featuredCount = featured.length;
  const uniqueTechs = new Set(
    services.flatMap((s) =>
      (s.technologies || [])
        .filter((t) => t !== null)
        .map((t) => t?.name)
        .filter(Boolean)
    )
  ).size;

  const stats = [
    {
      icon: Briefcase,
      value: totalServices.toString(),
      label: totalServices === 1 ? "Serviço" : "Serviços",
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
    ...(uniqueTechs > 0
      ? [
          {
            icon: Layers,
            value: uniqueTechs.toString(),
            label: "Tecnologias",
          },
        ]
      : []),
  ];

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
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

      <div className="container relative mx-auto max-w-7xl">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <Briefcase className="w-3.5 h-3.5" />
              Serviços
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              O que posso
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              fazer por você
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Soluções personalizadas para transformar suas ideias em realidade
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

                  {i < stats.length - 1 && (
                    <div className="hidden sm:block ml-4 sm:ml-6 lg:ml-8 h-8 w-px bg-border/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════ FEATURED SERVICES ═══════════ */}
        {featured.length > 0 && (
          <div className="mb-10 sm:mb-14 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
              {featured.map((service) => (
                <div
                  key={service.slug?.current || service.title}
                  className="group relative bg-card border-2 border-primary/20 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300"
                >
                  {/* Accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30" />

                  {/* Featured badge */}
                  <div className="absolute -top-px -right-px z-10">
                    <div className="flex items-center gap-1.5 pl-3 pr-4 py-1.5 sm:pl-4 sm:pr-5 sm:py-2 rounded-bl-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs sm:text-sm font-bold shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Destaque
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 lg:p-8 pt-8 sm:pt-10">
                    {/* Icon */}
                    {service.icon && (
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-5 sm:mb-6 p-2.5 sm:p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
                        <Image
                          src={urlFor(service.icon)
                            .width(128)
                            .height(128)
                            .url()}
                          alt={service.title || "Service"}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors leading-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    {service.shortDescription && (
                      <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
                        {service.shortDescription}
                      </p>
                    )}

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <div className="mb-5 sm:mb-6 rounded-xl bg-muted/30 border border-border/30 p-4 sm:p-5">
                        <h4 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2 text-foreground">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                            <Check className="w-3.5 h-3.5 text-primary" />
                          </div>
                          O que está incluído
                        </h4>
                        <ul className="space-y-2.5">
                          {service.features.map((feature, idx) => (
                            <li
                              key={`${service.title}-feature-${idx}`}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                            >
                              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pricing & Timeline */}
                    {(service.pricing || service.timeline) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 sm:mb-6 p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/10">
                        {service.pricing && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 font-semibold uppercase tracking-wide">
                              <DollarSign className="w-3.5 h-3.5" />
                              Investimento
                            </p>
                            {formatPrice(service.pricing)}
                          </div>
                        )}
                        {service.timeline && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 font-semibold uppercase tracking-wide">
                              <Clock className="w-3.5 h-3.5" />
                              Prazo
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-foreground">
                              {service.timeline}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Technologies */}
                    {service.technologies &&
                      service.technologies.length > 0 && (
                        <div className="mb-5 sm:mb-6">
                          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                            Tecnologias
                          </p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {service.technologies.map((tech, idx) => {
                              const techData =
                                tech &&
                                typeof tech === "object" &&
                                "name" in tech
                                  ? tech
                                  : null;
                              return techData?.name ? (
                                <span
                                  key={`${service.title}-tech-${idx}`}
                                  className="px-2.5 py-1 text-xs rounded-lg bg-accent/80 border border-border/50 font-medium hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-200 cursor-default"
                                >
                                  {techData.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                    {/* CTA */}
                    <Link
                      href="https://freelinnk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:shadow-primary/20"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Solicitar orçamento</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ REGULAR SERVICES ═══════════ */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  Outros Serviços
                </h3>
                <div className="flex-1 h-px bg-border/40 hidden sm:block" />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {regular.map((service) => (
                <div
                  key={service.slug?.current || service.title}
                  className="group bg-card border rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300 flex flex-col"
                >
                  <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                    {/* Icon */}
                    {service.icon && (
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-4 p-2 sm:p-2.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={urlFor(service.icon)
                            .width(96)
                            .height(96)
                            .url()}
                          alt={service.title || "Service"}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                      {service.title}
                    </h3>

                    {/* Description */}
                    {service.shortDescription && (
                      <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed line-clamp-3">
                        {service.shortDescription}
                      </p>
                    )}

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <li
                            key={`${service.title}-feature-${idx}`}
                            className="flex items-start gap-2 text-xs sm:text-sm"
                          >
                            <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground line-clamp-1 leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-xs text-primary font-medium pl-5.5">
                            +{service.features.length - 3} mais
                          </li>
                        )}
                      </ul>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-border/40 space-y-3">
                      {/* Pricing & Timeline */}
                      <div className="space-y-1.5">
                        {service.pricing && (
                          <div className="text-sm">
                            {formatPrice(service.pricing)}
                          </div>
                        )}
                        {service.timeline && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            {service.timeline}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <Link
                        href="https://mysite-eog7.vercel.app/contrato"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-semibold text-sm hover:shadow-lg hover:shadow-primary/20"
                      >
                        <span>Solicitar orçamento</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ BOTTOM NOTE ═══════════ */}
        <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Disponível para novos projetos e consultorias
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}