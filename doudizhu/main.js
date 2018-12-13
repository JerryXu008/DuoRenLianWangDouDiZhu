



function requestServer(){

    var self = this;
    var onGetVersion = function(ret){
        if(ret.version == null){
            console.log("error.");
        }
        else{

            cc.vv.SI = ret;
            if(ret.version != cc.VERSION){//版本检测
                return;
            }
            else{

                cc.LoaderScene.preload(g_resources, function () {

                    StringUtil.LoadString(function(){

                        cc.director.runScene(new GameIndexScene());

                    })


                }, this);
            }
        }
    };

    var xhr = null;
    var complete = false;
    var fnRequest = function(){

        xhr = cc.vv.http.sendRequest("/get_serverinfo",null,function(ret){
            xhr = null;
            complete = true;
            onGetVersion(ret);
        });

    }
    fnRequest();
}


cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources


    //初始化全局数据
    var appstart= new AppStartComponent();
    //
   requestServer();

    // cc.LoaderScene.preload(g_resources, function () {
    //
    //    StringUtil.LoadString(function(){
    //
    //        cc.director.runScene(new GameMainScene());
    //
    //    })
    //
    //
    //}, this);
    //console.log( dumpObj(cc.Sprite ));



    //自定义事件test


               //function callBack1(event){
               //
               //alert("111111");
               //
               //};
               //
               //function callBack2(event){
               //
               //alert("22222");
               //
               //
               //};





    //var listen= new cc.EventListener(
    //      cc.EventListener.CUSTOM,
    //    "game_timeright",
    //     callBack2
    //);
    //
    //           cc.eventManager.addListener(listen,1);
    //
    //
    //
    //          var listen= new cc.EventListener( cc.EventListener.CUSTOM,
    //               "game_timeright",
    //               callBack1);
    //           cc.eventManager.addListener(listen,3);

    //
    //
    //
    //          setTimeout(function(){
    //              var event =  new cc.EventCustom("game_timeright");
    //           //event.setUserData({test:'111'});
    //
    //           cc.eventManager.dispatchEvent(event);
    //
    //
    //           },1000);



};

cc.game.run();


//Class = function(){
//
//};
//Class.extend = function (prop) {
//    var _super = this.prototype;
//
//    // Instantiate a base class (but only create the instance,
//    // don't run the init constructor)
//    initializing = true;
//    var prototype = new this();//Layer
//    initializing = false;
//
//    fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
//
//    // Copy the properties over onto the new prototype
//    for (var name in prop) {
//
//
//        // Check if we're overwriting an existing function
//        prototype[name] = typeof prop[name] == "function" &&
//        typeof _super[name] == "function"
//        && fnTest.test(prop[name])
//         ?
//
//            (function (name, fn) {
//                return function () {
//                    var tmp = this._super;
//
//                    // Add a new ._super() method that is the same method
//                    // but on the super-class
//                    this._super = _super[name];
//
//                    // The method only need to be bound temporarily, so we
//                    // remove it when we're done executing
//                    var ret = fn.apply(this, arguments);
//                    this._super = tmp;
//
//                    return ret;
//                };
//            })(name, prop[name]) :
//
//            prop[name];//不是函数，只是覆盖
//    }
//
//    // The dummy class constructor
//    function Class() {
//        // All construction is actually done in the init method
//        if (!initializing && this.ctor)
//            this.ctor.apply(this, arguments);
//    }
//
//    // Populate our constructed prototype object
//    Class.prototype = prototype;
//
//    // Enforce the constructor to be what we expect
//    Class.prototype.constructor = Class;
//
//    // And make this class extendable
//    Class.extend = arguments.callee;//callee返回正在执行的函数本身的引用，它是arguments的一个属性
//
//    //alert( Class.extend);
//
//    return Class;
//};
//
//// var Layer= Class.extend({
////     eat:function(){
////          alert("吃鸭");
////     }
////
////});
////
//var Layer=function(){
//
//}
//Layer.prototype.eat=function(){
//    alert("吃鸭");
//}
//
//Layer.extend = Class.extend;
//Sprite=Layer.extend({
//    eat:function(){
//        this._super();
//        alert("吃鸡");
//}
//});
//var ff= new Sprite();
//ff.eat();
//
////
////Sprite=Layer.extend({
////    drink: function () {
////        alert("drink");
////    }
////});
////
////
////var Test=Sprite.extend({
////    ctor:function(){
////        alert(111);
////    },
////    go:function(){
////
////        alert("gogo");
////    }
////});
////var tt=new Test();
//////(tt.eat());
//////tt.drink();
//////tt.go();
//
//
//
//
////function __typeof__(objClass)
////{
////    if ( objClass && objClass.constructor )
////    {
////        var strFun = objClass.constructor.toString();
////        var className = strFun.substr(0, strFun.indexOf('('));
////        className = className.replace('function', '');
////        return className.replace(/(^\s*)|(\s*$)/ig, '');
////    }
////    return typeof(objClass);
////}
////
////function dumpObj(obj, depth) {
////
////    if (depth == null || depth == undefined) {
////        depth = 1;
////    }
////    if (typeof obj != "function" && typeof obj != "object") {
////        return '('+__typeof__(obj)+')' + obj.toString();
////    }
////
////    var tab = '    ';
////    var tabs = '';
////    for (var i = 0; i<depth-1; i++) {
////        tabs+=tab;
////    }
////
////    var output = '('+__typeof__(obj)+') {\n';
////
////    var names = Object.getOwnPropertyNames(obj);
////    for (index in names) {
////        var propertyName = names[index];
////
////        try {
////            var property = obj[propertyName];
////            output += (tabs+tab+propertyName + ' = ' + '('+__typeof__(property)+')' +property.toString()+ '\n');
////        }catch(err) {
////            output += (tabs+tab+propertyName + ' = ' + '('+__typeof__(property)+')' + '\n');
////        }
////    }
////
////    var prt = obj.__proto__;
////    if (typeof obj == "function") {
////        prt = obj.prototype;
////    }
////
////    if (prt!=null && prt!= undefined) {
////        output += (tabs+tab+'proto = ' + dumpObj(prt, depth+1) + '\n');
////    }else {
////        output += (tabs+tab+'proto = '+prt+' \n');
////    }
////
////    output+=(tabs+'}');
////    return output;
////}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//














