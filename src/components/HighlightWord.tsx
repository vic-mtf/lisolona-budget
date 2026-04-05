import Typography from '@mui/material/Typography';

const HighlightWord = ({ text = '', words = [] }) => {
  const safeText = String(text);
  const list = Array.isArray(words)
    ? words
    : typeof words === 'string'
    ? [words]
    : [];

  if (!safeText || list.length === 0)
    return (
      <Typography color="currentColor" component="span">
        {safeText}
      </Typography>
    );

  try {
    // Escape regex char
    const escaped = list
      .filter(Boolean)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escaped.length === 0)
      return (
        <Typography color="currentColor" component="span">
          {safeText}
        </Typography>
      );

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
        <Typography
          component="b"
          key={offset}
          fontWeight="bold"
          color="currentColor"
        >
          {match}
        </Typography>
      );
      lastIndex = offset + match.length;
    });

    // Fin du texte
    if (lastIndex < safeText.length) {
      parts.push(safeText.slice(lastIndex));
    }

    return (
      <Typography
        component="span"
        color="currentColor"
        sx={{
          whiteSpace: 'pre-wrap',
          display: 'inline',
          color: 'currentColor',
        }}
      >
        {parts}
      </Typography>
    );
  } catch {
    return <span>{safeText}</span>;
  }
};

export default HighlightWord;
