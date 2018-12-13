var GameMainLayer = cc.Layer.extend({


    //private
     
    loadingNum:0,
    date:0,
    win:0,
    lose:0,

    personId:0,

    isShowTaskBg:0,
    isTouchPoker:0,
    

    currentPerson:0,
    currentCard:null,

    persons:[new Person(),new Person(),new Person()],

    currentMultiple:0,

    deskPokes:[54],

    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();

        cc.spriteFrameCache.addSpriteFrames("res/poker_card.plist");

        this.node=this;

        this.reConnect=null;
        this.gameRoom=null;
        this.touchHelper=null;
        this.soundCom=null;
        this.animationCom=null;
        this.timePointer=null;
        this.popMgrCom=null;

        this.prepareNode=new cc.Node();
        this.gameRootNode=new cc.Node();

        var  size=cc.director.getWinSize();

        var bg= new cc.Sprite("res/main_bg.jpg");
        bg.setPosition(cc.p(size.width*0.5, size.height*0.5));
        this.addChild(bg, 0);

        return true;

    },


    initEventHandlers:function(){
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        var self=this;

        //通知游戏开始
        this.node.on('game_begin',function(data){
            self.onGameBeign();
            //第一把开局，要提示
            if(cc.vv.gameNetMgr.numOfGames == 1){
                self.checkIp();
            }
        });

        this.node.on('check_ip',function(data){
            self.checkIp();
        });
        //通知本人的手牌
        this.node.on('game_holds',function(data){
            //初始化手牌
           self.initOwnerDesk(true);

        });
        //开始叫地主
        this.node.on('game_jiaodizhu',function(){
            self.selectorDZ();

        });
        //显示3张底牌
        this.node.on('game_showthreepoke',function(){
            //刷新desk
            self.initOwnerDesk(false);
            self.gameRoom.displayThreePoker();
            //更新游戏状态，开始打牌
            self.toPerson(cc.vv.gameNetMgr.currentPerson);//此时的currentPerson 为 地主seatIndex

        });


        this.node.on('game_sync',function(data){

            self.onGameBeign();
            self.checkIp();
        });
        this.node.on('game_chupai',function(data){

        });
        //还剩多少局通知事件
        this.node.on('game_num',function(data){

        });

        this.node.on('game_currentMultiple',function(data){
           var a= cc.vv.gameNetMgr.currentMultiple;
            if(a==1){
              self.updateMultiple(-1);
            }
            else{
                self.updateMultiple(-2,cc.vv.gameNetMgr.currentMultiple)
            }
        });
        this.node.on('game_currentScore',function(data){
            self.updateScore(cc.vv.gameNetMgr.currentScore);
        });
        this.node.on('game_allLeftPokes',function(data){

              var holdsArr=cc.vv.gameNetMgr.seats;
              for(var i=0;i<holdsArr.length;i++){
                  var holds=holdsArr[i].holds;
                  AIUtil.sort(holds);
                  var localIndex=self.getLocalIndex(i);

                  self.persons[localIndex].setPokes(holds);//传的是指针，

              }

        });


        this.node.on('game_chupai_notify',function(data){
            //self.hideChupai();//隐藏4个座位的出牌
            //
            //var seatData = data.detail.seatData;//出牌的座位的数据
            ////如果是自己，则刷新手牌
            //if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
            //    self.initMahjongs();
            //}
            //else{
            //    // alert(seatData.holds);
            //    self.initOtherMahjongs(seatData);
            //}
            ////显示出得牌，自己的或者别人的
            //self.showChupai();
            ////播放声音
            //var audioUrl = cc.vv.mahjongmgr.getAudioURLByMJID(data.detail.pai);
            //cc.vv.audioMgr.playSFX(audioUrl);
        });

        this.node.on('login_result', function () {

            self.gameRootNode.setVisible(false);
            self.prepareNode.setVisible(true);

        });

        this.node.on('game_gameOver',function(data){

                self.updateMultiple(-2,cc.vv.gameNetMgr.currentMultiple);
                self.gameOver(data.detail);
        });



    },
    emit:function(event,data){

        var event = new cc.EventCustom(event);
        if(data){
        event.setUserData(data);
        }
        cc.eventManager.dispatchEvent(event);

    },
    on:function(event,fn){

        function callBack(event){
            if(event){
                var data={detail:event.getUserData()};
                fn(data);

            }

        };
       var listen= cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: event,
            callback: callBack
        });
        cc.eventManager.addListener(listen,1);
    },
    off:function(event,fn){
        cc.eventManager.removeCustomListeners(event);


    },

    getLocalPersonIndex:function(index){//参数为在服务端的索引
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 3) % 3;
        return ret;
    },
    getLocalPerson:function(index){
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 3) % 3;
        return self.persons[ret];
    },
    getLocalIndex:function(index){
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 3) % 3;

        return ret;
    },

    //游戏开始
    onGameBeign:function(){

        //3个人没有到齐，下面的代码先不走
        if(cc.vv.gameNetMgr.gamestate < -2){
            return;
        }

        this.gameRootNode.setVisible(true);
        this.prepareNode.setVisible(false);




        this.displayPersonAll(true);




        this.currentCard=null;
        this.initOwnerDesk(true);//初始化一下自己手里的牌


        var seats = cc.vv.gameNetMgr.seats;
        for(var i in seats){
            var seatData = seats[i];
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            if(localIndex != 0){//自己的牌不再操作了
                this.initOthersDesk(seatData);
            }
        }




        this.updateMultiple(-2,cc.vv.gameNetMgr.currentMultiple); //更新倍数，开始为1倍

        this.updateScore(cc.vv.gameNetMgr.currentScore); //更新得分

        this.gameRoom.displayThreePoker();

        for(var i=0; i<20; i++){
            cc.vv.gameNetMgr.pokesFlag[i]=false;
        }

        if(cc.vv.gameNetMgr.gamestate==-1){
            this.selectorDZ();//叫地主
        }
        if(cc.vv.gameNetMgr.gamestate==0){//游戏开始中

            this.schedule(this.gameRoom.hideTag, 1.0);//把叫分恢复成 不出 并隐藏
            this.gameRoom.setCapUI(cc.vv.gameNetMgr.boss);

            this.isTouchPoker=true;//可以摸牌

            this.toPerson(cc.vv.gameNetMgr.currentPerson);


        }
        if(cc.vv.gameNetMgr.gamestate>-1){
           this.gameRoom.synShowChupai();
        }
        var self=this;
        //看看是否正在请求退出
       if(cc.vv.gameNetMgr.dissoveData){
           setTimeout(function(){
               self.popMgrCom.showDissolveNotice(cc.vv.gameNetMgr.dissoveData);
           },800);

       }
        //倒计时
        this.timePointer.timeValue= Math.ceil(cc.vv.gameNetMgr.timeLeft);

    },
    personPokes:function(){
        return  (cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex]).holds;

    },
    //记录一下玩家剩余的牌数
    initOthersDesk:function(seatData) {

        var localIndex = this.getLocalIndex(seatData.seatIndex);
        if (localIndex == 0) {
            return;
        }
        this.persons[localIndex].name = seatData.name;
        this.persons[localIndex].setId(localIndex);
        this.persons[localIndex].personCard.pokes = [];

        if (cc.vv.gameNetMgr.holdsCountArr && cc.vv.gameNetMgr.holdsCountArr.length > 0) {
            this.gameRoom.setSeatNum(localIndex, cc.vv.gameNetMgr.holdsCountArr[seatData.seatIndex])
        }
    },
    initOwnerDesk:function(sound){
        var self=this;
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        //隐藏三个不出图片
        for(var i=0; i<3; i++){
            var tag=self.gameRootNode.getChildByTag(PERSON_TAG_0+i);
            tag.setVisible(false);
        }

        //冒泡排序，从大到小排序
        AIUtil.sort(seatData.holds);


        var localIndex= this.getLocalPersonIndex(cc.vv.gameNetMgr.seatIndex);

        this.persons[localIndex].name=seatData.name;

        this.persons[localIndex].setId(localIndex);
        this.persons[localIndex].setPokes(seatData.holds);//传的是指针，
        this.persons[localIndex].personCard.pokes=[];


        this.displayPersonPoker(localIndex); //把当前玩家的发牌数据以图形方式展现出来//玩家本人

        //设置出牌顺序 ,左上角玩家先出，然后本人出，最后右上角玩家出
        this.persons[0].setPosition(this.persons[2], this.persons[1]);
        this.persons[1].setPosition(this.persons[0], this.persons[2]);
        this.persons[2].setPosition(this.persons[1], this.persons[0]);

        if(sound) {
            this.schedule(this.pokerDeal, 0.5);
        }
    },
    displayPersonPoker:function(personId){
        var len= arguments.length;
        if(1 == len)
        {
            this.displayPersonSingle(personId);
        }
        else{
            this.displayPersonAll();
        }
    },


    displayPersonSingle:function( personId){
        var layer;
        var clayer;

        switch(personId){
            case 0:
                layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
                clayer=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER0);
                break;
            case 1:
                layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER1);
                clayer=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER1);
                break;
            case 2:
                layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER2);
                clayer=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER2);
                break;
        }
        layer.removeAllChildren();
        clayer.removeAllChildren();

        for(var i=0; i<20; i++){
            cc.vv.gameNetMgr.pokesFlag[i]=false;
        }

        //排列出过的牌
        this.persons[personId].personCard.paint(clayer, true);

        //排列没有出的牌
        if(personId==0){
            this.persons[personId].paintPoker(layer, cc.vv.gameNetMgr.gamestate);
        }
    } ,

    displayPersonAll:function(onClear){//展示3个玩家的牌的图像

        var layer0=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
        var layer1=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER1);
        var layer2=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER2);

        var clayer0=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER0);
        var clayer1=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER1);
        var clayer2=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER2);

        layer0.removeAllChildren();
        layer1.removeAllChildren();
        layer2.removeAllChildren();
        clayer0.removeAllChildren();
        clayer1.removeAllChildren();
        clayer2.removeAllChildren();
        if(!onClear) {
            //已经出过的牌的层
            this.persons[0].personCard.paint(clayer0);
            this.persons[1].personCard.paint(clayer1);
            this.persons[2].personCard.paint(clayer2);

            //展示牌的层
            this.persons[0].paintPoker(layer0, cc.vv.gameNetMgr.gamestate);
            this.persons[1].paintPoker(layer1, cc.vv.gameNetMgr.gamestate);
            this.persons[2].paintPoker(layer2, cc.vv.gameNetMgr.gamestate);
        }


        for(var i=0; i<20; i++){
            cc.vv.gameNetMgr.pokesFlag[i]=false;
        }


    },


    onDestroy:function(){
        console.log("onDestroy");
        if(cc.vv){
            cc.vv.gameNetMgr.clear();
        }
    },

    checkIp:function(){
        if(cc.vv.gameNetMgr.gamestate == ''){
            return;
        }
        //得到当前用户的座位信息
        var selfData = cc.vv.gameNetMgr.getSelfData();
        var ipMap = {}
        for(var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i){
            var seatData = cc.vv.gameNetMgr.seats[i];
            if(seatData.ip != null && seatData.userid > 0 && seatData != selfData){
                if(ipMap[seatData.ip]){
                    ipMap[seatData.ip].push(seatData.name);
                }
                else{
                    ipMap[seatData.ip] = [seatData.name];
                }
            }
        }

        for(var k in ipMap){
            var d = ipMap[k];
            if(d.length >= 2){
                var str = "" + d.join("\n") + "\n\n正在使用同一IP地址进行游戏!";
                cc.vv.alert.show(str);

                return;
            }
        }
    },



