export function blockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'blockquote') {
      return '_blockquote';
    }
    if(type === 'code-block') {
      return '_code-block';
    }
}