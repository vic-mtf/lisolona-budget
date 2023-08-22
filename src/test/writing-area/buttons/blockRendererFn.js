export default function blockRendererFn(contentBlock) {
    const type = contentBlock.getType();
    console.log(type);
    // if (type === 'atomic') {
    //   return {
    //     component: "",
    //     editable: false,
    //     props: {
    //       foo: 'bar',
    //     },
    //   };
    // }
  }