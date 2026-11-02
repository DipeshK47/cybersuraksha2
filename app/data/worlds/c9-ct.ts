import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class9CtWorlds: World[] = [
  {
    slug: "class9-request-specification", scene: "market", layout: "two",
    label: t("Fair lending desk · what does 'small kit' mean?", "मेला लेंडिंग डेस्क · 'छोटी किट' का मतलब क्या?"),
    art: [
      { k: "chart", id: "box", at: "a", look: "split", title: t("The box holds at most 8 space tokens", "बॉक्स में अधिकतम 8 स्पेस-टोकन"), icon: "box", parts: [{ t: t("free", "ख़ाली"), v: 8, tone: "muted" }] },
      { k: "table", id: "cases", at: "b", hide: true, title: t("Cases that separate 'small'", "'छोटी' को अलग करने वाले मामले"), icon: "list", cols: [t("Request", "अनुरोध"), t("2 × clamps + rulers", "2 × क्लैंप + रूलर"), t("Result", "नतीजा")], rows: [{ id: "e", c: [t("empty", "ख़ाली"), "0", "?"] }, { id: "x", c: [t("3 clamps, 2 rulers", "3 क्लैंप, 2 रूलर"), "8", "?"] }, { id: "o", c: [t("4 clamps, 1 ruler", "4 क्लैंप, 1 रूलर"), "9", "?"] }] },
    ],
    sc: [
      { box: { focus: true, note: t("Nikhil's note says 'a small kit for each group' — what does small mean, and what must the desk output?", "निखिल का नोट 'हर समूह के लिए छोटी किट' कहता है — छोटी का मतलब क्या और डेस्क को क्या देना है?"), noteTone: "info" } },
      { box: { note: t("Inputs: group names and requested tool counts. Output card: packed counts and whether the request fits.", "इनपुट: समूह के नाम और माँगे औज़ार। आउटपुट कार्ड: पैक की गिनती और अनुरोध समाता है या नहीं।"), noteTone: "info" } },
      { box: { parts: [{ t: t("3 clamps × 2", "3 क्लैंप × 2"), v: 6, tone: "info" }, { t: t("2 rulers × 1", "2 रूलर × 1"), v: 2, tone: "ok" }], note: t("Three clamps and two rulers fill the box exactly — equality must count as fitting", "तीन क्लैंप और दो रूलर बॉक्स ठीक भर देते हैं — बराबरी को 'समाना' गिनना होगा"), noteTone: "ok" } },
      { box: { parts: [{ t: t("free", "ख़ाली"), v: 8, tone: "muted" }], note: undefined }, cases: { hide: false, note: t("Which specification can volunteers test consistently?", "कौन-सी विशिष्टता स्वयंसेवक एक-सा परख सकते हैं?"), noteTone: "info" } },
      { cases: { txt: { "e:2": t("fits (empty is allowed)", "समाती है (ख़ाली मान्य)"), "x:2": t("fits — equality counts", "समाती है — बराबरी गिनी"), "o:2": t("revise", "सुधारें") }, mark: { e: "ok", x: "ok", o: "warn" }, note: t("Empty, exactly full and oversized separate the possible meanings of 'small'", "ख़ाली, ठीक भरा और ज़्यादा — 'छोटी' के संभावित अर्थ अलग करते हैं"), noteTone: "ok" } },
      { cases: { focus: true } },
    ],
    out: {
      looks: { cases: { hide: false, note: t("'Looks small' differs between volunteers", "'छोटी दिखती है' स्वयंसेवकों में अलग-अलग होती है"), noteTone: "risk" } },
      strict: { cases: { hide: false, txt: { "x:2": t("revise — but it fits!", "सुधारें — पर समाती है!") }, mark: { x: "risk" }, note: t("< 8 rejects a kit that fills the box exactly", "< 8 उस किट को ठुकराता है जो बॉक्स ठीक भरती है"), noteTone: "risk" } },
      testable: { cases: { hide: false, txt: { "e:2": t("fit", "fit"), "x:2": t("fit", "fit"), "o:2": t("revise", "revise") }, mark: { e: "ok", x: "ok", o: "warn" }, note: t("Output fit if 2 × clamps + rulers ≤ 8; otherwise revise", "आउटपुट fit यदि 2 × क्लैंप + रूलर ≤ 8; वरना revise"), noteTone: "ok" } },
    },
  },
  {
    slug: "class9-value-trace", scene: "lab", layout: "two",
    label: t("Badge desk stock screen · written count vs display label", "बैज डेस्क स्टॉक स्क्रीन · लिखी गिनती बनाम डिस्प्ले लेबल"),
    art: [
      { k: "table", id: "trace", at: "a", title: t("Value after every line", "हर पंक्ति के बाद मान"), icon: "variable", upTo: 1, cols: [t("Line", "पंक्ति"), t("stock", "stock"), t("reserved", "reserved"), t("available", "available"), t("label", "label")], rows: [{ id: "l1", c: ["1  stock = 14", "14", "—", "—", "—"] }, { id: "l2", c: ["2  reserved = 4", "14", "4", "—", "—"] }, { id: "l3", c: ["3  available = stock − reserved", "14", "4", "10", "—"] }, { id: "l4", c: [t("4  label = \"Left: \" + available", "4  label = \"बचे: \" + available"), "14", "4", "10", "\"10\""] }] },
      { k: "table", id: "screen", at: "b", hide: true, title: t("The display", "डिस्प्ले"), icon: "monitor", cols: [t("Shows", "दिखाता है"), t("Value", "मान")], rows: [{ id: "s1", c: [t("Written count on the desk", "डेस्क पर लिखी गिनती"), "10"] }, { id: "s2", c: [t("Display label", "डिस्प्ले लेबल"), t("\"Left: 12\" (stale)", "\"बचे: 12\" (बासी)")] }] },
    ],
    sc: [
      { trace: { focus: true, note: t("The count and the label disagree — keep a table instead of guessing which is right", "गिनती और लेबल अलग हैं — अंदाज़े की जगह तालिका रखें कि कौन सही है"), noteTone: "warn" } },
      { trace: { upTo: 3, mark: { l3: "ok" }, note: t("stock 14, reserved 4: available = 14 − 4 = 10 — a later assignment can replace it; it doesn't remember the arithmetic", "stock 14, reserved 4: available = 14 − 4 = 10 — बाद की एसाइनमेंट इसे बदल सकती है; यह गणित याद नहीं रखता"), noteTone: "info" } },
      { trace: { upTo: 4, mark: { l3: "ok", l4: "info" }, note: t("Multiplication before addition — keep the exact expression beside the trace, and numbers as numbers until display", "जोड़ से पहले गुणा — सटीक व्यंजक ट्रेस के पास रखें, और संख्याएँ डिस्प्ले तक संख्याएँ रहें"), noteTone: "info" }, screen: { hide: false } },
      { screen: { mark: { s2: "risk" }, note: t("How should the stale label be repaired?", "बासी लेबल कैसे सुधारें?"), noteTone: "info" } },
      { screen: { mark: { s2: "ok" }, txt: { "s2:1": t("\"Left: 10\" (rebuilt after the subtraction)", "\"बचे: 10\" (घटाने के बाद बना)") }, note: t("A revised reservation list: restart from the supplied initial values and repeat every dependent line", "नई आरक्षण सूची: दिए प्रारंभिक मानों से शुरू करें और हर निर्भर पंक्ति दोहराएँ"), noteTone: "ok" } },
      { screen: { focus: true } },
    ],
    out: {
      move: { screen: { txt: { "s2:1": t("\"Left: 10\" (rebuilt after the subtraction)", "\"बचे: 10\" (घटाने के बाद बना)") }, mark: { s2: "ok" }, note: t("Create the label after the subtraction", "लेबल घटाने के बाद बनाएँ"), noteTone: "ok" } },
      change: { screen: { txt: { "s2:1": "…" }, mark: { s2: "risk" }, note: t("Changing the start to match the old label hides the cause", "पुराने लेबल से मिलाने को शुरुआत बदलना कारण छिपाना है"), noteTone: "risk" } },
      wait: { screen: { mark: { s2: "risk" }, note: t("Stored text doesn't refresh itself", "सेव किया पाठ अपने-आप अपडेट नहीं होता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-condition-edges", scene: "market", layout: "two",
    label: t("Kit counter · a request stamped both approve and review", "किट काउंटर · एक अनुरोध पर 'मंज़ूर' और 'समीक्षा' दोनों की मुहर"),
    art: [
      { k: "flow", id: "rule", at: "a", look: "graph", title: t("Eligibility", "पात्रता"), icon: "workflow", nodes: [{ id: "tot", t: t("total ≤ 8", "कुल ≤ 8"), icon: "calc", x: 14, y: 24 }, { id: "reg", t: t("group registered", "समूह पंजीकृत"), icon: "contact", x: 14, y: 76 }, { id: "and", t: "AND", icon: "workflow", x: 50, y: 50 }, { id: "ok", t: t("approve", "मंज़ूर"), icon: "check", x: 88, y: 24 }, { id: "rv", t: t("review", "समीक्षा"), icon: "search", x: 88, y: 76 }], links: [{ from: "tot", to: "and" }, { from: "reg", to: "and" }, { from: "and", to: "ok", t: t("both", "दोनों") }, { from: "and", to: "rv", t: t("else", "वरना") }], state: { and: "now" } },
      { k: "table", id: "edges", at: "b", hide: true, title: t("Boundary batch (registered fixed)", "सीमा-बैच (पंजीकृत स्थिर)"), icon: "list", cols: [t("Total", "कुल"), t("Registered", "पंजीकृत"), t("Outcome", "नतीजा")], rows: [{ id: "a", c: ["7", "✓", "?"] }, { id: "b", c: ["8", "✓", "?"] }, { id: "c", c: ["9", "✓", "?"] }, { id: "d", c: [t("(unknown)", "(अज्ञात)"), "✓", "?"] }] },
    ],
    sc: [
      { rule: { focus: true, note: t("Independent rules can both run — a correct comparison alone can't prevent a double stamp", "स्वतंत्र नियम दोनों चल सकते हैं — सिर्फ़ सही तुलना दोहरी मुहर नहीं रोकती"), noteTone: "warn" } },
      { rule: { state: { tot: "ok", reg: "risk", and: "now" }, note: t("Qualify only when total ≤ 8 AND the group is registered — a small total can't make up for no registration", "तभी पात्र जब कुल ≤ 8 और समूह पंजीकृत — छोटा कुल पंजीकरण की कमी पूरी नहीं करता"), noteTone: "info" } },
      { rule: { state: { tot: "now", reg: "now", and: "now" }, note: t("The same rejection: total > 8 OR NOT registered — OR needs only one failing requirement", "वही अस्वीकृति: कुल > 8 या पंजीकृत नहीं — OR को सिर्फ़ एक विफल शर्त चाहिए"), noteTone: "info" } },
      { edges: { hide: false, focus: true, note: t("Which branch structure handles an unknown total?", "अज्ञात कुल को कौन-सी शाखा-संरचना सँभालती है?"), noteTone: "info" }, rule: { focus: false, note: undefined } },
      { edges: { txt: { "a:2": t("approve", "मंज़ूर"), "b:2": t("approve", "मंज़ूर"), "c:2": t("review", "समीक्षा"), "d:2": t("ask first", "पहले पूछें") }, mark: { a: "ok", b: "ok", c: "warn", d: "info" }, note: t("Just below, exactly at and just above the limit — and the missing total asks first", "सीमा से ठीक नीचे, ठीक पर और ठीक ऊपर — और ग़ायब कुल पर पहले पूछा जाता है"), noteTone: "ok" } },
      { edges: { focus: true } },
    ],
    out: {
      priority: { edges: { hide: false, txt: { "a:2": t("approve", "मंज़ूर"), "b:2": t("approve", "मंज़ूर"), "c:2": t("review", "समीक्षा"), "d:2": t("ask first", "पहले पूछें") }, mark: { a: "ok", b: "ok", c: "warn", d: "info" }, note: t("If missing: ask; elif eligible: approve; else: review — one stamp each", "अगर ग़ायब: पूछें; वरना पात्र: मंज़ूर; वरना: समीक्षा — हर एक पर एक मुहर"), noteTone: "ok" } },
      zero: { edges: { hide: false, txt: { "d:0": "0", "d:2": t("approve (!)", "मंज़ूर (!)") }, mark: { d: "risk" }, note: t("Unknown replaced by 0 approves a request nobody measured", "अज्ञात को 0 बनाना बिना नापे अनुरोध को मंज़ूर करता है"), noteTone: "risk" } },
      independent: { edges: { hide: false, txt: { "d:2": t("ask + approve", "पूछें + मंज़ूर") }, mark: { d: "risk" }, note: t("Independent branches can stamp both", "स्वतंत्र शाखाएँ दोनों मुहर लगा सकती हैं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-stable-records", scene: "classroom", layout: "two",
    label: t("Lending queue · cards with a fixed borrower ID", "उधार कतार · तय उधारकर्ता-आईडी वाले कार्ड"),
    art: [
      { k: "table", id: "queue", at: "a", title: t("The queue (position starts at 0)", "कतार (स्थिति 0 से शुरू)"), icon: "users", cols: [t("Position", "स्थिति"), t("ID", "आईडी"), t("Name", "नाम"), t("kitCount", "किट-संख्या")], rows: [{ id: "q0", c: ["0", "B1", "Asha", "2"] }, { id: "q1", c: ["1", "B4", "Dev", "1"] }, { id: "q2", c: ["2", "B7", "Isha", "3"] }] },
      { k: "doc", id: "rule", at: "b", hide: true, look: "note", pic: "lock", title: t("Keep complete records together", "पूरे रिकॉर्ड साथ रखें"), toks: [{ id: "id", t: t("Look up the requested ID", "माँगी गई आईडी खोजें"), icon: "search" }, { id: "up", t: t("Change one field inside that record", "उसी रिकॉर्ड का एक फ़ील्ड बदलें"), icon: "pencil" }, { id: "sort", t: t("Never sort names apart from counts", "नाम और गिनती अलग-अलग कभी न छाँटें"), icon: "shuffle" }] },
    ],
    sc: [
      { queue: { focus: true, note: t("Queue order can change without changing who owns the information", "कतार का क्रम बदल सकता है, जानकारी का मालिक नहीं बदलता"), noteTone: "info" } },
      { queue: { note: t("Removing the front card shifts later positions towards the front — a position describes the current place", "आगे का कार्ड हटाने पर बाद की स्थितियाँ आगे खिसकती हैं — स्थिति वर्तमान जगह बताती है"), noteTone: "info" } },
      { rule: { hide: false, focus: true, mark: { id: "ok", up: "ok", sort: "warn" }, note: t("Sorting names apart from counts pairs people with someone else's kits", "नाम और गिनती अलग छाँटने पर लोग किसी और की किट से जुड़ जाते हैं"), noteTone: "warn" }, queue: { focus: false, note: undefined } },
      { rule: { focus: false, note: t("How should a request for ID B4 be updated?", "आईडी B4 के अनुरोध को कैसे अपडेट करें?"), noteTone: "info" } },
      { queue: { txt: { "q0:0": "0", "q0:1": "B4", "q0:2": "Dev", "q0:3": "3", "q1:0": "1", "q1:1": "B7", "q1:2": "Isha", "q1:3": "3", "q2:0": "2", "q2:1": "B9", "q2:2": "Noor", "q2:3": "1" }, mark: { q0: "ok" }, note: t("Completed request removed, a new one joins at the back — record both intermediate lists", "पूरा हुआ अनुरोध हटा, नया पीछे जुड़ा — दोनों बीच की सूचियाँ दर्ज करें"), noteTone: "ok" } },
      { queue: { focus: true } },
    ],
    out: {
      lookup: { queue: { mark: { q1: "ok" }, txt: { "q1:3": "3" }, note: t("Find ID B4, then update its kitCount", "आईडी B4 खोजें, फिर उसकी किट-संख्या बदलें"), noteTone: "ok" } },
      old: { queue: { mark: { q1: "warn", q2: "risk" }, txt: { "q2:3": "3 (wrong person!)" }, note: t("Positions shift — position 1 may now hold someone else", "स्थितियाँ खिसकती हैं — स्थिति 1 पर अब कोई और हो सकता है"), noteTone: "risk" } },
      all: { queue: { mark: { q0: "risk", q1: "risk", q2: "risk" }, txt: { "q0:3": "3", "q1:3": "3", "q2:3": "3" }, note: t("Every borrower's count overwritten", "हर उधारकर्ता की गिनती बदल गई"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-reusable-inputs", scene: "lab", layout: "two",
    label: t("kits(people, per_person, reserve) · one reusable step", "kits(people, per_person, reserve) · एक दोबारा इस्तेमाल योग्य क़दम"),
    art: [
      { k: "flow", id: "fn", at: "a", look: "graph", title: t("The function", "फ़ंक्शन"), icon: "component", nodes: [{ id: "a1", t: "people", icon: "users", x: 12, y: 18 }, { id: "a2", t: "per_person", icon: "package", x: 12, y: 50 }, { id: "a3", t: "reserve", icon: "plus", x: 12, y: 82 }, { id: "fn", t: "kits(…)", icon: "calc", x: 50, y: 50 }, { id: "ret", t: t("return total", "कुल लौटाएँ"), icon: "arrow", x: 88, y: 50 }], links: [{ from: "a1", to: "fn" }, { from: "a2", to: "fn" }, { from: "a3", to: "fn" }, { from: "fn", to: "ret" }], state: { fn: "now" } },
      { k: "table", id: "calls", at: "b", title: t("Test calls", "परीक्षण कॉल"), icon: "refresh", cols: [t("Call", "कॉल"), t("Result", "नतीजा")], rows: [{ id: "c1", c: ["kits(2, 1, 0)", "?"] }, { id: "c2", c: ["kits(5, 2, 3)", "?"] }, { id: "c3", c: ["kits(2, 1, 0) again", "?"] }], upTo: 0 },
    ],
    sc: [
      { fn: { focus: true, note: t("Nikhil keeps rewriting 'group size × kits per person + reserve' — Reva names the step", "निखिल बार-बार 'समूह × प्रति व्यक्ति किट + रिज़र्व' लिखता है — रेवा क़दम को नाम देती है"), noteTone: "info" } },
      { fn: { state: { a1: "ok", a2: "ok", a3: "ok", fn: "now" }, note: t("Parameters: people, per_person, reserve — arguments are supplied in that order, and only these values are used", "पैरामीटर: people, per_person, reserve — आर्ग्युमेंट इसी क्रम में, और सिर्फ़ यही मान इस्तेमाल"), noteTone: "info" } },
      { fn: { cur: "ret", state: { fn: "done", ret: "now" }, note: t("It returns a total — printing a label or packing a box is the caller's job", "यह कुल लौटाता है — लेबल छापना या बॉक्स पैक करना बुलाने वाले का काम है"), noteTone: "ok" }, calls: { upTo: 2, txt: { "c1:1": "2", "c2:1": "13" } } },
      { calls: { upTo: 3, txt: { "c1:1": "2", "c2:1": "13", "c3:1": "2" }, note: t("Which test exposes dependence on a previous call?", "कौन-सा परीक्षण पिछले कॉल पर निर्भरता दिखाता है?"), noteTone: "info" } },
      { calls: { upTo: 3, txt: { "c1:1": "2", "c2:1": "13", "c3:1": "2 ✓ same" }, mark: { c3: "ok" }, note: t("Run small, then large, reset, and reverse the order — each input keeps its own output", "पहले छोटा, फिर बड़ा, रीसेट, और क्रम उलटें — हर इनपुट का अपना आउटपुट रहे"), noteTone: "ok" } },
      { calls: { focus: true } },
    ],
    out: {
      sequence: { calls: { upTo: 3, txt: { "c1:1": "2", "c2:1": "13", "c3:1": "2 ✓ same" }, mark: { c3: "ok" }, note: t("Call twice without resetting and compare", "बिना रीसेट दो बार कॉल करके मिलाएँ"), noteTone: "ok" } },
      fresh: { calls: { upTo: 1, note: t("Resetting before every first call can't reveal leftover state", "हर पहले कॉल से पहले रीसेट बचे हुए स्टेट को नहीं दिखाता"), noteTone: "risk" } },
      label: { calls: { upTo: 1, note: t("Renaming a title tests nothing", "शीर्षक का नाम बदलना कुछ नहीं परखता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-bounded-search", scene: "library", layout: "two",
    label: t("Lending ledger · finding a kit code without skipping a record", "उधार बही · कोई रिकॉर्ड छोड़े बिना किट कोड ढूँढना"),
    art: [
      { k: "seq", id: "led", at: "a", title: t("Ledger codes (positions 0…n−1)", "बही के कोड (स्थिति 0…n−1)"), icon: "search", tiles: ["K7", "K3", "K9", "K1", "K5"], rule: t("A draft search jumps over alternate cards — unchecked cards could hold the target", "ड्राफ़्ट खोज एक-एक छोड़कर कूदती है — बिना जाँचे कार्डों में लक्ष्य हो सकता है") },
      { k: "table", id: "cnt", at: "b", hide: true, title: t("Comparisons (item vs target only)", "तुलनाएँ (सिर्फ़ आइटम बनाम लक्ष्य)"), icon: "calc", cols: [t("Case", "मामला"), t("Compared", "तुलना की"), t("Count", "गिनती")], rows: [{ id: "end", c: [t("target K5 (at the end)", "लक्ष्य K5 (अंत में)"), "K7 K3 K9 K1 K5", "5"] }, { id: "abs", c: [t("target K2 (absent)", "लक्ष्य K2 (अनुपस्थित)"), t("all five", "सभी पाँच"), "5"] }, { id: "emp", c: [t("empty ledger", "ख़ाली बही"), "—", "0"] }] },
    ],
    sc: [
      { led: { mark: { 0: "ok", 2: "ok", 4: "ok", 1: "risk", 3: "risk" }, focus: true, note: t("Skipping cards 1 and 3 could miss the target", "कार्ड 1 और 3 छोड़ने से लक्ष्य छूट सकता है"), noteTone: "warn" } },
      { led: { mark: { 0: "hl" }, rule: t("Start at position 0, inspect each existing item in order; stop on a match or before leaving the ledger", "स्थिति 0 से शुरू, हर मौजूद आइटम क्रम से जाँचें; मिलने पर या बही से बाहर जाने से पहले रुकें"), note: undefined } },
      { led: { mark: { 0: "hl", 1: "hl", 2: "hl", 3: "hl", 4: "ok" }, rule: t("Count only item-to-target comparisons — state that convention first", "सिर्फ़ आइटम-लक्ष्य तुलनाएँ गिनें — पहले यह नियम बताएँ"), note: undefined }, cnt: { hide: false } },
      { led: { mark: {}, rule: t("May this ledger use binary search immediately? (the codes aren't in order)", "क्या यह बही तुरंत बाइनरी खोज इस्तेमाल कर सकती है? (कोड क्रम में नहीं)"), note: undefined } },
      { led: { tiles: ["K1", "K3", "K5", "K7", "K9"], mark: {}, rule: t("Sort first, or use a bounded linear scan — then test end, absent and empty", "पहले क्रम में लगाएँ, या सीमित रेखीय खोज लें — फिर अंत, अनुपस्थित और ख़ाली जाँचें"), note: t("Sorted by code → binary search is allowed", "कोड से क्रमबद्ध → बाइनरी खोज मान्य"), noteTone: "ok" }, cnt: { hide: false, mark: { end: "ok", abs: "ok", emp: "ok" } } },
      { cnt: { focus: true } },
    ],
    out: {
      scan: { led: { tiles: ["K1", "K3", "K5", "K7", "K9"], mark: {}, note: t("A bounded scan, or sort by code first", "सीमित खोज, या पहले कोड से क्रमबद्ध करें"), noteTone: "ok" } },
      arrival: { led: { mark: { 0: "risk", 1: "risk", 2: "risk", 3: "risk", 4: "risk" }, note: t("Arrival order isn't code order", "आने का क्रम कोड का क्रम नहीं है"), noteTone: "risk" } },
      first: { led: { mark: { 0: "hl", 1: "gone", 2: "gone", 3: "gone", 4: "gone" }, note: t("Reading only the first code can't prove 'absent'", "सिर्फ़ पहला कोड पढ़कर 'अनुपस्थित' साबित नहीं होता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-weighted-routes", scene: "garden", layout: "two",
    label: t("Delivery cart across the makers fair · battery tokens", "मेकर्स मेले में डिलीवरी कार्ट · बैटरी टोकन"),
    art: [
      { k: "grid", id: "floor", at: "a", look: "map", w: 5, h: 3, title: t("Entry cost per cell (start is free)", "हर खाने में जाने का ख़र्च (शुरुआत मुफ़्त)"), icon: "map", me: 0, goal: 14, cells: { 3: { t: "3", tone: "warn" }, 4: { t: "3", tone: "warn" }, 9: { t: "4", tone: "risk" }, 11: { t: "1" }, 12: { t: "1" } }, walls: [7] },
      { k: "chart", id: "bat", at: "b", look: "bars", max: 14, title: t("Battery tokens spent", "बैटरी टोकन ख़र्च"), icon: "battery", ref: { v: 8, t: t("budget 8", "बजट 8") }, bars: [{ id: "a", t: t("Direct (fewer moves)", "सीधा (कम चालें)"), v: 11, tone: "risk" }, { id: "b", t: t("Longer, cheaper", "लंबा, सस्ता"), v: 7, tone: "ok" }] },
    ],
    sc: [
      { floor: { focus: true, note: t("Reva maps the cart; Nikhil draws the most direct route to the collection desk", "रेवा कार्ट का नक़्शा बनाती है; निखिल संग्रह डेस्क तक सबसे सीधा रास्ता खींचता है"), noteTone: "info" } },
      { floor: { path: [0, 1, 2, 3, 4, 9, 14], note: t("Some cells cost more to enter — fewer moves can spend more battery", "कुछ खाने महँगे हैं — कम चालें ज़्यादा बैटरी ख़र्च कर सकती हैं"), noteTone: "warn" }, bat: { focus: true } },
      { floor: { note: t("Each entry costs its listed amount — even when the cart returns to a visited cell. Unmarked cells cost 1. A blocked cell can't be crossed.", "हर प्रवेश पर लिखा ख़र्च — लौटकर देखे खाने में भी। बिना निशान के खाने 1। बंद खाना पार नहीं हो सकता।"), noteTone: "info" } },
      { floor: { path: [0, 1, 2, 3, 4, 9, 14], note: t("Which evidence is enough to approve a route?", "रास्ता मंज़ूर करने को कौन-सा सबूत काफ़ी है?"), noteTone: "info" } },
      { floor: { path: [0, 5, 10, 11, 12, 13, 14], note: t("A notice raises one cell's cost — the old route may now exceed the budget; keep the earlier result as a record", "एक सूचना किसी खाने का ख़र्च बढ़ाती है — पुराना रास्ता अब बजट से ऊपर हो सकता है; पहला नतीजा रिकॉर्ड में रखें"), noteTone: "ok" }, bat: { focus: false } },
      { floor: { focus: true } },
    ],
    out: {
      simulate: { floor: { path: [0, 5, 10, 11, 12, 13, 14], note: t("Run the moves; verify goal, obstacles, move count and entry-cost total", "चालें चलाएँ; लक्ष्य, रुकावटें, चाल-गिनती और प्रवेश-ख़र्च का कुल जाँचें"), noteTone: "ok" }, bat: { bars: [{ id: "a", t: t("Direct (fewer moves)", "सीधा (कम चालें)"), v: 11, tone: "risk" }, { id: "b", t: t("Longer, cheaper", "लंबा, सस्ता"), v: 7, tone: "ok" }] } },
      moves: { floor: { path: [0, 1, 2, 3, 4, 9, 14], note: t("Counting arrows ignores the battery cost", "तीर गिनना बैटरी का ख़र्च अनदेखा करता है"), noteTone: "risk" }, bat: { bars: [{ id: "a", t: t("Arrows only: 6 ≤ 7 ✓", "सिर्फ़ तीर: 6 ≤ 7 ✓"), v: 6, tone: "warn" }, { id: "b", t: t("Real cost", "असल ख़र्च"), v: 11, tone: "risk" }] } },
      unique: { floor: { path: [0, 1, 2, 3, 4, 9, 14], note: t("Charging a revisited cell once undercounts the battery", "फिर से देखे खाने को एक बार गिनना बैटरी कम गिनता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-dispatch-debugging", scene: "lab", layout: "two",
    label: t("Paper dispatch simulation · kits, a cart and a route", "काग़ज़ी डिस्पैच सिमुलेशन · किट, कार्ट और रास्ता"),
    art: [
      { k: "flow", id: "seq", at: "a", look: "steps", title: t("Dispatch steps", "डिस्पैच के क़दम"), icon: "workflow", nodes: [{ id: "mark", t: t("Mark dispatched", "'भेजी' दर्ज करें"), icon: "check", x: 10, y: 50 }, { id: "stock", t: t("Verify stock + capacity", "स्टॉक + क्षमता जाँचें"), icon: "checks", x: 36, y: 50 }, { id: "res", t: t("Reserve selected kits", "चुनी किट आरक्षित करें"), icon: "lock", x: 62, y: 50 }, { id: "route", t: t("Test the route", "रास्ता जाँचें"), icon: "route", x: 88, y: 50 }], links: [{ from: "mark", to: "stock" }, { from: "stock", to: "res" }, { from: "res", to: "route" }], state: { mark: "risk", stock: "muted", res: "muted", route: "muted" } },
      { k: "table", id: "queue", at: "b", title: t("Pending queue", "लंबित कतार"), icon: "list", cols: [t("Request", "अनुरोध"), t("Kits", "किट"), t("Status", "स्थिति")], rows: [{ id: "r1", c: ["R1", "3", t("pending", "लंबित")] }, { id: "r2", c: ["R2", "2", t("pending", "लंबित")] }, { id: "r3", c: ["R3", "4", t("pending", "लंबित")] }] },
    ],
    sc: [
      { seq: { focus: true, note: t("A cart has limited capacity; a route must pass its checks before a request is marked dispatched", "कार्ट की क्षमता सीमित है; अनुरोध 'भेजा' दर्ज होने से पहले रास्ते को जाँच पास करनी चाहिए"), noteTone: "info" } },
      { seq: { note: t("The draft marks dispatched first — a later failure leaves records claiming work that never happened", "ड्राफ़्ट पहले 'भेजा' दर्ज करता है — बाद की नाकामी रिकॉर्ड में ऐसा काम छोड़ देती है जो हुआ ही नहीं"), noteTone: "risk" }, queue: { txt: { "r1:2": t("dispatched?!", "भेजी?!"), "r2:2": t("dispatched?!", "भेजी?!") }, mark: { r1: "risk", r2: "risk" } } },
      { seq: { state: { mark: "muted", stock: "ok", res: "ok", route: "now" }, link: {}, note: t("Verify, reserve, remove only the selected IDs — record intermediate states so nothing disappears unreserved", "जाँचें, आरक्षित करें, सिर्फ़ चुनी आईडी हटाएँ — बीच की अवस्थाएँ दर्ज करें ताकि कुछ बिना आरक्षण के ग़ायब न हो"), noteTone: "ok" }, queue: { txt: { "r1:2": t("reserved", "आरक्षित"), "r2:2": t("reserved", "आरक्षित") }, mark: { r1: "info", r2: "info" } } },
      { seq: { state: { mark: "risk", stock: "muted", res: "muted", route: "muted" }, note: t("Which repair addresses the original dispatch fault?", "मूल डिस्पैच दोष का कौन-सा सुधार है?"), noteTone: "info" }, queue: { txt: {}, mark: {} } },
      { seq: { state: { mark: "ok", stock: "done", res: "done", route: "done" }, note: t("A corridor closes after the first test — the route result is stale: edit the arrows and rerun", "पहली जाँच के बाद एक गलियारा बंद — रास्ते का नतीजा बासी है: तीर बदलें और फिर चलाएँ"), noteTone: "ok" }, queue: { txt: { "r1:2": t("dispatched", "भेजी"), "r2:2": t("dispatched", "भेजी") }, mark: { r1: "ok", r2: "ok" } } },
      { seq: { focus: true } },
    ],
    out: {
      repair: { seq: { state: { mark: "ok", stock: "done", res: "done", route: "done" }, note: t("Move final dispatch recording after reservation and the current route test", "अंतिम 'भेजी' दर्ज करना आरक्षण और मौजूदा रास्ते की जाँच के बाद ले जाएँ"), noteTone: "ok" } },
      hide: { seq: { state: { mark: "risk" }, note: t("'Probably dispatched' is still a false record", "'शायद भेजी' भी झूठा रिकॉर्ड है"), noteTone: "risk" }, queue: { txt: { "r1:2": t("probably dispatched", "शायद भेजी") }, mark: { r1: "warn" } } },
      delete: { seq: { state: { route: "gone", mark: "risk" }, note: t("Deleting the failed result keeps a status the evidence no longer supports", "नाकाम नतीजा हटाने पर भी वह स्थिति रहती है जिसे सबूत अब समर्थन नहीं देता"), noteTone: "risk" } },
    },
  },
];
