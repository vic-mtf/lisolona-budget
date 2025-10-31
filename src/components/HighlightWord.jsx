import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const HighlightWord = ({ text = '', words = [] }) => {
  const safeText = String(text);
  const list = Array.isArray(words)
    ? words
    : typeof words === 'string'
    ? [words]
    : [];

  if (!safeText || list.length === 0) return <span>{safeText}</span>;

  try {
    // Escape regex char
    const escaped = list
      .filter(Boolean)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escaped.length === 0) return <span>{safeText}</span>;

    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

    const parts = [];
    let lastIndex = 0;

    safeText.replace(regex, (match, _, offset) => {
      // Partie non surlignée
      if (offset > lastIndex) {
        parts.push(safeText.slice(lastIndex, offset));
      }
      // Partie surlignée
      parts.push(
        <b key={offset} style={{ fontWeight: 800 }}>
          {match}
        </b>
      );
      lastIndex = offset + match.length;
    });

    // Fin du texte
    if (lastIndex < safeText.length) {
      parts.push(safeText.slice(lastIndex));
    }

    return (
      <Box
        component="span"
        sx={{
          whiteSpace: 'pre-wrap',
          display: 'inline',
        }}
      >
        {parts}
      </Box>
    );
  } catch {
    return <span>{safeText}</span>;
  }
};

HighlightWord.propTypes = {
  text: PropTypes.string,
  words: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default HighlightWord;
