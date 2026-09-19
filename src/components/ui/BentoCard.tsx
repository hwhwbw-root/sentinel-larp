"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { liftOnHover } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface BentoCardProps extends HTMLMotionProps<"div"> {
  variant?: "tile" | "stat";
  interactive?: boolean;
}

/**
 * Shared card surface for the whole app. `tile` is for larger grouped
 * panels (charts, grouped lists); `stat` is for compact numeric readouts.
 * Using two sizes instead of one avoids a dashboard full of oversized
 * rounded-[2.5rem] boxes around small numbers.
 */
export function BentoCard({
  variant = "tile",
  interactive = false,
  className,
  children,
  ...props
}: BentoCardProps) {
  const reduceMotion = useReducedMotion();
  const hoverProps = interactive && !reduceMotion ? liftOnHover : {};

  return (
    <motion.div
      className={cn(
        "bg-white border border-zinc-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)]",
        variant === "tile" ? "rounded-[2.5rem] p-8" : "rounded-2xl p-5",
        className,
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
