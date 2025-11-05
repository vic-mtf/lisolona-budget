import { getValFromObj } from './formatObjectData';

export default function getFullName(obj) {
  let ln = getValFromObj(
    obj,
    ['lname', 'lastName', 'lastname', 'userLName', 'userLname'],
    ''
  );
  let fn = getValFromObj(
    obj,
    ['fname', 'firstName', 'firstname', 'userFName', 'userFname'],
    ''
  );
  let mn = getValFromObj(
    obj,
    ['mname', 'middleName', 'middlename', 'userMName', 'userMname'],
    ''
  );
  return (
    obj?.name ||
    `${fn ? fn + ' ' : ''}${ln ? ln + ' ' : ''}${mn ? mn + ' ' : ''}` ||
    `${fn || ''} ${ln || ''} ${mn || ''}`
  )?.trim();
}

export const genNameSummary = (fullNames) => {
  const count = fullNames.length;
  const ft = fname(fullNames[0]);
  const lt = fname(fullNames[fullNames.length - 1]);
  if (!count) return '';
  if (count === 1) return fullNames[0];
  if (count === 2) return `${ft} et ${lt}`;
  if (count === 3) return `${ft}, ${lt} et 1 autre personne`;
  return `${ft}, ${lt} et ${count - 2} autres personnes`;
};

export const fname = (fullName) => fullName.trim().split(/\s+/)?.[0] || '';
