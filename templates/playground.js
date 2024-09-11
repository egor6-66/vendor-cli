function remove(id) {
    const oldScript = document.getElementById(id);

    if (oldScript) {
        oldScript.remove();
    }
}

function addScript() {
    const id = 'playgroundJS';
    remove(id);
    const script = document.createElement('script');
    script.src = 'index.js';
    script.id = id;
    document.body.appendChild(script);
}

function addLink() {
    const id = 'playgroundCSS';
    remove(id);
    const link = document.createElement('link');
    link.href = 'index.css';
    link.id = id;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

(() => {
    //socket
    addScript();
    addLink();

    ws.onmessage = function (res) {
        const { event, data } = JSON.parse(res.data);

        if (event === 'updatePlayground') {
            if (data.ext === 'js') {
                addScript();
            }

            if (data.ext === 'css') {
                addLink();
            }
        }
    };
})();
