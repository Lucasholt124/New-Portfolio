import { defineQuery } from "next-sanity";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { MessageSquareQuote, Star, Users, TrendingUp } from "lucide-react";

const TESTIMONIALS_QUERY = defineQuery(`*[_type == "testimonial" && featured == true] | order(order asc){
  name,
  position,
  company,
  testimonial,
  rating,
  date,
  avatar,
  companyLogo,
  linkedinUrl
}`);

export async function TestimonialsSection() {
  const { data: testimonials } = await sanityFetch({
    query: TESTIMONIALS_QUERY,
  });

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Calculate stats
  const avgRating =
    testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) /
    testimonials.length;
  const uniqueCompanies = new Set(
    testimonials.map((t) => t.company).filter(Boolean)
  ).size;

  // Map Sanity testimonials to AnimatedTestimonials format
  const formattedTestimonials = testimonials.map((testimonial) => ({
    quote: testimonial.testimonial || "",
    name: testimonial.name || "Anonymous",
    designation: testimonial.company
      ? `${testimonial.position} at ${testimonial.company}`
      : testimonial.position || "",
    src: testimonial.avatar
      ? urlFor(testimonial.avatar).width(500).height(500).quality(90).url()
      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
    companyLogo: testimonial.companyLogo
      ? urlFor(testimonial.companyLogo).width(32).height(32).url()
      : undefined,
  }));

  const stats = [
    {
      icon: Users,
      value: testimonials.length.toString(),
      label: testimonials.length === 1 ? "Cliente" : "Clientes",
    },
    {
      icon: Star,
      value: avgRating.toFixed(1),
      label: "Avaliação Média",
    },
    {
      icon: TrendingUp,
      value: uniqueCompanies.toString(),
      label: uniqueCompanies === 1 ? "Empresa" : "Empresas",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto max-w-7xl">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              Depoimentos
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              O que dizem sobre
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              meu trabalho
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Feedbacks reais de pessoas com quem tive o prazer de colaborar
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* ═══════════ TESTIMONIALS CAROUSEL ═══════════ */}
        <div className="w-full max-w-6xl mx-auto">
          <AnimatedTestimonials
            testimonials={formattedTestimonials}
            autoplay={true}
          />
        </div>

        {/* ═══════════ STATS ═══════════ */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
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

                  {/* Separator dot (not on last item) */}
                  {i < stats.length - 1 && (
                    <div className="hidden sm:block ml-4 sm:ml-6 lg:ml-8 h-8 w-px bg-border/50" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}