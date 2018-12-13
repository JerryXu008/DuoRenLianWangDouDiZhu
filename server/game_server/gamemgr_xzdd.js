var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");
var mjutils = require('./mjutils');
var db = require("../utils/db");
var crypto = require("../utils/crypto");
var games = {};
var gamesIdBase = 0;

var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_HU = 5;
var ACTION_ZIMO = 6;

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
    
    var mahjongs = game.mahjongs;

	/*
    var idx = 0;
    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 0;
    }

    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 1;
    }

    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 2;
    }

    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 3;
    }


    for(var i = idx; i < game.mahjongs.length; ++i){
        game.mahjongs[i] = 4;
    }
    return;
    */

    //筒 (0 ~ 8 表示筒子
    var index = 0;
    for(var i = 0; i < 9; ++i){
        for(var c = 0; c < 4; ++c){
            mahjongs[index] = i;
            index++;
        }
    }

    //条 9 ~ 17表示条子
    for(var i = 9; i < 18; ++i){
        for(var c = 0; c < 4; ++c){
            mahjongs[index] = i;
            index++;
        }
    }

    //万
    //条 18 ~ 26表示万
    for(var i = 18; i < 27; ++i){
        for(var c = 0; c < 4; ++c){
            mahjongs[index] = i;
            index++;
        }
    }
    
    //洗牌，打乱顺序
    for(var i = 0; i < mahjongs.length; ++i){
        var lastIndex = mahjongs.length - 1 - i;
        var index = Math.floor(Math.random() * lastIndex);
        var t = mahjongs[index];
        mahjongs[index] = mahjongs[lastIndex];
        mahjongs[lastIndex] = t;
    }
}
/*
  0  1 2 3 4 5 6 7 8     9 10 11 12 13 14 15 16 17    18 19 20 21 22 23 24 25 26  
  0  1 2 3 4 5 6 7 8     9 10 11 12 13 14 15 16 17    18 19 20 21 22 23 24 25 26  
  0  1 2 3 4 5 6 7 8     9 10 11 12 13 14 15 16 17    18 19 20 21 22 23 24 25 26  
  0  1 2 3 4 5 6 7 8     9 10 11 12 13 14 15 16 17    18 19 20 21 22 23 24 25 26  
*/

function mopai(game,seatIndex) {
    if(game.currentIndex == game.mahjongs.length){
        return -1;
    }
    var data = game.gameSeats[seatIndex];
    var mahjongs = data.holds;//所要发给的牌
    var pai = game.mahjongs[game.currentIndex];
    mahjongs.push(pai);

    //统计牌的数目 ，用于快速判定（空间换时间）
    var c = data.countMap[pai];
    if(c == null) {
        c = 0;
    }
    data.countMap[pai] = c + 1;
    game.currentIndex ++;
    return pai;
}

function deal(game){
    // //强制清0
    // game.currentIndex = 0;

    // //每人13张 一共 13*4 ＝ 52张 庄家多一张 53张
    // var seatIndex = game.button;
    // for(var i = 0; i < 52; ++i){
    //     var mahjongs = game.gameSeats[seatIndex].holds;
    //     if(mahjongs == null){
    //         mahjongs = [];
    //         game.gameSeats[seatIndex].holds = mahjongs;
    //     }
    //     mopai(game,seatIndex);
    //     seatIndex ++;
    //     seatIndex %= 4;
    // }
    // //庄家多摸最后一张
    // mopai(game,game.button);
    // //当前轮设置为庄家
    // game.turn = game.button;//默认为0


//和牌测试
game.currentIndex = 0;
game.gameSeats[1].holds=[0,0,0,1,1,1,2,2,2,3,3,3,6];
game.gameSeats[0].holds=[0,1,2,3,4,4,4,4,5,5,5,5,9];
// game.gameSeats[2].holds=[6,6,6,6,7,7,7,7,8,8,8,8,9];
//game.gameSeats[3].holds=[10,10,10,10,11,11,11,11,12,12,12,12,9];
 game.gameSeats[2].holds=[];
game.gameSeats[3].holds=[];

game.gameSeats[1].countMap[0]=3;
game.gameSeats[1].countMap[1]=3;
game.gameSeats[1].countMap[2]=3;
game.gameSeats[1].countMap[6]=1;
game.gameSeats[1].countMap[3]=3;

game.gameSeats[0].countMap[0]=1;
game.gameSeats[0].countMap[1]=1;
game.gameSeats[0].countMap[2]=1;
game.gameSeats[0].countMap[3]=1;
game.gameSeats[0].countMap[4]=4;
game.gameSeats[0].countMap[5]=4;
game.gameSeats[0].countMap[9]=1;


 //强制清0
    //  ` game.currentIndex = 0;
    //   game.gameSeats[0].holds=[0,3,3,3,1,1,1,1,2,2,2,2,9];
    //   game.gameSeats[1].holds=[0,0,0,3,4,4,4,4,5,5,5,5,9];
    //  // game.gameSeats[2].holds=[6,6,6,6,7,7,7,7,8,8,8,8,9];
    //   //game.gameSeats[3].holds=[10,10,10,10,11,11,11,11,12,12,12,12,9];
    //    game.gameSeats[2].holds=[];
    //   game.gameSeats[3].holds=[];

    //   game.gameSeats[0].countMap[0]=1;
    //   game.gameSeats[0].countMap[1]=4;
    //   game.gameSeats[0].countMap[2]=4;
    //   game.gameSeats[0].countMap[9]=1;
    //   game.gameSeats[0].countMap[3]=3;

    //   game.gameSeats[1].countMap[0]=3;
    //   game.gameSeats[1].countMap[3]=1;
    //   game.gameSeats[1].countMap[4]=4;
    //   game.gameSeats[1].countMap[5]=4;
    //   game.gameSeats[1].countMap[9]=1;



    //   game.gameSeats[2].countMap[6]=4;
    //   game.gameSeats[2].countMap[7]=4;
    //   game.gameSeats[2].countMap[8]=4;
    //   game.gameSeats[2].countMap[9]=1;

    //   game.gameSeats[3].countMap[10]=4;
    //   game.gameSeats[3].countMap[11]=4;
    //   game.gameSeats[3].countMap[12]=4;
    //   game.gameSeats[3].countMap[9]=1;

      for( var i=0; i<game.mahjongs.length;i++)
      {
          if(game.mahjongs[i]==0||game.mahjongs[i]==1||game.mahjongs[i]==2||
            game.mahjongs[i]==3||game.mahjongs[i]==4||game.mahjongs[i]==5||
            game.mahjongs[i]==6||game.mahjongs[i]==7||game.mahjongs[i]==8||
            game.mahjongs[i]==9||game.mahjongs[i]==10||game.mahjongs[i]==11||
            game.mahjongs[i]==12){

                game.mahjongs.splice(i, 1);
            }
     }
     
     game.currentIndex=52;

//庄家多摸最后一张
//mopai(game,game.button);

//test 让庄家胡牌
var data = game.gameSeats[0];
var mahjongs = data.holds;//所要发给的牌
mahjongs.push(9);
data.countMap[9] = 1 + 1;
game.currentIndex ++;



//当前轮设置为庄家
game.turn = game.button;//默认为0


/*
                 13 14 15 16 17    18 19 20 21 22 23 24 25 26  
                 13 14 15 16 17    18 19 20 21 22 23 24 25 26  
                 13 14 15 16 17    18 19 20 21 22 23 24 25 26  
                  13 14 15 16 17    18 19 20 21 22 23 24 25 26  
*/



     






}

//检查是否可以碰
function checkCanPeng(game,seatData,targetPai) {
    if(getMJType(targetPai) == seatData.que){
        return;
    }
    var count = seatData.countMap[targetPai];
    if(count != null && count >= 2){
        seatData.canPeng = true;
    }
}

//检查是否可以点杠
function checkCanDianGang(game,seatData,targetPai){
    //检查玩家手上的牌
    //如果没有牌了，则不能再杠
    if(game.mahjongs.length <= game.currentIndex){
        return;
    }
    if(getMJType(targetPai) == seatData.que){
        return;
    }
    var count = seatData.countMap[targetPai];
    if(count != null && count >= 3){
        seatData.canGang = true;
        seatData.gangPai.push(targetPai);
        return;
    }
}

//检查是否可以暗杠
function checkCanAnGang(game,seatData){
    //如果没有牌了，则不能再杠
    if(game.mahjongs.length <= game.currentIndex){
        return;
    }

    for(var key in seatData.countMap){
        var pai = parseInt(key);
        if(getMJType(pai) != seatData.que){
            var c = seatData.countMap[key];
            if(c != null && c == 4){
                seatData.canGang = true;
                seatData.gangPai.push(pai);
            }
        }
    }
}

//检查是否可以弯杠(自己摸起来的时候)
function checkCanWanGang(game,seatData){
    //如果没有牌了，则不能再杠
    if(game.mahjongs.length <= game.currentIndex){
        return;
    }

    //从碰过的牌中选
    for(var i = 0; i < seatData.pengs.length; ++i){
        var pai = seatData.pengs[i];
        if(seatData.countMap[pai] == 1){
            seatData.canGang = true;
            seatData.gangPai.push(pai);
        }
    }
}

function checkCanHu(game,seatData,targetPai) {
    game.lastHuPaiSeat = -1;
    if(getMJType(targetPai) == seatData.que){
        return;
    }
    seatData.canHu = false;
    for(var k in seatData.tingMap){//如果最后一张牌在 听牌的候选牌里面，就可以胡
        if(targetPai == k){
            seatData.canHu = true;
        }
    }
}

function clearAllOptions(game,seatData){
    var fnClear = function(sd){
        sd.canPeng = false;
        sd.canGang = false;
        sd.gangPai = [];
        sd.canHu = false;
        sd.lastFangGangSeat = -1;    
    }
    if(seatData){
        fnClear(seatData);
    }
    else{
        game.qiangGangContext = null;
        for(var i = 0; i < game.gameSeats.length; ++i){
            fnClear(game.gameSeats[i]);
        }
    }
}



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

