YUI.add("gallery-yql",function(C){if(!YUI.yql){YUI.yql={};}var B="http:/"+"/query.yahooapis.com/v1/public/yql?",A=function(F,G,E,D){A.superclass.constructor.apply(this);this._query(F,G,E,D);};C.extend(A,C.EventTarget,{_cb:null,_stamp:null,_receiver:function(D){if(D.query){this.fire("query",D.query);}if(D.error){this.fire("error",D.error);}if(this._cb){this._cb(D);}delete YUI.yql[this._stamp];},_query:function(I,J,H,G){var F=C.stamp({}),D="",E;F=F.replace(/-/g,"_");this._stamp=F;this._cb=J;YUI.yql[F]=C.bind(this._receiver,this);if(!H){H={};}H.q=I;H.format="json";H.callback="YUI.yql."+F;if(!H.env){H.env="http:/"+"/datatables.org/alltables.env";}C.each(H,function(L,K){D+=K+"="+encodeURIComponent(L)+"&";});E=B+D;if(!G){G={};}if(G.secure){E=E.replace(/http/,"https");}G.autopurge=true;G.context=this;G.onTimeout=function(K){this.fire("timeout",K);if(this._cb){this._cb(K);this._cb=null;}};C.Get.script(E,G);return this;}});C.yql=A;},"@VERSION@",{requires:["get","event-custom"]});