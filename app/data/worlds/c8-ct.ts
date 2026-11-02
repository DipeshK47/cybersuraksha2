import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class8CtWorlds: World[] = [
  {
    slug: "class8-break-mission", scene: "classroom", layout: "two",
    label: t("Discovery trail · three clue stations and back", "डिस्कवरी ट्रेल · तीन क्लू स्टेशन और वापसी"),
    art: [
      { k: "flow", id: "plan", at: "a", look: "steps", title: t("A dependent chain", "एक-दूसरे पर निर्भर श्रृंखला"), icon: "workflow", nodes: [{ id: "acc", t: t("Check access", "पहुँच जाँचें"), icon: "unlock", x: 12, y: 50 }, { id: "stn", t: t("Choose stations", "स्टेशन चुनें"), icon: "pin", x: 38, y: 50 }, { id: "rt", t: t("Draw a route", "रास्ता बनाएँ"), icon: "route", x: 64, y: 50 }, { id: "cards", t: t("Write clue cards", "क्लू कार्ड लिखें"), icon: "pencil", x: 90, y: 50 }], links: [{ from: "acc", to: "stn" }, { from: "stn", to: "rt" }, { from: "rt", to: "cards" }], state: { acc: "now", stn: "muted", rt: "muted", cards: "muted" } },
      { k: "table", id: "rooms", at: "b", title: t("What is available", "क्या उपलब्ध है"), icon: "map", cols: [t("Place", "जगह"), t("Stairs?", "सीढ़ियाँ?"), t("Available?", "उपलब्ध?")], rows: [{ id: "art", c: [t("Art room", "कला कक्ष"), t("no", "नहीं"), "✓"] }, { id: "lib", c: [t("Library", "लाइब्रेरी"), t("yes — upstairs", "हाँ — ऊपर"), "✓"] }, { id: "court", c: [t("Covered courtyard", "ढका आँगन"), t("no", "नहीं"), "✓"] }] },
    ],
    sc: [
      { plan: { focus: true, note: t("Tara and Imran: three clue stations, then back — and one visitor uses a wheelchair", "तारा और इमरान: तीन क्लू स्टेशन, फिर वापसी — और एक आगंतुक व्हीलचेयर पर है"), noteTone: "info" }, rooms: { mark: { lib: "risk" } } },
      { plan: { note: t("Inputs: a school map, twelve blank cards, two rooms and the courtyard", "इनपुट: स्कूल का नक़्शा, बारह ख़ाली कार्ड, दो कमरे और आँगन"), noteTone: "info" }, rooms: { mark: { lib: "risk", art: "ok", court: "ok" } } },
      { plan: { state: { acc: "done", stn: "now", rt: "muted", cards: "muted" }, cur: "stn", note: t("Writing every card at once seems quick — but a clue naming an unsuitable room gets redone", "सब कार्ड एक साथ लिखना तेज़ लगता है — पर अनुपयुक्त कमरे वाला क्लू दोबारा बनाना पड़ता है"), noteTone: "warn" } },
      { plan: { state: { acc: "now", stn: "muted", rt: "muted", cards: "muted" }, cur: "acc", note: t("What should happen before printing?", "छापने से पहले क्या हो?"), noteTone: "info" } },
      { plan: { state: { acc: "done", stn: "done", rt: "done", cards: "ok" }, cur: "cards", note: t("The art room closes — only the station changes, clue wording stays separate", "कला कक्ष बंद — सिर्फ़ स्टेशन बदलता है, क्लू के शब्द अलग रहते हैं"), noteTone: "ok" }, rooms: { mark: { art: "gone", lib: "gone", court: "ok" } } },
      { plan: { focus: true } },
    ],
    out: {
      print: { plan: { state: { acc: "muted", stn: "muted", rt: "muted", cards: "risk" }, note: t("Cards for every room — including ones that fail access", "हर कमरे के कार्ड — पहुँच में नाकाम कमरों के भी"), noteTone: "risk" }, rooms: { mark: { lib: "risk" } } },
      test: { plan: { state: { acc: "done", stn: "done", rt: "done", cards: "ok" }, cur: "cards", note: t("Accessible stations first, then test the route", "पहले सुगम स्टेशन, फिर रास्ते की जाँच"), noteTone: "ok" }, rooms: { mark: { art: "ok", court: "ok", lib: "gone" } } },
      stairs: { plan: { state: { acc: "muted", stn: "done", rt: "risk", cards: "muted" }, note: t("The shortest route with stairs fails a stated success condition", "सीढ़ियों वाला सबसे छोटा रास्ता तय शर्त पर नाकाम"), noteTone: "risk" }, rooms: { mark: { lib: "risk" } } },
    },
  },
  {
    slug: "class8-pattern-reason", scene: "classroom", layout: "two",
    label: t("Science corner displays · squares and cubes", "विज्ञान कोने के प्रदर्शन · वर्ग और घन"),
    art: [
      { k: "grid", id: "sq", at: "a", look: "pixels", w: 4, h: 4, title: t("Filled square of side n", "भुजा n का भरा वर्ग"), icon: "grid", on: [0] },
      { k: "seq", id: "count", at: "b", title: t("Tiles / small cubes", "टाइलें / छोटे घन"), icon: "calc", tiles: ["1", "4", "9", "?"], blank: [3], row2: [t("side 1", "भुजा 1"), t("side 2", "भुजा 2"), t("side 3", "भुजा 3"), t("side 4", "भुजा 4")], rule: t("Dev builds 1 tile, then 4 — Asha asks: just add three?", "देव 1 टाइल बनाता है, फिर 4 — आशा पूछती है: क्या बस तीन और जोड़ें?") },
    ],
    sc: [
      { sq: { on: [0, 1, 4, 5], focus: true }, count: { tiles: ["1", "4", "?", "?"], blank: [2, 3] } },
      { sq: { on: [0, 1, 2, 4, 5, 6, 8, 9, 10], note: t("Side three: three rows of three — a new row and column, their shared corner counted once", "भुजा तीन: तीन पंक्तियाँ, हर में तीन — नई पंक्ति और कॉलम, साझा कोना एक बार गिना"), noteTone: "info" }, count: { tiles: ["1", "4", "9", "?"], blank: [3], rule: t("n × n — not 'add three more'", "n × n — 'तीन और जोड़ना' नहीं") } },
      { sq: { focus: false, note: undefined }, count: { tiles: ["1", "8", "27", "64"], blank: [], rule: t("Solid cubes: side two = 2 layers of 2 × 2 = 8. The third multiplication is depth.", "ठोस घन: भुजा दो = 2 परतें 2 × 2 = 8। तीसरा गुणा गहराई है।"), mark: { 1: "hl" }, note: undefined } },
      { sq: { on: [0, 1, 2, 4, 5, 6, 8, 9, 10] }, count: { tiles: ["1", "4", "9", "?"], blank: [3], mark: {}, row2: [t("side 1", "भुजा 1"), t("side 2", "भुजा 2"), t("side 3", "भुजा 3"), t("side 4", "भुजा 4")], rule: t("Which rule counts a filled square of side n?", "भुजा n के भरे वर्ग की गिनती कौन-सा नियम करता है?") } },
      { sq: { on: Array.from({ length: 16 }, (_, i) => i), note: t("Side four: 16 tiles for the square, 64 small cubes for the cube", "भुजा चार: वर्ग के 16 टाइल, घन के 64 छोटे घन"), noteTone: "ok" }, count: { tiles: ["1", "4", "9", "16"], blank: [], mark: { 3: "ok" }, rule: t("A rule that fits the first example but fails later ones isn't the rule", "जो नियम पहले उदाहरण में बैठे पर बाद में नाकाम हो, वह नियम नहीं") } },
      { sq: { focus: true } },
    ],
    out: {
      add: { sq: { on: [0, 1, 2, 4, 5, 6] }, count: { tiles: ["2", "4", "6", "8"], blank: [], mark: { 2: "risk" }, rule: t("n + n gives 6 for side three — the square has 9", "n + n भुजा तीन पर 6 देता है — वर्ग में 9 हैं") } },
      square: { sq: { on: Array.from({ length: 16 }, (_, i) => i) }, count: { tiles: ["1", "4", "9", "16"], blank: [], mark: { 3: "ok" }, rule: t("n × n matches every square built", "n × n हर बने वर्ग से मेल खाता है") } },
      cube: { sq: { on: [0, 1, 2, 4, 5, 6, 8, 9, 10] }, count: { tiles: ["1", "8", "27", "64"], blank: [], mark: { 2: "risk" }, rule: t("n × n × n counts solid cubes, not a flat square", "n × n × n ठोस घन गिनता है, सपाट वर्ग नहीं") } },
    },
  },
  {
    slug: "class8-binary-messages", scene: "lab", layout: "two",
    label: t("Model weather station · eight lamps", "मॉडल मौसम केंद्र · आठ लैंप"),
    art: [
      { k: "grid", id: "lamps", at: "a", look: "lamps", w: 8, h: 1, title: t("Nila & Farhan's lamps", "नीला और फ़रहान के लैंप"), icon: "zap", foot: ["128", "64", "32", "16", "8", "4", "2", "1"], on: [] },
      { k: "doc", id: "ref", at: "b", hide: true, look: "receipt", pic: "clipboard", title: t("Reference card vs received", "संदर्भ कार्ड बनाम प्राप्त"), toks: [{ id: "ref", t: t("Reference: 26", "संदर्भ: 26"), icon: "check" }, { id: "got", t: t("Received pattern totals: 27", "प्राप्त पैटर्न का योग: 27"), icon: "alert" }] },
    ],
    sc: [
      { lamps: { focus: true, note: t("On = 1, off = 0. The same eight positions can show many numbers.", "चालू = 1, बंद = 0। वही आठ जगहें कई संख्याएँ दिखा सकती हैं।"), noteTone: "info" } },
      { lamps: { on: [4, 5, 7], note: t("Left to right: 128, 64, 32, 16, 8, 4, 2, 1 — add only the lamps that are on", "बाएँ से दाएँ: 128, 64, 32, 16, 8, 4, 2, 1 — सिर्फ़ जले लैंप जोड़ें"), noteTone: "info" } },
      { lamps: { on: [4, 5, 7], note: t("Thirteen = 8 + 4 + 1. Three lit lamps can mean different totals by position.", "तेरह = 8 + 4 + 1। तीन जले लैंप जगह के हिसाब से अलग योग हो सकते हैं।"), noteTone: "ok" } },
      { lamps: { on: [3, 4, 6, 7], note: t("The shared rule lets anyone decode it", "साझा नियम से कोई भी इसे पढ़ सकता है"), noteTone: "warn" }, ref: { hide: false, mark: { ref: "ok", got: "risk" }, note: t("Compare each position and find the extra 1-lamp", "हर जगह मिलाएँ और अतिरिक्त 1-वाला लैंप ढूँढें"), noteTone: "warn" } },
      { lamps: { on: [3, 4, 6], note: t("Repaired to 26 = 16 + 8 + 2 — a representation, not secrecy", "सुधरकर 26 = 16 + 8 + 2 — निरूपण है, गोपनीयता नहीं"), noteTone: "ok" }, ref: { mark: { ref: "ok", got: "ok" } } },
      { lamps: { focus: true } },
    ],
    out: {
      yes: { lamps: { on: [3, 4, 6], note: t("Zeros and ones are perfectly readable once the rule is shared", "नियम साझा होने पर शून्य और एक बिल्कुल पढ़े जा सकते हैं"), noteTone: "risk" } },
      no: { lamps: { on: [3, 4, 6], note: t("No — the shared rule lets others decode it", "नहीं — साझा नियम से दूसरे पढ़ सकते हैं"), noteTone: "ok" } },
      more: { lamps: { on: [0, 1, 2], note: t("Big numbers are still just sums of weights", "बड़ी संख्याएँ भी बस भारों के योग हैं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-fair-play-grid", scene: "arena", layout: "one",
    label: t("Sports club courtyard · square mats, a clear entrance lane", "खेल क्लब आँगन · चौकोर मैट, साफ़ प्रवेश-मार्ग"),
    art: [
      { k: "grid", id: "yard", look: "map", w: 6, h: 4, title: t("Row and column labels start at 1", "पंक्ति और कॉलम के लेबल 1 से शुरू"), icon: "grid", cells: { 18: { icon: "arrow", tone: "info" }, 19: { icon: "arrow", tone: "info" }, 20: { icon: "arrow", tone: "info" }, 21: { icon: "arrow", tone: "info" }, 22: { icon: "arrow", tone: "info" }, 23: { icon: "flag", tone: "info" } } },
    ],
    sc: [
      { yard: { focus: true, note: t("Each cell is one mat. The bottom row stays a clear lane from gate to far end.", "हर खाना एक मैट है। निचली पंक्ति गेट से दूर छोर तक साफ़ मार्ग रहती है।"), noteTone: "info" } },
      { yard: { path: [10], note: t("\"Row 2, column 5\" names exactly one cell — even when the paper is passed around", "\"पंक्ति 2, कॉलम 5\" ठीक एक खाना बताता है — काग़ज़ घूमे तो भी"), noteTone: "info" } },
      { yard: { path: [3, 4, 5, 9, 10, 11], note: t("First zone: six mats as two rows of three. A single strip of six has the same area but not the same shape.", "पहला ज़ोन: छह मैट, दो पंक्तियाँ तीन-तीन। छह की एक पट्टी का क्षेत्रफल वही पर आकार अलग।"), noteTone: "ok" } },
      { yard: { path: [4, 5, 10, 11, 16, 17], note: t("Quarter turn: three rows of two. What stays unchanged?", "चौथाई घुमाव: तीन पंक्तियाँ, दो-दो। क्या वही रहता है?"), noteTone: "info" } },
      { yard: { path: [4, 5, 10, 11, 16, 17], note: t("Area is still six cells; rows and columns swap. A mirror swaps left and right, rows stay.", "क्षेत्रफल अब भी छह खाने; पंक्तियाँ-कॉलम बदल जाते हैं। दर्पण बाएँ-दाएँ बदलता है, पंक्तियाँ वही।"), noteTone: "ok" } },
      { yard: { focus: true } },
    ],
    out: {
      area: { yard: { path: [4, 5, 10, 11, 16, 17], note: t("Still six cells", "अब भी छह खाने"), noteTone: "ok" } },
      rows: { yard: { path: [4, 5, 10, 11, 16, 17], cells: { 16: { icon: "x", tone: "risk" }, 17: { icon: "x", tone: "risk" } }, note: t("After a quarter turn it uses three rows, not two", "चौथाई घुमाव के बाद तीन पंक्तियाँ, दो नहीं"), noteTone: "risk" } },
      lane: { yard: { path: [4, 5, 10, 11, 16, 17, 22, 23], note: t("Turning doesn't automatically keep the lane clear — check it", "घुमाने से मार्ग अपने-आप साफ़ नहीं रहता — जाँचें"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-library-rules", scene: "library", layout: "two",
    label: t("Return cards · page count and cover damage", "वापसी कार्ड · पन्नों की गिनती और कवर की हालत"),
    art: [
      { k: "flow", id: "rule", at: "a", look: "graph", title: t("The shelf rule", "शेल्फ़ का नियम"), icon: "workflow", nodes: [{ id: "card", t: t("Return card", "वापसी कार्ड"), icon: "book", x: 10, y: 50 }, { id: "blank", t: t("Page count blank?", "पन्नों की गिनती ख़ाली?"), icon: "help", x: 36, y: 50 }, { id: "rev", t: t("Review", "समीक्षा"), icon: "search", x: 62, y: 14 }, { id: "test", t: t("pages ≤ 200 AND cover undamaged", "पन्ने ≤ 200 और कवर ठीक"), icon: "checks", x: 66, y: 78 }, { id: "shelf", t: t("Compact shelf", "कॉम्पैक्ट शेल्फ़"), icon: "box", x: 92, y: 50 }], links: [{ from: "card", to: "blank" }, { from: "blank", to: "rev", t: t("yes", "हाँ") }, { from: "blank", to: "test", t: t("no", "नहीं") }, { from: "test", to: "shelf", t: t("both", "दोनों") }, { from: "test", to: "rev", t: t("else", "वरना") }], state: { card: "now" } },
      { k: "table", id: "cards", at: "b", hide: true, title: t("Three traced cards", "तीन जाँचे कार्ड"), icon: "list", cols: [t("Card", "कार्ड"), t("Pages", "पन्ने"), t("Cover", "कवर"), t("Goes to", "कहाँ")], rows: [{ id: "a", c: [t("Short, intact", "छोटी, सही"), "120", t("fine", "ठीक"), "?"] }, { id: "b", c: [t("Short, damaged", "छोटी, क्षतिग्रस्त"), "90", t("torn", "फटा"), "?"] }, { id: "c", c: [t("Missing pages info", "पन्नों की जानकारी ग़ायब"), t("(blank)", "(ख़ाली)"), t("fine", "ठीक"), "?"] }] },
    ],
    sc: [
      { rule: { focus: true, note: t("No book moves automatically — learners trace the rule and tell the librarian", "कोई किताब अपने-आप नहीं चलती — विद्यार्थी नियम जाँचकर लाइब्रेरियन को बताते हैं"), noteTone: "info" } },
      { rule: { state: { card: "done", blank: "now", rev: "lit" }, link: { "blank>rev": "on", "blank>test": "off" }, cur: "blank", note: t("Blank isn't zero — unknown goes to review before any arithmetic", "ख़ाली का मतलब शून्य नहीं — अज्ञात गणित से पहले समीक्षा में जाता है"), noteTone: "warn" } },
      { rule: { state: { card: "done", blank: "done", test: "now", shelf: "lit" }, link: { "blank>rev": "off", "blank>test": "on", "test>shelf": "on", "test>rev": "on" }, cur: "test", note: t("A short damaged book still doesn't qualify — AND needs both", "छोटी पर क्षतिग्रस्त किताब भी योग्य नहीं — AND में दोनों चाहिए"), noteTone: "info" } },
      { rule: { state: { card: "now" }, cur: "card", link: {}, note: t("Which comparison means 'at most 200'?", "'अधिकतम 200' का मतलब कौन-सी तुलना है?"), noteTone: "info" } },
      { cards: { hide: false, focus: true, txt: { "a:3": t("compact shelf", "कॉम्पैक्ट शेल्फ़"), "b:3": t("review (damaged)", "समीक्षा (क्षतिग्रस्त)"), "c:3": t("review (unknown)", "समीक्षा (अज्ञात)") }, mark: { a: "ok", b: "warn", c: "warn" }, note: t("Three cards, three different reasons for their outputs", "तीन कार्ड, उनके नतीजों के तीन अलग कारण"), noteTone: "ok" }, rule: { focus: false } },
      { cards: { focus: true } },
    ],
    out: {
      lt: { rule: { state: { test: "risk" }, note: t("pages < 200 would refuse a 200-page book that qualifies", "pages < 200 एक योग्य 200-पन्नों की किताब को मना कर देगा"), noteTone: "risk" } },
      le: { rule: { state: { test: "ok" }, note: t("pages ≤ 200 includes 200 itself", "pages ≤ 200 में ख़ुद 200 भी शामिल"), noteTone: "ok" } },
      ge: { rule: { state: { test: "risk" }, note: t("≥ 200 means 200 or more — the opposite direction", "≥ 200 का मतलब 200 या ज़्यादा — उलटी दिशा"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-garden-loops", scene: "garden", layout: "two",
    label: t("On-screen garden helper · two water tokens per planter", "स्क्रीन पर बाग़ मददगार · हर गमले को दो पानी-टोकन"),
    art: [
      { k: "table", id: "trace", at: "a", title: t("Trace of the loop", "लूप का ट्रेस"), icon: "list", upTo: 0, cols: [t("Repetition", "दोहराव"), t("done before", "पहले done"), t("water total", "पानी का कुल")], rows: [{ id: "r1", c: ["1", "0", "2"] }, { id: "r2", c: ["2", "1", "4"] }, { id: "r3", c: ["3", "2", "6"] }], foot: t("Before each repetition: is done < number of planters?", "हर दोहराव से पहले: क्या done < गमलों की संख्या?") },
      { k: "flow", id: "loop", at: "b", look: "graph", title: t("One body, repeated", "एक बॉडी, दोहराई गई"), icon: "repeat", nodes: [{ id: "chk", t: t("done < planters?", "done < गमले?"), icon: "help", x: 50, y: 14 }, { id: "wat", t: t("Water: +2 tokens", "पानी: +2 टोकन"), icon: "droplets", x: 82, y: 50 }, { id: "inc", t: t("done = done + 1", "done = done + 1"), icon: "plus", x: 50, y: 86 }, { id: "end", t: t("Stop", "रुकें"), icon: "check", x: 14, y: 50 }], links: [{ from: "chk", to: "wat", t: t("yes", "हाँ") }, { from: "wat", to: "inc" }, { from: "inc", to: "chk" }, { from: "chk", to: "end", t: t("no", "नहीं") }], state: { chk: "now" } },
    ],
    sc: [
      { trace: { upTo: 0, focus: true, note: t("A simulation: nothing here controls a real pump or plant", "यह सिमुलेशन है: यहाँ कुछ असली पंप या पौधे को नहीं चलाता"), noteTone: "info" } },
      { loop: { focus: true, note: t("\"water, move, water, move\" hides mistakes — one counted body repeats", "\"पानी, चलो, पानी, चलो\" ग़लतियाँ छिपाता है — एक गिना हुआ हिस्सा दोहराया जाता है"), noteTone: "info" }, trace: { focus: false } },
      { trace: { upTo: 3, note: t("Counter 'done' starts at 0; check before each repetition", "काउंटर 'done' 0 से शुरू; हर दोहराव से पहले जाँच"), noteTone: "info" }, loop: { focus: false, cur: "wat", state: { chk: "done", wat: "now" }, note: undefined } },
      { trace: { upTo: 3 }, loop: { cur: "inc", state: { chk: "done", wat: "done", inc: "now" }, note: t("How should the counter be repaired?", "काउंटर कैसे सुधारें?"), noteTone: "info" } },
      { trace: { upTo: 3, mark: { r1: "ok", r2: "ok", r3: "ok" }, note: t("Three planters: 2, 4, 6. One planter: once. An empty row: zero times.", "तीन गमले: 2, 4, 6। एक गमला: एक बार। ख़ाली पंक्ति: शून्य बार।"), noteTone: "ok" }, loop: { cur: "end", state: { chk: "done", wat: "done", inc: "done", end: "ok" } } },
      { loop: { focus: true } },
    ],
    out: {
      inside: { loop: { state: { chk: "done", wat: "done", inc: "ok" }, link: {}, note: t("Increase done by one inside the loop", "लूप के भीतर done एक बढ़ाएँ"), noteTone: "ok" } },
      water: { loop: { state: { chk: "now", wat: "risk", inc: "muted" }, note: t("An extra water action outside doesn't update the counter", "बाहर अतिरिक्त पानी देने से काउंटर नहीं बढ़ता"), noteTone: "risk" } },
      zero: { loop: { state: { chk: "risk", inc: "risk" }, link: { "inc>chk": "bad" }, note: t("Resetting to zero each time makes the loop run forever", "हर बार शून्य करने से लूप कभी नहीं रुकता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-share-supplies", scene: "classroom", layout: "two",
    label: t("Model-building packs · scale the recipe", "मॉडल-निर्माण पैक · नुस्ख़े को बढ़ाएँ"),
    art: [
      { k: "table", id: "scale", at: "a", title: t("Four learners → twelve learners", "चार विद्यार्थी → बारह विद्यार्थी"), icon: "scale", cols: [t("Material", "सामग्री"), t("4 learners", "4 विद्यार्थी"), t("12 learners", "12 विद्यार्थी")], rows: [{ id: "rods", c: [t("Reusable rods", "दोबारा इस्तेमाल होने वाली छड़ें"), "6", "?"] }, { id: "clips", c: [t("Clips", "क्लिप"), "8", "?"] }], foot: t("Same recipe: multiply both by 3 — adding 3 changes the ratio", "वही नुस्ख़ा: दोनों को 3 से गुणा — 3 जोड़ने से अनुपात बदलता है") },
      { k: "chart", id: "share", at: "b", hide: true, look: "split", title: t("17 whole rods, three teams", "17 पूरी छड़ें, तीन टीमें"), icon: "layers", parts: [{ t: t("team 1", "टीम 1"), v: 5, tone: "info" }, { t: t("team 2", "टीम 2"), v: 5, tone: "info" }, { t: t("team 3", "टीम 3"), v: 5, tone: "info" }, { t: t("reserve", "रिज़र्व"), v: 2, tone: "warn" }] },
    ],
    sc: [
      { scale: { focus: true, note: t("Four learners need six rods and eight clips — larger groups need adjusted supplies", "चार विद्यार्थियों को छह छड़ें और आठ क्लिप चाहिए — बड़े समूहों को समायोजित सामान"), noteTone: "info" } },
      { scale: { txt: { "rods:2": "18", "clips:2": "24" }, mark: { rods: "ok", clips: "ok" }, note: t("Twelve = 4 × 3, so multiply both: 18 rods, 24 clips", "बारह = 4 × 3, इसलिए दोनों को गुणा: 18 छड़ें, 24 क्लिप"), noteTone: "ok" } },
      { scale: { txt: { "rods:2": "18", "clips:2": "24" }, note: t("Compare equal quantities — a cheaper pack may cost more per clip; whole packs must fit the budget", "बराबर मात्रा की तुलना करें — सस्ता पैक प्रति क्लिप महँगा हो सकता है; पूरे पैक बजट में आएँ"), noteTone: "warn" } },
      { scale: { focus: false, note: undefined }, share: { hide: false, focus: true, note: t("How should 17 whole rods be shared under this agreement?", "इस समझौते में 17 पूरी छड़ें कैसे बाँटें?"), noteTone: "info" } },
      { share: { note: t("5 + 5 + 5 + 2 = 17 — no rod disappears through rounding", "5 + 5 + 5 + 2 = 17 — राउंडिंग से कोई छड़ ग़ायब नहीं"), noteTone: "ok" } },
      { share: { focus: true } },
    ],
    out: {
      fraction: { share: { hide: false, parts: [{ t: t("each ≈ 5.67 (cut)", "हर एक ≈ 5.67 (कटी)"), v: 17, tone: "risk" }], note: t("Cutting rods breaks whole-rod sharing", "छड़ें काटने से पूरी छड़ें बाँटना टूटता है"), noteTone: "risk" } },
      reserve: { share: { hide: false, parts: [{ t: t("team 1", "टीम 1"), v: 5, tone: "info" }, { t: t("team 2", "टीम 2"), v: 5, tone: "info" }, { t: t("team 3", "टीम 3"), v: 5, tone: "info" }, { t: t("reserve", "रिज़र्व"), v: 2, tone: "warn" }], note: t("5 each and reserve 2", "हर एक को 5 और 2 रिज़र्व"), noteTone: "ok" } },
      round: { share: { hide: false, parts: [{ t: t("team 1", "टीम 1"), v: 6, tone: "risk" }, { t: t("team 2", "टीम 2"), v: 6, tone: "risk" }, { t: t("team 3", "टीम 3"), v: 6, tone: "risk" }], note: t("6 × 3 = 18 — one more than we have", "6 × 3 = 18 — हमारे पास से एक ज़्यादा"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-rescue-robot", scene: "lab", layout: "one",
    label: t("Flood-relief robot · a screen model for planning and testing", "बाढ़-राहत रोबोट · योजना और जाँच का स्क्रीन मॉडल"),
    art: [
      { k: "grid", id: "map", look: "map", w: 5, h: 4, title: t("Collect the box, then deliver within 8 moves", "बक्सा लें, फिर 8 चालों में पहुँचाएँ"), icon: "route", me: 0, goal: 19, walls: [6, 11], cells: { 8: { icon: "box", tone: "warn" } } },
    ],
    sc: [
      { map: { focus: true, note: t("A teaching model: real rescue decisions need trained people", "सिखाने वाला मॉडल: असली बचाव फ़ैसले प्रशिक्षित लोग लेते हैं"), noteTone: "info" } },
      { map: { path: [0, 1], note: t("One cell up, down, left or right — no diagonals — and within the move limit", "एक खाना ऊपर, नीचे, बाएँ या दाएँ — तिरछा नहीं — और चाल-सीमा के भीतर"), noteTone: "info" } },
      { map: { path: [0, 1, 2, 3, 8, 13, 18, 19], note: t("Leela writes the expected result first, then traces the route cell by cell", "लीला पहले अपेक्षित नतीजा लिखती है, फिर रास्ता खाने-खाने जाँचती है"), noteTone: "ok" } },
      { map: { path: [0, 1, 2, 3, 4, 9, 14, 19], note: t("This route reaches the goal but misses the box", "यह रास्ता लक्ष्य तक पहुँचता है पर बक्सा चूक जाता है"), noteTone: "warn" } },
      { map: { walls: [6, 11, 3], path: [0, 1, 2, 7, 8, 13, 18, 19], note: t("A new blocked cell breaks yesterday's route — find the first affected move and detour, keep every rule", "नया बंद खाना कल का रास्ता तोड़ता है — पहली प्रभावित चाल ढूँढें और मोड़ लें, हर नियम रखें"), noteTone: "ok" } },
      { map: { focus: true } },
    ],
    out: {
      finish: { map: { path: [0, 1, 2, 3, 4, 9, 14, 19], cells: { 8: { icon: "box", tone: "risk" } }, note: t("The last square is right — the box was missed", "आख़िरी खाना सही है — बक्सा छूट गया"), noteTone: "risk" } },
      revise: { map: { path: [0, 1, 2, 3, 8, 13, 18, 19], cells: { 8: { icon: "box", tone: "ok" } }, note: t("Revise to visit the box, then retest", "बक्से तक जाने के लिए सुधारें, फिर जाँचें"), noteTone: "ok" } },
      ignore: { map: { path: [0, 1, 2, 3, 4, 9, 14, 19], cells: { 8: { icon: "x", tone: "risk" } }, note: t("Removing the rule after running hides the failure", "चलाने के बाद नियम हटाना नाकामी छिपाना है"), noteTone: "risk" } },
    },
  },
];
