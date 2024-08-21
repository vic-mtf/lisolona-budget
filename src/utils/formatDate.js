const formatDate = (bulkDate, lang = "fr") => {
  const date = new Date(bulkDate || Date.now());
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const intl = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  if (diffDays === 0) {
    return new Intl.DateTimeFormat(lang, {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  } else if (diffDays === 1) {
    return intl.format(-1, "day");
  } else if (diffDays === 2) {
    return intl.format(-2, "day");
  } else if (diffDays < 7) {
    return new Intl.DateTimeFormat(lang, { weekday: "long" }).format(date);
  } else if (date.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat(lang, {
      month: "long",
      day: "numeric",
    }).format(date);
  } else {
    return new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }
};

export default formatDate;
