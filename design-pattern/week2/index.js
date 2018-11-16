//1. 대체가능성 
//2. 내적동질성 
const Parent = class{

    //내적동질성에 의해 생성된 인스턴스에 action이 호출됨 
    //template method pattern 을 사용할 수 있게됨 hook 메소드 성립 
    wrap() {
        this.action();
    }

    action(){ console.log('parent');  }
};
const Child = class extends Parent{
    action(){ console.log('child');  }
};

const a = new Child();
//Child가 Parent를 대체할 수 있는 성질
console.log(a instanceof Parent);


a.action();