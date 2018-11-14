
const START_TAG = '<';
const END_TAG = '>';
const CLOSE_TOKEN = '/';

//초기에 인식하자마자 바꾸지않으면 독립적이지 않아서 나중에 걷잡을 수 없음 오염의 전파 
//역활을 인식하는 즉시 함수로 만들 것
/**
 * 
 * @param {*} input 
 * @param {*} cursor 
 * @param {*} curr - 참조를 넘김
 * 참조를 넘기게되면 응집성이 높아지게되고 
 * Data를 넘기게되면 의존성이 높아진다. 
 * 밸런스를 맞추는게 중요하다. 
 */
const textNode = (input, cursor, curr) => {
    const idx = input.indexOf(START_TAG, cursor);
    curr.tag.children.push({
        type: 'text', text: input.substring(cursor, idx)
    });
    return idx;
}

const escapeIndexOf = (str, chr, fromIndex, escapeCharacters) => {
    let tokenIdx = -1; 
    
    for( let i = fromIndex ; i < str.length ; i ++ ) {
        if( escapeCharacters.includes(str[i]) )
            tokenIdx = tokenIdx < i ? -1 : i;
        
        if( tokenIdx != -1 ) continue;

        if( str[i] == chr ) return i;
    }
    return -1;
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
    // Case A or B (Tag)
    // 케이스가 다시 세가지로 나뉨 
    //WhiteList
    const isClose = input[idx - 1] === CLOSE_TOKEN;
    const tagDef = input.substring(cursor + 1, idx - (isClose ?  1 : 0));

    const spaceIdx = tagDef.indexOf(' ');
    const name = spaceIdx != -1 ? tagDef.substring(0, spaceIdx).trim() : tagDef;
    const rawAttributes = spaceIdx != -1 ? tagDef.substring(spaceIdx).trim() : [];

    //Case를 값으로 변경 즉 메모리로 변경 
    //Case마다 알고리즘을 쓰면 유지보수가 어려워진다. 
    //ex) Routing Table
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

    //동적으로 변하는 Loop(DP)
    // while(curr = stack.pop()) {
        curr = stack.pop();
        while(i < j) {
            // i를 직접 컨트롤하는것은 위험할 수 있음
            const cursor = i;

            // A = <TAG>BODY</TAG>
            // B = <TAG/>
            // C = TEXT
            if( input[cursor] === START_TAG ) {
                const idx = input.indexOf(END_TAG, cursor);
                i = idx + 1;

                if(input[cursor + 1] === CLOSE_TOKEN) { 
                    curr = curr.back;
                } else {
                    //역활을 인식하고 위임하는 코드가 좋은 가독성을 확보하게 된다. 
                    if( elementNode(input, cursor, idx, curr, stack)) curr = stack.pop();
                }
            } else {
                // curr = stack.pop();
                // Case C (Text)
                // 비교적 짜기 쉬운 코드 부터 작성하도록 한다. 
                // 쉬울수록 의존성이 낮다. 
                i = textNode(input, cursor, curr);
            }
        // }
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

console.log(parseAttribute(`class="xvfv" 

style="weight: 49px" 

   data-test="xcvxcvxvcx" `));

/**
 * 1. 스택 제거 
 * 2. JSON Parser 구현 
 * 3. Recursive 로 구현 
 * escape !! 문자열 안에있으면 S
 */