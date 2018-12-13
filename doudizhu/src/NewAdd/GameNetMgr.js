/**
 * Created by brucexu on 17/10/30.
 */
var GameNetMgr=function(){
        this.dataEventHandler=null;//事件传送器
        this.roomId=null;
        this.maxNumOfGames=0;
        this.numOfGames=0;//当前第几局
        this.numOfMJ=0;//当前剩余总牌数
        this.seatIndex=-1;//当前玩家在服务端中的index
        this.seats=[];//seats所有信息数组


        this.currentPerson=-1;//当前轮次
        this.haveDZ=false;

        this.boss=-1;//当前地主

        this.paiArray=[];//当前牌面上最新出的牌
        this.lastPerson=-1;//上一个 出牌的人索引
        this.chupai=-1;//当前出的牌


        this.gamestate=-3;//游戏状态 //-3 游戏没有开始  -2 游戏刚刚开始   -1表示正在进行叫分操作，0表示出牌过程中  1表示出牌结束
        this.isOver=false;//
        this.dissoveData=null;//
        this.holdsCountArr=null;

        this.currentScore=0;//当前分数
        this.currentMultiple=1;//当前倍数

        this.currentCircle=0;

        this.dzJiaofen=[true,true,true];
        this.threePokes=[3];

        this.pokesFlag=[20];

        this.bossCircle=0;

        this.timeLeft=0;//叫分和出牌的倒计时




    this.dispatchEvent=function(event,data){

        if(this.dataEventHandler){
           // data=data.getUserData();
            this.dataEventHandler.emit(event,data);

        }
    },
        this.getSeatIndexByID=function(userId){
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            if(s.userid == userId){
                return i;
            }
        }
        return -1;
    };

    this.isOwner=function(){
        return this.seatIndex == 0;
    },

    this.getSeatByID=function(userId){
        var seatIndex = this.getSeatIndexByID(userId);
        var seat = this.seats[seatIndex];
        return seat;
    },

    this.getSelfData=function(){
        return this.seats[this.seatIndex];
    },

    this.getLocalIndex=function(index){
        var ret = (index - this.seatIndex + 3) % 3;
        return ret;
    },


        this.initHandlers=function(){

        var self = this;

        //登录成功或者失败之后的反馈
        cc.vv.net.addHandler("login_result",function(data){
            // console.log(data);
            /*
             var ret = {
             errcode:0,
             errmsg:"ok",
             data:{
             roomid:roomInfo.id,
             conf:roomInfo.conf,
             numofgames:roomInfo.numOfGames,//第几局游戏
             seats:seats
             }
             };
             seat[0]:userid,ip,score,name,online,ready,index
             */


            if(data.errcode === 0){
                var data = data.data;
                self.roomId = data.roomid;
                self.conf = data.conf;
               // self.maxNumOfGames = data.conf.maxGames;
               // self.numOfGames = data.numofgames;
                self.seats = data.seats;//保存3个座位的详细信息

                //当前登录用户的座位索引
                self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);

                self.isOver = false;
            }
            else{
                console.log(data.errmsg);
            }

            self.dispatchEvent('login_result');
        });
            //叫分和出牌倒计时
            cc.vv.net.addHandler('game_timeLeft_push',function(data){
                 self.timeLeft=data;
                self.dispatchEvent('game_timeLeft',data);
            });


            //游戏已经开始，重新进入后的信息推送
            cc.vv.net.addHandler("game_sync_push",function(data){
                console.log("game_sync_push");
              //  console.log(data);
              //  -2 游戏刚刚开始   -1表示正在进行叫分操作，0表示出牌过程中  1表示出牌结束
                self.gamestate = data.state;

                self.currentPerson = data.turn;//当前轮次
                self.boss=data.boss;

                self.paiArray = data.chuPai;//当前出得牌
                self.lastPerson=data.lastPerson;
                self.threePokes=data.threePokes;

                self.currentScore=data.currentScore;//当前分数
                self.currentMultiple=data.currentMultiple;//当前倍数


                if(self.gamestate==-2){

                }
                else if(self.gamestate==-1){
                    self.haveDZ=false;
                }
                else if(self.gamestate==0){
                    self.haveDZ=true;
                }
                else if(self.gamestate==1){

                }

                self.paiArray=data.paiArray;

                self.holdsCountArr=data.holdsCountArr;

                for(var i = 0; i < 3; ++i){
                    var seat = self.seats[i];
                    var sd = data.seats[i];
                    seat.holds = sd.holds;
                    seat.folds = sd.folds;

                    if(i == self.seatIndex){

                    }
                }
                if(data.dr){
                    self.dissoveData=data.dr;
                }
                else{
                    self.dissoveData=null;
                }
                self.timeLeft=data.timeLeftSeconds;

                self.dispatchEvent('game_sync');
            });



        //新成员加入房间，通知房间的其他人
        cc.vv.net.addHandler("new_user_comes_push",function(data){
            //console.log(data);
            var seatIndex = data.seatIndex;
            var needCheckIp = false;

            if(self.seats[seatIndex].userid > 0){//已经有信息了，更新成最新服务端返回的
                self.seats[seatIndex].online = true;
                if(self.seats[seatIndex].ip != data.ip){
                    self.seats[seatIndex].ip = data.ip;
                    needCheckIp = true;
                }
            }
            else{
                data.online = true;
                self.seats[seatIndex] = data;
                needCheckIp = true;
            }

            //新成员加入，更新对应座位信息
            self.dispatchEvent('new_user',self.seats[seatIndex]);
            //检查玩家之间有没有同一个ip的
            if(needCheckIp){
                self.dispatchEvent('check_ip',self.seats[seatIndex]);
            }
        });
            cc.vv.net.addHandler("user_state_push",function(data){
                //console.log(data);
                var userId = data.userid;
                //获取服务器的userid对于的座位信息
                var seat = self.getSeatByID(userId);
                seat.online = data.online;
                self.dispatchEvent('user_state_changed',seat);
            });
            //玩家再一次准备好了
            cc.vv.net.addHandler("user_ready_push",function(data){
                //console.log(data);
                var userId = data.userid;
                var seat = self.getSeatByID(userId);
                seat.ready = data.ready;
                self.dispatchEvent('user_state_changed',seat);
            });

            //通知玩家手牌
            cc.vv.net.addHandler("game_holds_push",function(data){

                var seat = self.seats[self.seatIndex];
                //只知道自己的手牌，保存到座位信息类里面
                seat.holds = data;
                //初始化其余的数组，之后要用
                for(var i = 0; i < self.seats.length; ++i){
                    var s = self.seats[i];
                    if(s.folds == null){//打出的牌
                        s.folds = [];
                    }

                    s.ready = false;
                }
                self.dispatchEvent('game_holds');
            });
            //通知每个玩家的剩余牌数
            cc.vv.net.addHandler("game_holds_EveryCount",function(data){

                self.holdsCountArr = data;
                self.dispatchEvent('game_holds_count',data);
            });

            cc.vv.net.addHandler("game_currentCircle_push",function(data){

                self.currentCircle = data;
                self.dispatchEvent('game_currentCircle',data);
            });
            //出牌之后的通知
            cc.vv.net.addHandler("game_chupai_notify_push",function(data){

                var userId = data.userId;
                var paiArray = data.paiArray;
                var si = self.getSeatIndexByID(userId);
                self.paiArray=paiArray;

                self.doChupai(si,paiArray);


            });


            //cc.vv.net.addHandler('game_pokesFlag_push',function(data){
            //     this.pokesFlag=data;
            //
            //});
            //玩家点击不要之后的广播通知
            cc.vv.net.addHandler('game_buyaoNotis_push',function(data){

                self.dispatchEvent('game_buyaoNotis',data);
            });
            //一圈结束通知
            cc.vv.net.addHandler('game_CircleFinish_push',function(data){
                self.currentCircle=0;
                self.currentPerson=data;
                self.dispatchEvent('game_CircleFinish',data);
            });
            cc.vv.net.addHandler("game_over_push",function(data){

                self.gamestate = 1;//游戏状态结束
                self.currentMultiple=data[1];
                self.currentScore=data[0];

                self.isOver = true;
                self.roomId=null;

                self.dispatchEvent('game_gameOver',data);
                self.reset();

                for(var i = 0; i <  self.seats.length; ++i){
                    self.dispatchEvent('user_state_changed',self.seats[i]);
                }
            });

            cc.vv.net.addHandler("game_allLeftPokes_push",function(data){
                for(var i=0;i<data.length;i++){
                    self.seats[i].holds=data[i];
                }
                self.dispatchEvent('game_allLeftPokes',data);

            });



            //玩家再一次准备好了
            cc.vv.net.addHandler("user_ready_push",function(data){

                var userId = data.userid;
                var seat = self.getSeatByID(userId);
                seat.ready = data.ready;
                self.dispatchEvent('user_state_changed',seat);
            });


            cc.vv.net.addHandler("game_begin_push",function(data){

                self.gamestate = -2;//游戏状态设置为游戏开始
                self.dispatchEvent('game_begin');//GameMain.js 和 Folds.js, MJRoom.js,TimePointer.js
            });



        //服务端登录逻辑处理完毕之后发送的通知
        cc.vv.net.addHandler("login_finished",function(data){
            //登录逻辑处理完了，跳到游戏页面
            //断线重连也需要重新加载mjGame场景
            WaitingConnectionLayer.stopLoading();
            cc.director.runScene(new GameMainScene());

            setTimeout(function(){
                cc.vv.net.ping()
                self.dispatchEvent("login_finished");//在Reconnect组件中,登陆之后的后续操作
            },1000);


        });
            cc.vv.net.addHandler("game_num_push",function(data){
                self.numOfGames = data;
                self.dispatchEvent('game_num',data);
            });
            cc.vv.net.addHandler("game_currentMultiple_push",function(data){
                self.currentMultiple = data;
                self.dispatchEvent('game_currentMultiple',data);
            });
            cc.vv.net.addHandler("game_currentScore_push",function(data){
                self.currentScore = data;
                self.dispatchEvent('game_currentScore',data);
            });

            cc.vv.net.addHandler("game_chupaiReady_push",function(data){
                self.currentPerson = data;

                self.dispatchEvent('game_chupaiReady',data);

                // game.currentPerson=
            });


            //叫地主
            cc.vv.net.addHandler("game_jiaodizhu_push",function(data){
                self.currentPerson = data;
                self.gamestate=-1;
                self.dispatchEvent('game_jiaodizhu',data);

               // game.currentPerson=
            });
               //叫地主后的结果反馈
            cc.vv.net.addHandler("game_jiaofen_notify_push",function(data){
                self.dispatchEvent('game_jiaofen_notify',data);
            });
              // 确定地主之后 的反馈

            cc.vv.net.addHandler("game_setDiZhu_push",function(data){

                self.haveDZ=true;//  确定地主了
                self.boss=data;
                self.currentPerson=self.boss;


                self.dispatchEvent('game_setDiZhu',{seatIndex:self.boss});//参数为 地主的seatIndex
            });
            //显示三张底牌
            cc.vv.net.addHandler("game_showthreepoke_push",function(data){

                self.threePokes=data;


                var seat= self.seats[self.boss];

                 if(seat.holds&&seat.holds.length==17){
                     seat.holds.push(self.threePokes[0]);
                     seat.holds.push(self.threePokes[1]);
                     seat.holds.push(self.threePokes[2]);
                }

                self.dispatchEvent('game_showthreepoke');
            });

            /* 退出房间和解散房间系列*/
            cc.vv.net.addHandler("exit_result",function(data){
                self.roomId = null;
                self.currentPerson = -1;

                self.seats = null;
            });

            cc.vv.net.addHandler("exit_notify_push",function(data){
                var userId = data;
                var s = self.getSeatByID(userId);
                if(s != null){
                    s.userid = 0;
                    s.name = "";
                    self.dispatchEvent("user_state_changed",s);
                }
            });


            cc.vv.net.addHandler("dispress_push",function(data){
                self.roomId = null;
                self.currentPerson = -1;


                self.seats = null;
            });

            //游戏进行中申请解散房间
            cc.vv.net.addHandler("dissolve_notice_push",function(data){
                console.log("dissolve_notice_push");
                console.log(data);
                self.dissoveData = data;
                self.dispatchEvent("dissolve_notice",data);
            });

            cc.vv.net.addHandler("dissolve_cancel_push",function(data){
                self.dissoveData = null;
                self.dispatchEvent("dissolve_cancel",data);
            });




        cc.vv.net.addHandler("disconnect",function(data){
            if(self.roomId == null){ //exit_result 事件会吧roomId=nullalert(33);
                WaitingConnectionLayer.show('正在返回游戏大厅');
                cc.director.runScene(new HallScene());
            }
            else{//roomId不为null就退出，说明不是正常情况下的退出,比如网络掉线
                if(self.isOver == false){//isOVer为true是游戏玩完了，为false为在游戏过程中或者进入游戏，然后等待游戏开始的状态

                    cc.vv.userMgr.oldRoomId = self.roomId;//保存断开之前的房间号
                    // alert("断开了");
                    self.dispatchEvent("disconnect");    //通知到ReConnect组件
                }
                else{
                    self.roomId = null;

                }
            }
        });



    };

    this.doChupai=function(seatIndex,paiArray){
       // this.chupai = paiArray;//保存全局当前出
        var seatData = this.seats[seatIndex];
        if(seatData.holds){ //自己的holds，别人的holds永远为null

            for(var i=0;i<paiArray.length;i++){

            var pai=paiArray[i];
            var idx = seatData.holds.indexOf(pai);
            seatData.holds.splice(idx,1);
        }
        }

        this.dispatchEvent('game_chupai_notify',{seatData:seatData,paiArray:paiArray});
    };

    this.getSeatIndexByID=function(userId){
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            if(s.userid == userId){
                return i;
            }
        }
        return -1;
    },
        this.dispatchEven=function(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }
    },




    this.connectGameServer=function(data){
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);

        var self = this;

        var onConnectOK = function(){
            console.log("socket连接成功");

            var sd = {
                token:data.token,//进入房间后随机生成的
                roomid:data.roomid,
                time:data.time,
                sign:data.sign,
            };
            //  alert("goLOgin");
            cc.vv.net.send("login",sd);//socket连接成功之后登录
        };

        var onConnectFailed = function(){
            console.log("failed.");
            WaitingConnectionLayer.stopLoading();
        };
        WaitingConnectionLayer.show("正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    };
    this.reset=function(){


        this.currentPerson=-1;//当前轮次
        this.haveDZ=false;
        this.boss=-1;//当前地主
        this.gamestate=-3;//游戏状态 //-3 游戏没有开始  -2 游戏刚刚开始   -1表示正在进行叫分操作，0表示出牌过程中  1表示出牌结束

        this.holdsCountArr=null;

        this.currentScore=0;//当前分数
        this.currentMultiple=1;//当前倍数

        this.currentCircle=0;
        this.bossCircle=0;

        this.dzJiaofen=[true,true,true];
        this.threePokes=[3];
        this.pokesFlag=[20];

        for(var i = 0; i < this.seats.length; ++i){

            this.seats[i].ready = false;

        }

    }

}