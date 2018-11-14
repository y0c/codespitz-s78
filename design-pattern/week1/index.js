const Table =((_=> {
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
            const {parent, items, header, title} = this[Private];
            const parentEl = document.querySelector(parent);
            if(!parentEl) throw 'invalid parent element';
            if(!(items || items.length)) {
                parentEl.innerHTML = 'no data';
                return ;
            } else {
                parentEl.innerHTML = '';
            }

            const table = document.createElement('table');
            const caption = document.createElement('caption');

            caption.innerHTML = title;
            table.appendChild(caption);

            table.appendChild(
                header.reduce((thead,data) => {
                    const th = document.createElement('th');
                    th.innerHTML = data;
                    thead.appendChild(th);
                    return thead;
                }, document.createElement('thead'))
            );

            table.appendChild(
                items.reduce((body,item)=> {
                    body.appendChild(
                        item.reduce((tr, data)=>{
                            const td = document.createElement('td');
                            td.innerHTML = data;
                            tr.appendChild(td);
                            return tr;
                        }, document.createElement('tr'))
                    )
                    return body;
                }, document.createElement('tbody')
            ));

            parentEl.appendChild(table);
        }
    }
})())


const table = new Table('#data');
table.load('75_1.json');
