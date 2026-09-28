/**
 * The Chapter 8 practice bank — the single source of truth for every question
 * and its correct answer.
 *
 * This module deliberately carries NO "use client" directive and NO JSX, so the
 * grading route can import it on the server. That is the whole point: marks are
 * computed here, from this key, against a session-verified student. If the
 * answer key lived only in the client panels, the browser would be grading
 * itself and a student could post a perfect score.
 *
 * The panels import the same arrays they always did, so there is exactly one
 * copy of every answer and it cannot drift.
 */
import type { PracticeQuestion } from "../components/learning/LearningSupport";

/** Marks for a correct answer. Wrong answers score zero — practice is one shot. */
export const MARKS_PER_QUESTION = 1;

export const WHY_QUESTIONS: PracticeQuestion[] = [
  {
    id: "why-word",
    source: "handbook",
    prompt: "The word 'trigonometry' comes from three Greek words. What do they mean?",
    options: [
      "three · sides · measure",
      "triangle · angle · number",
      "three · circles · distance",
      "shape · line · count",
    ],
    correct: "three · sides · measure",
    solution: {
      steps: [
        "Split the word into its three Greek roots: tri, gon, metron.",
        "'tri' means three and 'gon' means sides.",
        "'metron' means measure, so the word literally reads 'three-side measurement'.",
      ],
      rule: "Trigonometry is named for exactly what it does: measuring triangles.",
    },
    mistake: {
      eyebrow: "Word origins",
      title: "Close — take the word apart",
      explanation:
        "Break the word into its three pieces and translate each one separately, " +
        "the way you would with 'geo-metry' (earth-measure).",
      workedSteps: [
        "geo = earth, metron = measure  →  geometry is 'earth measurement'",
        "So metron always gives you 'measure'",
        "tri = three, gon = sides",
      ],
      rule: "tri + gon + metron = measuring three-sided figures.",
    },
  },
  {
    id: "why-need",
    source: "handbook",
    prompt:
      "NCERT §8.1 shows a student looking at the top of the Qutub Minar. What makes " +
      "this a trigonometry problem rather than a ruler problem?",
    options: [
      "The height cannot be measured directly, but an angle and a ground distance can",
      "The Minar is too old to touch",
      "Because the answer is not a whole number",
      "Because there are three people in the picture",
    ],
    correct:
      "The height cannot be measured directly, but an angle and a ground distance can",
      solution: {
        steps: [
          "Ask what you could actually reach with a tape measure — the ground, not the top.",
          "You can walk the distance from your feet to the base, and you can measure the angle you look up through.",
          "Those two sit in the same right triangle as the unknown height, so the height can be calculated instead of climbed.",
        ],
        rule: "Trigonometry earns its place whenever one side is unreachable but an angle and another side are not.",
      },
    mistake: {
      eyebrow: "What the subject is for",
      title: "Ask which measurement is actually possible",
      explanation:
        "The test is not how hard the number looks. It is whether you can physically " +
        "reach the thing you want to measure.",
      workedSteps: [
        "Want: the height of the tower — you cannot reach the top",
        "Can get: how far you stand from its base — just pace it out",
        "Can get: the angle you look up at — a simple instrument",
        "Two reachable measurements, one unreachable answer",
      ],
      rule:
        "Trigonometry is for when the quantity you want is out of reach but an " +
        "angle and one length are not.",
    },
  },
  {
    id: "why-transfer",
    source: "practice",
    prompt:
      "A girl on a balcony looks down at a flower pot across a river (NCERT Fig 8.2). " +
      "She knows how high she is sitting. What can trigonometry give her?",
    options: [
      "The width of the river",
      "The weight of the flower pot",
      "The time of day",
      "Nothing — she needs to cross first",
    ],
    correct: "The width of the river",
    solution: {
      steps: [
        "Name the right triangle: her height above the water is vertical, the river's width is horizontal.",
        "She already knows how high she is sitting, and she can measure the angle she looks down through.",
        "One side plus one angle in the same right triangle fixes every other side, so the width follows.",
      ],
      rule: "A known length and a known angle in one right triangle determine all the remaining sides.",
    },
    mistake: {
      eyebrow: "Transfer",
      title: "Same shape, different story",
      explanation:
        "This is the tower problem lying on its side. One known length, one angle, " +
        "and the unknown is the side you cannot walk along.",
      workedSteps: [
        "Known: her height above the water — the vertical side",
        "Known: the angle she looks down at",
        "Unknown: the horizontal side — the river's width",
      ],
      rule:
        "Whenever a known length and an angle sit in the same right triangle as the " +
        "unknown, trigonometry reaches it.",
    },
  },
];

export const HIDDEN_QUESTIONS: PracticeQuestion[] = [
  {
    id: "hidden-where",
    source: "handbook",
    prompt:
      "In the Qutub Minar situation, which three lines form the right triangle?",
    options: [
      "The tower's height, the ground distance, and the line of sight",
      "The tower's height, its width, and its shadow",
      "The student's height, the tower's height, and the sky",
      "Three sides of the tower's base",
    ],
    correct: "The tower's height, the ground distance, and the line of sight",
    solution: {
      steps: [
        "Run the three questions: what is vertical, what is horizontal, what joins them.",
        "Vertical is the tower's height; horizontal is the ground from the student's feet to its base.",
        "The line of sight from eye to top closes the triangle, and the vertical meets the ground at 90°.",
      ],
      rule: "Vertical, horizontal, and the line of sight joining them — that is the hidden right triangle.",
    },
    mistake: {
      eyebrow: "Spotting the triangle",
      title: "Find the two that meet at 90°",
      explanation:
        "Start from the right angle and work outwards. Which two lines in the " +
        "picture actually meet at a square corner?",
      workedSteps: [
        "The tower stands straight up — vertical",
        "The ground runs straight across — horizontal",
        "Vertical meets horizontal at 90°, at the tower's base",
        "The line of sight joins the two loose ends and closes the shape",
      ],
      rule:
        "Vertical + horizontal + the sloping line joining their ends = the hidden " +
        "right triangle.",
    },
  },
  {
    id: "hidden-hyp",
    source: "handbook",
    prompt:
      "In that triangle, which side is the hypotenuse?",
    options: [
      "The line of sight",
      "The height of the Minar",
      "The distance along the ground",
      "Whichever side is drawn first",
    ],
    correct: "The line of sight",
    solution: {
      steps: [
        "The hypotenuse is always the side facing the right angle.",
        "Here the right angle is at the foot of the tower, where the vertical meets flat ground.",
        "The side facing that corner is the line of sight, so the line of sight is the hypotenuse.",
      ],
      rule: "The right angle chooses the hypotenuse; it is the side opposite that corner, and the longest.",
    },
    mistake: {
      eyebrow: "Hypotenuse",
      title: "The hypotenuse has one job",
      explanation:
        "The hypotenuse is defined by its position, not by how long it looks: it " +
        "is the side opposite the right angle.",
      workedSteps: [
        "The right angle sits at the base of the tower",
        "Which side does not touch that corner at all?",
        "The sloping line from the eye to the top — that is the one",
      ],
      rule:
        "The hypotenuse is always opposite the right angle, and always the longest side.",
    },
  },
  {
    id: "hidden-balloon",
    source: "practice",
    prompt:
      "NCERT Fig 8.3: a hot-air balloon has drifted from point A to point B, and you " +
      "want the height of B above the ground. Where is the right angle?",
    options: [
      "Where the vertical from the balloon meets the ground",
      "At the balloon itself",
      "At the observer's eye",
      "There is no right angle in this one",
    ],
    correct: "Where the vertical from the balloon meets the ground",
    solution: {
      steps: [
        "Drop a vertical from the balloon straight down to the ground.",
        "That vertical meets horizontal ground at 90° — nobody constructs the angle, it comes free.",
        "So the right angle sits at the foot of that vertical, not at the balloon and not at the eye.",
      ],
      rule: "A vertical standing on horizontal ground always puts the right angle at the ground.",
    },
    mistake: {
      eyebrow: "Transfer",
      title: "The right angle lives where vertical meets flat",
      explanation:
        "The balloon is in the air, so drop a straight line from it to the ground. " +
        "That dropped line is the vertical, and the ground is the horizontal.",
      workedSteps: [
        "Drop a vertical from the balloon straight down to the ground",
        "That vertical is the height you are looking for",
        "It hits the flat ground at 90° — that corner is the right angle",
      ],
      rule:
        "If the object is in the air, drop a vertical to the ground; the foot of " +
        "that vertical is your right angle.",
    },
  },
];

