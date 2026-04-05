/**
 * Analyse une URL et en extrait :
 * - origin : ex. "https://example.com"
 * - pathname : ex. "/conference/ABC123"
 * - search : ex. "?code=ABC123"
 * - code : ex. "ABC123"
 *
 * @param {string} inputUrl - L’URL à vérifier
 * @returns {{ origin: string|null, pathname: string|null, search: string|null, code: string|null }}
 */
const parseConferenceUrl = (inputUrl) => {
  try {
    const url = new URL(inputUrl); // Valide et normalise l’URL

    let code = null;

    // Vérifie d’abord s’il y a un paramètre ?code=...
    if (url.searchParams.has('code')) {
      code = url.searchParams.get('code');
    }

    // Sinon, cherche un segment /conference/<code>
    if (!code) {
      const match = url.pathname.match(/\/conference\/([^/]+)/);
      if (match) {
        code = match[1];
      }
    }

    return {
      origin: url.origin,
      pathname: url.pathname,
      search: url.search || null,
      code: code || null,
    };
  } catch {
    // URL invalide
    return { origin: null, pathname: null, search: null, code: null };
  }
};

export const checkPopupPermission = () => {
  const newWin = window.open('');
  if (!newWin || newWin.closed || typeof newWin.closed == 'undefined')
    return false;

  newWin.close();
  return true;
};

export default parseConferenceUrl;
// // --- Exemples d’utilisation ---
// console.log(parseConferenceUrl('https://example.com/conference/ABC123'));
// // → { origin: 'https://example.com', pathname: '/conference/ABC123', search: '', code: 'ABC123' }

// console.log(parseConferenceUrl('https://example.com/?code=XYZ789'));
// // → { origin: 'https://example.com', pathname: '/', search: '?code=XYZ789', code: 'XYZ789' }

// console.log(parseConferenceUrl('invalid-url'));
// // → { origin: null, pathname: null, search: null, code: null }
