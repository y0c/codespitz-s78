const Github = class {
    constructor(id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
    }

    //static time
    load(path){
        const id = 'callback' + Github.id++;
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

const MdLoader = class extends Github {
    constructor(id, repo, target) {
        super(id, repo);
        this._target = target;
    }

    _loaded(v) {
        this._target.innerHTML = this._parseMD(v);
    }
}