function hasOperations(seatData){
    if(seatData.canGang || seatData.canPeng || seatData.canHu){
        return true;
    }
    return false;
}
//控制客户端显示硼钢户 选项的操作
function sendOperations(game,seatData,pai) {
    if(hasOperations(seatData)){
        if(pai == -1){
            pai = seatData.holds[seatData.holds.length - 1];
        }
        
        var data = {
            pai:pai,
            hu:seatData.canHu,
            peng:seatData.canPeng,
            gang:seatData.canGang,
            gangpai:seatData.gangPai
        };

        //如果可以有操作，则进行操作
        userMgr.sendMsg(seatData.userId,'game_action_push',data);

        data.si = seatData.seatIndex;
    }
    else{//没有达到 杠，碰，胡的条件，那么发送null
        userMgr.sendMsg(seatData.userId,'game_action_push');
    }
}

function moveToNextUser(game,nextSeat){
    game.fangpaoshumu = 0;
    //找到下一个没有和牌的玩家
    if(nextSeat == null){
        while(true){
           // game.turn ++;
           // game.turn %= 4;
           if(game.turn==0) game.turn=1;
           else if(game.turn==1) game.turn=0;  

            var turnSeat = game.gameSeats[game.turn];
            if(turnSeat.hued == false){
                return;
            }
        }
    }
    else{
        game.turn = nextSeat;
    }
}

function doUserMoPai(game){
    game.chuPai = -1;//摸牌之前，出牌重置了
    var turnSeat = game.gameSeats[game.turn];
    // 重新摸牌了，上次放杠的庄稼清空
    turnSeat.lastFangGangSeat = -1;
    turnSeat.guoHuFan = -1;
   
    var pai = mopai(game,game.turn);
    //牌摸完了，结束
    if(pai == -1){
        doGameOver(game,turnSeat.userId);
        return;
    }
    else{
        //剩余多少牌
        var numOfMJ = game.mahjongs.length - game.currentIndex;
        userMgr.broacastInRoom('mj_count_push',numOfMJ,turnSeat.userId,true);
    }
    //记录玩家本次操作
    recordGameAction(game,game.turn,ACTION_MOPAI,pai);

    //通知前端新摸的牌，只通知当前人
    console.log("通知前端新摸的牌，只通知当前人");
    userMgr.sendMsg(turnSeat.userId,'game_mopai_push',pai);//是当前应该摸牌的玩家客户端显示那张刚摸的牌
    //检查是否可以暗杠或者胡
    //检查胡，直杠，弯杠
     checkCanAnGang(game,turnSeat);
     //已经碰了三张牌,自己摸到第四张,杠出
     checkCanWanGang(game,turnSeat,pai);

     //检查看是否可以和
     checkCanHu(game,turnSeat,pai);

    //广播通知玩家出牌方
    turnSeat.canChuPai = true;
    //把当前出牌的轮次传到客户端，控制各个客户端的第14牌的显示和隐藏
    //TimperPoint.js组建也会收到通知，用于箭头指向
    userMgr.broacastInRoom('game_chupai_push',turnSeat.userId,turnSeat.userId,true);

    //通知玩家显示 碰杠胡
    sendOperations(game,turnSeat,game.chuPai);
}

function isSameType(type,arr){
    for(var i = 0; i < arr.length; ++i){
        var t = getMJType(arr[i]);
        if(type != -1 && type != t){
            return false;
        }
        type = t;
    }
    return true; 
}

function isQingYiSe(gameSeatData){
    var type = getMJType(gameSeatData.holds[0]);

    //检查手上的牌
    if(isSameType(type,gameSeatData.holds) == false){
        return false;
    }

    //检查杠下的牌
    if(isSameType(type,gameSeatData.angangs) == false){
        return false;
    }
    if(isSameType(type,gameSeatData.wangangs) == false){
        return false;
    }
    if(isSameType(type,gameSeatData.diangangs) == false){
        return false;
    }

    //检查碰牌
    if(isSameType(type,gameSeatData.pengs) == false){
        return false;
    }
    return true;
}

function isMenQing(gameSeatData){
    return (gameSeatData.pengs.length + gameSeatData.wangangs.length + gameSeatData.diangangs.length) == 0;
}

function isZhongZhang(gameSeatData){
    var fn = function(arr){
        for(var i = 0; i < arr.length; ++i){
            var pai = arr[i];
            if(pai == 0 || pai == 8 || pai == 9 || pai == 17 || pai == 18 || pai == 26){
                return false;
            }
        }
        return true;
    }
    
    if(fn(gameSeatData.pengs) == false){
        return false;
    }
    if(fn(gameSeatData.angangs) == false){
        return false;
    }
    if(fn(gameSeatData.diangangs) == false){
        return false;
    }
    if(fn(gameSeatData.wangangs) == false){
        return false;
    }
    if(fn(gameSeatData.holds) == false){
        return false;
    }
    return true;
}

function isJiangDui(gameSeatData){
    var fn = function(arr){
        for(var i = 0; i < arr.length; ++i){
            var pai = arr[i];
            if(pai != 1 && pai != 4 && pai != 7
               && pai != 9 && pai != 13 && pai != 16
               && pai != 18 && pai != 21 && pai != 25
               ){
                return false;
            }
        }
        return true;
    }
    
    if(fn(gameSeatData.pengs) == false){
        return false;
    }
    if(fn(gameSeatData.angangs) == false){
        return false;
    }
    if(fn(gameSeatData.diangangs) == false){
        return false;
    }
    if(fn(gameSeatData.wangangs) == false){
        return false;
    }
    if(fn(gameSeatData.holds) == false){
        return false;
    }
    return true;
}

function isTinged(seatData){
    for(var k in seatData.tingMap){
        return true;
    }
    return false;
}

function computeFanScore(game,fan){
    if(fan > game.conf.maxFan){
        fan = game.conf.maxFan;
    }
    return (1 << fan) * game.conf.baseScore;
}

//是否需要查大叫(有两家以上未胡，且有人没有下叫)
function needChaDaJiao(game){
    //查叫
    var numOfHued = 0;
    var numOfTinged = 0;
    var numOfUntinged = 0;
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ts = game.gameSeats[i];
        if(ts.hued){
            numOfHued ++;
            numOfTinged++;
        }
        else if(isTinged(ts)){
            numOfTinged++;
        }
        else{
            numOfUntinged++;
        }
    }
   
    //如果三家都胡牌了，不需要查叫
    if(numOfHued == 3){
        return false;
    }
    
    //如果没有任何一个人叫牌，也没有任何一个胡牌，则不需要查叫
    if(numOfTinged == 0){
        return false;
    }
    
    //如果都听牌了，也不需要查叫
    if(numOfUntinged == 0){
        return false;
    }
    return true;
}

function findMaxFanTingPai(ts){
    //找出最大番
    var cur = null;
    for(var k in ts.tingMap){
        var tpai = ts.tingMap[k];
        if(cur == null || tpai.fan > cur.fan){
            cur = tpai;
        }
    }
    return cur;
}

function findUnTingedPlayers(game){
    var arr = [];
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ts = game.gameSeats[i];
        //如果没有胡，且没有听牌
        if(!ts.hued && !isTinged(ts)){
            arr.push(i);
            //没有胡没有听牌的  被查叫
            recordUserAction(game,ts,"beichadajiao",-1);
        }
    }
    return arr;
}

function chaJiao(game){
    var arr = findUnTingedPlayers(game);
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ts = game.gameSeats[i];
        //如果没有胡，但是听牌了，则未叫牌的人要给钱
        if(!ts.hued && isTinged(ts)){
            var cur = findMaxFanTingPai(ts);
            ts.fan = cur.fan;//没有胡牌，只是听牌的玩家，保存最大番
            ts.pattern = cur.pattern;
            //ts查叫 所有 没有停牌的人
            recordUserAction(game,ts,"chadajiao",arr);
        }
    }
}

