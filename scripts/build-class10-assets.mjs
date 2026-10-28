/** Compile the approved Class 10 Decision Lab text, scripts and Hindi pairs. */
import {compileStructuredCourse} from './build-structured-course.mjs';
import {expandClass10Speech} from './class10-assets-lib.mjs';

await compileStructuredCourse({grade:10,speech:expandClass10Speech,manualMessages:{
  'Decision Lab':'डिसीज़न लैब',
  'CyberShiksha Decision Lab · Class 10':'CyberShiksha डिसीज़न लैब · क्लास 10',
  'Trace access, requests and recovery before publishing shared work.':'साझा काम प्रकाशित करने से पहले एक्सेस, अनुरोध और रिकवरी की जाँच करें।',
  'Compare models, trace image and text processing, and explain evaluation evidence.':'मॉडल की तुलना करें, चित्र और शब्दों की प्रोसेसिंग देखें और मूल्यांकन के सबूत समझाएँ।',
  'Trace state, data and algorithms; test constraints and alternative plans.':'स्थिति, डेटा और एल्गोरिदम का क्रम देखें; शर्तें और वैकल्पिक प्लान जाँचें।',
  'Check sources, payment claims and coercive requests using independent evidence.':'स्वतंत्र सबूतों से स्रोत, पेमेंट के दावे और दबाव वाले अनुरोध जाँचें।',
  'Compare alternatives, explain consequences and defend decisions through 32 original chapters.':'32 नए चैप्टर में विकल्पों की तुलना करें, परिणाम समझाएँ और अपने फ़ैसलों का आधार बताएँ।',
}});
