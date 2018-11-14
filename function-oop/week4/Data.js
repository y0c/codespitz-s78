/**
 * 
 * @param {*} col 
 * @param {*} row 
 */
//ES6에서 class를 new 를 통해서 만들게되면 home object가 생성되게 된다. 
//즉  Data는 array가 된다. 
const Data = class extends Array {
    constructor(col, row) { prop(this, {row, col});}
}