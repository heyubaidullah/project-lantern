export type PathwayStep = {
  chapterId: number;
  verseKey: string;
  explanation: string;
};

export const pathwayStepsMap: Record<string, PathwayStep[]> = {
  "reconnect-after-ramadan": [
    {
      chapterId: 1,
      verseKey: "1:1",
      explanation:
        "Every return begins with remembering Allah deliberately. This first step is about beginning again with sincerity, even if the rhythm was lost for a while.",
    },
    {
      chapterId: 1,
      verseKey: "1:2",
      explanation:
        "Gratitude stabilizes the heart. Reconnection is not only about discipline, but also about noticing Allah’s care and responding with praise.",
    },
    {
      chapterId: 1,
      verseKey: "1:5",
      explanation:
        "A lasting return needs dependence on Allah, not only dependence on motivation. This step recenters worship and seeking help together.",
    },
    {
      chapterId: 1,
      verseKey: "1:6",
      explanation:
        "Consistency grows through asking for guidance again and again. This step is about humility and staying on the path, not perfection.",
    },
  ],
  "start-understanding": [
    {
      chapterId: 1,
      verseKey: "1:1",
      explanation:
        "Understanding begins with slowing down and recognizing what is being said. Start by noticing the meaning carried in even the shortest lines.",
    },
    {
      chapterId: 1,
      verseKey: "1:2",
      explanation:
        "This verse introduces a relationship: Allah as Lord, Sustainer, and Master of all worlds. Understanding grows when the words become personal.",
    },
    {
      chapterId: 1,
      verseKey: "1:3",
      explanation:
        "Mercy is repeated for a reason. This step is about noticing emphasis and learning to ask why a meaning is highlighted more than once.",
    },
    {
      chapterId: 1,
      verseKey: "1:5",
      explanation:
        "Some verses teach belief, some teach posture. This one teaches both devotion and dependence in a single line.",
    },
  ],
  "mercy-and-hope": [
    {
      chapterId: 1,
      verseKey: "1:1",
      explanation:
        "Hope begins by remembering that Allah is approached through mercy. This step invites the heart to begin from gentleness, not fear alone.",
    },
    {
      chapterId: 1,
      verseKey: "1:3",
      explanation:
        "Mercy is not incidental here. It is central. This step is about sitting with that repetition and letting it soften the heart.",
    },
    {
      chapterId: 1,
      verseKey: "1:5",
      explanation:
        "Hope is strongest when tied to worship and reliance together. This verse teaches that closeness and need can exist in the same breath.",
    },
    {
      chapterId: 1,
      verseKey: "1:7",
      explanation:
        "Mercy also means being shown the safe way forward. Hope is not vague optimism; it is being guided toward what is sound and true.",
    },
  ],
  "beginners-7-day": [
    {
      chapterId: 1,
      verseKey: "1:1",
      explanation:
        "A gentle beginning should feel simple and clear. This first step introduces the rhythm of starting with Allah consciously.",
    },
    {
      chapterId: 1,
      verseKey: "1:2",
      explanation:
        "This step introduces the idea that Allah is not distant. He is Lord and Sustainer, and that changes how a reader approaches the text.",
    },
    {
      chapterId: 1,
      verseKey: "1:3",
      explanation:
        "Mercy appears early because it shapes the whole experience. This step invites the learner to see the text through that lens.",
    },
    {
      chapterId: 1,
      verseKey: "1:5",
      explanation:
        "This is a foundational verse for a beginner: worship and dependence. It teaches what the relationship with Allah looks like in practice.",
    },
    {
      chapterId: 1,
      verseKey: "1:6",
      explanation:
        "A beginner’s path is not about speed. It is about asking for guidance sincerely and repeatedly.",
    },
    {
      chapterId: 1,
      verseKey: "1:7",
      explanation:
        "This step introduces the idea that there is a straight path and that the reader is asking to be kept on it.",
    },
    {
      chapterId: 2,
      verseKey: "2:2",
      explanation:
        "This final beginner step introduces confidence in revelation: this is guidance, and the journey ahead is worth continuing.",
    },
  ],
};

export const defaultPathwayContent: PathwayStep =
  pathwayStepsMap["beginners-7-day"][0];

export const pathwayContentMap: Record<string, PathwayStep> = Object.fromEntries(
  Object.entries(pathwayStepsMap).map(([key, steps]) => [key, steps[0]])
);