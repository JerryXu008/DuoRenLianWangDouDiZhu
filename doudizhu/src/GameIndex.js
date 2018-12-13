
var GameIndexLayer = cc.Layer.extend({
    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();

        this.initUI();

        cc.vv.http.url = cc.vv.http.master_url;

        //WaitingConnectionLayer.showLoading(this,"加载中...");
        //
        //setTimeout(function(){
        // WaitingConnectionLayer.stopLoading();
        //},3000);

    },
    initUI:function(){
        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        ////背景图片
        //var bg=new cc.Sprite("res/index_bg.jpg");
        //bg.x=size.width*0.5 ;
        //bg.y=size.height*0.5 ;
        //this.addChild(bg);

        var w=220.0;
        var h=70.0;
        var x=size.width*0.5-originPoint.x*0.5+300;
        var g=20.0;
        var ttfSize=26.0;



        var labelStart=new cc.LabelTTF("登录", "MarkerFelt", ttfSize);

        var btStart=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart.setBackgroundSpriteForState(new cc.Scale9Sprite("res/index_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);

        btStart.setPreferredSize(cc.size(w,h));

        btStart.setPosition(cc.p(size.width/2,size.height/2));
        btStart.addTargetWithActionForControlEvents(this, this.onTouchStartAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

        this.addChild(btStart);


    },
    onTouchStartAction:function(){

        cc.vv.userMgr.guestAuth();

       // cc.director.runScene(new GameMainScene());

    },


    onTouchExitAction:function(){
     cc.director.end();
    },


});

var GameIndexScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
          var layer = new GameIndexLayer();
          this.addChild(layer);
    }
});
