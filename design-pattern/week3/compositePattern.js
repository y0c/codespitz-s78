
/* 
API 사용하는쪽을 먼저 디자인

const list = new TaskList('비사이드');
list1.add('지라설치');
list1.add('지라클라우드접속');

const list2 = new TaskList('s3-4');
list2.add('2강 답안 작성');
list2.add('3강 교안 작성');

console.log(list1.byTitle());

console.log(list2.byDate());

1. Entity 도출 
2. 의존성이 낮은것 부터 디자인 (Task)
  가장 쉬운 것부터 구현시작 
*/
// const Sort = class{
//   static title = (a,b)=>a.sortTitle(b);
//   static date = (a,b)=>a.sortDate(b);
//   sortTitle(task){throw 'override'}
//   sortDate(task){throw 'override'}
// }

// const Task = class extends Sort{
//   //생성자에 대한 지식을 외부에 노출하지 않음 -> 캡슐화 
//   // 팩토리 함수를 제공하도록 한다. 
//   static get(title, date = null) { return new Task(title,date);}

//   constructor(title, date = null) {
//     if(!title) throw 'invalid title';
//     this._title = title;
//     this._date = date;
//     this._isComplete = false;
//   }

//   isComplete(){ return this._isComplete; }
//   toggle(){ this._isComplete = !this._isComplete; }

//   //캡슐화 되어 있는 메소드만 공개함
//   //속성이 바뀌어도 외부에 영향을 주지않음
//   //목적만 노출할 수 있게한다. 
//   sortTitle(task) {
//     return this._title > task._title;
//   }

//   sortDate(task) {
//     return this._date > task._date;
//   }
// }

// const TaskList = class {
//   constructor(title){
//     if(!title) throw 'invalid title';
//     this._title = title;
//     this._list = [];
//   }

//   //entry point를 제외하곤 객체 컨텍스트를 어기는 일을 최소화 
//   add(title, date){ this._list.push(Task.get(title,date)); }

//   //함수형에선 값을 전닳한다.(immutable) value-context 
//   //기존것에 대한 참조를 가지고 있지 않는다. 

//   //만약, 참조를 넘기고 있다면 객체 컨텍스트를 사용하고 있는것이다. 
//   //객체지향에서 강조하는 식별자(identification)
//   //모두 객체로 통신하도록 한다. 
//   remove(task){
//     const list = this._list;
//     if(list.includes(task)) list.splice(list.indexOf(task),1);
//   }

//   //인자로 받지않고 메소드를 늘리는게 낫다. 
//   byTitle(stateGroup = true){return this._getList(Sort.title, stateGroup);}
//   byDate(stateGroup = true){return this._getList(Sort.date, stateGroup);}

//   _getList(sort, stateGroup){
//     const list = this._list;
//     return !stateGroup ? [...list].sort(sort): [
//       ...list.filter(v=>!v.isComplete()).sort(sort),
//       ...list.filter(v=>v.isComplete()).sort(sort)
//     ]
//   }
// }


// Refactoring 역활 병합 
const Task = class{

  constructor(title, date = null) {
    if(!title) throw 'invalid title';
    this._title = title; this._date = date; this._isComplete = false;
    this._list = [];
  }

  // get title(){return this._title;}
  // get list(){return this._list;}
  // set title(title){this._title=title;}
  // set list(list){this._list=list;}

  isComplete(){ return this._isComplete; }
  toggle(){ this._isComplete = !this._isComplete; }

  //팩토리 함수가 필요없어짐 k
  add(title, date){ this._list.push(new Task(title,date)); }

  remove(task){
    const list = this._list;
    if(list.includes(task)) list.splice(list.indexOf(task),1);
  }

  byTitle(stateGroup = true){return this.list('title', stateGroup);}
  byDate(stateGroup = true){return this.list('date', stateGroup);}

  //composite interface 
  list(sort, stateGroup = true ){
    const list = this._list, f = (a,b)=>a['_'+sort] > b['_'+sort];
    const map = task=>task.list(sort,stateGroup);

    return {
      task: this,
      list: !stateGroup ? [...list].sort(f).map(map): [
        ...list.filter(v=>!v.isComplete()).sort(f).map(map),
        ...list.filter(v=>v.isComplete()).sort(f).map(map)
      ]
    }
  }
}


const el = (tag,attr={})=>Object.entries(attr).reduce((el,v)=>{
  typeof(el[v[0]]) == 'function' ? el[v[0]](v[1]): (el[v[0]] = v[1]);
  return el;
}, document.createElement(tag));

const DomRenderer = class{
  constructor(parent){
    this._parent = parent;
  }

  render(data) {
    const {task:{_title:title}, list} = data;
    const parent = document.querySelector(this._parent);
    parent.innerHTML = '';
    parent.appendChild(el('h1', {innerHTML: title}));
    parent.appendChild(this._render(el('ul'), list));
  }
  _render(parent, list){
    list.forEach(({task,list})=>{
      const li = parent.appendChild(el('li'));
      li.appendChild(el('div', { innerHTML: task._title}));
      li.appendChild(this._render(el('ul'), list));
    });
    return parent;
  }
}

const folder = new Task('Folder');
folder.add('Test1', new Date());
folder.add('Test2', new Date());

let {list} = folder.byTitle();
list[1].task.add('코드정리', new Date());
list[1].task.add('다이어그램정리', new Date());

let sub = list[1].task.byTitle();
sub.list[0].task.add('Test', new Date());
sub.list[0].task.add('Test', new Date());

const renderer = new DomRenderer('#a');
renderer.render(folder.list());