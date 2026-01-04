import type { FishboneAnalysis } from "@/interfaces";

export const sampleAnalysis: FishboneAnalysis = {
  id: "a",
  dateModified: new Date().toLocaleDateString(),
  dateCreated: new Date().toLocaleDateString(),
  createdBy: "Gerard Gargan",
  priority: "High",
  problemStatement: "Dropped reel from clamp truck",
  status: "InProgress",
  title: "Investigation into dropped reel",
  causes: [
    {
      id: "1",
      category: "Environment",
      isRootCause: false,
      title: "Wet environment",
      whys: [
        {
          id: "1",
          level: 1,
          reason: "Operating outside in wet weather",
        },
      ],
    },
  ],
};
