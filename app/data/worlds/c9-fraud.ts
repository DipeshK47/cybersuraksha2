import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class9FraudWorlds: World[] = [
  {
    slug: "class9-fraud-scholarship-form", scene: "library", layout: "two",
    label: t("A scholarship poster beside the library display", "लाइब्रेरी डिस्प्ले के पास एक छात्रवृत्ति पोस्टर"),
    art: [
      { k: "doc", id: "poster", at: "a", look: "form", pic: "award", title: t("Science Materials Scholarship", "विज्ञान सामग्री छात्रवृत्ति"), sub: t("A school crest — but check the request", "स्कूल का प्रतीक — पर माँग देखें"), toks: [{ id: "alias", t: t("Learner alias", "विद्यार्थी का उपनाम"), icon: "user" }, { id: "class", t: t("Class", "कक्षा"), icon: "school" }, { id: "theme", t: t("Project theme", "प्रोजेक्ट का विषय"), icon: "idea" }, { id: "addr", t: t("Home address", "घर का पता"), icon: "home" }, { id: "pw", t: t("A password", "एक पासवर्ड"), icon: "key" }, { id: "priv", t: t("A private photo", "एक निजी फ़ोटो"), icon: "camera" }] },
      { k: "doc", id: "notice", at: "b", hide: true, look: "card", pic: "clipboard-ok", title: t("The school's notice", "स्कूल की सूचना"), sub: t("The initial shortlist needs only…", "शुरुआती शॉर्टलिस्ट को सिर्फ़ चाहिए…"), toks: [{ id: "n1", t: t("Learner alias, class, project theme", "विद्यार्थी का उपनाम, कक्षा, प्रोजेक्ट का विषय"), icon: "check" }, { id: "n2", t: t("A teacher handles later contact", "बाद का संपर्क टीचर सँभालती हैं"), icon: "user-ok" }] },
    ],
    sc: [
      { poster: { focus: true, note: t("A school crest is on the poster — inspect the actual request before entering anything", "पोस्टर पर स्कूल का प्रतीक है — कुछ भरने से पहले असल माँग देखें"), noteTone: "info" } },
      { notice: { hide: false, focus: true, mark: { n1: "ok", n2: "ok" } }, poster: { focus: false, mark: { alias: "ok", class: "ok", theme: "ok", addr: "risk", pw: "risk", priv: "risk" }, note: t("The poster asks for much more than the supplied notice allows", "पोस्टर सूचना में दी अनुमति से बहुत ज़्यादा माँगता है"), noteTone: "risk" } },
      { poster: { mark: { alias: "ok", class: "ok", theme: "ok", addr: "gone", pw: "risk", priv: "risk" }, note: t("The theme is relevant; the password has no role in a shortlist — record the mismatch, don't invent a reason", "विषय प्रासंगिक है; पासवर्ड की शॉर्टलिस्ट में कोई भूमिका नहीं — अमेल दर्ज करें, कोई वजह न गढ़ें"), noteTone: "info" }, notice: { focus: false } },
      { poster: { mark: { alias: "ok", class: "ok", theme: "ok", addr: "risk", pw: "risk", priv: "risk" }, note: t("Where should Reva check the scholarship claim?", "रेवा छात्रवृत्ति के दावे की जाँच कहाँ करे?"), noteTone: "info" } },
      { poster: { mark: { alias: "ok", class: "ok", theme: "ok", addr: "gone", pw: "gone", priv: "gone" }, stamp: t("Submission paused", "जमा रोका"), note: t("The office hasn't replied yet — the organiser stays unverified; that doesn't prove who is behind it", "ऑफ़िस ने अभी जवाब नहीं दिया — आयोजक अप्रमाणित है; इससे यह साबित नहीं होता कि पीछे कौन है"), noteTone: "ok" } },
      { poster: { focus: true } },
    ],
    out: {
      chat: { poster: { mark: { addr: "risk", pw: "risk", priv: "risk" }, note: t("The poster's own chat will vouch for itself", "पोस्टर की अपनी चैट ख़ुद की गवाही देगी"), noteTone: "risk" } },
      office: { poster: { mark: { addr: "gone", pw: "gone", priv: "gone" }, stamp: t("Submission paused", "जमा रोका"), note: t("Pause and ask the teacher to use the existing office contact", "रुकें और टीचर से मौजूदा ऑफ़िस संपर्क इस्तेमाल करवाएँ"), noteTone: "ok" } },
      crest: { poster: { mark: { addr: "risk", pw: "risk", priv: "risk" }, stamp: t("SENT", "भेजा"), note: t("A matching crest doesn't make the questions harmless", "मेल खाता प्रतीक सवालों को हानिरहित नहीं बनाता"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-fraud-task-deposit", scene: "market", layout: "two",
    label: t("A tiny picture-rating task, then deposits", "तस्वीरें रेट करने का छोटा काम, फिर जमा-राशि"),
    art: [
      { k: "ledger", id: "chain", at: "a", title: t("The escalation, in order", "बढ़ती माँग, क्रम से"), icon: "trending", lines: [{ id: "e1", t: t("Small incoming transfer", "छोटा आने वाला हस्तांतरण"), amt: "+₹ 20", dir: "in", sub: t("sender's larger purpose unknown", "भेजने वाले का बड़ा मक़सद अज्ञात") }, { id: "e2", t: t("'Unlock tasks' deposit", "'काम खोलने' की जमा-राशि"), amt: "−₹ 500", dir: "out" }, { id: "e3", t: t("'Release earnings' deposit", "'कमाई जारी' की जमा-राशि"), amt: "−₹ 2,000", dir: "out" }], upTo: 1 },
      { k: "table", id: "sheet", at: "b", hide: true, title: t("Dashboard vs the transaction sheet", "डैशबोर्ड बनाम लेन-देन शीट"), icon: "search", cols: [t("Source", "स्रोत"), t("Says", "कहता है"), t("Matches a transfer?", "हस्तांतरण से मेल?")], rows: [{ id: "dash", c: [t("Task dashboard", "टास्क डैशबोर्ड"), t("Earnings ₹ 4,800", "कमाई ₹ 4,800"), "✗"] }, { id: "sheet", c: [t("Provider sheet", "प्रदाता शीट"), t("only the ₹ 20 in", "सिर्फ़ ₹ 20 आए"), "✓"] }] },
    ],
    sc: [
      { chain: { upTo: 1, mark: { e1: "info" }, focus: true, note: t("A small incoming transfer occurred — but who sent it, and why, isn't known", "एक छोटा हस्तांतरण आया — पर किसने और क्यों भेजा, पता नहीं"), noteTone: "info" } },
      { chain: { upTo: 3, mark: { e2: "warn", e3: "risk" }, note: t("Each payment becomes the final obstacle — earlier effort turns into pressure to continue", "हर भुगतान आख़िरी रुकावट बन जाता है — पिछली मेहनत आगे बढ़ने का दबाव बन जाती है"), noteTone: "risk" } },
      { sheet: { hide: false, focus: true, mark: { dash: "risk", sheet: "ok" }, note: t("The dashboard says 'earnings' — the sheet has no matching transfer. Label it 'claimed', not 'received'.", "डैशबोर्ड 'कमाई' कहता है — शीट में कोई मेल खाता हस्तांतरण नहीं। इसे 'दावा' लिखें, 'मिला' नहीं।"), noteTone: "warn" }, chain: { focus: false, note: undefined } },
      { sheet: { focus: false, note: t("What should Nikhil do about the next deposit?", "अगली जमा-राशि पर निखिल क्या करे?"), noteTone: "info" } },
      { chain: { upTo: 3, mark: { e2: "gone", e3: "gone" }, note: t("No further payment — the pressure chain goes privately to a trusted adult", "आगे कोई भुगतान नहीं — दबाव की यह श्रृंखला भरोसेमंद बड़े को निजी तौर पर दिखाएँ"), noteTone: "ok" } },
      { chain: { focus: true } },
    ],
    out: {
      continue: { chain: { upTo: 3, mark: { e2: "warn", e3: "risk" }, total: { t: t("Sent so far", "अब तक भेजा"), v: "₹ 2,500" }, note: t("'Wasted otherwise' is the trap — more deposits, same dashboard", "'वरना बेकार' ही जाल है — और जमा-राशि, वही डैशबोर्ड"), noteTone: "risk" } },
      stop: { chain: { upTo: 3, mark: { e2: "gone", e3: "gone" }, note: t("Stop further payments; take the chain to a trusted adult", "आगे भुगतान रोकें; श्रृंखला भरोसेमंद बड़े को दिखाएँ"), noteTone: "ok" } },
      balance: { sheet: { hide: false, mark: { dash: "risk" }, note: t("A dashboard number isn't money received", "डैशबोर्ड की संख्या मिला हुआ पैसा नहीं होती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-fraud-parcel-detour", scene: "street", layout: "two",
    label: t("A 'parcel held for an address fee' message", "'पता-शुल्क के लिए पार्सल रुका' संदेश"),
    art: [
      { k: "table", id: "cmp", at: "a", title: t("Order card vs the message", "ऑर्डर कार्ड बनाम संदेश"), icon: "search", cols: [t("Detail", "ब्योरा"), t("Order card", "ऑर्डर कार्ड"), t("Message", "संदेश")], rows: [{ id: "shop", c: [t("Seller", "विक्रेता"), t("a bookshop", "एक किताब की दुकान"), t("'a courier'", "'एक कूरियर'")] }, { id: "ref", c: [t("Parcel reference", "पार्सल संदर्भ"), "BK-2217", "PX-9031"] }, { id: "pay", c: [t("Delivery", "डिलीवरी"), t("already paid", "पहले से चुकाया"), t("another fee demanded", "और शुल्क माँगा")] }] },
      { k: "screen", id: "addr", at: "b", hide: true, look: "browser", lock: "ok", url: [{ t: "https://" }, { t: "track.", mark: "warn" }, { t: "parcel-helper.example", mark: "risk" }, { t: "/bookshop-order", mark: "warn" }], blocks: [{ id: "h", type: "row", t: t("The host is where the page really belongs", "होस्ट वह है जहाँ पेज असल में है"), sub: t("the bookshop's name is only in the path", "दुकान का नाम सिर्फ़ पाथ में है"), icon: "globe" }] },
    ],
    sc: [
      { cmp: { focus: true, note: t("The class compares records before following any instruction — no payment app opens", "निर्देश मानने से पहले कक्षा रिकॉर्ड मिलाती है — कोई भुगतान ऐप नहीं खुलता"), noteTone: "info" } },
      { cmp: { mark: { shop: "risk", ref: "risk", pay: "risk" }, note: t("Two mismatches (seller and reference) and a second charge — record them without concluding who is behind it", "दो अमेल (विक्रेता और संदर्भ) और दूसरा शुल्क — बिना निष्कर्ष निकाले कि कौन पीछे है, दर्ज करें"), noteTone: "warn" } },
      { addr: { hide: false, focus: true, note: t("Familiar words in the path don't decide the host — Reva circles the host", "पाथ के जाने-पहचाने शब्द होस्ट तय नहीं करते — रेवा होस्ट पर घेरा बनाती है"), noteTone: "risk" }, cmp: { focus: false } },
      { addr: { focus: false, note: t("Which route should check the parcel fee?", "पार्सल शुल्क की जाँच कौन-सा रास्ता करे?"), noteTone: "info" } },
      { addr: { mark: { h: "gone" }, note: undefined }, cmp: { mark: { shop: "ok", ref: "ok", pay: "ok" }, note: t("The teacher uses the shop contact already printed in the school purchase record", "टीचर स्कूल ख़रीद रिकॉर्ड में पहले से छपा दुकान का संपर्क इस्तेमाल करती हैं"), noteTone: "ok" } },
      { cmp: { focus: true } },
    ],
    out: {
      message: { addr: { hide: false, mark: { h: "risk" }, note: t("A number inside the message belongs to the message's author", "संदेश के भीतर का नंबर संदेश के लेखक का है"), noteTone: "risk" } },
      known: { cmp: { mark: { shop: "ok", ref: "ok", pay: "ok" }, note: t("Ask the teacher to use the existing shop contact", "टीचर से मौजूदा दुकान संपर्क इस्तेमाल करवाएँ"), noteTone: "ok" } },
      test: { cmp: { mark: { pay: "risk" }, note: t("Paying 'to see' just pays the demand", "'देखने' के लिए देना माँग ही चुकाना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-fraud-refund-direction", scene: "market", layout: "two",
    label: t("A promised refund · two very different paper records", "वादा किया रिफ़ंड · दो बहुत अलग काग़ज़ी रिकॉर्ड"),
    art: [
      { k: "ledger", id: "appr", at: "a", title: t("Approval card from the chat", "चैट से आया मंज़ूरी कार्ड"), icon: "receipt", lines: [{ id: "a1", t: t("Pay merchant (BrightDesk)", "व्यापारी को भुगतान (BrightDesk)"), amt: "−₹ 480", dir: "out", sub: t("payer: learner account · awaiting approval", "भुगतानकर्ता: विद्यार्थी अकाउंट · मंज़ूरी बाक़ी") }], total: { t: t("Status", "स्थिति"), v: t("awaiting approval", "मंज़ूरी बाक़ी") } },
      { k: "ledger", id: "done", at: "b", hide: true, title: t("A completed refund record", "पूरा हुआ रिफ़ंड रिकॉर्ड"), icon: "receipt", lines: [{ id: "d1", t: t("Original shop → learner", "मूल दुकान → विद्यार्थी"), amt: "+₹ 480", dir: "in", sub: t("completed refund · transaction reference", "पूरा रिफ़ंड · लेन-देन संदर्भ") }] },
    ],
    sc: [
      { appr: { focus: true, mark: { a1: "warn" }, note: t("The chat calls it a refund; the card says pay — paper records only, no payment app", "चैट इसे रिफ़ंड कहती है; कार्ड कहता है भुगतान — सिर्फ़ काग़ज़ी रिकॉर्ड, कोई भुगतान ऐप नहीं"), noteTone: "warn" } },
      { appr: { mark: { a1: "risk" }, note: t("Reva draws the arrow away from the learner account", "रेवा तीर विद्यार्थी अकाउंट से दूर खींचती है"), noteTone: "risk" } },
      { done: { hide: false, focus: true, mark: { d1: "ok" }, note: t("A real refund looks different: arrow into the account, with a reference — kept separate", "असली रिफ़ंड अलग दिखता है: अकाउंट की ओर तीर, संदर्भ के साथ — अलग रखा"), noteTone: "ok" }, appr: { focus: false } },
      { done: { focus: false, note: undefined }, appr: { note: t("How should Nikhil read the approval card?", "निखिल मंज़ूरी कार्ड को कैसे पढ़े?"), noteTone: "info" } },
      { appr: { mark: { a1: "gone" }, total: { t: t("Branch A (refund) → ₹ 1,980 · Branch B (payment) → ₹ 1,020", "शाखा A (रिफ़ंड) → ₹ 1,980 · शाखा B (भुगतान) → ₹ 1,020"), v: "" }, note: t("Decline the outgoing instruction; an adult checks the original shop through its known route", "बाहर जाने वाला निर्देश मना करें; बड़ा मूल दुकान को जाने-पहचाने रास्ते से जाँचे"), noteTone: "ok" } },
      { appr: { focus: true } },
    ],
    out: {
      refund: { appr: { mark: { a1: "press" }, note: t("Approving a pay card because of the chat's word sends money out", "चैट के कहने पर 'पे' कार्ड मंज़ूर करना पैसा बाहर भेजना है"), noteTone: "risk" } },
      pause: { appr: { mark: { a1: "gone" }, note: t("Pause the outgoing payment; ask an adult to check the original shop", "बाहर जाने वाला भुगतान रोकें; बड़े से मूल दुकान जँचवाएँ"), noteTone: "ok" } },
      debited: { appr: { mark: { a1: "warn" }, total: { t: t("Status", "स्थिति"), v: t("awaiting — not debited", "मंज़ूरी बाक़ी — कटा नहीं") }, note: t("It's awaiting approval — nothing has been debited yet", "यह मंज़ूरी के इंतज़ार में है — अभी कुछ कटा नहीं"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-fraud-account-lending", scene: "market", layout: "two",
    label: t("'Easy commission' · whose account is the middle card?", "'आसान कमीशन' · बीच का कार्ड किसका अकाउंट है?"),
    art: [
      { k: "flow", id: "chain", at: "a", look: "graph", title: t("The invented chain", "गढ़ी हुई श्रृंखला"), icon: "network", nodes: [{ id: "buyer", t: t("Source of money", "पैसे का स्रोत"), icon: "coins", x: 12, y: 50 }, { id: "me", t: t("Recruited person's account", "भर्ती किए व्यक्ति का अकाउंट"), icon: "user", x: 50, y: 50 }, { id: "next", t: t("'Seller' account", "'विक्रेता' अकाउंट"), icon: "user-x", x: 88, y: 50 }], links: [{ from: "buyer", to: "me", t: t("in", "आया") }, { from: "me", to: "next", t: t("pass on", "आगे भेजें") }], state: { me: "now" } },
      { k: "doc", id: "asks", at: "b", look: "form", pic: "alert", title: t("What the helper asks for", "मददगार क्या माँगता है"), hide: true, toks: [{ id: "recv", t: t("Receive payments, pass most onward", "भुगतान लें, ज़्यादातर आगे भेजें"), icon: "arrow" }, { id: "login", t: t("Borrow the account login 'temporarily'", "अकाउंट लॉगिन 'कुछ देर' उधार दें"), icon: "key" }, { id: "comm", t: t("A promised commission", "वादा किया कमीशन"), icon: "gift" }] },
    ],
    sc: [
      { chain: { focus: true, note: t("The proposed 'work' sells nothing — it moves money through a stranger's account", "प्रस्तावित 'काम' कुछ नहीं बेचता — यह पैसा एक अनजान के अकाउंट से गुज़ारता है"), noteTone: "warn" } },
      { chain: { state: { me: "risk", buyer: "now", next: "now" }, cur: "me", note: t("The middle card is the recruited person's own account — mark incoming and outgoing requests", "बीच का कार्ड भर्ती किए व्यक्ति का अपना अकाउंट है — आने और जाने वाले अनुरोध चिह्नित करें"), noteTone: "risk" } },
      { asks: { hide: false, focus: true, mark: { recv: "risk", login: "risk", comm: "warn" }, note: t("A second exposure: borrowing the login hands over account control — 'temporary favour' changes nothing", "दूसरा ख़तरा: लॉगिन उधार देना अकाउंट का नियंत्रण सौंपना है — 'कुछ देर का एहसान' से कुछ नहीं बदलता"), noteTone: "risk" }, chain: { focus: false, note: undefined } },
      { asks: { focus: false, note: t("How should the participant handle the unexpected credit?", "प्रतिभागी अनपेक्षित जमा को कैसे सँभाले?"), noteTone: "info" } },
      { chain: { link: { "me>next": "off" }, state: { me: "ok", next: "muted" }, note: t("Leave the funds untouched; an adult contacts the financial provider through its known route", "रकम को छुए बिना रखें; बड़ा वित्तीय प्रदाता से जाने-पहचाने रास्ते से संपर्क करे"), noteTone: "ok" }, asks: { mark: { recv: "gone", login: "gone", comm: "gone" } } },
      { chain: { focus: true } },
    ],
    out: {
      forward: { chain: { link: { "me>next": "on" }, state: { me: "risk", next: "risk" }, note: t("Forwarding moves the money on — the participant's account is the route", "आगे भेजना पैसा आगे बढ़ाना है — प्रतिभागी का अकाउंट ही रास्ता है"), noteTone: "risk" } },
      help: { chain: { link: { "me>next": "off" }, state: { me: "ok", next: "muted" }, note: t("Leave it untouched; get adult-assisted provider guidance", "छुए बिना रखें; बड़े की मदद से प्रदाता का मार्गदर्शन लें"), noteTone: "ok" } },
      return: { chain: { link: { "me>next": "on" }, state: { me: "risk", next: "risk" }, note: t("A 'return' to an account named in the message is the same chain", "संदेश में बताए अकाउंट पर 'वापसी' वही श्रृंखला है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-fraud-trial-subscription", scene: "garden", layout: "two",
    label: t("A 'free' drawing-library trial · read beyond free", "'मुफ़्त' चित्र-लाइब्रेरी ट्रायल · 'मुफ़्त' से आगे पढ़ें"),
    art: [
      { k: "ledger", id: "terms", at: "a", title: t("The schedule in the terms", "शर्तों में कार्यक्रम"), icon: "calendar", lines: [{ id: "t0", t: t("1–7 Nov · free trial", "1–7 नवंबर · मुफ़्त ट्रायल"), amt: "₹ 0", dir: "hold" }, { id: "t1", t: t("8 Nov", "8 नवंबर"), amt: "−₹ 180", dir: "out" }, { id: "t2", t: t("8 Dec", "8 दिसंबर"), amt: "−₹ 180", dir: "out" }, { id: "t3", t: t("8 Jan", "8 जनवरी"), amt: "−₹ 180", dir: "out" }], upTo: 1, total: { t: t("Listed paid charges", "सूचीबद्ध भुगतान"), v: "0" } },
      { k: "table", id: "recs", at: "b", hide: true, title: t("What each record confirms", "हर रिकॉर्ड क्या पुष्टि करता है"), icon: "search", cols: [t("Record (November)", "रिकॉर्ड (नवंबर)"), t("Confirms", "पुष्टि करता है")], rows: [{ id: "r5", c: [t("5th: 'cancellation request received'", "5 तारीख़: 'रद्द करने का अनुरोध मिला'"), t("a receipt only", "सिर्फ़ रसीद")] }, { id: "r6", c: [t("6th: service says 'cancelled'", "6 तारीख़: सेवा कहती है 'रद्द'"), t("the service's side", "सेवा की ओर से")] }, { id: "p6", c: [t("6th: provider says authorisation revoked", "6 तारीख़: प्रदाता कहता है अधिकार रद्द"), t("no pending charge", "कोई लंबित शुल्क नहीं")] }] },
    ],
    sc: [
      { terms: { upTo: 1, focus: true, note: t("Reva reads beyond 'free': a trial, then recurring charges", "रेवा 'मुफ़्त' से आगे पढ़ती है: ट्रायल, फिर बार-बार लगने वाला शुल्क"), noteTone: "info" } },
      { terms: { upTo: 4, mark: { t1: "warn", t2: "warn", t3: "warn" }, note: t("An authorisation card permits later charges — that is more than a single purchase", "अधिकार कार्ड बाद के शुल्कों की अनुमति देता है — यह एक ख़रीद से ज़्यादा है"), noteTone: "warn" } },
      { terms: { upTo: 4, total: { t: t("3 paid charges × ₹ 180", "3 भुगतान × ₹ 180"), v: "₹ 540" }, note: t("Count only the dates the terms give — no imaginary tax, discount or missed month; state your assumptions", "सिर्फ़ शर्तों में दी तारीख़ें गिनें — कोई काल्पनिक कर, छूट या छूटा महीना नहीं; मान्यताएँ बताएँ"), noteTone: "ok" } },
      { recs: { hide: false, focus: true, mark: { r5: "warn" }, note: t("What does 'cancellation request received' establish?", "'रद्द करने का अनुरोध मिला' क्या साबित करता है?"), noteTone: "info" }, terms: { focus: false, note: undefined } },
      { recs: { mark: { r5: "warn", r6: "info", p6: "ok" }, note: t("The request arrived — cancellation and authorisation are separate records to check", "अनुरोध पहुँचा — रद्दीकरण और अधिकार जाँचने के अलग रिकॉर्ड हैं"), noteTone: "ok" } },
      { recs: { focus: true } },
    ],
    out: {
      cancelled: { recs: { hide: false, mark: { r5: "risk" }, note: t("A received request isn't a confirmed cancellation", "मिला अनुरोध पक्का रद्दीकरण नहीं है"), noteTone: "risk" } },
      unknown: { recs: { hide: false, mark: { r5: "warn", r6: "info", p6: "ok" }, note: t("The request arrived; check cancellation and authorisation", "अनुरोध पहुँचा; रद्दीकरण और अधिकार जाँचें"), noteTone: "ok" } },
      fraud: { recs: { hide: false, mark: { r5: "warn" }, note: t("A missing confirmation doesn't prove fraud either", "ग़ायब पुष्टि धोखा भी साबित नहीं करती"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-fraud-appeal-source", scene: "library", layout: "two",
    label: t("A community-book appeal · what does the picture establish?", "सामुदायिक-किताब अपील · तस्वीर क्या साबित करती है?"),
    art: [
      { k: "doc", id: "appeal", at: "a", look: "poster", pic: "heart", title: t("Books for empty shelves", "ख़ाली शेल्फ़ों के लिए किताबें"), sub: t("Children beside empty shelves", "ख़ाली शेल्फ़ों के पास बच्चे"), toks: [{ id: "org", t: t("Organiser: 'Community Shelf Group'", "आयोजक: 'कम्युनिटी शेल्फ़ ग्रुप'"), icon: "users" }, { id: "why", t: t("Purpose: books for a library", "उद्देश्य: लाइब्रेरी के लिए किताबें"), icon: "book" }, { id: "dead", t: t("Deadline: this Friday", "समय-सीमा: इसी शुक्रवार"), icon: "timer" }, { id: "btn", t: t("A contact button", "संपर्क बटन"), icon: "mouse" }, { id: "photo", t: t("A copied photograph", "नक़ल की हुई तस्वीर"), icon: "image" }] },
      { k: "table", id: "audit", at: "b", hide: true, title: t("Audit of the appeal", "अपील की जाँच"), icon: "search", cols: [t("Entry", "प्रविष्टि"), t("Status", "स्थिति")], rows: [{ id: "a1", c: [t("Photograph proves who controls the appeal", "तस्वीर साबित करती है कि अपील किसके हाथ में है"), "✗"] }, { id: "a2", c: [t("A reused photo can come from another context", "दोबारा इस्तेमाल तस्वीर दूसरे संदर्भ की हो सकती है"), "✓"] }, { id: "a3", c: [t("Library confirmation of this appeal", "इस अपील की लाइब्रेरी से पुष्टि"), t("missing", "ग़ायब")] }] },
    ],
    sc: [
      { appeal: { focus: true, note: t("Nikhil wants to respond quickly — the teacher asks what the picture actually establishes", "निखिल जल्दी जवाब देना चाहता है — टीचर पूछती हैं कि तस्वीर असल में क्या साबित करती है"), noteTone: "info" } },
      { appeal: { mark: { org: "hl", why: "hl", dead: "warn", btn: "info", photo: "warn" }, note: t("List each claim separately so sympathy doesn't become identity evidence", "हर दावा अलग लिखें ताकि सहानुभूति पहचान का सबूत न बन जाए"), noteTone: "info" } },
      { audit: { hide: false, focus: true, mark: { a1: "risk", a2: "ok", a3: "warn" }, note: t("A familiar image can't confirm who controls the appeal or where support would go", "जानी-पहचानी तस्वीर यह साबित नहीं करती कि अपील किसके हाथ में है या मदद कहाँ जाएगी"), noteTone: "warn" }, appeal: { focus: false, note: undefined } },
      { audit: { focus: false, note: t("What follows from the library's partial reply?", "लाइब्रेरी के अधूरे जवाब से क्या निकलता है?"), noteTone: "info" } },
      { audit: { txt: { "a3:1": t("programme confirmed · this appeal unverified", "कार्यक्रम पक्का · यह अपील अप्रमाणित") }, mark: { a1: "risk", a2: "ok", a3: "hl" }, note: t("A minimal adult note: claimed organiser, stated purpose, source still needed, requested action — no private details", "बड़े के लिए छोटा नोट: दावा किया आयोजक, बताया उद्देश्य, अब भी चाहिए स्रोत, माँगी गई कार्रवाई — कोई निजी ब्योरा नहीं"), noteTone: "ok" } },
      { audit: { focus: true } },
    ],
    out: {
      approve: { audit: { hide: false, mark: { a3: "risk" }, note: t("A partial reply doesn't authorise this appeal", "अधूरा जवाब इस अपील को अधिकृत नहीं करता"), noteTone: "risk" } },
      limit: { audit: { hide: false, txt: { "a3:1": t("programme confirmed · this appeal unverified", "कार्यक्रम पक्का · यह अपील अप्रमाणित") }, mark: { a3: "hl", a2: "ok" }, note: t("Record the programme as confirmed and this appeal as still unverified", "कार्यक्रम को पक्का और इस अपील को अब भी अप्रमाणित दर्ज करें"), noteTone: "ok" } },
      accuse: { audit: { hide: false, mark: { a1: "risk", a3: "warn" }, note: t("Unverified isn't the same as proven fraud — don't accuse", "अप्रमाणित का मतलब सिद्ध धोखा नहीं — आरोप न लगाएँ"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-fraud-helpful-case-note", scene: "classroom", layout: "two",
    label: t("A calm help note for a learner who feels ashamed", "शर्मिंदा विद्यार्थी के लिए शांत मदद-नोट"),
    art: [
      { k: "time", id: "events", at: "a", title: t("Event cards, in order", "घटना कार्ड, क्रम से"), icon: "history", ev: [{ id: "v1", at: "1", t: t("A message arrives", "एक संदेश आता है"), sub: t("sender's identity: unknown", "भेजने वाले की पहचान: अज्ञात"), icon: "msg" }, { id: "v2", at: "2", t: t("The learner follows its instructions", "विद्यार्थी उसके निर्देश मानता है"), icon: "arrow" }, { id: "v3", at: "3", t: t("Help is requested", "मदद माँगी जाती है"), icon: "megaphone" }, { id: "v4", at: "4", t: t("A stranger guarantees recovery for an advance fee", "एक अजनबी अग्रिम फ़ीस पर पक्की रिकवरी का वादा करता है"), icon: "coins" }], upTo: 3 },
      { k: "doc", id: "note", at: "b", look: "form", pic: "clipboard", title: t("Minimal case note", "न्यूनतम केस नोट"), toks: [{ id: "act", t: t("The requested action", "माँगी गई कार्रवाई"), icon: "send" }, { id: "kind", t: t("Type of information shared", "साझा जानकारी का प्रकार"), icon: "key" }, { id: "help", t: t("Help already sought", "पहले से माँगी मदद"), icon: "user-ok" }, { id: "secret", t: t("Actual codes and passwords", "असली कोड और पासवर्ड"), icon: "hash" }, { id: "fam", t: t("Unrelated family details", "बेकार पारिवारिक ब्योरे"), icon: "home" }], mark: { act: "ok", kind: "ok", help: "ok", secret: "hide", fam: "hide" } },
    ],
    sc: [
      { events: { upTo: 1, mark: { v1: "warn" }, focus: true, note: t("Reva starts a calm note — no perfect explanation is needed to involve a trusted adult", "रेवा शांत नोट शुरू करती है — भरोसेमंद बड़े को शामिल करने के लिए पूरी व्याख्या ज़रूरी नहीं"), noteTone: "ok" } },
      { events: { upTo: 3, mark: { v1: "warn", v2: "info", v3: "ok" }, note: t("Order the stated times; label the sender's identity unknown rather than adding a guess", "बताए समय क्रम में लगाएँ; भेजने वाले की पहचान अटकल की जगह 'अज्ञात' लिखें"), noteTone: "info" } },
      { note: { focus: true, note: t("Original messages are preserved with adult help — never copy actual codes or passwords", "असली संदेश बड़े की मदद से सुरक्षित रखें — असली कोड या पासवर्ड कभी नक़ल न करें"), noteTone: "info" }, events: { focus: false, note: undefined } },
      { events: { upTo: 4, mark: { v1: "warn", v2: "info", v3: "ok", v4: "risk" }, note: t("A payment record arrives: how should the note change?", "भुगतान का रिकॉर्ड आया: नोट कैसे बदले?"), noteTone: "info" }, note: { focus: false, note: undefined } },
      { events: { upTo: 4, mark: { v4: "risk" }, note: t("Add the payment fact; the adult promptly uses the known financial-provider route; the stranger's offer goes in the private note", "भुगतान का तथ्य जोड़ें; बड़ा तुरंत जाने-पहचाने वित्तीय प्रदाता रास्ते का उपयोग करे; अजनबी का ऑफ़र निजी नोट में"), noteTone: "ok" } },
      { events: { focus: true } },
    ],
    out: {
      wait: { events: { upTo: 4, mark: { v4: "risk" }, note: t("Waiting for identity proof delays payment help", "पहचान के सबूत का इंतज़ार भुगतान-मदद में देर करता है"), noteTone: "risk" } },
      update: { events: { upTo: 4, mark: { v4: "ok" }, note: t("Add the payment fact; use the known provider route promptly", "भुगतान का तथ्य जोड़ें; जाने-पहचाने प्रदाता रास्ते का तुरंत उपयोग करें"), noteTone: "ok" } },
      promise: { events: { upTo: 4, mark: { v4: "risk" }, note: t("No one can promise full recovery", "कोई पूरी रिकवरी का वादा नहीं कर सकता"), noteTone: "risk" } },
    },
  },
];
