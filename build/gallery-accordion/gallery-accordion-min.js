YUI.add("gallery-accordion",function(a){(function(){var V=a.Lang,v=a.Node,z=a.Anim,h=a.Easing,n="accordion",x=a.WidgetStdMod,T=document.compatMode=="BackCompat",t=T&&a.UA.ie>0,u=t?1:0,j=a.ClassNameManager.getClassName,w="yui3-accordion-item",F=j(n,"proxyel","visible"),H=j(n,"graggroup"),B="beforeItemAdd",E="itemAdded",M="itemChosen",d="beforeItemRemove",I="itemRemoved",c="beforeItemResized",Q="itemResized",D="beforeItemExpand",G="beforeItemCollapse",k="itemExpanded",N="itemCollapsed",J="beforeItemReorder",r="beforeEndItemReorder",s="itemReordered",K="default",o="animation",p="alwaysVisible",e="expanded",C="collapseOthersOnExpand",y="items",U="contentHeight",b="iconClose",f="iconAlwaysVisible",g="stretch",S="px",A="contentBox",O="boundingBox",i="srcNode",L="rendered",P="bodyContent",q="children",l="parentNode",R="node",m="data";a.Accordion=a.Base.create(n,a.Widget,[],{initializer:function(W){this._initEvents();this.after("render",a.bind(this._afterRender,this));},destructor:function(){var W,Z,X,Y;W=this.get(y);Y=W.length;for(X=Y-1;X>=0;X--){Z=W[X];W.splice(X,1);this._removeItemHandles(Z);Z.destroy();}},_bindItemChosenEvent:function(X){var W;W=this.get(A);W.delegate(X,a.bind(this._onItemChosenEvent,this),".yui3-widget-hd");},_initEvents:function(){this.publish(M,{defaultFn:this._onItemChosen});},_forCollapsing:{},_forExpanding:{},_animations:{},_itemsHandles:{},_removeItemHandles:function(Y){var X,W;X=this._itemsHandles[Y];for(W in X){if(X.hasOwnProperty(W)){W=X[W];W.detach();}}delete this._itemsHandles[Y];},_getNodeOffsetHeight:function(Y){var W,X;if(Y instanceof v){if(Y.hasMethod("getBoundingClientRect")){X=Y.invoke("getBoundingClientRect");if(X){W=X.bottom-X.top;return W;}}else{W=Y.get("offsetHeight");return a.Lang.isValue(W)?W:0;}}else{if(Y){W=Y.offsetHeight;return a.Lang.isValue(W)?W:0;}}return 0;},_setItemProperties:function(Y,aa,X){var W,Z;W=Y.get(p);Z=Y.get(e);if(aa!=Z){Y.set(e,aa,{internalCall:true});}if(X!==W){Y.set(p,X,{internalCall:true});}},_setItemUI:function(X,Y,W){X.markAsExpanded(Y);X.markAsAlwaysVisible(W);},_afterRender:function(X){var W;W=this.get("resizeEvent");this._setUpResizing(W);this.after("resizeEventChange",a.bind(this._afterResizeEventChange,this));},_afterResizeEventChange:function(W){this._setUpResizing(W.newVal);},_onItemChosen:function(ac){var aa,Y,Z,X,ab,ad,W;ab=ac.item;ad=ac.srcIconAlwaysVisible;W=ac.srcIconClose;aa={};X=this.get(C);Y=ab.get(p);Z=ab.get(e);if(W){this.removeItem(ab);return;}else{if(ad){if(Z){Y=!Y;Z=Y?true:Z;this._setItemProperties(ab,Z,Y);this._setItemUI(ab,Z,Y);return;}else{this._forExpanding[ab]={"item":ab,alwaysVisible:true};if(X){aa[ab]={"item":ab};this._storeItemsForCollapsing(aa);}}}else{if(Z){this._forCollapsing[ab]={"item":ab};}else{this._forExpanding[ab]={"item":ab,"alwaysVisible":Y};if(X){aa[ab]={"item":ab};this._storeItemsForCollapsing(aa);}}}}this._processItems();},_adjustStretchItems:function(){var X=this.get(y),Y,W;Y=this._getHeightPerStretchItem();W=this._forExpanding;a.Array.each(X,function(ad,ac,ab){var Z,af,ae,ag,aa;ag=ad.get(U);aa=ad.get(e);if(!W[ad]&&ag.method===g&&aa){ae=this._animations[ad];if(ae){ae.stop();}Z=ad.getStdModNode(x.BODY);af=this._getNodeOffsetHeight(Z);if(Y<af){this._processCollapsing(ad,Y);}else{if(Y>af){this._processExpanding(ad,Y);}}}},this);return Y;},_getHeightPerStretchItem:function(){var W,Y,X=0;Y=this.get(y);W=this.get(O).get("clientHeight");a.Array.each(Y,function(ad,ac,ab){var ae,aa,ag,af,Z;ag=ad.getStdModNode(x.HEADER);af=ad.get(U);Z=this._getNodeOffsetHeight(ag);W-=Z;ae=!ad.get(e);if(ae){W-=u;return;}if(af.method===g){X++;}else{aa=this._getItemContentHeight(ad);W-=aa;}},this);if(X>0){W/=X;}if(W<0){W=0;}return W;},_getItemContentHeight:function(Y){var aa,X=0,W,Z;aa=Y.get(U);if(aa.method==="auto"){W=Y.getStdModNode(x.BODY);Z=W.get(q).item(0);X=Z?this._getNodeOffsetHeight(Z):0;}else{if(aa.method==="fixed"){X=aa.height;}else{X=this._getHeightPerStretchItem();}}return X;},_storeItemsForCollapsing:function(X){var W;X=X||{};W=this.get(y);a.Array.each(W,function(ac,ab,aa){var Z,Y;Z=ac.get(e);Y=ac.get(p);if(Z&&!Y&&!X[ac]){this._forCollapsing[ac]={"item":ac};}},this);},_expandItem:function(Y,W){var X=Y.get(p);this._processExpanding(Y,W);this._setItemUI(Y,true,X);},_processExpanding:function(ad,ac,W){var X,Y,aa,ae=false,ab,Z;Z=ad.getStdModNode(x.BODY);this.fire(c,{"item":ad});if(Z.get("clientHeight")<=u){ae=true;this.fire(D,{"item":ad});}if(!W&&this.get("useAnimation")){aa=ad.get(o)||{};X=new z({node:Z,to:{"height":ac}});X.on("end",a.bind(this._onExpandComplete,this,ad,ae));ab=this.get(o);X.set("duration",aa.duration||ab.duration);X.set("easing",aa.easing||ab.easing);Y=this._animations[ad];if(Y){Y.stop();}ad.markAsExpanding(true);this._animations[ad]=X;X.run();}else{Z.setStyle("height",ac+S);this.fire(Q,{"item":ad});if(ae){this.fire(k,{"item":ad});}}},_onExpandComplete:function(W,X){delete this._animations[W];W.markAsExpanding(false);this.fire(Q,{"item":W});if(X){this.fire(k,{"item":W});}},_collapseItem:function(W){this._processCollapsing(W,u);this._setItemUI(W,false,false);},_processCollapsing:function(ad,ac,W){var X,Y,aa,ab,Z,ae=(ac===u);Z=ad.getStdModNode(x.BODY);this.fire(c,{"item":ad});if(ae){this.fire(G,{"item":ad});}if(!W&&this.get("useAnimation")){aa=ad.get(o)||{};X=new z({node:Z,to:{"height":ac}});X.on("end",a.bind(this._onCollapseComplete,this,ad,ae));ab=this.get(o);X.set("duration",aa.duration||ab.duration);X.set("easing",aa.easing||ab.easing);Y=this._animations[ad];if(Y){Y.stop();}ad.markAsCollapsing(true);this._animations[ad]=X;X.run();}else{Z.setStyle("height",ac+S);this.fire(Q,{"item":ad});if(ae){this.fire(N,{"item":ad});}}},_onCollapseComplete:function(W,X){delete this._animations[W];W.markAsCollapsing(false);this.fire(Q,{item:W});if(X){this.fire(N,{"item":W});}},_initItemDragDrop:function(X){var ab,W,aa,Y,Z;ab=X.getStdModNode(x.HEADER);if(ab.dd){return;}aa=this.get(O);Y=X.get(O);W=new a.DD.Drag({node:ab,groups:[H]}).plug(a.Plugin.DDProxy,{moveOnEnd:false}).plug(a.Plugin.DDConstrained,{constrain2node:aa});
Z=new a.DD.Drop({node:Y,groups:[H]});W.on("drag:start",a.bind(this._onDragStart,this,W));W.on("drag:end",a.bind(this._onDragEnd,this,W));W.after("drag:end",a.bind(this._afterDragEnd,this,W));W.on("drag:drophit",a.bind(this._onDropHit,this,W));},_onDragStart:function(W,Z){var Y,X;X=this.getItem(W.get(R).get(l));Y=W.get("dragNode");Y.addClass(F);Y.set("innerHTML",X.get("label"));return this.fire(J,{"item":X});},_onDragEnd:function(W,Z){var Y,X;Y=W.get("dragNode");Y.removeClass(F);Y.set("innerHTML","");X=this.getItem(W.get(R).get(l));return this.fire(r,{"item":X});},_afterDragEnd:function(W,Z){var X,Y;Y=W.get(m);if(Y.drophit){X=this.getItem(W.get(R).get(l));W.set(m,{drophit:false});return this.fire(s,{"item":X});}return true;},_onDropHit:function(af,ab){var aa,ae,X,ad,Z,W,ac,Y,ag;ag=this.getItem(af.get(R).get(l));Y=this.getItem(ab.drop.get(R));if(Y===ag){return false;}aa=this.getItemIndex(ag);ae=this.getItemIndex(Y);X=Y.get(O);ad=ag.get(O);Z=this.get(A);W=false;ac=this.get(y);if(ae<aa){W=true;}Z.removeChild(ad);if(W){Z.insertBefore(ad,X);ac.splice(aa,1);ac.splice(ae,0,ag);}else{Z.insertBefore(ad,X.next(w));ac.splice(ae+1,0,ag);ac.splice(aa,1);}af.set(m,{drophit:true});return true;},_processItems:function(){var Y,X,Z,ab,W,ac,aa;Y=this._forCollapsing;X=this._forExpanding;this._setItemsProperties();for(aa in Y){if(Y.hasOwnProperty(aa)){Z=Y[aa];this._collapseItem(Z.item);}}ab=this._adjustStretchItems();for(aa in X){if(X.hasOwnProperty(aa)){Z=X[aa];aa=Z.item;W=ab;ac=aa.get(U);if(ac.method!==g){W=this._getItemContentHeight(aa);}this._expandItem(aa,W);}}this._forCollapsing={};this._forExpanding={};},_setItemsProperties:function(){var Y,X,W;Y=this._forCollapsing;X=this._forExpanding;for(W in Y){if(Y.hasOwnProperty(W)){W=Y[W];this._setItemProperties(W.item,false,false);}}for(W in X){if(X.hasOwnProperty(W)){W=X[W];this._setItemProperties(W.item,true,W.alwaysVisible);}}},_afterItemExpand:function(aa){var Y,Z,X,W;if(aa.internalCall){return;}Y=aa.newVal;Z=aa.currentTarget;X=Z.get(p);W=this.get(C);if(Y){this._forExpanding[Z]={"item":Z,"alwaysVisible":X};if(W){this._storeItemsForCollapsing();}}else{this._forCollapsing[Z]={"item":Z};}this._processItems();},_afterItemAlwaysVisible:function(Z){var Y,W,X;if(Z.internalCall){return;}W=Z.newVal;Y=Z.currentTarget;X=Y.get(e);if(W){if(X){this._setItemProperties(Y,true,true);this._setItemUI(Y,true,true);return;}else{this._forExpanding[Y]={"item":Y,"alwaysVisible":true};this._storeItemsForCollapsing();}}else{if(X){this._setItemUI(Y,true,false);return;}else{return;}}this._processItems();},_afterContentHeight:function(ab){var Z,X,W,aa,Y;Z=ab.currentTarget;this._adjustStretchItems();if(ab.newVal.method!==g){Y=Z.get(e);X=this._getItemContentHeight(Z);W=Z.getStdModNode(x.BODY);aa=this._getNodeOffsetHeight(W);if(X<aa){this._processCollapsing(Z,X,!Y);}else{if(X>aa){this._processExpanding(Z,X,!Y);}}}},_afterContentUpdate:function(ab){var Y,W,aa,X,ac,Z;Y=ab.currentTarget;ac=Y.get("contentHeight").method==="auto";X=Y.get(e);W=Y.getStdModNode(x.BODY);aa=this._getNodeOffsetHeight(W);if(ac&&X&&ab.src!==a.Widget.UI_SRC){a.later(0,this,function(){var ad=this._getItemContentHeight(Y);if(ad!==aa){Z=this._animations[Y];if(Z){Z.stop();}this._adjustStretchItems();if(ad<aa){this._processCollapsing(Y,ad,!X);}else{if(ad>aa){this._processExpanding(Y,ad,!X);}}}});}},_setUpResizing:function(W){if(this._resizeEventHandle){this._resizeEventHandle.detach();}if(W===K){this._resizeEventHandle=a.on("windowresize",a.bind(this._adjustStretchItems,this));}else{this._resizeEventHandle=W.sourceObject.on(W.resizeEvent,a.bind(this._adjustStretchItems,this));}},renderUI:function(){var Z,Y,X,W;Z=this.get(i);X=this.get(A);W=Z.get("id");X.set("id",W);Y=Z.all("> ."+w);Y.each(function(ad,aa,ac){var ab;if(!this.getItem(ad)){ab=new a.AccordionItem({srcNode:ad,id:ad.get("id")});this.addItem(ab);}},this);},bindUI:function(){var W,Y,X;Y=this.get(M);if(V.isArray(Y)){X=Y.length;for(W=0;W<X;W++){this._bindItemChosenEvent(Y[W]);}}else{this._bindItemChosenEvent(Y);}},_onItemChosenEvent:function(ab){var ad,ac,Y,Z,X,aa,W;ad=ab.currentTarget;ac=ad.get(l);Y=this.getItem(ac);Z=Y.get(f);X=Y.get(b);aa=(Z===ab.target);W=(X===ab.target);this.fire(M,{item:Y,srcIconAlwaysVisible:aa,srcIconClose:W});},addItem:function(ai,Y){var ac,ag,aa,ab,W,af,ae,ah,Z,ad,X;ad=this.fire(B,{"item":ai});if(!ad){return false;}af=this.get(y);ae=this.get(A);Z=ai.get(A);if(!Z.inDoc()){if(Y){W=this.getItemIndex(Y);if(W<0){return false;}af.splice(W,0,ai);ae.insertBefore(Z,Y.get(O));}else{af.push(ai);ae.insertBefore(Z,null);}}else{X=ae.get(q);ad=X.some(function(al,ak,aj){if(al===Z){af.splice(ak,0,ai);return true;}else{return false;}},this);if(!ad){return false;}}aa=ai.getStdModNode(x.BODY);ab=ai.get(P);if(!aa&&!ab){ai.set(P,"");}if(!ai.get(L)){ai.render();}ac=ai.get(e);ag=ai.get(p);ac=ac||ag;if(ac){this._forExpanding[ai]={"item":ai,"alwaysVisible":ag};}else{this._forCollapsing[ai]={"item":ai};}this._processItems();if(this.get("reorderItems")){this._initItemDragDrop(ai);}ah=this._itemsHandles[ai];if(!ah){ah={};}ah={"expandedChange":ai.after("expandedChange",a.bind(this._afterItemExpand,this)),"alwaysVisibleChange":ai.after("alwaysVisibleChange",a.bind(this._afterItemAlwaysVisible,this)),"contentHeightChange":ai.after("contentHeightChange",a.bind(this._afterContentHeight,this)),"contentUpdate":ai.after("contentUpdate",a.bind(this._afterContentUpdate,this))};this._itemsHandles[ai]=ah;this.fire(E,{"item":ai});return true;},removeItem:function(X){var W,ab,Z=null,Y,aa;W=this.get(y);if(V.isNumber(X)){Y=X;}else{if(X instanceof a.AccordionItem){Y=this.getItemIndex(X);}else{return null;}}if(Y>=0){aa=this.fire(d,{item:X});if(!aa){return null;}Z=W.splice(Y,1)[0];this._removeItemHandles(Z);ab=Z.get(O);ab.remove();this._adjustStretchItems();this.fire(I,{item:X});}return Z;},getItem:function(Y){var W=this.get(y),X=null;if(V.isNumber(Y)){X=W[Y];return(X instanceof a.AccordionItem)?X:null;}else{if(Y instanceof v){a.Array.some(W,function(ac,ab,aa){var Z=ac.get(A);if(Z===Y){X=ac;
return true;}else{return false;}},this);}}return X;},getItemIndex:function(Y){var X=-1,W;if(Y instanceof a.AccordionItem){W=this.get(y);a.Array.some(W,function(ab,aa,Z){if(ab===Y){X=aa;return true;}else{return false;}},this);}return X;},_findStdModSection:function(W){return this.get(i).one("> ."+a.WidgetStdMod.SECTION_CLASS_NAMES[W]);},CONTENT_TEMPLATE:null},{NAME:n,ATTRS:{itemChosen:{value:"click",validator:function(W){return V.isString(W)||V.isArray(W);}},items:{value:[],readOnly:true,validator:V.isArray},resizeEvent:{value:K,validator:function(W){if(W===K){return true;}else{if(V.isObject(W)){if(V.isValue(W.sourceObject)&&V.isValue(W.resizeEvent)){return true;}}}return false;}},useAnimation:{value:true,validator:V.isBoolean},animation:{value:{duration:1,easing:h.easeOutStrong},validator:function(W){return V.isObject(W)&&V.isNumber(W.duration)&&V.isFunction(W.easing);}},reorderItems:{value:false,validator:function(W){return V.isBoolean(W)&&!V.isUndefined(a.DD);}},collapseOthersOnExpand:{value:true,validator:V.isBoolean}}});}());(function(){var U=a.Lang,B=a.Node,p=a.JSON,C=a.WidgetStdMod,D="accordion-item",n=a.ClassNameManager.getClassName,d=n(D,"iconexpanded","expanding"),S=n(D,"iconexpanded","collapsing"),o=n(D,"icon"),k=n(D,"label"),O=n(D,"iconalwaysvisible"),F=n(D,"icons"),M=n(D,"iconexpanded"),J=n(D,"iconclose"),q=n(D,"iconclose","hidden"),s=n(D,"iconexpanded","on"),l=n(D,"iconexpanded","off"),e=n(D,"iconalwaysvisible","on"),K=n(D,"iconalwaysvisible","off"),y=n(D,"expanded"),v=n(D,"closable"),H=n(D,"alwaysvisible"),I=n(D,"contentheight"),L="title",c="strings",Q="rendered",h="className",E="auto",j="stretch",w="fixed",t=".yui3-widget-hd",z=".",N=".yui3-widget-hd "+z,R="innerHTML",T="iconsContainer",G="icon",r="nodeLabel",g="iconAlwaysVisible",A="iconExpanded",b="iconClose",P="href",u="#",f="yuiConfig",i=/^(?:true|yes|1)$/,m=/^auto\s*/,V=/^stretch\s*/,x=/^fixed-\d+/;a.AccordionItem=a.Base.create(D,a.Widget,[a.WidgetStdMod],{_createHeader:function(){var ae,ac,ad,aa,ab,Z,X,W,Y;ab=this.get(G);Z=this.get(r);X=this.get(A);W=this.get(g);Y=this.get(b);aa=this.get(T);ad=this.get(c);ae=this.get("closable");ac=a.AccordionItem.TEMPLATES;if(!ab){ab=B.create(ac.icon);this.set(G,ab);}if(!Z){Z=B.create(ac.label);this.set(r,Z);}else{if(!Z.hasAttribute(P)){Z.setAttribute(P,u);}}Z.setContent(this.get("label"));if(!aa){aa=B.create(ac.iconsContainer);this.set(T,aa);}if(!W){W=B.create(ac.iconAlwaysVisible);W.setAttribute(L,ad.title_always_visible_off);this.set(g,W);}else{if(!W.hasAttribute(P)){W.setAttribute(P,u);}}if(!X){X=B.create(ac.iconExpanded);X.setAttribute(L,ad.title_iconexpanded_off);this.set(A,X);}else{if(!X.hasAttribute(P)){X.setAttribute(P,u);}}if(!Y){Y=B.create(ac.iconClose);Y.setAttribute(L,ad.title_iconclose);this.set(b,Y);}else{if(!Y.hasAttribute(P)){Y.setAttribute(P,u);}}if(ae){Y.removeClass(q);}else{Y.addClass(q);}this._addHeaderComponents();},_addHeaderComponents:function(){var ac,X,ab,Y,aa,Z,W;X=this.get(G);ab=this.get(r);aa=this.get(A);Z=this.get(g);W=this.get(b);Y=this.get(T);ac=this.getStdModNode(C.HEADER);if(!ac){ac=new B(document.createDocumentFragment());ac.appendChild(X);ac.appendChild(ab);ac.appendChild(Y);Y.appendChild(Z);Y.appendChild(aa);Y.appendChild(W);this.setStdModContent(C.HEADER,ac,C.REPLACE);}else{if(!ac.contains(X)){if(ac.contains(ab)){ac.insertBefore(X,ab);}else{ac.appendChild(X);}}if(!ac.contains(ab)){ac.appendChild(ab);}if(!ac.contains(Y)){ac.appendChild(Y);}if(!Y.contains(Z)){Y.appendChild(Z);}if(!Y.contains(aa)){Y.appendChild(aa);}if(!Y.contains(W)){Y.appendChild(W);}}},_labelChanged:function(X){var W;if(this.get(Q)){W=this.get(r);W.set(R,X.newVal);}},_closableChanged:function(X){var W;if(this.get(Q)){W=this.get(b);if(X.newVal){W.removeClass(q);}else{W.addClass(q);}}},initializer:function(W){this.after("labelChange",a.bind(this._labelChanged,this));this.after("closableChange",a.bind(this._closableChanged,this));},destructor:function(){},renderUI:function(){this._createHeader();},bindUI:function(){var W=this.get("contentBox");W.delegate("click",a.bind(this._onLinkClick,this),t+" a");},_onLinkClick:function(W){W.preventDefault();},markAsAlwaysVisible:function(X){var Y,W;Y=this.get(g);W=this.get(c);if(X){if(!Y.hasClass(e)){Y.replaceClass(K,e);Y.set(L,W.title_always_visible_on);return true;}}else{if(Y.hasClass(e)){Y.replaceClass(e,K);Y.set(L,W.title_always_visible_off);return true;}}return false;},markAsExpanded:function(X){var W,Y;Y=this.get(A);W=this.get(c);if(X){if(!Y.hasClass(s)){Y.replaceClass(l,s);Y.set(L,W.title_iconexpanded_on);return true;}}else{if(Y.hasClass(s)){Y.replaceClass(s,l);Y.set(L,W.title_iconexpanded_off);return true;}}return false;},markAsExpanding:function(X){var W=this.get(A);if(X){if(!W.hasClass(d)){W.addClass(d);return true;}}else{if(W.hasClass(d)){W.removeClass(d);return true;}}return false;},markAsCollapsing:function(W){var X=this.get(A);if(W){if(!X.hasClass(S)){X.addClass(S);return true;}}else{if(X.hasClass(S)){X.removeClass(S);return true;}}return false;},resize:function(){this.fire("contentUpdate");},_extractFixedMethodValue:function(aa){var X,Z,Y,W=null;for(X=6,Z=aa.length;X<Z;X++){Y=aa.charAt(X);Y=parseInt(Y,10);if(U.isNumber(Y)){W=(W*10)+Y;}else{break;}}return W;},_validateIcon:function(W){return !this.get(Q)||W;},_validateNodeLabel:function(W){return !this.get(Q)||W;},_validateIconsContainer:function(W){return !this.get(Q)||W;},_validateIconExpanded:function(W){return !this.get(Q)||W;},_validateIconAlwaysVisible:function(W){return !this.get(Q)||W;},_validateIconClose:function(W){return !this.get(Q)||W;},_setIcon:function(W){return a.one(W)||null;},_setNodeLabel:function(W){return a.one(W)||null;},_setIconsContainer:function(W){return a.one(W)||null;},_setIconExpanded:function(W){return a.one(W)||null;},_setIconAlwaysVisible:function(W){return a.one(W)||null;},_setIconClose:function(W){return a.one(W)||null;},_applyParser:function(W){var X;X=this.get("srcNode");if(X){this._parsedYUIConfig=X.getAttribute(f);if(this._parsedYUIConfig){this._parsedYUIConfig=p.parse(this._parsedYUIConfig);
}}a.AccordionItem.superclass._applyParser.apply(this,arguments);delete this._parsedYUIConfig;},_findStdModSection:function(W){return this.get("srcNode").one("> ."+a.WidgetStdMod.SECTION_CLASS_NAMES[W]);},CONTENT_TEMPLATE:null},{NAME:D,ATTRS:{icon:{value:null,validator:function(W){return this._validateIcon(W);},setter:function(W){return this._setIcon(W);}},label:{value:"&#160;",validator:U.isString},nodeLabel:{value:null,validator:function(W){return this._validateNodeLabel(W);},setter:function(W){return this._setNodeLabel(W);}},iconsContainer:{value:null,validator:function(W){return this._validateIconsContainer(W);},setter:function(W){return this._setIconsContainer(W);}},iconExpanded:{value:null,validator:function(W){return this._validateIconExpanded(W);},setter:function(W){return this._setIconExpanded(W);}},iconAlwaysVisible:{value:null,validator:function(W){return this._validateIconAlwaysVisible(W);},setter:function(W){return this._setIconAlwaysVisible(W);}},iconClose:{value:null,validator:function(W){return this._validateIconClose(W);},setter:function(W){return this._setIconClose(W);}},expanded:{value:false,validator:U.isBoolean},contentHeight:{value:{method:E},validator:function(W){if(U.isObject(W)){if(W.method===E){return true;}else{if(W.method===j){return true;}else{if(W.method===w&&U.isNumber(W.height)&&W.height>=0){return true;}}}}return false;}},alwaysVisible:{value:false,validator:U.isBoolean},animation:{value:{},validator:U.isObject},strings:{value:{title_always_visible_off:"Click to set always visible on",title_always_visible_on:"Click to set always visible off",title_iconexpanded_off:"Click to expand",title_iconexpanded_on:"Click to collapse",title_iconclose:"Click to close"}},closable:{value:false,validator:U.isBoolean}},HTML_PARSER:{icon:N+o,label:function(Z){var Y,aa,X,W;X=this._parsedYUIConfig;if(X&&U.isValue(X.label)){return X.label;}W=Z.getAttribute("data-label");if(W){return W;}aa=N+k;Y=Z.one(aa);return(Y)?Y.get(R):null;},nodeLabel:N+k,iconsContainer:N+F,iconAlwaysVisible:N+O,iconExpanded:N+M,iconClose:N+J,expanded:function(Y){var X,W;X=this._parsedYUIConfig;if(X&&U.isBoolean(X.expanded)){return X.expanded;}W=Y.getAttribute("data-expanded");if(W){return i.test(W);}return Y.hasClass(y);},alwaysVisible:function(Y){var X,W;X=this._parsedYUIConfig;if(X&&U.isBoolean(X.alwaysVisible)){W=X.alwaysVisible;}else{W=Y.getAttribute("data-alwaysvisible");if(W){W=i.test(W);}else{W=Y.hasClass(H);}}if(W){this.set("expanded",true,{internalCall:true});}return W;},closable:function(Y){var X,W;X=this._parsedYUIConfig;if(X&&U.isBoolean(X.closable)){return X.closable;}W=Y.getAttribute("data-closable");if(W){return i.test(W);}return Y.hasClass(v);},contentHeight:function(ac){var aa,ab,W=0,X,Z,Y;Z=this._parsedYUIConfig;if(Z&&Z.contentHeight){return Z.contentHeight;}Y=ac.getAttribute("data-contentheight");if(m.test(Y)){return{method:E};}else{if(V.test(Y)){return{method:j};}else{if(x.test(Y)){W=this._extractFixedMethodValue(Y);return{method:w,height:W};}}}ab=ac.get(h);aa=I+"-";X=ab.indexOf(aa,0);if(X>=0){X+=aa.length;ab=ab.substring(X);if(m.test(ab)){return{method:E};}else{if(V.test(ab)){return{method:j};}else{if(x.test(ab)){W=this._extractFixedMethodValue(ab);return{method:w,height:W};}}}}return null;}},TEMPLATES:{icon:'<a class="'+o+'"></a>',label:'<a href="#" class="'+k+'"></a>',iconsContainer:'<div class="'+F+'"></div>',iconExpanded:['<a href="#" class="',M," ",l,'"></a>'].join(""),iconAlwaysVisible:['<a href="#" class="',O," ",K,'"></a>'].join(""),iconClose:['<a href="#" class="',J," ",q,'"></a>'].join("")}});}());},"gallery-2011.03.23-22-20",{optional:["dd-constrain","dd-proxy","dd-drop"],requires:["event","anim-easing","widget","widget-stdmod","json-parse"]});
