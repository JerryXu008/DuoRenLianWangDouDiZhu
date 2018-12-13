var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");
var mjutils = require('./mjutils');
var db = require("../utils/db");
var crypto = require("../utils/crypto");
var AIUtil=require("./AIUtil");
var PokerType=require('./PokerType');
var games = {};
var gamesIdBase = 0;

var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_HU = 5;
var ACTION_ZIMO = 6;
var timeLeftValue=20000;

var gameSeatsOfUsers = {};

function getMJType(id){
    if(id >= 0 && id < 9){
        //筒
        return 0;
    }
    else if(id >= 9 && id < 18){
        //条
        return 1;
    }
    else if(id >= 18 && id < 27){
        //万
        return 2;
    }
}


function shuffle(game) {
    
    game.op=-2;
    game.currentCircle=0;
    game.bossCircle=0;
    game.isTouchPoker=true;

    game.currentMultiple=1;
    game.currentCard=null;
    


     

    for (var i = 0; i < 54; i++) {
        game.deskPokes[i]=i;
    }
    for(var i=0; i<20; i++){
        game.pokesFlag[i]=false;
    } 
   
    for (var i = 0; i < 54; i++) { //随机进行交换
        var des = Math.GetRandomNum(54);
        var  temp = game.deskPokes[i];
        game.deskPokes[i] = game.deskPokes[des];
        game.deskPokes[des] = temp;
     }
}

function deal(game){
    
game.currentIndex = 0;

for(var i=0; i<17; i++){
      
    var mahjongs = game.gameSeats[0].holds;
        if(mahjongs == null){
            mahjongs = [];
            game.gameSeats[0].holds = mahjongs;
        }

    game.gameSeats[0].holds.push(game.deskPokes[i]);
   
}
for(var i=17; i<34; i++){
    var mahjongs = game.gameSeats[1].holds;
    if(mahjongs == null){
        mahjongs = [];
        game.gameSeats[1].holds = mahjongs;
    }
    game.gameSeats[1].holds.push(game.deskPokes[i]);
   
}
for(var i=34; i<51; i++){
    var mahjongs = game.gameSeats[2].holds;
    if(mahjongs == null){
        mahjongs = [];
        game.gameSeats[2].holds = mahjongs;
    }
    game.gameSeats[2].holds.push(game.deskPokes[i]);
   
}
// //test
// game.gameSeats[1].holds[16]=52;
// game.gameSeats[1].holds[17]=53;



        game.threePokes[0] = game.deskPokes[51];
        game.threePokes[1] = game.deskPokes[52];
        game.threePokes[2] = game.deskPokes[53];

//当前轮设置为庄家
game.currentPerson = game.boss;//默认为0
}

