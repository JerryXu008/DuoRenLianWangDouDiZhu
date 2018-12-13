/**
 * Created by song on 16/11/17.
 */
var GlobalLoadingLayer;
var WaitingConnectionLayer = cc.Layer.extend({


         ctor: function () {
        // ////////////////////////////
        // 1. super init first
        this._super();
             cc.spriteFrameCache.addSpriteFrames("res/public_ui.plist");
        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        //阴影层，防止下面的按钮可以点击
        var bgLayer= new cc.LayerColor(cc.color(0,0,0,128));

        this.addChild(bgLayer);


             //背景图片
        var bg=new cc.Sprite("#player_info_bg.png");
       // bg.setContentSize(cc.size(size.width/2,size.height/2));

        bg.x=size.width*0.5 ;
        bg.y=size.height*0.5 ;
        this. addChild(bg, 0, GAME_SETTING_BG);



        var title=new cc.LabelTTF("", "MarkerFelt", 30);
        title.setPosition(cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2));
        bg.addChild(title);
             title.setTag(10001);



        return true;
    },


    show:function(parentLayer,text){
        var  size=cc.director.getWinSize();

        this.setPosition(cc.p(0, 0));
        parentLayer.addChild(this);

        var title=this.getChildByTag(GAME_SETTING_BG).getChildByTag(10001);

        title.setString(text);


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
WaitingConnectionLayer.show=function(text,parent){
    WaitingConnectionLayer.showLoading(text,parent);
}
WaitingConnectionLayer.showLoading=function(text,parent){
   if(GlobalLoadingLayer){
       GlobalLoadingLayer.close();
   }
    var layer=new WaitingConnectionLayer();
    GlobalLoadingLayer=layer;
    if(!parent){
        parent=cc.director.getRunningScene();
    }
    layer.show(parent,text);
}
WaitingConnectionLayer.stopLoading=function(){
    if(GlobalLoadingLayer){
        GlobalLoadingLayer.close();
    }
    GlobalLoadingLayer=null;
}