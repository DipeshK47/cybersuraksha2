/** Compile the authored Class 7 course through the existing story/localisation pipeline. */
import { compileStructuredCourse } from './build-structured-course.mjs';
await compileStructuredCourse({ grade: 7, manualMessages: {
  "Connection Lab": "कनेक्शन लैब",
  "CyberShiksha Connection Lab · Class 7": "साइबरशिक्षा कनेक्शन लैब · क्लास 7",
  "Connect ideas, test evidence and explain decisions through 32 original chapters.": "32 नए चैप्टर से विचार जोड़ें, जानकारी जाँचें और फ़ैसले समझाएँ।",
  "Connect privacy clues, manage access, inspect web addresses and test recovery plans.": "निजता के संकेत जोड़ें, पहुँच सँभालें, वेब पते जाँचें और रिकवरी योजना टेस्ट करें।",
  "Compare helpers, train a small model, inspect mistakes and check generated explanations.": "सहायक मिलाएँ, छोटा मॉडल सिखाएँ, गलतियाँ देखें और बनाए उत्तर जाँचें।",
  "Model relevant details, trace binary signals and loops, and test sorting, search and rover routes.": "ज़रूरी बात का मॉडल, बाइनरी संकेत और लूप समझें तथा छँटाई, खोज और रोवर रास्ते जाँचें।",
  "Check identity, requested actions and recurring costs, then record facts and seek trusted support.": "पहचान, माँगे कदम और दोहराता खर्च जाँचें, फिर तथ्य लिखकर भरोसेमंद मदद लें।"
} });
