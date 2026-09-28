/* Pure geometry for the axonometric 3D figures — no React, no "use client", so
 * server components can build scenes too. The renderer lives in iso3d.tsx.
 *
 * Occlusion is a painter's algorithm: every primitive gets a depth and is drawn
 * far-to-near. That ordering is not optional — the same lesson cost a full
 * render in Manim, where a ground plane built from many separate tiles painted
 * straight over the objects standing on it.
 */
import { ADJ, HYP, INK, OPP, YELLOW } from "./scene-kit";

export type V3 = readonly [number, number, number];

export type Prim =
  | { kind: "poly"; pts: V3[]; fill: string; stroke?: string; sw?: number; op?: number }
  | { kind: "seg"; a: V3; b: V3; stroke: string; sw: number; dash?: string; op?: number }
  | { kind: "blob"; at: V3; r: number; fill: string; stroke?: string; sw?: number }
  | { kind: "text"; at: V3; text: string; fill: string; size?: number; dy?: number };

/* Camera tilt. 0 = straight-on front elevation, which is how NCERT draws every
   figure and how a student will see it in the exam — a tilted view skews the
   right angles and makes the geometry harder to read, not easier. The
   projection still carries depth, so objects behind others still occlude
   correctly; they just line up on a true front view. */
export const FRONT = 0;
export const TILTED = 58 * (Math.PI / 180);

/** World point -> screen point plus a depth (larger = farther from camera). */
export function project(p: V3, yaw: number, s: number, cx: number, cy: number,
                        pitch: number = FRONT) {
  const c = Math.cos(yaw), sn = Math.sin(yaw);
  const x = p[0] * c - p[1] * sn;
  const y = p[0] * sn + p[1] * c;
  const z = p[2];
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return {
    x: cx + x * s,
    y: cy - (y * sp + z * cp) * s,
    d: y * cp - z * sp,
  };
}

export const centroid = (pts: V3[]): V3 => [
  pts.reduce((t, p) => t + p[0], 0) / pts.length,
  pts.reduce((t, p) => t + p[1], 0) / pts.length,
  pts.reduce((t, p) => t + p[2], 0) / pts.length,
];

/* ── primitive builders ─────────────────────────────────────────────────── */

/** Checkerboard ground. Tiles are separate faces so they sort correctly against
 *  anything standing on them. */
/** The ground in a front elevation: one strong line plus a soft band below it. */
export function groundLine(halfWidth = 6, colour = "#18201b"): Prim[] {
  return [
    { kind: "poly",
      pts: [[-halfWidth, 0, -0.9], [halfWidth, 0, -0.9], [halfWidth, 0, 0], [-halfWidth, 0, 0]],
      fill: "#e4dfcd" },
    { kind: "seg", a: [-halfWidth, 0, 0], b: [halfWidth, 0, 0], stroke: colour, sw: 4 },
  ];
}

export function ground(nx = 9, ny = 7, cell = 1, light = "#efe9d6", dark = "#ded7c0"): Prim[] {
  const out: Prim[] = [];
  for (let i = 0; i < nx; i += 1) {
    for (let j = 0; j < ny; j += 1) {
      const x = (i - nx / 2) * cell, y = (j - ny / 2) * cell;
      out.push({
        kind: "poly",
        pts: [[x, y, 0], [x + cell, y, 0], [x + cell, y + cell, 0], [x, y + cell, 0]],
        fill: (i + j) % 2 === 0 ? light : dark,
      });
    }
  }
  return out;
}

/** An upright rectangular post: the two faces the camera can see, plus a cap. */
export function post(x: number, y: number, h: number, w = 0.16,
                     fill = "#c96f3f", dark = "#a9552c", cap = "#e08a55"): Prim[] {
  const a = w / 2;
  return [
    { kind: "poly", pts: [[x - a, y - a, 0], [x + a, y - a, 0], [x + a, y - a, h], [x - a, y - a, h]],
      fill, stroke: INK, sw: 1.5 },
    { kind: "poly", pts: [[x + a, y - a, 0], [x + a, y + a, 0], [x + a, y + a, h], [x + a, y - a, h]],
      fill: dark, stroke: INK, sw: 1.5 },
    { kind: "poly", pts: [[x - a, y - a, h], [x + a, y - a, h], [x + a, y + a, h], [x - a, y + a, h]],
      fill: cap, stroke: INK, sw: 1.5 },
  ];
}

/** A tree: boxed trunk plus a camera-facing canopy, so it reads at any yaw. */
export function tree(x: number, y: number, h: number): Prim[] {
  const trunkH = h * 0.52;
  return [
    ...post(x, y, trunkH, h * 0.075, "#7a4a24", "#5f3818", "#8a5a2e"),
    { kind: "blob", at: [x - h * 0.11, y, h * 0.70], r: h * 0.20, fill: "#357a38", stroke: INK, sw: 2 },
    { kind: "blob", at: [x + h * 0.12, y, h * 0.72], r: h * 0.18, fill: "#357a38", stroke: INK, sw: 2 },
    { kind: "blob", at: [x, y, h * 0.82], r: h * 0.24, fill: "#3f8f42", stroke: INK, sw: 2 },
  ];
}

/** The shadow a vertical object of height `h` casts, as a flat quad on z=0. */
export function shadowQuad(x: number, y: number, h: number, ray: readonly [number, number],
                           w = 0.42): Prim {
  const lx = x + ray[0] * h, ly = y + ray[1] * h;
  return {
    kind: "poly",
    pts: [[x, y - w / 2, 0.001], [lx, ly - w / 2, 0.001],
          [lx, ly + w / 2, 0.001], [x, y + w / 2, 0.001]],
    fill: "#3c3c33", op: 0.5,
  };
}

