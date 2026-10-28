/** Compile original Class 9 content and explicit Hindi pairs into local assets. */
import {compileStructuredCourse} from './build-structured-course.mjs';

await compileStructuredCourse({grade:9,manualMessages:{
    'Signal Studio':'सिग्नल स्टूडियो',
    'CyberShiksha Signal Studio · Class 9':'CyberShiksha सिग्नल स्टूडियो · क्लास 9',
    'Test access, connections, data use and recovery plans for a community learning desk.':'कम्युनिटी लर्निंग डेस्क के एक्सेस, कनेक्शन, डेटा के इस्तेमाल और रिकवरी प्लान जाँचें।',
    'Explore data, model errors, pixels and language through measured classroom investigations.':'क्लास में माप और जाँच करके डेटा, मॉडल की गलतियाँ, पिक्सेल और भाषा समझें।',
    'Trace variables, test conditions and records, and compare practical algorithms and route costs.':'वेरिएबल का रिकॉर्ड देखें, शर्तें और रिकॉर्ड जाँचें, फिर एल्गोरिदम और रास्तों का खर्च मिलाएँ।',
    'Check claims, payment directions and recurring permissions, and prepare useful evidence for help.':'दावे, पेमेंट की दिशा और बार-बार लागू होने वाली अनुमति जाँचें, फिर मदद के लिए काम के सबूत तैयार करें।',
    'Test systems, explain decisions and recognise pressure through 32 original chapters.':'32 नए चैप्टर में सिस्टम जाँचें, फ़ैसलों के कारण समझाएँ और दबाव पहचानें।',
}});
