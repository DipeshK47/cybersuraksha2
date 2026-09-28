import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./toy-workshop.module.css";

export type ToyView = "top" | "front" | "side";
export type BlockCoordinate = readonly [number, number, number];

const viewpointBlocks: readonly BlockCoordinate[] = [
  [0, 0, 0],
  [1, 0, 0],
  [2, 0, 0],
  [1, 0, 1],
  [1, 0, 2],
];

export const assemblyPieces: readonly (readonly BlockCoordinate[])[] = [
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 2],
    [0, 0, 0],
  ],
  [
    [1, 1, 0],
    [1, 1, 1],
    [1, 1, 2],
    [1, 0, 1],
    [2, 1, 2],
  ],
  [
    [2, 1, 0],
    [2, 1, 1],
  ],
];

const finalAssembly: readonly BlockCoordinate[] = assemblyPieces.flat();

export const assemblyCandidates: Record<
  "A" | "B" | "C" | "D",
  readonly BlockCoordinate[]
> = {
  A: finalAssembly.filter(
    ([x, y, z]) => !(x === 1 && y === 0 && z === 1),
  ),
  B: finalAssembly.map(([x, y, z]) =>
    x === 2 && y === 1 && z < 2 ? ([2, 0, z] as const) : ([x, y, z] as const),
  ),
  C: finalAssembly.filter(
    ([x, y, z]) => !(x === 2 && y === 1 && z === 2),
  ),
  D: finalAssembly,
};

function blockKey([x, y, z]: BlockCoordinate) {
  return `${x}-${y}-${z}`;
}

export function CubeAssemblyFigure({
  blocks,
  label,
}: {
  blocks: readonly BlockCoordinate[];
  label: string;
}) {
  const sorted = [...blocks].sort(
    (a, b) => a[2] - b[2] || b[1] - a[1] || a[0] - b[0],
  );

  return (
    <svg
      aria-label={label}
      className={styles.cubeAssemblyFigure}
      role="img"
      viewBox="0 0 190 170"
    >
      <title>{label}</title>
      {sorted.map(([x, y, z], index) => {
        const left = 45 + x * 34 - y * 13;
        const top = 121 - z * 34 + y * 12;
        return (
          <g
            className={styles.assemblyCube}
            key={blockKey([x, y, z])}
            style={{ "--cube-order": index } as CSSProperties}
          >
            <rect
              fill="var(--toy-orange)"
              height="32"
              stroke="#171e19"
              strokeWidth="2.4"
              width="32"
              x={left}
              y={top}
            />
            <path
              d={`M${left} ${top} L${left + 10} ${top - 9} H${left + 42} L${left + 32} ${top} Z`}
              fill="#ffd596"
              stroke="#171e19"
              strokeLinejoin="round"
              strokeWidth="2.4"
            />
            <path
              d={`M${left + 32} ${top} L${left + 42} ${top - 9} V${top + 23} L${left + 32} ${top + 32} Z`}
              fill="#e78635"
              stroke="#171e19"
              strokeLinejoin="round"
              strokeWidth="2.4"
            />
          </g>
        );
      })}
    </svg>
  );
}

export function ViewpointFigure({ view }: { view: ToyView }) {
  const camera = {
    top: {
      label: "LOOK FROM ABOVE",
      line: <path d="M96 8 V43 M88 35 L96 43 L104 35" />,
    },
    front: {
      label: "LOOK FROM THE FRONT",
      line: <path d="M12 136 H49 M41 128 L49 136 L41 144" />,
    },
    side: {
      label: "LOOK FROM THE SIDE",
      line: <path d="M179 100 H143 M151 92 L143 100 L151 108" />,
    },
  }[view];

  return (
    <div className={styles.viewpointFigure}>
      <CubeAssemblyFigure
        blocks={viewpointBlocks}
        label="Five blocks arranged as a three-block base with a three-block tower in the centre"
      />
      <svg
        aria-hidden="true"
        className={`${styles.cameraArrow} ${styles[`camera${view}`]}`}
        viewBox="0 0 190 170"
      >
        <g fill="none" stroke="var(--toy-violet)" strokeLinecap="round" strokeWidth="4">
          {camera.line}
        </g>
      </svg>
      <span>{camera.label}</span>
    </div>
  );
}

