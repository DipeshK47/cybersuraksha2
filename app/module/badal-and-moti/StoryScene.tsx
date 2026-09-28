"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./badal-and-moti.module.css";

/**
 * A composited storybook stage for the lesson walkthroughs. The scene keeps
 * the original 640-unit x-position API so every curriculum step can reuse its
 * choreography while rendering project-owned painted artwork.
 */
export type BadalAction = "idle" | "wave" | "walkIn" | "walkAcross" | "lean";
export type MotiAction = "sit" | "runIn" | "runAcross" | "jump" | "shiver" | "tilt";
export type MaaAction = "idle" | "wave";
export type SkyMode = "day" | "night" | "toNight" | "toDay";
export type RainMode = "none" | "pour" | "clearing";

type CharacterKind = "badal" | "moti" | "maa";
type CharacterAction = BadalAction | MotiAction | MaaAction;

const artwork = {
  background: "/lessons/badal-and-moti/courtyard.webp",
  badal: "/lessons/badal-and-moti/badal.webp",
  badalWave: "/lessons/badal-and-moti/badal-wave.webp",
  moti: "/lessons/badal-and-moti/moti.webp",
  motiSit: "/lessons/badal-and-moti/moti-sit.webp",
  maa: "/lessons/badal-and-moti/maa.webp",
  stormClouds: "/lessons/badal-and-moti/storm-clouds.webp",
} as const;

const stars = Array.from({ length: 18 }, (_, index) => ({
  left: `${8 + ((index * 31) % 86)}%`,
  top: `${7 + ((index * 17) % 43)}%`,
  delay: `${(index % 5) * 90}ms`,
}));

const rainDrops = Array.from({ length: 26 }, (_, index) => ({
  left: `${2 + ((index * 19) % 98)}%`,
  delay: `${(index % 9) * -90}ms`,
  duration: `${620 + (index % 5) * 55}ms`,
}));

function spriteFor(kind: CharacterKind, action: CharacterAction) {
  if (kind === "badal") return action === "wave" ? artwork.badalWave : artwork.badal;
  if (kind === "moti") return action === "sit" || action === "tilt" ? artwork.motiSit : artwork.moti;
  return artwork.maa;
}

function CharacterSprite({
  kind,
  x,
  action,
}: {
  kind: CharacterKind;
  x: number;
  action: CharacterAction;
}) {
  const position = { left: `${Math.max(0, Math.min(640, x)) / 6.4}%` } as CSSProperties;
  const kindClass = styles[`actor${kind[0].toUpperCase()}${kind.slice(1)}`];

  return (
    <div aria-hidden="true" className={`${styles.actorSlot} ${kindClass}`} style={position}>
      <div className={styles.actorMotion} data-action={action}>
        {/* Vinext's image optimizer requires a worker fetch binding that this
            app intentionally does not expose; these pre-compressed WebPs load
            directly so the scene also works in the local teaching server. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- see compatibility note above */}
        <img
          alt=""
          className={styles.actorArt}
          decoding="async"
          draggable={false}
          height="1536"
          src={spriteFor(kind, action)}
          width="1024"
        />
      </div>
    </div>
  );
}

export function StoryScene({
  sky = "day",
  rain = "none",
  badal,
  moti,
  maa,
  ball,
  label,
  children,
}: {
  sky?: SkyMode;
  rain?: RainMode;
  badal?: { x: number; action?: BadalAction };
  moti?: { x: number; action?: MotiAction };
  maa?: { x: number; action?: MaaAction };
  ball?: { x: number; roll?: boolean };
  /** Spoken-word description of the picture for screen readers. */
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.stage}>
      <div aria-label={label} className={styles.scenePicture} data-rain={rain} data-sky={sky} role="img">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-compressed local art; Vinext optimizer is unavailable */}
        <img
          alt=""
          className={styles.sceneBackground}
          decoding="async"
          draggable={false}
          fetchPriority="high"
          height="1024"
          src={artwork.background}
          width="1536"
        />

        <div aria-hidden="true" className={styles.sceneNightWash} />
        <div aria-hidden="true" className={styles.sceneStars}>
          {stars.map((star, index) => (
            <i
              key={index}
              style={{ left: star.left, top: star.top, "--star-delay": star.delay } as CSSProperties}
            />
          ))}
        </div>
        <div aria-hidden="true" className={styles.sceneSun} />
        <div aria-hidden="true" className={styles.sceneMoon} />

        <div aria-hidden="true" className={styles.sceneStormClouds}>
          {/* eslint-disable-next-line @next/next/no-img-element -- same Vinext compatibility constraint as the scene art */}
          <img alt="" decoding="async" draggable={false} height="512" src={artwork.stormClouds} width="1536" />
        </div>
        <div aria-hidden="true" className={styles.sceneRain}>
          {rainDrops.map((drop, index) => (
            <i
              key={index}
              style={{
                left: drop.left,
                "--rain-delay": drop.delay,
                "--rain-duration": drop.duration,
              } as CSSProperties}
            />
          ))}
        </div>

        {maa ? <CharacterSprite action={maa.action ?? "idle"} kind="maa" x={maa.x} /> : null}
        {moti ? <CharacterSprite action={moti.action ?? "sit"} kind="moti" x={moti.x} /> : null}
        {badal ? <CharacterSprite action={badal.action ?? "idle"} kind="badal" x={badal.x} /> : null}
        {ball ? (
          <div
            aria-hidden="true"
            className={styles.sceneBallSlot}
            style={{ left: `${Math.max(0, Math.min(640, ball.x)) / 6.4}%` }}
          >
            <div className={styles.sceneBall} data-roll={ball.roll ? "true" : undefined}>
              <i />
            </div>
          </div>
        ) : null}
        <div aria-hidden="true" className={styles.sceneTexture} />
      </div>
      {children ? <div className={styles.stageOverlay}>{children}</div> : null}
    </div>
  );
}

/** A speech bubble pinned over the scene, with a prominent end mark. */
export function SceneBubble({
  who,
  left,
  top,
  mark,
  children,
}: {
  who: string;
  left: string;
  top: string;
  mark?: "?" | ".";
  children: ReactNode;
}) {
  return (
    <div className={styles.sceneBubble} style={{ left, top }}>
      <small>{who}</small>
      <span>
        {children}
        {mark ? <b className={`${styles.bubbleMark} ${mark === "." ? styles.bubbleMarkStop : ""}`}>{mark}</b> : null}
      </span>
    </div>
  );
}
