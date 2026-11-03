"use client";

import { useRef, useState, useEffect, ReactNode, ElementType } from "react";

export type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "fade";

export interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number; // milliseconds
  duration?: number; // milliseconds
  distance?: number; // pixels
  threshold?: number; // 0 to 1
  className?: string;
  as?: ElementType;
  once?: boolean;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 750,
  distance = 36,
  threshold = 0.12,
  className = "",
  as: Component = "div",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once && hasAnimated) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px", // Trigger slightly before it hits bottom of viewport
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once, hasAnimated]);

  // Compute transform based on direction
  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";

    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0) scale(0.98)`;
      case "down":
        return `translate3d(0, -${distance}px, 0) scale(0.98)`;
      case "left":
        return `translate3d(${distance}px, 0, 0) scale(0.98)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0) scale(0.98)`;
      case "scale":
        return "translate3d(0, 0, 0) scale(0.92)";
      case "fade":
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Ultra-smooth deceleration
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Convenience wrapper for staggered children (e.g. grids of cards)
 */
export interface StaggerGroupProps {
  children: ReactNode[];
  direction?: RevealDirection;
  baseDelay?: number;
  staggerInterval?: number;
  duration?: number;
  distance?: number;
  className?: string;
  itemClassName?: string;
}

export function StaggerGroup({
  children,
  direction = "up",
  baseDelay = 0,
  staggerInterval = 120,
  duration = 750,
  distance = 36,
  className = "",
  itemClassName = "",
}: StaggerGroupProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          direction={direction}
          delay={baseDelay + index * staggerInterval}
          duration={duration}
          distance={distance}
          className={itemClassName}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}
