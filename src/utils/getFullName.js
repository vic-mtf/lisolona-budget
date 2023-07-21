export default function getFullName(obj) {
    let fullName = obj?.fname?.trim() || '';
    if (obj?.mname) 
      fullName += ' ' + obj.mname?.trim();
    fullName += ' ' + obj?.lname?.trim() || '';
    return fullName.trim();
}