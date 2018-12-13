/**
 * Created by brucexu on 17/11/5.
 */
var GameRoom=function(parent){

    var self=this;
    this.node=parent;
    this.prepareNode=parent.prepareNode;
    this.gameRootNode=parent.gameRootNode;
    this._seats=[];
    this._seats2=[];


    this.initUI=function(){
        var size=cc.director.getWinSize();
        this.initPrepareUI();
        this.initRootUI();

        this.initBaseUILayer();
        this.refreshBtns();

    };
    this.initPrepareUI=function(){

        for(var i = 0; i < 3; ++i){
            var seat=new Seat(i,this.prepareNode);
            this._seats.push(seat);
        }
        this.initPreSetting();


    };
    this.initRootUI=function(){
        for(var i = 0; i < 3; ++i){
            var seat=new Seat(i,this.gameRootNode);
            this._seats2.push(seat);
        }
    }
    //游戏开始完之后的相关按钮的刷新
    this.refreshBtns=function(){
        var prepare = this.prepareNode;

        var btnExit = prepare.getChildByTag(10003)
        var btnDispress = prepare.getChildByTag(10002);
        var btnBack = prepare.getChildByTag(10001);


        var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
        //显示 退出 或者解散的按钮
        btnExit.setVisible(!cc.vv.gameNetMgr.isOwner() && isIdle);
        btnDispress.setVisible(cc.vv.gameNetMgr.isOwner() && isIdle);
        btnBack.setVisible(isIdle);
    };


    this.initPreSetting=function(){
        var  originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();

        var w=size.width-100;
        var h=200;
        var labelStart=new cc.LabelTTF("返回大厅", "MarkerFelt", 26);
        var btStart=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart.setBackgroundSpriteForState(new cc.Scale9Sprite("res/index_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btStart.setPosition(cc.p(w,h));
        btStart.addTargetWithActionForControlEvents(this, this.onBtnBackClicked, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.prepareNode.addChild(btStart);
        btStart.setTag(10001);


        var labelStart=new cc.LabelTTF("解散房间", "MarkerFelt", 26);
        var btStart=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart.setPosition(cc.p(w,h-100));
        btStart.addTargetWithActionForControlEvents(this, this.onBtnDissolveClicked, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.prepareNode.addChild(btStart);
        btStart.setTag(10002);

        var labelStart=new cc.LabelTTF("退出房间", "MarkerFelt", 26);
        var btStart=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart.setPosition(cc.p(w,h-100));
        btStart.addTargetWithActionForControlEvents(this, this.onBtnExit, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.prepareNode.addChild(btStart);
        btStart.setTag(10003);


    };

    this.initBaseUILayer=function(){
        var  originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();


        //三个农民帽子，根据情况显示和隐藏
        var cap0=new cc.Sprite("res/nm_cap.png");
        cap0.setPosition(cc.p(originPoint.x+60-30, size.height/4+originPoint.y+90+30));
        cap0.setVisible(false);
        this.gameRootNode.addChild(cap0, 0, CAP_0);
        var cap1=new cc.Sprite("res/nm_cap.png");
        cap1.setPosition(cc.p(size.width-originPoint.x-60-30, size.height-originPoint.y-60+30));
        cap1.setVisible(false);
        this.gameRootNode.addChild(cap1, 0, CAP_1);
        var cap2=new cc.Sprite("res/nm_cap.png");
        cap2.setPosition(cc.p(originPoint.x+60-30, size.height-originPoint.y-60+30));
        cap2.setVisible(false);
        this.gameRootNode.addChild(cap2, 0, CAP_2);


        //三个 不出图片，根据情况显示或者隐藏
        var  x=size.width*0.5;
        var  y=originPoint.y+200;
        var tag0=new cc.Sprite("res/text_buchu.png");
        tag0.setPosition(cc.p(x, y));
        tag0.setVisible(false);
        this.gameRootNode.addChild(tag0, 0, PERSON_TAG_0);

        var tag1=new cc.Sprite("res/text_buchu.png");
        tag1.setPosition(cc.p(x+200, y+180));
        tag1.setVisible(false);
        this.gameRootNode.addChild(tag1, 0, PERSON_TAG_1);

        var tag2=new cc.Sprite("res/text_buchu.png");
        tag2.setPosition(cc.p(x-200, y+180));
        tag2.setVisible(false);
        this.gameRootNode.addChild(tag2, 0, PERSON_TAG_2);

        //顶部背景图片
        var top=new cc.Sprite("res/main_top.png");
        top.setPosition(cc.p(size.width*0.5 , size.height-originPoint.y-45));
        this.gameRootNode.addChild(top);

        //底分
        var ttfScore=new cc.LabelTTF(StringUtil.getString("main_score"), "MarkerFelt", 25);
        ttfScore.setPosition(cc.p(size.width*0.5+140, size.height-originPoint.y-30));
        this.gameRootNode.addChild(ttfScore, 0, LABEL_SCORE);
        //倍数
        var ttfmultiple=new cc.LabelTTF(StringUtil.getString("main_multiple"), "MarkerFelt", 25);
        ttfmultiple.setPosition(cc.p(size.width*0.5+140, size.height-originPoint.y-60));
        this.gameRootNode.addChild(ttfmultiple, 0, LABEL_MUTIPLE);

        //胜了多少场
        this.win=cc.sys.localStorage.getItem(KEY_WIN);
        if(this.win==null)this.win=0;

        var  strWin=this.win;
        var  textWin=StringUtil.getString("main_win");
        textWin+=strWin;
        var ttfWin=new cc.LabelTTF(textWin, "MarkerFelt", 25);
        ttfWin.setPosition(cc.p(size.width*0.5-170, size.height-originPoint.y-30));
        this.gameRootNode.addChild(ttfWin, 0, LABEL_WIN);

        //输了多少场
        this.lose=cc.sys.localStorage.getItem(KEY_LOSE);
        if(this.lose==null)this.lose=0;
        var strLose=this.lose;
        var  textLose=StringUtil.getString("main_lose");
        textLose+=strLose;
        var ttfLose=new cc.LabelTTF(textLose, "MarkerFelt", 25);
        ttfLose.setPosition(cc.p(size.width*0.5-170, size.height-originPoint.y-60));
        this.gameRootNode.addChild(ttfLose, 0, LABEL_LOSE);





        //未出牌的层显示
        var personPokerLayer0=new cc.Layer();
        personPokerLayer0.setPosition(cc.p(0, 0));
        this.gameRootNode.addChild(personPokerLayer0, 0, PERSON_POKER_LAYER0);
        var personPokerLayer1=new cc.Layer();
        personPokerLayer1.setPosition(cc.p(0, 0));
        this.gameRootNode.addChild(personPokerLayer1, 0, PERSON_POKER_LAYER1);
        var personPokerLayer2=new cc.Layer();
        personPokerLayer2.setPosition(cc.p(0, 0));
        this.gameRootNode.addChild(personPokerLayer2, 0, PERSON_POKER_LAYER2);

        //出牌的层显示
        var cardLayer0=new cc.Layer();
        cardLayer0.setPosition(cc.p(0, 0));
        this.gameRootNode.addChild(cardLayer0, 0, PERSON_CARD_LAYER0);
        var cardLayer1=new cc.Layer();
        cardLayer1.setPosition(cc.p(0, 0));
        this.gameRootNode.addChild(cardLayer1, 0, PERSON_CARD_LAYER1);
        var cardLayer2=new cc.Layer();
        cardLayer2.setPosition(cc.p(0, 0));
        this.gameRootNode.addChild(cardLayer2, 0, PERSON_CARD_LAYER2);




        //叫分的时候的弹层
        var btLayer=new cc.Layer();
        btLayer.setPosition(cc.p(0, 0));
        this.gameRootNode.addChild(btLayer, 0, BUTTON_LAYER);


        //退出按钮
        var itemBack=new cc.MenuItemImage(
            "res/main_tuic.png",
            "res/main_tuic_pressed.png",
            null,
            this.menuCloseCallback,
            this);
        itemBack.setPosition(cc.p(size.width*0.5-250, size.height-originPoint.y-40));



        //出牌倒计时钟表
        var clockBg=new cc.Sprite("res/clock.png");
        this.gameRootNode.addChild(clockBg, 0, CLOCK_BG);
        var clockValue=new cc.LabelTTF("20", "MarkerFelt", 18);
        clockValue.setColor({r:0, g:0, b:0});
        clockValue.setPosition(cc.p(clockBg.getContentSize().width*0.5, clockBg.getContentSize().height*0.5-5));
        clockBg.addChild(clockValue, 0, CLOCK_VALUE);
        clockBg.setVisible(false);

        //最上顶发牌初始化
        y=size.height-originPoint.y-45;
        x=size.width*0.5;
        var threePoker0=new cc.Sprite("#backbig.png");
        threePoker0.setPosition(cc.p(x-50, y));
        this.gameRootNode.addChild(threePoker0, 0, POKER_ONE);
        var threePoker1=new cc.Sprite("#backbig.png");
        threePoker1.setPosition(cc.p(x, y));
        this.gameRootNode.addChild(threePoker1, 0, POKER_TWO);
        var threePoker2=new cc.Sprite("#backbig.png");
        threePoker2.setPosition(cc.p(x+50, y));
        this.gameRootNode.addChild(threePoker2, 0, POKER_THREE);

        threePoker0.setScale(0.4);
        threePoker1.setScale(0.4);
        threePoker2.setScale(0.4);


        var labelStart=new cc.LabelTTF("申请解散房间", "MarkerFelt", 26);

        var btStart=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart.setBackgroundSpriteForState(new cc.Scale9Sprite("res/index_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btStart.setPosition(cc.p(size.width/2,size.height-originPoint.y-40-60-20));
        btStart.addTargetWithActionForControlEvents(this, this.beginDissove, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

        this.gameRootNode.addChild(btStart);

        //房间号
        var labelRoomId=new cc.LabelTTF("", "MarkerFelt", 26);
        labelRoomId.setPosition(cc.p(size.width/2,size.height-originPoint.y-40-60-20-20-20));
        this.node.addChild(labelRoomId,1000,100001);



    };
    this.beginDissove=function(){
        cc.vv.net.send("dissolve_request");
    };



        this.displayThreePoker=function(){

        var threePoker0=this.gameRootNode.getChildByTag(POKER_ONE);
        var threePoker1=this.gameRootNode.getChildByTag(POKER_TWO);
        var threePoker2=this.gameRootNode.getChildByTag(POKER_THREE);
        if(cc.vv.gameNetMgr.gamestate<0){

            var frame=cc.spriteFrameCache.getSpriteFrame("backbig.png");
            threePoker0.setSpriteFrame(frame);
            threePoker1.setSpriteFrame(frame);
            threePoker2.setSpriteFrame(frame);
            threePoker0.setScale(0.4);
            threePoker1.setScale(0.4);
            threePoker2.setScale(0.4);
        }else{
            var text;
            text="poke"+cc.vv.gameNetMgr.threePokes[0]+".png";
            var frame=cc.spriteFrameCache.getSpriteFrame(text);
            threePoker0.setSpriteFrame(frame);
            threePoker0.setScale(0.4);

            text="poke"+cc.vv.gameNetMgr.threePokes[1]+".png";
            frame=cc.spriteFrameCache.getSpriteFrame(text);
            threePoker1.setSpriteFrame(frame);
            threePoker1.setScale(0.4);

            text="poke"+cc.vv.gameNetMgr.threePokes[2]+".png";
            frame=cc.spriteFrameCache.getSpriteFrame(text);
            threePoker2.setSpriteFrame(frame);
            threePoker2.setScale(0.4);
        }
    };

    this.onBtnBackClicked=function(){
            WaitingConnectionLayer.show('正在返回游戏大厅');
            cc.director.runScene(new HallScene());
    };

    this.onBtnDissolveClicked=function(){
        WaitingConnectionLayer.show('正在解散房间');
        cc.vv.net.send("dispress");

    };
    //退出房间
    this.onBtnExit=function(){
        cc.vv.net.send("exit");
    },

        this.node.on('login_finished', function () {

           var lbl=  self.node.getChildByTag(100001);
            lbl.setString("房间号:"+cc.vv.gameNetMgr.roomId);
        });

        //某个玩家状态改变
        this.node.on('user_state_changed',function(data){
            self.initSingleSeat(data.detail);
        });

        this.node.on('game_begin',function(data){
            self.refreshBtns();
            //重新更新各个座位的信息
            self.initSeats();
        });
       this.node.on('game_holds_count',function(data){
         if(data){
             var data=data.detail;
             for(var i=0;i<data.length;i++){
                 var localindex=self.getLocalIndex(i);
                 self._seats2[localindex].setPokerNum(data[i]);
             }

         }
       });

    this.node.on('game_jiaofen_notify',function(data) {
        if (data) {
            var data = data.detail;
            var seatIndex = data.seatIndex;
            var score=data.score;
            var curScore=data.currentScore

            self.showDzScore(seatIndex,score);

            self.node.updateScore(curScore);

        }
    });
    this.node.on('game_setDiZhu',function(data) {
        if (data) {
            self.setDZ(data);
        }
    });
    this.node.on('game_showtreepoke',function(data) {
        if (data) {
            self.setDZ(data);
        }
    });
    this.node.on('game_currentCircle',function(data) {

    });

    this.node.on('game_gameOver',function(data) {
         self.hideCapUI();
    });

    this.getSeatBgSprite=function(index){
       var seat= self._seats2[index];
        return seat.getHeadBgSprite(index);
    }
    this.setDZ=function(data){
        var data=data.detail;
        var seatIndex=data.seatIndex;
        var bossIndex = seatIndex;
        self.node.schedule(self.hideTag, 1.0);//把叫分恢复成 不出 并隐藏
        self.setCapUI(bossIndex);

        self.node.isTouchPoker=true;//可以摸牌

        self.node.toPerson(cc.vv.gameNetMgr.currentPerson);
    }
    this.hideCapUI=function(){

        var cap0=this.gameRootNode.getChildByTag(CAP_0);
        var cap1=this.gameRootNode.getChildByTag(CAP_1);
        var cap2=this.gameRootNode.getChildByTag(CAP_2);

        var head0=self.getSeatBgSprite(0);
        var head1=self.getSeatBgSprite(1);
        var head2=self.getSeatBgSprite(2);

        cap0.setVisible(false);
        cap1.setVisible(false);
        cap2.setVisible(false);

        head0.setTexture(cc.textureCache.addImage("res/head_nm.png"));
        head1.setTexture(cc.textureCache.addImage("res/head_nm.png"));
        head2.setTexture(cc.textureCache.addImage("res/head_nm.png"));
    }
    this.setCapUI=function(bossIndex){
        var cap0=this.gameRootNode.getChildByTag(CAP_0);
        var cap1=this.gameRootNode.getChildByTag(CAP_1);
        var cap2=this.gameRootNode.getChildByTag(CAP_2);

        var head0=self.getSeatBgSprite(0);
        var head1=self.getSeatBgSprite(1);
        var head2=self.getSeatBgSprite(2);


        if(!cap0.isVisible()){
            cap0.setVisible(true);
        }
        if(!cap1.isVisible()){
            cap1.setVisible(true);
        }
        if(!cap2.isVisible()){
            cap2.setVisible(true);
        }

        var localseatIndex=self.getLocalIndex(bossIndex);
        switch(localseatIndex){
            case 0:

                cap0.setTexture(cc.textureCache.addImage("res/dz_cap.png"));
                cap1.setTexture(cc.textureCache.addImage("res/nm_cap.png"));
                cap2.setTexture(cc.textureCache.addImage("res/nm_cap.png"));
                head0.setTexture(cc.textureCache.addImage("res/head_dz.png"));
                head1.setTexture(cc.textureCache.addImage("res/head_nm.png"));
                head2.setTexture(cc.textureCache.addImage("res/head_nm.png"));
                break;
            case 1:
                cap0.setTexture(cc.textureCache.addImage("res/nm_cap.png"));
                cap1.setTexture(cc.textureCache.addImage("res/dz_cap.png"));
                cap2.setTexture(cc.textureCache.addImage("res/nm_cap.png"));
                head0.setTexture(cc.textureCache.addImage("res/head_nm.png"));
                head1.setTexture(cc.textureCache.addImage("res/head_dz.png"));
                head2.setTexture(cc.textureCache.addImage("res/head_nm.png"));
                break;
            case 2:
                cap0.setTexture(cc.textureCache.addImage("res/nm_cap.png"));
                cap1.setTexture(cc.textureCache.addImage("res/nm_cap.png"));
                cap2.setTexture(cc.textureCache.addImage("res/dz_cap.png"));
                head0.setTexture(cc.textureCache.addImage("res/head_nm.png"));
                head1.setTexture(cc.textureCache.addImage("res/head_nm.png"));
                head2.setTexture(cc.textureCache.addImage("res/head_dz.png"));
                break;
        }
    };



    this.hideTag=function(dt){

        self.node.unschedule(self.hideTag);
        for(var i=0; i<3; i++){
            var tag=this.gameRootNode.getChildByTag(PERSON_TAG_0+i);
            tag.setTexture(cc.textureCache.addImage("res/text_buchu.png"));
            tag.setVisible(false);
        }

    };

    this.showDzScore=function(persionid,score){

        if(score>cc.vv.gameNetMgr.currentScore){
           // this.updateScore(score);
            cc.vv.gameNetMgr.currentScore=score;
        }else{ //比当前分数叫的低，那么这个人之后不能在叫分了,一般不叫的时候会走
            score=0;
            cc.vv.gameNetMgr.dzJiaofen[persionid]=false;//不允许叫分了
        }

        self.showScoreUI(persionid,score);

        if(cc.vv.gameNetMgr.seatIndex==persionid) {//不是自己叫的分

            if (score == 3) { //叫了3分，那么肯定就是地主了
                cc.vv.net.send("setDiZhu", persionid);
            }
            else { //叫的不是3分

                var count = 0;
                var index = 0;

                for (var i = 0; i < 3; i++) {
                    if (!cc.vv.gameNetMgr.dzJiaofen[i]) {
                        count++;
                    } else {
                        index = i; //轮到下一个人叫分
                    }
                }
                if (count == 2) {
                    cc.vv.net.send("setDiZhu", index);
                } else { //下个人开始叫分

                    cc.vv.net.send("ChangeNextPersonJiaoFen");




                }
            }

        }

    };







    this.showScoreUI=function(persionid,score){
        var localSeatIndex=this.getLocalIndex(persionid);
        AudioUtil.soundQDZ(score, this.node.persons[localSeatIndex].sex);//播放声音

        //对应某个人显示积分的图片展示
        var tag=this.gameRootNode.getChildByTag(PERSON_TAG_0+ localSeatIndex);
        switch(score){
            case 0:
                tag.setTexture(cc.textureCache.addImage("res/score_fold.png"));
                break;
            case 1:
                tag.setTexture(cc.textureCache.addImage("res/score_one.png"));
                break;
            case 2:
                tag.setTexture(cc.textureCache.addImage("res/score_two.png"));
                break;
            case 3:
                tag.setTexture(cc.textureCache.addImage("res/score_three.png"));
                break;

        }
        tag.setVisible(true);
    };
    this.node.on('game_num',function(data){
        self.refreshBtns();
    });
    //设置某个座位的剩余牌数
    this.setSeatNum= function (localindex,num) {
        if(self._seats2){
        self._seats2[localindex].setPokerNum(num);
      }
    };

    this.getLocalIndex=function(index){
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 3) % 3;

        return ret;
    };


    this.initEventHandlers=function(){
        var self = this;
        //新成员加入，更新对应座位信息
        this.node.on('new_user',function(data){

            self.initSingleSeat(data.detail);
        });
    };
    this.initSeats=function(){
        var seats = cc.vv.gameNetMgr.seats;
        for(var i = 0; i < seats.length; ++i){
            this.initSingleSeat(seats[i]);
        }
    };
    this.initSingleSeat=function(seat){
        //得到相对与当前用户的坐标
        //得到客户端对应的座位索引
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatIndex);
        var isOffline = !seat.online;


          console.log("方法为="+this._seats.length);

        this._seats[index].setInfo(seat.name,seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].setPokerNumEnable(false);


        ////游戏过程中的UI，因为游戏过程中某用户也可能掉线，所以连上之后，还需要更新状态
        this._seats2[index].setInfo(seat.name,seat.score);//如果seat.name为null，空，则座位UI隐藏
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);

        this._seats[index].setPokerNumEnable(!(index==0));


    };
    //显示出牌层
    this.displayButton=function(){

        var size=cc.director.getWinSize();
        var  originPoint=cc.director.getVisibleOrigin();
        var  btLayer=this.gameRootNode.getChildByTag(BUTTON_LAYER);
        btLayer.removeAllChildren();//移除叫分层的孩子

        var w=143, h=86;
        var y=originPoint.y+250;
        var textSize=35.0;
        //不出
        var ttfBuChu=new cc.LabelTTF(StringUtil.getString("main_buchu"), "MarkerFelt", textSize);
        var btBuChu=new cc.ControlButton(ttfBuChu, new cc.Scale9Sprite("res/button_bg.png"));
        btBuChu.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btBuChu.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"),cc.CONTROL_STATE_HIGHLIGHTED);
        btBuChu.setPreferredSize(cc.size(w, h));
        btBuChu.setPosition(cc.p(size.width*0.5-w*0.5-w, y));
        btBuChu.addTargetWithActionForControlEvents(this, this.onTouchBuChuAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btLayer.addChild(btBuChu, 0, BUTTON_BUCHU);

        //重选，这个看过了
        var ttfChongXUAN=new cc.LabelTTF(StringUtil.getString("main_chongxuan"), "MarkerFelt", textSize);
        var btChongXuan=new cc.ControlButton(ttfChongXUAN, new cc.Scale9Sprite("res/button_bg.png"));
        btChongXuan.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btChongXuan.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btChongXuan.setPreferredSize(cc.size(w, h));
        btChongXuan.setPosition(cc.p(size.width*0.5-w*0.5, y));
        btChongXuan.addTargetWithActionForControlEvents(this, this.onTouchChongXuanAction,  cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btLayer.addChild(btChongXuan, 0, BUTTON_CHONGXUAN);
        //提示
        var ttfTiShi=new cc.LabelTTF(StringUtil.getString("main_tishi"), "MarkerFelt", textSize);
        var btTiShi=new cc.ControlButton(ttfTiShi, new cc.Scale9Sprite("res/button_bg.png"));
        btTiShi.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btTiShi.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btTiShi.setPreferredSize(cc.size(w, h));
        btTiShi.setPosition(cc.p(size.width*0.5+w*0.5, y));
        btTiShi.addTargetWithActionForControlEvents(this, this.onTouchTiShiAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btLayer.addChild(btTiShi, 0, BUTTON_TISHI);

        //出牌
        var ttfChuPai=new cc.LabelTTF(StringUtil.getString("main_chupai"), "MarkerFelt", textSize);
        var btChuPai=new cc.ControlButton(ttfChuPai, new cc.Scale9Sprite("res/button_bg.png"));
        btChuPai.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btChuPai.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btChuPai.setPreferredSize(cc.size(w, h));
        btChuPai.setPosition(cc.p(size.width*0.5+w+w*0.5, y));
        btChuPai.addTargetWithActionForControlEvents(this,  this.onTouchChuPaiAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btLayer.addChild(btChuPai, 0, BUTTON_CHUPAI);

        //不出 按钮是否可以点击
        if(cc.vv.gameNetMgr.currentCircle==0){ //本人首次出牌，或者是都不要我的牌，从头开始出牌,肯定必须要出，不能点击不出
            btBuChu.setEnabled(false);
        }else{
            btBuChu.setEnabled(true);
        }

        //重选按钮是否可点 ，参数为选中的牌的索引数组
        this.setChongXuanState(cc.vv.gameNetMgr.pokesFlag);

        //出牌按钮是否可点
        this.setChuPaiState(cc.vv.gameNetMgr.pokesFlag);

    };

    //出牌之后的回调
    this.node.on('game_chupai_notify',function(data){
        var seatData = data.detail.seatData;//出牌的座位的数据
        var paiArray=data.detail.paiArray;//出的牌

        var localIndex=self.getLocalIndex(seatData.seatIndex);


        if(seatData.seatIndex == cc.vv.gameNetMgr.seatIndex){
            AIUtil.sort(seatData.holds);

            self.node.persons[0].setPokes(seatData.holds);//传的是指针，
            self.node.persons[0].personCard.setPokes(paiArray);//出得牌
            self.node.persons[0].personCard.setPersonID(0);

            //播放出牌动画，重新排列出牌布局
            var layer=self.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
            var originNum=seatData.holds.length+paiArray.length;
            self.node.persons[0].painChuPai(layer,cc.vv.gameNetMgr.pokesFlag,originNum);

            // 剩下最后一张或者两张的时候，会说  我还有2张牌了
            self.node.soundCom.soundLast(self.node.personPokes().length, self.node.persons[localIndex].sex);

        }
        else{//排列别的玩家的出牌布局
            self.node.persons[localIndex].personCard.setPokes(paiArray);//出得牌
            self.node.persons[localIndex].personCard.setPersonID(localIndex);

            self.node.displayPersonPoker(localIndex);
        }

        //保存全局的card
        self.node.currentCard=self.node.persons[localIndex].personCard;

        var temp=self.node.currentCard;

        if(temp!=null){
            AudioUtil.soundCard(temp.getPokeType(), temp.getValue(),
            self.node.persons[localIndex].sex, self.node.personPokes().length,false);
            self.node.animationCom.cardAnim(temp.getPokeType());

            self.node.isTouchPoker=false;//暂时不可点击界面， 紧跟的那个方法解开

            if(seatData.seatIndex == cc.vv.gameNetMgr.seatIndex) {
                self.node.schedule(self.node.updatePoker, 0.3);
            }
        }

    });



    //准备出牌
    this.node.on('game_chupaiReady',function(){
        //cc.vv.gameNetMgr.pokesFlag
        self.node.isTouchPoker=true;
        self.node.toPerson(cc.vv.gameNetMgr.currentPerson);


    });
    //同步数据
    this.synShowChupai=function(){

        var seatData = cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.lastPerson];//当前出牌的人的数据
        var paiArray=cc.vv.gameNetMgr.paiArray;



        var localIndex=self.getLocalIndex(seatData.seatIndex);


        if(seatData.seatIndex == cc.vv.gameNetMgr.seatIndex){
            AIUtil.sort(seatData.holds);

            self.node.persons[0].setPokes(seatData.holds);//传的是指针，
            self.node.persons[0].personCard.setPokes(paiArray);//出得牌
            self.node.persons[0].personCard.setPersonID(0);

            //播放出牌动画，重新排列出牌布局
            var layer0=self.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);//持有的牌
            var clayer0=self.gameRootNode.getChildByTag(PERSON_CARD_LAYER0);//出的牌
             layer0.removeAllChildren();
             clayer0.removeAllChildren();

            if(cc.vv.gameNetMgr.currentPerson!=cc.vv.gameNetMgr.seatIndex) {
                self.node.persons[0].personCard.paint(clayer0, false);
            }
            self.node.persons[0].paintPoker(layer0, cc.vv.gameNetMgr.gamestate);

        }
        else{//排列别的玩家的出牌布局
            self.node.persons[localIndex].personCard.setPokes(paiArray);//出得牌
            self.node.persons[localIndex].personCard.setPersonID(localIndex);
            var layer;
            var clayer;
            if(localIndex==1){
                layer=self.gameRootNode.getChildByTag(PERSON_POKER_LAYER1);//持有的牌
                clayer=self.gameRootNode.getChildByTag(PERSON_CARD_LAYER1);//出的牌
             }
             else if (localIndex==2) {
                layer=self.gameRootNode.getChildByTag(PERSON_POKER_LAYER2);//持有的牌
                clayer=self.gameRootNode.getChildByTag(PERSON_CARD_LAYER2);//出的牌
             }
            layer.removeAllChildren();
            clayer.removeAllChildren();

            self.node.persons[localIndex].personCard.paint(clayer, false);
            self.node.persons[localIndex].paintPoker(layer, cc.vv.gameNetMgr.gamestate);

        }

        //保存全局的card
        self.node.currentCard=self.node.persons[localIndex].personCard;

        var temp=self.node.currentCard;
        if(!self.node.currentCard.pokes||self.node.currentCard.pokes.length==0){
            self.node.currentCard=null;
        }

        //剩余牌数
        for(var i=0;i<cc.vv.gameNetMgr.holdsCountArr.length;i++){
            var data=cc.vv.gameNetMgr.holdsCountArr;
            var localindex=self.getLocalIndex(i);
            self._seats2[localindex].setPokerNum(data[i]);
        }



    };



    //出牌
    this.onTouchChuPaiAction=function(pSender,controlEvent){
        var layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
        //返回将要出的牌
        var pokesFlag=cc.vv.gameNetMgr.pokesFlag;
        var cardPokes=[];
        for (var i = 0; i < this.node.persons[0].pokes.length; i++) {
            if (pokesFlag[i]) {
                cardPokes.push(this.node.persons[0].pokes[i]); //把将要出的牌加入数组
            }
        }
        cc.vv.net.send("chupai",{cardPokes:cardPokes});

    };

    //重新选牌
    this.onTouchChongXuanAction=function(pSender,controlEvent){

        var layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
        var localIndex= this.getLocalIndex(cc.vv.gameNetMgr.seatIndex);
        this.node.persons[localIndex].chongChu(layer, cc.vv.gameNetMgr.pokesFlag);

        pSender.setEnabled(false);//重出按钮不可点击

        this.setChuPaiState(cc.vv.gameNetMgr.pokesFlag);//此时的flag全为false

    };
    this.onTouchTiShiAction=function(pSender,controlEvent){
        var layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
        var localIndex= this.getLocalIndex(cc.vv.gameNetMgr.seatIndex);
        if(this.node.persons[localIndex].tiShiAI(layer, cc.vv.gameNetMgr.pokesFlag, this.node.currentCard, cc.vv.gameNetMgr.boss)){//参数4，当前boss的peronid

            this.setChongXuanState(cc.vv.gameNetMgr.pokesFlag);//确定重选按钮是否可点击
            this.setChuPaiState(cc.vv.gameNetMgr.pokesFlag);//参数为选中将要出的牌。看看是否可以出牌
        }else{//要不起
              this.buyao();
            //  this.displayPersonPoker(0);
        }
    };
    //一圈转完通知
    this.node.on('game_CircleFinish',function(data){
        self.doCircleFinish();
    });
    this.doCircleFinish=function(){
        this.node.schedule(this.hideTag, 1.0);
        this.node.currentCard = null;//当前的card为NULL，挺关键
        this.node.persons[ cc.vv.gameNetMgr.currentPerson].personCard.pokes=[];
        var localIndex=this.getLocalIndex(cc.vv.gameNetMgr.currentPerson);

        if(localIndex==0 && cc.vv.gameNetMgr.gamestate==0){ //本人操作层，弹出操作层
            //var layer=this.gameRootNode.getChildByTag(BUTTON_LAYER);//玩家操作层 不出，重出等
            //var btBuChu=layer.getChildByTag(BUTTON_BUCHU);
            //btBuChu.setEnabled(false);
            //this.gameRoom.setChuPaiState(cc.vv.gameNetMgr.pokesFlag);
        }

    };
    this.node.on('game_buyaoNotis',function(data){
             self.dobuyaoNotis(data);
    });
    this.dobuyaoNotis=function(data){
        var curIndex=data.detail;
        var localIndex=self.getLocalIndex(curIndex);
        AudioUtil.soundBuYao(this.node.persons[localIndex].sex);

        var tag=this.gameRootNode.getChildByTag(PERSON_TAG_0+localIndex);
        tag.setVisible(true);//显示 不出

        if(localIndex==0) {
            //点击不要的人的出过的牌的数组 清空
            this.node.persons[localIndex].personCard.pokes = [];
        }
    };




        //不出
    this.onTouchBuChuAction=function(pSender,controlEvent){
        this.buyao();

    };

    this.buyao=function(){
        cc.vv.net.send("buyao",cc.vv.gameNetMgr.currentPerson);
    };



    this.setChuPaiState=function(pokesFlag){
        var btLayer=this.gameRootNode.getChildByTag(BUTTON_LAYER);
        var btChupai=btLayer.getChildByTag(BUTTON_CHUPAI);

        var localIndex= this.getLocalIndex(cc.vv.gameNetMgr.seatIndex);

        if(btChupai!=null){
            if(this.node.persons[localIndex].enableChupai(this.node.currentCard, pokesFlag)){
                btChupai.setEnabled(true);
            }else{
                btChupai.setEnabled(false);
            }
        }
    };

    this.setChongXuanState=function(pokesFlag){
        var btLayer=this.gameRootNode.getChildByTag(BUTTON_LAYER);
        var btChongXuan=btLayer.getChildByTag(BUTTON_CHONGXUAN);
        if(btChongXuan!=null){
            var enableCX=false;
            for(var i=0; i<20; i++){
                if(cc.vv.gameNetMgr.pokesFlag[i]){
                    enableCX=true;
                    break;
                }
            }
            if(enableCX){
                btChongXuan.setEnabled(true);
            }else{
                btChongXuan.setEnabled(false);
            }
        }

    };

    //显示叫分层
    this.disPlayDZButton=function(score){
        var size=cc.director.getWinSize();
        var originPoint=cc.director.getVisibleOrigin();
        var btDZLayer=this.gameRootNode.getChildByTag(BUTTON_LAYER);
        btDZLayer.removeAllChildren();
        btDZLayer.setVisible(true);
        var w=143, h=86;
        var y=originPoint.y+250;
        var textSize=35.0;



        var ttfDZBuJiao=new cc.LabelTTF(StringUtil.getString("main_bujiao"), "MarkerFelt", textSize);
        var btDZBuJiao=new cc.ControlButton(ttfDZBuJiao, new cc.Scale9Sprite("res/button_bg.png"));
        btDZBuJiao.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btDZBuJiao.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btDZBuJiao.setPreferredSize(cc.size(w, h));
        btDZBuJiao.setPosition(cc.p(size.width*0.5-w-w*0.5, y));
        btDZBuJiao.addTargetWithActionForControlEvents(this, this.onTouchZDBuJiaoAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btDZLayer.addChild(btDZBuJiao, 0, BUTTON_DZ_BUJIAO);

        var ttfScore1=new cc.LabelTTF(StringUtil.getString("main_score_1"), "MarkerFelt", textSize);
        var btScore1=new cc.ControlButton(ttfScore1, new cc.Scale9Sprite("res/button_bg.png"));
        btScore1.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btScore1.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btScore1.setPreferredSize(cc.size(w, h));
        btScore1.setPosition(cc.p(size.width*0.5-w*0.5, y));
        btScore1.addTargetWithActionForControlEvents(this, this.onTouchZDScore1Action, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btDZLayer.addChild(btScore1, 0, BUTTON_DZ_1);

        var ttfScore2=new cc.LabelTTF(StringUtil.getString("main_score_2"), "MarkerFelt", textSize);
        var btScore2=new cc.ControlButton(ttfScore2, new cc.Scale9Sprite("res/button_bg.png"));
        btScore2.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btScore2.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btScore2.setPreferredSize(cc.size(w, h));
        btScore2.setPosition(cc.p(size.width*0.5+w*0.5, y));
        btScore2.addTargetWithActionForControlEvents(this, this.onTouchZDScore2Action, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btDZLayer.addChild(btScore2, 0, BUTTON_DZ_2);

        var ttfScore3=new cc.LabelTTF(StringUtil.getString("main_score_3"), "MarkerFelt", textSize);
        var btScore3=new cc.ControlButton(ttfScore3, new cc.Scale9Sprite("res/button_bg.png"));
        btScore3.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_disable_bg.png"), cc.CONTROL_STATE_DISABLED);
        btScore3.setBackgroundSpriteForState(new cc.Scale9Sprite("res/button_bg_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btScore3.setPreferredSize(cc.size(w, h));
        btScore3.setPosition(cc.p(size.width*0.5+w+w*0.5, y));
        btScore3.addTargetWithActionForControlEvents(this, this.onTouchZDScore3Action, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        btDZLayer.addChild(btScore3, 0, BUTTON_DZ_3);

        if(score>0){//当前分大于等于1，1分的不能在叫了
            btScore1.setEnabled(false);
        }
        if(score>1){//当前分大于等于2 ，2分的不能再叫了
            btScore2.setEnabled(false);
        }
    };
    this.onTouchZDBuJiaoAction=function(pSender,controlEvent){

        cc.vv.net.send("jiaofen",0);

    }
    this.onTouchZDScore1Action=function(pSender,controlEvent){

        cc.vv.net.send("jiaofen",1);

    },
    this.onTouchZDScore2Action=function(pSender,controlEvent){

        cc.vv.net.send("jiaofen",2);
    },
    this.onTouchZDScore3Action=function(pSender,controlEvent){

        cc.vv.net.send("jiaofen",3);
    },



    cc.spriteFrameCache.addSpriteFrames("res/play_scene.plist");
    this.initUI();
    this.initSeats();
    this.initEventHandlers();

}