"use client";

import type { ReactNode } from "react";
import type {
  MistakeFeedback,
  PracticeAttempt,
} from "../../../../components/learning/LearningSupport";
import styles from "./chapter-lesson.module.css";

/* Shared palette and figure kit for the Chapter 8 lesson panels. One triangle
   component drives every §8.2 figure, so "opposite" is always the same red and
   "adjacent" the same green wherever a student meets them. */

export const INK = "#18201b";
export const OPP = "#c73e1d";
export const ADJ = "#2e7d32";
export const HYP = "#3b3bc4";
export const YELLOW = "#f7d75a";
export const PAPER = "#f3f1e7";

export type PanelProps = {
  onAnswer: (skill: string, correct: boolean, attempt: PracticeAttempt) => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
  onComplete: () => void;
};

export type SideRole = "hyp" | "opp" | "adj";

const ROLE_COLOUR: Record<SideRole, string> = { hyp: HYP, opp: OPP, adj: ADJ };

/**
 * Right triangle ABC, right-angled at B, in the book's orientation: B bottom
 * left, A bottom right, C top left.
 *
 * `at` is the acute angle we are naming sides from — and it is the whole point
 * of §8.2 that flipping it from "A" to "C" swaps which side is opposite and
 * which is adjacent, while the hypotenuse never moves. One prop does that here,
 * so the two figures cannot drift apart.
 */
