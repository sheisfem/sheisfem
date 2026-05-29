export interface IsoIssueWeek {
  week: number;
  year: number;
}

export const getIsoIssueWeek = (date = new Date()): IsoIssueWeek => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));

  return {
    week: Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7),
    year: target.getUTCFullYear(),
  };
};

export const formatIsoIssueWeek = (issueWeek = getIsoIssueWeek()) =>
  `Issue No.${String(issueWeek.week).padStart(2, "0")} · ${issueWeek.year}`;

export const getCurrentYear = (date = new Date()) => date.getFullYear();
