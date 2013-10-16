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

    deps: ['THREE', 'TweenMax', 'TimelineMax']
});

/**
 * addEvent
 * @param {object}   obj  
 * @param {string}   type 
 * @param {Function} fn   
 */
window.addEvent = function(obj, type, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
        obj['e' + type + fn] = fn;
        obj[type + fn] = function() {
            obj['e' + type + fn](window.event);
        };
        obj.attachEvent('on' + type, obj[type + fn]);
    }
};

/**
 * removeEvent description
 * @param {object}   obj  
 * @param {string}   type 
 * @param {Function} fn  
 */
window.removeEvent = function(obj, type, fn) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + type, obj[type + fn]);
        obj[type + fn] = null;
    } else obj.removeEventListener(type, fn, false);
};

/**
 * dispatchCustomEvent
 * @param  {string} name 
 * @param  {*} data 
 * @return {dispatchEvent}      
 */
window.dispatchCustomEvent = function(name, data) {
    var e;
    if (document.createEvent) { // W3C
        e = document.createEvent('Event');
        e.initEvent(name, true, true);
        e.data = data;
        window.dispatchEvent(e);
    } else { // IE => Support by Modernizr
        /*d = document.documentElement;
        e = document.createEventObject();
        //e.data = data;
        d.fireEvent(name, e);*/
    }

};

require(['app/app', 'THREE'], function(App) {
    window.app = new App();
});

var log = function(x) {
    if (typeof console != 'undefined') {
        console.log(x);
    }
};