//开始新的一局
exports.begin = function(roomId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }

    /*  seats 数组数据：
                            userId:0,
							score:0,
							name:"",
							ready:false,
							seatIndex:i,
						 
    */
    var seats = roomInfo.seats;//房间座位信息

    var game = {
        conf:roomInfo.conf,//玩法
        roomInfo:roomInfo,
        gameIndex:roomInfo.numOfGames,//第几局

        paiArray:[],//当前出的牌
        
        
        currentIndex:0,//当前的牌的索引
        gameSeats:new Array(3),

         loadingNum:0,
         date:0,
        
        
         personId:0,
         
        
         
         haveDZ:0,
        
        dzJiaofen:[3],//3个人的叫分状态
        currentPerson:0,
        currentCard:null,//当前最新的出的牌
        lastPerson:0,//保存下出牌的人
        boss:0,
        bossCircle:0,
           
        currentScore:0,//当前分数
        currentMultiple:1,//当前倍数
        
        
        currentCircle:0,//0 为从头开始出牌
        pokesFlag:[20],
        deskPokes:[54],
        threePokes:[3],
       
        timeLeft:timeLeftValue,//叫分和出牌的时间倒计时


    };

    roomInfo.numOfGames++;//局数加一

    for(var i = 0; i < 3; ++i){
        var data = game.gameSeats[i] = {};//游戏过程中座位信息

        data.game = game;

        data.seatIndex = i;

        data.userId = seats[i].userId;
        //持有的牌
        data.holds =[];
        //打出的牌
        data.folds = [];
       
        data.pattern = "";

         data.canChuPai = false;
         data.score=-1;//叫地主的分数
         
         data.score = 0;//分数
        gameSeatsOfUsers[data.userId] = data;
    }
    games[roomId] = game;
    //洗牌
    shuffle(game);
    //分牌
    deal(game);
    console.log("游戏发牌");
 
    var holdsCountArr=[];
    for(var i = 0; i < seats.length; ++i){
        //开局时，通知前端必要的数据
        var s = seats[i];
        //通知玩家手牌。每个玩家通知自己的手牌
        userMgr.sendMsg(s.userId,'game_holds_push',game.gameSeats[i].holds);//holds 数字数组
       //通知还剩多少局
        userMgr.sendMsg(s.userId,'game_num_push',roomInfo.numOfGames);
        //当前倍数
        userMgr.sendMsg(s.userId,'game_currentMultiple_push',game.currentMultiple);
        //当前分数
        userMgr.sendMsg(s.userId,'game_currentScore_push',game.currentScore);
        //通知游戏开始， 

        userMgr.sendMsg(s.userId,'game_begin_push');

        holdsCountArr.push(game.gameSeats[i].holds.length);
         
         }
        //广播给每个人，开始叫地主
        game.state = -1;//状态为叫地主  

      //通知每个玩家，各个玩家剩余的牌数
      userMgr.broacastInRoom('game_holds_EveryCount',holdsCountArr,seats[0].userId,true);
      //随机产生谁先叫地主
      game.currentPerson= Math.getRandomNum(3);
      //test
      //game.currentPerson=0;
      //通知每个玩家，哪个该叫地主
      userMgr.broacastInRoom('game_jiaodizhu_push',game.currentPerson,seats[0].userId,true);
      //开始倒计时
      goTimeLeft(game);

      
};
function goTimeLeft(game){
     var time =Date.now() + timeLeftValue;
     game.timeLeft=time;
     var ramaingTime = (time - Date.now()) / 1000;//剩余多少秒
     
     userMgr.broacastInRoom('game_timeLeft_push',ramaingTime,game.gameSeats[0].userId,true);
       
}
//userId:发送socket的玩家 seatIndex：设置为地主的玩家
exports.setDiZhu=function(userIdsocket,seatIndex){
    
   
  var seatDataSocket = gameSeatsOfUsers[userIdsocket];
  if(seatDataSocket == null){
      console.log("can't find user game data.");
      return;
  }

  var game = seatDataSocket.game;
   game.haveDZ=true;//  确定地主了
   game.boss=seatIndex;
   game.currentPerson=game.boss;
   
   var seatData=game.gameSeats[seatIndex];
   var holds=seatData.holds;
   holds.push(game.threePokes[0]);
   holds.push(game.threePokes[1]);
   holds.push(game.threePokes[2]);
  
   game.state=0;

//圈数通知
    userMgr.broacastInRoom('game_currentCircle_push',game.currentCircle,userIdsocket,true);

   //通知各个客户端哪个是地主
   userMgr.broacastInRoom('game_setDiZhu_push',game.boss,userIdsocket,true);
   //开始倒计时
   goTimeLeft(game);
   // 通知地主，更新三张底牌
   userMgr.broacastInRoom('game_showthreepoke_push', game.threePokes,userIdsocket,true);
   // 更新各个玩家牌的数目
   //通知每个玩家，各个玩家剩余的牌数
   var holdsCountArr=[];
    
   
   for(var i=0;i<game.gameSeats.length;i++){
       holdsCountArr[i]=(game.gameSeats[i].holds.length);
   }
   userMgr.broacastInRoom('game_holds_EveryCount',holdsCountArr,userIdsocket,true);

   
   

}


