import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class6SecurityWorlds: World[] = [
  {
    slug: "class6-private-information", scene: "classroom", layout: "two",
    label: t("Discovery club poster · who will see it?", "डिस्कवरी क्लब पोस्टर · इसे कौन देखेगा?"),
    art: [
      { k: "doc", id: "poster", at: "a", look: "poster", pic: "image", title: t("Discovery Club Show", "डिस्कवरी क्लब शो"), sub: t("Meera & Kabir's poster draft", "मीरा और कबीर का पोस्टर ड्राफ़्ट"),
        toks: [{ id: "art", t: t("Club drawing", "क्लब का चित्र"), icon: "image" }, { id: "title", t: t("Club title", "क्लब का नाम"), icon: "star" }, { id: "addr", t: t("Home address", "घर का पता"), icon: "home" }, { id: "bus", t: t("Daily bus time 7:40", "रोज़ का बस समय 7:40"), icon: "bus" }, { id: "badge", t: t("School badge in the background", "पीछे स्कूल का बैज"), icon: "school" }] },
      { k: "crowd", id: "aud", at: "b", title: t("Who can see a public post?", "पब्लिक पोस्ट कौन देख सकता है?"), icon: "eye", rings: [{ id: "class", t: t("Our class", "हमारी क्लास"), n: 30, icon: "school" }, { id: "school", t: t("The whole school", "पूरा स्कूल"), n: 600, icon: "building" }, { id: "web", t: t("Anyone online", "ऑनलाइन कोई भी"), n: 1000, icon: "globe" }], on: ["class"], tone: "ok" },
    ],
    sc: [
      { poster: { focus: true, mark: { addr: "warn" }, note: t("The drawing is ready — but the draft has a home address", "चित्र तैयार है — पर ड्राफ़्ट में घर का पता है"), noteTone: "warn" } },
      { poster: { focus: false, mark: { addr: "risk", bus: "risk", badge: "warn" }, note: t("A nickname doesn't hide a badge, a place or a travel time", "उपनाम बैज, जगह या यात्रा-समय नहीं छिपाता"), noteTone: "risk" }, aud: { on: ["class", "school", "web"], tone: "risk", note: t("Anyone online can see all the clues together", "ऑनलाइन कोई भी सारे संकेत साथ देख सकता है"), noteTone: "risk" } },
      { poster: { mark: { addr: "hide", bus: "hide", badge: "hl", art: "ok", title: "ok" }, note: t("Separate the event title from contact details; inspect the whole picture", "कार्यक्रम का नाम संपर्क-जानकारी से अलग करें; पूरी तस्वीर जाँचें"), noteTone: "info" }, aud: { on: ["class"], tone: "ok", note: undefined } },
      { poster: { mark: { addr: "risk", bus: "risk", badge: "warn", art: "none", title: "none" }, note: t("Which version can go on the public club page?", "पब्लिक क्लब पेज पर कौन-सा रूप जा सकता है?"), noteTone: "info" }, aud: { on: ["class", "school", "web"], tone: "risk" } },
      { poster: { mark: { addr: "gone", bus: "gone", badge: "gone", art: "ok", title: "ok" }, stamp: t("Teacher checked audience", "टीचर ने दर्शक जाँचे"), note: t("Artwork + club title only", "सिर्फ़ चित्र + क्लब का नाम"), noteTone: "ok" }, aud: { on: ["class", "school"], tone: "ok", note: t("Audience set before posting", "पोस्ट से पहले दर्शक तय"), noteTone: "ok" } },
      { poster: { focus: true } },
    ],
    out: {
      "option-0": { poster: { mark: { addr: "risk", bus: "risk", badge: "risk", art: "ok", title: "ok" }, note: t("A nickname still leaves location and routine", "उपनाम के बाद भी जगह और दिनचर्या दिखती है"), noteTone: "risk" }, aud: { on: ["class", "school", "web"], tone: "risk" } },
      "option-1": { poster: { mark: { addr: "gone", bus: "gone", badge: "gone", art: "ok", title: "ok" }, stamp: t("Teacher checked audience", "टीचर ने दर्शक जाँचे"), note: t("Only what the post needs", "सिर्फ़ वही जो पोस्ट को चाहिए"), noteTone: "ok" }, aud: { on: ["class", "school"], tone: "ok" } },
      "option-2": { poster: { mark: { addr: "gone", bus: "risk", badge: "warn", art: "ok", title: "ok" }, note: t("The bus time still shows a daily routine", "बस का समय अब भी रोज़ की दिनचर्या बताता है"), noteTone: "risk" }, aud: { on: ["class", "school", "web"], tone: "risk" } },
    },
  },
  {
    slug: "class6-account-keys", scene: "home", layout: "two",
    label: t("Club game chat · account keys", "क्लब गेम चैट · अकाउंट की चाबियाँ"),
    art: [
      { k: "chat", id: "chat", at: "a", look: "phone", who: t("Club game player", "क्लब गेम का खिलाड़ी"),
        msgs: [{ from: "them", t: t("Send me your password and I'll build your profile!", "अपना पासवर्ड भेजो, मैं तुम्हारी प्रोफ़ाइल बना दूँगा!"), flag: "risk" }, { from: "them", t: t("Or just the login code, that works too 😉", "या बस लॉगिन कोड भेज दो, वो भी चलेगा 😉"), flag: "risk" }], upTo: 1 },
      { k: "doc", id: "keys", at: "b", look: "card", pic: "key-round", title: t("Account keys", "अकाउंट की चाबियाँ"), sub: t("Not a friendship test", "दोस्ती की परीक्षा नहीं"),
        toks: [{ id: "pw", t: t("Account password", "अकाउंट पासवर्ड"), icon: "key" }, { id: "code", t: t("One-time login code", "एक बार वाला लॉगिन कोड"), icon: "hash" }, { id: "art", t: t("Help with artwork", "चित्र में मदद"), icon: "image" }, { id: "plan", t: t("A different passphrase for each account", "हर अकाउंट का अलग पासफ़्रेज़"), icon: "layers" }] },
    ],
    sc: [
      { chat: { upTo: 1, focus: true, note: t("Meera: helping with a picture doesn't need the whole account", "मीरा: चित्र में मदद के लिए पूरा अकाउंट नहीं चाहिए"), noteTone: "info" }, keys: { mark: { art: "ok" } } },
      { chat: { upTo: 2, focus: false, note: undefined }, keys: { mark: { pw: "risk", code: "risk", art: "ok" }, note: t("A password or a login code can let someone act as you — or lock you out", "पासवर्ड या लॉगिन कोड से कोई आपकी जगह काम कर सकता है — या आपको बाहर कर सकता है"), noteTone: "risk" } },
      { keys: { mark: { pw: "risk", code: "risk", art: "ok", plan: "ok" }, note: t("Longer, unique passphrases — a birthday is predictable", "लंबे, अनोखे पासफ़्रेज़ — जन्मदिन का अंदाज़ा लग जाता है"), noteTone: "info" } },
      { chat: { upTo: 2, focus: false }, keys: { note: t("How should Kabir reply?", "कबीर क्या जवाब दे?"), noteTone: "info" } },
      { chat: { upTo: 3, msgs: [{ from: "them", t: t("Send me your password and I'll build your profile!", "अपना पासवर्ड भेजो, मैं तुम्हारी प्रोफ़ाइल बना दूँगा!"), flag: "risk" }, { from: "them", t: t("Or just the login code, that works too 😉", "या बस लॉगिन कोड भेज दो, वो भी चलेगा 😉"), flag: "risk" }, { from: "me", t: t("No. I'll ask a trusted adult.", "नहीं। मैं किसी भरोसेमंद बड़े से पूछूँगा।"), flag: "ok" }] }, keys: { mark: { pw: "ok", code: "ok", art: "ok", plan: "ok" }, note: t("Keys stay private; artwork help can still be shared", "चाबियाँ निजी रहीं; चित्र की मदद फिर भी मिल सकती है"), noteTone: "ok" } },
      { chat: { focus: true } },
    ],
    out: {
      "option-0": { keys: { mark: { pw: "risk", code: "none", art: "none" }, note: t("\"Change it tomorrow\" gives them a whole day as the owner", "\"कल बदल दूँगा\" का मतलब उन्हें पूरा दिन मालिक बनने देना"), noteTone: "risk" } },
      "option-1": { keys: { mark: { code: "risk", pw: "none" }, note: t("A login code can also open an account", "लॉगिन कोड भी अकाउंट खोल सकता है"), noteTone: "risk" } },
      "option-2": { chat: { upTo: 3, msgs: [{ from: "them", t: t("Send me your password and I'll build your profile!", "अपना पासवर्ड भेजो, मैं तुम्हारी प्रोफ़ाइल बना दूँगा!"), flag: "risk" }, { from: "them", t: t("Or just the login code, that works too 😉", "या बस लॉगिन कोड भेज दो, वो भी चलेगा 😉"), flag: "risk" }, { from: "me", t: t("No. I'll ask a trusted adult.", "नहीं। मैं किसी भरोसेमंद बड़े से पूछूँगा।"), flag: "ok" }] }, keys: { mark: { pw: "ok", code: "ok", art: "ok" }, note: t("Keep it private and ask an adult", "निजी रखें और बड़े से पूछें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class6-shared-device", scene: "library", layout: "two",
    label: t("School library computer · handover", "स्कूल लाइब्रेरी कंप्यूटर · अगले को सौंपना"),
    art: [
      { k: "screen", id: "pc", at: "a", look: "laptop", url: [{ t: "library-pc · learning home" }], blocks: [{ id: "tab", type: "row", t: t("Story tab: closed", "कहानी वाला टैब: बंद"), sub: t("Looks tidy", "साफ़ दिखता है"), icon: "book-open" }, { id: "who", type: "banner", t: t("Signed in as Meera", "मीरा के रूप में साइन-इन"), sub: t("Her account is still open", "उसका अकाउंट अब भी खुला है"), icon: "user" }, { id: "work", type: "row", t: t("Meera's private work", "मीरा का निजी काम"), sub: t("visible to the next user", "अगले उपयोगकर्ता को दिखेगा"), icon: "folder-open" }] },
      { k: "flow", id: "steps", at: "b", look: "steps", hide: true, title: t("Handover steps", "सौंपने के क़दम"), icon: "checks", nodes: [{ id: "s1", t: t("Save approved work", "मंज़ूर काम सेव करें"), icon: "save", x: 14, y: 50 }, { id: "s2", t: t("Sign out", "साइन-आउट"), icon: "lock", x: 50, y: 50 }, { id: "s3", t: t("Check it's closed", "जाँचें कि बंद है"), icon: "check", x: 86, y: 50 }], links: [{ from: "s1", to: "s2" }, { from: "s2", to: "s3" }], state: { s1: "now" } },
    ],
    sc: [
      { pc: { focus: true, mark: { tab: "ok", who: "warn" }, note: t("Closing the tab looks tidy — but Kabir sees Meera's account still opens", "टैब बंद करना साफ़ दिखता है — पर कबीर देखता है कि मीरा का अकाउंट अब भी खुलता है"), noteTone: "warn" } },
      { pc: { mark: { tab: "ok", who: "risk", work: "risk" }, note: t("A session remembers access — the next user could open private work or submit in Meera's name", "सेशन पहुँच याद रखता है — अगला उपयोगकर्ता निजी काम खोल या मीरा के नाम से जमा कर सकता है"), noteTone: "risk" } },
      { pc: { focus: false, note: undefined }, steps: { hide: false, focus: true, cur: "s1", note: t("Short pause: lock. Handover: save, sign out, check. Never save passwords on a shared machine.", "छोटा विराम: लॉक। सौंपना: सेव, साइन-आउट, जाँच। शेयर्ड मशीन पर पासवर्ड कभी सेव न करें।"), noteTone: "info" } },
      { steps: { focus: false, note: undefined }, pc: { note: t("The next learner needs the computer. What now?", "अगले विद्यार्थी को कंप्यूटर चाहिए। अब क्या?"), noteTone: "info" } },
      { pc: { mark: { tab: "done", who: "hide", work: "hide" }, note: undefined }, steps: { cur: "s3", state: { s1: "done", s2: "done", s3: "ok" }, note: t("Signed out — and checked that access has ended", "साइन-आउट — और जाँचा कि पहुँच ख़त्म हुई"), noteTone: "ok" } },
      { steps: { focus: true } },
    ],
    out: {
      "option-0": { pc: { mark: { tab: "done", who: "hide", work: "hide" } }, steps: { hide: false, cur: "s3", state: { s1: "done", s2: "done", s3: "ok" }, note: t("Sign out and check", "साइन-आउट करें और जाँचें"), noteTone: "ok" } },
      "option-1": { pc: { mark: { tab: "ok", who: "risk", work: "risk" }, note: t("Closing a tab doesn't reliably end a session", "टैब बंद करने से सेशन भरोसे से ख़त्म नहीं होता"), noteTone: "risk" } },
      "option-2": { pc: { mark: { tab: "ok", who: "risk", work: "risk" }, note: t("Leaving it open hands your account to the next person", "खुला छोड़ना अपना अकाउंट अगले व्यक्ति को सौंपना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-app-permissions", scene: "classroom", layout: "two",
    label: t("Club tablet · the drawing app asks for more", "क्लब टैबलेट · ड्रॉइंग ऐप और माँग रहा है"),
    art: [
      { k: "sw", id: "perms", at: "a", title: t("Drawing app — permissions", "ड्रॉइंग ऐप — अनुमतियाँ"), icon: "shield", rows: [{ id: "save", t: t("Save drawings to the device", "चित्र डिवाइस में सेव करना"), sub: t("Approved by the teacher", "टीचर ने मंज़ूर किया"), icon: "save", on: true }, { id: "contacts", t: t("Read your contacts", "आपके संपर्क पढ़ना"), sub: t("New request", "नई माँग"), icon: "contact", on: false }, { id: "cam", t: t("Use the camera", "कैमरा इस्तेमाल करना"), icon: "camera", on: false }, { id: "loc", t: t("Know where you are", "आप कहाँ हैं जानना"), icon: "pin", on: false }],
        meter: { t: t("Information the app can reach", "ऐप जितनी जानकारी तक पहुँच सकता है"), v: 12, tone: "ok", lo: t("only drawings", "सिर्फ़ चित्र"), hi: t("people's details", "लोगों की जानकारी") } },
      { k: "doc", id: "need", at: "b", look: "note", pic: "idea", title: t("Meera's check", "मीरा की जाँच"), sub: t("Does the activity need it?", "क्या गतिविधि को इसकी ज़रूरत है?"), toks: [{ id: "draw", t: t("Draw a leaf, colour a picture", "पत्ता बनाना, चित्र रँगना"), icon: "leaf" }, { id: "cont", t: t("Contacts: not needed", "संपर्क: ज़रूरी नहीं"), icon: "x" }] },
    ],
    sc: [
      { perms: { focus: true, note: t("A new screen asks to read contacts — it doesn't help colour a leaf", "नई स्क्रीन संपर्क पढ़ने को कहती है — इससे पत्ता रँगने में मदद नहीं मिलती"), noteTone: "warn" } },
      { perms: { on: { contacts: true }, meter: { t: t("Information the app can reach", "ऐप जितनी जानकारी तक पहुँच सकता है"), v: 62, tone: "warn", lo: t("only drawings", "सिर्फ़ चित्र"), hi: t("people's details", "लोगों की जानकारी") }, note: t("Agreeing quickly can expose more than you meant to share", "जल्दी हाँ कहने से जितना देना चाहा उससे ज़्यादा खुल सकता है"), noteTone: "risk" } },
      { perms: { on: { contacts: false }, meter: { t: t("Information the app can reach", "ऐप जितनी जानकारी तक पहुँच सकता है"), v: 12, tone: "ok", lo: t("only drawings", "सिर्फ़ चित्र"), hi: t("people's details", "लोगों की जानकारी") }, note: undefined }, need: { mark: { draw: "ok", cont: "risk" }, note: t("Compare each request with the activity; review again if the purpose changes", "हर माँग को गतिविधि से मिलाएँ; उद्देश्य बदले तो फिर देखें"), noteTone: "info" } },
      { need: { note: t("What should happen to the contacts request?", "संपर्क वाली माँग का क्या हो?"), noteTone: "info" }, perms: { on: { contacts: false } } },
      { perms: { on: { contacts: false }, note: t("Denied, and the teacher asked — not every permission is compulsory", "मना किया, और टीचर से पूछा — हर अनुमति ज़रूरी नहीं होती"), noteTone: "ok" }, need: { mark: { draw: "ok", cont: "gone" } } },
      { perms: { focus: true } },
    ],
    out: {
      "option-0": { perms: { on: { contacts: true, cam: true, loc: true }, meter: { t: t("Information the app can reach", "ऐप जितनी जानकारी तक पहुँच सकता है"), v: 95, tone: "risk", lo: t("only drawings", "सिर्फ़ चित्र"), hi: t("people's details", "लोगों की जानकारी") }, note: t("Everything allowed — far more than drawing needs", "सब कुछ मंज़ूर — चित्र बनाने से कहीं ज़्यादा"), noteTone: "risk" } },
      "option-1": { perms: { on: { contacts: false }, note: t("Deny contacts and ask the teacher", "संपर्क मना करें और टीचर से पूछें"), noteTone: "ok" } },
      "option-2": { perms: { on: { contacts: true }, meter: { t: t("Information the app can reach", "ऐप जितनी जानकारी तक पहुँच सकता है"), v: 70, tone: "risk", lo: t("only drawings", "सिर्फ़ चित्र"), hi: t("people's details", "लोगों की जानकारी") }, note: t("Someone else's contacts are theirs to share, not yours", "किसी और के संपर्क देना उनका हक़ है, आपका नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-link-detour", scene: "home", layout: "two",
    label: t("'Your homework has moved' · compare the whole address", "'आपका होमवर्क बदल गया' · पूरा पता मिलाएँ"),
    art: [
      { k: "screen", id: "page", at: "a", look: "browser", lock: "ok", url: [{ t: "https://" }, { t: "club-homework", mark: "ok" }, { t: "-signin.new-site.example", mark: "ok" }], blocks: [{ id: "logo", type: "banner", t: t("Club homework", "क्लब होमवर्क"), sub: t("Same colours, same logo", "वही रंग, वही लोगो"), icon: "school" }, { id: "msg", type: "text", t: t("We've moved! Please sign in again.", "हम बदल गए हैं! कृपया दोबारा साइन-इन करें।") }, { id: "pw", type: "field", t: t("Password", "पासवर्ड"), sub: t("••••••", "••••••") }] },
      { k: "table", id: "card", at: "b", title: t("Teacher's classroom card", "टीचर का क्लासरूम कार्ड"), icon: "book-open", cols: [t("Whose?", "किसका?"), t("Host name", "होस्ट नाम")], rows: [{ id: "ref", c: [t("Printed on the card", "कार्ड पर छपा"), "club-homework.school.example"] }, { id: "msg", c: [t("In the message", "संदेश में"), "club-homework-signin.new-site.example"] }] },
    ],
    sc: [
      { page: { focus: true, note: t("Kabir checks the address on the teacher's classroom card", "कबीर टीचर के क्लासरूम कार्ड वाला पता मिलाता है"), noteTone: "info" } },
      { page: { url: [{ t: "https://" }, { t: "club-homework", mark: "ok" }, { t: "-signin.new-site.example", mark: "risk" }], note: t("A copied logo can look convincing; a padlock protects the connection, not the sender", "नक़ल किया लोगो विश्वसनीय लग सकता है; ताला कनेक्शन बचाता है, भेजने वाले को नहीं"), noteTone: "warn" }, card: { mark: { msg: "risk", ref: "ok" } } },
      { card: { cell: { "ref:1": "ok", "msg:1": "risk" }, note: t("Compare complete host names on paper — nobody visits the page", "पूरे होस्ट नाम काग़ज़ पर मिलाएँ — पेज पर कोई नहीं जाता"), noteTone: "info" } },
      { card: { note: t("Which route should Meera use?", "मीरा कौन-सा रास्ता चुने?"), noteTone: "info" }, page: { note: undefined } },
      { page: { url: [{ t: "https://" }, { t: "club-homework", mark: "ok" }, { t: ".school.example", mark: "ok" }], mark: { pw: "hide", msg: "hide" }, note: t("Back through the teacher's route; ask about the message", "टीचर के रास्ते से वापस; संदेश के बारे में पूछें"), noteTone: "ok" } },
      { page: { focus: true } },
    ],
    out: {
      "option-0": { page: { url: [{ t: "https://" }, { t: "club-homework", mark: "ok" }, { t: ".school.example", mark: "ok" }], mark: { pw: "hide", msg: "hide" }, note: t("The known teacher route", "टीचर का जाना-पहचाना रास्ता"), noteTone: "ok" } },
      "option-1": { page: { mark: { pw: "risk", logo: "risk" }, note: t("A matching logo isn't proof — the password goes to a stranger", "मिलता लोगो सबूत नहीं — पासवर्ड अजनबी के पास जाता है"), noteTone: "risk" } },
      "option-2": { page: { mark: { pw: "risk" }, note: t("Testing with a friend's password puts their account at risk too", "दोस्त का पासवर्ड आज़माने से उसका अकाउंट भी ख़तरे में"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-kind-game-space", scene: "arena", layout: "two",
    label: t("Game chat · a new player", "गेम चैट · एक नया खिलाड़ी"),
    art: [
      { k: "chat", id: "chat", at: "a", look: "group", who: t("Building game — chat", "बिल्डिंग गेम — चैट"), msgs: [{ from: "them", sender: "NewPlayer", t: t("Wow, you're the best builder here!", "वाह, तुम यहाँ के सबसे अच्छे बिल्डर हो!"), flag: "info" }, { from: "them", sender: "NewPlayer", t: t("Let's leave this chat. Keep our talk secret, okay?", "चलो इस चैट से बाहर चलें। हमारी बात गुप्त रखना, ठीक?"), flag: "risk" }], upTo: 1 },
      { k: "doc", id: "signs", at: "b", look: "form", pic: "flag", title: t("Contact warning signs", "संपर्क के चेतावनी-संकेत"), sub: t("Friendly words don't mean entitled to private contact", "मीठे शब्दों से निजी संपर्क का हक़ नहीं बनता"),
        toks: [{ id: "flat", t: t("Lots of praise, very fast", "बहुत तारीफ़, बहुत जल्दी"), icon: "heart" }, { id: "sec", t: t("\"Keep it secret\"", "\"इसे गुप्त रखना\""), icon: "eye-off" }, { id: "priv", t: t("Move to a private chat", "निजी चैट में चलना"), icon: "lock" }, { id: "photo", t: t("Asks for photos or personal details", "फ़ोटो या निजी जानकारी माँगना"), icon: "camera" }] },
    ],
    sc: [
      { chat: { upTo: 2, focus: true, note: t("Meera: friendly language doesn't give anyone a right to private contact", "मीरा: मीठी भाषा से किसी को निजी संपर्क का हक़ नहीं मिलता"), noteTone: "warn" } },
      { chat: { focus: false, note: undefined }, signs: { mark: { flat: "warn", sec: "risk", priv: "risk" }, note: t("A boundary is a rule about safe contact — you can stop without winning an argument", "सीमा सुरक्षित संपर्क का नियम है — बहस जीते बिना भी रुक सकते हैं"), noteTone: "info" } },
      { signs: { mark: { flat: "warn", sec: "risk", priv: "risk", photo: "warn" }, note: t("Keep messages and sender details for an adult; use block and report with help", "संदेश और भेजने वाले का ब्योरा बड़े के लिए रखें; मदद से ब्लॉक और रिपोर्ट करें"), noteTone: "ok" } },
      { signs: { note: t("What is Kabir's safest next step?", "कबीर का सबसे सुरक्षित अगला क़दम क्या है?"), noteTone: "info" } },
      { chat: { upTo: 3, msgs: [{ from: "them", sender: "NewPlayer", t: t("Wow, you're the best builder here!", "वाह, तुम यहाँ के सबसे अच्छे बिल्डर हो!"), flag: "info" }, { from: "them", sender: "NewPlayer", t: t("Let's leave this chat. Keep our talk secret, okay?", "चलो इस चैट से बाहर चलें। हमारी बात गुप्त रखना, ठीक?"), flag: "risk" }, { from: "sys", t: t("Kabir stopped replying and told a trusted adult", "कबीर ने जवाब देना बंद किया और भरोसेमंद बड़े को बताया") }] }, signs: { mark: { sec: "ok", priv: "ok", flat: "ok", photo: "ok" }, note: t("Kabir owes the player no secrecy", "कबीर को खिलाड़ी से गोपनीयता निभाने की ज़रूरत नहीं"), noteTone: "ok" } },
      { chat: { focus: true } },
    ],
    out: {
      "option-0": { chat: { upTo: 3, msgs: [{ from: "them", sender: "NewPlayer", t: t("Wow, you're the best builder here!", "वाह, तुम यहाँ के सबसे अच्छे बिल्डर हो!"), flag: "info" }, { from: "them", sender: "NewPlayer", t: t("Let's leave this chat. Keep our talk secret, okay?", "चलो इस चैट से बाहर चलें। हमारी बात गुप्त रखना, ठीक?"), flag: "risk" }, { from: "me", t: t("Okay, DM me. I'll investigate.", "ठीक है, मुझे डीएम करो। मैं देखता हूँ।"), flag: "risk" }] }, signs: { mark: { priv: "risk", sec: "risk" }, note: t("Going private means going alone — the opposite of getting help", "निजी में जाना अकेले जाना है — मदद के उलट"), noteTone: "risk" } },
      "option-1": { chat: { upTo: 3, msgs: [{ from: "them", sender: "NewPlayer", t: t("Wow, you're the best builder here!", "वाह, तुम यहाँ के सबसे अच्छे बिल्डर हो!"), flag: "info" }, { from: "them", sender: "NewPlayer", t: t("Let's leave this chat. Keep our talk secret, okay?", "चलो इस चैट से बाहर चलें। हमारी बात गुप्त रखना, ठीक?"), flag: "risk" }, { from: "sys", t: t("Kabir stopped replying and told a trusted adult", "कबीर ने जवाब देना बंद किया और भरोसेमंद बड़े को बताया") }] }, signs: { mark: { sec: "ok", priv: "ok", flat: "ok" }, note: t("Stop, and tell a trusted adult", "रुकें और भरोसेमंद बड़े को बताएँ"), noteTone: "ok" } },
      "option-2": { signs: { mark: { sec: "risk", photo: "risk" }, note: t("Reposting harmful messages to groups spreads them", "हानिकारक संदेश ग्रुपों में डालने से वे फैलते हैं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class6-backup-copy", scene: "lab", layout: "two",
    label: t("Club laptop · which copy survives?", "क्लब लैपटॉप · कौन-सी कॉपी बचेगी?"),
    art: [
      { k: "flow", id: "copies", at: "a", look: "graph", title: t("Where each copy lives", "हर कॉपी कहाँ है"), icon: "disk",
        nodes: [{ id: "lap", t: t("Club laptop", "क्लब लैपटॉप"), icon: "laptop", x: 22, y: 50 }, { id: "orig", t: t("Project folder", "प्रोजेक्ट फ़ोल्डर"), icon: "folder", x: 62, y: 18 }, { id: "short", t: t("Desktop shortcut", "डेस्कटॉप शॉर्टकट"), icon: "link", x: 62, y: 50 }, { id: "dupe", t: t("Duplicate folder", "डुप्लिकेट फ़ोल्डर"), icon: "copy", x: 62, y: 82 }, { id: "bk", t: t("Separate school backup", "अलग स्कूल बैकअप"), icon: "cloud", x: 90, y: 50, sub: "approved" }],
        links: [{ from: "lap", to: "orig" }, { from: "lap", to: "short" }, { from: "lap", to: "dupe" }, { from: "short", to: "orig" }], state: { lap: "now", bk: "ok" }, link: {} },
      { k: "table", id: "restore", at: "b", hide: true, title: t("Restore test (fictional file)", "रिस्टोर जाँच (काल्पनिक फ़ाइल)"), icon: "refresh", cols: [t("Check", "जाँच"), t("Result", "नतीजा")], rows: [{ id: "opens", c: [t("The restored file opens", "रिस्टोर फ़ाइल खुलती है"), "✓"] }, { id: "match", c: [t("Matches the expected version", "अपेक्षित संस्करण से मेल"), "✓"] }, { id: "work", c: [t("Needed work is inside", "ज़रूरी काम अंदर है"), "✓"] }] },
    ],
    sc: [
      { copies: { state: { lap: "bad", orig: "bad", short: "bad", dupe: "bad", bk: "ok" }, link: { "lap>orig": "bad", "lap>short": "bad", "lap>dupe": "bad", "short>orig": "bad" }, note: t("The laptop loses the folder — and the shortcut leads to the same missing file", "लैपटॉप से फ़ोल्डर खो गया — और शॉर्टकट उसी खोई फ़ाइल तक जाता है"), noteTone: "risk" } },
      { copies: { note: t("Two copies on the same lost device disappear together", "एक ही खोए डिवाइस पर दो कॉपियाँ साथ ही ग़ायब होती हैं"), noteTone: "warn", state: { lap: "bad", orig: "bad", short: "bad", dupe: "bad", bk: "ok" } } },
      { copies: { note: undefined }, restore: { hide: false, focus: true, note: t("Restore, then compare — a copy is useful only if it has the needed work", "रिस्टोर करें, फिर मिलाएँ — कॉपी तभी काम की जब ज़रूरी काम उसमें हो"), noteTone: "info" } },
      { restore: { focus: false, note: undefined }, copies: { note: t("Which copy survives losing the laptop?", "लैपटॉप खोने पर कौन-सी कॉपी बचती है?"), noteTone: "info" } },
      { copies: { state: { lap: "bad", orig: "bad", short: "bad", dupe: "bad", bk: "done" }, cur: "bk", note: t("The separate approved backup survives — and gets tested", "अलग मंज़ूर बैकअप बचता है — और जाँचा जाता है"), noteTone: "ok" }, restore: { hide: false } },
      { restore: { focus: true } },
    ],
    out: {
      "option-0": { copies: { state: { lap: "bad", orig: "bad", short: "risk", dupe: "bad", bk: "muted" }, note: t("A shortcut is just a pointer to the missing file", "शॉर्टकट बस खोई फ़ाइल की ओर इशारा है"), noteTone: "risk" } },
      "option-1": { copies: { state: { lap: "bad", orig: "bad", short: "bad", dupe: "risk", bk: "muted" }, note: t("A duplicate on the same laptop is lost too", "उसी लैपटॉप का डुप्लिकेट भी खो जाता है"), noteTone: "risk" } },
      "option-2": { copies: { state: { lap: "bad", orig: "bad", short: "bad", dupe: "bad", bk: "done" }, cur: "bk", note: t("Separate approved school backup", "अलग मंज़ूर स्कूल बैकअप"), noteTone: "ok" } },
    },
  },
  {
    slug: "class6-club-safety-check", scene: "classroom", layout: "two",
    label: t("Discovery club page · ready to publish?", "डिस्कवरी क्लब पेज · क्या प्रकाशित करें?"),
    art: [
      { k: "doc", id: "list", at: "a", look: "form", pic: "clipboard-ok", title: t("Safety checklist", "सुरक्षा चेकलिस्ट"), sub: t("Risk → action → how we check it worked", "जोखिम → कार्रवाई → जाँच कि काम हुआ"),
        toks: [{ id: "addr", t: t("Home address on the draft page", "ड्राफ़्ट पेज पर घर का पता"), icon: "home" }, { id: "link", t: t("An unexpected login link", "अनपेक्षित लॉगिन लिंक"), icon: "link" }, { id: "perm", t: t("A photo app asks for contacts", "फ़ोटो ऐप संपर्क माँगता है"), icon: "contact" }, { id: "sess", t: t("Shared laptop still signed in under a learner's name", "शेयर्ड लैपटॉप अब भी एक विद्यार्थी के नाम से साइन-इन"), icon: "laptop" }], mark: { addr: "risk", link: "risk", perm: "risk", sess: "risk" } },
      { k: "flow", id: "fix", at: "b", look: "steps", hide: true, title: t("Repairs and checks", "मरम्मत और जाँच"), icon: "wrench", nodes: [{ id: "f1", t: t("Remove address", "पता हटाएँ"), icon: "eraser", x: 18, y: 20 }, { id: "f2", t: t("Use known route", "जाना रास्ता लें"), icon: "link", x: 18, y: 50 }, { id: "f3", t: t("Deny contacts", "संपर्क मना करें"), icon: "contact", x: 18, y: 80 }, { id: "pub", t: t("Teacher checks the preview", "टीचर प्रीव्यू देखती है"), icon: "eye", x: 82, y: 50 }], links: [{ from: "f1", to: "pub" }, { from: "f2", to: "pub" }, { from: "f3", to: "pub" }], state: { f1: "muted", f2: "muted", f3: "muted", pub: "muted" } },
    ],
    sc: [
      { list: { focus: true, note: t("The club is ready to show its work — but four risks are open", "क्लब अपना काम दिखाने को तैयार है — पर चार जोखिम खुले हैं"), noteTone: "warn" } },
      { list: { mark: { addr: "ok", link: "risk", perm: "risk", sess: "risk" }, note: t("Meera wants to fix the address and publish. Kabir: one repair doesn't remove every problem.", "मीरा पता ठीक करके छापना चाहती है। कबीर: एक मरम्मत से हर समस्या नहीं मिटती।"), noteTone: "warn" }, fix: { hide: false } },
      { list: { focus: false, note: undefined }, fix: { focus: true, state: { f1: "done", f2: "done", f3: "done", pub: "now" }, note: t("Teacher checks through the known route; unrelated access denied, shared session ended", "टीचर जाने-पहचाने रास्ते से जाँचती है; बेमतलब पहुँच मना, शेयर्ड सेशन बंद"), noteTone: "ok" } },
      { fix: { focus: false, note: undefined }, list: { mark: { addr: "ok", link: "risk", perm: "risk", sess: "risk" }, note: t("Is removing the address enough to publish?", "क्या पता हटाना छापने के लिए काफ़ी है?"), noteTone: "info" } },
      { list: { mark: { addr: "ok", link: "ok", perm: "ok", sess: "ok" }, stamp: t("Teacher verified", "टीचर ने जाँचा"), note: t("Finish each repair and verify the whole plan", "हर मरम्मत पूरी करें और पूरी योजना जाँचें"), noteTone: "ok" }, fix: { state: { f1: "done", f2: "done", f3: "done", pub: "ok" } } },
      { list: { focus: true } },
    ],
    out: {
      "option-0": { list: { mark: { addr: "ok", link: "risk", perm: "risk", sess: "risk" }, note: t("One repair doesn't prove safety", "एक मरम्मत सुरक्षा साबित नहीं करती"), noteTone: "risk" } },
      "option-1": { list: { mark: { addr: "ok", link: "ok", perm: "ok", sess: "ok" }, stamp: t("Teacher verified", "टीचर ने जाँचा"), note: t("Finish and verify the other repairs", "बाक़ी मरम्मत पूरी करें और जाँचें"), noteTone: "ok" }, fix: { state: { f1: "done", f2: "done", f3: "done", pub: "ok" } } },
      "option-2": { list: { mark: { addr: "risk", link: "risk", perm: "risk", sess: "risk" }, stamp: t("PUBLISHED", "प्रकाशित"), note: t("Publishing first means the risks are already public", "पहले छापने का मतलब जोखिम पहले ही सार्वजनिक हैं"), noteTone: "risk" } },
    },
  },
];