export const NAMING_QUESTIONS: PracticeQuestion[] = [
  {
    id: "n-hyp",
    source: "handbook",
    prompt: "In △ABC, right-angled at B, which side is the hypotenuse?",
    options: ["AC", "AB", "BC", "It depends on which angle you choose"],
    correct: "AC",
    solution: {
      steps: [
        "The right angle is at B.",
        "The hypotenuse is the side facing the right angle.",
        "The side opposite B is AC, so AC is the hypotenuse.",
      ],
      rule: "The hypotenuse faces the right angle and never changes when you switch acute angles.",
    },
    mistake: {
      eyebrow: "Hypotenuse",
      title: "The right angle picks it, not you",
      explanation:
        "The hypotenuse is the side facing the right angle, so it is decided the " +
        "moment the triangle is drawn. It never changes when you switch angles.",
      workedSteps: [
        "In △PQR right-angled at Q, the right angle sits at Q",
        "Look straight across from Q — that is the side PR",
        "So PR is the hypotenuse, whether you name from P or from R",
      ],
      rule: "Hypotenuse = the side opposite the right angle = the longest side.",
    },
  },
  {
    id: "n-opp",
    source: "handbook",
    prompt: "In the same triangle, which side is opposite to angle A?",
    options: ["BC", "AB", "AC", "Both AB and BC"],
    correct: "BC",
    solution: {
      steps: [
        "Stand at angle A and look straight across the triangle.",
        "The side that does not touch A is BC.",
        "So BC is the side opposite angle A.",
      ],
      rule: "The opposite side is the one that does not touch the angle you are using.",
    },
    mistake: {
      eyebrow: "Opposite side",
      title: "The opposite side is the one A never touches",
      explanation:
        "Stand at the angle and look across the triangle. The side you are looking " +
        "at — the one that does not touch your vertex at all — is the opposite side.",
      workedSteps: [
        "In △PQR right-angled at Q, take angle P",
        "P touches PQ and PR, so neither of those can be opposite P",
        "The one side left is QR — so QR is opposite P",
      ],
      rule: "Opposite side = the only side that does not touch the angle's vertex.",
    },
  },
  {
    id: "n-adj",
    source: "handbook",
    prompt: "In the same triangle, which side is adjacent to angle A?",
    options: [
      "AB — the arm of angle A that is not the hypotenuse",
      "AC — it is an arm of angle A",
      "BC — it is next to angle A",
      "Either AB or AC",
    ],
    correct: "AB — the arm of angle A that is not the hypotenuse",
    solution: {
      steps: [
        "Angle A is formed by two sides, AB and AC.",
        "AC is already the hypotenuse, because the right angle is at B.",
        "That leaves AB as the adjacent side.",
      ],
      rule: "Adjacent is the arm of the angle that is not the hypotenuse.",
    },
    mistake: {
      eyebrow: "The classic trap",
      title: "Both arms touch A — only one is 'adjacent'",
      explanation:
        "An acute angle always has two arms, and one of them is the hypotenuse. " +
        "The hypotenuse already has its own name, so 'adjacent' is reserved for " +
        "the other arm. That is why the answer is never the hypotenuse.",
      workedSteps: [
        "In △PQR right-angled at Q, take angle P",
        "P's two arms are PQ and PR",
        "PR is the hypotenuse (it faces the right angle at Q)",
        "So the adjacent side to P is the other arm, PQ",
      ],
      rule: "Adjacent = the arm of your angle that is NOT the hypotenuse.",
    },
  },
  {
    id: "n-q11iii",
    source: "handbook",
    prompt:
      "NCERT Ex 8.1 Q11(iii) — true or false: 'cos A is the abbreviation used for " +
      "the cosecant of angle A.'",
    options: [
      "False — cos A abbreviates the cosine of A; cosecant is written cosec A",
      "True — cos is short for cosecant",
      "True, but only for acute angles",
      "False — cos A abbreviates the cotangent of A",
    ],
    correct: "False — cos A abbreviates the cosine of A; cosecant is written cosec A",
    solution: {
      steps: [
        "Read the abbreviation as written: cos is short for cosine.",
        "Cosecant has its own abbreviation, cosec A.",
        "So the statement is false — cos A is the cosine of A, not its cosecant.",
      ],
      rule: "Every ratio has one fixed abbreviation; cos and cosec name different ratios.",
    },
    mistake: {
      eyebrow: "Notation",
      title: "Three different names, three different symbols",
      explanation:
        "The abbreviations are fixed and they are not interchangeable. Mixing them " +
        "up costs marks even when the working is right.",
      workedSteps: [
        "cos A  = cosine of A      = adjacent / hypotenuse",
        "cosec A = cosecant of A   = hypotenuse / opposite",
        "cot A  = cotangent of A   = adjacent / opposite",
        "Each is a separate ratio with its own separate symbol",
      ],
      rule: "cos is cosine. Cosecant is cosec (or csc). Never abbreviate cosecant as cos.",
    },
  },
  {
    id: "n-q11iv",
    source: "handbook",
    prompt:
      "NCERT Ex 8.1 Q11(iv) — true or false: 'cot A is the product of cot and A.'",
    options: [
      "False — 'cot' alone means nothing; cot A is one symbol for the cotangent of A",
      "True — it is cot multiplied by A",
      "True, provided A is measured in degrees",
      "False — cot A means cot divided by A",
    ],
    correct: "False — 'cot' alone means nothing; cot A is one symbol for the cotangent of A",
    solution: {
      steps: [
        "'cot' on its own names no quantity, so there is nothing to multiply by.",
        "cot A is a single indivisible symbol meaning the cotangent of the angle A.",
        "So it cannot be read as cot × A, and the statement is false.",
      ],
      rule: "A ratio symbol is meaningless without its angle: cot A is one name, not a product.",
    },
    mistake: {
      eyebrow: "Notation",
      title: "'cot' is not a number, so it cannot multiply anything",
      explanation:
        "These are function names, not quantities. Writing cot A is like writing " +
        "'the height of A' — the words only mean something together.",
      workedSteps: [
        "sin A does not mean s x i x n x A",
        "It means 'the sine OF angle A' — a single instruction",
        "So you can never cancel or split the letters",
        "Same for cos A, tan A, cosec A, sec A and cot A",
      ],
      rule: "sin A, cos A, cot A are each ONE symbol. The letters never separate.",
    },
  },
  {
    id: "n-x1",
    source: "practice",
    prompt:
      "In △PQR, right-angled at Q, PQ = 8 cm and QR = 6 cm. What is the hypotenuse?",
    options: ["PR = 10 cm", "PQ = 8 cm", "QR = 6 cm", "There is not enough information"],
    correct: "PR = 10 cm",
    solution: {
      steps: [
        "The right angle is at Q, so the hypotenuse is the side facing Q, which is PR.",
        "Pythagoras: PR² = PQ² + QR² = 8² + 6² = 64 + 36 = 100.",
        "PR = √100 = 10 cm.",
      ],
      rule: "The hypotenuse faces the right angle, and Pythagoras gives its length from the two legs.",
    },
    mistake: {
      eyebrow: "Finding the hypotenuse",
      title: "Name it from the right angle, then compute it",
      explanation:
        "The hypotenuse is the side facing the right angle — here that is PR. Its " +
        "length comes from Pythagoras on the two legs you were given.",
      workedSteps: [
        "In △XYZ right-angled at Y with XY = 5 and YZ = 12",
        "The side facing Y is XZ, so XZ is the hypotenuse",
        "XZ² = 5² + 12² = 25 + 144 = 169",
        "XZ = 13 — and it is the longest of the three, as it must be",
      ],
      rule: "Hypotenuse faces the right angle; its length is √(leg² + leg²).",
    },
  },
  {
    id: "n-x2",
    source: "practice",
    prompt:
      "A ladder leans against a wall. Taking the angle between the ladder and the " +
      "ground, which part of the picture is the hypotenuse?",
    options: ["The ladder", "The wall", "The ground", "The wall and the ground together"],
    correct: "The ladder",
    solution: {
      steps: [
        "The wall stands vertically on horizontal ground, so the right angle is where they meet.",
        "The hypotenuse is the side facing that right angle.",
        "The ladder is the side facing the corner, so the ladder is the hypotenuse.",
      ],
      rule: "Wall and ground make the right angle; the leaning ladder is always the hypotenuse.",
    },
    mistake: {
      eyebrow: "Naming in a real scene",
      title: "Find the right angle first, then look across from it",
      explanation:
        "The wall is vertical and the ground is horizontal, so the right angle is " +
        "where they meet. The hypotenuse is whatever joins the far ends — the ladder.",
      workedSteps: [
        "A kite on a string: the height is vertical, the ground is horizontal",
        "They meet at 90°, so that corner is the right angle",
        "The string joins the two far ends",
        "So the string is the hypotenuse",
      ],
      rule: "The hypotenuse is the slanted side joining the two legs' far ends.",
    },
  },
  {
    id: "n-x3",
    source: "practice",
    prompt:
      "In a right triangle the three sides are 9 cm, 12 cm and 15 cm. Which one " +
      "must be the hypotenuse?",
    options: ["15 cm", "12 cm", "9 cm", "Any of them, depending on the angle"],
    correct: "15 cm",
    solution: {
      steps: [
        "The hypotenuse faces the right angle, and is therefore the longest side.",
        "Check with Pythagoras: 9² + 12² = 81 + 144 = 225.",
        "√225 = 15, so the 15 cm side is the hypotenuse.",
      ],
      rule: "The side facing the right angle is always the longest of the three.",
    },
    mistake: {
      eyebrow: "Spotting it from lengths alone",
      title: "The hypotenuse is always the longest side",
      explanation:
        "You do not even need the diagram. In any right triangle the side facing " +
        "the right angle is the longest, so the largest number is the hypotenuse.",
      workedSteps: [
        "Take sides 8, 15 and 17",
        "Check: 8² + 15² = 64 + 225 = 289 = 17²",
        "The two smaller sides are the legs; 17 faces the right angle",
        "So 17 is the hypotenuse — the largest of the three",
      ],
      rule: "Longest side = hypotenuse. Always.",
    },
  },
  {
    id: "n-x4",
    source: "practice",
    prompt:
      "In △ABC right-angled at B, you are asked for the side adjacent to angle C. " +
      "Which is it?",
    options: ["BC", "AB", "AC", "There is no adjacent side to C"],
    correct: "BC",
    solution: {
      steps: [
        "Angle C is formed by the two sides BC and AC.",
        "AC is the hypotenuse, since the right angle is at B.",
        "So the adjacent side for angle C is BC.",
      ],
      rule: "Switching the angle swaps opposite and adjacent, but never the hypotenuse.",
    },
    mistake: {
      eyebrow: "Adjacent, from a different corner",
      title: "Go to C and list its two arms",
      explanation:
        "Angle C is touched by CB and CA. CA is the hypotenuse, so the adjacent " +
        "side has to be the other arm, CB.",
      workedSteps: [
        "In △PQR right-angled at Q, take angle R",
        "R's arms are RQ and RP",
        "RP faces the right angle, so RP is the hypotenuse",
        "The adjacent side to R is therefore RQ",
      ],
      rule: "Adjacent = your angle's arm that is not the hypotenuse — whichever corner you stand in.",
    },
  },
  {
    id: "n-x5",
    source: "practice",
    prompt: "Which of these is NOT decided by the right angle alone?",
    options: [
      "Which side is opposite",
      "Which side is the hypotenuse",
      "Which side is the longest",
      "Where the little square is drawn",
    ],
    correct: "Which side is opposite",
    solution: {
      steps: [
        "The right angle fixes the hypotenuse, and the hypotenuse is always the longest side.",
        "The little square only marks where that right angle sits.",
        "But 'opposite' depends on which acute angle you pick, so it is not decided by the right angle alone.",
      ],
      rule: "The right angle fixes the hypotenuse; you fix opposite and adjacent by choosing an angle.",
    },
    mistake: {
      eyebrow: "What depends on what",
      title: "Two names are fixed, one pair floats",
      explanation:
        "The right angle fixes the hypotenuse — and therefore the longest side — " +
        "the moment the triangle exists. Opposite and adjacent wait until you " +
        "choose an acute angle to work from.",
      workedSteps: [
        "Draw △PQR right-angled at Q and name nothing else",
        "You can already say: PR is the hypotenuse and the longest side",
        "You cannot yet say which side is 'opposite' — opposite to which angle?",
        "Pick P, and only then does QR become the opposite side",
      ],
      rule: "Right angle ⇒ hypotenuse. Acute angle ⇒ opposite and adjacent.",
    },
  },
];

export const SWAP_QUESTIONS: PracticeQuestion[] = [
  {
    id: "s-opp",
    source: "handbook",
    prompt: "In △ABC right-angled at B, which side is opposite to angle C?",
    options: ["AB", "BC", "AC", "The same as for angle A"],
    correct: "AB",
    solution: {
      steps: [
        "Stand at angle C and look across the triangle.",
        "The side that does not touch C is AB.",
        "So AB is opposite angle C.",
      ],
      rule: "The opposite side is the one that does not touch the chosen angle.",
    },
    mistake: {
      eyebrow: "Naming from a new angle",
      title: "Start again from the new vertex",
      explanation:
        "Do not carry the old names over. Go to the new angle and ask which side " +
        "fails to touch it — that side, and only that side, is opposite.",
      workedSteps: [
        "In △PQR right-angled at Q, take angle R",
        "R touches QR and PR, so neither can be opposite R",
        "The remaining side PQ is opposite R — even though PQ is adjacent to P",
      ],
      rule: "The same side can be opposite one angle and adjacent to the other.",
    },
  },
  {
    id: "s-hyp",
    source: "handbook",
    prompt: "When you switch from angle A to angle C, what happens to the hypotenuse?",
    options: ["Nothing — it is still AC", "It becomes AB", "It becomes BC",
              "There is no hypotenuse for angle C"],
    correct: "Nothing — it is still AC",
    solution: {
      steps: [
        "The hypotenuse is fixed by the right angle at B, not by the acute angle you are using.",
        "Switching from A to C does not move the right angle.",
        "So the hypotenuse is still AC.",
      ],
      rule: "Opposite and adjacent swap when the angle changes; the hypotenuse never does.",
    },
    mistake: {
      eyebrow: "What actually moves",
      title: "The right angle has not moved, so nor has the hypotenuse",
      explanation:
        "Only opposite and adjacent depend on which acute angle you picked. The " +
        "hypotenuse was fixed by the right angle, and you did not move that.",
      workedSteps: [
        "In △PQR right-angled at Q, the hypotenuse is PR",
        "Name from P: hypotenuse PR. Name from R: hypotenuse still PR",
        "Only the other two names traded places",
      ],
      rule: "Two names swap when the angle changes; the hypotenuse never does.",
    },
  },
  {
    id: "s-q1ii",
    source: "handbook",
    prompt:
      "NCERT Ex 8.1 Q1(ii) — in △ABC right-angled at B with AB = 24 cm and " +
      "BC = 7 cm (so AC = 25 cm), what are sin C and cos C?",
    options: [
      "sin C = 24/25, cos C = 7/25",
      "sin C = 7/25, cos C = 24/25",
      "sin C = 25/24, cos C = 25/7",
      "sin C = 7/24, cos C = 24/7",
    ],
    correct: "sin C = 24/25, cos C = 7/25",
    solution: {
      steps: [
        "For angle A the opposite side is BC = 7 and the hypotenuse is AC = 25, so sin A = 7/25.",
        "Move to angle C: what was opposite becomes adjacent, and what was adjacent becomes opposite.",
        "So sin C = AB/AC = 24/25 and cos C = BC/AC = 7/25.",
      ],
      rule: "sin C = cos A and cos C = sin A, because the two acute angles share the same sides in swapped roles.",
    },
    mistake: {
      eyebrow: "The swap, with numbers",
      title: "Re-sort the sides before you divide",
      explanation:
        "The lengths have not changed, but their roles have. From C, the side that " +
        "does not touch C is AB = 24, so that is now the opposite side.",
      workedSteps: [
        "In a 6-8-10 triangle right-angled at B with AB = 8, BC = 6",
        "From A: sin A = 6/10 = 3/5 and cos A = 8/10 = 4/5",
        "From C the roles swap: opposite is AB = 8, adjacent is BC = 6",
        "So sin C = 8/10 = 4/5 and cos C = 6/10 = 3/5 — exactly A's pair, crossed over",
      ],
      rule: "sin of one acute angle = cos of the other, in every right triangle.",
    },
  },
  {
    id: "s-q2",
    source: "handbook",
    prompt:
      "NCERT Ex 8.1 Q2 — in △PQR right-angled at Q with PQ = 12 cm and " +
      "PR = 13 cm, find tan P − cot R.",
    options: ["0", "5/12", "12/5", "1"],
    correct: "0",
    solution: {
      steps: [
        "First get QR: QR² = PR² − PQ² = 13² − 12² = 169 − 144 = 25, so QR = 5.",
        "tan P = opposite/adjacent = QR/PQ = 5/12.",
        "cot R = adjacent/opposite for angle R = QR/PQ = 5/12, so tan P − cot R = 0.",
      ],
      rule: "tan of one acute angle equals cot of the other, so their difference is always zero.",
    },
    mistake: {
      eyebrow: "Two angles, one triangle",
      title: "Work out each ratio separately, then subtract",
      explanation:
        "Find the third side first, then build tan P and cot R independently. They " +
        "look like different things but come out as the same fraction.",
      workedSteps: [
        "In a 6-8-10 triangle right-angled at Q with PQ = 8, QR = 6",
        "tan P = opposite P / adjacent P = QR/PQ = 6/8",
        "cot R = adjacent R / opposite R = QR/PQ = 6/8 — the identical fraction",
        "So tan P − cot R = 0",
      ],
      rule: "In a right triangle, tan of one acute angle equals cot of the other.",
    },
  },
  {
    id: "s-q9",
    source: "handbook",
    prompt:
      "NCERT Ex 8.1 Q9 — in △ABC right-angled at B with tan A = 1/√3 " +
      "(so sin A = 1/2, cos A = √3/2), what is cos A cos C − sin A sin C?",
    options: ["0", "1", "√3/2", "1/2"],
    correct: "0",
    solution: {
      steps: [
        "tan A = 1/√3 makes A = 30°, so the other acute angle C = 60°.",
        "Substitute: cos A cos C − sin A sin C = (√3/2)(1/2) − (1/2)(√3/2).",
        "Both products are √3/4, so the expression is √3/4 − √3/4 = 0.",
      ],
      rule: "cos A cos C − sin A sin C is cos(A + C); the acute angles sum to 90°, so it is always 0.",
    },
    mistake: {
      eyebrow: "Using both angles at once",
      title: "Get C's ratios by swapping A's",
      explanation:
        "You are never told anything about C directly. Its ratios come from the " +
        "swap: C's opposite is A's adjacent, so sin C = cos A and cos C = sin A.",
      workedSteps: [
        "tan A = 1/√3 gives opposite k, adjacent √3k, hypotenuse 2k",
        "sin A = 1/2 and cos A = √3/2",
        "Swapping for C: sin C = √3/2 and cos C = 1/2",
        "cos A cos C − sin A sin C = (√3/2)(1/2) − (1/2)(√3/2) = 0",
      ],
      rule: "Never recompute C from scratch — swap A's opposite and adjacent.",
    },
  },
  {
    id: "s-sincos",
    source: "practice",
    prompt: "In △ABC right-angled at B, sin A = BC/AC. What is cos C equal to?",
    options: ["BC/AC — the same value as sin A", "AB/AC", "AB/BC", "AC/BC"],
    correct: "BC/AC — the same value as sin A",
    solution: {
      steps: [
        "sin A = BC/AC is opposite over hypotenuse for angle A.",
        "For angle C, BC is the adjacent side while AC is still the hypotenuse.",
        "So cos C = BC/AC, which is exactly the same value as sin A.",
      ],
      rule: "sin A = cos C in every right triangle, because A and C are complementary.",
    },
    mistake: {
      eyebrow: "Why sin and cos trade places",
      title: "Write out what cos C asks for",
      explanation:
        "cos C means adjacent-to-C over hypotenuse. Find the side adjacent to C " +
        "first, then divide by the hypotenuse, and compare with sin A.",
      workedSteps: [
        "In △PQR right-angled at Q: sin P = QR/PR",
        "cos R = adjacent-to-R over hypotenuse",
        "R's arms are QR and PR; PR is the hypotenuse, so adjacent is QR",
        "cos R = QR/PR — the very same fraction as sin P",
      ],
      rule: "In any right triangle, sin of one acute angle = cos of the other.",
    },
  },
  {
    id: "s-x2",
    source: "practice",
    prompt:
      "In a right triangle the two acute angles are A and C. If tan A = 3/4, what is cot C?",
    options: ["3/4", "4/3", "3/5", "5/4"],
    correct: "3/4",
    solution: {
      steps: [
        "tan A = opposite/adjacent for angle A.",
        "For the other acute angle C, those two sides trade places, so cot C uses the same pair the same way round.",
        "Therefore cot C = tan A = 3/4.",
      ],
      rule: "cot C = tan A whenever A and C are the two acute angles of a right triangle.",
    },
    mistake: {
      eyebrow: "tan and cot across the swap",
      title: "Two swaps and a flip cancel out",
      explanation:
        "cot C is adjacent-to-C over opposite-to-C. But C's adjacent is A's opposite " +
        "and C's opposite is A's adjacent — so cot C rebuilds exactly tan A.",
      workedSteps: [
        "Say opposite A = 3 and adjacent A = 4, so tan A = 3/4",
        "From C those swap: adjacent C = 3 and opposite C = 4",
        "cot C = adjacent C / opposite C = 3/4",
        "So cot C = tan A — which is why Q2 came out as zero",
      ],
      rule: "tan A = cot C and cot A = tan C for the two acute angles of a right triangle.",
    },
  },
  {
    id: "s-x3",
    source: "practice",
    prompt: "Which pair of ratios must be equal in any right triangle ABC, right-angled at B?",
    options: ["sin A and cos C", "sin A and cos A", "sin A and sin C", "tan A and tan C"],
    correct: "sin A and cos C",
    solution: {
      steps: [
        "A and C are complementary, so C = 90° − A.",
        "The side opposite A is the side adjacent to C, and the hypotenuse is shared.",
        "So sin A and cos C are built from the identical pair of sides and must be equal.",
      ],
      rule: "Complementary angles swap sine and cosine: sin A = cos C.",
    },
    mistake: {
      eyebrow: "Which pairs actually match",
      title: "Only the crossed pairs agree",
      explanation:
        "sin A and cos C both end up as the same two sides. The others compare " +
        "different pairs of sides and are equal only in special triangles.",
      workedSteps: [
        "Take a 3-4-5 triangle with opposite A = 3, adjacent A = 4",
        "sin A = 3/5 and cos A = 4/5 — different, so those two do not pair",
        "sin C = 4/5 and cos C = 3/5",
        "sin A = cos C = 3/5 ✓ and cos A = sin C = 4/5 ✓",
      ],
      rule: "Cross the angles and cross the names: sin A = cos C, cos A = sin C.",
    },
  },
  {
    id: "s-x4",
    source: "practice",
    prompt:
      "A student writes 'the opposite side is BC' with no other words. Why is that not yet an answer?",
    options: [
      "Because 'opposite' is meaningless until you say which angle",
      "Because BC can never be an opposite side",
      "Because the hypotenuse should be named first",
      "It is a complete answer",
    ],
    correct: "Because 'opposite' is meaningless until you say which angle",
    solution: {
      steps: [
        "'Opposite' is not a property of a side on its own.",
        "A side is opposite only in relation to a chosen angle.",
        "So naming BC means nothing until you say opposite to which angle.",
      ],
      rule: "Always name the angle: a side is only opposite or adjacent relative to one.",
    },
    mistake: {
      eyebrow: "The habit that prevents the mistake",
      title: "Always say the whole phrase",
      explanation:
        "Opposite and adjacent are relationships, not properties. The same side is " +
        "opposite one angle and adjacent to the other, so the angle has to be named.",
      workedSteps: [
        "In △PQR right-angled at Q, side QR is opposite P",
        "That same side QR is adjacent to R",
        "So 'QR is the opposite side' is true and false at the same time",
        "'QR is opposite P' is the only version that means something",
      ],
      rule: "Never say 'the opposite side'. Say 'opposite to angle ___'.",
    },
  },
  {
    id: "s-x5",
    source: "practice",
    prompt:
      "In △ABC right-angled at B, AB = 9 and BC = 12 (so AC = 15). What is tan C?",
    options: ["9/12 = 3/4", "12/9 = 4/3", "9/15 = 3/5", "15/12 = 5/4"],
    correct: "9/12 = 3/4",
    solution: {
      steps: [
        "The right angle is at B, so for angle C the hypotenuse is AC = 15.",
        "The side opposite C is AB = 9, and the side adjacent to C is BC = 12.",
        "tan C = opposite/adjacent = 9/12 = 3/4.",
      ],
      rule: "Pick the angle first, then read opposite and adjacent from it.",
    },
    mistake: {
      eyebrow: "The swap, with numbers again",
      title: "Sort the sides for C, not for A",
      explanation:
        "tan wants opposite over adjacent. From C, the side that does not touch C " +
        "is AB = 9, and C's non-hypotenuse arm is BC = 12.",
      workedSteps: [
        "In △ABC right-angled at B with AB = 8 and BC = 6",
        "From A: opposite 6, adjacent 8, so tan A = 6/8",
        "From C: opposite is AB = 8 and adjacent is BC = 6",
        "So tan C = 8/6 — the reciprocal of tan A",
      ],
      rule: "tan A and tan C are reciprocals, because the swap turns the fraction over.",
    },
  },
];

