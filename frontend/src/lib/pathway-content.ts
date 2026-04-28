export type PathwayContent = {
  chapterId: number;
  verseKey: string;
  explanation: string;
};

export const pathwayContentMap: Record<string, PathwayContent> = {
  "reconnect-after-ramadan": {
    chapterId: 1,
    verseKey: "1:2",
    explanation:
      "This opening reminder begins with gratitude and recognition. It recenters the heart before everything else and gently reorients the day toward praise, humility, and dependence.",
  },
  "start-understanding": {
    chapterId: 2,
    verseKey: "2:2",
    explanation:
      "This passage frames the Book as guidance. It helps the reader begin with trust, curiosity, and openness, seeing revelation not as distant information, but as direction for life.",
  },
  "mercy-and-hope": {
    chapterId: 39,
    verseKey: "39:53",
    explanation:
      "This is one of the most hope-giving reminders in the tradition. It opens the door of return, especially for someone feeling distant, burdened, or unsure whether they can begin again.",
  },
  "beginners-7-day": {
    chapterId: 1,
    verseKey: "1:6",
    explanation:
      "This short prayer is simple, foundational, and deeply personal. It teaches that seeking guidance is not a one-time event, but a daily need that can be asked for with humility.",
  },
};

export const defaultPathwayContent: PathwayContent = {
  chapterId: 1,
  verseKey: "1:2",
  explanation:
    "A calm starting point for gratitude, recognition, and daily reorientation.",
};