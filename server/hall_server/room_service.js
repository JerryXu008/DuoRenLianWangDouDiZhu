var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require('../utils/http');
var app = express();

var hallIp = null;
var config = null;
var rooms = {};
var serverMap = {};
var roomIdOfUsers = {};

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
//从游戏服务器请求过来的，用于注册游戏服务器，从而进行分配

 /*
	    gameServerInfo = {
		id:config.SERVER_ID, // "001"
		
		clientip:config.CLIENT_IP,////大厅地址ip
		
		clientport:config.CLIENT_PORT, //10000 游戏服务器端口
		
		httpPort:config.HTTP_PORT, //暴露给大厅服的HTTP端口号 9003,大厅服请求游戏服的时候访问这个端口
		
		load:roomMgr.getTotalRooms(),
	  };
	 */

app.get('/register_gs',function(req,res){
	//console.log("游戏服务器向大厅服务器注册服务器开始...");
	var ip = req.ip;//游戏服务器ip地址
    //console.log("游戏服务器请求ip="+ip);
	var clientip = req.query.clientip;//游戏服务器地址
	//console.log("游戏服务器地="+clientip);
	var clientport = req.query.clientport;//10000 socket端口
	//console.log("游戏服务器socket端口="+clientport);
	var httpPort = req.query.httpPort;//游戏服务器中用语监听的http端口 9003
	//console.log("游戏服务器http端口="+httpPort);
	var load = req.query.load;//得到当前请求的游戏服务器的房间总数
	//console.log("请求的房间数="+load);
	var id = clientip + ":" + clientport;
    //console.log("游戏服务器id="+id);
	if(serverMap[id]){
		var info = serverMap[id];
		if(info.clientport != clientport
			|| info.httpPort != httpPort
			|| info.ip != ip
		){
			console.log("duplicate gsid:" + id + ",addr:" + ip + "(" + httpPort + ")");
			http.send(res,1,"duplicate gsid:" + id);
			return;
		}
		info.load = load;//及时更新房间总数
		http.send(res,0,"ok",{ip:ip});
		return;
	}
	serverMap[id] = {
		ip:ip,
		id:id,
		clientip:clientip,
		clientport:clientport,//10000
		httpPort:httpPort,//9003
		load:load
	};
	http.send(res,0,"ok",{ip:ip});
	console.log("game server registered.\n\tid:" + id 
	+ "\n\taddr:" + ip + "\n\thttp port:" + 
	httpPort + "\n\tsocket clientport:" + clientport);

	var reqdata = {
		serverid:id,
		sign:crypto.md5(id+config.ROOM_PRI_KEY)
	};
	//获取服务器信息 位置落座信息，以后再看
	console.log("获取服务器请求地址="+ip+":"+httpPort);
	http.get(ip,httpPort,"/get_server_info",reqdata,function(ret,data){
		if(ret && data.errcode == 0){
			for(var i = 0; i < data.userroominfo.length; i += 2){
				var userId = data.userroominfo[i];
				var roomId = data.userroominfo[i+1];
			}
		}
		else{
			console.log(data.errmsg);
		}
	});
});
//（选择房间数最少的服务器）负责负载均衡
function chooseServer(){
	var serverinfo = null;
	for(var s in serverMap){
		var info = serverMap[s];
		if(serverinfo == null){
			serverinfo = info;			
		}
		else{
			if(serverinfo.load > info.load){
				serverinfo = info;
			}
		}
	}	
	return serverinfo;
}
 
exports.createRoom = function(account,userId,roomConf,fnCallback){
	var serverinfo = chooseServer();
	console.log("选择到的游戏服务器信息:"+serverinfo);
	
	if(serverinfo == null){
		fnCallback(101,null);//没有找到游戏服务器信息，返回101错误
		return;
	}
	//获取房卡
	db.get_gems(account,function(data){
		if(data != null){
			//2、请求创建房间
			var reqdata = {
				userid:userId,
				gems:data.gems,
				conf:roomConf //创建房间需要配置的参数 血战到底，血流成河
			};
			reqdata.sign = crypto.md5(userId + roomConf + data.gems + config.ROOM_PRI_KEY);
			console.log("》》》》》获得的钻石房卡数="+data.gems);
            //这里应该添加房卡数不足的时候的反馈回调


			//跨进程（主机）访问 game 服务器， http_service-> /create_room
			//serverinfo 为分配的游戏服务器地址
			http.get(serverinfo.ip,serverinfo.httpPort,"/create_room",reqdata,function(ret,data){
				//console.log(data);
				console.log("room_service回调成功");
				if(ret){
					if(data.errcode == 0){
						fnCallback(0,data.roomid);
					}
					else{
						fnCallback(data.errcode,null);		
					}
					return;
				}
				fnCallback(102,null);
			});	
		}
		else{
			fnCallback(103,null);
		}
	});
};
  /*
    - 从数据库查找房间所在服务器
    - 检查房间是否正在运行
        - 是：向房间所在服务器请求 http_service/enter_room
		- 否：选择服务器，并进入游戏服务器的开房逻辑
	*/
