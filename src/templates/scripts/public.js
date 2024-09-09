(() => {
    function createLink(path) {
        const id = `vendorCSS`;
        const href = path;
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

    function reloadCss() {
        const links = document.getElementsByTagName('link');

        for (const cl in links) {
            const link = links[cl];
            if (link.rel === 'stylesheet') link.href += '';
        }
    }

    createLink('../vendor/index.css');

    //watcher
})();
