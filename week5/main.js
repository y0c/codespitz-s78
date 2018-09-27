const err = v => {
	throw v;
};

const el = tag => document.createElement(tag);

const Task = class {
	constructor(title, isCompleted = false) {
		this.title = title;
		//bool 변수는 확장에 대비하기 힘들다 
		//열거형으로 대체하면 확장이 용이
		this.isCompleted = isCompleted;
	}

	setTitle(title) {
		this.title = title;
		//immutable 방식 
		//substr, concat, slice 와 같은 방식
		//Value Context
		// Number(3) , Number(3) 이면 메모리 주소는 다르지만 Value Context를 사용하므로 같다고 나옴(함수형 프로그래밍)
		//return new Task(title, this.isCompleted);
	}

	toggle() {
		this.isCompleted = !this.isCompleted;	
		//return new Task(this.title, !this.isCompleted);
	}

	getInfo() {
		return {
			title: this.title,
			isCompleted: this.isCompleted
		};
	}


};

const Folder = class {
	constructor(title) {
		this.title = title;
		this.tasks = new Set();
	}

	//Task를 은닉할 수 있음 
	//Task를 생성하는 역활을 가지고 있게된다. 
	//Task 생성의 변화가 Folder까지 전파되게된다. 
	//역활과 책임을 위반하고 있다. 
	/**
	 *
		addTask(title){
			this.tasks.add(new Task(title));
		}
	 */

	//Task 가 은닉되지않고 밖으로 노출됨. 
	//Task를 만드는 책임을 지지 않음 
	addTask(task){
		//타입에대한 생성 및 검증은 Task에 위임하고 형만 검사해준다. 
		if(!task instanceof Task) err('invalid task');
		this.tasks.add(task);
	}

	removeTask(title){
		if(!task instanceof Task) err('invalid task');
		this.tasks.delete(task);
	}

	getTasks(){
		return [ ...this.tasks.values() ];
	}

	getTitle(){
		return this.title;
	}
};

const App = class {
	constructor(){
		this.folders = new Set();
	}

	addFolder(folder){
		if(!folder instanceof Folder) err('invalid folder');
		this.folders.add(folder);
	}

	removeFolder(folder){
		if(!folder instanceof Folder) err('invalid folder');
		this.folders.delete(folder);
	}

	getFolders() {
		return [ ...this.folders.values() ];
	}
};

const Renderer = class {
	constructor(app) {
		this.app = app;
	}

	render(){
		this._render();	
	}

	_render(){
		err('must be override!');
	}
};

const DOMRenderer = class extends Renderer {

	constructor(parent,app){
		super(app);
		this.el = parent.appendChild(el('section'));
		this.el.innerHTML = `
			<nav>
				<input type='text' />
				<ul>
				</ul>
			</nav>
			<section>
				<header>
					<h2></h2>
					<input type='text' />
				</header>
				<ul>
				</ul>
			</section>
		`;
		this.el.querySelector('nav').style.cssText = `
			float:left;
			width:200px;
			border-right:1px solid #000;
		`;

		this.el.querySelector('section').style.cssText = `
			
		`;

		const ul = this.el.querySelectorAll('ul');
		this.folder = ul[0];
		this.task = ul[1];
		this.currentFolder = null;

		const input = this.el.querySelectorAll('input')
		input[0].addEventListener('keyup', e => {
			if(e.keyCode != 13) return;
			const v = e.target.value.trim(); 
			if(!v) return;
			const folder = new Folder(v);
			this.app.addFolder(folder);
			e.target.value = '';
			this.render();
		});

		input[1].addEventListener('keyup', e => {
			if(e.keyCode != 13 || !this.currentFolder) return;
			const v = e.target.value.trim(); 
			if(!v) return;
			const task = new Task(v);
			this.currentFolder.addTask(task);
			e.target.value = '';
			this.render();
		});
	}

	_render() {
		const folders = this.app.getFolders();
		this.currentFolder = this.currentFolder || folders[0];
		this.folder.innerHTML = '';
		folders.forEach(f => {
			const li = el('li');	
			li.innerHTML = f.getTitle();
			li.style.cssText = `
				font-weight:${this.currentFolder == f ? 'bold': 'normal'};
				font-size:${this.currentFolder == f ? '14px': '12px'};
			`;
			li.addEventListener('click', e => {
				this.currentFolder = f;
				this.render();
			});
			this.folder.appendChild(li);
		});

		if(!this.currentFolder) return;
		this.task.innerHTML = '';
		this.currentFolder.getTasks().forEach(t => {
			const li = el('li');	
			const {title, isCompleted} = t.getInfo();
			li.innerHTML = (isCompleted ? 'complete' : 'process') + ' ' + title;
			li.addEventListener('click', e => {
				t.toggle();
				this.render();
			});
			this.task.appendChild(li);
		});
	}

}

new DOMRenderer(document.body, new App());

() => {
	let isOkay = true;
	const task = new Task('test1', false);
	isOkay = task.getInfo().title == 'test1' && task.getInfo().isCompleted == false;
	console.log("test1", isOkay);
	task.toggle();
	isOkay = task.getInfo().title == 'test1' && task.getInfo().isCompleted == true;
	console.log("test2", isOkay);
}

(() => {
	let isOkay = true;
	const task = new Task('test1', false);
	const folder = new Folder('folder1');
	isOkay = folder.getTasks().length == 0; 	
	console.log('test1', isOkay);
	folder.addTask(task);
	isOkay = folder.getTasks().length == 1 && folder.getTasks()[0].getInfo().title == 'test1';
	console.log("test2", isOkay);
})()