function calculateResult(game,roomInfo){
    //查叫
    /*
    查大叫
　 　没听牌的玩家（花猪不用）赔给听牌的玩家最大的可能番（大叫），并退回所有刮风下雨所得。
    */
    var isNeedChaDaJia = needChaDaJiao(game);
    if(isNeedChaDaJia){
        // //如果没有胡，但是听牌了，则未叫牌的人要给钱
        chaJiao(game);
    }
    
    var baseScore = game.conf.baseScore;//底分
    var numOfHued = 0;
    for(var i = 0; i < game.gameSeats.length; ++i){
        if(game.gameSeats[i].hued == true){
            numOfHued++;
        }
    }
    
    for(var i = 0; i < game.gameSeats.length; ++i){
        var sd = game.gameSeats[i];
        
        //统计杠的数目
        sd.numAnGang = sd.angangs.length;
        sd.numMingGang = sd.wangangs.length + sd.diangangs.length;
        
        //对所有胡牌的玩家进行统计,
        //补充，还有听牌玩家
        /*************************************  
         * 感觉这里是有bug的，下面的判断如清一色，
         * 金钩胡等吧听牌未胡牌的也算进去了，这是不对的，暂时不改了
         * ***********************************/
        

        if(isTinged(sd)){
            //统计自己的番子和分数
            //基础番(平胡0番，对对胡1番、七对2番) + 清一色2番 + 杠+1番
            //杠上花+1番，杠上炮+1番 抢杠胡+1番，金钩胡+1番，海底胡+1番
            var fan = sd.fan;
            
            /*清一色 *///我怎么感觉 这里吧 听牌但没有胡牌的玩家 也算进去了
            if(isQingYiSe(sd)){//看看是不是清一色（胡牌的时候是一个花色）
                sd.qingyise = true;
                fan += 2;
            }
             /*'杠' 的统计，*/
            var numOfGangs = sd.diangangs.length + sd.wangangs.length + sd.angangs.length;
            for(var j = 0; j < sd.pengs.length; ++j){
                var pai = sd.pengs[j];
                if(sd.countMap[pai] == 1){
                    numOfGangs++;
                }
            }
            for(var k in sd.countMap){
                if(sd.countMap[k] == 4){
                    numOfGangs++;
                }
            }
            //带根：杠或四张未杠出的相同的牌，每一根翻倍。
            sd.numofgen = numOfGangs;
            
            /*金钩胡 */ ////我怎么感觉 这里吧 听牌但没有胡牌的玩家 也算进去了
            /*
            麻将的一般牌型是四个副、一个对。这个对子称为“将”。如果已经凑好四个副，而将只有一张，碰到这一张就胡牌的听牌方式，叫做“单钓将”。
            */

            if(sd.holds.length == 1 || sd.holds.length == 2){
                fan += 1;
                sd.isJinGouHu = true;
            }
            /*海底胡 */ 
            if(sd.isHaiDiHu){ 
                fan += 1;
            }
             /*天地胡 */ 
            if(game.conf.tiandihu){
                if(sd.isTianHu){
                    fan += 3;
                }
                else if(sd.isDiHu){
                    fan += 2;
                }
            }
            
            var isjiangdui = false;
            /*
            将对：就是每列牌都是258
             例如222万，555万，222筒，888筒，88万，其实将对也是大对子中的一种
            */
            if(game.conf.jiangdui){//如果允许将对
                if(sd.pattern == "7pairs"){
                    if(sd.numofgen > 0){
                       /*
                       龙七对，玩家手牌为暗七对牌型，没有碰过或者杠过
                       ，并且有四张牌是一样的，叫龙七对。不再计七对，同时减1根。如11222244筒557799万
                       */
                        sd.numofgen -= 1;
                        sd.pattern == "l7pairs";//胡牌里面有一杠牌，那么就是龙七对
                        isjiangdui = isJiangDui(sd);//将七对
                        if(isjiangdui){
                            sd.pattern == "j7paris";
                            fan += 2;    
                        }   
                        else{
                            fan += 1;
                        }
                    }
                }
                else if(sd.pattern == "duidui"){
                    isjiangdui = isJiangDui(sd);
                    if(isjiangdui){
                        sd.pattern = "jiangdui";
                        fan += 2;   
                    }
                }   
            }
            /*
            门清：不吃不碰，全靠自己摸的牌，糊了就叫门清，其实四川麻将没有门清这个说法，全凭自己摸的暗七对，就是一种门清
            中张：又叫卡张，3万5万听4万，这个四万就是中张
            */
             /*****门清 中张********/
            if(game.conf.menqing){
                //不是将对，才检查中张
                if(!isjiangdui){
                    sd.isZhongZhang = isZhongZhang(sd);
                    if(sd.isZhongZhang){
                        fan += 1;
                    }                
                }
                
                sd.isMenQing = isMenQing(sd);
                if(sd.isMenQing){
                    fan += 1;
                }                
            }


            
            fan += sd.numofgen;//统计出的跟数 加到番里面，1根是1番
            
            /*****杠胡********/
            if(sd.isGangHu){
                fan += 1;
            }
            /*****抢杠胡********/
            if(sd.isQiangGangHu){
                fan += 1;
            }

            //收杠钱
            var additonalscore = 0;
            for(var a = 0; a < sd.actions.length; ++a){
                var ac = sd.actions[a];
                //这个好像没什么作用
                if(ac.type == "fanggang"){//放杠 UserA出牌，USerB杠，UserA.tagert=UserB,UserA放杠
                    var ts = game.gameSeats[ac.targets[0]];//放杠只能是一个
                    //检查放杠的情况，如果目标没有和牌，且没有叫牌，则不算 用于优化前端显示
                    if(isNeedChaDaJia && (ts.hued) == false && (isTinged(ts) == false)){
                        ac.state = "nop";
                    }
                }
             
               //杠牌不是通过番数计算的，在杠牌后会立即收取
                else if(ac.type == "angang" || ac.type == "wangang" || ac.type == "diangang"){
                    if(ac.state != "nop"){//nop一般就是
                        var acscore = ac.score;
                        //自己得这些分数
                        additonalscore += ac.targets.length * acscore * baseScore;
                        //扣掉目标方的分
                        for(var t = 0; t < ac.targets.length; ++t){
                            var six = ac.targets[t];//座位索引
                            game.gameSeats[six].score -= acscore * baseScore;
                        }                   
                    }
                }

                else if(ac.type == "maozhuanyu"){//毛转雨 
                    //对于呼叫转移，如果对方没有叫牌，表示不得行
                    if(isTinged(ac.owner)){
                        //如果
                        var ref = ac.ref;
                        
                        /* 
                          刮风下雨所得的分数都给 杠上炮胡牌的人,
                          这些分数在胡牌之前已经计算好了，所以total就是全部的刮风下雨分数
                          */
                        var acscore = ref.score;//刮风下雨所得的分数都给 杠上炮胡牌的人
                        var total = ref.targets.length * acscore * baseScore;
                        additonalscore += total;//
                        //扣掉目标方的分
                        if(ref.payTimes == 0){
                            for(var t = 0; t < ref.targets.length; ++t){
                                var six = ref.targets[t];
                                game.gameSeats[six].score -= acscore * baseScore;
                            }                            
                        }
                        else{ //一炮多响，若杠后点炮超过一响，点炮者要另赔出刚杠所得的点数给被点者。
                            //如果已经被扣过一次了，则由杠牌这家赔
                            ac.owner.score -= total;
                        }
                        ref.payTimes++;
                        ac.owner = null;
                        ac.ref = null;
                    }
                }
                //以下这几个动作，除了 chadajiao，其余的都分 自摸和不自摸
                //属于除了胡牌之外的另加番
                else if(ac.type == "zimo" ||  //胡
                  ac.type == "hu" || //胡
                  ac.type == "ganghua" ||//杠上开花 胡
                  ac.type == "dianganghua" || //点杠话自摸或点杠话放炮 胡
                  ac.type == "gangpaohu" || //杠上炮 胡牌 胡
                  ac.type == "qiangganghu" || //抢杠胡 胡
                  ac.type == "chadajiao"){//查叫  听，但是不胡
                    var extraScore = 0;
                    if(ac.iszimo){
                        /*
                        自摸加底：当是自摸时，在原有牌积分计算的基础上，
                        再加一个底分；比如，自摸小屁胡，就是每家给1＋1＝2的底分
                        */
                        if(game.conf.zimo == 0){
                            //自摸家底
                            extraScore = baseScore;
                        }
                        if(game.conf.zimo == 1){
                            //自摸加番
                            fan += 1;
                        }
                        else{
                            //nothing.
                        }
                        sd.numZiMo ++;
                    }
                    else{//不是自摸，也不是查大叫，查大叫的是听牌但不胡牌，所以不存在借炮
                        if(ac.type != "chadajiao"){//这个动作不是自摸，也不是查大叫，那就是  借炮
                            sd.numJiePao ++; 
                        }
                    }


                    //前面 番数 和 addtionScore都算好了，开始计算总分数
                    //通过番数计算分数
                    var score = computeFanScore(game,fan) + extraScore;
                    
                    sd.score += score * ac.targets.length;
                    
                    for(var t = 0; t < ac.targets.length; ++t){
                        var six = ac.targets[t];
                        var td = game.gameSeats[six]; 
                        /*
                        查大叫没听牌的玩家（花猪不用）赔给听牌的玩家最大的可能番（大叫），并退回所有刮风下雨所得。
                        */
                        td.score -= score;
                        if(td != sd){
                            if(ac.type == "chadajiao"){
                                td.numChaJiao ++;//这里应该是被查叫的数目
                            }
                            else if(!ac.iszimo){
                                td.numDianPao ++;////这个动作不是自摸，也不是查大叫，那就是  点炮
                            }                            
                        }
                    }
                }
            }//收杠钱结束

           
          

            if(fan > game.conf.maxFan){
                fan = game.conf.maxFan;
            }
            //一定要用 += 。 因为此时的sd.score可能是负的
            sd.score += additonalscore;
            if(sd.pattern != null){
                sd.fan = fan;
            }
        }
        else{//没有听牌的玩家
            for(var a = sd.actions.length -1; a >= 0; --a){
                var ac = sd.actions[a];
                if(ac.type == "angang" || ac.type == "wangang" || ac.type == "diangang"){
                    //如果3家都胡牌，则需要结算。否则认为是查叫
                    //被查叫，刮风下雨所得无效
                    //因为在杠的时候ac.score会加上相应的分数，这里如果被查叫，ac被移除，ac.score不会被加到sd.score中
                    if(numOfHued < 3){
                        sd.actions.splice(a,1);                        
                    }
                    else{
                        if(ac.state != "nop"){//nop的情况有：sd被毛转雨的动作，那么刮风下雨无效
                            var acscore = ac.score;
                            sd.score += ac.targets.length * acscore * baseScore;
                            //扣掉目标方的分
                            for(var t = 0; t < ac.targets.length; ++t){
                                var six = ac.targets[t];
                                game.gameSeats[six].score -= acscore * baseScore;
                            }                   
                        }   
                    }
                }
            }
        }
    }
}






