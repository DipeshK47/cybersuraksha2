import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class10CtWorlds: World[] = [
  {
    slug: "class10-system-states", scene: "lab", layout: "one",
    label: t("Exhibition notice · a state machine", "प्रदर्शनी सूचना · एक स्टेट मशीन"),
    art: [
      { k: "flow", id: "fsm", look: "graph", title: t("States and permitted transitions", "अवस्थाएँ और अनुमत संक्रमण"), icon: "workflow", nodes: [{ id: "draft", t: "draft", icon: "pencil", x: 12, y: 50 }, { id: "rev", t: "reviewed", icon: "eye", x: 50, y: 20 }, { id: "revn", t: "revision", icon: "refresh", x: 50, y: 82 }, { id: "app", t: "approved", icon: "check", x: 88, y: 20 }],
        links: [{ from: "draft", to: "rev", t: "check" }, { from: "rev", to: "revn", t: "fail" }, { from: "revn", to: "rev", t: "check" }, { from: "rev", to: "app", t: "approve" }], link: { "rev>revn": "off", "revn>rev": "off", "rev>app": "off" }, state: { draft: "now" }, cur: "draft" },
    ],
    sc: [
      { fsm: { focus: true, cur: "draft", state: { draft: "now" }, note: t("Name the current state before choosing an event — the same button can do different things", "घटना चुनने से पहले मौजूदा अवस्था का नाम लें — एक ही बटन अलग-अलग काम कर सकता है"), noteTone: "info" } },
      { fsm: { cur: "rev", state: { draft: "done", rev: "now" }, link: { "rev>revn": "off", "revn>rev": "off", "rev>app": "off" }, note: t("check moves draft → reviewed — an arrow is a permitted transition, not a promise it works everywhere", "check, draft को reviewed तक ले जाता है — तीर अनुमत संक्रमण है, हर जगह चलने का वादा नहीं"), noteTone: "info" } },
      { fsm: { cur: "revn", state: { draft: "done", rev: "done", revn: "now" }, link: { "rev>revn": "on" }, note: t("fail while reviewed → revision (it doesn't vanish). check from revision can reach reviewed again — explicitly allowed.", "reviewed में fail → revision (ग़ायब नहीं होता)। revision से check फिर reviewed तक पहुँच सकता है — साफ़ अनुमत।"), noteTone: "warn" } },
      { fsm: { cur: "revn", state: { draft: "done", rev: "done", revn: "now" }, link: { "rev>revn": "on", "revn>rev": "off" }, note: t("At revision, which event can advance the notice?", "revision पर कौन-सी घटना सूचना को आगे बढ़ा सकती है?"), noteTone: "info" } },
      { fsm: { cur: "app", state: { draft: "done", rev: "done", revn: "done", app: "ok" }, link: { "rev>revn": "on", "revn>rev": "on", "rev>app": "on" }, note: t("check, then approve — approved is reached through reviewed; a rejected publish is recorded too", "check, फिर approve — approved, reviewed से होकर पहुँचता है; ठुकराया publish भी दर्ज होता है"), noteTone: "ok" } },
      { fsm: { focus: true } },
    ],
    out: {
      check: { fsm: { cur: "rev", state: { revn: "done", rev: "now" }, link: { "revn>rev": "on" }, note: t("Send check to reach reviewed", "reviewed तक पहुँचने के लिए check भेजें"), noteTone: "ok" } },
      approve: { fsm: { cur: "app", state: { revn: "risk", app: "risk" }, link: { "revn>rev": "off" }, note: t("approve isn't a permitted transition from revision", "revision से approve अनुमत संक्रमण नहीं है"), noteTone: "risk" } },
      publish: { fsm: { cur: "revn", state: { revn: "risk" }, note: t("There's no publish event from revision", "revision से कोई publish घटना नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-nested-loop-trace", scene: "lab", layout: "two",
    label: t("A numbered display and a nested loop", "एक अंकित डिस्प्ले और एक नेस्टेड लूप"),
    art: [
      { k: "grid", id: "disp", at: "a", look: "map", w: 3, h: 2, title: t("Display values (row r, column c)", "डिस्प्ले मान (पंक्ति r, कॉलम c)"), icon: "grid", cells: { 0: { t: "1" }, 1: { t: "2" }, 2: { t: "3" }, 3: { t: "10" }, 4: { t: "11" }, 5: { t: "12" } }, me: 0 },
      { k: "table", id: "acc", at: "b", title: t("Accumulators after each visit", "हर विज़िट के बाद संचयक"), icon: "calc", upTo: 0, cols: [t("Visit", "विज़िट"), t("(r, c)", "(r, c)"), t("count", "count"), t("total", "total")], rows: [{ id: "v1", c: ["1", "(0, 0)", "1", "1"] }, { id: "v2", c: ["2", "(0, 1)", "2", "3"] }, { id: "v3", c: ["3", "(0, 2)", "3", "6"] }, { id: "v4", c: ["4", "(1, 0)", "4", "16"] }, { id: "v5", c: ["5", "(1, 1)", "5", "27"] }, { id: "v6", c: ["6", "(1, 2)", "6", "39"] }] },
    ],
    sc: [
      { disp: { focus: true, me: 0, note: t("The outer marker picks a row; the inner marker visits columns within it", "बाहरी मार्कर पंक्ति चुनता है; भीतरी मार्कर उसके कॉलम देखता है"), noteTone: "info" } },
      { disp: { path: [0, 1, 2], me: 2, note: t("Ranges start at 0 and exclude the upper bound: with r = 0 the column marker visits 0, 1, 2 — never 3", "सीमाएँ 0 से शुरू और ऊपरी सीमा छोड़कर: r = 0 पर कॉलम मार्कर 0, 1, 2 देखता है — 3 कभी नहीं"), noteTone: "info" } },
      { acc: { upTo: 3, focus: true, mark: { v3: "info" }, note: t("Each visit runs count = count + 1 once and adds the cell value to total — separate assignments", "हर विज़िट में count = count + 1 एक बार चलता है और सेल का मान total में जुड़ता है — अलग असाइनमेंट"), noteTone: "info" }, disp: { focus: false, note: undefined } },
      { acc: { upTo: 3, note: t("What pair is visited after (r = 0, c = 2)?", "(r = 0, c = 2) के बाद कौन-सी जोड़ी देखी जाती है?"), noteTone: "info" }, disp: { path: [0, 1, 2], me: 2 } },
      { disp: { path: [0, 1, 2, 3, 4, 5], me: 3, note: t("The outer marker advances to r = 1, the inner resets to c = 0 — the next additions are 10, 11, 12; the running count carries on", "बाहरी मार्कर r = 1 पर, भीतरी c = 0 पर रीसेट — अगले जोड़ 10, 11, 12; चालू गिनती आगे चलती है"), noteTone: "ok" }, acc: { upTo: 6, mark: { v4: "ok", v5: "ok", v6: "ok" }, note: undefined } },
      { acc: { focus: true } },
    ],
    out: {
      reset: { disp: { path: [0, 1, 2, 3], me: 3, note: t("(r=1, c=0): the inner marker resets", "(r=1, c=0): भीतरी मार्कर रीसेट होता है"), noteTone: "ok" } },
      carry: { disp: { path: [0, 1, 2, 5], me: 5, note: t("The column doesn't carry over to the next row", "कॉलम अगली पंक्ति में नहीं चलता"), noteTone: "risk" } },
      overflow: { disp: { path: [0, 1, 2], me: 2, cells: { 0: { t: "1" }, 1: { t: "2" }, 2: { t: "3" }, 3: { t: "10", tone: "risk" }, 4: { t: "11" }, 5: { t: "12" } }, note: t("c = 3 isn't visited — the upper bound is excluded", "c = 3 नहीं देखा जाता — ऊपरी सीमा छूट जाती है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-dictionary-keys", scene: "library", layout: "two",
    label: t("Exhibit ledger · key → token count", "प्रदर्शनी बही · कुंजी → टोकन गिनती"),
    art: [
      { k: "table", id: "map", at: "a", title: t("The ledger (order doesn't matter)", "बही (क्रम मायने नहीं रखता)"), icon: "db", cols: [t("Key", "कुंजी"), t("Value", "मान")], rows: [{ id: "BK", c: ["BK", "4"] }, { id: "OR", c: ["OR", "7"] }, { id: "ZT", c: ["ZT", "2"] }] },
      { k: "table", id: "ops", at: "b", hide: true, title: t("Operations", "संचालन"), icon: "list", cols: [t("Card", "कार्ड"), t("Does", "क्या करता है"), t("Returns / entries", "लौटाता / प्रविष्टियाँ")], rows: [{ id: "o1", c: ["lookup(BK)", t("follow the exact key", "सटीक कुंजी का पीछा"), "4"] }, { id: "o2", c: ["lookup(or)", t("case differs from OR", "OR से केस अलग"), "0"] }, { id: "o3", c: ["set(ZT, 9)", t("replace the old value", "पुराना मान बदलें"), "3 entries"] }, { id: "o4", c: ["set(NX, 6)", t("explicit insert", "स्पष्ट डालना"), "4 entries"] }] },
    ],
    sc: [
      { map: { focus: true, note: t("Cards may move on screen — each key's value stays attached", "कार्ड स्क्रीन पर खिसक सकते हैं — हर कुंजी का मान साथ रहता है"), noteTone: "info" } },
      { map: { mark: { BK: "hl" }, note: t("lookup(BK): follow that exact key, ignoring card order. Uppercase and lowercase differ.", "lookup(BK): उसी सटीक कुंजी का पीछा करें, कार्ड-क्रम को अनदेखा करें। बड़े-छोटे अक्षर अलग।"), noteTone: "info" } },
      { ops: { hide: false, focus: true, mark: { o3: "ok" }, note: t("set on an existing key replaces its value — still one entry, no duplicate history", "मौजूदा कुंजी पर set उसका मान बदलता है — अब भी एक प्रविष्टि, कोई दोहरा इतिहास नहीं"), noteTone: "ok" }, map: { focus: false, note: undefined } },
      { ops: { focus: false, mark: { o2: "warn" }, note: t("What does lookup('NX') do before any insertion?", "किसी डालने से पहले lookup('NX') क्या करता है?"), noteTone: "info" } },
      { ops: { mark: { o4: "ok", o2: "ok" }, note: t("Only an explicit set inserts NX — lookup returns the default 0 and leaves the map unchanged", "सिर्फ़ स्पष्ट set ही NX डालता है — lookup डिफ़ॉल्ट 0 लौटाता है और मैप नहीं बदलता"), noteTone: "ok" } },
      { ops: { focus: true } },
    ],
    out: {
      default: { ops: { hide: false, mark: { o2: "ok" }, note: t("Return 0; keep the map unchanged", "0 लौटाएँ; मैप नहीं बदलता"), noteTone: "ok" } },
      insert: { ops: { hide: false, mark: { o2: "risk" }, txt: { "o2:2": t("0 + creates NX", "0 + NX बना देता है") }, note: t("A lookup must not create entries", "लुकअप को प्रविष्टि नहीं बनानी चाहिए"), noteTone: "risk" } },
      near: { ops: { hide: false, mark: { o2: "risk" }, note: t("Keys match exactly — there is no 'nearby'", "कुंजियाँ ठीक-ठीक मिलती हैं — 'पास की' नहीं होती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-stable-sort-pass", scene: "classroom", layout: "one",
    label: t("Four priority cards · one left-to-right pass", "चार प्राथमिकता कार्ड · बाएँ से दाएँ एक पास"),
    art: [
      { k: "seq", id: "row", title: t("The row (letter : key)", "पंक्ति (अक्षर : कुंजी)"), icon: "list", tiles: ["P:3", "Q:1", "R:3", "S:2"], rule: t("Swap only when the left key is strictly greater than the right key", "तभी बदलें जब बाईं कुंजी दाईं से सख़्ती से बड़ी हो") },
    ],
    sc: [
      { row: { focus: true, note: t("Each card has a stable letter identity and a numeric key; the pass moves complete cards", "हर कार्ड की स्थिर अक्षर-पहचान और संख्यात्मक कुंजी है; पास पूरे कार्ड हिलाता है"), noteTone: "info" } },
      { row: { mark: { 0: "hl", 1: "hl" }, rule: t("Compare adjacent pairs left to right — each next pair uses the current row", "पास की जोड़ियाँ बाएँ से दाएँ मिलाएँ — हर अगली जोड़ी मौजूदा पंक्ति से"), note: undefined } },
      { row: { tiles: ["Q:1", "P:3", "R:3", "S:2"], mark: { 0: "ok", 1: "ok" }, rule: t("P:3 > Q:1 → swap. One comparison and one swap are separate events.", "P:3 > Q:1 → बदलें। एक तुलना और एक अदला-बदली अलग घटनाएँ हैं।"), note: undefined } },
      { row: { tiles: ["Q:1", "P:3", "R:3", "S:2"], mark: {}, rule: t("Which pair is compared immediately after the first swap?", "पहली अदला-बदली के ठीक बाद कौन-सी जोड़ी मिलाई जाती है?") } },
      { row: { tiles: ["Q:1", "P:3", "S:2", "R:3"], mark: { 1: "hl", 3: "hl" }, rule: t("P:3 and R:3 are equal — equality isn't 'greater than', so they keep their original relative order", "P:3 और R:3 बराबर हैं — बराबरी 'बड़ी' नहीं, इसलिए उनका मूल सापेक्ष क्रम बना रहता है"), note: t("After one pass: Q P S R", "एक पास के बाद: Q P S R"), noteTone: "ok" } },
      { row: { focus: true } },
    ],
    out: {
      pr: { row: { tiles: ["Q:1", "P:3", "R:3", "S:2"], mark: { 1: "hl", 2: "hl" }, rule: t("P:3 and R:3 — equal keys, no swap", "P:3 और R:3 — बराबर कुंजी, कोई अदला-बदली नहीं"), note: t("The window slides on, using the current row", "खिड़की मौजूदा पंक्ति से आगे खिसकती है"), noteTone: "ok" } },
      qr: { row: { tiles: ["Q:1", "P:3", "R:3", "S:2"], mark: { 0: "risk", 2: "risk" }, rule: t("Q and R aren't adjacent after the swap", "अदला-बदली के बाद Q और R पास-पास नहीं"), note: t("The next pair uses the current row, not the starting row", "अगली जोड़ी मौजूदा पंक्ति से, शुरुआती से नहीं"), noteTone: "risk" } },
      reverse: { row: { tiles: ["Q:1", "R:3", "P:3", "S:2"], mark: { 1: "risk", 2: "risk" }, note: t("Swapping equal keys breaks stability", "बराबर कुंजियाँ बदलने से स्थिरता टूटती है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fair-method-comparison", scene: "lab", layout: "two",
    label: t("Same batch, same result · count inspections", "वही बैच, वही नतीजा · निरीक्षण गिनें"),
    art: [
      { k: "chart", id: "four", at: "a", look: "bars", max: 70, title: t("n = 4", "n = 4"), icon: "bars", bars: [{ id: "a", t: t("A: each once", "A: हर एक एक बार"), v: 4, tone: "info" }, { id: "b", t: t("B: every ordered pair", "B: हर क्रमित जोड़ी"), v: 16, tone: "warn" }] },
      { k: "chart", id: "eight", at: "b", hide: true, look: "bars", max: 70, title: t("n = 8", "n = 8"), icon: "bars", bars: [{ id: "a", t: "A", v: 8, tone: "info" }, { id: "b", t: "B", v: 64, tone: "risk" }] },
    ],
    sc: [
      { four: { focus: true, note: t("Both get the same batch and result; the counted operation is stated before starting", "दोनों को वही बैच और नतीजा; गिनी जाने वाली क्रिया शुरू से पहले बताई गई"), noteTone: "info" } },
      { four: { note: t("A inspects each card once; B inspects every ordered pair, including a card with itself. Counters record inspections only.", "A हर कार्ड एक बार देखता है; B हर क्रमित जोड़ी देखता है, कार्ड-ख़ुद सहित। काउंटर सिर्फ़ निरीक्षण दर्ज करते हैं।"), noteTone: "info" } },
      { eight: { hide: false, focus: true, note: t("Double the batch, leave the algorithms unchanged — counts follow the rules, not how fast the animation looks", "बैच दुगुना, एल्गोरिद्म वही — गिनती नियमों से आती है, एनिमेशन की रफ़्तार से नहीं"), noteTone: "ok" }, four: { focus: false, note: undefined } },
      { eight: { hide: true }, four: { note: t("When n changes from 4 to 8, which prediction follows?", "n के 4 से 8 होने पर कौन-सा अनुमान सही है?"), noteTone: "info" } },
      { eight: { hide: false, focus: true, note: t("A: 4 → 8; B: 16 → 64 — the pair lane grows faster in this operation measure", "A: 4 → 8; B: 16 → 64 — इस क्रिया-माप में जोड़ी वाली राह तेज़ी से बढ़ती है"), noteTone: "ok" } },
      { eight: { focus: true } },
    ],
    out: {
      formula: { eight: { hide: false, note: t("A: 4 → 8; B: 16 → 64 inspections", "A: 4 → 8; B: 16 → 64 निरीक्षण"), noteTone: "ok" } },
      double: { eight: { hide: false, bars: [{ id: "a", t: "A", v: 8, tone: "info" }, { id: "b", t: t("B (32?)", "B (32?)"), v: 32, tone: "risk" }], note: t("Pairs grow with the square of n — doubling n quadruples B", "जोड़ियाँ n के वर्ग से बढ़ती हैं — n दुगुना होने पर B चौगुना"), noteTone: "risk" } },
      time: { eight: { hide: false, note: t("Counts aren't clock time on every device", "गिनती हर डिवाइस पर घड़ी का समय नहीं होती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-resource-invariant", scene: "market", layout: "two",
    label: t("Resource desk · allocated + remaining must equal the pool", "संसाधन डेस्क · आवंटित + शेष = कुल भंडार"),
    art: [
      { k: "chart", id: "pool", at: "a", look: "split", title: t("A fixed pool of 12 tokens", "12 टोकन का तय भंडार"), icon: "coins", parts: [{ t: t("allocated", "आवंटित"), v: 0, tone: "info" }, { t: t("remaining", "शेष"), v: 12, tone: "ok" }] },
      { k: "table", id: "log", at: "b", title: t("Requests (id, tokens)", "अनुरोध (आईडी, टोकन)"), icon: "list", cols: [t("Request", "अनुरोध"), t("Outcome", "नतीजा")], rows: [{ id: "q1", c: ["(A, 4)", "?"] }, { id: "q2", c: ["(B, 20)", "?"] }, { id: "q3", c: ["(A, 4) again", "?"] }], upTo: 0 },
    ],
    sc: [
      { pool: { focus: true, note: t("The display splits into allocated and remaining — their sum must always equal the original pool", "डिस्प्ले आवंटित और शेष में बँटा है — उनका योग हमेशा मूल भंडार के बराबर रहना चाहिए"), noteTone: "info" } },
      { pool: { parts: [{ t: t("allocated", "आवंटित"), v: 4, tone: "info" }, { t: t("remaining", "शेष"), v: 8, tone: "ok" }], note: t("A valid request moves tokens from remaining to allocated — reduce one without raising the other and the invariant is lost", "सही अनुरोध टोकन शेष से आवंटित में ले जाता है — एक घटाकर दूसरा न बढ़ाएँ वरना नियम टूटता है"), noteTone: "ok" }, log: { upTo: 1, txt: { "q1:1": t("accepted · id A remembered", "स्वीकृत · आईडी A याद") }, mark: { q1: "ok" } } },
      { log: { upTo: 2, txt: { "q1:1": t("accepted", "स्वीकृत"), "q2:1": t("rejected — unchanged", "अस्वीकृत — अपरिवर्तित") }, mark: { q1: "ok", q2: "warn" }, note: t("More than remain: the corrected process checks capacity before touching either counter; a negative remaining would keep the sum yet break the rule", "शेष से ज़्यादा: सुधरी प्रक्रिया किसी काउंटर को छूने से पहले क्षमता जाँचती है; ऋणात्मक शेष योग रखकर भी नियम तोड़ता"), noteTone: "info" }, pool: { focus: false, note: undefined } },
      { log: { upTo: 3, txt: { "q1:1": t("accepted", "स्वीकृत"), "q2:1": t("rejected", "अस्वीकृत"), "q3:1": "?" }, mark: { q1: "ok", q2: "warn", q3: "info" }, note: t("After accepting (A, 4), should (A, 4) be accepted again?", "(A, 4) स्वीकार होने के बाद क्या (A, 4) फिर स्वीकार हो?"), noteTone: "info" } },
      { log: { upTo: 3, txt: { "q1:1": t("accepted", "स्वीकृत"), "q2:1": t("rejected", "अस्वीकृत"), "q3:1": t("duplicate — unchanged", "दोहराव — अपरिवर्तित") }, mark: { q1: "ok", q2: "warn", q3: "ok" }, note: t("The duplicate is recognised before any tokens move: allocated 4, remaining 8, remembered ids unchanged", "दोहराव किसी टोकन के हिलने से पहले पहचाना जाता है: आवंटित 4, शेष 8, याद आईडी अपरिवर्तित"), noteTone: "ok" } },
      { pool: { focus: true } },
    ],
    out: {
      duplicate: { log: { upTo: 3, txt: { "q3:1": t("rejected — allocated 4, remaining 8", "अस्वीकृत — आवंटित 4, शेष 8") }, mark: { q3: "ok" }, note: t("Reject; allocated = 4, remaining = 8 stay unchanged", "अस्वीकार; आवंटित = 4, शेष = 8 अपरिवर्तित"), noteTone: "ok" } },
      space: { pool: { parts: [{ t: t("allocated", "आवंटित"), v: 8, tone: "risk" }, { t: t("remaining", "शेष"), v: 4, tone: "ok" }], note: t("Room (4 ≤ 8) doesn't make a duplicate valid — A is allocated twice", "जगह (4 ≤ 8) दोहराव को मान्य नहीं बनाती — A दो बार आवंटित"), noteTone: "risk" } },
      half: { pool: { parts: [{ t: t("allocated", "आवंटित"), v: 4, tone: "info" }, { t: t("remaining", "शेष"), v: 4, tone: "risk" }], note: t("Subtracting without allocating loses 4 tokens: 4 + 4 ≠ 12", "आवंटित किए बिना घटाने से 4 टोकन खो जाते हैं: 4 + 4 ≠ 12"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-prerequisite-schedules", scene: "lab", layout: "one",
    label: t("A fictional demonstration · tasks and prerequisites", "एक काल्पनिक प्रदर्शन · कार्य और पूर्व-शर्तें"),
    art: [
      { k: "flow", id: "dag", look: "graph", title: t("An arrow means: the start task finishes first", "तीर का मतलब: शुरू का कार्य पहले पूरा हो"), icon: "network", nodes: [{ id: "S", t: t("S · Setup", "S · सेटअप"), icon: "wrench", x: 12, y: 50 }, { id: "L", t: t("L · Lights", "L · लाइट"), icon: "sun", x: 40, y: 20 }, { id: "A", t: t("A · Audio", "A · ऑडियो"), icon: "volume", x: 40, y: 80 }, { id: "R", t: t("R · Recording", "R · रिकॉर्डिंग"), icon: "video", x: 68, y: 50 }, { id: "V", t: t("V · Screening", "V · स्क्रीनिंग"), icon: "tv", x: 92, y: 50 }],
        links: [{ from: "S", to: "L" }, { from: "S", to: "A" }, { from: "L", to: "R" }, { from: "A", to: "R" }, { from: "R", to: "V" }], state: { S: "now", L: "muted", A: "muted", R: "muted", V: "muted" } },
    ],
    sc: [
      { dag: { focus: true, note: t("Each task is a node; the drawing says what must finish first — not the exact order", "हर कार्य एक नोड है; चित्र बताता है क्या पहले पूरा हो — सटीक क्रम नहीं"), noteTone: "info" } },
      { dag: { state: { S: "done", L: "lit", A: "lit", R: "muted", V: "muted" }, note: t("After Setup, Lights and Audio are both ready — neither depends on the other", "सेटअप के बाद लाइट और ऑडियो दोनों तैयार — कोई एक-दूसरे पर निर्भर नहीं"), noteTone: "ok" } },
      { dag: { state: { S: "done", L: "done", A: "done", R: "lit", V: "muted" }, note: t("Either order works: lights then audio, or audio then lights — recording waits for both", "दोनों क्रम चलते हैं: लाइट फिर ऑडियो, या ऑडियो फिर लाइट — रिकॉर्डिंग दोनों का इंतज़ार करती है"), noteTone: "ok" } },
      { dag: { state: { S: "done", L: "done", A: "lit", R: "muted", V: "muted" }, note: t("After S and L, what can legitimately happen next?", "S और L के बाद आगे वैध रूप से क्या हो सकता है?"), noteTone: "info" } },
      { dag: { state: { S: "done", L: "done", A: "done", R: "done", V: "ok" }, cur: "V", note: t("Audio, then recording, then screening — each prerequisite checked when its task starts", "ऑडियो, फिर रिकॉर्डिंग, फिर स्क्रीनिंग — हर पूर्व-शर्त उसका कार्य शुरू होते समय जाँची गई"), noteTone: "ok" } },
      { dag: { focus: true } },
    ],
    out: {
      audio: { dag: { state: { S: "done", L: "done", A: "done", R: "lit", V: "muted" }, note: t("Complete A; then R becomes ready", "A पूरा करें; तब R तैयार होता है"), noteTone: "ok" } },
      record: { dag: { state: { S: "done", L: "done", A: "risk", R: "risk", V: "muted" }, link: { "A>R": "bad" }, note: t("R needs both L and A — L alone isn't enough", "R को L और A दोनों चाहिए — सिर्फ़ L काफ़ी नहीं"), noteTone: "risk" } },
      screen: { dag: { state: { S: "done", L: "done", A: "lit", R: "risk", V: "risk" }, link: { "R>V": "bad" }, note: t("V needs R first — setup alone doesn't unlock it", "V को पहले R चाहिए — सिर्फ़ सेटअप इसे नहीं खोलता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-weighted-rerouting", scene: "street", layout: "two",
    label: t("Delivery map · two stops, two budgets, a closed cell", "डिलीवरी नक़्शा · दो पड़ाव, दो बजट, एक बंद खाना"),
    art: [
      { k: "grid", id: "map", at: "a", look: "map", w: 4, h: 3, title: t("Entry cost per cell (start is free)", "हर खाने में जाने का ख़र्च (शुरुआत मुफ़्त)"), icon: "map", me: 0, goal: 11, cells: { 4: { icon: "box", tone: "warn" }, 7: { icon: "box", tone: "warn" }, 5: { t: "2" }, 6: { t: "1" }, 8: { t: "1" }, 9: { t: "3" }, 10: { t: "2" } }, path: [0, 4, 5, 6, 7, 11] },
      { k: "table", id: "proof", at: "b", hide: true, title: t("What a route must prove", "रास्ते को क्या साबित करना है"), icon: "checks", cols: [t("Requirement", "शर्त"), t("Old route", "पुराना रास्ता"), t("Revised", "सुधरा")], rows: [{ id: "legal", c: [t("Every move legal", "हर चाल वैध"), "✗ cell 5 closed", "?"] }, { id: "stops", c: [t("Both stops", "दोनों पड़ाव"), "✓", "?"] }, { id: "goal", c: [t("Goal", "लक्ष्य"), "✓", "?"] }, { id: "bud", c: [t("Both budgets", "दोनों बजट"), "—", "?"] }] },
    ],
    sc: [
      { map: { focus: true, note: t("A start, a goal and two required stops — the goal alone can't pass", "एक शुरुआत, एक लक्ष्य और दो ज़रूरी पड़ाव — सिर्फ़ लक्ष्य काफ़ी नहीं"), noteTone: "info" } },
      { map: { note: t("Every entry charges its listed cost — revisits too; the start is free. Record the actual sequence, don't multiply it.", "हर प्रवेश पर लिखा ख़र्च — दोबारा जाने पर भी; शुरुआत मुफ़्त। असली क्रम दर्ज करें, गुणा न करें।"), noteTone: "info" } },
      { map: { walls: [5], note: t("A central cell closes in the replay — the old legal path now fails at its first attempt to enter it", "रीप्ले में एक बीच का खाना बंद — पुराना वैध रास्ता उसमें घुसने की पहली कोशिश पर नाकाम"), noteTone: "risk" }, proof: { hide: false, mark: { legal: "risk" } } },
      { map: { walls: [5], note: t("What must a revised route prove after cell 5 closes?", "सेल 5 बंद होने के बाद सुधरे रास्ते को क्या साबित करना है?"), noteTone: "info" } },
      { map: { walls: [5], path: [0, 4, 8, 9, 10, 6, 7, 11], note: t("Follow the revised cells, adding each entered cost — earlier cells are charged again on return", "सुधरे खानों पर चलें, हर प्रवेश-ख़र्च जोड़ें — पहले देखे खाने वापसी पर फिर गिने जाते हैं"), noteTone: "ok" }, proof: { hide: false, txt: { "legal:2": "✓", "stops:2": "✓", "goal:2": "✓", "bud:2": "✓ 11 / 9" }, mark: { legal: "ok", stops: "ok", goal: "ok", bud: "ok" } } },
      { proof: { focus: true } },
    ],
    out: {
      all: { map: { walls: [5], path: [0, 4, 8, 9, 10, 6, 7, 11] }, proof: { hide: false, txt: { "legal:2": "✓", "stops:2": "✓", "goal:2": "✓", "bud:2": "✓" }, mark: { legal: "ok", stops: "ok", goal: "ok", bud: "ok" }, note: t("Legal moves, both stops, the goal and both budgets — on the actual replay", "वैध चालें, दोनों पड़ाव, लक्ष्य और दोनों बजट — असली रीप्ले पर"), noteTone: "ok" } },
      goal: { map: { walls: [5], path: [0, 1, 2, 3, 7, 11] }, proof: { hide: false, txt: { "stops:2": "✗ (4 missed)", "goal:2": "✓" }, mark: { stops: "risk", goal: "ok" }, note: t("Reaching cell 11 isn't all that matters", "सेल 11 तक पहुँचना ही सब कुछ नहीं"), noteTone: "risk" } },
      old: { map: { walls: [5], path: [0, 4, 5, 6, 7, 11] }, proof: { hide: false, mark: { legal: "risk" }, note: t("An old total reused without replaying hides the failure at cell 5", "बिना रीप्ले के पुराना कुल दोहराना सेल 5 की नाकामी छिपाता है"), noteTone: "risk" } },
    },
  },
];
