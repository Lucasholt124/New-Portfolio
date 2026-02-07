import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { CometCard } from "../ui/comet-card";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  BadgeCheck,
  Calendar,
  Trophy,
} from "lucide-react";

const CERTIFICATIONS_QUERY =
  defineQuery(`*[_type == "certification"] | order(issueDate desc){
  name,
  issuer,
  issueDate,
  expiryDate,
  credentialId,
  credentialUrl,
  logo,
  description,
  skills[]->{name, category},
  order
}`);

export async function CertificationsSection() {
  const { data: certifications } = await sanityFetch({
    query: CERTIFICATIONS_QUERY,
  });

  if (!certifications || certifications.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
    });
  };

  const isExpired = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // Stats
  const totalCerts = certifications.length;
  const uniqueIssuers = new Set(certifications.map((c) => c.issuer).filter(Boolean)).size;
  const activeCerts = certifications.filter((c) => !isExpired(c.expiryDate)).length;

  const stats = [
    {
      icon: Award,
      value: totalCerts.toString(),
      label: totalCerts === 1 ? "Certificação" : "Certificações",
    },
    {
      icon: BadgeCheck,
      value: uniqueIssuers.toString(),
      label: uniqueIssuers === 1 ? "Emissor" : "Emissores",
    },
    {
      icon: ShieldCheck,
      value: activeCerts.toString(),
      label: "Ativas",
    },
  ];

  return (
    <section
      id="certifications"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* ═══════════ BACKGROUND ═══════════ */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />

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
      <div className="absolute top-20 -left-32 w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Badge */}
          <div className="inline-block mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm">
              <Award className="w-3.5 h-3.5" />
              Credenciais
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-5 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
              Certificações
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-hero-gradient">
              Profissionais
            </span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Credenciais que validam minha expertise e compromisso com a
            excelência
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

        {/* ═══════════ CERTIFICATIONS GRID ═══════════ */}
        <div className="@container">
          <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {certifications.map((cert) => (
              <CometCard
                key={`${cert.issuer}-${cert.name}-${cert.issueDate}`}
                rotateDepth={8}
                translateDepth={10}
                className="w-full"
              >
                {/* Outer Frame */}
                <div
                  className="relative bg-card border-[6px] sm:border-8 border-card/80 rounded-sm shadow-2xl p-3 sm:p-4"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Inner Certificate */}
                  <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border-2 border-yellow-600/40 p-5 sm:p-6 lg:p-8 flex flex-col min-h-[380px] sm:min-h-[420px] lg:min-h-[450px]">
                    {/* ── Corner Decorations ── */}
                    {/* Top Left */}
                    <div className="absolute top-0 left-0 w-14 sm:w-20 h-14 sm:h-20">
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 w-7 sm:w-10 h-7 sm:h-10 border-t-2 border-l-2 border-yellow-600/60" />
                      <div className="absolute top-4 sm:top-5 left-4 sm:left-5 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-l-2 border-yellow-600/40" />
                    </div>

                    {/* Top Right */}
                    <div className="absolute top-0 right-0 w-14 sm:w-20 h-14 sm:h-20">
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 sm:w-10 h-7 sm:h-10 border-t-2 border-r-2 border-yellow-600/60" />
                      <div className="absolute top-4 sm:top-5 right-4 sm:right-5 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-r-2 border-yellow-600/40" />
                    </div>

                    {/* Bottom Left */}
                    <div className="absolute bottom-0 left-0 w-14 sm:w-20 h-14 sm:h-20">
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 w-7 sm:w-10 h-7 sm:h-10 border-b-2 border-l-2 border-yellow-600/60" />
                      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-l-2 border-yellow-600/40" />
                    </div>

                    {/* Bottom Right */}
                    <div className="absolute bottom-0 right-0 w-14 sm:w-20 h-14 sm:h-20">
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-7 sm:w-10 h-7 sm:h-10 border-b-2 border-r-2 border-yellow-600/60" />
                      <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-r-2 border-yellow-600/40" />
                    </div>

                    {/* Diamond Accents */}
                    <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 w-2 sm:w-3 h-2 sm:h-3 rotate-45 bg-yellow-600/70" />
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 sm:w-3 h-2 sm:h-3 rotate-45 bg-yellow-600/70" />
                    <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 w-2 sm:w-3 h-2 sm:h-3 rotate-45 bg-yellow-600/70" />
                    <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 w-2 sm:w-3 h-2 sm:h-3 rotate-45 bg-yellow-600/70" />

                    {/* ── Certificate Content ── */}
                    <div className="relative z-10 flex flex-col items-center text-center flex-1">
                      {/* Date */}
                      <div className="mb-3 sm:mb-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                          <Calendar className="w-3 h-3" />
                          {cert.issueDate && formatDate(cert.issueDate)}
                        </div>
                      </div>

                      {/* Certificate Label */}
                      <div className="mb-4 sm:mb-5">
                        <h4 className="text-sm sm:text-lg font-bold text-yellow-600/80 mb-0.5 uppercase tracking-[0.15em]">
                          Certificado
                        </h4>
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-px w-6 sm:w-8 bg-yellow-600/40" />
                          <p className="text-[10px] sm:text-xs text-yellow-600/60 italic">
                            de conclusão
                          </p>
                          <div className="h-px w-6 sm:w-8 bg-yellow-600/40" />
                        </div>
                      </div>

                      {/* Certificate Name */}
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2 sm:px-4">
                        {cert.name}
                      </h3>

                      {/* Description */}
                      {cert.description && (
                        <p className="text-xs sm:text-sm text-zinc-300/80 mb-4 sm:mb-5 line-clamp-3 px-4 sm:px-8 leading-relaxed">
                          {cert.description}
                        </p>
                      )}

                      {/* Logo Badge */}
                      {cert.logo && (
                        <div className="relative mb-4 sm:mb-5 flex items-center justify-center">
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 p-2 bg-white/10 rounded-full border border-yellow-600/30">
                            <div className="relative w-full h-full">
                              <Image
                                src={urlFor(cert.logo)
                                  .width(128)
                                  .height(128)
                                  .url()}
                                alt={`${cert.name} badge`}
                                fill
                                sizes="64px"
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Issued By */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs text-zinc-500 mb-0.5">
                          Emitido por
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-white">
                          {cert.issuer}
                        </p>
                      </div>

                      {/* Bottom Details */}
                      <div className="flex-1 flex flex-col justify-end w-full mt-auto">
                        {/* Skills */}
                        {cert.skills && cert.skills.length > 0 && (
                          <div className="mb-3 sm:mb-4">
                            <div className="flex flex-wrap justify-center gap-1.5">
                              {cert.skills.slice(0, 4).map((skill, idx) => {
                                const skillData =
                                  skill &&
                                  typeof skill === "object" &&
                                  "name" in skill
                                    ? skill
                                    : null;
                                return skillData?.name ? (
                                  <span
                                    key={`${cert.name}-skill-${idx}`}
                                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] bg-yellow-600/20 text-yellow-500 font-medium border border-yellow-600/30 rounded-sm"
                                  >
                                    {skillData.name}
                                  </span>
                                ) : null;
                              })}
                              {cert.skills.length > 4 && (
                                <span className="px-2 py-0.5 text-[9px] sm:text-[10px] bg-yellow-600/10 text-yellow-600/60 font-medium border border-yellow-600/20 rounded-sm">
                                  +{cert.skills.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expiry & Credential Info */}
                        <div className="space-y-1.5 sm:space-y-2 text-xs mb-3 sm:mb-4">
                          {cert.expiryDate && (
                            <div className="text-center">
                              <span className="text-zinc-500">
                                Válido até:{" "}
                              </span>
                              <span
                                className={
                                  isExpired(cert.expiryDate)
                                    ? "text-red-400 font-semibold"
                                    : "text-zinc-300 font-semibold"
                                }
                              >
                                {formatDate(cert.expiryDate)}
                                {isExpired(cert.expiryDate) && (
                                  <span className="ml-1 text-[10px]">
                                    (Expirado)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}

                          {!cert.expiryDate && (
                            <div className="text-center">
                              <span className="inline-flex items-center gap-1 text-green-400/80 text-[10px] sm:text-xs font-medium">
                                <ShieldCheck className="w-3 h-3" />
                                Sem expiração
                              </span>
                            </div>
                          )}

                          {cert.credentialId && (
                            <div className="text-center">
                              <p className="text-[8px] sm:text-[9px] text-zinc-500 mb-0.5">
                                ID da credencial
                              </p>
                              <p className="text-[8px] sm:text-[9px] font-mono text-zinc-400 break-all px-2 sm:px-4">
                                {cert.credentialId}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Verify Button */}
                        {cert.credentialUrl && (
                          <div className="w-full pt-3 sm:pt-4 border-t border-yellow-600/20">
                            <Link
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/verify inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-zinc-900 bg-yellow-600/90 hover:bg-yellow-500 transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-yellow-600/20 rounded-sm"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verificar credencial
                              <ExternalLink className="w-3 h-3 opacity-60 group-hover/verify:translate-x-0.5 group-hover/verify:-translate-y-0.5 transition-transform" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CometCard>
            ))}
          </div>
        </div>

        {/* ═══════════ BOTTOM NOTE ═══════════ */}
        <div className="mt-10 sm:mt-14 lg:mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sempre buscando novas certificações e especializações
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}