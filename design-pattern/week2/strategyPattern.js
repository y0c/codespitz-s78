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

	setParser(f, ...arg){ this._parser = [f, arg] };
}

Github.id = 0;

//Concrete Loader
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

const loader = new Github('y0c','DockerFarm-frontend');
loader.setParser(md, el('#a'));
loader.load('README.md');


loader.setParser(img, el('#a'));
loader.load('public/img/default.jpg');
