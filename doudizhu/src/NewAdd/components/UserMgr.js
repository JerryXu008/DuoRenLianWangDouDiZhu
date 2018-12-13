/**
 * Created by brucexu on 17/10/30.
 */

function createRole(){
    var names = [
        "高富帅",
        "矮穷矬",
        "企业家",
        "臭屌丝",
    ];

    var names2 = [
        "老徐",
        "大头",
        "糖果",
        "先锋",

    ];
    var idx = Math.floor(Math.random() * (names.length - 1));
    var idx2 = Math.floor(Math.random() * (names2.length - 1));
    return names[idx] + names2[idx2];
}



var UserMgr= function (){
        var self=this;
        this.account=null;
        this.userId=null;
        this.userName=null;
        this.lv=0;
        this.exp=0;
        this.coins=0;
        this.gems=0;
        this.sign=0;
        this.ip="";
        this.sex=0;
        this.roomData=null;
        this.oldRoomId=null;

        this.guestAuth=function(){
        var account = cc.args["account"];
        if(account == null){
            account = cc.sys.localStorage.getItem("account");
        }

        if(account == null){
            account = Date.now();
            cc.sys.localStorage.setItem("account",account);
        }

        cc.vv.http.sendRequest("/guest",{account:account},this.onAuth);

    };

    this.getImgByName=function(name){
        if(name.indexOf("老徐")>0){
            return "res/head_8.png"
        }
        else if(name.indexOf("大头")>0){
            return "res/head_1.png";
        }
        else if(name.indexOf("糖果")>0){
            return "res/head_2.png";
        }
        else if(name.indexOf("先锋")>0){
            return "res/head_3.png";
        }
        else return "";

    };

    this.onAuth=function(ret){

        /*
         sign=

         account=guest_1503631514627
         req.ip=::ffff:192.168.246.158
         config.ACCOUNT_PRI_KEY=^&*#$%()@
         md5加密之后=202201e1e6df06a89ef2463044a40bcc

         */
        var self = cc.vv.userMgr;
        if(ret.errcode !== 0){
            console.log(ret.errmsg);
        }
        else{
            self.account = ret.account;
            self.sign = ret.sign;
            cc.vv.http.url = "http://" + cc.vv.SI.hall;

            self.login();
        }
    };


    this.login=function(){
        var self = this;
        var onLogin = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(!ret.userid){ //用户id不存在，进入创建角色
                     //创建角色
                    var name= createRole();
                    var headImg=self.getImgByName(name)
                   // alert(headImg+"fff");
                    self.create(name,headImg);


                }
                else{
                    console.log(ret);
                    self.account = ret.account;
                    self.userId = ret.userid;
                    self.userName = ret.name;
                    self.lv = ret.lv;
                    self.exp = ret.exp;
                    self.coins = ret.coins;
                    self.gems = ret.gems;
                    self.roomData = ret.roomid;//roomid存于Users表里面的字段
                    self.sex = ret.sex;
                    self.ip = ret.ip;
                    WaitingConnectionLayer.stopLoading();

                    cc.director.runScene(new HallScene());

                }
            }
        };

        WaitingConnectionLayer.showLoading("加载中...",cc.director.getRunningScene());


        //大厅服务
        cc.vv.http.sendRequest("/login",{account:this.account,sign:this.sign},onLogin);
    };


    this.create=function(name,headImg){
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                self.login();
            }
        };

        var data = {
            account:this.account,
            sign:this.sign,
            name:name,
            headImg:headImg
        };
        cc.vv.http.sendRequest("/create_user",data,onCreate);
    },

    this.enterRoom=function(roomId,callback){
        var self = this;
        var onEnter = function(ret){
            if(ret.errcode !== 0){
                /*
                这种情况：
                比如游戏服务没有开启，那么大厅服务RoomService尝试进入后失败，返回-1，客户端UI停在 正在进入房间
                5秒后尝试再次进如，游戏服务恢复后，进入成功
                 */
                if(ret.errcode == -1){
                    setTimeout(function(){
                        self.enterRoom(roomId,callback);
                    },5000);
                }
                else{
                    WaitingConnectionLayer.stopLoading();

                    if(callback != null){
                        callback(ret);
                    }
                }
            }
            else{
                WaitingConnectionLayer.stopLoading();
                if(callback != null){
                    callback(ret);
                }
                /*
                 *var ret = {//从服务端返回
                 roomid:roomId,
                 ip:enterInfo.ip,
                 port:enterInfo.port,
                 token:enterInfo.token,
                 time:Date.now()
                 };
                 *
                 **/

                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            roomid:roomId
        };

        WaitingConnectionLayer.showLoading("正在进入房间 " + roomId,cc.director.getRunningScene());

        cc.vv.http.sendRequest("/enter_private_room",data,onEnter);
    },
    this.getHistoryList=function(callback){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.history);
                if(callback != null){
                    callback(ret.history);
                }
            }
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_history_list",data,onGet);
    },
    this.getGamesOfRoom=function(uuid,callback){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.data);
                callback(ret.data);
            }
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            uuid:uuid,
        };
        cc.vv.http.sendRequest("/get_games_of_room",data,onGet);
    },

    this.getDetailOfGam=function(uuid,index,callback){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.data);
                callback(ret.data);
            }
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            uuid:uuid,
            index:index,
        };
        cc.vv.http.sendRequest("/get_detail_of_game",data,onGet);
    }

}