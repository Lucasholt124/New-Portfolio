// components/ui/animated-testimonials.tsx
"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  companyLogo?: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Autoplay only if enabled AND not paused by user interaction
  useEffect(() => {
    if (autoplay && !isPaused) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, isPaused, handleNext]);

  // When user interacts (clicks prev/next), pause autoplay permanently
  const handleUserNext = () => {
    setIsPaused(true);
    handleNext();
  };

  const handleUserPrev = () => {
    setIsPaused(true);
    handlePrev();
  };

  const isActive = (index: number) => {
    return index === active;
  };

  // Generate a deterministic rotation for each card position relative to active
  const getRotation = (index: number) => {
    const offset = index - active;
    // Fixed rotations instead of random ones
    const rotations = [-8, -5, -3, 0, 3, 5, 8];
    const rotIndex =
      ((offset % rotations.length) + rotations.length) % rotations.length;
    return rotations[rotIndex];
  };

  return (
    <div
      className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-10 md:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        // Only resume if user hasn't manually clicked
        // We keep it paused once user interacts
      }}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        {/* Image stack */}
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: getRotation(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : getRotation(index),
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length - Math.abs(index - active),
                    y: isActive(index) ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: getRotation(index),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Text content */}
        <div className="flex justify-between flex-col py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              {testimonials[active].companyLogo && (
                <Image
                  src={testimonials[active].companyLogo}
                  alt="Company logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {testimonials[active].name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {testimonials[active].designation}
                </p>
              </div>
            </div>
            <motion.p className="text-lg text-muted-foreground mt-6 leading-relaxed">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex gap-4 pt-8 md:pt-0 mt-8">
            <button
              onClick={handleUserPrev}
              className="h-9 w-9 rounded-full bg-secondary/80 border border-border/50 flex items-center justify-center group/button hover:bg-primary/10 hover:border-primary/30 transition-colors"
              aria-label="Depoimento anterior"
            >
              <IconArrowLeft className="h-5 w-5 text-muted-foreground group-hover/button:text-primary transition-colors" />
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsPaused(true);
                    setActive(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive(index)
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleUserNext}
              className="h-9 w-9 rounded-full bg-secondary/80 border border-border/50 flex items-center justify-center group/button hover:bg-primary/10 hover:border-primary/30 transition-colors"
              aria-label="Próximo depoimento"
            >
              <IconArrowRight className="h-5 w-5 text-muted-foreground group-hover/button:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};