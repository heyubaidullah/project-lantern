export type LifeStateKey =
  | "anxious"
  | "grateful"
  | "sad"
  | "overwhelmed"
  | "hopeful"
  | "distant";

export type LifeStateConfig = {
  key: LifeStateKey;
  label: string;
  emoji: string;
  shortDescription: string;
  verseKey: string;
  surahName: string;
  arabic: string;
  translation: string;
  reflectionPrompt: string;
  actionStep: string;
  journalPrompt: string;
};

export const lifeStateOptions: LifeStateConfig[] = [
  {
    key: "anxious",
    label: "Anxious",
    emoji: "🌿",
    shortDescription: "When your thoughts feel loud and your heart wants steadiness.",
    verseKey: "13:28",
    surahName: "Ar-Ra'd",
    arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    translation: "Surely in the remembrance of Allah do hearts find comfort.",
    reflectionPrompt: "What is one worry you can place before Allah with honesty today?",
    actionStep: "Take three slow breaths, then repeat one short dhikr before your next task.",
    journalPrompt: "Write the worry in one sentence, then write one small next step you can take.",
  },
  {
    key: "grateful",
    label: "Grateful",
    emoji: "☀️",
    shortDescription: "When you want to notice blessings and respond with care.",
    verseKey: "14:7",
    surahName: "Ibrahim",
    arabic: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: "If you are grateful, I will certainly give you more.",
    reflectionPrompt: "Which blessing feels especially clear to you right now?",
    actionStep: "Thank Allah for one specific blessing, then use it well in one concrete way.",
    journalPrompt: "Name three blessings from today, including one that was easy to overlook.",
  },
  {
    key: "sad",
    label: "Sad",
    emoji: "🤲",
    shortDescription: "When you need tenderness, patience, and room to breathe.",
    verseKey: "94:5",
    surahName: "Ash-Sharh",
    arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation: "So, surely with hardship comes ease.",
    reflectionPrompt: "Where might Allah be opening a small space of ease in this moment?",
    actionStep: "Do one gentle act for yourself today: water, rest, prayer, or reaching out.",
    journalPrompt: "Describe what feels heavy, then describe one form of ease you can seek today.",
  },
  {
    key: "overwhelmed",
    label: "Overwhelmed",
    emoji: "🕊️",
    shortDescription: "When there is too much to carry all at once.",
    verseKey: "2:286",
    surahName: "Al-Baqarah",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not require of any soul more than what it can afford.",
    reflectionPrompt: "What can be simplified, delayed, or handed back to Allah today?",
    actionStep: "Choose only the next right step, not the whole mountain.",
    journalPrompt: "List what feels heavy, then circle the one thing that truly needs your next action.",
  },
  {
    key: "hopeful",
    label: "Hopeful",
    emoji: "🌙",
    shortDescription: "When you feel ready to move forward with trust.",
    verseKey: "39:53",
    surahName: "Az-Zumar",
    arabic: "لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ",
    translation: "Do not lose hope in the mercy of Allah.",
    reflectionPrompt: "What door of mercy are you hopeful Allah can open for you?",
    actionStep: "Make one dua with confidence, then take one sincere step toward it.",
    journalPrompt: "Write a hopeful dua for the version of yourself you are trying to become.",
  },
  {
    key: "distant",
    label: "Distant",
    emoji: "✨",
    shortDescription: "When faith feels quiet and you want a gentle way back.",
    verseKey: "2:186",
    surahName: "Al-Baqarah",
    arabic: "فَإِنِّي قَرِيبٌ",
    translation: "I am truly near.",
    reflectionPrompt: "What is one honest sentence you can say to Allah from where you are?",
    actionStep: "Begin again with a very small act: one ayah, one dua, or one minute of stillness.",
    journalPrompt: "Write a simple note to Allah without editing it or trying to sound perfect.",
  },
];

export function getLifeStateByKey(key: string | null | undefined) {
  return lifeStateOptions.find((option) => option.key === key) ?? null;
}
