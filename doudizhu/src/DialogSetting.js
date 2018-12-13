/**
 * Created by song on 16/11/17.
 */

    var ff;
var DiaLogSettingLayer = cc.Layer.extend({

      isb:false,
      isW0:false,
      isW1:false,
      isS0:false,
      isS1:false,
      isMenu:false,

      isTouchBeganed:false,

      menu:null,
      lisiner:null,

    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();
        ff=this;

        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        //阴影层，防止下面的按钮可以点击

        var bgLayer=new cc.Layer();
        this.addChild(bgLayer);
        cc.eventManager.addListener(
            {event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:this.ccTouchBegan2}, bgLayer);



        //背景图片
        var bg=new cc.Sprite("res/main_setting_bg.png");
        bg.x=size.width*0.5 ;
        bg.y=size.height*0.5 ;
        this. addChild(bg, 0, GAME_SETTING_BG);

        var  w=542.0, h=453.0;

        var title=new cc.LabelTTF(StringUtil.getString("setting_title"), "MarkerFelt", 30);
        title.setPosition(cc.p(w*0.5, h-30));
        bg.addChild(title);


        var btClose=new cc.ControlButton(new cc.Scale9Sprite("res/close.png"));
        btClose.setBackgroundSpriteForState(new cc.Scale9Sprite("res/close_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btClose.setPreferredSize(cc.size(50,50));
        btClose.setPosition(cc.p(w-35, h-35));
        btClose.addTargetWithActionForControlEvents(this, this.cancel, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        bg.addChild(btClose, 0, GAME_SETTING_BACK);

        var  x=60, y=h-135;
        var mute=new cc.LabelTTF(StringUtil.getString("setting_mute"), "MarkerFelt", 25);
        mute.setPosition(cc.p(x, y));
        bg.addChild(mute);
        var switchControl0 = new cc.ControlSwitch
        (
            new cc.Sprite("res/switch-mask.png"),
            new cc.Sprite("res/switch-on.png"),
            new cc.Sprite("res/switch-off.png"),
            new cc.Sprite("res/switch-thumb.png"),
            new cc.LabelTTF("On", "MarkerFelt", 16),
            new cc.LabelTTF("Off", "MarkerFelt", 16)
        );
        switchControl0.setPosition(cc.p(x+80, y));
        switchControl0.addTargetWithActionForControlEvents(this, this.switchChanged0, cc.CONTROL_EVENT_VALUECHANGED);

        var result=AudioUtil.getMusicPlay();

        if(result=="1"){

            switchControl0.setOn(true);
        }else if(result=="0"){

            switchControl0.setOn(false);
        }

        bg.addChild(switchControl0, 0, GAME_SETTING_SWITCH0);

        var shake=new cc.LabelTTF(StringUtil.getString("setting_shake"), "MarkerFelt", 25);
        shake.setPosition(cc.p(x+220, y));
        bg.addChild(shake);
       //震动，网页用不到
        var switchControl1 = new cc.ControlSwitch
        (
            new cc.Sprite("res/switch-mask.png"),
            new cc.Sprite("res/switch-on.png"),
            new cc.Sprite("res/switch-off.png"),
            new cc.Sprite("res/switch-thumb.png"),
            new cc.LabelTTF("On", "MarkerFelt", 16),
            new cc.LabelTTF("Off", "MarkerFelt", 16)
        );
        switchControl1.setPosition(cc.p(x+300, y));
        switchControl1.addTargetWithActionForControlEvents(this, this.switchChanged1, cc.CONTROL_EVENT_VALUECHANGED);
        var result=cc.sys.localStorage.getItem((KEY_VIBRATOR));
        if(result==null){
            result="1";
        }
        if(result=="1")
        {
            switchControl1.setOn(true);
        }else{
            switchControl1.setOn(false);
        }
        bg.addChild(switchControl1, 0, GAME_SETTING_SWITCH1);
        y-=110;



        var music=new cc.LabelTTF(StringUtil.getString("setting_music"), "MarkerFelt", 25);
        music.setPosition(cc.p(x, y));
        bg.addChild(music);
        var music0=new cc.Sprite("res/music_0.png");
        music0.setPosition(cc.p(x+55, y));
        bg.addChild(music0);
        var slider0 =new cc.ControlSlider("res/sliderTrack.png","res/sliderProgress.png" ,"res/sliderThumb.png");
        slider0.setMinimumValue(0.0);
        slider0.setMaximumValue(1.0);
        slider0.setPosition(cc.p(x+230, y));
        slider0.addTargetWithActionForControlEvents(this, this.sliderChanged0, cc.CONTROL_EVENT_VALUECHANGED);
        slider0.setValue(cc.audioEngine.getMusicVolume());
        bg.addChild(slider0, 0, GAME_SETTING_SLIDER0);
        var music1=new cc.Sprite("res/music_1.png");
        music1.setPosition(cc.p(x+420, y));
        bg.addChild(music1);

        y-=70;
        var sound=new cc.LabelTTF(StringUtil.getString("setting_sound"), "MarkerFelt", 25);
        sound.setPosition(cc.p(x, y));
        bg.addChild(sound);
        var music2=new cc.Sprite("res/music_0.png");
        music2.setPosition(cc.p(x+55, y));
        bg.addChild(music2);
        var slider1 = new cc.ControlSlider("res/sliderTrack.png","res/sliderProgress.png" ,"res/sliderThumb.png");
        slider1.setMinimumValue(0.0 );
        slider1.setMaximumValue(1.0 );
        slider1.setPosition(cc.p(x+230, y));
        slider1.addTargetWithActionForControlEvents(this, this.sliderChanged1 , cc.CONTROL_EVENT_VALUECHANGED);
        slider1.setValue(cc.audioEngine.getEffectsVolume());
        bg.addChild(slider1, 0, GAME_SETTING_SLIDER1);
        var music3=new cc.Sprite("res/music_1.png");
        music3.setPosition(cc.p(x+420, y));
        bg.addChild(music3);


        var version=new cc.LabelTTF(StringUtil.getString("setting_version"), "MarkerFelt", 25);
        var  menuLabel=new cc.MenuItemLabel(version, this, this.menuUpdate);
        menuLabel.setPosition(cc.p(w*0.5, 60));
        this.menu=new cc.Menu(menuLabel);
        this.menu.setPosition(cc.p(0, 0));
        bg.addChild(this.menu);

        return true;
    },


    show:function(){
    var  size=cc.director.getWinSize();
    var bg=this.getChildByTag(GAME_SETTING_BG);

    bg.setScale(0);
    bg.runAction(new cc.ScaleTo(0.5, 1, 1));
},

    switchChanged0:function(sender,event){

        var  pSwitch = sender;
        if (pSwitch.isOn())
        {
            AudioUtil.setMusicPlay("1");
        }
        else
        {
            AudioUtil.setMusicPlay("0");
        }
    },
    switchChanged1:function(sender,event){

        var  pSwitch = sender;
        if (pSwitch.isOn())
        {
            cc.sys.localStorage.setItem(KEY_VIBRATOR, "1");
        }
        else
        {
            cc.sys.localStorage.setItem(KEY_VIBRATOR, "0");
        }
    },
    sliderChanged0:function(sender,event){

        var pSlider =  sender;
        cc.audioEngine.setMusicVolume(pSlider.getValue());
    }
    ,
    sliderChanged1:function(sender,event){
        var pSlider =  sender;
        cc.audioEngine.setEffectsVolume(pSlider.getValue());
    },
    menuUpdate:function(sender){

    },

    cancel:function(){
        this.removeFromParent();
    },
    onEnter:function(){

        this.parent.pause();
        if("touches" in cc.sys.capabilities)//如果是终端设备
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

        this.parent.resume()
        cc.eventManager.removeListener(this);
        this._super();


    },

    //鼠标事件
    ccMouseBegan:function(event){
        event.stopPropagation();
        cc.log("鼠标开始");
        this.isTouchBeganed=true;
        //var bg=ff.getChildByTag(GAME_SETTING_BG);
        //var btBack= bg.getChildByTag(GAME_SETTING_BACK);
        //var switchControl0= bg.getChildByTag(GAME_SETTING_SWITCH0);
        //var switchControl1= bg.getChildByTag(GAME_SETTING_SWITCH1);
        //var slider0= bg.getChildByTag(GAME_SETTING_SLIDER0);
        //var slider1= bg.getChildByTag(GAME_SETTING_SLIDER1);
        //
        //
        //isb=btBack.onTouchBegan(touch, event);
        //isW0=switchControl0.ccTouchBegan(touch, event);
        //isW1=switchControl1.ccTouchBegan(touch, event);
        //isS0=slider0.ccTouchBegan(touch, event);
        //isS1=slider1.ccTouchBegan(touch, event);
        //isMenu=menu.ccTouchBegan(touch, event);
        //btBack._eventDispatcher

       // event.stopPropagation();

    },
    ccMouseMoved:function(event){

        if(this.isTouchBeganed){
            cc.log("滑动");
        //var touch=null;
        //var bg=this.getChildByTag(GAME_SETTING_BG);
        //var btBack=bg.getChildByTag(GAME_SETTING_BACK);
        //var switchControl0=bg.getChildByTag(GAME_SETTING_SWITCH0);
        //var switchControl1=bg.getChildByTag(GAME_SETTING_SWITCH1);
        //var slider0=bg.getChildByTag(GAME_SETTING_SLIDER0);
        //var slider1=bg.getChildByTag(GAME_SETTING_SLIDER1);
        ////if(isb){
        //    btBack.ccTouchMoved(touch, event);
        //}
        //if(isW0){
        //    switchControl0.ccTouchMoved(touch, event);
        //}
        //if(isW1){
        //    switchControl1.ccTouchMoved(touch, event);
        //}
        //if(isS0){
        //    slider0.ccTouchMoved(touch, event);
        //}
        //if(isS1){
        //    slider1.ccTouchMoved(touch, event);
        //}
        //if(isMenu){
        //    menu.ccTouchMoved(touch, event);
        //}
        }
    },
    ccMouseEnded:function(event){
        this.isTouchBeganed=false;
       // alert("鼠标结束");
        cc.log("结束");
        //var touch=null;
        //var bg=this.getChildByTag(GAME_SETTING_BG);
        //var btBack=bg.getChildByTag(GAME_SETTING_BACK);
        //var switchControl0=bg.getChildByTag(GAME_SETTING_SWITCH0);
        //var switchControl1=bg.getChildByTag(GAME_SETTING_SWITCH1);
        //var slider0=bg.getChildByTag(GAME_SETTING_SLIDER0);
        //var slider1=bg.getChildByTag(GAME_SETTING_SLIDER1);
        //if(isb){
        //    btBack.ccTouchEnded(touch, event);
        //}
        //if(isW0){
        //    switchControl0.ccTouchEnded(touch, event);
        //}
        //if(isW1){
        //    switchControl1.ccTouchEnded(touch, event);
        //}
        //if(isS0){
        //    slider0.ccTouchEnded(touch, event);
        //}
        //if(isS1){
        //    slider1.ccTouchEnded(touch, event);
        //}
        //if(isMenu){
        //    menu.ccTouchEnded(touch, event);
        //}
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