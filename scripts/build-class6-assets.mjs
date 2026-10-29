/** Compile the authored Class 6 course through the existing story/localisation pipeline. */
import { compileStructuredCourse } from './build-structured-course.mjs';
await compileStructuredCourse({ grade: 6, manualMessages: {
  'Discovery Club': 'डिस्कवरी क्लब',
  'CyberShiksha Discovery Club · Class 6': 'साइबरशिक्षा डिस्कवरी क्लब · क्लास 6',
  'Build safe digital habits and solve everyday problems through 32 original chapters.': '32 नए चैप्टर से सुरक्षित डिजिटल आदतें बनाएँ और रोज़ की समस्याएँ सुलझाएँ।',
  'Protect private information, accounts and shared devices with safe everyday choices.': 'रोज़ के सुरक्षित फ़ैसलों से निजी जानकारी, अकाउंट और साझा डिवाइस की रक्षा करें।',
  'Explore examples, predictions and mistakes, and keep people responsible for AI-assisted work.': 'उदाहरण, अनुमान और गलतियाँ समझें और एआई की मदद वाले काम में लोगों की ज़िम्मेदारी रखें।',
  'Break tasks into steps, explain patterns, test rules and debug routes through practical challenges.': 'काम के हिस्से करें, पैटर्न समझाएँ, नियम जाँचें और व्यावहारिक चुनौतियों में रास्ते सुधारें।',
  'Recognise reward traps, secret requests and pressure, then seek trusted help through known routes.': 'इनाम के जाल, रहस्य की माँग और दबाव पहचानें, फिर ज्ञात रास्तों से भरोसेमंद मदद लें।',
} });
