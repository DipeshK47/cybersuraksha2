"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock, X } from "lucide-react";
import { HandbookChatbot } from "../../../../components/HandbookChatbot";
import {
  HintDrawer,
  LearningHelpButton,
  MistakeDialog,
  type MistakeFeedback,
  type PracticeAttempt,
  type PracticeHistory,
  PracticeHistoryContext,
} from "../../../../components/learning/LearningSupport";
import type { ChapterTopic } from "../../../../data/curriculum";
import { getJson, postJson } from "../../../../lib/read-json";
import { TOPIC_PANELS } from "./topic-panels";
import styles from "./chapter-lesson.module.css";

/**
 * Chapter lesson, laid out like the Class 3 missions: outlined topbar with
 * progress, a rail listing every topic in the chapter, and a gated main stage.
 *
 * Topics with a timestamp seek the chapter video; topics with only an
 * interactive panel render that on its own; and anything with neither is a part
 * of the chapter not built yet, which renders locked so a student can still see
 * the whole chapter's shape rather than only what happens to exist today.
 */

/** Does this topic drive the video player — its own file, or a timestamp into
 *  the chapter's one? */
const usesVideo = (t: ChapterTopic) => Boolean(t.video) || t.at !== undefined;

/** Is this topic reachable at all? A topic teaches from a video *or* from an
 *  interactive panel — §8.3 onward is panel-first while its videos are still
 *  being rendered, and those topics must not be locked for want of a file. */