exports.ChangeNextPersonJiaoFen=function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }
    var game = seatData.game;
    if(game.state != -1){ //必须是游戏状态为叫地主才能继续
        console.log("无法叫地主 game.state == " + game.state);
        return;
    }
     //开始倒计时
    goTimeLeft(game);
    moveToNextUser(game);
    userMgr.broacastInRoom('game_jiaodizhu_push',game.currentPerson,userId,true);

}

//通知玩家开始叫分
exports.jiaofen = function(userId,score){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;
    if(game.state != -1){ //必须是游戏状态为叫地主才能继续
        console.log("无法叫地主 game.state == " + game.state);
        return;
    }

     
    if(score>game.currentScore){
       // this.updateScore(score);
        game.currentScore=score;
    }else{ //比当前分数叫的低，那么这个人之后不能在叫分了,一般不叫的时候会走
        score=0;
        game.dzJiaofen[seatIndex]=false;//不允许叫分了
    }

     seatData.score = score;//把叫分保存下来
    
     var seatIndex=getSeatIndex(seatData.userId);
    userMgr.broacastInRoom('game_jiaofen_notify_push',{seatIndex:seatIndex,score:score,currentScore:game.currentScore},seatData.userId,true);


    
};

exports.chuPai = function(userId,paiObject){
       var obj=JSON.parse(paiObject);
        var paiArray=obj.cardPokes;
       
       // var pokesFlag=obj.pokesFlag;
         
        var seatData = gameSeatsOfUsers[userId];
        if(seatData == null){
            console.log("can't find user game data.");
            return;
        }
        
    
        var game = seatData.game;
        game.paiArray=paiArray;
        var seatIndex = seatData.seatIndex;
       
        //如果不该他出，则忽略
        if(game.currentPerson != seatData.seatIndex){
            console.log("not your turn.");
            return;
        }
        if(seatIndex==game.boss){
            game.bossCircle++;
        }

        var cardType = AIUtil.getPokeType(paiArray);
        if (cardType == PokerType.error) { //不是按照规则的牌
            console.log("出牌类型错误.");
            return;
        }
        //保存当前出的牌
        game.currentCard=paiArray; 
        game.lastPerson=game.currentPerson;

        for(var i=0;i<paiArray.length;i++){
            
            var pai=paiArray[i];
            var idx = seatData.holds.indexOf(pai);
            seatData.holds.splice(idx,1);
        }
       // game.pokesFlag= pokesFlag;//记录下当前某个玩家选排未选牌的 布尔值
       // userMgr.sendMsg(userId,'game_pokesFlag_push',pokesFlag);//牌选中的布尔值
       if(cardType==PokerType.zhadan || cardType==PokerType.huojian){
           game.currentMultiple=game.currentMultiple*2;
       }
       
       //更新倍数
       userMgr.broacastInRoom('game_currentMultiple_push',game.currentMultiple,seatData.userId,true);
       
       userMgr.broacastInRoom('game_chupai_notify_push',{userId:seatData.userId,paiArray:paiArray},seatData.userId,true);
       //开始倒计时
       goTimeLeft(game);
       
       //通知每个玩家，各个玩家剩余的牌数
        var holdsCountArr=[];
   
       for(var i=0;i<game.gameSeats.length;i++){
         holdsCountArr.push(game.gameSeats[i].holds.length);
       }
       userMgr.broacastInRoom('game_holds_EveryCount',holdsCountArr,userId,true);

       game.currentCircle++;
       userMgr.broacastInRoom('game_currentCircle_push',game.currentCircle,userId,true);
     
      // if(game.gameSeats[seatIndex].holds.length<14){
       if(game.gameSeats[seatIndex].holds.length<=0){//出牌出完了
           overGame(game,userId,false);
           return;
       }


       moveToNextUser(game);//确定turn为多少
       userMgr.broacastInRoom('game_chupaiReady_push',game.currentPerson,userId,true);
       //开始倒计时
       goTimeLeft(game);
      
       
       
        
};
exports.buyao = function(userId,curSeatIndex){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果玩家没有对应的操作，则也认为是非法消息
    if(curSeatIndex!=seatIndex){
        console.log("不应该不要");
        return;
    }
    //开始倒计时
    goTimeLeft(game);
    userMgr.broacastInRoom('game_buyaoNotis_push',game.currentPerson,userId,true);

    


    setTimeout(function(){
        moveToNextUser(game);//确定turn为多少
       //转了一圈都不要自己的牌
        if(game.currentPerson==game.lastPerson){
            game.currentCircle=0;
            game.currentCard=null;
            userMgr.broacastInRoom('game_CircleFinish_push',game.currentPerson,userId,true);
           
            //userMgr.sendMsg(game.gameSeats[game.currentPerson].userId,'game_pokesFlag_push',game.pokesFlag);//牌选中的布尔值
        }
       userMgr.broacastInRoom('game_currentCircle_push',game.currentCircle,userId,true);
       userMgr.broacastInRoom('game_chupaiReady_push',game.currentPerson,userId,true);
       
    },500);
   
};
function calculateScore(game){
    var isBoss;
    var score0=0, score1=0, score2=0;

    //得到地主和农民应该得到的分数或者失去的分数
    // 如果当前的是boss，说明boss跑了
    if(game.currentPerson==game.boss){
        isBoss=true;
       
        if(game.boss==0){
            
             if(game.gameSeats[1].holds.length==17 && game.gameSeats[2].holds.length==17){//对手一张牌没出
                game.currentMultiple*=2;
            }
            score0=game.currentScore*game.currentMultiple*2;
            score1=-game.currentScore*game.currentMultiple;
            score2=-game.currentScore*game.currentMultiple;

           }else{
            
             if(game.boss==1){
              if(game.gameSeats[0].holds.length==17 && game.gameSeats[2].holds.length==17){//对手一张牌没出
                  game.currentMultiple*=2;
              }
                score0=-game.currentScore*game.currentMultiple;
                score1=game.currentScore*game.currentMultiple*2;
                score2=-game.currentScore*game.currentMultiple;

            }else{
              if(game.gameSeats[0].holds.length==17 && game.gameSeats[1].holds.length==17){//对手一张牌没出
                  game.currentMultiple*=2;
              }
                score0=-game.currentScore*game.currentMultiple;
                score1=-game.currentScore*game.currentMultiple;
                score2=game.currentScore*game.currentMultiple*2;
            }

        }

    }else{//如果是农民赢了
        isBoss=false;
        if(game.bossCircle==1){ //如果是农民第一把就一直出牌，地主就刚开始出了一把牌，那么加倍
             game.currentMultiple*=2;
        }
         
        if(game.boss==0){
           
            
            score0=-game.currentScore*game.currentMultiple*2;
            score1=game.currentScore*game.currentMultiple;
            score2=game.currentScore*game.currentMultiple;

        }else{ 
            
            
            score0=game.currentScore*game.currentMultiple;
            if(game.boss==1){
                score1=-game.currentScore*game.currentMultiple*2;
                score2=game.currentScore*game.currentMultiple;
            }else{
                score1=game.currentScore*game.currentMultiple;
                score2=-game.currentScore*game.currentMultiple*2;
            }
        }
    }
    game.gameSeats[0].score=score0;
    game.gameSeats[1].score=score1;
    game.gameSeats[2].score=score2;

    var data=[];
    data[0]=game.currentScore;
    data[1]=game.currentMultiple;
    data[2]=score0;
    data[3]=score1;
    data[4]=score2;
    data[5]=score0;
    data[6]=isBoss;
    return data;
   
    
    
}
 function overGame (game,userId,forceEnd){
    
        game.gamestate=1;//操作为1,
       
        var roomId = roomMgr.getUserRoom(userId);
        if(roomId == null){
            return;
        }
        var roomInfo = roomMgr.getRoom(roomId);
        if(roomInfo == null){
            return;
        }
       
        var data=[];
        if(game != null){
            if(!forceEnd){
             data=  calculateScore(game);
           }
          data[7]=forceEnd;
          
          var holdsArr=[game.gameSeats[0].holds,game.gameSeats[1].holds,game.gameSeats[2].holds];
          userMgr.broacastInRoom('game_allLeftPokes_push',holdsArr,userId,true);
          
           userMgr.broacastInRoom('game_over_push',data,userId,true);
           
           for(var i = 0; i < roomInfo.seats.length; ++i){
            var rs = roomInfo.seats[i];
            var sd = game.gameSeats[i];
            rs.ready = false;//准备为false
            delete gameSeatsOfUsers[sd.userId];//清空数据
           }
            //虽然games移除了这个元素，但是 参数game作为临时变量仍然引用着那块内存，所以后面game可以继续使用
            delete games[roomId];//删除本局游戏

            if(forceEnd){
            setTimeout(function(){
                 userMgr.kickAllInRoom(roomId);
                 roomMgr.destroy(roomId);
                        
            },1500);
        }
       
        }
};


