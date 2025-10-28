import { PortableText } from "@portabletext/react";
import { IconCheck, IconClock, IconCurrencyDollar, IconStar, IconArrowRight, IconBriefcase } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

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
        <span className="text-base sm:text-lg font-semibold text-primary">
          Orçamento personalizado
        </span>
      );
    }

    return (
      <div>
        {startingPrice && (
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-muted-foreground">A partir de</span>
            <span className="text-xl sm:text-2xl font-bold text-primary">
              R$ {startingPrice.toLocaleString()}
            </span>
            {priceType && (
              <span className="text-sm text-muted-foreground">
                {priceTypeLabels[priceType]}
              </span>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
    );
  };

  const featured = services.filter((s) => s.featured);
  const regular = services.filter((s) => !s.featured);

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <IconBriefcase className="w-4 h-4" />
              Serviços
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
            O que posso fazer por você
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
            Soluções personalizadas para suas necessidades
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                {services.length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {services.length === 1 ? "Serviço" : "Serviços"}
              </div>
            </div>
            {featured.length > 0 && (
              <>
                <div className="hidden sm:block w-px h-12 bg-border" />
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {featured.length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Em destaque
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Featured Services */}
        {featured.length > 0 && (
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {featured.map((service) => (
                <div
                  key={service.slug?.current || service.title}
                  className="group relative bg-gradient-to-br from-card via-card to-card/95 border-2 border-primary/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 hover:shadow-2xl hover:border-primary/50 transition-all duration-300"
                >
                  {/* Featured Badge */}
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs sm:text-sm font-bold shadow-lg">
                      <IconStar className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                      Destaque
                    </div>
                  </div>

                  {/* Decorative Top Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/30 rounded-t-xl" />

                  {/* Icon */}
                  {service.icon && (
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-6 p-3 sm:p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Image
                        src={urlFor(service.icon).width(80).height(80).url()}
                        alt={service.title || "Service"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {service.shortDescription && (
                    <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  )}

                  {service.features && service.features.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-primary rounded-full" />
                        O que está incluído
                      </h4>
                      <ul className="space-y-2.5 sm:space-y-3">
                        {service.features.map((feature, idx) => (
                          <li
                            key={`${service.title}-feature-${idx}`}
                            className="flex items-start gap-3"
                          >
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0 mt-0.5">
                              <IconCheck className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pricing & Timeline Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl bg-muted/50 border border-border">
                    {service.pricing && (
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center gap-1.5 font-semibold">
                          <IconCurrencyDollar className="w-4 h-4" />
                          Investimento
                        </p>
                        {formatPrice(service.pricing)}
                      </div>
                    )}
                    {service.timeline && (
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center gap-1.5 font-semibold">
                          <IconClock className="w-4 h-4" />
                          Prazo de entrega
                        </p>
                        <p className="text-base sm:text-lg font-semibold">
                          {service.timeline}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  {service.technologies && service.technologies.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Tecnologias utilizadas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, idx) => {
                          const techData = tech && typeof tech === "object" && "name" in tech ? tech : null;
                          return techData?.name ? (
                            <span
                              key={`${service.title}-tech-${idx}`}
                              className="px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-accent border border-border font-medium hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-colors"
                            >
                              {techData.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* CTA Button - Redireciona para freelinnk.com */}
                  <Link
                    href="https://freelinnk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-sm sm:text-base group/btn shadow-lg hover:shadow-xl"
                  >
                    <span>Solicitar orçamento</span>
                    <IconArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Services */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div className="mb-8 sm:mb-12 text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  Outros serviços
                </h3>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {regular.map((service) => (
                <div
                  key={service.slug?.current || service.title}
                  className="group bg-card border rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col"
                >
                  {service.icon && (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={urlFor(service.icon).width(56).height(56).url()}
                        alt={service.title || "Service"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {service.shortDescription && (
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-1 leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  )}

                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-4 sm:mb-6">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={`${service.title}-feature-${idx}`}
                          className="flex items-start gap-2 text-xs sm:text-sm"
                        >
                          <IconCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground line-clamp-2 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-xs sm:text-sm text-primary font-medium">
                          +{service.features.length - 3} mais
                        </li>
                      )}
                    </ul>
                  )}

                  <div className="mt-auto pt-4 sm:pt-6 border-t border-border space-y-3">
                    {service.pricing && (
                      <div className="text-sm sm:text-base">
                        {formatPrice(service.pricing)}
                      </div>
                    )}
                    {service.timeline && (
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                        <IconClock className="w-4 h-4 shrink-0" />
                        {service.timeline}
                      </p>
                    )}

                    {/* CTA Button - Redireciona para mysite-eog7.vercel.app/contrato */}
                    <Link
                      href="https://mysite-eog7.vercel.app/contrato"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-semibold text-sm group/btn"
                    >
                      <span>Solicitar orçamento</span>
                      <IconArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}