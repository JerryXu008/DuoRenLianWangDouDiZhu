/**
 * Created by brucexu on 17/10/30.
 */
function urlParse(){
    var params = {};
    if(window.location == null){
        return params;
    }
    var name,value;
    var str=window.location.href; //取得整个地址栏
    var num=str.indexOf("?")
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            params[name]=value;
        }
    }
    return params;
}

var AppStartComponent= function () {

    this.initMgr=function(){
        cc.vv = {};
        cc.vv.http=HTTP;
        cc.vv.global = Global;
        cc.vv.net = GlobalNet;


        cc.vv.userMgr=new UserMgr();

        cc.vv.gameNetMgr =new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();
        cc.vv.wc=WaitingConnectionLayer;
        cc.vv.alert=AlertWindow;

        cc.args = urlParse();
    }

    this.initMgr();

    //AlertWindow.show("f");
}

