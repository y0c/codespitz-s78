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

/**
 * 추상 렌더러의 지식 
 * 1. 도메인에 대한 지식 
 * 2. Composite에 대한 지식 
 */
const Renderer = class {
  render({task, title}) {

    //도메인 객체를 분리 ex) DOM ul , 
    const v = this._folder(task);
    //Context를 유지하기 위해 인자로 전달 
    //인자로 전달 받아야 완전히 분리할 수 있다. 
    this.subTask(this._parent(v, task), list);
  }

  subTask(parent, list){
    list.forEach(({task,list})=>{
      const v = this._task(parent, task);
      this.subTask(this._parent(v,this), task.list().list);
    });
  }

  /**
   * hook method 
   */

  //리턴값을 이용해서 도메인 객체를 완전히 분리할 수 있다. 
  _folder(task){ throw 'override!'; }
  //parent context를 유지 
  _parent(v,task){ throw 'override!;'}
  // task node 를 생성하는 로직을 분리  
  _task(v,task){ throw 'override!;'}
}


/**
 * Loop 에 대한 지식, 도메인에 대한 지식을 가지고 있지 않다. 
 * DOM에 대한 지식만 남긴다. 
 * @param {*} parent 
 */
const DomRenderer = class extends Renderer{
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

  _task(v, {_title: title}) {
    const li = v.appendChild(el('li'));
    li.appendChild(el('div', { innerHTML: title}));
    return li;
  }
}

const ConsoleRenderer = class extends Renderer {
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