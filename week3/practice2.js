
const elementNode = (input, cursor, idx, curr, stack) => {
    const isClose = input[idx - 1] === CLOSE_TOKEN;
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
    const result = null;
    const stack = [];

    let i = 0, j = input.length, curr = null;

    while(i < j) {
        const cursor = i;

        if(input[cursor] == "{") {
            const idx = input.indexOf("}", cursor);
            i = idx + 1;
        
        } else if(input[cursor] == "[") {
            const idx = input.indexOf("]", cursor);
            
        }
    }
    
}

/**
 * {
 *   korDtNm : 'test',
 *   test : 'a',
 *   b : 'c'
 *   d: { ddd : 'test' } 
 * }
 * 
 * [ 'a', 'b', 'c']
 * 
 * 
 */