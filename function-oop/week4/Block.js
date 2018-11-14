const Block = class {
    constructor(color, ...blocks) {
        prop(this, {color, rotate:0, blocks, count: blocks.length -1});
    }

    left() { if(--this.rotate < 0 ) this.rotate = count;}
    right() { if(++this.rotate > count ) this.rotate = 0;}
    getBlock() { return this.blocks[this.rotate] }
}

const blocks = [
    class extends Block {
        constructor() { 
            super('#f8cbad',
                [[1],[1],[1],[1]],
                [[1,1,1,1]]
            ); 
        }
    },
    class extends Block {
        constructor() {
            super('#ffe699',
                
            )
        }
    }
]