import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

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

export async function AboutSection() {
  const { data: profile } = await sanityFetch({ query: ABOUT_QUERY });

  if (!profile) {
    return null;
  }

  return (
    <section
      id="about"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
            Sobre mim
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça-me melhor
          </p>
        </div>

        {/* Bio Content */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          {profile.fullBio && (
            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
              <PortableText
                value={profile.fullBio}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
                        {children}
                      </p>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-8 sm:mt-10 lg:mt-12 mb-3 sm:mb-4 text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-6 sm:mt-8 mb-2 sm:mb-3 text-foreground">
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 sm:pl-6 italic my-6 sm:my-8 text-base sm:text-lg">
                        {children}
                      </blockquote>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    link: ({ children, value }) => {
                      const href = value?.href || "";
                      const isExternal = href.startsWith("http");
                      return (
                        <Link
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="text-primary hover:underline underline-offset-4 transition-colors font-medium"
                        >
                          {children}
                        </Link>
                      );
                    },
                  },
                  list: {
                    bullet: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-muted-foreground marker:text-primary">
                        {children}
                      </ul>
                    ),
                    number: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-muted-foreground marker:text-primary marker:font-semibold">
                        {children}
                      </ol>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => (
                      <li className="text-base sm:text-lg leading-relaxed">
                        {children}
                      </li>
                    ),
                    number: ({ children }) => (
                      <li className="text-base sm:text-lg leading-relaxed">
                        {children}
                      </li>
                    ),
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {profile.stats && profile.stats.length > 0 && (
          <div className="pt-8 sm:pt-12 lg:pt-16 border-t border-border/50">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {profile.stats.map((stat, idx) => (
                <div
                  key={`${stat.label}-${idx}`}
                  className="group text-center p-4 sm:p-6 rounded-lg hover:bg-accent/50 transition-colors duration-300"
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium uppercase tracking-wide">
                    {stat.label}
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