export const RATIOS_QUESTIONS: PracticeQuestion[] = [
  {
    id: "r-sin",
    source: "handbook",
    prompt: "In △ABC right-angled at B, what is sin A?",
    options: ["BC/AC", "AB/AC", "BC/AB", "AC/BC"],
    correct: "BC/AC",
    solution: {
      steps: [
        "The right angle is at B, so the hypotenuse is AC.",
        "The side opposite angle A is BC.",
        "sin A = opposite/hypotenuse = BC/AC.",
      ],
      rule: "SOH: sine is opposite over hypotenuse.",
    },
    mistake: {
      eyebrow: "SOH",
      title: "Sine is opposite over hypotenuse",
      explanation:
        "Write the template down before hunting for sides: sin = opposite ÷ " +
        "hypotenuse. Then name those two sides for the angle in the question.",
      workedSteps: [
        "In △PQR right-angled at Q, find sin P",
        "Template: sin = opposite / hypotenuse",
        "Opposite P is QR; the hypotenuse is PR",
        "So sin P = QR/PR",
      ],
      rule: "SOH — Sine = Opposite / Hypotenuse.",
    },
  },
  {
    id: "r-tan",
    source: "handbook",
    prompt: "Which of these is always equal to tan A?",
    options: ["sin A / cos A", "cos A / sin A", "sin A × cos A", "1 − sin A"],
    correct: "sin A / cos A",
    solution: {
      steps: [
        "Write both ratios over the same hypotenuse: sin A = opp/hyp and cos A = adj/hyp.",
        "Divide them: (opp/hyp) ÷ (adj/hyp) — the hypotenuse cancels.",
        "What remains is opp/adj, which is exactly tan A.",
      ],
      rule: "tan A = sin A / cos A, because the hypotenuse cancels in the division.",
    },
    mistake: {
      eyebrow: "Where tan comes from",
      title: "Divide sine by cosine and watch the hypotenuse cancel",
      explanation:
        "Both sine and cosine carry the hypotenuse underneath. Divide one by the " +
        "other and the hypotenuse disappears, leaving exactly opposite over adjacent.",
      workedSteps: [
        "sin A = opposite/hypotenuse and cos A = adjacent/hypotenuse",
        "sin A ÷ cos A = (opposite/hypotenuse) × (hypotenuse/adjacent)",
        "The hypotenuse cancels, leaving opposite/adjacent",
        "And opposite/adjacent is the definition of tan A",
      ],
      rule: "tan A = sin A / cos A, and cot A = cos A / sin A.",
    },
  },
  {
    id: "r-cos",
    source: "practice",
    prompt:
      "A right triangle has hypotenuse 13 cm and the side adjacent to angle θ is 5 cm. What is cos θ?",
    options: ["5/13", "13/5", "12/13", "5/12"],
    correct: "5/13",
    solution: {
      steps: [
        "cos θ = adjacent/hypotenuse.",
        "The adjacent side is 5 cm and the hypotenuse is 13 cm.",
        "So cos θ = 5/13.",
      ],
      rule: "CAH: cosine is adjacent over hypotenuse — no third side is needed.",
    },
    mistake: {
      eyebrow: "CAH",
      title: "Cosine is adjacent over hypotenuse, in that order",
      explanation:
        "The hypotenuse is the longest side, so it belongs underneath. If your " +
        "fraction comes out bigger than 1 for sine or cosine, it is upside down.",
      workedSteps: [
        "A right triangle has hypotenuse 10 and the side adjacent to θ is 6",
        "Template: cos = adjacent / hypotenuse",
        "cos θ = 6/10 = 3/5",
        "Sanity check: 3/5 is less than 1, as every cosine must be",
      ],
      rule: "CAH — Cosine = Adjacent / Hypotenuse. The hypotenuse goes on the bottom.",
    },
  },
];

export const SIZE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "z-double",
    source: "handbook",
    prompt: "You double every side of a right triangle. What happens to sin A?",
    options: [
      "It stays exactly the same",
      "It doubles",
      "It halves",
      "It depends which side you measure first",
    ],
    correct: "It stays exactly the same",
    solution: {
      steps: [
        "Doubling every side gives a similar triangle with the same angles.",
        "sin A is opposite ÷ hypotenuse; both lengths double, so the factor of 2 appears above and below.",
        "The 2s cancel, so sin A is unchanged.",
      ],
      rule: "A ratio depends on the angle only — a common scale factor always cancels.",
    },
    mistake: {
      eyebrow: "Ratios versus lengths",
      title: "Both parts of the fraction grew together",
      explanation:
        "A ratio only changes if the top and bottom change by different amounts. " +
        "Scaling a triangle multiplies every side by the same number, so it cancels.",
      workedSteps: [
        "Take a 3-4-5 triangle: the ratio 3/5 = 0.6",
        "Scale it by 10 to get 30-40-50",
        "The same ratio is now 30/50, which is still 0.6",
        "The 10 cancelled from the top and the bottom",
      ],
      rule: "Scaling a triangle multiplies every side by the same factor, so every ratio is unchanged.",
    },
  },
  {
    id: "z-why",
    source: "handbook",
    prompt: "Which fact proves that △PAM and △CAB give the same value of sin A?",
    options: [
      "They are similar by AA, so their sides are proportional",
      "They have the same area",
      "They have the same perimeter",
      "PM and BC are equal in length",
    ],
    correct: "They are similar by AA, so their sides are proportional",
    solution: {
      steps: [
        "Both triangles share angle A and both contain a right angle.",
        "Two equal angles make them similar by AA.",
        "Similar triangles have proportional sides, so the ratio opposite/hypotenuse is identical in both.",
      ],
      rule: "AA similarity is what makes a trigonometric ratio depend on the angle alone.",
    },
    mistake: {
      eyebrow: "Which theorem does the work",
      title: "It is similarity, and it comes from the angles",
      explanation:
        "You are never told anything about these triangles' lengths — only their " +
        "angles. Two equal angles force similarity, and similarity is what makes " +
        "the side ratios match.",
      workedSteps: [
        "△PAM and △CAB both contain angle A",
        "Both contain a right angle — at M and at B",
        "Two pairs of equal angles is the AA criterion from Chapter 6",
        "Similar triangles have corresponding sides in the same ratio",
      ],
      rule: "AA similarity ⇒ proportional sides ⇒ identical trigonometric ratios.",
    },
  },
  {
    id: "z-mean",
    source: "practice",
    prompt: "Why is it meaningful to write 'sin 30°' without mentioning any triangle?",
    options: [
      "Because every right triangle with a 30° angle gives the same value",
      "Because 30° triangles all have the same size",
      "Because 30° is half of 60°",
      "It is not meaningful — a triangle must always be given",
    ],
    correct: "Because every right triangle with a 30° angle gives the same value",
    solution: {
      steps: [
        "Draw any right triangle containing a 30° angle.",
        "Every such triangle is similar to every other, whatever its size.",
        "So opposite/hypotenuse takes one fixed value, and 'sin 30°' names that value without needing a triangle.",
      ],
      rule: "Because all right triangles with a given acute angle are similar, each ratio is a function of the angle alone.",
    },
    mistake: {
      eyebrow: "What the notation means",
      title: "The angle alone fixes the number",
      explanation:
        "If different triangles with the same angle gave different answers, 'sin 30°' " +
        "would be ambiguous and useless. The similarity argument is what rules that out.",
      workedSteps: [
        "Draw any right triangle containing a 45° angle — stamp-sized or field-sized",
        "All of them are similar to each other",
        "So all of them give the same value for opposite ÷ hypotenuse",
        "That single shared number is what 'sin 45°' names",
      ],
      rule: "The ratio belongs to the angle, not to any particular triangle.",
    },
  },
];

