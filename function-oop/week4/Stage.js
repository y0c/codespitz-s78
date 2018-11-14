const prop = (target,v) => Object.assign(target,v);

/**
 * 
 * @param {*} last 
 * @param {*} min 
 * @param {*} max 
 * @param {*} listener 
 */
const Stage = class {
    constructor(last, min, max, listener) {
        prop(this, { last, min, max, listener });
    }

    clear() {
        this.curr = 0;
        this.next();
    }

    next() {
        if( this.curr++ < Stage.last ){
            const rate = (this.curr - 1) / (this.last - 1);
            this.speed = this.min + (this.max - this.min) * (1 - rate);
            this.listener();
        }
    }

    score(line) {
        return parseInt((this.curr*5) * (2**line));
    }
}