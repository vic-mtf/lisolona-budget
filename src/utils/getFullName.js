export default function getFullName(obj) {
    let fullName = obj?.fname?.trim() || obj?.firstname?.trim() || '';
    if (obj?.mname || obj?.middlename) 
      fullName += ' ' + (obj.mname?.trim() || obj?.middlename);
    fullName += ' ' + (obj?.lname?.trim() || obj?.lasname || '');
    return fullName.trim();
}