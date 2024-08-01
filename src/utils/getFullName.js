export default function getFullName(obj) {
  let lname = getValFromObj(
    obj,
    ["lname", "lastName", "lastname", "userLName", "userLname"],
    ""
  );
  let fname = getValFromObj(
    obj,
    ["fname", "firstName", "firstname", "userFName", "userFname"],
    ""
  );
  let mname = getValFromObj(
    obj,
    ["mname", "middleName", "middlename", "userMName", "userMname"],
    ""
  );
  return (obj?.name || `${fname} ${lname} ${mname}`)?.trim();
}

export const getValFromObj = (obj = {}, keys = [], output = null) => {
  let val = null;
  keys?.forEach((key) => {
    if (val === null && obj?.hasOwnProperty(key))
      val =
        typeof obj[key] === "string"
          ? obj[key].trim() || null
          : obj[key] === undefined
          ? output
          : obj[key];
  });
  return val;
};
