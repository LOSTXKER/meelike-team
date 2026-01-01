// Helper functions for job type labels
export const getJobTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    like: "ไลค์",
    comment: "เม้น",
    follow: "Follow",
    view: "View",
    share: "Share",
  };
  return labels[type] || type;
};

// Helper function for level colors
export const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    Platinum: "bg-purple-100 text-purple-700",
    Gold: "bg-yellow-100 text-yellow-700",
    Silver: "bg-gray-100 text-gray-700",
    Bronze: "bg-orange-100 text-orange-700",
    New: "bg-blue-100 text-blue-700",
  };
  return colors[level] || "bg-gray-100 text-gray-700";
};
