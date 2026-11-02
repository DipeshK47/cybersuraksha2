import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class8FraudWorlds: World[] = [
  {
    slug: "class8-fraud-hidden-price", scene: "market", layout: "two",
    label: t("A rare costume banner · paused before anyone clicks", "दुर्लभ पोशाक का बैनर · किसी के क्लिक से पहले रोका"),
    art: [
      { k: "screen", id: "banner", at: "a", look: "phone", blocks: [{ id: "prize", type: "banner", t: t("RARE COSTUME — you were specially selected!", "दुर्लभ पोशाक — आप ख़ास तौर पर चुने गए!"), icon: "gift" }, { id: "login", type: "field", t: t("School login", "स्कूल लॉगिन"), sub: t("required to continue", "आगे बढ़ने के लिए ज़रूरी") }, { id: "fee", type: "price", t: t("Small unlocking payment", "छोटा अनलॉक भुगतान"), sub: t("₹ 49", "₹ 49") }, { id: "timer", type: "text", t: t("⏱ Expires in 2:00 · Don't tell adults", "⏱ 2:00 में ख़त्म · बड़ों को न बताएँ") }] },
      { k: "doc", id: "card", at: "b", look: "form", pic: "clipboard", title: t("Meera's offer-check card", "मीरा का ऑफ़र-जाँच कार्ड"), sub: t("Two requested actions, one promise", "दो माँगी गई कार्रवाइयाँ, एक वादा"), toks: [{ id: "promise", t: t("Promise: a rare costume", "वादा: एक दुर्लभ पोशाक"), icon: "gift" }, { id: "a1", t: t("Asked: school login", "माँगा: स्कूल लॉगिन"), icon: "key" }, { id: "a2", t: t("Asked: unlocking payment", "माँगा: अनलॉक भुगतान"), icon: "coins" }, { id: "p1", t: t("Pressure: timer", "दबाव: टाइमर"), icon: "timer" }, { id: "p2", t: t("Pressure: secrecy", "दबाव: गोपनीयता"), icon: "eye-off" }], mark: { promise: "hl" } },
    ],
    sc: [
      { banner: { focus: true, mark: { prize: "warn" }, note: t("The imaginary screen is paused before anybody clicks — excitement can distract", "काल्पनिक स्क्रीन किसी के क्लिक से पहले रोकी — उत्साह ध्यान भटका सकता है"), noteTone: "info" }, card: { hide: true } },
      { card: { hide: false, mark: { promise: "hl", a1: "risk", a2: "risk" }, note: t("Neither the login nor the payment is needed just to examine the offer", "ऑफ़र जाँचने भर के लिए न लॉगिन चाहिए न भुगतान"), noteTone: "warn" }, banner: { focus: false, mark: { login: "risk", fee: "risk" } } },
      { card: { mark: { promise: "hl", a1: "risk", a2: "risk", p1: "warn", p2: "warn" }, note: t("A timer and 'tell no adults' are pressure tactics — a padlock or copied logo wouldn't prove who runs the page", "टाइमर और 'बड़ों को न बताओ' दबाव की चालें हैं — ताला या नक़ल लोगो पेज के मालिक का सबूत नहीं"), noteTone: "warn" }, banner: { mark: { login: "risk", fee: "risk", timer: "warn" } } },
      { card: { note: t("Which route should Meera choose?", "मीरा कौन-सा रास्ता चुने?"), noteTone: "info" } },
      { banner: { mark: { prize: "done", login: "hide", fee: "hide", timer: "hide" } }, card: { mark: { promise: "hl", a1: "gone", a2: "gone", p1: "gone", p2: "gone" }, note: t("Closed it, entered nothing, and her guardian checks the known service", "बंद किया, कुछ डाला नहीं, और अभिभावक जाने-पहचाने ऐप में जाँचते हैं"), noteTone: "ok" } },
      { card: { focus: true } },
    ],
    out: {
      pay: { banner: { mark: { fee: "press", login: "risk" }, note: t("A small fee is still money for a claim nobody checked", "छोटी फ़ीस भी बिना जाँचे दावे के लिए पैसा है"), noteTone: "risk" } },
      chat: { banner: { mark: { prize: "risk" }, note: t("Asking the banner's own helper lets the claim confirm itself", "बैनर के अपने मददगार से पूछना दावे को ख़ुद पुष्टि करने देना है"), noteTone: "risk" } },
      known: { banner: { mark: { prize: "done", login: "hide", fee: "hide", timer: "hide" }, note: t("Pause and check the known service with a guardian", "रुकें और अभिभावक के साथ जाने-पहचाने ऐप में जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-fraud-urgent-friend", scene: "market", layout: "two",
    label: t("A familiar profile asks for a folder and a voucher", "एक जानी-पहचानी प्रोफ़ाइल फ़ोल्डर और वाउचर माँगती है"),
    art: [
      { k: "chat", id: "msg", at: "a", look: "phone", who: t("Project partner? (profile)", "प्रोजेक्ट साथी? (प्रोफ़ाइल)"), msgs: [{ from: "them", t: t("Arjun, send me the private project folder and a voucher. NOW.", "अर्जुन, निजी प्रोजेक्ट फ़ोल्डर और एक वाउचर भेजो। अभी।"), flag: "risk" }, { from: "them", t: t("The teacher will be angry if you wait!", "रुके तो टीचर नाराज़ होंगी!"), flag: "warn" }] },
      { k: "table", id: "ev", at: "b", hide: true, title: t("Claims vs independent evidence", "दावे बनाम स्वतंत्र सबूत"), icon: "search", cols: [t("What we see", "जो दिखता है"), t("Independent?", "स्वतंत्र?")], rows: [{ id: "pic", c: [t("Picture and nickname match", "तस्वीर और उपनाम मेल खाते हैं"), "✗"] }, { id: "angry", c: [t("\"Teacher will be angry\"", "\"टीचर नाराज़ होंगी\""), "✗"] }, { id: "same", c: [t("Asking the same account", "उसी अकाउंट से पूछना"), "✗"] }, { id: "known", c: [t("A previously known contact route, with an adult", "पहले से जाना संपर्क रास्ता, बड़े के साथ"), "✓"] }] },
    ],
    sc: [
      { msg: { focus: true, note: t("The folder holds other pupils' work; the voucher moves value", "फ़ोल्डर में और विद्यार्थियों का काम है; वाउचर पैसा हिलाता है"), noteTone: "warn" } },
      { ev: { hide: false, mark: { pic: "warn" }, note: t("A copied profile, or an account someone else controls, could send the same request", "नक़ल प्रोफ़ाइल या किसी और के क़ाबू वाला अकाउंट यही अनुरोध भेज सकता है"), noteTone: "warn" }, msg: { focus: false, note: undefined } },
      { ev: { mark: { pic: "warn", angry: "warn", same: "risk" }, note: t("Pressure isn't evidence — and the same account would just repeat the claim", "दबाव सबूत नहीं — और वही अकाउंट सिर्फ़ दावा दोहराएगा"), noteTone: "risk" } },
      { ev: { mark: {}, note: t("How should Arjun check the request?", "अर्जुन अनुरोध की जाँच कैसे करे?"), noteTone: "info" } },
      { ev: { mark: { known: "ok", same: "gone", angry: "gone", pic: "gone" }, note: t("The real friend denies sending it — stop responding, tell a trusted teacher", "असली दोस्त मना करता है — जवाब बंद करें, भरोसेमंद टीचर को बताएँ"), noteTone: "ok" } },
      { ev: { focus: true } },
    ],
    out: {
      send: { ev: { mark: { angry: "risk" }, note: t("Sending first to avoid anger is exactly the pressure working", "ग़ुस्से से बचने को पहले भेजना ठीक वही दबाव है जो काम कर गया"), noteTone: "risk" } },
      same: { ev: { mark: { same: "risk" }, note: t("Whoever controls that account can promise anything", "जिसके क़ाबू में वह अकाउंट है वह कुछ भी वादा कर सकता है"), noteTone: "risk" } },
      call: { ev: { mark: { known: "ok", same: "gone", angry: "gone", pic: "gone" }, note: t("A previously known route, with adult help", "पहले से जाना रास्ता, बड़े की मदद के साथ"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-fraud-code-purpose", scene: "market", layout: "two",
    label: t("Role-play call · 'account support' wants a code", "रोल-प्ले कॉल · 'अकाउंट सपोर्ट' को कोड चाहिए"),
    art: [
      { k: "chat", id: "call", at: "a", look: "call", who: t("'Account support'", "'अकाउंट सपोर्ट'"), msgs: [{ from: "them", t: t("Your school account closes unless you read out your login code.", "आपका स्कूल अकाउंट बंद हो जाएगा जब तक आप अपना लॉगिन कोड न बोलें।"), flag: "risk" }] },
      { k: "table", id: "cards", at: "b", title: t("Three labelled secrets", "तीन लेबल वाले रहस्य"), icon: "key", cols: [t("Secret", "रहस्य"), t("What it does", "यह क्या करता है")], rows: [{ id: "pw", c: [t("Password", "पासवर्ड"), t("protects account access", "अकाउंट की पहुँच बचाता है")] }, { id: "otp", c: ["OTP", t("confirms one action for a short time", "थोड़े समय के लिए एक कार्रवाई की पुष्टि करता है")] }, { id: "pin", c: ["UPI PIN", t("authorises payment actions", "भुगतान की कार्रवाइयों को अधिकृत करता है")] }] },
    ],
    sc: [
      { call: { focus: true, note: t("Kavya's role-play: no real account or code appears anywhere", "काव्या की रोल-प्ले: कहीं कोई असली अकाउंट या कोड नहीं"), noteTone: "info" } },
      { cards: { mark: { pw: "info", otp: "info", pin: "info" }, note: t("Calling all three 'a code' hides that each one does something different", "तीनों को 'कोड' कहने से छिपता है कि हर एक अलग काम करता है"), noteTone: "warn" }, call: { focus: false, note: undefined } },
      { cards: { mark: { otp: "risk" }, note: t("The notification says this OTP is for signing in — sharing it lets someone else complete that sign-in", "सूचना कहती है यह OTP साइन-इन के लिए है — साझा करने से कोई और वह साइन-इन पूरा कर सकता है"), noteTone: "risk" } },
      { cards: { mark: {}, note: t("How should Kavya respond to the caller?", "काव्या फ़ोन करने वाले को क्या जवाब दे?"), noteTone: "info" } },
      { call: { msgs: [{ from: "them", t: t("Your school account closes unless you read out your login code.", "आपका स्कूल अकाउंट बंद हो जाएगा जब तक आप अपना लॉगिन कोड न बोलें।"), flag: "risk" }, { from: "sys", t: t("Call ended · known support, with an adult", "कॉल ख़त्म · जाना-पहचाना सपोर्ट, बड़े के साथ") }] }, cards: { mark: { otp: "ok" }, note: t("A code she starts herself on the verified page matches her own action", "जो कोड वह ख़ुद सत्यापित पेज पर शुरू करती है वह उसकी अपनी कार्रवाई से मेल खाता है"), noteTone: "ok" } },
      { call: { focus: true } },
    ],
    out: {
      read: { cards: { mark: { otp: "risk" }, note: t("The caller's claimed job doesn't change the code's purpose", "फ़ोन करने वाले का बताया काम कोड का उद्देश्य नहीं बदलता"), noteTone: "risk" } },
      image: { cards: { mark: { otp: "risk" }, note: t("A screenshot of the code shares the same secret", "कोड का स्क्रीनशॉट वही रहस्य साझा करता है"), noteTone: "risk" } },
      end: { call: { msgs: [{ from: "them", t: t("Your school account closes unless you read out your login code.", "आपका स्कूल अकाउंट बंद हो जाएगा जब तक आप अपना लॉगिन कोड न बोलें।"), flag: "risk" }, { from: "sys", t: t("Call ended · known support, with an adult", "कॉल ख़त्म · जाना-पहचाना सपोर्ट, बड़े के साथ") }] }, cards: { mark: { otp: "ok" }, note: t("End the call and use known support", "कॉल ख़त्म करें और जाना-पहचाना सपोर्ट लें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-fraud-payment-direction", scene: "market", layout: "two",
    label: t("A 'refund' QR card · read what the screen does", "'रिफ़ंड' QR कार्ड · स्क्रीन क्या करती है पढ़ें"),
    art: [
      { k: "chat", id: "buyer", at: "a", look: "phone", who: t("Buyer", "ख़रीदार"), msgs: [{ from: "them", t: t("I'll refund you! Scan this and enter your UPI PIN to receive the money.", "मैं रिफ़ंड दूँगी! पैसे पाने के लिए यह स्कैन करें और अपना UPI PIN डालें।"), flag: "warn" }] },
      { k: "ledger", id: "screen", at: "b", title: t("The paper screen says…", "काग़ज़ी स्क्रीन कहती है…"), icon: "receipt", lines: [{ id: "act", t: t("Pay merchant", "व्यापारी को भुगतान"), amt: "−₹60", dir: "out", sub: t("from aunt's wallet → merchant", "मौसी के वॉलेट से → व्यापारी को") }], total: { t: t("Direction", "दिशा"), v: t("OUT", "बाहर") } },
    ],
    sc: [
      { buyer: { focus: true, note: t("Dev reads the paper screen instead of the promise", "देव वादे की जगह काग़ज़ी स्क्रीन पढ़ता है"), noteTone: "info" } },
      { screen: { focus: true, mark: { act: "risk" }, note: t("The message says 'receive' — the screen says 'pay'. The arrow points away from the aunt.", "संदेश कहता है 'पाना' — स्क्रीन कहती है 'भुगतान'। तीर मौसी से दूर जाता है।"), noteTone: "risk" }, buyer: { focus: false } },
      { screen: { note: t("A UPI PIN authorises payments — receiving money never needs it. Dev doesn't scan, enter a PIN or 'test with a small amount'.", "UPI PIN भुगतान अधिकृत करता है — पैसे पाने में उसकी ज़रूरत नहीं। देव स्कैन नहीं करता, PIN नहीं डालता, 'छोटी रक़म से परखता' भी नहीं।"), noteTone: "info" } },
      { screen: { note: t("What should Dev recommend?", "देव क्या सुझाव दे?"), noteTone: "info" } },
      { screen: { mark: { act: "gone" }, note: t("Cancelled — the aunt checks the original transaction through her known provider", "रद्द — मौसी असली लेन-देन अपने जाने-पहचाने प्रदाता से जाँचती हैं"), noteTone: "ok" } },
      { screen: { focus: true } },
    ],
    out: {
      approve: { screen: { mark: { act: "press" }, total: { t: t("Direction", "दिशा"), v: t("OUT −₹60", "बाहर −₹60") }, note: t("Approving a 'pay' screen sends money out", "'भुगतान' स्क्रीन मंज़ूर करना पैसा बाहर भेजना है"), noteTone: "risk" } },
      send: { buyer: { mark: {}, note: t("A PIN sent to a stranger authorises their payments", "अजनबी को भेजा PIN उनके भुगतान अधिकृत करता है"), noteTone: "risk" }, screen: { mark: { act: "risk" } } },
      cancel: { screen: { mark: { act: "gone" }, note: t("Cancel; check with the known provider", "रद्द करें; जाने-पहचाने प्रदाता से जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-fraud-screen-control", scene: "market", layout: "two",
    label: t("A pop-up wants Riya to share her screen", "एक पॉप-अप चाहता है कि रिया स्क्रीन साझा करे"),
    art: [
      { k: "screen", id: "pop", at: "a", look: "laptop", url: [{ t: "classroom role-play" }], blocks: [{ id: "w", type: "popup", t: t("INFECTIONS FOUND — do not close!", "संक्रमण मिले — बंद न करें!"), sub: t("Call support: 0000-FAKE", "सपोर्ट को फ़ोन: 0000-FAKE"), icon: "siren" }, { id: "inst", type: "btn", t: t("Install remote access", "रिमोट एक्सेस इंस्टॉल करें"), icon: "download" }] },
      { k: "sw", id: "impact", at: "b", title: t("Access-impact note", "पहुँच-प्रभाव नोट"), icon: "shield-alert", rows: [{ id: "view", t: t("Share screen (they can see messages)", "स्क्रीन साझा (वे संदेश देख सकते हैं)"), icon: "eye", on: false }, { id: "ctl", t: t("Remote control (they operate the device)", "रिमोट कंट्रोल (वे डिवाइस चलाते हैं)"), icon: "mouse", on: false }, { id: "inst", t: t("Install a tool", "एक टूल इंस्टॉल"), icon: "download", on: false }], meter: { t: t("What a stranger could reach", "अजनबी किस तक पहुँच सकता है"), v: 3, tone: "ok", lo: t("nothing", "कुछ नहीं"), hi: t("my device", "मेरा डिवाइस") } },
    ],
    sc: [
      { pop: { focus: true, note: t("The pop-up's own claims haven't been independently checked", "पॉप-अप के अपने दावे स्वतंत्र रूप से जाँचे नहीं गए"), noteTone: "warn" } },
      { impact: { on: { view: true, ctl: true, inst: true }, meter: { t: t("What a stranger could reach", "अजनबी किस तक पहुँच सकता है"), v: 92, tone: "risk", lo: t("nothing", "कुछ नहीं"), hi: t("my device", "मेरा डिवाइस") }, note: t("If she agreed: they'd see her messages and could operate the device", "अगर वह मान लेती: वे उसके संदेश देखते और डिवाइस चला सकते"), noteTone: "risk" }, pop: { focus: false } },
      { impact: { on: { view: false, ctl: false, inst: false }, meter: { t: t("What a stranger could reach", "अजनबी किस तक पहुँच सकता है"), v: 3, tone: "ok", lo: t("nothing", "कुछ नहीं"), hi: t("my device", "मेरा डिवाइस") }, note: t("No need to catch the caller or test the install — stop responding, and don't click inside the warning", "कॉल करने वाले को पकड़ने या इंस्टॉल आज़माने की ज़रूरत नहीं — जवाब बंद करें, चेतावनी के भीतर क्लिक न करें"), noteTone: "ok" } },
      { impact: { on: { view: false, ctl: false, inst: false }, note: t("Which support plan should Riya choose?", "रिया कौन-सी सहायता योजना चुने?"), noteTone: "info" } },
      { pop: { mark: { w: "hide", inst: "hide" } }, impact: { note: t("She refuses and hands over the device; the teacher closes the warning and calls known school support", "वह मना करती है और डिवाइस सौंपती है; टीचर चेतावनी बंद कर जाने-पहचाने स्कूल सपोर्ट को बुलाती हैं"), noteTone: "ok" } },
      { impact: { focus: true } },
    ],
    out: {
      accept: { pop: { mark: { inst: "press", w: "risk" } }, impact: { on: { view: true, ctl: true, inst: true }, meter: { t: t("What a stranger could reach", "अजनबी किस तक पहुँच सकता है"), v: 92, tone: "risk", lo: t("nothing", "कुछ नहीं"), hi: t("my device", "मेरा डिवाइस") }, note: t("A 'free inspection' is the access itself", "'मुफ़्त जाँच' ही पहुँच देना है"), noteTone: "risk" } },
      argue: { pop: { mark: { w: "risk" } }, impact: { on: { view: true }, meter: { t: t("What a stranger could reach", "अजनबी किस तक पहुँच सकता है"), v: 45, tone: "warn", lo: t("nothing", "कुछ नहीं"), hi: t("my device", "मेरा डिवाइस") }, note: t("Staying connected to 'investigate' continues the interaction", "'जाँचने' के लिए जुड़े रहना बातचीत जारी रखना है"), noteTone: "risk" } },
      teacher: { pop: { mark: { w: "hide", inst: "hide" } }, impact: { on: { view: false, ctl: false, inst: false }, note: t("Refuse access and ask the teacher for known support", "पहुँच मना करें और टीचर से जाना-पहचाना सपोर्ट माँगें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-fraud-seller-evidence", scene: "market", layout: "one",
    label: t("Two invented kit offers · Noor compares", "दो काल्पनिक किट ऑफ़र · नूर तुलना करती है"),
    art: [
      { k: "table", id: "cmp", title: t("Offer A vs offer B", "ऑफ़र A बनाम ऑफ़र B"), icon: "scale", cols: [t("Detail", "ब्योरा"), t("A (cheap)", "A (सस्ता)"), t("B (costs more)", "B (ज़्यादा क़ीमत)")],
        rows: [{ id: "rev", c: [t("Reviews", "समीक्षाएँ"), t("thousands", "हज़ारों"), t("few", "कम")] }, { id: "addr", c: [t("Seller address", "विक्रेता का पता"), t("— none —", "— कोई नहीं —"), t("given (a claim)", "दिया (एक दावा)")] }, { id: "ret", c: [t("Return period", "वापसी अवधि"), t("— none —", "— कोई नहीं —"), t("given (a claim)", "दिया (एक दावा)")] }, { id: "ship", c: [t("Delivery charges", "डिलीवरी शुल्क"), t("not explained", "समझाए नहीं"), t("explained", "समझाए")] }, { id: "host", c: [t("Hostname", "होस्टनाम"), "kit-deals.example", "club-kits.example"] }], upTo: 1 },
    ],
    sc: [
      { cmp: { upTo: 1, focus: true, note: t("A is cheap with thousands of reviews; B costs more but has return terms", "A सस्ता है, हज़ारों समीक्षाओं के साथ; B महँगा है पर वापसी शर्तें हैं"), noteTone: "info" } },
      { cmp: { upTo: 5, mark: { addr: "warn", ret: "warn", ship: "warn" }, cell: { "addr:1": "risk", "ret:1": "risk", "ship:1": "risk" }, note: t("More information makes checking possible — it doesn't guarantee an order will arrive", "ज़्यादा जानकारी जाँच संभव बनाती है — ऑर्डर पहुँचने की गारंटी नहीं"), noteTone: "info" } },
      { cmp: { upTo: 5, txt: { "rev:1": t("many repeat identical sentences", "कई एक-जैसे वाक्य दोहराती हैं") }, cell: { "rev:1": "warn" }, note: t("Repeats weaken the reviews without proving all are fake; a logo and HTTPS don't show the operator either", "दोहराव समीक्षाएँ कमज़ोर करता है पर सब नक़ली साबित नहीं करता; लोगो और HTTPS भी संचालक नहीं बताते"), noteTone: "warn" } },
      { cmp: { upTo: 5, note: t("Which conclusion is supported?", "कौन-सा निष्कर्ष समर्थित है?"), noteTone: "info" } },
      { cmp: { upTo: 5, mark: { addr: "hl", ret: "hl", ship: "hl", host: "info" }, note: t("Record A's missing terms and B's checkable details; an adult confirms the seller through an independent route", "A की ग़ायब शर्तें और B के जाँचने योग्य ब्योरे दर्ज करें; बड़ा स्वतंत्र रास्ते से विक्रेता की पुष्टि करे"), noteTone: "ok" } },
      { cmp: { focus: true } },
    ],
    out: {
      cheap: { cmp: { upTo: 5, mark: { rev: "risk" }, note: t("Cheap isn't proof of fraud — it's a reason to check", "सस्ता होना धोखे का सबूत नहीं — जाँचने की वजह है"), noteTone: "risk" } },
      perfect: { cmp: { upTo: 5, mark: { host: "risk", addr: "warn" }, note: t("B's details are still claims to verify", "B के ब्योरे भी जाँचने वाले दावे हैं"), noteTone: "risk" } },
      gaps: { cmp: { upTo: 5, mark: { addr: "hl", ret: "hl", ship: "hl" }, note: t("Record the gaps and verify independently with an adult", "कमियाँ दर्ज करें और बड़े के साथ स्वतंत्र रूप से जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-fraud-familiar-media", scene: "market", layout: "two",
    label: t("A voice message that sounds like the club organiser", "क्लब संयोजक जैसी आवाज़ वाला वॉइस संदेश"),
    art: [
      { k: "chat", id: "voice", at: "a", look: "call", who: t("'Club organiser'", "'क्लब संयोजक'"), msgs: [{ from: "them", t: t("🎙 \"Isha, send a voucher for the new equipment before lunch.\"", "🎙 \"इशा, लंच से पहले नए उपकरण के लिए वाउचर भेजो।\""), flag: "warn" }] },
      { k: "doc", id: "ev", at: "b", look: "card", pic: "mic", title: t("What does the media prove?", "यह मीडिया क्या साबित करता है?"), sub: t("Recordings can be edited, reused or generated", "रिकॉर्डिंग संपादित, दोबारा इस्तेमाल या बनाई जा सकती हैं"), toks: [{ id: "voice", t: t("The voice sounds right", "आवाज़ सही लगती है"), icon: "volume" }, { id: "photo", t: t("A matching photograph", "मेल खाती तस्वीर"), icon: "image" }, { id: "glitch", t: t("'No strange blinking or robot sounds'", "'अजीब पलकें झपकना या रोबोट जैसी आवाज़ नहीं'"), icon: "eye" }, { id: "known", t: t("The organiser, via the known club route", "संयोजक, जाने-पहचाने क्लब रास्ते से"), icon: "user-ok" }] },
    ],
    sc: [
      { voice: { focus: true, note: t("A familiar voice and photo make the request feel personal", "जानी-पहचानी आवाज़ और तस्वीर अनुरोध को निजी बना देती हैं"), noteTone: "warn" } },
      { ev: { mark: { voice: "warn", photo: "warn" }, note: t("A genuine old recording can also be used in a misleading context — we can't tell by listening", "असली पुरानी रिकॉर्डिंग भी भ्रामक संदर्भ में इस्तेमाल हो सकती है — सुनकर नहीं बता सकते"), noteTone: "warn" }, voice: { focus: false, note: undefined } },
      { ev: { mark: { voice: "warn", photo: "warn", glitch: "risk" }, note: t("Spotting glitches is unreliable: fakes can be smooth, real clips can be poor", "गड़बड़ी ढूँढना भरोसेमंद नहीं: नक़ली चिकनी हो सकती है, असली ख़राब"), noteTone: "risk" } },
      { ev: { mark: {}, note: t("What should Isha do before any voucher transfer?", "वाउचर भेजने से पहले इशा क्या करे?"), noteTone: "info" } },
      { ev: { mark: { known: "ok", voice: "gone", photo: "gone", glitch: "gone" }, note: t("The organiser confirms: no voucher was requested — pause, and keep a minimal note", "संयोजक पुष्टि करता है: कोई वाउचर नहीं माँगा — रुकें और छोटा नोट रखें"), noteTone: "ok" } },
      { ev: { focus: true } },
    ],
    out: {
      voice: { ev: { mark: { voice: "risk" }, note: t("A smooth voice proves nothing", "चिकनी आवाज़ कुछ साबित नहीं करती"), noteTone: "risk" } },
      glitch: { ev: { mark: { glitch: "risk" }, note: t("No visible glitch doesn't mean it's genuine", "कोई दिखती गड़बड़ी न होना असली होने का सबूत नहीं"), noteTone: "risk" } },
      known: { ev: { mark: { known: "ok", voice: "gone", photo: "gone", glitch: "gone" }, note: t("Verify with the organiser through the known club route", "संयोजक से जाने-पहचाने क्लब रास्ते से जाँचें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class8-fraud-calm-response", scene: "classroom", layout: "two",
    label: t("After sharing a login code · Aman's calm response", "लॉगिन कोड साझा करने के बाद · अमन की शांत प्रतिक्रिया"),
    art: [
      { k: "time", id: "line", at: "a", title: t("What Aman does", "अमन क्या करता है"), icon: "history", ev: [{ id: "e1", at: "1", t: t("Shares a login code with 'support'", "'सपोर्ट' को लॉगिन कोड देता है"), icon: "key" }, { id: "e2", at: "2", t: t("Stops replying — no more codes", "जवाब देना बंद — और कोड नहीं"), icon: "x" }, { id: "e3", at: "3", t: t("Tells a trusted teacher", "भरोसेमंद टीचर को बताता है"), icon: "megaphone" }, { id: "e4", at: "4", t: t("Adult checks sessions and protection with the provider", "बड़ा प्रदाता के साथ सेशन और सुरक्षा जाँचता है"), icon: "shield-ok" }, { id: "e5", at: "5", t: t("If money is involved: the financial provider, promptly", "अगर पैसा शामिल: तुरंत वित्तीय प्रदाता"), icon: "wallet" }], upTo: 1 },
      { k: "doc", id: "note", at: "b", hide: true, look: "form", pic: "clipboard", title: t("Incident note", "घटना नोट"), toks: [{ id: "when", t: t("When the message arrived", "संदेश कब आया"), icon: "clock" }, { id: "ask", t: t("What action was requested", "कौन-सी कार्रवाई माँगी"), icon: "msg" }, { id: "shared", t: t("What Aman shared (the category)", "अमन ने क्या दिया (श्रेणी)"), icon: "key" }, { id: "val", t: t("The actual secret value", "रहस्य का असली मान"), icon: "hash" }], mark: { when: "ok", ask: "ok", shared: "ok", val: "hide" } },
    ],
    sc: [
      { line: { upTo: 1, mark: { e1: "warn" }, focus: true, note: t("He fears punishment and thinks about hiding it — his classmate says seek help now", "उसे सज़ा का डर है और छिपाने की सोचता है — उसका सहपाठी कहता है अभी मदद लो"), noteTone: "warn" } },
      { line: { upTo: 3, mark: { e1: "warn", e2: "ok", e3: "ok" }, note: t("Stop replying, send nothing more, tell a trusted teacher", "जवाब बंद करें, और कुछ न भेजें, भरोसेमंद टीचर को बताएँ"), noteTone: "ok" } },
      { line: { focus: false, note: undefined }, note: { hide: false, focus: true, note: t("Write what happened — never copy the secret itself", "क्या हुआ लिखें — रहस्य को कभी नक़ल न करें"), noteTone: "info" } },
      { line: { upTo: 5, mark: { e1: "warn", e2: "ok", e3: "ok", e4: "ok", e5: "info" }, note: t("A stranger offers guaranteed recovery for a fee", "एक अजनबी फ़ीस लेकर पक्की रिकवरी का प्रस्ताव देता है"), noteTone: "warn" }, note: { focus: false, note: undefined } },
      { line: { upTo: 5, mark: { e1: "warn", e2: "ok", e3: "ok", e4: "ok", e5: "ok" }, note: t("Official help only — no one can promise an outcome", "सिर्फ़ आधिकारिक मदद — कोई नतीजे का वादा नहीं कर सकता"), noteTone: "ok" } },
      { line: { focus: true } },
    ],
    out: {
      pay: { line: { upTo: 5, mark: { e1: "warn", e4: "risk" }, note: t("Paying for 'guaranteed' recovery pays a stranger", "'पक्की' रिकवरी के लिए भुगतान अजनबी को भुगतान है"), noteTone: "risk" } },
      delete: { line: { upTo: 3, mark: { e1: "risk", e3: "gone" }, note: t("Deleting the evidence and staying quiet delays real help", "सबूत मिटाना और चुप रहना असली मदद में देर करता है"), noteTone: "risk" } },
      adult: { line: { upTo: 5, mark: { e1: "warn", e2: "ok", e3: "ok", e4: "ok", e5: "ok" }, note: t("Show the adult, refuse further exposure, continue through known official help", "बड़े को दिखाएँ, और खुलना मना करें, जाने-पहचाने आधिकारिक रास्ते से चलें"), noteTone: "ok" } },
    },
  },
];
