export default function getPermission(name = 'microphone') {
    const permissions = window?.navigator?.permissions;
    if(!permissions) return null;
    return permissions
    .query({name})
    .then((permission) => {
      return permission;
    }).catch(() => null);
}
  