import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class8SecurityWorlds: World[] = [
  {
    slug: "class8-digital-trail", scene: "garden", layout: "two",
    label: t("Garden magazine photo · who sees it?", "बाग़ पत्रिका की फ़ोटो · इसे कौन देखेगा?"),
    art: [
      { k: "doc", id: "photo", at: "a", look: "poster", pic: "camera", title: t("Seedlings photo", "पौधों की फ़ोटो"), sub: t("Meera & Kabir · school garden magazine", "मीरा और कबीर · स्कूल बाग़ पत्रिका"),
        toks: [{ id: "seed", t: t("Seedlings and care instructions", "पौधे और देखभाल के निर्देश"), icon: "leaf" }, { id: "names", t: t("Full names on the noticeboard", "नोटिस बोर्ड पर पूरे नाम"), icon: "users" }, { id: "where", t: t("Where the club meets after school", "स्कूल के बाद क्लब कहाँ मिलता है"), icon: "pin" }, { id: "kids", t: t("Children in the picture", "तस्वीर में बच्चे"), icon: "face" }] },
      { k: "crowd", id: "aud", at: "b", title: t("Audience", "दर्शक"), icon: "eye", rings: [{ id: "class", t: t("Class (draft, agreed)", "क्लास (ड्राफ़्ट, सहमति मिली)"), n: 30, icon: "school" }, { id: "public", t: t("Public magazine link", "सार्वजनिक पत्रिका लिंक"), n: 5000, icon: "globe" }], on: ["class"], tone: "ok" },
    ],
    sc: [
      { photo: { focus: true, mark: { seed: "ok", names: "risk", where: "risk" }, note: t("Public readers need the garden story — not these details", "सार्वजनिक पाठकों को बाग़ की कहानी चाहिए — ये ब्योरे नहीं"), noteTone: "warn" } },
      { aud: { on: ["class", "public"], tone: "risk", note: t("The finished magazine has a public link — the audience changed", "तैयार पत्रिका का सार्वजनिक लिंक है — दर्शक बदल गए"), noteTone: "risk" }, photo: { focus: false, mark: { seed: "ok", names: "risk", where: "risk", kids: "warn" }, note: t("The pictured children haven't agreed to public sharing", "तस्वीर के बच्चों ने सार्वजनिक साझा करने पर सहमति नहीं दी"), noteTone: "warn" } },
      { photo: { mark: { seed: "ok", names: "hide", where: "hide", kids: "hl" }, note: t("A different picture: remove identifying details, check permission with the people pictured and the teacher", "दूसरी तस्वीर: पहचान वाले ब्योरे हटाएँ, तस्वीर वाले लोगों और टीचर से अनुमति जाँचें"), noteTone: "info" } },
      { photo: { mark: { seed: "ok", names: "risk", where: "risk", kids: "warn" }, note: t("What should the magazine team do next?", "पत्रिका टीम आगे क्या करे?"), noteTone: "info" }, aud: { on: ["class"], tone: "ok" } },
      { photo: { mark: { seed: "ok", names: "gone", where: "gone", kids: "gone" }, stamp: t("Teacher checked preview", "टीचर ने प्रीव्यू जाँचा"), note: t("Explains the garden without showing children or the noticeboard", "बाग़ को बिना बच्चों या नोटिस बोर्ड के समझाती है"), noteTone: "ok" }, aud: { on: ["class", "public"], tone: "ok", note: t("Public audience — after consent is checked", "सार्वजनिक दर्शक — सहमति जाँचने के बाद"), noteTone: "ok" } },
      { photo: { focus: true } },
    ],
    out: {
      original: { photo: { mark: { names: "risk", where: "risk", kids: "risk" }, note: t("The draft permission doesn't cover a public link", "ड्राफ़्ट की अनुमति सार्वजनिक लिंक पर लागू नहीं होती"), noteTone: "risk" }, aud: { on: ["class", "public"], tone: "risk" } },
      folder: { photo: { mark: { names: "risk", where: "risk", kids: "risk" }, note: t("A class-folder permission is for the class, not the public", "क्लास फ़ोल्डर की अनुमति क्लास के लिए है, सार्वजनिक के लिए नहीं"), noteTone: "risk" }, aud: { on: ["class", "public"], tone: "risk" } },
      revise: { photo: { mark: { seed: "ok", names: "gone", where: "gone", kids: "gone" }, stamp: t("Teacher checked preview", "टीचर ने प्रीव्यू जाँचा"), note: t("A suitable version, with consent checked", "उपयुक्त रूप, सहमति जाँचकर"), noteTone: "ok" }, aud: { on: ["class", "public"], tone: "ok" } },
    },
  },
  {
    slug: "class8-account-control", scene: "lab", layout: "two",
    label: t("Robotics club project board · an exposed password", "रोबोटिक्स क्लब प्रोजेक्ट बोर्ड · उजागर पासवर्ड"),
    art: [
      { k: "sw", id: "acct", at: "a", title: t("Account protection (fictional)", "अकाउंट सुरक्षा (काल्पनिक)"), icon: "shield",
        rows: [{ id: "reuse", t: t("Same password as another service", "दूसरी सेवा वाला ही पासवर्ड"), sub: t("Exposed in a leak", "लीक में उजागर"), icon: "key", on: true }, { id: "uniq", t: t("Long, unique passphrase", "लंबा, अनोखा पासफ़्रेज़"), icon: "key-round", on: false }, { id: "step", t: t("Extra sign-in check", "अतिरिक्त साइन-इन जाँच"), icon: "mobile", on: false }, { id: "rec", t: t("Approved recovery contact", "मंज़ूर रिकवरी संपर्क"), icon: "contact", on: false }],
        meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 85, tone: "risk", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") } },
      { k: "chat", id: "alert", at: "b", look: "phone", who: t("Sign-in prompt", "साइन-इन संकेत"), msgs: [{ from: "sys", t: t("Unexpected sign-in? Approve / Refuse", "अनपेक्षित साइन-इन? मंज़ूर / मना") }], upTo: 0, hide: true },
    ],
    sc: [
      { acct: { focus: true, note: t("Kabir: just add a number to the old password and keep working", "कबीर: पुराने पासवर्ड में एक अंक जोड़कर काम चालू रखो"), noteTone: "warn" } },
      { acct: { on: { reuse: false, uniq: true }, meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 35, tone: "warn", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") }, note: t("A different long passphrase per account limits reuse damage — compare plans on paper, enter no secrets", "हर अकाउंट का अलग लंबा पासफ़्रेज़ पुन: उपयोग का नुक़सान सीमित करता है — योजनाएँ काग़ज़ पर मिलाएँ, कोई रहस्य न डालें"), noteTone: "ok" } },
      { acct: { on: { reuse: false, uniq: true, step: true }, meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 15, tone: "ok", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") }, note: t("An extra check makes a stolen password less useful — not invincible", "अतिरिक्त जाँच चोरी का पासवर्ड कम उपयोगी बनाती है — अजेय नहीं"), noteTone: "ok" }, alert: { hide: false, upTo: 1, focus: true, note: t("Refuse an unexpected approval and talk about it", "अनपेक्षित मंज़ूरी मना करें और उस पर बात करें"), noteTone: "info" } },
      { alert: { hide: true }, acct: { on: { reuse: true, uniq: false, step: false, rec: false }, meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 85, tone: "risk", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") }, note: t("Which response addresses the exposed reused password?", "उजागर दोहराए पासवर्ड का कौन-सा जवाब ठीक है?"), noteTone: "info" } },
      { acct: { on: { reuse: false, uniq: true, step: true, rec: true }, meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 8, tone: "ok", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") }, note: t("Unique passphrase + extra check + a checked recovery route", "अनोखा पासफ़्रेज़ + अतिरिक्त जाँच + जाँचा हुआ रिकवरी रास्ता"), noteTone: "ok" } },
      { acct: { focus: true } },
    ],
    out: {
      keep: { acct: { on: { reuse: true, uniq: false }, meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 95, tone: "risk", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") }, note: t("\"It still works\" doesn't mean it's safe", "\"अभी चल रहा है\" का मतलब सुरक्षित नहीं"), noteTone: "risk" } },
      digit: { acct: { on: { reuse: true, uniq: false }, meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 75, tone: "risk", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") }, note: t("Changing one digit is still a guessable cousin of the leaked password", "एक अंक बदलना भी लीक हुए पासवर्ड का अंदाज़ा लगाने लायक़ रिश्तेदार है"), noteTone: "risk" } },
      unique: { acct: { on: { reuse: false, uniq: true, step: true, rec: true }, meter: { t: t("Damage if one service leaks", "एक सेवा लीक होने पर नुक़सान"), v: 8, tone: "ok", lo: t("contained", "सीमित"), hi: t("everything", "सब कुछ") }, note: t("Unique passphrase, then review sign-in and recovery", "अनोखा पासफ़्रेज़, फिर साइन-इन और रिकवरी की समीक्षा"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-app-permissions", scene: "lab", layout: "two",
    label: t("Homework scanner · what does it really need?", "होमवर्क स्कैनर · इसे असल में क्या चाहिए?"),
    art: [
      { k: "sw", id: "perm", at: "a", title: t("Scanner asks for…", "स्कैनर माँगता है…"), icon: "scan",
        rows: [{ id: "cam", t: t("Camera (while scanning)", "कैमरा (स्कैन करते समय)"), icon: "camera", on: false }, { id: "photos", t: t("All photos in the library", "लाइब्रेरी की सारी फ़ोटो"), icon: "image", on: false }, { id: "contacts", t: t("Contacts", "संपर्क"), icon: "contact", on: false }, { id: "loc", t: t("Location", "लोकेशन"), icon: "pin", on: false }],
        meter: { t: t("What the app can reach", "ऐप किस तक पहुँच सकता है"), v: 5, tone: "ok", lo: t("one scan", "एक स्कैन"), hi: t("my whole device", "मेरा पूरा डिवाइस") } },
      { k: "doc", id: "card", at: "b", look: "card", pic: "clipboard", title: t("Feature card", "फ़ीचर कार्ड"), sub: t("What this scan uses", "यह स्कैन क्या इस्तेमाल करता है"), toks: [{ id: "cam", t: t("Uses the camera", "कैमरा इस्तेमाल करता है"), icon: "camera" }, { id: "save", t: t("Saves inside the app", "ऐप के भीतर सेव करता है"), icon: "save" }, { id: "no", t: t("Needs neither contacts nor location", "संपर्क या लोकेशन नहीं चाहिए"), icon: "x" }] },
    ],
    sc: [
      { perm: { on: { cam: true, photos: true, contacts: true, loc: true }, meter: { t: t("What the app can reach", "ऐप किस तक पहुँच सकता है"), v: 96, tone: "risk", lo: t("one scan", "एक स्कैन"), hi: t("my whole device", "मेरा पूरा डिवाइस") }, note: t("Kabir: allow everything — deciding one by one is slow", "कबीर: सब मंज़ूर कर दो — एक-एक करके तय करना धीमा है"), noteTone: "warn" }, card: { hide: true } },
      { card: { hide: false, mark: { cam: "ok", save: "ok", no: "hl" }, note: t("Asking isn't proof of malware — unnecessary access still deserves a question", "माँगना मैलवेयर का सबूत नहीं — बेवजह पहुँच पर फिर भी सवाल बनता है"), noteTone: "info" } },
      { perm: { on: { cam: true, photos: false, contacts: false, loc: false }, meter: { t: t("What the app can reach", "ऐप किस तक पहुँच सकता है"), v: 18, tone: "ok", lo: t("one scan", "एक स्कैन"), hi: t("my whole device", "मेरा पूरा डिवाइस") }, note: t("Least privilege: camera while using — maybe one picture instead of the whole library", "न्यूनतम अधिकार: इस्तेमाल के समय कैमरा — पूरी लाइब्रेरी की जगह शायद एक तस्वीर"), noteTone: "ok" } },
      { perm: { on: { cam: true, photos: true, contacts: true, loc: true }, meter: { t: t("What the app can reach", "ऐप किस तक पहुँच सकता है"), v: 96, tone: "risk", lo: t("one scan", "एक स्कैन"), hi: t("my whole device", "मेरा पूरा डिवाइस") }, note: t("What should Meera do with the broad request?", "व्यापक माँग पर मीरा क्या करे?"), noteTone: "info" } },
      { perm: { on: { cam: true, photos: false, contacts: false, loc: false }, meter: { t: t("What the app can reach", "ऐप किस तक पहुँच सकता है"), v: 18, tone: "ok", lo: t("one scan", "एक स्कैन"), hi: t("my whole device", "मेरा पूरा डिवाइस") }, note: t("After the exhibition: review and revoke access that's no longer needed", "प्रदर्शनी के बाद: जो पहुँच अब ज़रूरी नहीं उसकी समीक्षा कर हटाएँ"), noteTone: "ok" } },
      { perm: { focus: true } },
    ],
    out: {
      all: { perm: { on: { cam: true, photos: true, contacts: true, loc: true }, meter: { t: t("What the app can reach", "ऐप किस तक पहुँच सकता है"), v: 96, tone: "risk", lo: t("one scan", "एक स्कैन"), hi: t("my whole device", "मेरा पूरा डिवाइस") }, note: t("Far more than a scan needs", "स्कैन की ज़रूरत से कहीं ज़्यादा"), noteTone: "risk" } },
      malware: { perm: { on: { cam: false, photos: false, contacts: false, loc: false }, note: t("A request alone doesn't prove malware — test the narrow version first", "सिर्फ़ माँग मैलवेयर साबित नहीं करती — पहले सीमित रूप आज़माएँ"), noteTone: "warn" } },
      limited: { perm: { on: { cam: true, photos: false, contacts: false, loc: false }, meter: { t: t("What the app can reach", "ऐप किस तक पहुँच सकता है"), v: 18, tone: "ok", lo: t("one scan", "एक स्कैन"), hi: t("my whole device", "मेरा पूरा डिवाइस") }, note: t("Camera-only while using; test the scan", "इस्तेमाल के समय सिर्फ़ कैमरा; स्कैन जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-link-check", scene: "lab", layout: "two",
    label: t("Two template messages · same colours, same logo", "दो टेम्पलेट संदेश · वही रंग, वही लोगो"),
    art: [
      { k: "table", id: "hosts", at: "a", title: t("Read the hostname, not just the words", "सिर्फ़ शब्द नहीं, होस्टनाम पढ़ें"), icon: "link", cols: [t("Address", "पता"), t("Complete hostname", "पूरा होस्टनाम"), t("Same as the school's?", "स्कूल जैसा?")],
        rows: [{ id: "a", c: ["https://school.example/templates", "school.example", "?"] }, { id: "b", c: ["https://school.example.notice.example/templates", "school.example.notice.example", "?"] }], foot: t("Kabir picks the more polished page", "कबीर ज़्यादा चमकदार पेज चुनता है") },
      { k: "screen", id: "page", at: "b", look: "browser", lock: "ok", url: [{ t: "https://" }, { t: "school.example", mark: "ok" }, { t: ".notice.example", mark: "risk" }, { t: "/templates" }], blocks: [{ id: "logo", type: "banner", t: t("School colours · familiar logo", "स्कूल के रंग · जाना-पहचाना लोगो"), icon: "school" }, { id: "dl", type: "btn", t: t("Download template", "टेम्पलेट डाउनलोड करें"), icon: "download" }] },
    ],
    sc: [
      { hosts: { focus: true, note: t("Meera asks what evidence connects either message to the school", "मीरा पूछती है कि कौन-सा सबूत किसी संदेश को स्कूल से जोड़ता है"), noteTone: "info" } },
      { hosts: { txt: { "a:2": "✓", "b:2": "✗" }, mark: { a: "ok", b: "risk" }, note: t("In the second address the hostname is school.example.notice.example — words nearby don't count", "दूसरे पते में होस्टनाम school.example.notice.example है — पास के शब्द नहीं गिने जाते"), noteTone: "warn" } },
      { page: { note: t("HTTPS protects the connection to the named host — not who owns it or whether the claims are honest", "HTTPS नामित होस्ट तक कनेक्शन बचाता है — मालिक कौन है या दावे सच हैं या नहीं, यह नहीं"), noteTone: "info" }, hosts: { focus: false } },
      { hosts: { note: t("Which next step independently verifies the template?", "कौन-सा अगला क़दम टेम्पलेट को स्वतंत्र रूप से जाँचता है?"), noteTone: "info" } },
      { hosts: { txt: { "a:2": "✓ bookmark", "b:2": "✗" }, mark: { a: "ok", b: "gone" }, note: t("The known resource page lists the approved template — compare, and ask about mismatches", "जाने-पहचाने रिसोर्स पेज पर मंज़ूर टेम्पलेट है — मिलाएँ, और अमेल पर पूछें"), noteTone: "ok" }, page: { mark: { dl: "hide" } } },
      { hosts: { focus: true } },
    ],
    out: {
      logo: { page: { mark: { logo: "risk", dl: "risk" }, note: t("A copied logo isn't independent proof of identity", "नक़ल किया लोगो पहचान का स्वतंत्र सबूत नहीं"), noteTone: "risk" } },
      https: { page: { mark: { dl: "risk" }, note: t("Both being secure doesn't show either belongs to the school", "दोनों के सुरक्षित होने से नहीं दिखता कि कोई स्कूल का है"), noteTone: "risk" } },
      known: { hosts: { txt: { "a:2": "✓ bookmark", "b:2": "✗" }, mark: { a: "ok", b: "gone" }, note: t("Check the existing school bookmark with the teacher", "मौजूदा स्कूल बुकमार्क टीचर के साथ जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-download-decision", scene: "lab", layout: "two",
    label: t("An 'instant effects' animation pack", "'तुरंत इफ़ेक्ट' वाला एनिमेशन पैक"),
    art: [
      { k: "screen", id: "pack", at: "a", look: "browser", url: [{ t: "instant-effects.example/pack" }], blocks: [{ id: "prev", type: "banner", t: t("Wow! Moving title effects", "वाह! चलते शीर्षक इफ़ेक्ट"), sub: t("Hundreds of happy comments", "सैकड़ों ख़ुश टिप्पणियाँ"), icon: "sparkles" }, { id: "off", type: "row", t: t("Step 1: disable protection", "चरण 1: सुरक्षा बंद करें"), icon: "shield-off" }, { id: "ext", type: "row", t: t("Step 2: install an unrelated browser extension", "चरण 2: अलग से ब्राउज़र एक्सटेंशन इंस्टॉल करें"), icon: "puzzle" }] },
      { k: "flow", id: "route", at: "b", look: "graph", title: t("What would change on the device?", "डिवाइस पर क्या बदलेगा?"), icon: "workflow", nodes: [{ id: "title", t: t("Need: a moving title", "ज़रूरत: चलता शीर्षक"), icon: "target", x: 14, y: 50 }, { id: "ed", t: t("Approved editor's animation", "मंज़ूर एडिटर का एनिमेशन"), icon: "check", x: 82, y: 22 }, { id: "pk", t: t("Pack + weaker protection + extension", "पैक + कमज़ोर सुरक्षा + एक्सटेंशन"), icon: "alert", x: 82, y: 78 }, { id: "upd", t: t("Known editor update", "जाना-पहचाना एडिटर अपडेट"), icon: "refresh", x: 50, y: 50 }], links: [{ from: "title", to: "ed" }, { from: "title", to: "pk" }, { from: "ed", to: "upd" }], link: { "ed>upd": "off" }, state: { title: "now", pk: "risk", upd: "muted" } },
    ],
    sc: [
      { pack: { focus: true, mark: { off: "risk", ext: "warn" }, note: t("It asks to disable protection and install something unrelated", "यह सुरक्षा बंद करने और बेमतलब कुछ इंस्टॉल करने को कहता है"), noteTone: "warn" } },
      { pack: { focus: false, note: t("Kabir looks at the preview; Meera reads what would change", "कबीर प्रीव्यू देखता है; मीरा देखती है कि क्या बदलेगा"), noteTone: "info" }, route: { state: { title: "now", pk: "risk" }, note: t("Weakening protection raises the risk — popularity doesn't remove it", "सुरक्षा कमज़ोर करने से जोखिम बढ़ता है — लोकप्रियता उसे नहीं हटाती"), noteTone: "risk" } },
      { route: { link: { "title>ed": "on", "title>pk": "off" }, state: { title: "done", ed: "ok", pk: "muted" }, cur: "ed", note: t("A simple animation in the approved editor meets the need with no new software", "मंज़ूर एडिटर का सादा एनिमेशन बिना नया सॉफ़्टवेयर ज़रूरत पूरी करता है"), noteTone: "ok" } },
      { route: { link: { "title>ed": "on", "title>pk": "on" }, state: { title: "now", ed: "none", pk: "risk" }, cur: "title", note: t("What should the team do about the pack?", "टीम पैक का क्या करे?"), noteTone: "info" } },
      { route: { link: { "title>ed": "on", "title>pk": "off", "ed>upd": "on" }, state: { title: "done", ed: "ok", pk: "muted", upd: "ok" }, cur: "upd", note: t("A known update inside the editor's own settings is different — updates can fix problems", "एडिटर की अपनी सेटिंग का जाना-पहचाना अपडेट अलग है — अपडेट समस्याएँ ठीक कर सकते हैं"), noteTone: "ok" } },
      { route: { focus: true } },
    ],
    out: {
      disable: { pack: { mark: { off: "press", ext: "risk" }, note: t("A minute is enough for harm — and the request is the red flag", "एक मिनट नुक़सान के लिए काफ़ी है — और यह माँग ही चेतावनी है"), noteTone: "risk" } },
      comments: { pack: { mark: { prev: "risk" }, note: t("Comments are claims, not checks of the file", "टिप्पणियाँ दावे हैं, फ़ाइल की जाँच नहीं"), noteTone: "risk" } },
      alternative: { route: { link: { "title>ed": "on", "title>pk": "off" }, state: { title: "done", ed: "ok", pk: "muted" }, cur: "ed", note: t("Stop, and use the approved editor", "रुकें और मंज़ूर एडिटर इस्तेमाल करें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-shared-device", scene: "library", layout: "two",
    label: t("Library computer · Kabir's handover", "लाइब्रेरी कंप्यूटर · कबीर का हैंडओवर"),
    art: [
      { k: "doc", id: "left", at: "a", look: "form", pic: "laptop", title: t("What's still exposed", "अब भी क्या खुला है"), sub: t("He closed the tab and stood up", "उसने टैब बंद किया और उठ गया"), toks: [{ id: "tab", t: t("The active tab", "चालू टैब"), icon: "monitor" }, { id: "avatar", t: t("Account still signed in (another tab)", "अकाउंट अब भी साइन-इन (दूसरा टैब)"), icon: "user" }, { id: "dl", t: t("Draft in Downloads", "डाउनलोड में ड्राफ़्ट"), icon: "download" }, { id: "saved", t: t("Saved sign-in details", "सेव किए साइन-इन ब्योरे"), icon: "key" }], mark: { tab: "ok", avatar: "risk", dl: "risk", saved: "warn" } },
      { k: "flow", id: "seq", at: "b", look: "steps", hide: true, title: t("Complete handover", "पूरा हैंडओवर"), icon: "checks", nodes: [{ id: "h1", t: t("Save the draft", "ड्राफ़्ट सेव करें"), icon: "save", x: 12, y: 30 }, { id: "h2", t: t("Handle your local copy", "अपनी लोकल कॉपी सँभालें"), icon: "download", x: 50, y: 30 }, { id: "h3", t: t("Sign out of the service", "सेवा से साइन-आउट"), icon: "lock", x: 88, y: 30 }, { id: "h4", t: t("Test: reopening asks to sign in", "जाँच: दोबारा खोलने पर साइन-इन माँगे"), icon: "check", x: 50, y: 78 }], links: [{ from: "h1", to: "h2" }, { from: "h2", to: "h3" }, { from: "h3", to: "h4" }], state: { h1: "now" } },
    ],
    sc: [
      { left: { focus: true, note: t("Meera notices the avatar in another tab and the draft in Downloads", "मीरा दूसरे टैब में अवतार और डाउनलोड में ड्राफ़्ट देखती है"), noteTone: "warn" } },
      { left: { note: t("A tab is one view; signing out ends the session. Locking only pauses use.", "टैब एक झलक है; साइन-आउट सेशन ख़त्म करता है। लॉक सिर्फ़ उपयोग रोकता है।"), noteTone: "info" } },
      { left: { focus: false, note: undefined }, seq: { hide: false, focus: true, state: { h1: "done", h2: "now" }, cur: "h2", note: t("Only your own supplied draft — never open or delete someone else's files", "सिर्फ़ अपना दिया ड्राफ़्ट — किसी और की फ़ाइलें न खोलें, न हटाएँ"), noteTone: "info" } },
      { seq: { focus: false, note: undefined, state: { h1: "now" }, cur: "h1" }, left: { note: t("How should Kabir hand over the shared computer?", "कबीर शेयर्ड कंप्यूटर कैसे सौंपे?"), noteTone: "info" } },
      { left: { mark: { tab: "ok", avatar: "gone", dl: "gone", saved: "gone" }, note: undefined }, seq: { state: { h1: "done", h2: "done", h3: "done", h4: "ok" }, cur: "h4", note: t("Reopening asks to sign in and Downloads no longer shows the draft", "दोबारा खोलने पर साइन-इन माँगा जाता है और डाउनलोड में ड्राफ़्ट नहीं दिखता"), noteTone: "ok" } },
      { seq: { focus: true } },
    ],
    out: {
      tab: { left: { mark: { tab: "ok", avatar: "risk", dl: "risk", saved: "risk" }, note: t("Closing one tab leaves the session and the draft", "एक टैब बंद करने पर सेशन और ड्राफ़्ट रह जाते हैं"), noteTone: "risk" } },
      lock: { left: { mark: { tab: "ok", avatar: "risk", dl: "risk", saved: "risk" }, note: t("Locking blocks use for a while — it doesn't replace signing out", "लॉक कुछ देर उपयोग रोकता है — साइन-आउट का विकल्प नहीं"), noteTone: "risk" } },
      complete: { left: { mark: { tab: "ok", avatar: "gone", dl: "gone", saved: "gone" } }, seq: { hide: false, state: { h1: "done", h2: "done", h3: "done", h4: "ok" }, cur: "h4", note: t("Save, handle your own copy, sign out and test", "सेव, अपनी कॉपी सँभालें, साइन-आउट और जाँच"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-backup-restore", scene: "lab", layout: "two",
    label: t("The comic project · an empty page replaced it", "कॉमिक प्रोजेक्ट · एक ख़ाली पन्ने ने उसे बदल दिया"),
    art: [
      { k: "flow", id: "sync", at: "a", look: "graph", title: t("Synchronised folder", "सिंक किया फ़ोल्डर"), icon: "refresh", nodes: [{ id: "a", t: t("Laptop copy", "लैपटॉप कॉपी"), icon: "laptop", x: 18, y: 50 }, { id: "b", t: t("Cloud folder", "क्लाउड फ़ोल्डर"), icon: "cloud", x: 82, y: 50 }, { id: "snap", t: t("Version history", "वर्शन इतिहास"), icon: "history", x: 50, y: 88 }], links: [{ from: "a", to: "b", t: t("sync", "सिंक") }, { from: "b", to: "snap" }], state: { a: "ok", b: "ok" } },
      { k: "table", id: "copies", at: "b", hide: true, title: t("Supplied copies", "उपलब्ध कॉपियाँ"), icon: "archive", cols: [t("Copy", "कॉपी"), t("State", "स्थिति"), t("Panels", "पैनल")], rows: [{ id: "cur", c: [t("Current", "मौजूदा"), t("empty page", "ख़ाली पन्ना"), "0"] }, { id: "snap", c: [t("Snapshot", "स्नैपशॉट"), t("unreadable", "पढ़ा नहीं जाता"), "?"] }, { id: "yday", c: [t("Yesterday's version (checked)", "कल का संस्करण (जाँचा)"), t("readable, no new ending", "पढ़ने योग्य, नया अंत नहीं"), "6"] }] },
    ],
    sc: [
      { sync: { state: { a: "bad", b: "bad" }, note: t("Kabir: there must be a backup — it's on two devices!", "कबीर: बैकअप तो होगा — यह दो डिवाइस पर है!"), noteTone: "warn", focus: true } },
      { sync: { state: { a: "bad", b: "bad", snap: "now" }, link: { "a>b": "bad" }, note: t("Sync keeps places aligned — and can spread an accidental replacement", "सिंक जगहों को एक-सा रखता है — और ग़लती से हुआ बदलाव भी फैला देता है"), noteTone: "risk" } },
      { copies: { hide: false, focus: true, mark: { cur: "risk", snap: "warn", yday: "ok" }, note: t("Use the best verified copy, and say what it's missing — today's new ending", "सबसे अच्छी जाँची कॉपी लें, और बताएँ क्या कम है — आज का नया अंत"), noteTone: "info" }, sync: { focus: false, note: undefined } },
      { copies: { focus: false, note: t("Which restore plan protects the remaining evidence?", "कौन-सी रिस्टोर योजना बची हुई सामग्री बचाती है?"), noteTone: "info" } },
      { copies: { mark: { cur: "muted", snap: "warn", yday: "ok" }, note: t("Restore the checked version separately, then verify the six panels and captions", "जाँचा संस्करण अलग से रिस्टोर करें, फिर छह पैनल और कैप्शन जाँचें"), noteTone: "ok" }, sync: { state: { a: "ok", b: "ok", snap: "ok" }, link: { "a>b": "on" } } },
      { copies: { focus: true } },
    ],
    out: {
      overwrite: { copies: { mark: { cur: "risk", yday: "risk" }, note: t("Overwriting at once can destroy the remaining evidence", "तुरंत ओवरराइट करने से बची सामग्री नष्ट हो सकती है"), noteTone: "risk" } },
      label: { copies: { mark: { cur: "risk", snap: "warn" }, note: t("\"A backup exists\" isn't \"it restores\"", "\"बैकअप है\" का मतलब \"रिस्टोर होगा\" नहीं"), noteTone: "risk" } },
      test: { copies: { mark: { cur: "muted", snap: "warn", yday: "ok" }, note: t("Restore the checked version separately and verify it", "जाँचा संस्करण अलग से रिस्टोर कर जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-magazine-safety-review", scene: "classroom", layout: "two",
    label: t("The class magazine · release pack", "क्लास पत्रिका · रिलीज़ पैक"),
    art: [
      { k: "table", id: "pack", at: "a", title: t("Who can open what?", "कौन क्या खोल सकता है?"), icon: "folder-open", cols: [t("Item", "आइटम"), t("Named editor", "नामित एडिटर"), t("Public reader", "सार्वजनिक पाठक")],
        rows: [{ id: "issue", c: [t("Approved garden article", "मंज़ूर बाग़ लेख"), "✓", "✓"] }, { id: "roster", c: [t("Unredacted contact roster", "बिना छिपा संपर्क रोस्टर"), "✓", "✓"] }, { id: "draft", c: [t("Draft link (anyone can edit)", "ड्राफ़्ट लिंक (कोई भी बदल सकता)"), "✓", "✓"] }], mark: { roster: "risk", draft: "risk" } },
      { k: "flow", id: "tests", at: "b", look: "steps", hide: true, title: t("Test as both readers", "दोनों पाठकों की तरह जाँचें"), icon: "checks", nodes: [{ id: "t1", t: t("Repair the pack", "पैक सुधारें"), icon: "wrench", x: 14, y: 50 }, { id: "t2", t: t("Test as editor", "एडिटर बनकर जाँचें"), icon: "pencil", x: 50, y: 50 }, { id: "t3", t: t("Test as public reader", "सार्वजनिक पाठक बनकर जाँचें"), icon: "eye", x: 86, y: 50 }], links: [{ from: "t1", to: "t2" }, { from: "t2", to: "t3" }], state: { t1: "now" } },
    ],
    sc: [
      { pack: { focus: true, note: t("Deadline close — but the teacher schedules a safety review", "समय-सीमा पास — पर टीचर सुरक्षा समीक्षा रखती है"), noteTone: "warn" } },
      { pack: { txt: { "roster:2": "✗", "draft:2": "✗" }, mark: { issue: "ok", roster: "warn", draft: "warn" }, note: t("Draft ≠ publication. Editors need the draft; the public needs only the approved issue; the roster stays restricted.", "ड्राफ़्ट ≠ प्रकाशन। एडिटर को ड्राफ़्ट चाहिए; जनता को सिर्फ़ मंज़ूर अंक; रोस्टर सीमित रहता है।"), noteTone: "info" } },
      { tests: { hide: false, focus: true, state: { t1: "done", t2: "done", t3: "now" }, note: t("A role label isn't enough — the public test must fail to open the draft and roster", "भूमिका का लेबल काफ़ी नहीं — सार्वजनिक जाँच में ड्राफ़्ट और रोस्टर नहीं खुलने चाहिए"), noteTone: "info" }, pack: { focus: false } },
      { tests: { focus: false, note: undefined, state: { t1: "now" } }, pack: { txt: {}, mark: { roster: "risk", draft: "risk" }, note: t("Which release plan should the team adopt?", "टीम कौन-सी रिलीज़ योजना अपनाए?"), noteTone: "info" } },
      { pack: { txt: { "roster:1": "✗", "roster:2": "✗", "draft:2": "✗" }, mark: { issue: "ok", roster: "gone", draft: "ok" }, note: t("Approved issue public; draft for editors only; roster restricted — both tests pass", "मंज़ूर अंक सार्वजनिक; ड्राफ़्ट सिर्फ़ एडिटरों के लिए; रोस्टर सीमित — दोनों जाँचें पास"), noteTone: "ok" }, tests: { state: { t1: "done", t2: "done", t3: "ok" } } },
      { tests: { focus: true } },
    ],
    out: {
      later: { pack: { mark: { roster: "risk", draft: "risk" }, stamp: t("PUBLISHED", "प्रकाशित"), note: t("The roster and an editable draft are already public", "रोस्टर और बदले जा सकने वाला ड्राफ़्ट पहले ही सार्वजनिक"), noteTone: "risk" } },
      hide: { pack: { mark: { roster: "risk", draft: "warn" }, note: t("A hidden link with broad access is still open to whoever has it", "छिपा लिंक भी, व्यापक पहुँच के साथ, जिसके पास है उसके लिए खुला है"), noteTone: "risk" } },
      test: { pack: { txt: { "roster:1": "✗", "roster:2": "✗", "draft:2": "✗" }, mark: { issue: "ok", roster: "gone", draft: "ok" }, note: t("Repair the pack and test both readers before release", "रिलीज़ से पहले पैक सुधारें और दोनों पाठकों से जाँचें"), noteTone: "ok" }, tests: { hide: false, state: { t1: "done", t2: "done", t3: "ok" } } },
    },
  },
];
