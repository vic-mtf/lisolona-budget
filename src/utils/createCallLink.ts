/**
 *
 * @param {string} code
 * @returns {URL|string|null}
 */
const createCallLink = (code) => {
  const cleanPath = (p = '') => (p?.endsWith('/') ? p?.slice(0, -1) : p) || '';
  try {
    const pathname = '/conference/' + code;
    const base = new URL(import.meta.env.BASE_URL, window.location.origin);
    base.pathname = cleanPath(base.pathname) + pathname;
    return base.toString();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createCallLink;
