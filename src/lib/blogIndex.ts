export type Pillar = "earns" | "builds" | "invests" | "lives" | "learns";
export type FilterPillar = "all" | Pillar;

export const pillarLabels: Record<Pillar, string> = {
  earns: "She Earns More",
  builds: "She Builds More",
  invests: "She Invests More",
  lives: "She Lives More",
  learns: "She Learns More",
};

export const filterLabels: Array<{ pillar: FilterPillar; label: string }> = [
  { pillar: "all", label: "All" },
  { pillar: "earns", label: "Earns" },
  { pillar: "builds", label: "Builds" },
  { pillar: "invests", label: "Invests" },
  { pillar: "lives", label: "Lives" },
  { pillar: "learns", label: "Learns" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatBlogDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${months[month - 1]} ${day}, ${year}`;
};

export const formatEntryDate = (dateStr: string | null) => {
  if (!dateStr) return { monthDay: "", year: "" };
  const [year, month, day] = dateStr.split("-").map(Number);
  return {
    monthDay: `${months[month - 1]} ${day}`,
    year: String(year),
  };
};
