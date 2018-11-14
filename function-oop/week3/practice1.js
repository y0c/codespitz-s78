
const START_TAG = '<';
const END_TAG = '>';
const CLOSE_TOKEN = '/';

const textNode = (input, cursor, curr) => {
    const idx = input.indexOf(START_TAG, cursor);
    curr.tag.children.push({
        type: 'text', text: input.substring(cursor, idx)
    });
    return idx;
}

const parseAttribute = str => {
    let eqIndex, idx = 0;
    const attributes = [];
    while( (eqIndex = str.indexOf('=', idx)) != -1 ) {
        attributes.push({
            name: str.substring(idx, eqIndex).trim(), 
            value: str.substring(eqIndex+1, str.indexOf(str[eqIndex+1], eqIndex+2) + 1).trim()
        })
        idx = str.indexOf(str[eqIndex+1], eqIndex+2) + 2;
    }
    return attributes;
}

const elementNode = (input, cursor, idx, curr, stack) => {
    const isClose = input[idx - 1] === CLOSE_TOKEN;
    const transformInput = input.replace(/(["'])([^\\\1]|\\\1)*\1/g, '#');
    const tagDef = input.substring(cursor + 1, idx - (isClose ?  1 : 0));

    const spaceIdx = tagDef.indexOf(' ');
    const name = spaceIdx != -1 ? tagDef.substring(0, spaceIdx).trim() : tagDef;
    const rawAttributes = spaceIdx != -1 ? tagDef.substring(spaceIdx).trim() : [];

    const tag = { 
        name, 
        type: 'node', 
        children:[] ,
        attributes: parseAttribute(rawAttributes)
    };
    curr.tag.children.push(tag);

    if(!isClose) {
        stack.push({tag, back: curr});
        return true;
    }

    return false;
}

const parser = input => {
    input = input.trim();
    const result = { name: 'ROOT', type: 'node', children: []};
    const stack = [{tag: result}];

    let curr, i = 0, j = input.length;

    curr = stack.pop();
    while(i < j) {

        const cursor = i;

        if( input[cursor] === START_TAG ) {
            const idx = input.indexOf(END_TAG, cursor);
            i = idx + 1;

            if(input[cursor + 1] === CLOSE_TOKEN) { 
                curr = curr.back;
            } else {
                if( elementNode(input, cursor, idx, curr, stack)) curr = stack.pop();
            }
        } else {
            i = textNode(input, cursor, curr);
        }
    }

    return result;
}


console.log('---------', parser(`
    <div styles='test'>
        a
        <a test='b'>b</a>
        c
        <img/>
        d
    </div>
`));
