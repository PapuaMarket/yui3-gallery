/**
 * Bootstrap Engine for Plug and Play widgets. This class is meant to be used in 
 * conjuntion with the Injection Engine (gallery-bootstrap-engine). It facilitates the use of
 * an iframe as a sandbox to execute certain tasks and/or a presention element.
 *
 * @module gallery-bootstrap-engine
 * @requires node, base-base
 * @class Y.BootstrapEngine
 * @param config {Object} Configuration object
 * @extends Y.Base
 * @constructor
 */

///////////////////////////////////////////////////////////////////////////
//
// Private shorthands, constants and variables
//
///////////////////////////////////////////////////////////////////////////

var ATTR_HOST = 'host';

///////////////////////////////////////////////////////////////////////////
//
// Class definition
//
///////////////////////////////////////////////////////////////////////////

function BootstrapEngine () {
    // setting the timestamp 1 right before starting the bootstrap process (just in case you want to do some perf)
    Y.config.t1 = new Date().getTime();
    BootstrapEngine.superclass.constructor.apply(this, arguments);
}

Y.mix(BootstrapEngine, {

    /**
     * The identity of the class.
     * @property BootstrapEngine.NAME
     * @type string
     * @static
     * @final
     * @readOnly
     * @default 'bootstrap'
     */
    NAME: 'bootstrap',

    /**
     * Static property used to define the default attribute configuration of
     * the class.
     * @property BootstrapEngine.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS: {
        /**
         * @attribute container
         * @type {String}
         * @writeOnce
         * @description selector for the iframe's container. This is relative to the parent document.
         */
        container: {},
        /**
         * @attribute iframe
         * @type {Node}
         * @readyOnly
         * @description Node reference to the iframe on the parent document.
         */
        iframe: {
            getter: function () {
                var host = this.get(ATTR_HOST);
                return host && host.one( this.get('container') + ' iframe' );
            }
        },
        /**
         * @attribute host
         * @type {Object}
         * @readyOnly
         * @description A "Y" reference bound to the parent document.
         */
        host: {
            readyOnly: true
        }
    }

});

Y.extend(BootstrapEngine, Y.Base, {

    /**
     * Construction logic executed during Bootstrap Engine instantiation.
     *
     * @method initializer
     * @param cfg {Object} Initial configuration
     * @protected
     */
    initializer: function () {
        var instance = this,
            parent = Y.config.win.parent;

        Y.log ('Initialization', 'info', 'bootstrap');

        // Creating a new YUI instance bound to the parent window
        instance._set(ATTR_HOST, YUI({
            bootstrap: false,
            win: parent.window,
            doc: parent.window.document
        }).use('node', function( HOST ) {
            // finishing the initialization process async to facilitate 
            // addons to hook into _init/_bind if needed.
            Y.later(0, instance, function() {
                instance._init();
            });
        }));
    },

    /**
     * Connects the bootstrap with the injection engine running in the parent window. This method 
     * defines the hand-shake process between them. This method is meant to be called by
     * the bootstrap engine _init method to start the connection.
     *
     * @method _ready
     * @protected
     */
    _ready: function () {
        var instance = this,
            guid = Y.config.guid, // injection engine guid value
            // getting a reference to the parent window callback function to notify
            // to the injection engine that the bootstrap is ready
            callback = instance.get(ATTR_HOST).config.win.YUI.Env[guid];
        Y.log ('Connecting with injection engine', 'info', 'bootstrap');
        // connecting bootstrap with the injection engines
        if (callback) {
            callback (instance);
        }
        Y.log ('Bootstrap ready', 'info', 'bootstrap');
    },

    /**
     * Basic initialization routine, styling the iframe, binding events and
     * connecting the bootstrap engine with the injection engine.
     *
     * @method _bind
     * @protected
     */
    _init: function () {
        var instance = this;
        Y.log ('Init', 'info', 'bootstrap');
        // adjust the iframe container in preparation for the first display action
        instance._styleIframe();
        // binding some extra events
        instance._bind();
        // connecting the bootstrap with the injection engine
        instance._ready();
    },

    /**
     * The iframe that holds the bootstrap engine sometimes is used as a UI overlay.
     * In this case, you can style it through this method. By default, it will set 
     * border, frameBorder, marginWidth, marginHeight, leftMargin and topMargin to
     * cero, and allowTransparency to true.
     *
     * @method _styleIframe
     * @protected
     */
    _styleIframe: function () {
        var optimizedName = 'setAttribute',
            iframe = this.get('iframe'); // TODO: this have to be in a lang bundle
        Y.log ('Styling the iframe', 'info', 'bootstrap');
        Y.each (['border', 'frameBorder', 'marginWidth', 'marginHeight', 'leftMargin', 'topMargin'], function (name) {
            iframe[optimizedName](name, 0);
        });
        // this is equivalent to: iframe.setAttribute('foo', 'bar').setAttribute('more', 'chaining'); but 
        // since we don't have setAttributes, we do this crazy stuff to gain some bytes with the compressor.
        iframe[optimizedName]('allowTransparency', "true");
    },

    /**
     * Defines the binding logic for the bootstrap engine, listening for some attributes 
     * that might change, and defining the set of events that can be exposed to the injection engine.
     *
     * @method _bind
     * @protected
     */
    _bind: function () {
        Y.log ('Binding bootstrap', 'info', 'bootstrap');
    }

});

Y.BootstrapEngine = BootstrapEngine;