export const RECIP_QUESTIONS: PracticeQuestion[] = [
  {
    id: "p-cosec",
    source: "handbook",
    prompt: "In △ABC right-angled at B, what is cosec A?",
    options: ["AC/BC", "BC/AC", "AC/AB", "AB/BC"],
    correct: "AC/BC",
    solution: {
      steps: [
        "cosec A is the reciprocal of sin A.",
        "sin A = opposite/hypotenuse = BC/AC.",
        "Turning it upside down gives cosec A = AC/BC.",
      ],
      rule: "cosec is sine flipped: hypotenuse over opposite.",
    },
    mistake: {
      eyebrow: "Reciprocals",
      title: "Write sine first, then turn it over",
      explanation:
        "Do not try to remember cosec as its own rule. Build sine from SOH, then " +
        "flip the fraction — that is all cosec means.",
      workedSteps: [
        "In △PQR right-angled at Q, find cosec P",
        "First sin P = opposite/hypotenuse = QR/PR",
        "cosec P is the reciprocal of that",
        "So cosec P = PR/QR — hypotenuse over opposite",
      ],
      rule: "cosec = 1/sin = hypotenuse / opposite.",
    },
  },
  {
    id: "p-pair",
    source: "handbook",
    prompt: "Which ratio is the reciprocal of cos A?",
    options: ["sec A", "cosec A", "cot A", "tan A"],
    correct: "sec A",
    solution: {
      steps: [
        "cos A = adjacent/hypotenuse.",
        "Its reciprocal turns the fraction over: hypotenuse/adjacent.",
        "That ratio is named sec A.",
      ],
      rule: "sec is cosine flipped; cosec is sine flipped; cot is tangent flipped.",
    },
    mistake: {
      eyebrow: "The criss-cross",
      title: "The 'co' swaps sides — that is the whole trap",
      explanation:
        "You would expect cos to pair with cosec because both start with 'co'. It " +
        "does not. The prefix crosses over: cos pairs with sec, and sin pairs with " +
        "cosec.",
      workedSteps: [
        "sin  ↔  COsec   (the co appears on the flip)",
        "cos  ↔  sec     (the co disappears on the flip)",
        "tan  ↔  cot     (the co appears on the flip)",
        "Two of the three gain a 'co'; cosine is the odd one out",
      ],
      rule: "sin↔cosec, cos↔sec, tan↔cot. Never pair two names that both start with 'co'.",
    },
  },
  {
    id: "p-value",
    source: "practice",
    prompt: "If sin θ = 8/17, what is cosec θ?",
    options: ["17/8", "8/17", "17/15", "15/17"],
    correct: "17/8",
    solution: {
      steps: [
        "cosec θ is the reciprocal of sin θ.",
        "sin θ = 8/17, so cosec θ = 1 ÷ (8/17).",
        "Dividing by a fraction inverts it: cosec θ = 17/8.",
      ],
      rule: "Reciprocal pairs multiply to 1, so sin θ × cosec θ = 1 always.",
    },
    mistake: {
      eyebrow: "Flipping a value",
      title: "No Pythagoras needed — just turn it over",
      explanation:
        "Some questions need the third side. This one does not: cosec is the " +
        "reciprocal of sine, so the two numbers you already have simply change places.",
      workedSteps: [
        "Suppose sin θ = 5/13",
        "cosec θ = 1 ÷ (5/13) = 13/5",
        "The numerator and denominator swapped, nothing else",
        "Check: 13/5 is greater than 1, as every cosec must be",
      ],
      rule: "cosec is sine upside down — and it is always ≥ 1.",
    },
  },
];

export const NUMBERS_QUESTIONS: PracticeQuestion[] = [
  {
    id: "u-sin",
    source: "handbook",
    prompt: "In △ABC right-angled at B, BC = 3 cm, AB = 4 cm and AC = 5 cm. What is sin A?",
    options: ["3/5", "4/5", "3/4", "5/3"],
    correct: "3/5",
    solution: {
      steps: [
        "The right angle is at B, so AC = 5 is the hypotenuse.",
        "The side opposite angle A is BC = 3.",
        "sin A = opposite/hypotenuse = 3/5.",
      ],
      rule: "Name the hypotenuse first, then read opposite and adjacent from the chosen angle.",
    },
    mistake: {
      eyebrow: "Filling the template",
      title: "Sort the three numbers into their roles first",
      explanation:
        "Sine needs the side opposite the angle on top and the hypotenuse " +
        "underneath. Decide which number is which before writing any fraction.",
      workedSteps: [
        "A 6-8-10 triangle, right angle at B, find sin A",
        "Opposite A is BC = 6; the hypotenuse is AC = 10",
        "sin A = 6/10 = 3/5",
        "Check: less than 1, and the hypotenuse 10 was the largest number",
      ],
      rule: "Assign opposite / adjacent / hypotenuse first, divide second.",
    },
  },
  {
    id: "u-tanc",
    source: "handbook",
    prompt: "In the same 3-4-5 triangle, what is tan C?",
    options: ["4/3", "3/4", "4/5", "3/5"],
    correct: "4/3",
    solution: {
      steps: [
        "For angle C the opposite side is AB = 4 and the adjacent side is BC = 3.",
        "tan C = opposite/adjacent.",
        "So tan C = 4/3.",
      ],
      rule: "Changing the angle swaps opposite and adjacent, which inverts the tangent.",
    },
    mistake: {
      eyebrow: "New angle, new roles",
      title: "Re-sort the sides for angle C",
      explanation:
        "You cannot reuse the numbers from angle A. Angle C is at the other corner, " +
        "so opposite and adjacent have traded places — only the hypotenuse is the same.",
      workedSteps: [
        "In a 6-8-10 triangle right-angled at B, tan A = BC/AB = 6/8 = 3/4",
        "Now go to angle C: opposite C is AB = 8, adjacent to C is BC = 6",
        "tan C = 8/6 = 4/3",
        "tan A and tan C came out as reciprocals of each other",
      ],
      rule: "Switching acute angles swaps opposite and adjacent — so tan flips over.",
    },
  },
  {
    id: "u-sec",
    source: "practice",
    prompt: "In the same 3-4-5 triangle, what is sec A?",
    options: ["5/4", "4/5", "5/3", "3/5"],
    correct: "5/4",
    solution: {
      steps: [
        "sec A is the reciprocal of cos A.",
        "cos A = adjacent/hypotenuse = AB/AC = 4/5.",
        "So sec A = 5/4.",
      ],
      rule: "sec A = hypotenuse/adjacent — cosine turned upside down.",
    },
    mistake: {
      eyebrow: "Reciprocal with numbers",
      title: "Build cosine, then turn it over",
      explanation:
        "sec is 1/cos, so find cos A first — adjacent over hypotenuse — and then " +
        "swap the two numbers. It must come out greater than 1.",
      workedSteps: [
        "In a 6-8-10 triangle, cos A = adjacent/hypotenuse = 8/10 = 4/5",
        "sec A is the reciprocal of that",
        "sec A = 5/4",
        "Check: 5/4 > 1, as every secant must be",
      ],
      rule: "sec = hypotenuse / adjacent, and is never less than 1.",
    },
  },
];

export const KMETHOD_QUESTIONS: PracticeQuestion[] = [
  {
    id: "k-sin34",
    source: "handbook",
    prompt: "Exercise 8.1 Q3 — if sin A = 3/4, what is cos A?",
    options: ["√7/4", "1/4", "4/3", "3/4"],
    correct: "√7/4",
    solution: {
      steps: [
        "Use sin²A + cos²A = 1 rather than guessing a triangle.",
        "cos²A = 1 − (3/4)² = 1 − 9/16 = 7/16.",
        "cos A = √(7/16) = √7/4, taking the positive root because A is acute.",
      ],
      rule: "One ratio plus the Pythagorean identity is enough to find any other.",
    },
    mistake: {
      eyebrow: "The k-method",
      title: "Find the third side before you can find cosine",
      explanation:
        "Sine gives you the opposite and the hypotenuse. Cosine needs the adjacent " +
        "side, which you do not have yet — so Pythagoras has to come first.",
      workedSteps: [
        "Suppose sin A = 5/13, so opposite = 5k and hypotenuse = 13k",
        "Pythagoras: adjacent² = (13k)² − (5k)² = 169k² − 25k² = 144k²",
        "So adjacent = 12k",
        "cos A = adjacent/hypotenuse = 12k/13k = 12/13",
      ],
      rule: "Two sides from the given ratio, third from Pythagoras, then read off.",
    },
  },
  {
    id: "k-cot",
    source: "handbook",
    prompt: "Exercise 8.1 Q4 — given 15 cot A = 8, what is sin A?",
    options: ["15/17", "8/17", "17/15", "8/15"],
    correct: "15/17",
    solution: {
      steps: [
        "15 cot A = 8 gives cot A = 8/15, so tan A = 15/8.",
        "Take opposite = 15k and adjacent = 8k; then the hypotenuse is √(225k² + 64k²) = 17k.",
        "sin A = opposite/hypotenuse = 15k/17k = 15/17.",
      ],
      rule: "Introduce a common factor k, and it cancels out of every ratio.",
    },
    mistake: {
      eyebrow: "Rearrange first",
      title: "Turn the equation into a ratio before doing anything else",
      explanation:
        "15 cot A = 8 means cot A = 8/15. And cot is adjacent over opposite — the " +
        "other way up from tan — so 8 is the adjacent side, not the opposite one.",
      workedSteps: [
        "Suppose 5 cot A = 12, so cot A = 12/5",
        "cot = adjacent/opposite, so adjacent = 12k and opposite = 5k",
        "Pythagoras: hypotenuse² = 144k² + 25k² = 169k², so hypotenuse = 13k",
        "sin A = opposite/hypotenuse = 5k/13k = 5/13",
      ],
      rule: "cot A = adjacent / opposite. Getting cot and tan the wrong way round is the usual slip here.",
    },
  },
  {
    id: "k-ex5",
    source: "practice",
    prompt:
      "NCERT Example 5 — in △OPQ right-angled at P, OP = 7 cm and OQ − PQ = 1 cm. What is sin Q?",
    options: ["7/25", "24/25", "7/24", "25/7"],
    correct: "7/25",
    solution: {
      steps: [
        "Let PQ = x, so OQ = x + 1, and apply Pythagoras: OQ² = OP² + PQ².",
        "(x + 1)² = 7² + x² → x² + 2x + 1 = 49 + x² → 2x = 48, so x = 24.",
        "Then OQ = 25, and sin Q = opposite/hypotenuse = OP/OQ = 7/25.",
      ],
      rule: "When a difference of two sides is given, name one side x and let Pythagoras produce the equation.",
    },
    mistake: {
      eyebrow: "When Pythagoras needs algebra",
      title: "Write one side in terms of the other and let the squares cancel",
      explanation:
        "You are given a difference of two sides, not the sides themselves. Put " +
        "OQ = 1 + PQ into Pythagoras and the PQ² terms cancel, leaving a simple " +
        "equation.",
      workedSteps: [
        "Suppose the leg is 5 and hypotenuse − other leg = 1, so h = 1 + b",
        "Pythagoras: (1 + b)² = 5² + b²",
        "Expand: 1 + 2b + b² = 25 + b² — the b² cancels from both sides",
        "1 + 2b = 25, so b = 12 and h = 13; then sin of the angle facing 5 is 5/13",
      ],
      rule: "Given a sum or difference of sides, substitute and let Pythagoras cancel the squares.",
    },
  },
];

export const LIMITS_QUESTIONS: PracticeQuestion[] = [
  {
    id: "l-impossible",
    source: "handbook",
    prompt: "Can an acute angle θ have sin θ = 4/3?",
    options: [
      "No — sine can never exceed 1",
      "Yes, if the triangle is large enough",
      "Yes, but only for θ above 60°",
      "Only if the angle is measured in radians",
    ],
    correct: "No — sine can never exceed 1",
    solution: {
      steps: [
        "sin θ = opposite/hypotenuse.",
        "The hypotenuse faces the right angle and is the longest side, so opposite < hypotenuse.",
        "A smaller number over a larger one is below 1, so sin θ can never be 4/3.",
      ],
      rule: "For an acute angle, 0 < sin θ < 1 and 0 < cos θ < 1 — the hypotenuse is always the largest side.",
    },
    mistake: {
      eyebrow: "Impossible values",
      title: "Ask what the fraction would need the sides to be",
      explanation:
        "A sine bigger than 1 would need the opposite side to be longer than the " +
        "hypotenuse. The hypotenuse is the longest side of a right triangle, so no " +
        "such triangle exists — at any size.",
      workedSteps: [
        "Test the claim cos θ = 7/5",
        "cos θ = adjacent/hypotenuse, so this needs adjacent = 7 and hypotenuse = 5",
        "But the hypotenuse must be the longest side, and 5 < 7",
        "So no right triangle can do this — the claim is impossible",
      ],
      rule: "sin θ ≤ 1 and cos θ ≤ 1 for every angle, in every triangle.",
    },
  },
  {
    id: "l-sec",
    source: "handbook",
    prompt: "For an acute angle A, which is always true of sec A?",
    options: [
      "sec A ≥ 1",
      "sec A ≤ 1",
      "sec A is always between 0 and 1",
      "sec A can be any number at all",
    ],
    correct: "sec A ≥ 1",
    solution: {
      steps: [
        "sec A = hypotenuse/adjacent.",
        "The hypotenuse is the longest side, so it is at least as large as the adjacent side.",
        "A larger number over a smaller one is at least 1, so sec A ≥ 1.",
      ],
      rule: "sec A ≥ 1 and cosec A ≥ 1, because both put the longest side on top.",
    },
    mistake: {
      eyebrow: "Reciprocals of small numbers",
      title: "Turning a number below 1 over makes it bigger",
      explanation:
        "cos A is at most 1, and sec A is its reciprocal. Flipping a fraction that " +
        "is less than 1 always produces something greater than 1.",
      workedSteps: [
        "Take cos A = 4/5, which is less than 1",
        "sec A = 1 ÷ (4/5) = 5/4, which is greater than 1",
        "The same happens for any cosine below 1",
        "And sec A = hypotenuse/adjacent — longest side over a shorter one",
      ],
      rule: "cosec A ≥ 1 and sec A ≥ 1, always — they are reciprocals of numbers ≤ 1.",
    },
  },
  {
    id: "l-tan",
    source: "practice",
    prompt: "Exercise 8.1 Q11 — 'the value of tan A is always less than 1'. True or false?",
    options: [
      "False — tan 60° = √3, which is about 1.73",
      "True — all trigonometric ratios are below 1",
      "True — because the hypotenuse is the longest side",
      "It depends on the size of the triangle",
    ],
    correct: "False — tan 60° = √3, which is about 1.73",
    solution: {
      steps: [
        "tan A = opposite/adjacent, and neither of those is the hypotenuse.",
        "Nothing forces the opposite side to be shorter than the adjacent one.",
        "At 60° the opposite side is the longer of the two: tan 60° = √3 ≈ 1.73, which is more than 1.",
      ],
      rule: "Only sine and cosine are capped at 1; tangent is unbounded and runs from 0 upwards.",
    },
    mistake: {
      eyebrow: "Why tan is different",
      title: "There is no hypotenuse in tan",
      explanation:
        "The cap on sine and cosine comes entirely from having the hypotenuse " +
        "underneath. Tangent compares the two legs to each other, and either leg " +
        "can be the longer one — so there is no cap.",
      workedSteps: [
        "tan A = opposite / adjacent — no hypotenuse anywhere in it",
        "In a 3-4-5 triangle, tan of the smaller angle is 3/4, below 1",
        "For the other acute angle it is 4/3, above 1",
        "Same triangle, both sides of 1 — so no limit exists",
      ],
      rule: "tan and cot are unbounded. Only the four ratios containing the hypotenuse are limited.",
    },
  },
];

