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
