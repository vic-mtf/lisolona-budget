

export default function blockRendererFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'EMOJI') {
      return {
        component: EmojiWrapper,
        editable: false,
        props: {
          foo: 'bar',
        },
      };
    }
  }

const EmojiWrapper = (props) => {
  return (
    <span>
      a
    </span>
  )
  
}