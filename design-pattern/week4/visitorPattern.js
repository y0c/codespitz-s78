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

  isComplete(){ 
    if(this._list.length) return this._list.every(v=>v.isComplete());
    return this._isComplete;
  }

  setComplete(complete){
    this._isComplete = complete;
    this._list.forEach(t=>t.setComplete(complete));
  }

  toggle(){ 
    const reverse = !this.isComplete();
    if(this._list.length) this._list.forEach(t=>t.setComplete(reverse));
    this._isComplete = reverse;
  }

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

const Visitor = class {
  folder(task){throw 'override!;'}
  parent(v, task){throw 'override!;'}
  task(v, task){throw 'override!;'}
}

const ConsoleVisitor = class extends Visitor {
  _folder({_title: title}) {
    console.log('--------------');
    console.log('folder:', title );
    console.log('--------------');
  }

  _parent(v,_){
    return v;
  }

  _task(v, {_title: title}){
    console.log(v, title);
    return v + '-';
  }
}

const DomVisitor = class extends Visitor {
  constructor(parent){
    super();
    this._p = parent;
  }

  _folder({_title: title}) {
    const parent = document.querySelector(this._p);
    parent.innerHTML = '';
    parent.appendChild(el('h1',{ innerHTML: title}));
    return parent;
  }

  _parent(v, _){
    return v.appendChild(el('ul'));
  }

  _task(v, task, render) {
    const li = v.appendChild(el('li'));
    console.log(task);
    [
      el('input', { type: 'checkbox', checked: task.isComplete(), onclick: _ => { task.toggle(); render()}}),
      el('span', { innerHTML: task._title})
    ].forEach(v=>li.appendChild(v));
    return li;
  }
}

/**
 * 추상 렌더러의 지식 
 * 1. 도메인에 대한 지식 
 * 2. Composite에 대한 지식 
 */
const Renderer = class {
  constructor(visitor) {
    this._visitor = visitor;
  }

  setData(data) {
    if(!data instanceof Task) throw 'typeerror!';
    this._data = data;
  }

  render() {
    const {task, list} = this._data;
    //도메인 객체를 분리 ex) DOM ul , 
    const v = this._visitor._folder(task);
    //Context를 유지하기 위해 인자로 전달 
    //인자로 전달 받아야 완전히 분리할 수 있다. 
    this.subTask(this._visitor._parent(v, task), list);
  }

  subTask(parent, list){
    list.forEach(({task,list})=>{
      const v = this._visitor._task(parent, task, _ => this.render() );
      this.subTask(this._visitor._parent(v,this), list);
    });
  }
}



const folder = new Task('Folder');
folder.add('Test1', new Date());
folder.add('Test2', new Date());

let {list} = folder.byTitle();
list[1].task.add('코드정리', new Date());
list[1].task.add('다이어그램정리', new Date());

let sub = list[1].task.byTitle();
sub.list[0].task.add('Test1', new Date());
sub.list[0].task.add('Test2', new Date());

const renderer = new Renderer(new DomVisitor('#a'));
renderer.setData(folder.list());
renderer.render();