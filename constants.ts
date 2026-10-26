import { Badge, Problem, Translation, AppLanguage, Theme } from './types';
import { LESSONS } from './services/curriculum';

export { LESSONS };

// Palette & Themes
export const COLORS = {
  primary: '#F7DF1E', // Iconic JavaScript Yellow
  secondary: '#323330', // JS Dark Charcoal
  accent: '#FA6868', 
  success: '#347433', 
  darkText: '#1F2937',
  lightGreen: '#34D399',
};

// Expanded Theme Definition
export const THEMES: Record<Theme, { bg: string, card: string, text: string, sidebar: string, primary: string, secondary: string, accent: string }> = {
  light: { bg: '#F8FAFC', card: '#FFFFFF', text: '#0F172A', sidebar: '#FFFFFF', primary: '#F59E0B', secondary: '#10B981', accent: '#EC4899' },
  dark: { bg: '#0F172A', card: '#1E293B', text: '#F8FAFC', sidebar: '#0B1120', primary: '#FBBF24', secondary: '#38BDF8', accent: '#F87171' },
  midnight: { bg: '#090D16', card: '#111827', text: '#E2E8F0', sidebar: '#030712', primary: '#FACC15', secondary: '#818CF8', accent: '#C084FC' },
  candy: { bg: '#FFF1F5', card: '#FFFFFF', text: '#2B0A3D', sidebar: '#FFE4EE', primary: '#FF1361', secondary: '#FF8FB1', accent: '#A855F7' },
  orange: { bg: '#FFF7ED', card: '#FFFFFF', text: '#431407', sidebar: '#FFEDD5', primary: '#EA580C', secondary: '#F97316', accent: '#FB923C' },
  forest: { bg: '#F0FDF4', card: '#FFFFFF', text: '#14532D', sidebar: '#DCFCE7', primary: '#16A34A', secondary: '#22C55E', accent: '#4ADE80' },
  coffee: { bg: '#FAF5EE', card: '#FFFFFF', text: '#3E2723', sidebar: '#F3E5D8', primary: '#8D6E63', secondary: '#BCAAA4', accent: '#D7CCC8' },
  golden: { bg: '#FEFCE8', card: '#FFFFFF', text: '#422006', sidebar: '#FEF9C3', primary: '#CA8A04', secondary: '#EAB308', accent: '#FACC15' },
  neon: { bg: '#0D1117', card: '#161B22', text: '#F0F6FC', sidebar: '#010409', primary: '#00F2FE', secondary: '#4FACFE', accent: '#FF0844' },
  berry: { bg: '#FDF2F8', card: '#FFFFFF', text: '#701A75', sidebar: '#FCE7F3', primary: '#DB2777', secondary: '#EC4899', accent: '#F472B6' },
  lemon: { bg: '#FEFCE8', card: '#FFFFFF', text: '#1E293B', sidebar: '#FEF9C3', primary: '#EAB308', secondary: '#FACC15', accent: '#FB7185' },
  cosmic: { bg: '#0F0E17', card: '#1A1926', text: '#FFFFFE', sidebar: '#0D0C14', primary: '#FF8906', secondary: '#F25F4C', accent: '#E53170' },
  aqua: { bg: '#ECFEFF', card: '#FFFFFF', text: '#042F2E', sidebar: '#CCFBF1', primary: '#0D9488', secondary: '#14B8A6', accent: '#2DD4BF' },
};

