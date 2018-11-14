
const Info = class {
    constructor(json){
        const {title, header, items} = json;
        if(typeof title != 'string' || !title) throw 'invalid title';
        if(!Array.isArray(header) || !header.length) throw 'invalid header';
        if(!Array.isArray(items) || !items.length) throw 'invalid items';
        this._private = {title, header, items};
    }

    get title(){ return this._private.title;}
    get header(){ return this._private.header;}
    get items(){ return this._private.items;}
}

const Data = class {
    async getData() { throw "getData must override!";}
}

const JsonData = class extends Data {
    constructor(data) {
        super();
        this._data =  data;
    }

    //async 의 장점은 동기와 비동기를 구분하지 않고 사용할 수 있음 
    async getData() {
        let json;
        if(typeof this._data == 'string') {
            const response = await fetch(this._data);
            json =  await response.json();
        } else {
            json =  this._data;
        }
        return new Info(json);
    }
}


const Renderer = class {
    constructor(){}
    
    async render(data) {
        if(!(data instanceof Data)) throw 'invalid data type';
        const info = await data.getData();
        // 추상 Renderer 에서 Info를 배열 data로 변환  
        // 구상 Renderer 에선 Info 프로토콜이 아닌 배열을 해체 하여 사용   
        // Info 프로토콜이 변하더라도 추상 Renderer만 수정이 일어남 
        this._info = [info.title, info.header, info.items];
        this._render();
    }

    _render() {
        throw '_render must override';
    }
}

const TableRenderer = class extends Renderer {
    constructor(parent){
        if(typeof parent != 'string' || !parent) throw 'invalid param';
        super();
        this._parent = parent;
    }

    _render() {
        const parent = document.querySelector(this._parent);
        if(!parent) throw 'invalid parent';
        parent.innerHTML = '';
        const [title, header, items] = this._info;
        const [table, caption, thead, tbody] = 'table,caption,thead,tbody'.split(',').map(v=>document.createElement(v));
        caption.innerHTML = title;
        [
            caption,
            header.reduce((_,v) =>{
                const th = document.createElement('th');
                th.innerHTML = v;
                thead.appendChild(th);
                return thead;
            }, thead),
            items.reduce((_,item)=> {
                tbody.appendChild(
                    item.reduce((tr, data)=>{
                        const td = document.createElement('td');
                        td.innerHTML = data;
                        tr.appendChild(td);
                        return tr;
                    }, document.createElement('tr'))
                )
                return tbody;
            }, tbody) 
        ].forEach(el => {
            console.log(el);
            table.appendChild(el) ;
        });
        parent.appendChild(table);
    }

}


const data = new JsonData("75_1.json");
const renderer = new TableRenderer('#data');
renderer.render(data);