export const RECAP_QUESTIONS: PracticeQuestion[] = [
  {
    id: "c-q2",
    source: "handbook",
    prompt:
      "Exercise 8.1 Q2 — in △PQR right-angled at Q, PQ = 12 cm and PR = 13 cm. Find tan P − cot R.",
    options: ["0", "5/12", "12/5", "1"],
    correct: "0",
    solution: {
      steps: [
        "Find QR first: QR² = PR² − PQ² = 169 − 144 = 25, so QR = 5.",
        "tan P = QR/PQ = 5/12.",
        "cot R is adjacent over opposite for R, which is also QR/PQ = 5/12, so the difference is 0.",
      ],
      rule: "tan P = cot R whenever P and R are the two acute angles, so the difference is always zero.",
    },
    mistake: {
      eyebrow: "Two angles, one triangle",
      title: "Work out each ratio separately, then subtract",
      explanation:
        "Find the third side first, then build tan P and cot R independently. Do " +
        "not assume they differ just because the names look different — in a right " +
        "triangle, tan of one acute angle and cot of the other are the same fraction.",
      workedSteps: [
        "In a 6-8-10 triangle right-angled at Q with PQ = 8, QR = 6",
        "tan P = opposite P / adjacent P = QR/PQ = 6/8",
        "cot R = adjacent R / opposite R = QR/PQ = 6/8 — the identical fraction",
        "So tan P − cot R = 0",
      ],
      rule: "In a right triangle, tan of one acute angle equals cot of the other.",
    },
  },
  {
    id: "c-size",
    source: "handbook",
    prompt: "Which statement is true of the six ratios of a fixed acute angle A?",
    options: [
      "They depend only on A, not on the triangle's size",
      "They depend on both A and the triangle's size",
      "They depend only on the triangle's size",
      "They change if you rotate the triangle",
    ],
    correct: "They depend only on A, not on the triangle's size",
    solution: {
      steps: [
        "Any two right triangles containing the same acute angle A are similar by AA.",
        "Similar triangles have proportional sides, so every side ratio matches.",
        "So the six ratios depend on A alone, not on how big the triangle is.",
      ],
      rule: "The ratios are functions of the angle; size and orientation are irrelevant.",
    },
    mistake: {
      eyebrow: "The central claim of §8.2",
      title: "Similarity is what makes this work",
      explanation:
        "Any two right triangles containing the same acute angle are similar, so " +
        "their corresponding sides are proportional and every ratio matches. Without " +
        "this, writing 'sin 30°' would be meaningless.",
      workedSteps: [
        "Take any two right triangles that both contain a 40° angle",
        "Both also contain a 90° angle, so they match on two angles",
        "AA similarity makes their sides proportional",
        "Proportional sides give identical ratios, whatever the sizes",
      ],
      rule: "The ratio belongs to the angle, not to the triangle.",
    },
  },
  {
    id: "c-onegives",
    source: "practice",
    prompt: "You are told cos θ = 21/29 and nothing else. How many of the six ratios can you find?",
    options: [
      "All six — Pythagoras gives the third side",
      "Only cos θ and sec θ",
      "Three — sin, cos and tan",
      "None, without being told a side length",
    ],
    correct: "All six — Pythagoras gives the third side",
    solution: {
      steps: [
        "cos θ = 21/29 means adjacent = 21k and hypotenuse = 29k.",
        "Pythagoras gives the opposite side: √(841 − 441)k = √400 k = 20k.",
        "With all three sides known, every one of the six ratios can be written down.",
      ],
      rule: "One ratio fixes the whole triangle up to scale, so Pythagoras unlocks the other five.",
    },
    mistake: {
      eyebrow: "The k-method again",
      title: "One ratio fixes the triangle's shape completely",
      explanation:
        "A ratio gives you two sides in proportion; Pythagoras gives the third. " +
        "Once all three are known in terms of k, every ratio can be read off and " +
        "the k cancels.",
      workedSteps: [
        "Suppose cos θ = 12/13, so adjacent = 12k and hypotenuse = 13k",
        "Pythagoras: opposite² = 169k² − 144k² = 25k², so opposite = 5k",
        "All three sides are now known in terms of k",
        "So all six ratios follow, and every k cancels",
      ],
      rule: "Any one ratio + Pythagoras ⇒ all six. That is the whole point of §8.2.",
    },
  },
];

export const Q45: PracticeQuestion[] = [
  {
    id: "45-tan",
    source: "handbook",
    prompt: "In an isosceles right triangle the two legs are equal. What is tan 45°?",
    options: ["1", "1/√2", "√2", "√3"],
    correct: "1",
    solution: {
      steps: [
        "Use tan 45° = opposite / adjacent.",
        "The 45-45-90 triangle has equal legs, so tan 45° = a/a.",
        "a/a = 1.",
      ],
      rule: "Equal opposite and adjacent sides make tangent exactly 1.",
    },
    mistake: {
      eyebrow: "Read the ratio off the sides",
      explanation:
        "tan is opposite over adjacent. When those two sides are the same length, the fraction is a number over itself.",
      workedSteps: [
        "A different one: a triangle with legs 6 and 6.",
        "tan = opposite / adjacent = 6 / 6",
        "Any number divided by itself is 1.",
      ],
      rule: "Equal legs ⇒ tan = 1.",
    },
  },
  {
    id: "45-sin",
    source: "handbook",
    prompt: "With both legs equal to a, the hypotenuse is a√2. What is sin 45°?",
    options: ["1/√2", "√2", "1/2", "√3/2"],
    correct: "1/√2",
    solution: {
      steps: [
        "Use sin 45° = opposite / hypotenuse.",
        "In the isosceles right triangle, opposite = a and hypotenuse = a√2.",
        "sin 45° = a/(a√2) = 1/√2.",
      ],
      rule: "The scale a cancels, so every 45° triangle gives the same ratio.",
    },
    mistake: {
      eyebrow: "Cancel the common length",
      explanation:
        "sin is opposite over hypotenuse. Write both as multiples of the same letter and the letter cancels, leaving a pure number.",
      workedSteps: [
        "A different one: legs 5 and 5, hypotenuse 5√2.",
        "sin = 5 / (5√2)",
        "The 5s cancel, leaving 1/√2.",
      ],
      rule: "The ratio never depends on the size — only the angle.",
    },
  },
  {
    id: "45-q1ii",
    source: "handbook",
    prompt:
      "NCERT Ex 8.2 Q1(ii). Evaluate 2 tan²45° + cos²30° − sin²60°.",
    options: ["2", "1", "3", "0"],
    correct: "2",
    solution: {
      steps: [
        "Substitute tan 45° = 1, cos 30° = √3/2 and sin 60° = √3/2.",
        "2(1)² + (√3/2)² − (√3/2)² = 2 + 3/4 − 3/4.",
        "The equal squared terms cancel, leaving 2.",
      ],
      rule: "Look for equal standard-angle values before doing extra arithmetic.",
    },
    mistake: {
      eyebrow: "Look for the pair that cancels",
      explanation:
        "Two of these three terms are the same number squared, so they cancel before you compute anything. Check the table for equal values first.",
      workedSteps: [
        "A different one: 5 tan²45° + sin²30° − cos²60°.",
        "sin 30° and cos 60° are both 1/2, so those two squares cancel.",
        "Left with 5(1)² = 5.",
      ],
      rule: "cos 30° = sin 60° and sin 30° = cos 60° — spot them and save the work.",
    },
  },
  {
    id: "45-q2ii",
    source: "handbook",
    prompt: "NCERT Ex 8.2 Q2(ii). (1 − tan²45°) / (1 + tan²45°) = ?",
    options: ["0", "1", "sin 45°", "tan 90°"],
    correct: "0",
    solution: {
      steps: [
        "Substitute tan 45° = 1, so tan²45° = 1.",
        "Numerator: 1 − 1 = 0; denominator: 1 + 1 = 2.",
        "0/2 = 0.",
      ],
      rule: "A zero numerator gives zero when the denominator is non-zero.",
    },
    mistake: {
      eyebrow: "Substitute before you simplify",
      explanation:
        "Put the table value in first. If the numerator becomes 0 and the denominator does not, the whole fraction is 0.",
      workedSteps: [
        "A different one: (1 − cot²45°) / (3 + cot²45°).",
        "cot 45° = 1, so the top is 1 − 1 = 0 and the bottom is 4.",
        "0 / 4 = 0.",
      ],
      rule: "Zero on top (with a non-zero bottom) makes the whole fraction zero.",
    },
  },
  {
    id: "45-sec",
    source: "practice",
    prompt: "What is sec 45°?",
    options: ["√2", "1/√2", "2", "1"],
    correct: "√2",
    solution: {
      steps: [
        "Use sec 45° = 1/cos 45°.",
        "cos 45° = 1/√2, so sec 45° = 1 ÷ (1/√2).",
        "Flip the divisor: sec 45° = √2.",
      ],
      rule: "Secant is the reciprocal of cosine.",
    },
    mistake: {
      eyebrow: "Flip the cosine",
      explanation:
        "sec is the reciprocal of cos — turn the fraction upside down.",
      workedSteps: [
        "A different one: cos 60° = 1/2.",
        "sec 60° = 1 ÷ (1/2)",
        "Flipping 1/2 gives 2.",
      ],
      rule: "sec = 1/cos, cosec = 1/sin, cot = 1/tan.",
    },
  },
  {
    id: "45-equal",
    source: "practice",
    prompt:
      "For which acute angle is sin θ exactly equal to cos θ?",
    options: ["45°", "30°", "60°", "90°"],
    correct: "45°",
    solution: {
      steps: [
        "sin θ = opposite/hypotenuse and cos θ = adjacent/hypotenuse.",
        "For the ratios to be equal, opposite must equal adjacent.",
        "A right triangle with equal legs has both acute angles 45°, so θ = 45°.",
      ],
      rule: "sin θ = cos θ at the isosceles-right angle, 45°.",
    },
    mistake: {
      eyebrow: "Equal sides, equal ratios",
      explanation:
        "sin and cos are opposite/hyp and adjacent/hyp. They can only be equal when the opposite and adjacent sides are equal — which happens in just one right triangle shape.",
      workedSteps: [
        "Check 30°: sin 30° = 1/2 but cos 30° = √3/2. Different.",
        "Check 60°: sin 60° = √3/2 but cos 60° = 1/2. Different.",
        "Only the isosceles one has both legs the same.",
      ],
      rule: "Both legs equal ⇒ sin = cos.",
    },
  },
];

export const Q3060: PracticeQuestion[] = [
  {
    id: "3060-sin30",
    source: "handbook",
    prompt:
      "In the half-equilateral triangle the side opposite 30° is a and the hypotenuse is 2a. What is sin 30°?",
    options: ["1/2", "√3/2", "1/√3", "2"],
    correct: "1/2",
    solution: {
      steps: [
        "Use sin 30° = opposite/hypotenuse.",
        "From the half-equilateral triangle, opposite = a and hypotenuse = 2a.",
        "sin 30° = a/(2a) = 1/2.",
      ],
      rule: "The side opposite 30° is half the hypotenuse.",
    },
    mistake: {
      eyebrow: "Opposite over hypotenuse",
      explanation:
        "Write the two lengths as a fraction in that order, then cancel the common letter.",
      workedSteps: [
        "A different one: opposite 4, hypotenuse 8.",
        "sin = 4 / 8",
        "That cancels to 1/2.",
      ],
      rule: "The shortest side of a 30-60-90 triangle is always half the hypotenuse.",
    },
  },
  {
    id: "3060-cos30",
    source: "handbook",
    prompt: "What is cos 30°?",
    options: ["√3/2", "1/2", "1/√3", "√3"],
    correct: "√3/2",
    solution: {
      steps: [
        "Use cos 30° = adjacent/hypotenuse.",
        "The 30-60-90 sides are a, a√3 and 2a; adjacent to 30° is a√3.",
        "cos 30° = a√3/(2a) = √3/2.",
      ],
      rule: "At 30°, the long leg is adjacent.",
    },
    mistake: {
      eyebrow: "Adjacent over hypotenuse",
      explanation:
        "The side next to the 30° angle is the tall one — the altitude of the equilateral triangle, a√3. Divide it by the hypotenuse 2a.",
      workedSteps: [
        "The altitude came from Pythagoras: (2a)² − a² = 3a².",
        "So the adjacent side is a√3.",
        "Divide by the hypotenuse and cancel the a.",
      ],
      rule: "sin and cos of 30° and 60° swap places — the pair is always 1/2 and √3/2.",
    },
  },
  {
    id: "3060-q1i",
    source: "handbook",
    prompt: "NCERT Ex 8.2 Q1(i). Evaluate sin 60° cos 30° + sin 30° cos 60°.",
    options: ["1", "0", "1/2", "√3/2"],
    correct: "1",
    solution: {
      steps: [
        "Substitute sin 60° = √3/2, cos 30° = √3/2, sin 30° = 1/2 and cos 60° = 1/2.",
        "(√3/2)(√3/2) + (1/2)(1/2) = 3/4 + 1/4.",
        "3/4 + 1/4 = 1.",
      ],
      rule: "Complete each product before adding.",
    },
    mistake: {
      eyebrow: "Multiply each pair, then add",
      explanation:
        "Substitute all four values, multiply the two products separately, then add the fractions.",
      workedSteps: [
        "A different one: sin 45° cos 45° + sin 45° cos 45°.",
        "Each product is (1/√2)(1/√2) = 1/2.",
        "1/2 + 1/2 = 1.",
      ],
      rule: "Do both multiplications before you add — never add across the terms.",
    },
  },
  {
    id: "3060-q2i",
    source: "handbook",
    prompt:
      "NCERT Ex 8.2 Q2(i). 2 tan 30° / (1 + tan²30°) equals which of these?",
    options: ["sin 60°", "cos 60°", "tan 60°", "sin 30°"],
    correct: "sin 60°",
    solution: {
      steps: [
        "Substitute tan 30° = 1/√3.",
        "Numerator = 2/√3; denominator = 1 + 1/3 = 4/3.",
        "(2/√3) ÷ (4/3) = (2/√3)(3/4) = √3/2.",
        "√3/2 = sin 60°.",
      ],
      rule: "Reduce to a number first, then match the option in Table 8.1.",
    },
    mistake: {
      eyebrow: "Work it to a number first",
      explanation:
        "Substitute tan 30° = 1/√3, simplify to a single number, and only then look down the options for the value that matches.",
      workedSteps: [
        "The top becomes 2/√3.",
        "The bottom becomes 1 + 1/3 = 4/3.",
        "Dividing gives 3/(2√3), which tidies to √3/2 — now match that.",
      ],
      rule: "Reduce to a number, then read the table backwards.",
    },
  },
  {
    id: "3060-q2iv",
    source: "handbook",
    prompt: "NCERT Ex 8.2 Q2(iv). 2 tan 30° / (1 − tan²30°) equals?",
    options: ["tan 60°", "cos 60°", "sin 60°", "sin 30°"],
    correct: "tan 60°",
    solution: {
      steps: [
        "Substitute tan 30° = 1/√3.",
        "Numerator = 2/√3; denominator = 1 − 1/3 = 2/3.",
        "(2/√3) ÷ (2/3) = (2/√3)(3/2) = 3/√3 = √3.",
        "√3 = tan 60°.",
      ],
      rule: "The minus sign makes the denominator 2/3, not 4/3.",
    },
    mistake: {
      eyebrow: "Mind the minus sign",
      explanation:
        "This is the same shape as Q2(i) but with a minus on the bottom, so the denominator is smaller and the answer comes out larger.",
      workedSteps: [
        "Bottom: 1 − 1/3 = 2/3 (not 4/3).",
        "Top is still 2/√3.",
        "Dividing gives 3/√3 — a bigger number than before.",
      ],
      rule: "A smaller denominator makes a bigger answer — check the sign before dividing.",
    },
  },
  {
    id: "3060-tan60",
    source: "practice",
    prompt: "What is tan 60°?",
    options: ["√3", "1/√3", "√3/2", "1/2"],
    correct: "√3",
    solution: {
      steps: [
        "At the 60° corner, opposite = a√3 and adjacent = a.",
        "tan 60° = opposite/adjacent = a√3/a.",
        "Cancel a to get tan 60° = √3.",
      ],
      rule: "tan 60° is the reciprocal of tan 30°.",
    },
    mistake: {
      eyebrow: "Opposite over adjacent, from 60°",
      explanation:
        "Stand at the 60° corner. The tall altitude is now opposite you and the short half-base is adjacent.",
      workedSteps: [
        "From 60°: opposite = a√3, adjacent = a.",
        "tan = a√3 / a",
        "The a cancels.",
      ],
      rule: "tan 30° and tan 60° are reciprocals of each other.",
    },
  },
  {
    id: "3060-bigger",
    source: "practice",
    prompt: "Without a calculator, which is larger — sin 60° or sin 30°?",
    options: ["sin 60°", "sin 30°", "they are equal", "cannot be compared"],
    correct: "sin 60°",
    solution: {
      steps: [
        "Table 8.1 gives sin 60° = √3/2 and sin 30° = 1/2.",
        "Because √3 > 1, dividing both by 2 preserves √3/2 > 1/2.",
        "Therefore sin 60° is larger.",
      ],
      rule: "For angles from 0° to 90°, sine increases as the angle increases.",
    },
    mistake: {
      eyebrow: "Sine climbs with the angle",
      explanation:
        "As the angle grows from 0° to 90°, the side opposite it grows while the hypotenuse stays put — so the ratio increases the whole way.",
      workedSteps: [
        "sin 0° = 0, and sin 90° = 1.",
        "Every value in between climbs steadily.",
        "So the bigger angle always has the bigger sine.",
      ],
      rule: "sin increases from 0 to 1; cos decreases from 1 to 0.",
    },
  },
];

