/**
 * Provides View support for Widgets through an extension.
 * 
 * @module gallery-widget-view
 */
var L = Y.Lang,

    ATTR_VIEW_NAME = "viewName",
    ATTR_VIEW = "view",

    CONTENT_BOX = "contentBox",
    INNERHTML = "innerHTML",

    EVENT_INSERT_VIEW = "insertView",

    ViewNameChange = "viewNameChange",
    ViewChange = "viewChange",

    RENDERUI = "renderUI",
    BINDUI = "bindUI",
    SYNCUI = "syncUI";

/**
 * Widget extension, which can be used to add View support to the 
 * base Widget class, through the <a href="Base.html#method_build">Base.build</a> 
 * method.
 * <p>
 * The extension adds a default content for the widget (innerHTML for contentBox), and on 
 * top of that, supports binding regular attributes to specific node into the view to 
 * facilitate the use of different views for a particular widget.
 * </p>
 * @class WidgetView
 * @param {Object} The user configuration object
 */
function View(config) {
    Y.before(this._renderUIView, this, RENDERUI);
    Y.before(this._bindUIView, this, BINDUI);
    Y.before(this._syncUIView, this, SYNCUI);
    //this.before(RENDERUI, this._renderUIView, this);
    //this.before(BINDUI, this._bindUIView, this);
    //this.before(SYNCUI, this._syncUIView, this);

    /**
    * Fires when a view restores the content of the widget.
    * <p>
    * Subscribers to the "on" moment of this event, will be notified 
    * before the new content gets inserted.
    * </p>
    * <p>
    * Subscribers to the "after" moment of this event, will be notified
    * after the new content gets inserted.
    * </p>
    *
    * @event insertView
    * @preventable _defInsertViewFn
    * @param {EventFacade} e The Event Facade
    */
    this.publish(EVENT_INSERT_VIEW, { 
        defaultTargetOnly: true,
        defaultFn: this._defInsertViewFn 
    });

    this.on (EVENT_INSERT_VIEW, this._afterInsertViewFn, this);
}

/**
 * Static property used to define the default attribute 
 * configuration introduced by WidgetView.
 * 
 * @property WidgetView.ATTRS
 * @type Object
 * @static
 */
View.ATTRS = {

    /**
     * @attribute viewName
     * @type {String}
     * @default 'view'
     * @description The name of the view used to prefix the classname of every attribute 
     * associated to the view. The classname will be used to locate the placeholder of the attribute
     * in the view.
     */
    viewName: {
        value: 'view'
    },

    /**
     * @attribute view
     * @type {String | Node}
     * @default undefined
     * @description The content to be added to the contentBox. This will replace any existing content
     * in the contentBox if the viewName is not a class applied to it.
     */
    view: {
        value: null
    }
};

