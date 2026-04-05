export default function formatDates(startedAt, endedAt, lang = "fr-FR") {
  const now = new Date();
  const start = new Date(startedAt);
  const end = new Date(endedAt);

  let result = "";
  if (start.toDateString() === now.toDateString()) {
    result += "Aujourd'hui de ";
  } else if (start.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
    result += "Demain de ";
  } else if (
    getWeek(start) === getWeek(now) &&
    start.getFullYear() === now.getFullYear()
  ) {
    result += start.toLocaleDateString(lang, { weekday: "long" }) + " de ";
  } else {
    result += start.toLocaleDateString(lang, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (start.getFullYear() !== end.getFullYear()) {
      result += ", " + start.getFullYear();
    }
    result += " de ";
  }

  result += start.toLocaleTimeString(lang, {
    hour: "2-digit",
    minute: "2-digit",
  });
  result +=
    " à " +
    end.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });

  return result;
}

function getWeek(date) {
  var onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
}
