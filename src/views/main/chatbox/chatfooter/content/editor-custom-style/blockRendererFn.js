import CodeBlock from "./CodeBlock";

export default function blockRendererFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'code-block') {
      return {
        component: CodeBlock,
        editable: true,
        props: {
          readOnly: false,
          onChange: (blockKey, code) => {
            //console.log(`Block ${blockKey} changed to: ${code}`);
          },
        },
      };
    }
  }