function getSeatIndex(userId){
    var seatIndex = roomMgr.getUserSeat(userId);
    if(seatIndex == null){
        return null;
    }
    return seatIndex;
}

function getGameByUserID(userId){
    var roomId = roomMgr.getUserRoom(userId);
    if(roomId == null){
        return null;
    }
    var game = games[roomId];
    return game;
}

 
 

function moveToNextUser(game,nextSeat){
    if(nextSeat == null){
        switch (game.currentPerson) {
        case 0:
            game.currentPerson = 1;
            break;
        case 1:
             game.currentPerson = 2;
            break;
         case 2:
             game.currentPerson = 0;
            break;
    }
  }
  else{
    game.currentPerson = nextSeat;
  }
}

 
exports.setReady = function(userId,callback){
    var roomId = roomMgr.getUserRoom(userId);
    if(roomId == null){
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }
    //标示这个用户的坐位 已经准备好
    roomMgr.setReady(userId,true);

    var game = games[roomId];
    
    

    if(game == null){
        console.log("游戏不存在，重新创建");
        if(roomInfo.seats.length == 3){
            //暂时屏蔽
            for(var i = 0; i < roomInfo.seats.length; ++i){
            //for(var i = 0; i < 2; ++i){
                var s = roomInfo.seats[i];
                //其中一个没有准备好或者不在线，游戏就不开始
                if(s.ready == false || userMgr.isOnline(s.userId)==false){
                    return;
                }
            }
            //4个人到齐了，并且都准备好了，则开始新的一局
            exports.begin(roomId);
        }
    }
    else{
         console.log("游戏已经存在，加载已有数据");
         
        
        
        var data = {
            state:game.state,//游戏状态，  //-3 游戏没有开始  -2 游戏刚刚开始   -1表示正在进行叫分操作，0表示出牌过程中  1表示出牌结束
            
            boss:game.boss,//地主是谁
            turn:game.currentPerson,//当前谁应该在出牌
            chuPai:game.paiArray,//当前出的牌
            
        };

        data.seats = [];
        var seatData = null;
        for(var i = 0; i < 3; ++i){
            var sd = game.gameSeats[i];

            var s = {
                userid:sd.userId,  
                folds:sd.folds,//打出去的牌
                
            }
            if(sd.userId == userId){//如果是自己，把holds保存下
                s.holds = sd.holds;
                seatData = sd;
            }
            else{
                
            }
            data.seats.push(s);
        }
        //三张牌
        if(game.state>=0){
             data.threePokes= game.threePokes;
        }
        data.currentScore= game.currentScore;
        data.currentMultiple=game.currentMultiple;

        //当前出的牌
        data.paiArray=game.paiArray  
        data.lastPerson=game.lastPerson;

           //每个玩家，各个玩家剩余的牌数
            var holdsCountArr=[];
         
             for(var i=0;i<game.gameSeats.length;i++){
               holdsCountArr.push(game.gameSeats[i].holds.length);
             }
              data.holdsCountArr=holdsCountArr;
             
              //是否某个玩家正在请求解散
              
            if(roomInfo.dr){
                   var dr = roomInfo.dr;
                    var ramaingTime = (dr.endTime - Date.now()) / 1000;
                    var data2 = {
                        time:ramaingTime,
                        states:dr.states
                    }
                    data.dr=data2;
                    
            }
            //剩余倒计时
          
            
             var ramaingTime = (game.timeLeft - Date.now()) / 1000;//剩余多少秒 
             data.timeLeftSeconds= ramaingTime;  
             if(data.timeLeftSeconds<0){
                data.timeLeftSeconds=0;
             }
          
          
           //同步整个信息给客户端
        userMgr.sendMsg(userId,'game_sync_push',data);
         
    }
}