const isTaught = (t: ChapterTopic) => usesVideo(t) || Boolean(t.panel);
export function ChapterLesson({
  gradeNumber,
  subjectName,
  subjectSlug,
  chapterNumber,
  chapterTitle,
  video,
  poster,
  duration,
  topics,
  backHref,
}: {
  gradeNumber: number;
  subjectName: string;
  subjectSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  video?: string;
  poster?: string;
  duration?: string;
  topics: ChapterTopic[];
  backHref: string;
}) {
  const [active, setActive] = useState(0);
  const [watched, setWatched] = useState<Set<number>>(new Set());
  const [mistake, setMistake] = useState<MistakeFeedback | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [done, setDone] = useState<Set<number>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [videoLength, setVideoLength] = useState(0);
  const stageTop = useRef<HTMLDivElement>(null);

  const topic = topics[active];
  const taught = topics.filter(isTaught).length;
  // A topic plays its own video when it has one, else it seeks into the chapter's.
  const srcOf = useCallback(
    (t: ChapterTopic) => t.video ?? video,
    [video],
  );
  const currentSrc = srcOf(topic);
  const currentDuration = topic.duration ?? duration;

  const go = useCallback(
    (index: number) => {
      const next = topics[index];
      if (!next || !isTaught(next)) return;
      setActive(index);
      setWatched((current) => new Set(current).add(index));
      // Support state belongs to a topic — don't carry it across.
      setHintOpen(false);
      setMistake(null);
      const el = videoRef.current;
      // A panel-only topic has no player, and the outgoing one is about to
      // unmount — seeking or playing it here would just leak a second of audio.
      if (el && usesVideo(next)) {
        const at = next.video ? 0 : (next.at ?? 0);
        // readyState 0 means no metadata yet — the seek would be thrown away, so
        // park it. A src change also resets readyState, and React has not applied
        // the new src yet at this point, so park it in that case too.
        if (srcOf(next) === currentSrc && el.readyState >= 1) el.currentTime = at;
        else pendingSeek.current = at;
        void el.play().catch(() => {
          // autoplay can be blocked; the seek still lands
        });
      }
      window.setTimeout(
        () => stageTop.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        30,
      );
    },
    [topics, currentSrc, srcOf],
  );

  // Short confirm/deny tones. Sound is reinforcement only — never the sole signal.
  const playTone = useCallback((correct: boolean) => {
    const Ctx =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = correct ? 720 : 210;
    gain.gain.setValueAtTime(0.055, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
  }, []);

  // What this student has already used up. Practice is one shot, so a reload
  // must not hand back a fresh attempt at a question they have already spent.
  // Failure is silent and simply leaves practice open: a signed-out visitor has
  // no history to restore, and a fetch error must not lock a student out.
  const [history, setHistory] = useState<PracticeHistory | undefined>(undefined);
  // Whether marks are being recorded at all. A signed-out visitor may still work
  // through the whole lesson; there is just nobody to record it for, so posting
  // their answers would only produce failed requests.
  const recording = useRef(false);
  useEffect(() => {
    let live = true;
    void getJson<{ signedIn?: boolean; answered?: PracticeHistory; error?: string }>(
      "/api/practice-attempt",
    ).then((data) => {
      if (!live) return;
      recording.current = Boolean(data.signedIn);
      if (data.answered) setHistory(data.answered);
    });
    return () => { live = false; };
  }, []);

  const handleAnswer = useCallback(
    (_skill: string, _correct: boolean, attempt: PracticeAttempt) => {
      // Fire and forget. The server grades the answer from its own copy of the
      // question bank and records the marks; nothing here is trusted. A visitor
      // who is not signed in gets a 401 and simply practises without marks, so
      // the lesson still works for them.
      if (!recording.current) return;
      void postJson("/api/practice-attempt", attempt);
    },
    [],
  );
  const handleMistake = useCallback((f: MistakeFeedback) => setMistake(f), []);
  const showHint = useCallback(() => { setMistake(null); setHintOpen(true); }, []);
  const markDone = useCallback(
    () => setDone((c) => new Set(c).add(active)),
    [active],
  );

  const onMeta = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (Number.isFinite(el.duration)) setVideoLength(el.duration);
    if (pendingSeek.current !== null) {
      el.currentTime = pendingSeek.current;
      pendingSeek.current = null;
    }
  }, []);

  // A locally cached video can finish loading its metadata before React has
  // attached the JSX event handler. Synchronise once after every source change
  // as well, so the segment clock never stays at 0:00 for a ready video.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    onMeta();
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
    };
  }, [currentSrc, onMeta]);

  // A topic runs until the next taught topic starts.
  const segmentEnd = (index: number) => {
    const later = topics.slice(index + 1).find((t) => t.at !== undefined);
    return later?.at ?? videoLength ?? 0;
  };

  const panel = topic.panel ? TOPIC_PANELS[topic.panel] : undefined;
  const prev = topics[active - 1];
  const next = topics[active + 1];

  return (
    <PracticeHistoryContext.Provider value={history}>
    <main className={styles.page}>
      <a className={styles.skipLink} href="#lesson-content">
        Skip to the lesson
      </a>

      <header className={styles.topbar}>
        <div className={styles.missionIdentity}>
          <Link aria-label="Exit lesson" className={styles.iconButton} href={backHref}>
            <X aria-hidden="true" />
          </Link>
          <div>
            <span>
              Class {gradeNumber} • {subjectName}
            </span>
            <strong>
              Chapter {chapterNumber}: {chapterTitle}
            </strong>
          </div>
        </div>

        <div className={styles.topActions}>
          <div className={styles.topProgress}>
            <span>
              Topic {active + 1} of {topics.length}
            </span>
            <i>
              <b style={{ width: `${((active + 1) / topics.length) * 100}%` }} />
            </i>
          </div>
          <HandbookChatbot placement="inline" />
        </div>
      </header>

      <div className={styles.lessonShell}>
        <aside className={styles.lessonRail} aria-label="Chapter topics">
          <div>
            <span>Chapter map</span>
            <strong>Every idea in Chapter {chapterNumber}, in teaching order.</strong>
          </div>
          <nav>
            {topics.map((item, index) => {
              const locked = !isTaught(item);
              const finished = done.has(index) || (watched.has(index) && index !== active);
              return (
                <button
                  aria-current={index === active ? "step" : undefined}
                  className={index === active ? styles.railActive : ""}
                  disabled={locked}
                  key={item.title}
                  onClick={() => go(index)}
                  title={locked ? "Not built yet" : `Jump to ${item.title}`}
                  type="button"
                >
                  <i>
                    {locked ? (
                      <Lock aria-hidden="true" />
                    ) : finished ? (
                      <Check aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </i>
                  <span>
                    <small>
                      {item.section} · {item.short}
                    </small>
                    <strong>{item.title}</strong>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className={styles.railNote}>
            <strong>
              {taught === topics.length ? "Everything is ready" : "Why some are locked"}
            </strong>
            <p>
              {taught === topics.length
                ? `All ${topics.length} ${topics.length === 1 ? "topic is" : "topics are"} available. Choose any topic in the map to revisit it.`
                : `${taught} of ${topics.length} topics are taught in the lesson so far. The rest are the parts of the chapter still being built.`}
            </p>
          </div>
        </aside>

        <section className={styles.lessonMain} id="lesson-content">
          <div className={styles.stage} ref={stageTop}>
            <div className={styles.stageHead}>
              <div>
                <p>
                  Section {topic.section} · Topic {active + 1}
                </p>
                <h2>{topic.title}</h2>
              </div>
              {currentDuration ? <span>lesson {currentDuration}</span> : null}
            </div>

            {currentSrc && usesVideo(topic) ? (
              <>
                <video
                  controls
                  onDurationChange={onMeta}
                  onLoadedMetadata={onMeta}
                  poster={topic.poster ?? (topic.video ? undefined : poster)}
                  preload="metadata"
                  ref={videoRef}
                  src={currentSrc}
                />
                {/* Where this topic sits in the one chapter video, so a jump is
                    visible even before the picture changes. */}
                <div aria-hidden="true" className={styles.segments}>
                  {topics.map((item, index) =>
                    item.at === undefined || srcOf(item) !== currentSrc ? null : (
                      <i
                        className={index === active ? styles.segOn : undefined}
                        key={item.title}
                        style={{ flexGrow: Math.max(1, segmentEnd(index) - item.at) }}
                      />
                    ),
                  )}
                </div>
              </>
            ) : null}

            {!isTaught(topic) ? (
              <div className={styles.locked}>
                <Lock aria-hidden="true" />
                <strong>Not built yet</strong>
                <p>
                  This topic is part of Chapter {chapterNumber} but is not in the
                  lesson yet. Work it from your handbook for now — everything
                  above it in the map is covered in the video.
                </p>
              </div>
            ) : null}
          </div>

          {panel ? (
            <>
              <div className={styles.supportBar}>
                <div>
                  <span>Learning support</span>
                  <strong>Hints explain the next step without giving the answer away.</strong>
                </div>
                <LearningHelpButton
                  onClick={() => setHintOpen((v) => !v)}
                  open={hintOpen}
                />
              </div>
              <panel.Panel
                onAnswer={handleAnswer}
                onComplete={markDone}
                onMistake={handleMistake}
                playTone={playTone}
              />
            </>
          ) : null}

          <footer className={styles.lessonNavigation}>
            <button
              disabled={!prev || !isTaught(prev)}
              onClick={() => go(active - 1)}
              type="button"
            >
              <ArrowLeft aria-hidden="true" /> Previous topic
            </button>


            {next && isTaught(next) ? (
              <button
                className={styles.nextButton}
                onClick={() => go(active + 1)}
                type="button"
              >
                Next topic <ArrowRight aria-hidden="true" />
              </button>
            ) : (
              <Link className={styles.nextButton} href={backHref}
                style={{ minHeight: 44, padding: "0 16px", display: "inline-flex",
                         alignItems: "center", gap: 8, border: "2px solid var(--sl-line)",
                         borderRadius: 12, fontWeight: 800, color: "var(--sl-ink)",
                         boxShadow: "4px 4px 0 var(--sl-shadow)", textDecoration: "none" }}>
                Back to {subjectSlug === "mathematics" ? "Maths" : subjectName} chapters
                <ArrowRight aria-hidden="true" />
              </Link>
            )}
          </footer>
        </section>
      </div>

      {hintOpen && panel ? (
        <HintDrawer
          hints={panel.hints}
          key={`hints-${active}`}
          onClose={() => setHintOpen(false)}
        />
      ) : null}
      <MistakeDialog
        feedback={mistake}
        onClose={() => setMistake(null)}
        onShowHint={showHint}
      />
    </main>
    </PracticeHistoryContext.Provider>
  );
}
