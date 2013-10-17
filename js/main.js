require.config({
    baseUrl: 'js/lib',
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

require(['app/app'], function(App) {
    window.app = new App();
});