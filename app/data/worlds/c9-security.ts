import type { T, World } from "./types";
const t = (en: string, hi: string): T => [en, hi];

export const class9SecurityWorlds: World[] = [
  {
    slug: "class9-repair-desk-risk-map", scene: "classroom", layout: "one",
    label: t("School repair desk · who should see which record?", "स्कूल रिपेयर डेस्क · कौन-सा रिकॉर्ड किसे दिखे?"),
    art: [
      { k: "flow", id: "map", look: "graph", title: t("Records and readers", "रिकॉर्ड और पाठक"), icon: "network",
        nodes: [{ id: "form", t: t("Request slips", "अनुरोध पर्चियाँ"), icon: "file", x: 14, y: 22 }, { id: "rota", t: t("Volunteer rota", "स्वयंसेवक रोटा"), icon: "calendar", x: 14, y: 52 }, { id: "board", t: t("Public progress board", "सार्वजनिक प्रगति बोर्ड"), icon: "bars", x: 14, y: 82 }, { id: "teacher", t: t("Teacher (contacts)", "टीचर (संपर्क)"), icon: "user-ok", x: 82, y: 22 }, { id: "vol", t: t("Volunteers (ticket numbers)", "स्वयंसेवक (टिकट नंबर)"), icon: "users", x: 82, y: 52 }, { id: "pub", t: t("Public readers (totals)", "सार्वजनिक पाठक (योग)"), icon: "globe", x: 82, y: 82 }],
        links: [{ from: "form", to: "teacher" }, { from: "rota", to: "vol" }, { from: "board", to: "pub" }, { from: "form", to: "pub" }], link: { "form>pub": "off" }, state: {} },
    ],
    sc: [
      { map: { focus: true, note: t("A practice folder: request slips, a volunteer rota, a public board — each helps a different job", "अभ्यास फ़ोल्डर: अनुरोध पर्चियाँ, स्वयंसेवक रोटा, सार्वजनिक बोर्ड — हर एक अलग काम के लिए"), noteTone: "info" } },
      { map: { link: { "form>pub": "off" }, note: t("Nikhil draws arrows from each record to the person who needs it — the board needs only totals", "निखिल हर रिकॉर्ड से उसे चाहने वाले तक तीर खींचता है — बोर्ड को सिर्फ़ योग चाहिए"), noteTone: "info" } },
      { map: { link: { "form>pub": "bad" }, state: { form: "risk", pub: "risk" }, note: t("A volunteer pastes the whole request sheet into a public link — nobody broke a password; the sharing setting did it", "एक स्वयंसेवक पूरी अनुरोध शीट सार्वजनिक लिंक में डालता है — किसी ने पासवर्ड नहीं तोड़ा; शेयरिंग सेटिंग ने ही कर दिया"), noteTone: "risk" } },
      { map: { link: { "form>pub": "bad" }, state: { form: "risk", pub: "risk" }, note: t("Which response changes the exposure?", "कौन-सी प्रतिक्रिया ख़तरा बदलती है?"), noteTone: "info" } },
      { map: { link: { "form>pub": "off" }, state: { form: "ok", teacher: "ok", pub: "ok", board: "ok" }, note: t("The restricted sheet refuses the visitor test account; the board still shows progress", "सीमित शीट विज़िटर टेस्ट अकाउंट को मना करती है; बोर्ड फिर भी प्रगति दिखाता है"), noteTone: "ok" } },
      { map: { focus: true } },
    ],
    out: {
      rename: { map: { link: { "form>pub": "bad" }, state: { form: "risk", pub: "risk" }, note: t("A new link name changes nothing — forwarded copies still work", "लिंक का नया नाम कुछ नहीं बदलता — फ़ॉरवर्ड हुई कॉपियाँ चलती रहती हैं"), noteTone: "risk" } },
      restrict: { map: { link: { "form>pub": "off" }, state: { form: "ok", teacher: "ok", pub: "ok", board: "ok" }, note: t("Restrict the sheet and publish separate totals", "शीट सीमित करें और अलग से योग प्रकाशित करें"), noteTone: "ok" } },
      warning: { map: { link: { "form>pub": "bad" }, state: { form: "risk", pub: "risk" }, note: t("A polite note doesn't change who can open it", "विनम्र नोट से यह नहीं बदलता कि कौन खोल सकता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-access-ends-with-job", scene: "garden", layout: "two",
    label: t("Repair desk access ledger", "रिपेयर डेस्क पहुँच-बही"),
    art: [
      { k: "table", id: "ledger", at: "a", title: t("Resource · person · action · end point", "संसाधन · व्यक्ति · क्रिया · अंत-बिंदु"), icon: "clipboard", cols: [t("Resource", "संसाधन"), t("Person", "व्यक्ति"), t("Action", "क्रिया"), t("Ends", "ख़त्म")],
        rows: [{ id: "tickets", c: [t("Ticket statuses", "टिकट की स्थिति"), t("Afternoon volunteer", "दोपहर का स्वयंसेवक"), t("edit", "बदलना"), t("end of shift", "शिफ़्ट के अंत")] }, { id: "contacts", c: [t("Contact sheet", "संपर्क शीट"), t("Teacher", "टीचर"), t("read, update", "पढ़ना, बदलना"), t("while teaching", "पढ़ाने तक")] }, { id: "display", c: [t("Display board", "डिस्प्ले बोर्ड"), t("Visitor", "आगंतुक"), t("read", "पढ़ना"), t("never edit", "कभी बदलना नहीं")] }] },
      { k: "flow", id: "test", at: "b", look: "graph", title: t("Fictional account tests", "काल्पनिक अकाउंट परीक्षण"), icon: "checks", nodes: [{ id: "vis", t: t("Visitor", "आगंतुक"), icon: "user", x: 14, y: 20 }, { id: "vol", t: t("Volunteer", "स्वयंसेवक"), icon: "users", x: 14, y: 50 }, { id: "tea", t: t("Teacher", "टीचर"), icon: "user-ok", x: 14, y: 80 }, { id: "ct", t: t("Contact sheet", "संपर्क शीट"), icon: "contact", x: 84, y: 20 }, { id: "tk", t: t("Ticket list", "टिकट सूची"), icon: "list", x: 84, y: 50 }, { id: "ap", t: t("Access changes", "पहुँच-बदलाव"), icon: "settings", x: 84, y: 80 }],
        links: [{ from: "vis", to: "ct" }, { from: "vol", to: "ct" }, { from: "vol", to: "tk" }, { from: "tea", to: "ct" }, { from: "tea", to: "ap" }], link: { "vis>ct": "bad", "vol>ct": "bad", "vol>tk": "on", "tea>ct": "on", "tea>ap": "on" } },
    ],
    sc: [
      { ledger: { focus: true, note: t("Reva notices the volunteer role edits every folder — visitors only need the display", "रेवा देखती है कि स्वयंसेवक भूमिका हर फ़ोल्डर बदल सकती है — आगंतुकों को सिर्फ़ डिस्प्ले चाहिए"), noteTone: "warn" } },
      { ledger: { mark: { tickets: "ok" }, note: t("Write resource, named person, permitted action and end point on one ledger", "संसाधन, नामित व्यक्ति, अनुमत क्रिया और अंत-बिंदु एक ही बही पर लिखें"), noteTone: "info" } },
      { test: { focus: true, note: t("A blocked contact sheet is expected for visitor and volunteer — a blocked ticket list would stop the job", "आगंतुक और स्वयंसेवक के लिए संपर्क शीट बंद अपेक्षित है — टिकट सूची बंद होती तो काम रुकता"), noteTone: "ok" }, ledger: { focus: false, note: undefined } },
      { test: { focus: false, note: undefined }, ledger: { txt: { "tickets:3": t("shift over", "शिफ़्ट ख़त्म") }, mark: { tickets: "warn" }, note: t("What proves the ended shift no longer permits editing?", "क्या साबित करता है कि ख़त्म शिफ़्ट में अब बदलना संभव नहीं?"), noteTone: "info" } },
      { ledger: { txt: { "tickets:2": t("none", "कोई नहीं"), "tickets:3": t("ended — retested", "समाप्त — दोबारा जाँचा") }, mark: { tickets: "gone" }, note: t("A one-afternoon helper gets only ticket sorting — not a copy of the teacher role", "एक दोपहर का सहायक सिर्फ़ टिकट छाँटता है — टीचर भूमिका की नक़ल नहीं"), noteTone: "ok" }, test: { link: { "vol>tk": "off" }, state: { vol: "muted" } } },
      { ledger: { focus: true } },
    ],
    out: {
      timetable: { ledger: { txt: { "tickets:3": t("crossed out on paper", "काग़ज़ पर कटा") }, mark: { tickets: "warn" }, note: t("A crossed-out line doesn't remove the permission", "कटी हुई पंक्ति अनुमति नहीं हटाती"), noteTone: "risk" }, test: { link: { "vol>tk": "on" } } },
      promise: { ledger: { mark: { tickets: "warn" }, note: t("A promise isn't a control", "वादा कोई नियंत्रण नहीं है"), noteTone: "risk" }, test: { link: { "vol>tk": "on" } } },
      retest: { ledger: { txt: { "tickets:2": t("none", "कोई नहीं"), "tickets:3": t("ended — retested", "समाप्त — दोबारा जाँचा") }, mark: { tickets: "gone" }, note: t("Remove editing, then test the former volunteer account", "बदलना हटाएँ, फिर पूर्व स्वयंसेवक अकाउंट जाँचें"), noteTone: "ok" }, test: { link: { "vol>tk": "bad" }, state: { vol: "ok" } } },
    },
  },
  {
    slug: "class9-sign-in-context", scene: "night", layout: "two",
    label: t("Repair portal sign-ins · whose attempt is it?", "रिपेयर पोर्टल साइन-इन · यह किसकी कोशिश है?"),
    art: [
      { k: "screen", id: "prompt", at: "a", look: "phone", blocks: [{ id: "h", type: "banner", t: t("Approve this sign-in?", "क्या यह साइन-इन मंज़ूर करें?"), sub: t("Repair portal · classroom tablet", "रिपेयर पोर्टल · क्लासरूम टैबलेट"), icon: "bell" }, { id: "ctx", type: "row", t: t("Device and time", "डिवाइस और समय"), sub: t("matches Reva's own sign-in", "रेवा के अपने साइन-इन से मेल"), icon: "clock" }, { id: "ok", type: "btn", t: t("Approve", "मंज़ूर"), icon: "check" }] },
      { k: "table", id: "cards", at: "b", title: t("Prompt cards", "प्रॉम्प्ट कार्ड"), icon: "list", cols: [t("Card", "कार्ड"), t("Did we start it?", "क्या हमने शुरू किया?"), t("Context matches?", "संदर्भ मेल?")], rows: [{ id: "c1", c: ["1", "✓", "✓"] }, { id: "c2", c: ["2", "✗", "✗"] }, { id: "alert", c: [t("Alert: unknown session", "अलर्ट: अनजान सेशन"), "?", "?"] }], upTo: 1 },
    ],
    sc: [
      { prompt: { focus: true, mark: { ctx: "ok" }, note: t("Reva started this sign-in; Nikhil checks the device and time with her first", "यह साइन-इन रेवा ने शुरू किया; निखिल पहले उसके साथ डिवाइस और समय देखता है"), noteTone: "ok" } },
      { prompt: { mark: { ctx: "risk", h: "risk" }, txt: {}, note: t("Later the tablet asks again — neither is signing in. A familiar logo can't replace context.", "बाद में टैबलेट फिर पूछता है — कोई साइन-इन नहीं कर रहा। जाना-पहचाना लोगो संदर्भ की जगह नहीं ले सकता।"), noteTone: "risk" }, cards: { upTo: 2, mark: { c2: "risk" } } },
      { cards: { upTo: 3, mark: { c2: "risk", alert: "warn" }, note: t("Nikhil wants the alert's recovery link — the teacher opens the portal through the saved school route instead", "निखिल अलर्ट का रिकवरी लिंक चाहता है — टीचर इसके बजाय सेव किए स्कूल रास्ते से पोर्टल खोलती हैं"), noteTone: "info" }, prompt: { focus: false, note: undefined } },
      { prompt: { note: t("What should Reva do with the uninitiated approval?", "बिना शुरू किए आई मंज़ूरी का रेवा क्या करे?"), noteTone: "info" }, cards: { note: undefined } },
      { prompt: { mark: { ctx: "risk", h: "ok", ok: "hide" }, note: t("Refused — then review the session through the verified account page", "मना किया — फिर सत्यापित अकाउंट पेज से सेशन की समीक्षा"), noteTone: "ok" }, cards: { mark: { c2: "ok", alert: "ok" } } },
      { prompt: { focus: true } },
    ],
    out: {
      approve: { prompt: { mark: { ok: "press", h: "risk", ctx: "risk" }, note: t("Approving once to make it stop approves someone else's attempt", "रोकने के लिए एक बार मंज़ूर करना किसी और की कोशिश मंज़ूर करना है"), noteTone: "risk" } },
      refuse: { prompt: { mark: { ctx: "risk", h: "ok", ok: "hide" }, note: t("Refuse, then seek help through the school's known route", "मना करें, फिर स्कूल के जाने-पहचाने रास्ते से मदद लें"), noteTone: "ok" } },
      ignore: { prompt: { mark: { h: "warn" }, note: t("Dismissing it and never reviewing leaves the unfamiliar session open", "ख़ारिज करके कभी जाँच न करना अनजान सेशन खुला छोड़ देता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-secure-connection-evidence", scene: "street", layout: "two",
    label: t("Uploading repair totals over a shared network", "साझा नेटवर्क पर रिपेयर योग अपलोड करना"),
    art: [
      { k: "screen", id: "page", at: "a", look: "browser", lock: "ok", url: [{ t: "https://" }, { t: "desk.school.example", mark: "ok" }, { t: ".helper.example", mark: "risk" }], blocks: [{ id: "crest", type: "banner", t: t("Copied school crest", "नक़ल किया स्कूल का प्रतीक"), icon: "school" }, { id: "up", type: "field", t: t("Upload repair totals", "रिपेयर योग अपलोड करें"), sub: t("totals + repair contacts", "योग + रिपेयर संपर्क") }] },
      { k: "table", id: "claims", at: "b", title: t("What the padlock covers", "ताला किसे ढकता है"), icon: "lock", cols: [t("Question", "सवाल"), t("Secure connection says…", "सुरक्षित कनेक्शन कहता है…")], rows: [{ id: "tr", c: [t("Is the data protected on the way to this host?", "क्या इस होस्ट तक रास्ते में डेटा सुरक्षित है?"), "?"] }, { id: "ap", c: [t("Did the school approve this page?", "क्या स्कूल ने यह पेज मंज़ूर किया?"), "?"] }, { id: "tru", c: [t("Is every claim on it true?", "क्या इस पर हर दावा सच है?"), "?"] }, { id: "who", c: [t("Who receives the information?", "जानकारी किसे मिलती है?"), "?"] }] },
    ],
    sc: [
      { page: { focus: true, note: t("Nikhil sees the secure notice and calls the page trustworthy", "निखिल सुरक्षित सूचना देखकर पेज को भरोसेमंद कहता है"), noteTone: "warn" } },
      { claims: { txt: { "tr:1": "✓", "ap:1": "✗", "tru:1": "✗", "who:1": "✗" }, mark: { tr: "ok", ap: "warn", tru: "warn", who: "warn" }, note: t("It covers protected transport to the displayed hostname — nothing more", "यह दिखाए होस्टनाम तक सुरक्षित परिवहन ढकता है — इससे ज़्यादा कुछ नहीं"), noteTone: "info" }, page: { focus: false, note: undefined } },
      { page: { note: t("The school card names desk.school.example; this host is desk.school.example.helper.example", "स्कूल कार्ड में desk.school.example है; यह होस्ट desk.school.example.helper.example है"), noteTone: "risk" } },
      { page: { note: undefined }, claims: { note: t("What does the secure connection notice establish here?", "यहाँ सुरक्षित कनेक्शन सूचना क्या साबित करती है?"), noteTone: "info" } },
      { page: { url: [{ t: "https://" }, { t: "desk.school.example", mark: "ok" }], blocks: [{ id: "crest", type: "banner", t: t("Opened from the saved school route", "सेव किए स्कूल रास्ते से खोला"), icon: "bookmark" }, { id: "up", type: "field", t: t("Upload repair totals", "रिपेयर योग अपलोड करें"), sub: t("totals only", "सिर्फ़ योग") }], mark: { crest: "ok", up: "ok" }, note: t("Switching networks wouldn't fix a wrong host or audience — the saved route does", "नेटवर्क बदलने से ग़लत होस्ट या दर्शक नहीं सुधरता — सेव किया रास्ता सुधारता है"), noteTone: "ok" }, claims: { txt: { "tr:1": "✓", "ap:1": "✓ (checked)", "tru:1": "✗", "who:1": "✓ (school)" }, mark: { tr: "ok", ap: "ok", tru: "warn", who: "ok" } } },
      { page: { focus: true } },
    ],
    out: {
      all: { claims: { txt: { "tru:1": "✓?!" }, mark: { tru: "risk" }, note: t("A padlock never verifies what a page claims", "ताला पेज के दावों की पुष्टि कभी नहीं करता"), noteTone: "risk" } },
      transport: { claims: { txt: { "tr:1": "✓", "ap:1": "✗", "tru:1": "✗", "who:1": "✗" }, mark: { tr: "ok", ap: "warn", tru: "warn", who: "warn" }, note: t("Transport to that displayed host is encrypted — that's all", "उस दिखाए होस्ट तक परिवहन एन्क्रिप्टेड है — बस इतना"), noteTone: "ok" } },
      recipient: { claims: { mark: { who: "risk" }, note: t("Encryption doesn't decide who may collect contacts", "एन्क्रिप्शन तय नहीं करता कि संपर्क कौन जमा कर सकता है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-collect-less-retain-less", scene: "classroom", layout: "two",
    label: t("Repair request form · what do we really need?", "रिपेयर अनुरोध फ़ॉर्म · असल में क्या चाहिए?"),
    art: [
      { k: "doc", id: "form", at: "a", look: "form", pic: "clipboard", title: t("Nikhil's draft form", "निखिल का ड्राफ़्ट फ़ॉर्म"), sub: t("The desk repairs book covers and returns them via the teacher", "डेस्क किताबों के कवर सुधारता है और टीचर के ज़रिए लौटाता है"), toks: [{ id: "tk", t: t("Ticket number", "टिकट नंबर"), icon: "hash" }, { id: "dmg", t: t("Damage category", "क्षति की श्रेणी"), icon: "alert" }, { id: "addr", t: t("Home address", "घर का पता"), icon: "home" }, { id: "game", t: t("Favourite game", "पसंदीदा खेल"), icon: "game" }] },
      { k: "time", id: "keep", at: "b", title: t("How long contacts are kept", "संपर्क कितने समय रखे जाते हैं"), icon: "hourglass", ev: [{ id: "k1", at: "1", t: t("Request made", "अनुरोध किया"), icon: "file" }, { id: "k2", at: "2", t: t("Book repaired and collected", "किताब सुधरी और ली गई"), icon: "check" }, { id: "k3", at: "3", t: t("Teacher closes any return query", "टीचर वापसी का सवाल बंद करती हैं"), icon: "clipboard-ok" }, { id: "k4", at: "4", t: t("Contact record deleted; anonymous totals stay", "संपर्क रिकॉर्ड हटा; गुमनाम योग रहते हैं"), icon: "trash" }], upTo: 1 },
    ],
    sc: [
      { form: { focus: true, mark: { tk: "ok", dmg: "ok", addr: "warn", game: "warn" }, note: t("Reva asks what the desk actually does with each field", "रेवा पूछती है कि डेस्क हर फ़ील्ड का असल में क्या करता है"), noteTone: "info" } },
      { form: { mark: { tk: "ok", dmg: "ok", addr: "risk", game: "risk" }, note: t("Volunteers need ticket and category; only the teacher uses contacts; address and game fit no step", "स्वयंसेवकों को टिकट और श्रेणी चाहिए; संपर्क सिर्फ़ टीचर इस्तेमाल करती हैं; पता और खेल किसी चरण में नहीं"), noteTone: "warn" } },
      { keep: { upTo: 4, focus: true, mark: { k4: "ok" }, note: t("Retention ends at collection + closed query — not 'keep forever'", "रखने की अवधि कलेक्शन + बंद सवाल पर ख़त्म — 'हमेशा' नहीं"), noteTone: "ok" }, form: { focus: false, note: undefined } },
      { keep: { focus: false, upTo: 4, note: t("A celebration request: reuse the repair contacts to invite families?", "उत्सव का अनुरोध: परिवारों को बुलाने के लिए रिपेयर संपर्क दोबारा इस्तेमाल करें?"), noteTone: "info" } },
      { form: { mark: { tk: "ok", dmg: "ok", addr: "gone", game: "gone" }, note: t("A minimal form for volunteers", "स्वयंसेवकों के लिए न्यूनतम फ़ॉर्म"), noteTone: "ok" }, keep: { upTo: 4, note: t("An approved general notice — no repair contacts exported; families choose whether to reply", "मंज़ूर सामान्य सूचना — रिपेयर संपर्क नहीं भेजे; परिवार चुनें कि जवाब दें या नहीं"), noteTone: "ok" } },
      { keep: { focus: true } },
    ],
    out: {
      reuse: { keep: { upTo: 4, mark: { k4: "risk" }, note: t("Having the data isn't permission to use it for a new purpose", "डेटा होना नए मक़सद के लिए इस्तेमाल की अनुमति नहीं"), noteTone: "risk" } },
      notice: { keep: { upTo: 4, mark: { k4: "ok" }, note: t("Use an approved general notice — no export", "मंज़ूर सामान्य सूचना इस्तेमाल करें — कोई निर्यात नहीं"), noteTone: "ok" } },
      hide: { form: { mark: { tk: "gone", dmg: "ok", addr: "risk", game: "risk" } }, keep: { upTo: 4, mark: { k4: "risk" }, note: t("Dropping ticket numbers and sending every contact is worse", "टिकट नंबर हटाकर सारे संपर्क भेजना और बुरा है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-safe-update-route", scene: "classroom", layout: "two",
    label: t("An 'urgent update' banner on the desk tablet", "डेस्क टैबलेट पर 'ज़रूरी अपडेट' बैनर"),
    art: [
      { k: "screen", id: "banner", at: "a", look: "phone", blocks: [{ id: "ad", type: "popup", t: t("URGENT UPDATE — download now!", "ज़रूरी अपडेट — अभी डाउनलोड करें!"), sub: t("Turn off protection first. 02:00 left.", "पहले सुरक्षा बंद करें। 02:00 बचे।"), icon: "siren" }, { id: "dl", type: "btn", t: t("Download replacement", "रिप्लेसमेंट डाउनलोड"), icon: "download" }] },
      { k: "flow", id: "admin", at: "b", look: "steps", title: t("The school's update route", "स्कूल का अपडेट रास्ता"), icon: "checks", nodes: [{ id: "u1", t: t("Admin checks managed settings", "एडमिन मैनेज्ड सेटिंग जाँचता है"), icon: "settings", x: 12, y: 50 }, { id: "u2", t: t("Plan a restart window", "रीस्टार्ट का समय तय करें"), icon: "clock", x: 38, y: 50 }, { id: "u3", t: t("Update, then verify", "अपडेट, फिर जाँच"), icon: "refresh", x: 64, y: 50 }, { id: "u4", t: t("Tool still opens", "टूल अब भी खुलता है"), icon: "check", x: 90, y: 50 }], links: [{ from: "u1", to: "u2" }, { from: "u2", to: "u3" }, { from: "u3", to: "u4" }], state: { u1: "muted", u2: "muted", u3: "muted", u4: "muted" } },
    ],
    sc: [
      { banner: { focus: true, mark: { ad: "risk" }, note: t("Reva hasn't opened the school update tool; Nikhil notices it asks to turn off protection", "रेवा ने स्कूल का अपडेट टूल नहीं खोला; निखिल देखता है कि यह सुरक्षा बंद करने को कहता है"), noteTone: "warn" } },
      { admin: { state: { u1: "now" }, focus: true, note: t("The ad has no link to the school record — a familiar product name doesn't establish a source", "विज्ञापन का स्कूल रिकॉर्ड से कोई संबंध नहीं — जाना-पहचाना उत्पाद-नाम स्रोत साबित नहीं करता"), noteTone: "info" }, banner: { focus: false } },
      { admin: { state: { u1: "done", u2: "now" }, cur: "u2", note: t("An approved update exists, but active ticket work is open — save it and let the admin pick the restart window", "मंज़ूर अपडेट है, पर टिकट का काम खुला है — सेव करें और एडमिन को रीस्टार्ट का समय चुनने दें"), noteTone: "ok" } },
      { admin: { state: { u1: "muted", u2: "muted", u3: "muted", u4: "muted" }, cur: "u1", note: undefined }, banner: { note: t("How should the team handle the urgent banner?", "टीम इस ज़रूरी बैनर को कैसे सँभाले?"), noteTone: "info" } },
      { admin: { state: { u1: "done", u2: "done", u3: "done", u4: "ok" }, cur: "u4", note: t("After the administrator-led update: managed status checked, repair tool opens", "एडमिन-नेतृत्व वाले अपडेट के बाद: मैनेज्ड स्थिति जाँची, रिपेयर टूल खुलता है"), noteTone: "ok" }, banner: { mark: { ad: "hide", dl: "hide" } } },
      { admin: { focus: true } },
    ],
    out: {
      banner: { banner: { mark: { dl: "press", ad: "risk" }, note: t("Beating the countdown means skipping every check", "काउंटडाउन से पहले करना मतलब हर जाँच छोड़ना"), noteTone: "risk" } },
      never: { banner: { mark: { ad: "warn" }, note: t("Updates can fix problems — rejecting them all isn't a plan", "अपडेट समस्याएँ ठीक कर सकते हैं — सब ठुकराना योजना नहीं"), noteTone: "risk" } },
      admin: { banner: { mark: { ad: "hide", dl: "hide" } }, admin: { state: { u1: "done", u2: "done", u3: "done", u4: "ok" }, cur: "u4", note: t("Stop the banner route; ask for the managed update check", "बैनर का रास्ता रोकें; मैनेज्ड अपडेट जाँच माँगें"), noteTone: "ok" } },
    },
  },
  {
    slug: "class9-shared-folder-recovery", scene: "night", layout: "two",
    label: t("The repair folder changed overnight", "रिपेयर फ़ोल्डर रात भर में बदल गया"),
    art: [
      { k: "time", id: "log", at: "a", title: t("Change log (who? — unknown)", "बदलाव लॉग (किसने? — अज्ञात)"), icon: "history", ev: [{ id: "l1", at: "17:02", t: t("5 ticket files renamed", "5 टिकट फ़ाइलें का नाम बदला"), icon: "pencil" }, { id: "l2", at: "17:04", t: t("Sharing changed: restricted → link", "शेयरिंग बदली: सीमित → लिंक"), icon: "unlock" }, { id: "l3", at: "17:10", t: t("Reva notices; ordinary editing stops", "रेवा देखती है; सामान्य संपादन रुकता है"), icon: "eye" }], upTo: 2 },
      { k: "table", id: "copies", at: "b", hide: true, title: t("Candidate backups", "संभावित बैकअप"), icon: "archive", cols: [t("Copy", "कॉपी"), t("Date", "तारीख"), t("Tested?", "जाँचा?"), t("Missing", "ग़ायब")], rows: [{ id: "new", c: [t("Newest", "सबसे नई"), t("today", "आज"), "✗", "?"] }, { id: "old", c: [t("Earlier checked copy", "पहले की जाँची कॉपी"), t("yesterday", "कल"), "✓", t("later edits", "बाद के संपादन")] }] },
    ],
    sc: [
      { log: { upTo: 3, focus: true, mark: { l3: "ok" }, note: t("Stop editing — random repairs could overwrite evidence about the change", "संपादन रोकें — बेतरतीब मरम्मत बदलाव के सबूत मिटा सकती है"), noteTone: "warn" } },
      { log: { upTo: 2, mark: { l1: "warn", l2: "risk" }, note: t("Filenames, times and permission changes — but not who. Write observations; leave the cause unknown.", "फ़ाइल-नाम, समय और अनुमति-बदलाव — पर किसने नहीं। अवलोकन लिखें; कारण अज्ञात छोड़ें।"), noteTone: "info" } },
      { log: { upTo: 3, note: t("Tell the teacher through the known school route; keep the change details; don't delete or confront", "टीचर को जाने-पहचाने रास्ते से बताएँ; बदलाव का ब्योरा रखें; हटाएँ या सामना न करें"), noteTone: "ok" } },
      { copies: { hide: false, focus: true, note: t("What should determine the recovery candidate?", "रिकवरी का उम्मीदवार किससे तय हो?"), noteTone: "info" }, log: { focus: false, note: undefined } },
      { copies: { mark: { old: "ok", new: "muted" }, note: t("Open it in a separate test location: files open, ticket counts match, access restricted — and record the missing later edits", "इसे अलग टेस्ट जगह में खोलें: फ़ाइलें खुलें, टिकट गिनती मेल खाए, पहुँच सीमित — और छूटे बाद के संपादन दर्ज करें"), noteTone: "ok" } },
      { copies: { focus: true } },
    ],
    out: {
      newest: { copies: { hide: false, mark: { new: "risk" }, note: t("The newest date might carry the changes — inspect before trusting", "सबसे नई तारीख़ में बदलाव शामिल हो सकते हैं — भरोसे से पहले जाँचें"), noteTone: "risk" } },
      checked: { copies: { hide: false, mark: { old: "ok", new: "muted" }, note: t("Test the earlier checked copy and record the missing later edits", "पहले की जाँची कॉपी परखें और छूटे बाद के संपादन दर्ज करें"), noteTone: "ok" } },
      delete: { log: { mark: { l1: "gone", l2: "gone" }, note: t("Deleting first destroys the only record", "पहले हटाना एकमात्र रिकॉर्ड नष्ट करना है"), noteTone: "risk" } },
    },
  },
  {
    slug: "class9-open-desk-evidence", scene: "market", layout: "two",
    label: t("Readiness sheet · evidence must be current", "तैयारी शीट · सबूत मौजूदा होना चाहिए"),
    art: [
      { k: "table", id: "ready", at: "a", title: t("Opening review", "खुलने की समीक्षा"), icon: "clipboard-ok", cols: [t("Check", "जाँच"), t("Yesterday's tick", "कल की टिक"), t("Re-tested today", "आज दोबारा जाँचा")], rows: [{ id: "upd", c: [t("Approved update status", "मंज़ूर अपडेट की स्थिति"), "✓", "?"] }, { id: "bk", c: [t("Tested backup", "जाँचा बैकअप"), "✓", "?"] }, { id: "rep", c: [t("Replacement can do the task", "प्रतिस्थापन काम कर सकता है"), "✓", "?"] }, { id: "old", c: [t("Former helper is blocked", "पूर्व सहायक बंद है"), "✓", "?"] }] },
      { k: "flow", id: "fix", at: "b", look: "steps", hide: true, title: t("Repair, in an auditable order", "जाँचने योग्य क्रम में मरम्मत"), icon: "wrench", nodes: [{ id: "f1", t: t("Remove the old grant", "पुराना अधिकार हटाएँ"), icon: "user-x", x: 14, y: 50 }, { id: "f2", t: t("Retest as former helper", "पूर्व सहायक बनकर दोबारा जाँचें"), icon: "refresh", x: 50, y: 50 }, { id: "f3", t: t("Then open ticket work", "फिर टिकट का काम खोलें"), icon: "unlock", x: 86, y: 50 }], links: [{ from: "f1", to: "f2" }, { from: "f2", to: "f3" }], state: { f1: "now" } },
    ],
    sc: [
      { ready: { focus: true, note: t("A tick written before a change may describe a plan that no longer exists", "बदलाव से पहले लिखी टिक किसी ऐसी योजना की हो सकती है जो अब नहीं है"), noteTone: "warn" } },
      { ready: { txt: { "upd:2": "✓", "bk:2": "✓", "rep:2": "✓", "old:2": "?" }, note: t("A replacement took over — yesterday's tests used the old account", "एक प्रतिस्थापन ने काम सँभाला — कल के परीक्षण पुराने अकाउंट पर थे"), noteTone: "info" } },
      { ready: { txt: { "upd:2": "✓", "bk:2": "✓", "rep:2": "✓", "old:2": "✗ still edits!" }, mark: { old: "risk" }, note: t("The simulation shows the former helper can still edit tickets — a backup doesn't remove live editing rights", "सिमुलेशन में पूर्व सहायक अब भी टिकट बदल सकता है — बैकअप चालू संपादन अधिकार नहीं हटाता"), noteTone: "risk" } },
      { ready: { note: t("May the team rely on the ready backup to ignore the failed permission test?", "क्या टीम तैयार बैकअप के भरोसे फ़ेल हुई अनुमति-जाँच अनदेखी कर सकती है?"), noteTone: "info" } },
      { ready: { txt: { "upd:2": "✓", "bk:2": "✓", "rep:2": "✓", "old:2": "✓ retested" }, mark: { old: "ok", upd: "ok", bk: "ok", rep: "ok" }, note: t("A review still can't say whether an earlier public sheet was copied — the teacher owns that follow-up", "समीक्षा अब भी नहीं बता पाती कि पहले की सार्वजनिक शीट कॉपी हुई या नहीं — वह फ़ॉलो-अप टीचर के पास"), noteTone: "info" }, fix: { hide: false, state: { f1: "done", f2: "done", f3: "ok" } } },
      { ready: { focus: true } },
    ],
    out: {
      backup: { ready: { txt: { "old:2": "✗ still edits!" }, mark: { old: "risk" }, note: t("A ready backup doesn't fix who can edit right now", "तैयार बैकअप यह नहीं सुधारता कि अभी कौन बदल सकता है"), noteTone: "risk" } },
      repair: { ready: { txt: { "old:2": "✓ retested" }, mark: { old: "ok" }, note: t("Remove the old grant, retest, then open", "पुराना अधिकार हटाएँ, दोबारा जाँचें, फिर खोलें"), noteTone: "ok" }, fix: { hide: false, state: { f1: "done", f2: "done", f3: "ok" } } },
      tick: { ready: { txt: { "old:2": "✓ (yesterday's tick)" }, mark: { old: "warn" }, note: t("Yesterday's tick is a record of yesterday", "कल की टिक कल का रिकॉर्ड है"), noteTone: "risk" } },
    },
  },
];
