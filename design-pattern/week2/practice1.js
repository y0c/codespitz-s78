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
      this._parser.parse(content);
		}

		const s = document.createElement('script');
		s.src = `${this._base + path}?callback=Github.${id}`;
		document.head.appendChild(s);
	}

  setParser(parser){
    if(!parser instanceof Loader) {
      throw 'parser must be loader type';
    }
    this._parser = parser;
  }
}

Github.id = 0;

const el = v => document.querySelector(v);
//추상 전략 객체 
const Loader = class {
  constructor(target) {
    if( typeof(target) != 'string' ) throw 'target must be string';
    this._target = el(target);
  }

  parse(v) { throw 'must be override!!'}
}

const d64 = v => decodeURIComponent(
    atob(v).split('').map(c=>'%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join('')
);

//구상 전략 객체 
const ImgLoader = class extends Loader {
  parse(v) {
    this._target.src = 'data:text/plain;base64,' + v;
  }
}

//구상 전략 객체 
const MDLoader = class extends Loader {
  parse(v) {
    this._target.innerHTML = this._parseMD(v);
  }
  _parseMD(v) {
    return d64(v).split('\n').map(v=>{
        let i = 3;
        while(i--){
            if(v.startsWith('#'.repeat(i+1))) return `<h${i+1}>${v.substr(i+1)}</h${i+1}>`;
        }
        return v;
    }).join('<br/>');
  }
}

const loader = new Github('DockerFarm', 'DockerFarm-frontend');
const md = new MDLoader('#b');
loader.setParser(md);
loader.load('README.md');

