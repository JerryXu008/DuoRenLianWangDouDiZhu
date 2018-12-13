/**
 * Created by song on 16/11/29.
 */


var DialogPoker = cc.Layer.extend({

      beganX:0.0,
      id:0,
      isVIP:false,
      scoreMove:false,
      isScroll:false,
      isCancel:false,
      isMenu:false,
      isBtCancel:false,
      isBtUsed:false,
      menu:null,
     isTouchBeganed:false,
     layerArray:[],
     selectPoker:function(id){

     },
    layerMain:null,

    ctor: function () {
        this._super();


        var VIPTime=cc.sys.localStorage.getItem(KEY_VIP);
        if(VIPTime==null)VIPTime=0;
            if(VIPTime>TimeUtil.millisecondNow()){
            this.isVIP=true;
        }else{
                this.isVIP=false;
        }
        //test
        this.isVIP=true;

        this.id=-1;

        var size=cc.director.getWinSize();


        var bgLayer=new cc.Layer();
        this.addChild(bgLayer);
        cc.eventManager.addListener(
            {event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:this.ccTouchBegan2.bind(this)}, bgLayer);


        var dialogBg=new cc.Sprite("res/dialog_poker_bg.png");
            dialogBg.setPosition(cc.p(size.width*0.5, size.height*0.5));
            this.addChild(dialogBg,0);

            var v;
           v="card_title%d"+"0";
            var title=new cc.LabelTTF("", "MarkerFelt", 23);
            title.setPosition(cc.p(size.width*0.5-280+title.getContentSize().width*0.5+20, size.height*0.5));
            this.addChild(title, 0, POKER_TITLE);
            v="card"+"0";
            var text=new cc.LabelTTF("", "MarkerFelt", 23);
            text.setPosition(cc.p(size.width*0.5 -280+text.getContentSize().width*0.5 +20, size.height*0.5 -50));
            this.addChild(text, 0, POKER_TEXT);

            var textCancel=new cc.LabelTTF(StringUtil.getString("cancel_card"), "MarkerFelt", 26);
            var btCancel=new cc.ControlButton(textCancel, new cc.Scale9Sprite("res/dialog_bt.png"));
            btCancel.setPosition(cc.p(size.width*0.5 -100, size.height*0.5 -140));
            btCancel.setPreferredSize(cc.size(135, 55));
            btCancel.setBackgroundSpriteForState(new cc.Scale9Sprite("res/dialog_bt_pressed.png"),  cc.CONTROL_STATE_HIGHLIGHTED);
            btCancel.addTargetWithActionForControlEvents(this, this.menuCancel, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            this.addChild(btCancel, 0, POKER_CANCEL);

            var textUsed=new cc.LabelTTF(StringUtil.getString("used_card"), "MarkerFelt", 26);
            var btUsed=new cc.ControlButton(textUsed, new cc.Scale9Sprite("res/dialog_bt.png"));
            btUsed.setPosition(cc.p(size.width*0.5 +100, size.height*0.5 -140));
            btUsed.setPreferredSize(cc.size(135, 55));
            btUsed.setBackgroundSpriteForState(new cc.Scale9Sprite("res/dialog_bt_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
            btUsed.addTargetWithActionForControlEvents(this,this.menuOK , cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            this.addChild(btUsed,0, POKER_USED);

            var bg=new cc.Sprite("res/transparent_bg.png");
            bg.setPosition(cc.p(size.width*0.5 , size.height*0.5 +100));
            this.addChild(bg, 0, DIALOG_POKER_BG);
            var w=bg.getContentSize().width;
            var h=bg.getContentSize().height;

            var scroll=new cc.ScrollView();
            scroll.setViewSize(cc.size(w-60, h));
            scroll.setPositionX(30.0 );
            scroll.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
            scroll.setBounceable(false);
            scroll.setContentSize(cc.size(w*1.8, h));
            scroll.setTouchEnabled(true);





            bg.addChild(scroll, 0, DIALOG_POKER_SCROLL);

            var names=["res/card0.png", "res/card1.png", "res/card2.png", "res/card3.png"
            , "res/card4.png", "res/card5.png", "res/card6.png", "res/card7.png"];
            var unames=["res/ucard0.png", "res/ucard1.png", "res/ucard2.png", "res/ucard3.png"
            , "res/ucard4.png", "res/ucard5.png", "res/ucard6.png", "res/ucard7.png"];
            var keys=[KEY_CARD0, KEY_CARD1, KEY_CARD2, KEY_CARD3
            , KEY_CARD4, KEY_CARD5, KEY_CARD6, KEY_CARD7];
            var counts=[];
            var points=[];
            var x=50;
            var y=h*0.5;;
            var sIndex=0;
            var eIndex=7;
            for(var i=0; i<8; i++){
                var ccc=cc.sys.localStorage.getItem(keys[i]);
                if(ccc==null)ccc=1;
                counts[i]=ccc;
                if(counts[i]>0){
                points.push(cc.p(x+sIndex*120, y));
                sIndex++;
            }else{
                points.push(cc.p(x+eIndex*120, y));
                eIndex--;
            }}

             var kuang=new cc.Sprite("res/kuang.png");
            kuang.setPosition(cc.p(0, -800));
           var array=[];
            var layer=new cc.Layer();
            this.layerMain=new cc.Layer();
            var isFirst=true;
            for(var i=0; i<8; i++){
            if(this.isVIP){
                // var item=new cc.MenuItemImage(
                //    names[i],
                //    names[i],
                //     null,
                //     this.menuPoker,
                //     this);
                //item.setTag(i);
                //item.setPosition(points[i]);
                //array.push(item);

                var item=new cc.Sprite(names[i]);
                item.setTag(i);
                item.setPosition(points[i]);
                array.push(item);
                this.layerArray.push(item);
                if(isFirst && item.getPositionX()==50){
                    isFirst=false;

                    //var x=item.getPosition().x-kuang.getContentSize().width*0.5 ;
                    //var y=item.getPosition().y-kuang.getContentSize().height*0.5 ;

                    var x=item.getPosition().x ;
                    var y=item.getPosition().y;
                    //这里不要感到奇怪，scrollview的addchild会吧孩子变为猫店0，0 ，太尼玛坑了
                    kuang.setPosition(cc.p(x, y));
                    this.id=i;
                    var title0=StringUtil.getString("card_title");
                    var v="";
                    v= "card_title"+ this.id ;
                    var title1=StringUtil.getString(v);
                    title0+=title1;
                    title.setString(title0 );
                    title.setPosition(cc.p(size.width*0.5 -280+title.getContentSize().width*0.5 +20, size.height*0.5 ));
                     v="card"+ this.id ;
                    text.setString(StringUtil.getString(v));
                    text.setPosition(cc.p(size.width*0.5 -280+text.getContentSize().width*0.5 +20, size.height*0.5 -50));
                }
            }else{
                var count=counts[i];
                if(count>0){
                    var item=new cc.MenuItemImage(
                        names[i],
                        names[i],
                        null,
                        this.menuPoker,
                        this);
                    item.setTag(i);
                    item.setPosition(points[i]);
                    array.push(item);
                    this.layerArray.push(item);
                    var numBg=new cc.Sprite("res/poker_num.png");
                    numBg.setPosition(cc.p(points[i].x+40, 130));
                    layer.addChild(numBg, 1);

                    var c;
                    c=count;
                    var labelCount=new cc.LabelTTF(c, "MarkerFelt", 20);
                    labelCount.setPosition(numBg.getPosition());
                    layer.addChild(labelCount, 2);


                    if(isFirst && item.getPositionX()==50){
                        isFirst=false;
                        //var x=item.getPosition().x-kuang.getContentSize().width*0.5 ;
                        //var y=item.getPosition().y-kuang.getContentSize().height*0.5 ;
                        var x=item.getPosition().x ;
                        var y=item.getPosition().y ;

                        kuang.setPosition(cc.p(x, y));
                        this.id=i;
                        var title0=StringUtil.getString("card_title");
                        var v="";
                        v= "card_title"+ this.id ;
                        var title1=StringUtil.getString(v);
                        title0+=title1;
                        title.setString(title0);
                        title.setPosition(cc.p(size.width*0.5 -280+title.getContentSize().width*0.5 +20, size.height*0.5 ));
                        v="card"+ this.id ;
                        text.setString(StringUtil.getString(v));
                        text.setPosition(cc.p(size.width*0.5 -280+text.getContentSize().width*0.5 +20, size.height*0.5 -50));
                    }
                }else{
                    var uCard=new cc.Sprite(unames[i]);
                    uCard.setPosition(points[i]);
                    layer.addChild(uCard);
                }
            }
        }

            scroll.addChild(kuang, 0, POKER_KUANG);

            //menu=new cc.Menu(array);
            //menu.setPosition(cc.p(0, 0));
           for(var i=0;i<array.length;i++){
               this.layerMain.addChild(array[i]);
           }
             scroll.addChild(this.layerMain, 0, DIALOG_POKER_MENU);

            scroll.addChild(layer);
            //添加的自定义方法
            scroll.setSwallowableByJerry(false);
           // scroll.setTouchEnabled(false);
       //scroll.setVisible(false);

        }



    ,
    show:function(){

    },
    cancel:function(){
        this.removeFromParent();
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
        this.layerArray=null;
        this._super();
    },


    //鼠标事件
    ccMouseBegan:function(event){

        var size=cc.director.getWinSize();
        var point=event.getLocation();

        var x=size.width*0.5 ;
        var y=size.height*0.5 ;
        if(point.x<x-280 || point.x>x+280 || point.y>y+190 || point.y<y-190){
            cc.log("没点击到");
           return false;
        }else{
            cc.log("点击到");
            var newPoint= this.layerMain.convertToNodeSpace(point);
            for(var i=0;i<this.layerArray.length;i++){
                 var sp=this.layerArray[i];

                 var minX=sp.getPosition().x-sp.getContentSize().width/2;
                 var maxX=sp.getPosition().x+sp.getContentSize().width/2;
                var minY=sp.getPosition().y-sp.getContentSize().height/2;
                var maxY=sp.getPosition().y+sp.getContentSize().height/2;

                if(minX<newPoint.x&&maxX>newPoint.x&&minY<newPoint.y&&maxY>newPoint.y){
                   console.log("选中第"+i+"几个");
                    this.menuPoker(sp);
                }
            }
        }
        if(event.stopPropagation){
          event.stopPropagation();
        }
        return true;

    },
    ccMouseMoved:function(event){
    },
    ccMouseEnded:function(event){
    },




    ccTouchBegan:function(touch, event){
        return this.ccMouseBegan(touch);
    },
    ccTouchMoved:function( touch,  event){
        this.ccMouseMoved(touch)
    },
    ccTouchEnded:function( touch, event){
       this.ccMouseEnded(touch)
    },




menuPoker:function( pSender){
    if(!this.scoreMove){
        var size=cc.director.getWinSize();
        var item=pSender;

        var kuang=item.getParent().getParent().getChildByTag(POKER_KUANG);
        var x=item.getPosition().x ;
        var y=item.getPosition().y;
        kuang.setPosition(cc.p(x, y));


        this.id=(item.getTag());
        var title=this.getChildByTag(POKER_TITLE);
        var text=this.getChildByTag(POKER_TEXT);
        var title0=StringUtil.getString("card_title");
        var v="";
        v= "card_title"+this.id;
        var title1=StringUtil.getString(v);
        title0+=title1;
        title.setString(title0);
        title.setPosition(cc.p(size.width*0.5-280+title.getContentSize().width*0.5+20, size.height*0.5));
        v= "card"+ this.id;
        text.setString(StringUtil.getString(v));
        text.setPosition(cc.p(size.width*0.5-280+text.getContentSize().width*0.5+20, size.height*0.5-50));
    }
},
menuOK:function(pSender, controlEvent){
   var itemOK=pSender;
    if(this.id>=0){
        var keys=[KEY_CARD0, KEY_CARD1, KEY_CARD2, KEY_CARD3
            , KEY_CARD4, KEY_CARD5, KEY_CARD6, KEY_CARD7];
        if(!this.isVIP){
            var count=cc.sys.localStorage.getItem(keys[this.id]);
            if(count==null)count=1;
            count--;
            cc.sys.localStorage.setItem(keys[this.id], count);
        }

        var scene=this.getParent();
        this.removeFromParent();
        scene.usedCard(this.id);
    }
},
menuCancel:function(pSender,  controlEvent){
    var scene=this.getParent();
    this.removeFromParent();
}
,
    ccTouchBegan2:function(touch,event){

        cc.log("触发"+"ccTouchBegan2");
        this.ccTouchBegan(touch,event);

        if(event.stopPropagation){
            event.stopPropagation();
        }

        return false;



    }



});