//public
 onEnter:function(){

     this._super();

     this.addChild(this.prepareNode);
     this.addChild(this.gameRootNode);

     this.gameRootNode.setVisible(false);
     this.prepareNode.setVisible(true);

     this.initEventHandlers();
     this.initComponents();

     this.onGameBeign();

     this.touchHelper.bindTouch();

     AudioUtil.playBackMusic();

 },

 onExit:function(){

     cc.eventManager.removeAllListeners();

     this.unschedule(this.timePointer.updateClock);

     this._super();


 },
    initComponents:function(){
        this.reConnect= new ReConnect(this);//重连组件
        this.gameRoom= new GameRoom(this);//房间组件
        this.touchHelper= new TouchHelperComponent(this);
        this.soundCom= new SoundCom(this);
        this.animationCom=new AnimationComponent(this);
        this.timePointer=new TimePointerCom(this);
        this.popMgrCom=new PopupMgrCom(this);


    },


 onEnterTransitionDidFinish:function(){

     this.schedule(function(){
         this.timePointer.updateClock();
     }, 1.0);
     this.scheduleUpdate();

     this._super();
 },
    update: function (dt) {
        this.reConnect.update(dt);//重连组件更新
        this.popMgrCom.update(dt);
    },



    menuCloseCallback :function(){

      cc.director.runScene(new  GameIndexScene());
  },
    selectorDZ:function(){

        this.toPerson(cc.vv.gameNetMgr.currentPerson);

    },
    toPerson:function(curpersonId){

        //this.timePointer.timeValue=20;//每次转换玩家，从新倒计时

        var localSeatIndex=this.getLocalIndex(cc.vv.gameNetMgr.currentPerson);

        if(cc.vv.gameNetMgr.gamestate<0){ //进行选牌过程

            if(cc.vv.gameNetMgr.haveDZ){ //

                cc.vv.gameNetMgr.gamestate=0;//开始打牌中

               this.displayPersonPoker(localSeatIndex); //展示叫完地主之后地主扑克图片
            }

        }
        else{
            //隐藏当前person的叫分精灵,以及不要 提示
            var tag=this.gameRootNode.getChildByTag(PERSON_TAG_0+ localSeatIndex);
            tag.setVisible(false);


            //清除出过的牌的层里面的子元素，以便下面的可以出新牌
            var cardLayer;
            switch(localSeatIndex){
                case 0:
                    cardLayer=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER0);
                    break;
                case 1:
                    cardLayer=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER1);
                    break;
                case 2:
                    cardLayer=this.gameRootNode.getChildByTag(PERSON_CARD_LAYER2);
                    break;
            }
            cardLayer.removeAllChildren();
        }

        if(localSeatIndex==0){ //当前叫分的是本人

            if(cc.vv.gameNetMgr.gamestate<0){

                this.disPlayDZButton(cc.vv.gameNetMgr.currentScore);  //首次弹出选分弹层
            }
            else{

                for(var i=0; i<20; i++){
                    cc.vv.gameNetMgr.pokesFlag[i]=false;
                }

                this.displayButton();//弹出出牌层,同时移除选分层
                //

                if(this.persons[localSeatIndex].noBigCard(this.currentCard)){
                    var toast=new CToast();
                    this.addChild(toast, 2);
                    var size=cc.director.getWinSize();
                    var originPoint=cc.director.getVisibleOrigin();
                    toast.showImage("res/no_big_card.png", size.width*0.5, originPoint.y+60, 3.0);
                }
            }
        }
        else{
            //移除本人的用于出牌，重发等的弹层
            var layer=this.gameRootNode.getChildByTag(BUTTON_LAYER);
            layer.removeAllChildren();


        }

    },








 displayButton:function(){
    this.gameRoom.displayButton();
 },

 disPlayDZButton:function(score){
     this.gameRoom.disPlayDZButton(score);
 },






  gameOver:function(data){
      var forceEnd=data[7];
      if(!forceEnd){
      var  btLayer=this.gameRootNode.getChildByTag(BUTTON_LAYER);
      btLayer.removeAllChildren();

          //把电脑的牌也显示出来
       this.displayPersonPoker();

       var  scoreLayer=new DialogSucceedLayer();
       var isBoss=data[6];
       scoreLayer.show(isBoss, data
          , cc.vv.gameNetMgr.seats[0].name, cc.vv.gameNetMgr.seats[1].name, cc.vv.gameNetMgr.seats[2].name);
       this.addChild(scoreLayer);
      }
      else{
          cc.director.runScene(new HallScene());
      }


  },

    updatePoker:function(dt){
      this.unschedule(this.updatePoker);
      this.isTouchPoker=true;
      this.displayPersonPoker(0);
  },


   hidePersonPoker:function( dt){
    this.unschedule(this.hidePersonPoker);
     var layer=this.getChildByTag(LOOK_PERSON_POKER);
     layer.removeFromParent();
},
  pokerDeal:function(dt){
      this.unschedule(this.pokerDeal);
     // AudioUtil.soundControl(1);
  },

  showDzScore:function(persionid,score){
  },

    updateMultiple:function(type,multiple){



      if(type==-1){
          var strMultiple=StringUtil.getString("main_multiple"); //倍数
          strMultiple+="1";
          var text=this.gameRootNode.getChildByTag(LABEL_MUTIPLE);//更新倍数
          text.setString(strMultiple);
      }
      else if(type==-2){
          var strMultiple=StringUtil.getString("main_multiple"); //倍数
          strMultiple+=multiple;
          var text=this.gameRootNode.getChildByTag(LABEL_MUTIPLE);//更新倍数
          text.setString(strMultiple);
      }


  },
  updateScore:function(score){

      if((score==0&&cc.vv.gameNetMgr.currentScore) || score>=cc.vv.gameNetMgr.currentScore){
          cc.vv.gameNetMgr.currentScore=score;
          var strValue=score;
          var strScore=StringUtil.getString("main_score");
          strScore+=strValue;
          var text=this.gameRootNode.getChildByTag(LABEL_SCORE);
          text.setString(strScore);
      }

  },

    loadingCallBack:function(obj){

 },



});

var GameMainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();


        var layer = new GameMainLayer();

        this.addChild(layer);
    }
});
