/**
 * Created by brucexu on 17/10/30.
 */
var HallLayer = cc.Layer.extend({
    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();

        this.initUI();

        this.createRoomComponet=new CreateRoom();

        this.joinGameInputComponet=new JoinGameInput(this);

        if(cc.vv.gameNetMgr.roomId == null){
            this.lblEnterRoom.setVisible(true);
            this.lblRetureRoom.setVisible(false);
        }
        else{
            this.lblEnterRoom.setVisible(false);
            this.lblRetureRoom.setVisible(true);
        }

        var roomId = cc.vv.userMgr.oldRoomId ;//oldRoomId来自于ReConnect.js
        if( roomId != null){
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);//直接进入房间
        }

    },
    createRoomComponet:null,
    lblCreateRoom:null,
    lblRetureRoom:null,
    lblEnterRoom:null,
    initUI:function(){
        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();

        var w=220.0;
        var h=70.0;
        var x=size.width*0.5-originPoint.x*0.5+300;
        var g=20.0;
        var ttfSize=26.0;


        var btStart;
        var labelStart=new cc.LabelTTF("创建房间", "MarkerFelt", ttfSize);

        this.lblCreateRoom=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart=this.lblCreateRoom;
        btStart.setBackgroundSpriteForState(new cc.Scale9Sprite("res/index_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);

        btStart.setPreferredSize(cc.size(w,h));
        btStart.setPosition(cc.p(size.width/2,size.height/2+200));
        btStart.addTargetWithActionForControlEvents(this, this.onCreateRoomClicked, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.addChild(btStart);


        var labelStart=new cc.LabelTTF("返回房间", "MarkerFelt", ttfSize);

        this.lblRetureRoom=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart=this.lblRetureRoom;
        btStart.setBackgroundSpriteForState(new cc.Scale9Sprite("res/index_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);

        btStart.setPreferredSize(cc.size(w,h));

        btStart.setPosition(cc.p(size.width/2,size.height/2-200));
        btStart.addTargetWithActionForControlEvents(this, this.onReturnGameClicked, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.addChild(btStart);

        var labelStart=new cc.LabelTTF("加入房间", "MarkerFelt", ttfSize);

        this.lblEnterRoom=new cc.ControlButton(labelStart, new cc.Scale9Sprite("res/index_button.png"));
        btStart=this.lblEnterRoom;
        btStart.setBackgroundSpriteForState(new cc.Scale9Sprite("res/index_button_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);

        btStart.setPreferredSize(cc.size(w,h));

        btStart.setPosition(cc.p(size.width/2,size.height/2-200));
        btStart.addTargetWithActionForControlEvents(this, this.onJoinGameClicked, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

        this.addChild(btStart);

        this.schedule(this.updateEnter, 1/60);

    },
    onJoinGameClicked:function(){
        this.joinGameInputComponet.bgLayer.setVisible(true);
    },

    onReturnGameClicked:function(){
        WaitingConnectionLayer.show('正在返回游戏房间');
        cc.director.runScene(new GameMainScene());
    },

    //创建房间
    onCreateRoomClicked:function(){
        if(cc.vv.gameNetMgr.roomId != null){
            AlertWindow.show("房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        WaitingConnectionLayer.show("房间创建中。。。");

        this.createRoomComponet.createRoom();

       // this.createRoomWin.active = true;
    },

    updateEnter:function(){
        if(cc.vv && cc.vv.userMgr.roomData != null){
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
            cc.vv.userMgr.roomData = null;
        }
    }



});

var HallScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new HallLayer();
        this.addChild(layer);
    }
});