function store_single_history(userId,history){
    db.get_user_history(userId,function(data){
        if(data == null){
            data = [];
        }
        while(data.length >= 10){
            data.shift();
        }
        data.push(history);
        db.update_user_history(userId,data);
    });
}
//记录每个玩家又参与过哪些 牌局历史
function store_history(roomInfo){
    var seats = roomInfo.seats;
    var history = {
        uuid:roomInfo.uuid,
        id:roomInfo.id,
        time:roomInfo.createTime,
        seats:new Array(4)
    };

    for(var i = 0; i < seats.length; ++i){
        var rs = seats[i];
        var hs = history.seats[i] = {};
        hs.userid = rs.userId;
        hs.name = crypto.toBase64(rs.name);
        hs.score = rs.score;
    }

    for(var i = 0; i < seats.length; ++i){
        var s = seats[i];
        store_single_history(s.userId,history);
    }
}

function construct_game_base_info(game){
    var baseInfo = {
        type:game.conf.type,
        boss:game.boss,
        index:game.gameIndex,
        mahjongs:game.mahjongs,
        game_seats:new Array(4)
    }
    
    for(var i = 0; i < 4; ++i){
        baseInfo.game_seats[i] = game.gameSeats[i].holds;
    }
    game.baseInfoJson = JSON.stringify(baseInfo);
}

