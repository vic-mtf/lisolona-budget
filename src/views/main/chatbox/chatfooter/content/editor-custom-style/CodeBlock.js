import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { useState } from 'react';

function highlightCode(code, language) {
  const grammar = Prism.languages[language];
  if (!grammar) {
    return code;
  }
  return Prism.highlight(code, grammar, language);
}

export default function  CodeBlock(props) {
  const { block, blockProps } = props;
  const { readOnly } = blockProps;
  const language = block.getData().get('language');
  const text = block.getText();
  const [code, setCode] = useState(text);
  const highlightedCode = highlightCode(code, 'javascript');

  function handleChange(event) {
    setCode(event.target.value);
  }

  return (
    <div className="code-block">
      <pre>
        <code
          className={`language-${language}`}
          contentEditable={!readOnly}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          onBlur={() => {
            props.blockProps.onChange(block.getKey(), code);
          }}
          onInput={handleChange}
        />
      </pre>
    </div>
  );
}
