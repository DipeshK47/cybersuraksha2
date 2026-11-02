import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class6AiWorlds: World[] = [
  {
    slug: "class6-ai-or-instructions", scene: "lab", layout: "two",
    label: t("Timer, sorter and a mystery toy", "टाइमर, छँटाईकार और एक रहस्यमयी खिलौना"),
    art: [
      { k: "table", id: "tools", at: "a", title: t("How does each tool get its answer?", "हर औज़ार अपना जवाब कैसे पाता है?"), icon: "cpu", cols: [t("Tool", "औज़ार"), t("Acts by itself?", "ख़ुद चलता है?"), t("How it answers", "जवाब कैसे देता है")],
        rows: [{ id: "timer", c: [t("Meera's timer", "मीरा का टाइमर"), "✓", "?"] }, { id: "sorter", c: [t("Kabir's picture sorter", "कबीर का चित्र-छँटाईकार"), "✓", "?"] }, { id: "toy", c: [t("Talking toy", "बोलने वाला खिलौना"), "✓", "?"] }], upTo: 2 },
      { k: "doc", id: "proof", at: "b", look: "card", pic: "search", title: t("Evidence about the mechanism", "तरीक़े का सबूत"), sub: t("A shiny box and the word 'smart' prove nothing", "चमकीला डिब्बा और 'स्मार्ट' शब्द कुछ साबित नहीं करते"),
        toks: [{ id: "rule", t: t("Follows a fixed countdown instruction", "तय उल्टी-गिनती निर्देश मानता है"), icon: "list" }, { id: "learn", t: t("Built from labelled examples", "लेबल लगे उदाहरणों से बना"), icon: "image" }, { id: "advert", t: t("The box says 'smart'", "डिब्बे पर 'स्मार्ट' लिखा है"), icon: "megaphone" }, { id: "explain", t: t("An explanation of how it works", "यह कैसे काम करता है — इसकी व्याख्या"), icon: "book-open" }] },
    ],
    sc: [
      { tools: { focus: true, note: t("Both respond without a person pressing every step", "दोनों बिना हर बार बटन दबाए जवाब देते हैं"), noteTone: "info" }, proof: { hide: true } },
      { tools: { txt: { "timer:2": t("fixed countdown rule", "तय उल्टी-गिनती का नियम"), "sorter:2": t("learned from labelled examples", "लेबल वाले उदाहरणों से सीखा") }, mark: { timer: "info", sorter: "ok" }, note: t("These descriptions tell you more than the word 'smart'", "ये ब्योरे 'स्मार्ट' शब्द से ज़्यादा बताते हैं"), noteTone: "info" }, proof: { hide: false, mark: { rule: "ok", learn: "ok" } } },
      { tools: { upTo: 3, txt: { "timer:2": t("fixed countdown rule", "तय उल्टी-गिनती का नियम"), "sorter:2": t("learned from labelled examples", "लेबल वाले उदाहरणों से सीखा"), "toy:2": t("no explanation yet", "अभी कोई व्याख्या नहीं") }, mark: { toy: "warn" }, note: t("Mystery device: the honest answer is 'more evidence is needed'", "रहस्यमयी डिवाइस: ईमानदार उत्तर है 'और सबूत चाहिए'"), noteTone: "warn" }, proof: { mark: { rule: "ok", learn: "ok", advert: "warn" } } },
      { tools: { upTo: 3, note: t("A talking toy says it is smart. Is that evidence of AI?", "बोलने वाला खिलौना कहता है वह स्मार्ट है। क्या यह AI का सबूत है?"), noteTone: "info" } },
      { tools: { mark: { toy: "ok" }, txt: { "timer:2": t("fixed countdown rule", "तय उल्टी-गिनती का नियम"), "sorter:2": t("learned from labelled examples", "लेबल वाले उदाहरणों से सीखा"), "toy:2": t("ask how it responds", "पूछें कि यह कैसे जवाब देता है") }, note: t("Mechanism evidence — not advertising — shows whether it learned from examples", "तरीक़े का सबूत — विज्ञापन नहीं — बताता है कि उदाहरणों से सीखा या नहीं"), noteTone: "ok" }, proof: { mark: { rule: "ok", learn: "ok", advert: "gone", explain: "ok" } } },
      { tools: { focus: true } },
    ],
    out: {
      "option-0": { proof: { mark: { advert: "risk" }, note: t("Talking doesn't mean learning — a recording talks too", "बोलने का मतलब सीखना नहीं — रिकॉर्डिंग भी बोलती है"), noteTone: "risk" } },
      "option-1": { proof: { mark: { rule: "risk" }, note: t("Buttons and AI can go together; buttons alone prove nothing", "बटन और AI साथ हो सकते हैं; सिर्फ़ बटन कुछ साबित नहीं करते"), noteTone: "risk" } },
      "option-2": { proof: { mark: { advert: "gone", explain: "ok" }, note: t("We need mechanism evidence", "हमें तरीक़े का सबूत चाहिए"), noteTone: "ok" } },
    },
  },
  {
    slug: "class6-ai-label-cards", scene: "garden", layout: "two",
    label: t("Illustrated leaf cards · round or pointed?", "चित्रित पत्ता कार्ड · गोल या नुकीला?"),
    art: [
      { k: "table", id: "cards", at: "a", title: t("Leaf card records", "पत्ता कार्ड रिकॉर्ड"), icon: "leaf", cols: [t("Card", "कार्ड"), t("Shape (feature)", "आकार (विशेषता)"), t("Label (answer)", "लेबल (उत्तर)"), t("Artist's home address", "कलाकार का घर का पता")],
        rows: [{ id: "l1", c: ["1", t("round", "गोल"), t("round", "गोल"), "—"] }, { id: "l2", c: ["2", t("pointed", "नुकीला"), t("pointed", "नुकीला"), "—"] }, { id: "l3", c: ["3", t("smudged", "धुंधला"), "?", "—"] }] },
      { k: "doc", id: "prep", at: "b", look: "note", pic: "clipboard-ok", title: t("Preparing a new example", "नया उदाहरण तैयार करना"), toks: [{ id: "see", t: t("Look at the visible shape", "दिखता आकार देखें"), icon: "eye" }, { id: "set", t: t("Add only if it's clear", "साफ़ हो तभी जोड़ें"), icon: "check" }, { id: "hold", t: t("Unclear? Keep it aside for review", "अस्पष्ट? समीक्षा के लिए अलग रखें"), icon: "archive" }] },
    ],
    sc: [
      { cards: { focus: true, cell: { "l1:1": "info", "l1:2": "ok" }, note: t("Meera records the visible shape. Kabir asks about the address…", "मीरा दिखता आकार लिखती है। कबीर पते के बारे में पूछता है…"), noteTone: "info" } },
      { cards: { cell: { "l1:1": "info", "l1:2": "ok", "l1:3": "risk", "l2:3": "risk" }, txt: { "l1:3": t("not needed", "ज़रूरी नहीं"), "l2:3": t("not needed", "ज़रूरी नहीं") }, note: t("A feature helps predict; a label is the answer. A home address helps with neither.", "विशेषता अनुमान में मदद करती है; लेबल उत्तर है। घर का पता किसी में मदद नहीं करता।"), noteTone: "warn" } },
      { cards: { cell: {}, mark: { l3: "warn" }, note: t("A smudged drawing is kept aside — a guessed label could teach the wrong thing", "धुंधला चित्र अलग रखा — अंदाज़े वाला लेबल ग़लत सिखा सकता है"), noteTone: "info" }, prep: { mark: { hold: "hl" } } },
      { cards: { note: t("What should happen to the smudged drawing?", "धुंधले चित्र का क्या करें?"), noteTone: "info" } },
      { cards: { mark: { l3: "muted" }, txt: { "l3:2": t("held for review", "समीक्षा के लिए रखा") }, note: t("Uncertainty stays visible so the example can be improved later", "अनिश्चितता दिखती रहती है ताकि उदाहरण बाद में सुधरे"), noteTone: "ok" }, prep: { mark: { hold: "ok", see: "ok" } } },
      { cards: { focus: true } },
    ],
    out: {
      "option-0": { cards: { txt: { "l3:2": t("pointed (a guess)", "नुकीला (अंदाज़ा)") }, mark: { l3: "risk" }, note: t("An invented label could teach the wrong connection", "गढ़ा हुआ लेबल ग़लत जुड़ाव सिखा सकता है"), noteTone: "risk" } },
      "option-1": { cards: { mark: { l3: "muted" }, txt: { "l3:2": t("held for review", "समीक्षा के लिए रखा") }, note: t("Hold it for review", "इसे समीक्षा के लिए रोकें"), noteTone: "ok" }, prep: { mark: { hold: "ok" } } },
      "option-2": { cards: { txt: { "l3:3": t("the artist's address", "कलाकार का पता") }, mark: { l3: "risk" }, cell: { "l3:3": "risk" }, note: t("The address doesn't tell you the shape — and it's private", "पता आकार नहीं बताता — और वह निजी है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-ai-spot-pattern", scene: "garden", layout: "two",
    label: t("Fruit sorter · red means apple", "फल-छँटाईकार · लाल मतलब सेब"),
    art: [
      { k: "table", id: "run", at: "a", title: t("Prediction vs the checked label", "अनुमान बनाम जाँचा गया लेबल"), icon: "target", cols: [t("Card", "कार्ड"), t("Colour", "रंग"), t("Predicted", "अनुमान"), t("Checked", "जाँचा"), t("Match", "मेल")],
        rows: [{ id: "c1", c: [t("Red apple", "लाल सेब"), t("red", "लाल"), t("apple", "सेब"), t("apple", "सेब"), "✓"] }, { id: "c2", c: [t("Green pear", "हरी नाशपाती"), t("green", "हरा"), t("pear", "नाशपाती"), t("pear", "नाशपाती"), "✓"] }, { id: "c3", c: [t("Green apple", "हरा सेब"), t("green", "हरा"), t("pear", "नाशपाती"), t("apple", "सेब"), "✗"] }], upTo: 1, foot: t("Rule: red → apple, anything else → pear", "नियम: लाल → सेब, बाक़ी → नाशपाती") },
      { k: "chart", id: "errs", at: "b", hide: true, look: "split", title: t("Checked results", "जाँचे नतीजे"), icon: "pie", parts: [{ t: t("right", "सही"), v: 2, tone: "ok" }, { t: t("wrong", "ग़लत"), v: 1, tone: "risk" }] },
    ],
    sc: [
      { run: { focus: true, note: t("A prepared classroom model — everyone can follow its colour rule", "तैयार क्लासरूम मॉडल — सब उसका रंग-नियम देख सकते हैं"), noteTone: "info" } },
      { run: { upTo: 2, mark: { c1: "ok", c2: "ok" }, note: t("Kabir: it must understand fruit! Meera adds a checked green apple…", "कबीर: यह फल समझता है! मीरा एक जाँचा हुआ हरा सेब जोड़ती है…"), noteTone: "warn" } },
      { run: { upTo: 3, mark: { c1: "ok", c2: "ok", c3: "risk" }, cell: { "c3:2": "risk", "c3:3": "ok" }, note: t("One counterexample disproves 'always correct' — record the disagreement", "एक प्रतिउदाहरण 'हमेशा सही' को ग़लत साबित करता है — अमेल दर्ज करें"), noteTone: "risk" }, errs: { hide: false } },
      { run: { upTo: 3, note: t("What does the green apple reveal?", "हरा सेब क्या दिखाता है?"), noteTone: "info" } },
      { run: { upTo: 3, mark: { c3: "hl" }, note: t("The colour rule has a limitation — keep both prediction and checked label", "रंग-नियम की एक सीमा है — अनुमान और जाँचा लेबल दोनों रखें"), noteTone: "ok" } },
      { run: { focus: true } },
    ],
    out: {
      "option-0": { run: { txt: { "c3:3": t("pear (changed)", "नाशपाती (बदला)") }, mark: { c3: "risk" }, note: t("Changing the truth to fit the rule hides the mistake", "सच बदलकर नियम में बिठाना ग़लती छिपाना है"), noteTone: "risk" } },
      "option-1": { run: { mark: { c3: "hl" }, cell: { "c3:2": "risk", "c3:3": "ok" }, note: t("The rule uses colour — and colour isn't enough", "नियम रंग पर चलता है — और रंग काफ़ी नहीं"), noteTone: "ok" } },
      "option-2": { run: { upTo: 2, note: t("Hiding the green card hides the evidence", "हरा कार्ड छिपाना सबूत छिपाना है"), noteTone: "risk" }, errs: { hide: true } },
    },
  },
  {
    slug: "class6-ai-fresh-test", scene: "lab", layout: "two",
    label: t("Shape cards · practice envelope vs check envelope", "आकार कार्ड · अभ्यास लिफ़ाफ़ा बनाम जाँच लिफ़ाफ़ा"),
    art: [
      { k: "chart", id: "env", at: "a", look: "split", title: t("Two separate envelopes", "दो अलग लिफ़ाफ़े"), icon: "archive", parts: [{ t: t("practice cards (4)", "अभ्यास कार्ड (4)"), v: 4, tone: "info" }, { t: t("check cards (5) — kept apart", "जाँच कार्ड (5) — अलग रखे"), v: 5, tone: "warn" }] },
      { k: "chart", id: "score", at: "b", look: "bars", max: 5, hide: true, title: t("Right answers", "सही उत्तर"), icon: "bars", bars: [{ id: "p", t: t("Practice cards", "अभ्यास कार्ड"), v: 4, tone: "info" }, { id: "f", t: t("Fresh check", "नई जाँच"), v: 4, tone: "ok" }] },
    ],
    sc: [
      { env: { focus: true, note: t("Kabir gets all four practice cards right and wants to announce 'perfect'", "कबीर चारों अभ्यास कार्ड सही करता है और 'पूर्ण' बताना चाहता है"), noteTone: "warn" } },
      { env: { note: t("Practice builds the model; a fresh check asks if it handles separate examples", "अभ्यास मॉडल बनाता है; नई जाँच पूछती है कि अलग उदाहरणों पर चलता है या नहीं"), noteTone: "info" } },
      { env: { focus: false, note: undefined }, score: { hide: false, focus: true, bars: [{ id: "p", t: t("Practice cards (4 of 4)", "अभ्यास कार्ड (4/4)"), v: 4, tone: "info" }, { id: "f", t: t("Fresh check (4 of 5)", "नई जाँच (4/5)"), v: 4, tone: "warn" }], note: t("One fresh card is wrong — report 4 of 5, keep the failure", "एक नया कार्ड ग़लत — 4/5 बताएँ, नाकामी रखें"), noteTone: "warn" } },
      { score: { focus: false, note: t("Which check better tests a new example?", "नया उदाहरण कौन-सी जाँच बेहतर परखती है?"), noteTone: "info" } },
      { score: { bars: [{ id: "p", t: t("Practice cards (4 of 4)", "अभ्यास कार्ड (4/4)"), v: 4, tone: "muted" }, { id: "f", t: t("Fresh check (4 of 5)", "नई जाँच (4/5)"), v: 4, tone: "ok" }], note: t("Use the separate check envelope; report every outcome", "अलग जाँच लिफ़ाफ़ा लें; हर नतीजा बताएँ"), noteTone: "ok" } },
      { score: { focus: true } },
    ],
    out: {
      "option-0": { score: { hide: false, bars: [{ id: "p", t: t("Practice cards (4 of 4)", "अभ्यास कार्ड (4/4)"), v: 4, tone: "risk" }, { id: "f", t: t("Fresh check (not run)", "नई जाँच (नहीं की)"), v: 0, tone: "muted" }], note: t("Repeating memorised cards says nothing about new ones", "याद किए कार्ड दोहराने से नए कार्डों के बारे में कुछ पता नहीं चलता"), noteTone: "risk" } },
      "option-1": { score: { hide: false, bars: [{ id: "p", t: t("Practice cards (4 of 4)", "अभ्यास कार्ड (4/4)"), v: 4, tone: "muted" }, { id: "f", t: t("Fresh check (4 of 5)", "नई जाँच (4/5)"), v: 4, tone: "ok" }], note: t("Separate cards, honest result", "अलग कार्ड, ईमानदार नतीजा"), noteTone: "ok" } },
      "option-2": { score: { hide: false, bars: [{ id: "p", t: t("Right only", "सिर्फ़ सही"), v: 4, tone: "warn" }, { id: "f", t: t("Misses hidden", "चूकें छिपीं"), v: 0, tone: "muted" }], note: t("Counting only successes hides the failures", "सिर्फ़ सफलताएँ गिनना नाकामियाँ छिपाना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-ai-missing-examples", scene: "garden", layout: "two",
    label: t("Leaf sorter · who is missing from the examples?", "पत्ता-छँटाईकार · उदाहरणों में कौन छूटा?"),
    art: [
      { k: "chart", id: "seen", at: "a", look: "split", title: t("What the sorter learned from", "छँटाईकार ने किससे सीखा"), icon: "layers", parts: [{ t: t("large dark leaves", "बड़े गहरे पत्ते"), v: 20, tone: "info" }, { t: t("small pale leaves", "छोटे हल्के पत्ते"), v: 0, tone: "risk" }] },
      { k: "chart", id: "miss", at: "b", look: "bars", max: 8, hide: true, title: t("Mistakes in each group", "हर समूह की ग़लतियाँ"), icon: "bars", bars: [{ id: "big", t: t("Large dark", "बड़े गहरे"), v: 1, tone: "ok" }, { id: "small", t: t("Small pale", "छोटे हल्के"), v: 7, tone: "risk" }] },
    ],
    sc: [
      { seen: { focus: true, note: t("It has seen only large dark leaf drawings", "इसने सिर्फ़ बड़े गहरे पत्ते देखे हैं"), noteTone: "warn" } },
      { seen: { focus: false, note: undefined }, miss: { hide: false, focus: true, note: t("Count mistakes for each group — one overall score can hide the problem", "हर समूह की ग़लतियाँ गिनें — एक कुल स्कोर समस्या छिपा सकता है"), noteTone: "risk" } },
      { miss: { focus: false, note: undefined }, seen: { parts: [{ t: t("large dark leaves", "बड़े गहरे पत्ते"), v: 20, tone: "info" }, { t: t("small pale leaves", "छोटे हल्के पत्ते"), v: 14, tone: "ok" }, { t: t("other sizes and shades", "और आकार व रंग"), v: 10, tone: "ok" }], note: t("Relevant leaf drawings added — no faces, names or addresses", "संबंधित पत्ता-चित्र जुड़े — न चेहरे, न नाम, न पते"), noteTone: "ok" } },
      { seen: { parts: [{ t: t("large dark leaves", "बड़े गहरे पत्ते"), v: 20, tone: "info" }, { t: t("small pale leaves", "छोटे हल्के पत्ते"), v: 0, tone: "risk" }], note: t("What should the club add next?", "क्लब आगे क्या जोड़े?"), noteTone: "info" } },
      { seen: { parts: [{ t: t("large dark leaves", "बड़े गहरे पत्ते"), v: 20, tone: "info" }, { t: t("small pale leaves", "छोटे हल्के पत्ते"), v: 14, tone: "ok" }, { t: t("other sizes and shades", "और आकार व रंग"), v: 10, tone: "ok" }], note: t("Checked varied drawings, then a separate test", "जाँचे विविध चित्र, फिर अलग परीक्षण"), noteTone: "ok" }, miss: { bars: [{ id: "big", t: t("Large dark", "बड़े गहरे"), v: 1, tone: "ok" }, { id: "small", t: t("Small pale", "छोटे हल्के"), v: 2, tone: "warn" }] } },
      { seen: { focus: true } },
    ],
    out: {
      "option-0": { seen: { parts: [{ t: t("large dark leaves (copied)", "बड़े गहरे पत्ते (नक़ल)"), v: 60, tone: "info" }, { t: t("small pale leaves", "छोटे हल्के पत्ते"), v: 0, tone: "risk" }], note: t("More copies of the same leaf still leave a gap", "एक ही पत्ते की और प्रतियाँ भी कमी नहीं भरतीं"), noteTone: "risk" } },
      "option-1": { seen: { parts: [{ t: t("large dark leaves", "बड़े गहरे पत्ते"), v: 20, tone: "info" }, { t: t("small pale leaves", "छोटे हल्के पत्ते"), v: 14, tone: "ok" }, { t: t("other sizes and shades", "और आकार व रंग"), v: 10, tone: "ok" }], note: t("Relevant variation fills the gap", "संबंधित विविधता कमी भरती है"), noteTone: "ok" } },
      "option-2": { seen: { parts: [{ t: t("large dark leaves", "बड़े गहरे पत्ते"), v: 20, tone: "info" }, { t: t("children's home addresses", "बच्चों के घर के पते"), v: 20, tone: "risk" }], note: t("Addresses don't help sort leaves — and they're private", "पते पत्ते छाँटने में काम नहीं आते — और निजी हैं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-ai-check-the-answer", scene: "library", layout: "two",
    label: t("Club garden note · assistant draft vs source card", "क्लब बाग़ का नोट · सहायक का मसौदा बनाम स्रोत कार्ड"),
    art: [
      { k: "doc", id: "draft", at: "a", look: "note", pic: "bot", title: t("The assistant's draft note", "सहायक का मसौदा नोट"), sub: t("Smooth and confident", "सहज और आत्मविश्वासी"),
        toks: [{ id: "n20", t: t("The club planted twenty seeds.", "क्लब ने बीस बीज बोए।"), icon: "leaf" }, { id: "grow", t: t("Every seed will grow.", "हर बीज उगेगा।"), icon: "sparkles" }] },
      { k: "doc", id: "src", at: "b", look: "card", pic: "clipboard-ok", title: t("Teacher's source card", "टीचर का स्रोत कार्ड"), sub: t("The checked record", "जाँचा हुआ रिकॉर्ड"), toks: [{ id: "n12", t: t("12 seeds planted", "12 बीज बोए गए"), icon: "check" }, { id: "no", t: t("Nothing about every seed growing", "हर बीज उगने की कोई बात नहीं"), icon: "x" }] },
    ],
    sc: [
      { draft: { focus: true, note: t("It sounds sure — Kabir checks the number before copying", "यह पक्का लगता है — कबीर नक़ल से पहले संख्या जाँचता है"), noteTone: "info" }, src: { hide: true } },
      { src: { hide: false, mark: { n12: "ok" } }, draft: { mark: { n20: "risk", grow: "warn" }, note: t("Confidence, length and polite words aren't evidence", "आत्मविश्वास, लंबाई और विनम्र शब्द सबूत नहीं हैं"), noteTone: "warn" } },
      { draft: { look: "card", title: t("Corrected note", "सुधारा हुआ नोट"), sub: t("Drafted with help from an assistant", "सहायक की मदद से बना मसौदा"), toks: [{ id: "n20", t: t("The club planted twelve seeds.", "क्लब ने बारह बीज बोए।"), icon: "leaf" }, { id: "grow", t: t("(No promise that every seed grows.)", "(हर बीज उगने का कोई वादा नहीं।)"), icon: "sparkles" }], mark: { n20: "ok", grow: "gone" }, note: t("Keep the supported fact, drop the invented guarantee, say a tool helped", "समर्थित तथ्य रखें, गढ़ा वादा हटाएँ, बताएँ कि औज़ार ने मदद की"), noteTone: "ok" } },
      { draft: { look: "note", title: t("The assistant's draft note", "सहायक का मसौदा नोट"), toks: [{ id: "n20", t: t("The club planted twenty seeds.", "क्लब ने बीस बीज बोए।"), icon: "leaf" }, { id: "grow", t: t("Every seed will grow.", "हर बीज उगेगा।"), icon: "sparkles" }], mark: { n20: "risk", grow: "warn" }, note: t("What number should the note report?", "नोट में कौन-सी संख्या लिखें?"), noteTone: "info" } },
      { draft: { look: "card", title: t("Corrected note", "सुधारा हुआ नोट"), toks: [{ id: "n20", t: t("The club planted twelve seeds.", "क्लब ने बारह बीज बोए।"), icon: "leaf" }, { id: "grow", t: t("(No promise that every seed grows.)", "(हर बीज उगने का कोई वादा नहीं।)"), icon: "sparkles" }], mark: { n20: "ok", grow: "gone" }, note: t("Twelve — from the checked source card", "बारह — जाँचे स्रोत कार्ड से"), noteTone: "ok" } },
      { draft: { focus: true } },
    ],
    out: {
      "option-0": { draft: { toks: [{ id: "n20", t: t("The club planted twenty seeds.", "क्लब ने बीस बीज बोए।"), icon: "leaf" }, { id: "grow", t: t("Every seed will grow.", "हर बीज उगेगा।"), icon: "sparkles" }], mark: { n20: "risk", grow: "risk" }, note: t("Confident is not the same as correct", "आत्मविश्वास सही होना नहीं है"), noteTone: "risk" } },
      "option-1": { draft: { toks: [{ id: "n20", t: t("The club planted sixteen seeds.", "क्लब ने सोलह बीज बोए।"), icon: "leaf" }, { id: "grow", t: t("(a compromise)", "(समझौता)"), icon: "scale" }], mark: { n20: "risk", grow: "warn" }, note: t("A compromise matches neither source", "समझौता किसी भी स्रोत से मेल नहीं खाता"), noteTone: "risk" } },
      "option-2": { draft: { look: "card", title: t("Corrected note", "सुधारा हुआ नोट"), toks: [{ id: "n20", t: t("The club planted twelve seeds.", "क्लब ने बारह बीज बोए।"), icon: "leaf" }, { id: "grow", t: t("(No promise that every seed grows.)", "(हर बीज उगने का कोई वादा नहीं।)"), icon: "sparkles" }], mark: { n20: "ok", grow: "gone" }, note: t("Twelve from the checked source card", "जाँचे स्रोत कार्ड से बारह"), noteTone: "ok" } },
    },
  },
  {
    slug: "class6-ai-safe-request", scene: "classroom", layout: "two",
    label: t("Recycling poster · asking an AI tool", "रीसाइक्लिंग पोस्टर · AI औज़ार से माँगना"),
    art: [
      { k: "chat", id: "ask", at: "a", look: "phone", who: t("Idea helper (fictional)", "आइडिया मददगार (काल्पनिक)"), msgs: [{ from: "me", t: t("Make poster slogans. Here is the class contact list: …", "पोस्टर के नारे बनाओ। यह क्लास की संपर्क सूची है: …"), flag: "risk" }], upTo: 1 },
      { k: "doc", id: "parts", at: "b", look: "form", pic: "pencil", title: t("Parts of a good request", "अच्छे अनुरोध के हिस्से"), sub: t("Goal · context · form — nothing private", "लक्ष्य · संदर्भ · रूप — कुछ निजी नहीं"),
        toks: [{ id: "goal", t: t("Goal: recycling poster slogans", "लक्ष्य: रीसाइक्लिंग पोस्टर के नारे"), icon: "target" }, { id: "limit", t: t("Form: three short slogans, simple words", "रूप: तीन छोटे नारे, सरल शब्द"), icon: "ruler" }, { id: "club", t: t("An invented club name", "एक गढ़ा हुआ क्लब नाम"), icon: "users" }, { id: "list", t: t("Class contact list", "क्लास की संपर्क सूची"), icon: "contact" }, { id: "pass", t: t("Passwords and addresses", "पासवर्ड और पते"), icon: "key" }], mark: { goal: "ok", limit: "ok", club: "ok" } },
    ],
    sc: [
      { ask: { focus: true, note: t("Kabir's first request includes the class contact list — the tool only needs slogans", "कबीर के पहले अनुरोध में क्लास की संपर्क सूची है — औज़ार को सिर्फ़ नारे चाहिए"), noteTone: "warn" } },
      { parts: { mark: { goal: "ok", limit: "ok", club: "ok", list: "risk", pass: "risk" }, note: t("More detail helps only when it's appropriate — leave private records out", "ज़्यादा ब्योरा तभी मदद करता है जब उचित हो — निजी रिकॉर्ड बाहर रखें"), noteTone: "info" }, ask: { focus: false, note: undefined } },
      { ask: { upTo: 3, msgs: [{ from: "me", t: t("Give me three short fictional recycling slogans in simple words.", "सरल शब्दों में तीन छोटे काल्पनिक रीसाइक्लिंग नारे दो।"), flag: "ok" }, { from: "them", t: t("1) Sort it, don't toss it! 2) Be a bin hero. 3) Reuse, don't lose.", "1) छाँटो, फेंको मत! 2) डिब्बे के हीरो बनो। 3) दोबारा उपयोग करो।") }, { from: "sys", t: t("Meera inspects the output and picks wording she can explain", "मीरा नतीजा देखती है और वही शब्द चुनती है जो समझा सके") }] }, parts: { mark: { list: "gone", pass: "gone" }, note: undefined } },
      { ask: { upTo: 1, msgs: [{ from: "me", t: t("Make poster slogans. Here is the class contact list: …", "पोस्टर के नारे बनाओ। यह क्लास की संपर्क सूची है: …"), flag: "risk" }] }, parts: { mark: { goal: "ok", limit: "ok", club: "ok", list: "risk", pass: "risk" }, note: t("Which request is useful and privacy-aware?", "कौन-सा अनुरोध उपयोगी और निजता-सजग है?"), noteTone: "info" } },
      { ask: { upTo: 3, msgs: [{ from: "me", t: t("Give me three short fictional recycling slogans in simple words.", "सरल शब्दों में तीन छोटे काल्पनिक रीसाइक्लिंग नारे दो।"), flag: "ok" }, { from: "them", t: t("1) Sort it, don't toss it! 2) Be a bin hero. 3) Reuse, don't lose.", "1) छाँटो, फेंको मत! 2) डिब्बे के हीरो बनो। 3) दोबारा उपयोग करो।") }, { from: "sys", t: t("Review the suggestions before choosing", "चुनने से पहले सुझाव जाँचें") }] }, parts: { mark: { list: "gone", pass: "gone" }, note: t("Clear goal, short limit, nothing private", "साफ़ लक्ष्य, छोटी सीमा, कुछ निजी नहीं"), noteTone: "ok" } },
      { ask: { focus: true } },
    ],
    out: {
      "option-0": { ask: { upTo: 1, msgs: [{ from: "me", t: t("Use our contact list to make slogans.", "हमारी संपर्क सूची से नारे बनाओ।"), flag: "risk" }] }, parts: { mark: { list: "risk" }, note: t("A contact list isn't needed for slogans", "नारों के लिए संपर्क सूची की ज़रूरत नहीं"), noteTone: "risk" } },
      "option-1": { ask: { upTo: 2, msgs: [{ from: "me", t: t("Give me three short fictional recycling slogans in simple words.", "सरल शब्दों में तीन छोटे काल्पनिक रीसाइक्लिंग नारे दो।"), flag: "ok" }, { from: "them", t: t("1) Sort it, don't toss it! 2) Be a bin hero. 3) Reuse, don't lose.", "1) छाँटो, फेंको मत! 2) डिब्बे के हीरो बनो। 3) दोबारा उपयोग करो।") }] }, parts: { mark: { list: "gone", pass: "gone" }, note: t("Useful and privacy-aware", "उपयोगी और निजता-सजग"), noteTone: "ok" } },
      "option-2": { ask: { upTo: 1, msgs: [{ from: "me", t: t("Here is my password; write something.", "यह मेरा पासवर्ड है; कुछ लिखो।"), flag: "risk" }] }, parts: { mark: { pass: "risk" }, note: t("Never place a password in a request", "अनुरोध में पासवर्ड कभी न डालें"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-ai-club-review", scene: "classroom", layout: "two",
    label: t("Two project ideas · which belongs in the lab?", "दो प्रोजेक्ट विचार · कौन-सा लैब में आए?"),
    art: [
      { k: "doc", id: "good", at: "a", look: "form", pic: "leaf", title: t("Idea A: leaf-card helper", "विचार A: पत्ता-कार्ड मददगार"), sub: t("Suggests groups · a learner checks", "समूह सुझाता है · एक विद्यार्थी जाँचता है"),
        toks: [{ id: "task", t: t("A useful task: organise illustrated cards", "उपयोगी काम: चित्रित कार्ड सजाना"), icon: "image" }, { id: "ex", t: t("Relevant fictional examples", "संबंधित काल्पनिक उदाहरण"), icon: "layers" }, { id: "chk", t: t("Separate fresh checks", "अलग नई जाँचें"), icon: "checks" }, { id: "rev", t: t("A person reviews mistakes", "कोई व्यक्ति ग़लतियाँ जाँचता है"), icon: "user-ok" }] },
      { k: "doc", id: "bad", at: "b", look: "form", pic: "eye", title: t("Idea B: score private messages", "विचार B: निजी संदेशों का स्कोर"), sub: t("Secretly rates children", "चुपचाप बच्चों को आँकता है"),
        toks: [{ id: "spy", t: t("Reads children's private messages", "बच्चों के निजी संदेश पढ़ता है"), icon: "msg" }, { id: "sc", t: t("Gives each child a secret score", "हर बच्चे को गुप्त स्कोर देता है"), icon: "gauge" }] },
    ],
    sc: [
      { good: { focus: true, note: t("A helper that suggests groups while a learner checks them", "एक मददगार जो समूह सुझाता है और विद्यार्थी जाँचता है"), noteTone: "ok" }, bad: { mark: { spy: "risk", sc: "risk" }, note: t("A second proposal that doesn't belong in this lab", "दूसरा प्रस्ताव जो इस लैब का नहीं"), noteTone: "risk" } },
      { good: { focus: false, note: t("Meera's four questions: task? examples? fresh checks? who reviews mistakes?", "मीरा के चार सवाल: काम? उदाहरण? नई जाँच? ग़लतियाँ कौन देखे?"), noteTone: "info" }, bad: { note: undefined } },
      { good: { mark: { task: "ok", ex: "ok", chk: "ok", rev: "ok" }, note: t("Compare with manual sorting; revise or stop if evidence is weak", "हाथ से छँटाई से तुलना करें; सबूत कमज़ोर हो तो सुधारें या रोकें"), noteTone: "ok" } },
      { good: { mark: {}, note: t("Which project belongs in this lab?", "कौन-सा प्रोजेक्ट इस लैब में हो?"), noteTone: "info" }, bad: { note: undefined } },
      { good: { mark: { task: "ok", ex: "ok", chk: "ok", rev: "ok" }, stamp: t("Approved", "मंज़ूर"), note: t("Fictional cards, separate checks, human review", "काल्पनिक कार्ड, अलग जाँच, मानव समीक्षा"), noteTone: "ok" }, bad: { mark: { spy: "gone", sc: "gone" }, stamp: t("Rejected", "अस्वीकृत"), note: t("Inappropriate to score children secretly", "बच्चों को चुपचाप आँकना अनुचित है"), noteTone: "risk" } },
      { good: { focus: true } },
    ],
    out: {
      "option-0": { bad: { mark: { spy: "risk", sc: "risk" }, stamp: t("NO", "नहीं"), note: t("Secretly scoring messages isn't appropriate", "संदेशों को चुपचाप आँकना उचित नहीं"), noteTone: "risk" } },
      "option-1": { good: { mark: { task: "ok", ex: "ok", chk: "ok", rev: "ok" }, stamp: t("Approved", "मंज़ूर"), note: t("Fictional cards with human review", "काल्पनिक कार्ड, मानव समीक्षा के साथ"), noteTone: "ok" }, bad: { mark: { spy: "gone", sc: "gone" } } },
      "option-2": { good: { mark: { task: "ok", ex: "warn", chk: "risk", rev: "warn" }, note: t("Success can't be declared without a test", "बिना परीक्षण सफलता घोषित नहीं हो सकती"), noteTone: "risk" } },
    },
  },
];
