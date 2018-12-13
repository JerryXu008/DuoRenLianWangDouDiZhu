/**
 * Created by brucexu on 17/10/30.
 */
/**
 * Created by song on 16/11/17.
 */
var GlobalAlertWindow;
var AlertWindow = cc.Layer.extend({


    ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();

        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        //阴影层，防止下面的按钮可以点击
        var bgLayer= new cc.LayerColor(cc.color(0,0,0,128));

        this.addChild(bgLayer);


        //背景图片
        var bg=new cc.Sprite("res/main_setting_bg.png");
        // bg.setContentSize(cc.size(size.width/2,size.height/2));

        bg.x=size.width*0.5 ;
        bg.y=size.height*0.5 ;
        this. addChild(bg, 0, GAME_SETTING_BG);

        var  w=542.0, h=453.0;

        var title=new cc.LabelTTF("", "MarkerFelt", 30);
        title.setPosition(cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2));
        bg.addChild(title);
        title.setTag(10001);

        var btClose=new cc.ControlButton(new cc.Scale9Sprite("res/close.png"));
        btClose.setBackgroundSpriteForState(new cc.Scale9Sprite("res/close_pressed.png"), cc.CONTROL_STATE_HIGHLIGHTED);
        btClose.setPreferredSize(cc.size(50,50));
        btClose.setPosition(cc.p(w-35, h-35));
        btClose.addTargetWithActionForControlEvents(this, this.cancel, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        bg.addChild(btClose, 0, GAME_SETTING_BACK);


        return true;
    },


    show:function(parentLayer,text){
        var  size=cc.director.getWinSize();

        this.setPosition(cc.p(0, 0));
        parentLayer.addChild(this);

        var title=this.getChildByTag(GAME_SETTING_BG).getChildByTag(10001);

        title.setString(text);

        var self=this;

        setTimeout(function(){
            self.cancel();
        },2000)

    },


    cancel:function(){
        this.removeFromParent();
    },

    close:function(){
        this.removeFromParent();
    },
    onEnter:function(){

        //this.parent.pause();
        this._super();

    },
    onExit:function(){

        // this.parent.resume()

        this._super();


    },
});

AlertWindow.show=function(text,parent){
    if(GlobalAlertWindow){
        GlobalAlertWindow.close();
    }
    var layer=new AlertWindow();
    GlobalAlertWindow=layer;
    if(!parent){
        parent=cc.director.getRunningScene();
    }
    layer.show(parent,text);
}
