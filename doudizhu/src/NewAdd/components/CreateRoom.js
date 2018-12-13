/**
 * Created by brucexu on 17/10/30.
 */
 var CreateRoom=function(){

    this.createRoom= function () {
        var self = this;
        var onCreate = function (ret) {

            if (ret.errcode !== 0) {
                WaitingConnectionLayer.stopLoading();
                //console.log(ret.errmsg);
                if (ret.errcode == 2222) {
                    AlertWindow.show("钻石不足，创建房间失败!");
                }
                else {
                    AlertWindow.show("提示", "创建房间失败,错误码:" + ret.errcode);
                }
            }
            else { //走到这里，就已经enter房间了，创建房间之后接着进入
                /*
                 *var ret = {//从服务端返回
                 roomid:roomId,
                 ip:enterInfo.ip, //游戏服务器地址
                 port:enterInfo.port,//游戏服务器端口
                 token:enterInfo.token,
                 time:Date.now()
                 };
                 *
                 */
                WaitingConnectionLayer.stopLoading();
                //进入房间完毕，数据保存到了数据库
                //SOCKET连接,我觉得

                 cc.vv.gameNetMgr.connectGameServer(ret);
               // AlertWindow.show("创建房间成功!");



            }
        };

        var type = "ddz";
        var conf = {};
        conf.type = type;

        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            conf: JSON.stringify(conf)
        };
        console.log(data);
        WaitingConnectionLayer.show("正在创建房间...");
        /*
         * {
         roomid:roomId,
         ip:enterInfo.ip,
         port:enterInfo.port,
         token:enterInfo.token,
         time:Date.now()
         };
         *
         * */


        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
    }

}