const projections: Record<ToyView, readonly (readonly [number, number])[]> = {
  top: [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  front: [
    [0, 0],
    [1, 0],
    [2, 0],
    [1, 1],
    [1, 2],
  ],
  side: [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
};

export function ProjectionFigure({ view }: { view: ToyView }) {
  const squares = projections[view];
  return (
    <svg
      aria-label={`${view} view projection of the five-block model`}
      className={styles.projectionFigure}
      role="img"
      viewBox="0 0 150 120"
    >
      <title>{`${view} view projection`}</title>
      {squares.map(([x, y]) => (
        <rect
          fill="var(--toy-orange)"
          height="30"
          key={`${x}-${y}`}
          rx="2"
          stroke="#171e19"
          strokeWidth="2.5"
          width="30"
          x={30 + x * 30}
          y={82 - y * 30}
        />
      ))}
      {view === "side" ? (
        <text
          fill="var(--sl-muted)"
          fontFamily="var(--font-mono), monospace"
          fontSize="9"
          textAnchor="middle"
          x="104"
          y="24"
        >
          blocks overlap
        </text>
      ) : null}
    </svg>
  );
}

export function CabinFigure({ scanning }: { scanning: boolean }) {
  return (
    <div
      aria-label="Handbook toy cabin with a grey roof, white sloping panel, black inner square and black front face"
      className={`${styles.cabinFigure} ${
        scanning ? styles.cabinFigureScanning : ""
      }`}
      role="img"
    >
      <Image
        alt=""
        height={680}
        priority
        sizes="(max-width: 800px) 88vw, 520px"
        src="/handbook/grade-3/toy-joy-top-view-object.png"
        unoptimized
        width={720}
      />
      <span>Original handbook figure</span>
      {scanning ? <i aria-hidden="true" /> : null}
    </div>
  );
}

export function StepSolidFigure({ revealHidden }: { revealHidden: boolean }) {
  return (
    <svg
      aria-label="Stepped solid with five visible faces and three camera-hidden faces"
      className={styles.stepSolidFigure}
      role="img"
      viewBox="0 0 260 205"
    >
      <title>Eight-face stepped solid</title>
      <path
        d="M46 65 H134 V105 H190 V165 H46 Z"
        fill="var(--toy-orange)"
        stroke="#171e19"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M46 65 L75 43 H160 L134 65 Z"
        fill="#ffd596"
        stroke="#171e19"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M134 65 L160 43 V83 L134 105 Z"
        fill="#e78635"
        stroke="#171e19"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M134 105 L160 83 H216 L190 105 Z"
        fill="#ffd596"
        stroke="#171e19"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M190 105 L216 83 V143 L190 165 Z"
        fill="#e78635"
        stroke="#171e19"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      {[
        [92, 122, "1"],
        [105, 56, "2"],
        [148, 80, "3"],
        [172, 96, "4"],
        [202, 134, "5"],
      ].map(([x, y, number]) => (
        <text
          fill="#171e19"
          fontFamily="var(--font-mono), monospace"
          fontSize="15"
          fontWeight="800"
          key={number}
          textAnchor="middle"
          x={x}
          y={y}
        >
          {number}
        </text>
      ))}
      <g className={revealHidden ? styles.hiddenFacesVisible : styles.hiddenFaces}>
        <path d="M46 65 L23 84 V181 L46 165 Z" />
        <path d="M23 181 L164 181 L190 165 L46 165 Z" />
        <path d="M75 43 H160 V83 H216 V143 L190 165 V105 H134 V65 H46 Z" />
        <text x="11" y="126">6</text>
        <text x="103" y="197">7</text>
        <text x="202" y="60">8 behind</text>
      </g>
    </svg>
  );
}

export function TwoCubeDotsFigure() {
  const dots = [
    [28, 38],
    [103, 38],
    [28, 108],
    [103, 108],
    [48, 23],
    [123, 23],
    [96, 60],
    [171, 60],
    [96, 130],
    [171, 130],
    [116, 45],
    [191, 45],
  ];
  return (
    <svg
      aria-label="Two overlapping wireframe cubes with twelve visible corner dots"
      className={styles.twoCubeDotsFigure}
      role="img"
      viewBox="0 0 220 155"
    >
      <title>Two cubes with twelve visible corner dots</title>
      <g fill="none" stroke="var(--sl-line)" strokeLinejoin="round" strokeWidth="3">
        <path d="M28 38 H103 V108 H28 Z" />
        <path d="M48 23 H123 V93" />
        <path d="M28 38 L48 23 M103 38 L123 23 M103 108 L123 93" />
        <path d="M96 60 H171 V130 H96 Z" />
        <path d="M116 45 H191 V115 L171 130" />
        <path d="M96 60 L116 45 M171 60 L191 45" />
      </g>
      {dots.map(([x, y], index) => (
        <circle
          cx={x}
          cy={y}
          fill="var(--toy-violet)"
          key={`${x}-${y}`}
          r="5.5"
          stroke="#171e19"
          strokeWidth="2"
          style={{ "--dot-order": index } as CSSProperties}
        />
      ))}
    </svg>
  );
}

export type SortingShape = {
  name: string;
  edges: number;
  points: string;
};

export function SortingShapeFigure({ shape }: { shape: SortingShape }) {
  return (
    <svg
      aria-label={`${shape.name}, ${shape.edges} edges`}
      className={styles.sortingShapeFigure}
      role="img"
      viewBox="0 0 100 100"
    >
      <title>{`${shape.name} with ${shape.edges} edges`}</title>
      <polygon
        fill="var(--toy-blue)"
        points={shape.points}
        stroke="var(--sl-line)"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <text
        fill="#171e19"
        fontFamily="var(--font-mono), monospace"
        fontSize="20"
        fontWeight="850"
        textAnchor="middle"
        x="50"
        y="57"
      >
        {shape.edges}
      </text>
    </svg>
  );
}

export type CubeFace =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "front"
  | "back";

export function CubeSignatureFigure({
  faces,
  label,
}: {
  faces: readonly CubeFace[];
  label: string;
}) {
  const active = (face: CubeFace) =>
    faces.includes(face) ? "#8c939a" : "transparent";

  return (
    <svg
      aria-label={`${label}: ${faces.join(" and ")} shaded`}
      className={styles.cubeSignatureFigure}
      role="img"
      viewBox="0 0 120 110"
    >
      <title>{`${label}: ${faces.join(" and ")} faces shaded`}</title>
      <rect fill={active("back")} height="65" width="65" x="10" y="5" />
      <path d="M10 5 H75 L95 25 H30 Z" fill={active("top")} />
      <path d="M10 5 L30 25 V90 L10 70 Z" fill={active("left")} />
      <path d="M75 5 L95 25 V90 L75 70 Z" fill={active("right")} />
      <path d="M10 70 L30 90 H95 L75 70 Z" fill={active("bottom")} />
      <rect fill={active("front")} height="65" width="65" x="30" y="25" />
      <g fill="none" stroke="var(--sl-line)" strokeLinejoin="round" strokeWidth="2.5">
        <rect height="65" width="65" x="10" y="5" />
        <rect height="65" width="65" x="30" y="25" />
        <path d="M10 5 L30 25 M75 5 L95 25 M10 70 L30 90 M75 70 L95 90" />
      </g>
    </svg>
  );
}

const crateCubes: readonly { label: string; faces: readonly CubeFace[] }[] = [
  { label: "1", faces: ["back", "right"] },
  { label: "2", faces: ["left", "bottom"] },
  { label: "3", faces: ["top"] },
  { label: "4", faces: ["back", "bottom"] },
];

export function TransparentCrateFigure() {
  return (
    <div
      aria-label="Large transparent crate split into four smaller cubes"
      className={styles.transparentCrateFigure}
      role="img"
    >
      {crateCubes.map((cube) => (
        <div key={cube.label}>
          <span>{cube.label}</span>
          <CubeSignatureFigure faces={cube.faces} label={`Small cube ${cube.label}`} />
        </div>
      ))}
    </div>
  );
}

export type PatternKind = "cone" | "cube" | "sphere";

export function PatternTokenFigure({ kind }: { kind: PatternKind }) {
  if (kind === "cone") {
    return (
      <svg aria-label="cone" className={styles.patternTokenFigure} role="img" viewBox="0 0 70 70">
        <title>Cone</title>
        <path d="M35 5 L62 57 Q35 70 8 57 Z" fill="var(--toy-orange)" stroke="#171e19" strokeLinejoin="round" strokeWidth="3" />
        <ellipse cx="35" cy="57" fill="#e78635" rx="27" ry="8" stroke="#171e19" strokeWidth="3" />
      </svg>
    );
  }
  if (kind === "sphere") {
    return (
      <svg aria-label="sphere" className={styles.patternTokenFigure} role="img" viewBox="0 0 70 70">
        <title>Sphere</title>
        <circle cx="35" cy="35" fill="var(--toy-blue)" r="29" stroke="#171e19" strokeWidth="3" />
        <ellipse cx="28" cy="27" fill="none" opacity="0.45" rx="17" ry="22" stroke="#fff" strokeWidth="3" />
        <circle cx="23" cy="20" fill="#fff" opacity="0.8" r="5" />
      </svg>
    );
  }
  return (
    <svg aria-label="cube" className={styles.patternTokenFigure} role="img" viewBox="0 0 70 70">
      <title>Cube</title>
      <path d="M12 20 L35 7 L59 20 L35 34 Z" fill="#a99cff" stroke="#171e19" strokeLinejoin="round" strokeWidth="3" />
      <path d="M12 20 L35 34 V62 L12 48 Z" fill="var(--toy-violet)" stroke="#171e19" strokeLinejoin="round" strokeWidth="3" />
      <path d="M35 34 L59 20 V48 L35 62 Z" fill="#5542bc" stroke="#171e19" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

export function ViewPairFigure({
  solid,
  flat,
}: {
  solid: "cube" | "cone" | "cuboid" | "cylinder";
  flat: "square" | "triangle" | "rectangle" | "circle";
}) {
  return (
    <svg
      aria-label={`${solid} paired with a ${flat} top-view outline`}
      className={styles.viewPairFigure}
      role="img"
      viewBox="0 0 170 82"
    >
      <title>{`${solid} and ${flat}`}</title>
      {solid === "cube" ? (
        <g stroke="var(--sl-line)" strokeLinejoin="round" strokeWidth="2.5">
          <path d="M12 24 L35 10 L59 24 L35 38 Z" fill="#ffb0c9" />
          <path d="M12 24 L35 38 V66 L12 52 Z" fill="var(--toy-pink)" />
          <path d="M35 38 L59 24 V52 L35 66 Z" fill="#d96f96" />
        </g>
      ) : null}
      {solid === "cuboid" ? (
        <g stroke="var(--sl-line)" strokeLinejoin="round" strokeWidth="2.5">
          <path d="M6 26 L35 12 L70 26 L41 40 Z" fill="#ffd596" />
          <path d="M6 26 L41 40 V64 L6 50 Z" fill="var(--toy-orange)" />
          <path d="M41 40 L70 26 V50 L41 64 Z" fill="#e78635" />
        </g>
      ) : null}
      {solid === "cone" ? (
        <g stroke="var(--sl-line)" strokeWidth="2.5">
          <path d="M35 8 L62 62 Q35 73 8 62 Z" fill="var(--toy-violet)" strokeLinejoin="round" />
          <ellipse cx="35" cy="62" fill="#5542bc" rx="27" ry="8" />
        </g>
      ) : null}
      {solid === "cylinder" ? (
        <g stroke="var(--sl-line)" strokeWidth="2.5">
          <path d="M10 23 V58 Q35 72 60 58 V23 Z" fill="var(--toy-blue)" />
          <ellipse cx="35" cy="23" fill="#9cddff" rx="25" ry="10" />
          <path d="M10 58 Q35 72 60 58" fill="none" />
        </g>
      ) : null}
      <path d="M78 40 H99 M92 33 L99 40 L92 47" fill="none" stroke="var(--toy-violet)" strokeLinecap="round" strokeWidth="3" />
      {flat === "square" ? <rect fill="none" height="45" stroke="var(--sl-line)" strokeWidth="3" width="45" x="112" y="18" /> : null}
      {flat === "rectangle" ? <rect fill="none" height="37" stroke="var(--sl-line)" strokeWidth="3" width="56" x="107" y="22" /> : null}
      {flat === "circle" ? <circle cx="135" cy="41" fill="none" r="23" stroke="var(--sl-line)" strokeWidth="3" /> : null}
      {flat === "triangle" ? <path d="M135 16 L160 63 H110 Z" fill="var(--toy-violet)" stroke="var(--sl-line)" strokeLinejoin="round" strokeWidth="3" /> : null}
    </svg>
  );
}

const sideViewBlocks: readonly BlockCoordinate[] = [
  [0, 1, 0],
  [1, 1, 0],
  [0, 1, 1],
  [1, 1, 1],
  [0, 1, 2],
  [1, 0, 1],
];

export function SideViewSourceFigure() {
  return (
    <div className={styles.sideViewSource}>
      <CubeAssemblyFigure
        blocks={sideViewBlocks}
        label="Six-block solid from the handbook side-view question"
      />
      <svg aria-hidden="true" viewBox="0 0 80 40">
        <path d="M73 20 H13 M27 7 L13 20 L27 33" fill="none" stroke="var(--toy-violet)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      </svg>
      <span>LOOK FROM THIS SIDE</span>
    </div>
  );
}

const sidePatterns: Record<
  "A" | "B" | "C" | "D",
  readonly (readonly [number, number])[]
> = {
  A: [
    [0, 0],
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  B: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ],
  C: [
    [1, 0],
    [1, 1],
    [1, 2],
    [0, 1],
  ],
  D: [
    [0, 0],
    [1, 0],
    [0, 1],
    [0, 2],
  ],
};

export function BlockGridFigure({ option }: { option: "A" | "B" | "C" | "D" }) {
  return (
    <svg
      aria-label={`Side-view option ${option}`}
      className={styles.blockGridFigure}
      role="img"
      viewBox="0 0 100 118"
    >
      <title>{`Side-view option ${option}`}</title>
      {sidePatterns[option].map(([x, y]) => (
        <rect
          fill="var(--toy-blue)"
          height="32"
          key={`${x}-${y}`}
          stroke="var(--sl-line)"
          strokeWidth="2.5"
          width="32"
          x={18 + x * 32}
          y={78 - y * 32}
        />
      ))}
    </svg>
  );
}

type EdgeColour = "red" | "green" | "blue";
type EdgeVertex = { x: number; y: number; colour: EdgeColour };

const edgeVertices: readonly EdgeVertex[] = [
  { x: 34, y: 42, colour: "red" },
  { x: 118, y: 18, colour: "green" },
  { x: 225, y: 24, colour: "green" },
  { x: 270, y: 58, colour: "blue" },
  { x: 62, y: 72, colour: "blue" },
  { x: 188, y: 82, colour: "red" },
  { x: 34, y: 225, colour: "green" },
  { x: 118, y: 198, colour: "green" },
  { x: 225, y: 206, colour: "blue" },
  { x: 270, y: 242, colour: "red" },
  { x: 62, y: 258, colour: "green" },
  { x: 188, y: 268, colour: "blue" },
];

export const circuitEdgePairs: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 5],
  [5, 3],
  [0, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [5, 11],
  [6, 7],
  [7, 8],
  [8, 9],
  [6, 10],
  [10, 11],
  [11, 9],
];

export const matchingCircuitEdges = circuitEdgePairs
  .map(([start, end], index) =>
    edgeVertices[start].colour === edgeVertices[end].colour ? index : -1,
  )
  .filter((index) => index >= 0);

const edgeColours: Record<EdgeColour, string> = {
  red: "var(--dot-red)",
  green: "var(--dot-green)",
  blue: "var(--dot-blue)",
};

export function EdgeCircuitFigure({ traced }: { traced: number }) {
  return (
    <svg
      aria-label="Shared-vertex solid with coloured corner dots and eighteen edges"
      className={styles.edgeCircuitFigure}
      role="img"
      viewBox="0 0 305 290"
    >
      <title>Solid with coloured corner dots</title>
      {circuitEdgePairs.map(([start, end], index) => {
        const first = edgeVertices[start];
        const second = edgeVertices[end];
        const checked = index < traced;
        const matching = first.colour === second.colour;
        return (
          <line
            className={
              checked
                ? matching
                  ? styles.svgEdgeMatch
                  : styles.svgEdgeChecked
                : ""
            }
            key={`${start}-${end}`}
            stroke="var(--sl-line)"
            strokeLinecap="round"
            strokeWidth="5"
            x1={first.x}
            x2={second.x}
            y1={first.y}
            y2={second.y}
          />
        );
      })}
      {edgeVertices.map((vertex, index) => (
        <circle
          cx={vertex.x}
          cy={vertex.y}
          fill={edgeColours[vertex.colour]}
          key={`${vertex.x}-${vertex.y}`}
          r="8"
          stroke="#171e19"
          strokeWidth="3"
        >
          <title>{`Corner ${index + 1}: ${vertex.colour}`}</title>
        </circle>
      ))}
    </svg>
  );
}