//退出函数
function doGameOver(game,userId,forceEnd){
    var roomId = roomMgr.getUserRoom(userId);
    if(roomId == null){
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return;
    }

    var results = [];
    var dbresult = [0,0,0,0];
    
    var fnNoticeResult = function(isEnd){
        var endinfo = null;
        if(isEnd){
            endinfo = [];
            for(var i = 0; i < roomInfo.seats.length; ++i){
                var rs = roomInfo.seats[i];
                endinfo.push({
                    numzimo:rs.numZiMo,
                    numjiepao:rs.numJiePao,
                    numdianpao:rs.numDianPao,
                    numangang:rs.numAnGang,
                    numminggang:rs.numMingGang,
                    numchadajiao:rs.numChaJiao, 
                });
            }   
        }
         
        userMgr.broacastInRoom('game_over_push',{results:results,endinfo:endinfo},userId,true);
        //如果局数已够，则进行整体结算，并关闭房间，
        
        if(isEnd){
            setTimeout(function(){
                if(roomInfo.numOfGames > 1){
                    //记录每个玩家又参与过哪些 牌局历史
                    store_history(roomInfo);    
                }
                
                userMgr.kickAllInRoom(roomId);
                roomMgr.destroy(roomId);
                //保存到成绩表
                db.archive_games(roomInfo.uuid);            
            },1500);
        }
    }

    if(game != null){
        if(!forceEnd){
            calculateResult(game,roomInfo);    
        }
       
        for(var i = 0; i < roomInfo.seats.length; ++i){
            var rs = roomInfo.seats[i];
            var sd = game.gameSeats[i];

            rs.ready = false;//准备为false
            rs.score += sd.score;
            rs.numZiMo += sd.numZiMo;//自摸
            rs.numJiePao += sd.numJiePao;//借炮
            rs.numDianPao += sd.numDianPao;//点炮
            rs.numAnGang += sd.numAnGang;//暗杠
            rs.numMingGang += sd.numMingGang;//明杠
            rs.numChaJiao += sd.numChaJiao;//被查叫
            
            var userRT = {
                userId:sd.userId,
                pengs:sd.pengs,
                actions:[],
                wangangs:sd.wangangs,
                diangangs:sd.diangangs,
                angangs:sd.angangs,
                numofgen:sd.numofgen,//根
                holds:sd.holds,
                fan:sd.fan,
                score:sd.score,
                totalscore:rs.score,//总分数
                qingyise:sd.qingyise,//清一色
                pattern:sd.pattern,//胡牌模式
                isganghu:sd.isGangHu,
                menqing:sd.isMenQing,
                zhongzhang:sd.isZhongZhang,
                jingouhu:sd.isJinGouHu,
                haidihu:sd.isHaiDiHu,
                tianhu:sd.isTianHu,
                dihu:sd.isDiHu,
                huorder:game.hupaiList.indexOf(i),//胡牌顺序，对于玩家来说是第几个胡德
            };
            
            for(var k in sd.actions){
                userRT.actions[k] = {
                    type:sd.actions[k].type,
                };
            }
            results.push(userRT);

            dbresult[i] = sd.score;//其中一局的分数数组
            delete gameSeatsOfUsers[sd.userId];//清空数据
        }
        //虽然games移除了这个元素，但是 参数game作为临时变量仍然引用着那块内存，所以后面game可以继续使用
        delete games[roomId];//删除本局游戏
        
        var old = roomInfo.nextButton;
        if(game.yipaoduoxiang >= 0){
            roomInfo.nextButton = game.yipaoduoxiang;//多次放炮的人为庄
        }
        else if(game.firstHupai >= 0){
            roomInfo.nextButton = game.firstHupai;//第一次胡牌的人为庄
        }
        else{
            roomInfo.nextButton = (game.turn + 1) % 4;//轮次下一个为庄
        }
 
         if(old != roomInfo.nextButton){//保存到数据库
             db.update_next_button(roomId,roomInfo.nextButton);
         }
         
         
    }
    
    if(forceEnd || game == null){
        fnNoticeResult(true);   
    }
    else{  
        fnNoticeResult(false);
        //保存游戏
        store_game(game,function(ret){
            //参数 房间uuid game第几局 ，分数数组
            db.update_game_result(roomInfo.uuid,game.gameIndex,dbresult);
            
            //记录打牌信息
            var str = JSON.stringify(game.actionList);
            db.update_game_action_records(roomInfo.uuid,game.gameIndex,str);
        
            //保存游戏局数
            db.update_num_of_turns(roomId,roomInfo.numOfGames);
            
            //如果是第一次，并且不是强制解散 则扣除房卡
            if(roomInfo.numOfGames == 1){
                var cost = 2;
                if(roomInfo.conf.maxGames == 8){
                    cost = 3;
                }
                db.cost_gems(game.gameSeats[0].userId,cost);
            }

            var isEnd = (roomInfo.numOfGames >= roomInfo.conf.maxGames);
            fnNoticeResult(isEnd);
        });   
    }
}










//game,seatData,"wangang"
//game,seatData,"angang"
//game,seatData,"diangang",gameTurn
//game,fs,"fanggang",seatIndex
//game,seatData,hu,game.turn
//game,ts,"beichadajiao",-1
//应该是记分用的，比如A 暗杠，那么BCD都要给她钱，tarets要记录
function recordUserAction(game,seatData,type,target){
    var d = {type:type,targets:[]};
    if(target != null){
        if(typeof(target) == 'number'){
            d.targets.push(target);    
        }
        else{
            d.targets = target;
        }
    }
    else{
        for(var i = 0; i < game.gameSeats.length; ++i){
            var s = game.gameSeats[i];
            if(i != seatData.seatIndex && s.hued == false){
                d.targets.push(i);
            }
        }        
    }

    seatData.actions.push(d);
    return d;
}

