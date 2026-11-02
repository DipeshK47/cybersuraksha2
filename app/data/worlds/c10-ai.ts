import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class10AiWorlds: World[] = [
  {
    slug: "class10-ai-baseline-comparison", scene: "lab", layout: "two",
    label: t("Workshop notices · a simple rule vs the supplied model", "वर्कशॉप सूचनाएँ · सरल नियम बनाम दिया हुआ मॉडल"),
    art: [
      { k: "table", id: "cards", at: "a", title: t("Cards A–F (positive = workshop notice)", "कार्ड A–F (सकारात्मक = वर्कशॉप सूचना)"), icon: "list", cols: [t("Card", "कार्ड"), t("Checked", "जाँचा"), t("Baseline rule", "आधार-नियम"), t("Model", "मॉडल")], rows: [{ id: "A", c: ["A", "yes", "yes", "yes"] }, { id: "B", c: ["B", "no", "yes", "no"] }, { id: "C", c: ["C", "yes", "no", "yes"] }, { id: "D", c: ["D", "no", "no", "no"] }, { id: "E", c: ["E", "yes", "yes", "no"] }, { id: "F", c: ["F", "no", "no", "no"] }], upTo: 6 },
      { k: "chart", id: "errs", at: "b", hide: true, look: "bars", max: 4, title: t("Errors on the fixed pack", "तय पैक पर ग़लतियाँ"), icon: "bars", bars: [{ id: "rule", t: t("Rule: B, C wrong", "नियम: B, C ग़लत"), v: 2, tone: "warn" }, { id: "model", t: t("Model: E wrong", "मॉडल: E ग़लत"), v: 1, tone: "info" }] },
    ],
    sc: [
      { cards: { focus: true, note: t("Purpose: help a volunteer find workshop notices — a person checks before anything is posted", "उद्देश्य: स्वयंसेवक को वर्कशॉप सूचनाएँ ढूँढने में मदद — कुछ पोस्ट करने से पहले व्यक्ति जाँचता है"), noteTone: "info" } },
      { cards: { cell: { "B:2": "risk", "C:2": "risk" }, note: t("Baseline: positive whenever the text contains 'workshop' — wrong on B and C", "आधार: जब भी पाठ में 'workshop' हो तब सकारात्मक — B और C पर ग़लत"), noteTone: "warn" } },
      { cards: { cell: { "B:2": "risk", "C:2": "risk", "E:3": "risk" }, note: t("The model's disagreement on E: it improves the total yet introduces a mistake the simple rule avoided", "E पर मॉडल का अमेल: कुल सुधरता है पर वह ग़लती आती है जो सरल नियम में नहीं थी"), noteTone: "warn" }, errs: { hide: false } },
      { cards: { note: t("Which comparison can support the bulletin decision?", "कौन-सी तुलना बुलेटिन के फ़ैसले का समर्थन कर सकती है?"), noteTone: "info" } },
      { cards: { cell: { "B:2": "risk", "C:2": "risk", "E:3": "risk" }, note: t("Same cards, same labels, same review conditions — 2 errors vs 1: a narrow comparison on this pack only", "वही कार्ड, वही लेबल, वही समीक्षा-शर्तें — 2 बनाम 1 ग़लतियाँ: सिर्फ़ इस पैक पर सीमित तुलना"), noteTone: "ok" }, errs: { hide: false, focus: true } },
      { errs: { focus: true } },
    ],
    out: {
      same: { errs: { hide: false, note: t("Same cards, labels and review conditions", "वही कार्ड, लेबल और समीक्षा-शर्तें"), noteTone: "ok" } },
      easy: { errs: { hide: false, bars: [{ id: "rule", t: t("Rule: hard cards", "नियम: कठिन कार्ड"), v: 2, tone: "warn" }, { id: "model", t: t("Model: easy cards", "मॉडल: आसान कार्ड"), v: 0, tone: "risk" }], note: t("Easier cards for the model isn't a fair comparison", "मॉडल को आसान कार्ड देना निष्पक्ष तुलना नहीं"), noteTone: "risk" } },
      rename: { errs: { hide: false, note: t("Predicting popularity is a different task, so the comparison no longer answers the bulletin question", "लोकप्रियता का अनुमान दूसरा काम है, इसलिए तुलना बुलेटिन के सवाल का जवाब नहीं रहती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-ai-hidden-answer", scene: "lab", layout: "two",
    label: t("Display-card repair classifier · what exists at prediction time?", "डिस्प्ले-कार्ड रिपेयर क्लासिफ़ायर · अनुमान के समय क्या मौजूद है?"),
    art: [
      { k: "table", id: "fields", at: "a", title: t("Proposed table fields", "प्रस्तावित तालिका के फ़ील्ड"), icon: "clock", cols: [t("Field", "फ़ील्ड"), t("Known before inspection?", "निरीक्षण से पहले ज्ञात?")], rows: [{ id: "f1", c: ["crack_length", "✓"] }, { id: "f2", c: ["age_years", "✓"] }, { id: "f3", c: ["repair_completed", "✗ entered after"] }] },
      { k: "table", id: "groups", at: "b", hide: true, title: t("Photographs by source group", "स्रोत समूह के हिसाब से तस्वीरें"), icon: "image", cols: [t("Group", "समूह"), t("Photos", "तस्वीरें"), t("Partition", "विभाजन")], rows: [{ id: "g1", c: ["Cedar", "4", "?"] }, { id: "g2", c: ["Birch", "4", "?"] }, { id: "g3", c: ["Maple", "4", "?"] }] },
    ],
    sc: [
      { fields: { focus: true, note: t("Predictions happen before the inspector opens the card — which measurements could actually reach the model?", "अनुमान निरीक्षक के कार्ड खोलने से पहले होते हैं — कौन-से माप सचमुच मॉडल तक पहुँच सकते हैं?"), noteTone: "info" } },
      { fields: { mark: { f3: "risk", f1: "ok", f2: "ok" }, note: t("repair_completed nearly reveals the answer but can't exist at prediction time — the score would rest on unavailable information", "repair_completed लगभग उत्तर बता देता है पर अनुमान के समय हो ही नहीं सकता — स्कोर अनुपलब्ध जानकारी पर टिकेगा"), noteTone: "risk" } },
      { groups: { hide: false, focus: true, mark: { g1: "warn", g2: "warn", g3: "warn" }, note: t("Related photos split across partitions leak: a crop or a new filename isn't an independent example", "संबंधित तस्वीरें अलग हिस्सों में बँटने से लीक होती हैं: क्रॉप या नया नाम स्वतंत्र उदाहरण नहीं"), noteTone: "warn" }, fields: { focus: false, note: undefined } },
      { groups: { note: t("Which repair addresses both shortcuts?", "कौन-सा सुधार दोनों शॉर्टकट सुलझाता है?"), noteTone: "info" } },
      { groups: { txt: { "g1:2": t("training", "ट्रेनिंग"), "g2:2": t("validation", "वैलिडेशन"), "g3:2": t("reserved evaluation", "सुरक्षित मूल्यांकन") }, mark: { g1: "ok", g2: "ok", g3: "ok" }, note: t("Whole source groups stay together: Cedar, Birch, Maple — and the late field is removed", "पूरे स्रोत-समूह साथ रहते हैं: Cedar, Birch, Maple — और देर से भरा फ़ील्ड हटता है"), noteTone: "ok" }, fields: { mark: { f3: "gone", f1: "ok", f2: "ok" } } },
      { groups: { focus: true } },
    ],
    out: {
      repair: { fields: { mark: { f3: "gone", f1: "ok", f2: "ok" } }, groups: { hide: false, txt: { "g1:2": t("training", "ट्रेनिंग"), "g2:2": t("validation", "वैलिडेशन"), "g3:2": t("reserved evaluation", "सुरक्षित मूल्यांकन") }, mark: { g1: "ok", g2: "ok", g3: "ok" }, note: t("Remove the late field and split whole source groups", "देर से भरा फ़ील्ड हटाएँ और पूरे स्रोत-समूह बाँटें"), noteTone: "ok" } },
      rename: { fields: { mark: { f3: "risk" }, txt: { "f3:0": "done_flag" }, note: t("A new name doesn't change when the value exists", "नया नाम मान के बनने का समय नहीं बदलता"), noteTone: "risk" } },
      inspect: { groups: { hide: false, mark: { g3: "risk" }, note: t("Peeking at the reserved pack until the score improves spoils it", "सुरक्षित पैक को स्कोर सुधरने तक देखना उसे बिगाड़ देता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-ai-four-boxes", scene: "night", layout: "two",
    label: t("20 reading cards · what kind of mistake?", "20 पठन कार्ड · किस तरह की ग़लती?"),
    art: [
      { k: "chart", id: "box", at: "a", look: "matrix", title: t("Prediction vs checked label", "अनुमान बनाम जाँचा लेबल"), icon: "grid", axes: [t("model says: positive | negative", "मॉडल कहता है: सकारात्मक | नकारात्मक"), t("checked: positive / negative", "जाँचा: सकारात्मक / नकारात्मक")], cells: [6, 2, 2, 10] },
      { k: "table", id: "m", at: "b", hide: true, title: t("Metrics from the boxes", "बक्सों से मापदंड"), icon: "calc", cols: [t("Measure", "माप"), t("Fraction", "भिन्न"), t("%", "%")], rows: [{ id: "acc", c: [t("Accuracy", "सटीकता"), "16 / 20", "80"] }, { id: "pre", c: [t("Precision", "परिशुद्धता"), "6 / 8", "75"] }, { id: "rec", c: [t("Recall", "रिकॉल"), "6 / 8", "75"] }, { id: "f1", c: ["F1", "—", "75"] }] },
    ],
    sc: [
      { box: { focus: true, note: t("Positive means 'needs a human reading check'; the model's prediction stays separate from the checked label", "सकारात्मक यानी 'मानव पठन-जाँच चाहिए'; मॉडल का अनुमान जाँचे लेबल से अलग रहता है"), noteTone: "info" } },
      { box: { cells: [0, 0, 0, 0], note: t("The headline says 16 correct out of 20 — but not every error creates the same work", "सुर्ख़ी कहती है 20 में 16 सही — पर हर ग़लती एक-सा काम नहीं बनाती"), noteTone: "warn" } },
      { box: { cells: [6, 2, 2, 10], note: t("Sort every pair: TP 6, FP 2, FN 2, TN 10. Predicted positives = TP + FP; checked positives = TP + FN.", "हर जोड़ी छाँटें: TP 6, FP 2, FN 2, TN 10। अनुमानित सकारात्मक = TP + FP; जाँचे सकारात्मक = TP + FN।"), noteTone: "ok" } },
      { box: { cells: [6, 2, 2, 10], note: t("Which conclusion follows from accuracy alone?", "सिर्फ़ सटीकता से कौन-सा निष्कर्ष निकलता है?"), noteTone: "info" } },
      { m: { hide: false, focus: true, note: t("Trace each fraction to its boxes — not to the headline", "हर भिन्न को उसके बक्सों से जोड़ें — सुर्ख़ी से नहीं"), noteTone: "ok" } },
      { m: { focus: true } },
    ],
    out: {
      narrow: { m: { hide: false, mark: { acc: "ok" }, note: t("Accuracy is the overall correct share — inspect error types next", "सटीकता कुल सही हिस्सा है — आगे ग़लती के प्रकार देखें"), noteTone: "ok" } },
      safe: { box: { cells: [6, 2, 2, 10], note: t("2 positive cards were missed (FN)", "2 सकारात्मक कार्ड छूटे (FN)"), noteTone: "risk" } },
      work: { box: { cells: [6, 2, 2, 10], note: t("8 cards go to review — capacity is a separate question", "8 कार्ड समीक्षा में जाते हैं — क्षमता अलग सवाल है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-ai-threshold-workload", scene: "night", layout: "two",
    label: t("Six notice cards · moving the decision line", "छह सूचना कार्ड · निर्णय-रेखा खिसकाना"),
    art: [
      { k: "chart", id: "line", at: "a", look: "scatter", title: t("Scores 90 → 20 (flag at or above the line)", "अंक 90 → 20 (रेखा पर या ऊपर चिह्नित)"), icon: "gauge", axes: [t("score", "अंक"), t("(just spread)", "(सिर्फ़ फैलाव)")], cut: 70, zones: [t("not flagged", "चिह्नित नहीं"), t("flagged", "चिह्नित")],
        pts: [{ x: 20, y: 30, c: "b", t: "F" }, { x: 40, y: 62, c: "a", t: "E" }, { x: 60, y: 28, c: "b", t: "D" }, { x: 70, y: 60, c: "b", t: "C" }, { x: 80, y: 30, c: "a", t: "B" }, { x: 90, y: 62, c: "b", t: "A" }] },
      { k: "table", id: "tab", at: "b", hide: true, title: t("Workload and misses", "काम का बोझ और छूट"), icon: "calc", cols: [t("Threshold", "सीमा"), t("Reviews", "समीक्षाएँ"), t("Misses", "छूट")], rows: [{ id: "t70", c: ["70", "3", "2"] }, { id: "t50", c: ["50", "4", "1"] }, { id: "t30", c: ["30", "5", "1"] }] },
    ],
    sc: [
      { line: { focus: true, note: t("Scores rank the cases — nobody has shown they are calibrated probabilities", "अंक मामलों का क्रम बताते हैं — किसी ने नहीं दिखाया कि वे जाँचे हुए संभावित मान हैं"), noteTone: "info" } },
      { line: { note: t("Positive = needs specialist review: A, C, D, F. Threshold 70 flags A, B, C — equality counts as flagged.", "सकारात्मक = विशेषज्ञ समीक्षा चाहिए: A, C, D, F। सीमा 70 पर A, B, C चिह्नित — बराबरी चिह्नित मानी जाती है।"), noteTone: "info" } },
      { line: { cut: 50, note: t("Lowering to 50 adds D; to 30 adds E — labels stay fixed, only the boundary moves", "50 पर D जुड़ता है; 30 पर E — लेबल वही रहते हैं, बस सीमा खिसकती है"), noteTone: "ok" } },
      { line: { cut: 70, note: t("How should the threshold investigation be reported?", "सीमा की जाँच की रिपोर्ट कैसे हो?"), noteTone: "info" } },
      { tab: { hide: false, focus: true, mark: { t70: "warn", t50: "info", t30: "info" }, note: t("70 → 3 reviews, 2 misses · 50 → 4, 1 · 30 → 5, 1: the lower setting trades extra reviews for one fewer miss", "70 → 3 समीक्षाएँ, 2 छूट · 50 → 4, 1 · 30 → 5, 1: नीची सीमा एक और छूट कम करने को ज़्यादा समीक्षाएँ लेती है"), noteTone: "ok" }, line: { cut: 50 } },
      { tab: { focus: true } },
    ],
    out: {
      both: { tab: { hide: false, mark: { t70: "warn", t50: "info", t30: "info" }, note: t("Report reviews and misses for each threshold", "हर सीमा के लिए समीक्षाएँ और छूट बताएँ"), noteTone: "ok" } },
      probability: { line: { note: t("Scores that only rank aren't verified probabilities", "सिर्फ़ क्रम बताने वाले अंक जाँची संभावनाएँ नहीं"), noteTone: "risk" } },
      guarantee: { tab: { hide: false, note: t("A visible-pack result can't promise unseen cases", "दिखते पैक का नतीजा अनदेखे मामलों की गारंटी नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-ai-unusual-reading", scene: "lab", layout: "two",
    label: t("Lamp times · one reading at 44 seconds", "लैंप के समय · एक रीडिंग 44 सेकंड की"),
    art: [
      { k: "chart", id: "dots", at: "a", look: "bars", max: 48, title: t("Seconds per lamp", "प्रति लैंप सेकंड"), icon: "timer", bars: [{ id: "r1", t: "6", v: 6, tone: "info" }, { id: "r2", t: "8", v: 8, tone: "info" }, { id: "r3", t: "10", v: 10, tone: "info" }, { id: "r4", t: "12", v: 12, tone: "info" }, { id: "r5", t: "44", v: 44, tone: "warn" }] },
      { k: "table", id: "sum", at: "b", hide: true, title: t("Summaries", "सारांश"), icon: "calc", cols: [t("Summary", "सारांश"), t("All 5", "सभी 5"), t("Without 44", "44 के बिना")], rows: [{ id: "mean", c: [t("Mean", "औसत"), "16", "9"] }, { id: "med", c: [t("Median", "माध्यिका"), "10", "9"] }, { id: "rng", c: [t("Range", "परास"), "38", "6"] }] },
    ],
    sc: [
      { dots: { focus: true, note: t("Every value goes on a dot plot first, before choosing a summary", "सारांश चुनने से पहले हर मान डॉट-प्लॉट पर रखा जाता है"), noteTone: "info" } },
      { dots: { mark: {}, note: t("44 stretches the scale — a genuinely slow lamp, or a recording problem? Distance raises a question; it doesn't answer it.", "44 पैमाना खींच देता है — सचमुच धीमा लैंप या रिकॉर्डिंग की समस्या? दूरी सवाल उठाती है; जवाब नहीं देती।"), noteTone: "warn" } },
      { dots: { ref: { v: 16, t: t("mean 16", "औसत 16") }, note: t("Total 80 → mean 16; the middle sorted reading is 10 → median 10 — same data, two answers", "कुल 80 → औसत 16; क्रम में बीच की रीडिंग 10 → माध्यिका 10 — वही डेटा, दो जवाब"), noteTone: "info" } },
      { dots: { ref: undefined, note: t("What should happen to the unusual reading first?", "असामान्य रीडिंग का पहले क्या हो?"), noteTone: "info" } },
      { sum: { hide: false, focus: true, mark: { mean: "info", med: "info", rng: "info" }, note: t("Compare: with 44 → range 38; without it the mean and median are both 9 and the range 6. Check the original timer record first.", "तुलना: 44 के साथ → परास 38; उसके बिना औसत और माध्यिका दोनों 9, परास 6। पहले मूल टाइमर रिकॉर्ड देखें।"), noteTone: "ok" }, dots: { focus: false } },
      { sum: { focus: true } },
    ],
    out: {
      verify: { sum: { hide: false, mark: { mean: "info" }, note: t("Retain it and check the original timer record", "रखें और मूल टाइमर रिकॉर्ड जाँचें"), noteTone: "ok" } },
      delete: { dots: { mark: {}, bars: [{ id: "r1", t: "6", v: 6, tone: "info" }, { id: "r2", t: "8", v: 8, tone: "info" }, { id: "r3", t: "10", v: 10, tone: "info" }, { id: "r4", t: "12", v: 12, tone: "info" }, { id: "r5", t: t("deleted", "हटाया"), v: 0, tone: "muted" }], note: t("Distance alone isn't a reason to delete", "सिर्फ़ दूरी हटाने की वजह नहीं"), noteTone: "risk" } },
      replace: { dots: { bars: [{ id: "r1", t: "6", v: 6, tone: "info" }, { id: "r2", t: "8", v: 8, tone: "info" }, { id: "r3", t: "10", v: 10, tone: "info" }, { id: "r4", t: "12", v: 12, tone: "info" }, { id: "r5", t: t("10 (silent swap)", "10 (चुप बदलाव)"), v: 10, tone: "risk" }], note: t("A silent replacement rewrites the evidence", "चुपचाप बदलना सबूत दोबारा लिखना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-ai-moving-window", scene: "lab", layout: "two",
    label: t("A 3 × 3 grayscale patch · a moving window", "3 × 3 ग्रेस्केल पैच · खिसकती खिड़की"),
    art: [
      { k: "grid", id: "patch", at: "a", look: "map", w: 3, h: 3, title: t("Measured pixels", "मापे हुए पिक्सेल"), icon: "image", cells: { 0: { t: "10" }, 1: { t: "20" }, 2: { t: "30" }, 3: { t: "40" }, 4: { t: "50", tone: "info" }, 5: { t: "60" }, 6: { t: "70" }, 7: { t: "80" }, 8: { t: "90" } } },
      { k: "grid", id: "out", at: "b", hide: true, look: "map", w: 2, h: 2, title: t("Window sums (no padding)", "विंडो योग (बिना पैडिंग)"), icon: "calc", cells: { 0: { t: "120" }, 1: { t: "160" }, 2: { t: "240" }, 3: { t: "280" } } },
    ],
    sc: [
      { patch: { focus: true, note: t("Rows [10,20,30], [40,50,60], [70,80,90] — locations stay attached so neighbours remain neighbours", "पंक्तियाँ [10,20,30], [40,50,60], [70,80,90] — जगहें जुड़ी रहती हैं ताकि पड़ोसी पड़ोसी ही रहें"), noteTone: "info" } },
      { patch: { note: t("Centre pixel 50 = 32 + 16 + 2 → 00110010 — leading zeros keep the fixed eight-bit width", "बीच का पिक्सेल 50 = 32 + 16 + 2 → 00110010 — शुरुआती शून्य आठ-बिट चौड़ाई बनाए रखते हैं"), noteTone: "ok" } },
      { patch: { win: { x: 0, y: 0, w: 2, h: 2 }, note: t("A 2 × 2 window adds its four values; it moves only to positions that fit fully inside the patch", "2 × 2 विंडो अपने चार मान जोड़ती है; वह सिर्फ़ उन्हीं जगहों पर जाती है जहाँ पूरी समाए"), noteTone: "info" } },
      { patch: { win: { x: 1, y: 0, w: 2, h: 2 }, note: t("Predict the top-right window sum", "ऊपर-दाईं विंडो का योग बताइए"), noteTone: "warn" } },
      { out: { hide: false, focus: true, cells: { 0: { t: "120" }, 1: { t: "160" }, 2: { t: "240", tone: "ok" }, 3: { t: "280", tone: "ok" } }, note: t("Output rows [120,160] and [240,280] — a toy rule 'sum ≥ 200' selects only the bottom row", "आउटपुट पंक्तियाँ [120,160] और [240,280] — खिलौना नियम 'योग ≥ 200' सिर्फ़ निचली पंक्ति चुनता है"), noteTone: "ok" }, patch: { win: undefined, focus: false } },
      { out: { focus: true } },
    ],
    out: {
      sum: { patch: { win: { x: 1, y: 0, w: 2, h: 2 }, note: t("20 + 30 + 50 + 60 = 160", "20 + 30 + 50 + 60 = 160"), noteTone: "ok" } },
      average: { patch: { win: { x: 1, y: 0, w: 2, h: 2 }, note: t("40 is an average — the window adds", "40 औसत है — विंडो जोड़ती है"), noteTone: "risk" } },
      left: { patch: { win: { x: 0, y: 0, w: 2, h: 2 }, note: t("120 is the top-left window, not top-right", "120 ऊपर-बाईं विंडो है, ऊपर-दाईं नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-ai-word-count-vectors", scene: "library", layout: "two",
    label: t("Counting words · what a vector keeps and what disappears", "शब्द गिनना · वेक्टर क्या रखता है और क्या मिट जाता है"),
    art: [
      { k: "table", id: "vec", at: "a", title: t("Vocabulary [aditi, helps, vihaan]", "शब्दावली [aditi, helps, vihaan]"), icon: "hash", cols: [t("Sentence", "वाक्य"), t("Tokens", "टोकन"), t("Count vector", "गणना वेक्टर")], rows: [{ id: "s1", c: ["“Aditi helps Aditi.”", "[aditi, helps, aditi]", "[2, 1, 0]"] }, { id: "s2", c: ["“Aditi helps Vihaan.”", "[aditi, helps, vihaan]", "?"] }, { id: "s3", c: ["“Vihaan helps Aditi.”", "[vihaan, helps, aditi]", "?"] }], upTo: 1 },
      { k: "table", id: "hi", at: "b", hide: true, title: t("Hindi examples (fixed token lists)", "हिंदी उदाहरण (तय टोकन सूची)"), icon: "languages", cols: [t("Sentence", "वाक्य"), t("Tokens", "टोकन")], rows: [{ id: "h1", c: ["अदिति ने विहान को बुलाया", "[अदिति, ने, विहान, को, बुलाया]"] }, { id: "h2", c: ["विहान ने अदिति को बुलाया", "[विहान, ने, अदिति, को, बुलाया]"] }] },
    ],
    sc: [
      { vec: { upTo: 1, focus: true, note: t("Token rule: drop a final full stop or danda, lowercase Latin letters, split at spaces. No stemming.", "टोकन नियम: अंतिम पूर्णविराम या दंड हटाएँ, लैटिन अक्षर छोटे करें, स्पेस पर बाँटें। कोई स्टेमिंग नहीं।"), noteTone: "info" } },
      { vec: { upTo: 1, mark: { s1: "ok" }, note: t("Repeated name stacks twice; an absent vocabulary word counts 0", "दोहराया नाम दो बार गिना जाता है; शब्दावली का ग़ायब शब्द 0 गिना जाता है"), noteTone: "info" } },
      { vec: { upTo: 3, txt: { "s2:2": "[1, 1, 1]", "s3:2": "[1, 1, 1]" }, mark: { s2: "warn", s3: "warn" }, note: t("Reverse who helps whom — and the vectors are identical, though the meaning changed", "किसने किसकी मदद की उलट दें — वेक्टर वही रहते हैं, भले अर्थ बदल गया"), noteTone: "warn" } },
      { vec: { note: t("What does a matching count vector establish?", "मेल खाता गणना वेक्टर क्या साबित करता है?"), noteTone: "info" } },
      { hi: { hide: false, focus: true, note: t("The same effect with Hindi: reversed roles, same counts — equal frequencies only, not the same meaning", "हिंदी में वही असर: भूमिकाएँ उलटीं, गिनतियाँ वही — सिर्फ़ बराबर आवृत्तियाँ, एक-सा अर्थ नहीं"), noteTone: "ok" }, vec: { focus: false } },
      { hi: { focus: true } },
    ],
    out: {
      counts: { vec: { upTo: 3, txt: { "s2:2": "[1, 1, 1]", "s3:2": "[1, 1, 1]" }, mark: { s2: "ok", s3: "ok" }, note: t("Equal frequencies under the stated representation", "बताए निरूपण में बराबर आवृत्तियाँ"), noteTone: "ok" } },
      meaning: { vec: { upTo: 3, txt: { "s2:2": "[1, 1, 1]", "s3:2": "[1, 1, 1]" }, mark: { s2: "risk", s3: "risk" }, note: t("The same person doesn't help in both sentences", "दोनों वाक्यों में वही व्यक्ति मदद नहीं करता"), noteTone: "risk" } },
      recover: { vec: { upTo: 3, txt: { "s2:2": "[1, 1, 1]", "s3:2": "[1, 1, 1]" }, mark: { s2: "risk", s3: "risk" }, note: t("Word order is gone — the vector can't recover it", "शब्द-क्रम चला गया — वेक्टर उसे वापस नहीं ला सकता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-ai-model-card-stop-rule", scene: "classroom", layout: "two",
    label: t("Strip triage prototype · contrast value → review or pass", "स्ट्रिप ट्राइएज प्रोटोटाइप · कंट्रास्ट मान → समीक्षा या पास"),
    art: [
      { k: "chart", id: "sc", at: "a", look: "scatter", title: t("Contrast values", "कंट्रास्ट मान"), icon: "target", axes: [t("contrast", "कंट्रास्ट"), t("(just spread)", "(सिर्फ़ फैलाव)")], cut: 50, zones: [t("review", "समीक्षा"), t("pass", "पास")],
        pts: [{ x: 10, y: 50, c: "a", t: "R" }, { x: 40, y: 50, c: "b", t: "P" }] },
      { k: "doc", id: "card", at: "b", hide: true, look: "card", pic: "clipboard-ok", title: t("Model card", "मॉडल कार्ड"), sub: t("Bounded pilot", "सीमित पायलट"), toks: [{ id: "use", t: t("Fictional strip triage; teacher checks", "काल्पनिक स्ट्रिप ट्राइएज; टीचर जाँचती हैं"), icon: "check" }, { id: "not", t: t("Cannot certify equipment or diagnose faults", "उपकरण प्रमाणित या गड़बड़ी निदान नहीं कर सकता"), icon: "x" }, { id: "rng", t: t("Stated input range only (no extrapolation)", "सिर्फ़ बताई इनपुट-सीमा (बाहर अनुमान नहीं)"), icon: "ruler" }, { id: "cap", t: t("Human-review capacity: 2 per batch", "मानव-समीक्षा क्षमता: प्रति बैच 2"), icon: "users" }, { id: "stop", t: t("Stop rule: capacity exceeded or out of range", "रोक-नियम: क्षमता से ज़्यादा या सीमा से बाहर"), icon: "siren" }] },
    ],
    sc: [
      { sc: { focus: true, note: t("Training: 2 → review, 8 → pass. The model copies the nearest value's label; tied labels → abstain.", "ट्रेनिंग: 2 → समीक्षा, 8 → पास। मॉडल सबसे नज़दीकी मान का लेबल नक़ल करता है; बराबरी पर परहेज़।"), noteTone: "info" } },
      { sc: { pts: [{ x: 10, y: 50, c: "a", t: "R" }, { x: 40, y: 50, c: "b", t: "P" }, { x: 15, y: 25, c: "q" }, { x: 20, y: 75, c: "q" }, { x: 30, y: 25, c: "q" }, { x: 45, y: 75, c: "q" }], note: t("Visible validation 3, 4, 6, 9 → review, review, pass, pass — these guided the setup, so they aren't a fresh test", "दिखता वैलिडेशन 3, 4, 6, 9 → समीक्षा, समीक्षा, पास, पास — इन्होंने सेटअप को दिशा दी, इसलिए ये नया परीक्षण नहीं"), noteTone: "info" } },
      { card: { hide: false, focus: true, mark: { cap: "ok" }, note: t("Every review or abstention needs a human check: the normal batch queues 2 strips — matching capacity 2", "हर समीक्षा या परहेज़ को मानव जाँच चाहिए: सामान्य बैच में 2 स्ट्रिप — क्षमता 2 के बराबर"), noteTone: "ok" }, sc: { focus: false, note: undefined } },
      { card: { focus: false, note: t("Which model-card entry is supported?", "मॉडल-कार्ड की कौन-सी प्रविष्टि समर्थित है?"), noteTone: "info" } },
      { card: { mark: { use: "ok", not: "ok", rng: "ok", cap: "ok", stop: "ok" }, note: t("Changed batch 3, 5, 6, 20: it abstains at 5; 20 is outside the stated range — the stop rule triggers", "बदला बैच 3, 5, 6, 20: 5 पर परहेज़; 20 बताई सीमा से बाहर — रोक-नियम लगता है"), noteTone: "ok" } },
      { card: { focus: true } },
    ],
    out: {
      bounded: { card: { hide: false, mark: { use: "ok", not: "ok", rng: "ok", cap: "ok", stop: "ok" }, note: t("Fictional strip triage; teacher checks; fresh evaluation pending", "काल्पनिक स्ट्रिप ट्राइएज; टीचर जाँचती हैं; नया मूल्यांकन बाक़ी"), noteTone: "ok" } },
      certificate: { card: { hide: false, mark: { not: "risk" }, note: t("The card itself says it cannot certify equipment", "कार्ड ख़ुद कहता है कि वह उपकरण प्रमाणित नहीं कर सकता"), noteTone: "risk" } },
      autonomy: { card: { hide: false, mark: { cap: "risk", stop: "risk" }, note: t("A correct batch doesn't remove the human check", "एक सही बैच मानव जाँच को नहीं हटाता"), noteTone: "risk" } },
    },
  },
];
