const Github = class {
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }

    //static time
    load(path){
        const id = 'callback' + Github._id++;
        const f = Github[id] = ({data:{content}}) => {
            delete Github[id];
            document.head.removeChild(s);
            this._loaded(content);
        };

        const s = document.createElement('script');
        s.src = `${this._base + path}?callback=Github.${id}`;
        document.head.appendChild(s);
    }

    //hook method
    _loaded(v) { throw 'override!'}
};

Github._id = 0;

const ImageLoader = class extends Github {
    constructor(id, repo, target) {
        super(id, repo);
        this._target = target;
    }
    //runtime
    _loaded(v) {
        this._target.src = 'data:text/plain;base64,' + v;
    }
}


const d64 = v => decodeURIComponent(
    atob(v).split('').map(c=>'%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join('')
);

const MdLoader = class extends Github {
    constructor(id, repo, target) {
        super(id, repo);
        this._target = target;
    }

    _loaded(v) {
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

const s75md = new MdLoader('y0c', 'DockerFarm-frontend', document.querySelector('#b'));
s75md.load('README.md');