function recordGameAction(game,si,action,pai){
    game.actionList.push(si);
    game.actionList.push(action);
    if(pai != null){
        game.actionList.push(pai);
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
        if(roomInfo.seats.length == 4){
            //暂时屏蔽
           // for(var i = 0; i < roomInfo.seats.length; ++i){
            for(var i = 0; i < 2; ++i){
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
        var numOfMJ = game.mahjongs.length - game.currentIndex;
        var remainingGames = roomInfo.conf.maxGames - roomInfo.numOfGames;

        var data = {
            state:game.state,//游戏状态，定缺，游戏过程中 等
            numofmj:numOfMJ,//剩余多少麻将
            button:game.button,//庄稼
            turn:game.turn,//轮次
            chuPai:game.chuPai,//当前出的牌
            huanpaimethod:game.huanpaiMethod//以后再看
        };

        data.seats = [];
        var seatData = null;
        for(var i = 0; i < 4; ++i){
            var sd = game.gameSeats[i];

            var s = {
                userid:sd.userId,  
                folds:sd.folds,//打出去的牌
                angangs:sd.angangs,
                diangangs:sd.diangangs,
                wangangs:sd.wangangs,
                pengs:sd.pengs,
                que:sd.que,
                hued:sd.hued,
                iszimo:sd.iszimo,
            }
            if(sd.userId == userId){//如果是自己，把holds保存下
                s.holds = sd.holds;
                s.huanpais = sd.huanpais;
                seatData = sd;
            }
            else{
                s.huanpais = sd.huanpais? []:null;
            }
            data.seats.push(s);
        }

        //同步整个信息给客户端
        userMgr.sendMsg(userId,'game_sync_push',data);
        //看看是否能让自己碰杠胡
        sendOperations(game,seatData,game.chuPai);
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
        button:game.button,
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
							numZiMo:0,
							numJiePao:0,
							numDianPao:0,
							numAnGang:0,
							numMingGang:0,
							numChaJiao:0,
    */
    var seats = roomInfo.seats;//房间座位信息

    var game = {
        conf:roomInfo.conf,//玩法
        roomInfo:roomInfo,
        gameIndex:roomInfo.numOfGames,//第几局

        button:roomInfo.nextButton,//下一轮的庄稼，默认为0
        mahjongs:new Array(108),//川麻 牌数为108
        currentIndex:0,//当前的牌的索引
        gameSeats:new Array(4),

        numOfQue:0,
        turn:0,
        chuPai:-1,
        state:"idle",
        firstHupai:-1,
        yipaoduoxiang:-1,
        fangpaoshumu:-1,
        actionList:[],
        hupaiList:[],
        chupaiCnt:0,
    };

    roomInfo.numOfGames++;//局数加一

    for(var i = 0; i < 4; ++i){
        var data = game.gameSeats[i] = {};//游戏过程中座位信息

        data.game = game;

        data.seatIndex = i;

        data.userId = seats[i].userId;
        //持有的牌
        data.holds = [];
        //打出的牌
        data.folds = [];
        //暗杠的牌
        data.angangs = [];
        //点杠的牌
        data.diangangs = [];
        //弯杠的牌
        data.wangangs = [];
        //碰了的牌
        data.pengs = [];
        //缺一门
        data.que = -1;//定缺

        //换三张的牌
        data.huanpais = null;

        //玩家手上的牌的数目，用于快速判定碰杠，比如一桶多少张，字典
        data.countMap = {};
        //玩家听牌，用于快速判定胡了的番数
        data.tingMap = {};
        data.pattern = "";

        //是否可以杠
        data.canGang = false;
        //用于记录玩家可以杠的牌
        data.gangPai = [];

        //是否可以碰
        data.canPeng = false;
        //是否可以胡
        data.canHu = false;
        //是否可以出牌
        data.canChuPai = false;

        //如果guoHu>=0 表示处于过胡状态，
        //如果过胡状态，那么只能胡大于过胡番数的牌
        data.guoHuFan = -1;

        //是否胡了
        data.hued = false;
        //是否是自摸
        data.iszimo = false;

        data.isGangHu = false;

        //
        data.actions = [];

        data.fan = 0;//番数
        data.score = 0;//分数
        data.lastFangGangSeat = -1;
        
        //统计信息
        data.numZiMo = 0;
        data.numJiePao = 0;
        data.numDianPao = 0;
        data.numAnGang = 0;
        data.numMingGang = 0;
        data.numChaJiao = 0;

        gameSeatsOfUsers[data.userId] = data;
    }
    games[roomId] = game;
    //洗牌
    shuffle(game);
    //console.log("游戏洗牌");
    //发牌
    deal(game);
   // console.log("游戏发牌");
    
    //剩余未发牌的麻将数目
    var numOfMJ = game.mahjongs.length - game.currentIndex;
    
    //test
    roomInfo.conf.hsz=true;

    //换三张先不开
    var huansanzhang = roomInfo.conf.hsz;

    for(var i = 0; i < seats.length; ++i){
        //开局时，通知前端必要的数据
        var s = seats[i];
        //通知玩家手牌。每个玩家通知自己的手牌
        userMgr.sendMsg(s.userId,'game_holds_push',game.gameSeats[i].holds);//holds 数字数组
        //通知还剩多少张牌
        userMgr.sendMsg(s.userId,'mj_count_push',numOfMJ);
        //通知还剩多少局
        userMgr.sendMsg(s.userId,'game_num_push',roomInfo.numOfGames);
        //通知游戏开始，参数为哪个为庄稼
        userMgr.sendMsg(s.userId,'game_begin_push',game.button);

        if(huansanzhang == true){
            game.state = "huanpai";

            //通知准备换牌
            userMgr.sendMsg(s.userId,'game_huanpai_push');
        }
        else{//广播给每个人，开始定缺门
            game.state = "dingque";
            //通知准备定缺
            userMgr.sendMsg(s.userId,'game_dingque_push');
        }
    }
};

exports.huanSanZhang = function(userId,p1,p2,p3){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;
    if(game.state != "huanpai"){
        console.log("can't recv huansanzhang when game.state == " + game.state);
        return;
    }

    if(seatData.huanpais != null){
        console.log("player has done this action.");
        return;
    }

    if(seatData.countMap[p1] == null || seatData.countMap[p1] == 0){
        return;
    }
    seatData.countMap[p1]--;

    if(seatData.countMap[p2] == null || seatData.countMap[p2] == 0){
        seatData.countMap[p1]++;
        return;
    }
    seatData.countMap[p2]--;

    if(seatData.countMap[p3] == null || seatData.countMap[p3] == 0){
        seatData.countMap[p1]++;
        seatData.countMap[p2]++;
        return;
    }

    seatData.countMap[p1]++;
    seatData.countMap[p2]++;

    seatData.huanpais = [p1,p2,p3];
    
    for(var i = 0; i < seatData.huanpais.length; ++i){
        var p = seatData.huanpais[i];
        var idx = seatData.holds.indexOf(p);
        seatData.holds.splice(idx,1);
        seatData.countMap[p] --;
    }
    userMgr.sendMsg(seatData.userId,'game_holds_push',seatData.holds);
    
    for(var i = 0; i < game.gameSeats.length; ++i){
        var sd = game.gameSeats[i];
        if(sd == seatData){
            var rd = {
                si:seatData.userId,
                huanpais:seatData.huanpais
            };
            userMgr.sendMsg(sd.userId,'huanpai_notify',rd);            
        }
        else{
            var rd = {
                si:seatData.userId,
                huanpais:[]
            };
            userMgr.sendMsg(sd.userId,'huanpai_notify',rd);
        }
    }

    //如果还有未换牌的玩家，则继承等待
    for(var i = 0; i < game.gameSeats.length; ++i){
        if(game.gameSeats[i].huanpais == null){
            return;
        }
    }


    //换牌函数
    var fn = function(s1,huanjin){
        for(var i = 0; i < huanjin.length; ++i){
            var p = huanjin[i];
            s1.holds.push(p);
            if(s1.countMap[p] == null){
                s1.countMap[p] = 0;    
            }
            s1.countMap[p] ++;
        }
    }

    //开始换牌
    var f = Math.random();
    var s = game.gameSeats;
    var huanpaiMethod = 0;
    //对家换牌
    if(f < 0.33){
        fn(s[0],s[2].huanpais);
        fn(s[1],s[3].huanpais);
        fn(s[2],s[0].huanpais);
        fn(s[3],s[1].huanpais);
        huanpaiMethod = 0;
    }
    //换下家的牌
    else if(f < 0.66){
        fn(s[0],s[1].huanpais);
        fn(s[1],s[2].huanpais);
        fn(s[2],s[3].huanpais);
        fn(s[3],s[0].huanpais);
        huanpaiMethod = 1;
    }
    //换上家的牌
    else{
        fn(s[0],s[3].huanpais);
        fn(s[1],s[0].huanpais);
        fn(s[2],s[1].huanpais);
        fn(s[3],s[2].huanpais);
        huanpaiMethod = 2;
    }
    
    var rd = {
        method:huanpaiMethod,
    }
    game.huanpaiMethod = huanpaiMethod;

    game.state = "dingque";
    for(var i = 0; i < s.length; ++i){
        var userId = s[i].userId;
        userMgr.sendMsg(userId,'game_huanpai_over_push',rd);

        userMgr.sendMsg(userId,'game_holds_push',s[i].holds);
        //通知准备定缺
        userMgr.sendMsg(userId,'game_dingque_push');
    }
};

exports.dingQue = function(userId,type){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;
    if(game.state != "dingque"){ //必须是游戏状态为定缺才能继续
        console.log("can't recv dingQue when game.state == " + game.state);
        return;
    }

    if(seatData.que < 0){//没有定缺，定缺后数目加一
        game.numOfQue++;    
    }

    seatData.que = type;//把缺门保存下来
    

    //检查玩家可以做的动作
    //如果4个人都定缺了，通知庄家出牌
  // if(game.numOfQue == 4){//修改为1，用于测试打牌
    if(game.numOfQue == 2){
  
        construct_game_base_info(game);
        var arr = [1,1,1,1];
        for(var i = 0; i < game.gameSeats.length; ++i){
            arr[i] = game.gameSeats[i].que;
        }
        ////把4个座位的定缺状态发送到每个客户端
        userMgr.broacastInRoom('game_dingque_finish_push',arr,seatData.userId,true);
        //让4个客户端游戏状态变为playing
        userMgr.broacastInRoom('game_playing_push',null,seatData.userId,true);

        
        //进行听牌检查
        //牌局之中，到达了「只要再凑一张即可成功胡牌」的阶段，就叫「听牌」
        for(var i = 0; i < game.gameSeats.length; ++i){
            var duoyu = -1;
            var gs = game.gameSeats[i];
            if(gs.holds.length == 14){
                duoyu = gs.holds.pop();
                gs.countMap[duoyu] -= 1;
            }
            
            //看看开始的时候是否就能听牌 
            //为game.gameSeats.tingMap 添加东西，把所有摸一张新牌是否能胡牌的情况都统计了
            checkCanTingPai(game,gs);
            
            if(duoyu >= 0){
                gs.holds.push(duoyu);
                gs.countMap[duoyu] ++;
            }
        }
        
        var turnSeat = game.gameSeats[game.turn];
        game.state = "playing";
        //通知玩家出牌方
        turnSeat.canChuPai = true;//本轮的可以出牌 turn
        //把当前出牌的轮次传到客户端，控制各个客户端的第14牌的显示和隐藏
        //TimperPoint.js组建也会收到通知，用于箭头指向
        userMgr.broacastInRoom('game_chupai_push',turnSeat.userId,turnSeat.userId,true);
        //检查是否可以暗杠或者胡
        //直杠
        /*手上摸到四个相同的牌而开杠时，叫做暗杠下雨 */
        checkCanAnGang(game,turnSeat);
        //检查胡 用最后一张来检查
        checkCanHu(game,turnSeat,turnSeat.holds[turnSeat.holds.length - 1]);
        
        // //通知前端
        // console.log("出牌是多少="+game.chuPai);//开始的时候是-1
        // //这个之后再看
        ////控制客户端显示碰杠户 选项的操作
         sendOperations(game,turnSeat,game.chuPai);
    }
    else{//4人没有全部定缺，把本人的定缺结果推送给其他玩家
        userMgr.broacastInRoom('game_dingque_notify_push',seatData.userId,seatData.userId,true);
    }
};
//检查听牌
function checkCanTingPai(game,seatData){
    seatData.tingMap = {};
    
    //检查手上的牌是不是已打缺，如果未打缺，则不进行判定
    for(var i = 0; i < seatData.holds.length; ++i){
        var pai = seatData.holds[i];
        if(getMJType(pai) == seatData.que){
            return;
        }   
    }

    //检查是否是七对 前提是没有碰，也没有杠 ，即手上拥有13张牌
    if(seatData.holds.length == 13){
        //有5对牌
        var hu = false;
        var danPai = -1;
        var pairCount = 0;
        for(var k in seatData.countMap){
            var c = seatData.countMap[k];
            if( c == 2 || c == 3){
                pairCount++;
            }
            else if(c == 4){
                pairCount += 2;
            }

            if(c == 1 || c == 3){
                //如果已经有单牌了，表示不止一张单牌，并没有下叫。直接闪
                if(danPai >= 0){
                    break;
                }
                danPai = k;
            }
        }

        //检查是否有6对 并且单牌是不是目标牌
        if(pairCount == 6){
            //七对只能和一张，就是手上那张单牌
            //七对的番数＝ 2番+N个4个牌（即龙七对）
            seatData.tingMap[danPai] = {
                fan:2,
                pattern:"7pairs"
            };
            //如果是，则直接返回咯
        }
    }

    /*玩家的手牌除了一对将牌以外，剩下的牌都是三张一对的，一共四对，
    这样的牌型胡牌就叫做对对胡。牌型如：111333444万66677筒。 */
    //检查是否是对对胡  由于四川麻将没有吃，所以只需要检查手上的牌
    //对对胡叫牌有两种情况
    //1、N坎 + 1张单牌
    //2、N-1坎 + 两对牌
    var singleCount = 0;
    var colCount = 0;
    var pairCount = 0;
    var arr = [];
    for(var k in seatData.countMap){
        var c = seatData.countMap[k];
        if(c == 1){
            singleCount++;
            arr.push(k);
        }
        else if(c == 2){
            pairCount++;
            arr.push(k);
        }
        else if(c == 3){
            colCount++;
        }
        else if(c == 4){
            //手上有4个一样的牌，在四川麻将中是和不了对对胡的 随便加点东西
            singleCount++;
            pairCount+=2;
        }
    }

    if((pairCount == 2 && singleCount == 0) || (pairCount == 0 && singleCount == 1) ){
        for(var i = 0; i < arr.length; ++ i){
            //对对胡1番
            var p = arr[i];//arr数组里的牌，都可以满足对对胡
            if(seatData.tingMap[p] == null){
                seatData.tingMap[p] = {
                    pattern:"duidui",
                    fan:1
                };
            }
        }
    }

    //console.log(seatData.holds);
    //console.log(seatData.countMap);
    //console.log("singleCount:" + singleCount + ",colCount:" + colCount + ",pairCount:" + pairCount);
    //检查是不是平胡
    //就是没有碰和杠，只有顺的胡法。
     
    if(seatData.que != 0){//如果缺牌 不是筒
        mjutils.checkTingPai(seatData,0,9);   //把所有摸到新牌可能胡的情况都统计了     
    }

    if(seatData.que != 1){
        mjutils.checkTingPai(seatData,9,18);        
    }

    if(seatData.que != 2){
        mjutils.checkTingPai(seatData,18,27);        
    }
}



/*
出牌服务端和客户端交互逻辑：
1 客户端选中一个牌，然后走 chupai
2 服务端收到出牌socket，然后
   1 把当前seatData的 holds剔除出的牌
   2 推送game_chupai_notify_push，广播给所有人，把客户端对应的那张牌从数组删除，然后
     重新初始化自己和别人的页面排部，显示出的那张牌
   3 广播推送guo_notify_push，把出的那张牌同步到4个客户端中folds数组
   4 确定下一个turn
   5doUserMoPai ，此方法作用
      1 mopai，给当前摸牌的用户一张新牌
      2 推送剩余多少张牌
      3 game_mopai_push 单独推送给需要摸牌的用户，把新牌保存到folds，显示出第14张牌
      4 推送广播game_chupai_push，控制和显示各个客户端玩家的最新牌显示，这个方法和在begin定缺完毕之后一样,主要是
      是把turn传到客户端，以及控制各个玩家第14张牌的显示和隐藏
循环调用

*/
 
exports.chuPai = function(userId,pai){

    pai = Number.parseInt(pai);
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;
    var seatIndex = seatData.seatIndex;
    //如果不该他出，则忽略
    if(game.turn != seatData.seatIndex){
        console.log("not your turn.");
        return;
    }
    //胡牌不能出
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }

    if(seatData.canChuPai == false){
        console.log('no need chupai.');
        return;
    }
    //达到钢棚的条件了，不出牌
    if(hasOperations(seatData)){
        console.log('plz guo before you chupai.');
        return;
    }

    //从此人牌中扣除
    var index = seatData.holds.indexOf(pai);
    if(index == -1){
        console.log("holds:" + seatData.holds);
        console.log("can't find mj." + pai);
        return;
    }
    
    seatData.canChuPai = false;//不能出牌了
    game.chupaiCnt ++;//出牌数目加一
    seatData.guoHuFan = -1;
    


    seatData.holds.splice(index,1);//剔除这个牌
    seatData.countMap[pai] --;
    game.chuPai = pai;//出的牌，保存在全局game中


    //记录游戏动作
    recordGameAction(game,seatData.seatIndex,ACTION_CHUPAI,pai);
    //把在摸牌一张就和牌的纪录统计下
    checkCanTingPai(game,seatData);
   //广播给四个玩家，当前人出的牌，把四个座位的出牌座位的holds移除出的牌
   //并让各个客户端显示出打出的牌
   //Game.js ，Folds.js 会收到，不过folds.js 貌似不起作用，因为此时folds数组没有刷新
    userMgr.broacastInRoom('game_chupai_notify_push',{userId:seatData.userId,pai:pai},seatData.userId,true);

    //如果出的牌可以达到胡牌条件，则算过胡
    //tingMap中是达到和牌条件的所有牌，

    if(seatData.tingMap[game.chuPai]){
        seatData.guoHuFan = seatData.tingMap[game.chuPai].fan;//过胡番
    }
    
    //检查是否有人要胡，要碰 要杠
    var hasActions = false;
    for(var i = 0; i < game.gameSeats.length; ++i){
        //玩家自己不检查
        if(game.turn == i){//自己座位如果是当前轮次，不检查
            continue;
        }
        var ddd = game.gameSeats[i];
        //已经和牌的不再检查
        if(ddd.hued){
            continue;
        }
        //，看看自己出的牌是否达到了别人的胡牌条件
        checkCanHu(game,ddd,pai);
       //过胡
        // 大体意思就是 ddd上次过胡了，这次又可以糊了，但是 番数要小于 上次的 番数，那么这次不能胡，提示客户端 过胡 
       if(seatData.lastFangGangSeat == -1){//出牌不是杠之后的出牌
            if(ddd.canHu && ddd.guoHuFan >= 0 && ddd.tingMap[pai].fan <= ddd.guoHuFan){
                ddd.canHu = false;
                userMgr.sendMsg(ddd.userId,'guohu_push');            
            }     
        }
       //，看看自己出的牌是否达到了别人的碰牌条件
        checkCanPeng(game,ddd,pai);
        //，看看自己出的牌是否达到了别人的点杠条件
        //人家有3张一样的牌  你在打一张人家就可以杠你
        checkCanDianGang(game,ddd,pai);
       
        if(hasOperations(ddd)){//出的这张牌达到了别人的碰杠胡德条件，就先不发牌，而是等待其他玩家 碰杠胡
            sendOperations(game,ddd,game.chuPai);
            hasActions = true;    
        }
    }
    console.log("hasActions="+hasActions);
    //如果没有人有操作，则向下一家发牌，并通知他出牌
    if(!hasActions){
        setTimeout(function(){//延时，为了显示首先打出去牌的效果，然后在把牌放到 Fols中
            //广播给四个玩家，把刚才出的牌保存到客户端的玩家的folds中，数据同步
            //客户端MJGame.js 和 Folds.js会收到，显示四个客户端对应Fols的排布
            userMgr.broacastInRoom('guo_notify_push',{userId:seatData.userId,pai:game.chuPai},seatData.userId,true);
            seatData.folds.push(game.chuPai);//记录下这个座位保存 出得牌
            game.chuPai = -1;
             moveToNextUser(game);//确定turn为多少
             doUserMoPai(game);//分派下一张牌
        },500);
    }
};

exports.peng = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;

    //如果是他出的牌，则忽略
    if(game.turn == seatData.seatIndex){
        console.log("it's your turn.");
        return;
    }

    //如果没有碰的机会，则不能再碰
    if(seatData.canPeng == false){
        console.log("seatData.peng == false");
        return;
    }

    //和的了，就不要再来了
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }
    
    //如果有人可以胡牌，则需要等待
    var i = game.turn;
    while(true){
        var i = (i + 1)%4;
        if(i == game.turn){//转一圈，没有胡牌的，那么就跳出循环
            break;
        }
        else{
            var ddd = game.gameSeats[i];
            if(ddd.canHu && i != seatData.seatIndex){
                return; //有一家达到胡牌条件，就返回，peng无效   
            }
        }
    }


    clearAllOptions(game);//碰过之后，所有玩家的碰杠胡条件都没有了，清空

    //验证手上的牌的数目
    var pai = game.chuPai;
    var c = seatData.countMap[pai];
    if(c == null || c < 2){//异常条件了，没达到碰的条件
        console.log("pai:" + pai + ",count:" + c);
        console.log(seatData.holds);
        console.log("lack of mj.");
        return;
    }

    //进行碰牌处理
    //扣掉手上的牌
    //从此人牌中扣除
    for(var i = 0; i < 2; ++i){
        var index = seatData.holds.indexOf(pai);
        if(index == -1){
            console.log("can't find mj.");
            return;
        }
        seatData.holds.splice(index,1);
        seatData.countMap[pai] --;
    }
    seatData.pengs.push(pai);
    game.chuPai = -1;
    //记录出牌动作
    recordGameAction(game,seatData.seatIndex,ACTION_PENG,pai);

    //广播通知其它玩家
    // 1 通知客户端根据碰的牌，隐藏几张 MJGame组件
    // 2 PengGang组件，显示碰和杠的牌的排列
    userMgr.broacastInRoom('peng_notify_push',{userid:seatData.userId,pai:pai},seatData.userId,true);

    //碰的玩家打牌
    moveToNextUser(game,seatData.seatIndex);
    
    //广播通知玩家出牌方
    seatData.canChuPai = true;
    userMgr.broacastInRoom('game_chupai_push',seatData.userId,seatData.userId,true);
};

