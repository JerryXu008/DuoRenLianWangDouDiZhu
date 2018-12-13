/**
 * Created by brucexu on 17/10/30.
 */
if(window.io == null){

    window.io = require("socket-io");
}

var GlobalNet  = {


        ip:"",
        sio:null,
        isPinging:false,
        fnDisconnect:null,
        handlers:{

        },
        addHandler:function(event,fn){
            if(this.handlers[event]){
                console.log("event:" + event + "' handler has been registered.");
                return;
            }

            var handler = function(data){
                //console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
                if(event != "disconnect" && typeof(data) == "string"){
                    data = JSON.parse(data);
                }
                fn(data);
            };

            this.handlers[event] = handler;
            if(this.sio){
                console.log("register:function " + event);
                this.sio.on(event,handler);
            }
        },


        connect:function(fnConnect,fnError) {
            var self = this;

            var opts = {
                'reconnection':false,
                'force new connection': true,
                'transports':['websocket', 'polling']
            }
            console.log("开始连接。。。");
            //alert(window.io);

            this.sio = window.io.connect(this.ip,opts);
            //alert(this.sio);
            console.log("连接好了。。");
            this.sio.on('reconnect',function(){
                console.log('reconnection');
            });
            this.sio.on('connect',function(data){
                console.log("客户端 连接之后的反馈＝"+data);//DATA没有数据
                self.sio.connected = true;
                fnConnect(data);
            });

            this.sio.on('disconnect',function(data){
                console.log("disconnect");
                self.sio.connected = false;
                self.close();
            });

            this.sio.on('connect_failed',function (){
                console.log('connect_failed');
            });
            //把方法都注册到socket中
            for(var key in this.handlers){
                var value = this.handlers[key];
                if(typeof(value) == "function"){
                    if(key == 'disconnect'){
                        this.fnDisconnect = value;
                    }
                    else{
                        console.log("register:function " + key);
                        this.sio.on(key,value);
                    }
                }
            }
            //开启心跳检测
            this.startHearbeat();
        },

        /*
         * 心跳检测步骤：
         1客户端每隔一个时间间隔发生一个探测包给服务器
         2客户端发包时启动一个超时定时器
         3服务器端接收到检测包，应该回应一个包
         4如果客户机收到服务器的应答包，则说明服务器正常，删除超时定时器
         5如果客户端的超时定时器超时，依然没有收到应答包，则说明服务器挂了
         *
         * */
        startHearbeat:function(){
            //从服务端返回的心跳包回执
            this.sio.on('game_pong',function(){
              //  console.log('game_pong');
                self.lastRecieveTime = Date.now();
                self.delayMS = self.lastRecieveTime - self.lastSendTime;
                console.log(self.delayMS);
            });
            this.lastRecieveTime = Date.now();
            var self = this;
            // console.log(1);
            if(!self.isPinging){
                self.isPinging = true;

                /* Event triggered when game hide to background */

                //cc.game.on(cc.game.EVENT_HIDE,function(){
                //    console.log("游戏退到后台");
                //    self.ping();
                //});

                // 每5秒向服务端发一次心跳包
                setInterval(function(){
                    if(self.sio){
                        self.ping();
                    }
                }.bind(this),5000);

                //10秒为超时时间，如果一次心跳超过10秒，那么说明与服务端断开了
                setInterval(function(){
                    if(self.sio){
                        if(Date.now() - self.lastRecieveTime > 10000){
                            self.close();
                        }
                    }
                }.bind(this),500);
            }
        },


        send:function(event,data){
            if(this.sio.connected){
                if(data != null && (typeof(data) == "object")){
                    data = JSON.stringify(data);
                    //console.log(data);
                }
                this.sio.emit(event,data);
            }
        },

        ping:function(){
            if(this.sio){
                this.lastSendTime = Date.now();
                this.send('game_ping');
            }
        },

        close:function(){
            console.log('close');
            this.delayMS = null;
            if(this.sio && this.sio.connected){
                this.sio.connected = false;
                this.sio.disconnect();
            }
            this.sio = null;
            if(this.fnDisconnect){
                this.fnDisconnect();
                this.fnDisconnect = null;
            }
        },

        test:function(fnResult){
            var xhr = null;
            var fn = function(ret){
                fnResult(ret.isonline);
                xhr = null;
            }

            var arr = this.ip.split(':');
            var data = {
                account:cc.vv.userMgr.account,
                sign:cc.vv.userMgr.sign,
                ip:arr[0],
                port:arr[1],
            }
            xhr = cc.vv.http.sendRequest("/is_server_online",data,fn);
            setTimeout(function(){
                if(xhr){
                    xhr.abort();
                    fnResult(false);
                }
            },1500);
            /*
             var opts = {
             'reconnection':false,
             'force new connection': true,
             'transports':['websocket', 'polling']
             }
             var self = this;
             this.testsio = window.io.connect(this.ip,opts);
             this.testsio.on('connect',function(){
             console.log('connect');
             self.testsio.close();
             self.testsio = null;
             fnResult(true);
             });
             this.testsio.on('connect_error',function(){
             console.log('connect_failed');
             self.testsio = null;
             fnResult(false);
             });
             */
        }
    };