/** The right triangle formed by an upright object, its shadow and the sun ray. */
export function standingTriangle(x: number, y: number, h: number,
                                 ray: readonly [number, number],
                                 fill = YELLOW, op = 0.5): Prim[] {
  const lx = x + ray[0] * h, ly = y + ray[1] * h;
  return [
    { kind: "poly", pts: [[x, y, 0], [lx, ly, 0], [x, y, h]], fill, op, stroke: HYP, sw: 2.5 },
  ];
}

/** NCERT's triangle ABC standing upright on the ground: right angle at B, the
 *  adjacent leg lying along the ground and the opposite leg going straight up.
 *  Standing it up is the point — a student can walk around it and see the sides
 *  are real objects, not marks on paper. */
export function rightTriangle3D({
  adj, opp, at = "A", lit = [], sides = {}, y = 0, labels = true,
}: {
  adj: number; opp: number;
  at?: "A" | "C";
  lit?: ("hyp" | "opp" | "adj")[];
  sides?: { ab?: string; bc?: string; ac?: string };
  y?: number;
  labels?: boolean;
}): Prim[] {
  const B: V3 = [0, y, 0], A: V3 = [adj, y, 0], C: V3 = [0, y, opp];
  // Which geometric side plays which role depends on the angle we name from —
  // the same single source of truth the flat figure uses.
  const roleOf = (sd: "ab" | "bc" | "ac") =>
    sd === "ac" ? "hyp" : at === "A" ? (sd === "bc" ? "opp" : "adj")
                                     : (sd === "ab" ? "opp" : "adj");
  const col = { hyp: HYP, opp: OPP, adj: ADJ } as const;
  const on = (sd: "ab" | "bc" | "ac") => lit.includes(roleOf(sd));
  const paint = (sd: "ab" | "bc" | "ac") => (on(sd) ? col[roleOf(sd)] : INK);
  const wide = (sd: "ab" | "bc" | "ac") => (on(sd) ? 7 : 3);
  const out: Prim[] = [
    { kind: "poly", pts: [A, B, C], fill: YELLOW, op: 0.22 },
    { kind: "seg", a: B, b: A, stroke: paint("ab"), sw: wide("ab") },
    { kind: "seg", a: B, b: C, stroke: paint("bc"), sw: wide("bc") },
    { kind: "seg", a: A, b: C, stroke: paint("ac"), sw: wide("ac") },
    // the right angle at B, drawn as a small square in the triangle's plane
    { kind: "seg", a: [0.34, y, 0], b: [0.34, y, 0.34], stroke: INK, sw: 2.5 },
    { kind: "seg", a: [0.34, y, 0.34], b: [0, y, 0.34], stroke: INK, sw: 2.5 },
  ];
  if (labels) {
    out.push(
      { kind: "text", at: [adj + 0.34, y, 0], text: "A", fill: INK, size: 20, dy: 6 },
      { kind: "text", at: [-0.36, y, 0], text: "B", fill: INK, size: 20, dy: 6 },
      { kind: "text", at: [-0.30, y, opp + 0.2], text: "C", fill: INK, size: 20 },
    );
  }
  if (sides.ab) out.push({ kind: "text", at: [adj / 2, y, -0.42], text: sides.ab, fill: paint("ab"), size: 18 });
  if (sides.bc) out.push({ kind: "text", at: [-0.72, y, opp / 2], text: sides.bc, fill: paint("bc"), size: 18 });
  if (sides.ac) out.push({ kind: "text", at: [adj / 2 + 0.5, y, opp / 2 + 0.34], text: sides.ac, fill: paint("ac"), size: 18 });
  return out;
}

/** A tapered tower — the Qutub Minar, storey by storey. */
export function tower3d(x: number, y: number, h: number): Prim[] {
  const out: Prim[] = [];
  const bands = [0, 0.4, 0.63, 0.79, 0.9, 1.0];
  const wAt = (f: number) => 0.42 * (1 - 0.62 * f);
  for (let i = 0; i < bands.length - 1; i += 1) {
    const z0 = bands[i] * h, z1 = bands[i + 1] * h;
    const a0 = wAt(bands[i]), a1 = wAt(bands[i + 1]);
    const sand = i < 3 ? "#b5563a" : "#e8e2d2";
    const dark = i < 3 ? "#8f4029" : "#cfc7b2";
    out.push(
      { kind: "poly", pts: [[x - a0, y - a0, z0], [x + a0, y - a0, z0],
                            [x + a1, y - a1, z1], [x - a1, y - a1, z1]],
        fill: sand, stroke: INK, sw: 1.5 },
      { kind: "poly", pts: [[x + a0, y - a0, z0], [x + a0, y + a0, z0],
                            [x + a1, y + a1, z1], [x + a1, y - a1, z1]],
        fill: dark, stroke: INK, sw: 1.5 },
      // the projecting balcony that stops it reading as a plain cone
      { kind: "poly", pts: [[x - a1 - 0.13, y - a1 - 0.13, z1], [x + a1 + 0.13, y - a1 - 0.13, z1],
                            [x + a1 + 0.13, y + a1 + 0.13, z1], [x - a1 - 0.13, y + a1 + 0.13, z1]],
        fill: "#d9a066", stroke: INK, sw: 1.5 },
    );
  }
  return out;
}

