import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class10SecurityWorlds: World[] = [
  {
    slug: "class10-login-session-trace", scene: "night", layout: "two",
    label: t("Decision Lab · bulletin account on the school tablet", "डिसीज़न लैब · स्कूल टैबलेट पर बुलेटिन अकाउंट"),
    art: [
      { k: "flow", id: "trace", at: "a", look: "steps", title: t("Trace cards", "ट्रेस कार्ड"), icon: "route", nodes: [{ id: "pw", t: t("Password check ✓", "पासवर्ड जाँच ✓"), icon: "key", x: 12, y: 50 }, { id: "card", t: t("Session card 'Tablet'", "सेशन कार्ड 'Tablet'"), icon: "ticket", x: 40, y: 50 }, { id: "page", t: t("Another page opens — no new password", "दूसरा पेज खुला — नया पासवर्ड नहीं"), icon: "file", x: 70, y: 50 }, { id: "lost", t: t("Tablet reported lost", "टैबलेट गुम की रिपोर्ट"), icon: "alert", x: 92, y: 20 }], links: [{ from: "pw", to: "card" }, { from: "card", to: "page" }], state: { pw: "now" } },
      { k: "table", id: "sess", at: "b", hide: true, title: t("Sessions on the account", "अकाउंट के सेशन"), icon: "devices", cols: [t("Session", "सेशन"), t("Planned?", "योजना में?"), t("Status", "स्थिति")], rows: [{ id: "tab", c: ["Tablet", "✓", t("active", "चालू")] }, { id: "spare", c: ["Spare", "?", t("active", "चालू")] }] },
    ],
    sc: [
      { trace: { state: { pw: "now", card: "ok" }, focus: true, note: t("Vihaan records two different events: the password check, and the session it created", "विहान दो अलग घटनाएँ दर्ज करता है: पासवर्ड जाँच, और उससे बना सेशन"), noteTone: "info" } },
      { trace: { state: { pw: "done", card: "done", page: "now" }, cur: "page", note: t("The tablet opens a page using its session — a password prompt isn't the only gate", "टैबलेट अपने सेशन से पेज खोलता है — पासवर्ड माँगना अकेला दरवाज़ा नहीं"), noteTone: "info" }, sess: { hide: true } },
      { sess: { hide: false, focus: true, mark: { spare: "warn" }, note: t("A session named Spare appears. Aditi can't match it to the plan — but a label doesn't identify a person.", "'Spare' नाम का सेशन दिखा। आदिति इसे योजना से नहीं जोड़ पाती — पर लेबल किसी व्यक्ति को नहीं पहचानता।"), noteTone: "warn" }, trace: { focus: false, state: { pw: "done", card: "done", page: "done", lost: "risk" }, note: undefined } },
      { sess: { focus: false, note: t("What should follow the lost-tablet report?", "टैबलेट गुम होने की रिपोर्ट के बाद क्या हो?"), noteTone: "info" } },
      { sess: { txt: { "tab:2": t("revoked — request refused", "रद्द — अनुरोध अस्वीकृत") }, mark: { tab: "ok", spare: "warn" }, note: t("With the teacher: revoke Tablet via the verified session page and run its request test. Spare stays active until reviewed.", "टीचर के साथ: सत्यापित सेशन पेज से Tablet रद्द करें और उसका अनुरोध-परीक्षण चलाएँ। Spare समीक्षा तक चालू रहता है।"), noteTone: "ok" }, trace: { state: { pw: "done", card: "bad", page: "muted", lost: "ok" } } },
      { sess: { focus: true } },
    ],
    out: {
      revoke: { sess: { hide: false, txt: { "tab:2": t("revoked — request refused", "रद्द — अनुरोध अस्वीकृत") }, mark: { tab: "ok", spare: "warn" }, note: t("Revoke Tablet via the known route and test the refusal", "जाने-पहचाने रास्ते से Tablet रद्द करें और इनकार जाँचें"), noteTone: "ok" } },
      password: { sess: { hide: false, mark: { tab: "risk", spare: "risk" }, note: t("A new password doesn't end sessions that already hold a card", "नया पासवर्ड उन सेशनों को नहीं रोकता जिनके पास कार्ड है"), noteTone: "risk" } },
      identity: { sess: { hide: false, mark: { spare: "risk" }, note: t("A session label can't name the operator", "सेशन का लेबल संचालक का नाम नहीं बता सकता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-file-access-paths", scene: "lab", layout: "one",
    label: t("Decision Lab · who can reach the poster file?", "डिसीज़न लैब · पोस्टर फ़ाइल तक कौन पहुँच सकता है?"),
    art: [
      { k: "flow", id: "graph", look: "graph", title: t("Access paths to Poster", "पोस्टर तक पहुँच के रास्ते"), icon: "network", nodes: [{ id: "v", t: "Vihaan", icon: "user", x: 12, y: 18 }, { id: "g", t: t("Bulletin group", "बुलेटिन ग्रुप"), icon: "users", x: 12, y: 50 }, { id: "vis", t: t("Visitor account", "विज़िटर अकाउंट"), icon: "user-x", x: 12, y: 82 }, { id: "file", t: "Poster", icon: "image", x: 82, y: 50 }, { id: "a", t: "Aditi (editor)", icon: "pencil", x: 50, y: 12 }, { id: "pl", t: t("Public link", "सार्वजनिक लिंक"), icon: "link", x: 50, y: 88 }],
        links: [{ from: "v", to: "file", t: t("invite", "आमंत्रण") }, { from: "a", to: "file" }, { from: "g", to: "file" }, { from: "v", to: "g", t: t("member", "सदस्य") }, { from: "vis", to: "pl" }, { from: "pl", to: "file" }], link: { "g>file": "off", "v>g": "off", "vis>pl": "off", "pl>file": "off" }, state: { file: "now" } },
    ],
    sc: [
      { graph: { focus: true, state: { file: "now", v: "ok" }, note: t("Vihaan has a direct invitation to read the file — trace the edge", "विहान के पास फ़ाइल पढ़ने का सीधा आमंत्रण है — उस किनारे को देखें"), noteTone: "info" } },
      { graph: { link: { "g>file": "on", "v>g": "on", "vis>pl": "off", "pl>file": "off" }, state: { file: "now", v: "ok", g: "ok" }, note: t("A second route: the Bulletin group (he's a member) — counting routes explains access; count the file once", "दूसरा रास्ता: बुलेटिन ग्रुप (वह सदस्य है) — रास्ते गिनने से पहुँच समझ आती है; फ़ाइल एक बार गिनें"), noteTone: "info" } },
      { graph: { link: { "g>file": "on", "v>g": "on", "vis>pl": "bad", "pl>file": "bad" }, state: { file: "risk", v: "ok", g: "ok", vis: "risk", pl: "risk" }, note: t("A public link is another route that needs no membership — the visitor opens the poster", "सार्वजनिक लिंक एक और रास्ता है जिसे सदस्यता नहीं चाहिए — विज़िटर पोस्टर खोल लेता है"), noteTone: "risk" } },
      { graph: { note: t("Vihaan's invitation was removed — why can he still open the poster?", "विहान का आमंत्रण हटा — फिर भी वह पोस्टर क्यों खोल पाता है?"), noteTone: "warn", link: { "v>file": "off", "g>file": "on", "v>g": "on", "vis>pl": "bad", "pl>file": "bad" } } },
      { graph: { link: { "v>file": "off", "g>file": "off", "v>g": "off", "vis>pl": "off", "pl>file": "off", "a>file": "on" }, state: { file: "ok", v: "muted", g: "muted", vis: "muted", pl: "muted", a: "ok" }, note: t("Old group permission removed, public link disabled — Aditi keeps her editor permission", "पुरानी ग्रुप अनुमति हटी, सार्वजनिक लिंक बंद — आदिति की एडिटर अनुमति बनी रही"), noteTone: "ok" } },
      { graph: { focus: true } },
    ],
    out: {
      paths: { graph: { link: { "v>file": "off", "g>file": "on", "v>g": "on", "vis>pl": "bad", "pl>file": "bad" }, state: { file: "risk", g: "risk", pl: "risk" }, note: t("Group and public-link paths still grant access", "ग्रुप और सार्वजनिक-लिंक के रास्ते अब भी पहुँच देते हैं"), noteTone: "ok" } },
      broken: { graph: { link: { "v>file": "off", "g>file": "on", "v>g": "on" }, state: { file: "risk", g: "risk" }, note: t("The removal worked — other routes remain", "हटाना सफल रहा — दूसरे रास्ते बचे हैं"), noteTone: "risk" } },
      name: { graph: { state: { file: "now" }, note: t("A file's name isn't a permission", "फ़ाइल का नाम कोई अनुमति नहीं है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-plugin-capability-review", scene: "lab", layout: "two",
    label: t("A layout plugin joins the bulletin workflow", "एक लेआउट प्लगइन बुलेटिन वर्कफ़्लो में जुड़ता है"),
    art: [
      { k: "table", id: "man", at: "a", title: t("Manifest: what installing it allows", "मैनिफ़ेस्ट: इंस्टॉल करने से क्या हो सकता है"), icon: "puzzle", cols: [t("Capability", "क्षमता"), t("Approved release", "मंज़ूर रिलीज़"), t("Proposed update", "प्रस्तावित अपडेट")],
        rows: [{ id: "read", c: [t("Read the selected document", "चुना दस्तावेज़ पढ़ना"), "✓", "✓"] }, { id: "layout", c: [t("Change its layout", "उसका लेआउट बदलना"), "✓", "✓"] }, { id: "send", c: [t("Send the whole document to an external destination", "पूरा दस्तावेज़ बाहरी जगह भेजना"), "—", "✓ NEW"] }] },
      { k: "doc", id: "reg", at: "b", hide: true, look: "card", pic: "clipboard-ok", title: t("Approved-source register", "मंज़ूर-स्रोत रजिस्टर"), sub: t("Teacher compares exact release + manifest", "टीचर सटीक रिलीज़ + मैनिफ़ेस्ट मिलाती हैं"), toks: [{ id: "rel", t: t("Approved release v1 — minimal configuration", "मंज़ूर रिलीज़ v1 — न्यूनतम कॉन्फ़िगरेशन"), icon: "check" }, { id: "upd", t: t("Update v2 — not approved", "अपडेट v2 — मंज़ूर नहीं"), icon: "x" }, { id: "scan", t: t("One clean scan: not proof of all behaviour", "एक साफ़ स्कैन: पूरे व्यवहार का सबूत नहीं"), icon: "search" }] },
    ],
    sc: [
      { man: { focus: true, mark: { read: "info", layout: "info" }, note: t("A preview arranges headings — Aditi asks what installing it lets software do", "प्रीव्यू शीर्षक सजाता है — आदिति पूछती है कि इंस्टॉल करने पर सॉफ़्टवेयर क्या कर सकेगा"), noteTone: "info" } },
      { man: { mark: { read: "ok", layout: "ok" }, note: t("The approved release requests document access and layout changes — these match the task, but still need an approved source record", "मंज़ूर रिलीज़ दस्तावेज़ तक पहुँच और लेआउट-बदलाव माँगती है — ये काम से मेल खाते हैं, पर मंज़ूर स्रोत-रिकॉर्ड फिर भी चाहिए"), noteTone: "ok" } },
      { man: { mark: { read: "ok", layout: "ok", send: "risk" }, note: t("Same name, new permission: send the whole document out — the bulletin task doesn't need that", "वही नाम, नई अनुमति: पूरा दस्तावेज़ बाहर भेजना — बुलेटिन के काम को इसकी ज़रूरत नहीं"), noteTone: "risk" } },
      { man: { note: t("What should happen to the proposed update?", "प्रस्तावित अपडेट का क्या हो?"), noteTone: "info" }, reg: { hide: true } },
      { reg: { hide: false, focus: true, mark: { rel: "ok", upd: "risk", scan: "hl" }, note: t("Only the earlier minimal configuration is approved for this project", "इस प्रोजेक्ट के लिए सिर्फ़ पहले की न्यूनतम कॉन्फ़िगरेशन मंज़ूर है"), noteTone: "ok" }, man: { focus: false, mark: { read: "ok", layout: "ok", send: "risk" } } },
      { reg: { focus: true } },
    ],
    out: {
      pause: { man: { mark: { send: "risk" }, note: t("Pause and ask the teacher to review the added transfer", "रुकें और टीचर से जुड़ा ट्रांसफ़र जँचवाएँ"), noteTone: "ok" }, reg: { hide: false, mark: { rel: "ok", upd: "risk" } } },
      pretty: { man: { mark: { send: "risk" }, note: t("An identical preview says nothing about a new permission", "एक-सा प्रीव्यू नई अनुमति के बारे में कुछ नहीं बताता"), noteTone: "risk" } },
      scan: { reg: { hide: false, mark: { scan: "risk" }, note: t("A clean scan checks what it checked — not all behaviour", "साफ़ स्कैन वही जाँचता है जो उसने जाँचा — पूरा व्यवहार नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-input-permission-gates", scene: "lab", layout: "two",
    label: t("A local quantity form · three gates before saving", "एक स्थानीय मात्रा फ़ॉर्म · सेव करने से पहले तीन दरवाज़े"),
    art: [
      { k: "flow", id: "gates", at: "a", look: "steps", title: t("The gates, in order", "दरवाज़े, क्रम से"), icon: "workflow", nodes: [{ id: "g1", t: t("Format: whole digits", "प्रारूप: पूरे अंक"), icon: "hash", x: 12, y: 50 }, { id: "g2", t: t("Range: within the limit", "सीमा: सीमा के भीतर"), icon: "ruler", x: 38, y: 50 }, { id: "g3", t: t("Role: may edit?", "भूमिका: बदल सकता है?"), icon: "user-ok", x: 64, y: 50 }, { id: "sv", t: t("Save", "सेव"), icon: "save", x: 90, y: 50 }], links: [{ from: "g1", to: "g2" }, { from: "g2", to: "g3" }, { from: "g3", to: "sv" }], state: {} },
      { k: "table", id: "reqs", at: "b", title: t("Requests", "अनुरोध"), icon: "list", cols: [t("Who", "कौन"), t("Sends", "भेजता है"), t("Result", "नतीजा")], rows: [{ id: "r1", c: ["Vihaan", t("the word 'ten'", "शब्द 'ten'"), "?"] }, { id: "r2", c: ["Vihaan", "9999", "?"] }, { id: "r3", c: [t("Visitor", "विज़िटर"), "12", "?"] }, { id: "r4", c: [t("Named editor", "नामित एडिटर"), "12", "?"] }], upTo: 1 },
    ],
    sc: [
      { reqs: { upTo: 1, txt: { "r1:2": t("stopped at format", "प्रारूप पर रुका") }, mark: { r1: "risk" }, note: t("A word fails the format gate — before anyone considers size or permission", "शब्द प्रारूप-द्वार पर रुकता है — आकार या अनुमति देखने से पहले"), noteTone: "risk" }, gates: { state: { g1: "bad", g2: "muted", g3: "muted", sv: "muted" }, link: { "g1>g2": "off" }, focus: true } },
      { reqs: { upTo: 2, txt: { "r1:2": t("stopped at format", "प्रारूप पर रुका"), "r2:2": t("stopped at range", "सीमा पर रुका") }, mark: { r1: "risk", r2: "warn" }, note: t("Digits, but beyond the limit — the range gate refuses with a range reason", "अंक हैं, पर सीमा से ऊपर — सीमा-द्वार सीमा का कारण बताकर मना करता है"), noteTone: "warn" }, gates: { state: { g1: "done", g2: "bad", g3: "muted", sv: "muted" }, link: { "g1>g2": "on", "g2>g3": "off" } } },
      { reqs: { upTo: 3, txt: { "r1:2": t("stopped at format", "प्रारूप पर रुका"), "r2:2": t("stopped at range", "सीमा पर रुका"), "r3:2": t("stopped at role", "भूमिका पर रुका") }, mark: { r1: "risk", r2: "warn", r3: "info" }, note: t("A valid number passes both input checks — the role gate still refuses a visitor's edit", "सही संख्या दोनों इनपुट जाँच पास करती है — भूमिका-द्वार फिर भी विज़िटर का बदलाव मना करता है"), noteTone: "info" }, gates: { state: { g1: "done", g2: "done", g3: "bad", sv: "muted" }, link: { "g1>g2": "on", "g2>g3": "on", "g3>sv": "off" } } },
      { reqs: { upTo: 3, note: t("Should the valid visitor request change the record?", "क्या सही विज़िटर-अनुरोध रिकॉर्ड बदले?"), noteTone: "info" }, gates: { state: { g1: "done", g2: "done", g3: "bad", sv: "muted" } } },
      { reqs: { upTo: 4, txt: { "r4:2": t("saved", "सेव") }, mark: { r4: "ok" }, note: t("The named editor's whole number, inside the range: all gates pass and the record changes", "नामित एडिटर की पूर्ण संख्या, सीमा के भीतर: सब दरवाज़े पार और रिकॉर्ड बदलता है"), noteTone: "ok" }, gates: { state: { g1: "done", g2: "done", g3: "done", sv: "ok" }, link: { "g1>g2": "on", "g2>g3": "on", "g3>sv": "on" } } },
      { gates: { focus: true } },
    ],
    out: {
      deny: { reqs: { upTo: 3, txt: { "r3:2": t("refused at role", "भूमिका पर मना") }, mark: { r3: "info" }, note: t("Refuse saving: the visitor lacks edit permission", "सेव मना: विज़िटर के पास बदलने की अनुमति नहीं"), noteTone: "ok" } },
      allow: { reqs: { upTo: 3, txt: { "r3:2": t("saved?!", "सेव?!") }, mark: { r3: "risk" }, note: t("A valid number isn't a permission", "सही संख्या अनुमति नहीं होती"), noteTone: "risk" } },
      format: { reqs: { upTo: 3, mark: { r3: "warn" }, note: t("The format is fine — blaming formatting misnames the gate", "प्रारूप ठीक है — प्रारूप पर दोष मढ़ना ग़लत द्वार का नाम लेना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-linked-table-privacy", scene: "lab", layout: "two",
    label: t("Two club tables, no names — and still a person", "क्लब की दो तालिकाएँ, कोई नाम नहीं — फिर भी एक व्यक्ति"),
    art: [
      { k: "table", id: "att", at: "a", title: t("Attendance by activity and time", "गतिविधि और समय के हिसाब से उपस्थिति"), icon: "users", cols: [t("Activity", "गतिविधि"), t("Time", "समय"), t("Attended", "उपस्थित")], rows: [{ id: "a1", c: [t("Chess", "शतरंज"), t("Mon 4pm", "सोम 4pm"), "9"] }, { id: "a2", c: [t("Robotics", "रोबोटिक्स"), t("Tue 4pm", "मंगल 4pm"), "12"] }, { id: "a3", c: [t("Poetry", "कविता"), t("Wed 5pm", "बुध 5pm"), "1"] }] },
      { k: "table", id: "sup", at: "b", title: t("Support requests by the same categories", "उन्हीं श्रेणियों में सहायता अनुरोध"), icon: "life", cols: [t("Activity", "गतिविधि"), t("Time", "समय"), t("Requests", "अनुरोध")], rows: [{ id: "s1", c: [t("Chess", "शतरंज"), t("Mon 4pm", "सोम 4pm"), "2"] }, { id: "s2", c: [t("Robotics", "रोबोटिक्स"), t("Tue 4pm", "मंगल 4pm"), "3"] }, { id: "s3", c: [t("Poetry", "कविता"), t("Wed 5pm", "बुध 5pm"), "1"] }] },
    ],
    sc: [
      { att: { focus: true, note: t("Neither table has names — Vihaan thinks that makes them safe", "किसी तालिका में नाम नहीं — विहान सोचता है इससे वे सुरक्षित हैं"), noteTone: "warn" } },
      { att: { mark: { a3: "warn" }, note: undefined, focus: false }, sup: { mark: { s3: "warn" }, note: t("Align on activity and time: the audience already knows who attended one small session", "गतिविधि और समय पर मिलाएँ: दर्शक पहले से जानते हैं कि एक छोटे सत्र में कौन आया था"), noteTone: "warn" } },
      { att: { mark: { a3: "risk" }, cell: { "a3:2": "risk" } }, sup: { mark: { s3: "risk" }, cell: { "s3:2": "risk" }, note: t("One attendee + one request in one cell: it singles out the record for this audience (an inference, not proof)", "एक उपस्थित + एक अनुरोध एक ही खाने में: इस दर्शक के लिए रिकॉर्ड अलग हो जाता है (अनुमान, सबूत नहीं)"), noteTone: "risk" } },
      { att: { note: t("Which public export fits participation reporting?", "भागीदारी रिपोर्टिंग के लिए कौन-सा सार्वजनिक निर्यात ठीक है?"), noteTone: "info" }, sup: { note: undefined } },
      { att: { txt: { "a3:0": t("Poetry + others", "कविता + अन्य"), "a3:1": t("combined times", "मिले समय"), "a3:2": "4" }, mark: { a3: "ok" }, cell: { "a3:2": "ok" }, note: t("Combine time categories — the tiny intersection disappears; check the resulting chart", "समय की श्रेणियाँ मिलाएँ — छोटा प्रतिच्छेदन ग़ायब; नतीजे का चार्ट जाँचें"), noteTone: "ok" }, sup: { txt: { "s3:0": t("Poetry + others", "कविता + अन्य"), "s3:1": t("combined times", "मिले समय"), "s3:2": "3" }, mark: { s3: "ok" }, cell: { "s3:2": "ok" }, note: undefined } },
      { att: { focus: true } },
    ],
    out: {
      totals: { att: { txt: { "a3:0": t("Poetry + others", "कविता + अन्य"), "a3:1": t("combined times", "मिले समय"), "a3:2": "4" }, mark: { a3: "ok" }, cell: { "a3:2": "ok" }, note: t("Activity totals only, with a reviewed download", "सिर्फ़ गतिविधि के योग, जाँचे हुए डाउनलोड के साथ"), noteTone: "ok" } },
      names: { att: { mark: { a3: "risk" }, cell: { "a3:2": "risk" }, note: t("Absent names don't stop linking by category", "नाम न होना श्रेणी से जोड़ने को नहीं रोकता"), noteTone: "risk" }, sup: { mark: { s3: "risk" } } },
      title: { att: { mark: { a3: "risk" }, note: t("A new chart title leaves the detailed download untouched", "चार्ट का नया शीर्षक विस्तृत डाउनलोड को नहीं बदलता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-verified-version-restore", scene: "night", layout: "two",
    label: t("Bulletin timeline · three copies, one clean recovery point", "बुलेटिन टाइमलाइन · तीन कॉपियाँ, एक साफ़ रिकवरी बिंदु"),
    art: [
      { k: "flow", id: "copies", at: "a", look: "graph", title: t("Where the copies live", "कॉपियाँ कहाँ हैं"), icon: "archive", nodes: [{ id: "w", t: t("W · working file (12 + 3 + 2)", "W · कार्यशील फ़ाइल (12 + 3 + 2)"), icon: "doc", x: 18, y: 28 }, { id: "c", t: t("C · linked copy", "C · जुड़ी कॉपी"), icon: "copy", x: 82, y: 28 }, { id: "s", t: t("S · independent snapshot (12 approved)", "S · स्वतंत्र स्नैपशॉट (12 मंज़ूर)"), icon: "archive", x: 50, y: 82 }], links: [{ from: "w", to: "c", t: t("sync", "सिंक") }], state: { s: "ok" } },
      { k: "table", id: "test", at: "b", hide: true, title: t("Restore in a separate test area", "अलग टेस्ट क्षेत्र में रिस्टोर"), icon: "refresh", cols: [t("Check", "जाँच"), t("Result", "नतीजा")], rows: [{ id: "man", c: [t("Matches the manifest (12 entries)", "मैनिफ़ेस्ट से मेल (12 प्रविष्टियाँ)"), "?"] }, { id: "dmg", c: [t("Damaged file preserved for review", "ख़राब फ़ाइल समीक्षा के लिए सुरक्षित"), "?"] }, { id: "gap", c: [t("Recovery gap: 5 entries added since", "रिकवरी का अंतर: 5 प्रविष्टियाँ तब से जुड़ीं"), "?"] }] },
    ],
    sc: [
      { copies: { focus: true, note: t("An independent snapshot holds twelve approved entries; the working file later gained three, then two", "स्वतंत्र स्नैपशॉट में बारह मंज़ूर प्रविष्टियाँ हैं; कार्यशील फ़ाइल में बाद में तीन, फिर दो जुड़ीं"), noteTone: "info" } },
      { copies: { state: { w: "bad", c: "bad", s: "ok" }, link: { "w>c": "bad" }, note: t("An unwanted edit replaces the text and synchronises — both views show the unwanted result", "अनचाहा बदलाव पाठ बदलकर सिंक होता है — दोनों दृश्य अनचाहा नतीजा दिखाते हैं"), noteTone: "risk" } },
      { copies: { state: { w: "bad", c: "bad", s: "ok" }, note: t("S wasn't part of the sync — it keeps the approved entries — but it's only a candidate until opened and compared", "S सिंक का हिस्सा नहीं था — वह मंज़ूर प्रविष्टियाँ रखता है — पर जब तक खोलकर मिलाया न जाए वह सिर्फ़ उम्मीदवार है"), noteTone: "ok" } },
      { copies: { note: t("Which point is the clean recovery candidate?", "कौन-सा बिंदु साफ़ रिकवरी उम्मीदवार है?"), noteTone: "info" } },
      { test: { hide: false, focus: true, txt: { "man:1": "✓ 12 / 12", "dmg:1": "✓", "gap:1": "5" }, mark: { man: "ok", dmg: "ok", gap: "info" }, note: t("Restore S into a test area, compare it with the manifest, and keep the damaged file", "S को टेस्ट क्षेत्र में रिस्टोर करें, मैनिफ़ेस्ट से मिलाएँ, और ख़राब फ़ाइल रखें"), noteTone: "ok" }, copies: { focus: false } },
      { test: { focus: true } },
    ],
    out: {
      snapshot: { test: { hide: false, txt: { "man:1": "✓ 12 / 12", "dmg:1": "✓", "gap:1": "5" }, mark: { man: "ok", dmg: "ok", gap: "info" }, note: t("Restore S into a test area and compare its manifest", "S को टेस्ट क्षेत्र में रिस्टोर कर उसका मैनिफ़ेस्ट मिलाएँ"), noteTone: "ok" } },
      linked: { copies: { state: { c: "risk" }, note: t("C is newest — and carries the unwanted edit", "C सबसे नई है — और अनचाहा बदलाव लिए है"), noteTone: "risk" } },
      assume: { copies: { state: { w: "risk" }, note: t("A recorded count doesn't make W clean", "दर्ज की गिनती W को साफ़ नहीं बनाती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-borrowed-tablet-clock", scene: "night", layout: "two",
    label: t("Observation cards · a tablet clock seven minutes fast", "अवलोकन कार्ड · सात मिनट तेज़ टैबलेट घड़ी"),
    art: [
      { k: "table", id: "cards", at: "a", title: t("Minutes since midnight", "मध्यरात्रि से मिनट"), icon: "clock", cols: [t("Card", "कार्ड"), t("Source", "स्रोत"), t("Displayed", "दिखा"), t("Normalised", "सामान्यीकृत")],
        rows: [{ id: "c1", c: ["1", t("tablet", "टैबलेट"), "615", "?"] }, { id: "c2", c: ["2", t("reference", "संदर्भ"), "610", "?"] }, { id: "c3", c: ["3", t("tablet", "टैबलेट"), "628", "?"] }, { id: "c4", c: ["4", t("reference", "संदर्भ"), "624", "?"] }] },
      { k: "seq", id: "ord", at: "b", title: t("Order", "क्रम"), icon: "list", tiles: ["1", "2", "3", "4"], rule: t("Sorted by raw displayed values", "कच्चे दिखे मानों से क्रम") },
    ],
    sc: [
      { cards: { focus: true, note: t("The tablet is documented 7 minutes fast against reference; events are whole minutes in one stated day", "टैबलेट संदर्भ से 7 मिनट तेज़ दर्ज है; घटनाएँ एक बताए दिन के पूरे मिनट"), noteTone: "info" } },
      { ord: { tiles: ["2", "1", "4", "3"], mark: { 0: "warn", 1: "warn", 2: "warn", 3: "warn" }, rule: t("By raw values the order looks reversed — Vihaan nearly calls it impossible. Do the numbers share a clock basis?", "कच्चे मानों से क्रम उलटा दिखता है — विहान लगभग इसे असंभव कह देता है। क्या संख्याओं का घड़ी-आधार एक है?"), note: undefined } },
      { cards: { txt: { "c1:3": "608", "c2:3": "610", "c3:3": "621", "c4:3": "624" }, mark: { c1: "ok", c3: "ok" }, note: t("Subtract the documented offset from tablet values; leave reference values unchanged — no hidden timezone or daylight rule applies", "टैबलेट मानों से दर्ज अंतर घटाएँ; संदर्भ मान वैसे ही — कोई छिपा टाइमज़ोन या डेलाइट नियम नहीं"), noteTone: "ok" }, ord: { tiles: ["1", "2", "3", "4"], mark: { 0: "ok", 1: "ok", 2: "ok", 3: "ok" }, rule: t("Normalised: 608 → 610 → 621 → 624", "सामान्यीकृत: 608 → 610 → 621 → 624") } },
      { cards: { txt: {}, mark: {}, note: t("How should the tablet time be normalised?", "टैबलेट का समय कैसे सामान्यीकृत करें?"), noteTone: "info" }, ord: { tiles: ["2", "1", "4", "3"], mark: {}, rule: t("Raw order", "कच्चा क्रम") } },
      { cards: { txt: { "c1:3": "608", "c2:3": "610", "c3:3": "621", "c4:3": "624" }, mark: { c1: "ok", c3: "ok" }, note: t("Each card is placed by its normalised minute — with the original display beside it, so the teacher can reproduce it", "हर कार्ड सामान्यीकृत मिनट से रखा — मूल दिखा मान साथ, ताकि टीचर दोहरा सके"), noteTone: "ok" }, ord: { tiles: ["1", "2", "3", "4"], mark: { 0: "ok", 1: "ok", 2: "ok", 3: "ok" }, rule: t("Normalised order", "सामान्यीकृत क्रम") } },
      { ord: { focus: true } },
    ],
    out: {
      subtract: { cards: { txt: { "c1:3": "608", "c2:3": "610", "c3:3": "621", "c4:3": "624" }, mark: { c1: "ok", c3: "ok" }, note: t("Subtract 7 from each tablet minute; reference unchanged", "हर टैबलेट मिनट से 7 घटाएँ; संदर्भ अपरिवर्तित"), noteTone: "ok" } },
      add: { cards: { txt: { "c1:3": "622", "c2:3": "610", "c3:3": "635", "c4:3": "624" }, mark: { c1: "risk", c3: "risk" }, note: t("Adding doubles the error (the tablet is already ahead)", "जोड़ने से ग़लती दुगुनी (टैबलेट पहले ही आगे है)"), noteTone: "risk" } },
      sort: { ord: { tiles: ["2", "1", "4", "3"], mark: { 0: "risk", 1: "risk", 2: "risk", 3: "risk" }, note: t("Sorting raw displays mixes two clock bases", "कच्चे मान छाँटना दो घड़ी-आधार मिलाना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-bulletin-release-rehearsal", scene: "classroom", layout: "two",
    label: t("Decision Lab release board · privacy, access, source, recovery", "डिसीज़न लैब रिलीज़ बोर्ड · निजता, पहुँच, स्रोत, रिकवरी"),
    art: [
      { k: "table", id: "audit", at: "a", title: t("First release audit", "पहला रिलीज़ ऑडिट"), icon: "clipboard-ok", cols: [t("Criterion", "मापदंड"), t("Evidence", "सबूत"), t("Result", "नतीजा")], rows: [{ id: "priv", c: [t("Privacy", "निजता"), t("download has a time breakdown with a tiny group", "डाउनलोड में छोटे समूह वाला समय-विभाजन"), "?"] }, { id: "acc", c: [t("Access", "पहुँच"), t("a visitor can edit the draft via its link", "विज़िटर लिंक से ड्राफ़्ट बदल सकता है"), "?"] }, { id: "src", c: [t("Source", "स्रोत"), t("record matches approved material", "रिकॉर्ड मंज़ूर सामग्री से मेल खाता है"), "?"] }, { id: "rec", c: [t("Recovery", "रिकवरी"), t("restores in a test area, manifest matches", "टेस्ट क्षेत्र में रिस्टोर, मैनिफ़ेस्ट मेल"), "?"] }] },
      { k: "flow", id: "next", at: "b", look: "steps", hide: true, title: t("The release path", "रिलीज़ का रास्ता"), icon: "rocket", nodes: [{ id: "n1", t: t("Revise privacy + access", "निजता + पहुँच सुधारें"), icon: "wrench", x: 14, y: 50 }, { id: "n2", t: t("Retest as visitor + editor", "विज़िटर + एडिटर बनकर दोबारा जाँचें"), icon: "refresh", x: 50, y: 50 }, { id: "n3", t: t("Teacher approval", "टीचर की मंज़ूरी"), icon: "user-ok", x: 86, y: 50 }], links: [{ from: "n1", to: "n2" }, { from: "n2", to: "n3" }], state: { n1: "now" } },
    ],
    sc: [
      { audit: { focus: true, note: t("A document, a participation chart and a sharing ledger — each card serves a purpose", "एक दस्तावेज़, एक भागीदारी चार्ट और एक शेयरिंग बही — हर कार्ड का एक उद्देश्य"), noteTone: "info" } },
      { audit: { txt: { "priv:2": "✗", "acc:2": "✗" }, mark: { priv: "risk", acc: "risk" }, note: t("Two separate failures — fixing chart fields won't repair editing through the link", "दो अलग विफलताएँ — चार्ट के फ़ील्ड सुधारने से लिंक से बदलना नहीं सुधरता"), noteTone: "risk" } },
      { audit: { txt: { "priv:2": "✗", "acc:2": "✗", "src:2": "✓", "rec:2": "✓" }, mark: { priv: "risk", acc: "risk", src: "ok", rec: "ok" }, note: t("Source and recovery pass — but the criteria stay separate", "स्रोत और रिकवरी पास — पर मापदंड अलग-अलग रहते हैं"), noteTone: "info" } },
      { audit: { note: t("What is the next release decision after the first audit?", "पहले ऑडिट के बाद अगला रिलीज़ फ़ैसला क्या है?"), noteTone: "info" } },
      { audit: { txt: { "priv:2": "✓ totals only", "acc:2": "✓ visitor can't save", "src:2": "✓", "rec:2": "✓" }, mark: { priv: "ok", acc: "ok", src: "ok", rec: "ok" }, note: t("Activity totals only; a fresh visitor test can't save an edit; the named editor still can — then seek approval", "सिर्फ़ गतिविधि के योग; नया विज़िटर परीक्षण बदलाव सेव नहीं कर सकता; नामित एडिटर कर सकता है — फिर मंज़ूरी माँगें"), noteTone: "ok" }, next: { hide: false, state: { n1: "done", n2: "done", n3: "now" } } },
      { audit: { focus: true } },
    ],
    out: {
      revise: { audit: { txt: { "priv:2": "✓ totals only", "acc:2": "✓ visitor can't save", "src:2": "✓", "rec:2": "✓" }, mark: { priv: "ok", acc: "ok", src: "ok", rec: "ok" }, note: t("Revise privacy and access, retest, then seek teacher approval", "निजता और पहुँच सुधारें, दोबारा जाँचें, फिर टीचर की मंज़ूरी माँगें"), noteTone: "ok" }, next: { hide: false, state: { n1: "done", n2: "done", n3: "now" } } },
      go: { audit: { txt: { "priv:2": "✗", "acc:2": "✗", "src:2": "✓", "rec:2": "✓" }, mark: { priv: "risk", acc: "risk", src: "ok", rec: "ok" }, stamp: t("PUBLISHED", "प्रकाशित"), note: t("A passing restore doesn't cancel failing privacy and access", "पास हुआ रिस्टोर फ़ेल निजता और पहुँच को रद्द नहीं करता"), noteTone: "risk" } },
      hide: { audit: { mark: { priv: "gone", acc: "gone", src: "ok", rec: "ok" }, note: t("Hiding failed cards and calling it complete misreports the review", "फ़ेल कार्ड छिपाकर पूरा कहना समीक्षा की ग़लत रिपोर्ट है"), noteTone: "risk" } },
    },
  },
];
