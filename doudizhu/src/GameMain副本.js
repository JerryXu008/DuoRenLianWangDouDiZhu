var GameMainLayer = cc.Layer.extend({
    isTouchBeganed:false,
    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();

        cc.spriteFrameCache.addSpriteFrames("res/poker_card.plist");
        this.haveJPQ=false;
        this.haveLuck=false;
        this.haveDouble=false;


         		var  size=cc.director.getWinSize();
         		var bg= new cc.Sprite("res/main_bg.jpg");
         		bg.setPosition(cc.p(size.width*0.5, size.height*0.5));

         		this.addChild(bg, 0);


         //var layerCC=new cc.LayerColor(cc.Color(255, 12, 123, 255));
         //layerCC.setPosition(cc.p(0,0));
         //this.addChild(layerCC,0);

         return true;

    },

//public
 onEnter:function(){

     this._super();

     if( 'touches' in cc.sys.capabilities ) {
         cc.eventManager.addListener({
             event: cc.EventListener.TOUCH_ONE_BY_ONE,
             swallowTouches: true,
             onTouchBegan: this.ccTouchBegan.bind(this),
             onTouchMoved: this.ccTouchMoved.bind(this),
             onTouchEnded: this.ccTouchEnded.bind(this)

         }, this);
     }
     else if("mouse" in cc.sys.capabilities)//如果是网页
         cc.eventManager.addListener
         ({event: cc.EventListener.MOUSE, onMouseDown:this.ccMouseBegan.bind(this),
             onMouseUp:this.ccMouseEnded.bind(this),onMouseMove: this.ccMouseMoved.bind(this)}, this);


     AudioUtil.playBackMusic();




 },

 onExit:function(){

     cc.eventManager.removeAllListeners();
     this.unschedule(this.updateClock);
     this._super();


 },
 onEnterTransitionDidFinish:function(){


     var  originPoint=cc.director.getVisibleOrigin();
     var size=cc.director.getWinSize();



     //左下角主角头像
     var headBg0=new cc.Sprite("res/head_nm.png");
     headBg0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+90));
     this.addChild(headBg0, 0, HEAD_0);

     var head0=new cc.Sprite("res/my_head_0.png");
     head0.setScale(0.2);
     head0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+90));
     this.addChild(head0, 0, MY_HEAD);

     var nameBg0=new cc.Sprite("res/main_name_bg.png");
     nameBg0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+30));
     this.addChild(nameBg0);

     var name0=new cc.LabelTTF("超人", "MarkerFelt", 20);
     name0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+30));
     this.addChild(name0);

     //是否为VIP

     var VIPSprite=new cc.Sprite("res/VIP.png");
     VIPSprite.setPosition(cc.p(originPoint.x+20, size.height/4+originPoint.y+60));
     this.addChild(VIPSprite, 0, VIP_ID);
     var  VIPTime=cc.sys.localStorage.getItem(KEY_VIP);
     if(VIPTime==null){
        VIPTime=0;
     }
     if(VIPTime>TimeUtil.millisecondNow()){
         VIPSprite.setVisible(true);
     }else{
         VIPSprite.setVisible(false);
     }

    //看看记牌器是否到时间了
     var  JPQTime=cc.sys.localStorage.getItem(KEY_JPQ);
     if(JPQTime==null)JPQTime=0;
     if(JPQTime>TimeUtil.millisecondNow()){
          var layer=new JPQLayer();
          this.addChild(layer, 1, JPQ_LAYER);
          this.haveJPQ=true;
     }

     //看看双倍积分是否到时间了
     var  dScoreTime=cc.sys.localStorage.getItem(KEY_DOUBLE_SCORE);
     if(dScoreTime==null)dScoreTime=0;
     if(dScoreTime>TimeUtil.millisecondNow()){
         var card6=new cc.Sprite("res/card6.png");
         card6.setPosition(cc.p(originPoint.x+125, originPoint.y+235));
         card6.setScale(0.4);
         this.addChild(card6, 0);
         this.haveDouble=true;
     }
   //随机人物ID
     this.personId=(Math.GetRandomNum(4));

    // this.personId=0;
     //右上角玩家
     var headBg1=new cc.Sprite("res/head_nm.png");
     headBg1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-60));
     this.addChild(headBg1, 0, HEAD_1);

     // var charName= "res/head_"+(1+this.personId*2)+".jpg";
     var charName= "res/head_"+(1+this.personId*2)+".png";
     var head1=new cc.Sprite(charName);
    // head1.setScale(0.423);
     head1.setScale(0.2);
     head1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-60));
     this.addChild(head1);
     var nameBg1=new cc.Sprite("res/main_name_bg.png");
     nameBg1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-120));
     this.addChild(nameBg1);
     charName= "name_"+ (1+this.personId*2);
     var name1=new cc.LabelTTF(StringUtil.getString(charName), "MarkerFelt", 20);
     name1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-120));
     this.addChild(name1);
     //左上角玩家
     var headBg2=new cc.Sprite("res/head_nm.png");
     headBg2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-60));
     this.addChild(headBg2, 0, HEAD_2);

    // var charName= "res/head_"+(2+this.personId*2)+".jpg";
     var charName= "res/head_"+(2+this.personId*2)+".png";
    var head2=new cc.Sprite(charName);
     //head2.setContentSize(cc.size(163,163));
     head2.setScale(0.2);
     head2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-60));
     this.addChild(head2);
     var nameBg2=new cc.Sprite("res/main_name_bg.png");
     nameBg2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-120));
     this.addChild(nameBg2);
     charName= "name_"+ (2+this.personId*2);
    var name2=new cc.LabelTTF(StringUtil.getString(charName), "MarkerFelt", 20);
     name2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-120));
     this.addChild(name2);

     //三个农民帽子，根据情况显示和隐藏
     var cap0=new cc.Sprite("res/nm_cap.png");
     cap0.setPosition(cc.p(originPoint.x+60-30, size.height/4+originPoint.y+90+30));
     cap0.setVisible(false);
     this.addChild(cap0, 0, CAP_0);
     var cap1=new cc.Sprite("res/nm_cap.png");
     cap1.setPosition(cc.p(size.width-originPoint.x-60-30, size.height-originPoint.y-60+30));
     cap1.setVisible(false);
     this.addChild(cap1, 0, CAP_1);
     var cap2=new cc.Sprite("res/nm_cap.png");
     cap2.setPosition(cc.p(originPoint.x+60-30, size.height-originPoint.y-60+30));
     cap2.setVisible(false);
     this.addChild(cap2, 0, CAP_2);

     //三个 不出图片，根据情况显示或者隐藏
    var  x=size.width*0.5;
     var  y=originPoint.y+200;
    var tag0=new cc.Sprite("res/text_buchu.png");
     tag0.setPosition(cc.p(x, y));
    tag0.setVisible(false);
     this.addChild(tag0, 0, PERSON_TAG_0);

     var tag1=new cc.Sprite("res/text_buchu.png");
     tag1.setPosition(cc.p(x+200, y+180));
      tag1.setVisible(false);
     this.addChild(tag1, 0, PERSON_TAG_1);

     var tag2=new cc.Sprite("res/text_buchu.png");
     tag2.setPosition(cc.p(x-200, y+180));
       tag2.setVisible(false);
     this.addChild(tag2, 0, PERSON_TAG_2);

     //顶部背景图片
     var top=new cc.Sprite("res/main_top.png");
     top.setPosition(cc.p(size.width*0.5 , size.height-originPoint.y-45));
     this.addChild(top);

     //底分
     var ttfScore=new cc.LabelTTF(StringUtil.getString("main_score"), "MarkerFelt", 25);
     ttfScore.setPosition(cc.p(size.width*0.5+140, size.height-originPoint.y-30));
     this.addChild(ttfScore, 0, LABEL_SCORE);
     //倍数
     var ttfmultiple=new cc.LabelTTF(StringUtil.getString("main_multiple"), "MarkerFelt", 25);
     ttfmultiple.setPosition(cc.p(size.width*0.5+140, size.height-originPoint.y-60));
     this.addChild(ttfmultiple, 0, LABEL_MUTIPLE);

     //胜了多少场
     this.win=cc.sys.localStorage.getItem(KEY_WIN);
     if(this.win==null)this.win=0;

     var  strWin=this.win;
     var  textWin=StringUtil.getString("main_win");
     textWin+=strWin;
     var ttfWin=new cc.LabelTTF(textWin, "MarkerFelt", 25);
     ttfWin.setPosition(cc.p(size.width*0.5-170, size.height-originPoint.y-30));
     this.addChild(ttfWin, 0, LABEL_WIN);

     //输了多少场
     this.lose=cc.sys.localStorage.getItem(KEY_LOSE);
     if(this.lose==null)this.lose=0;
     var strLose=this.lose;
     var  textLose=StringUtil.getString("main_lose");
     textLose+=strLose;
     var ttfLose=new cc.LabelTTF(textLose, "MarkerFelt", 25);
     ttfLose.setPosition(cc.p(size.width*0.5-170, size.height-originPoint.y-60));
     this.addChild(ttfLose, 0, LABEL_LOSE);

     //显示当前时间
     var ttfTime=new cc.LabelTTF(this.getNowTime(), "MarkerFelt", 25);
     ttfTime.setPosition(cc.p(size.width+originPoint.x-80, originPoint.y+200));
     this.addChild(ttfTime, 0, LABEL_TIME);

     //未出牌的层显示
     var personPokerLayer0=new cc.Layer();
     personPokerLayer0.setPosition(cc.p(0, 0));
     this.addChild(personPokerLayer0, 0, PERSON_POKER_LAYER0);
     var personPokerLayer1=new cc.Layer();
     personPokerLayer1.setPosition(cc.p(0, 0));
     this.addChild(personPokerLayer1, 0, PERSON_POKER_LAYER1);
     var personPokerLayer2=new cc.Layer();
     personPokerLayer2.setPosition(cc.p(0, 0));
     this.addChild(personPokerLayer2, 0, PERSON_POKER_LAYER2);
     //出牌的层显示
     var cardLayer0=new cc.Layer();
     cardLayer0.setPosition(cc.p(0, 0));
     this.addChild(cardLayer0, 0, PERSON_CARD_LAYER0);
     var cardLayer1=new cc.Layer();
     cardLayer1.setPosition(cc.p(0, 0));
     this.addChild(cardLayer1, 0, PERSON_CARD_LAYER1);
     var cardLayer2=new cc.Layer();
     cardLayer2.setPosition(cc.p(0, 0));
     this.addChild(cardLayer2, 0, PERSON_CARD_LAYER2);

     //叫分的时候的弹层
     var btLayer=new cc.Layer();
     btLayer.setPosition(cc.p(0, 0));
     this.addChild(btLayer, 0, BUTTON_LAYER);

     var menuImage = new cc.MenuItemImage("res/feedback.png", "res/feedback_pressed.png",null, this.menuFeedBack, this);

     //退出按钮
     var itemBack=new cc.MenuItemImage(
         "res/main_tuic.png",
         "res/main_tuic_pressed.png",
         null,
         this.menuCloseCallback,
         this);
     itemBack.setPosition(cc.p(size.width*0.5-250, size.height-originPoint.y-40));



     //设置按钮
     var itemSetting=new cc.MenuItemImage(
         "res/main_shez.png",
         "res/main_shez_pressed.png",
         null,
         this.menuShowSetting,this);
     itemSetting.setPosition(cc.p(size.width*0.5 +240, size.height-originPoint.y-40));




     //任务按钮
     var onTask=new cc.MenuItemSprite(new cc.Sprite("res/button_task.png"),  new cc.Sprite("res/button_task.png"));
     var offTask=new cc.MenuItemSprite(new cc.Sprite("res/button_task.png"), new cc.Sprite("res/button_task.png"));
     var itemTask=new cc.MenuItemToggle( onTask, offTask, this.menuTask,this);
     itemTask.setPosition(cc.p(size.width-originPoint.x-itemTask.getContentSize().width*0.5,size.height*0.5+itemTask.getContentSize().height*0.5));


     //执行任务，之后再看

     this.date=cc.sys.localStorage.getItem(KEY_TASK_DATE);
     if(this.date!=this.getNowDate()){//24小时之后重新分配任务
         this.isShowTaskBg=true;
         //var taskBg=new cc.Sprite("res/button_task_bg.png");
         //taskBg.setPosition(cc.p(size.width-originPoint.x-itemTask.getContentSize().width*0.5
         //    , size.height*0.5+itemTask.getContentSize().height*0.5));
         //this.addChild(taskBg, 0, TASK_BG);
         //taskBg.runAction(new cc.Blink(0.5,1).repeatForever());
         //
         //taskBg.setVisible(false);

         this.date=this.getNowDate();
         var task=Math.GetRandomNum(4);
         cc.sys.localStorage.setItem(KEY_TASK, task);
         cc.sys.localStorage.setItem(KEY_TASK_DATE, this.date);
         cc.sys.localStorage.setItem(KEY_TASK0_C, false);
         cc.sys.localStorage.setItem(KEY_TASK1_C, false);
         cc.sys.localStorage.setItem(KEY_TASK_TIMES, 0);
         cc.sys.localStorage.setItem(KEY_TASK_WIN, 0);

     }else{
         this.isShowTaskBg=false;
     }

    //右方中间的扑克按钮,道具按钮
     var onPoker=new cc.MenuItemSprite(new cc.Sprite("res/button_poker.png"), new cc.Sprite("res/button_poker.png"));
     var offPoker=new cc.MenuItemSprite(new cc.Sprite("res/button_poker.png"), new cc.Sprite("res/button_poker.png"));
     var itemPoker=new cc.MenuItemToggle(onPoker, offPoker, this.menuPoker ,this);
     itemPoker.setPosition(cc.p(size.width-originPoint.x-itemPoker.getContentSize().width*0.5
         , size.height*0.5-itemPoker.getContentSize().height*0.5));




     var  pMenu = new cc.Menu(itemBack, itemSetting, itemTask, itemPoker);
     pMenu.setPosition(cc.p(0,0));
     this.addChild(pMenu);

     var labelTask=new cc.LabelTTF(StringUtil.getString("label_task"), "MarkerFelt", 25);
     labelTask.setPosition(itemTask.getPosition());
     this.addChild(labelTask);
     var labelPoker=new cc.LabelTTF(StringUtil.getString("label_poker"), "MarkerFelt", 25);
     labelPoker.setPosition(itemPoker.getPosition());
     this.addChild(labelPoker);



     itemTask.setVisible(false);
     itemPoker.setVisible(false);
     labelTask.setVisible(false);
     labelPoker.setVisible(false);





     //出牌倒计时钟表
     var clockBg=new cc.Sprite("res/clock.png");
     this.addChild(clockBg, 0, CLOCK_BG);
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
     this.addChild(threePoker0, 0, POKER_ONE);
     var threePoker1=new cc.Sprite("#backbig.png");
     threePoker1.setPosition(cc.p(x, y));
     this.addChild(threePoker1, 0, POKER_TWO);
     var threePoker2=new cc.Sprite("#backbig.png");
     threePoker2.setPosition(cc.p(x+50, y));
     this.addChild(threePoker2, 0, POKER_THREE);


      this.fenpai(); //确定每个玩家的牌，和底牌

     this.displayPersonPoker(); //把当前玩家的发牌数据以图形方式展现出来

     this.selectorDZ();

     this.schedule(this.updateClock, 1.0);


     this._super();



     var dialog=new DialogPoker();
     this.addChild(dialog, 0, DIALOG_POKER);
     dialog.show();


 },
