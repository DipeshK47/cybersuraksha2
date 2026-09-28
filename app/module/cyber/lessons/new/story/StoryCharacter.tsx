"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Rive } from "@rive-app/canvas";
import { characters, RIVE_WASM, type CharacterAsset, type CharacterSpec } from "./characters";
import s from "./story-player.module.css";

const moodWords: Record<string, string> = { thinking: "thoughtful", surprise: "surprised", fear: "worried", anger: "angry", neutral: "calm" };

export function StoryCharacter({ asset, name, mood, playing }: { asset: CharacterAsset; name: string; mood: string; playing: boolean }) {
  const spec: CharacterSpec = characters[asset];
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useRef<Rive | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let disposed = false;
    let observer: ResizeObserver | undefined;
    void import("@rive-app/canvas").then(({ Rive, RuntimeLoader, Layout, Fit }) => {
      if (disposed || !canvas.current) return;
      RuntimeLoader.setWasmUrl(RIVE_WASM);
      player.current = new Rive({
        canvas: canvas.current, src: spec.src,
        artboard: spec.artboard, stateMachines: spec.stateMachine, autoplay: false,
        layout: new Layout({ fit: Fit.Contain }), enableRiveAssetCDN: false,
        shouldDisableRiveListeners: true,
        onLoad: () => {
          if (disposed) return;
          player.current?.resizeDrawingSurfaceToCanvas(Math.min(window.devicePixelRatio, 2));
          setLoaded(true);
          observer = new ResizeObserver(() => player.current?.resizeDrawingSurfaceToCanvas(Math.min(window.devicePixelRatio, 2)));
          if (canvas.current) observer.observe(canvas.current);
        },
        onLoadError: () => { if (!disposed) setFailed(true); },
      });
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; observer?.disconnect(); player.current?.cleanup(); player.current = null; };
  }, [reduced, spec]);
  useEffect(() => {
    const rive = player.current;
    if (!loaded || !rive) return;
    const inputs = rive.stateMachineInputs(spec.stateMachine);
    const talk = spec.talkInput ? inputs?.find(input => input.name === spec.talkInput) : undefined;
    const target = spec.emotions[mood] ?? 0;
    if (typeof target === "string") {
      // Expression is a timeline animation layered over the state machine.
      rive.stop(Object.values(spec.emotions).filter((name): name is string => typeof name === "string" && name !== target));
      rive.play(target);
    } else {
      const values = typeof target === "number" ? { [spec.emotionInput ?? ""]: target } : target;
      inputs?.forEach(input => { if (input.name in values) input.value = values[input.name]; });
    }
    if (talk) talk.value = playing;
    rive.play();
    // Let a manually selected expression settle before freezing the paused scene.
    const timer = !playing ? window.setTimeout(() => rive.pause(), 450) : undefined;
    return () => { window.clearTimeout(timer); };
  }, [mood, playing, loaded, spec]);
  return <div className={s.character} role="img" aria-label={`${name} looks ${moodWords[mood] ?? mood}`} data-character-mood={mood} data-character-asset={asset} data-rive-loaded={loaded}>
    {/* These static frames come from the same licensed Rive file. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`${spec.frames}/${mood}.png`} alt="" hidden={loaded && !failed && !reduced} />
    {!reduced && !failed ? <canvas ref={canvas} aria-hidden="true" style={{ opacity: loaded ? 1 : 0 }} /> : null}
  </div>;
}
