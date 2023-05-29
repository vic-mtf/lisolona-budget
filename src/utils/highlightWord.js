import parse from 'html-react-parser';
export default function highlightWord (_sentence='', _word='') {
    const words = _sentence.match(
        new RegExp(_word.split(/\s/).join('|')
    , 'ig')) || [];

    let sentence = _sentence;
    words.forEach(word => {
        if(word.trim())
            sentence = sentence.toString().replace(
                new RegExp(word, 'ig'), 
                word.toString().bold()
            )
    })
    return parse(
        sentence
    )
}