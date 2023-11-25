const publicDraftStyle = {
    "& *": {m: 0,p: 0, },
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    cursor: 'text',
    color: 'text.primary',
    '& div.DraftEditor-root ': {
        width: '100%',
        px: 1,
        pt: .5,
        pb: 0,
        '& blockquote': {
        borderLeft: theme => `4px solid ${theme.palette.divider}`,
        pl: .5
        }
    },
    '& .public-DraftStyleDefault-link': {
        color: '#3b5998',
        textDecoration: 'underline',
    },
    '& div.DraftEditor-editorContainer': {
        width: "100%",
        overflow: 'auto',
        overflowX: 'hidden',
        maxHeight: 150,
        fontSize: theme => theme.typography.body1.fontSize,
    },
    '& .public-DraftEditorPlaceholder-root': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
        width: '100%',
        "& *": {
        fontSize: theme => theme.typography.body2.fontSize,
        color: theme => theme.palette.text.disabled,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        overflowWrap: 'revert',
        wordWrap: 'revert',
        wordBreak: 'keep-all',
        }
    }
};
export default publicDraftStyle;