export default function getPermission(name = 'microphone') {
    return navigator.permissions && 
    navigator.permissions
    .query({name})
    .then((permission) => {
      return permission;
    }).catch(() => null);
}
  