View.prototype = {

    /**
     * Synchronizes the UI to match the Widgets View state.
     * <p>
     * This method is invoked after syncUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     * @method _syncUIView
     * @protected
     */
    _syncUIView : function() {
        var n, attrs = this._viewAttrs;
        // sync up each attribute associated with the view
        for (n in attrs) {
            if (attrs.hasOwnProperty(n)) {
                this._syncViewAttr(attrs[n]);
            }
        }
    },

    /**
     * Creates/Initializes the DOM for view support.
     * <p>
     * This method is invoked after renderUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     * @method _renderUIStdMod
     * @protected
     */
    _renderUIView : function() {
        this.fire(EVENT_INSERT_VIEW);
    },

    /**
     * Binds event listeners responsible for updating the UI state in response to 
     * Widget view related state changes.
     * <p>
     * This method is invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     * @method _bindUIView
     * @protected
     */
    _bindUIView : function() {
        this.after(ViewChange, this._afterViewChange);
        this.after(ViewNameChange, this._afterViewNameChange);
        // TODO: bind specific attributes now
    },

    /**
     * Default attribute change listener for the view attribute, responsible
     * for updating the contentBox innerHTML, in response to attribute changes.
     *
     * @method _afterViewChange
     * @protected
     * @param {EventFacade} e The event facade for the attribute change
     */
    _afterViewChange : function(e) {
        this.fire(EVENT_INSERT_VIEW);
    },

    /**
     * Default attribute change listener for the bodyContent attribute, responsible
     * for updating the UI, in response to attribute changes.
     *
     * @method _afterBodyChange
     * @protected
     * @param {EventFacade} e The event facade for the attribute change
     */
    _afterViewNameChange : function(e) {
        // TODO, do we really need this?
    },

    /**
     * @method _renderViewAttr
     * @protected
     * @param config object with a set of properties used to render the attribute
     * @description Draws a representation of an attribute as a node
     */
    _renderViewAttr : function (config) {
        var node = this.get(CONTENT_BOX).one( this._getViewAttrSelector(config) ),
            val = this.get(config.name);

        if (node) {
            if (config.render) {
                config.render.apply (this, [node, val, config]);
            } else if (config.content) {
                node.set( INNERHTML, config.content );
            }
        }
    },

    /**
     * @method _syncViewAttr
     * @protected
     * @param config object with a set of properties used to sync up the attribute
     * @description Syncs a node with the corresponding attribute
     */
    _syncViewAttr : function (config) {
        var node = this.get(CONTENT_BOX).one( this._getViewAttrSelector(config) ),
            val = this.get(config.name);

        if (node) {
            Y.log ('Dynamic sync up process for a view attribute: '+config.name, 'info', 'widget-view');
            if (config.sync) {
                config.sync.apply (this, [node, val, config]);
            } else if (config.substitute) {
                node.set(INNERHTML, Y.substitute(config.content, val, config.substituteFn) );
            } else {
                node.set(INNERHTML, val);
            }
        }
    },

    /**
     * @method _bindViewAttr
     * @protected
     * @param config object with a set of properties used to sync up the attribute
     * @description Bind an attribute associated to the current view
     */
    _bindViewAttr : function (config) {
        var node = this.get(CONTENT_BOX).one( this._getViewAttrSelector(config) );

        if (node && config.bind) {
            Y.log ('Dynamic bind process for a view attribute: '+config.name, 'info', 'widget-view');
            config.bind.apply (this, [config]);
        }
    },

    /**
     * Gets a selector used to locate the placeholder of the attribute.
     *
     * @method _getViewAttrSelector
     * @protected
     * @param {Object} config object with a set of properties used to sync up the attribute
     * @return {String} The selector
     */
    _getViewAttrSelector : function(config) {
        return '.' + this.get(ATTR_VIEW_NAME) + '-' + config.name;
    },

    /**
     * Gets the configuration of the attribute associated to the view.
     *
     * @method _getViewAttr
     * @protected
     * @param {String} name The attribute name
     * @return {Object} config object with a set of properties used to sync up the attribute
     */
    _getViewAttr : function(name) {
        return ( (name && this._viewAttrs.hasOwnProperty(name)) ? this._viewAttrs[name] : null);
    },

     /**
      * Default insertView handler
      *
      * @method _defInsertViewFn
      * @protected
      * @param event {EventFacade} The Event object
      * be removed.
      */
    _defInsertViewFn : function() {
        var contentBox = this.get(CONTENT_BOX),
            content = this.get(ATTR_VIEW);
        // for progresive enhancement, we can add a classname to the contentBox to avoid the replace
        if (!contentBox.hasClass(this.get(ATTR_VIEW_NAME))) {
            // TODO: purge the elements, and remove children if needed
            if (L.isString(content)) {
                contentBox.set('innerHTML', content);
            } else if (L.isObject(content) && content._node) {
                contentBox.set('innerHTML', '').append(content);
            }
        }
    },
    _afterInsertViewFn: function () {
        var n, attrs = this._viewAttrs;
        // rendering each attribute associated with the view
        for (n in attrs) {
            if (attrs.hasOwnProperty(n)) {
                this._renderViewAttr(attrs[n]);
            }
        }
    },
    /**
     * Add an attribute name to the current view.
     * 
     * @method addViewAttr
     * @param {String|Object} name The attribute name or the attribute config object that 
     *                             should be associated with the view.
     * @param {Object} config object with a set of properties used to sync up the attribute.
     */
    addViewAttr : function (name, config) {
        // if name is an object, then the object should contains name as a property, 
        // else, we use the config.name = name
        if (L.isObject(name) && name.name) {
            config = name;
            name = config.name;
        } else {
            config = config || {};
            config.name = name;
        }
        this._viewAttrs = this._viewAttrs || {};
        if (!this._viewAttrs.hasOwnProperty(name)) {
            // defining the after listener for monitoring changes in the attribute
            this.after(name + 'Change', function () {
                // this is to support overriding attribute configuration during the inherit process
                this._syncViewAttr( this._getViewAttr (name) );
            }, this);
        }
        this._viewAttrs[name] = config;
    },
    /**
     * Add multiple attributes to the current view.
     * 
     * @method addViewAttrs
     * @param {Array} attrs The attributes that should be associated with the view.
     */
    addViewAttrs : function (attrs) {
        Y.each(Y.Array(attrs), function(attr) {
            this.addViewAttr(attr);
        }, this);
    }
};

Y.WidgetView = View;