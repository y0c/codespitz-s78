
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
  }

  add(ext,f,...arg){
    ext.split(',').forEach(v=>this._router.set(v, [f, arg]));
  }

  addRepo(repo, owner, target){
    this._repo.set(repo, [new Github(owner, target), new Map]);
  }

  addRouter(repo, ext,  f, ...arg){
    if(!this._repo.has(repo)) return;
    ext.split(',').forEach(v=>this._repo.get(repo)[1].set(v, [f, arg]));
  }

  load(repo,v){
    const ext = v.split('.').pop();
    if(!this._repo.has(repo)) return;
    const _git = this._repo.get(repo)[0];
    const _router = this._repo.get(repo)[1];
    if(!_router.get(ext)) return;

    _git.setParser(_router.get(ext));
    _git.load(v);
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


const loader = new Loader(); 
loader.addRepo('bd', 'DockerFarm', 'DockerFarm-backend');
loader.addRouter('bd', 'jpg,png,gif', img, el('#a'));
loader.addRouter('bd', 'md', md, el('#b'));
loader.addRepo('fd', 'DockerFarm', 'DockerFarm-frontend');
loader.addRouter('fd', 'jpg,png,gif', img, el('#a'));
loader.addRouter('fd', 'md', md, el('#b'));
loader.load('bd','README.md');
loader.load('fd','public/img/default.jpg');
