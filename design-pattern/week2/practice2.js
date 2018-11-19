
const Github = class {
	constructor(id, repo) {
		this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
	}

	load(path){
		if(!this._parser) return;
    const id = 'callback' + Github.id++;
    const f = Github[id] = ({data:{content}}) => {
      delete Github[id];
      document.head.removeChild(s);
      this._parser[0](content, ...this._parser[1]);
    }

    const s = document.createElement('script');
    s.src = `${this._base + path}?callback=Github.${id}`;
    document.head.appendChild(s);
	}

	setParser(obj){ this._parser = obj };
}

Github.id = 0;

const Loader = class {
  constructor(){
    this._repo = new Map;
    this._router = new Map;
  }

  add(ext,f,...arg){
    ext.split(',').forEach(v=>this._router.set(v, [f, arg]));
  }

  addRepo(repo, owner, target){
    this._repo.set(repo, new Github(owner, target));
  }

  addRouter(repo, f, ...arg){
    this._router.set(repo, [f, arg]);
  }

  load(repo,v){
    const ext = v.split('.').pop();
    if(!this._repo.has(repo)) return;
    if(!this._router.has(ext)) return;
    this._git.setParser(this._router.get(ext));
    this._git.load(v);
  }
}
const el = v => document.querySelector(v);

const d64 = v => decodeURIComponent(
    atob(v).split('').map(c=>'%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join('')
);

const parseMD = v => {
	return d64(v).split('\n').map(v=>{
		let i = 3;
		while(i--){
			if(v.startsWith('#'.repeat(i+1))) return `<h${i+1}>${v.substr(i+1)}</h${i+1}>`;
		}
		return v;
	}).join('<br/>');
};

const md = (v,el) => el.innerHTML = parseMD(v);

const img = (v,img) => img.src = 'data:text/plain;base64,' + v;


const loader = new Loader('DockerFarm', 'DockerFarm-frontend'); 
loader.add('jpg,png,gif', img, el('#a'));
loader.add('md', md, el('#b'));
loader.load('README.md');
loader.load('public/img/default.jpg');