export function TriangleScene({
  at = "A",
  opp = 3,
  adj = 4,
  lit = [],
  sides = {},
  vertexLabels = true,
  names = ["A", "B", "C"],
  angleLabel,
  note,
  panel,
}: {
  at?: "A" | "C";
  /** Shape, in arbitrary units: the leg facing A and the leg touching A. */
  opp?: number;
  adj?: number;
  /** Which side roles (relative to `at`) are drawn bold and in role colour. */
  lit?: SideRole[];
  /** Length text for each geometric side. */
  sides?: { ab?: string; bc?: string; ac?: string };
  vertexLabels?: boolean;
  /** Vertex letters for the [bottom-right, bottom-left, top-left] positions. */
  names?: [string, string, string];
  /** Text at the marked angle, when it is not just the vertex letter (e.g. θ). */
  angleLabel?: string;
  note?: string;
  /** Lines of working shown in the reading column on the right. */
  panel?: { title: string; lines: string[] };
}): ReactNode {
  const s = Math.min(370 / adj, 300 / opp);
  const W = adj * s;
  const H = opp * s;
  // Leave room on the right for the reading column when there is one.
  const B = { x: Math.max(150, 140 + ((panel ? 400 : 660) - W) / 2), y: 402 };
  const A = { x: B.x + W, y: B.y };
  const C = { x: B.x, y: B.y - H };

  // Which geometric side plays which role depends on the angle we name from.
  const roleOf = (side: "ab" | "bc" | "ac"): SideRole =>
    side === "ac" ? "hyp" : at === "A" ? (side === "bc" ? "opp" : "adj")
                                       : (side === "ab" ? "opp" : "adj");
  const on = (side: "ab" | "bc" | "ac") => lit.includes(roleOf(side));
  const stroke = (side: "ab" | "bc" | "ac") =>
    on(side) ? ROLE_COLOUR[roleOf(side)] : INK;
  const width = (side: "ab" | "bc" | "ac") => (on(side) ? 8 : 3.5);

  // Arc at the named angle, from one arm round to the other.
  const r = 44;
  const L = Math.hypot(W, H);
  // Unit normal to AC pointing away from B, so hypotenuse labels clear the line.
  const nx = H / L, ny = -W / L;
  const hypAt = (d: number) => ({
    x: (A.x + C.x) / 2 + nx * d,
    y: (A.y + C.y) / 2 + ny * d,
  });
  const arc =
    at === "A"
      ? `M ${A.x - r} ${A.y} A ${r} ${r} 0 0 1 ` +
        `${(A.x - (r * W) / L).toFixed(1)} ${(A.y - (r * H) / L).toFixed(1)}`
      : `M ${C.x} ${C.y + r} A ${r} ${r} 0 0 0 ` +
        `${(C.x + (r * W) / L).toFixed(1)} ${(C.y + (r * H) / L).toFixed(1)}`;

  return (
    <svg viewBox="0 0 820 470" className={styles.topicSvg} role="img"
         aria-label={`Right triangle ABC, right angle at B, with the sides named from angle ${at}`}>
      <rect x="0" y="0" width="820" height="470" fill={PAPER} />

      {/* faint fill so the triangle reads as a shape, not three loose lines */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
               fill={YELLOW} fillOpacity="0.16" />

      <line x1={B.x} y1={B.y} x2={A.x} y2={A.y}
            stroke={stroke("ab")} strokeWidth={width("ab")} strokeLinecap="round" />
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y}
            stroke={stroke("bc")} strokeWidth={width("bc")} strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y}
            stroke={stroke("ac")} strokeWidth={width("ac")} strokeLinecap="round" />

      {/* right angle at B — always, it is what makes the names mean anything */}
      <polyline points={`${B.x + 24},${B.y} ${B.x + 24},${B.y - 24} ${B.x},${B.y - 24}`}
                fill="none" stroke={INK} strokeWidth="3" />

      <path d={arc} fill="none" stroke={INK} strokeWidth="3.5" />
      {angleLabel && (
        <text x={at === "A" ? A.x - 76 : C.x + 20} y={at === "A" ? A.y - 16 : C.y + 42}
              fill={INK} fontSize="21" fontWeight="800">{angleLabel}</text>
      )}

      {vertexLabels && (
        <g fill={INK} fontSize="23" fontWeight="800">
          <text x={A.x + 14} y={A.y + 9}>{names[0]}</text>
          <text x={B.x - 28} y={B.y + 9}>{names[1]}</text>
          <text x={C.x - 10} y={C.y - 14}>{names[2]}</text>
        </g>
      )}

      {/* side length labels, placed clear of the lines they name */}
      {sides.ab && (
        <text x={(B.x + A.x) / 2} y={B.y + 34} textAnchor="middle" fill={stroke("ab")}
              fontSize="20" fontWeight="800">{sides.ab}</text>
      )}
      {sides.bc && (
        <text x={B.x - 20} y={(B.y + C.y) / 2 + 6} textAnchor="end"
              fill={stroke("bc")} fontSize="20" fontWeight="800">{sides.bc}</text>
      )}
      {sides.ac && (
        <text x={hypAt(32).x} y={hypAt(32).y} textAnchor="middle" fill={stroke("ac")}
              fontSize="20" fontWeight="800">{sides.ac}</text>
      )}

      {/* role tags on the lit sides — the naming is the lesson */}
      {on("bc") && (
        <text x={B.x - 20} y={(B.y + C.y) / 2 + 32} textAnchor="end"
              fill={ROLE_COLOUR[roleOf("bc")]} fontSize="15" fontWeight="800">
          {roleOf("bc") === "opp" ? `opposite ${angleLabel ?? at}` : `adjacent to ${angleLabel ?? at}`}
        </text>
      )}
      {on("ab") && (
        <text x={(B.x + A.x) / 2} y={B.y - 16} textAnchor="middle"
              fill={ROLE_COLOUR[roleOf("ab")]} fontSize="15" fontWeight="800">
          {roleOf("ab") === "opp" ? `opposite ${angleLabel ?? at}` : `adjacent to ${angleLabel ?? at}`}
        </text>
      )}
      {on("ac") && (
        <text x={hypAt(sides.ac ? 56 : 32).x} y={hypAt(sides.ac ? 56 : 32).y}
              textAnchor="middle" fill={HYP} fontSize="15" fontWeight="800">hypotenuse</text>
      )}

      {note && (
        <text x="40" y="46" fill={INK} fontSize="17" fontWeight="700">{note}</text>
      )}

      {panel && (
        <g transform="translate(560, 60)">
          <rect x="0" y="0" width="228" height={38 + panel.lines.length * 30}
                rx="12" fill="#fffdf5" stroke={INK} strokeWidth="3" />
          <text x="16" y="27" fill={INK} fontSize="15" fontWeight="800">{panel.title}</text>
          {panel.lines.map((line, i) => (
            <text key={line} x="16" y={57 + i * 30} fill={HYP} fontSize="17" fontWeight="800">
              {line}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}

/** A reading-column card for SimilarScene. Declared here, not inside the scene,
    so it is a stable component type across renders. */
function Box({ y, title, lines, solid }: {
  y: number; title: string; lines: string[]; solid?: boolean;
}): ReactNode {
  return (
    <g transform={`translate(524, ${y})`}>
      <rect x="0" y="0" width="268" height={34 + lines.length * 26} rx="12"
            fill={solid ? ADJ : "#fffdf5"} stroke={INK} strokeWidth="3" />
      <text x="15" y="24" fill={solid ? "#eaf4ea" : INK} fontSize="14" fontWeight="800">
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={line} x="15" y={48 + i * 26}
              fill={solid ? "#ffffff" : HYP} fontSize="16" fontWeight="800">{line}</text>
      ))}
    </g>
  );
}

/**
 * NCERT Fig 8.6 — a small triangle PAM and a large triangle CAB sharing angle A.
 * The figure exists to make one claim checkable by eye: different sizes, same
 * angle, same ratios.
 */
export function SimilarScene({ step }: { step: number }): ReactNode {
  const A = { x: 486, y: 400 }, B = { x: 56, y: 400 }, C = { x: 56, y: 168 };
  const t = 0.45;
  const P = { x: A.x + t * (C.x - A.x), y: A.y + t * (C.y - A.y) };
  const M = { x: P.x, y: A.y };
  const r = 46, L = Math.hypot(A.x - C.x, A.y - C.y);

  return (
    <svg viewBox="0 0 820 470" className={styles.topicSvg} role="img"
         aria-label="A small right triangle nested inside a large one, both sharing the same angle A">
      <rect x="0" y="0" width="820" height="470" fill={PAPER} />

      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
               fill={YELLOW} fillOpacity="0.2" />
      {step >= 1 && (
        <polygon points={`${A.x},${A.y} ${M.x},${M.y} ${P.x},${P.y}`}
                 fill={HYP} fillOpacity="0.22" />
      )}

      <line x1={B.x} y1={B.y} x2={A.x} y2={A.y} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <polyline points={`${B.x + 22},${B.y} ${B.x + 22},${B.y - 22} ${B.x},${B.y - 22}`}
                fill="none" stroke={INK} strokeWidth="3" />

      {step >= 1 && (
        <>
          <line x1={P.x} y1={P.y} x2={M.x} y2={M.y} stroke={HYP} strokeWidth="6" strokeLinecap="round" />
          <polyline points={`${M.x - 20},${M.y} ${M.x - 20},${M.y - 20} ${M.x},${M.y - 20}`}
                    fill="none" stroke={HYP} strokeWidth="3" />
          <circle cx={P.x} cy={P.y} r="7" fill={HYP} stroke={INK} strokeWidth="2.5" />
          <text x={P.x + 14} y={P.y - 10} fill={HYP} fontSize="21" fontWeight="800">P</text>
          <text x={M.x - 8} y={M.y + 30} fill={HYP} fontSize="21" fontWeight="800">M</text>
        </>
      )}

      <path d={`M ${A.x - r} ${A.y} A ${r} ${r} 0 0 1 ` +
               `${(A.x - (r * (A.x - C.x)) / L).toFixed(1)} ${(A.y - (r * (A.y - C.y)) / L).toFixed(1)}`}
            fill="none" stroke={INK} strokeWidth="3.5" />
      <g fill={INK} fontSize="23" fontWeight="800">
        <text x={A.x + 14} y={A.y + 9}>A</text>
        <text x={B.x - 30} y={B.y + 9}>B</text>
        <text x={C.x - 10} y={C.y - 14}>C</text>
      </g>

      {step >= 2 && (
        <Box y={44} title="two matching angles"
             lines={["same angle A", "both right-angled", "so \u25b3PAM ~ \u25b3CAB"]} />
      )}
      {step >= 3 && (
        <Box y={192} title="proportional sides"
             lines={["AM/AB = AP/AC", "        = MP/BC"]} />
      )}
      {step >= 4 && (
        <Box y={306} solid title="rearrange"
             lines={["MP/AP = BC/AC", "        = sin A"]} />
      )}
    </svg>
  );
}
