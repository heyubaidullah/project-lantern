export type PathwayContent = {
  chapterId: number;
  verseArabic: string;
  translation: string;
  explanation: string;
};

export const pathwayContentMap: Record<string, PathwayContent> = {
  "reconnect-after-ramadan": {
    chapterId: 1,
    verseArabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    translation: "All praise is for the Lord of all worlds.",
    explanation:
      "This opening reminder begins with gratitude and recognition. It recenters the heart before everything else and gently reorients the day toward praise, humility, and dependence.",
  },
  "start-understanding": {
    chapterId: 2,
    verseArabic: "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    translation:
      "This is the Book about which there is no doubt, a guidance for those mindful.",
    explanation:
      "This passage frames the Book as guidance. It helps the reader begin with trust, curiosity, and openness, seeing revelation not as distant information, but as direction for life.",
  },
  "mercy-and-hope": {
    chapterId: 39,
    verseArabic: "قُلْ يَـٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ",
    translation:
      "Say: O My servants who have wronged themselves, do not despair of the mercy of Allah.",
    explanation:
      "This is one of the most hope-giving reminders in the tradition. It opens the door of return, especially for someone feeling distant, burdened, or unsure whether they can begin again.",
  },
  "beginners-7-day": {
    chapterId: 1,
    verseArabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    translation: "Guide us to the straight path.",
    explanation:
      "This short prayer is simple, foundational, and deeply personal. It teaches that seeking guidance is not a one-time event, but a daily need that can be asked for with humility.",
  },
};

export const defaultPathwayContent: PathwayContent = {
  chapterId: 1,
  verseArabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
  translation: "All praise is for the Lord of all worlds.",
  explanation:
    "A calm starting point for gratitude, recognition, and daily reorientation.",
};