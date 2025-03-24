import parse from 'html-react-parser';
import _ from 'lodash';

export default function highlightWord (_sentence='', _word='') {
    const words = _sentence.match(
        new RegExp(_.escapeRegExp(_word).split(/\s/).join('|')
    , 'ig')) || [];

    let sentence = _sentence;
    words.forEach(word => {
        if(word.trim())
            sentence = sentence.toString().replace(
                new RegExp(_.escapeRegExp(word), 'ig'), 
                word.toString().bold()
            )
    })
    return parse(
        sentence
    )
}