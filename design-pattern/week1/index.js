const Table =(_=> {
    const Private = Symbol();

    return class {
        constructor(parent){
            if(typeof parent != 'string' || !parent) throw 'invalid param';
            this[Private] = {parent};
        }

        load(url) {
            fetch(url).then(response => response.json()).then(this.render());
        }

        async load(url) {
            const response = await fetch(url), json = await response.json();
            this.render();
        }

        async load(url) {
            const response = await fetch(url);
            if(!response.ok) throw 'invalid response';
            const { title, header, items } = await response.json();
            if(!items.length) throw 'no items';
            Object.assign(this[Private], {title, header, items});
            this.render();
        }

        render() {
            //부모, 데이터 체크 
            //table 생성 
            //title을 caption으로
            //header를 theade로
            //items를 tr로 
            //부모에 table삽입 

            // 의사코드는 유닛 테스트케이스가 될 수 있다. 
            const {parent, items } = this[Private];
            const parentEl = document.querySelector(parent);
            if(!parentEl) throw 'invalid parent element';
            if(!items || items.length) {
                parentEl.innerHTML = 'no data';
                return ;
            } else {
                parent.innerHTML = '';
            }

            const table = document.createElement('table');
            const caption = document.createElement('caption');

            table.appendChild(
                header.reduce((thead,data) => {
                    const th = document.createElement('th');
                    th.innerHTML = data;
                    thead.appendChild(th);
                    return thead;
                }, document.createElement('thead'))
            );

            table.appendChild(...items.map(
                item=>item.reduce((tr, data)=>{
                    const td = document.createElement('td');
                    td.innerHTML = data;
                    tr.appendChild(td);
                    return tr;
                }, document.createElement('tr'))
            ));

            parentEl.appendChild(table);
        }
    }
})

const Data = class {
    async getData() { throw "getData must override!";}
}

const JsonData = class extends Data {
    constructor() {
        super();
        this._data =  data;
    }

    //async 의 장점은 동기와 비동기를 구분하지 않고 사용할 수 있음 
    async getData() {
        if(typeof this._data == 'string') {
            const resopnse = await fetch(this._data);
            return await response.json();
        } else {
            return this._data;
        }
    }
}

const Renderer = class {
    constructor(){}
    async render(data) {
        if(!(data instanceof Data)) throw 'invalid data type';
        const json = await data.getData();
        console.log(json);
    }
}

const table = new Table('#data');
table.load('75_1.json');
