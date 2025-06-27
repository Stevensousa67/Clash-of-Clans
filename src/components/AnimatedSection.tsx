"use client";
import { useState, useEffect, useRef, ReactNode } from "react";

type AnimationType = "fade-in" | "fade-in-up" | "fade-in-left" | "fade-in-right";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: string;
  delay?: string;
}

const AnimatedSection = ({
  children,
  animation = "fade-in-up",
  duration = "duration-700",
  delay = "delay-0",
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-in":
        return isVisible ? "opacity-100" : "opacity-0";
      case "fade-in-up":
        return isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8";
      case "fade-in-left":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-8";
      case "fade-in-right":
        return isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8";
      default:
        return "";
    }
  };

  return (
    <div
      ref={sectionRef}
      className={`transition-all ${duration} ${delay} ease-out motion-safe:transition-all ${getAnimationClass()}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