//鼠标事件
 ccMouseBegan:function(event){
     cc.log("主页点击111");

     this.isTouchBeganed=true;


     if(this.op==0 && this.isTouchPoker){
         var size=cc.director.getWinSize();
         var originPoint=cc.director.getVisibleOrigin();
         var point=event.getLocation();
         var x=point.x;
         var y=point.y;

         var count=this.personPokes[0].length;

         //var w=(size.width-originPoint.x)/count*0.8;
         if(count%2==0){
             var w=(size.width-originPoint.x)/20*0.8;
         }
         else{
             var w=(size.width-originPoint.x)/21*0.8;
         }


         var startX;
         var endX;
         var text= "#poke1.png";
         var tempPoker=new cc.Sprite(text);
             var contensizeX=tempPoker.getContentSize().width*0.8/2;
             startX=size.width*0.5+(-parseInt(count*0.5))*w-contensizeX;
             if(count%2==0) {
                 startX =startX+ w/2;
             }

             endX=startX+(count-1)*w+contensizeX*2;
             //cc.log("startX="+startX+"  endX="+endX);
             //cc.log("MouseX="+x+" MouseY="+y);
             var contensizeHeight=tempPoker.getContentSize().height*0.8;

             if(y<originPoint.y+contensizeHeight && x>startX && x<endX){
                 AudioUtil.soundControl(0);

                 var index=parseInt((x-startX)/w);
                 if(index>count-1){
                     index=count-1;
                 }
                 var layer=this.getChildByTag(PERSON_POKER_LAYER0);
                 var poker= layer.getChildByTag(POKER_STRAT_ID+index);
                 cc.log("扑克tag0="+(POKER_STRAT_ID));
                 cc.log("扑克tag1="+(index));
                 cc.log("扑克tag="+(POKER_STRAT_ID+index));
                 cc.log("扑克="+poker);

                 poker.setColor({r:100, g:100, b:100});
                 this.pIndex=index;
                 return true;
             }
     }
     this.pIndex=-1;
     return true;




 },
 ccMouseMoved:function(event){

     cc.log("鼠标移动");
     if(this.isTouchBeganed){

         if(this.op==0 && this.isTouchPoker && this.pIndex!=-1){
             var size=cc.director.getWinSize();
             var originPoint=cc.director.getVisibleOrigin();
             var point=event.getLocation();
             var x=point.x;
             var y=point.y;
             var count=this.personPokes[0].length;
             //var w=(size.width-originPoint.x)/count*0.8;
             if(count%2==0){
                 var w=(size.width-originPoint.x)/20*0.8;
             }
             else{
                 var w=(size.width-originPoint.x)/21*0.8;
             }
             var startX;
             var endX;
             var text= "#poke1.png";
             var tempPoker=new cc.Sprite(text);
             var contensizeX=tempPoker.getContentSize().width*0.8/2;
             startX=size.width*0.5+(-parseInt(count*0.5))*w-contensizeX;
             if(count%2==0) {
                 startX =startX+ w/2;
             }
             endX=startX+(count-1)*w+contensizeX*2;
             var contensizeHeight=tempPoker.getContentSize().height*0.8;


             if(y<originPoint.y+contensizeHeight && x>startX && x<endX){
                 var index=parseInt((x-startX)/w);
                 if(index>count-1){
                     index=count-1;
                 }
                 var layer=this.getChildByTag(PERSON_POKER_LAYER0);
                 for(var i=0;i!=this.pokerIndex.length; i++){
                     var poker=layer.getChildByTag(POKER_STRAT_ID+this.pokerIndex[i]);
                     poker.setColor({r:255, g:255, b:255});
                 }
                 this.pokerIndex=[];

                 if(this.pIndex<=index){
                     for(var i=this.pIndex; i<=index; i++){
                         this.pokerIndex.push(i);
                         var poker=layer.getChildByTag(POKER_STRAT_ID+i);
                         poker.setColor({r:100, g:100, b:100});
                     }
                 }else if(this.pIndex>index){
                     for(var i=index; i<=this.pIndex; i++){
                         this.pokerIndex.push(i);
                         var poker=layer.getChildByTag(POKER_STRAT_ID+i);
                         poker.setColor({r:100, g:100, b:100});
                     }
                 }



             }
         }


     }

 },
 ccMouseEnded:function(event){
     this.isTouchBeganed=false;
     var size=cc.director.getWinSize();
     var originPoint=cc.director.getVisibleOrigin();
     var point=event.getLocation();
     var x=point.x;
     var y=point.y;
     var count=this.personPokes[0].length;
     var w=83;
     var h=86;
     var hX=originPoint.x+60;
     var hY=size.height/4+originPoint.y+90;

     //点击3个玩家的头像
     if(x>=hX-w*0.5 && x<hX+w*0.5 && y>hY-h*0.5 && y<hY+h*0.5){

         var dialog=new DialogPerson();
         this.addChild(dialog);
         dialog.show(0);
         return;
     }
     hX=size.width-originPoint.x-60;
     hY=size.height-originPoint.y-50;
     if(x>=hX-w*0.5 && x<hX+w*0.5 && y>hY-h*0.5&& y<hY+h*0.5){

         var dialog=new DialogPerson();
          this.addChild(dialog);
          dialog.show(1+this.personId*2);
         return;
     }
     hX=originPoint.x+60;
     hY=size.height-originPoint.y-50;
     if(x>=hX-w*0.5 && x<hX+w*0.5 && y>hY-h*0.5 && y<hY+h*0.5){

         var dialog=new DialogPerson();
         this.addChild(dialog);
         dialog.show(2+this.personId*2);
         return;
     }



     if(this.op==0 && this.isTouchPoker){
         var layer=this.getChildByTag(PERSON_POKER_LAYER0);
         var count=this.personPokes[0].length;
        // var w=(size.width-originPoint.x)/count*0.8;
         if(count%2==0){
             var w=(size.width-originPoint.x)/20*0.8;
         }
         else{
             var w=(size.width-originPoint.x)/21*0.8;
         }

         if(this.pokerIndex.length>1){
             var pokers=[];
             for(var i=0; i!=this.pokerIndex.length; i++){
                 var  index=this.pokerIndex[i];
                 pokers.push(this.personPokes[0][index]);
             }
             //根据用户滑动选中的牌，提示合适的牌，看完了
             if(this.persons[0].tiShiAI2(layer, this.pokesFlag, this.currentCard, this.boss, pokers)){

                 this.setChongXuanState(this.pokesFlag);
                 this.setChuPaiState(this.pokesFlag);
             }
             else{ //else 被Jerry增加，没有合适的牌，也要设置按钮状态
                 this.setChongXuanState(this.pokesFlag);
                 this.setChuPaiState(this.pokesFlag);
             }
         }else{

             var startX;
             var endX;
             var text= "#poke1.png";
             var tempPoker=new cc.Sprite(text);
             var contensizeX=tempPoker.getContentSize().width*0.8/2;
             startX=size.width*0.5+(-parseInt(count*0.5))*w-contensizeX;
             if(count%2==0) {
                 startX =startX+ w/2;
             }
             endX=startX+(count-1)*w+contensizeX*2;
             var contensizeHeight=tempPoker.getContentSize().height*0.8;
             var yy=originPoint.y+85*0.8;
             if(y<originPoint.y+contensizeHeight && x>startX && x<endX){
                 var index=parseInt((x-startX)/w);
                 if(index>count-1){
                     index=count-1;
                 }
                 var poker=layer.getChildByTag(POKER_STRAT_ID+index);
                 if(!this.pokesFlag[index]){
                     this.pokesFlag[index]=true;
                     poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), yy+12)));
                     //根据对手的牌型，给予一定提示
                     //或者如果自己是第一个出牌，根据自己的2次点击，出顺子
                     //看完，写的挺好
                     this.persons[0].tiShiPoker(layer, this.pokesFlag, this.currentCard);
                 }else{
                     this.pokesFlag[index]=false;
                     poker.runAction(new  cc.MoveTo(0.1, cc.p(poker.getPositionX(), yy)));
                 }
                 if(this.currentPerson==0){
                     this.setChongXuanState(this.pokesFlag);//判断重选按钮
                     this.setChuPaiState(this.pokesFlag);//判断出牌按钮是否可点击,看过了
                 }
             }
         }

         for(var i=0; i!=this.personPokes[0].length; i++){
             var poker=layer.getChildByTag(POKER_STRAT_ID+i);
             poker.setColor({r:255, g:255, b:255});

             //cc.log("END扑克tag0="+(POKER_STRAT_ID));
             //cc.log("END扑克tag1="+(index));
             //cc.log("END扑克tag="+(POKER_STRAT_ID+index));
             //cc.log("END扑克="+poker);

         }
         this.pokerIndex=[];
     }





 },

    //触摸事件,移植到手机的时候在考虑
    ccTouchBegan:function(touch,event1){


      return this.ccMouseBegan(touch);

    },
    ccTouchMoved:function(touch,event1){


       this.ccMouseMoved(touch)
    },
    ccTouchEnded:function(touch,event1){
        this.ccMouseEnded(touch)

    },



  menuShop :function(){

  },
  menuCloseCallback :function(){

      cc.director.runScene(new  GameIndexScene());
  },
  menuShowSetting :function(){

      var settingLayer=new DiaLogSettingLayer();
      settingLayer.setPosition(cc.p(0, 0));
      settingLayer.show();
      this.addChild(settingLayer);


  },
  menuTask :function(){
      if(this.isShowTaskBg){
          this.isShowTaskBg=false;
          var taskBg=this.getChildByTag(TASK_BG);
          taskBg.stopAllActions();
          taskBg.removeFromParent();
      }

      var dialog=new DialogTask();
      this.addChild(dialog, 0, DIALOG_TASK);
      dialog.show();



  },
  menuPoker :function(){

      var dialog=new DialogPoker();
      this.addChild(dialog, 0, DIALOG_POKER);
      dialog.show();

  },
  fenpai:function(){

      this.op=-2;
      this.currentCircle=0;
      this.bossCircle=0;
      this.isTouchPoker=true;

      this.currentMultiple=1;
      this. currentCard=null;
      this.timeValue=20;

      //根据当前得分更换玩家头像
      var myHead=this.getChildByTag(MY_HEAD);
      var  score=cc.sys.localStorage.getItem(KEY_SCORE);
      if(score<800){
          myHead.setTexture(cc.textureCache.addImage("res/my_head_0.png"));
      }else if(score<1500){
          myHead.setTexture(cc.textureCache.addImage("res/my_head_1.png"));
      }else{
          myHead.setTexture(cc.textureCache.addImage("res/my_head_2.png"));
      }


      this.updateMultiple(-1); //更新倍数，开始为1倍
      this.updateScore(0); //更新得分

      //隐藏三个不出图片
      for(var i=0; i<3; i++){
          var tag=this.getChildByTag(PERSON_TAG_0+i);
          tag.setVisible(false);
      }

      for (var i = 0; i < 54; i++) {
          this.deskPokes[i]=i;
      }
      for(var i=0; i<20; i++){
          this.pokesFlag[i]=false;
      }
      this.personPokes=[];
      this.personPokes[0]=[];
      this.personPokes[1]=[];
      this.personPokes[2]=[];


      for (var i = 0; i < 54; i++) { //随机进行交换
          var des = Math.GetRandomNum(54);
       //  cc.log("随机数="+des);
          var  temp = this.deskPokes[i];
          this.deskPokes[i] = this.deskPokes[des];
          this.deskPokes[des] = temp;


      }

//test
    //  this.haveLuck=true;
      if(this.haveLuck){

          this.haveLuck=false;
          //var luckCard=this.getChildByTag(LUCK_CARD);
          //luckCard.removeFromParent();

          var value = Math.GetRandomNum(13)+3;

          var  index=0;
          for ( var  i = 0; i < 54; i++) { //给你一个炸弹
              if(value==AIUtil.getPokeValue(this.deskPokes[i])){
                  var temp = this.deskPokes[i];
                  this.deskPokes[i] = this.deskPokes[index];
                  this.deskPokes[index] = temp;
                  index++;

              }
          }
      }
      else{

          var  r=Math.GetRandomNum(10);

          if(r<7){
              var personIds=[0, 0];//lengh=2
              personIds[0] = Math.GetRandomNum(3); //0-1-2

              do{
                  personIds[1] = Math.GetRandomNum(3); ////0-1-2
              }while(personIds[1]==personIds[0]);



              if(personIds[0]<personIds[1]){ //personIds[0]永远大于personIds[1]
                  var temp=personIds[1];
                  personIds[1]=personIds[0];
                  personIds[0]=temp;
              }


              var values=[0, 0];
              values[0]=Math.GetRandomNum(13)+3;// 3-15    随机选出2张牌 values[0] values[1]
              do
              {
                  values[1]=Math.GetRandomNum(13)+3;//3-15
              } while (values[0]==values[1]);

              var index=0;
              for (var i = 0; i < 54; i++) {
                  if(values[0]==AIUtil.getPokeValue(this.deskPokes[i])){ //每次会有4张和values[0]一样
                      var temp = this.deskPokes[i];
                      this.deskPokes[i] = this.deskPokes[index];
                      this.deskPokes[index] = temp;
                      index++;
                  }
              }
              //上面执行完毕后，destPorkes[0] destPorkes[1] destPorkes[2] destPorkes[3] 都对应 values[0],她们都是连续的数

              index=personIds[0]*17; //可能的直  0 17  34
              for(var i=0; i<4; i++){
                  var temp = this.deskPokes[i];
                  this.deskPokes[i] = this.deskPokes[index];
                  this.deskPokes[index] = temp;
                  index++;
              }
              //cout<<"index="<<index-4<<endl;
              //cout<<"第一次交换后扑克数组前四个值"<<deskPokes[index-1] <<"=="<<deskPokes[index-2]<<"=="<<deskPokes[index-3]<<"=="<< deskPokes[index-4]<<endl;

              index=0;
              for (var i = 0; i < 54; i++) {
                  if(values[1]==AIUtil.getPokeValue(this.deskPokes[i])){//每次会有4张和values[1]一样
                      var temp = this.deskPokes[i];
                      this.deskPokes[i] = this.deskPokes[index];
                      this.deskPokes[index] = temp;
                      index++;
                  }
              }
              index=personIds[1]*17;
              for(var i=0; i<4; i++){
                  var temp = this.deskPokes[i];
                  this.deskPokes[i] = this.deskPokes[index];
                  this.deskPokes[index] = temp;
                  index++;
              }

              //cout<<"index2="<<index-4<<endl;
              //cout<<"第二次交换后扑克数组前四个值"<<deskPokes[index-1] <<"=="<<deskPokes[index-2]<<"=="<<deskPokes[index-3]<<"=="<< deskPokes[index-4]<<endl;

          }
      }


      for(var i=0; i<17; i++){
          this.personPokes[0][i]=this.deskPokes[i];
         ///cc.log("本人的牌="+this.deskPokes[i]);
      }
      for(var i=17; i<34; i++){
          this.personPokes[1][i%17]=this.deskPokes[i];
         // cout<<"第二组派="<<i<<"="<<deskPokes[i]<<endl;
      }
      for(var i=34; i<51; i++){
          this.personPokes[2][i%17]=this.deskPokes[i];
         // cout<<"第三组派="<<i<<"="<<deskPokes[i]<<endl;
      }

      /*
       经过上面的排列，可能出现连续一样的牌的一种情况是  0，1，2，3一样    17-18-19-20 一样    34-35-36-37一样
       */
//冒泡排序，从大到小排序
      AIUtil.sort(this.personPokes[0]);
      AIUtil.sort(this.personPokes[1]);
      AIUtil.sort(this.personPokes[2]);



      this.persons[0].sex=0;
      this.persons[1].sex=0;
      if(this.personId==3){
          this.persons[2].sex=1;
      }else{
          this.persons[2].sex=0;
      }
      //if(this.personId!=3){
      //    this.persons[2].sex=1;
      //}else{
      //    this.persons[2].sex=0;
      //}

      //玩家本人
      cc.sys.localStorage.setItem(KEY_NAME, StringUtil.getString("no_name"));
      this.persons[0].name=cc.sys.localStorage.getItem(KEY_NAME);
      
                                    var charName="name_"+ (1+this.personId*2);
      this.persons[1].name=StringUtil.getString(charName);
      var charName="name_"+ (2+this.personId*2);
      this.persons[2].name=StringUtil.getString(charName);



      this.persons[0].setId(0);
      this.persons[0].setPokes(this.personPokes[0]);//传的是指针，
      this.persons[0].personCard.pokes=[];
      this.persons[1].setId(1);
      this.persons[1].setPokes(this.personPokes[1]);
      this.persons[1].personCard.pokes=[];
      this.persons[2].setId(2);
      this.persons[2].setPokes(this.personPokes[2]);
      this.persons[2].personCard.pokes=[];


      this.persons[0].setPosition(this.persons[2], this.persons[1]); //设置出牌顺序 ,左上角玩家先出，然后本人出，最后右上角玩家出
      this.persons[1].setPosition(this.persons[0], this.persons[2]);
      this.persons[2].setPosition(this.persons[1], this.persons[0]);

      //三张底牌
      this.threePokes[0] = this.deskPokes[51];
      this.threePokes[1] = this.deskPokes[52];
      this.threePokes[2] = this.deskPokes[53];
      //截止到上面，每个peron应该有的牌都确定了，三张底牌也确定了

       this.updateJPQ(this.haveJPQ);
      this.schedule(this.pokerDeal, 0.5);

  },
    displayPersonPoker:function(personId){
        var len= arguments.length;
        if(1 == len)
        {
            this.displayPersonPoker2(personId);
        }
        else{
            this.displayPersonPoker1();
        }
    },
  displayPersonPoker1:function(){//展示3个玩家的牌的图像

      var layer0=this.getChildByTag(PERSON_POKER_LAYER0);
      var layer1=this.getChildByTag(PERSON_POKER_LAYER1);
      var layer2=this.getChildByTag(PERSON_POKER_LAYER2);
      var clayer0=this.getChildByTag(PERSON_CARD_LAYER0);
      var clayer1=this.getChildByTag(PERSON_CARD_LAYER1);
      var clayer2=this.getChildByTag(PERSON_CARD_LAYER2);

      cc.log("看看Layer0="+layer0);


      layer0.removeAllChildren();
      layer1.removeAllChildren();
      layer2.removeAllChildren();
      clayer0.removeAllChildren();
      clayer1.removeAllChildren();
      clayer2.removeAllChildren();

      this.displayThreePoker();

      //已经出过的牌的层
      this.persons[0].personCard.paint(clayer0);
      this.persons[1].personCard.paint(clayer1);
      this.persons[2].personCard.paint(clayer2);

      //展示牌的层
      this.persons[0].paintPoker(layer0, this.op);
      this.persons[1].paintPoker(layer1, this.op);
      this.persons[2].paintPoker(layer2, this.op);

      for(var i=0; i<20; i++){
          this.pokesFlag[i]=false;
      }


  },
  displayPersonPoker2:function( personId){
      var layer;
      var clayer;
      switch(personId){
          case 0:
              for(var i=0; i<20; i++){
                  this.pokesFlag[i]=false; //清空选中的牌的状态
          }
              layer=this.getChildByTag(PERSON_POKER_LAYER0);
              clayer=this.getChildByTag(PERSON_CARD_LAYER0);
              break;
          case 1:
              layer=this.getChildByTag(PERSON_POKER_LAYER1);
              clayer=this.getChildByTag(PERSON_CARD_LAYER1);
              break;
          case 2:
              layer=this.getChildByTag(PERSON_POKER_LAYER2);
              clayer=this.getChildByTag(PERSON_CARD_LAYER2);
              break;
      }
      layer.removeAllChildren();
      clayer.removeAllChildren();

      //排列出过的牌
      this.persons[personId].personCard.paint(clayer, true);
      //排列没有出的牌
      this.persons[personId].paintPoker(layer, this.op);
  } ,
    selectorDZ:function(){
        this.haveDZ=false;//目前没有地主

        for(var i=0; i<3; i++){
            this.dzJiaofen[i]=true;//目前都可以叫分
        }
        this.op=-1;
        this.currentPerson=Math.getRandomNum(3);

        //test
        //this.currentPerson=0 ;

        // 明天看电脑自己出牌 ，在复习下职能提示出牌,确认代码是不是一定最大，要不了了
        this.toPerson(this.currentPerson);

    },
  usedCard:function(id){
      switch(id){
          case 0://重新洗牌
          {
              this.unschedule(this.PersonAI1);
              this.unschedule(this.PersonAI2);
              this.fenpai();
              this.displayPersonPoker();
              this.selectorDZ();

          }
              break;
          case 1://双倍积分
          {
              var score=0;
              if(this.currentScore==0){
                  score=2;
              }else{
                  score=2*this.currentScore;
              }
              this.updateScore(score);

          }
              break;
          case 2://把自己的积分由负变为0
          {
              var score=cc.sys.localStorage.getItem(KEY_SCORE);
              if(score==null)score=0;

              if(score<0){
                  cc.sys.localStorage.setItem(KEY_SCORE, 0);
              }
          }
              break;
          case 3://允许在叫地主前翻看一张底牌
          {
              var text;
              text="poke"+this.threePokes[0]+".png";
              var poker=this.getChildByTag(POKER_ONE);

              var frame=cc.spriteFrameCache.getSpriteFrame(text);
              poker.setSpriteFrame(frame);
              poker.setScale(0.4);
          }
              break;
          case 4://使用该道具将获得5秒看对手牌的机会
          {
              var layer=new cc.Layer();
              this.addChild(layer, 1, LOOK_PERSON_POKER);
              if(this.op==0 && this.boss!=0 ){
                  this.persons[this.boss].paintPoker(layer);
              }else{

                  var id=Math.getRandomNum(2)+1;
                  this.persons[id].paintPoker(layer);
              }
              this.schedule(this.hidePersonPoker,5.0);
          }
              break;
          case 5://统计剩余牌情况，道具有效期10天
          {
             cc.sys.localStorage.setItem(KEY_JPQ, parseInt(TimeUtil.millisecondNow())+10*24*60*60);

              var layer=new JPQLayer();
              this.addChild(layer, 1, JPQ_LAYER);
              var p=[];
              for(var i=0;i<this.personPokes[0].length;i++){
                  p.push(this.personPokes[0][i]);
              }
              for(var i=0;i<this.personPokes[1].length;i++){
                  p.push(this.personPokes[1][i]);
              }
              for(var i=0;i<this.personPokes[2].length;i++){
                  p.push(this.personPokes[2][i]);
              }
              if(this.op<0){
                  p.push(this.threePokes[0]);
                  p.push(this.threePokes[1]);
                  p.push(this.threePokes[2]);
              }
              layer.show(p);
              this.haveJPQ=true;
          }
              break;
          case 6://使用该道具一旦胜局将获得双倍积分，
          {
              cc.sys.localStorage.setItem(KEY_DOUBLE_SCORE,  parseInt(TimeUtil.millisecondNow())+10*24*60*60);

              var size=cc.director.getWinSize();
              var originPoint=cc.director.getVisibleOrigin();
              var card6=new cc.Sprite("res/card6.png");
              card6.setPosition(cc.p(size.width*0.5-531*0.5+80, size.height*0.5));
              this.addChild(card6, 0);
              card6.runAction(new cc.Spawn(new cc.MoveTo(0.5, cc.p(originPoint.x+125, originPoint.y+235))
          , new cc.ScaleTo(0.5, 0.4)));
              this.haveDouble=true;
          }
              break;
          case 7://使用该道具，下一盘将能分配到有炸弹的牌
          {
              var size=cc.director.getWinSize();
              var originPoint=cc.director.getVisibleOrigin();
              var card7=new cc.Sprite("res/card7.png");
              card7.setPosition(cc.p(size.width*0.5-531*0.5+80, size.height*0.5));
              this.addChild(card7, 1, LUCK_CARD);
              card7.runAction(new cc.Spawn(new cc.MoveTo(0.5, cc.p(originPoint.x+140, originPoint.y+235))
          ,new cc.ScaleTo(0.5, 0.4)));
              this.haveLuck=true;
          }
              break;
      }
  },