export const Q0090: PracticeQuestion[] = [
  {
    id: "0090-sin0",
    source: "handbook",
    prompt: "As the angle shrinks towards 0°, the opposite side vanishes. So sin 0° = ?",
    options: ["0", "1", "not defined", "∞"],
    correct: "0",
    solution: {
      steps: [
        "Use sin 0° = opposite/hypotenuse.",
        "As the angle closes to 0°, the opposite side becomes 0 while the hypotenuse remains a real length.",
        "0 divided by a non-zero length is 0, so sin 0° = 0.",
      ],
      rule: "Zero in the numerator gives zero.",
    },
    mistake: {
      eyebrow: "Watch the top of the fraction",
      explanation:
        "sin is opposite over hypotenuse. The hypotenuse stays a real length, but the opposite side shrinks away to nothing.",
      workedSteps: [
        "Opposite 0.5, hypotenuse 10 → 0.05.",
        "Opposite 0.01, hypotenuse 10 → 0.001.",
        "The fraction is heading to zero, not to something undefined.",
      ],
      rule: "Zero on top with a real number underneath is simply zero.",
    },
  },
  {
    id: "0090-cot0",
    source: "handbook",
    prompt: "NCERT Ex 8.2 Q4(v). Is it true that cot A is not defined for A = 0°?",
    options: ["True", "False", "Only for obtuse A", "It equals 0"],
    correct: "True",
    solution: {
      steps: [
        "Use cot A = cos A/sin A.",
        "At 0°, cos 0° = 1 and sin 0° = 0.",
        "cot 0° = 1/0, which is not defined; therefore the statement is True.",
      ],
      rule: "Division by zero is undefined.",
    },
    mistake: {
      eyebrow: "Check what lands on the bottom",
      explanation:
        "cot is cos over sin. Whenever the bottom of a fraction becomes zero, the value does not exist — division by zero has no meaning.",
      workedSteps: [
        "At 0°: cos 0° = 1 and sin 0° = 0.",
        "So cot 0° would be 1 ÷ 0.",
        "Nothing multiplied by 0 gives 1, so no such number exists.",
      ],
      rule: "cot 0°, cosec 0°, tan 90° and sec 90° are all undefined.",
    },
  },
  {
    id: "0090-q2iii",
    source: "handbook",
    prompt:
      "NCERT Ex 8.2 Q2(iii). sin 2A = 2 sin A is true when A equals which of these?",
    options: ["0°", "30°", "45°", "60°"],
    correct: "0°",
    solution: {
      steps: [
        "Test A = 0° in both sides of sin 2A = 2 sin A.",
        "LHS = sin(2 × 0°) = sin 0° = 0.",
        "RHS = 2 sin 0° = 2 × 0 = 0.",
        "Both sides match, so A = 0°.",
      ],
      rule: "The 2 inside the angle cannot generally be pulled outside sine.",
    },
    mistake: {
      eyebrow: "Test the options one by one",
      explanation:
        "You cannot pull the 2 out of the angle — sin is not a multiplier. Substitute each option and compare the two sides.",
      workedSteps: [
        "Try 30°: sin 60° ≈ 0.87 but 2 sin 30° = 1. Not equal.",
        "Try 45°: sin 90° = 1 but 2 sin 45° ≈ 1.41. Not equal.",
        "Only one option makes both sides come out the same.",
      ],
      rule: "sin 2A ≠ 2 sin A. The angle is part of the function, not a factor.",
    },
  },
  {
    id: "0090-cos90",
    source: "practice",
    prompt: "What is cos 90°?",
    options: ["0", "1", "not defined", "1/2"],
    correct: "0",
    solution: {
      steps: [
        "Use cos 90° = adjacent/hypotenuse.",
        "As the angle opens to 90°, the adjacent side shrinks to 0 while the hypotenuse stays non-zero.",
        "Therefore cos 90° = 0/hypotenuse = 0.",
      ],
      rule: "At 90°, the adjacent side has collapsed.",
    },
    mistake: {
      eyebrow: "Which side is shrinking now",
      explanation:
        "Pushing the angle up to 90° collapses the adjacent side instead of the opposite one — and cos is built from the adjacent side.",
      workedSteps: [
        "cos = adjacent / hypotenuse.",
        "As the angle grows, the adjacent side shortens towards nothing.",
        "So the fraction heads to zero even though sin heads to one.",
      ],
      rule: "At 90°, sin and cos have swapped their 0° values.",
    },
  },
  {
    id: "0090-tan90",
    source: "practice",
    prompt: "Why is tan 90° not defined?",
    options: [
      "cos 90° = 0, so the division is by zero",
      "sin 90° = 0, so the top is zero",
      "because 90° is not acute",
      "it equals 1 instead",
    ],
    correct: "cos 90° = 0, so the division is by zero",
    solution: {
      steps: [
        "Use tan A = sin A/cos A.",
        "At 90°, sin 90° = 1 and cos 90° = 0.",
        "tan 90° would be 1/0, so it is not defined.",
      ],
      rule: "A zero denominator, not a zero numerator, makes a ratio undefined.",
    },
    mistake: {
      eyebrow: "tan = sin / cos",
      explanation:
        "Write tan as sin over cos and check which of the two becomes zero at that angle. Only a zero on the bottom breaks it.",
      workedSteps: [
        "A different one: cot 0° = cos 0° / sin 0° = 1 / 0.",
        "The bottom is the zero, so cot 0° is undefined.",
        "Ask the same question at 90° with tan.",
      ],
      rule: "A zero on top gives 0; a zero on the bottom gives 'not defined'.",
    },
  },
  {
    id: "0090-range",
    source: "practice",
    prompt: "For an acute angle A, which statement is always true?",
    options: [
      "sin A ≤ 1",
      "sin A can exceed 1",
      "tan A ≤ 1",
      "cos A ≥ 1",
    ],
    correct: "sin A ≤ 1",
    solution: {
      steps: [
        "sin A = opposite/hypotenuse.",
        "The hypotenuse is the longest side, so opposite ≤ hypotenuse.",
        "Dividing by the positive hypotenuse gives sin A ≤ 1.",
      ],
      rule: "Sine and cosine cannot exceed 1 because the hypotenuse is their denominator.",
    },
    mistake: {
      eyebrow: "Compare against the hypotenuse",
      explanation:
        "The hypotenuse is the longest side of a right triangle, and sin puts it on the bottom of the fraction. A smaller number over a bigger one cannot exceed 1.",
      workedSteps: [
        "The opposite side is never longer than the hypotenuse.",
        "So opposite / hypotenuse is never more than 1.",
        "tan has no hypotenuse in it, so it has no such ceiling.",
      ],
      rule: "sin and cos live between 0 and 1; tan runs from 0 all the way up.",
    },
  },
];

export const QTABLE: PracticeQuestion[] = [
  {
    id: "table-ex6",
    source: "handbook",
    prompt:
      "NCERT Example 6. In △ABC right-angled at B, AB = 5 cm and ∠ACB = 30°. Find BC.",
    options: ["5√3 cm", "10 cm", "5/√3 cm", "2.5 cm"],
    correct: "5√3 cm",
    solution: {
      steps: [
        "Relative to angle C = 30°, AB = 5 is opposite and BC is adjacent.",
        "Use tan 30° = opposite/adjacent: 1/√3 = 5/BC.",
        "Cross-multiply: BC = 5√3 cm.",
      ],
      rule: "Choose the ratio containing exactly the known side and wanted side.",
    },
    mistake: {
      eyebrow: "Pick the ratio that links the two sides",
      explanation:
        "Name the known side and the wanted side relative to the given angle, then choose the ratio built from exactly those two names.",
      workedSteps: [
        "From angle C: AB is opposite, BC is adjacent.",
        "The ratio made of opposite and adjacent is tan.",
        "So set tan 30° equal to AB/BC and solve for BC.",
      ],
      rule: "Known side + wanted side → that pair names the ratio.",
    },
  },
  {
    id: "table-ex7",
    source: "handbook",
    prompt:
      "NCERT Example 7. In △PQR right-angled at Q, PQ = 3 cm and PR = 6 cm. Find ∠PRQ.",
    options: ["30°", "60°", "45°", "90°"],
    correct: "30°",
    solution: {
      steps: [
        "Relative to angle R, PQ = 3 is opposite and PR = 6 is the hypotenuse.",
        "sin R = PQ/PR = 3/6 = 1/2.",
        "Table 8.1 shows sin 30° = 1/2, so angle PRQ = 30°.",
      ],
      rule: "When a ratio is known, read Table 8.1 backwards to find the angle.",
    },
    mistake: {
      eyebrow: "Read the table backwards",
      explanation:
        "Form the ratio from the two given sides, simplify it, then find which angle in the table produces that value.",
      workedSteps: [
        "A different one: opposite 4, hypotenuse 8 gives a ratio of 1/2.",
        "Scan the sine row for 1/2.",
        "It sits under one specific angle — that is your answer.",
      ],
      rule: "Two sides → a ratio → the table gives the angle.",
    },
  },
  {
    id: "table-ex8",
    source: "handbook",
    prompt:
      "NCERT Example 8. If sin(A − B) = 1/2 and cos(A + B) = 1/2, with A > B, find A.",
    options: ["45°", "30°", "60°", "15°"],
    correct: "45°",
    solution: {
      steps: [
        "sin(A − B) = 1/2 gives A − B = 30°.",
        "cos(A + B) = 1/2 gives A + B = 60°.",
        "Add the equations: 2A = 90°.",
        "Divide by 2: A = 45°.",
      ],
      rule: "Add the two equations to cancel B.",
    },
    mistake: {
      eyebrow: "Turn each ratio into an angle first",
      explanation:
        "Convert both statements into plain angle equations using the table, then solve the pair simultaneously.",
      workedSteps: [
        "sin of something = 1/2 makes that something 30°.",
        "cos of something = 1/2 makes that something 60°.",
        "Now add the two equations to cancel B.",
      ],
      rule: "Adding the two equations removes B and leaves 2A.",
    },
  },
  {
    id: "table-q3",
    source: "handbook",
    prompt:
      "NCERT Ex 8.2 Q3. If tan(A + B) = √3 and tan(A − B) = 1/√3, with A > B, find B.",
    options: ["15°", "30°", "45°", "60°"],
    correct: "15°",
    solution: {
      steps: [
        "tan(A + B) = √3 gives A + B = 60°.",
        "tan(A − B) = 1/√3 gives A − B = 30°.",
        "Subtract the second equation from the first: 2B = 30°.",
        "Therefore B = 15°.",
      ],
      rule: "Subtract the equations to cancel A and isolate B.",
    },
    mistake: {
      eyebrow: "Same method, different ratio",
      explanation:
        "Read both tangent values off the table to get two angle equations, then subtract one from the other to isolate B.",
      workedSteps: [
        "tan of something = √3 makes that something 60°.",
        "tan of something = 1/√3 makes that something 30°.",
        "Subtracting the two equations leaves 2B.",
      ],
      rule: "Add to find A, subtract to find B.",
    },
  },
  {
    id: "table-q4i",
    source: "handbook",
    prompt:
      "NCERT Ex 8.2 Q4(i). Is sin(A + B) = sin A + sin B true or false?",
    options: ["False", "True", "True only for acute angles", "True at 45°"],
    correct: "False",
    solution: {
      steps: [
        "Test the claim with A = 30° and B = 30°.",
        "LHS = sin(A + B) = sin 60° = √3/2.",
        "RHS = sin A + sin B = 1/2 + 1/2 = 1.",
        "√3/2 ≠ 1, so the statement is False.",
      ],
      rule: "One valid counterexample is enough to disprove an identity claim.",
    },
    mistake: {
      eyebrow: "One counter-example settles it",
      explanation:
        "To disprove a claim you only need a single case where it fails. Pick easy angles and compute both sides.",
      workedSteps: [
        "Take A = B = 30°.",
        "Left side: sin 60° ≈ 0.87.",
        "Right side: 1/2 + 1/2 = 1. Different, so the claim fails.",
      ],
      rule: "sin does not distribute over addition.",
    },
  },
  {
    id: "table-q1v",
    source: "handbook",
    prompt:
      "NCERT Ex 8.2 Q1(v). In (5cos²60° + 4sec²30° − tan²45°)/(sin²30° + cos²30°), what does the denominator equal?",
    options: ["1", "0", "√3/2", "5/4"],
    correct: "1",
    solution: {
      steps: [
        "The denominator is sin²30° + cos²30°.",
        "Use the identity sin²A + cos²A = 1 for A = 30°.",
        "Therefore the denominator equals 1.",
      ],
      rule: "Sine squared plus cosine squared of the same angle is always 1.",
    },
    mistake: {
      eyebrow: "You already know this one",
      explanation:
        "sin² plus cos² of the same angle is the first identity of the next section — it is 1 for every angle, so you never have to compute it.",
      workedSteps: [
        "Check it at 45°: (1/√2)² + (1/√2)² = 1/2 + 1/2 = 1.",
        "Check it at 0°: 0² + 1² = 1.",
        "It comes out as 1 every time.",
      ],
      rule: "sin²A + cos²A = 1, always.",
    },
  },
  {
    id: "table-pattern",
    source: "practice",
    prompt:
      "Write 0, 1, 2, 3, 4 under the five angles, divide each by 4 and take the square root. Which row have you built?",
    options: ["sin A", "cos A", "tan A", "sec A"],
    correct: "sin A",
    solution: {
      steps: [
        "Apply the recipe to 0, 1, 2, 3, 4: √(0/4), √(1/4), √(2/4), √(3/4), √(4/4).",
        "This simplifies to 0, 1/2, 1/√2, √3/2, 1.",
        "Those are the sine values for 0°, 30°, 45°, 60° and 90°.",
      ],
      rule: "The square-root pattern generates the sine row.",
    },
    mistake: {
      eyebrow: "Try the first entry",
      explanation:
        "Run the recipe on the very first angle and see which row that value sits in.",
      workedSteps: [
        "At 0°: √(0/4) = 0.",
        "At 90°: √(4/4) = 1.",
        "So the row starts at 0 and ends at 1 — find the row that does that.",
      ],
      rule: "Build sin with the pattern, reverse it for cos, divide for tan.",
    },
  },
  {
    id: "table-cos-dir",
    source: "practice",
    prompt: "As θ increases from 0° to 90°, what does cos θ do?",
    options: [
      "decreases from 1 to 0",
      "increases from 0 to 1",
      "stays the same",
      "increases then decreases",
    ],
    correct: "decreases from 1 to 0",
    solution: {
      steps: [
        "Read the cosine row from 0° to 90°.",
        "The values are 1, √3/2, 1/√2, 1/2, 0.",
        "Each value is smaller than the previous one, so cosine decreases from 1 to 0.",
      ],
      rule: "Cosine is the sine row reversed.",
    },
    mistake: {
      eyebrow: "Read the row left to right",
      explanation:
        "Compare the cosine values across the table in order and watch which way they move.",
      workedSteps: [
        "cos 0° = 1, then √3/2 ≈ 0.87, then 1/√2 ≈ 0.71.",
        "Then 1/2, and finally 0.",
        "Each one is smaller than the last.",
      ],
      rule: "sin climbs, cos falls — they are mirror images.",
    },
  },
];