function store_game(game,callback){
    db.create_game(game.roomInfo.uuid,game.gameIndex,game.baseInfoJson,callback);
}


 
 

    

    


 


 



exports.isPlaying = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        return false;
    }

    var game = seatData.game;

    if(game.state == -3){
        return false;
    }
    return true;
}
 









exports.hasBegan = function(roomId){
    var game = games[roomId];
    if(game != null){
        return true;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo != null){
        return roomInfo.numOfGames > 0;
    }
    return false;
};


var dissolvingList = [];

//3个人都同意里，解散房间
exports.doDissolve = function(roomId){
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return null;
    }

    var game = games[roomId];
    overGame(game,roomInfo.seats[0].userId,true);
};

exports.dissolveRequest = function(roomId,userId){
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return null;
    }

    if(roomInfo.dr != null){
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if(seatIndex == null){
        return null;
    }

    roomInfo.dr = {
        endTime:Date.now() + 30000,
        states:[false,false,false]
    };
    roomInfo.dr.states[seatIndex] = true;

    dissolvingList.push(roomId);

    return roomInfo;
};

exports.dissolveAgree = function(roomId,userId,agree){
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return null;
    }

    if(roomInfo.dr == null){
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if(seatIndex == null){
        return null;
    }

    if(agree){
        roomInfo.dr.states[seatIndex] = true;
    }
    else{
        roomInfo.dr = null;
        var idx = dissolvingList.indexOf(roomId);
        if(idx != -1){
            dissolvingList.splice(idx,1);           
        }
    }
    return roomInfo;
};



function update() {
     
    for(var i = dissolvingList.length - 1; i >= 0; --i){
        var roomId = dissolvingList[i];
        
        var roomInfo = roomMgr.getRoom(roomId);
        if(roomInfo != null && roomInfo.dr != null){
            if(Date.now() > roomInfo.dr.endTime){
                console.log("delete room and games");
                exports.doDissolve(roomId);
                dissolvingList.splice(i,1); 
            }
        }
        else{
            dissolvingList.splice(i,1);
        }
    }
}
 
setInterval(update,1000);

