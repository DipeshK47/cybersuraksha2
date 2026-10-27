import { useEffect, useState } from "react";
import { l } from "../../../../data/class8/types";
export const ui = {
  answer: l("Submitted answer", "दिया गया जवाब"),
  signalEvidence: l("Signal bits", "सिग्नल बिट"),
  selectedCells: l("Selected cells", "चुने हुए खाने"),
  trace: l("Full route trace", "रास्ते का पूरा रिकॉर्ड"),
  finalPosition: l("Final position", "आख़िरी जगह"),
  collectedStops: l("Collected stops", "लिए गए पड़ाव"),
  failedMove: l("Failed move number", "गलत कदम का नंबर"),
  lab: l("Class 8 Future Lab", "क्लास 8 फ़्यूचर लैब"),
  check: l("Check my evidence", "मेरी जानकारी चेक करें"),
  test: l("Run the test", "टेस्ट चलाएँ"),
  choose: l("Choose an action…", "एक कदम चुनें…"),
  undo: l("Undo last step", "पिछला कदम हटाएँ"),
  reset: l("Clear my plan", "मेरा प्लान साफ़ करें"),
  plan: l("Your action plan", "आपका एक्शन प्लान"),
  source: l("Supplied evidence", "दी गई जानकारी"),
  preview: l("Test result", "टेस्ट का नतीजा"),
  expected: l("Expected label", "सही लेबल"),
  predicted: l("Model prediction", "मॉडल का अनुमान"),
  uncertain: l("Not enough evidence: ask a person", "जानकारी काफ़ी नहीं है: किसी व्यक्ति से पूछें"),
  training: l("Choose training examples", "ट्रेनिंग के उदाहरण चुनें"),
  testing: l("Separate test examples", "अलग टेस्ट वाले उदाहरण"),
  modelNote: l("This classroom model picks the label of the nearest selected number. Equally close conflicting labels make it abstain. It is a small simulation, not a real recycling system.", "यह क्लासरूम मॉडल चुने हुए सबसे नज़दीकी नंबर का लेबल लेता है। बराबर दूरी पर अलग लेबल मिलने पर यह जवाब नहीं देता। यह छोटा सिम्युलेशन है, असली रीसाइक्लिंग सिस्टम नहीं।"),
  lamp: l("Signal lamps", "सिग्नल लाइटें"),
  total: l("Current total", "अभी का कुल"),
  target: l("Target number", "लक्ष्य नंबर"),
  route: l("Robot route", "रोबोट का रास्ता"),
  up: l("Up", "ऊपर"), right: l("Right", "दाएँ"), down: l("Down", "नीचे"), left: l("Left", "बाएँ"),
  row: l("Row", "पंक्ति"), column: l("Column", "कॉलम"),
  cell: l("Row {{0}}, column {{1}}", "पंक्ति {{0}}, कॉलम {{1}}"),
  started: l("Start", "शुरू"), goal: l("Goal", "लक्ष्य"), stop: l("Collect", "लें"), blocked: l("Blocked", "बंद"),
  routeOk: l("The robot reached this square. Check the goal, required stops and step budget before approving.", "रोबोट इस खाने तक पहुँचा। मंज़ूरी देने से पहले लक्ष्य, ज़रूरी पड़ाव और कदमों की सीमा चेक करें।"),
  routeFail: l("The route hit a blocked square or the edge. The robot stopped before the invalid move; revise the plan.", "रास्ते में बंद खाना या किनारा आ गया। रोबोट गलत कदम से पहले रुक गया; प्लान बदलें।"),
  hidden: l("Hidden in public preview", "पब्लिक प्रीव्यू में छिपा है"),
  visible: l("Visible in public preview", "पब्लिक प्रीव्यू में दिख रहा है"),
  evidence: l("Your evidence notebook", "आपकी जानकारी वाली नोटबुक"),
  reflect: l("Explain it in your own words", "अपने शब्दों में समझाएँ"),
  reflectionNote: l("Your teacher reviews this explanation separately. Do not enter passwords, phone numbers or other personal information.", "इस जवाब को आपके टीचर अलग से देखेंगे। पासवर्ड, फ़ोन नंबर या दूसरी निजी जानकारी न लिखें।"),
  teacher: l("Teacher guide and rubric", "टीचर गाइड और मूल्यांकन के बिंदु"),
  objectives: l("What you will learn", "आप क्या सीखेंगे"),
  topics: l("Three connected topics", "तीन जुड़े हुए टॉपिक"),
  scaffold: l("Use the evidence to explain a decision, test it, then try it in a changed situation.", "दी गई जानकारी से अपना फ़ैसला समझाएँ, उसे टेस्ट करें, फिर बदली हुई स्थिति में आज़माएँ।"),
  taskHint: l("Show a clue", "एक संकेत दिखाएँ"),
  storyLocked: l("Try the decision and inspect its result before continuing the story.", "कहानी आगे बढ़ाने से पहले फ़ैसला आज़माएँ और उसका नतीजा देखें।"),
  storyWait: l("The team is waiting for your tested decision.", "टीम आपके चेक किए हुए फ़ैसले का इंतज़ार कर रही है।"),
  begin: l("Open the practice lab", "प्रैक्टिस लैब खोलें"),
  storyLabels: [l("Meet the team", "टीम से मिलें"), l("The problem", "समस्या"), l("How it works", "यह कैसे काम करता है"), l("Your decision", "आपका फ़ैसला"), l("What changes", "क्या बदलता है"), l("Enter the lab", "लैब में चलें")],
};

/** Evidence contains dynamic IDs and values, so select authored text directly. */
export function useEvidenceLanguage(): "en" | "hi" {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  useEffect(() => {
    const update = () => setLanguage(document.documentElement.lang === "hi" ? "hi" : "en");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);
  return language;
}
