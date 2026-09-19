"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const NODES = [
  { x: 90, y: 80, delay: 0 },
  { x: 260, y: 60, delay: 0.4 },
  { x: 190, y: 190, delay: 0.8 },
  { x: 340, y: 170, delay: 1.2 },
  { x: 120, y: 280, delay: 0.2 },
  { x: 300, y: 300, delay: 0.6 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
];

/**
 * Decorative sensor-network illustration for the login page's right panel.
 * Isolated + memoized so its perpetual pulse loops never re-render with the
 * parent form.
 */
export const SensorNetworkGraphic = memo(function SensorNetworkGraphic() {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 420 380"
      className="w-full h-full max-w-md"
      role="presentation"
      aria-hidden="true"
    >
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].x}
          y1={NODES[a].y}
          x2={NODES[b].x}
          y2={NODES[b].y}
          stroke="#2f6fed"
          strokeOpacity={0.25}
          strokeWidth={1.5}
        />
      ))}
      {NODES.map((node, i) => (
        <g key={i}>
          <circle cx={node.x} cy={node.y} r={5} fill="#2f6fed" />
          {!reduceMotion && (
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={5}
              fill="none"
              stroke="#2f6fed"
              strokeWidth={1.5}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 2.8 }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: node.delay,
                ease: "easeOut",
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          )}
        </g>
      ))}
    </svg>
  );
});
