"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// "Vertical Tabs" de 21st.dev, mantido como o original (Tailwind, motion, hugeicons).
// Mudanças para o site da RD:
// - os itens chegam por `services` (cada área passa os seus), em vez da lista fixa;
// - cada item pode trazer `media` (qualquer elemento, ex.: a folha de exemplo em SVG) no lugar de `image`;
// - título, rótulo e textos de acessibilidade em português; cabeçalho opcional;
// - com "reduzir movimento" a troca automática não roda e as animações ficam desligadas.

export type VerticalTabsService = {
  id: string;
  title: string;
  description: string;
  image?: string;
  media?: React.ReactNode;
  caption?: string;
};

type VerticalTabsProps = {
  services: VerticalTabsService[];
  title?: string;
  label?: string;
  className?: string;
  ariaLabel?: string;
  /** Dentro de uma seção que já tem margens e título: sem fundo, sem respiro em cima e embaixo. */
  embedded?: boolean;
};

const AUTO_PLAY_DURATION = 5000;

export function VerticalTabs({ services, title, label, className, ariaLabel, embedded = false }: VerticalTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduce = useReducedMotion();
  const total = services.length;

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused || reduce || total < 2) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, reduce, total, handleNext]);

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const active = services[activeIndex];

  return (
    <MotionConfig reducedMotion="user">
      <section
        className={cn("w-full bg-background py-8 md:py-16 lg:py-24", embedded && "bg-transparent py-0 md:py-0 lg:py-0", className)}
        aria-label={ariaLabel}
      >
        <div className={cn("w-full px-4 md:px-8 lg:px-12 xl:px-20 mx-auto", embedded && "px-0 pl-5 md:px-0 md:pl-7 lg:px-0 lg:pl-7 xl:px-0 xl:pl-7")}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Coluna esquerda: lista */}
            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-4">
              {(title || label) && (
                <div className="space-y-1 mb-12">
                  {title && (
                    <h2 className="tracking-tighter text-balance text-3xl font-medium md:text-4xl lg:text-5xl text-foreground">
                      {title}
                    </h2>
                  )}
                  {label && (
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.3em] block ml-0.5">
                      ({label})
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col space-y-0">
                {services.map((service, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleTabClick(index)}
                      aria-pressed={isActive}
                      className={cn(
                        "group relative flex items-start gap-4 py-6 md:py-8 text-left transition-all duration-500 border-t border-border/50 first:border-0 bg-transparent cursor-pointer",
                        isActive ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground"
                      )}
                    >
                      <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[2px] bg-muted">
                        {isActive && (
                          <motion.div
                            key={`progress-${index}-${isPaused}`}
                            className="absolute top-0 left-0 w-full bg-foreground origin-top"
                            initial={{ height: "0%" }}
                            animate={isPaused || reduce ? { height: "0%" } : { height: "100%" }}
                            transition={{
                              duration: AUTO_PLAY_DURATION / 1000,
                              ease: "linear",
                            }}
                          />
                        )}
                      </div>

                      <span className="text-[9px] md:text-[10px] font-medium mt-1 tabular-nums opacity-50">
                        /{String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex flex-col gap-2 flex-1">
                        <span
                          className={cn(
                            "text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight transition-colors duration-500",
                            isActive ? "text-foreground" : ""
                          )}
                        >
                          {service.title}
                        </span>

                        <AnimatePresence mode="wait">
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed max-w-sm pb-2 m-0">
                                {service.description}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coluna direita: imagem do item aberto */}
            <div className="lg:col-span-7 flex flex-col justify-end h-full order-1 lg:order-2">
              <div
                className="relative group/gallery"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative aspect-4/5 md:aspect-4/3 lg:aspect-16/11 rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-muted/30 border border-border/40">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        y: { type: "spring", stiffness: 260, damping: 32 },
                        opacity: { duration: 0.4 },
                      }}
                      className="absolute inset-0 w-full h-full cursor-pointer"
                      onClick={handleNext}
                    >
                      {active.media ? (
                        <div className="flex h-full w-full items-center justify-center p-6 md:p-10 [&_svg]:h-full [&_svg]:w-auto">
                          {active.media}
                        </div>
                      ) : (
                        <>
                          <img
                            src={active.image}
                            alt={active.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 m-0! p-0! block"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60" />
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-background transition-all active:scale-90 cursor-pointer"
                      aria-label="Anterior"
                    >
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-background transition-all active:scale-90 cursor-pointer"
                      aria-label="Próximo"
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                    </button>
                  </div>
                </div>
                {active.caption && <p className="mt-3 text-center text-sm text-muted-foreground">{active.caption}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default VerticalTabs;