export const BADGES: Badge[] = [
  { id: 'first_steps', name: 'JS Prodigy', icon: '⚡', description: 'Complete your first JavaScript lesson', color: '#F59E0B' },
  { id: 'streak_3', name: 'Hot Streak', icon: '🔥', description: 'Reach a 3-day JavaScript streak', color: '#EF4444' },
  { id: 'streak_7', name: 'Event Loop King', icon: '👑', description: 'Reach a 7-day streak', color: '#8B5CF6' },
  { id: 'quiz_master', name: 'Syntax Sensei', icon: '🧠', description: 'Ace a chapter test with full marks', color: '#10B981' },
  { id: 'master_coder', name: 'Full Stack Elite', icon: '🚀', description: 'Complete 10 JavaScript lessons', color: '#3B82F6' },
  { id: 'bug_hunter', name: 'V8 Debugger', icon: '🐛', description: 'Squash bugs in the Bug Hunter arcade', color: '#14B8A6' },
  { id: 'problem_solver', name: 'Algorithm Ace', icon: '🧩', description: 'Solve a live coding challenge', color: '#EC4899' },
];

export const PROBLEMS: Problem[] = [
  {
    id: 'js_prob_1',
    title: 'Two Sum Problem',
    category: 'Algorithms',
    description: 'Find two indices in an array that add up to a target sum in O(n) time using a Map.',
    language: 'javascript',
    difficulty: 'easy',
    instructions: 'Given `nums = [2, 7, 11, 15]` and `target = 9`, write logic to find the indices of the two numbers that add up to `target`. Log the indices as `[0, 1]`.',
    initialCode: 'const nums = [2, 7, 11, 15];\nconst target = 9;\n\nfunction twoSum(arr, t) {\n  const map = new Map();\n  for (let i = 0; i < arr.length; i++) {\n    const complement = t - arr[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(arr[i], i);\n  }\n}\n\nconsole.log(twoSum(nums, target));',
    expectedOutput: '[0,1]',
    solutionCode: 'const nums = [2, 7, 11, 15];\nconst target = 9;\nfunction twoSum(arr, t) {\n  const map = new Map();\n  for (let i = 0; i < arr.length; i++) {\n    const complement = t - arr[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(arr[i], i);\n  }\n}\nconsole.log(twoSum(nums, target));',
    hints: ['Use a Map to store previously visited elements and their indices.']
  },
  {
    id: 'js_prob_2',
    title: 'Flatten Deeply Nested Array',
    category: 'Arrays & Objects',
    description: 'Flatten a nested array of arbitrary depth into a single flat array without using Array.prototype.flat.',
    language: 'javascript',
    difficulty: 'medium',
    instructions: 'Write a recursive function `flatten(arr)` that flattens `[1, [2, [3, [4]], 5]]` and logs `[1,2,3,4,5]`.',
    initialCode: 'const nested = [1, [2, [3, [4]], 5]];\n\nfunction flatten(arr) {\n  // Implement recursive flattening:\n}\n\nconsole.log(flatten(nested));',
    expectedOutput: '[1,2,3,4,5]',
    solutionCode: 'const nested = [1, [2, [3, [4]], 5]];\nfunction flatten(arr) {\n  return arr.reduce((acc, val) => \n    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);\n}\nconsole.log(flatten(nested));',
    hints: ['Check if an item is an array using `Array.isArray(val)`. If so, recurse!']
  },
  {
    id: 'js_prob_3',
    title: 'Custom Promise.all Implementation',
    category: 'Async & Promises',
    description: 'Build your own polyfill of Promise.all from scratch using raw Promises.',
    language: 'javascript',
    difficulty: 'hard',
    instructions: 'Implement `promiseAll(promises)`. It must take an array of promises, resolve with an array of values in order, and reject if any promise fails. Test with `[Promise.resolve("A"), Promise.resolve("B")]` and log the output.',
    initialCode: 'function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    // Implement your accumulator:\n  });\n}\n\nconst p = await promiseAll([Promise.resolve("A"), Promise.resolve("B")]);\nconsole.log(p);',
    expectedOutput: '["A","B"]',
    solutionCode: 'function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    const results = [];\n    let completed = 0;\n    if (promises.length === 0) return resolve(results);\n    promises.forEach((p, i) => {\n      Promise.resolve(p).then(val => {\n        results[i] = val;\n        completed++;\n        if (completed === promises.length) resolve(results);\n      }).catch(reject);\n    });\n  });\n}\nconst p = await promiseAll([Promise.resolve("A"), Promise.resolve("B")]);\nconsole.log(p);',
    hints: ['Maintain a `completed` counter and place each result at index `i` to preserve order.']
  },
  {
    id: 'js_prob_4',
    title: 'Group By Property (Object.groupBy Polyfill)',
    category: 'Arrays & Objects',
    description: 'Group an array of objects by a specific property key using reduce.',
    language: 'javascript',
    difficulty: 'easy',
    instructions: 'Given `const users = [{ role: "admin", name: "A" }, { role: "user", name: "B" }, { role: "admin", name: "C" }];`, group them by role and log the count of admins and users as `{ admin: 2, user: 1 }`.',
    initialCode: 'const users = [{ role: "admin", name: "A" }, { role: "user", name: "B" }, { role: "admin", name: "C" }];\n// Count users per role:\n',
    expectedOutput: '{"admin":2,"user":1}',
    solutionCode: 'const users = [{ role: "admin", name: "A" }, { role: "user", name: "B" }, { role: "admin", name: "C" }];\nconst counts = users.reduce((acc, u) => {\n  acc[u.role] = (acc[u.role] || 0) + 1;\n  return acc;\n}, {});\nconsole.log(counts);',
    hints: ['Initialize accumulator as `{}` and increment `acc[u.role]`.']
  }
];

