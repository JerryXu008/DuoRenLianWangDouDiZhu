

var ChooseQuitLayer = cc.Layer.extend({
    lblText:null,
    ctor: function () {
        this._super();


        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();


        //覆盖层，这样可使父亲页面的相关按钮不会触发了，被拦截了
        var bgLayer=new cc.Layer();
        this.addChild(bgLayer);
        cc.eventManager.addListener(
            {event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:this.ccTouchBegan2}, bgLayer);


        var bg=new cc.Sprite("res/score_bg.png");
        bg.x=size.width*0.5 ;
        bg.y=size.height*0.5 ;
        this.addChild(bg, 0,GAME_SCORE_BG);


        var w=160, h=60;


        var labelStart=new cc.LabelTTF("申请解散房间", "MarkerFelt", 26);
        labelStart.setPosition(cc.p(bg.getContentSize().width/2, bg.getContentSize().height-50));
        labelStart.setColor({r:198,g:27,b: 227});
        bg.addChild(labelStart);




        var ttfAgain=new cc.LabelTTF("同意", "MarkerFelt", 25);
        var btAgain=new cc.ControlButton(ttfAgain, new cc.Scale9Sprite("res/score_button.png"));
        btAgain.setBackgroundSpriteForState(new cc.Scale9Sprite("res/score_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btAgain.setPreferredSize(cc.size(w, h));
        btAgain.setPosition(cc.p(bg.getContentSize().width/2-150, 40));
        btAgain.addTargetWithActionForControlEvents(this, this.tongyi,cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        bg.addChild(btAgain, 0, GAME_BT_AGAIN);

        var ttfAgain=new cc.LabelTTF("拒绝", "MarkerFelt", 25);
        var btAgain=new cc.ControlButton(ttfAgain, new cc.Scale9Sprite("res/score_button.png"));
        btAgain.setBackgroundSpriteForState(new cc.Scale9Sprite("res/score_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btAgain.setPreferredSize(cc.size(w, h));
        btAgain.setPosition(cc.p(bg.getContentSize().width/2+150, 40));
        btAgain.addTargetWithActionForControlEvents(this, this.jujue,cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        bg.addChild(btAgain, 0, GAME_BT_AGAIN);


        var labelStart=new cc.LabelTTF("", "MarkerFelt", 32);
        labelStart.setPosition(cc.p(bg.getContentSize().width/2, bg.getContentSize().height/2));
        labelStart.setColor({r:198,g:27,b: 227});
        bg.addChild(labelStart,0,"lblScore");
        this.lblText=labelStart;
        return true;
    },
    tongyi:function(){

        cc.vv.net.send("dissolve_agree");
    },
    jujue:function(){

        cc.vv.net.send("dissolve_reject");
    },
    setString:function(text){
        this.lblText.setString(text);
    },
    show:function(text){
        var bg=this.getChildByTag(GAME_SCORE_BG);

        var w=bg.getContentSize().width;
        var h=bg.getContentSize().height;
        var x=80;
        this.lblText.setString(text);
    },
    onEnter:function(){
        this.parent.pause();//加上他之后，才会停止父亲页面GameMain的鼠标传递,或者下面的方法，或者是在mouseBegan中加入阻止冒泡
        //cc.eventManager.pauseTarget(this.parent);

        if("touches" in cc.sys.capabilities)//如果是终端设备
            cc.eventManager.addListener(
                {event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    onTouchBegan:this.ccTouchBegan,onTouchEnded:this.ccTouchEnded, onTouchesMoved: this.ccTouchMoved}, this);
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

    onTouchExitAction:function(pSender,  controlEvent){
        cc.director.runScene(new GameIndexScene());
    },
    //鼠标事件
    ccMouseBegan:function(event){
        //cc.log("DIALOGSUCCESS鼠标点击");
        event.stopPropagation();
    },
    ccMouseMoved:function(event){
    },
    ccMouseEnded:function(event){
    },


    ccTouchBegan:function(touch, event){

        return false;
    },
    ccTouchMoved:function(touch,event){

    },
    ccTouchEnded:function(touch, event){

    },
    ccTouchBegan2:function(touch,event){

        event.stopPropagation();
        return false;
    },


});








