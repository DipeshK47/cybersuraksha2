import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class7CtWorlds: World[] = [
  {
    slug: "class7-model-what-matters", scene: "lab", layout: "two",
    label: t("Makers-fair room · a trolley route", "मेकर्स-फ़ेयर कमरा · ट्रॉली का रास्ता"),
    art: [
      { k: "grid", id: "room", at: "a", look: "map", w: 6, h: 4, title: t("Neel's drawing of the room", "नील का बनाया कमरे का चित्र"), icon: "map",
        walls: [3, 9, 15, 21], cells: { 1: { icon: "sparkles", tone: "info" }, 4: { icon: "sparkles", tone: "info" }, 13: { icon: "sparkles", tone: "info" }, 19: { icon: "sparkles", tone: "info" }, 8: { icon: "box", tone: "warn" } }, me: 6, goal: 11 },
      { k: "doc", id: "keep", at: "b", look: "card", pic: "target", title: t("What the model keeps", "मॉडल क्या रखता है"), sub: t("Goal: can the trolley reach the table?", "लक्ष्य: क्या ट्रॉली मेज़ तक पहुँचेगी?"),
        toks: [{ id: "door", t: t("Entrance width", "प्रवेश की चौड़ाई"), icon: "unlock" }, { id: "troll", t: t("Trolley width", "ट्रॉली की चौड़ाई"), icon: "truck" }, { id: "obs", t: t("Obstacles on the way", "रास्ते की रुकावटें"), icon: "box" }, { id: "dest", t: t("Destination table", "गंतव्य मेज़"), icon: "flag" }, { id: "paint", t: t("Wall colour", "दीवार का रंग"), icon: "drops" }, { id: "addr", t: t("Visitors' private addresses", "आगंतुकों के निजी पते"), icon: "home" }] },
    ],
    sc: [
      { room: { focus: true, note: t("Every decoration drawn — but the narrow entrance is missing", "हर सजावट बनी — पर तंग प्रवेश ग़ायब"), noteTone: "warn" }, keep: { hide: true } },
      { keep: { hide: false, mark: { door: "ok", troll: "ok", obs: "ok", dest: "ok", paint: "warn" }, note: t("The detail that decides whether it fits matters; wall colour doesn't", "जो ब्योरा तय करता है कि ट्रॉली जाएगी या नहीं, वही मायने रखता है; दीवार का रंग नहीं"), noteTone: "info" }, room: { walls: [3, 15, 21], cells: { 9: { icon: "unlock", tone: "ok" }, 1: { icon: "sparkles", tone: "muted" }, 4: { icon: "sparkles", tone: "muted" }, 13: { icon: "sparkles", tone: "muted" }, 19: { icon: "sparkles", tone: "muted" }, 8: { icon: "box", tone: "warn" } }, note: undefined, focus: false } },
      { keep: { mark: { door: "gone", troll: "gone", obs: "gone", dest: "hl", paint: "hl", addr: "hide" }, note: t("New job: visitors must find the art display — labels and landmarks matter now", "नया काम: आगंतुकों को कला-प्रदर्शनी ढूँढनी है — अब लेबल और पहचान-चिह्न मायने रखते हैं"), noteTone: "info" }, room: { cells: { 9: { icon: "unlock", tone: "muted" }, 5: { icon: "image", tone: "info" } }, goal: 5 } },
      { keep: { mark: { door: "ok", troll: "ok", obs: "ok", dest: "ok", paint: "warn", addr: "none" }, note: t("Back to the trolley goal: which detail must the model include?", "ट्रॉली के लक्ष्य पर वापस: मॉडल में कौन-सा ब्योरा ज़रूर हो?"), noteTone: "info" }, room: { goal: 11, cells: { 9: { icon: "unlock", tone: "ok" }, 8: { icon: "box", tone: "warn" } } } },
      { keep: { mark: { door: "ok", troll: "ok", obs: "ok", dest: "ok", paint: "gone", addr: "gone" }, note: t("Entrance + trolley widths + obstacles + destination", "प्रवेश + ट्रॉली की चौड़ाई + रुकावटें + गंतव्य"), noteTone: "ok" }, room: { path: [6, 7, 8, 9, 10, 11], note: t("The trolley fits through the entrance", "ट्रॉली प्रवेश से निकल जाती है"), noteTone: "ok" } },
      { room: { focus: true } },
    ],
    out: {
      "option-0": { keep: { mark: { door: "gone", troll: "gone", paint: "ok", addr: "gone" }, note: t("Decorative accuracy can't replace a deciding constraint", "सजावट की सटीकता निर्णायक शर्त की जगह नहीं ले सकती"), noteTone: "risk" }, room: { walls: [3, 9, 15, 21], cells: { 1: { icon: "sparkles", tone: "info" }, 4: { icon: "sparkles", tone: "info" }, 13: { icon: "sparkles", tone: "info" }, 19: { icon: "sparkles", tone: "info" } }, path: [] } },
      "option-1": { keep: { mark: { door: "ok", troll: "ok", obs: "ok", dest: "ok", paint: "gone", addr: "gone" } }, room: { path: [6, 7, 8, 9, 10, 11], note: t("The trolley fits through the entrance", "ट्रॉली प्रवेश से निकल जाती है"), noteTone: "ok" } },
      "option-2": { keep: { mark: { addr: "risk", door: "gone", troll: "gone" }, note: t("Private addresses don't help a trolley route — and shouldn't be here", "निजी पते ट्रॉली के रास्ते में काम नहीं आते — और यहाँ होने भी नहीं चाहिए"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-test-a-pattern", scene: "lab", layout: "two",
    label: t("Tile strips · start with three, add two", "टाइल पट्टियाँ · तीन से शुरू, दो जोड़ें"),
    art: [
      { k: "seq", id: "stages", at: "a", title: t("Tiles at each stage", "हर चरण में टाइलें"), icon: "grid", tiles: ["3", "5", "7", "?"], blank: [3], row2: [t("stage 1", "चरण 1"), t("stage 2", "चरण 2"), t("stage 3", "चरण 3"), t("stage 4", "चरण 4")], rule: t("What comes next?", "आगे क्या आएगा?") },
      { k: "chart", id: "growth", at: "b", look: "bars", max: 14, title: t("How the strip grows", "पट्टी कैसे बढ़ती है"), icon: "bars", bars: [{ id: "1", t: "1", v: 3, tone: "info" }, { id: "2", t: "2", v: 5, tone: "info" }, { id: "3", t: "3", v: 7, tone: "info" }] },
    ],
    sc: [
      { stages: { focus: true, note: t("Neel: double the previous count! But 3 → 5 isn't doubling.", "नील: पिछली गिनती दुगुनी करो! पर 3 → 5 दुगुना नहीं है।"), noteTone: "warn" } },
      { stages: { rule: t("Construction rule: start at 3, add 2 each stage", "बनाने का नियम: 3 से शुरू, हर चरण में 2 जोड़ें"), mark: { 1: "ok", 2: "ok" }, note: undefined, focus: false } },
      { stages: { tiles: ["3", "5", "7", "9", "12"], blank: [], mark: { 4: "risk" }, row2: ["1", "2", "3", "4", t("claimed", "दावा")], rule: t("Teacher's claim: 12 after 9 — the rule gives 11", "टीचर का दावा: 9 के बाद 12 — नियम से 11 आता है"), note: t("A counterexample is evidence — keep the mismatch in the record", "प्रतिउदाहरण सबूत है — मेल न खाने को रिकॉर्ड में रखें"), noteTone: "warn" }, growth: { bars: [{ id: "1", t: "1", v: 3, tone: "info" }, { id: "2", t: "2", v: 5, tone: "info" }, { id: "3", t: "3", v: 7, tone: "info" }, { id: "4", t: "4", v: 9, tone: "info" }, { id: "5", t: t("claim", "दावा"), v: 12, tone: "risk" }] } },
      { stages: { tiles: ["3", "5", "7", "?"], blank: [3], mark: {}, row2: ["1", "2", "3", "4"], rule: t("What follows seven under the supplied rule?", "दिए गए नियम में सात के बाद क्या?"), note: undefined }, growth: { bars: [{ id: "1", t: "1", v: 3, tone: "info" }, { id: "2", t: "2", v: 5, tone: "info" }, { id: "3", t: "3", v: 7, tone: "info" }] } },
      { stages: { tiles: ["3", "5", "7", "9"], blank: [], mark: { 3: "ok" }, note: t("Nine — it follows the add-two instruction", "नौ — यह \"दो जोड़ो\" निर्देश से आता है"), noteTone: "ok" }, growth: { bars: [{ id: "1", t: "1", v: 3, tone: "info" }, { id: "2", t: "2", v: 5, tone: "info" }, { id: "3", t: "3", v: 7, tone: "info" }, { id: "4", t: "4", v: 9, tone: "ok" }] } },
      { stages: { focus: true } },
    ],
    out: {
      "option-0": { stages: { tiles: ["3", "5", "7", "9"], blank: [], mark: { 3: "ok" }, note: t("Nine fits the rule", "नौ नियम में बैठता है"), noteTone: "ok" }, growth: { bars: [{ id: "1", t: "1", v: 3, tone: "info" }, { id: "2", t: "2", v: 5, tone: "info" }, { id: "3", t: "3", v: 7, tone: "info" }, { id: "4", t: "4", v: 9, tone: "ok" }] } },
      "option-1": { stages: { tiles: ["3", "5", "7", "14"], blank: [], mark: { 3: "risk" }, note: t("Doubling contradicts the earlier stages too", "दुगुना करना पिछले चरणों से भी मेल नहीं खाता"), noteTone: "risk" }, growth: { bars: [{ id: "1", t: "1", v: 3, tone: "info" }, { id: "2", t: "2", v: 5, tone: "info" }, { id: "3", t: "3", v: 7, tone: "info" }, { id: "4", t: "4", v: 14, tone: "risk" }] } },
      "option-2": { stages: { tiles: ["3", "5", "7", "?"], blank: [3], mark: { 3: "warn" }, note: t("The instruction does pick one answer", "निर्देश एक ही उत्तर तय करता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-message-with-bits", scene: "lab", layout: "two",
    label: t("Signal board · eight lamps", "सिग्नल बोर्ड · आठ लैंप"),
    art: [
      { k: "grid", id: "lamps", at: "a", look: "lamps", w: 8, h: 1, title: t("Tara's lamps", "तारा के लैंप"), icon: "zap", foot: ["128", "64", "32", "16", "8", "4", "2", "1"], on: [] },
      { k: "doc", id: "rule", at: "b", hide: true, look: "note", pic: "binary", title: t("Public encoding rule", "सार्वजनिक एनकोडिंग नियम"), sub: t("Pinned on the board for everyone", "बोर्ड पर सबके लिए लगा है"),
        toks: [{ id: "w", t: t("Number = sum of lamps that are on", "संख्या = जले हुए लैंपों का योग"), icon: "sigma" }, { id: "p", t: t("Anyone who knows the rule can read it", "जो नियम जानता है वह पढ़ सकता है"), icon: "eye" }] },
    ],
    sc: [
      { lamps: { focus: true, note: t("Each lamp is one bit: off or on — with its own weight", "हर लैंप एक बिट: बंद या चालू — अपने वज़न के साथ"), noteTone: "info" } },
      { lamps: { on: [5, 7], note: t("5 = 4 + 1 · then 10 = 8 + 2", "5 = 4 + 1 · फिर 10 = 8 + 2"), noteTone: "ok" } },
      { lamps: { on: [4, 6], note: t("10 = 8 + 2 — the team agrees the encoding first", "10 = 8 + 2 — पहले टीम एनकोडिंग तय करती है"), noteTone: "ok" }, rule: { hide: false, focus: true } },
      { lamps: { on: [3, 6, 7], note: t("19 = 16 + 2 + 1 — readable by anyone with the rule", "19 = 16 + 2 + 1 — नियम जानने वाला कोई भी पढ़ सकता है"), noteTone: "info" }, rule: { focus: false } },
      { rule: { mark: { p: "ok" }, note: t("A representation rule, not encryption", "यह निरूपण का नियम है, एन्क्रिप्शन नहीं"), noteTone: "ok" } },
      { lamps: { focus: true } },
    ],
    out: {
      "option-0": { rule: { mark: { p: "risk" }, note: t("Unfamiliar symbols aren't protection once the rule is public", "नियम सार्वजनिक हो तो अनजाने चिह्न सुरक्षा नहीं देते"), noteTone: "risk" } },
      "option-1": { lamps: { on: [0, 1, 2, 3, 4, 5, 6, 7], note: t("More lamps just means bigger numbers, not secrecy", "ज़्यादा लैंप का मतलब बड़ी संख्याएँ है, गोपनीयता नहीं"), noteTone: "risk" } },
      "option-2": { rule: { mark: { p: "ok" }, note: t("No — it is a readable encoding", "नहीं — यह पढ़ने योग्य एनकोडिंग है"), noteTone: "ok" } },
    },
  },
  {
    slug: "class7-two-conditions", scene: "lab", layout: "two",
    label: t("Field-kit loans · permission AND training", "फ़ील्ड-किट उधार · अनुमति और प्रशिक्षण"),
    art: [
      { k: "flow", id: "gate", at: "a", look: "graph", title: t("The kit rule", "किट का नियम"), icon: "workflow",
        nodes: [{ id: "perm", t: t("Permission", "अनुमति"), icon: "check", x: 16, y: 25, sub: "yes" }, { id: "train", t: t("Training done", "प्रशिक्षण पूरा"), icon: "book-open", x: 16, y: 75, sub: "no" }, { id: "and", t: "AND", icon: "workflow", x: 52, y: 50 }, { id: "lend", t: t("Lend the kit", "किट दें"), icon: "box", x: 86, y: 50 }],
        links: [{ from: "perm", to: "and" }, { from: "train", to: "and" }, { from: "and", to: "lend" }], state: { perm: "ok", train: "risk", and: "now", lend: "muted" }, link: { "train>and": "bad", "and>lend": "off" } },
      { k: "table", id: "cards", at: "b", title: t("Loan cards", "उधार कार्ड"), icon: "clipboard",
        cols: [t("Card", "कार्ड"), t("Permission", "अनुमति"), t("Training", "प्रशिक्षण"), t("AND", "AND"), t("OR (badge)", "OR (बैज)")],
        rows: [{ id: "k1", c: ["1", "yes", "yes", "—", "—"] }, { id: "k2", c: ["2", "yes", "no", "—", "—"] }, { id: "k3", c: ["3", "yes", t("(blank)", "(खाली)"), "—", "—"] }] },
    ],
    sc: [
      { gate: { focus: true, note: t("Neel sees permission and approves — without reading training", "नील को अनुमति दिखी और उसने प्रशिक्षण पढ़े बिना मंज़ूर कर दिया"), noteTone: "warn" } },
      { gate: { focus: false, note: undefined }, cards: { txt: { "k1:3": "✓ lend", "k2:3": "✗", "k3:3": t("review", "जाँचें") }, mark: { k1: "ok", k2: "risk", k3: "warn" }, note: t("AND needs both true — a blank card goes aside for review", "AND में दोनों सही चाहिए — खाली कार्ड जाँच के लिए अलग"), noteTone: "info" } },
      { cards: { txt: { "k1:3": "✓ lend", "k2:3": "✗", "k3:3": t("review", "जाँचें"), "k1:4": "✓", "k2:4": "✓", "k3:4": "✓" }, note: t("A separate badge rule uses OR: a drawing or a poem is enough", "बैज का अलग नियम OR का है: चित्र या कविता काफ़ी है"), noteTone: "info" } },
      { cards: { note: undefined }, gate: { note: t("Permission yes, training no. Can the kit be lent?", "अनुमति हाँ, प्रशिक्षण नहीं। क्या किट दी जा सकती है?"), noteTone: "warn" } },
      { gate: { link: { "train>and": "bad", "and>lend": "off" }, state: { lend: "muted", and: "bad" }, note: t("No — the training condition is false, so AND isn't satisfied", "नहीं — प्रशिक्षण वाली शर्त ग़लत है, इसलिए AND पूरा नहीं होता"), noteTone: "ok" } },
      { gate: { focus: true } },
    ],
    out: {
      "option-0": { gate: { link: { "train>and": "on", "and>lend": "on" }, state: { lend: "risk", and: "risk", train: "risk" }, note: t("One true condition does not make AND true", "एक सही शर्त से AND सही नहीं होता"), noteTone: "risk" } },
      "option-1": { gate: { link: { "train>and": "bad", "and>lend": "off" }, state: { lend: "muted", and: "bad" }, note: t("Both conditions are required", "दोनों शर्तें ज़रूरी हैं"), noteTone: "ok" } },
      "option-2": { gate: { state: { train: "risk", lend: "risk" }, link: { "train>and": "on", "and>lend": "on" }, note: t("Changing the record doesn't change what happened", "रिकॉर्ड बदलने से जो हुआ वह नहीं बदलता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-loops-and-totals", scene: "lab", layout: "two",
    label: t("Supply packs · a counter that changes", "सप्लाई पैक · बदलता हुआ काउंटर"),
    art: [
      { k: "seq", id: "ctr", at: "a", title: t("Current total after each pack", "हर पैक के बाद मौजूदा कुल"), icon: "calc", tiles: ["1", "?", "?", "?", "?"], blank: [1, 2, 3, 4], row2: [t("start", "शुरू"), "+2", "+2", "+2", "+2"], rule: t("Record the current total first", "पहले मौजूदा कुल लिखो") },
      { k: "chart", id: "kinds", at: "b", look: "split", hide: true, title: t("Two different numbers", "दो अलग संख्याएँ"), icon: "pie", parts: [{ t: t("repetitions (actions)", "दोहराव (क्रियाएँ)"), v: 4, tone: "info" }, { t: t("final total (state)", "अंतिम कुल (अवस्था)"), v: 9, tone: "ok" }] },
    ],
    sc: [
      { ctr: { tiles: ["1", "2", "?", "?", "?"], blank: [2, 3, 4], mark: { 1: "risk" }, note: t("Neel wrote 2 after pack one — he forgot the starting 1", "नील ने पहले पैक के बाद 2 लिखा — शुरुआती 1 भूल गया"), noteTone: "warn", focus: true } },
      { ctr: { tiles: ["1", "3", "5", "7", "9"], blank: [], mark: { 1: "ok", 2: "ok", 3: "ok", 4: "ok" }, note: undefined, focus: false }, kinds: { hide: false, focus: true, note: t("Four counts the actions; nine is the final state", "चार क्रियाएँ गिनता है; नौ अंतिम अवस्था है"), noteTone: "info" } },
      { kinds: { focus: false, note: undefined }, ctr: { tiles: ["1"], mark: {}, row2: [t("0 repeats", "0 दोहराव")], rule: t("Boundary check: with no updates the start stays 1", "सीमा-जाँच: बिना अपडेट के शुरुआती 1 ही रहता है"), note: t("Then one repetition: 1 → 3", "फिर एक दोहराव: 1 → 3"), noteTone: "info" } },
      { ctr: { tiles: ["1", "?", "?", "?", "?"], blank: [1, 2, 3, 4], row2: [t("start", "शुरू"), "+2", "+2", "+2", "+2"], rule: t("What is the total after four add-two updates from one?", "एक से चार बार दो जोड़ने पर कुल क्या?"), note: undefined } },
      { ctr: { tiles: ["1", "3", "5", "7", "9"], blank: [], mark: { 4: "ok" }, note: t("Nine: 1 → 3 → 5 → 7 → 9. Four counts the updates.", "नौ: 1 → 3 → 5 → 7 → 9। चार अपडेट गिनता है।"), noteTone: "ok" } },
      { ctr: { focus: true } },
    ],
    out: {
      "option-0": { ctr: { tiles: ["1", "3", "5", "7", "8"], blank: [], mark: { 4: "risk" }, note: t("Eight skips the starting value", "आठ शुरुआती मान को छोड़ देता है"), noteTone: "risk" } },
      "option-1": { ctr: { tiles: ["1", "3", "5", "7", "4"], blank: [], mark: { 4: "risk" }, note: t("Four is how many updates, not the total", "चार अपडेट की गिनती है, कुल नहीं"), noteTone: "risk" } },
      "option-2": { ctr: { tiles: ["1", "3", "5", "7", "9"], blank: [], mark: { 4: "ok" }, note: t("Nine is the final state", "नौ अंतिम अवस्था है"), noteTone: "ok" } },
    },
  },
  {
    slug: "class7-ordered-list", scene: "lab", layout: "two",
    label: t("Fictional book cards · sort by pages", "काल्पनिक पुस्तक कार्ड · पन्नों से छाँटें"),
    art: [
      { k: "seq", id: "cards", at: "a", title: t("Card order", "कार्ड का क्रम"), icon: "list", tiles: [t("A · 4 pages", "A · 4 पन्ने"), t("B · 2 pages", "B · 2 पन्ने"), t("C · 6 pages", "C · 6 पन्ने")], rule: t("Request: smallest to largest page count", "अनुरोध: पन्नों की गिनती छोटे से बड़े") },
      { k: "chart", id: "pages", at: "b", look: "bars", max: 6, title: t("Pages", "पन्ने"), icon: "bars", bars: [{ id: "a", t: "A", v: 4, tone: "info" }, { id: "b", t: "B", v: 2, tone: "info" }, { id: "c", t: "C", v: 6, tone: "info" }] },
    ],
    sc: [
      { cards: { mark: { 0: "warn", 1: "warn", 2: "warn" }, note: t("Neel sorted by letter. The request was page count.", "नील ने अक्षर से छाँटा। अनुरोध पन्नों की गिनती का था।"), noteTone: "warn", focus: true } },
      { cards: { tiles: [t("B · 2 pages", "B · 2 पन्ने"), t("A · 4 pages", "A · 4 पन्ने"), t("C · 6 pages", "C · 6 पन्ने")], mark: { 0: "ok", 1: "ok", 2: "ok" }, rule: t("Key: page count · direction: ascending (small → large)", "कुंजी: पन्नों की गिनती · दिशा: बढ़ता क्रम (छोटा → बड़ा)"), note: undefined, focus: false }, pages: { bars: [{ id: "b", t: "B", v: 2, tone: "ok" }, { id: "a", t: "A", v: 4, tone: "ok" }, { id: "c", t: "C", v: 6, tone: "ok" }] } },
      { cards: { tiles: [t("A · 4 pages", "A · 4 पन्ने"), t("B · 4 pages", "B · 4 पन्ने"), t("C · 6 pages", "C · 6 पन्ने")], mark: { 0: "hl", 1: "hl" }, rule: t("A tie on pages: tie-break by letter — A before B", "पन्नों में बराबरी: अक्षर से तय — A पहले B"), note: undefined }, pages: { bars: [{ id: "a", t: "A", v: 4, tone: "warn" }, { id: "b", t: "B", v: 4, tone: "warn" }, { id: "c", t: "C", v: 6, tone: "info" }] } },
      { cards: { tiles: [t("A · 4 pages", "A · 4 पन्ने"), t("B · 2 pages", "B · 2 पन्ने"), t("C · 6 pages", "C · 6 पन्ने")], mark: {}, rule: t("Which order follows ascending page count?", "बढ़ते पन्नों का क्रम कौन-सा है?") }, pages: { bars: [{ id: "a", t: "A", v: 4, tone: "info" }, { id: "b", t: "B", v: 2, tone: "info" }, { id: "c", t: "C", v: 6, tone: "info" }] } },
      { cards: { tiles: [t("B · 2 pages", "B · 2 पन्ने"), t("A · 4 pages", "A · 4 पन्ने"), t("C · 6 pages", "C · 6 पन्ने")], mark: { 0: "ok", 1: "ok", 2: "ok" }, note: t("B, A, C = 2, 4, 6", "B, A, C = 2, 4, 6"), noteTone: "ok" }, pages: { bars: [{ id: "b", t: "B", v: 2, tone: "ok" }, { id: "a", t: "A", v: 4, tone: "ok" }, { id: "c", t: "C", v: 6, tone: "ok" }] } },
      { cards: { focus: true } },
    ],
    out: {
      "option-0": { cards: { tiles: [t("A · 4 pages", "A · 4 पन्ने"), t("B · 2 pages", "B · 2 पन्ने"), t("C · 6 pages", "C · 6 पन्ने")], mark: { 0: "risk", 1: "risk", 2: "ok" }, note: t("Alphabetical order ignores the page-count key", "अक्षर-क्रम पन्नों की कुंजी की अनदेखी करता है"), noteTone: "risk" } },
      "option-1": { cards: { tiles: [t("B · 2 pages", "B · 2 पन्ने"), t("A · 4 pages", "A · 4 पन्ने"), t("C · 6 pages", "C · 6 पन्ने")], mark: { 0: "ok", 1: "ok", 2: "ok" }, note: t("2, 4, 6 — ascending", "2, 4, 6 — बढ़ता क्रम"), noteTone: "ok" }, pages: { bars: [{ id: "b", t: "B", v: 2, tone: "ok" }, { id: "a", t: "A", v: 4, tone: "ok" }, { id: "c", t: "C", v: 6, tone: "ok" }] } },
      "option-2": { cards: { tiles: [t("C · 6 pages", "C · 6 पन्ने"), t("A · 4 pages", "A · 4 पन्ने"), t("B · 2 pages", "B · 2 पन्ने")], mark: { 0: "warn", 1: "warn", 2: "warn" }, note: t("That is descending, not ascending", "यह घटता क्रम है, बढ़ता नहीं"), noteTone: "risk" }, pages: { bars: [{ id: "c", t: "C", v: 6, tone: "warn" }, { id: "a", t: "A", v: 4, tone: "warn" }, { id: "b", t: "B", v: 2, tone: "warn" }] } },
    },
  },
  {
    slug: "class7-search-plan", scene: "lab", layout: "two",
    label: t("Card numbers · searching with a plan", "कार्ड नंबर · योजना से खोज"),
    art: [
      { k: "seq", id: "row", at: "a", title: t("Sorted row (ascending)", "क्रम से लगी पंक्ति (बढ़ता)"), icon: "search", tiles: ["2", "4", "6", "8"], rule: t("Goal: find 6 · count one comparison per card", "लक्ष्य: 6 ढूँढो · हर कार्ड पर एक तुलना") },
      { k: "seq", id: "mixed", at: "b", hide: true, title: t("Unsorted row", "बिना क्रम की पंक्ति"), icon: "shuffle", tiles: ["8", "2", "5", "4"], rule: t("A smaller number can hide later in the row", "छोटी संख्या आगे कहीं छिपी हो सकती है") },
    ],
    sc: [
      { row: { mark: { 0: "hl", 1: "hl", 2: "ok" }, note: t("Found on the third card: three comparisons", "तीसरे कार्ड पर मिला: तीन तुलनाएँ"), noteTone: "ok", focus: true } },
      { row: { tiles: ["2", "4", "6", "8"], mark: { 0: "hl", 1: "hl", 2: "warn", 3: "hl" }, rule: t("Goal: find 5 — after 6, every later number is ≥ 6", "लक्ष्य: 5 ढूँढो — 6 के बाद हर संख्या ≥ 6 है"), note: t("Passed the target — stop. 5 cannot appear later (the row is sorted).", "लक्ष्य पार हुआ — रुकें। 5 आगे नहीं हो सकता (पंक्ति क्रम में है)।"), noteTone: "info" } },
      { mixed: { hide: false, focus: true, mark: { 0: "warn", 2: "ok" }, note: t("Stopping at the first larger value (8) would miss the 5 near the end", "पहली बड़ी संख्या (8) पर रुकने से अंत के 5 को खो देते"), noteTone: "warn" }, row: { focus: false, note: undefined } },
      { mixed: { hide: true }, row: { mark: { 0: "hl", 1: "hl", 2: "warn" }, rule: t("Searching sorted 2, 4, 6, 8 for five: can we stop at six?", "क्रम में लगी 2, 4, 6, 8 में पाँच खोजते हुए: क्या छह पर रुकें?"), note: undefined } },
      { row: { mark: { 0: "hl", 1: "hl", 2: "ok", 3: "gone" }, note: t("Yes — and only because the row is guaranteed ascending", "हाँ — और सिर्फ़ इसलिए कि पंक्ति बढ़ते क्रम की है"), noteTone: "ok" } },
      { row: { focus: true } },
    ],
    out: {
      "option-0": { row: { mark: { 0: "hl", 1: "hl", 2: "ok", 3: "gone" }, note: t("Later sorted values cannot be five", "आगे के क्रमित मान पाँच नहीं हो सकते"), noteTone: "ok" } },
      "option-1": { mixed: { hide: false, mark: { 0: "risk", 2: "warn" }, note: t("In an unsorted row, that early stop misses the 5", "बिना क्रम की पंक्ति में यह जल्दी रुकना 5 को खो देता है"), noteTone: "risk" } },
      "option-2": { row: { mark: { 0: "hl", 1: "hl", 2: "hl", 3: "hl" }, note: t("Nothing says five must be there — 'not found' is a valid result", "कहीं नहीं लिखा कि पाँच ज़रूर है — 'नहीं मिला' भी सही नतीजा है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-rover-challenge", scene: "lab", layout: "one",
    label: t("Paper rover · four-by-four grid", "काग़ज़ी रोवर · चार-गुणा-चार ग्रिड"),
    art: [
      { k: "grid", id: "map", look: "map", w: 4, h: 4, title: t("Deliver the parcel", "पार्सल पहुँचाओ"), icon: "route", me: 0, goal: 15, walls: [5, 9, 10], cells: { 3: { icon: "stamp", tone: "warn" } } },
    ],
    sc: [
      { map: { focus: true, note: t("Start, finish, a required stamp stop, three blocked squares, and eight moves", "शुरुआत, अंत, एक ज़रूरी स्टैम्प पड़ाव, तीन बंद खाने और आठ चालें"), noteTone: "info" } },
      { map: { path: [0, 1, 2, 3, 7, 11, 15], note: t("Only neighbouring squares — no diagonals, no blocked squares", "सिर्फ़ पड़ोसी खाने — तिरछा नहीं, बंद खाने नहीं"), noteTone: "info" } },
      { map: { walls: [5, 9, 10, 6], cells: { 3: { icon: "doc", tone: "muted" }, 12: { icon: "stamp", tone: "warn" } }, path: [0, 4, 8, 12, 13, 14, 15], note: t("Teacher blocks another square and moves the stamp — recheck, don't reuse old commands", "टीचर एक और खाना बंद करती है और स्टैम्प खिसकाती है — दोबारा जाँचें, पुराने आदेश न दोहराएँ"), noteTone: "warn" } },
      { map: { walls: [5, 9, 10], cells: { 3: { icon: "stamp", tone: "warn" } }, path: [0, 4, 8, 12, 13, 14, 15], note: t("This route reaches the finish but skips the stamp", "यह रास्ता अंत तक पहुँचता है पर स्टैम्प छोड़ देता है"), noteTone: "warn" } },
      { map: { walls: [5, 9, 10], cells: { 3: { icon: "stamp", tone: "ok" } }, path: [0, 1, 2, 3, 7, 11, 15], note: t("Revised: stamp first, then finish — every requirement met", "सुधार: पहले स्टैम्प, फिर अंत — हर शर्त पूरी"), noteTone: "ok" } },
      { map: { focus: true } },
    ],
    out: {
      "option-0": { map: { path: [0, 4, 8, 12, 13, 14, 15], cells: { 3: { icon: "stamp", tone: "risk" } }, note: t("Finish reached — but the stamp stop is missed", "अंत तक पहुँचा — पर स्टैम्प पड़ाव छूट गया"), noteTone: "risk" } },
      "option-1": { map: { path: [0, 1, 2, 3, 7, 11, 15], cells: { 3: { icon: "stamp", tone: "ok" } }, note: t("Revise and test against every requirement", "हर शर्त पर सुधारें और जाँचें"), noteTone: "ok" } },
      "option-2": { map: { path: [0, 4, 8, 12, 13, 14, 15], cells: { 3: { icon: "x", tone: "risk" } }, note: t("Erasing a requirement after testing hides the failure", "जाँच के बाद शर्त मिटाना नाकामी छिपाना है"), noteTone: "risk" } },
    },
  },
];
