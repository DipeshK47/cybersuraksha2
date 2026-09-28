"use client";

import {
  ArrowRight,
  Check,
  Lightbulb,
  RotateCw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import type { MistakeFeedback } from "../../components/learning/LearningSupport";
import styles from "./toy-workshop.module.css";

type PracticeSkill = "visual" | "counting" | "pattern" | "logic";

type PracticeVisual =
  | {
      kind: "camera";
      view: string;
      keeps: readonly string[];
      hides: string;
    }
  | {
      kind: "grid";
      cells: readonly [string, string, string, string];
    }
  | {
      kind: "count";
      total: number;
      visible: number;
      subject: string;
    }
  | {
      kind: "shape";
      sides: number;
    }
  | {
      kind: "faces";
      faces: readonly string[];
    }
  | {
      kind: "pattern";
      items: readonly string[];
    }
  | {
      kind: "view";
      direction: string;
      solid: string;
    }
  | {
      kind: "edges";
      pairs: readonly (readonly [string, string])[];
    }
  | {
      kind: "blocks";
      candidate: number;
      pieces: readonly number[];
    }
  | {
      kind: "sets";
      winners: readonly string[];
    };

type PracticeQuestion = {
  id: string;
  skill: PracticeSkill;
  eyebrow: string;
  prompt: string;
  visual: PracticeVisual;
  options: readonly string[];
  correct: string;
  hint: string;
  explanation: string;
  rule: string;
  workedSteps: readonly string[];
};

const practiceSets: readonly (readonly PracticeQuestion[])[] = [
  [
    {
      id: "camera-front",
      skill: "visual",
      eyebrow: "Camera remix",
      prompt: "A camera keeps width and height. Which view is it making?",
      visual: {
        kind: "camera",
        view: "Mystery camera",
        keeps: ["width", "height"],
        hides: "depth",
      },
      options: ["Top view", "Front view", "Side view"],
      correct: "Front view",
      hint: "Face the toy directly. Left-right and up-down remain visible.",
      explanation:
        "A front camera keeps width and height. Depth points away from the camera, so it disappears.",
      rule: "A flat view keeps two dimensions and hides the one pointing at the camera.",
      workedSteps: ["Keep width", "Keep height", "Hide depth", "Front view"],
    },
    {
      id: "camera-side",
      skill: "visual",
      eyebrow: "Camera remix",
      prompt: "A side view keeps depth and height. Which dimension disappears?",
      visual: {
        kind: "camera",
        view: "Side camera",
        keeps: ["depth", "height"],
        hides: "width",
      },
      options: ["Width", "Depth", "Height"],
      correct: "Width",
      hint: "The side camera looks along the width direction.",
      explanation:
        "From the side, depth runs across the picture and height runs upward. Width points toward the camera and collapses.",
      rule: "The viewing direction is the dimension that disappears.",
      workedSteps: ["Side camera", "Keep depth", "Keep height", "Hide width"],
    },
  ],
  [
    {
      id: "scan-below-white",
      skill: "visual",
      eyebrow: "Roof-map remix",
      prompt: "In this new top scan, which colour is directly below white?",
      visual: {
        kind: "grid",
        cells: ["grey", "white", "grey", "black"],
      },
      options: ["Grey", "White", "Black"],
      correct: "Black",
      hint: "Read the right column from top to bottom.",
      explanation:
        "White occupies the upper-right region. The lower-right region directly below it is black.",
      rule: "Top views preserve left-right and front-back position.",
      workedSteps: ["Find white", "Stay in its column", "Move one square down", "Black"],
    },
    {
      id: "scan-right-column",
      skill: "visual",
      eyebrow: "Roof-map remix",
      prompt: "A different toy creates this scan. Which colour fills the right column?",
      visual: {
        kind: "grid",
        cells: ["orange", "blue", "white", "blue"],
      },
      options: ["Orange", "Blue", "White"],
      correct: "Blue",
      hint: "Compare the top-right and bottom-right squares.",
      explanation:
        "Both squares in the right column are blue, even though the left column changes colour.",
      rule: "Compare exact positions instead of following the outline alone.",
      workedSteps: ["Top-right is blue", "Bottom-right is blue", "Right column is blue"],
    },
  ],
  [
    {
      id: "hidden-dots-24",
      skill: "counting",
      eyebrow: "X-ray remix",
      prompt: "A larger cube model has 24 corner dots. You can see 17. How many are hidden?",
      visual: { kind: "count", total: 24, visible: 17, subject: "corner dots" },
      options: ["5", "7", "9"],
      correct: "7",
      hint: "Hidden means total minus visible.",
      explanation: "There are 24 dots altogether and 17 are visible, so 24 - 17 = 7.",
      rule: "Hidden parts = total parts - visible parts.",
      workedSteps: ["Total 24", "Visible 17", "24 - 17", "7 hidden"],
    },
    {
      id: "hidden-faces-12",
      skill: "counting",
      eyebrow: "X-ray remix",
      prompt: "A stepped solid has 12 faces in total. Eight are visible. How many are hidden?",
      visual: { kind: "count", total: 12, visible: 8, subject: "faces" },
      options: ["3", "4", "5"],
      correct: "4",
      hint: "Start at 8 and count up to 12.",
      explanation: "Four more faces are needed to move from 8 visible faces to 12 total faces.",
      rule: "Count every part once, then subtract what the camera already shows.",
      workedSteps: ["Total 12", "Visible 8", "12 - 8", "4 hidden"],
    },
  ],
  [
    {
      id: "sort-octagon",
      skill: "counting",
      eyebrow: "Factory remix",
      prompt: "This shape has eight edges. Which bucket receives it?",
      visual: { kind: "shape", sides: 8 },
      options: ["Yellow: more than 5", "White: 5 or fewer"],
      correct: "Yellow: more than 5",
      hint: "Compare 8 with the factory rule: greater than 5.",
      explanation: "Eight is greater than five, so the octagon travels to the yellow bucket.",
      rule: "Count first, compare second, sort last.",
      workedSteps: ["Count 8 edges", "8 > 5", "Yellow bucket"],
    },
    {
      id: "sort-hexagon",
      skill: "counting",
      eyebrow: "Factory remix",
      prompt: "What is special about this six-edged shape after sorting?",
      visual: { kind: "shape", sides: 6 },
      options: [
        "Yellow and exactly 6",
        "White and exactly 6",
        "Yellow but not exactly 6",
      ],
      correct: "Yellow and exactly 6",
      hint: "Six is both greater than five and equal to six.",
      explanation:
        "The shape enters the yellow bucket because 6 > 5, and it also satisfies the exact-six filter.",
      rule: "A shape may satisfy a broad rule and a narrower rule at the same time.",
      workedSteps: ["6 > 5", "Send to yellow", "6 = 6", "Count it"],
    },
  ],
  [
    {
      id: "crate-top-back-right",
      skill: "visual",
      eyebrow: "Crate remix",
      prompt: "Which face signature matches this transparent mini-crate?",
      visual: { kind: "faces", faces: ["top", "back", "right"] },
      options: ["Top + back + right", "Top + left", "Bottom + back"],
      correct: "Top + back + right",
      hint: "Name each shaded face without turning the crate.",
      explanation:
        "The highlighted faces are top, back and right. Rotation is forbidden, so their names do not change.",
      rule: "Use face position as a signature when rotation is not allowed.",
      workedSteps: ["Top shaded", "Back shaded", "Right shaded", "Match all three"],
    },
    {
      id: "crate-left-bottom",
      skill: "visual",
      eyebrow: "Crate remix",
      prompt: "Which signature should the inspector record?",
      visual: { kind: "faces", faces: ["left", "bottom"] },
      options: ["Left + bottom", "Right + top", "Back + bottom"],
      correct: "Left + bottom",
      hint: "Read the labels on the two glowing faces.",
      explanation: "Only the left and bottom faces are coloured in this orientation.",
      rule: "A correct match preserves both the selected faces and the viewpoint.",
      workedSteps: ["Left selected", "Bottom selected", "No rotation", "Left + bottom"],
    },
  ],
  [
    {
      id: "pattern-shapes",
      skill: "pattern",
      eyebrow: "Conveyor remix",
      prompt: "Which token replaces the question mark?",
      visual: {
        kind: "pattern",
        items: ["cube", "cone", "sphere", "cube", "cone", "?"],
      },
      options: ["Cube", "Cone", "Sphere"],
      correct: "Sphere",
      hint: "Box the shortest repeating unit.",
      explanation:
        "The repeating unit is cube, cone, sphere. The sixth position completes that unit with sphere.",
      rule: "Find the repeating unit before filling a blank.",
      workedSteps: ["Cube", "Cone", "Sphere", "Repeat", "Sphere"],
    },
    {
      id: "pattern-colours",
      skill: "pattern",
      eyebrow: "Conveyor remix",
      prompt: "What comes next in the colour signal?",
      visual: {
        kind: "pattern",
        items: ["blue", "blue", "orange", "blue", "blue", "orange", "?"],
      },
      options: ["Blue", "Orange", "White"],
      correct: "Blue",
      hint: "The unit contains three signals.",
      explanation:
        "Blue, blue, orange repeats. A new unit begins after the second orange, so blue comes next.",
      rule: "Test the proposed unit across the whole sequence.",
      workedSteps: ["Blue, blue, orange", "Blue, blue, orange", "Start again", "Blue"],
    },
  ],
  [
    {
      id: "view-cylinder",
      skill: "visual",
      eyebrow: "Shadow remix",
      prompt: "Which outline does a cylinder make when viewed from directly above?",
      visual: { kind: "view", direction: "top", solid: "cylinder" },
      options: ["Circle", "Rectangle", "Triangle"],
      correct: "Circle",
      hint: "Imagine looking at the cylinder's circular lid.",
      explanation: "The top face of a cylinder is a circle, so its top-view outline is circular.",
      rule: "Match the face pointing toward the camera, not the object's name.",
      workedSteps: ["Camera above", "See the lid", "Lid is circular", "Circle"],
    },
    {
      id: "view-cuboid",
      skill: "visual",
      eyebrow: "Shadow remix",
      prompt: "A long cuboid is viewed from the side. Which outline should survive?",
      visual: { kind: "view", direction: "side", solid: "cuboid" },
      options: ["Rectangle", "Circle", "Triangle"],
      correct: "Rectangle",
      hint: "A cuboid has rectangular side faces.",
      explanation: "The side face of a cuboid is a rectangle, so the side-view outline is rectangular.",
      rule: "Choose the 2D face that points toward the stated camera.",
      workedSteps: ["Side camera", "Find side face", "Side face is rectangular", "Rectangle"],
    },
  ],
  [
    {
      id: "edge-pairs-six",
      skill: "counting",
      eyebrow: "Circuit remix",
      prompt: "How many wires connect matching colours?",
      visual: {
        kind: "edges",
        pairs: [
          ["red", "red"],
          ["red", "blue"],
          ["blue", "blue"],
          ["green", "red"],
          ["green", "green"],
          ["blue", "red"],
        ],
      },
      options: ["2", "3", "4"],
      correct: "3",
      hint: "Check both endpoints of every wire.",
      explanation:
        "Red-red, blue-blue and green-green match. The other three wires join different colours.",
      rule: "An edge counts only when both endpoints have the same colour.",
      workedSteps: ["Red-red", "Blue-blue", "Green-green", "3 matches"],
    },
    {
      id: "edge-pairs-eight",
      skill: "counting",
      eyebrow: "Circuit remix",
      prompt: "Trace the new circuit. How many edges match?",
      visual: {
        kind: "edges",
        pairs: [
          ["blue", "blue"],
          ["red", "green"],
          ["green", "green"],
          ["red", "red"],
          ["blue", "green"],
          ["green", "blue"],
          ["red", "red"],
          ["blue", "red"],
        ],
      },
      options: ["3", "4", "5"],
      correct: "4",
      hint: "Mark a tally only for identical endpoint pairs.",
      explanation:
        "One blue-blue, one green-green and two red-red edges match, giving four in total.",
      rule: "Trace systematically so no edge is skipped or counted twice.",
      workedSteps: ["1 blue match", "1 green match", "2 red matches", "4 total"],
    },
  ],
  [
    {
      id: "blocks-extra",
      skill: "visual",
      eyebrow: "Assembly remix",
      prompt: "The loose pieces contain 9 blocks, but the candidate has 10. What is wrong?",
      visual: { kind: "blocks", pieces: [3, 4, 2], candidate: 10 },
      options: ["One extra block", "One missing block", "The totals match"],
      correct: "One extra block",
      hint: "Add the loose pieces before inspecting their arrangement.",
      explanation: "The pieces contain 3 + 4 + 2 = 9 blocks. A 10-block candidate has one extra.",
      rule: "A valid assembly preserves the exact number of blocks.",
      workedSteps: ["3 + 4 + 2", "9 source blocks", "10 candidate blocks", "1 extra"],
    },
    {
      id: "blocks-missing",
      skill: "visual",
      eyebrow: "Assembly remix",
      prompt: "The pieces contain 10 blocks. A candidate contains 9. What must be true?",
      visual: { kind: "blocks", pieces: [2, 5, 3], candidate: 9 },
      options: ["One block is missing", "One block is extra", "It is automatically correct"],
      correct: "One block is missing",
      hint: "Compare the source total with the candidate total.",
      explanation: "The source total is 2 + 5 + 3 = 10. A 9-block candidate cannot use every block.",
      rule: "Check quantity before checking where the pieces touch.",
      workedSteps: ["2 + 5 + 3", "10 source blocks", "9 candidate blocks", "1 missing"],
    },
  ],
  [
    {
      id: "sets-forced-b",
      skill: "logic",
      eyebrow: "Tournament remix",
      prompt: "Who has already reached three wins?",
      visual: { kind: "sets", winners: ["A", "B", "B", "B", "?"] },
      options: ["A", "B", "Nobody"],
      correct: "B",
      hint: "Count B's wins in sets 2, 3 and 4.",
      explanation: "B has won three sets, so the unknown fifth set cannot change the match winner.",
      rule: "Stop once a player has the required number of certain wins.",
      workedSteps: ["B wins set 2", "B wins set 3", "B wins set 4", "B has 3"],
    },
    {
      id: "sets-transfer-zoya",
      skill: "logic",
      eyebrow: "Tournament remix",
      prompt: "First to three wins. Who wins this new match?",
      visual: { kind: "sets", winners: ["Mira", "Zoya", "Zoya", "Mira", "Zoya"] },
      options: ["Mira", "Zoya", "Tie"],
      correct: "Zoya",
      hint: "Tally each name across all five set cards.",
      explanation: "Zoya wins sets 2, 3 and 5, reaching three wins. Mira wins only two.",
      rule: "Translate each fact into a tally before deciding.",
      workedSteps: ["Mira 2 wins", "Zoya 3 wins", "3 is enough", "Zoya"],
    },
  ],
] as const;

const symbolFor = (item: string) => {
  const symbols: Record<string, string> = {
    blue: "●",
    cone: "▲",
    cube: "■",
    orange: "●",
    sphere: "●",
    white: "○",
    "?": "?",
  };
  return symbols[item] ?? item;
};

function PracticeVisual({ visual }: { visual: PracticeVisual }) {
  switch (visual.kind) {
    case "camera":
      return (
        <div className={styles.practiceCamera}>
          <span>{visual.view}</span>
          <div>
            {visual.keeps.map((item) => (
              <b key={item}>{item}</b>
            ))}
          </div>
          <small>hides {visual.hides}</small>
        </div>
      );
    case "grid":
      return (
        <div className={styles.practiceGrid} aria-label="Four-region top view">
          {visual.cells.map((cell, index) => (
            <i
              className={styles[`practiceCell${cell}`]}
              key={`${cell}-${index}`}
              title={`${cell} region`}
            />
          ))}
        </div>
      );
    case "count":
      return (
        <div className={styles.practiceCount}>
          <div>
            <small>Total</small>
            <strong>{visual.total}</strong>
          </div>
          <span>-</span>
          <div>
            <small>Visible</small>
            <strong>{visual.visible}</strong>
          </div>
          <span>=</span>
          <div>
            <small>Hidden {visual.subject}</small>
            <strong>?</strong>
          </div>
        </div>
      );
    case "shape": {
      const points = Array.from({ length: visual.sides }, (_, index) => {
        const angle = (Math.PI * 2 * index) / visual.sides - Math.PI / 2;
        return `${50 + Math.cos(angle) * 38},${50 + Math.sin(angle) * 38}`;
      }).join(" ");
      return (
        <div className={styles.practiceShape}>
          <svg aria-label={`${visual.sides}-edged shape`} role="img" viewBox="0 0 100 100">
            <polygon points={points} />
          </svg>
          <strong>{visual.sides} edges</strong>
        </div>
      );
    }
    case "faces":
      return (
        <div className={styles.practiceFaces}>
          <span>Transparent crate signature</span>
          <div>
            {["top", "back", "right", "bottom", "left"].map((face) => (
              <i className={visual.faces.includes(face) ? styles.faceActive : ""} key={face}>
                {face}
              </i>
            ))}
          </div>
        </div>
      );
    case "pattern":
      return (
        <div className={styles.practicePattern}>
          {visual.items.map((item, index) => (
            <i className={styles[`pattern${item}`]} key={`${item}-${index}`}>
              {symbolFor(item)}
            </i>
          ))}
        </div>
      );
    case "view":
      return (
        <div className={styles.practiceView}>
          <span>{visual.direction} camera</span>
          <strong>{visual.solid}</strong>
          <i aria-hidden="true">→</i>
          <b>?</b>
        </div>
      );
    case "edges":
      return (
        <div className={styles.practiceEdges}>
          {visual.pairs.map(([from, to], index) => (
            <i key={`${from}-${to}-${index}`}>
              <b className={styles[`practiceDot${from}`]} />
              <span />
              <b className={styles[`practiceDot${to}`]} />
            </i>
          ))}
        </div>
      );
    case "blocks":
      return (
        <div className={styles.practiceBlocks}>
          <div>
            {visual.pieces.map((count, index) => (
              <i key={`${count}-${index}`}>
                Piece {index + 1}
                <b>{count}</b>
              </i>
            ))}
          </div>
          <span>→</span>
          <strong>
            Candidate
            <b>{visual.candidate}</b>
          </strong>
        </div>
      );
    case "sets":
      return (
        <div className={styles.practiceSets}>
          {visual.winners.map((winner, index) => (
            <i key={`${winner}-${index}`}>
              <small>Set {index + 1}</small>
              <strong>{winner}</strong>
            </i>
          ))}
        </div>
      );
  }
}

function simplerExample(question: PracticeQuestion): MistakeFeedback {
  const eyebrow = `${question.eyebrow} · smaller example`;

  switch (question.visual.kind) {
    case "camera":
      return {
        eyebrow,
        title: "Try photographing a book",
        explanation:
          "Place a book flat on a desk. A photo from the front shows its length and thickness. A photo from directly above shows its length and width instead. One direction disappears each time.",
        workedSteps: [
          "Place the book flat",
          "Look from the front",
          "Look from above",
          "Notice which direction vanishes",
        ],
        rule: "The direction pointing toward the camera disappears from a flat view.",
      };
    case "grid":
      return {
        eyebrow,
        title: "Try a tiny seat map",
        explanation:
          "Draw four seats in a 2 by 2 grid. Put green in the top-left seat and yellow in the bottom-left seat. To describe the left column, inspect those two seats from top to bottom.",
        workedSteps: [
          "Find top-left: green",
          "Find bottom-left: yellow",
          "Read one column at a time",
          "Return to the toy map",
        ],
        rule: "Read a grid by exact addresses before describing a row or column.",
      };
    case "count":
      return {
        eyebrow,
        title: "Try five toy cars",
        explanation:
          "Imagine five toy cars in a box. You can see three through the window. Count from three up to five to discover how many the box hides.",
        workedSteps: ["5 cars in all", "3 cars visible", "Count 4, 5", "Two are hidden"],
        rule: "Use total minus visible on the smaller example, then repeat the method.",
      };
    case "shape":
      return {
        eyebrow,
        title: "Sort a triangle first",
        explanation:
          "A triangle has three edges. Count its corners one by one, compare three with the bucket boundary, and only then choose its bucket.",
        workedSteps: ["Trace 3 edges", "Read the boundary rule", "Compare 3", "Sort"],
        rule: "Count, compare and sort in that order.",
      };
    case "faces":
      return {
        eyebrow,
        title: "Try stickers on a cereal box",
        explanation:
          "Put one sticker on the top of a cereal box and another on its left side. Without turning the box, name the sticker faces in the same order.",
        workedSteps: ["Find the top sticker", "Find the left sticker", "Do not rotate", "Record top + left"],
        rule: "Face names stay fixed when rotation is forbidden.",
      };
    case "pattern":
      return {
        eyebrow,
        title: "Try a sound pattern",
        explanation:
          "Clap, tap, clap, tap, clap, __. Say the shortest repeating unit aloud before filling the blank.",
        workedSteps: ["Hear clap, tap", "Box the two-sound unit", "Repeat the unit", "Fill the blank"],
        rule: "Find and test the smallest repeating unit first.",
      };
    case "view":
      return {
        eyebrow,
        title: "Try looking at a coin",
        explanation:
          "Stand a coin upright, then lay it flat. The same object makes different outlines when the camera direction changes.",
        workedSteps: ["Coin upright", "Look from the side", "Coin flat", "Look from above"],
        rule: "Name the camera direction before choosing a 2D outline.",
      };
    case "edges":
      return {
        eyebrow,
        title: "Try three coloured wires",
        explanation:
          "Wire 1 joins red to red. Wire 2 joins blue to green. Wire 3 joins yellow to yellow. Check both endpoints before making each tally mark.",
        workedSteps: ["Red-red matches", "Blue-green does not", "Yellow-yellow matches", "Tally two"],
        rule: "An edge counts only when both of its endpoint colours match.",
      };
    case "blocks":
      return {
        eyebrow,
        title: "Try two tiny pieces",
        explanation:
          "One loose piece has two blocks and another has three. Before comparing shapes, add the source pieces and check that a candidate preserves that total.",
        workedSteps: ["Piece 1 has 2", "Piece 2 has 3", "Source total is 5", "Compare the candidate total"],
        rule: "Check the number of blocks before checking their arrangement.",
      };
    case "sets":
      return {
        eyebrow,
        title: "Try a first-to-two match",
        explanation:
          "Ria wins round 1, and Omar wins round 2. Ria also wins round 3. Tally each certain win before naming the match winner.",
        workedSteps: ["Ria: round 1", "Omar: round 2", "Ria: round 3", "Compare the tallies"],
        rule: "Translate every result into a tally before deciding.",
      };
  }
}

export function ToyPracticeLab({
  alreadyCompleted,
  onAnswer,
  onComplete,
  onMistake,
  playTone,
  screen,
}: {
  alreadyCompleted: boolean;
  onAnswer: (skill: PracticeSkill, correct: boolean) => void;
  onComplete: () => void;
  onMistake: (feedback: MistakeFeedback) => void;
  playTone: (correct: boolean) => void;
  screen: number;
}) {
  const questions = practiceSets[screen] ?? practiceSets[0];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [hintOpen, setHintOpen] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const question = questions[index];
  const mastered =
    (alreadyCompleted && !replaying) || solved.size === questions.length;
  const correctNow = selected === question.correct;

  function choose(option: string) {
    if (correctNow) return;
    const correct = option === question.correct;
    setSelected(option);
    onAnswer(question.skill, correct);
    playTone(correct);

    if (!correct) {
      onMistake(simplerExample(question));
      return;
    }

    const nextSolved = new Set(solved).add(question.id);
    setSolved(nextSolved);
    if (nextSolved.size === questions.length) onComplete();
  }

  function nextQuestion() {
    setIndex((value) => Math.min(value + 1, questions.length - 1));
    setSelected(undefined);
    setHintOpen(false);
  }

  function replay() {
    setIndex(0);
    setSelected(undefined);
    setSolved(new Set());
    setHintOpen(false);
    setReplaying(true);
  }

  if (mastered) {
    return (
      <section className={styles.practiceMastered} aria-label="Remix practice complete">
        <span>
          <Trophy aria-hidden="true" />
        </span>
        <div>
          <p>Transfer badge earned</p>
          <h2>You solved the rule with new information</h2>
          <small>
            The handbook challenge and both remixes are complete. This concept
            is ready to travel to a different-looking question.
          </small>
        </div>
        <button onClick={replay} type="button">
          <RotateCw aria-hidden="true" /> Play remixes again
        </button>
      </section>
    );
  }

  return (
    <section className={styles.practiceLab} aria-label="Remix practice">
      <header>
        <div>
          <p>
            <Sparkles aria-hidden="true" /> Remix arena
          </p>
          <h2>New look. Same thinking.</h2>
          <small>
            Beat two fresh questions to prove you learned the rule, not the
            picture.
          </small>
        </div>
        <div className={styles.practiceProgress} aria-label={`${solved.size} of 2 remixes solved`}>
          {questions.map((item, questionIndex) => (
            <i
              className={
                solved.has(item.id)
                  ? styles.practiceProgressDone
                  : questionIndex === index
                    ? styles.practiceProgressActive
                    : ""
              }
              key={item.id}
            >
              {solved.has(item.id) ? <Check aria-hidden="true" /> : questionIndex + 1}
            </i>
          ))}
        </div>
      </header>

      <div className={styles.practiceChallenge}>
        <div className={styles.practiceVisual}>
          <span>{question.eyebrow}</span>
          <PracticeVisual visual={question.visual} />
        </div>
        <div className={styles.practiceQuestion}>
          <span>Remix {index + 1} of {questions.length}</span>
          <h3>{question.prompt}</h3>
          <div className={styles.practiceOptions}>
            {question.options.map((option) => (
              <button
                className={
                  selected === option
                    ? option === question.correct
                      ? styles.choiceCorrect
                      : styles.choiceWrong
                    : ""
                }
                disabled={correctNow}
                key={option}
                onClick={() => choose(option)}
                type="button"
              >
                {selected === option && option === question.correct ? (
                  <Check aria-hidden="true" />
                ) : null}
                {option}
              </button>
            ))}
          </div>

          <button
            className={styles.practiceHintButton}
            onClick={() => setHintOpen((value) => !value)}
            type="button"
          >
            <Lightbulb aria-hidden="true" />
            {hintOpen ? "Hide hint" : "Give me a clue"}
          </button>
          {hintOpen ? <p className={styles.practiceHint}>{question.hint}</p> : null}

          {correctNow ? (
            <div className={styles.practiceExplanation} aria-live="polite">
              <strong>Yes. Here is why it works.</strong>
              <p>{question.explanation}</p>
              {index < questions.length - 1 ? (
                <button onClick={nextQuestion} type="button">
                  Next remix <ArrowRight aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
