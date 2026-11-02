import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class9AiWorlds: World[] = [
  {
    slug: "class9-ai-measurable-question", scene: "market", layout: "two",
    label: t("Seed exchange · whose difficulty should an AI helper address?", "बीज विनिमय · AI मददगार को किसकी कठिनाई सुलझानी है?"),
    art: [
      { k: "doc", id: "need", at: "a", look: "form", pic: "search", title: t("Two needs", "दो ज़रूरतें"), sub: t("Reva records both", "रेवा दोनों दर्ज करती है"), toks: [{ id: "fast", t: t("Shelf volunteer: faster searches", "शेल्फ़ स्वयंसेवक: तेज़ खोज"), icon: "timer" }, { id: "right", t: t("Seed club: fewer wrong matches", "बीज क्लब: कम ग़लत मिलान"), icon: "check" }, { id: "smart", t: t("\"Make the shelf smart\"", "\"शेल्फ़ को स्मार्ट बनाओ\""), icon: "sparkles" }], mark: { smart: "warn" } },
      { k: "table", id: "base", at: "b", hide: true, title: t("10 invented searches", "10 काल्पनिक खोजें"), icon: "list", cols: [t("Method", "तरीक़ा"), t("Minutes (total)", "मिनट (कुल)"), t("Wrong matches", "ग़लत मिलान")], rows: [{ id: "idx", c: [t("Printed index (baseline)", "छपी सूची (आधार-रेखा)"), "30", "2"] }, { id: "goal", c: [t("Target", "लक्ष्य"), "≤ 20", "≤ 2"] }, { id: "new", c: [t("Another method", "दूसरा तरीक़ा"), "?", "?"] }] },
    ],
    sc: [
      { need: { focus: true, note: t("Nikhil can't find a matching packet on a crowded shelf", "निखिल को भीड़ भरी शेल्फ़ पर मेल खाता पैकेट नहीं मिलता"), noteTone: "info" } },
      { need: { mark: { fast: "ok", right: "ok", smart: "warn" }, note: t("Saving time while returning the wrong packet would still fail the exchange", "समय बचाकर ग़लत पैकेट देना भी विनिमय को नाकाम करेगा"), noteTone: "warn" } },
      { need: { focus: false, note: undefined }, base: { hide: false, focus: true, mark: { idx: "info", goal: "ok" }, note: t("Baseline first: 30 minutes and 2 wrong matches on equivalent searches", "पहले आधार-रेखा: समान खोजों पर 30 मिनट और 2 ग़लत मिलान"), noteTone: "info" } },
      { base: { focus: false, note: t("Which problem statement fits the investigation?", "कौन-सा समस्या-कथन जाँच से मेल खाता है?"), noteTone: "info" } },
      { base: { mark: { idx: "info", goal: "ok", new: "hl" }, note: t("Record duration, match correctness and the method — no names, addresses or family incomes", "अवधि, मिलान की सहीता और तरीक़ा दर्ज करें — नाम, पते या पारिवारिक आय नहीं"), noteTone: "ok" }, need: { mark: { fast: "ok", right: "ok", smart: "gone" } } },
      { base: { focus: true } },
    ],
    out: {
      goal: { base: { hide: false, mark: { goal: "ok", idx: "info" }, note: t("A measurable aim: at most 20 minutes and at most 2 wrong matches", "मापने योग्य लक्ष्य: अधिकतम 20 मिनट और अधिकतम 2 ग़लत मिलान"), noteTone: "ok" } },
      smart: { need: { mark: { smart: "risk" }, note: t("\"Smart\" can't be measured or failed", "\"स्मार्ट\" को न मापा जा सकता, न उसमें विफल हुआ जा सकता"), noteTone: "risk" } },
      pupils: { need: { mark: { smart: "risk" }, note: t("Predicting who 'deserves' packets is a harmful, unmeasurable aim", "यह अनुमान कि किसे पैकेट 'मिलने चाहिए' हानिकारक, बिना मापने योग्य लक्ष्य है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-ai-data-card", scene: "lab", layout: "two",
    label: t("Parcel measurements · the data card before the model", "पार्सल माप · मॉडल से पहले डेटा कार्ड"),
    art: [
      { k: "table", id: "ledger", at: "a", title: t("Parcel ledger", "पार्सल बही"), icon: "grid", cols: [t("Row", "पंक्ति"), t("Length", "लंबाई"), t("Source", "स्रोत"), t("Use", "उपयोग")], rows: [{ id: "A", c: ["A", "4 cm", t("teacher-made", "टीचर ने बनाया"), "?"] }, { id: "B", c: ["B", "60 mm", t("teacher-made", "टीचर ने बनाया"), "?"] }, { id: "C", c: ["C", "5", t("unnamed upload", "बिना नाम का अपलोड"), "?"] }, { id: "D", c: ["D", t("(blank)", "(ख़ाली)"), t("teacher-made", "टीचर ने बनाया"), "?"] }, { id: "E", c: ["E", "7 cm", t("reserved", "सुरक्षित रखी"), "?"] }] },
      { k: "doc", id: "spec", at: "b", hide: true, look: "card", pic: "clipboard-ok", title: t("Data card", "डेटा कार्ड"), toks: [{ id: "in", t: t("Input: length in centimetres", "इनपुट: लंबाई सेंटीमीटर में"), icon: "ruler" }, { id: "tg", t: t("Target: teacher-checked parcel category", "लक्ष्य: टीचर द्वारा जाँची पार्सल श्रेणी"), icon: "target" }, { id: "id", t: t("Row identifiers: bookkeeping only", "पंक्ति आईडी: सिर्फ़ हिसाब के लिए"), icon: "hash" }, { id: "keep", t: t("Original values kept beside corrections", "सुधार के पास असली मान रखे"), icon: "copy" }] },
    ],
    sc: [
      { ledger: { focus: true, mark: { A: "warn", B: "warn", C: "warn" }, note: t("Tidy-looking — but centimetres, millimetres and an unspecified unit are mixed", "साफ़ दिखती है — पर सेंटीमीटर, मिलीमीटर और बिना इकाई के मान मिले हैं"), noteTone: "warn" } },
      { ledger: { mark: { A: "ok", B: "ok", C: "risk", D: "warn", E: "info" }, txt: { "A:3": t("train", "ट्रेन"), "B:3": t("train", "ट्रेन"), "C:3": t("HOLD (no permission)", "रोकी (अनुमति नहीं)") }, note: t("Teacher made A and B for training; C has no permission note — appearing onscreen isn't permission", "A और B टीचर ने ट्रेनिंग के लिए बनाए; C पर अनुमति-नोट नहीं — स्क्रीन पर दिखना अनुमति नहीं"), noteTone: "info" } },
      { ledger: { txt: { "A:3": t("train", "ट्रेन"), "B:1": "60 mm = 6 cm", "B:3": t("train", "ट्रेन"), "C:3": t("HOLD", "रोकी"), "D:1": t("unknown (not zero)", "अज्ञात (शून्य नहीं)"), "D:3": t("set aside", "अलग रखी") }, mark: { A: "ok", B: "ok", C: "risk", D: "warn", E: "info" }, note: t("A blank length means unknown, not zero — original beside correction", "ख़ाली लंबाई का मतलब अज्ञात है, शून्य नहीं — सुधार के पास असली मान"), noteTone: "info" } },
      { ledger: { txt: { "A:3": t("train", "ट्रेन"), "B:3": t("train", "ट्रेन"), "C:3": t("HOLD", "रोकी"), "D:3": t("set aside", "अलग रखी"), "E:3": "?" }, note: t("What should happen to reserved row E?", "सुरक्षित रखी पंक्ति E का क्या करें?"), noteTone: "info" } },
      { spec: { hide: false, focus: true, mark: { in: "ok", tg: "ok", id: "ok", keep: "ok" } }, ledger: { txt: { "A:3": t("train", "ट्रेन"), "B:1": "6 cm", "B:3": t("train", "ट्रेन"), "C:3": t("HOLD", "रोकी"), "D:3": t("set aside", "अलग रखी"), "E:3": t("evaluation only", "सिर्फ़ मूल्यांकन") }, mark: { A: "ok", B: "ok", C: "risk", D: "warn", E: "ok" }, note: undefined } },
      { spec: { focus: true } },
    ],
    out: {
      train: { ledger: { txt: { "E:3": t("training — but reported 'unseen'", "ट्रेनिंग — पर 'अनदेखी' बताई") }, mark: { E: "risk" }, note: t("A row used in training can't be reported as unseen", "ट्रेनिंग में इस्तेमाल पंक्ति 'अनदेखी' नहीं कही जा सकती"), noteTone: "risk" } },
      reserve: { ledger: { txt: { "E:3": t("evaluation only", "सिर्फ़ मूल्यांकन") }, mark: { E: "ok" }, note: t("Keep E separate for the planned evaluation", "E को तय मूल्यांकन के लिए अलग रखें"), noteTone: "ok" } },
      drop: { ledger: { txt: { "E:3": t("deleted", "हटाई") }, mark: { E: "gone" }, note: t("Complete rows aren't all training rows — an evaluation needs some held back", "हर पूरी पंक्ति ट्रेनिंग की नहीं — मूल्यांकन के लिए कुछ अलग चाहिए"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-ai-queue-statistics", scene: "market", layout: "one",
    label: t("Exhibition waits · five records, one very long wait", "प्रदर्शनी की प्रतीक्षा · पाँच रिकॉर्ड, एक बहुत लंबी"),
    art: [
      { k: "chart", id: "waits", look: "bars", max: 20, title: t("Minutes waited", "प्रतीक्षा के मिनट"), icon: "clock", bars: [{ id: "w1", t: "2", v: 2, tone: "info" }, { id: "w2", t: "3", v: 3, tone: "info" }, { id: "w3", t: "3", v: 3, tone: "info" }, { id: "w4", t: "4", v: 4, tone: "info" }, { id: "w5", t: "18", v: 18, tone: "risk" }] },
    ],
    sc: [
      { waits: { focus: true, note: t("Nikhil notices the last wait is much longer — first decide the question", "निखिल देखता है कि आख़िरी प्रतीक्षा बहुत लंबी है — पहले सवाल तय करें"), noteTone: "info" } },
      { waits: { ref: { v: 6, t: t("mean = 30 ÷ 5 = 6", "औसत = 30 ÷ 5 = 6") }, note: t("The mean spreads the total evenly — it doesn't claim any visitor waited 6", "औसत कुल को बराबर बाँटता है — यह नहीं कहता कि किसी ने 6 इंतज़ार किया"), noteTone: "warn" } },
      { waits: { ref: { v: 3, t: t("median = the middle value, 3", "माध्यिका = बीच का मान, 3") }, bars: [{ id: "w1", t: "2", v: 2, tone: "info" }, { id: "w2", t: "3", v: 3, tone: "info" }, { id: "w3", t: "3", v: 3, tone: "ok" }, { id: "w4", t: "4", v: 4, tone: "info" }, { id: "w5", t: "18", v: 18, tone: "risk" }], note: t("Keep the 18-minute record visible — a middle value doesn't justify erasing it", "18 मिनट का रिकॉर्ड दिखता रखें — बीच का मान उसे मिटाने की वजह नहीं"), noteTone: "info" } },
      { waits: { ref: undefined, note: t("Which statistic answers 'the middle observed wait'?", "कौन-सा आँकड़ा 'बीच की देखी गई प्रतीक्षा' का जवाब है?"), noteTone: "info" } },
      { waits: { ref: { v: 3, t: t("median = 3", "माध्यिका = 3") }, note: t("A blind draw from 3 blue, 2 red, 1 gold tickets: each of the 6 is equally likely", "3 नीले, 2 लाल, 1 सुनहरे टिकट से आँख बंद करके खींचना: 6 में हर टिकट बराबर संभावित"), noteTone: "ok" } },
      { waits: { focus: true } },
    ],
    out: {
      mean: { waits: { ref: { v: 6, t: t("mean = 6", "औसत = 6") }, note: t("The mean is 6 — but it isn't the middle observed wait", "औसत 6 है — पर यह बीच की देखी प्रतीक्षा नहीं"), noteTone: "risk" } },
      median: { waits: { ref: { v: 3, t: t("median = 3", "माध्यिका = 3") }, note: t("The median: 3 minutes", "माध्यिका: 3 मिनट"), noteTone: "ok" } },
      maximum: { waits: { ref: { v: 18, t: t("maximum = 18", "अधिकतम = 18") }, note: t("The maximum shows the longest, not the middle", "अधिकतम सबसे लंबी दिखाता है, बीच की नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-ai-prediction-errors", scene: "lab", layout: "one",
    label: t("Paper railway · routine or review? (score 0–12)", "काग़ज़ी रेलवे · नियमित या समीक्षा? (अंक 0–12)"),
    art: [
      { k: "chart", id: "line", look: "scatter", title: t("Training anchors and checks", "ट्रेनिंग एंकर और जाँचें"), icon: "route", axes: [t("score", "अंक"), t("(just spread)", "(सिर्फ़ फैलाव)")],
        pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }] },
    ],
    sc: [
      { line: { focus: true, note: t("Anchors: 0 routine, 4 review, 8 routine, 12 review. The toy model copies the nearest label.", "एंकर: 0 नियमित, 4 समीक्षा, 8 नियमित, 12 समीक्षा। खिलौना मॉडल सबसे नज़दीकी लेबल नक़ल करता है।"), noteTone: "info" } },
      { line: { pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }, { x: 8, y: 25, c: "q" }, { x: 42, y: 25, c: "q" }, { x: 75, y: 25, c: "q" }, { x: 92, y: 25, c: "q" }], note: t("Visible checks 1, 5, 9, 11 — all four predicted right with every anchor, but they guided the selection", "दिखती जाँचें 1, 5, 9, 11 — हर एंकर के साथ चारों सही, पर इन्हीं ने चुनाव को दिशा दी"), noteTone: "info" } },
      { line: { pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }, { x: 58, y: 25, c: "q" }, { x: 50, y: 78, c: "q" }], note: t("A new request scores 7 (needs review) — nearest anchor 8 says routine: a miss. At 6, two anchors tie → abstain.", "नया अनुरोध 7 अंक (समीक्षा चाहिए) — सबसे नज़दीकी एंकर 8 कहता है नियमित: चूक। 6 पर दो एंकर बराबर → परहेज़।"), noteTone: "risk" } },
      { line: { pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }, { x: 58, y: 25, c: "q" }], note: t("Can the new score-7 request be dismissed automatically?", "क्या नया 7 अंक वाला अनुरोध अपने-आप ख़ारिज हो सकता है?"), noteTone: "info" } },
      { line: { pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }, { x: 58, y: 25, c: "b", t: "V" }], note: t("To a human reviewer, and the miss is recorded — on a 5-request pack: 1 miss, 0 false alarms", "मानव समीक्षक को, और चूक दर्ज — 5 अनुरोधों के पैक में: 1 चूक, 0 झूठी चेतावनी"), noteTone: "ok" } },
      { line: { focus: true } },
    ],
    out: {
      dismiss: { line: { pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }, { x: 58, y: 25, c: "a", t: "R" }], note: t("Dismissing it because the earlier score was perfect hides a miss", "पहले का स्कोर पूर्ण था इसलिए ख़ारिज करना चूक छिपाना है"), noteTone: "risk" } },
      review: { line: { pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }, { x: 58, y: 25, c: "b", t: "V" }], note: t("Human review, and the miss recorded", "मानव समीक्षा, और चूक दर्ज"), noteTone: "ok" } },
      change: { line: { pts: [{ x: 0, y: 50, c: "a", t: "R" }, { x: 33, y: 50, c: "b", t: "V" }, { x: 67, y: 50, c: "a", t: "R" }, { x: 100, y: 50, c: "b", t: "V" }, { x: 58, y: 25, c: "a", t: "R" }], note: t("Changing the checked label to keep the score is falsifying the evidence", "स्कोर बचाने को जाँचा लेबल बदलना सबूत बदलना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-ai-pixels", scene: "lab", layout: "two",
    label: t("Museum mosaic · pixels are measurements", "संग्रहालय मोज़ेक · पिक्सेल माप हैं"),
    art: [
      { k: "grid", id: "img", at: "a", look: "pixels", w: 3, h: 3, title: t("A 3 × 3 image (centre column bright)", "3 × 3 चित्र (बीच का कॉलम चमकीला)"), icon: "image", on: [1, 4, 7] },
      { k: "grid", id: "bits", at: "b", look: "lamps", w: 8, h: 1, title: t("Brightness 173 in eight places", "आठ स्थानों में चमक 173"), icon: "binary", foot: ["128", "64", "32", "16", "8", "4", "2", "1"], on: [] },
    ],
    sc: [
      { img: { focus: true, note: t("Each square stores brightness 0–255 — the grid records measurements, it can't settle a 'doorway'", "हर खाने में चमक 0–255 है — ग्रिड माप दर्ज करता है, 'दरवाज़ा' तय नहीं करता"), noteTone: "info" } },
      { bits: { on: [0, 2, 4, 5, 7], focus: true, note: t("173 = 128 + 32 + 8 + 4 + 1 — the bits encode a number, not a meaning", "173 = 128 + 32 + 8 + 4 + 1 — बिट एक संख्या दर्शाते हैं, अर्थ नहीं"), noteTone: "ok" }, img: { focus: false, note: undefined } },
      { img: { note: t("Rule: stripe detected only when every centre pixel is bright — it checks positions, not 'a doorway'", "नियम: पट्टी तभी मिलती जब बीच के सब पिक्सेल चमकीले — यह जगहें जाँचता है, 'दरवाज़ा' नहीं"), noteTone: "info" }, bits: { focus: false, note: undefined } },
      { img: { on: [0, 3, 6], note: t("The bright stripe shifts left — what happens?", "चमकीली पट्टी बाईं ओर खिसकी — क्या होता है?"), noteTone: "warn" } },
      { img: { on: [0, 3, 6], note: t("The rule no longer detects it: the feature moved. Only 'bright centre pixels' is observation; 'doorway' is interpretation.", "नियम अब इसे नहीं पहचानता: विशेषता खिसक गई। 'बीच के चमकीले पिक्सेल' अवलोकन है; 'दरवाज़ा' व्याख्या।"), noteTone: "ok" } },
      { img: { focus: true } },
    ],
    out: {
      detect: { img: { on: [0, 3, 6], note: t("Similar-looking isn't the same positions", "देखने में मिलता-जुलता होना वही जगहें होना नहीं"), noteTone: "risk" } },
      fail: { img: { on: [0, 3, 6], note: t("It fails: the bright pixels are no longer in the centre column", "यह नाकाम: चमकीले पिक्सेल अब बीच के कॉलम में नहीं"), noteTone: "ok" } },
      understand: { img: { on: [0, 3, 6], note: t("Numbers aren't understanding", "संख्याएँ समझ नहीं होतीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-ai-language-context", scene: "library", layout: "two",
    label: t("Museum newsletter · the word 'bank' and a generated announcement", "संग्रहालय न्यूज़लेटर · शब्द 'bank' और एक बनाई गई घोषणा"),
    art: [
      { k: "doc", id: "bank", at: "a", look: "card", pic: "book-open", title: t("Two cards, one spelling: bank", "दो कार्ड, एक वर्तनी: bank"), toks: [{ id: "s1", t: t("\"The heron stood on the bank beside the river.\"", "\"बगुला नदी के किनारे bank पर खड़ा था।\""), icon: "droplets" }, { id: "s2", t: t("\"The club deposited savings at the bank.\"", "\"क्लब ने bank में बचत जमा की।\""), icon: "banknote" }] },
      { k: "doc", id: "gen", at: "b", hide: true, look: "note", pic: "bot", title: t("Generated announcement", "बनाई गई घोषणा"), sub: t("vs the teacher's reference", "टीचर के संदर्भ के मुक़ाबले"), toks: [{ id: "ok", t: t("Museum opens Saturday at 10", "संग्रहालय शनिवार को 10 बजे खुलता है"), icon: "calendar" }, { id: "acc", t: t("Wheelchair access is guaranteed on all floors", "सभी मंज़िलों पर व्हीलचेयर पहुँच की गारंटी"), icon: "shield-ok" }, { id: "free", t: t("Entry is free for everyone", "सबके लिए प्रवेश मुफ़्त"), icon: "gift" }] },
    ],
    sc: [
      { bank: { focus: true, note: t("Shared spelling alone can't settle which meaning is intended", "साझा वर्तनी से अकेले यह तय नहीं होता कि कौन-सा अर्थ है"), noteTone: "info" } },
      { bank: { mark: { s1: "info", s2: "info" }, note: t("River and savings are the clues — record each interpretation with its sentence", "नदी और बचत संकेत हैं — हर व्याख्या अपने वाक्य के साथ दर्ज करें"), noteTone: "info" } },
      { bank: { focus: false, note: undefined }, gen: { hide: false, focus: true, mark: { ok: "ok", acc: "warn", free: "warn" }, note: t("Fluent text isn't a checked source for every sentence", "प्रवाहपूर्ण पाठ हर वाक्य का जाँचा स्रोत नहीं"), noteTone: "warn" } },
      { gen: { focus: false, note: t("How should the extra claims be labelled?", "अतिरिक्त दावों को क्या लेबल दें?"), noteTone: "info" } },
      { gen: { mark: { ok: "ok", acc: "hl", free: "hl" }, note: t("Unsupported by this reference — verify with the organising teacher before publishing", "इस संदर्भ में नहीं — छापने से पहले आयोजक टीचर से जाँचें"), noteTone: "ok" } },
      { gen: { focus: true } },
    ],
    out: {
      true: { gen: { mark: { acc: "risk", free: "risk" }, note: t("Fluent isn't true", "प्रवाहपूर्ण का मतलब सच नहीं"), noteTone: "risk" } },
      false: { gen: { mark: { acc: "warn", free: "warn" }, note: t("Absent from the reference doesn't prove false either", "संदर्भ में न होना ग़लत साबित भी नहीं करता"), noteTone: "risk" } },
      unsupported: { gen: { mark: { acc: "hl", free: "hl", ok: "ok" }, note: t("Unsupported by this reference; verify before publication", "इस संदर्भ में असमर्थित; छापने से पहले जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class9-ai-group-errors", scene: "classroom", layout: "one",
    label: t("Request cards · typed (A) vs scanned (B)", "अनुरोध कार्ड · टाइप किए (A) बनाम स्कैन (B)"),
    art: [
      { k: "chart", id: "rate", look: "bars", max: 50, title: t("Wrong predictions", "ग़लत अनुमान"), icon: "bars", bars: [{ id: "a", t: t("A typed: 2 wrong", "A टाइप: 2 ग़लत"), v: 2, tone: "info" }, { id: "b", t: t("B scanned: 2 wrong", "B स्कैन: 2 ग़लत"), v: 2, tone: "info" }] },
    ],
    sc: [
      { rate: { focus: true, note: t("2 wrong in each group — equal counts make the stations look equal", "हर समूह में 2 ग़लत — बराबर गिनती स्टेशनों को बराबर दिखाती है"), noteTone: "warn" } },
      { rate: { bars: [{ id: "a", t: t("A: 2 of 20", "A: 20 में 2"), v: 10, tone: "ok" }, { id: "b", t: t("B: 2 of 5", "B: 5 में 2"), v: 40, tone: "risk" }], max: 50, ref: undefined, note: t("A tested 20 cards, B only 5 — divide by each group's own total: 10% vs 40%", "A के 20 कार्ड, B के सिर्फ़ 5 — हर समूह के अपने कुल से भाग: 10% बनाम 40%"), noteTone: "risk" } },
      { rate: { note: t("Overall error = prediction ≠ checked label. These aren't false-alarm rates — that needs a defined positive category.", "कुल ग़लती = अनुमान ≠ जाँचा लेबल। ये झूठी-चेतावनी दरें नहीं हैं — उसके लिए सकारात्मक श्रेणी तय करनी होगी।"), noteTone: "info" } },
      { rate: { note: t("Does '2 errors each' establish equal performance or fairness?", "क्या '2 ग़लतियाँ हर एक' बराबर प्रदर्शन या निष्पक्षता साबित करता है?"), noteTone: "info" } },
      { rate: { note: t("Compare group rates, investigate, and keep teacher review for disputed or unreadable cards", "समूह की दरें मिलाएँ, जाँच करें, और विवादित या अपठित कार्डों के लिए टीचर समीक्षा रखें"), noteTone: "ok" } },
      { rate: { focus: true } },
    ],
    out: {
      equal: { rate: { bars: [{ id: "a", t: t("A: 2", "A: 2"), v: 2, tone: "warn" }, { id: "b", t: t("B: 2", "B: 2"), v: 2, tone: "warn" }], note: t("Equal counts hide different rates", "बराबर गिनती अलग दरें छिपाती है"), noteTone: "risk" } },
      review: { rate: { bars: [{ id: "a", t: t("A: 10%", "A: 10%"), v: 10, tone: "ok" }, { id: "b", t: t("B: 40%", "B: 40%"), v: 40, tone: "risk" }], note: t("Compare rates, investigate, keep review available", "दरें मिलाएँ, जाँच करें, समीक्षा उपलब्ध रखें"), noteTone: "ok" } },
      ban: { rate: { bars: [{ id: "a", t: t("A: 10%", "A: 10%"), v: 10, tone: "ok" }, { id: "b", t: t("B: 40% ≠ 'always fail'", "B: 40% ≠ 'हमेशा नाकाम'"), v: 40, tone: "warn" }], note: t("A small-sample gap isn't proof every scan will fail", "छोटे नमूने का अंतर साबित नहीं करता कि हर स्कैन नाकाम होगा"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-ai-repair-pilot", scene: "classroom", layout: "two",
    label: t("Museum repair desk · furniture cards or sign cards?", "संग्रहालय रिपेयर डेस्क · फ़र्नीचर कार्ड या साइन कार्ड?"),
    art: [
      { k: "chart", id: "route", at: "a", look: "scatter", title: t("Words matching the sign vocabulary", "साइन-शब्दावली से मेल खाते शब्द"), icon: "target", axes: [t("matching words", "मेल खाते शब्द"), t("(just spread)", "(सिर्फ़ फैलाव)")], zones: [t("furniture tray", "फ़र्नीचर ट्रे"), t("sign tray", "साइन ट्रे")], cut: 100, pts: [{ x: 8, y: 30, c: "a", t: "F" }, { x: 16, y: 62, c: "a", t: "F" }, { x: 22, y: 45, c: "a", t: "F" }] },
      { k: "flow", id: "limits", at: "b", look: "graph", title: t("What the routing score may do", "रूटिंग स्कोर क्या कर सकता है"), icon: "shield", nodes: [{ id: "req", t: t("A request arrives", "अनुरोध आया"), icon: "mail", x: 14, y: 50 }, { id: "tray", t: t("Suggest a teacher tray", "टीचर ट्रे सुझाना"), icon: "check", x: 80, y: 20 }, { id: "diag", t: t("Diagnose equipment / authorise repairs", "उपकरण निदान / मरम्मत मंज़ूर"), icon: "x", x: 80, y: 80 }], links: [{ from: "req", to: "tray" }, { from: "req", to: "diag" }], link: { "req>diag": "off" }, state: { tray: "ok", diag: "muted" } },
    ],
    sc: [
      { route: { focus: true, note: t("Training holds only furniture requests", "ट्रेनिंग में सिर्फ़ फ़र्नीचर अनुरोध हैं"), noteTone: "warn" } },
      { route: { pts: [{ x: 8, y: 30, c: "a", t: "F" }, { x: 16, y: 62, c: "a", t: "F" }, { x: 22, y: 45, c: "a", t: "F" }, { x: 70, y: 40, c: "b", t: "S" }, { x: 84, y: 68, c: "b", t: "S" }], cut: 46, note: t("Permitted sign cards added with checked labels — visible validation labels guided her choices", "अनुमत साइन कार्ड जाँचे लेबलों के साथ जुड़े — दिखते वैलिडेशन लेबलों ने चुनाव को दिशा दी"), noteTone: "ok" } },
      { route: { note: t("Counting matching words is transparent — but counting can miss meaning", "मेल खाते शब्द गिनना पारदर्शी है — पर गिनती अर्थ चूक सकती है"), noteTone: "info" } },
      { limits: { focus: true, link: { "req>diag": "bad" }, state: { diag: "risk" }, note: t("A request for electrical fault diagnosis arrives — a different purpose from routing", "बिजली की गड़बड़ी के निदान का अनुरोध आया — रूटिंग से अलग उद्देश्य"), noteTone: "warn" } },
      { limits: { link: { "req>diag": "off" }, state: { tray: "ok", diag: "muted" }, note: t("Stop that use and hand the request to the teacher", "वह उपयोग रोकें और अनुरोध टीचर को सौंपें"), noteTone: "ok" } },
      { limits: { focus: true } },
    ],
    out: {
      extend: { limits: { link: { "req>diag": "on" }, state: { diag: "risk" }, note: t("A routing score doesn't authorise diagnosis", "रूटिंग स्कोर निदान को अधिकृत नहीं करता"), noteTone: "risk" } },
      stop: { limits: { link: { "req>diag": "off" }, state: { tray: "ok", diag: "muted" }, note: t("Stop this use and hand it to the teacher", "यह उपयोग रोकें और टीचर को सौंपें"), noteTone: "ok" } },
      hide: { limits: { link: { "req>diag": "off", "req>tray": "off" }, state: { diag: "risk", tray: "muted" }, note: t("Hiding a hard case makes the pilot look better than it is", "मुश्किल मामला छिपाना पायलट को असल से बेहतर दिखाता है"), noteTone: "risk" } },
    },
  },
];
