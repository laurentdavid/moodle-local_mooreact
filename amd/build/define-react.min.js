(function() {
    if (typeof define === 'function' && define.amd) {
        define('react', [], function() {
            return window.React;
        });
        define('react-dom/client', [], function() {
            return window.ReactDOM;
        });
    }
})();