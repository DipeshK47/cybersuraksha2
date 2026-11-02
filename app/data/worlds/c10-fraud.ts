import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class10FraudWorlds: World[] = [
  {
    slug: "class10-fraud-exam-update", scene: "classroom", layout: "two",
    label: t("A forwarded exam-centre notice · which copy says what?", "आगे भेजी परीक्षा-केंद्र सूचना · किस कॉपी में क्या लिखा है?"),
    art: [
      { k: "table", id: "chain", at: "a", title: t("The notice chain", "सूचना की श्रृंखला"), icon: "link", cols: [t("Copy", "कॉपी"), t("Venue", "स्थान"), t("Registration link?", "पंजीकरण लिंक?")], rows: [{ id: "orig", c: [t("Original source card", "मूल स्रोत कार्ड"), "Cedar Hall", t("none", "नहीं")] }, { id: "f1", c: [t("Forward 1", "फ़ॉरवर्ड 1"), "Maple Room", t("added", "जुड़ा")] }, { id: "f2", c: [t("Forward 2", "फ़ॉरवर्ड 2"), "Maple Room", t("none", "नहीं")] }] },
      { k: "doc", id: "office", at: "b", hide: true, look: "card", pic: "school", title: t("Office reply", "ऑफ़िस का जवाब"), toks: [{ id: "v", t: t("Venue confirmed: Cedar Hall", "स्थान पक्का: Cedar Hall"), icon: "check" }, { id: "d", t: t("Practice date unchanged", "अभ्यास की तारीख़ अपरिवर्तित"), icon: "calendar" }, { id: "l", t: t("No answer on who added the link", "लिंक किसने जोड़ा — इस पर कोई जवाब नहीं"), icon: "help" }] },
    ],
    sc: [
      { chain: { focus: true, mark: { orig: "ok" }, note: t("The earliest supplied card names Cedar Hall — later forwards sit beside it with their source labels visible", "सबसे पहला कार्ड Cedar Hall बताता है — बाद के फ़ॉरवर्ड स्रोत-लेबल के साथ उसके पास रखे हैं"), noteTone: "info" } },
      { chain: { mark: { orig: "ok", f1: "warn", f2: "warn" }, cell: { "f1:1": "risk", "f1:2": "risk", "f2:1": "risk" }, note: t("Two differences, marked separately — a shared heading can't tell us who inserted either", "दो फ़र्क़, अलग-अलग चिह्नित — साझा शीर्षक नहीं बताता कि किसने कौन-सा जोड़ा"), noteTone: "warn" } },
      { chain: { note: t("Record what each version actually says — a missing link on the original shows a difference, it doesn't identify the editor", "हर संस्करण में जो लिखा है वही दर्ज करें — मूल पर लिंक न होना फ़र्क़ दिखाता है, संपादक नहीं बताता"), noteTone: "info" } },
      { chain: { note: t("What should their correction say?", "उनके सुधार में क्या हो?"), noteTone: "info" }, office: { hide: true } },
      { office: { hide: false, focus: true, mark: { v: "ok", d: "ok", l: "warn" }, note: t("Confirmed: Cedar Hall, date unchanged. The link question stays unresolved — and Maple Room stays unconfirmed.", "पक्का: Cedar Hall, तारीख़ वही। लिंक वाला सवाल अनसुलझा — और Maple Room अप्रमाणित।"), noteTone: "ok" }, chain: { mark: { orig: "ok", f1: "risk", f2: "warn" }, focus: false } },
      { office: { focus: true } },
    ],
    out: {
      limited: { office: { hide: false, mark: { v: "ok", d: "ok", l: "warn" }, note: t("State the confirmed venue and date; leave the link unresolved", "पक्का स्थान और तारीख़ बताएँ; लिंक अनसुलझा छोड़ें"), noteTone: "ok" } },
      all: { chain: { mark: { f1: "risk", f2: "risk" }, note: t("The office reply doesn't approve the forward — it contradicts Maple Room", "ऑफ़िस का जवाब फ़ॉरवर्ड को मंज़ूर नहीं करता — वह Maple Room को ग़लत बताता है"), noteTone: "risk" } },
      blame: { chain: { mark: { f2: "risk" }, note: t("The last sender isn't proven to have created the link", "आख़िरी भेजने वाले ने लिंक बनाया — यह सिद्ध नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fraud-familiar-voice", scene: "night", layout: "two",
    label: t("A voice message that claims to be an older cousin", "बड़े कज़िन होने का दावा करता वॉइस संदेश"),
    art: [
      { k: "chat", id: "msg", at: "a", look: "call", who: t("'Older cousin'", "'बड़ा कज़िन'"), msgs: [{ from: "them", t: t("🎙 \"Vihaan, I need money right now. Don't tell any adults. Call me on this new number.\"", "🎙 \"विहान, मुझे अभी पैसे चाहिए। किसी बड़े को मत बताना। इस नए नंबर पर फ़ोन करो।\""), flag: "risk" }] },
      { k: "flow", id: "route", at: "b", hide: true, look: "graph", title: t("Which route is independent?", "कौन-सा रास्ता स्वतंत्र है?"), icon: "route", nodes: [{ id: "claim", t: t("The voice's request", "आवाज़ का अनुरोध"), icon: "mic", x: 50, y: 12 }, { id: "new", t: t("New callback number (supplied)", "नया कॉलबैक नंबर (दिया हुआ)"), icon: "phone", x: 18, y: 60 }, { id: "same", t: t("Same source answers", "वही स्रोत जवाब देता है"), icon: "user-x", x: 18, y: 90 }, { id: "dir", t: t("Family directory number", "परिवार की निर्देशिका का नंबर"), icon: "contact", x: 82, y: 60 }, { id: "adult", t: t("Adult checks with the cousin", "बड़ा कज़िन से जाँचता है"), icon: "user-ok", x: 82, y: 90 }], links: [{ from: "claim", to: "new" }, { from: "new", to: "same" }, { from: "claim", to: "dir" }, { from: "dir", to: "adult" }], link: { "claim>dir": "off", "dir>adult": "off" } },
    ],
    sc: [
      { msg: { focus: true, note: t("Recognising the voice builds confidence — but the recording gives no independent identity evidence", "आवाज़ पहचानना भरोसा बनाता है — पर रिकॉर्डिंग स्वतंत्र पहचान-सबूत नहीं देती"), noteTone: "warn" } },
      { msg: { note: t("'Don't involve adults' is an isolation request — a person can seek support without a reason", "'बड़ों को मत बताओ' अलग-थलग करने का अनुरोध है — मदद माँगने के लिए किसी वजह की ज़रूरत नहीं"), noteTone: "risk" } },
      { route: { hide: false, focus: true, link: { "claim>new": "on", "new>same": "on", "claim>dir": "on", "dir>adult": "on" }, state: { new: "risk", same: "risk", dir: "ok", adult: "ok" }, note: t("The directory route is independent; glitches or accents can't prove whether a voice is synthetic", "निर्देशिका वाला रास्ता स्वतंत्र है; गड़बड़ी या लहजा साबित नहीं करते कि आवाज़ कृत्रिम है या नहीं"), noteTone: "info" }, msg: { focus: false, note: undefined } },
      { route: { note: t("Which response supports Vihaan best?", "विहान की सबसे अच्छी मदद कौन-सी प्रतिक्रिया है?"), noteTone: "info" } },
      { route: { link: { "claim>new": "off", "new>same": "off", "claim>dir": "on", "dir>adult": "on" }, state: { new: "muted", same: "muted", dir: "ok", adult: "ok" }, note: t("In the callback record the cousin answers through the known route and denies asking for money", "कॉलबैक रिकॉर्ड में कज़िन जाने-पहचाने रास्ते से जवाब देता है और पैसे माँगने से मना करता है"), noteTone: "ok" } },
      { route: { focus: true } },
    ],
    out: {
      known: { route: { hide: false, link: { "claim>new": "off", "new>same": "off", "claim>dir": "on", "dir>adult": "on" }, state: { new: "muted", same: "muted", dir: "ok", adult: "ok" }, note: t("Pause and ask the adult to check through the existing family contact", "रुकें और बड़े से मौजूदा पारिवारिक संपर्क से जँचवाएँ"), noteTone: "ok" } },
      new: { route: { hide: false, link: { "claim>new": "on", "new>same": "on", "claim>dir": "off", "dir>adult": "off" }, state: { new: "risk", same: "risk" }, note: t("The supplied number lets the same source answer itself", "दिया हुआ नंबर वही स्रोत ख़ुद को जवाब देने देता है"), noteTone: "risk" } },
      glitch: { route: { hide: false, state: { claim: "risk" }, note: t("Listening for glitches can't decide identity", "गड़बड़ी सुनकर पहचान तय नहीं हो सकती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fraud-audition-app", scene: "night", layout: "two",
    label: t("A Lantern Stage audition · install an app first?", "लैंटर्न स्टेज ऑडिशन · पहले ऐप इंस्टॉल करें?"),
    art: [
      { k: "doc", id: "brief", at: "a", look: "form", pic: "film", title: t("Audition brief", "ऑडिशन का ब्योरा"), sub: t("What is actually needed", "असल में क्या चाहिए"), toks: [{ id: "idea", t: t("A teacher-submitted text idea", "टीचर द्वारा जमा किया पाठ का विचार"), icon: "pencil" }, { id: "app", t: t("Install the Lantern app", "लैंटर्न ऐप इंस्टॉल करें"), icon: "download" }] , mark: { idea: "ok" } },
      { k: "sw", id: "perm", at: "b", hide: true, title: t("What the installer asks for", "इंस्टॉलर क्या माँगता है"), icon: "shield-alert", rows: [{ id: "cont", t: t("Contacts → the saved address book", "संपर्क → सहेजी पता-पुस्तिका"), icon: "contact", on: false }, { id: "mic", t: t("Microphone → captured audio", "माइक्रोफ़ोन → रिकॉर्ड हुई आवाज़"), icon: "mic", on: false }, { id: "notif", t: t("Read notifications → their contents", "सूचनाएँ पढ़ना → उनकी सामग्री"), icon: "bell", on: false }], meter: { t: t("What it could expose", "यह क्या उजागर कर सकता है"), v: 4, tone: "ok", lo: t("nothing", "कुछ नहीं"), hi: t("my private life", "मेरा निजी जीवन") } },
    ],
    sc: [
      { brief: { focus: true, note: t("Vihaan separates the opportunity from the conditions — review the paper screens", "विहान अवसर को शर्तों से अलग करता है — काग़ज़ी स्क्रीन देखें"), noteTone: "info" } },
      { perm: { hide: false, focus: true, on: { cont: true, mic: true, notif: true }, meter: { t: t("What it could expose", "यह क्या उजागर कर सकता है"), v: 90, tone: "risk", lo: t("nothing", "कुछ नहीं"), hi: t("my private life", "मेरा निजी जीवन") }, note: t("The brief needs only a teacher-submitted idea — the installer asks for far more", "ब्योरे को सिर्फ़ टीचर का जमा किया विचार चाहिए — इंस्टॉलर बहुत ज़्यादा माँगता है"), noteTone: "risk" }, brief: { focus: false, mark: { idea: "ok", app: "warn" } } },
      { perm: { note: t("Each capability opens a different window onto the device — contacts, audio, notification contents", "हर क्षमता डिवाइस की अलग खिड़की खोलती है — संपर्क, आवाज़, सूचनाओं की सामग्री"), noteTone: "info" } },
      { perm: { note: t("What should Aditi do with the installer proposal?", "आदिति इंस्टॉलर के प्रस्ताव का क्या करे?"), noteTone: "info" } },
      { perm: { on: { cont: false, mic: false, notif: false }, meter: { t: t("What it could expose", "यह क्या उजागर कर सकता है"), v: 4, tone: "ok", lo: t("nothing", "कुछ नहीं"), hi: t("my private life", "मेरा निजी जीवन") }, note: t("The coordinator says the partnership isn't verified — record that limit; don't declare who made the offer", "समन्वयक कहता है साझेदारी प्रमाणित नहीं — वह सीमा दर्ज करें; यह न कहें कि ऑफ़र किसने बनाया"), noteTone: "ok" } },
      { perm: { focus: true } },
    ],
    out: {
      pause: { perm: { hide: false, on: { cont: false, mic: false, notif: false }, meter: { t: t("What it could expose", "यह क्या उजागर कर सकता है"), v: 4, tone: "ok", lo: t("nothing", "कुछ नहीं"), hi: t("my private life", "मेरा निजी जीवन") }, note: t("Pause and check the organiser through the known coordinator", "रुकें और जाने-पहचाने समन्वयक से आयोजक को जाँचें"), noteTone: "ok" } },
      grant: { perm: { hide: false, on: { cont: true, mic: true, notif: true }, meter: { t: t("What it could expose", "यह क्या उजागर कर सकता है"), v: 95, tone: "risk", lo: t("nothing", "कुछ नहीं"), hi: t("my private life", "मेरा निजी जीवन") }, note: t("A professional look isn't evidence of the organiser", "पेशेवर रूप आयोजक का सबूत नहीं"), noteTone: "risk" } },
      reviews: { brief: { mark: { app: "risk" }, note: t("Testimonials supplied by the offer are its own claims", "ऑफ़र के अपने दिए प्रशंसापत्र उसके अपने दावे हैं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fraud-payment-record", scene: "market", layout: "two",
    label: t("A payment image vs the provider's record", "भुगतान की तस्वीर बनाम प्रदाता का रिकॉर्ड"),
    art: [
      { k: "screen", id: "img", at: "a", look: "phone", blocks: [{ id: "ban", type: "banner", t: t("PAYMENT SUCCESSFUL", "भुगतान सफल"), sub: t("₹ 750 · reference B22", "₹ 750 · संदर्भ B22"), icon: "check" }, { id: "n", type: "text", t: t("An image — it gives no access to the recipient's provider", "एक तस्वीर — यह प्राप्तकर्ता के प्रदाता तक पहुँच नहीं देती") }] },
      { k: "ledger", id: "led", at: "b", hide: true, title: t("The provider ledger (paper)", "प्रदाता की बही (काग़ज़ी)"), icon: "receipt", lines: [{ id: "b22", t: t("B22 · pending", "B22 · लंबित"), amt: "₹ 750", dir: "hold" }, { id: "b21", t: t("B21 · completed", "B21 · पूरा"), amt: "+₹ 480", dir: "in" }, { id: "b24", t: t("B24 · completed", "B24 · पूरा"), amt: "+₹ 220", dir: "in" }, { id: "b23a", t: t("B23 · credit", "B23 · जमा"), amt: "+₹ 320", dir: "in" }, { id: "b23b", t: t("B23 · reversal", "B23 · वापसी"), amt: "−₹ 320", dir: "out" }], upTo: 1 },
    ],
    sc: [
      { img: { focus: true, mark: { ban: "warn" }, note: t("The image claims ₹750 under B22 with a success banner — Aditi records it as a claim", "तस्वीर B22 के तहत ₹750 और सफलता का बैनर दिखाती है — आदिति इसे दावा दर्ज करती है"), noteTone: "warn" } },
      { led: { hide: false, upTo: 1, focus: true, mark: { b22: "warn" }, note: t("The known provider record lists B22 as pending, not completed — no prediction about when it might change", "जाने-पहचाने प्रदाता रिकॉर्ड में B22 लंबित है, पूरा नहीं — कब बदलेगा, इसका कोई अनुमान नहीं"), noteTone: "warn" }, img: { focus: false, note: undefined } },
      { led: { upTo: 1, mark: { b22: "warn" }, note: t("Matching reference and amount identifies the row — pending stays unconfirmed. Keep the sender's claim beside the conflicting status.", "संदर्भ और रक़म मिलने से पंक्ति पहचानी जाती है — लंबित अपुष्ट ही रहता है। भेजने वाले का दावा टकराती स्थिति के पास रखें।"), noteTone: "info" } },
      { led: { upTo: 1, note: t("What should happen before releasing the reservation?", "आरक्षण छोड़ने से पहले क्या हो?"), noteTone: "info" } },
      { led: { upTo: 5, mark: { b22: "warn", b21: "ok", b24: "ok", b23a: "info", b23b: "info" }, total: { t: t("Net confirmed credits", "कुल पुष्ट जमा"), v: "₹ 700" }, note: t("B21 + B24 = 480 + 220 = ₹700 confirmed; B23's credit and equal reversal cancel", "B21 + B24 = 480 + 220 = ₹700 पुष्ट; B23 की जमा और बराबर वापसी कट जाती हैं"), noteTone: "ok" } },
      { led: { focus: true } },
    ],
    out: {
      provider: { led: { hide: false, upTo: 1, mark: { b22: "warn" }, note: t("With the teacher, check the matching record through known provider support", "टीचर के साथ, जाने-पहचाने प्रदाता सपोर्ट से मेल खाता रिकॉर्ड जाँचें"), noteTone: "ok" } },
      image: { img: { mark: { ban: "risk" }, note: t("A screenshot isn't a receipt", "स्क्रीनशॉट रसीद नहीं है"), noteTone: "risk" } },
      fraud: { led: { hide: false, upTo: 1, mark: { b22: "risk" }, note: t("A status difference doesn't prove who is guilty", "स्थिति का फ़र्क़ यह साबित नहीं करता कि दोषी कौन है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fraud-changing-basket", scene: "market", layout: "two",
    label: t("Sketch kits · ₹240 each · the basket changes", "स्केच किट · ₹240 प्रति · बास्केट बदलती है"),
    art: [
      { k: "ledger", id: "basket", at: "a", title: t("The basket", "बास्केट"), icon: "cart", lines: [{ id: "kits", t: t("3 sketch kits × ₹240", "3 स्केच किट × ₹240"), amt: "₹ 720", dir: "out" }, { id: "del", t: t("Delivery (mandatory)", "डिलीवरी (अनिवार्य)"), amt: "₹ 45", dir: "out" }, { id: "han", t: t("Handling (mandatory)", "हैंडलिंग (अनिवार्य)"), amt: "₹ 15", dir: "out" }, { id: "pouch", t: t("Storage pouch (optional, pre-ticked)", "स्टोरेज पाउच (वैकल्पिक, पहले से टिक)"), amt: "₹ 90", dir: "out" }], upTo: 1, total: { t: t("Headline unit price", "विज्ञापित इकाई मूल्य"), v: "₹ 240" } },
    ],
    sc: [
      { basket: { upTo: 1, focus: true, note: t("A unit price of ₹240 — leave space for quantity and charges before the final bill", "इकाई मूल्य ₹240 — अंतिम बिल से पहले मात्रा और शुल्क के लिए जगह रखें"), noteTone: "info" } },
      { basket: { upTo: 3, total: { t: t("Subtotal + mandatory", "उप-योग + अनिवार्य"), v: "₹ 780" }, mark: { del: "info", han: "info" }, note: t("3 kits = 720, plus mandatory 45 and 15 = ₹780. No other charge or discount applies.", "3 किट = 720, साथ में अनिवार्य 45 और 15 = ₹780। कोई और शुल्क या छूट नहीं।"), noteTone: "ok" } },
      { basket: { upTo: 4, total: { t: t("With the pouch", "पाउच के साथ"), v: "₹ 870" }, mark: { pouch: "warn" }, note: t("A pouch for the whole basket is already selected — a ticked box shows state, not a deliberate choice", "पूरी बास्केट के लिए पाउच पहले से चुना है — टिक का डिब्बा अवस्था दिखाता है, सोचा-समझा चुनाव नहीं"), noteTone: "warn" } },
      { basket: { upTo: 4, total: { t: t("Headline vs checkout", "विज्ञापन बनाम चेकआउट"), v: "₹ 240 vs ₹ 870" }, note: t("What fits a checkout that differs from the headline?", "विज्ञापन से अलग चेकआउट पर क्या ठीक है?"), noteTone: "info" } },
      { basket: { upTo: 3, total: { t: t("After removing the pouch", "पाउच हटाने के बाद"), v: "₹ 780" }, mark: { pouch: "gone" }, note: t("Mandatory charges stay — their terms haven't changed; check the total matches", "अनिवार्य शुल्क रहते हैं — उनकी शर्तें नहीं बदलीं; जाँचें कि कुल मेल खाता है"), noteTone: "ok" } },
      { basket: { focus: true } },
    ],
    out: {
      review: { basket: { upTo: 3, total: { t: t("Reconciled", "मिलान हुआ"), v: "₹ 780" }, mark: { pouch: "gone" }, note: t("Pause, reconcile every line, decide about the pouch with the teacher", "रुकें, हर पंक्ति मिलाएँ, पाउच पर टीचर के साथ तय करें"), noteTone: "ok" } },
      headline: { basket: { upTo: 4, total: { t: t("You'd actually owe", "असल में देना होगा"), v: "₹ 870" }, mark: { pouch: "risk" }, note: t("The checkout, not the headline, is what's charged", "लगता चेकआउट का रक़म है, विज्ञापन की नहीं"), noteTone: "risk" } },
      illegal: { basket: { upTo: 4, mark: { pouch: "warn" }, note: t("A difference needs checking, not an automatic verdict", "फ़र्क़ की जाँच चाहिए, अपने-आप फ़ैसला नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fraud-cashout-wall", scene: "market", layout: "two",
    label: t("A trading-game screen · the balance and the cash-out wall", "ट्रेडिंग-गेम स्क्रीन · बैलेंस और कैश-आउट की दीवार"),
    art: [
      { k: "screen", id: "game", at: "a", look: "phone", blocks: [{ id: "bal", type: "price", t: t("Balance (supplied screen data)", "बैलेंस (दी हुई स्क्रीन-जानकारी)"), sub: t("₹ 4,200", "₹ 4,200") }, { id: "tst", type: "row", t: t("'I withdrew ₹3,000!' ×4", "'मैंने ₹3,000 निकाले!' ×4"), sub: t("same wording, same picture", "वही शब्द, वही तस्वीर"), icon: "users" }, { id: "wd", type: "btn", t: t("Withdraw", "निकालें"), icon: "banknote" }] },
      { k: "ledger", id: "rec", at: "b", hide: true, title: t("Recipient-side provider records", "प्राप्तकर्ता-पक्ष के प्रदाता रिकॉर्ड"), icon: "receipt", lines: [{ id: "fee", t: t("'Release fee' demanded", "'रिलीज़ फ़ीस' माँगी गई"), amt: "−₹ 600", dir: "out", sub: t("a new payment request — not a cash-out", "नया भुगतान अनुरोध — कैश-आउट नहीं") }, { id: "w", t: t("A completed withdrawal", "पूरा हुआ निकासी"), amt: "—", dir: "in", sub: t("no entry", "कोई प्रविष्टि नहीं") }], total: { t: t("Confirmed received", "पुष्ट प्राप्त"), v: "₹ 0" } },
    ],
    sc: [
      { game: { focus: true, note: t("Vihaan watches the balance climb; Aditi asks what that number represents — nobody trades or connects accounts", "विहान बैलेंस बढ़ता देखता है; आदिति पूछती है वह संख्या क्या दर्शाती है — कोई ट्रेड या अकाउंट नहीं जोड़ता"), noteTone: "info" } },
      { game: { mark: { tst: "warn" }, note: t("Repeated testimonials share wording and picture — group them; copies aren't independent witnesses", "दोहराए प्रशंसापत्रों के शब्द और तस्वीर एक-से हैं — उन्हें समूह में रखें; प्रतियाँ स्वतंत्र गवाह नहीं"), noteTone: "warn" } },
      { game: { mark: { tst: "warn", wd: "risk" }, note: t("The withdrawal panel now wants ₹600 before releasing the balance — a new payment request, not a completed cash-out", "निकासी पैनल अब बैलेंस छोड़ने से पहले ₹600 माँगता है — नया भुगतान अनुरोध, पूरा हुआ कैश-आउट नहीं"), noteTone: "risk" } },
      { game: { note: t("How should the team respond to the cash-out fee?", "टीम कैश-आउट फ़ीस पर क्या करे?"), noteTone: "info" }, rec: { hide: true } },
      { rec: { hide: false, focus: true, mark: { fee: "warn", w: "info" }, note: t("No completed recipient-side withdrawal entry: confirmed received is ₹0 — take the evidence gap to a trusted adult", "प्राप्तकर्ता-पक्ष की कोई पूरी निकासी प्रविष्टि नहीं: पुष्ट प्राप्त ₹0 — सबूत की कमी भरोसेमंद बड़े को दिखाएँ"), noteTone: "ok" }, game: { focus: false } },
      { rec: { focus: true } },
    ],
    out: {
      help: { rec: { hide: false, mark: { fee: "warn", w: "info" }, note: t("Do not pay; take the evidence gap to a trusted adult", "भुगतान न करें; सबूत की कमी भरोसेमंद बड़े को दिखाएँ"), noteTone: "ok" } },
      fee: { rec: { hide: false, mark: { fee: "risk" }, total: { t: t("Sent so far", "अब तक भेजा"), v: "−₹ 600" }, note: t("Paying a fee 'to prove' it proves nothing — and adds exposure", "'साबित करने' के लिए फ़ीस देने से कुछ साबित नहीं होता — और जोखिम बढ़ता है"), noteTone: "risk" } },
      copy: { game: { mark: { tst: "risk" }, note: t("Repeated testimonials aren't proof of receipt", "दोहराए प्रशंसापत्र प्राप्ति का सबूत नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fraud-official-looking-call", scene: "night", layout: "two",
    label: t("A call with an agency badge · a calm, non-graphic example", "एजेंसी बैज वाली कॉल · एक शांत, बिना भयावह ब्योरे वाला उदाहरण"),
    art: [
      { k: "chat", id: "call", at: "a", look: "call", who: t("'Agency officer'", "'एजेंसी अधिकारी'"), msgs: [{ from: "them", t: t("This is an official matter. You must transfer money immediately to settle the case.", "यह एक सरकारी मामला है। मामला निपटाने को आपको तुरंत पैसे भेजने होंगे।"), flag: "risk" }] },
      { k: "flow", id: "arrows", at: "b", hide: true, look: "graph", title: t("Instructions that close support routes", "ऐसे निर्देश जो मदद के रास्ते बंद करते हैं"), icon: "x", nodes: [{ id: "me", t: "Aditi", icon: "user", x: 50, y: 50 }, { id: "fam", t: t("Family", "परिवार"), icon: "home", x: 14, y: 22 }, { id: "tea", t: t("Teachers", "टीचर"), icon: "school", x: 86, y: 22 }, { id: "caller", t: t("Caller: 'stay on the line'", "कॉल करने वाला: 'लाइन पर रहो'"), icon: "phone", x: 50, y: 88 }], links: [{ from: "me", to: "fam", t: t("don't tell", "मत बताओ") }, { from: "me", to: "tea", t: t("don't tell", "मत बताओ") }, { from: "caller", to: "me" }], link: { "me>fam": "bad", "me>tea": "bad", "caller>me": "on" }, state: { caller: "risk" } },
    ],
    sc: [
      { call: { focus: true, note: t("A badge and formal language are a claim — they don't independently identify an agency", "बैज और औपचारिक भाषा एक दावा है — वे किसी एजेंसी की स्वतंत्र पहचान नहीं कराते"), noteTone: "warn" } },
      { call: { msgs: [{ from: "them", t: t("This is an official matter. You must transfer money immediately to settle the case.", "यह एक सरकारी मामला है। मामला निपटाने को आपको तुरंत पैसे भेजने होंगे।"), flag: "risk" }, { from: "them", t: t("You have 10 minutes. The countdown has started.", "आपके पास 10 मिनट हैं। उल्टी गिनती शुरू हो चुकी है।"), flag: "risk" }], note: t("A countdown and an immediate transfer demand — Aditi may pause whenever she needs; nobody must stay on a call", "उल्टी गिनती और तुरंत भेजने की माँग — आदिति जब चाहे रुक सकती है; किसी को कॉल पर रुकना ज़रूरी नहीं"), noteTone: "info" } },
      { arrows: { hide: false, focus: true, note: t("'Don't tell family or teachers' and 'stay on the call' close support routes — they needn't be obeyed", "'परिवार या टीचर को मत बताओ' और 'कॉल पर रहो' मदद के रास्ते बंद करते हैं — इन्हें मानना ज़रूरी नहीं"), noteTone: "risk" }, call: { focus: false, note: undefined } },
      { arrows: { focus: false, note: t("What should Aditi do when the caller forbids help?", "कॉल करने वाला मदद से मना करे तो आदिति क्या करे?"), noteTone: "info" } },
      { arrows: { link: { "me>fam": "on", "me>tea": "on", "caller>me": "off" }, state: { fam: "ok", tea: "ok", caller: "muted", me: "ok" }, note: t("A separately verified official reporting route, with the teacher — the countdown disappears because the caller can't control it", "अलग से सत्यापित आधिकारिक रिपोर्टिंग रास्ता, टीचर के साथ — उल्टी गिनती ग़ायब, क्योंकि कॉल करने वाला उसे नियंत्रित नहीं कर सकता"), noteTone: "ok" } },
      { arrows: { focus: true } },
    ],
    out: {
      leave: { arrows: { hide: false, link: { "me>fam": "on", "me>tea": "on", "caller>me": "off" }, state: { fam: "ok", tea: "ok", caller: "muted", me: "ok" }, note: t("End the coercive call and go to a trusted adult independently", "ज़बरदस्ती वाली कॉल ख़त्म करें और स्वतंत्र रूप से भरोसेमंद बड़े के पास जाएँ"), noteTone: "ok" } },
      stay: { arrows: { hide: false, state: { caller: "risk", me: "risk" }, link: { "me>fam": "bad", "me>tea": "bad", "caller>me": "on" }, note: t("Waiting for the caller's permission keeps every support route closed", "कॉल करने वाले की इजाज़त का इंतज़ार हर मदद का रास्ता बंद रखता है"), noteTone: "risk" } },
      pay: { call: { msgs: [{ from: "them", t: t("This is an official matter. You must transfer money immediately to settle the case.", "यह एक सरकारी मामला है। मामला निपटाने को आपको तुरंत पैसे भेजने होंगे।"), flag: "risk" }, { from: "sys", t: t("Payment sent — the demand continues", "भुगतान भेजा — माँग जारी रहती है") }], note: t("Paying doesn't stop a countdown the caller controls", "भुगतान उस उल्टी गिनती को नहीं रोकता जो कॉल करने वाले के क़ाबू में है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class10-fraud-help-without-fees", scene: "classroom", layout: "two",
    label: t("After a disputed transfer · who should help, and how?", "विवादित हस्तांतरण के बाद · मदद कौन करे, और कैसे?"),
    art: [
      { k: "flow", id: "lanes", at: "a", look: "graph", title: t("Two separate help lanes", "मदद की दो अलग राहें"), icon: "route", nodes: [{ id: "inc", t: t("Incident: exposed access + a disputed transfer", "घटना: उजागर पहुँच + विवादित हस्तांतरण"), icon: "alert", x: 50, y: 12 }, { id: "prov", t: t("Provider lane — access protection", "प्रदाता राह — पहुँच-सुरक्षा"), icon: "lock", x: 20, y: 62 }, { id: "off", t: t("Official lane — 1930 / cybercrime.gov.in", "आधिकारिक राह — 1930 / cybercrime.gov.in"), icon: "siren", x: 80, y: 62 }, { id: "adult", t: t("Trusted adult", "भरोसेमंद बड़ा"), icon: "user-ok", x: 50, y: 92 }], links: [{ from: "inc", to: "prov" }, { from: "inc", to: "off" }, { from: "prov", to: "adult" }, { from: "off", to: "adult" }], link: { "inc>prov": "off", "inc>off": "off", "prov>adult": "off", "off>adult": "off" }, state: { inc: "now" } },
      { k: "doc", id: "seller", at: "b", hide: true, look: "note", pic: "alert", title: t("A 'recovery seller' appears", "एक 'रिकवरी विक्रेता' आता है"), toks: [{ id: "fee", t: t("Another fee, up front", "पहले एक और फ़ीस"), icon: "coins" }, { id: "code", t: t("A login code", "एक लॉगिन कोड"), icon: "key" }, { id: "prom", t: t("A 'guaranteed repayment' promise", "'पक्की वापसी' का वादा"), icon: "gift" }] },
    ],
    sc: [
      { lanes: { focus: true, note: t("Aditi separates access protection from financial reporting; Vihaan tells the teacher promptly — without waiting to identify the sender", "आदिति पहुँच-सुरक्षा को वित्तीय रिपोर्टिंग से अलग करती है; विहान भेजने वाले की पहचान का इंतज़ार किए बिना तुरंत टीचर को बताता है"), noteTone: "info" } },
      { seller: { hide: false, focus: true, mark: { fee: "risk", code: "risk", prom: "warn" }, note: t("The promise supplies no recovery evidence — and adds more exposure", "वादा रिकवरी का कोई सबूत नहीं देता — और जोखिम बढ़ाता है"), noteTone: "risk" }, lanes: { focus: false, note: undefined } },
      { lanes: { link: { "inc>prov": "on", "inc>off": "on", "prov>adult": "on", "off>adult": "on" }, state: { inc: "done", prov: "ok", off: "ok", adult: "ok" }, note: t("Known provider support, and India's official financial-fraud reporting (1930 or cybercrime.gov.in) — pursued promptly with a trusted adult", "जाना-पहचाना प्रदाता सपोर्ट, और भारत की आधिकारिक वित्तीय-धोखाधड़ी रिपोर्टिंग (1930 या cybercrime.gov.in) — भरोसेमंद बड़े के साथ तुरंत"), noteTone: "ok" } },
      { seller: { focus: false, note: t("How should they respond to the recovery seller?", "वे रिकवरी विक्रेता को क्या जवाब दें?"), noteTone: "info" } },
      { lanes: { state: { inc: "done", prov: "ok", off: "ok", adult: "ok" }, link: { "inc>prov": "on", "inc>off": "on", "prov>adult": "on", "off>adult": "on" }, note: t("Access concern → the provider lane; financial facts → the official lane; a private record, minimal and complete", "पहुँच की चिंता → प्रदाता राह; वित्तीय तथ्य → आधिकारिक राह; निजी रिकॉर्ड, छोटा और पूरा"), noteTone: "ok" }, seller: { mark: { fee: "gone", code: "gone", prom: "gone" } } },
      { lanes: { focus: true } },
    ],
    out: {
      known: { seller: { hide: false, mark: { fee: "gone", code: "gone", prom: "gone" }, note: t("Decline the fee and code; seek adult-assisted verified help promptly", "फ़ीस और कोड मना करें; बड़े की मदद से सत्यापित सहायता तुरंत लें"), noteTone: "ok" }, lanes: { link: { "inc>prov": "on", "inc>off": "on", "prov>adult": "on", "off>adult": "on" }, state: { prov: "ok", off: "ok", adult: "ok" } } },
      seller: { seller: { hide: false, mark: { fee: "risk", code: "risk", prom: "risk" }, note: t("A guaranteed promise removes no risk — the fee and code add some", "पक्का वादा कोई जोखिम नहीं हटाता — फ़ीस और कोड जोड़ते हैं"), noteTone: "risk" } },
      public: { seller: { hide: false, mark: { code: "risk" }, note: t("Publishing account details exposes them to everyone", "अकाउंट के ब्योरे प्रकाशित करना सबके सामने खोलना है"), noteTone: "risk" } },
    },
  },
];
