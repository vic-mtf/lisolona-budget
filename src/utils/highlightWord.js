import parse from 'html-react-parser';
export default function highlightWord (sentence='', _word='') {
    const [word] = sentence.match(new RegExp(_word, 'ig')) || [];
    return parse(
        sentence.toString()
        .replace(new RegExp(_word, 'ig'), 
        word?.bold()
        )
    )
}