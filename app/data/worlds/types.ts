/**
 * Lesson worlds: the live, lesson-specific scene each Class 6-10 story plays out on.
 *
 * A world is a handful of on-screen objects ("artifacts": a poster, a chat, a phone, a graph...) that the
 * author fills with THIS lesson's content. Every scene (and every possible decision outcome) is a patch of
 * changes to those objects, so the learner watches the lesson's problem appear, get worse, and get fixed.
 *
 * Strings are [English, Hindi] pairs. The renderer picks one itself, so this folder is skipped by the
 * Hindi catalogue extractor (see scripts/extract-language-catalogue.cjs).
 */
export type T = readonly [en: string, hi: string];
export type Tone = "ok" | "risk" | "warn" | "info" | "muted";
export type Icon = string; // name from app/module/cyber/lessons/worlds/icons.ts
export type Slot = "a" | "b" | "c";

type Base = {
  id: string;
  /** Layout slot. Defaults to "a". */
  at?: Slot;
  title?: T;
  icon?: Icon;
  /** Short callout pinned to the object in this moment, e.g. "Anyone online can see this". */
  note?: T;
  noteTone?: Tone;
  /** Hidden until a scene patch sets hide:false (or hidden again with hide:true). */
  hide?: boolean;
  /** Gentle emphasis: the object glows and lifts. */
  focus?: boolean;
};

/** A poster, form, profile, notice or receipt made of tokens the learner can reason about. */
export type Doc = Base & {
  k: "doc";
  look?: "poster" | "form" | "profile" | "notice" | "receipt" | "card" | "note";
  sub?: T;
  pic?: Icon;
  stamp?: T;
  toks: { id: string; t: T; icon?: Icon }[];
  /** Per-token state: risk = glows red, ok = green tick, hide = blacked out, hl = highlighted, warn = amber. */
  mark?: Record<string, "risk" | "ok" | "hide" | "hl" | "warn" | "gone">;
};

/** A message thread. `upTo` reveals the first n messages; flags colour a bubble. */
export type Chat = Base & {
  k: "chat";
  who: T;
  look?: "phone" | "group" | "email" | "call";
  msgs: { from: "me" | "them" | "sys"; t: T; flag?: Tone; sender?: string }[];
  upTo?: number;
  typing?: boolean;
};

/** A phone / browser / laptop screen with an address bar and content blocks. */
export type Screen = Base & {
  k: "screen";
  look?: "phone" | "browser" | "laptop";
  /** Address bar split into parts so one part can be highlighted. */
  url?: { t: string; mark?: Tone }[];
  lock?: "ok" | "bad";
  blocks: { id: string; type: "text" | "btn" | "field" | "popup" | "banner" | "price" | "qr" | "row" | "app" | "bar"; t: T; sub?: T; icon?: Icon }[];
  mark?: Record<string, Tone | "hide" | "press" | "done">;
  upTo?: number;
};

/** A settings panel: switches plus an optional live meter that follows them. */
export type Switches = Base & {
  k: "sw";
  rows: { id: string; t: T; sub?: T; icon?: Icon; on: boolean }[];
  /** Override which switches are on in this moment. */
  on?: Record<string, boolean>;
  meter?: { t: T; v: number; tone?: Tone; lo?: T; hi?: T };
};

/** A process, route, map or network: nodes at x/y (0-100) joined by links. */
export type Flow = Base & {
  k: "flow";
  look?: "steps" | "graph";
  nodes: { id: string; t: T | string; icon?: Icon; x: number; y: number; sub?: string }[];
  links: { from: string; to: string; t?: T | string }[];
  state?: Record<string, "done" | "now" | "bad" | "ok" | "risk" | "muted" | "lit">;
  /** "a>b" -> on (bright), off (faded) or bad (red, broken). */
  link?: Record<string, "on" | "off" | "bad">;
  /** A marker travelling to this node. */
  cur?: string;
};

/** Rows and columns: logs, datasets, records, variable traces. */
export type Table = Base & {
  k: "table";
  cols: T[];
  rows: { id: string; c: (string | T)[] }[];
  upTo?: number;
  /** Row tone. */
  mark?: Record<string, Tone | "hl" | "gone">;
  /** Cell tone, keyed "rowId:colIndex". */
  cell?: Record<string, Tone | "hl">;
  /** Replace a cell's text in this moment, keyed "rowId:colIndex". */
  txt?: Record<string, string | T>;
  foot?: T;
};

