import type { LessonHints } from "../../components/learning/LearningSupport";

export const lessonHints: LessonHints[] = [
  {
    title: "Decide what needs protection",
    prompt: "Look for the possible consequence if another person gets the information.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Ask what it can unlock",
        body: "Could someone use this information to enter an account, approve a payment, or spend money?",
      },
      {
        label: "Worked example",
        title: "Compare two items",
        body: "An ATM PIN can unlock money, so it stays private. A favourite colour cannot unlock an account.",
        example: "ATM PIN → private · Favourite colour → okay to share",
      },
      {
        label: "The rule",
        title: "Think about harm",
        body: "Keep information private when exposing it could let someone impersonate you, enter an account, or cause financial harm.",
      },
    ],
  },
  {
    title: "Remember the code team",
    prompt: "Each part has a different job: message, rule, distance, and result.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Find the number",
        body: "Which part contains a number such as 3 and tells the cipher how far to move?",
      },
      {
        label: "Worked example",
        title: "Separate rule and distance",
        body: "The cipher says to shift letters. The key says to shift them by three places.",
        example: "Cipher = shift · Key = 3",
      },
      {
        label: "The rule",
        title: "Name every part",
        body: "Plain message + cipher rule + key produces the encrypted message. Decryption reverses that process.",
      },
    ],
  },
  {
    title: "Follow the moving alphabet",
    prompt: "A shift of one always means the very next letter.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Say the alphabet aloud",
        body: "Start on the given letter and say only the next letter. Do not count the starting letter as a move.",
      },
      {
        label: "Worked example",
        title: "Move exactly once",
        body: "Starting at C, one forward move lands on D. Starting at Z, one forward move wraps to A.",
        example: "C → D · Z → A",
      },
      {
        label: "The rule",
        title: "The alphabet is a loop",
        body: "Every letter moves by the same key. When counting passes Z, continue again from A.",
      },
    ],
  },
  {
    title: "Read the cipher wheel",
    prompt: "The outer letter is plain. The aligned inner letter is its coded partner.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Set the key first",
        body: "Turn the wheel until the centre says Key 3. The mapping cannot be read correctly before the key is set.",
      },
      {
        label: "Worked example",
        title: "Count three moves",
        body: "Start at A and move forward three times: B is one, C is two, and D is three.",
        example: "A → B → C → D",
      },
      {
        label: "The rule",
        title: "Reuse one mapping",
        body: "With key 3, every plain letter matches the letter three places forward. The same alignment works for the whole alphabet.",
      },
    ],
  },
  {
    title: "Encode by moving forward",
    prompt: "Encoding hides the message, so follow the key in the forward direction.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Find the current plain letter",
        body: "Point to the letter you are encoding. Then count three new letters forward.",
      },
      {
        label: "Worked example",
        title: "Count every move",
        body: "For C with key 3: D is move one, E is move two, and F is move three.",
        example: "C → D → E → F",
      },
      {
        label: "The rule",
        title: "Repeat the algorithm",
        body: "For each plain letter: find it, move forward by the key, write the coded letter, and repeat.",
      },
    ],
  },
  {
    title: "Decode by reversing the move",
    prompt: "Decoding undoes encryption, so travel in the opposite direction.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Move backward",
        body: "The message was encoded by moving forward 3. To undo it, start at the coded letter and move backward 3.",
      },
      {
        label: "Worked example",
        title: "Reverse one letter",
        body: "For coded K: J is one move back, I is two, and H is three.",
        example: "K → J → I → H",
      },
      {
        label: "The rule",
        title: "Use inverse operations",
        body: "Encoding moves forward by the key. Decoding reverses it by moving backward by the same key.",
      },
    ],
  },
  {
    title: "Infer the missing key",
    prompt: "Compare one known plain letter with its coded partner and count the distance.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Start at plain T",
        body: "The clue says plain T became coded E. Count forward from T until you reach E.",
      },
      {
        label: "Worked example",
        title: "Wrap through Z",
        body: "Count U, V, W, X, Y, Z, then A, B, C, D, E. That is eleven moves.",
        example: "T + 11 → E",
      },
      {
        label: "The rule",
        title: "Verify with another pair",
        body: "A possible key is only trustworthy if the same shift also works for other letters in the message.",
      },
    ],
  },
  {
    title: "Create a new secret",
    prompt: "Prove that you understand the key by predicting the first coded letter before revealing the word.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Use the first letter",
        body: "Take the first letter of your word and count forward by the key you selected.",
      },
      {
        label: "Worked example",
        title: "Test a short prediction",
        body: "If the word begins with A and the key is 3, count B, C, D. The first coded letter is D.",
        example: "A + 3 → D",
      },
      {
        label: "The rule",
        title: "Generalise",
        body: "The message and key may change, but the algorithm stays the same: shift every letter equally and wrap after Z.",
      },
    ],
  },
  {
    title: "Evaluate the cipher",
    prompt: "A cipher can be correct but still too easy for an attacker to break.",
    steps: [
      {
        label: "Gentle nudge",
        title: "Think about shift 26",
        body: "After moving around all 26 letters, A lands back on A. Does that hide anything?",
      },
      {
        label: "Worked example",
        title: "Count meaningful keys",
        body: "Shifts 1 through 25 change the message. Shift 26 is the same as shift 0 and changes nothing.",
        example: "25 meaningful shifts · Shift 26 = no change",
      },
      {
        label: "The rule",
        title: "Small keyspaces are weak",
        body: "A computer can try all 25 meaningful Caesar keys quickly, so real banking and payment systems need much stronger encryption.",
      },
    ],
  },
];
