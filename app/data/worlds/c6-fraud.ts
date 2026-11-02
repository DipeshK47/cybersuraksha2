import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class6FraudWorlds: World[] = [
  {
    slug: "class6-fraud-free-reward", scene: "market", layout: "two",
    label: t("A 'free outfit' game message", "'मुफ़्त पोशाक' वाला गेम संदेश"),
    art: [
      { k: "screen", id: "msg", at: "a", look: "phone", blocks: [{ id: "big", type: "banner", t: t("RARE OUTFIT — FREE!", "दुर्लभ पोशाक — मुफ़्त!"), sub: t("Kabir, you won", "कबीर, आप जीत गए"), icon: "gift" }, { id: "fine", type: "text", t: t("To claim, enter your account password below.", "पाने के लिए नीचे अपना अकाउंट पासवर्ड डालें।") }, { id: "pw", type: "field", t: t("Account password", "अकाउंट पासवर्ड"), sub: t("••••••••", "••••••••") }] },
      { k: "doc", id: "parts", at: "b", look: "card", pic: "search", title: t("Two different parts of the offer", "ऑफ़र के दो अलग हिस्से"), toks: [{ id: "claim", t: t("Reward claim: a free outfit", "इनाम का दावा: मुफ़्त पोशाक"), icon: "gift" }, { id: "act", t: t("Requested action: give your password", "माँगी गई कार्रवाई: पासवर्ड दें"), icon: "key" }, { id: "free", t: t("\"Free\" doesn't mean no cost or risk", "\"मुफ़्त\" का मतलब बिना ख़र्च या जोखिम नहीं"), icon: "alert" }], mark: { claim: "hl" } },
    ],
    sc: [
      { msg: { focus: true, note: t("Meera reads the requested action aloud before the excitement takes over", "मीरा उत्साह से पहले माँगी गई कार्रवाई ज़ोर से पढ़ती है"), noteTone: "info" }, parts: { hide: true } },
      { parts: { hide: false, mark: { claim: "hl", act: "risk", free: "warn" }, note: t("A password can hand over account control even when no money moves", "पासवर्ड से अकाउंट का नियंत्रण जा सकता है, भले पैसा न जाए"), noteTone: "risk" }, msg: { mark: { pw: "risk" }, focus: false } },
      { parts: { note: t("Practise with pretend messages: no links, no fees, no real secrets", "नक़ली संदेशों से अभ्यास: न लिंक, न फ़ीस, न असली रहस्य"), noteTone: "info" } },
      { parts: { note: t("What should Kabir do with the reward message?", "कबीर इनाम संदेश का क्या करे?"), noteTone: "info" } },
      { msg: { mark: { pw: "hide", fine: "hide" } }, parts: { mark: { claim: "hl", act: "gone", free: "ok" }, note: t("Password kept private; paused and asked a trusted adult", "पासवर्ड निजी रखा; रुके और भरोसेमंद बड़े से पूछा"), noteTone: "ok" } },
      { parts: { focus: true } },
    ],
    out: {
      "option-0": { msg: { mark: { pw: "risk" } }, parts: { mark: { act: "risk" }, note: t("Sending the password 'to test' hands over the account", "'परखने' के लिए पासवर्ड भेजना अकाउंट सौंप देना है"), noteTone: "risk" } },
      "option-1": { msg: { mark: { pw: "hide", fine: "hide" } }, parts: { mark: { act: "gone" }, note: t("Pause and ask a trusted adult", "रुकें और भरोसेमंद बड़े से पूछें"), noteTone: "ok" } },
      "option-2": { msg: { mark: { pw: "risk" } }, parts: { mark: { act: "risk" }, note: t("A friend's password isn't yours to give", "दोस्त का पासवर्ड आपका देने का नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-fraud-hurry-secret", scene: "market", layout: "two",
    label: t("'Club will be deleted' notice", "'क्लब हटा दिया जाएगा' सूचना"),
    art: [
      { k: "chat", id: "note", at: "a", look: "phone", who: t("Club notice (pretend)", "क्लब सूचना (नक़ली)"), msgs: [{ from: "them", t: t("Your club will be DELETED in 5 minutes unless you send your code.", "आपका क्लब 5 मिनट में हटा दिया जाएगा जब तक आप अपना कोड न भेजें।"), flag: "risk" }, { from: "them", t: t("Do not tell the teacher.", "टीचर को मत बताना।"), flag: "risk" }] },
      { k: "time", id: "clock", at: "b", title: t("The countdown", "उल्टी गिनती"), icon: "timer", ev: [{ id: "t5", at: "5:00", t: t("Notice arrives", "सूचना आई"), icon: "bell" }, { id: "t3", at: "3:00", t: t("Pressure builds", "दबाव बढ़ता है"), icon: "flame" }, { id: "t0", at: "0:00", t: t("'Deleted' — claims the notice", "'हटा दिया' — सूचना का दावा"), icon: "skull" }], upTo: 1 },
    ],
    sc: [
      { note: { focus: true, note: t("Kabir: it takes away both thinking time and access to help", "कबीर: यह सोचने का समय और मदद तक पहुँच दोनों छीन लेता है"), noteTone: "warn" } },
      { clock: { upTo: 3, mark: { t3: "warn", t0: "risk" }, note: t("Urgency makes a demand feel important — a threat is a claim to check, not proof", "जल्दबाज़ी माँग को ज़रूरी बनाती है — धमकी जाँचने लायक़ दावा है, सबूत नहीं"), noteTone: "risk" }, note: { focus: false } },
      { clock: { note: t("Stop before the countdown decides — ask the teacher through the existing school channel", "उल्टी गिनती के फ़ैसला करने से पहले रुकें — मौजूदा स्कूल माध्यम से टीचर से पूछें"), noteTone: "ok" } },
      { clock: { note: t("Does the countdown prove the notice is genuine?", "क्या उल्टी गिनती सूचना के असली होने का सबूत है?"), noteTone: "info" } },
      { clock: { mark: { t3: "ok", t0: "gone" }, note: t("No — verify through the known school channel", "नहीं — जाने-पहचाने स्कूल माध्यम से जाँचें"), noteTone: "ok" }, note: { mark: {} } },
      { note: { focus: true } },
    ],
    out: {
      "option-0": { clock: { upTo: 3, mark: { t0: "risk" }, note: t("Obeying the timer means obeying the pressure", "टाइमर मानना मतलब दबाव मानना"), noteTone: "risk" }, note: { upTo: 2 } },
      "option-1": { clock: { mark: { t0: "gone", t3: "ok" }, note: t("Verify through the known school channel", "जाने-पहचाने स्कूल माध्यम से जाँचें"), noteTone: "ok" } },
      "option-2": { clock: { mark: { t3: "risk" }, note: t("Secrecy keeps the helpers away — it doesn't protect the club", "गोपनीयता मददगारों को दूर रखती है — क्लब को नहीं बचाती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-fraud-code-keeper", scene: "market", layout: "two",
    label: t("Two messages, one code", "दो संदेश, एक कोड"),
    art: [
      { k: "chat", id: "codes", at: "a", look: "phone", who: t("Messages", "संदेश"), msgs: [{ from: "them", sender: t("Game", "गेम")[0], t: t("Use code [LABEL-A] to sign in.", "साइन-इन के लिए कोड [LABEL-A] इस्तेमाल करें।"), flag: "info" }, { from: "them", sender: t("Another sender", "दूसरा भेजने वाला")[0], t: t("That's a prize ticket! Forward it to me to claim.", "वह इनाम का टिकट है! पाने के लिए मुझे फ़ॉरवर्ड करो।"), flag: "risk" }], upTo: 1 },
      { k: "table", id: "kinds", at: "b", title: t("What is each code for?", "हर कोड किसलिए है?"), icon: "hash", cols: [t("Code", "कोड"), t("Original purpose", "असली उद्देश्य"), t("Shareable?", "बाँटने लायक़?")], rows: [{ id: "event", c: [t("Club event code", "क्लब इवेंट कोड"), t("names a public event", "सार्वजनिक कार्यक्रम का नाम"), "✓"] }, { id: "login", c: ["[LABEL-A]", t("approves a sign-in", "साइन-इन मंज़ूर करता है"), "✗"] }, { id: "pay", c: [t("Approval code", "मंज़ूरी कोड"), t("approves an action", "एक कार्रवाई मंज़ूर करता है"), "✗"] }], upTo: 1 },
    ],
    sc: [
      { codes: { focus: true, note: t("Meera reads the original purpose, not the label the asker supplies", "मीरा असली उद्देश्य पढ़ती है, माँगने वाले का दिया लेबल नहीं"), noteTone: "info" } },
      { codes: { upTo: 2 }, kinds: { upTo: 3, mark: { event: "ok", login: "risk", pay: "risk" }, note: t("Some codes name public events; others approve access — those are secrets", "कुछ कोड सार्वजनिक आयोजन बताते हैं; कुछ पहुँच मंज़ूर करते हैं — वे रहस्य हैं"), noteTone: "warn" } },
      { kinds: { note: t("Labels, not real numbers — and if one was already shared, get help promptly", "असली नंबर नहीं, सिर्फ़ लेबल — और अगर पहले दे दिया हो तो तुरंत मदद लें"), noteTone: "info" } },
      { codes: { upTo: 2 }, kinds: { note: t("Should Kabir forward the sign-in code?", "क्या कबीर साइन-इन कोड फ़ॉरवर्ड करे?"), noteTone: "info" } },
      { codes: { upTo: 3, msgs: [{ from: "them", sender: t("Game", "गेम")[0], t: t("Use code [LABEL-A] to sign in.", "साइन-इन के लिए कोड [LABEL-A] इस्तेमाल करें।"), flag: "info" }, { from: "them", sender: t("Another sender", "दूसरा भेजने वाला")[0], t: t("That's a prize ticket! Forward it to me to claim.", "वह इनाम का टिकट है! पाने के लिए मुझे फ़ॉरवर्ड करो।"), flag: "risk" }, { from: "sys", t: t("Kept private · a trusted adult asked", "निजी रखा · भरोसेमंद बड़े से पूछा") }] }, kinds: { mark: { login: "ok", event: "ok", pay: "ok" }, note: t("The authorisation purpose matters more than the sender's label", "मंज़ूरी का उद्देश्य भेजने वाले के लेबल से ज़्यादा मायने रखता है"), noteTone: "ok" } },
      { kinds: { focus: true } },
    ],
    out: {
      "option-0": { kinds: { mark: { login: "risk" }, note: t("Expiring doesn't make it safe to share — it can still be used now", "ख़त्म होने वाला होना सुरक्षित नहीं बनाता — अभी भी इस्तेमाल हो सकता है"), noteTone: "risk" } },
      "option-1": { kinds: { mark: { login: "ok", event: "ok", pay: "ok" }, note: t("Keep it private and get help", "निजी रखें और मदद लें"), noteTone: "ok" } },
      "option-2": { kinds: { mark: { login: "risk" }, note: t("Posting a code publishes the key", "कोड पोस्ट करना चाबी सार्वजनिक करना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-fraud-familiar-name", scene: "market", layout: "two",
    label: t("A cousin's photo, a new number", "कज़िन की फ़ोटो, एक नया नंबर"),
    art: [
      { k: "chat", id: "msg", at: "a", look: "phone", who: t("'Cousin' (new account)", "'कज़िन' (नया अकाउंट)"), msgs: [{ from: "them", t: t("It's me! My old phone broke. Buy me a gift voucher, please?", "मैं ही हूँ! मेरा पुराना फ़ोन टूट गया। मेरे लिए गिफ़्ट वाउचर ख़रीद दो?"), flag: "warn" }, { from: "them", t: t("Save my new number to check it's me.", "मेरा नया नंबर सेव करो ताकि जाँच लो कि मैं ही हूँ।"), flag: "risk" }] },
      { k: "flow", id: "routes", at: "b", look: "graph", title: t("Who controls the check?", "जाँच किसके हाथ में है?"), icon: "route", nodes: [{ id: "claim", t: t("The claim", "दावा"), icon: "help", x: 50, y: 14 }, { id: "new", t: t("New number in the message", "संदेश वाला नया नंबर"), icon: "phone", x: 18, y: 55 }, { id: "same", t: t("Same unverified sender", "वही बिना जाँचा भेजने वाला"), icon: "user-x", x: 18, y: 88 }, { id: "saved", t: t("Family's saved number", "परिवार का सेव किया नंबर"), icon: "contact", x: 80, y: 55 }, { id: "adult", t: t("Caregiver calls", "अभिभावक फ़ोन करते हैं"), icon: "user-ok", x: 80, y: 88 }],
        links: [{ from: "claim", to: "new" }, { from: "new", to: "same" }, { from: "claim", to: "saved" }, { from: "saved", to: "adult" }], link: { "claim>saved": "off", "saved>adult": "off" }, state: { claim: "now" } },
    ],
    sc: [
      { msg: { focus: true, note: t("Kabir: is the checking route controlled by the same unverified sender?", "कबीर: क्या जाँच का रास्ता उसी बिना जाँचे भेजने वाले के हाथ में है?"), noteTone: "warn" } },
      { routes: { link: { "claim>new": "on", "new>same": "on", "claim>saved": "off", "saved>adult": "off" }, state: { claim: "now", new: "risk", same: "risk" }, note: t("A name or photo can be copied or learned — recognition isn't independent confirmation", "नाम या फ़ोटो कॉपी या जानी जा सकती है — पहचानना स्वतंत्र पुष्टि नहीं"), noteTone: "risk" }, msg: { focus: false } },
      { routes: { link: { "claim>new": "off", "new>same": "off", "claim>saved": "on", "saved>adult": "on" }, state: { claim: "now", new: "muted", same: "muted", saved: "ok", adult: "ok" }, cur: "adult", note: t("Meera asks a caregiver to use the saved number — and sends nothing while waiting", "मीरा अभिभावक से सेव नंबर इस्तेमाल करवाती है — और इंतज़ार में कुछ नहीं भेजती"), noteTone: "ok" } },
      { routes: { cur: "claim", link: { "claim>new": "on", "new>same": "on", "claim>saved": "on", "saved>adult": "on" }, state: { claim: "now" }, note: t("Which contact route is independent?", "कौन-सा संपर्क रास्ता स्वतंत्र है?"), noteTone: "info" } },
      { routes: { link: { "claim>new": "off", "new>same": "off", "claim>saved": "on", "saved>adult": "on" }, state: { claim: "now", new: "muted", same: "muted", saved: "ok", adult: "ok" }, cur: "adult", note: t("The already-saved contact, with an adult", "पहले से सेव संपर्क, बड़े के साथ"), noteTone: "ok" } },
      { routes: { focus: true } },
    ],
    out: {
      "option-0": { routes: { link: { "claim>new": "on", "new>same": "on", "claim>saved": "off", "saved>adult": "off" }, state: { new: "risk", same: "risk", saved: "muted", adult: "muted" }, note: t("A new number inside the request isn't an independent check", "अनुरोध के भीतर का नया नंबर स्वतंत्र जाँच नहीं"), noteTone: "risk" } },
      "option-1": { routes: { link: { "claim>new": "off", "new>same": "off", "claim>saved": "on", "saved>adult": "on" }, state: { new: "muted", same: "muted", saved: "ok", adult: "ok" }, cur: "adult", note: t("An independent route", "स्वतंत्र रास्ता"), noteTone: "ok" } },
      "option-2": { routes: { link: { "claim>new": "off", "new>same": "on", "claim>saved": "off", "saved>adult": "off" }, state: { same: "risk" }, note: t("Asking the account to confirm itself proves nothing", "अकाउंट से ख़ुद की पुष्टि माँगना कुछ साबित नहीं करता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-fraud-shop-evidence", scene: "market", layout: "two",
    label: t("A pretend shop · surprising discount on a club kit", "एक नक़ली शॉप · क्लब किट पर चौंकाने वाली छूट"),
    art: [
      { k: "screen", id: "shop", at: "a", look: "browser", url: [{ t: "club-kit-bargains.example" }], blocks: [{ id: "p", type: "price", t: t("Club kit", "क्लब किट"), sub: t("90% OFF!", "90% छूट!") }, { id: "pic", type: "banner", t: t("Neat photographs", "साफ़-सुथरी तस्वीरें"), icon: "image" }, { id: "fol", type: "banner", t: t("12,400 followers", "12,400 फ़ॉलोअर"), icon: "users" }] },
      { k: "table", id: "cards", at: "b", hide: true, title: t("Source cards", "स्रोत कार्ड"), icon: "clipboard", cols: [t("Card", "कार्ड"), t("From", "कहाँ से"), t("Says", "कहता है")], rows: [{ id: "own", c: [t("Shop's own page", "शॉप का अपना पेज"), t("the seller", "विक्रेता"), t("Arrives in 2 days", "2 दिन में पहुँचेगा")] }, { id: "ind", c: [t("Independent card", "स्वतंत्र कार्ड"), t("outside the seller", "विक्रेता से बाहर"), t("Contents differ from the advert", "सामग्री विज्ञापन से अलग")] }, { id: "del", c: [t("Delivery card", "डिलीवरी कार्ड"), t("outside the seller", "विक्रेता से बाहर"), t("No information", "कोई जानकारी नहीं")] }] },
    ],
    sc: [
      { shop: { focus: true, note: t("Meera: what comes from outside the seller's own page — and has an adult reviewed it?", "मीरा: विक्रेता के अपने पेज से बाहर की जानकारी क्या है — और क्या किसी बड़े ने देखा?"), noteTone: "info" } },
      { shop: { mark: { pic: "warn", fol: "warn" }, note: t("Pictures can be copied; popularity isn't a promise; a seller's statement is still a claim", "तस्वीरें कॉपी हो सकती हैं; लोकप्रियता वादा नहीं; विक्रेता का बयान भी एक दावा है"), noteTone: "warn" }, cards: { hide: false } },
      { cards: { mark: { own: "warn", ind: "risk", del: "info" }, note: t("One card contradicts the advert; another is silent on delivery. Record the conflict and the unknowns.", "एक कार्ड विज्ञापन से टकराता है; दूसरा डिलीवरी पर चुप। टकराव और अनजान बातें दर्ज करें।"), noteTone: "warn" }, shop: { focus: false, note: undefined } },
      { cards: { note: t("Do the photos and followers prove the kit will arrive as promised?", "क्या तस्वीरें और फ़ॉलोअर साबित करते हैं कि किट वादे के मुताबिक़ पहुँचेगी?"), noteTone: "info" } },
      { cards: { mark: { own: "warn", ind: "ok", del: "info" }, note: t("No — record the conflict and ask a responsible adult before any purchase", "नहीं — टकराव दर्ज करें और ख़रीद से पहले ज़िम्मेदार बड़े से पूछें"), noteTone: "ok" } },
      { cards: { focus: true } },
    ],
    out: {
      "option-0": { shop: { mark: { p: "risk" }, note: t("A polished page doesn't answer the unanswered questions", "चमकदार पेज अनुत्तरित सवालों का जवाब नहीं देता"), noteTone: "risk" } },
      "option-1": { cards: { mark: { own: "warn", ind: "ok", del: "info" }, note: t("Pause and ask an adult to review the conflict", "रुकें और बड़े से टकराव की समीक्षा करवाएँ"), noteTone: "ok" } },
      "option-2": { shop: { mark: { p: "risk" }, note: t("A small payment to 'test honesty' is still following the demand", "'ईमानदारी परखने' का छोटा भुगतान भी माँग मानना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-fraud-pop-up-help", scene: "market", layout: "two",
    label: t("A red warning on a club article page", "क्लब लेख पेज पर लाल चेतावनी"),
    art: [
      { k: "screen", id: "page", at: "a", look: "browser", url: [{ t: "club-article.example/leaves" }], blocks: [{ id: "art", type: "text", t: t("Leaves of the school garden — an article Meera is reading.", "स्कूल बाग़ के पत्ते — मीरा का पढ़ा जा रहा लेख।") }, { id: "pop", type: "popup", t: t("HUNDREDS OF PROBLEMS FOUND!", "सैकड़ों समस्याएँ मिलीं!"), sub: t("Press REPAIR now. Or call 0000-FAKE for remote help.", "अभी REPAIR दबाएँ। या रिमोट मदद के लिए 0000-FAKE पर फ़ोन करें।"), icon: "siren" }, { id: "fix", type: "btn", t: t("REPAIR", "REPAIR"), icon: "wrench" }] },
      { k: "doc", id: "who", at: "b", look: "card", pic: "shield", title: t("Who said this?", "यह किसने कहा?"), sub: t("The warning is part of the webpage", "चेतावनी वेबपेज का हिस्सा है"), toks: [{ id: "page", t: t("A webpage claim", "एक वेबपेज का दावा"), icon: "globe" }, { id: "app", t: t("A diagnosis from the school's app", "स्कूल के ऐप का निदान"), icon: "school" }, { id: "dem", t: t("Demands: download, call, give control", "माँगें: डाउनलोड, फ़ोन, नियंत्रण"), icon: "alert" }] },
    ],
    sc: [
      { page: { focus: true, note: t("Kabir notices the warning belongs to the page — not to the school's app", "कबीर देखता है कि चेतावनी पेज की है — स्कूल के ऐप की नहीं"), noteTone: "info" } },
      { who: { mark: { page: "warn", app: "none", dem: "risk" }, note: t("Alarm can push you to download, call or allow remote control — more access for someone else", "घबराहट आपको डाउनलोड, फ़ोन या रिमोट कंट्रोल की ओर धकेल सकती है — किसी और को ज़्यादा पहुँच"), noteTone: "risk" }, page: { focus: false } },
      { who: { mark: { page: "warn", app: "ok", dem: "risk" }, note: t("Step away without pressing anything; ask for help through known school support", "कुछ दबाए बिना पीछे हटें; स्कूल की जानी-पहचानी सहायता से मदद माँगें"), noteTone: "ok" } },
      { who: { note: t("Should Meera press the advertised repair button?", "क्या मीरा विज्ञापित मरम्मत बटन दबाए?"), noteTone: "info" } },
      { page: { mark: { pop: "hide", fix: "hide" } }, who: { mark: { page: "gone", app: "ok", dem: "gone" }, note: t("Paused and asked the teacher through known support", "रुके और जानी-पहचानी सहायता से टीचर से पूछा"), noteTone: "ok" } },
      { who: { focus: true } },
    ],
    out: {
      "option-0": { page: { mark: { fix: "press", pop: "risk" } }, who: { mark: { dem: "risk" }, note: t("A red colour doesn't make a claim true", "लाल रंग से दावा सच नहीं हो जाता"), noteTone: "risk" } },
      "option-1": { page: { mark: { fix: "press", pop: "risk" } }, who: { mark: { dem: "risk" }, note: t("Remote control gives a stranger your device", "रिमोट कंट्रोल अजनबी को आपका डिवाइस दे देता है"), noteTone: "risk" } },
      "option-2": { page: { mark: { pop: "hide", fix: "hide" } }, who: { mark: { dem: "gone", app: "ok" }, note: t("Pause and ask the teacher", "रुकें और टीचर से पूछें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class6-fraud-help-without-blame", scene: "classroom", layout: "two",
    label: t("After a shared code · what Meera says first", "कोड साझा होने के बाद · मीरा पहले क्या कहती है"),
    art: [
      { k: "chat", id: "talk", at: "a", look: "group", who: t("Kabir & Meera", "कबीर और मीरा"), msgs: [{ from: "them", sender: "Kabir", t: t("I shared a pretend login code during practice… I think people will laugh.", "मैंने अभ्यास में एक नक़ली लॉगिन कोड साझा किया… लोग हँसेंगे।"), flag: "warn" }], upTo: 1 },
      { k: "doc", id: "note", at: "b", look: "form", pic: "clipboard", title: t("Incident note", "घटना नोट"), sub: t("What to record — without the secret itself", "क्या दर्ज करें — रहस्य के बिना"), toks: [{ id: "time", t: t("Time", "समय"), icon: "clock" }, { id: "type", t: t("Type of request", "माँग का प्रकार"), icon: "msg" }, { id: "cat", t: t("Category shared: a login code", "साझा श्रेणी: लॉगिन कोड"), icon: "key" }, { id: "val", t: t("The code's actual value", "कोड का असली मान"), icon: "hash" }] },
    ],
    sc: [
      { talk: { focus: true, note: t("He worries that admitting it will invite laughter", "उसे डर है कि बताने पर लोग हँसेंगे"), noteTone: "warn" } },
      { note: { mark: { time: "ok", type: "ok", cat: "ok", val: "hide" }, note: t("Limit further exposure first. Blame makes people hide things — which delays help.", "पहले और खुलना रोकें। दोष लगाने से लोग छिपाते हैं — जिससे मदद में देर होती है।"), noteTone: "info" }, talk: { focus: false, note: undefined } },
      { note: { mark: { time: "ok", type: "ok", cat: "ok", val: "hide" }, note: t("Use official account settings; never pay someone promising guaranteed recovery", "आधिकारिक अकाउंट सेटिंग इस्तेमाल करें; पक्की रिकवरी का वादा करने वाले को कभी भुगतान न दें"), noteTone: "ok" } },
      { talk: { note: t("What should Meera say first?", "मीरा पहले क्या कहे?"), noteTone: "info" }, note: { note: undefined } },
      { talk: { upTo: 2, msgs: [{ from: "them", sender: "Kabir", t: t("I shared a pretend login code during practice… I think people will laugh.", "मैंने अभ्यास में एक नक़ली लॉगिन कोड साझा किया… लोग हँसेंगे।"), flag: "warn" }, { from: "me", sender: "Meera", t: t("Thank you for telling me. Let's get trusted help now.", "बताने के लिए धन्यवाद। चलो अभी भरोसेमंद मदद लें।"), flag: "ok" }] }, note: { mark: { time: "ok", type: "ok", cat: "ok", val: "hide" } } },
      { talk: { focus: true } },
    ],
    out: {
      "option-0": { talk: { upTo: 2, msgs: [{ from: "them", sender: "Kabir", t: t("I shared a pretend login code during practice… I think people will laugh.", "मैंने अभ्यास में एक नक़ली लॉगिन कोड साझा किया… लोग हँसेंगे।"), flag: "warn" }, { from: "me", sender: "Meera", t: t("Hide it from the adults.", "बड़ों से छिपा लो।"), flag: "risk" }] }, note: { note: t("Hiding delays the help", "छिपाने से मदद देर से मिलती है"), noteTone: "risk" } },
      "option-1": { talk: { upTo: 2, msgs: [{ from: "them", sender: "Kabir", t: t("I shared a pretend login code during practice… I think people will laugh.", "मैंने अभ्यास में एक नक़ली लॉगिन कोड साझा किया… लोग हँसेंगे।"), flag: "warn" }, { from: "me", sender: "Meera", t: t("Thank you for telling me. Let's get trusted help now.", "बताने के लिए धन्यवाद। चलो अभी भरोसेमंद मदद लें।"), flag: "ok" }] }, note: { note: t("Calm thanks encourage reporting", "शांत धन्यवाद बताने को बढ़ावा देता है"), noteTone: "ok" } },
      "option-2": { talk: { upTo: 2, msgs: [{ from: "them", sender: "Kabir", t: t("I shared a pretend login code during practice… I think people will laugh.", "मैंने अभ्यास में एक नक़ली लॉगिन कोड साझा किया… लोग हँसेंगे।"), flag: "warn" }, { from: "me", sender: "Meera", t: t("Send another code to undo it.", "इसे पलटने के लिए एक और कोड भेजो।"), flag: "risk" }] }, note: { mark: { val: "risk" }, note: t("Another code only exposes more", "एक और कोड सिर्फ़ और खोलता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-fraud-club-case", scene: "market", layout: "two",
    label: t("The teacher's picture, a prize, a two-minute deadline", "टीचर की तस्वीर, एक इनाम, दो मिनट की समय-सीमा"),
    art: [
      { k: "chat", id: "msg", at: "a", look: "phone", who: t("'Teacher' (new number)", "'टीचर' (नया नंबर)"), msgs: [{ from: "them", t: t("You won a prize! Send the sign-in code in 2 minutes.", "आपने इनाम जीता! 2 मिनट में साइन-इन कोड भेजें।"), flag: "risk" }, { from: "them", t: t("Questions? Call my new number.", "सवाल? मेरे नए नंबर पर फ़ोन करें।"), flag: "warn" }] },
      { k: "table", id: "clues", at: "b", title: t("Clue → response", "संकेत → प्रतिक्रिया"), icon: "puzzle", cols: [t("Clue", "संकेत"), t("What it is", "यह क्या है"), t("Response", "प्रतिक्रिया")], rows: [{ id: "pic", c: [t("Teacher's picture", "टीचर की तस्वीर"), t("identity claim", "पहचान का दावा"), "?"] }, { id: "prize", c: [t("A prize", "इनाम"), t("reward claim", "इनाम का दावा"), "?"] }, { id: "dl", c: [t("2 minutes", "2 मिनट"), t("pressure", "दबाव"), "?"] }, { id: "code", c: [t("Sign-in code", "साइन-इन कोड"), t("requested action", "माँगी गई कार्रवाई"), "?"] }, { id: "num", c: [t("New number", "नया नंबर"), t("check by the same sender", "उसी भेजने वाले की जाँच"), "?"] }], upTo: 1 },
    ],
    sc: [
      { msg: { focus: true, note: t("Meera and Kabir recognise earlier clues instead of trusting the picture", "मीरा और कबीर तस्वीर पर भरोसा करने की जगह पुराने संकेत पहचानते हैं"), noteTone: "info" } },
      { clues: { upTo: 5, mark: { pic: "warn", prize: "warn", dl: "warn", code: "risk", num: "risk" }, note: t("None of these details independently confirms the teacher sent it", "इनमें से कोई ब्योरा स्वतंत्र रूप से पुष्टि नहीं करता कि टीचर ने भेजा"), noteTone: "warn" }, msg: { focus: false, note: undefined } },
      { clues: { txt: { "pic:2": t("ask via school channel", "स्कूल माध्यम से पूछें"), "prize:2": t("ignore the lure", "लालच को अनदेखा करें"), "dl:2": t("pause", "रुकें"), "code:2": t("don't share", "साझा न करें"), "num:2": t("don't call it", "उस पर फ़ोन न करें") }, mark: { pic: "ok", prize: "ok", dl: "ok", code: "ok", num: "ok" }, note: t("Pause, ask through the existing school channel, keep a short fictional note", "रुकें, मौजूदा स्कूल माध्यम से पूछें, छोटा काल्पनिक नोट रखें"), noteTone: "ok" } },
      { clues: { txt: {}, mark: { pic: "warn", prize: "warn", dl: "warn", code: "risk", num: "risk" }, note: t("Which response uses the full evidence?", "कौन-सी प्रतिक्रिया पूरे सबूत को काम में लेती है?"), noteTone: "info" } },
      { clues: { txt: { "pic:2": t("ask via school channel", "स्कूल माध्यम से पूछें"), "prize:2": t("ignore the lure", "लालच को अनदेखा करें"), "dl:2": t("pause", "रुकें"), "code:2": t("don't share", "साझा न करें"), "num:2": t("don't call it", "उस पर फ़ोन न करें") }, mark: { pic: "ok", prize: "ok", dl: "ok", code: "ok", num: "ok" }, note: t("Existing teacher channel — no code shared", "मौजूदा टीचर माध्यम — कोई कोड साझा नहीं"), noteTone: "ok" } },
      { clues: { focus: true } },
    ],
    out: {
      "option-0": { clues: { mark: { pic: "risk", code: "risk" }, note: t("The picture can be copied — it matches because it was copied", "तस्वीर कॉपी हो सकती है — वह मेल खाती है क्योंकि कॉपी हुई है"), noteTone: "risk" } },
      "option-1": { clues: { mark: { num: "risk" }, note: t("Only calling the supplied number lets the same sender check itself", "सिर्फ़ दिए नंबर पर फ़ोन करने से वही भेजने वाला ख़ुद को जाँचता है"), noteTone: "risk" } },
      "option-2": { clues: { txt: { "pic:2": t("ask via school channel", "स्कूल माध्यम से पूछें"), "prize:2": t("ignore the lure", "लालच को अनदेखा करें"), "dl:2": t("pause", "रुकें"), "code:2": t("don't share", "साझा न करें"), "num:2": t("don't call it", "उस पर फ़ोन न करें") }, mark: { pic: "ok", prize: "ok", dl: "ok", code: "ok", num: "ok" }, note: t("Pause and use the existing teacher channel", "रुकें और मौजूदा टीचर माध्यम इस्तेमाल करें"), noteTone: "ok" } },
    },
  },
];
