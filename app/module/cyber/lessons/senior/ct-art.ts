const desk = {
  src: "/cyber-missions/class-11/ct-scholarship-desk.webp",
  alt: "Asha sorts anonymous enquiry cards into trays while Kabir checks a laptop record table, with a teacher available in the school library.",
  caption: "The team separates intake, rule checking, teacher review and communication before automating the workflow.",
};
const workbench = {
  src: "/cyber-missions/class-11/ct-logic-workbench.webp",
  alt: "Asha arranges branching flowchart tiles while Kabir points to a highlighted trace-table row on a laptop at a school logic workbench.",
  caption: "A small test case can expose a wrong branch; the corrected workflow must be traced and tested again.",
};
export const ctArtwork: Record<string, typeof desk> = {
  "decompose-the-scholarship-desk": desk,
  "model-only-what-matters": desk,
  "make-the-rules-explicit": workbench,
  "trace-and-debug-a-decision": workbench,
  "search-and-sort-with-purpose": workbench,
  "reuse-a-reliable-step": desk,
  "test-the-boundaries": workbench,
  "algorithm-review-board": desk,
};