export const QIDENTITY: PracticeQuestion[] = [
  {
    id: "id-first",
    source: "handbook",
    prompt: "Dividing AB² + BC² = AC² by AC² gives which identity?",
    options: ["sin²A + cos²A = 1", "1 + tan²A = sec²A", "cot²A + 1 = cosec²A", "tan A = sin A / cos A"],
    correct: "sin²A + cos²A = 1",
    solution: {
      steps: [
        "Start with AB² + BC² = AC² and divide every term by AC².",
        "(AB/AC)² + (BC/AC)² = AC²/AC².",
        "AB/AC = cos A, BC/AC = sin A and AC²/AC² = 1.",
        "Therefore sin²A + cos²A = 1.",
      ],
      rule: "Dividing Pythagoras by hypotenuse² produces the sine-cosine identity.",
    },
    mistake: {
      eyebrow: "Watch what each fraction becomes",
      explanation:
        "Divide every term by the hypotenuse squared and read each resulting fraction as a ratio you already know.",
      workedSteps: [
        "AB/AC is the adjacent over the hypotenuse — that is cos A.",
        "BC/AC is the opposite over the hypotenuse — that is sin A.",
        "The right-hand side becomes AC²/AC², which is 1.",
      ],
      rule: "Divide by the hypotenuse squared and you get the sine–cosine identity.",
    },
  },
  {
    id: "id-second",
    source: "handbook",
    prompt: "Which identity comes from dividing AB² + BC² = AC² by AB²?",
    options: ["1 + tan²A = sec²A", "sin²A + cos²A = 1", "cot²A + 1 = cosec²A", "sec A = 1/cos A"],
    correct: "1 + tan²A = sec²A",
    solution: {
      steps: [
        "Divide AB² + BC² = AC² by AB², the adjacent side squared.",
        "AB²/AB² + (BC/AB)² = (AC/AB)².",
        "This becomes 1 + tan²A = sec²A.",
      ],
      rule: "Adjacent² underneath produces tan and sec.",
    },
    mistake: {
      eyebrow: "Divide by the adjacent side",
      explanation:
        "AB is the side next to angle A. Dividing by AB² turns the other two terms into ratios that have the adjacent side underneath.",
      workedSteps: [
        "BC/AB is opposite over adjacent — that is tan A.",
        "AC/AB is hypotenuse over adjacent — that is sec A.",
        "The first term becomes AB²/AB² = 1.",
      ],
      rule: "Divide by the adjacent squared to reach the tan–sec identity.",
    },
  },
  {
    id: "id-q3i",
    source: "handbook",
    prompt: "NCERT Ex 8.3 Q3(i). 9 sec²A − 9 tan²A equals?",
    options: ["9", "1", "8", "0"],
    correct: "9",
    solution: {
      steps: [
        "Factor the common 9: 9 sec²A − 9 tan²A = 9(sec²A − tan²A).",
        "From 1 + tan²A = sec²A, rearrange to sec²A − tan²A = 1.",
        "So the expression is 9 × 1 = 9.",
      ],
      rule: "Factor first to reveal sec²A − tan²A = 1.",
    },
    mistake: {
      eyebrow: "Take the common factor out first",
      explanation:
        "Both terms share a factor. Pull it out and what remains inside the bracket is one of the three identities.",
      workedSteps: [
        "A different one: 5 cosec²A − 5 cot²A.",
        "Factor the 5: 5(cosec²A − cot²A).",
        "The bracket is 1, so the answer is just the factor.",
      ],
      rule: "sec² − tan² = 1 and cosec² − cot² = 1.",
    },
  },
  {
    id: "id-q3iii",
    source: "handbook",
    prompt: "NCERT Ex 8.3 Q3(iii). (sec A + tan A)(1 − sin A) equals?",
    options: ["cos A", "sec A", "sin A", "cosec A"],
    correct: "cos A",
    solution: {
      steps: [
        "Rewrite sec A + tan A = 1/cos A + sin A/cos A = (1 + sin A)/cos A.",
        "Multiply: [(1 + sin A)(1 − sin A)]/cos A.",
        "The numerator is 1 − sin²A = cos²A.",
        "cos²A/cos A = cos A.",
      ],
      rule: "Conjugates create 1 − sin²A, which identity 1 turns into cos²A.",
    },
    mistake: {
      eyebrow: "Convert to sin and cos, then look for a² − b²",
      explanation:
        "Rewrite the bracket over a common denominator. You will get (1 + sin A)(1 − sin A), which collapses using the difference of two squares.",
      workedSteps: [
        "(1 + sin A)(1 − sin A) = 1 − sin²A.",
        "By the first identity that equals cos²A.",
        "Then cos²A divided by cos A leaves a single cos A.",
      ],
      rule: "1 − sin²A = cos²A. Spotting it saves the whole question.",
    },
  },
  {
    id: "id-q3iv",
    source: "handbook",
    prompt: "NCERT Ex 8.3 Q3(iv). (1 + tan²A)/(1 + cot²A) equals?",
    options: ["tan²A", "sec²A", "cot²A", "−1"],
    correct: "tan²A",
    solution: {
      steps: [
        "Replace 1 + tan²A with sec²A and 1 + cot²A with cosec²A.",
        "sec²A/cosec²A = (1/cos²A) ÷ (1/sin²A).",
        "Multiply by the reciprocal: sin²A/cos²A.",
        "sin²A/cos²A = tan²A.",
      ],
      rule: "Replace complete identity patterns before simplifying.",
    },
    mistake: {
      eyebrow: "Replace each bracket with its identity",
      explanation:
        "The top and the bottom are each one of the three identities in disguise. Swap them out, then turn both into sin and cos.",
      workedSteps: [
        "The top is sec²A, the bottom is cosec²A.",
        "That is (1/cos²A) ÷ (1/sin²A).",
        "Flipping the divisor gives sin²A/cos²A.",
      ],
      rule: "1 + tan² = sec² and 1 + cot² = cosec².",
    },
  },
  {
    id: "id-rearrange",
    source: "practice",
    prompt: "Which of these is NOT a correct rearrangement of sin²A + cos²A = 1?",
    options: [
      "sin A = 1 − cos A",
      "sin²A = 1 − cos²A",
      "cos²A = 1 − sin²A",
      "1 − sin²A = cos²A",
    ],
    correct: "sin A = 1 − cos A",
    solution: {
      steps: [
        "The identity rearranges safely as sin²A = 1 − cos²A.",
        "It does not allow us to remove every square separately.",
        "At A = 30°, sin A = 1/2 but 1 − cos A = 1 − √3/2, so they are unequal.",
        "Therefore sin A = 1 − cos A is not a correct rearrangement.",
      ],
      rule: "A square root does not distribute across addition or subtraction.",
    },
    mistake: {
      eyebrow: "You cannot un-square term by term",
      explanation:
        "Taking a square root of a sum is not the same as taking the root of each piece. Test any suspicious rearrangement with a real angle.",
      workedSteps: [
        "Try A = 30°: sin 30° = 1/2.",
        "But 1 − cos 30° = 1 − √3/2 ≈ 0.134.",
        "Those are different, so that rearrangement is wrong.",
      ],
      rule: "√(x² + y²) ≠ x + y. Move the squares, then root the whole side.",
    },
  },
  {
    id: "id-factored",
    source: "practice",
    prompt: "Since sec²A − tan²A = 1, what is (sec A − tan A)(sec A + tan A)?",
    options: ["1", "0", "sec A", "2 tan A"],
    correct: "1",
    solution: {
      steps: [
        "Use (a − b)(a + b) = a² − b².",
        "(sec A − tan A)(sec A + tan A) = sec²A − tan²A.",
        "The identity 1 + tan²A = sec²A gives sec²A − tan²A = 1.",
      ],
      rule: "The conjugate pair sec A ± tan A multiplies to 1.",
    },
    mistake: {
      eyebrow: "Read the identity backwards",
      explanation:
        "The difference of two squares says a² − b² factors as (a − b)(a + b). Here a² − b² is already known to be 1.",
      workedSteps: [
        "Expand (sec A − tan A)(sec A + tan A).",
        "The middle terms cancel, leaving sec²A − tan²A.",
        "And that is exactly the identity's value.",
      ],
      rule: "sec − tan and sec + tan are reciprocals — the secret weapon in hard proofs.",
    },
  },
];