exports.isPlaying = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        return false;
    }

    var game = seatData.game;

    if(game.state == "idle"){
        return false;
    }
    return true;
}
/*
抢杠逻辑，
下面的分析比如A走s.gang ,此时的A就是庄稼，A是想自己杠自己的碰牌，不包括 B打出牌之后，A在进行的杠牌
1 当A打出一张牌，然后BCD会检查是否有胡牌的 ，如果没有，庄稼换为C，此时C想弯杠，点击了杠，走s.gang，此时要等待，看看其余人是否可以胡 C打出的
那张弯杠的牌，如果有，那么就不能杠，把杠牌信息保存到qiangGangContext
2 B 可以胡牌，如果点击了过，走s.guo,方法回清空B的碰杠胡条件canhu等, 但是仍然要等其余玩家碰杠胡进行之后才行，所以也要等待
3 如果此时别家没有胡牌的，那么 B 会执行qiangGangContext，走A的杠牌操作
4 如果B可以胡牌，并点击了胡牌，那么此时C的杠牌操作就无效了，B会把C的杠牌抢过来，放到自己的胡牌列表里
5 具体B的胡牌逻辑，在s.hu里面
*/
function checkCanQiangGang(game,turnSeat,seatData,pai){
    var hasActions = false;
    for(var i = 0; i < game.gameSeats.length; ++i){
        //杠牌者不检查
        if(seatData.seatIndex == i){
            continue;
        }
        var ddd = game.gameSeats[i];
        //已经和牌的不再检查
        if(ddd.hued){
            continue;
        }

        checkCanHu(game,ddd,pai);
        if(ddd.canHu){
            sendOperations(game,ddd,pai);
            hasActions = true;
        }
    }
    if(hasActions){
        game.qiangGangContext = {
            turnSeat:turnSeat,
            seatData:seatData,
            pai:pai,
            isValid:true,
        }
    }
    else{
        game.qiangGangContext = null;
    }
    return game.qiangGangContext != null;
}
//game,qiangGangContext.turnSeat,qiangGangContext.seatData,"wangang",1,qiangGangContext.pai
function doGang(game,turnSeat,seatData,gangtype,numOfCnt,pai){
    var seatIndex = seatData.seatIndex;
    var gameTurn = turnSeat.seatIndex;
    
    var isZhuanShouGang = false;
    if(gangtype == "wangang"){
        var idx = seatData.pengs.indexOf(pai);
        if(idx >= 0){
            seatData.pengs.splice(idx,1);
        }
        
        //如果最后一张牌不是杠的牌，则认为是转手杠
        if(seatData.holds[seatData.holds.length - 1] != pai){
            isZhuanShouGang = true;
        }
    }
    //进行杠牌处理
    //扣掉手上的牌
    //从此人牌中扣除
    for(var i = 0; i < numOfCnt; ++i){
        var index = seatData.holds.indexOf(pai);
        if(index == -1){
            console.log(seatData.holds);
            console.log("can't find mj.");
            return;
        }
        seatData.holds.splice(index,1);
        seatData.countMap[pai] --;
    }

    recordGameAction(game,seatData.seatIndex,ACTION_GANG,pai);

    //记录下玩家的杠牌
    if(gangtype == "angang"){
        seatData.angangs.push(pai);
       
        var ac = recordUserAction(game,seatData,"angang");
       
        ac.score = game.conf.baseScore*2;//杠牌的时候先吧分数加到ac.score里
    }
    else if(gangtype == "diangang"){
        seatData.diangangs.push(pai);
        var ac = recordUserAction(game,seatData,"diangang",gameTurn);
       //立刻收取引杠者2倍点数（在游戏中为基本分）
        ac.score = game.conf.baseScore*2;
        var fs = turnSeat;
        recordUserAction(game,fs,"fanggang",seatIndex);//放杠
    }
    else if(gangtype == "wangang"){
        seatData.wangangs.push(pai);
        if(isZhuanShouGang == false){
            var ac = recordUserAction(game,seatData,"wangang");
           // 面下杠立刻收取未胡者1倍点数（在游戏中为基本分）
            ac.score = game.conf.baseScore;            
        }
        else{
            recordUserAction(game,seatData,"zhuanshougang");
        }
    }

    checkCanTingPai(game,seatData);
    //通知其他玩家，有人杠了牌
    userMgr.broacastInRoom('gang_notify_push',{userid:seatData.userId,pai:pai,gangtype:gangtype},seatData.userId,true);

    //变成自己的轮子
    moveToNextUser(game,seatIndex);
    //再次摸牌
    doUserMoPai(game);   
    
    //只能放在这里。因为过手就会清除杠牌标记
    // 把本次导致seatData杠牌的庄稼记录
    seatData.lastFangGangSeat = gameTurn;
}

