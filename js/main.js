require.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    },

    shim: {
        Stats: {
            exports: 'Stats'
        }
    },

    deps: ['three']
});

require(['app/app', 'three'], function(App) {
    window.app = new App();
});

var log = function(x) {
    if (typeof console != 'undefined') {
        console.log(x);
    }
};