export const QPROVING: PracticeQuestion[] = [
  {
    id: "prove-side",
    source: "handbook",
    prompt: "When proving an identity, what are you allowed to do?",
    options: [
      "work on one side until it becomes the other",
      "move terms across the equals sign",
      "square both sides freely",
      "substitute a convenient angle",
    ],
    correct: "work on one side until it becomes the other",
    solution: {
      steps: [
        "An identity proof must establish that the two sides are equal; it cannot assume that equality first.",
        "Choose the more complicated side and rewrite only that side using known identities and algebra.",
        "Stop when it becomes exactly the untouched other side.",
      ],
      rule: "In a proof, transform one side only; never move terms across the equals sign.",
    },
    mistake: {
      eyebrow: "A proof is not an equation to solve",
      explanation:
        "Moving terms across the equals sign assumes the two sides are already equal — which is the very thing you were asked to show.",
      workedSteps: [
        "Solving 2x = 6 assumes the equation holds and finds x.",
        "A proof has no unknown to find; it must hold for every angle.",
        "So transform one side only, and let it turn into the other.",
      ],
      rule: "Start from the messier side and work forwards.",
    },
  },
  {
    id: "prove-first-move",
    source: "handbook",
    prompt:
      "A proof mixes tan, cot, sec and cosec. What is the reliable opening move?",
    options: [
      "convert everything to sin and cos",
      "square both sides",
      "substitute A = 45°",
      "multiply out every bracket",
    ],
    correct: "convert everything to sin and cos",
    solution: {
      steps: [
        "Rewrite tan = sin/cos and cot = cos/sin.",
        "Rewrite sec = 1/cos and cosec = 1/sin.",
        "Now every term uses only sin and cos, so common denominators and factors become visible.",
      ],
      rule: "Mixed trig ratios become manageable when translated into one common language.",
    },
    mistake: {
      eyebrow: "Get everything into one language",
      explanation:
        "Four different ratios cannot be combined directly. Rewriting them all with sin and cos gives common denominators to work with.",
      workedSteps: [
        "tan = sin/cos and cot = cos/sin.",
        "sec = 1/cos and cosec = 1/sin.",
        "Now every term is built from the same two things.",
      ],
      rule: "Mixed ratios → convert to sin and cos first.",
    },
  },
  {
    id: "prove-ex10",
    source: "handbook",
    prompt:
      "NCERT Example 10. In proving sec A(1 − sin A)(sec A + tan A) = 1, the step (1 − sin A)(1 + sin A) becomes what?",
    options: ["1 − sin²A", "1 + sin²A", "1 − 2 sin A", "cos A"],
    correct: "1 − sin²A",
    solution: {
      steps: [
        "Recognise (1 − sin A)(1 + sin A) as conjugates.",
        "Use (a − b)(a + b) = a² − b² with a = 1 and b = sin A.",
        "The product is 1² − sin²A = 1 − sin²A.",
      ],
      rule: "Conjugates multiply to a difference of squares.",
    },
    mistake: {
      eyebrow: "Difference of two squares",
      explanation:
        "A bracket of the form (a − b)(a + b) always multiplies out to a² − b², with the middle terms cancelling.",
      workedSteps: [
        "A different one: (1 − cos A)(1 + cos A).",
        "The two middle terms cancel out.",
        "You are left with 1 − cos²A.",
      ],
      rule: "(a − b)(a + b) = a² − b², then use an identity on the result.",
    },
  },
  {
    id: "prove-ex11",
    source: "handbook",
    prompt:
      "NCERT Example 11. Proving (cot A − cos A)/(cot A + cos A) = (cosec A − 1)/(cosec A + 1) works best by doing what after converting to sin and cos?",
    options: [
      "factor cos A out of the top and bottom",
      "expand every bracket fully",
      "square both sides",
      "substitute a value for A",
    ],
    correct: "factor cos A out of the top and bottom",
    solution: {
      steps: [
        "Replace cot A with cos A/sin A in the numerator and denominator.",
        "Numerator = cos A(1/sin A − 1); denominator = cos A(1/sin A + 1).",
        "Factor cos A from both, then cancel the common factor.",
        "The remaining 1/sin A becomes cosec A, matching the RHS.",
      ],
      rule: "Factor a shared trig factor before expanding.",
    },
    mistake: {
      eyebrow: "Factor before you expand",
      explanation:
        "Both the numerator and the denominator contain the same factor. Pulling it out lets it cancel, and what remains is already the answer.",
      workedSteps: [
        "cot A − cos A becomes cos A(1/sin A − 1).",
        "cot A + cos A becomes cos A(1/sin A + 1).",
        "The cos A cancels top and bottom.",
      ],
      rule: "Look for a common factor before multiplying anything out.",
    },
  },
  {
    id: "prove-q4i",
    source: "handbook",
    prompt:
      "NCERT Ex 8.3 Q4(i). In proving (cosec θ − cot θ)² = (1 − cos θ)/(1 + cos θ), what does sin²θ become?",
    options: [
      "(1 − cos θ)(1 + cos θ)",
      "(1 − cos θ)²",
      "1 + cos²θ",
      "2(1 − cos θ)",
    ],
    correct: "(1 − cos θ)(1 + cos θ)",
    solution: {
      steps: [
        "Use sin²θ + cos²θ = 1 to write sin²θ = 1 − cos²θ.",
        "Recognise 1 − cos²θ as a difference of squares.",
        "Factor it: 1 − cos²θ = (1 − cos θ)(1 + cos θ).",
      ],
      rule: "Identity first, then difference-of-squares factorisation.",
    },
    mistake: {
      eyebrow: "Identity, then factorise",
      explanation:
        "Replace sin²θ with 1 − cos²θ, then recognise that as a difference of two squares and split it into two brackets.",
      workedSteps: [
        "sin²θ = 1 − cos²θ by the first identity.",
        "1 − cos²θ is of the form a² − b² with a = 1.",
        "So it splits into two brackets that can cancel with the top.",
      ],
      rule: "Turning sin² into a product is what lets the fraction cancel.",
    },
  },
  {
    id: "prove-conjugate",
    source: "practice",
    prompt:
      "To simplify 1/(1 + sin A), what do you multiply the top and bottom by?",
    options: ["(1 − sin A)", "(1 + sin A)", "cos A", "sec A"],
    correct: "(1 − sin A)",
    solution: {
      steps: [
        "The denominator contains 1 + sin A.",
        "Choose its conjugate by keeping the terms and flipping the sign: 1 − sin A.",
        "(1 + sin A)(1 − sin A) = 1 − sin²A = cos²A.",
      ],
      rule: "Multiply by the sign-flipped conjugate to create an identity.",
    },
    mistake: {
      eyebrow: "Use the conjugate",
      explanation:
        "Multiplying by the same bracket with the sign flipped turns the denominator into a difference of two squares, which an identity then simplifies.",
      workedSteps: [
        "(1 + sin A)(1 − sin A) = 1 − sin²A.",
        "That is cos²A by the first identity.",
        "A single squared term is far easier to work with than a sum.",
      ],
      rule: "Flip the sign to build a² − b², then apply an identity.",
    },
  },
  {
    id: "prove-cube",
    source: "practice",
    prompt: "Which factorisation cracks Ex 8.3 Q4(iii), where sin³θ − cos³θ appears?",
    options: [
      "a³ − b³ = (a − b)(a² + ab + b²)",
      "a³ − b³ = (a − b)³",
      "a³ − b³ = (a − b)(a + b)",
      "a³ − b³ = a²  − b²",
    ],
    correct: "a³ − b³ = (a − b)(a² + ab + b²)",
    solution: {
      steps: [
        "Match sin³θ − cos³θ with a³ − b³ using a = sin θ and b = cos θ.",
        "Apply a³ − b³ = (a − b)(a² + ab + b²).",
        "This gives (sin θ − cos θ)(sin²θ + sin θ cos θ + cos²θ).",
        "Inside the second bracket, sin²θ + cos²θ can then become 1.",
      ],
      rule: "A difference of cubes needs a two-term factor and a three-term factor.",
    },
    mistake: {
      eyebrow: "Cubes need the three-term bracket",
      explanation:
        "The difference of two cubes splits into a two-term bracket times a three-term one. The three-term bracket then hides sin² + cos².",
      workedSteps: [
        "Here a = sin θ and b = cos θ.",
        "The second bracket is sin²θ + sin θ cos θ + cos²θ.",
        "The first and last of those are 1, by the identity.",
      ],
      rule: "Spotting a³ − b³ is the step examiners look for in that question.",
    },
  },
];

export const QSUMMARY: PracticeQuestion[] = [
  {
    id: "sum-c13",
    source: "practice",
    prompt: "Evaluate sin 30° cos 60° + cos 30° sin 60°.",
    options: ["1", "0", "1/2", "√3/2"],
    correct: "1",
    solution: {
      steps: [
        "Substitute sin 30° = 1/2, cos 60° = 1/2, cos 30° = √3/2 and sin 60° = √3/2.",
        "(1/2)(1/2) + (√3/2)(√3/2) = 1/4 + 3/4.",
        "1/4 + 3/4 = 1.",
      ],
      rule: "Substitute, finish both products, then add.",
    },
    mistake: {
      eyebrow: "Two products, then one sum",
      explanation:
        "Substitute all four table values, complete each multiplication, then add the two results.",
      workedSteps: [
        "A different one: sin 45° cos 45° + cos 45° sin 45°.",
        "Each product is 1/2.",
        "Adding gives 1.",
      ],
      rule: "Finish both multiplications before adding.",
    },
  },
  {
    id: "sum-c14",
    source: "practice",
    prompt: "Evaluate 3 − 2 sin²30°.",
    options: ["2.5", "2", "1", "3"],
    correct: "2.5",
    solution: {
      steps: [
        "Substitute sin 30° = 1/2.",
        "Square first: sin²30° = (1/2)² = 1/4.",
        "3 − 2(1/4) = 3 − 1/2 = 5/2 = 2.5.",
      ],
      rule: "Follow order of operations: square, multiply, then subtract.",
    },
    mistake: {
      eyebrow: "Square before you multiply",
      explanation:
        "Order matters: square the ratio first, then multiply by the 2, then subtract from 3.",
      workedSteps: [
        "A different one: 5 − 4 sin²30°.",
        "sin²30° = (1/2)² = 1/4.",
        "So 4 × 1/4 = 1, and 5 − 1 = 4.",
      ],
      rule: "Powers first, then multiplication, then subtraction.",
    },
  },
  {
    id: "sum-b7",
    source: "practice",
    prompt: "True or false: there is an acute angle A with cos A = 8/7.",
    options: ["False", "True", "Only at 60°", "Only at 0°"],
    correct: "False",
    solution: {
      steps: [
        "cos A = adjacent/hypotenuse for an acute right triangle.",
        "The adjacent side cannot be longer than the hypotenuse, so 0 < cos A < 1.",
        "8/7 > 1, so no acute angle can have cos A = 8/7.",
        "Therefore the statement is False.",
      ],
      rule: "Sine and cosine never exceed 1.",
    },
    mistake: {
      eyebrow: "Check it against the ceiling",
      explanation:
        "cos is the adjacent side over the hypotenuse, and the hypotenuse is always the longest side — so the fraction can never exceed 1.",
      workedSteps: [
        "8/7 is greater than 1.",
        "That would need the adjacent side to be longer than the hypotenuse.",
        "In a right triangle that is impossible.",
      ],
      rule: "sin A ≤ 1 and cos A ≤ 1, always.",
    },
  },
  {
    id: "sum-b8",
    source: "practice",
    prompt: "True or false: for every acute angle A, sec A ≥ 1.",
    options: ["True", "False", "Only for A > 45°", "Only at 0°"],
    correct: "True",
    solution: {
      steps: [
        "For an acute angle, 0 < cos A < 1.",
        "sec A = 1/cos A.",
        "The reciprocal of a positive number at most 1 is at least 1, so sec A ≥ 1.",
        "Therefore the statement is True.",
      ],
      rule: "Secant and cosecant are never below 1 where they are defined.",
    },
    mistake: {
      eyebrow: "Flip a number that is at most 1",
      explanation:
        "sec is the reciprocal of cos, and cos of an acute angle sits between 0 and 1. Flipping a fraction below 1 gives something above 1.",
      workedSteps: [
        "cos 60° = 1/2, so sec 60° = 2.",
        "cos 0° = 1, so sec 0° = 1.",
        "The smaller the cosine, the larger the secant.",
      ],
      rule: "sec and cosec are never less than 1.",
    },
  },
  {
    id: "sum-d21",
    source: "practice",
    prompt: "Simplify sec²A − tan²A.",
    options: ["1", "0", "sec A", "tan²A"],
    correct: "1",
    solution: {
      steps: [
        "Start from 1 + tan²A = sec²A.",
        "Subtract tan²A from both sides.",
        "sec²A − tan²A = 1.",
      ],
      rule: "Recognise identities even when their terms are rearranged.",
    },
    mistake: {
      eyebrow: "That is an identity, rearranged",
      explanation:
        "The second identity says 1 + tan²A = sec²A. Move the tan² term across and read what is left.",
      workedSteps: [
        "Start from 1 + tan²A = sec²A.",
        "Subtract tan²A from both sides.",
        "What remains on the left is just 1.",
      ],
      rule: "sec² − tan² = 1 and cosec² − cot² = 1.",
    },
  },
  {
    id: "sum-c18",
    source: "practice",
    prompt:
      "If sin(A + B) = 1 and sin(A − B) = 1/2, with A and B acute and A > B, find A.",
    options: ["60°", "45°", "30°", "75°"],
    correct: "60°",
    solution: {
      steps: [
        "sin(A + B) = 1 gives A + B = 90°.",
        "sin(A − B) = 1/2 and A > B give A − B = 30°.",
        "Add the equations: 2A = 120°.",
        "Divide by 2: A = 60°.",
      ],
      rule: "Convert ratios to angle equations, then add to cancel B.",
    },
    mistake: {
      eyebrow: "Two equations, one unknown at a time",
      explanation:
        "Turn each sine value into an angle using the table, then add the two equations so that B cancels.",
      workedSteps: [
        "sin of something = 1 makes that something 90°.",
        "sin of something = 1/2 makes that something 30°.",
        "Adding the two gives 2A, so halve the result.",
      ],
      rule: "Add to isolate A, subtract to isolate B.",
    },
  },
  {
    id: "sum-count",
    source: "practice",
    prompt:
      "If exactly one trigonometric ratio of an acute angle is known, how many of the other five can you find?",
    options: ["all five", "two", "three", "none without the angle"],
    correct: "all five",
    solution: {
      steps: [
        "One ratio fixes the relative lengths of two sides of the right triangle.",
        "Use Pythagoras to find the third side in the same scale.",
        "With all three side lengths known, read sin, cos and tan and then flip them for cosec, sec and cot.",
        "So all five remaining ratios can be found.",
      ],
      rule: "One trig ratio fixes the triangle's shape and therefore all six ratios.",
    },
    mistake: {
      eyebrow: "One ratio fixes the whole triangle's shape",
      explanation:
        "A single ratio pins down the shape of the right triangle. From there Pythagoras gives the third side, and every other ratio follows.",
      workedSteps: [
        "Say tan A = 3/4. Draw legs 3 and 4.",
        "Pythagoras gives the hypotenuse as 5.",
        "With all three sides known, every ratio can be read off.",
      ],
      rule: "One ratio ⇒ all six. Use the k-method or the identities.",
    },
  },
];

/* ── lookup ──────────────────────────────────────────────────────────────── */

export const CHAPTER8 = {
  subject: "mathematics",
  chapterSlug: "introduction-to-trigonometry",
} as const;

const TOPIC_QUESTIONS: Record<string, PracticeQuestion[]> = {
  why: WHY_QUESTIONS,
  hidden: HIDDEN_QUESTIONS,
  naming: NAMING_QUESTIONS,
  swap: SWAP_QUESTIONS,
  ratios: RATIOS_QUESTIONS,
  size: SIZE_QUESTIONS,
  recip: RECIP_QUESTIONS,
  numbers: NUMBERS_QUESTIONS,
  kmethod: KMETHOD_QUESTIONS,
  limits: LIMITS_QUESTIONS,
  recap: RECAP_QUESTIONS,
  ratios45: Q45,
  ratios3060: Q3060,
  ratios0090: Q0090,
  table81: QTABLE,
  identity: QIDENTITY,
  proving: QPROVING,
  summary: QSUMMARY,
};

export type BankEntry = {
  question: PracticeQuestion;
  topicSlug: string;
  /** How many questions the topic holds, so a rollup knows its denominator. */
  topicTotal: number;
};

/** questionId -> everything the grader needs. Built once at module load. */
const BY_ID = new Map<string, BankEntry>();
for (const [topicSlug, questions] of Object.entries(TOPIC_QUESTIONS)) {
  for (const question of questions) {
    BY_ID.set(question.id, { question, topicSlug, topicTotal: questions.length });
  }
}

export function lookupQuestion(questionId: string): BankEntry | undefined {
  return BY_ID.get(questionId);
}

/** Topics in the chapter, so chapter_progress knows ITS denominator. */
export const TOPIC_COUNT = Object.keys(TOPIC_QUESTIONS).length;

export const QUESTION_COUNT = BY_ID.size;
