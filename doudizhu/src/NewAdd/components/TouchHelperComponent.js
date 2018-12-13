/**
 * Created by brucexu on 17/11/16.
 */
var TouchHelperComponent=function(parent){

    var self=this;
    this.node=parent;
    this.isTouchBeganed=false;
    this.gameRootNode=this.node.gameRootNode;
    this.gameRoom=this.node.gameRoom;
    this.pokerIndex=[];
    this.pIndex=0;

    this.bindTouch=function(){
        if( 'touches' in cc.sys.capabilities ) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: this.ccTouchBegan.bind(this),
                onTouchMoved: this.ccTouchMoved.bind(this),
                onTouchEnded: this.ccTouchEnded.bind(this)

            }, this.node);
        }
        else if("mouse" in cc.sys.capabilities)//如果是网页
            cc.eventManager.addListener
            ({event: cc.EventListener.MOUSE, onMouseDown:this.ccMouseBegan.bind(this),
                onMouseUp:this.ccMouseEnded.bind(this),onMouseMove: this.ccMouseMoved.bind(this)}, this.node);

    };
    //鼠标事件
    this.ccMouseBegan=function(event){


        this.isTouchBeganed=true;


        if(cc.vv.gameNetMgr.gamestate==0 && this.node.isTouchPoker){
            var size=cc.director.getWinSize();
            var originPoint=cc.director.getVisibleOrigin();
            var point=event.getLocation();
            var x=point.x;
            var y=point.y;

            var count=this.node.personPokes().length;
            if(count%2==0){
                var w=(size.width-originPoint.x)/20*0.8;
            }
            else{
                var w=(size.width-originPoint.x)/21*0.8;
            }


            var startX;
            var endX;
            var text= "#poke1.png";
            var tempPoker=new cc.Sprite(text);
            var contensizeX=tempPoker.getContentSize().width*0.8/2;
            startX=size.width*0.5+(-parseInt(count*0.5))*w-contensizeX;
            if(count%2==0) {
                startX =startX+ w/2;
            }

            endX=startX+(count-1)*w+contensizeX*2;

            var contensizeHeight=tempPoker.getContentSize().height*0.8;

            if(y<originPoint.y+contensizeHeight && x>startX && x<endX){
                AudioUtil.soundControl(0);

                var index=parseInt((x-startX)/w);
                if(index>count-1){
                    index=count-1;
                }
                var layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
                var poker= layer.getChildByTag(POKER_STRAT_ID+index);

                cc.log("扑克tag0="+(POKER_STRAT_ID));
                cc.log("扑克tag1="+(index));
                cc.log("扑克tag="+(POKER_STRAT_ID+index));
                cc.log("扑克="+poker);

                poker.setColor({r:100, g:100, b:100});
                this.pIndex=index;
                return true;
            }
        }
        this.pIndex=-1;
        return true;




    };
        this.ccMouseMoved=function(event){

        cc.log("鼠标移动");
        if(this.isTouchBeganed){

            if(cc.vv.gameNetMgr.gamestate==0 && this.node.isTouchPoker && this.pIndex!=-1){
                var size=cc.director.getWinSize();
                var originPoint=cc.director.getVisibleOrigin();
                var point=event.getLocation();
                var x=point.x;
                var y=point.y;
                var count=this.node.personPokes().length;
                //var w=(size.width-originPoint.x)/count*0.8;
                if(count%2==0){
                    var w=(size.width-originPoint.x)/20*0.8;
                }
                else{
                    var w=(size.width-originPoint.x)/21*0.8;
                }
                var startX;
                var endX;
                var text= "#poke1.png";
                var tempPoker=new cc.Sprite(text);
                var contensizeX=tempPoker.getContentSize().width*0.8/2;
                startX=size.width*0.5+(-parseInt(count*0.5))*w-contensizeX;
                if(count%2==0) {
                    startX =startX+ w/2;
                }
                endX=startX+(count-1)*w+contensizeX*2;
                var contensizeHeight=tempPoker.getContentSize().height*0.8;


                if(y<originPoint.y+contensizeHeight && x>startX && x<endX){
                    var index=parseInt((x-startX)/w);
                    if(index>count-1){
                        index=count-1;
                    }
                    var layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
                    for(var i=0;i!=this.pokerIndex.length; i++){
                        var poker=layer.getChildByTag(POKER_STRAT_ID+this.pokerIndex[i]);
                        poker.setColor({r:255, g:255, b:255});
                    }
                    this.pokerIndex=[];

                    if(this.pIndex<=index){
                        for(var i=this.pIndex; i<=index; i++){
                            this.pokerIndex.push(i);
                            var poker=layer.getChildByTag(POKER_STRAT_ID+i);
                            poker.setColor({r:100, g:100, b:100});
                        }
                    }else if(this.pIndex>index){
                        for(var i=index; i<=this.pIndex; i++){
                            this.pokerIndex.push(i);
                            var poker=layer.getChildByTag(POKER_STRAT_ID+i);
                            poker.setColor({r:100, g:100, b:100});
                        }
                    }



                }
            }


        }

    };
    this.ccMouseEnded=function(event){
        this.isTouchBeganed=false;
        var size=cc.director.getWinSize();
        var originPoint=cc.director.getVisibleOrigin();
        var point=event.getLocation();
        var x=point.x;
        var y=point.y;

        var count=this.node.personPokes().length;


        var w=83;
        var h=86;
        var hX=originPoint.x+60;
        var hY=size.height/4+originPoint.y+90;





        if(cc.vv.gameNetMgr.gamestate==0 && this.node.isTouchPoker){
            var layer=this.gameRootNode.getChildByTag(PERSON_POKER_LAYER0);
            var count=this.node.personPokes().length;

            if(count%2==0){
                var w=(size.width-originPoint.x)/20*0.8;
            }
            else{
                var w=(size.width-originPoint.x)/21*0.8;
            }

            if(this.pokerIndex.length>1){
                var pokers=[];
                for(var i=0; i!=this.pokerIndex.length; i++){
                    var  index=this.pokerIndex[i];
                    pokers.push(this.node.personPokes()[index]);
                }

                //根据用户滑动选中的牌，提示合适的牌，看完了
                if(this.node.persons[0].tiShiAI2(layer, cc.vv.gameNetMgr.pokesFlag, this.node.currentCard, cc.vv.gameNetMgr.boss, pokers)){

                    this.gameRoom.setChongXuanState(cc.vv.gameNetMgr.pokesFlag);
                    this.gameRoom.setChuPaiState(cc.vv.gameNetMgr.pokesFlag);
                }
                else{ //else 被Jerry增加，没有合适的牌，也要设置按钮状态
                    this.gameRoom.setChongXuanState(cc.vv.gameNetMgr.pokesFlag);
                    this.gameRoom.setChuPaiState(cc.vv.gameNetMgr.pokesFlag);
                }
            }else{

                var startX;
                var endX;
                var text= "#poke1.png";
                var tempPoker=new cc.Sprite(text);
                var contensizeX=tempPoker.getContentSize().width*0.8/2;
                startX=size.width*0.5+(-parseInt(count*0.5))*w-contensizeX;
                if(count%2==0) {
                    startX =startX+ w/2;
                }
                endX=startX+(count-1)*w+contensizeX*2;
                var contensizeHeight=tempPoker.getContentSize().height*0.8;
                var yy=originPoint.y+85*0.8;
                if(y<originPoint.y+contensizeHeight && x>startX && x<endX){
                    var index=parseInt((x-startX)/w);
                    if(index>count-1){
                        index=count-1; 
                    }
                    var poker=layer.getChildByTag(POKER_STRAT_ID+index);
                    if(!cc.vv.gameNetMgr.pokesFlag[index]){
                        cc.vv.gameNetMgr.pokesFlag[index]=true;
                        poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), yy+12)));
                        //根据对手的牌型，给予一定提示
                        //或者如果自己是第一个出牌，根据自己的2次点击，出顺子
                        //看完，写的挺好
                        this.node.persons[0].tiShiPoker(layer, cc.vv.gameNetMgr.pokesFlag, this.node.currentCard);
                    }else{
                        cc.vv.gameNetMgr.pokesFlag[index]=false;
                        poker.runAction(new  cc.MoveTo(0.1, cc.p(poker.getPositionX(), yy)));
                    }


                        this.gameRoom.setChongXuanState(cc.vv.gameNetMgr.pokesFlag);//判断重选按钮
                        this.gameRoom.setChuPaiState(cc.vv.gameNetMgr.pokesFlag);//判断出牌按钮是否可点击,看过了

                }
            }

            for(var i=0; i!=this.node.personPokes().length; i++){
                var poker=layer.getChildByTag(POKER_STRAT_ID+i);
                poker.setColor({r:255, g:255, b:255});

                //cc.log("END扑克tag0="+(POKER_STRAT_ID));
                //cc.log("END扑克tag1="+(index));
                //cc.log("END扑克tag="+(POKER_STRAT_ID+index));
                //cc.log("END扑克="+poker);

            }
            this.pokerIndex=[];
        }
    };

    //触摸事件,移植到手机的时候在考虑
    this.ccTouchBegan=function(touch,event1){


        return this.ccMouseBegan(touch);

    };
    this.ccTouchMoved=function(touch,event1){


        this.ccMouseMoved(touch)
    };
    this.ccTouchEnded=function(touch,event1){
        this.ccMouseEnded(touch)

    };

    this.getLocalPersonIndex=function(index){//参数为在服务端的索引
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 3) % 3;
        return ret;
    };

}