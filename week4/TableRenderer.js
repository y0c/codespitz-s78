const el = el => document.createElement(el);
const back = (s,v) => s.backgroundColor = v;

const TableRenderer = class extends Renderer {
    constructor(base, back, col, row) {
        super(col, row);
        this.back = back;
        while(--row) {
            const tr = base.appendChild(el('tr')), curr = [];
            this.blocks.push(curr);
            let i = col;
            while(i--) curr.push(tr.appendChild(el('td')).style);
        }
        this.clear();
    }

    clear() {
        this.blocks.forEach(
            curr => curr.forEach(s =>back(s, this.back))
        )
    }

}