export const BUG_HUNTER_LEVELS = [
  { 
    id: 1, 
    lang: 'javascript', 
    code: ['const maxScore = 100;', 'maxScore = 200;', 'console.log(maxScore);'], 
    errorLine: 1, 
    hint: "TypeError: Assignment to constant variable. `const` variables cannot be reassigned!" 
  },
  { 
    id: 2, 
    lang: 'javascript', 
    code: ['async function load() {', '  const res = fetch("/api");', '  const data = res.json();', '}'], 
    errorLine: 1, 
    hint: "Missing `await` keyword before `fetch()`!" 
  },
  { 
    id: 3, 
    lang: 'javascript', 
    code: ['const numbers = [10, 20, 30];', 'const doubled = numbers.map(n => {', '  n * 2', '});'], 
    errorLine: 2, 
    hint: "Block bodies `{}` in arrow functions require an explicit `return` statement!" 
  },
  { 
    id: 4, 
    lang: 'javascript', 
    code: ['function greet(name) {', '  if (name = "Admin") {', '    console.log("Welcome Admin");', '  }', '}'], 
    errorLine: 1, 
    hint: "Used assignment `=` instead of strict comparison `===` inside the if condition!" 
  }
];

export const SCRAMBLE_LEVELS = [
  { 
    id: 1, 
    lang: 'javascript', 
    correctOrder: [
      "async function fetchData() {", 
      "  const res = await Promise.resolve('ok');", 
      "  return res;", 
      "}"
    ], 
    display: [
      "  return res;", 
      "async function fetchData() {", 
      "}", 
      "  const res = await Promise.resolve('ok');"
    ] 
  },
  { 
    id: 2, 
    lang: 'javascript', 
    correctOrder: [
      "const nums = [1, 2, 3];", 
      "const total = nums.reduce((acc, curr) => {", 
      "  return acc + curr;", 
      "}, 0);"
    ], 
    display: [
      "}, 0);", 
      "const nums = [1, 2, 3];", 
      "  return acc + curr;", 
      "const total = nums.reduce((acc, curr) => {"
    ] 
  },
  {
    id: 3,
    lang: 'javascript',
    correctOrder: [
      "class Counter {",
      "  #count = 0;",
      "  increment() { this.#count++; }",
      "  get value() { return this.#count; }",
      "}"
    ],
    display: [
      "  get value() { return this.#count; }",
      "class Counter {",
      "}",
      "  #count = 0;",
      "  increment() { this.#count++; }"
    ]
  }
];

