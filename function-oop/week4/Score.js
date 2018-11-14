const Score = class{
    constructor(stage,listener) {
        prop(this, {stage,listener});
    }
    
    clear() { this.curr = this.total = 0; }

    add(line) {
        //Stage 에게 위임과 동시에 협력
        //점수를 계산하는 책임을 Stage객체에게 주도록 한다. 
        const score = this.stage.score(line);
        this.curr += score;
        this.total += score;
        this.listener();
    }
}