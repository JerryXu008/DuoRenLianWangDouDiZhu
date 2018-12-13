/**
 * Created by brucexu on 17/11/26.
 */
var TimePointerCom=function(parent) {
    this.node = parent;
    this.gameRoom=this.node.gameRoom;
    this.gameRootNode=this.node.gameRootNode;
    this.timeValue=-1;
    var self=this;
    //开始叫地主
    //this.node.on('game_jiaodizhu',function(){
    //       self.timeValue=timePointValue;
    //
    //});
    //this.node.on('game_chupai_notify',function(data){
    //
    //    self.timeValue=timePointValue;
    //
    //});
    //this.node.on('game_setDiZhu',function(data){
    //
    //    self.timeValue=timePointValue;
    //
    //});
    //this.node.on('game_chupaiReady',function(data){
    //
    //    self.timeValue=timePointValue;
    //
    //});

    this.node.on('game_timeLeft',function(data){

        self.timeValue=Math.ceil(data.detail);

    });



    this.updateClock=function(dt){

        var c ;

        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        c=this.timeValue;
        if(c<0){
            c=0;
        }


        var clockBg=this.gameRootNode.getChildByTag(CLOCK_BG);
        var clockValue=clockBg.getChildByTag(CLOCK_VALUE);

        if(cc.vv.gameNetMgr.gamestate==-3||cc.vv.gameNetMgr.gamestate==-2 || cc.vv.gameNetMgr.gamestate==1){
            clockBg.setVisible(false);
        }else{
            clockBg.setVisible(true);
        }


        var x=originPoint.x;
        var y=originPoint.y;
        var localIndex=this.node.getLocalIndex(cc.vv.gameNetMgr.currentPerson)
        switch(localIndex){
            case 0:
                x+=190;
                y+=200;
                break;
            case 1:
                x+=size.width-150;
                y=size.height-150-y;
                break;
            case 2:
                x+=150;
                y=size.height-150-y;
                break;
        }
        clockBg.setPosition(cc.p(x, y));
        clockValue.setString(c);

        if(this.timeValue<0){
            return;
        }

        this.timeValue--;


        if(this.timeValue<0){
            this.timeValue=-1;

                if(cc.vv.gameNetMgr.gamestate==-1){

                    if(cc.vv.gameNetMgr.currentPerson==cc.vv.gameNetMgr.seatIndex) {
                        //var score = Math.getRandomNum(3) + 1;

                        var score=Math.getRandomNum(2)+1;
                        if (score == 3) { //直接设置为地主

                            cc.vv.net.send("jiaofen",3);
                            return;
                        }
                        else if (score > cc.vv.gameNetMgr.currentScore) {
                            cc.vv.net.send("jiaofen",score);
                        }
                        else {
                            cc.vv.net.send("jiaofen",0);
                        }
                    }

                }else if(cc.vv.gameNetMgr.gamestate==0){//出牌了
                    if(cc.vv.gameNetMgr.currentPerson==cc.vv.gameNetMgr.seatIndex) {
                        var temp = this.node.persons[0].chupaiAI(this.node.currentCard, cc.vv.gameNetMgr.boss, this.node.persons);
                        if (temp != null) {
                            var pokesFlag=cc.vv.gameNetMgr.pokesFlag;
                            for(var i=0;i<pokesFlag.length;i++){
                                pokesFlag[i]=false;
                            }
                            var holds=cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].holds;
                            for(var j=0;j<temp.length;j++){
                              for(var i=0;i<holds.length;i++)
                              {
                                if(holds[i]==temp[j]){
                                    pokesFlag[i]=true;
                                }
                              }
                            }
                            cc.vv.net.send("chupai",{cardPokes:temp});

                        }

                        else {
                            this.gameRoom.buyao();

                        }
                    }
                }

        }


    };
}