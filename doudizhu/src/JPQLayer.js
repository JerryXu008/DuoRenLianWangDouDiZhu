/**
 * Created by song on 16/11/29.
 */

var JPQLayer= cc.Layer.extend({
    ctor: function () {
        this._super();
        this.removeAllChildrenWithCleanup(true);
        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        var bg=new cc.Sprite("res/jipq.png");
        bg.setPosition(cc.p(size.width*0.5, originPoint.y+29));
        this.addChild(bg, 0, JPQ_BG);

    },
    show:function(pokes){
    var bg=this.getChildByTag(JPQ_BG);
    bg.removeAllChildrenWithCleanup(true);
    var w=bg.getContentSize().width;
    var h=bg.getContentSize().height;
    var x=42;
    var y=h*0.5-10;
    var v;
    for(var i=0; i<15; i++){
        v= this.getCount(i, pokes);

        cc.log("牌数目"+i+"="+v);

        var num=new cc.LabelTTF(v, "MarkerFelt", 20);
        num.setPosition(cc.p(x+i*21, y));
        bg.addChild(num);
    }
},
getCount:function(index,pokes){

        var value=17-index;
     var result=0;
    for(var i=0;i<pokes.length;i++){

        if(value==AIUtil.getPokeValue(pokes[i])){
           result++;
        }
    }
   return result;



}

});