/** Bars, scatter, line, split or 2x2 matrix charts. */
export type Chart = Base & {
  k: "chart";
  look: "bars" | "scatter" | "line" | "matrix" | "split";
  bars?: { id: string; t: T | string; v: number; tone?: Tone }[];
  max?: number;
  /** A horizontal reference line (average, threshold) or, for scatter, a vertical cut at x. */
  ref?: { v: number; t: T };
  pts?: { x: number; y: number; c?: "a" | "b" | "q"; t?: string }[];
  /** Scatter: classify with a vertical boundary at x (0-100). */
  cut?: number;
  /** Scatter: labels for the zone left and right of the cut. */
  zones?: [T, T];
  line?: number[];
  hl?: number[];
  /** Matrix: [truePositive, falsePositive, falseNegative, trueNegative] plus labels. */
  cells?: [number, number, number, number];
  axes?: [T, T];
  /** Split: share of pieces in each side, e.g. training vs test. */
  parts?: { t: T; v: number; tone?: Tone }[];
};

/** A grid: robot maps, pixels, signal lamps, scanning windows. */
export type Grid = Base & {
  k: "grid";
  look?: "map" | "pixels" | "lamps";
  w: number;
  h: number;
  /** Cell content by index. */
  cells?: Record<number, { t?: string; icon?: Icon; tone?: Tone }>;
  walls?: number[];
  path?: number[];
  me?: number;
  goal?: number;
  on?: number[];
  win?: { x: number; y: number; w: number; h: number };
  /** Label under each column (e.g. bit weights 128 64 32 ...). */
  foot?: string[];
};

/** Who can see something: rings of audience around the learner. */
export type Crowd = Base & {
  k: "crowd";
  rings: { id: string; t: T; n: number; icon?: Icon }[];
  /** Rings currently reached. */
  on: string[];
  /** Colour of a reached ring: risk (exposed, default) or ok (approved audience). */
  tone?: Tone;
};

/** Money moving: each line is a payment, fee, refund or charge. */
export type Ledger = Base & {
  k: "ledger";
  lines: { id: string; t: T; amt: string; dir: "in" | "out" | "hold"; sub?: T; icon?: Icon }[];
  mark?: Record<string, Tone | "gone">;
  upTo?: number;
  total?: { t: T; v: string | T };
};

/** Things happening in time: logs, versions, access periods. */
export type Time = Base & {
  k: "time";
  ev: { id: string; at: string; t: T; sub?: T; icon?: Icon }[];
  upTo?: number;
  mark?: Record<string, Tone | "hl">;
  /** A "now" marker after this many events. */
  now?: number;
};

/** A row of tiles with blanks: patterns, sorted lists, bit strings. */
export type Seq = Base & {
  k: "seq";
  tiles: (string | T)[];
  /** Tile indexes hidden behind a "?". */
  blank?: number[];
  mark?: Record<number, Tone | "hl">;
  rule?: T;
  /** Optional second row (for comparisons). */
  row2?: (string | T)[];
};

export type Artifact = Doc | Chat | Screen | Switches | Flow | Table | Chart | Grid | Crowd | Ledger | Time | Seq;
/** Changes to named artifacts. Plain-object fields (mark, state, link, cell, txt, on) merge one level deep; everything else replaces. */
export type Patch = Record<string, { [field: string]: unknown }>;

export type World = {
  slug: string;
  /** Stage backdrop mood: where the lesson happens. */
  scene: "classroom" | "home" | "street" | "lab" | "market" | "library" | "arena" | "night" | "garden";
  /** Layout of the three slots. one: a; two: a|b side by side; stack: a over b; three: a | b over c. */
  layout?: "one" | "two" | "stack" | "three";
  art: Artifact[];
  /** Six scenes, in story order. Each patch changes the art for that scene. */
  sc: [Patch, Patch, Patch, Patch, Patch, Patch];
  /** What the stage shows when the learner tries each decision option (keyed by option id), on top of scene 4. */
  out: Record<string, Patch>;
  /** A short label for what the stage is, e.g. "Club poster draft". Shown above the stage. */
  label: T;
};
