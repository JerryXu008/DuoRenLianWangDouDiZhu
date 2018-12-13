var crypto = require('../utils/crypto');
var db = require('../utils/db');

var tokenMgr = require('./tokenmgr');
var roomMgr = require('./roommgr');
var userMgr = require('./usermgr');
var io = null;
exports.start = function(config,mgr){
	io = require('socket.io')(config.CLIENT_PORT);
	
	io.sockets.on('connection',function(socket){
       console.log("服务端socket链接成功");

		socket.on('login',function(data){
			data = JSON.parse(data);
			if(socket.userId != null){
				//已经登陆过的就忽略
				return;
			}
			var token = data.token;
			var roomId = data.roomid;
			var time = data.time;
			var sign = data.sign;

			console.log("登录之后房间号="+roomId);
			console.log("登录之后token="+token);
			console.log("登录之后time="+time);
			console.log("登录之后sign="+sign);

			
			//检查参数合法性
			if(token == null || roomId == null || sign == null || time == null){
				console.log(1);
				socket.emit('login_result',{errcode:1,errmsg:"invalid parameters"});
				return;
			}
			
			//检查参数是否被篡改
			var md5 = crypto.md5(roomId + token + time + config.ROOM_PRI_KEY);
			if(md5 != sign){
				console.log(2);
				socket.emit('login_result',{errcode:2,errmsg:"login failed. invalid sign!"});
				return;
			}
			
			//检查token是否有效
			//token是在enterRoom方法成功之后生成的，当前时间加5分钟，然后开始登录，如果登录的时候超过了5分钟，
			//此时的token也就无效了
			if(tokenMgr.isTokenValid(token)==false){
				console.log(3);
				socket.emit('login_result',{errcode:3,errmsg:"token out of time."});
				return;
			}
			
			//检查房间合法性
			var userId = tokenMgr.getUserID(token);
			var roomId = roomMgr.getUserRoom(userId);
            //记录当前连接socket,和userid关联
			userMgr.bind(userId,socket);
			socket.userId = userId;

			//返回房间信息
/*
  {
						uuid:"",
						id:roomId,
						numOfGames:0,
						createTime:createTime,
						nextButton:0,//下一位庄稼
						seats:[],
						conf:{
							type:roomConf.type,
							creator:creator,
						}
					};
*/


			var roomInfo = roomMgr.getRoom(roomId);
			/*
			    userLocation[userId] = {
					roomId:roomId,
					seatIndex:i
				};
        //座位信息
	    s.userId = dbdata["user_id" + i];
		s.score = dbdata["user_score" + i];
		s.name = dbdata["user_name" + i];
		s.ready = false;
		s.seatIndex = i;
		*/
			var seatIndex = roomMgr.getUserSeat(userId);
			//The remote address of the connection request
			//保存这个座位的远程客户端地址
			roomInfo.seats[seatIndex].ip = socket.handshake.address;

			var userData = null;
			var seats = [];
			//3个座位
			for(var i = 0; i < roomInfo.seats.length; ++i){
				var rs = roomInfo.seats[i];
				var online = false;
				if(rs.userId > 0){//座位上有人
					//返回是否存在于服务器内存中，也就是是否在线
					online = userMgr.isOnline(rs.userId);
				}

				seats.push({
					userid:rs.userId,
					ip:rs.ip,
					score:rs.score,
					name:rs.name,
					online:online,//是否在线
					ready:rs.ready,//是否准备好
					seatIndex:i, //座位位置
					 
				});

				if(userId == rs.userId){//其中一个userid是本人
					userData = seats[i];
				}
			}

			//通知前端
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
			 
			//通知当前登录人客户端 登录结果
			socket.emit('login_result',ret);
			 
            
			// //通知其它客户端，新成员加入了
			 userMgr.broacastInRoom('new_user_comes_push',userData,userId);
			


			 socket.gameMgr = roomInfo.gameMgr;//斗地主

			// //玩家上线，强制设置为TRUE
			//3人到齐之后控制游戏开始
			 socket.gameMgr.setReady(userId);

			 socket.emit('login_finished');//这个在客户端的GameNetMgr和 reconnect组件里面
			 
			
			//如果刚进来。准备开始游戏了，发现有人已经提出解散牌局，那么此时就会显示出解散牌局的页面
			if(roomInfo.dr != null){
				var dr = roomInfo.dr;
				var ramaingTime = (dr.endTime - Date.now()) / 1000;
				var data = {
					time:ramaingTime,
					states:dr.states
				}
				userMgr.sendMsg(userId,'dissolve_notice_push',data);	
			}
		});





		socket.on('ready',function(data){
			var userId = socket.userId;
			if(userId == null){
				return;
			}
			socket.gameMgr.setReady(userId);
			//广播某个玩家准备好了，更新UI
			userMgr.broacastInRoom('user_ready_push',{userid:userId,ready:true},userId,true);
		});

		//换牌
		socket.on('huanpai',function(data){
			if(socket.userId == null){
				return;
			}
			if(data == null){
				return;
			}

			if(typeof(data) == "string"){
				data = JSON.parse(data);
			}

			var p1 = data.p1;
			var p2 = data.p2;
			var p3 = data.p3;
			if(p1 == null || p2 == null || p3 == null){
				console.log("invalid data");
				return;
			}
			socket.gameMgr.huanSanZhang(socket.userId,p1,p2,p3);
		});

		//叫分
		socket.on('jiaofen',function(data){
			if(socket.userId == null){
				return;
			}
			var score = data;
			socket.gameMgr.jiaofen(socket.userId,score);
		});
		//设置为地主
		socket.on('setDiZhu',function(data){
			if(socket.userId == null){
				return;
			}
			var seatIndex = data;
			socket.gameMgr.setDiZhu(socket.userId,seatIndex);
		});
		//换到下一个人叫分
		socket.on('ChangeNextPersonJiaoFen',function(data){
			if(socket.userId == null){
				return;
			}
			 
			socket.gameMgr.ChangeNextPersonJiaoFen(socket.userId);
		});
		

		//出牌
		socket.on('chupai',function(data){
			if(socket.userId == null){
				return;
			}
			var pai = data;
			socket.gameMgr.chuPai(socket.userId,pai);
		});
		
	 //不要
	 socket.on('buyao',function(data){
		if(socket.userId == null){
			return;
		}
		var seatIndex = data;
		socket.gameMgr.buyao(socket.userId,seatIndex);
	});
		 
		
		 
		
		 
		 
		
		 
	 
		
		//语音使用SDK不出现在这里
		
		//退出房间
		 
		socket.on('exit',function(data){
			var userId = socket.userId;
			if(userId == null){
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null){
				return;
			}

			//如果游戏已经开始，则不可以
			if(socket.gameMgr.hasBegan(roomId)){
				return;
			}

			//如果是房主，则只能走解散房间
			if(roomMgr.isCreator(userId)){
				return;
			}
			
			//通知其它玩家，有人退出了房间
			userMgr.broacastInRoom('exit_notify_push',userId,userId,false);
			
			roomMgr.exitRoom(userId);
			userMgr.del(userId);
			
			socket.emit('exit_result');
			socket.disconnect();//断开链接
		});
		
		//解散房间，游戏开始之前
		socket.on('dispress',function(data){
			var userId = socket.userId;
			if(userId == null){
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null){
				return;
			}

			//如果游戏已经开始，则不可以
			if(socket.gameMgr.hasBegan(roomId)){
				return;
			}

			//如果不是房主，则不能解散房间
			if(roomMgr.isCreator(roomId,userId) == false){
				return;
			}
			
			userMgr.broacastInRoom('dispress_push',{},userId,true);
			userMgr.kickAllInRoom(roomId);
			
			roomMgr.destroy(roomId);
			
			socket.disconnect();
		});

		
		
		//解散房间请求，游戏开始之后
		socket.on('dissolve_request',function(data){
			var userId = socket.userId;
			console.log(1);
			if(userId == null){
				console.log(2);
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null){
				console.log(3);
				return;
			}

			//如果游戏未开始，则不可以
			if(socket.gameMgr.hasBegan(roomId) == false){
				console.log(4);
				return;
			}

			var ret = socket.gameMgr.dissolveRequest(roomId,userId);
			if(ret != null){
				var dr = ret.dr;
				var ramaingTime = (dr.endTime - Date.now()) / 1000;
				var data = {
					time:ramaingTime,
					states:dr.states
				}
				//console.log(5);
				userMgr.broacastInRoom('dissolve_notice_push',data,userId,true);
			}
			//console.log(6);
		});

		socket.on('dissolve_agree',function(data){
			var userId = socket.userId;

			if(userId == null){
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null){
				return;
			}

			var ret = socket.gameMgr.dissolveAgree(roomId,userId,true);
			if(ret != null){
				var dr = ret.dr;
				var ramaingTime = (dr.endTime - Date.now()) / 1000;
				var data = {
					time:ramaingTime,
					states:dr.states
				}
				userMgr.broacastInRoom('dissolve_notice_push',data,userId,true);

				var doAllAgree = true;
				for(var i = 0; i < dr.states.length; ++i){
					if(dr.states[i] == false){
						doAllAgree = false;
						break;
					}
				}

				if(doAllAgree){
					socket.gameMgr.doDissolve(roomId);					
				}
			}
		});

		socket.on('dissolve_reject',function(data){
			var userId = socket.userId;

			if(userId == null){
				return;
			}

			var roomId = roomMgr.getUserRoom(userId);
			if(roomId == null){
				return;
			}

			var ret = socket.gameMgr.dissolveAgree(roomId,userId,false);
			if(ret != null){
				userMgr.broacastInRoom('dissolve_cancel_push',{},userId,true);
			}
		});

		//断开链接
		socket.on('disconnect',function(data){
			var userId = socket.userId;
			if(!userId){
				return;
			}
			var data = {
				userid:userId,
				online:false
			};

			//通知房间内其它玩家
			userMgr.broacastInRoom('user_state_push',data,userId);

			//清除玩家的在线信息
			userMgr.del(userId);
			socket.userId = null;

			console.log("用户"+userId+"掉线了");
		});
		
		socket.on('game_ping',function(data){
			var userId = socket.userId;
			if(!userId){
				return;
			}
			//console.log('game_ping');
			socket.emit('game_pong');
		});
	});
    //port :10000
	console.log("game server is listening on " + config.CLIENT_PORT);	
};