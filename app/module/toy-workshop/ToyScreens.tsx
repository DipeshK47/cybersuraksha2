"use client";

import {
  ArrowDown,
  ArrowRight,
  Box,
  Check,
  CircleDot,
  Eye,
  Layers3,
  Play,
  RotateCw,
  Scan,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MistakeFeedback } from "../../components/learning/LearningSupport";
import {
  assemblyCandidates,
  assemblyPieces,
  BlockGridFigure,
  CabinFigure,
  circuitEdgePairs,
  CubeAssemblyFigure,
  CubeSignatureFigure,
  EdgeCircuitFigure,
  matchingCircuitEdges,
  PatternTokenFigure,
  ProjectionFigure,
  SideViewSourceFigure,
  SortingShapeFigure,
  StepSolidFigure,
  TransparentCrateFigure,
  TwoCubeDotsFigure,
  ViewPairFigure,
  ViewpointFigure,
  type CubeFace,
  type PatternKind,
  type SortingShape,
  type ToyView,
} from "./ToyFigures";
import { ToyPracticeLab } from "./ToyPractice";
import styles from "./toy-workshop.module.css";

export type ToySkill = "visual" | "counting" | "pattern" | "logic";
export type ToyMetrics = Record<
  ToySkill,
  { attempts: number; correct: number }
>;

type ToyScreenProps = {
  completed: boolean;
  metrics: ToyMetrics;
  onAnswer: (skill: ToySkill, correct: boolean) => void;
  onComplete: () => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
};

export function ToyStage({
  screen,
  ...props
}: ToyScreenProps & { screen: number }) {
  const [conceptComplete, setConceptComplete] = useState(props.completed);
  const conceptReady = props.completed || conceptComplete;
  const markConceptComplete = useCallback(() => setConceptComplete(true), []);
  const lessonProps = {
    ...props,
    completed: conceptReady,
    onComplete: markConceptComplete,
  };
  let lesson: ReactNode;

  switch (screen) {
    case 0:
      lesson = <ViewpointScreen {...lessonProps} />;
      break;
    case 1:
      lesson = <TopViewScreen {...lessonProps} />;
      break;
    case 2:
      lesson = <HiddenGeometryScreen {...lessonProps} />;
      break;
    case 3:
      lesson = <SortingScreen {...lessonProps} />;
      break;
    case 4:
      lesson = <BoxInspectorScreen {...lessonProps} />;
      break;
    case 5:
      lesson = <PatternScreen {...lessonProps} />;
      break;
    case 6:
      lesson = <ViewMatchScreen {...lessonProps} />;
      break;
    case 7:
      lesson = <EdgeCircuitScreen {...lessonProps} />;
      break;
    case 8:
      lesson = <AssemblyScreen {...lessonProps} />;
      break;
    default:
      lesson = <LogicTransferScreen {...lessonProps} />;
  }

  return (
    <>
      <div className={styles.learningLoop} aria-label="Learning loop">
        <div className={conceptReady ? styles.learningLoopDone : styles.learningLoopActive}>
          <i>{conceptReady ? <Check aria-hidden="true" /> : "1"}</i>
          <span>
            <small>Learn + handbook</small>
            <strong>Explore and solve the source challenge</strong>
          </span>
        </div>
        <div
          className={
            props.completed
              ? styles.learningLoopDone
              : conceptReady
                ? styles.learningLoopActive
                : styles.learningLoopLocked
          }
        >
          <i>{props.completed ? <Check aria-hidden="true" /> : "2"}</i>
          <span>
            <small>Remix arena</small>
            <strong>Apply the rule to two fresh questions</strong>
          </span>
        </div>
      </div>
      {lesson}
      {conceptReady ? (
        <ToyPracticeLab
          alreadyCompleted={props.completed}
          onAnswer={props.onAnswer}
          onComplete={props.onComplete}
          onMistake={props.onMistake}
          playTone={props.playTone}
          screen={screen}
        />
      ) : (
        <section className={styles.practiceLocked} aria-label="Remix practice locked">
          <Sparkles aria-hidden="true" />
          <div>
            <span>Remix arena locked</span>
            <strong>Solve the learning activity above to unlock two new questions.</strong>
          </div>
        </section>
      )}
    </>
  );
}

function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className={styles.heading}>
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <div>{children}</div>
    </header>
  );
}

