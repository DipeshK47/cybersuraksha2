import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];
const pots = (n: number) => Array.from({ length: n }, (_, i) => t(`pot ${i + 1}`, `गमला ${i + 1}`));

export const class6CtWorlds: World[] = [
  {
    slug: "class6-break-the-task", scene: "classroom", layout: "two",
    label: t("Discovery club display · three activity tables", "डिस्कवरी क्लब प्रदर्शन · तीन गतिविधि मेज़ें"),
    art: [
      { k: "flow", id: "tree", at: "a", look: "graph", title: t("From one big goal to smaller jobs", "एक बड़े लक्ष्य से छोटे काम"), icon: "workflow",
        nodes: [{ id: "goal", t: t("Visitors find all three tables", "आगंतुक तीनों मेज़ें ढूँढ लें"), icon: "target", x: 50, y: 12 }, { id: "make", t: t("\"Make everything\"", "\"सब कुछ बना दो\""), icon: "help", x: 50, y: 52 }, { id: "loc", t: t("Choose sign locations", "संकेत की जगहें चुनें"), icon: "pin", x: 14, y: 52 }, { id: "lab", t: t("Write readable labels", "पढ़ने लायक़ लेबल लिखें"), icon: "pencil", x: 50, y: 88 }, { id: "chk", t: t("Check with a visitor route", "आगंतुक-मार्ग से जाँचें"), icon: "route", x: 86, y: 52 }],
        links: [{ from: "goal", to: "make" }, { from: "goal", to: "loc" }, { from: "goal", to: "lab" }, { from: "goal", to: "chk" }], link: { "goal>loc": "off", "goal>lab": "off", "goal>chk": "off" }, state: { goal: "now", make: "risk", loc: "muted", lab: "muted", chk: "muted" } },
      { k: "doc", id: "inputs", at: "b", look: "card", pic: "box", title: t("What the club already has", "क्लब के पास पहले से क्या है"), sub: t("Inputs, not the finished goal", "इनपुट, तैयार लक्ष्य नहीं"), toks: [{ id: "card", t: t("Card", "कार्ड"), icon: "file" }, { id: "mk", t: t("Markers", "मार्कर"), icon: "pencil" }, { id: "map", t: t("Room map", "कमरे का नक़्शा"), icon: "map" }, { id: "out", t: t("Output: readable signs in the right places", "आउटपुट: सही जगह पढ़ने लायक़ संकेत"), icon: "flag" }], mark: { out: "hl" } },
    ],
    sc: [
      { tree: { focus: true, note: t("Kabir's first instruction: \"make everything\" — Meera asks what a visitor should be able to do", "कबीर का पहला निर्देश: \"सब बना दो\" — मीरा पूछती है कि आगंतुक क्या कर सके"), noteTone: "warn" } },
      { tree: { focus: false, note: undefined }, inputs: { focus: true, note: t("Inputs aren't the goal — signs in the right places are", "इनपुट लक्ष्य नहीं — सही जगह संकेत लक्ष्य है"), noteTone: "info" } },
      { inputs: { focus: false, note: undefined }, tree: { link: { "goal>make": "off", "goal>loc": "on", "goal>lab": "on", "goal>chk": "on" }, state: { goal: "now", make: "muted", loc: "lit", lab: "lit", chk: "lit" }, note: t("Decomposition: each piece gets a result you can observe", "विघटन: हर टुकड़े का नतीजा देखा जा सके"), noteTone: "ok" } },
      { tree: { link: { "goal>make": "on", "goal>loc": "off", "goal>lab": "off", "goal>chk": "off" }, state: { goal: "now", make: "risk", loc: "muted", lab: "muted", chk: "muted" }, note: t("Which first step makes the task clearer?", "कौन-सा पहला क़दम काम को साफ़ करता है?"), noteTone: "info" } },
      { tree: { link: { "goal>make": "off", "goal>loc": "on", "goal>lab": "on", "goal>chk": "on" }, state: { goal: "ok", make: "muted", loc: "ok", lab: "ok", chk: "ok" }, note: t("Locations, labels and a visitor check — each supports the same goal", "जगहें, लेबल और आगंतुक जाँच — हर एक उसी लक्ष्य की ओर"), noteTone: "ok" } },
      { tree: { focus: true } },
    ],
    out: {
      "option-0": { tree: { link: { "goal>make": "on" }, state: { make: "risk" }, note: t("Repeating the vague instruction changes nothing", "वही अस्पष्ट निर्देश दोहराने से कुछ नहीं बदलता"), noteTone: "risk" } },
      "option-1": { tree: { link: { "goal>make": "off", "goal>loc": "on", "goal>lab": "on", "goal>chk": "on" }, state: { goal: "ok", make: "muted", loc: "ok", lab: "ok", chk: "ok" }, note: t("Clear, checkable pieces", "साफ़, जाँचने लायक़ टुकड़े"), noteTone: "ok" } },
      "option-2": { tree: { state: { make: "risk", loc: "muted", lab: "muted", chk: "muted" }, note: t("Using all the markers isn't a plan", "सारे मार्कर इस्तेमाल करना योजना नहीं है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-pattern-rule", scene: "classroom", layout: "two",
    label: t("Ribbon pattern and card towers", "रिबन पैटर्न और कार्ड के टावर"),
    art: [
      { k: "seq", id: "ribbon", at: "a", title: t("Meera's ribbon", "मीरा का रिबन"), icon: "shapes", tiles: [t("blue", "नीला"), t("yellow", "पीला"), t("yellow", "पीला"), t("blue", "नीला"), t("yellow", "पीला"), t("yellow", "पीला")], rule: t("A repeating unit: blue, yellow, yellow", "दोहराती इकाई: नीला, पीला, पीला") },
      { k: "seq", id: "tower", at: "b", title: t("Kabir's card towers", "कबीर के कार्ड टावर"), icon: "layers", tiles: ["3", "5", "7", "?"], blank: [3], rule: t("A count that changes by a stated rule", "तय नियम से बदलती गिनती") },
    ],
    sc: [
      { ribbon: { focus: true, mark: { 0: "hl", 1: "hl", 2: "hl" } } },
      { ribbon: { focus: false, mark: { 0: "hl", 1: "hl", 2: "hl", 3: "ok", 4: "ok", 5: "ok" } }, tower: { focus: true, rule: t("Rule said aloud: start at 3, add 2 each time", "नियम बोलकर: 3 से शुरू, हर बार 2 जोड़ें"), mark: { 1: "hl", 2: "hl" } } },
      { tower: { focus: false, tiles: ["3", "5", "7", "?"], rule: t("A short list can fit many rules — the teacher gives the construction rule", "छोटी सूची कई नियमों में बैठ सकती है — टीचर बनाने का नियम देती है") }, ribbon: { mark: {} } },
      { tower: { rule: t("The tower rule adds two. What follows seven?", "टावर का नियम दो जोड़ना है। सात के बाद क्या?"), mark: {} } },
      { tower: { tiles: ["3", "5", "7", "9"], blank: [], mark: { 3: "ok" }, rule: t("7 + 2 = 9 — it follows the supplied rule", "7 + 2 = 9 — यह दिए गए नियम से आता है") } },
      { tower: { focus: true } },
    ],
    out: {
      "option-0": { tower: { tiles: ["3", "5", "7", "14"], blank: [], mark: { 3: "risk" }, rule: t("Doubling doesn't fit 3, 5, 7", "दुगुना करना 3, 5, 7 में नहीं बैठता") } },
      "option-1": { tower: { tiles: ["3", "5", "7", "8"], blank: [], mark: { 3: "risk" }, rule: t("Adding one breaks the \"add two\" rule", "एक जोड़ना \"दो जोड़ो\" नियम तोड़ता है") } },
      "option-2": { tower: { tiles: ["3", "5", "7", "9"], blank: [], mark: { 3: "ok" }, rule: t("Nine follows the supplied rule", "नौ दिए नियम से आता है") } },
    },
  },
  {
    slug: "class6-exact-instructions", scene: "lab", layout: "two",
    label: t("The paper robot only follows exact commands", "काग़ज़ी रोबोट सिर्फ़ सटीक आदेश मानता है"),
    art: [
      { k: "doc", id: "cmd", at: "a", look: "note", pic: "bot", title: t("Commands for the robot", "रोबोट के आदेश"), sub: t("Object · action · destination", "वस्तु · क्रिया · गंतव्य"), toks: [{ id: "vague", t: t("\"Put things nicely\"", "\"चीज़ें अच्छे से रखो\""), icon: "help" }, { id: "exact", t: t("Pick up the blue card, place it on the tray, close the lid", "नीला कार्ड उठाओ, ट्रे पर रखो, ढक्कन बंद करो"), icon: "list" }] , mark: { vague: "risk" } },
      { k: "flow", id: "run", at: "b", look: "steps", hide: true, title: t("Trace on a pretend tray", "नक़ली ट्रे पर जाँच"), icon: "route", nodes: [{ id: "a1", t: t("Pick up blue card", "नीला कार्ड उठाओ"), icon: "file", x: 14, y: 50 }, { id: "a2", t: t("Place on tray", "ट्रे पर रखो"), icon: "box", x: 50, y: 50 }, { id: "a3", t: t("Close the lid", "ढक्कन बंद करो"), icon: "lock", x: 86, y: 50 }], links: [{ from: "a1", to: "a2" }, { from: "a2", to: "a3" }], state: { a1: "now" } },
    ],
    sc: [
      { cmd: { focus: true, mark: { vague: "risk" }, note: t("\"Put things nicely\" gives no useful result", "\"अच्छे से रखो\" से कोई काम का नतीजा नहीं मिलता"), noteTone: "warn" } },
      { cmd: { focus: false, mark: { vague: "risk", exact: "ok" }, note: t("An algorithm is an ordered method — closing the lid first blocks the next action", "एल्गोरिद्म क्रमबद्ध तरीक़ा है — पहले ढक्कन बंद करने से अगला काम रुकता है"), noteTone: "info" } },
      { run: { hide: false, focus: true, cur: "a2", state: { a1: "done", a2: "now" }, note: t("Record what changes after each action; fix the earliest failing step", "हर क्रिया के बाद क्या बदला दर्ज करें; सबसे पहला चूका क़दम ठीक करें"), noteTone: "info" }, cmd: { focus: false, note: undefined } },
      { run: { focus: false, note: undefined }, cmd: { mark: { vague: "warn", exact: "none" }, note: t("Which instruction is precise enough to test?", "कौन-सा निर्देश परखने लायक़ सटीक है?"), noteTone: "info" } },
      { run: { cur: "a3", state: { a1: "done", a2: "done", a3: "ok" }, note: t("Object, action and destination are stated — another learner can test it", "वस्तु, क्रिया और गंतव्य बताए — दूसरा विद्यार्थी परख सकता है"), noteTone: "ok" }, cmd: { mark: { vague: "gone", exact: "ok" } } },
      { run: { focus: true } },
    ],
    out: {
      "option-0": { cmd: { mark: { vague: "risk" }, note: t("\"Make it nice\" can't be tested", "\"अच्छा बनाओ\" की जाँच नहीं हो सकती"), noteTone: "risk" } },
      "option-1": { cmd: { mark: { vague: "gone", exact: "ok" }, note: t("Place the blue card in the open tray", "नीला कार्ड खुली ट्रे में रखो"), noteTone: "ok" } },
      "option-2": { cmd: { mark: { vague: "risk" }, note: t("\"The usual thing\" depends on who is guessing", "\"रोज़ वाला काम\" अंदाज़ लगाने वाले पर निर्भर है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-if-then-desk", scene: "library", layout: "two",
    label: t("Reading cards · long tray or short tray?", "पठन कार्ड · लंबी ट्रे या छोटी ट्रे?"),
    art: [
      { k: "flow", id: "rule", at: "a", look: "graph", title: t("The rule", "नियम"), icon: "workflow", nodes: [{ id: "q", t: t("Pages ≥ 10 ?", "पन्ने ≥ 10 ?"), icon: "help", x: 24, y: 50 }, { id: "long", t: t("Long tray", "लंबी ट्रे"), icon: "box", x: 80, y: 20 }, { id: "short", t: t("Short tray", "छोटी ट्रे"), icon: "box", x: 80, y: 80 }], links: [{ from: "q", to: "long", t: t("yes", "हाँ") }, { from: "q", to: "short", t: t("no", "नहीं") }], state: { q: "now" } },
      { k: "table", id: "cards", at: "b", title: t("Reading cards", "पठन कार्ड"), icon: "book-open", cols: [t("Card", "कार्ड"), t("Pages", "पन्ने"), t("Goes to", "कहाँ जाए")], rows: [{ id: "a", c: ["A", "9", "?"] }, { id: "b", c: ["B", "11", "?"] }, { id: "c", c: ["C", "10", "?"] }, { id: "d", c: ["D", t("smudged", "धुंधला"), "?"] }], upTo: 2 },
    ],
    sc: [
      { rule: { focus: true, note: t("At least ten pages → long tray; fewer than ten → short tray", "कम-से-कम दस पन्ने → लंबी ट्रे; दस से कम → छोटी ट्रे"), noteTone: "info" } },
      { cards: { upTo: 3, txt: { "a:2": t("short", "छोटी"), "b:2": t("long", "लंबी") }, mark: { a: "info", b: "ok", c: "warn" }, note: t("Nine and eleven are easy. Ten needs careful reading.", "नौ और ग्यारह आसान हैं। दस को ध्यान से पढ़ना होगा।"), noteTone: "warn" }, rule: { focus: false, note: undefined } },
      { cards: { upTo: 4, txt: { "a:2": t("short", "छोटी"), "b:2": t("long", "लंबी"), "d:2": t("review route", "समीक्षा रास्ता") }, mark: { a: "info", b: "ok", c: "warn", d: "risk" }, note: t("Missing is not zero — it goes to a separate review route", "ग़ायब का मतलब शून्य नहीं — अलग समीक्षा रास्ता लें"), noteTone: "warn" } },
      { cards: { upTo: 3, txt: { "a:2": t("short", "छोटी"), "b:2": t("long", "लंबी") }, mark: { c: "warn" }, note: t("Where does the ten-page card go?", "दस पन्ने वाला कार्ड कहाँ जाए?"), noteTone: "info" } },
      { cards: { upTo: 3, txt: { "a:2": t("short", "छोटी"), "b:2": t("long", "लंबी"), "c:2": t("long", "लंबी") }, mark: { a: "info", b: "ok", c: "ok" }, note: t("\"At least ten\" includes ten itself", "\"कम-से-कम दस\" में दस ख़ुद शामिल है"), noteTone: "ok" }, rule: { state: { q: "done", long: "ok" }, cur: "long" } },
      { cards: { focus: true } },
    ],
    out: {
      "option-0": { cards: { txt: { "c:2": t("short", "छोटी") }, mark: { c: "risk" }, note: t("Ten isn't fewer than ten", "दस, दस से कम नहीं है"), noteTone: "risk" } },
      "option-1": { cards: { txt: { "c:2": t("long", "लंबी") }, mark: { c: "ok" }, note: t("Long tray — the boundary belongs with 'at least'", "लंबी ट्रे — सीमा 'कम-से-कम' के साथ आती है"), noteTone: "ok" }, rule: { state: { long: "ok" }, cur: "long" } },
      "option-2": { cards: { txt: { "c:2": t("both?!", "दोनों?!") }, mark: { c: "risk" }, note: t("One card, one tray", "एक कार्ड, एक ट्रे"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-repeat-with-a-count", scene: "garden", layout: "two",
    label: t("Garden helper · one label for each pot", "बाग़ मददगार · हर गमले पर एक लेबल"),
    art: [
      { k: "seq", id: "row", at: "a", title: t("Pots and stamps", "गमले और ठप्पे"), icon: "flower", tiles: pots(4), rule: t("Repeat the stamp action 4 times", "ठप्पे की क्रिया 4 बार दोहराएँ") },
      { k: "chart", id: "count", at: "b", look: "bars", max: 5, title: t("Completed stamps", "पूरे हुए ठप्पे"), icon: "bars", bars: [{ id: "n", t: t("stamps made", "बने ठप्पे"), v: 0, tone: "info" }] },
    ],
    sc: [
      { row: { focus: true, note: t("Kabir writes \"stamp a label\" four times in a long list", "कबीर \"लेबल लगाओ\" लंबी सूची में चार बार लिखता है"), noteTone: "warn" } },
      { row: { mark: { 0: "ok", 1: "ok", 2: "ok", 3: "ok" }, rule: t("Meera: repeat the action four times — the counter records completed stamps", "मीरा: क्रिया चार बार दोहराओ — काउंटर पूरे ठप्पे गिनता है"), note: undefined, focus: false }, count: { bars: [{ id: "n", t: t("stamps made", "बने ठप्पे"), v: 4, tone: "ok" }] } },
      { row: { tiles: [], rule: t("Test four pots, one pot and no pots — zero pots must give zero stamps", "चार, एक और शून्य गमले जाँचें — शून्य गमलों पर शून्य ठप्पे"), mark: {}, note: undefined }, count: { bars: [{ id: "n", t: t("stamps made", "बने ठप्पे"), v: 0, tone: "info" }], note: t("Check the stopping rule before running", "चलाने से पहले रुकने का नियम जाँचें"), noteTone: "info" } },
      { row: { tiles: [], rule: t("How many stamps for zero pots?", "शून्य गमलों पर कितने ठप्पे?") }, count: { note: undefined } },
      { row: { tiles: [], rule: t("Zero items → zero stamps", "शून्य वस्तुएँ → शून्य ठप्पे") }, count: { bars: [{ id: "n", t: t("stamps made", "बने ठप्पे"), v: 0, tone: "ok" }], note: t("The empty case is checked before any action", "ख़ाली स्थिति पहले जाँची जाती है"), noteTone: "ok" } },
      { count: { focus: true } },
    ],
    out: {
      "option-0": { count: { bars: [{ id: "n", t: t("stamps made", "बने ठप्पे"), v: 1, tone: "risk" }], note: t("A loop that always acts once before checking", "ऐसा लूप जो जाँच से पहले एक बार काम कर देता है"), noteTone: "risk" } },
      "option-1": { count: { bars: [{ id: "n", t: t("stamps made", "बने ठप्पे"), v: 0, tone: "ok" }], note: t("Zero items, zero stamps", "शून्य वस्तुएँ, शून्य ठप्पे"), noteTone: "ok" } },
      "option-2": { count: { bars: [{ id: "n", t: t("stamps made", "बने ठप्पे"), v: 5, tone: "risk" }], max: 5, note: t("No stopping rule: it never ends", "रुकने का नियम नहीं: यह कभी नहीं रुकता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-grid-delivery", scene: "lab", layout: "one",
    label: t("Delivery robot · three-by-three grid", "डिलीवरी रोबोट · तीन-गुणा-तीन ग्रिड"),
    art: [
      { k: "grid", id: "map", look: "map", w: 3, h: 3, title: t("Top left → bottom right", "ऊपर-बाएँ → नीचे-दाएँ"), icon: "route", me: 0, goal: 8, walls: [4] },
    ],
    sc: [
      { map: { focus: true, note: t("The middle square is blocked — no shortcut through it", "बीच का खाना बंद है — उसके बीच से शॉर्टकट नहीं"), noteTone: "warn" } },
      { map: { note: t("Commands: up, down, left, right — one neighbouring square each", "आदेश: ऊपर, नीचे, बाएँ, दाएँ — हर बार एक पड़ोसी खाना"), noteTone: "info", path: [0, 1] } },
      { map: { path: [0, 1, 2, 5, 8], note: t("A four-step route around the outside works…", "बाहर-बाहर से चार क़दम का रास्ता चलता है…"), noteTone: "ok" } },
      { map: { walls: [4, 1], path: [0, 1, 2, 5, 8], note: t("…until the teacher blocks another square. Change the plan; test again.", "…जब तक टीचर एक और खाना बंद न कर दे। योजना बदलें; दोबारा जाँचें।"), noteTone: "warn" } },
      { map: { walls: [4], path: [0, 3, 6, 7, 8], note: t("Only allowed neighbouring moves — a diagonal isn't valid", "सिर्फ़ मान्य पड़ोसी चालें — तिरछा चलना मान्य नहीं"), noteTone: "ok" } },
      { map: { focus: true } },
    ],
    out: {
      "option-0": { map: { path: [0, 4, 8], note: t("A diagonal jump through the blocked square", "बंद खाने से होकर तिरछी छलाँग"), noteTone: "risk" } },
      "option-1": { map: { path: [0, 1, 2, 5, 8], note: t("Follow allowed moves around it", "मान्य चालों से उसके आसपास से चलें"), noteTone: "ok" } },
      "option-2": { map: { path: [0, 1, 4, 7, 8], note: t("The blocked square can't be entered", "बंद खाने में नहीं जाया जा सकता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-debug-the-plan", scene: "lab", layout: "two",
    label: t("Card counter · expected vs observed", "कार्ड काउंटर · अपेक्षित बनाम देखा गया"),
    art: [
      { k: "table", id: "trace", at: "a", title: t("The trace", "ट्रेस"), icon: "list", cols: [t("Step", "क़दम"), t("Instruction", "निर्देश"), t("Expected", "अपेक्षित"), t("Observed", "देखा गया")],
        rows: [{ id: "s1", c: ["1", t("start with 1, add two", "1 से शुरू, दो जोड़ें"), "3", "2"] }, { id: "s2", c: ["2", t("add two again", "फिर दो जोड़ें"), "5", "5"] }], foot: t("Meera writes the expected value beside each observed value", "मीरा हर देखे गए मान के पास अपेक्षित मान लिखती है") },
      { k: "flow", id: "cycle", at: "b", look: "steps", hide: true, title: t("The debugging cycle", "डिबगिंग चक्र"), icon: "bug", nodes: [{ id: "d1", t: t("Find the first mismatch", "पहला अमेल ढूँढो"), icon: "search", x: 14, y: 50 }, { id: "d2", t: t("Repair that step", "वही क़दम सुधारो"), icon: "wrench", x: 50, y: 50 }, { id: "d3", t: t("Rerun the whole trace", "पूरा ट्रेस फिर चलाओ"), icon: "refresh", x: 86, y: 50 }], links: [{ from: "d1", to: "d2" }, { from: "d2", to: "d3" }], state: { d1: "now" } },
    ],
    sc: [
      { trace: { focus: true, mark: { s1: "risk", s2: "none" }, cell: { "s1:3": "risk" }, note: t("1 became 2, not 3 — the earliest mismatch is step 1", "1 से 2 बना, 3 नहीं — सबसे पहला अमेल क़दम 1 है"), noteTone: "risk" } },
      { trace: { note: t("A correct-looking final label can't repair a wrong action", "सही दिखता अंतिम लेबल ग़लत क्रिया ठीक नहीं करता"), noteTone: "warn" } },
      { trace: { focus: false, txt: { "s1:1": t("start with 1, add TWO (was add one)", "1 से शुरू, दो जोड़ें (पहले एक था)"), "s1:3": "3" }, mark: { s1: "ok", s2: "ok" }, cell: { "s1:3": "ok" }, note: undefined }, cycle: { hide: false, focus: true, cur: "d3", state: { d1: "done", d2: "done", d3: "now" }, note: t("Fix the cause, rerun everything, and test a start of zero too", "कारण सुधारें, सब फिर चलाएँ, और शून्य से शुरुआत भी जाँचें"), noteTone: "ok" } },
      { cycle: { focus: false, note: undefined, state: { d1: "now" } }, trace: { txt: {}, mark: { s1: "risk" }, cell: { "s1:3": "risk" }, note: t("What should the team repair first?", "टीम पहले क्या सुधारे?"), noteTone: "info" } },
      { trace: { txt: { "s1:1": t("start with 1, add TWO (was add one)", "1 से शुरू, दो जोड़ें (पहले एक था)") }, mark: { s1: "ok", s2: "ok" }, cell: { "s1:3": "ok" }, note: t("Repair the first add action and rerun the trace", "पहली जोड़ने वाली क्रिया सुधारें और ट्रेस फिर चलाएँ"), noteTone: "ok" }, cycle: { state: { d1: "done", d2: "done", d3: "ok" } } },
      { cycle: { focus: true } },
    ],
    out: {
      "option-0": { trace: { txt: { "s2:3": "5 (label changed)" }, mark: { s1: "risk" }, note: t("Editing the final label hides the cause", "अंतिम लेबल बदलना कारण छिपाना है"), noteTone: "risk" } },
      "option-1": { trace: { txt: { "s1:1": t("start with 1, add TWO (was add one)", "1 से शुरू, दो जोड़ें (पहले एक था)") }, mark: { s1: "ok", s2: "ok" }, cell: { "s1:3": "ok" }, note: t("Repair the first incorrect add action", "पहली ग़लत जोड़ वाली क्रिया सुधारें"), noteTone: "ok" } },
      "option-2": { trace: { mark: { s1: "gone", s2: "gone" }, note: t("Removing failing records removes the evidence", "फ़ेल रिकॉर्ड हटाना सबूत हटाना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-trail-builder", scene: "garden", layout: "one",
    label: t("The discovery trail · start, stamp station, finish", "डिस्कवरी ट्रेल · शुरुआत, स्टैम्प स्टेशन, अंत"),
    art: [
      { k: "grid", id: "trail", look: "map", w: 4, h: 4, title: t("Paper-grid trail", "काग़ज़ी ग्रिड ट्रेल"), icon: "tent", me: 0, goal: 15, walls: [5, 10], cells: { 3: { icon: "stamp", tone: "warn" } } },
    ],
    sc: [
      { trail: { focus: true, note: t("Meera breaks it up: read the map, choose a route, check the stamp", "मीरा इसे बाँटती है: नक़्शा पढ़ो, रास्ता चुनो, स्टैम्प जाँचो"), noteTone: "info" } },
      { trail: { path: [0, 1, 2, 3, 7, 11, 15], note: t("Reaching the finish isn't the only goal — the stamp station and the move limit matter", "सिर्फ़ अंत पर पहुँचना लक्ष्य नहीं — स्टैम्प स्टेशन और चालों की सीमा भी मायने रखती है"), noteTone: "info" } },
      { trail: { walls: [5, 10, 1], path: [0, 4, 8, 12, 13, 14, 15], cells: { 3: { icon: "doc", tone: "muted" }, 12: { icon: "stamp", tone: "warn" } }, note: t("An obstacle moves after the first test — record it, edit the route, check the whole goal", "पहली जाँच के बाद रुकावट खिसकी — दर्ज करें, रास्ता बदलें, पूरा लक्ष्य जाँचें"), noteTone: "warn" } },
      { trail: { walls: [5, 10], cells: { 3: { icon: "stamp", tone: "warn" } }, path: [0, 4, 8, 12, 13, 14, 15], note: t("This route reaches the finish but never visits the stamp", "यह रास्ता अंत पर पहुँचता है पर स्टैम्प पर कभी नहीं जाता"), noteTone: "warn" } },
      { trail: { path: [0, 1, 2, 3, 7, 11, 15], cells: { 3: { icon: "stamp", tone: "ok" } }, note: t("Revised: the stamp first, then the finish — whole goal met", "सुधार: पहले स्टैम्प, फिर अंत — पूरा लक्ष्य पूरा"), noteTone: "ok" } },
      { trail: { focus: true } },
    ],
    out: {
      "option-0": { trail: { path: [0, 4, 8, 12, 13, 14, 15], cells: { 3: { icon: "stamp", tone: "risk" } }, note: t("The easiest part of the goal isn't the whole goal", "लक्ष्य का सबसे आसान हिस्सा पूरा लक्ष्य नहीं है"), noteTone: "risk" } },
      "option-1": { trail: { path: [0, 1, 2, 3, 7, 11, 15], cells: { 3: { icon: "stamp", tone: "ok" } }, note: t("Revise and retest every requirement", "हर शर्त पर सुधारें और फिर जाँचें"), noteTone: "ok" } },
      "option-2": { trail: { path: [0, 4, 8, 12, 13, 14, 15], cells: { 3: { icon: "x", tone: "risk" } }, note: t("Erasing the requirement hides the failure", "शर्त मिटाना नाकामी छिपाना है"), noteTone: "risk" } },
    },
  },
];
