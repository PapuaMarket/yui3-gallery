YUI.add("gallery-model-list-union",function(a){(function(g){var b=g.Array,e=g.ModelList,f=b.invoke,c=g.Lang.isString,d=b.unnest;g.ModelList.union=function(){var i,j=d(arguments),k=j.shift(),h=function(){return i.reset(d(f(j,"toArray")));};if(c(k)){k=g.namespace(k);}else{if(k instanceof e){j.unshift(k);k=k.constructor;}}i=new k();f(j,"after",["add","remove","reset"],h);return h();};}(a));},"gallery-2012.02.01-21-35",{requires:["gallery-array-unnest","model-list"],skinnable:false});