function HandbookPrompt({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className={styles.handbookPrompt}>
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}

function Feedback({
  kind = "info",
  children,
}: {
  kind?: "info" | "success";
  children: ReactNode;
}) {
  return (
    <div
      aria-live="polite"
      className={`${styles.feedback} ${
        kind === "success" ? styles.feedbackSuccess : ""
      }`}
    >
      {kind === "success" ? (
        <Check aria-hidden="true" />
      ) : (
        <Sparkles aria-hidden="true" />
      )}
      <span>{children}</span>
    </div>
  );
}

function ChoiceRow({
  options,
  answer,
  correct,
  onChoose,
}: {
  options: string[];
  answer?: string;
  correct: string;
  onChoose: (value: string) => void;
}) {
  return (
    <div className={styles.choiceRow}>
      {options.map((option) => (
        <button
          className={
            answer === option
              ? option === correct
                ? styles.choiceCorrect
                : styles.choiceWrong
              : ""
          }
          disabled={answer === correct}
          key={option}
          onClick={() => onChoose(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ViewpointScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [view, setView] = useState<ToyView>("front");
  const [visited, setVisited] = useState(new Set(["front"]));
  const [answer, setAnswer] = useState<string>();

  function changeView(next: ToyView) {
    setView(next);
    setVisited((current) => new Set(current).add(next));
  }

  function choose(value: string) {
    const correct = value === "Height disappears";
    setAnswer(value);
    onAnswer("visual", correct);
    playTone(correct);
    if (correct) {
      onComplete();
      return;
    }
    onMistake({
      eyebrow: "Camera rule · smaller example",
      title: "Try taking two photos of a book",
      explanation:
        "Place a book flat on a desk. A front photo shows its thickness, but a photo taken straight down mostly shows the cover. Compare what each camera can measure.",
      workedSteps: [
        "Place the book flat",
        "Look from the front",
        "Look from above",
        "Notice which measurement is no longer visible",
      ],
      rule: "Use the book example, then return to the toy and infer the missing dimension.",
    });
  }

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 1 · Spatial thinking" title="Turn the viewpoint">
        A 3D toy has height, width and depth. A 2D view keeps only the
        directions the camera can see.
      </Heading>

      <section className={styles.viewLab}>
        <div className={styles.viewControls}>
          {(["top", "front", "side"] as const).map((item) => (
            <button
              aria-pressed={view === item}
              key={item}
              onClick={() => changeView(item)}
              type="button"
            >
              {item === "top" ? (
                <ArrowDown aria-hidden="true" />
              ) : item === "front" ? (
                <Eye aria-hidden="true" />
              ) : (
                <RotateCw aria-hidden="true" />
              )}
              {item} view
            </button>
          ))}
        </div>
        <ViewpointFigure view={view} />
        <div className={styles.projectionCard}>
          <span>What the camera keeps</span>
          <strong>
            {view === "top"
              ? "width + depth"
              : view === "front"
                ? "width + height"
                : "depth + height"}
          </strong>
          <ProjectionFigure view={view} />
        </div>
      </section>

      <section className={styles.checkCard}>
        <div>
          <span>Explain the animation</span>
          <h2>What happens to height in a top view?</h2>
        </div>
        <ChoiceRow
          answer={answer}
          correct="Height disappears"
          onChoose={choose}
          options={["Height disappears", "Height doubles", "The toy rotates"]}
        />
      </section>

      <Feedback kind={answer === "Height disappears" ? "success" : "info"}>
        {visited.size < 3
          ? "Try all three camera buttons. Compare which dimensions survive."
          : answer === "Height disappears"
            ? "Exactly. A top view is the toy’s footprint seen from above."
            : "You explored every view. Now explain what the top camera hides."}
      </Feedback>
    </div>
  );
}

const topOptions = {
  A: ["black", "white", "black", "grey"],
  B: ["grey", "grey", "grey", "black"],
  C: ["white", "grey", "white", "black"],
  D: ["grey", "white", "grey", "black"],
} as const;

function TopViewScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [scanned, setScanned] = useState(false);
  const [answer, setAnswer] = useState<string>();
  const [methodChecks, setMethodChecks] = useState<Set<string>>(new Set());

  function checkMethod(
    id: "hidden-dimension" | "preserved-information",
    value: string,
  ) {
    if (methodChecks.has(id)) return;
    const correct =
      id === "hidden-dimension"
        ? value === "Height"
        : value === "Positions and colours";
    onAnswer("visual", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Top-camera method · smaller example",
        title:
          id === "hidden-dimension"
            ? "Try a tower and its shadow"
            : "Try a two-seat map first",
        explanation:
          id === "hidden-dimension"
            ? "Build one tower with one block and another with three blocks on the same square. From directly above, both cover the same square even though their heights differ."
            : "Put a green card on the left seat and an orange card on the right seat. Looking from above changes the viewpoint, but green must still be left of orange.",
        workedSteps:
          id === "hidden-dimension"
            ? [
                "Make a 1-block tower",
                "Make a 3-block tower",
                "Look straight down",
                "Compare their footprints",
              ]
            : [
                "Green begins on the left",
                "Orange begins on the right",
                "Move the camera above",
                "Check which information stayed",
              ],
        rule:
          "Use the smaller example to decide what a top camera removes and what its flat map must preserve.",
      });
      return;
    }
    setMethodChecks((current) => new Set(current).add(id));
  }

  function choose(value: string) {
    const correct = value === "D";
    setAnswer(value);
    onAnswer("visual", correct);
    playTone(correct);
    if (correct) {
      onComplete();
      return;
    }
    onMistake({
      eyebrow: "Top-view scanner · smaller example",
      title: "Try a four-seat colour map first",
      explanation:
        "Imagine four seats in a 2 by 2 grid. Put red in the top-left seat and yellow in the bottom-left seat. A correct map must keep red above yellow in that column, even if the whole shape looks unfamiliar.",
      workedSteps: [
        "Name the four grid addresses",
        "Check one colour at a time",
        "Keep above, below, left and right unchanged",
        "Return to the handbook toy",
      ],
      rule:
        "Compare the handbook options one address at a time. Do not copy an outline or rotate an option.",
    });
  }

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 2 · Top view" title="Run the roof scanner">
        Scan one visible region at a time. The correct flat view must preserve
        every colour and its position.
      </Heading>

      <HandbookPrompt label="Student handbook · Toy Joy · Question 1">
        Which option represents the top view of the object shown below?
      </HandbookPrompt>

      <section className={styles.roofScanner}>
        <div className={styles.toyCabin}>
          <CabinFigure scanning={scanned} />
        </div>
        <div>
          <span>Scan recipe</span>
          <ol>
            <li className={scanned ? styles.recipeDone : ""}>Find the grey roof.</li>
            <li className={scanned ? styles.recipeDone : ""}>Locate the white area.</li>
            <li className={scanned ? styles.recipeDone : ""}>Place black beside grey.</li>
          </ol>
          <button onClick={() => setScanned(true)} type="button">
            <Scan aria-hidden="true" /> Scan from above
          </button>
        </div>
      </section>

      {scanned ? (
        <>
          <section className={styles.scanLesson} aria-label="Animated top-view explanation">
            <header>
              <span>Practice camera · new toy</span>
              <h2>How a top camera makes a flat map</h2>
            </header>
            <div className={styles.genericScanDemo}>
              <div className={styles.demoToy} aria-label="Different coloured block toy">
                <span>
                  <i className={styles.demoBlueBlock} />
                  <i className={styles.demoOrangeBlock} />
                </span>
                <span>
                  <i className={styles.demoBlueBlock} />
                </span>
                <span>
                  <i className={styles.demoYellowBlock} />
                </span>
                <span>
                  <i className={styles.demoWhiteBlock} />
                </span>
              </div>
              <ArrowRight aria-hidden="true" />
              <div>
                <span>Top camera sees the highest surface at each address</span>
                <div className={styles.practiceGrid} aria-label="Top view of the different practice toy">
                  {["orange", "blue", "yellow", "white"].map((colour) => (
                    <i
                      className={styles[`practiceCell${colour}`]}
                      key={colour}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.methodRules}>
              <article>
                <i>1</i>
                <span>
                  <strong>Move the camera above</strong>
                  <small>Look straight down, not from the front.</small>
                </span>
              </article>
              <article>
                <i>2</i>
                <span>
                  <strong>Collapse height</strong>
                  <small>Only the highest visible surface wins each address.</small>
                </span>
              </article>
              <article>
                <i>3</i>
                <span>
                  <strong>Keep the map</strong>
                  <small>Left-right, front-back and colours stay fixed.</small>
                </span>
              </article>
            </div>

            <div className={styles.methodChecks}>
              <article>
                <span>Camera check 1</span>
                <strong>What disappears in a top view?</strong>
                <div>
                  {["Height", "Width", "Colour"].map((option) => (
                    <button
                      className={
                        methodChecks.has("hidden-dimension") && option === "Height"
                          ? styles.choiceCorrect
                          : ""
                      }
                      disabled={methodChecks.has("hidden-dimension")}
                      key={option}
                      onClick={() => checkMethod("hidden-dimension", option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </article>
              <article
                className={
                  methodChecks.has("hidden-dimension")
                    ? ""
                    : styles.methodCheckLocked
                }
              >
                <span>Camera check 2</span>
                <strong>What must remain in the flat map?</strong>
                <div>
                  {[
                    "Positions and colours",
                    "Heights and shadows",
                    "Only the outline",
                  ].map((option) => (
                    <button
                      className={
                        methodChecks.has("preserved-information") &&
                        option === "Positions and colours"
                          ? styles.choiceCorrect
                          : ""
                      }
                      disabled={
                        !methodChecks.has("hidden-dimension") ||
                        methodChecks.has("preserved-information")
                      }
                      key={option}
                      onClick={() =>
                        checkMethod("preserved-information", option)
                      }
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </section>

          {methodChecks.size === 2 ? (
            <section className={styles.topChoices} aria-label="Top view choices">
              {Object.entries(topOptions).map(([label, tiles]) => (
                <button
                  className={
                    answer === label
                      ? label === "D"
                        ? styles.choiceCorrect
                        : styles.choiceWrong
                      : ""
                  }
                  disabled={answer === "D"}
                  key={label}
                  onClick={() => choose(label)}
                  type="button"
                >
                  <span>{label}</span>
                  <i className={styles.topGrid}>
                    {tiles.map((tile, index) => (
                      <b
                        className={styles[`tile${tile}`]}
                        key={`${tile}-${index}`}
                      />
                    ))}
                  </i>
                </button>
              ))}
            </section>
          ) : (
            <div className={styles.optionsLocked}>
              <Scan aria-hidden="true" />
              Complete both camera checks to unlock the handbook options.
            </div>
          )}
        </>
      ) : null}

      <Feedback kind={answer === "D" ? "success" : "info"}>
        {answer === "D"
          ? "Correct. You reconstructed the top view instead of guessing its outline."
          : scanned && methodChecks.size < 2
            ? "Finish both camera checks, then use the method on the handbook toy."
            : "Run the scanner, then compare the relative positions in all four options."}
      </Feedback>
    </div>
  );
}

function HiddenGeometryScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [hidden, setHidden] = useState(false);
  const [faceAnswer, setFaceAnswer] = useState<string>();
  const [dotAnswer, setDotAnswer] = useState<string>();

  function answerFaces(value: string) {
    const correct = value === "8";
    setFaceAnswer(value);
    onAnswer("counting", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Face detective · smaller example",
        title: "Try a closed cereal box",
        explanation:
          "A cereal box has faces you can touch even when a photograph cannot show them. Point to the front, top and right, then name the faces on the opposite sides.",
        workedSteps: [
          "Name three visible faces",
          "Find each opposite face",
          "Count every face once",
          "Return to the stepped solid",
        ],
        rule: "A camera can hide a face, but it cannot remove it from the solid.",
      });
    }
  }

  function answerDots(value: string) {
    const correct = value === "4";
    setDotAnswer(value);
    onAnswer("counting", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Hidden-corner sensor · smaller example",
        title: "Try eight counters in a bag",
        explanation:
          "Put eight counters in a bag and leave five visible at the opening. Count from five up to eight to find how many the bag hides.",
        workedSteps: ["8 counters total", "5 visible", "Count 6, 7, 8", "Return to the cube dots"],
        rule: "Practise total minus visible on the small example, then reuse the method.",
      });
    }
  }

  const done = faceAnswer === "8" && dotAnswer === "4";
  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 3 · Hidden geometry" title="See through the drawing">
        A picture can hide parts of a solid. Count the whole object, not only
        the lines facing you.
      </Heading>

      <HandbookPrompt label="Student handbook · Questions 2 and 5">
        Count all faces in the stepped solid. Then find how many corner dots on
        the two cubes are hidden.
      </HandbookPrompt>

      <div className={styles.doubleLab}>
        <section className={styles.faceLab}>
          <StepSolidFigure revealHidden={hidden} />
          <div>
            <span>Face detective</span>
            <h2>How many faces belong to the stepped solid?</h2>
            <button onClick={() => setHidden((value) => !value)} type="button">
              <Layers3 aria-hidden="true" />
              {hidden ? "Hide camera-blind faces" : "Reveal hidden faces"}
            </button>
            <ChoiceRow
              answer={faceAnswer}
              correct="8"
              onChoose={answerFaces}
              options={["6", "7", "8", "9"]}
            />
          </div>
        </section>

        <section className={styles.dotLab}>
          <TwoCubeDotsFigure />
          <div>
            <span>Corner sensor</span>
            <h2>Two cubes have 16 dots. If 12 are visible, how many are hidden?</h2>
            <ChoiceRow
              answer={dotAnswer}
              correct="4"
              onChoose={answerDots}
              options={["3", "4", "5", "6"]}
            />
          </div>
        </section>
      </div>

      <Feedback kind={done ? "success" : "info"}>
        {done
          ? "You used the same whole-minus-visible idea for faces and corner dots."
          : "Reveal hidden faces if you need to verify what the camera cannot show."}
      </Feedback>
    </div>
  );
}

const sortingShapes: readonly SortingShape[] = [
  {
    name: "ten-edge star",
    edges: 10,
    points: "50,5 61,35 95,35 68,55 79,90 50,68 21,90 32,55 5,35 39,35",
  },
  { name: "triangle", edges: 3, points: "50,7 94,91 6,91" },
  { name: "pentagon", edges: 5, points: "50,5 95,39 78,93 22,93 5,39" },
  {
    name: "concave L-shape",
    edges: 6,
    points: "10,10 75,10 75,40 45,40 45,90 10,90",
  },
  {
    name: "octagon",
    edges: 8,
    points: "31,5 69,5 95,31 95,69 69,95 31,95 5,69 5,31",
  },
  {
    name: "twelve-edge cross",
    edges: 12,
    points: "35,5 65,5 65,35 95,35 95,65 65,65 65,95 35,95 35,65 5,65 5,35 35,35",
  },
  {
    name: "six-edge chevron",
    edges: 6,
    points: "10,10 55,10 95,50 55,90 10,90 50,50",
  },
  {
    name: "irregular hexagon",
    edges: 6,
    points: "10,20 55,5 90,30 80,80 45,95 5,60",
  },
];

function SortingScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [index, setIndex] = useState(0);
  const [sorted, setSorted] = useState<Array<"yellow" | "white">>([]);
  const [answer, setAnswer] = useState<string>();
  const current = sortingShapes[index];

  function sort(bucket: "yellow" | "white") {
    const correctBucket = current.edges > 5 ? "yellow" : "white";
    const correct = bucket === correctBucket;
    onAnswer("counting", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Sorting rule · smaller example",
        title: "Sort a triangle before this shape",
        explanation:
          "Trace a triangle and tally one mark per edge. Then compare that small tally with the factory boundary before choosing a bucket.",
        workedSteps: [
          "Trace the triangle's edges",
          "Make one tally per edge",
          "Compare the tally with 5",
          "Repeat on the current shape",
        ],
        rule: "Count first, compare second and sort last.",
      });
      return;
    }
    setSorted((items) => [...items, bucket]);
    setIndex((value) => Math.min(value + 1, sortingShapes.length));
  }

  function choose(value: string) {
    const correct = value === "3";
    setAnswer(value);
    onAnswer("counting", correct);
    playTone(correct);
    if (correct) {
      onComplete();
      return;
    }
    onMistake({
      eyebrow: "Second filter · smaller example",
      title: "Try sorting toy cars twice",
      explanation:
        "First collect every red toy car. Then, inside that red group, keep only cars with exactly four wheels. The second rule narrows the first group.",
      workedSteps: [
        "Make the red-car group",
        "Inspect only that group",
        "Keep exactly four wheels",
        "Repeat with the yellow shapes",
      ],
      rule: "Apply one filter completely before applying the narrower filter.",
    });
  }

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 4 · Classification" title="Run the edge-sorting factory">
        First apply the bucket rule. Then search inside the yellow bucket for a
        more exact property.
      </Heading>

      <HandbookPrompt label="Student handbook · Question 3">
        Put shapes with more than five edges in the yellow bucket. How many
        yellow-bucket shapes have exactly six edges?
      </HandbookPrompt>

      <section className={styles.sortFactory}>
        <div className={styles.bucketArea}>
          <div className={styles.bucketYellow}>
            <span>Yellow</span>
            <small>more than 5 edges</small>
            <strong>{sorted.filter((item) => item === "yellow").length}</strong>
          </div>
          <div className={styles.bucketWhite}>
            <span>White</span>
            <small>5 edges or fewer</small>
            <strong>{sorted.filter((item) => item === "white").length}</strong>
          </div>
        </div>

        {current ? (
          <div className={styles.shapeConveyor} key={current.name}>
            <SortingShapeFigure shape={current} />
            <div>
              <small>Incoming shape</small>
              <strong>{current.name}</strong>
              <p>Counted edges: {current.edges}</p>
            </div>
            <button onClick={() => sort("yellow")} type="button">
              Yellow bucket
            </button>
            <button onClick={() => sort("white")} type="button">
              White bucket
            </button>
          </div>
        ) : (
          <div className={styles.factoryComplete}>
            <Check aria-hidden="true" /> All shapes sorted
          </div>
        )}
      </section>

      {index >= sortingShapes.length ? (
        <section className={styles.checkCard}>
          <div>
            <span>Second filter</span>
            <h2>How many yellow-bucket shapes have exactly 6 edges?</h2>
          </div>
          <ChoiceRow
            answer={answer}
            correct="3"
            onChoose={choose}
            options={["2", "3", "4", "5"]}
          />
        </section>
      ) : null}

      <Feedback kind={answer === "3" ? "success" : "info"}>
        {answer === "3"
          ? "Well sorted. You filtered by greater than five, then refined by exactly six."
          : `${sortingShapes.length - index} shape${sortingShapes.length - index === 1 ? "" : "s"} left on the conveyor.`}
      </Feedback>
    </div>
  );
}

const faceSignatures: readonly {
  label: "A" | "B" | "C" | "D";
  faces: readonly CubeFace[];
}[] = [
  { label: "A", faces: ["back", "right"] },
  { label: "B", faces: ["left", "bottom"] },
  { label: "C", faces: ["top", "back", "left"] },
  { label: "D", faces: ["top"] },
];

function BoxInspectorScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [inspected, setInspected] = useState(new Set<string>());
  const [answer, setAnswer] = useState<string>();

  function choose(value: string) {
    const correct = value === "C";
    setAnswer(value);
    onAnswer("visual", correct);
    playTone(correct);
    if (correct) {
      onComplete();
      return;
    }
    onMistake({
      eyebrow: "Transparent-box inspector · smaller example",
      title: "Try two stickers on a carton",
      explanation:
        "Place one sticker on the top of a carton and one on its left side. Without turning it, compare another carton face by face instead of matching the overall outline.",
      workedSteps: [
        "Name the top sticker",
        "Name the left sticker",
        "Lock the orientation",
        "Compare the current crates the same way",
      ],
      rule: "When rotation is forbidden, compare named faces one at a time.",
    });
  }

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 5 · Decomposition" title="Inspect the transparent crate">
        Break the large crate into four small boxes. Each small box has a
        direction signature made from its coloured faces.
      </Heading>

      <HandbookPrompt label="Student handbook · Question 4">
        Which transparent mini-box is not part of the larger box? Rotation of
        the option images is not allowed.
      </HandbookPrompt>

      <section className={styles.crateLab}>
        <TransparentCrateFigure />
        <div>
          <span>Inspector rule</span>
          <h2>Rotation is locked</h2>
          <p>
            Tap every option to reveal its coloured-face signature. Then choose
            the option that is not present.
          </p>
          <div className={styles.signatureOptions}>
            {faceSignatures.map((item) => (
              <button
                className={
                  answer === item.label
                    ? item.label === "C"
                      ? styles.choiceCorrect
                      : styles.choiceWrong
                    : ""
                }
                key={item.label}
                onClick={() => {
                  if (!inspected.has(item.label)) {
                    setInspected((current) => new Set(current).add(item.label));
                  } else {
                    choose(item.label);
                  }
                }}
                type="button"
              >
                <strong>{item.label}</strong>
                <CubeSignatureFigure
                  faces={item.faces}
                  label={`Option ${item.label}`}
                />
                <small>
                  {inspected.has(item.label)
                    ? `${item.faces.join(" + ")} · choose?`
                    : "inspect faces"}
                </small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Feedback kind={answer === "C" ? "success" : "info"}>
        {answer === "C"
          ? "Correct. No small box has top, back and left coloured together."
          : "Inspect each option once, then tap the impossible signature again."}
      </Feedback>
    </div>
  );
}

function PatternScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [running, setRunning] = useState(false);
  const [a, setA] = useState<string>();
  const [b, setB] = useState<string>();

  function choose(slot: "A" | "B", value: string) {
    const correct = slot === "A" ? value === "cone" : value === "sphere";
    if (slot === "A") setA(value);
    else setB(value);
    onAnswer("pattern", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Pattern conveyor · smaller example",
        title: "Try clap, tap, stomp",
        explanation:
          "Say clap, tap, stomp, clap, tap, __. Box the shortest group that repeats, then use its position to fill the sound blank.",
        workedSteps: [
          "Say the first three sounds",
          "Check that they restart",
          "Mark the blank's position",
          "Return to the toy conveyor",
        ],
        rule: "Infer the missing item from the repeating unit, not from the answer choices.",
      });
    }
  }

  const done = a === "cone" && b === "sphere";
  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 6 · Pattern recognition" title="Repair the toy conveyor">
        The factory repeats one three-object program. Discover the unit, then
        replace the missing toys.
      </Heading>

      <HandbookPrompt label="Student handbook · Question 6">
        What will come in place of A and B in the repeating toy pattern?
      </HandbookPrompt>

      <section className={`${styles.patternLab} ${running ? styles.patternRunning : ""}`}>
        <div className={styles.conveyorTrack}>
          {(["cone", "cube", "sphere", "cone", "cube"] as const).map(
            (kind, index) => (
              <PatternTokenFigure key={`${kind}-${index}`} kind={kind} />
            ),
          )}
          <span className={styles.patternBlank}>A</span>
          <PatternTokenFigure kind="cube" />
          <span className={styles.patternBlank}>B</span>
        </div>
        <button onClick={() => setRunning((value) => !value)} type="button">
          <Play aria-hidden="true" /> {running ? "Pause conveyor" : "Run conveyor"}
        </button>
      </section>

      <div className={styles.patternQuestions}>
        {(["A", "B"] as const).map((slot) => (
          <section key={slot}>
            <span>Missing toy {slot}</span>
            <div>
              {(["cone", "cube", "sphere"] as readonly PatternKind[]).map((kind) => (
                <button
                  className={
                    (slot === "A" ? a : b) === kind
                      ? (slot === "A" ? kind === "cone" : kind === "sphere")
                        ? styles.choiceCorrect
                        : styles.choiceWrong
                      : ""
                  }
                  key={kind}
                  onClick={() => choose(slot, kind)}
                  type="button"
                >
                  <PatternTokenFigure kind={kind} />
                  {kind}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Feedback kind={done ? "success" : "info"}>
        {done
          ? "The conveyor is repaired: cone, cube, sphere repeats forever."
          : "Say the unit aloud while the conveyor moves."}
      </Feedback>
    </div>
  );
}

function ViewMatchScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [odd, setOdd] = useState<string>();
  const [side, setSide] = useState<string>();

  function chooseOdd(value: string) {
    const correct = value === "B";
    setOdd(value);
    onAnswer("visual", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "View matcher · smaller example",
        title: "Try a coin from two directions",
        explanation:
          "Stand a coin upright and look from the side, then lay it flat and look from above. The same object can create a different outline when the camera moves.",
        workedSteps: [
          "Coin upright",
          "Name the side outline",
          "Coin flat",
          "Use camera direction on each toy pair",
        ],
        rule: "Name the viewpoint before judging whether an outline matches.",
      });
    }
  }

  function chooseSide(value: string) {
    const correct = value === "C";
    setSide(value);
    onAnswer("visual", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Side projection · smaller example",
        title: "Try a three-block corner",
        explanation:
          "Stack two blocks, then place one block beside the lower block. Walk around the model and sketch only the squares visible from one side.",
        workedSteps: [
          "Build a 2-block tower",
          "Add one lower neighbour",
          "Choose one camera side",
          "Return to the handbook solid",
        ],
        rule: "Practise projecting occupied squares without rotating the drawing.",
      });
    }
  }

  const done = odd === "B" && side === "C";
  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 7 · Compare views" title="Catch the mismatched shadow">
        A view can be correct for one direction and wrong for another. Name the
        camera direction before matching the outline.
      </Heading>

      <HandbookPrompt label="Student handbook · Questions 7 and 8">
        Find the odd top-view pair. Then choose how the block solid looks from
        the arrow direction without rotating it.
      </HandbookPrompt>

      <section className={styles.matchLab}>
        <div>
          <span>Top-view pairs</span>
          <h2>Which pair is the odd one out?</h2>
          <div className={styles.viewPairs}>
            {[
              ["A", "cube", "square"],
              ["B", "cone", "triangle"],
              ["C", "cuboid", "rectangle"],
              ["D", "cylinder", "circle"],
            ].map(([label, solid, flat]) => (
              <button
                className={
                  odd === label
                    ? label === "B"
                      ? styles.choiceCorrect
                      : styles.choiceWrong
                    : ""
                }
                key={label}
                onClick={() => chooseOdd(label)}
                type="button"
              >
                <strong>{label}</strong>
                <ViewPairFigure
                  flat={flat as "square" | "triangle" | "rectangle" | "circle"}
                  solid={solid as "cube" | "cone" | "cuboid" | "cylinder"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <span>Side-view projection</span>
          <h2>Three high, with one block extending left from the middle</h2>
          <SideViewSourceFigure />
          <div className={styles.sideChoices}>
            {(["A", "B", "C", "D"] as const).map((label) => (
              <button
                className={
                  side === label
                    ? label === "C"
                      ? styles.choiceCorrect
                      : styles.choiceWrong
                    : ""
                }
                key={label}
                onClick={() => chooseSide(label)}
                type="button"
              >
                <span>{label}</span>
                <BlockGridFigure option={label} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Feedback kind={done ? "success" : "info"}>
        {done
          ? "You separated top-view outlines from a side-view block projection."
          : "Complete both view checks to prove the camera direction is clear."}
      </Feedback>
    </div>
  );
}

function EdgeCircuitScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [traced, setTraced] = useState(0);
  const [answer, setAnswer] = useState<string>();
  function choose(value: string) {
    const correct = value === "4";
    setAnswer(value);
    onAnswer("counting", correct);
    playTone(correct);
    if (correct) {
      onComplete();
      return;
    }
    onMistake({
      eyebrow: "Edge circuit · smaller example",
      title: "Try three coloured wires",
      explanation:
        "Wire one joins red to red, wire two joins blue to green, and wire three joins yellow to yellow. Inspect both ends before adding a tally.",
      workedSteps: [
        "Check red-red",
        "Check blue-green",
        "Check yellow-yellow",
        "Repeat the endpoint test on the solid",
      ],
      rule: "Decide one edge at a time, then tally. Do not reveal the total early.",
    });
  }

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 8 · Edge relationships" title="Light the matching-edge circuit">
        Every edge connects exactly two corners. Test both endpoint colours,
        then mark the edge if they match.
      </Heading>

      <HandbookPrompt label="Student handbook · Question 9">
        How many edges of the solid have the same-coloured dots at both
        corners?
      </HandbookPrompt>

      <section className={styles.circuitLab}>
        <EdgeCircuitFigure traced={traced} />
        <div>
          <span>Inspection order</span>
          <h2>
            Edge {Math.min(traced + 1, circuitEdgePairs.length)} of {circuitEdgePairs.length}
          </h2>
          <p>
            Matching edges glow lime. Different-colour edges fade after they are
            checked.
          </p>
          <button
            disabled={traced >= circuitEdgePairs.length}
            onClick={() => setTraced((value) => value + 1)}
            type="button"
          >
            <CircleDot aria-hidden="true" /> Trace next edge
          </button>
          <button
            onClick={() => setTraced(circuitEdgePairs.length)}
            type="button"
          >
            Trace all
          </button>
        </div>
      </section>

      {traced >= circuitEdgePairs.length ? (
        <section className={styles.checkCard}>
          <div>
            <span>Circuit result</span>
            <h2>How many edges have the same colour at both corners?</h2>
          </div>
          <ChoiceRow
            answer={answer}
            correct="4"
            onChoose={choose}
            options={["2", "3", "4", "5"]}
          />
        </section>
      ) : null}

      <Feedback kind={answer === "4" ? "success" : "info"}>
        {answer === "4"
          ? "Four matching edges found. Your systematic scan avoided double-counting."
          : `${matchingCircuitEdges.filter((index) => index < traced).length} matching edge${matchingCircuitEdges.filter((index) => index < traced).length === 1 ? "" : "s"} found so far.`}
      </Feedback>
    </div>
  );
}

function AssemblyScreen({
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState<string>();

  function choose(value: string) {
    const correct = value === "D";
    setAnswer(value);
    onAnswer("visual", correct);
    playTone(correct);
    if (correct) {
      onComplete();
      return;
    }
    onMistake({
      eyebrow: "Assembly bay · smaller example",
      title: "Try a two-piece mini build",
      explanation:
        "Take one two-block piece and one three-block piece. Before comparing arrangements, confirm that the finished mini build still contains all five source blocks.",
      workedSteps: [
        "Count 2 blocks",
        "Count 3 blocks",
        "Expect 5 after joining",
        "Repeat quantity and touching checks on the wall",
      ],
      rule: "Verify the source total first, then compare which blocks touch.",
    });
  }

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 9 · Composition" title="Build the final toy wall">
        Combine the pieces in stages. A candidate fails if even one block is
        missing, extra or attached in the wrong place.
      </Heading>

      <HandbookPrompt label="Student handbook · Question 10">
        Which option can be formed by combining all the block shapes shown?
      </HandbookPrompt>

      <section className={styles.assemblyLab}>
        <div className={styles.pieceShelf}>
          {assemblyPieces.map((blocks, index) => (
            <div key={`piece-${index + 1}`}>
              <span>
                Piece {index + 1} · {blocks.length} blocks
              </span>
              <CubeAssemblyFigure
                blocks={blocks}
                label={`Piece ${index + 1} with ${blocks.length} blocks`}
              />
            </div>
          ))}
        </div>
        <div className={styles.assemblyConsole}>
          <span>Assembly stage {stage} of 2</span>
          <h2>
            {stage === 0
              ? "Start with the loose pieces"
              : stage === 1
                ? "Pieces 1 and 2 connected"
                : "All three pieces connected"}
          </h2>
          <div className={styles.assemblyPreview}>
            <CubeAssemblyFigure
              blocks={
                stage === 0
                  ? assemblyPieces[0]
                  : stage === 1
                    ? [...assemblyPieces[0], ...assemblyPieces[1]]
                    : assemblyCandidates.D
              }
              label={
                stage === 0
                  ? "First loose piece"
                  : stage === 1
                    ? "Pieces one and two joined"
                    : "All three pieces joined"
              }
            />
          </div>
          <button
            disabled={stage >= 2}
            onClick={() => setStage((value) => value + 1)}
            type="button"
          >
            {stage === 2 ? (
              <Check aria-hidden="true" />
            ) : (
              <Box aria-hidden="true" />
            )}
            {stage === 0
              ? "Join pieces 1 + 2"
              : stage === 1
                ? "Add piece 3"
                : "Assembly complete"}
          </button>
        </div>
      </section>

      {stage === 2 ? (
        <section className={styles.assemblyChoices}>
          {(["A", "B", "C", "D"] as const).map((label) => (
            <button
              className={
                answer === label
                  ? label === "D"
                    ? styles.choiceCorrect
                    : styles.choiceWrong
                  : ""
              }
              key={label}
              onClick={() => choose(label)}
              type="button"
            >
              <span>{label}</span>
              <CubeAssemblyFigure
                blocks={assemblyCandidates[label]}
                label={`Assembly option ${label}`}
              />
              <small>
                {assemblyCandidates[label].length} blocks ·{" "}
                {label === "A"
                  ? "middle gap"
                  : label === "B"
                    ? "third piece misplaced"
                    : label === "C"
                      ? "top gap"
                      : "all blocks fit"}
              </small>
            </button>
          ))}
        </section>
      ) : null}

      <Feedback kind={answer === "D" ? "success" : "info"}>
        {answer === "D"
          ? "Every block is present and connected correctly in option D."
          : "Build in two stages before comparing the final candidates."}
      </Feedback>
    </div>
  );
}

const recallQuestions = [
  {
    id: "top",
    prompt: "What disappears in a top view?",
    options: ["height", "width", "all edges"],
    correct: "height",
  },
  {
    id: "hidden",
    prompt: "How do you find hidden parts?",
    options: ["total − visible", "visible − total", "guess"],
    correct: "total − visible",
  },
  {
    id: "bucket",
    prompt: "Which edge count enters the yellow bucket?",
    options: ["5", "4", "6"],
    correct: "6",
  },
  {
    id: "pattern",
    prompt: "What should you find before filling pattern blanks?",
    options: ["repeating unit", "largest object", "brightest colour"],
    correct: "repeating unit",
  },
] as const;

function LogicTransferScreen({
  metrics,
  onAnswer,
  onComplete,
  onMistake,
  playTone,
}: ToyScreenProps) {
  const [revealed, setRevealed] = useState(false);
  const [winner, setWinner] = useState<string>();
  const [recall, setRecall] = useState(new Set<string>());

  function chooseWinner(value: string) {
    const correct = value === "B";
    setWinner(value);
    onAnswer("logic", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Logic transfer · smaller example",
        title: "Try a first-to-two match",
        explanation:
          "Ria wins round 1, Omar wins round 2, and Ria wins round 3. Make one tally for each certain result before deciding who reached two wins.",
        workedSteps: [
          "Tally Ria's round 1",
          "Tally Omar's round 2",
          "Tally Ria's round 3",
          "Reuse the tally method on five sets",
        ],
        rule: "Solve a smaller tally first, then apply the same logic to the current clues.",
      });
    }
  }

  function answerRecall(
    question: (typeof recallQuestions)[number],
    value: string,
  ) {
    if (recall.has(question.id)) return;
    const correct = value === question.correct;
    onAnswer("logic", correct);
    playTone(correct);
    if (!correct) {
      onMistake({
        eyebrow: "Memory check · smaller example",
        title: "Rebuild the rule from a tiny case",
        explanation:
          "Do not inspect the current choices yet. Make a tiny example of the same idea, solve it aloud, and then return to this memory question.",
        workedSteps: [
          "Name the kind of problem",
          "Invent a two- or three-item example",
          "Explain the rule aloud",
          "Retry the current question",
        ],
        rule: "A remembered rule should be reconstructed from an example, not revealed by feedback.",
      });
      return;
    }
    setRecall((current) => new Set(current).add(question.id));
  }

  const done = winner === "B" && recall.size === recallQuestions.length;
  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  const scores = useMemo(
    () =>
      (Object.entries(metrics) as Array<
        [ToySkill, { attempts: number; correct: number }]
      >).map(([skill, result]) => ({
        skill,
        score: result.attempts
          ? Math.round((result.correct / result.attempts) * 100)
          : 100,
      })),
    [metrics],
  );

  return (
    <div className={styles.screen}>
      <Heading eyebrow="Lesson 10 · Transfer and remember" title="Solve the final toy tournament">
        Spatial thinking and logic use the same habit: turn words and pictures
        into certain facts, then reason one step at a time.
      </Heading>

      <HandbookPrompt label="Student handbook · Thinking Spot">
        A won set 1. B won sets 2 and 3. B did not lose any even-numbered set.
        Who won the five-set match?
      </HandbookPrompt>

      <section className={styles.tennisLab}>
        <div>
          <span>Five-set match</span>
          <h2>First player to win 3 sets wins</h2>
          <p>
            A won set 1. B won sets 2 and 3. B did not lose any even-numbered
            set. No set can draw.
          </p>
          <button onClick={() => setRevealed(true)} type="button">
            <Scan aria-hidden="true" /> Apply the even-number clue
          </button>
        </div>
        <div className={styles.setBoard}>
          {[
            ["1", "A"],
            ["2", "B"],
            ["3", "B"],
            ["4", revealed ? "B" : "?"],
            ["5", "?"],
          ].map(([set, player]) => (
            <i className={player === "B" ? styles.setWon : ""} key={set}>
              <small>Set {set}</small>
              <strong>{player}</strong>
            </i>
          ))}
        </div>
        {revealed ? (
          <div>
            <span>Who certainly won?</span>
            <ChoiceRow
              answer={winner}
              correct="B"
              onChoose={chooseWinner}
              options={["A", "B", "Tie", "Cannot know"]}
            />
          </div>
        ) : null}
      </section>

      {winner === "B" ? (
        <section className={styles.recallLab}>
          <div>
            <span>Four-rule memory check</span>
            <h2>Answer without returning to earlier pages</h2>
          </div>
          {recallQuestions.map((question, index) => (
            <article key={question.id}>
              <span>{index + 1}</span>
              <div>
                <h3>{question.prompt}</h3>
                <div className={styles.choiceRow}>
                  {question.options.map((option) => (
                    <button
                      className={
                        recall.has(question.id) && option === question.correct
                          ? styles.choiceCorrect
                          : ""
                      }
                      disabled={recall.has(question.id)}
                      key={option}
                      onClick={() => answerRecall(question, option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {done ? (
        <section className={styles.summary}>
          <Sparkles aria-hidden="true" />
          <span>Mission complete</span>
          <h2>You can inspect, classify, compose and explain.</h2>
          <div>
            {scores.map((item) => (
              <i key={item.skill}>
                <small>{item.skill}</small>
                <strong>{item.score >= 75 ? "Mastered" : "Keep practising"}</strong>
                <b>
                  <span style={{ width: `${Math.max(18, item.score)}%` }} />
                </b>
              </i>
            ))}
          </div>
        </section>
      ) : null}

      <Feedback kind={done ? "success" : "info"}>
        {done
          ? "Toy Workshop complete. The important ideas are ready for a new puzzle."
          : "Use the clue to force set 4, then retrieve the four core rules."}
      </Feedback>
    </div>
  );
}
