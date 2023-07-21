const _ = require('lodash');

export default function filterByKeyword(object, keyword) {
  const escapedKeyword = _.escapeRegExp(keyword);
  const words = escapedKeyword.split(' ');
  const regexes = words.filter(word => words.length > 1 ? word.trim()  : true)
  .map((word) => new RegExp(word, 'i'));
  return regexes.some((regex) => regex.test(object.name) || regex.test(object.email));
}
