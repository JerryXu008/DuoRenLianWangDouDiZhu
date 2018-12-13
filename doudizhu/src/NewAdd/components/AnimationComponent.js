/**
 * Created by brucexu on 17/11/19.
 */
var AnimationComponent=function(parent){
    this.node=parent;
    this.gameRootNode=parent.gameRootNode;
    this.cardAnim=function( type){
        var size=cc.director.getWinSize();
        if(type==PokerType.feiji || type==PokerType.feijicb){
            cc.spriteFrameCache.addSpriteFrames("res/action_plane0.plist");
            cc.spriteFrameCache.addSpriteFrames("res/FJ.plist");
            var sprite0=new cc.Sprite("#spr_action_plane_0.png");
            sprite0.setPosition(cc.p(size.width*0.5+300, size.height*0.5));

            this.gameRootNode.addChild(sprite0, 0, ANIM_SPRITE);

            var animFrames = [];
            var str;
            for(var i = 1; i < 4; i++)
            {
                str="spr_action_plane"+i+".png";
                var frame =cc.spriteFrameCache.getSpriteFrame(str);
                animFrames.push(frame);
            }
            var animation = new cc.Animation(animFrames, 0.05);
            animation.setLoops(-1);
            // sprite1.runAction(new cc.Animate(animation));
            sprite0.runAction(new cc.MoveTo(1.2, cc.p(size.width*0.5-600, size.height*0.5)));
            this.node.schedule(this.removeCardAnim, 1.5);



        }else if(type==PokerType.zhadan){


            cc.spriteFrameCache.addSpriteFrames("res/action_bomb0.plist");
            var sprite=new cc.Sprite("#spr_action_bomb_0.png");
            sprite.setPosition(cc.p(size.width*0.5, size.height*0.5+150));
            this.gameRootNode.addChild(sprite, 0, ANIM_SPRITE);

            var animFrames = [];
            var str;
            for(var i = 1; i < 14; i++)
            {
                str="spr_action_bomb_"+i+".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                animFrames.push(frame);
            }
            var animation = new cc.Animation(animFrames, 0.1);
            animation.setLoops(1);
            sprite.runAction(new cc.Animate(animation));
            this.node.schedule(this.removeCardAnim, 1.5);





        }else if(type==PokerType.huojian){


            cc.spriteFrameCache.addSpriteFrames("res/action_rocket0.plist");


            var sprite2=new cc.Sprite("#spr_action_rocket_0.png");
            sprite2.setPosition(cc.p(size.width*0.5, size.height*0.5-200));
            this.gameRootNode.addChild(sprite2, 0, ANIM_YANG);

            var  animFrames1 =[];
            for(var i = 1; i < 3; i++)
            {
                str="spr_action_rocket_"+i+".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                animFrames1.push(frame);
            }
            var animation1 = new cc.Animation(animFrames, 0.05);
            animation1.setLoops(-1);
            sprite2.runAction(new cc.Animate(animation1));
            sprite2.runAction(new cc.MoveTo(1.2, cc.p(size.width*0.5, size.height*0.5+460)));
            this.node.schedule(this.removeCardAnim, 1.5);


        }

    };



    this.removeCardAnim=function( dt){

        this.node.unschedule(this.removeCardAnim);
        var sprite=this.gameRootNode.getChildByTag(ANIM_SPRITE);
        if(sprite!=null){
            sprite.removeFromParent(true);
        }
        var yang=this.gameRootNode.getChildByTag(ANIM_YANG);
        if(yang!=null){
            yang.removeFromParent(true);
        }
    };

};
