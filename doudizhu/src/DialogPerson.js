/**
 * Created by song on 16/11/23.
 */
var DialogPerson= cc.Layer.extend({

    ctor: function () {

        this._super();
         var bgLayer=new cc.Layer();
          this.addChild(bgLayer);
        cc.eventManager.addListener(
            {event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:this.ccTouchBegan2}, bgLayer);


        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        var bg=new cc.Sprite("res/dialog_person_bg.png");
        bg.setPosition(cc.p(size.width*0.5, size.height*0.5));
        this.addChild(bg, 0, GAME_SETTING_BG);
        var w=451.0, h=416.0;

        var title=new cc.LabelTTF(StringUtil.getString("dialog_person_title"), "MarkerFelt", 30);
        title.setPosition(cc.p(w*0.5, h-30));
        bg.addChild(title);


        var btClose=new cc.ControlButton(new cc.Scale9Sprite("res/close.png"));
        btClose.setBackgroundSpriteForState(new cc.Scale9Sprite("res/close_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btClose.setPreferredSize(cc.size(50,50));
        btClose.setPosition(cc.p(w-35, h-35));
        btClose.addTargetWithActionForControlEvents(this, this.cancel, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        bg.addChild(btClose, 0, GAME_SETTING_BACK);
         return true;
    },

  //  public:

 cancel:function(pSender,controlEvent){
   this.removeFromParent();
},
 show:function( id){
     var size=cc.director.getWinSize();
     var bg=this.getChildByTag(GAME_SETTING_BG);
     bg.setScale(0);
     bg.runAction(new cc.ScaleTo(0.5, 1, 1));

     var x=120;
     var y=250;

     var c;
     if(id>0){
        //c= "res/head_"+id+".jpg";

         c= "res/head_"+id+".png";
         var head=new cc.Sprite(c);
         head.setPosition(cc.p(x, y));
         head.setScale(0.5);

         bg.addChild(head);

         c= "name_"+ id;
         var name=new cc.LabelTTF(StringUtil.getString(c), "MarkerFelt", 25);
         name.setColor({r:98,g:207,b: 227});
         name.setPosition(cc.p(x+150, y+50));
         bg.addChild(name);

         c= "introduce_"+ id;
         var introduce=new cc.LabelTTF(StringUtil.getString(c), "MarkerFelt", 25);
         introduce.setColor({r:98, g:207,b: 227});
         introduce.setPosition(cc.p(x+200, y));
         bg.addChild(introduce);

         var score=new cc.LabelTTF(StringUtil.getString("dialog_person_score"), "MarkerFelt", 25);
         score.setColor({r:98, g:207, b:227});
         score.setPosition(cc.p(x-50, y-120));
         bg.addChild(score);

         c= "score_"+ id;
         var scoreValue=new cc.LabelTTF(StringUtil.getString(c), "MarkerFelt", 25);
         scoreValue.setColor({r:98, g:207,b: 227});
         scoreValue.setPosition(cc.p(x+20, y-120));
         bg.addChild(scoreValue);

         var win=new cc.LabelTTF(StringUtil.getString("dialog_person_win"), "MarkerFelt", 25);
         win.setPosition(cc.p(x+150, y-120));
         win.setColor({r:98, g:207,b: 227});
         bg.addChild(win);

         c= "win_"+ id;
         var winValue=new cc.LabelTTF(StringUtil.getString(c), "MarkerFelt", 25);
         winValue.setPosition(cc.p(x+220, y-120));
         winValue.setColor({r:98, g:207,b: 227});
         bg.addChild(winValue);

         var  content=new cc.LabelTTF(StringUtil.getString("dialog_person_message"), "MarkerFelt", 25);
         content.setPosition(cc.p(x-30, 50));
         content.setColor({r:98, g:207,b: 227});
         bg.addChild(content);

         c= "content_"+ id;
         var contentValue=new cc.LabelTTF(StringUtil.getString(c), "MarkerFelt", 25);
         contentValue.setPosition(cc.p(x+40+contentValue.getContentSize().width*0.5, 50));
         bg.addChild(contentValue);
     }else{


         var nn=cc.sys.localStorage.getItem(KEY_NAME);
         if(nn==null)nn= StringUtil.getString("no_name");
         var name=new cc.LabelTTF(nn, "MarkerFelt", 25);
         name.setColor({r:98, g:207,b: 227});
         name.setPosition(cc.p(x+150, y+50));
         bg.addChild(name);

         var num;
         var coinNum=cc.sys.localStorage.getItem(KEY_COIN);
         if(coinNum==null){
             coinNum=2000;
             cc.sys.localStorage.setItem(KEY_COIN,coinNum);
         }

         num= "我的元宝："+ coinNum+"个";
         var labelCoin=new cc.LabelTTF(num, "MarkerFelt", 23);
         labelCoin.setPosition(cc.p(x+200, y-50));
         bg.addChild(labelCoin, 0, SHOP_COIN);

         var scoreValue=cc.sys.localStorage.getItem(KEY_SCORE);
         if(scoreValue==null)
         {
             scoreValue=0;
             cc.sys.localStorage.setItem(KEY_SCORE,scoreValue);
         }
         var c= "积分："+
             +scoreValue;
         var score=new cc.LabelTTF(c, "MarkerFelt", 25);
         score.setColor({r:98, g:207,b: 227});
         score.setPosition(cc.p(x+200, y));
         bg.addChild(score);

         var winValue=cc.sys.localStorage.getItem(KEY_WIN);
         if(winValue==null){
             winValue=0;
             cc.sys.localStorage.setItem(KEY_WIN,winValue);
         }
         var loseValue=cc.sys.localStorage.getItem(KEY_LOSE);
         if(loseValue==null){
             loseValue=0;
             cc.sys.localStorage.setItem(KEY_LOSE,loseValue);
         }
         var rate=0;
         if(winValue+loseValue>0){
             rate=winValue*100/(winValue+loseValue);
         }


         var c="胜率："+ rate+"%"+"(胜"+winValue+"/"+"败"+loseValue+")";
         var win=new cc.LabelTTF(c, "MarkerFelt", 25);
         win.setColor({r:98, g:207,b: 227});
         win.setPosition(cc.p(bg.getContentSize().width*0.5, y-120));
         bg.addChild(win);

         var cLevel;

         if(scoreValue<800){
             var head=new cc.Sprite("res/my_head_0.png");
             head.setScale(0.5);
             head.setPosition(cc.p(x, y));
             bg.addChild(head);
             cLevel= "等级："+ StringUtil.getString("level0")+"(还差"+(800-scoreValue)+"分"+"\n"+"就可以升级为"+StringUtil.getString("level1")+")"

         }else if(scoreValue<1500){
             var head=new cc.Sprite("res/my_head_1.png");
             head.setScale(0.5);
             head.setPosition(cc.p(x, y));
             bg.addChild(head);
             cLevel= "等级：" + StringUtil.getString("level1")+"(还差"+(1500-scoreValue)+"分"+"\n"+"就可以升级为"+StringUtil.getString("level2")+")"

         }else {
             var head=new cc.Sprite("res/my_head_2.png");
             head.setScale(0.5);
             head.setPosition(cc.p(x, y));
             bg.addChild(head);
             cLevel= "等级："+ StringUtil.getString("level2");
         }

         var level=new cc.LabelTTF(cLevel, "MarkerFelt", 25);
         level.setPosition(cc.p(bg.getContentSize().width*0.5, 50));
         bg.addChild(level);

     }
 },

 onEnter:function(){
     this.parent.pause();
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
                 onMouseUp:this.ccMouseEnded.bind(this),onMouseMove:this.ccMouseMoved.bind(this)},
             this);




     this._super();

 },
 onExit:function(){
     this.parent.resume();
     cc.eventManager.removeListener(this);
     this._super();
 },
//private:
 isb:false,
    //鼠标事件
    ccMouseBegan:function(event){
        cc.log("鼠标开始");
        this.isTouchBeganed=true;


    },
    ccMouseMoved:function(event){

        if(this.isTouchBeganed){
            cc.log("滑动");

        }
    },
    ccMouseEnded:function(event){
        this.isTouchBeganed=false;
        // alert("鼠标结束");
        cc.log("结束");

    },
    //触摸事件
    ccTouchBegan:function(touch,event){
        return false;
    },
    ccTouchMoved:function(touch,event){
    },
    ccTouchEnded:function(touch,event){
    },
    ccTouchBegan2:function(touch,event){
        event.stopPropagation();
        return false;
    },
});