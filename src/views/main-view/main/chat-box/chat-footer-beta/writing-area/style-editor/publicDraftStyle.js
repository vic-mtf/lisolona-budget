const publicDraftStyle = {
    "& *": { m: 0,p: 0, },
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    cursor: 'auto',
    color: 'text.primary',
    '& div.DraftEditor-root ': {
        width: '100%',
        fontFamily: theme => theme.typography.body1.fontFamily,
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
        overflow: 'auto',
        overflowX: 'hidden',
        maxHeight: 100,
        fontSize: theme => theme.typography.body2.fontSize,
        p: 1,
    },
    '& .public-DraftEditorPlaceholder-root': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'keep-all',
            p: 1,
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