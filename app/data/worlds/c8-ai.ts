import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class8AiWorlds: World[] = [
  {
    slug: "class8-ai-smart-automatic", scene: "lab", layout: "two",
    label: t("Discovery club · timer, lamp, picture sorter", "डिस्कवरी क्लब · टाइमर, लैंप, चित्र-छँटाईकार"),
    art: [
      { k: "table", id: "dev", at: "a", title: t("Tara's three devices", "तारा के तीन उपकरण"), icon: "cpu", cols: [t("Device", "उपकरण"), t("Acts by itself", "ख़ुद चलता है"), t("Mechanism evidence", "तरीक़े का सबूत")], rows: [{ id: "timer", c: [t("Kitchen timer", "रसोई टाइमर"), "✓", "?"] }, { id: "lamp", c: [t("Lamp", "लैंप"), "✓", "?"] }, { id: "sorter", c: [t("Prepared picture sorter", "तैयार चित्र-छँटाईकार"), "✓", t("classroom simulation", "क्लासरूम सिमुलेशन")] }, { id: "mystery", c: [t("Mystery device", "रहस्यमयी उपकरण"), "✓", "?"] }], upTo: 3 },
      { k: "flow", id: "how", at: "b", look: "graph", title: t("Three ways to 'respond'", "'जवाब' देने के तीन तरीक़े"), icon: "workflow", nodes: [{ id: "rule", t: t("Fixed rule written by a person", "इंसान का लिखा तय नियम"), icon: "list", x: 20, y: 22 }, { id: "thr", t: t("Sensor + threshold", "सेंसर + सीमा"), icon: "sun", x: 20, y: 78 }, { id: "learn", t: t("Learned from labelled examples", "लेबल वाले उदाहरणों से सीखा"), icon: "brain", x: 80, y: 50 }], links: [{ from: "rule", to: "learn" }, { from: "thr", to: "learn" }], link: { "rule>learn": "off", "thr>learn": "off" }, state: { rule: "muted", thr: "muted", learn: "muted" }, hide: true },
    ],
    sc: [
      { dev: { focus: true, note: t("Each produces an output without another button press", "हर एक बिना और बटन दबाए नतीजा देता है"), noteTone: "info" } },
      { dev: { txt: { "timer:2": t("fixed countdown, then ring", "तय उल्टी-गिनती, फिर घंटी") }, mark: { timer: "info" }, note: undefined }, how: { hide: false, state: { rule: "ok", thr: "muted", learn: "muted" }, note: t("Useful and automatic can still just mean 'follows a written rule'", "उपयोगी और स्वचालित का मतलब बस 'लिखा नियम मानना' भी हो सकता है"), noteTone: "info" } },
      { dev: { upTo: 4, txt: { "timer:2": t("fixed countdown, then ring", "तय उल्टी-गिनती, फिर घंटी"), "lamp:2": t("on when light < threshold (rule card)", "रोशनी < सीमा पर चालू (नियम कार्ड)") }, mark: { timer: "info", lamp: "info", mystery: "warn" }, note: t("Evidence about this lamp — not a guess from its shiny case", "इस लैंप के बारे में सबूत — चमकीले ख़ोल से लगाया अंदाज़ा नहीं"), noteTone: "ok" }, how: { state: { rule: "ok", thr: "ok", learn: "muted" } } },
      { dev: { upTo: 4, note: t("How should the mystery device be labelled?", "रहस्यमयी उपकरण को क्या लेबल दें?"), noteTone: "info" } },
      { dev: { upTo: 4, txt: { "timer:2": t("fixed rule", "तय नियम"), "lamp:2": t("threshold rule", "सीमा-नियम"), "mystery:2": t("UNKNOWN — mechanism requested", "अज्ञात — तरीक़ा माँगा गया") }, mark: { mystery: "ok" }, note: t("Unknown until evidence arrives", "सबूत आने तक अज्ञात"), noteTone: "ok" } },
      { dev: { focus: true } },
    ],
    out: {
      ai: { dev: { upTo: 4, txt: { "mystery:2": t("'definitely AI'?", "'पक्का AI'?") }, mark: { mystery: "risk" }, note: t("No evidence yet — automatic isn't proof of learning", "अभी कोई सबूत नहीं — स्वचालित होना सीखने का सबूत नहीं"), noteTone: "risk" } },
      unknown: { dev: { upTo: 4, txt: { "mystery:2": t("UNKNOWN — mechanism requested", "अज्ञात — तरीक़ा माँगा गया") }, mark: { mystery: "ok" }, note: t("Request its mechanism and test evidence", "इसका तरीक़ा और परीक्षण-सबूत माँगें"), noteTone: "ok" } },
      never: { dev: { upTo: 4, txt: { "mystery:2": t("'definitely never AI'?", "'कभी AI नहीं'?") }, mark: { mystery: "risk" }, note: t("A certain 'no' needs evidence too", "पक्के 'नहीं' के लिए भी सबूत चाहिए"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-ai-useful-question", scene: "garden", layout: "two",
    label: t("Garden club · dry planters after weekends", "गार्डन क्लब · सप्ताहांत के बाद सूखे गमले"),
    art: [
      { k: "chart", id: "dry", at: "a", look: "bars", max: 8, title: t("Dry-planter checks in ten mornings", "दस सुबहों में सूखे गमलों की जाँच"), icon: "droplets", ref: { v: 2, t: t("target ≤ 2", "लक्ष्य ≤ 2") }, bars: [{ id: "now", t: t("Today", "आज"), v: 6, tone: "risk" }] },
      { k: "doc", id: "idea", at: "b", look: "form", pic: "idea", title: t("Two ways to meet the goal", "लक्ष्य पाने के दो तरीक़े"), sub: t("Iqbal vs Nisha", "इक़बाल बनाम निशा"), toks: [{ id: "ai", t: t("AI watering predictor", "AI पानी-अनुमानक"), icon: "bot" }, { id: "sched", t: t("Written weekend schedule", "लिखा सप्ताहांत कार्यक्रम"), icon: "calendar" }, { id: "waste", t: t("Count unnecessary watering too", "बेवजह पानी देना भी गिनें"), icon: "drops" }], mark: { ai: "warn" } },
    ],
    sc: [
      { dry: { focus: true, note: t("Iqbal proposes an AI predictor at once. Nisha: what problem do we actually need to solve?", "इक़बाल तुरंत AI अनुमानक सुझाता है। निशा: असल में कौन-सी समस्या सुलझानी है?"), noteTone: "info" } },
      { dry: { note: t("From \"make the garden smarter\" to \"six checks down to at most two in ten simulated mornings\"", "\"बाग़ को स्मार्ट बनाओ\" से \"दस नक़ली सुबहों में छह जाँच घटाकर अधिकतम दो\""), noteTone: "ok" } },
      { dry: { focus: false, note: undefined }, idea: { mark: { ai: "warn", sched: "hl", waste: "ok" }, note: t("A simple schedule might already work — compare on the same held-out mornings", "एक सरल कार्यक्रम पहले से काम कर सकता है — उन्हीं अलग रखी सुबहों पर तुलना करें"), noteTone: "info" } },
      { dry: { note: t("What should happen before building?", "बनाने से पहले क्या हो?"), noteTone: "info" } },
      { dry: { bars: [{ id: "now", t: t("Before", "पहले"), v: 6, tone: "muted" }, { id: "sch", t: t("Schedule", "कार्यक्रम"), v: 2, tone: "ok" }], note: t("The schedule meets the target with less unnecessary watering — keep it, a teacher stays responsible", "कार्यक्रम कम बेवजह पानी में लक्ष्य पूरा करता है — रखें, ज़िम्मेदार टीचर ही रहेंगी"), noteTone: "ok" }, idea: { mark: { sched: "ok", ai: "gone", waste: "ok" } } },
      { dry: { focus: true } },
    ],
    out: {
      build: { idea: { mark: { ai: "risk" }, note: t("A complex predictor before defining success is guessing", "सफलता तय किए बिना जटिल अनुमानक अंदाज़ा है"), noteTone: "risk" } },
      check: { dry: { bars: [{ id: "now", t: t("Before", "पहले"), v: 6, tone: "muted" }, { id: "sch", t: t("Schedule", "कार्यक्रम"), v: 2, tone: "ok" }] }, idea: { mark: { sched: "ok", ai: "gone", waste: "ok" }, note: t("Define success and test a simple schedule", "सफलता तय करें और सरल कार्यक्रम परखें"), noteTone: "ok" } },
      claim: { dry: { bars: [{ id: "now", t: t("Today", "आज"), v: 6, tone: "risk" }, { id: "zero", t: t("Promise: 0 forever", "वादा: हमेशा 0"), v: 0, tone: "warn" }], note: t("A forever promise can't be tested", "हमेशा का वादा परखा नहीं जा सकता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-ai-trustworthy-data", scene: "lab", layout: "two",
    label: t("Material cards · Ravi's invented dataset", "सामग्री कार्ड · रवि का काल्पनिक डेटासेट"),
    art: [
      { k: "table", id: "ds", at: "a", title: t("The collected cards", "इकट्ठा किए कार्ड"), icon: "grid", cols: [t("ID", "आईडी"), t("Stiffness (feature)", "कठोरता (विशेषता)"), t("Material (label)", "सामग्री (लेबल)")], rows: [{ id: "r1", c: ["R1", "2", t("paper", "काग़ज़")] }, { id: "r2", c: ["R2", "7", t("plastic", "प्लास्टिक")] }, { id: "r2b", c: ["R2", "7", t("plastic", "प्लास्टिक")] }, { id: "r3", c: ["R3", "5", t("(none)", "(कोई नहीं)")] }, { id: "r4", c: ["R4", "6", t("metal", "धातु")] }, { id: "r4b", c: ["R4", "6", t("plastic", "प्लास्टिक")] }] },
      { k: "doc", id: "log", at: "b", hide: true, look: "note", pic: "pencil", title: t("Repair log", "सुधार लॉग"), toks: [{ id: "dup", t: t("R2: keep one exact copy", "R2: एक सटीक कॉपी रखें"), icon: "copy" }, { id: "q", t: t("R3, R4: quarantine pending a reference check", "R3, R4: संदर्भ जाँच तक अलग रखें"), icon: "archive" }, { id: "who", t: t("No collector names", "संग्राहक के नाम नहीं"), icon: "eye-off" }] },
    ],
    sc: [
      { ds: { focus: true, cell: { "r1:1": "info", "r1:2": "ok" }, note: t("Stiffness is the input feature; the checked material is the label to predict", "कठोरता इनपुट विशेषता है; जाँची हुई सामग्री अनुमान का लेबल है"), noteTone: "info" } },
      { ds: { cell: {}, note: t("The identifier tracks repairs — it's not evidence of material. A collector's name would add private information.", "आईडी सुधार का हिसाब रखती है — सामग्री का सबूत नहीं। संग्राहक का नाम निजी जानकारी जोड़ता।"), noteTone: "warn" } },
      { ds: { mark: { r2b: "warn", r3: "warn", r4: "risk", r4b: "risk" }, note: t("A duplicate, a missing label, and conflicting labels — counting every row would exaggerate some examples", "एक दोहराव, एक ग़ायब लेबल और टकराते लेबल — हर पंक्ति गिनने से कुछ उदाहरण बढ़ा-चढ़ाकर दिखेंगे"), noteTone: "warn" }, log: { hide: false } },
      { ds: { note: t("How should missing and conflicting labels be handled?", "ग़ायब और टकराते लेबलों का क्या करें?"), noteTone: "info" } },
      { ds: { mark: { r2b: "gone", r3: "muted", r4: "muted", r4b: "muted" }, note: t("One exact copy kept; R3 and R4 quarantined with a repair log", "एक सटीक कॉपी रखी; R3 और R4 सुधार लॉग के साथ अलग"), noteTone: "ok" }, log: { mark: { dup: "ok", q: "ok", who: "ok" } } },
      { ds: { focus: true } },
    ],
    out: {
      guess: { ds: { txt: { "r3:2": t("plastic (guessed)", "प्लास्टिक (अंदाज़ा)") }, mark: { r3: "risk", r4: "risk" }, note: t("Filling the most common label invents certainty", "सबसे आम लेबल भरना पक्कापन गढ़ना है"), noteTone: "risk" } },
      hold: { ds: { mark: { r2b: "gone", r3: "muted", r4: "muted", r4b: "muted" }, note: t("Quarantine and request a reference check", "अलग रखें और संदर्भ जाँच माँगें"), noteTone: "ok" }, log: { hide: false, mark: { dup: "ok", q: "ok" } } },
      delete: { ds: { mark: { r3: "gone", r4: "gone", r4b: "gone" }, note: t("Hiding rows without a log hides what was uncertain", "लॉग के बिना पंक्तियाँ छिपाना अनिश्चितता छिपाना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-ai-train-test", scene: "lab", layout: "one",
    label: t("Leela's material sorter · nearest example", "लीला का सामग्री-छँटाईकार · सबसे नज़दीकी उदाहरण"),
    art: [
      { k: "chart", id: "plot", look: "scatter", title: t("Stiffness number line", "कठोरता की संख्या-रेखा"), icon: "target", axes: [t("stiffness", "कठोरता"), t("(just spread)", "(सिर्फ़ फैलाव)")], zones: [t("predict paper", "अनुमान: काग़ज़"), t("predict plastic", "अनुमान: प्लास्टिक")], cut: 100, pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 18, y: 62, c: "a", t: "P" }] },
    ],
    sc: [
      { plot: { focus: true, note: t("The toy model copies the label of the nearest selected training card", "खिलौना मॉडल सबसे नज़दीकी चुने ट्रेनिंग कार्ड का लेबल नक़ल करता है"), noteTone: "info" } },
      { plot: { pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 18, y: 62, c: "a", t: "P" }, { x: 66, y: 30, c: "q" }, { x: 82, y: 70, c: "q" }, { x: 92, y: 45, c: "q" }], note: t("Only soft paper selected: even stiff test cards are called paper", "सिर्फ़ नरम काग़ज़ चुना: कड़े टेस्ट कार्ड भी 'काग़ज़' कहे जाते हैं"), noteTone: "risk" } },
      { plot: { pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 18, y: 62, c: "a", t: "P" }, { x: 66, y: 30, c: "q" }, { x: 82, y: 70, c: "q" }, { x: 92, y: 45, c: "q" }], note: t("Training cards teach; separate test cards check — never copy test answers into training", "ट्रेनिंग कार्ड सिखाते हैं; अलग टेस्ट कार्ड जाँचते हैं — टेस्ट के जवाब कभी ट्रेनिंग में न डालें"), noteTone: "info" } },
      { plot: { pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 18, y: 62, c: "a", t: "P" }, { x: 66, y: 30, c: "q" }, { x: 82, y: 70, c: "q" }, { x: 92, y: 45, c: "q" }], note: t("Which repair preserves a useful test?", "कौन-सी मरम्मत उपयोगी टेस्ट बचाए रखती है?"), noteTone: "info" } },
      { plot: { pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 18, y: 62, c: "a", t: "P" }, { x: 78, y: 40, c: "b", t: "L" }, { x: 66, y: 30, c: "b", t: "L" }, { x: 82, y: 70, c: "b", t: "L" }, { x: 92, y: 45, c: "b", t: "L" }], cut: 44, note: t("Both materials covered — the supplied tests pass; identifiers and predictions recorded", "दोनों सामग्रियाँ शामिल — दिए टेस्ट पास; आईडी और अनुमान दर्ज"), noteTone: "ok" } },
      { plot: { focus: true } },
    ],
    out: {
      repeat: { plot: { pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 11, y: 52, c: "a", t: "P" }, { x: 13, y: 60, c: "a", t: "P" }, { x: 9, y: 66, c: "a", t: "P" }, { x: 66, y: 30, c: "q" }, { x: 82, y: 70, c: "q" }, { x: 92, y: 45, c: "q" }], cut: 100, note: t("Repeating paper still leaves no stiff example", "काग़ज़ दोहराने पर भी कोई कड़ा उदाहरण नहीं"), noteTone: "risk" } },
      add: { plot: { pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 18, y: 62, c: "a", t: "P" }, { x: 78, y: 40, c: "b", t: "L" }, { x: 66, y: 30, c: "q" }, { x: 82, y: 70, c: "q" }, { x: 92, y: 45, c: "q" }], cut: 48, note: t("Verified plastic examples added; the tests stay separate", "जाँचे प्लास्टिक उदाहरण जुड़े; टेस्ट अलग रहे"), noteTone: "ok" } },
      leak: { plot: { pts: [{ x: 10, y: 40, c: "a", t: "P" }, { x: 66, y: 30, c: "b", t: "L" }, { x: 82, y: 70, c: "b", t: "L" }, { x: 92, y: 45, c: "b", t: "L" }], cut: 40, note: t("Training on the answers makes the test meaningless", "जवाबों पर ट्रेनिंग से टेस्ट बेमानी हो जाता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-ai-picture-features", scene: "garden", layout: "two",
    label: t("Watering can or flowerpot? · the background shortcut", "पानी का डिब्बा या गमला? · पृष्ठभूमि का शॉर्टकट"),
    art: [
      { k: "table", id: "pack", at: "a", title: t("First pack: can on grass, pot on a table", "पहला पैक: घास पर डिब्बा, मेज़ पर गमला"), icon: "image", cols: [t("Picture", "चित्र"), t("Object", "वस्तु"), t("Background", "पृष्ठभूमि"), t("Model says", "मॉडल कहता है")], rows: [{ id: "c1", c: ["1", t("can", "डिब्बा"), t("grass", "घास"), t("can ✓", "डिब्बा ✓")] }, { id: "p1", c: ["2", t("pot", "गमला"), t("table", "मेज़"), t("pot ✓", "गमला ✓")] }] },
      { k: "doc", id: "feat", at: "b", hide: true, look: "card", pic: "search", title: t("Feature card (revealed)", "फ़ीचर कार्ड (खुला)"), sub: t("What this model really uses", "यह मॉडल असल में क्या इस्तेमाल करता है"), toks: [{ id: "bg", t: t("Background colour: grass → can, table → pot", "पृष्ठभूमि का रंग: घास → डिब्बा, मेज़ → गमला"), icon: "leaf" }, { id: "sp", t: t("Spout and handle", "टोंटी और हत्था"), icon: "droplets" }, { id: "sh", t: t("Object shape", "वस्तु का आकार"), icon: "shapes" }], mark: { bg: "risk" } },
    ],
    sc: [
      { pack: { focus: true, mark: { c1: "ok", p1: "ok" }, note: t("In the first demonstration, every can is on grass and every pot on a table", "पहले प्रदर्शन में हर डिब्बा घास पर और हर गमला मेज़ पर"), noteTone: "info" } },
      { pack: { focus: false, note: undefined }, feat: { hide: false, focus: true, note: t("Success here doesn't show it recognises a spout, handle or shape", "यहाँ की सफलता नहीं दिखाती कि वह टोंटी, हत्था या आकार पहचानता है"), noteTone: "warn" } },
      { pack: { note: t("Same can on a table, spout and handle kept: the shortcut says 'pot'. Change only the background so the failure is easy to explain.", "वही डिब्बा मेज़ पर, टोंटी-हत्था वैसे ही: शॉर्टकट 'गमला' कहता है। सिर्फ़ पृष्ठभूमि बदलें ताकि नाकामी समझाना आसान हो।"), noteTone: "warn" }, feat: { focus: false, note: undefined } },
      { feat: { mark: { bg: "risk", sp: "info", sh: "info" }, note: undefined } },
      { feat: { mark: { bg: "risk", sp: "ok", sh: "ok" }, note: t("Object features are better evidence — and a hidden spout is still a limit", "वस्तु की विशेषताएँ बेहतर सबूत हैं — और छिपी टोंटी फिर भी एक सीमा है"), noteTone: "ok" } },
      { feat: { focus: true } },
    ],
    out: {
      same: { pack: { note: t("More of the same still can't separate object from background", "वैसे ही और चित्र वस्तु को पृष्ठभूमि से अलग नहीं करते"), noteTone: "risk" } },
      swap: { pack: { txt: { "c1:2": t("table", "मेज़"), "c1:3": t("pot ✗", "गमला ✗"), "p1:2": t("grass", "घास"), "p1:3": t("can ✗", "डिब्बा ✗") }, mark: { c1: "risk", p1: "risk" }, note: t("Same objects, backgrounds exchanged — both errors appear", "वही वस्तुएँ, पृष्ठभूमि अदल-बदल — दोनों ग़लतियाँ दिखती हैं"), noteTone: "ok" } },
      delete: { pack: { mark: { c1: "gone", p1: "gone" }, note: t("Hiding wrong predictions hides the shortcut", "ग़लत अनुमान छिपाना शॉर्टकट छिपाना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-ai-chatbot-claims", scene: "library", layout: "two",
    label: t("Science magazine · an assistant's garden paragraph", "विज्ञान पत्रिका · सहायक का बाग़ वाला पैराग्राफ़"),
    art: [
      { k: "doc", id: "reply", at: "a", look: "note", pic: "bot", title: t("Assistant's reply", "सहायक का जवाब"), sub: t("Dev is reviewing it", "देव इसकी समीक्षा कर रहा है"), toks: [{ id: "sun", t: t("Every seed needs sunlight to germinate.", "हर बीज को अंकुरित होने के लिए धूप चाहिए।"), icon: "sun" }, { id: "cite", t: t("(cites booklet page 14)", "(पुस्तिका के पृष्ठ 14 का हवाला)"), icon: "quote" }] },
      { k: "doc", id: "src", at: "b", hide: true, look: "card", pic: "book-open", title: t("Booklet extract", "पुस्तिका का अंश"), sub: t("What the page actually says", "पृष्ठ असल में क्या कहता है"), toks: [{ id: "vary", t: t("Seed requirements vary", "बीज की ज़रूरतें अलग-अलग हैं"), icon: "shuffle" }, { id: "need", t: t("Moisture, suitable temperature, air", "नमी, उपयुक्त तापमान, हवा"), icon: "droplets" }, { id: "no", t: t("No universal sunlight claim", "धूप का कोई सार्वभौमिक दावा नहीं"), icon: "x" }] },
    ],
    sc: [
      { reply: { focus: true, note: t("Confident — and cites a page", "आत्मविश्वासी — और एक पृष्ठ का हवाला देता है"), noteTone: "info" } },
      { src: { hide: false, mark: { vary: "ok", need: "ok", no: "warn" } }, reply: { mark: { sun: "risk", cite: "warn" }, note: t("The quoted page doesn't support the universal claim", "उद्धृत पृष्ठ सार्वभौमिक दावे का समर्थन नहीं करता"), noteTone: "risk" } },
      { reply: { note: t("Models generate plausible continuations from patterns — a confident tone is not a fact check", "मॉडल पैटर्न से संभावित वाक्य बनाते हैं — आत्मविश्वासी लहजा तथ्य-जाँच नहीं है"), noteTone: "info" } },
      { reply: { note: t("What should the magazine team do?", "पत्रिका टीम क्या करे?"), noteTone: "info" } },
      { reply: { look: "card", title: t("Revised paragraph", "सुधरा पैराग्राफ़"), sub: t("Checked and edited by students", "विद्यार्थियों ने जाँचा और संपादित किया"), toks: [{ id: "sun", t: t("Seeds need moisture, suitable temperature and air; some also respond to light.", "बीजों को नमी, उपयुक्त तापमान और हवा चाहिए; कुछ प्रकाश पर भी प्रतिक्रिया देते हैं।"), icon: "leaf" }, { id: "cite", t: t("Drafted with a simulated assistant; teacher reviews", "नक़ली सहायक की मदद से बना; टीचर समीक्षा करती हैं"), icon: "user-ok" }], mark: { sun: "ok", cite: "ok" }, note: t("Supported wording only", "सिर्फ़ समर्थित शब्द"), noteTone: "ok" } },
      { reply: { focus: true } },
    ],
    out: {
      publish: { reply: { mark: { sun: "risk", cite: "risk" }, note: t("Sounding certain isn't being supported", "पक्का सुनाई देना समर्थित होना नहीं है"), noteTone: "risk" } },
      revise: { reply: { look: "card", title: t("Revised paragraph", "सुधरा पैराग्राफ़"), toks: [{ id: "sun", t: t("Seeds need moisture, suitable temperature and air; some also respond to light.", "बीजों को नमी, उपयुक्त तापमान और हवा चाहिए; कुछ प्रकाश पर भी प्रतिक्रिया देते हैं।"), icon: "leaf" }, { id: "cite", t: t("Drafted with a simulated assistant; teacher reviews", "नक़ली सहायक की मदद से बना; टीचर समीक्षा करती हैं"), icon: "user-ok" }], mark: { sun: "ok", cite: "ok" }, note: t("Revise to supported wording; ask for missing evidence", "समर्थित शब्दों में सुधारें; ग़ायब सबूत माँगें"), noteTone: "ok" } },
      invent: { reply: { mark: { cite: "risk" }, toks: [{ id: "sun", t: t("Every seed needs sunlight to germinate.", "हर बीज को अंकुरित होने के लिए धूप चाहिए।"), icon: "sun" }, { id: "cite", t: t("(page 27 — invented)", "(पृष्ठ 27 — गढ़ा हुआ)"), icon: "quote" }], note: t("Inventing a page number fakes evidence", "पृष्ठ-संख्या गढ़ना सबूत गढ़ना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-ai-data-left-out", scene: "classroom", layout: "two",
    label: t("Two classrooms · one recycling classifier", "दो कक्षाएँ · एक रीसाइक्लिंग क्लासिफ़ायर"),
    art: [
      { k: "chart", id: "train", at: "a", look: "split", title: t("What it was trained on", "किस पर ट्रेन हुआ"), icon: "layers", parts: [{ t: t("plain cards", "सादे कार्ड"), v: 60, tone: "info" }, { t: t("shiny wrapper", "चमकीला रैपर"), v: 1, tone: "risk" }] },
      { k: "chart", id: "err", at: "b", hide: true, look: "bars", max: 40, title: t("Errors vs tests", "ग़लतियाँ बनाम परीक्षण"), icon: "bars", bars: [{ id: "pe", t: t("Plain: errors", "सादा: ग़लतियाँ"), v: 4, tone: "warn" }, { id: "pt", t: t("Plain: tests", "सादा: परीक्षण"), v: 40, tone: "muted" }, { id: "se", t: t("Shiny: errors", "चमकीला: ग़लतियाँ"), v: 3, tone: "risk" }, { id: "st", t: t("Shiny: tests", "चमकीला: परीक्षण"), v: 10, tone: "muted" }] },
    ],
    sc: [
      { train: { focus: true, note: t("The first classroom uses mostly plain cards; the second has many shiny wrappers", "पहली कक्षा में ज़्यादातर सादे कार्ड; दूसरी में बहुत से चमकीले रैपर"), noteTone: "info" } },
      { train: { note: t("One shiny example among many plain ones — one possible cause; check lighting, measurement and labels too", "बहुत से सादे में सिर्फ़ एक चमकीला — एक संभावित कारण; रोशनी, माप और लेबल भी जाँचें"), noteTone: "warn" } },
      { train: { focus: false, note: undefined }, err: { hide: false, focus: true, note: t("4 of 40 = 10% vs 3 of 10 = 30% — each rate uses its own group's total", "40 में 4 = 10% बनाम 10 में 3 = 30% — हर दर अपने समूह के कुल पर"), noteTone: "warn" } },
      { err: { focus: false, note: t("Which conclusion fits the evidence?", "कौन-सा निष्कर्ष सबूत से मेल खाता है?"), noteTone: "info" } },
      { train: { parts: [{ t: t("plain cards", "सादे कार्ड"), v: 30, tone: "info" }, { t: t("shiny wrappers", "चमकीले रैपर"), v: 30, tone: "ok" }], note: t("Balanced, checked examples and separate tests across backgrounds", "संतुलित, जाँचे उदाहरण और अलग-अलग पृष्ठभूमि पर अलग परीक्षण"), noteTone: "ok" }, err: { note: undefined } },
      { err: { focus: true } },
    ],
    out: {
      fair: { err: { hide: false, note: t("Seven total errors hides who had them", "कुल सात ग़लतियाँ यह छिपाती हैं कि किसकी थीं"), noteTone: "risk" } },
      gap: { err: { hide: false, note: t("Shiny error rate is higher in this sample — investigate coverage and other causes", "इस नमूने में चमकीले की दर ज़्यादा है — कवरेज और दूसरे कारण जाँचें"), noteTone: "ok" } },
      counts: { err: { hide: false, bars: [{ id: "pe", t: t("Plain: 4", "सादा: 4"), v: 4, tone: "risk" }, { id: "se", t: t("Shiny: 3", "चमकीला: 3"), v: 3, tone: "ok" }], note: t("Counting errors alone ignores how many tests each group had", "सिर्फ़ ग़लतियाँ गिनना भूल जाता है कि हर समूह के कितने परीक्षण थे"), noteTone: "risk" } },
    },
  },
  {
    slug: "class8-ai-design-fair", scene: "classroom", layout: "two",
    label: t("The helpful AI design fair · Sana's proposal", "मददगार AI डिज़ाइन मेला · सना का प्रस्ताव"),
    art: [
      { k: "table", id: "crit", at: "a", title: t("Success means…", "सफलता का मतलब…"), icon: "target", cols: [t("Criterion", "मापदंड"), t("Lookup table", "लुकअप तालिका"), t("Toy model", "खिलौना मॉडल")], rows: [{ id: "acc", c: [t("≥ 8 correct in 10 separate tests", "10 अलग परीक्षणों में ≥ 8 सही"), "?", "?"] }, { id: "pi", c: [t("No personal information", "कोई निजी जानकारी नहीं"), "✓", "✓"] }, { id: "rev", c: [t("Teacher reviews uncertain cases", "टीचर अनिश्चित मामले जाँचती हैं"), "✓", "✓"] }] },
      { k: "doc", id: "card", at: "b", hide: true, look: "form", pic: "clipboard-ok", title: t("Project card", "प्रोजेक्ट कार्ड"), toks: [{ id: "p", t: t("Purpose", "उद्देश्य"), icon: "target" }, { id: "d", t: t("Synthetic data", "बनावटी डेटा"), icon: "db" }, { id: "c", t: t("Test counts and comparison", "परीक्षण की गिनती और तुलना"), icon: "scale" }, { id: "r", t: t("Responsible reviewer", "ज़िम्मेदार समीक्षक"), icon: "user-ok" }, { id: "l", t: t("Applies only to this collection", "सिर्फ़ इसी संग्रह पर लागू"), icon: "alert" }] },
    ],
    sc: [
      { crit: { focus: true, note: t("A useful project needs a clear purpose, an honest comparison and someone responsible", "उपयोगी प्रोजेक्ट को साफ़ उद्देश्य, ईमानदार तुलना और ज़िम्मेदार व्यक्ति चाहिए"), noteTone: "info" } },
      { crit: { note: t("Eight correct in ten separate tests, no personal information, teacher review", "दस अलग परीक्षणों में आठ सही, निजी जानकारी नहीं, टीचर समीक्षा"), noteTone: "info" } },
      { crit: { txt: { "acc:1": "9 / 10 ✓", "acc:2": "8 / 10 ✓" }, mark: { acc: "ok" }, note: t("The table gets nine; the toy model gets eight", "तालिका के नौ; खिलौना मॉडल के आठ"), noteTone: "info" } },
      { crit: { txt: { "acc:1": "9 / 10 ✓", "acc:2": "8 / 10 ✓" }, note: t("What proposal should Sana defend?", "सना किस प्रस्ताव का बचाव करे?"), noteTone: "info" } },
      { crit: { txt: { "acc:1": "9 / 10 ✓", "acc:2": "8 / 10 ✓" } }, card: { hide: false, mark: { p: "ok", d: "ok", c: "ok", r: "ok", l: "hl" }, note: t("Purpose, synthetic data, counts, comparison, reviewer — and its limits", "उद्देश्य, बनावटी डेटा, गिनतियाँ, तुलना, समीक्षक — और सीमाएँ"), noteTone: "ok" } },
      { card: { focus: true } },
    ],
    out: {
      hide: { crit: { txt: { "acc:1": "—", "acc:2": "8 / 10 ✓" }, mark: { acc: "risk" }, note: t("Hiding the table's result hides the honest comparison", "तालिका का नतीजा छिपाना ईमानदार तुलना छिपाना है"), noteTone: "risk" } },
      table: { crit: { txt: { "acc:1": "9 / 10 ✓", "acc:2": "8 / 10 ✓" }, mark: { acc: "ok" }, note: t("Recommend the table here — and document the comparison", "यहाँ तालिका सुझाएँ — और तुलना दर्ज करें"), noteTone: "ok" } },
      perfect: { crit: { txt: { "acc:1": "9 / 10 ✓", "acc:2": "10 / 10 ?!" }, mark: { acc: "risk" }, note: t("\"Perfect\" isn't what ten tests showed", "\"पूर्ण\" वह नहीं जो दस परीक्षणों ने दिखाया"), noteTone: "risk" } },
    },
  },
];