//private
 op:-1, //-1表示正在进行叫分操作，0表示出牌过程中  1表示出牌结束
 loadingNum:0,
date:0,
 win:0,
lose:0,
timeValue:0,
personId:0,
 pIndex:0,
 isShowTaskBg:0,
 isTouchPoker:0,
 haveDZ:0,
 haveJPQ:0,
 haveDouble:0,
 haveLuck:0,

 dzJiaofen:[3],
 currentPerson:0,
 currentCard:null,
 persons:[new Person(),new Person(),new Person()],
 boss:0,
 bossCircle:0,
    currentScore:0,
 currentMultiple:0,
 currentCircle:0,
 pokesFlag:[20],
 deskPokes:[54],
 threePokes:[3],
    personPoke:[], //std::vector<int> personPokes[3];
    pokerIndex:[],//std::vector<int> pokerIndex;




 displayThreePoker:function(){

     var threePoker0=this.getChildByTag(POKER_ONE);
     var threePoker1=this.getChildByTag(POKER_TWO);
     var threePoker2=this.getChildByTag(POKER_THREE);
     if(this.op<0){

         var frame=cc.spriteFrameCache.getSpriteFrame("backbig.png");
         threePoker0.setSpriteFrame(frame);
         threePoker1.setSpriteFrame(frame);
         threePoker2.setSpriteFrame(frame);
         threePoker0.setScale(0.4);
         threePoker1.setScale(0.4);
         threePoker2.setScale(0.4);
     }else{
         var text;
         text="poke"+this.threePokes[0]+".png";
         var frame=cc.spriteFrameCache.getSpriteFrame(text);
         threePoker0.setSpriteFrame(frame);
         threePoker0.setScale(0.4);

         text="poke"+this.threePokes[1]+".png";
         frame=cc.spriteFrameCache.getSpriteFrame(text);
         threePoker1.setSpriteFrame(frame);
         threePoker1.setScale(0.4);

         text="poke"+this.threePokes[2]+".png";
         frame=cc.spriteFrameCache.getSpriteFrame(text);
         threePoker2.setSpriteFrame(frame);
         threePoker2.setScale(0.4);
     }
 },

 displayButton:function(){

     var size=cc.director.getWinSize();
     var  originPoint=cc.director.getVisibleOrigin();
     var  btLayer=this.getChildByTag(BUTTON_LAYER);
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
     if(this.currentCircle==0){ //本人首次出牌，或者是都不要我的牌，从头开始出牌,肯定必须要出，不能点击不出
         btBuChu.setEnabled(false);
     }else{
         btBuChu.setEnabled(true);
     }

     //重选按钮是否可点 ，参数为选中的牌的索引数组
     this.setChongXuanState(this.pokesFlag);

     //出牌按钮是否可点
     this.setChuPaiState(this.pokesFlag);

 },

 disPlayDZButton:function(score){
     var size=cc.director.getWinSize();
     var originPoint=cc.director.getVisibleOrigin();
     var btDZLayer=this.getChildByTag(BUTTON_LAYER);
     btDZLayer.removeAllChildren();

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
 },
 toPerson:function(personId){

     this.timeValue=20;//每次转换玩家，从新倒计时


     if(this.op<0){ //进行选牌过程
         if(this.haveDZ){ //

             this.op=0; //操作完毕
             this.displayPersonPoker(); //展示交完地主之后扑克图片
         }else{
             //目前还没走到这里
             if(!this.dzJiaofen[personId]){
                 this.nextPerson();
                 return;
             }
         }

     }
     else{
         //隐藏当前person的叫分精灵,以及不要 提示
         var tag=this.getChildByTag(PERSON_TAG_0+ personId);
         tag.setVisible(false);


         //清除出过的牌的层里面的子元素，以便下面的可以出新牌
         //这样到某个电脑出牌的时候，因为要延迟三秒，这里在3秒前先清空之前出过的牌，3秒之后再出新的牌
         //或者是到本人出牌的时候，要弹出操作层，要先移除之前出过的牌
         var cardLayer;
         switch(this.currentPerson){
             case 0:
                 cardLayer=this.getChildByTag(PERSON_CARD_LAYER0);
                 break;
             case 1:
                 cardLayer=this.getChildByTag(PERSON_CARD_LAYER1);
                 break;
             case 2:
                 cardLayer=this.getChildByTag(PERSON_CARD_LAYER2);
                 break;
         }
         cardLayer.removeAllChildren();
     }

     if(this.currentPerson==0){ //当前叫分的是本人

         if(this.op<0){

             this.disPlayDZButton(this.currentScore);  //首次弹出选分弹层
         }else{

             this.displayButton();//弹出出牌层,同时移除选分层

             //看完
             if(this.persons[0].noBigCard(this.currentCard)){//看看本人目前手里的牌有没有大于上家电脑出的牌
                 var toast=new CToast();
                 this.addChild(toast, 2);
                 var size=cc.director.getWinSize();
                 var originPoint=cc.director.getVisibleOrigin();
                 toast.showImage("res/no_big_card.png", size.width*0.5, originPoint.y+60, 3.0);
             }
         }
     }else{
         //移除本人的用于出牌，重发等的弹层
         var layer=this.getChildByTag(BUTTON_LAYER);
         layer.removeAllChildren();

         //3秒后电脑叫分,或者出牌
         if(this.currentPerson==1){
             this.schedule(this.PersonAI1, 3.0);
         }else if(this.currentPerson==2){
             this.schedule(this.PersonAI2, 3.0);
         }
     }

 },

  gameOver:function(){


      //玩了多少局了
       var times=cc.sys.localStorage.getItem(KEY_TASK_TIMES);
       if(times==null)times=0;
       cc.sys.localStorage.setItem(KEY_TASK_TIMES, ++times);

       this.op=1;//操作为1

      if(this.win+this.lose<2){ //第一局玩完之后给予一定奖励，第二局就没这好事了

          var index=Math.getRandomNum(4);
          var keys=[KEY_CARD0, KEY_CARD4, KEY_CARD1, KEY_CARD3];
          var count=cc.sys.localStorage.getItem(keys[index]);
          if(count==null)count=1;
          count++;
          cc.sys.localStorage.setItem(keys[index], count);
          var toast=new CToast();
          this.addChild(toast, 3);
          var c;;
          c= "label_card"+index;
          toast.showString(StringUtil.getString(c), 3.0);
      }
      var isBoss;
      var score0=0, score1=0, score2=0;

      //得到地主和农民应该得到的分数或者失去的分数
      // 如果当前的是boss，说明boss跑了
      if(this.currentPerson==this.boss){
          isBoss=true;
          //本人就是boss
          if(this.boss==0){
              var todayWin=cc.sys.localStorage.getItem(KEY_TASK_WIN);
              if(todayWin==null)todayWin=0;
              cc.sys.localStorage.setItem(KEY_TASK_WIN, ++todayWin);
              this.win++;
              AudioUtil.playWinSound();
              if(this.personPokes[1].length==17 && this.personPokes[2].length==17){//对手一张牌没出
                  this.currentMultiple*=2;
              }
              score0=this.currentScore*this.currentMultiple*2;
              score1=-this.currentScore*this.currentMultiple;
              score2=-this.currentScore*this.currentMultiple;

              //本人不是地主，说明输了
          }else{
              this.lose++;
              AudioUtil.playLoseSound();
              if(this.boss==1){
                  if(this.personPokes[0].length==17 && this.personPokes[2].length==17){
                      this.currentMultiple*=2;
                  }
                  score0=-this.currentScore*this.currentMultiple;
                  score1=this.currentScore*this.currentMultiple*2;
                  score2=-this.currentScore*this.currentMultiple;

              }else{
                  if(this.personPokes[0].length==17 && this.personPokes[1].length==17){
                      this.currentMultiple*=2;
                  }
                  score0=-this.currentScore*this.currentMultiple;
                  score1=-this.currentScore*this.currentMultiple;
                  score2=this.currentScore*this.currentMultiple*2;
              }

          }

      }else{//如果是农民赢了
          isBoss=false;
          if(this.bossCircle==1){ //如果是农民第一把就一直出牌，地主就刚开始出了一把牌，那么加倍
              this.currentMultiple*=2;
          }
          //本人是地主
          if(this.boss==0){
              this.lose++;
              AudioUtil.playLoseSound();
              score0=-this.currentScore*this.currentMultiple*2;
              score1=this.currentScore*this.currentMultiple;
              score2=this.currentScore*this.currentMultiple;

          }else{ //本人是农民
              var todayWin=cc.sys.localStorage.getItem(KEY_TASK_WIN);
              if(todayWin==null)todayWin=0;
              cc.sys.localStorage.setItem(KEY_TASK_WIN, ++todayWin);
              this.win++;
              AudioUtil.playWinSound();
              score0=this.currentScore*this.currentMultiple;
              if(this.boss==1){
                  score1=-this.currentScore*this.currentMultiple*2;
                  score2=this.currentScore*this.currentMultiple;
              }else{
                  score1=this.currentScore*this.currentMultiple;
                  score2=-this.currentScore*this.currentMultiple*2;
              }
          }
      }

      //统计输赢了多少场
      var labelWin=this.getChildByTag(LABEL_WIN);
      var labelLose=this.getChildByTag(LABEL_LOSE);
      var v;
      v=this.win;
      var value=v;
      var label=StringUtil.getString("main_win");
      label+=value;
      labelWin.setString(label);
      v=this.lose;
      value=v;
      label=StringUtil.getString("main_lose");
      label+=value;
      labelLose.setString(label);
      cc.sys.localStorage.setItem(KEY_WIN, this.win);
      cc.sys.localStorage.setItem(KEY_LOSE, this.lose);
     // cc.log("胜利="+this.win+"  失败="+this.lose);

      var  btLayer=this.getChildByTag(BUTTON_LAYER);
      btLayer.removeAllChildren();

      //把电脑的牌也显示出来
      this.displayPersonPoker();


      var  scoreLayer=new DialogSucceedLayer();

      if(score0>0 &&this.haveDouble){//使用了积分双倍的道具
          score0*=2;
      }
      var data=[];
      data[0]=this.currentScore;
      data[1]=this.currentMultiple;
      data[2]=score0;
      data[3]=score1;
      data[4]=score2;


      var c1=cc.sys.localStorage.getItem(KEY_SCORE);
      if(c1=null){
          cc.sys.localStorage.setItem(KEY_SCORE,0);
          c1=0;
      }

      if(data[5]==null)data[5]=0;
      data[5]+=score0;
      cc.sys.localStorage.setItem(KEY_SCORE, data[5]);

      scoreLayer.show(isBoss, data
          , this.persons[0].name, this.persons[1].name, this.persons[2].name);
      this.addChild(scoreLayer);

      this.completeTask();



  },
  setDZ:function(id){

       this.schedule(this.hideTag, 1.0);//把叫分恢复成 不出 并隐藏

      this.haveDZ=true;//  确定地主了
      this.boss=id;
      this.currentPerson=this.boss;

      if(this.personPokes[0].length==17){
          this.personPokes[this.boss].push(this.threePokes[0]);
          this.personPokes[this.boss].push(this.threePokes[1]);
          this.personPokes[this.boss].push(this.threePokes[2]);
      }
      //添加了3张牌，重新排序
      AIUtil.sort(this.personPokes[this.boss]);

      var cap0=this.getChildByTag(CAP_0);
      var cap1=this.getChildByTag(CAP_1);
      var cap2=this.getChildByTag(CAP_2);
      var head0=this.getChildByTag(HEAD_0);
      var head1=this.getChildByTag(HEAD_1);
      var head2=this.getChildByTag(HEAD_2);
      if(!cap0.isVisible()){
          cap0.setVisible(true);
      }
      if(!cap1.isVisible()){
          cap1.setVisible(true);
      }
      if(!cap2.isVisible()){
          cap2.setVisible(true);
      }


      switch(this.boss){
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

      this.toPerson(this.currentPerson);

  },


  PersonAI1:function(dt){
      this.unschedule(this.PersonAI1);
      if(this.op<0){

          var score=Math.getRandomNum(3)+1;
          //test
         // score=3;
          this.showDzScore(1, score);
      }else if(this.op==0){


          var temp=this.persons[1].chupaiAI(this.currentCard, this.boss, this.persons);

         // alert("a1剩余"+this.persons[1].pokes.length);
          if(temp!=null){
              if(this.boss==1){
                  this.bossCircle++;//
              }
              var isfrist=false;
              if(this.currentCard==null){
                  isfrist=true;
              }
              AudioUtil.soundCard(temp.getPokeType(), temp.getValue(), this.persons[1].sex, this.personPokes[1].length,isfrist);
              this.cardAnim(temp.getPokeType());
              //更新赔率
              this.updateMultiple(temp.getPokeType());
              //把电脑一设置为当前的牌
              this.currentCard=temp;

              this.displayPersonPoker(1);

              this.nextPerson();
              //最后剩下2张或者一张，放声音
              this.soundLast(this.personPokes[1].length, this.persons[1].sex);
              //一会再看
              this.updateJPQ(this.haveJPQ);
          }else{
              this.buyao();
              this.displayPersonPoker(1);
          }
      }
  },
  PersonAI2:function(dt){
      this.unschedule(this.PersonAI2);
      if(this.op<0){
          var score=Math.getRandomNum(3)+1;
          score=1;
          this.showDzScore(2, score);
      }else if(this.op==0){

          var temp=this.persons[2].chupaiAI(this.currentCard, this.boss, this.persons);
          if(temp!=null){
              if(this.boss==2){
                  this.bossCircle++;
              }
              var isfrist=false;
              if(this.currentCard==null){
                  isfrist=true;
              }
              AudioUtil.soundCard(temp.getPokeType(), temp.getValue(), this.persons[2].sex, this.personPokes[2].length,isfrist);
              this.cardAnim(temp.getPokeType());
              this.updateMultiple(temp.getPokeType());
              this.currentCard=temp;

              this.displayPersonPoker(2);
              this.nextPerson();
              this.soundLast(this.personPokes[2].length, this.persons[2].sex);
              this.updateJPQ(this.haveJPQ);
          }else{
              this.buyao();
              this.displayPersonPoker(2);
          }
      }
  },
  updateClock:function(dt){
      var c ;

      var originPoint=cc.director.getVisibleOrigin();
      var size=cc.director.getWinSize();
      c=this.timeValue;


      var clockBg=this.getChildByTag(CLOCK_BG);
      var clockValue=clockBg.getChildByTag(CLOCK_VALUE);

      if(this.op==-2 || this.op==1){
          clockBg.setVisible(false);
      }else{
          clockBg.setVisible(true);
      }

      var x=originPoint.x;
      var y=originPoint.y;
      switch(this.currentPerson){
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
      this.timeValue--;


      if(this.timeValue<0){
          this.timeValue=0;
          if(this.currentPerson==0){
              if(this.op<0){

                  var score=Math.getRandomNum(3)+1;

                  if(score==3){ //直接设置为地主
                      this.showDzScore(0, 3);
                      //setDZ(0);//暂时感觉没用
                      return;
                  }else if(score>this.currentScore){
                      this.showDzScore(0, score);
                  }
                  //当score比currentscore小的时候这里有bug
                  //以前的
                  //nextPerson();
                  //修改之后的
                  else{
                      this.showDzScore(0, score);
                  }


              }else if(this.op==0){//出牌了
                  var temp=this.persons[0].chupaiAI(this.currentCard, this.boss, this.persons);
                  if(temp!=null){
                      this.currentCard=temp;
                      this.displayPersonPoker(0);
                      this.nextPerson();
                  }else{
                      this.buyao();
                      this.displayPersonPoker(0);
                  }
              }
          }
      }
      var labelTime=this.getChildByTag(LABEL_TIME);
      labelTime.setString(this.getNowTime());

  },

  updatePoker:function(dt){
      this.unschedule(this.updatePoker);
      this.isTouchPoker=true;
      this.displayPersonPoker(0);
  },

  pokerLast1M:function(dt){
      this.unschedule(this.pokerLast1M);
      AudioUtil.soundLast(1, 0);
  },
  pokerLast1W:function(dt){
      this.unschedule(this.pokerLast1W);
      AudioUtil.soundLast(1, 1);
  },
  pokerLast2M:function(dt){
      this.unschedule(this.pokerLast2M);
      AudioUtil.soundLast(2, 0);
  },
  pokerLast2W:function(dt){
      this.unschedule(this.pokerLast2W);
      AudioUtil.soundLast(2, 1);
  },
  soundLast:function(last,sex){

      if(last==1){
          if(sex==0){
              this.schedule(this.pokerLast1M, 0.8);
          }else{
              this.schedule(this.pokerLast1W, 0.8);
          }
      }else if(last==2){
          if(sex==0){
              this.schedule(this.pokerLast2M, 0.8);
          }else{
              this.schedule(this.pokerLast2W, 0.8);
          }
      }
  },
   hidePersonPoker:function( dt){
    this.unschedule(this.hidePersonPoker);
     var layer=this.getChildByTag(LOOK_PERSON_POKER);
     layer.removeFromParent();
},
  pokerDeal:function(dt){
      this.unschedule(this.pokerDeal);
      AudioUtil.soundControl(1);
  },

  showDzScore:function(persionid,score){

      if(score>this.currentScore){
          this.updateScore(score);
          this.currentScore=score;
      }else{ //比当前分数叫的低，那么这个人之后不能在叫分了,一般不叫的时候会走
          score=0;
          this.dzJiaofen[persionid]=false;//不允许叫分了
      }
      AudioUtil.soundQDZ(score, this.persons[persionid].sex);//播放声音

      //对应某个人显示积分的图片展示
      var tag=this.getChildByTag(PERSON_TAG_0+ persionid);
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


      if(score==3){ //叫了3分，那么肯定就是地主了
          this.setDZ(persionid);
      }
      else{ //叫的不是3分
          var count=0;
          var  index=0;
          for(var i=0; i<3; i++){
              if(!this.dzJiaofen[i]){
                  count++;
              }else{
                  index=i; //轮到下一个人叫分
              }
          }
          if(count==2){
              this.setDZ(index);//这个
          }else{
              this.nextPerson(); //轮到下个人
          }
      }

  },
  hideTag:function(dt){

      this.unschedule(this.hideTag);
      for(var i=0; i<3; i++){
          var tag=this.getChildByTag(PERSON_TAG_0+i);
          tag.setTexture(cc.textureCache.addImage("res/text_buchu.png"));
          tag.setVisible(false);
      }

  },

  updateMultiple:function(type){

      if(type==PokerType.zhadan || type==PokerType.huojian){
          this.currentMultiple*=2;

          var  strValue=this.currentMultiple+"";
          var  strMultiple=StringUtil.getString("main_multiple");
          strMultiple+=strValue;
          var text=this.getChildByTag(LABEL_MUTIPLE);
          text.setString(strMultiple);
      }else if(type==-1){
          var strMultiple=StringUtil.getString("main_multiple"); //倍数
          strMultiple+="1";
          var text=this.getChildByTag(LABEL_MUTIPLE);//更新倍数
          text.setString(strMultiple);
      }


  },
  updateScore:function(score){

      if(score==0 || score>this.currentScore){
          this.currentScore=score;
          var strValue=score;
          var strScore=StringUtil.getString("main_score");
          strScore+=strValue;
          var text=this.getChildByTag(LABEL_SCORE);
          text.setString(strScore);
      }

  },
  updateJPQ:function(haveJPQ){//更新记牌器

  if(haveJPQ){
    var layer= this.getChildByTag( JPQ_LAYER);

    var p=[];
    for(var i=0;i<this.personPokes[0].length;i++){
        p.push(this.personPokes[0][i]);
    }
    for(var i=0;i<this.personPokes[1].length;i++){
        p.push(this.personPokes[1][i]);
    }
    for(var i=0;i<this.personPokes[2].length;i++){
        p.push(this.personPokes[2][i]);
    }
    if(this.op<0){
        p.push(this.threePokes[0]);
        p.push(this.threePokes[1]);
        p.push(this.threePokes[2]);
    }
    layer.show(p);

}
  },

  nextPerson:function(){

      if(this.op==0){
          this.currentCircle++;
      }
      if(this.personPokes[0].length==0 || this.personPokes[1].length==0 || this.personPokes[2].length==0){
          this.gameOver();
          return;
      }
      switch (this.currentPerson) {
          case 0:
              this.currentPerson = 1;
              break;
          case 1:
              this.currentPerson = 2;
              break;
          case 2:
              this.currentPerson = 0;
              break;
      }
      this.toPerson(this.currentPerson);
  },
  buyao:function(){
      AudioUtil.soundBuYao(this.persons[this.currentPerson].sex);
      var tag=this.getChildByTag(PERSON_TAG_0+this.currentPerson);
     //("显示:"+this.currentPerson);
      tag.setVisible(true);//显示 不出

      //点击不要的人的出过的牌的数组 清空
      this.persons[this.currentPerson].personCard.pokes=[];

      this.nextPerson();
      //这个挺关键的，比如A1出牌之后，A2不要，本人也不要，那么目前的人就是上次出牌的人，就是说从头再出牌了
      if (this.currentCard != null && this.currentPerson == this.currentCard.personID) {
          this.currentCircle = 0;

           this.schedule(this.hideTag, 1.0);
          this.currentCard = null;//当前的card为NULL，挺关键
          this.persons[ this.currentPerson].personCard.pokes=[];

          if(this.currentPerson==0 && this.op==0){ //本人操作层，弹出操作层
              var layer=this.getChildByTag(BUTTON_LAYER);//玩家操作层 不出，重出等
              var btBuChu=layer.getChildByTag(BUTTON_BUCHU);
              btBuChu.setEnabled(false);
              this.setChuPaiState(this.pokesFlag);
          }
      }



  },

  setChongXuanState:function(pokesFlag){
      var btLayer=this.getChildByTag(BUTTON_LAYER);
      var btChongXuan=btLayer.getChildByTag(BUTTON_CHONGXUAN);
      if(btChongXuan!=null){
          var enableCX=false;
          for(var i=0; i<20; i++){
              if(this.pokesFlag[i]){
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

  }, //[]
  setChuPaiState:function(pokesFlag){
      var btLayer=this.getChildByTag(BUTTON_LAYER);
      var btChupai=btLayer.getChildByTag(BUTTON_CHUPAI);
      if(btChupai!=null){
          if(this.persons[0].enableChupai(this.currentCard, pokesFlag)){
              btChupai.setEnabled(true);
          }else{
              btChupai.setEnabled(false);
          }
      }
  },
  //出牌
  onTouchChuPaiAction:function(pSender,controlEvent){
      var layer=this.getChildByTag(PERSON_POKER_LAYER0);
      //返回将要出的牌

      var temp=this.persons[0].chupai(this.currentCard, this.pokesFlag, layer);

      //cc.log("本人剩余几张:"+this.persons[0].pokes.length);

      if(temp!=null){
          if(this.boss==0){
              this.bossCircle++;
          }
          //出声音,播放出的哪张牌
          var isfrist=false;
          if(this.currentCard==null){
              isfrist=true;
          }

          AudioUtil.soundCard(temp.getPokeType(), temp.getValue(), this.persons[0].sex, this.personPokes[0].length,isfrist);
          //特殊牌比如火箭，飞机啥的，播放一些动画，很简单
          this.cardAnim(temp.getPokeType());
          ////更新倍数
          this.updateMultiple(temp.getPokeType());

          this.currentCard=temp;//最新的出的牌为当前最新牌

           this.isTouchPoker=false;//暂时不可点击界面， 紧跟的那个方法解开
          ////这里为啥要延时，因为在persons[0].chupai出牌里面会对出的牌进行一个0.3秒的移动动画，而在GameMain::updatePoker里面会对本人出的牌进行一个坐标定位，
          //// 你知道的moveto在cocos2dx中会叠加的，所以为了避免突然跳到一个位置，在移动，所以等0.3秒执行完毕之后，在定位
           this.schedule(this.updatePoker, 0.3);
          //
          this.nextPerson();
          //// 剩下最后一张或者两张的时候，会说  我还有2张牌了
          this.soundLast(this.personPokes[0].length, this.persons[0].sex);

          this.updateJPQ(this.haveJPQ); //记牌器，
      }

  },
    //不出
  onTouchBuChuAction:function(pSender,controlEvent){

      this.buyao();
      this.displayPersonPoker(0);
  },//提示
  onTouchTiShiAction:function(pSender,controlEvent){
      var layer=this.getChildByTag(PERSON_POKER_LAYER0);

      if(this.persons[0].tiShiAI(layer, this.pokesFlag, this.currentCard, this.boss)){//参数4，当前boss的peronid

          this.setChongXuanState(this.pokesFlag);//确定重选按钮是否可点击
          this.setChuPaiState(this.pokesFlag);//参数为选中将要出的牌。看看是否可以出牌
      }else{//要不起
          this.buyao();
          this.displayPersonPoker(0);
      }
  },
  //重新选牌
  onTouchChongXuanAction:function(pSender,controlEvent){

      var layer=this.getChildByTag(PERSON_POKER_LAYER0);
      this.persons[0].chongChu(layer, this.pokesFlag);
      pSender.setEnabled(false);//重出按钮不可点击
      this.setChuPaiState(this.pokesFlag);//此时的flag全为false

  },

  onTouchZDBuJiaoAction:function(pSender,controlEvent){
    this.showDzScore(0, 0);
  },
  onTouchZDScore1Action:function(pSender,controlEvent){
      this.showDzScore(0, 1);
  },
  onTouchZDScore2Action:function(pSender,controlEvent){
      this.showDzScore(0, 2);
  },
  onTouchZDScore3Action:function(pSender,controlEvent){
      this.showDzScore(0, 3);
  },

  getNowTime:function(){

      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var hours=date.getHours();
      if(hours>=0&&hours<=9){
          hours="0"+hours;

      }
      var minut=date.getMinutes();
      if(minut>=0&&minut<=9){
          minut="0"+minut;

      }
      //var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      //    + " " + date.getHours() + seperator2 + date.getMinutes()
      //    + seperator2 + date.getSeconds();
      //
      var currentdate =   hours + seperator2 + minut


      return currentdate;

  },
  getNowDate:function(){

      var oDate = new Date(); //实例一个时间对象；
      return oDate.getFullYear()+""+(oDate.getMonth()+1)+""+oDate.getDate();


  },
  completeTask:function(){

      var task=cc.sys.localStorage.getItem(KEY_TASK);
      if(task==null)task=0;

       //test
      //task=0;
      var task0=task*2;
      var task1=task*2+1;
      var count=cc.sys.localStorage.getItem(KEY_TASK_TIMES);
      var win=cc.sys.localStorage.getItem(KEY_TASK_WIN);


      var labels =["label_task0", "label_task1", "label_task2", "label_task3"
          , "label_task4", "label_task5", "label_task6", "label_task7"];
      var cards=[KEY_CARD0, KEY_CARD4, KEY_CARD1, KEY_CARD3, KEY_CARD3, KEY_CARD1, KEY_CARD4, KEY_CARD0];


      //看看任务一完成了没，打完多少据
      if(!cc.sys.localStorage.getItem(KEY_TASK0_C)){
          if(task0<6){
              if(count>=(task0+2)/2*10){
                  cc.sys.localStorage.setItem(KEY_TASK0_C, true);
                  var toast=new CToast();
                  this.addChild(toast, 3);
                  toast.showString(StringUtil.getString(labels[task0]), 3.0);
                  var cardCount=cc.sys.localStorage.getItem(cards[task0] );
                  if(cardCount==null)cardCount=1;
                  cc.sys.localStorage.setItem(cards[task0], ++cardCount);
              }
          }else{
              if(count>=50){
                  //完成任务
                  cc.sys.localStorage.setItem(KEY_TASK0_C, true);
                  var toast=new CToast();
                  this.addChild(toast, 3);
                  toast.showString(StringUtil.getString(labels[task0]), 3.0);
                  var cardCount=cc.sys.localStorage.getItem(cards[task0]);
                  if(cardCount==null)cardCount=1;
                  cc.sys.localStorage.setItem(cards[task0], ++cardCount);
              }
          }
      }



      if(task1>1){
          if(win>=(11-task1)/2*10-10){
              cc.sys.localStorage.setItem(KEY_TASK1_C, true);
              var toast=new CToast();
              this.addChild(toast, 3);
              toast.showString(StringUtil.getString(labels[task1]), 3.0);
              var cardCount=cc.sys.localStorage.getItem(cards[task1]);
              if(cardCount==null)cardCount=1;
              cc.sys.localStorage.setItem(cards[task1], ++cardCount);
          }
      }else{
          if(win>=50){
              cc.sys.localStorage.setItem(KEY_TASK1_C, true);
              var toast=new CToast();
              this.addChild(toast, 3);
              toast.showString(StringUtil.getString(labels[task1]), 3.0);
              if(cardCount==null)cardCount=1;
              cc.sys.localStorage.setItem(cards[task1], ++cardCount);
          }
      }

  }
    ,

 cardAnim:function( type){



     var size=cc.director.getWinSize();

     if(type==PokerType.feiji || type==PokerType.feijicb){
         cc.spriteFrameCache.addSpriteFrames("res/action_plane0.plist");
         cc.spriteFrameCache.addSpriteFrames("res/FJ.plist");
         var sprite0=new cc.Sprite("#spr_action_plane_0.png");
         sprite0.setPosition(cc.p(size.width*0.5+300, size.height*0.5));
         //sprite0.setScale(0.5);
         this.addChild(sprite0, 0, ANIM_SPRITE);

         //var sprite1 =new cc.Sprite("#spr_action_plane_0.png");
         //sprite1.setScale(4.0);
         //sprite1.setPosition(cc.p(sprite0.getContentSize().width+3*sprite1.getContentSize().width*0.5, sprite0.getContentSize().height*0.5));
         //
         //sprite0.addChild(sprite1);
         var animFrames = [];
         var str;
         for(var i = 1; i < 4; i++)
         {
             str="spr_action_plane"+i+".png";
             var frame =cc.spriteFrameCache.getSpriteFrame(str);
             animFrames.push(frame);
         }
         var animation = new cc.Animation(animFrames, 0.05);
         animation.setLoops(-1);
        // sprite1.runAction(new cc.Animate(animation));
         sprite0.runAction(new cc.MoveTo(1.2, cc.p(size.width*0.5-600, size.height*0.5)));
         this.schedule(this.removeCardAnim, 1.5);

         //cc.spriteFrameCache.addSpriteFrames("res/FJ.plist");
         //var sprite0=new cc.Sprite("#FJYW.png");
         //sprite0.setPosition(cc.p(size.width*0.5+300, size.height*0.5));
         //sprite0.setScale(0.5);
         //this.addChild(sprite0, 0, ANIM_SPRITE);
         //
         //var sprite1 =new cc.Sprite("#FJYW-1.png");
         //sprite1.setScale(4.0);
         //sprite1.setPosition(cc.p(sprite0.getContentSize().width+3*sprite1.getContentSize().width*0.5, sprite0.getContentSize().height*0.5));
         //
         //sprite0.addChild(sprite1);
         //var animFrames = [];
         //var str;
         //for(var i = 1; i < 7; i++)
         //{
         //    str="FJYW-"+i+".png";
         //    var frame =cc.spriteFrameCache.getSpriteFrame(str);
         //    animFrames.push(frame);
         //}
         //var animation = new cc.Animation(animFrames, 0.05);
         //animation.setLoops(-1);
         //sprite1.runAction(new cc.Animate(animation));
         //sprite0.runAction(new cc.MoveTo(1.5, cc.p(size.width*0.5-300, size.height*0.5)));
         //this.schedule(this.removeCardAnim, 1.5);



     }else if(type==PokerType.zhadan){


         cc.spriteFrameCache.addSpriteFrames("res/action_bomb0.plist");
         var sprite=new cc.Sprite("#spr_action_bomb_0.png");
         sprite.setPosition(cc.p(size.width*0.5, size.height*0.5+150));
         this.addChild(sprite, 0, ANIM_SPRITE);

         var animFrames = [];
         var str;
         for(var i = 1; i < 14; i++)
         {
             str="spr_action_bomb_"+i+".png";
             var frame = cc.spriteFrameCache.getSpriteFrame(str);
             animFrames.push(frame);
         }
         var animation = new cc.Animation(animFrames, 0.1);
         animation.setLoops(1);
         sprite.runAction(new cc.Animate(animation));
         this.schedule(this.removeCardAnim, 1.5);


         //cc.spriteFrameCache.addSpriteFrames("res/ZD.plist");
         //var sprite=new cc.Sprite("#zhad-1.png");
         //sprite.setPosition(cc.p(size.width*0.5, size.height*0.5));
         //this.addChild(sprite, 0, ANIM_SPRITE);
         //
         //var animFrames = [];
         //var str;
         //for(var i = 1; i < 14; i++)
         //{
         //    str="zhad-"+i+".png";
         //    var frame = cc.spriteFrameCache.getSpriteFrame(str);
         //    animFrames.push(frame);
         //}
         //var animation = new cc.Animation(animFrames, 0.1);
         //animation.setLoops(1);
         //sprite.runAction(new cc.Animate(animation));
         //this.schedule(this.removeCardAnim, 1.5);



     }else if(type==PokerType.huojian){

         //var sprite0=new cc.Sprite("#huo0001.png");
         //sprite0.setPosition(cc.p(size.width*0.5, size.height*0.5-200));
         //this.addChild(sprite0, 0, ANIM_SPRITE);
         //
         //var animFrames = [];
         //var str;
         //for(var i = 1; i < 7; i++)
         //{
         //    str="huo000"+i+".png";
         //    var frame = cc.spriteFrameCache.getSpriteFrame(str);
         //    animFrames.push(frame);
         //}
         //var animation = new cc.Animation(animFrames, 0.05);
         //animation.setLoops(-1);
         //sprite0.runAction(new cc.Animate(animation));
         //
         //var sprite1=new cc.Sprite("#huojianji.png");
         //sprite1.setPosition(cc.p(sprite0.getContentSize().width*0.5-30, sprite0.getContentSize().height*0.5+75));
         //sprite0.addChild(sprite1);
         cc.spriteFrameCache.addSpriteFrames("res/action_rocket0.plist");


         var sprite2=new cc.Sprite("#spr_action_rocket_0.png");
         sprite2.setPosition(cc.p(size.width*0.5, size.height*0.5-200));
         this.addChild(sprite2, 0, ANIM_YANG);

         var  animFrames1 =[];
         for(var i = 1; i < 3; i++)
         {
             str="spr_action_rocket_"+i+".png";
             var frame = cc.spriteFrameCache.getSpriteFrame(str);
             animFrames1.push(frame);
         }
         var animation1 = new cc.Animation(animFrames, 0.05);
         animation1.setLoops(-1);
         sprite2.runAction(new cc.Animate(animation1));
         sprite2.runAction(new cc.MoveTo(1.2, cc.p(size.width*0.5, size.height*0.5+460)));
         this.schedule(this.removeCardAnim, 1.5);

         //cc.spriteFrameCache.addSpriteFrames("res/HJ.plist");
         //var sprite0=new cc.Sprite("#huo0001.png");
         //sprite0.setPosition(cc.p(size.width*0.5, size.height*0.5-200));
         //this.addChild(sprite0, 0, ANIM_SPRITE);
         //
         //var animFrames = [];
         //var str;
         //for(var i = 1; i < 7; i++)
         //{
         //   str="huo000"+i+".png";
         //    var frame = cc.spriteFrameCache.getSpriteFrame(str);
         //    animFrames.push(frame);
         //}
         //var animation = new cc.Animation(animFrames, 0.05);
         //animation.setLoops(-1);
         //sprite0.runAction(new cc.Animate(animation));
         //
         //var sprite1=new cc.Sprite("#huojianji.png");
         //sprite1.setPosition(cc.p(sprite0.getContentSize().width*0.5-30, sprite0.getContentSize().height*0.5+75));
         //sprite0.addChild(sprite1);
         //
         //
         //var sprite2=new cc.Sprite("#yang-1.png");
         //sprite2.setPosition(cc.p(size.width*0.5, size.height*0.5-200));
         //this.addChild(sprite2, 0, ANIM_YANG);
         //
         //var  animFrames1 =[];
         //for(var i = 1; i < 9; i++)
         //{
         //     str="yang-"+i+".png";
         //    var frame = cc.spriteFrameCache.getSpriteFrame(str);
         //    animFrames1.push(frame);
         //}
         //var animation1 = new cc.Animation(animFrames, 0.05);
         //animation1.setLoops(-1);
         //sprite2.runAction(new cc.Animate(animation1));
         //sprite0.runAction(new cc.MoveTo(1.5, cc.p(size.width*0.5, size.height*0.5+120)));
         //this.schedule(this.removeCardAnim, 1.5);
     }

 },
 removeCardAnim:function( dt){

     this.unschedule(this.removeCardAnim);
     var sprite=this.getChildByTag(ANIM_SPRITE);
     if(sprite!=null){
         sprite.removeFromParent(true);
     }
     var yang=this.getChildByTag(ANIM_YANG);
     if(yang!=null){
         yang.removeFromParent(true);
     }
 },
 loadingCallBack:function(obj){

 }



});

var GameMainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();


        var layer = new GameMainLayer();

        this.addChild(layer);
    }
});