exports.gang = function(userId,pai){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果没有杠的机会，则不能再杠
    if(seatData.canGang == false) {
        console.log("seatData.gang == false");
        return;
    }

    //和的了，就不要再来了
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }

    if(seatData.gangPai.indexOf(pai) == -1){
        console.log("the given pai can't be ganged.");
        return;   
    }
    
    //如果有人可以胡牌，则需要等待
    var i = game.turn;
    while(true){
        var i = (i + 1)%4;
        if(i == game.turn){
            break;
        }
        else{
            var ddd = game.gameSeats[i];
            if(ddd.canHu && i != seatData.seatIndex){
                return;    
            }
        }
    }

    var numOfCnt = seatData.countMap[pai];

    var gangtype = ""
    //弯杠 去掉碰牌
    if(numOfCnt == 1){
        gangtype = "wangang"
    }
    else if(numOfCnt == 3){
        gangtype = "diangang"
    }
    else if(numOfCnt == 4){
        gangtype = "angang";
    }
    else{
        console.log("invalid pai count.");
        return;
    }
    
    game.chuPai = -1;
    clearAllOptions(game);
    seatData.canChuPai = false;
    //1播放出 杠 的动画
    //2 隐藏碰杠胡选择页面
    userMgr.broacastInRoom('hangang_notify_push',seatIndex,seatData.userId,true);
    
    
    //
    var turnSeat = game.gameSeats[game.turn];
    //********************** 弯杠只能自己是庄家的时候才能杠，别人出牌后，自己不能 弯杠  */
    if(numOfCnt == 1){
        //前面如果有能胡牌的，到不了这个方法，能到这个方法或者没有可以胡牌的，或者
        //胡牌的过了,但是胡牌的信息还是保存在听牌数组里   
        /*
        首先，需要了解一下打麻将中，杠是什么。杠，有四种形式：
1、一开始摸起来那一次牌时，就有四只是相同的；如果不是东家摸十四只牌，那么，需要摸牌时才能杠；如果是东家一起手摸十四只牌的，
马上就可以将四只牌可以反出来给其他三家看，然后说杠，把牌推到自己家其中一边，这种是属于“暗杠”。因为是自己摸到的牌。
2、如果在打牌途中，自己有三只相同，自己再摸到一只相同的，也是“暗杠”。
3、如果在打牌途中，自己有三只相同的，其他三家有人出了一只相同的，你也可以说“杠”，这种是属于“明杠”。
4、如果在打牌途中，自己有一对，其他三家中有人出一只相同的，然后，自己碰了，组成三只相同的，然后自己在摸回来一只相同的，你也可以说“杠”，
这种也是属于“明杠”。
然后，了解杠的形式之后，那么就来说一下怎样才能抢“杠”。
上述的第一、二种是“暗杠”，第三种“明杠”，都是不能抢的。
只有第四种形式的“杠”，才可以抢。
如果遇到其他三家有第四种“杠”的形式，而你糊的也是“杠”的那只牌，那么，就是“抢杠”，你就糊了；如果你糊的不是“杠”的那只牌，那也不能抢“杠”。
    
看看别人是否能抢我们的杠，对方可以选择抢杠胡，或者过 ，userB抢杠UserA，只能是USerA自己为庄稼，并且要明杠自己的碰牌才行 
*/   

        var canQiangGang = checkCanQiangGang(game,turnSeat,seatData,pai);
        if(canQiangGang){
            return;
        }
    }
    
    doGang(game,turnSeat,seatData,gangtype,numOfCnt,pai);
};

