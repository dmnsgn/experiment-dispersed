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
        three: {
            exports: 'THREE'
        },
        ParticleEngine: {
            deps: ["THREE"],
            exports: 'ParticleEngine'
        },
        Stats: {
            exports: 'Stats'
        },
        TweenMax: {
            exports: "TweenMax"
        },
        TimelineMax: {
            deps: ["TweenMax"],
            exports: "TimelineMax"
        }
    },

    deps: ['THREE', 'ParticleEngine', 'TweenMax', 'TimelineMax']
});

require(['app/app', 'THREE'], function(App) {
    window.app = new App();
});

var log = function(x) {
    if (typeof console != 'undefined') {
        console.log(x);
    }
};