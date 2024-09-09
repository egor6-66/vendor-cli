(() => {
    //ws
    createScript('index.js');
    createLink('index.css');

    function createScript(src) {
        const id = 'vendorJsPlayground';
        const el = document.getElementById(id);

        if (el) {
            el.remove();
        }

        const script = document.createElement('script');
        script.id = id;
        script.type = 'text/javascript';
        script.src = src;
        document.body.appendChild(script);
    }

    function createLink(href) {
        const id = 'vendorCssPlayground';
        const el = document.getElementById(id);

        if (el) {
            el.remove();
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = id;
        link.type = 'text/css';
        link.href = href;
        document.head.appendChild(link);
    }

    ws.onmessage = function (res) {
        const { event, data } = JSON.parse(res.data);
        console.log(data);

        if (event === 'updatePlayground') {
            data.js.forEach((i) => {
                createScript(i);
            });
            data.css.forEach((i) => {
                createLink(i);
            });
        }
    };
})();