exports.hu = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果他不能和牌，那和个啥啊
    if(seatData.canHu == false){
        console.log("invalid request.");
        return;
    }

    //和的了，就不要再来了
    if(seatData.hued){
        console.log('you have already hued. no kidding plz.');
        return;
    }

    //标记为和牌
    seatData.hued = true;
    var hupai = game.chuPai;
    var isZimo = false;

    var turnSeat = game.gameSeats[game.turn];
    /*
    杠上开花：你本身有三个一样的牌，然后或自己摸到或从别人那里得到最后一个一样的牌形成杠。
    然后你就有一次机会再摸一张牌，如果你摸到的使你胡了，那这样的好运气就叫杠上开花…
    杠上炮：在杠的时候可以再摸一张牌，摸到牌以后需要丢一张牌到桌面，这时候~丢出去的牌如果被别人胡了
   */
    //
    
    
    /*
    turnSeat.lastFangGangSeat 有两种情况：
    1 turnSeat 是胡家自己，那么就是先杠，然后自摸，然后胡牌，所谓 杠上开花
    2 turnSeat 不是胡家UserC自己，那么就是UserA出牌，UserB杠，然后UserB摸牌，出牌，然后USerC胡牌
    这个叫做 杠上炮
    isGangHu只针对第一种情况,但是第二种情况lastFangGangSeat也是有值的
    */
    seatData.isGangHu = turnSeat.lastFangGangSeat >= 0;
  
  
    var notify = -1;
    
    /*
            turnSeat:turnSeat,
            seatData:seatData,
            pai:pai,
            isValid:true,
    */

    if(game.qiangGangContext != null){
        var gangSeat = game.qiangGangContext.seatData;
        hupai = game.qiangGangContext.pai;
        notify = hupai;
        //胡牌的玩家 抢杠 杠牌的玩家
        var ac = recordUserAction(game,seatData,"qiangganghu",gangSeat.seatIndex);    
        ac.iszimo = false;
        
        
        recordGameAction(game,seatIndex,ACTION_HU,hupai);
        seatData.isQiangGangHu = true;
        game.qiangGangContext.isValid = false;
        
        
        var idx = gangSeat.holds.indexOf(hupai);
        if(idx != -1){
            gangSeat.holds.splice(idx,1);
            gangSeat.countMap[hupai]--;
            //更新gangSeat的最新hold是的牌
            userMgr.sendMsg(gangSeat.userId,'game_holds_push',gangSeat.holds);
        }
        //将牌添加到玩家的手牌列表，供前端显示
        seatData.holds.push(hupai);
        if(seatData.countMap[hupai]){
            seatData.countMap[hupai]++;
        }
        else{
            seatData.countMap[hupai] = 1;
        }
        //gangSeat 被胡牌的玩家抢杠了
        recordUserAction(game,gangSeat,"beiqianggang",seatIndex);
    }
    else if(game.chuPai == -1){//自摸 turnSeat就是seatData，自己轮次的时候胡牌
        hupai = seatData.holds[seatData.holds.length - 1];
        notify = -1;
        
        //是否为杠上开花
        if(seatData.isGangHu){
             //UserA有四张一样的，杠，lastFangGangSeat 是自己，明杠的一种
            if(turnSeat.lastFangGangSeat == seatIndex){
                var ac = recordUserAction(game,seatData,"ganghua");    
                ac.iszimo = true;
            }
            //UserB出牌，UserA杠，UserA的lastFangGangSeat=UserB。然后UserA摸牌，胡了
            else{
                var diangganghua_zimo = game.conf.dianganghua == 1;
                if(diangganghua_zimo){
                    //点杠花自摸 ,家家都要给钱
                    var ac = recordUserAction(game,seatData,"dianganghua");
                    ac.iszimo = true;
                }
                else{
                    //点杠花放炮 只是放炮的那家给钱
                    var ac = recordUserAction(game,seatData,"dianganghua",turnSeat.lastFangGangSeat);
                    ac.iszimo = false;
                }
            }
        }
        
        
        else{
            var ac = recordUserAction(game,seatData,"zimo");
            ac.iszimo = true;
        }

        isZimo = true;
        recordGameAction(game,seatIndex,ACTION_ZIMO,hupai);
    }
    else{  
        notify = game.chuPai;
        //将牌添加到玩家的手牌列表，供前端显示
        //一炮多响的时候，每个胡的玩家 都会吧chupai加到holds里面，
        //其实理论上不合理，因为就一张chupai，但是可以理解,呈现出每个玩家都显示这张牌
        seatData.holds.push(game.chuPai);
        if(seatData.countMap[game.chuPai]){
            seatData.countMap[game.chuPai]++;
        }
        else{
            seatData.countMap[game.chuPai] = 1;
        }

        console.log(seatData.holds);

        var at = "hu";  
        //炮胡
        //杠上炮
        if(turnSeat.lastFangGangSeat >= 0){
            at = "gangpaohu";
        }

        var ac = recordUserAction(game,seatData,at,game.turn);
        ac.iszimo = false;

        //毛转雨 
        //呼叫转移：杠上炮把收的杠钱交给和牌家  
        /*
        杠上炮时，点炮者将刚杠所得转移给被点炮者。若杠后点炮超过一响，点炮者要另赔出刚杠所得的点数给被点者。
        */
        if(turnSeat.lastFangGangSeat >= 0){
            
            for(var i = turnSeat.actions.length-1; i >= 0; --i){
                var t = turnSeat.actions[i];
                if(t.type == "diangang" || t.type == "wangang" || t.type == "angang"){
                    
                    t.state = "nop";//吧状态改为 啥都不是
                    
                    t.payTimes = 0;

                    var nac = {
                        type:"maozhuanyu",//每一个action都转为 毛转雨
                        owner:turnSeat,
                        ref:t
                    }
                    seatData.actions.push(nac);
                    //我感觉这个break要屏蔽掉，原来没有
                   // break;
                }
            }
        
        
        }

        //记录玩家放炮信息
        var fs = game.gameSeats[game.turn];
        recordUserAction(game,fs,"fangpao",seatIndex);

        recordGameAction(game,seatIndex,ACTION_HU,hupai);

        game.fangpaoshumu++;
         //一人放炮，多人可以胡牌，一炮多响
        if(game.fangpaoshumu > 1){
            game.yipaoduoxiang = seatIndex;
        }
    }



   if(game.firstHupai < 0){
        game.firstHupai = seatIndex;
   }

    //保存番数
    var ti = seatData.tingMap[hupai];
    seatData.fan = ti.fan;
    ////胡牌模式 7dui 等,把胡牌的模式放到fan里面，作为初始值，之后calculateGame的时候，用这个作为基数
    seatData.pattern = ti.pattern;
    seatData.iszimo = isZimo;
    //如果是最后一张牌，则认为是海底胡
    seatData.isHaiDiHu = game.currentIndex == game.mahjongs.length;
    
    game.hupaiList.push(seatData.seatIndex);
    //如果允许天地胡，那么统计
    if(game.conf.tiandihu){
        if(game.chupaiCnt == 0 && game.button == seatData.seatIndex && game.chuPai == -1){
            seatData.isTianHu = true;
        }
        //地胡指的是庄家出一张牌后,闲家胡牌,即为地胡
        else if(game.chupaiCnt == 1 && game.turn == game.button
             && game.button != seatData.seatIndex && game.chuPai != -1){
            seatData.isDiHu = true;   
        }   
    }
    //情况胡牌玩家的碰杠胡条件
    clearAllOptions(game,seatData);

    //通知前端，有人和牌了
    //这里主要是显示 玩家的第14张牌，就是胡的这张，但是没有把服务端的holds同步到客户端
    //可能绝对胡牌了，不重要了吧
    userMgr.broacastInRoom('hu_push',{seatindex:seatIndex,iszimo:isZimo,hupai:notify},seatData.userId,true);
    
    // 不是很理解else语句的意思，胡牌与lastFangGangSeat啥
    //我觉得应该吧game.lastFangGangSeat换做game.lastHuPaiSeat
    //意思是比如一炮3响，那么lastHuPaiSeat就是位置大的那个比如1，2，3都糊了，那么lasthupaiset就是3，逻辑很简单

    if(game.lastHuPaiSeat == -1){
        game.lastHuPaiSeat = seatIndex;
    }
    else{
        //var lp = (game.lastFangGangSeat - game.turn + 4) % 4;
        //edited by xujl,我觉得应该换成这个
        var lp = (game.lastHuPaiSeat - game.turn + 4) % 4;
        var cur = (seatData.seatIndex - game.turn + 4) % 4;
        if(cur > lp){
            game.lastHuPaiSeat = seatData.seatIndex;
        }
    }


    //如果只有一家没有胡，则结束
    var numOfHued = 0;
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ddd = game.gameSeats[i];
        if(ddd.hued){
            numOfHued ++;
        }
    }
    //和了三家
    //if(numOfHued == 3){
        if(numOfHued == 1){ 
        doGameOver(game,seatData.userId);
        return;
    }



    //清空所有非胡牌操作
    //通知看看还有没有胡牌的，显示胡牌选择
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ddd = game.gameSeats[i];
        ddd.canPeng = false;
        ddd.canGang = false;
        ddd.canChuPai = false;
        sendOperations(game,ddd,hupai);
    }

    //如果还有人可以胡牌，则等待（比如一炮多响）
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ddd = game.gameSeats[i];
        if(ddd.canHu){
            return;
        }
    }
    
    //和牌的下家继续打
    //清空所有条件
    clearAllOptions(game);
     
    game.turn = game.lastHuPaiSeat;
    moveToNextUser(game);
    doUserMoPai(game);
};
//不碰杠胡，选择过
 
exports.guo = function(userId){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果玩家没有对应的操作，则也认为是非法消息
    if((seatData.canGang || seatData.canPeng || seatData.canHu) == false){
        console.log("no need guo.");
        return;
    }

    //如果是玩家自己的轮子，不是接牌，则不需要额外操作 
    //比如轮到自己出牌，.chupai=-1，turn是自己，那么如果过，就不做任何事
    var doNothing = (game.chuPai == -1 && game.turn == seatIndex);

    userMgr.sendMsg(seatData.userId,"guo_result");//把当前点 过 的用户的碰杠胡界面隐藏
    
    clearAllOptions(game,seatData);//把自己座位的碰杠胡记录清除
    
    //这里还要处理过胡的情况
    //上面的clearAllOptions已经把seatData.canHu设置为false，所以下面肯定不走了
    //所以我屏蔽了
    // if(game.chuPai >= 0 && seatData.canHu){
    //     seatData.guoHuFan = seatData.tingMap[game.chuPai].fan;
    // }

    if(doNothing){
        return;
    }
    
    //如果还有人可以操作，则等待
    //别人有碰杠胡，玩家都要等待
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ddd = game.gameSeats[i];
        if(hasOperations(ddd)){
            return;
        }
    }

    //如果是已打出的牌，则需要通知。
    ////这些操作应该是在.chupai函数中进行的，但是由于又了碰杠胡，所以点了过之后在补上这些操作
    if(game.chuPai >= 0){
        var uid = game.gameSeats[game.turn].userId;
        userMgr.broacastInRoom('guo_notify_push',{userId:uid,pai:game.chuPai},seatData.userId,true);
        seatData.folds.push(game.chuPai);
        game.chuPai = -1;
    }
    
    
    var qiangGangContext = game.qiangGangContext;
    //清除所有的操作
    clearAllOptions(game);
    
    if(qiangGangContext != null && qiangGangContext.isValid){
        doGang(game,qiangGangContext.turnSeat,qiangGangContext.seatData,"wangang",1,qiangGangContext.pai);        
    }
    else{
        //下家摸牌
        moveToNextUser(game);
        doUserMoPai(game);   
    }
};








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

//4个人都同意里，解散房间
exports.doDissolve = function(roomId){
    var roomInfo = roomMgr.getRoom(roomId);
    if(roomInfo == null){
        return null;
    }

    var game = games[roomId];
    doGameOver(game,roomInfo.seats[0].userId,true);
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
        states:[false,false,false,false]
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

/*
var mokgame = {
    gameSeats:[{folds:[]}],
    mahjongs:[],
    currentIndex:-1,
    conf:{
        wz_yaojidai:2,
    }
}
var mokseat = {
    holds:[9,9,9,9,1,2,3,3,4,5,18,18,18,18],
    isBaoTing:true,
    countMap:{},
    pengs:[],
    feis:[],
    diangangs:[],
    angangs:[],
    wangangs:[],
    diansuos:[],
    wansuos:[],
    ansuos:[],
    gangPai:[]
}

for(var k in mokseat.holds){
    var pai = mokseat.holds[k];
    if(mokseat.countMap[pai]){
        mokseat.countMap[pai] ++;
    }
    else{
        mokseat.countMap[pai] = 1;
    }
}
checkCanAnGang(mokgame,mokseat);
console.log(mokseat.gangPai);
*/