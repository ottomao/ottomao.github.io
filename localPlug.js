//storage key ：mod_ + 模块名称
//inspired : https://github.com/QzoneTouch/commonWidget/blob/master/seajs-plugin/src/seajs-localcache.js

(function (S){
    
    if(!localStorage) return;
    
    S.config("afterRegister",function(runtime, name, fn, config){
        var storageKey   = "mod_" + name;   //TODO : check version,update
        if( localStorage.getItem(storageKey)) return;

        var storeContent = {};
        storeContent.fn  = fn.toString();
        if (config) storeContent.config = config;
        localStorage.setItem(storageKey,JSON.stringify(storeContent)); //TODO : if set failed
    });


    for(key in localStorage){
        //遍历所有mod_项,注册
        if(!key.indexOf("mod_") == 0) continue;
        try{
            var modName = key.substr(4);
            var content = JSON.parse(localStorage.getItem(key));
            var fn,config;

            config = content.config;
            if(S.UA.ie == 8){  //IE8 下 eval返回为undefined
                fn = eval( "(function(){ return " + content.fn + " })()" );
            }else{
                fn = eval( "(" + content.fn + ")" );
            }

            if(! S.isFunction(fn)){
                throw({msg : "fn in localStorage is damaged"});
            }
            
            //注册模块
            S.add(modName , fn , config);
            S.log("load in localStorage : " + modName);            

        }catch(e){
            e.msg && S.log(e.msg);
            S.log("fail to load from localStorage:" + key);
        }

    }
})(KISSY);