exports.enterRoom = function(userId,name,roomId,fnCallback){
	var reqdata = {
		userid:userId,
		name:name,
		roomid:roomId
	};
	reqdata.sign = crypto.md5(userId + name + roomId + config.ROOM_PRI_KEY);

	var checkRoomIsRuning = function(serverinfo,roomId,callback){
		var sign = crypto.md5(roomId + config.ROOM_PRI_KEY);
		//GameServer http_service.js
		//检查房间是否正在运行
		//通过目前的代码发现一直返回true
		http.get(serverinfo.ip,serverinfo.httpPort,"/is_room_runing",{roomid:roomId,sign:sign},function(ret,data){
			if(ret){
				if(data.errcode == 0 && data.runing == true){
					callback(true);
				}
				else{
					callback(false);
				}
			}
			else{
				callback(false);
			}
		});
	}
	/*
	
	*/
	 
	var enterRoomReq = function(serverinfo){
		console.log("正在进入房间");
		http.get(serverinfo.ip,serverinfo.httpPort,"/enter_room",reqdata,function(ret,data){
			console.log(data);
			//data ={token:token}//随机token值
			if(ret){//请求成功，rer=true
				if(data.errcode == 0){
					//更新用户所在的roomId
					db.set_room_id_of_user(userId,roomId,function(ret){
						fnCallback(0,{
							ip:serverinfo.clientip,
							port:serverinfo.clientport,
							token:data.token
						});
					});
				  //我觉得这里应该把返回的ip和port更新到room表中，因为 在room_Service中有一个选择服务器的方法，
				  //可能会选择新的服务器所以，应该把最新的ip和port 更新到表中
             //.......
 

				}
				else{
					console.log(data.errmsg);
					fnCallback(data.errcode,null);
				}
			}
			else{
				fnCallback(-1,null);
			}
		});
	};

	var chooseServerAndEnter = function(serverinfo){
		serverinfo = chooseServer();
		if(serverinfo != null){
			enterRoomReq(serverinfo);
		}
		else{
			fnCallback(-1,null);					
		}
	}
    /*获取房间所在的ip,port  所在服务器*/
	db.get_room_addr(roomId,function(ret,ip,port){
		if(ret){
			var id = ip + ":" + port;
			var serverinfo = serverMap[id];
			if(serverinfo != null){//看看现在服务器是否还有
				checkRoomIsRuning(serverinfo,roomId,function(isRuning){
					if(isRuning){
						//如果房间正在运行
						enterRoomReq(serverinfo);
					}
					else{
						//正在运行的房间没有了
						chooseServerAndEnter(serverinfo);
					}
				});
			}
			else{
				chooseServerAndEnter(serverinfo);
			}
		}
		else{
			fnCallback(-2,null);
		}
	});
};

exports.isServerOnline = function(ip,port,callback){
	var id = ip + ":" + port;
	var serverInfo = serverMap[id];
	if(!serverInfo){
		callback(false);
		return;
	}
	var sign = crypto.md5(config.ROOM_PRI_KEY);
	http.get(serverInfo.ip,serverInfo.httpPort,"/ping",{sign:sign},function(ret,data){
		if(ret){
			callback(true);
		}
		else{
			callback(false);
		}
	});
};

exports.start = function($config){
	config = $config;
	//for_room_ip为localhost，本机地址,监听本机地址
	app.listen(config.ROOM_PORT,config.FOR_ROOM_IP); //9002 room端口的监听
	console.log("room service is listening on " + config.FOR_ROOM_IP + ":" + config.ROOM_PORT);
};