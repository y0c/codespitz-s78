const Renderer = class {
    constructor(col, row) {
        prop(this, {col, row, blocks: []});
        while(row--) this.blocks.push([]);
    }

    //renderer 마다 clear를 하는 방법이 다름
    clear() { throw 'override'; }

    render(data) {
        // 프로토콜을 준수하지 않은 데이터 인지만 검증 하도록한다. 
        if(!(data instanceof Data)) throw 'invalida data!';
        //template method pattern 
        //내적동질성에 의해서 this는 콘크리트 클래스를 가르키게 된다. 
        this._render(data);
    }

    //hook method 
    _render(data) {
        throw 'override!';
    }
}