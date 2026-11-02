import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];
const DARK = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i, { tone: "muted" as const }]));
const LEAF = { 6: { icon: "leaf", tone: "ok" as const }, 7: { icon: "leaf", tone: "ok" as const }, 12: { icon: "leaf", tone: "ok" as const } };

export const class7AiWorlds: World[] = [
  {
    slug: "class7-ai-choose-a-helper", scene: "lab", layout: "two",
    label: t("Nature cards · which helper for which job?", "नेचर कार्ड · किस काम के लिए कौन-सा मददगार?"),
    art: [
      { k: "doc", id: "jobs", at: "a", look: "card", pic: "clipboard", title: t("Tara's job list", "तारा की काम-सूची"), sub: t("Describe the job first", "पहले काम बताओ"),
        toks: [{ id: "sum", t: t("Add two supply counts → exact sum", "दो सामान-गिनतियाँ जोड़ना → सटीक योग"), icon: "calc" }, { id: "sort", t: t("Sort varied nature drawings", "अलग-अलग नेचर चित्र छाँटना"), icon: "image" }] },
      { k: "flow", id: "methods", at: "b", look: "graph", hide: true, title: t("Methods for each job", "हर काम के तरीक़े"), icon: "workflow",
        nodes: [{ id: "j1", t: t("Add counts", "गिनतियाँ जोड़ना"), icon: "calc", x: 14, y: 25 }, { id: "j2", t: t("Sort drawings", "चित्र छाँटना"), icon: "image", x: 14, y: 75 }, { id: "rule", t: t("Addition rule", "जोड़ का नियम"), icon: "plus", x: 82, y: 14 }, { id: "ml", t: t("Learned model", "सीखा हुआ मॉडल"), icon: "brain", x: 82, y: 50 }, { id: "man", t: t("Sort by hand", "हाथ से छाँटना"), icon: "user", x: 82, y: 86 }],
        links: [{ from: "j1", to: "rule" }, { from: "j1", to: "ml" }, { from: "j2", to: "ml" }, { from: "j2", to: "man" }], link: { "j1>ml": "off" } },
      { k: "chart", id: "score", at: "b", hide: true, look: "bars", max: 12, title: t("Same 12 cards, same check", "वही 12 कार्ड, वही जाँच"), icon: "bars", ref: { v: 10, t: t("hand-sorting baseline", "हाथ से छाँटने की आधार-रेखा") },
        bars: [{ id: "m", t: t("By hand", "हाथ से"), v: 10, tone: "info" }, { id: "h", t: t("AI helper", "AI मददगार"), v: 9, tone: "warn" }] },
    ],
    sc: [
      { jobs: { focus: true, mark: { sum: "warn" }, note: t("Neel: use AI for every job — even adding!", "नील: हर काम AI से करो — जोड़ना भी!"), noteTone: "warn" } },
      { jobs: { focus: false, note: undefined }, methods: { hide: false, focus: true, note: t("A fixed rule gives the exact sum. Sorting drawings may use learned patterns.", "तय नियम सटीक योग देता है। चित्र छाँटने में सीखे पैटर्न काम आ सकते हैं।"), noteTone: "info" } },
      { methods: { hide: true }, score: { hide: false, focus: true, note: t("Measured on the same cards, with the hand method as the baseline", "वही कार्ड, आधार-रेखा हाथ से छाँटना"), noteTone: "info" } },
      { score: { hide: true }, methods: { hide: false, focus: false, note: t("The job: known numbers in, exact sum out.", "काम: जानी हुई संख्याएँ दो, सटीक योग लो।"), noteTone: "info" } },
      { methods: { link: { "j1>ml": "off", "j1>rule": "on" }, state: { rule: "ok", ml: "muted" }, note: t("Fixed rule chosen for the exact sum", "सटीक योग के लिए तय नियम चुना"), noteTone: "ok" } },
      { methods: { focus: true } },
    ],
    out: {
      "option-0": { methods: { link: { "j1>ml": "bad", "j1>rule": "off" }, state: { ml: "risk", rule: "muted" }, note: t("A learned guess adds uncertainty to an exact job", "सटीक काम में सीखा अनुमान अनिश्चितता जोड़ता है"), noteTone: "risk" } },
      "option-1": { methods: { link: { "j1>ml": "off", "j1>rule": "on" }, state: { rule: "ok", ml: "muted" }, note: t("The rule computes the exact sum directly", "नियम सीधे सटीक योग निकालता है"), noteTone: "ok" } },
      "option-2": { methods: { link: { "j1>ml": "on", "j1>rule": "off" }, state: { ml: "risk", rule: "muted" }, note: t("Complicated isn't a success measure", "जटिल होना सफलता का पैमाना नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-ai-data-table", scene: "lab", layout: "two",
    label: t("Paper-strip table · sorting activity", "कागज़-पट्टी तालिका · छँटाई गतिविधि"),
    art: [
      { k: "table", id: "tbl", at: "a", title: t("Fictional paper strips", "काल्पनिक कागज़ की पट्टियाँ"), icon: "grid",
        cols: [t("ID", "आईडी"), t("Length (feature)", "लंबाई (विशेषता)"), t("Label (result)", "लेबल (नतीजा)")],
        rows: [{ id: "r1", c: ["S1", "3", t("short", "छोटी")] }, { id: "r2", c: ["S2", "9", t("long", "लंबी")] }, { id: "r2b", c: ["S2", "9", t("long", "लंबी")] }, { id: "r3", c: ["S3", "6", t("— missing —", "— ग़ायब —")] }, { id: "r4", c: ["S4", "4", t("short", "छोटी")] }, { id: "r4b", c: ["S4", "8", t("short", "छोटी")] }] },
      { k: "doc", id: "log", at: "b", hide: true, look: "note", pic: "pencil", title: t("Repair log", "सुधार लॉग"), sub: t("Tara keeps the evidence", "तारा सबूत सँभालती है"),
        toks: [{ id: "dup", t: t("S2 appears twice → keep one", "S2 दो बार → एक रखें"), icon: "copy" }, { id: "miss", t: t("S3 has no label → set aside", "S3 का लेबल नहीं → अलग रखें"), icon: "help" }, { id: "conf", t: t("S4 has two lengths → source review", "S4 की दो लंबाइयाँ → स्रोत जाँचें"), icon: "search" }, { id: "priv", t: t("Names and phone numbers: not needed", "नाम और फ़ोन नंबर: ज़रूरी नहीं"), icon: "eye-off" }] },
    ],
    sc: [
      { tbl: { focus: true, cell: { "r1:1": "info", "r1:2": "ok" }, note: t("Length = input feature · Label = the result to predict", "लंबाई = इनपुट · लेबल = अनुमान का नतीजा"), noteTone: "info" } },
      { tbl: { cell: {}, mark: { r2b: "warn", r3: "warn", r4: "risk", r4b: "risk" }, note: t("A repeat, a missing label, and one ID with two lengths", "एक दोहराव, एक ग़ायब लेबल, और एक आईडी की दो लंबाइयाँ"), noteTone: "warn" } },
      { tbl: { focus: false, note: undefined }, log: { hide: false, focus: true, mark: { priv: "ok" }, note: t("A neat table can still hold poor evidence", "साफ़ तालिका में भी कमज़ोर सबूत हो सकते हैं"), noteTone: "info" } },
      { log: { focus: false, note: t("S4 has two different lengths and the original is unchecked.", "S4 की दो अलग लंबाइयाँ हैं और असली माप जाँचा नहीं गया।"), noteTone: "warn" } },
      { tbl: { mark: { r2b: "gone", r3: "muted", r4: "hl", r4b: "hl" }, note: t("Row held for source review; the correction is documented", "पंक्ति स्रोत-जाँच के लिए रोकी; सुधार दर्ज किया"), noteTone: "ok" }, log: { mark: { dup: "ok", miss: "ok", conf: "hl", priv: "ok" } } },
      { tbl: { focus: true } },
    ],
    out: {
      "option-0": { tbl: { mark: { r4: "hl", r4b: "hl", r2b: "gone", r3: "muted" }, note: t("Held for source review — uncertainty kept visible", "स्रोत-जाँच के लिए रोका — अनिश्चितता दिखती रही"), noteTone: "ok" }, log: { mark: { conf: "hl" } } },
      "option-1": { tbl: { mark: { r4: "gone", r4b: "ok" }, txt: { "r4b:1": "8 (larger)" }, note: t("Larger isn't the same as correct", "बड़ा होने का मतलब सही नहीं"), noteTone: "risk" } },
      "option-2": { tbl: { mark: { r4: "risk", r4b: "risk" }, foot: t("Counted as two examples — but it is one example", "दो उदाहरण गिने — पर यह एक ही उदाहरण है"), note: t("Two rows, one example", "दो पंक्तियाँ, एक उदाहरण"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-ai-train-the-sorter", scene: "lab", layout: "one",
    label: t("Neel's paper-strip sorter · nearest length", "नील का पट्टी-छँटाईकार · सबसे नज़दीकी लंबाई"),
    art: [
      { k: "chart", id: "plot", look: "scatter", title: t("Which side does each strip land on?", "हर पट्टी किस तरफ़ जाती है?"), icon: "target", axes: [t("strip length", "पट्टी की लंबाई"), t("(just spread)", "(सिर्फ़ फैलाव)")],
        cut: 100, zones: [t("predict short", "अनुमान: छोटी"), t("predict long", "अनुमान: लंबी")], pts: [{ x: 14, y: 50, c: "a", t: "S" }] },
    ],
    sc: [
      { plot: { focus: true, note: t("Only a short strip is selected as training", "ट्रेनिंग में सिर्फ़ एक छोटी पट्टी चुनी है"), noteTone: "info" } },
      { plot: { pts: [{ x: 14, y: 50, c: "a", t: "S" }, { x: 68, y: 30, c: "q" }, { x: 84, y: 66, c: "q" }, { x: 92, y: 40, c: "q" }], note: t("Long strips are predicted short — no long example was ever shown", "लंबी पट्टियाँ 'छोटी' आ रही हैं — कोई लंबा उदाहरण दिखाया ही नहीं"), noteTone: "risk" } },
      { plot: { pts: [{ x: 14, y: 50, c: "a", t: "S" }, { x: 80, y: 45, c: "b", t: "L" }, { x: 68, y: 30, c: "q" }, { x: 84, y: 66, c: "q" }, { x: 92, y: 40, c: "q" }], cut: 47, note: t("Check cards stay separate from training cards", "जाँच कार्ड ट्रेनिंग कार्ड से अलग रहते हैं"), noteTone: "info" } },
      { plot: { pts: [{ x: 14, y: 50, c: "a", t: "S" }, { x: 68, y: 30, c: "q" }, { x: 84, y: 66, c: "q" }, { x: 92, y: 40, c: "q" }], cut: 100, note: t("Long checks predicted short. What should change?", "लंबी जाँचें 'छोटी' आ रही हैं। क्या बदलें?"), noteTone: "warn" } },
      { plot: { pts: [{ x: 14, y: 50, c: "a", t: "S" }, { x: 80, y: 45, c: "b", t: "L" }, { x: 68, y: 30, c: "b", t: "L" }, { x: 84, y: 66, c: "b", t: "L" }, { x: 92, y: 40, c: "b", t: "L" }], cut: 47, note: t("Checked long examples added — all four checks now pass (a narrow classroom result)", "जाँची हुई लंबी पट्टियाँ जुड़ीं — चारों जाँचें अब पास (सीमित क्लास-नतीजा)"), noteTone: "ok" } },
      { plot: { focus: true } },
    ],
    out: {
      "option-0": { plot: { pts: [{ x: 14, y: 50, c: "a", t: "S" }, { x: 15, y: 40, c: "a", t: "S" }, { x: 13, y: 60, c: "a", t: "S" }, { x: 16, y: 55, c: "a", t: "S" }, { x: 68, y: 30, c: "q" }, { x: 84, y: 66, c: "q" }, { x: 92, y: 40, c: "q" }], cut: 100, note: t("Many copies of one short strip: still no long coverage", "एक छोटी पट्टी की कई प्रतियाँ: लंबी का अब भी कोई उदाहरण नहीं"), noteTone: "risk" } },
      "option-1": { plot: { cut: 100, note: t("Renaming mistakes doesn't retrain anything", "ग़लतियों का नाम बदलने से कुछ दोबारा नहीं सीखा जाता"), noteTone: "risk" } },
      "option-2": { plot: { pts: [{ x: 14, y: 50, c: "a", t: "S" }, { x: 80, y: 45, c: "b", t: "L" }, { x: 68, y: 30, c: "b", t: "L" }, { x: 84, y: 66, c: "b", t: "L" }, { x: 92, y: 40, c: "b", t: "L" }], cut: 47, note: t("The boundary moves — the missing category is covered", "सीमा खिसकी — छूटी हुई श्रेणी अब शामिल है"), noteTone: "ok" } },
    },
  },
  {
    slug: "class7-ai-mistake-record", scene: "lab", layout: "two",
    label: t("Six picture cards · every check counts", "छह चित्र कार्ड · हर जाँच गिनी जाती है"),
    art: [
      { k: "table", id: "rec", at: "a", title: t("Mistake record", "ग़लतियों का रिकॉर्ड"), icon: "clipboard", upTo: 4,
        cols: [t("Card", "कार्ड"), t("Checked label", "जाँचा लेबल"), t("Prediction", "अनुमान"), t("Match?", "मेल?")],
        rows: [{ id: "c1", c: ["1", t("leaf", "पत्ता"), t("leaf", "पत्ता"), "✓"] }, { id: "c2", c: ["2", t("stone", "पत्थर"), t("stone", "पत्थर"), "✓"] }, { id: "c3", c: ["3", t("shell", "सीप"), t("shell", "सीप"), "✓"] }, { id: "c4", c: ["4", t("twig", "टहनी"), t("twig", "टहनी"), "✓"] }, { id: "c5", c: ["5", t("leaf", "पत्ता"), t("stone", "पत्थर"), "✗"] }, { id: "c6", c: ["6", t("shell", "सीप"), t("twig", "टहनी"), "✗"] }],
        foot: t("Display says: 4 successes", "डिस्प्ले: 4 सफलताएँ") },
      { k: "chart", id: "sum", at: "b", hide: true, look: "split", title: t("The whole result", "पूरा नतीजा"), icon: "pie", parts: [{ t: t("correct", "सही"), v: 4, tone: "ok" }, { t: t("incorrect", "ग़लत"), v: 2, tone: "risk" }] },
    ],
    sc: [
      { rec: { focus: true, mark: { c1: "ok", c2: "ok", c3: "ok", c4: "ok" }, note: t("Neel shows four successes and keeps the other cards in a drawer", "नील चार सफलताएँ दिखाता है, बाक़ी कार्ड दराज़ में"), noteTone: "warn" } },
      { rec: { upTo: 6, mark: { c5: "risk", c6: "risk" }, foot: t("Agreement = correct · disagreement = an error to investigate", "मेल = सही · अमेल = जाँचने लायक़ ग़लती"), note: t("The total includes both kinds", "कुल में दोनों शामिल हैं"), noteTone: "info" } },
      { rec: { focus: false, foot: t("4 correct, 2 incorrect, out of 6", "6 में से 4 सही, 2 ग़लत"), note: undefined }, sum: { hide: false, focus: true, note: t("Describe the mistaken cards and plan a new check", "ग़लत कार्ड बताएँ और नई जाँच सोचें"), noteTone: "info" } },
      { sum: { focus: false, note: t("Six checks: four correct, two incorrect. Which report matches?", "छह जाँचें: चार सही, दो ग़लत। कौन-सी रिपोर्ट मेल खाती है?"), noteTone: "info" } },
      { sum: { note: t("Four correct, two incorrect, six total — with limits stated", "चार सही, दो ग़लत, कुल छह — सीमाओं के साथ"), noteTone: "ok" } },
      { rec: { focus: true } },
    ],
    out: {
      "option-0": { rec: { upTo: 4, foot: t("Four correct out of four?", "चार में से चार सही?"), mark: { c1: "ok", c2: "ok", c3: "ok", c4: "ok" } }, sum: { parts: [{ t: t("correct", "सही"), v: 4, tone: "ok" }, { t: t("hidden", "छिपी"), v: 2, tone: "muted" }], note: t("Two attempted checks were hidden", "दो की गई जाँचें छिपा दी गईं"), noteTone: "risk" } },
      "option-1": { rec: { upTo: 6 }, sum: { note: t("All attempted checks are included", "सभी की गई जाँचें शामिल हैं"), noteTone: "ok" } },
      "option-2": { sum: { parts: [{ t: t("correct", "सही"), v: 4, tone: "ok" }, { t: t("incorrect", "ग़लत"), v: 2, tone: "risk" }, { t: t("\"forever\"", "\"हमेशा\""), v: 6, tone: "warn" }], note: t("Six small checks can't promise forever", "छह छोटी जाँचें 'हमेशा' का वादा नहीं कर सकतीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-ai-changing-picture", scene: "lab", layout: "two",
    label: t("Leaf helper · same leaf, new background", "पत्ता-मददगार · वही पत्ता, नई पृष्ठभूमि"),
    art: [
      { k: "grid", id: "pale", at: "a", look: "map", w: 5, h: 4, title: t("Pale card", "हल्का कार्ड"), icon: "sun", cells: LEAF, note: t("Recognised ✓", "पहचाना ✓"), noteTone: "ok" },
      { k: "grid", id: "dark", at: "b", look: "map", w: 5, h: 4, title: t("Dark card", "गहरा कार्ड"), icon: "moon", cells: DARK, hide: true },
    ],
    sc: [
      { pale: { focus: true } },
      { dark: { hide: false, cells: { ...DARK, ...LEAF }, note: t("Same leaf — not recognised ✗. Shape or background?", "वही पत्ता — नहीं पहचाना ✗। आकार या पृष्ठभूमि?"), noteTone: "risk" }, pale: { focus: false } },
      { pale: { win: { x: 1, y: 1, w: 2, h: 2 }, note: t("Mask the object cells, not the table colour", "तालिका का रंग नहीं, वस्तु के खाने चुनें"), noteTone: "info" }, dark: { win: { x: 1, y: 1, w: 2, h: 2 } } },
      { pale: { win: undefined }, dark: { win: undefined, note: t("Pale ✓, dark ✗ — what's the most useful next check?", "हल्का ✓, गहरा ✗ — सबसे उपयोगी अगली जाँच?"), noteTone: "warn" } },
      { dark: { cells: { ...DARK, ...LEAF }, note: t("Retest across backgrounds and record each difference", "अलग-अलग पृष्ठभूमि पर दोबारा जाँचें और फ़र्क़ दर्ज करें"), noteTone: "ok" }, pale: { note: t("Recognised ✓ on every background tried", "आज़माई हर पृष्ठभूमि पर पहचाना ✓"), noteTone: "ok" } },
      { dark: { focus: true } },
    ],
    out: {
      "option-0": { dark: { hide: true, note: undefined }, pale: { note: t("Deleting the dark result hides the problem", "गहरे वाला नतीजा मिटाना समस्या छिपाना है"), noteTone: "risk" } },
      "option-1": { dark: { cells: { ...DARK, 6: { icon: "dice", tone: "risk" }, 7: { icon: "dice", tone: "risk" }, 12: { icon: "dice", tone: "risk" } }, note: t("Relabelling the leaf as a stone hides the error", "पत्ते को पत्थर कहना ग़लती छिपाना है"), noteTone: "risk" } },
      "option-2": { dark: { note: t("Same leaf, several backgrounds — shortcut tested", "वही पत्ता, कई पृष्ठभूमियाँ — शॉर्टकट की जाँच"), noteTone: "ok" }, pale: { note: t("Recognised ✓", "पहचाना ✓"), noteTone: "ok" } },
    },
  },
  {
    slug: "class7-ai-recommendation-loop", scene: "lab", layout: "two",
    label: t("Classroom feed · what did the click teach it?", "क्लासरूम फ़ीड · क्लिक ने क्या सिखाया?"),
    art: [
      { k: "flow", id: "loop", at: "a", look: "graph", title: t("The feedback loop", "फ़ीडबैक लूप"), icon: "repeat",
        nodes: [{ id: "pick", t: t("Neel picks building pictures", "नील इमारतों के चित्र चुनता है"), icon: "building", x: 20, y: 25 }, { id: "count", t: t("Feed counts the topic", "फ़ीड विषय गिनता है"), icon: "bars", x: 78, y: 25 }, { id: "more", t: t("More buildings suggested", "और इमारतें सुझाईं"), icon: "sparkles", x: 78, y: 78 }, { id: "mix", t: t("Different checked source", "अलग जाँचा हुआ स्रोत"), icon: "book-open", x: 20, y: 78 }],
        links: [{ from: "pick", to: "count" }, { from: "count", to: "more" }, { from: "more", to: "pick" }, { from: "mix", to: "pick" }], link: { "mix>pick": "off" }, state: { mix: "muted" } },
      { k: "chart", id: "hist", at: "b", look: "bars", max: 8, title: t("What the feed counted", "फ़ीड ने क्या गिना"), icon: "bars",
        bars: [{ id: "b", t: t("Buildings", "इमारतें"), v: 3, tone: "info" }, { id: "p", t: t("Animals", "जानवर"), v: 1 }, { id: "s", t: t("Space", "अंतरिक्ष"), v: 1 }] },
    ],
    sc: [
      { loop: { state: { pick: "now" }, cur: "pick", focus: true } },
      { loop: { state: { pick: "done", count: "now", more: "risk" }, cur: "more", note: t("A predicted interest is not a fact check", "अनुमानित रुचि तथ्य-जाँच नहीं है"), noteTone: "warn" }, hist: { bars: [{ id: "b", t: t("Buildings", "इमारतें"), v: 7, tone: "risk" }, { id: "p", t: t("Animals", "जानवर"), v: 1 }, { id: "s", t: t("Space", "अंतरिक्ष"), v: 1 }], note: t("The feed narrows without showing what matters most", "फ़ीड सिमटता है, पर यह नहीं दिखाता कि सबसे ज़रूरी क्या है"), noteTone: "risk" } },
      { loop: { link: { "mix>pick": "on" }, state: { mix: "ok", pick: "now" }, cur: "mix", note: t("A varied list and a stopping point break the loop", "विविध सूची और रुकने का बिंदु लूप तोड़ते हैं"), noteTone: "ok" }, hist: { bars: [{ id: "b", t: t("Buildings", "इमारतें"), v: 4, tone: "info" }, { id: "p", t: t("Animals", "जानवर"), v: 3 }, { id: "s", t: t("Space", "अंतरिक्ष"), v: 3 }], note: undefined } },
      { loop: { note: t("Another building appears. What does that establish?", "फिर एक इमारत दिखी। इससे क्या साबित होता है?"), noteTone: "info" } },
      { loop: { state: { more: "ok" }, note: t("It's a prediction of interest — not proof it's true or worth your time", "यह रुचि का अनुमान है — सच या समय-योग्य होने का सबूत नहीं"), noteTone: "ok" } },
      { loop: { focus: true } },
    ],
    out: {
      "option-0": { loop: { state: { more: "ok" }, note: t("A prediction from earlier choices", "पिछली पसंद से किया अनुमान"), noteTone: "ok" } },
      "option-1": { loop: { state: { more: "risk" }, note: t("A suggestion doesn't make a claim true", "सुझाव मिलने से दावा सच नहीं हो जाता"), noteTone: "risk" }, hist: { note: undefined } },
      "option-2": { loop: { state: { more: "risk" }, note: t("Nothing makes you keep watching — you decide", "आपको देखते रहना ज़रूरी नहीं — फ़ैसला आपका है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-ai-generated-explanation", scene: "lab", layout: "two",
    label: t("Water-filter demo · helper's paragraph vs source card", "वाटर-फ़िल्टर डेमो · मददगार का पैराग्राफ़ बनाम स्रोत कार्ड"),
    art: [
      { k: "doc", id: "gen", at: "a", look: "note", pic: "bot", title: t("Text helper's paragraph", "टेक्स्ट मददगार का पैराग्राफ़"), sub: t("Sounds confident", "आत्मविश्वास से भरा लगता है"),
        toks: [{ id: "obs", t: t("The filter removed visible particles.", "फ़िल्टर ने दिखने वाले कण हटाए।"), icon: "droplets" }, { id: "safe", t: t("The water is now safe to drink.", "अब पानी पीने के लिए सुरक्षित है।"), icon: "alert" }, { id: "ref", t: t("Reference: \"Journal of Water Science, 2024\"", "संदर्भ: \"जर्नल ऑफ़ वाटर साइंस, 2024\""), icon: "quote" }] },
      { k: "doc", id: "src", at: "b", look: "card", hide: true, pic: "clipboard-ok", title: t("Teacher's source card", "टीचर का स्रोत कार्ड"), sub: t("What was actually recorded", "असल में क्या दर्ज हुआ"),
        toks: [{ id: "o", t: t("Visible particles were removed", "दिखने वाले कण हटे"), icon: "check" }, { id: "n", t: t("No drinking-water test was done", "पीने के पानी की जाँच नहीं हुई"), icon: "x" }, { id: "no", t: t("No such reference found", "ऐसा कोई संदर्भ नहीं मिला"), icon: "search" }] },
    ],
    sc: [
      { gen: { focus: true, note: t("Tara opens the source card before adding the paragraph", "तारा पैराग्राफ़ जोड़ने से पहले स्रोत कार्ड खोलती है"), noteTone: "info" } },
      { src: { hide: false, focus: true, mark: { o: "ok", n: "warn", no: "risk" } }, gen: { focus: false, mark: { obs: "ok", safe: "risk", ref: "risk" }, note: t("Neel separates what was seen from what was claimed", "नील देखे गए को दावे से अलग करता है"), noteTone: "warn" } },
      { src: { focus: false }, gen: { hide: false, look: "card", title: t("Tara's checked rewrite", "तारा की जाँची हुई दोबारा लिखावट"), sub: t("Acknowledges the helper's role", "मददगार की भूमिका स्वीकारी"), mark: { obs: "ok", safe: "gone", ref: "gone" }, note: t("Observed result + the limitation, nothing more", "देखा गया नतीजा + सीमा, और कुछ नहीं"), noteTone: "ok" } },
      { gen: { mark: { obs: "ok", safe: "risk", ref: "risk" }, title: t("Text helper's paragraph", "टेक्स्ट मददगार का पैराग्राफ़"), sub: t("What can the guide responsibly say?", "गाइड ज़िम्मेदारी से क्या कह सकता है?"), look: "note", note: undefined } },
      { gen: { look: "card", title: t("Guide text", "गाइड का पाठ"), mark: { obs: "ok", safe: "gone", ref: "gone" }, note: t("Only particle removal, with its limit", "सिर्फ़ कण हटना, अपनी सीमा के साथ"), noteTone: "ok" } },
      { gen: { focus: true } },
    ],
    out: {
      "option-0": { gen: { mark: { obs: "ok", safe: "risk", ref: "gone" }, note: t("\"Safe to drink\" was never tested", "\"पीने लायक़\" की जाँच कभी हुई ही नहीं"), noteTone: "risk" } },
      "option-1": { gen: { look: "card", mark: { obs: "ok", safe: "gone", ref: "gone" }, note: t("Only particle removal, with its limit", "सिर्फ़ कण हटना, अपनी सीमा के साथ"), noteTone: "ok" } },
      "option-2": { gen: { mark: { obs: "ok", safe: "risk", ref: "risk" }, note: t("An invented citation copied into the guide", "गाइड में नक़ली संदर्भ उतर गया"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-ai-fair-helper", scene: "lab", layout: "two",
    label: t("Object helper · coloured drawings vs outline sketches", "वस्तु-मददगार · रंगीन चित्र बनाम रेखाचित्र"),
    art: [
      { k: "chart", id: "perf", at: "a", look: "bars", max: 4, title: t("Correct out of 4 checks", "4 जाँचों में सही"), icon: "bars",
        bars: [{ id: "col", t: t("Coloured", "रंगीन"), v: 3, tone: "ok" }, { id: "out", t: t("Outline", "रेखाचित्र"), v: 1, tone: "risk" }] },
      { k: "chart", id: "train", at: "b", look: "split", hide: true, title: t("What it trained on", "किस पर ट्रेन हुआ"), icon: "layers", parts: [{ t: t("coloured", "रंगीन"), v: 40, tone: "info" }, { t: t("outline", "रेखा"), v: 4, tone: "risk" }] },
    ],
    sc: [
      { perf: { focus: true, note: t("One overall total would hide this difference", "एक कुल संख्या यह फ़र्क़ छिपा देती"), noteTone: "warn" } },
      { train: { hide: false, focus: true, note: t("A coverage gap: a reason to investigate, not proof", "कवरेज की कमी: जाँच की वजह, सबूत नहीं"), noteTone: "warn" }, perf: { focus: false, note: undefined } },
      { train: { parts: [{ t: t("coloured", "रंगीन"), v: 40, tone: "info" }, { t: t("outline", "रेखा"), v: 28, tone: "ok" }], focus: false, note: t("Relevant checked outline examples added; people review the suggestions", "संबंधित जाँचे हुए रेखाचित्र जुड़े; लोग सुझाव जाँचते हैं"), noteTone: "ok" } },
      { perf: { note: t("Before wider use, what should happen?", "व्यापक उपयोग से पहले क्या हो?"), noteTone: "info" }, train: { parts: [{ t: t("coloured", "रंगीन"), v: 40, tone: "info" }, { t: t("outline", "रेखा"), v: 4, tone: "risk" }], note: undefined } },
      { train: { parts: [{ t: t("coloured", "रंगीन"), v: 40, tone: "info" }, { t: t("outline", "रेखा"), v: 28, tone: "ok" }] }, perf: { bars: [{ id: "col", t: t("Coloured", "रंगीन"), v: 3, tone: "ok" }, { id: "out", t: t("Outline", "रेखाचित्र"), v: 3, tone: "ok" }], note: t("Fresh checks for both styles — keep human review", "दोनों तरह की नई जाँचें — मानव समीक्षा बनी रहे"), noteTone: "ok" } },
      { perf: { focus: true } },
    ],
    out: {
      "option-0": { perf: { bars: [{ id: "col", t: t("Both styles (one total)", "दोनों (एक कुल)"), v: 4, tone: "warn" }, { id: "out", t: t("hidden", "छिपा"), v: 0, tone: "muted" }], note: t("A single total hides the poorer outline result", "एक कुल रेखाचित्र का कमज़ोर नतीजा छिपाता है"), noteTone: "risk" } },
      "option-1": { perf: { bars: [{ id: "col", t: t("Coloured", "रंगीन"), v: 3, tone: "ok" }, { id: "out", t: t("Outline (discarded)", "रेखा (हटाए)"), v: 0, tone: "muted" }], note: t("Dropping outlines doesn't make the helper fair", "रेखाचित्र हटाने से मददगार निष्पक्ष नहीं बनता"), noteTone: "risk" } },
      "option-2": { train: { hide: false, parts: [{ t: t("coloured", "रंगीन"), v: 40, tone: "info" }, { t: t("outline", "रेखा"), v: 28, tone: "ok" }] }, perf: { bars: [{ id: "col", t: t("Coloured", "रंगीन"), v: 3, tone: "ok" }, { id: "out", t: t("Outline", "रेखाचित्र"), v: 3, tone: "ok" }], note: t("Revise coverage, then test both styles again", "कवरेज सुधारें, फिर दोनों तरह फिर जाँचें"), noteTone: "ok" } },
    },
  },
];
