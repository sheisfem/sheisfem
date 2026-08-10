export interface CalendarIssueWeek {
  week: number;
  year: number;
}

export const getCalendarIssueWeek = (date = new Date()): CalendarIssueWeek => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));

  return {
    week: Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7),
    year: date.getFullYear(),
  };
};

export const formatCalendarIssueWeek = (issueWeek = getCalendarIssueWeek()) =>
  `Issue No.${String(issueWeek.week).padStart(2, "0")} · ${issueWeek.year}`;

export const getCurrentYear = (date = new Date()) => date.getFullYear();
