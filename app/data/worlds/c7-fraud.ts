import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class7FraudWorlds: World[] = [
  {
    slug: "class7-fraud-entry-fee", scene: "market", layout: "three",
    label: t("The 'free' art kit message", "'मुफ़्त' आर्ट किट वाला संदेश"),
    art: [
      { k: "screen", id: "offer", at: "a", look: "phone", blocks: [
          { id: "prize", type: "banner", t: t("FREE ART KIT for the club!", "क्लब के लिए मुफ़्त आर्ट किट!"), sub: t("You have been chosen", "आपको चुना गया है"), icon: "gift" },
          { id: "fee", type: "price", t: t("Small entry fee to claim", "दावा करने के लिए छोटी एंट्री फ़ीस"), sub: t("5 tokens", "5 टोकन") },
          { id: "secret", type: "text", t: t("Keep this offer secret. Ends in 10 minutes!", "यह ऑफ़र गुप्त रखें। 10 मिनट में ख़त्म!") },
          { id: "go", type: "btn", t: t("Pay entry fee", "एंट्री फ़ीस दें"), icon: "coins" }] },
      { k: "doc", id: "parts", at: "b", look: "card", pic: "search", title: t("Tara's read of the message", "संदेश पर तारा की पढ़त"), sub: t("Look at the requested action first", "पहले माँगी गई कार्रवाई देखो"),
        toks: [{ id: "claim", t: t("Claim: a free prize", "दावा: मुफ़्त इनाम"), icon: "gift" }, { id: "demand", t: t("Demand: pay a fee first", "माँग: पहले फ़ीस दो"), icon: "coins" }, { id: "dl", t: t("Pressure: short deadline", "दबाव: छोटी समय-सीमा"), icon: "timer" }, { id: "sec", t: t("Pressure: keep it secret", "दबाव: गुप्त रखो"), icon: "eye-off" }] },
      { k: "flow", id: "plan", at: "c", hide: true, look: "steps", title: t("Checking plan", "जाँच की योजना"), icon: "checks",
        nodes: [{ id: "p1", t: t("Pause", "रुकें"), icon: "timer", x: 14, y: 50 }, { id: "p2", t: t("Minimal record", "छोटा रिकॉर्ड"), icon: "pencil", x: 50, y: 50 }, { id: "p3", t: t("Known school contact", "जाना-पहचाना स्कूल संपर्क"), icon: "school", x: 86, y: 50 }], links: [{ from: "p1", to: "p2" }, { from: "p2", to: "p3" }], state: { p1: "now" } },
      { k: "ledger", id: "wallet", at: "c", hide: true, title: t("Club token wallet (pretend)", "क्लब टोकन वॉलेट (नक़ली)"), icon: "wallet", lines: [{ id: "f", t: t("Entry fee — test", "एंट्री फ़ीस — परीक्षण"), amt: "−5", dir: "out", sub: t("to the unknown sender", "अनजान भेजने वाले को") }] },
    ],
    sc: [
      { offer: { focus: true }, parts: { hide: true } },
      { offer: { mark: { fee: "risk", secret: "risk" } }, parts: { hide: false, mark: { demand: "risk", dl: "warn", sec: "warn", claim: "hl" }, note: t("Paying even a small test is already acting on an unverified demand", "छोटी फ़ीस देकर 'जाँचना' भी बिना जाँची माँग मान लेना है"), noteTone: "warn" } },
      { offer: { focus: false, mark: { go: "press" } }, parts: { note: undefined }, plan: { hide: false, focus: true, state: { p1: "done", p2: "done", p3: "now" }, note: t("A new contact inside the message isn't an independent check", "संदेश के भीतर का नया संपर्क स्वतंत्र जाँच नहीं है"), noteTone: "info" } },
      { plan: { focus: false, note: undefined }, offer: { mark: {} }, parts: { note: t("Pay once to test — or pause?", "एक बार देकर परखें — या रुकें?"), noteTone: "info" } },
      { offer: { mark: { go: "hide", fee: "hide" } }, plan: { state: { p1: "done", p2: "done", p3: "ok" }, note: t("Paused and checked with a trusted adult", "रुके और भरोसेमंद बड़े से जाँच करवाई"), noteTone: "ok" } },
      { plan: { focus: true } },
    ],
    out: {
      "option-0": { offer: { mark: { go: "press", fee: "risk" } }, wallet: { hide: false, focus: true, note: t("Tokens gone — it followed the demand", "टोकन गए — माँग मान ली गई"), noteTone: "risk" }, plan: { hide: true } },
      "option-1": { offer: { mark: { go: "hide", fee: "hide" } }, plan: { state: { p1: "done", p2: "done", p3: "ok" }, note: t("Pause, verify through a known route", "रुकें, जाने-पहचाने रास्ते से जाँचें"), noteTone: "ok" }, wallet: { hide: true } },
      "option-2": { parts: { mark: { sec: "risk", demand: "risk" }, note: t("Secrecy is a pressure tactic — adults should know", "गोपनीयता का दबाव एक चाल है — बड़ों को पता होना चाहिए"), noteTone: "risk" }, plan: { hide: true } },
    },
  },
  {
    slug: "class7-fraud-familiar-sender", scene: "market", layout: "two",
    label: t("A message from 'Neel's aunt'", "'नील की आंटी' का संदेश"),
    art: [
      { k: "chat", id: "msg", at: "a", look: "phone", who: t("Aunty (new number)", "आंटी (नया नंबर)"),
        msgs: [{ from: "them", t: t("Neel, it's Aunty! I'm in trouble. Save my NEW number and help me urgently.", "नील, मैं आंटी हूँ! मुसीबत में हूँ। मेरा नया नंबर सेव करो और जल्दी मदद करो।"), flag: "warn" }, { from: "them", t: t("Don't tell anyone yet.", "अभी किसी को मत बताना।"), flag: "risk" }] },
      { k: "table", id: "evid", at: "b", hide: true, title: t("What counts as evidence?", "सबूत क्या गिना जाए?"), icon: "search",
        cols: [t("Clue", "संकेत"), t("Independent?", "स्वतंत्र?")],
        rows: [{ id: "name", c: [t("Her name is used", "उसका नाम इस्तेमाल हुआ"), "✗"] }, { id: "pic", c: [t("Familiar profile picture", "जानी-पहचानी प्रोफ़ाइल फ़ोटो"), "✗"] }, { id: "new", c: [t("The new number in the message", "संदेश वाला नया नंबर"), "✗"] }, { id: "known", c: [t("Adult's previously saved contact", "बड़े का पहले से सेव संपर्क"), "✓"] }] },
    ],
    sc: [
      { msg: { focus: true, note: t("Identity claim and requested action both come from the same message", "पहचान का दावा और माँगी गई कार्रवाई एक ही संदेश से आते हैं"), noteTone: "warn" } },
      { evid: { hide: false, mark: { name: "warn", pic: "warn", new: "warn" }, note: t("Names and pictures can be copied; a familiar voice still needs checking", "नाम और फ़ोटो कॉपी हो सकते हैं; जानी-पहचानी आवाज़ भी जाँचनी होगी"), noteTone: "warn" }, msg: { focus: false, note: undefined } },
      { evid: { mark: { new: "risk", known: "ok" }, note: t("Replying to the new number just asks the claim to confirm itself", "नए नंबर पर जवाब देना दावे से ही पुष्टि माँगना है"), noteTone: "info" } },
      { evid: { mark: {}, note: t("Which contact route gives an independent check?", "कौन-सा संपर्क रास्ता स्वतंत्र जाँच देता है?"), noteTone: "info" } },
      { evid: { mark: { new: "risk", known: "ok", name: "gone", pic: "gone" }, note: t("The adult uses the previously known contact", "बड़ा पहले से जाने हुए संपर्क का इस्तेमाल करता है"), noteTone: "ok" } },
      { evid: { focus: true } },
    ],
    out: {
      "option-0": { evid: { mark: { known: "ok", new: "gone", name: "gone", pic: "gone" }, note: t("An independent route", "स्वतंत्र रास्ता"), noteTone: "ok" } },
      "option-1": { evid: { mark: { new: "risk" }, note: t("The same unverified source confirms itself", "वही बिना जाँचा स्रोत ख़ुद की पुष्टि करता है"), noteTone: "risk" } },
      "option-2": { evid: { mark: { pic: "risk" }, note: t("A picture can be copied — not evidence", "फ़ोटो कॉपी हो सकती है — सबूत नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-fraud-qr-purpose", scene: "market", layout: "two",
    label: t("A 'club refund' code · invented screens only", "'क्लब रिफ़ंड' कोड · सिर्फ़ बनावटी स्क्रीन"),
    art: [
      { k: "screen", id: "claim", at: "a", look: "phone", blocks: [{ id: "c", type: "banner", t: t("Your club refund is ready", "आपका क्लब रिफ़ंड तैयार है"), sub: t("Scan the code to receive it", "पाने के लिए कोड स्कैन करें"), icon: "banknote" }, { id: "q", type: "qr", t: t("Pretend code", "नक़ली कोड") }] },
      { k: "screen", id: "dest", at: "b", hide: true, look: "phone", title: t("The destination screen", "गंतव्य वाली स्क्रीन"), icon: "arrow", blocks: [{ id: "d", type: "price", t: t("This action", "यह कार्रवाई"), sub: t("SEND 20 tokens OUT", "20 टोकन बाहर भेजें") }, { id: "w", type: "text", t: t("From: classroom wallet", "से: क्लासरूम वॉलेट") }] },
    ],
    sc: [
      { claim: { focus: true } },
      { dest: { hide: false, focus: true, mark: { d: "risk" }, note: t("Claim: money comes in. Screen: tokens go out.", "दावा: पैसा आएगा। स्क्रीन: टोकन जाएँगे।"), noteTone: "risk" }, claim: { focus: false, note: t("A neat code proves nothing about the sender", "सुंदर कोड भेजने वाले के बारे में कुछ साबित नहीं करता"), noteTone: "warn" } },
      { claim: { note: undefined }, dest: { focus: false, note: t("Nothing is scanned, no PIN entered — all tokens are invented. A trusted adult reviews real money matters.", "कुछ स्कैन नहीं हुआ, कोई PIN नहीं — सब टोकन बनावटी हैं। असली पैसे के मामले बड़े देखते हैं।"), noteTone: "info" } },
      { dest: { note: t("Does the action match the refund claim?", "क्या कार्रवाई रिफ़ंड के दावे से मेल खाती है?"), noteTone: "warn" } },
      { dest: { mark: { d: "gone" }, note: t("Paused; a trusted adult reviews the mismatch through a known route", "रोका; भरोसेमंद बड़ा जाने-पहचाने रास्ते से अमेल जाँचता है"), noteTone: "ok" } },
      { dest: { focus: true } },
    ],
    out: {
      "option-0": { claim: { mark: { q: "risk" }, note: t("A supplied code isn't a reason to proceed", "कोड मिलना आगे बढ़ने की वजह नहीं"), noteTone: "risk" } },
      "option-1": { dest: { mark: { d: "press", w: "risk" }, note: t("Sent first — inspecting later is too late", "पहले भेज दिया — बाद में देखना देर है"), noteTone: "risk" } },
      "option-2": { dest: { mark: { d: "gone" }, note: t("No — pause and review the mismatch", "नहीं — रुकें और अमेल जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class7-fraud-support-control", scene: "market", layout: "two",
    label: t("The 'serious problem' pop-up · static practice screen", "'गंभीर समस्या' पॉप-अप · सिर्फ़ अभ्यास स्क्रीन"),
    art: [
      { k: "screen", id: "pop", at: "a", look: "laptop", url: [{ t: "lab-laptop · browser" }], blocks: [
          { id: "warn", type: "popup", t: t("SERIOUS PROBLEM FOUND!", "गंभीर समस्या मिली!"), sub: t("Install our remote-control tool for instant help", "तुरंत मदद के लिए हमारा रिमोट-कंट्रोल टूल इंस्टॉल करें"), icon: "siren" },
          { id: "btn", type: "btn", t: t("Install and allow control", "इंस्टॉल करें और कंट्रोल दें"), icon: "download" }] },
      { k: "sw", id: "access", at: "b", title: t("What the sender could do", "भेजने वाला क्या कर सकता"), icon: "shield-alert",
        rows: [{ id: "see", t: t("See the screen", "स्क्रीन देखना"), icon: "eye", on: false }, { id: "ctl", t: t("Control the keyboard and mouse", "कीबोर्ड-माउस चलाना"), icon: "mouse", on: false }, { id: "files", t: t("Open files", "फ़ाइलें खोलना"), icon: "folder-open", on: false }],
        meter: { t: t("Access given to an unknown helper", "अनजान मददगार को दी गई पहुँच"), v: 4, tone: "ok", lo: t("none", "कोई नहीं"), hi: t("everything", "सब कुछ") } },
    ],
    sc: [
      { pop: { focus: true, note: t("Tara: what evidence supports this diagnosis — and why does a stranger need control?", "तारा: इस निदान का सबूत क्या है — और अजनबी को कंट्रोल क्यों चाहिए?"), noteTone: "warn" } },
      { pop: { focus: false, mark: { warn: "warn" }, note: t("A warning is a claim, not a verified diagnosis", "चेतावनी एक दावा है, जाँचा हुआ निदान नहीं"), noteTone: "warn" }, access: { note: t("Installing and allowing access changes what the sender can do", "इंस्टॉल करके पहुँच देने से भेजने वाला बहुत कुछ कर सकता है"), noteTone: "info" } },
      { pop: { note: undefined, mark: { btn: "hide" } }, access: { note: t("Practice screen only — nothing installed. Neel tells the teacher; school support checks the device.", "सिर्फ़ अभ्यास स्क्रीन — कुछ इंस्टॉल नहीं। नील टीचर को बताता है; स्कूल सपोर्ट जाँचता है।"), noteTone: "ok" } },
      { pop: { mark: { warn: "warn", btn: "none" } }, access: { note: t("Install the tool to find out if the warning is true?", "क्या चेतावनी सच है यह जानने को टूल इंस्टॉल करें?"), noteTone: "warn" } },
      { pop: { mark: { warn: "gone", btn: "hide" } }, access: { note: t("No access approved; known school support will check", "कोई पहुँच मंज़ूर नहीं; स्कूल सपोर्ट जाँचेगा"), noteTone: "ok" } },
      { access: { focus: true } },
    ],
    out: {
      "option-0": { pop: { mark: { btn: "hide", warn: "done" } }, access: { note: t("Paused; teacher uses known school support", "रुके; टीचर स्कूल सपोर्ट से जाँचवाती हैं"), noteTone: "ok" } },
      "option-1": { pop: { mark: { btn: "press", warn: "risk" } }, access: { on: { see: true, ctl: true, files: true }, meter: { t: t("Access given to an unknown helper", "अनजान मददगार को दी गई पहुँच"), v: 96, tone: "risk", lo: t("none", "कोई नहीं"), hi: t("everything", "सब कुछ") }, note: t("Access granted before the claim was verified", "दावा जाँचे बिना पहुँच दे दी"), noteTone: "risk" } },
      "option-2": { pop: { mark: { warn: "risk" } }, access: { note: t("Forwarding an unverified warning spreads the pressure", "बिना जाँची चेतावनी आगे भेजना दबाव फैलाता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-fraud-copied-reviews", scene: "market", layout: "two",
    label: t("Craft-kit shop mock-up", "क्राफ़्ट-किट शॉप मॉक-अप"),
    art: [
      { k: "screen", id: "shop", at: "a", look: "browser", url: [{ t: "craft-kit-shop.example/art-kit" }], blocks: [
          { id: "p", type: "price", t: t("Premium craft kit", "प्रीमियम क्राफ़्ट किट"), sub: t("12 items inside!", "अंदर 12 चीज़ें!") },
          ...[1, 2, 3, 4, 5, 6].map(n => ({ id: `r${n}`, type: "row" as const, t: t("★★★★★ Best kit ever!", "★★★★★ अब तक की सबसे बढ़िया किट!"), sub: t(`Review panel ${n}`, `रिव्यू पैनल ${n}`), icon: "star" }))] },
      { k: "table", id: "src", at: "b", hide: true, title: t("Who controls each source?", "हर स्रोत कौन चलाता है?"), icon: "search",
        cols: [t("Source", "स्रोत"), t("Says", "कहता है"), t("Controlled by", "नियंत्रण")],
        rows: [{ id: "s1", c: [t("Review panels 1–6", "रिव्यू पैनल 1–6"), t("Great kit", "बढ़िया किट"), t("the shop?", "शॉप?")] }, { id: "s2", c: [t("Product description", "उत्पाद विवरण"), t("12 items", "12 चीज़ें"), t("the shop", "शॉप")] }, { id: "s3", c: [t("Teacher's separate record", "टीचर का अलग रिकॉर्ड"), t("5 items", "5 चीज़ें"), t("the teacher", "टीचर")] }] },
    ],
    sc: [
      { shop: { focus: true, mark: { r1: "warn", r2: "warn", r3: "warn", r4: "warn", r5: "warn", r6: "warn" }, note: t("Neel counts six recommendations. Tara: are they copies?", "नील को छह सिफ़ारिशें दिखीं। तारा: क्या ये प्रतियाँ हैं?"), noteTone: "warn" } },
      { shop: { focus: false, note: undefined }, src: { hide: false, mark: { s1: "warn" }, note: t("Repetition feels stronger but adds no new evidence", "दोहराव मज़बूत लगता है पर नया सबूत नहीं जोड़ता"), noteTone: "info" } },
      { src: { mark: { s1: "warn", s2: "warn", s3: "info" }, cell: { "s2:1": "risk", "s3:1": "ok" }, note: t("The separate record conflicts with the advertised contents — pause the pretend order, ask an adult", "अलग रिकॉर्ड विज्ञापित सामग्री से मेल नहीं खाता — नक़ली ऑर्डर रोकें, बड़े से पूछें"), noteTone: "warn" } },
      { src: { note: t("Six copies — six independent checks?", "छह प्रतियाँ — क्या छह स्वतंत्र जाँचें?"), noteTone: "info" } },
      { src: { mark: { s1: "gone", s2: "warn", s3: "ok" }, note: t("One claim repeated — seek separate evidence", "एक दावा दोहराया गया — अलग सबूत खोजें"), noteTone: "ok" } },
      { src: { focus: true } },
    ],
    out: {
      "option-0": { shop: { mark: { r1: "risk", r2: "risk", r3: "risk", r4: "risk", r5: "risk", r6: "risk" }, note: t("Copies are not new sources", "प्रतियाँ नए स्रोत नहीं होतीं"), noteTone: "risk" } },
      "option-1": { src: { mark: { s1: "gone", s3: "ok" }, note: t("No — seek separate evidence", "नहीं — अलग सबूत खोजें"), noteTone: "ok" } },
      "option-2": { src: { mark: { s1: "risk", s2: "risk" }, note: t("Evidence is conflicting — not enough to accuse anyone", "सबूत आपस में टकराते हैं — किसी पर आरोप लगाने जितने नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-fraud-recurring-price", scene: "market", layout: "two",
    label: t("Digital art pack · the whole payment schedule", "डिजिटल आर्ट पैक · पूरा भुगतान कार्यक्रम"),
    art: [
      { k: "screen", id: "ad", at: "a", look: "phone", blocks: [{ id: "h", type: "price", t: t("Digital art pack", "डिजिटल आर्ट पैक"), sub: t("2 tokens", "2 टोकन") }, { id: "fine", type: "text", t: t("then 4 tokens at the start of each later week while the pretend plan continues", "फिर नक़ली योजना चलने तक हर आगे के हफ़्ते की शुरुआत में 4 टोकन") }] },
      { k: "ledger", id: "sched", at: "b", title: t("Charges on a timeline", "समय-रेखा पर शुल्क"), icon: "calendar", upTo: 1, lines: [{ id: "w1", t: t("Week 1 · introductory", "हफ़्ता 1 · शुरुआती"), amt: "−2", dir: "out" }, { id: "w2", t: t("Week 2", "हफ़्ता 2"), amt: "−4", dir: "out" }, { id: "w3", t: t("Week 3", "हफ़्ता 3"), amt: "−4", dir: "out" }, { id: "w4", t: t("Week 4", "हफ़्ता 4"), amt: "−4", dir: "out" }, { id: "w5", t: t("Week 5", "हफ़्ता 5"), amt: "−4", dir: "out" }, { id: "w6", t: t("Week 6", "हफ़्ता 6"), amt: "−4", dir: "out" }], total: { t: t("So far", "अब तक"), v: "2 tokens" } },
    ],
    sc: [
      { ad: { focus: true, mark: { h: "warn" }, note: t("Neel: \"2 tokens is the total price\"", "नील: \"2 टोकन कुल क़ीमत है\""), noteTone: "warn" } },
      { ad: { focus: false, note: undefined }, sched: { upTo: 4, total: { t: t("Four weeks", "चार हफ़्ते"), v: "14 tokens" }, mark: { w1: "info", w2: "warn", w3: "warn", w4: "warn" }, note: t("One introductory charge + three later charges", "एक शुरुआती शुल्क + तीन बाद के शुल्क"), noteTone: "info" } },
      { sched: { upTo: 6, total: { t: t("Six weeks", "छह हफ़्ते"), v: "22 tokens" }, mark: { w5: "warn", w6: "warn" }, note: t("Duration changed to six weeks — new total. Unclear terms go to an adult.", "अवधि छह हफ़्ते हुई — नया कुल। अस्पष्ट शर्तें बड़े को दिखाएँ।"), noteTone: "info" } },
      { sched: { note: t("What does the two-token headline establish?", "दो-टोकन वाली हेडलाइन क्या साबित करती है?"), noteTone: "info" } },
      { sched: { upTo: 4, total: { t: t("Four weeks", "चार हफ़्ते"), v: "14 tokens" }, mark: { w1: "ok" }, note: t("Two tokens is just the introductory week's charge", "दो टोकन सिर्फ़ शुरुआती हफ़्ते का शुल्क है"), noteTone: "ok" } },
      { sched: { focus: true } },
    ],
    out: {
      "option-0": { sched: { upTo: 4, mark: { w2: "risk", w3: "risk", w4: "risk" }, note: t("Later weeks are not free — they cost 4 each", "आगे के हफ़्ते मुफ़्त नहीं — हर एक के 4 टोकन"), noteTone: "risk" } },
      "option-1": { sched: { upTo: 6, total: { t: t("Six weeks", "छह हफ़्ते"), v: "22 tokens" }, mark: { w2: "risk", w3: "risk", w4: "risk", w5: "risk", w6: "risk" }, note: t("Two tokens doesn't cover any longer duration", "दो टोकन लंबी अवधि को नहीं ढकते"), noteTone: "risk" } },
      "option-2": { sched: { upTo: 4, mark: { w1: "ok" }, note: t("Two tokens is the introductory charge", "दो टोकन शुरुआती शुल्क है"), noteTone: "ok" } },
    },
  },
  {
    slug: "class7-fraud-useful-record", scene: "market", layout: "two",
    label: t("Practice incident record · minimal and safe", "अभ्यास घटना-रिकॉर्ड · छोटा और सुरक्षित"),
    art: [
      { k: "doc", id: "rec", at: "a", look: "form", pic: "clipboard", title: t("Incident record (practice)", "घटना-रिकॉर्ड (अभ्यास)"), sub: t("Tara and the teacher", "तारा और टीचर"),
        toks: [{ id: "time", t: t("When: around lunch break", "कब: लगभग लंच ब्रेक"), icon: "clock" }, { id: "chan", t: t("Where: a chat message", "कहाँ: एक चैट संदेश"), icon: "msg" }, { id: "name", t: t("Displayed name: shown — real identity: unknown", "दिखा नाम: दिखा — असली पहचान: अज्ञात"), icon: "user" }, { id: "ask", t: t("Asked for: an account code", "माँगा गया: अकाउंट कोड"), icon: "key" }, { id: "val", t: t("The actual code digits", "कोड के असली अंक"), icon: "hash" }] , mark: { time: "ok", chan: "ok", ask: "ok", name: "warn" } },
      { k: "time", id: "line", at: "b", hide: true, title: t("What happened, in order", "क्या हुआ, क्रम से"), icon: "history", ev: [{ id: "e1", at: "1", t: t("Message arrives", "संदेश आया"), icon: "msg" }, { id: "e2", at: "2", t: t("Learner enters a code", "विद्यार्थी ने कोड डाला"), icon: "key" }, { id: "e3", at: "3", t: t("Learner tells the teacher", "विद्यार्थी ने टीचर को बताया"), icon: "megaphone" }, { id: "e4", at: "4", t: t("School support process starts", "स्कूल सपोर्ट प्रक्रिया शुरू"), icon: "shield-ok" }], upTo: 3, mark: { e3: "ok" } },
    ],
    sc: [
      { rec: { focus: true, note: t("The teacher thanks the learner for speaking up", "टीचर बताने के लिए विद्यार्थी को धन्यवाद देती है"), noteTone: "ok" }, line: { hide: true } },
      { rec: { mark: { time: "ok", chan: "ok", ask: "ok", name: "warn", val: "hide" }, note: t("Observed facts vs unknowns; a secret's category — never its value", "देखे हुए तथ्य बनाम अज्ञात; रहस्य की श्रेणी — मान कभी नहीं"), noteTone: "info" } },
      { rec: { focus: false, note: undefined }, line: { hide: false, upTo: 4, focus: true, note: t("Calm, prompt help — no accusation, no promise of guaranteed recovery", "शांत, तुरंत मदद — न आरोप, न पक्की रिकवरी का वादा"), noteTone: "ok" } },
      { line: { focus: false, note: undefined }, rec: { note: t("What should a shared record say about the entered code?", "साझा रिकॉर्ड में डाले गए कोड के बारे में क्या लिखें?"), noteTone: "warn" } },
      { rec: { mark: { time: "ok", chan: "ok", ask: "ok", name: "warn", val: "gone" }, note: t("Record that a code was entered — not the value", "लिखें कि कोड डाला गया — मान नहीं"), noteTone: "ok" } },
      { rec: { focus: true } },
    ],
    out: {
      "option-0": { rec: { mark: { val: "risk" }, note: t("A copied code in every worksheet is a leak", "हर वर्कशीट में कॉपी किया कोड एक लीक है"), noteTone: "risk" } },
      "option-1": { rec: { mark: { val: "gone", ask: "ok" }, note: t("Category recorded; the value stays out", "श्रेणी दर्ज; मान बाहर रखा"), noteTone: "ok" } },
      "option-2": { rec: { mark: { time: "gone", chan: "gone", ask: "gone", name: "gone", val: "gone" }, note: t("Hiding the incident leaves the learner without help", "घटना छिपाने से विद्यार्थी को मदद नहीं मिलती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class7-fraud-refund-case", scene: "market", layout: "three",
    label: t("The club trip refund message", "क्लब ट्रिप रिफ़ंड संदेश"),
    art: [
      { k: "chat", id: "msg", at: "a", look: "phone", who: t("'Teacher' (new number)", "'टीचर' (नया नंबर)"),
        msgs: [{ from: "them", t: t("Club trip cancelled! Your refund is ready — claim within 10 minutes.", "क्लब ट्रिप रद्द! आपका रिफ़ंड तैयार है — 10 मिनट में लें।"), flag: "warn" }, { from: "them", t: t("Use code RF-204", "कोड RF-204 इस्तेमाल करें"), flag: "warn" }] },
      { k: "screen", id: "dest", at: "b", look: "phone", hide: true, title: t("Destination card", "गंतव्य कार्ड"), icon: "arrow", blocks: [{ id: "d", type: "price", t: t("This action", "यह कार्रवाई"), sub: t("SEND 15 tokens OUT", "15 टोकन बाहर भेजें") }] },
      { k: "doc", id: "q", at: "c", hide: true, look: "card", pic: "help", title: t("Tara's four questions", "तारा के चार सवाल"),
        toks: [{ id: "who", t: t("Who claims authority? (a teacher's photo)", "अधिकार का दावा कौन करता है? (टीचर की फ़ोटो)"), icon: "user" }, { id: "act", t: t("What action is requested? (send tokens out)", "कौन-सी कार्रवाई माँगी? (टोकन बाहर भेजना)"), icon: "send" }, { id: "pr", t: t("What pressure? (deadline)", "कौन-सा दबाव? (समय-सीमा)"), icon: "timer" }, { id: "chk", t: t("Independent check? (existing school contact)", "स्वतंत्र जाँच? (मौजूदा स्कूल संपर्क)"), icon: "school" }] },
    ],
    sc: [
      { msg: { focus: true } },
      { dest: { hide: false, mark: { d: "risk" }, note: t("Says refund in — the card says tokens out", "कहता है रिफ़ंड आएगा — कार्ड कहता है टोकन जाएँगे"), noteTone: "risk" }, q: { hide: false, mark: { who: "warn", act: "risk", pr: "warn" } }, msg: { focus: false } },
      { q: { mark: { who: "warn", act: "risk", pr: "warn", chk: "ok" }, note: t("Neel pauses and asks an adult to use the existing school contact", "नील रुकता है और बड़े से मौजूदा स्कूल संपर्क इस्तेमाल करने को कहता है"), noteTone: "ok" } },
      { q: { note: t("Which response handles the whole case?", "पूरे मामले को कौन-सी प्रतिक्रिया सँभालती है?"), noteTone: "info" } },
      { dest: { mark: { d: "gone" } }, q: { mark: { who: "ok", act: "ok", pr: "ok", chk: "ok" }, note: t("Pause, keep minimal facts, check through the established school contact", "रुकें, ज़रूरी तथ्य रखें, स्थापित स्कूल संपर्क से जाँचें"), noteTone: "ok" } },
      { q: { focus: true } },
    ],
    out: {
      "option-0": { q: { mark: { who: "risk", act: "risk" }, note: t("A familiar photo doesn't fix the outgoing-action mismatch", "जानी-पहचानी फ़ोटो बाहर जाने वाली कार्रवाई का अमेल नहीं मिटाती"), noteTone: "risk" }, dest: { mark: { d: "press" } } },
      "option-1": { q: { mark: { pr: "risk", act: "risk" }, note: t("Racing a deadline is exactly the pressure the message wants", "समय-सीमा से होड़ ही वह दबाव है जो संदेश चाहता है"), noteTone: "risk" }, dest: { mark: { d: "press" } } },
      "option-2": { dest: { mark: { d: "gone" } }, q: { mark: { who: "ok", act: "ok", pr: "ok", chk: "ok" }, note: t("Pause and use established school support", "रुकें और स्थापित स्कूल सहायता लें"), noteTone: "ok" } },
    },
  },
];