export const LEADERBOARD_DATA = [
  { id: 1, name: "V8_Optimus", xp: 14500, badge: "⚡" },
  { id: 2, name: "AsyncNinja", xp: 12200, badge: "🔥" },
  { id: 3, name: "ClosureQueen", xp: 10850, badge: "👑" },
  { id: 4, name: "EventLoopLord", xp: 9400, badge: "🚀" },
  { id: 5, name: "MicrotaskMaster", xp: 8100, badge: "💎" },
];

export const CHEATSHEETS = {
  javascript: [
    { 
      title: "Modern ES6+ Syntax", 
      content: "// let & const\nconst immutable = 'fixed';\nlet mutable = 1;\n\n// Template Literals\nconst str = `Value: ${mutable}`;\n\n// Destructuring\nconst { a, b } = { a: 1, b: 2 };\nconst [first, ...rest] = [10, 20, 30];\n\n// Nullish & Chaining\nconst val = obj?.prop ?? 'fallback';" 
    },
    { 
      title: "Arrow Functions & Closures", 
      content: "// Implicit return\nconst add = (x, y) => x + y;\n\n// Lexical closure\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst c = makeCounter();\nc(); // 1\nc(); // 2" 
    },
    { 
      title: "Array Higher-Order Methods", 
      content: "const nums = [1, 2, 3, 4];\n\n// map\nnums.map(n => n * 2); // [2,4,6,8]\n\n// filter\nnums.filter(n => n % 2 === 0); // [2,4]\n\n// reduce\nnums.reduce((acc, curr) => acc + curr, 0); // 10\n\n// some & every\nnums.every(n => n > 0); // true" 
    },
    { 
      title: "Async, Promises & Await", 
      content: "// Creating a Promise\nconst wait = ms => new Promise(r => setTimeout(r, ms));\n\n// Async / Await\nasync function run() {\n  try {\n    await wait(100);\n    const [r1, r2] = await Promise.all([\n      Promise.resolve(1),\n      Promise.resolve(2)\n    ]);\n    return r1 + r2;\n  } catch (err) {\n    console.error(err);\n  }\n}" 
    },
    {
      title: "Classes & Private Fields",
      content: "class User {\n  #secretId; // private\n  constructor(name, secret) {\n    this.name = name;\n    this.#secretId = secret;\n  }\n  get id() { return this.#secretId; }\n  static createAdmin(name) {\n    return new User(name, 'admin_999');\n  }\n}"
    },
    {
      title: "Senior Performance Patterns",
      content: "// Debounce\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\n// Deep Clone\nconst copy = structuredClone(originalObject);"
    }
  ]
};

