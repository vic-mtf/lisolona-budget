import styles from './styles.module.css';

export default function blockStyleFn (contentBlock) {
    const type = contentBlock.getType();
    switch(type) {
        case 'blockquote': return styles.blockquote;
        case 'code-block': return styles.codeBlock;
        case 'left': return styles.textLeft;
        case 'right': return styles.textRight;
        case 'center': return styles.textCenter;
        case 'justify': return styles.textJustified;
        default: return type;
    }
}