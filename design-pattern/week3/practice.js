
// Refactoring 역활 병합 
const Task = class{

  constructor(title, date = null) {
    if(!title) throw 'invalid title';
    this._title = title; this._date = date; this._isComplete = false;
    this._list = [];
  }

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

const DomRenderer = class{
  constructor(parent){
    this._parent = parent;
  }

  setData(data){ 
    if(!data instanceof Task) throw 'data type must be Task!!';
    this._data = data;
  }
  render() {
    const {task:{_title:title}, list} = this._data;
    const parent = document.querySelector(this._parent);
    parent.innerHTML = '';
    parent.appendChild(el('h1', {innerHTML: title}));
    parent.appendChild(this._render(el('ul'), list));
  }
  _render(parent, list){
    list.forEach(({task,list})=>{
      const li = parent.appendChild(el('li'));
      [
        el('input', { type: 'checkbox', checked: task.isComplete(), onclick: _ => { task.toggle(); this.render()}}),
        el('span', { innerHTML: task._title})
      ].forEach(v=>li.appendChild(v));
      if(list.length) li.appendChild(this._render(el('ul'), list));
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
sub.list[0].task.add('Test1', new Date());
sub.list[0].task.add('Test2', new Date());

const renderer = new DomRenderer('#a');
renderer.setData(folder.list());
renderer.render();