export const TRANSLATIONS: Record<AppLanguage, Translation> = {
  en: {
    welcome: "Welcome to MaXxCode JS",
    continue: "Continue",
    check: "Check Solution",
    run: "Run Code",
    nextLesson: "Next Lesson",
    reset: "Reset Code",
    dashboard: "Curriculum",
    profile: "Profile",
    lessons: "Roadmap",
    settings: "Settings",
    problems: "Challenges",
    playground: "Playground",
    arcade: "Arcade Games",
    aboutDev: "About Developer",
    streak: "Day Streak",
    xp: "Total XP",
    developedBy: "Developed by Shaikh Aliakbar",
    loading: "Executing...",
    successMsg: "Brilliant! Output verified correctly.",
    errorMsg: "Mismatch detected. Check console output.",
    consoleOutput: "Console Output",
    selectLanguage: "Language",
    selectTheme: "Color Theme",
    completedTitle: "JavaScript Level Mastered!",
    comingSoon: "More Advanced Modules Coming Soon!",
    locked: "Locked",
    start: "START",
    quizTitle: "Knowledge Check",
    submitQuiz: "Submit Answers",
    quizPassed: "Test Passed!",
    quizFailed: "Review the concepts and try again.",
    back: "Back",
    translateLesson: "Translate",
    lessonLanguage: "Lesson Language",
    solve: "Solve Challenge",
    difficulty: "Difficulty",
    unlockAll: "Developer Mode",
    unlockMsg: "Unlock all advanced chapters instantly to browse, test, or jump ahead in the curriculum.",
    confirmUnlock: "Unlock All Chapters"
  },
  hi: {
    welcome: "MaXxCode JS में आपका स्वागत है",
    continue: "आगे बढ़ें",
    check: "समाधान जाँचें",
    run: "रन कोड",
    nextLesson: "अगला पाठ",
    reset: "रीसेट करें",
    dashboard: "पाठ्यक्रम",
    profile: "प्रोफाइल",
    lessons: "रोडमैप",
    settings: "सेटिंग्स",
    problems: "चैलेंज",
    playground: "प्लेग्राउंड",
    arcade: "आर्केड गेम्स",
    aboutDev: "डेवलपर के बारे में",
    streak: "स्ट्रिक",
    xp: "कुल XP",
    developedBy: "Shaikh Aliakbar द्वारा विकसित",
    loading: "एग्जीक्यूट हो रहा है...",
    successMsg: "शानदार! कोड का आउटपुट बिल्कुल सही है।",
    errorMsg: "कुछ गलत है। कंसोल आउटपुट देखें।",
    consoleOutput: "कंसोल आउटपुट",
    selectLanguage: "भाषा चुनें",
    selectTheme: "थीम",
    completedTitle: "जावास्क्रिप्ट लेवल पूरा हुआ!",
    comingSoon: "और भी एडवांस्ड मॉड्यूल जल्द आ रहे हैं!",
    locked: "बंद है",
    start: "शुरू करें",
    quizTitle: "प्रश्नोत्तरी",
    submitQuiz: "उत्तर जमा करें",
    quizPassed: "टेस्ट पास हुआ!",
    quizFailed: "अवधारणाओं की समीक्षा करें और पुनः प्रयास करें।",
    back: "वापस",
    translateLesson: "अनुवाद करें",
    lessonLanguage: "पाठ की भाषा",
    solve: "हल करें",
    difficulty: "कठिनाई",
    unlockAll: "डेवलपर मोड",
    unlockMsg: "सभी एडवांस्ड चैप्टर्स तुरंत अनलॉक करें।",
    confirmUnlock: "सभी चैप्टर्स अनलॉक करें"
  },
  hinglish: {
    welcome: "MaXxCode JS mein welcome hai!",
    continue: "Aage Badhein",
    check: "Check Karein",
    run: "Run Karein",
    nextLesson: "Next Lesson",
    reset: "Reset Karein",
    dashboard: "Curriculum",
    profile: "Profile",
    lessons: "Roadmap",
    settings: "Settings",
    problems: "Challenges",
    playground: "Playground",
    arcade: "Arcade Games",
    aboutDev: "About Dev",
    streak: "Streak",
    xp: "Total XP",
    developedBy: "Developed by Shaikh Aliakbar",
    loading: "Executing...",
    successMsg: "Superb! Code sahi run hua aur output match ho gaya.",
    errorMsg: "Output match nahi hua. Console check karein.",
    consoleOutput: "Console Output",
    selectLanguage: "Language",
    selectTheme: "Theme",
    completedTitle: "JavaScript Level Mastered!",
    comingSoon: "Aur advanced modules jaldi aayenge!",
    locked: "Locked",
    start: "SHURU KAREIN",
    quizTitle: "Quiz Time",
    submitQuiz: "Submit Karein",
    quizPassed: "Test Pass!",
    quizFailed: "Fir se try karein.",
    back: "Wapas",
    translateLesson: "Samjhao",
    lessonLanguage: "Lesson Language",
    solve: "Solve Karo",
    difficulty: "Difficulty",
    unlockAll: "Developer Mode",
    unlockMsg: "Saare advanced chapters browse karne ke liye unlock karein.",
    confirmUnlock: "Sab Unlock Karein"
  }
};