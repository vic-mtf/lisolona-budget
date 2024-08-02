import { escapeRegExp } from "lodash";

export default function filterByKeyword(object, keyword) {
  const escapedKeyword = escapeRegExp(keyword);
  const words = escapedKeyword.split(" ");
  const regExes = words
    .filter((word) => (words.length > 1 ? word.trim() : true))
    .map((word) => new RegExp(word, "i"));
  return regExes.some(
    (regex) => regex.test(object.name) || regex.test(object.email)
  );
}
