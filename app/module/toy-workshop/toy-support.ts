import type { LessonHints } from "../../components/learning/LearningSupport";

export const toyHints: LessonHints[] = [
  {
    title: "Change the camera, not the toy",
    prompt: "A view is the flat picture a camera would capture from one direction.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Point to the camera",
        body: "Ask where the camera is: above, in front, or beside the object.",
      },
      {
        label: "Worked example",
        title: "Look from above",
        body: "From the top, height disappears. Only the spaces covered on the floor remain.",
        example: "Two cubes stacked in one spot still cover one top-view square.",
      },
      {
        label: "Rule",
        title: "Flatten along the viewing direction",
        body: "Keep width and depth for a top view, width and height for a front view, and depth and height for a side view.",
      },
    ],
  },
  {
    title: "Read the colour footprint",
    prompt: "Match every area visible from above before choosing an option.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Find the long grey roof",
        body: "The grey part stretches down the full left side of the top view.",
      },
      {
        label: "Worked example",
        title: "Place the remaining colours",
        body: "White sits at the upper right, while black sits directly below it.",
        example: "Grey column | white over black",
      },
      {
        label: "Rule",
        title: "Check position and colour",
        body: "A correct view must contain the right pieces in the right relative positions. Rotation is not allowed.",
      },
    ],
  },
  {
    title: "Count what you cannot see",
    prompt: "A solid keeps its faces and corners even when the camera hides them.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Start with visible faces",
        body: "Count the five faces you can point to in the drawing.",
      },
      {
        label: "Worked example",
        title: "Add the hidden sides",
        body: "The stepped solid also has a left face, a bottom face, and a back face.",
        example: "5 visible + 3 hidden = 8 faces",
      },
      {
        label: "Rule",
        title: "Whole equals visible plus hidden",
        body: "For corner dots, use the same idea: total corners minus visible dots gives hidden dots.",
      },
    ],
  },
  {
    title: "Sort first, count second",
    prompt: "The yellow bucket rule is greater than five edges, not exactly five.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Compare with five",
        body: "Six, seven, eight and more go to yellow. Five and fewer go to white.",
      },
      {
        label: "Worked example",
        title: "A hexagon has six",
        body: "A hexagon goes into yellow because 6 is greater than 5. It also counts for the exactly-six question.",
      },
      {
        label: "Rule",
        title: "Filter, then refine",
        body: "First keep every shape that passes the bucket rule. Then count only the shapes that pass the second rule.",
      },
    ],
  },
  {
    title: "Keep every box facing the same way",
    prompt: "Compare coloured faces by their names: top, bottom, left, right, front and back.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Do not rotate",
        body: "A grey top cannot be turned into a grey side. The direction labels stay fixed.",
      },
      {
        label: "Worked example",
        title: "Make a face signature",
        body: "Write each small box as a set, such as top + right or bottom + back.",
        example: "Look for the one signature absent from the large box.",
      },
      {
        label: "Rule",
        title: "Match all required faces",
        body: "An option belongs only if one small box has every coloured face in exactly those directions.",
      },
    ],
  },
  {
    title: "Find the repeating unit",
    prompt: "Do not guess one object at a time. Find the smallest group that repeats.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Group the first three",
        body: "The conveyor repeats cone, cube, sphere.",
      },
      {
        label: "Worked example",
        title: "Restart after sphere",
        body: "After every sphere, the next object is a cone. After that cone and cube comes a sphere.",
        example: "cone → cube → sphere | cone → cube → sphere",
      },
      {
        label: "Rule",
        title: "Copy the whole unit",
        body: "Once the repeating unit is known, label positions inside the unit and continue the cycle.",
      },
    ],
  },
  {
    title: "Match a solid to its shadow",
    prompt: "A top view shows the outline seen from directly above.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Ignore height",
        body: "Ask what outline touches the table when viewed from above.",
      },
      {
        label: "Worked example",
        title: "Cone versus cylinder",
        body: "Both a cone and cylinder look circular from the top. A triangle is a side view of a cone, not its top view.",
      },
      {
        label: "Rule",
        title: "View direction decides the outline",
        body: "The same 3D object can produce different 2D views. Never mix top and side views.",
      },
    ],
  },
  {
    title: "Check both ends of every edge",
    prompt: "An edge counts only when the colour at both corners matches.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Trace one edge at a time",
        body: "Touch the two end dots. If their colours are the same, mark the edge.",
      },
      {
        label: "Worked example",
        title: "Use a checklist",
        body: "Scan top edges, vertical edges, then bottom edges so none are counted twice.",
        example: "top → vertical → bottom",
      },
      {
        label: "Rule",
        title: "One edge, two endpoints",
        body: "Count an edge once only, and only after comparing both endpoint colours.",
      },
    ],
  },
  {
    title: "Build before you compare",
    prompt: "Combine the pieces in stages and keep track of every block.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Count the blocks",
        body: "The final object must contain all blocks from all three pieces.",
      },
      {
        label: "Worked example",
        title: "Join the first two pieces",
        body: "Their combined shape fits more than one option, so the third piece is needed to decide.",
        example: "piece 1 + piece 2 → partial object; then add piece 3",
      },
      {
        label: "Rule",
        title: "No missing and no extra blocks",
        body: "A valid assembly preserves the number of blocks and their touching relationships.",
      },
    ],
  },
  {
    title: "Turn words into certain facts",
    prompt: "Fill only the results forced by the clues before choosing a winner.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Mark known sets",
        body: "A won set 1. B won sets 2 and 3.",
      },
      {
        label: "Worked example",
        title: "Use the even-number clue",
        body: "B did not lose any even-numbered set, and sets cannot draw, so B also won set 4.",
        example: "B wins 2, 3 and 4 → three set wins",
      },
      {
        label: "Rule",
        title: "Three wins decide the match",
        body: "When a conclusion is already forced, unknown information does not change it.",
      },
    ],
  },
];
