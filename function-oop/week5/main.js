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

    static get(title) {
        return new Task(title);
    }

    static load(json){
        const task = new Task(json.title, json.isCompleted);

        return task;
    }

    toJSON() {
        return this.getInfo();
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

//Set 을 상속함으로써 중복되지않는다는 의므를 줄 수 있음 
const Folder = class extends Set{
	constructor(title) {
        super();
		this.title = title;
	}

    static load(json){
        const folder = new Folder(json.title);

        json.tasks.forEach(t=>{
            folder.addTask(Task.load(t));
        });

        return folder;
    }


    //생성에 대한 지식을 바깥쪽으로 노출하지 않는다. 
    static get(title) {
        return new Folder(title);
    }

    toJSON() {
        return {title: this.title, tasks: this.getTasks()};
    }

    /**
     * Folder와 Task에 대한 지식을 모두 가지고 있으므로 move는 Folder에 구현해주는게 맞다.
     */
    moveTask(task, folderSrc) {
        if(super.has(task) || !folderSrc.has(task)) return err('error');
        folderSrc.removeTask(task);
        this.addTask(task);
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

    add() { err('...')}
    delete() { err('...')}
    clear() { err('...')}
    values() { err('...')}
    
	//Task 가 은닉되지않고 밖으로 노출됨. 
	//Task를 만드는 책임을 지지 않음 
	addTask(task){
		//타입에대한 생성 및 검증은 Task에 위임하고 형만 검사해준다. 
		if(!task instanceof Task) err('invalid task');
		super.add(task);
	}

	removeTask(task){
		if(!task instanceof Task) err('invalid task');
		super.delete(task);
	}

	getTasks(){
		return [ ...super.values() ];
	}

	getTitle(){
		return this.title;
	}
};

const App = class extends Set{

    static load(json){
        const app = new App();
        json.forEach(f => {
            app.addFolder(Folder.load(f));
        });

        return app;
    }

    toJSON() {
        return this.getFolders();
    }

	constructor(){
        super();
	}

    // Task에 대한 짓기이 갑자기 생김 
    //moveTask(task, folderSrc, destSrc) {

    //}

    add() { err('...')}
    delete() { err('...')}
    clear() { err('...')}
    values() { err('...')}

	addFolder(folder){
		if(!folder instanceof Folder) err('invalid folder');
		super.add(folder);
	}

	removeFolder(folder){
		if(!folder instanceof Folder) err('invalid folder');
		super.delete(folder);
	}

	getFolders() {
		return [ ...super.values() ];
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
        this.taskEl = [];
        const [folder, task] = Array.from(parent.querySelectorAll('ul'));
        const [load, save] = Array.from(parent.querySelectorAll('button'));
        load.onclick=e=> {
            const v = localStorage['todo'];
            if(v) this.app = App.load(JSON.parse(v));
            this.render();
        };
        save.onclick=e=> {
            localStorage['todo'] = JSON.stringify(this.app);
        };
        this.folder = folder;
        this.task = task;
		this.currentFolder = null;

        parent.querySelector('nav>input').addEventListener('keyup', e => {
			if(e.keyCode != 13) return;
			const v = e.target.value.trim(); 
			if(!v) return;
			const folder = Folder.get(v);
			this.app.addFolder(folder);
			e.target.value = '';
			this.render();
		});

		parent.querySelector('header>input').addEventListener('keyup', e => {
			if(e.keyCode != 13 || !this.currentFolder) return;
			const v = e.target.value.trim(); 
			if(!v) return;
			const task = Task.get(v);
			this.currentFolder.addTask(task);
			e.target.value = '';
			this.render();
		});
	}

	_render() {
		const folders = this.app.getFolders();
        let moveTask = null, tasks;
		this.currentFolder = this.currentFolder || folders[0];
        let oldEl = this.folder.firstElementChild, lastEl=null;
		folders.forEach(f => {
			let li;	
            if(oldEl){
                li = oldEl;
                oldEl = oldEl.nextElementSibling;
            } else {
                li=el('li');
                this.folder.appendChild(li);
                oldEl = null;
            }

            lastEl = li;
			li.innerHTML = f.getTitle();
			li.style.cssText = `
				font-weight:${this.currentFolder == f ? 'bold': 'normal'};
				font-size:${this.currentFolder == f ? '14px': '12px'};
			`;
			li.onclick = e => {
				this.currentFolder = f;
				this.render();
			};
            li.ondrop =  e => {
                e.preventDefault();
                f.moveTask(moveTask, this.currentFolder);
            };
            li.ondragover = e => {
                e.preventDefault();
            };
		});

        if(lastEl) while(oldEl=lastEl.nextElementSibling){ this.folder.removeChild(oldEl)}
		if(!this.currentFolder) return;
        tasks = this.currentFolder.getTasks();

        if(tasks.length == 0 ) {
            while(oldEl=this.tasks.firstElementChild){
                this.task.removeChild(oldEl);
                this.taskEl.push(oldEl);
            }
        } else {
            oldEl = this.task.firstElementChild, lastEl = null;
            tasks.forEach(t => {
                let li;
                if(oldEl) {
                    li = oldEl;
                    oldEl = oldEl.nextElementSibling;
                } else {
                    li = this.taskEl.length ? this.taskEl.pop() : el('li');
                    this.task.appendChild(li);
                    oldEl = null;
                }
                lastEl = li;
                const {title, isCompleted} = t.getInfo();
                li.setAttribute('draggable', true);
                li.innerHTML = (isCompleted ? 'complete' : 'process') + ' ' + title;
                li.onclick =  e => {
                    t.toggle();
                    this.render();
                };
                li.ondragstart = e => {
                    moveTask = t;
                };
            });
            if(lastEl) {
                while(oldEl=lastEl.nextElementSibling){ 
                    this.task.removeChild(oldEl)
                    this.taskEl.push(oldEl);
                }

            }
        }

	}

}

new DOMRenderer(document.querySelector('main'), new App());

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
