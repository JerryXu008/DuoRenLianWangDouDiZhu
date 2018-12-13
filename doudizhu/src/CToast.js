/**
 * Created by song on 16/11/28.
 */
var CToast=cc.Layer.extend({

showString: function (content,time) {
    var size=cc.director.getWinSize();
    var bg=new cc.Sprite("res/transparent_task_bg.png");
    bg.setPosition(cc.p(size.width*0.5, size.height*0.5));
    this.addChild(bg);
    var label=new cc.LabelTTF(content, "MarkerFelt", 25);
    label.setPosition(cc.p(size.width*0.5, size.height*0.5));
    this.addChild(label);
    this.schedule(this.hide, time);
},

    hide:function(){
        this.unschedule(this.hide);
        this.removeFromParent();
    },
    showImage:function(content, x,  y,  time){
        var sprite=new cc.Sprite(content);
        sprite.setPosition(cc.p(x, y));
        this.addChild(sprite);
        this.schedule(this.hide, time);
    }
});


