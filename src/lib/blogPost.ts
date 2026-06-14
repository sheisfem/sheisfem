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

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getOrdinalSuffix = (day: number) =>
  day % 10 === 1 && day !== 11
    ? "st"
    : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

export const formatDateline = (dateStr: string | null) => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return `${weekdays[date.getUTCDay()]} — ${months[month - 1]} ${day}${getOrdinalSuffix(
    day
  )}, ${year}`;
};

export const getReadMinutes = (html: string) => {
  const wordCount = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(wordCount / 220));
};

export const enhancePostHtml = (rawHtml: string) => {
  const fieldNotePattern = /(?:<p><strong>(\d+)\.\s*([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>){2,}/g;

  return rawHtml
    .replace(/==([\s\S]*?)==/g, '<span class="annot">$1</span>')
    .replace(/<p>\[\[note:\s*([\s\S]*?)\]\]<\/p>/g, '<p class="margin-note">$1</p>')
    .replace(fieldNotePattern, (match) => {
      const items = [
        ...match.matchAll(/<p><strong>\d+\.\s*([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/g),
      ];

      return `<div class="fieldnotes">
        <div class="fn-head">
          <span class="script">Field notes</span>
          <span class="line"></span>
        </div>
        <ol>
          ${items.map((item) => `<li><strong>${item[1]}</strong> ${item[2]}</li>`).join("")}
        </ol>
      </div>`;
    })
    .replace(
      /<a href="(https?:\/\/[^"]*)">/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">'
    )
    .replace(
      /<hr><p>\[\[signoff:\s*([\s\S]*?)\]\]<\/p>/g,
      `<div class="signoff">
        <p>$1</p>
        <span class="xo">Until next time,</span>
        <div class="sig">xo, Tomi</div>
      </div>`
    );
};
