var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require('../utils/http');
var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");
var tokenMgr = require("./tokenmgr");

var app = express();
var config = null;

var serverIp = "";

//测试
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get('/get_server_info',function(req,res){
	//服务器唯一表示
	var serverId = req.query.serverid;
	
	var sign = req.query.sign;
	console.log("服务器名字="+serverId);
	console.log(sign);
	
	if(serverId  != config.SERVER_ID || sign == null){
		http.send(res,1,"无效参数");
		return;
	}
    console.log("服务器信息对了");
	var md5 = crypto.md5(serverId + config.ROOM_PRI_KEY);
	if(md5 != sign){
		http.send(res,1,"sign check failed.");
		return;
	}
    //应该是获取落座信息，这个以后再看
	var locations = roomMgr.getUserLocations();
	var arr = [];
	for(var userId in locations){
		var roomId = locations[userId].roomId;
		arr.push(userId);
		arr.push(roomId);
	}
	http.send(res,0,"ok",{userroominfo:arr});
});

app.get('/create_room',function(req,res){
	var userId = parseInt(req.query.userid);
	var sign = req.query.sign;
	var gems = req.query.gems;
	var conf = req.query.conf//游戏玩法 血流成河，血战到底
	if(userId == null || sign == null || conf == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(userId + conf + gems + config.ROOM_PRI_KEY);
	if(md5 != req.query.sign){
		console.log("invalid reuqest.");
		http.send(res,1,"sign check failed.");
		return;
	}

	conf = JSON.parse(conf);

	/*
	 createRoom 选项同步问题
    - 随机生成房间号
    - 房间号查重，重复的话递归重新生成
    - 创建逻辑：初始化 roomInfo，roomInfo.seats，在数据库创建房间
	*/
	//CLIENT_PORT =10000
	//serverIp也就是本机地址
	//看端口
	console.log("roomMgr.createRoom 的端口号 clientPort="+config.CLIENT_PORT);
	roomMgr.createRoom(userId,conf,gems,serverIp,config.CLIENT_PORT,function(errcode,roomId){
		if(errcode != 0 || roomId == null){
			http.send(res,errcode,"create failed.");
			return;	
		}
		else{
			http.send(res,0,"ok",{roomid:roomId});			
		}
	});
});

app.get('/enter_room',function(req,res){
	 
	var userId = parseInt(req.query.userid);
	var name = req.query.name;
	var roomId = req.query.roomid;
	var sign = req.query.sign;
	if(userId == null || roomId == null || sign == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(userId + name + roomId + config.ROOM_PRI_KEY);
	console.log(req.query);
	console.log(md5);
	if(md5 != sign){
		http.send(res,2,"sign check failed.");
		return;
	}

	//安排玩家坐下
	//安排玩家在方位落座
	roomMgr.enterRoom(roomId,userId,name,function(ret){
		if(ret != 0){
			if(ret == 1){//房间满了
				http.send(res,4,"room is full.");
			}
			else if(ret == 2){
				http.send(res,3,"can't find room.");
			}	
			return;		
		}
		//生成随机token
		 console.log("生成随机token");
		var token = tokenMgr.createToken(userId,5000);
		http.send(res,0,"ok",{token:token});
	});
});

app.get('/ping',function(req,res){
	var sign = req.query.sign;
	var md5 = crypto.md5(config.ROOM_PRI_KEY);
	if(md5 != sign){
		return;
	}
	http.send(res,0,"pong");
});

app.get('/is_room_runing',function(req,res){
	var roomId = req.query.roomid;
	var sign = req.query.sign;
	if(roomId == null || sign == null){
		http.send(res,1,"invalid parameters");
		return;
	}

	var md5 = crypto.md5(roomId + config.ROOM_PRI_KEY);
	if(md5 != sign){
		http.send(res,2,"sign check failed.");
		return;
	}
	//不知道为啥屏蔽了，以后再看
	var roomInfo = roomMgr.getRoom(roomId);
	
	http.send(res,0,"ok",{runing:true});
});

var gameServerInfo = null;
var lastTickTime = 0;

//向大厅服定时心跳
function update(){
	if(lastTickTime + config.HTTP_TICK_TIME < Date.now()){
		lastTickTime = Date.now();
		//得到当前服务器的房间数
		gameServerInfo.load = roomMgr.getTotalRooms();
		
	
		//进行游戏服务器的注册
        /*
	    gameServerInfo = {
		id:config.SERVER_ID, // "001"
		
		clientip:config.CLIENT_IP,////请求过来的游戏服务器地址
		
		clientport:config.CLIENT_PORT, //10000 游戏服务器端口
		
		httpPort:config.HTTP_PORT, //暴露给大厅服的HTTP端口号 9003,大厅服请求游戏服的时候访问这个端口
		
		load:roomMgr.getTotalRooms(),
	  };
	 */

	   // hallserver  room_service.js
		http.get(config.HALL_IP,config.HALL_PORT,"/register_gs",gameServerInfo,function(ret,data){
			if(ret == true){
				if(data.errcode != 0){
					console.log(data.errmsg);
				}
				
				if(data.ip != null){
					serverIp = data.ip;//申请出来的游戏服务器地址，也就是本服务器地址
				}
			}
			else{
				//
				lastTickTime = 0;
			}
		});

		var mem = process.memoryUsage();
		var format = function(bytes) {  
              return (bytes/1024/1024).toFixed(2)+'MB';  
        }; 
		//console.log('Process: heapTotal '+format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
	}
}

exports.start = function($config){
   /*
        SERVER_ID:"001",
		
		//暴露给大厅服的HTTP端口号
		HTTP_PORT:9003,
		//HTTP TICK的间隔时间，用于向大厅服汇报情况
		HTTP_TICK_TIME:5000,
		//大厅服IP
		HALL_IP:LOCAL_IP,
		FOR_HALL_IP:LOCAL_IP,
		//大厅服端口
		HALL_PORT:HALL_ROOM_PORT,//9002
		//与大厅服协商好的通信加密KEY
		ROOM_PRI_KEY:ROOM_PRI_KEY,
		
		//暴露给客户端的接口
		CLIENT_IP:HALL_IP,//大厅地址ip
		CLIENT_PORT:10000,
   */
/*
   HALL_ROOM_PORT  9002    hallServer  room_service
   HALL_CLINET_PORT 9001   hallServer  client_service
  
   9000                    accountServer account_service

   9003                    majiangServer 

*/

	config = $config;

	//
	gameServerInfo = {
		id:config.SERVER_ID, // "001"
		
		clientip:config.CLIENT_IP,////大厅地址ip
		
		clientport:config.CLIENT_PORT, //10000 游戏服务器端口
		
		httpPort:config.HTTP_PORT, //暴露给大厅服的HTTP端口号 9003,大厅服请求游戏服的时候访问这个端口
		
		load:roomMgr.getTotalRooms(),
	};

	setInterval(update,1000);
	
	//当前游戏服务器启动一个服务，用于监听大厅服务器对她的http请求,FOR_HALL_IP 为localhost，
	//所以启动本机的监听
	console.log("监听地址为:"+config.HTTP_PORT+":"+config.FOR_HALL_IP);
	app.listen(config.HTTP_PORT,config.FOR_HALL_IP);//9003  localhost(在本地)
	
	
	console.log("game server is listening on " + config.FOR_HALL_IP + ":" + config.HTTP_PORT);
};