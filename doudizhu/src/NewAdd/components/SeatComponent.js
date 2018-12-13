/**
 * Created by brucexu on 17/11/5.
 */
//var Seat=function(_headImg,name,userScore){
var Seat=function(index,parentNode){



    this.node=new cc.Node();
    parentNode.addChild(this.node);

    this.index=index;

    this.personId=0;

    this.headNode=null;
    this.nameNode=null;
    this.offLineNode=null;

    this.userName=null;
    this.score=null;
    this.headImg=null;

    this.pokerNum=null;
    this.pokerNumTxt=null;


    this.isReady=false;//玩家是否准备好
    this.isOffline=true;//玩家是否离线

    this.userId=null;//用户userID
    this.getHeadBgSprite= function (index) {
        if(index==0){
            return this.node.getChildByTag(HEAD_0);
        }
        else if(index==1){
            return this.node.getChildByTag(HEAD_1);
        }
        else{
           return this.node.getChildByTag(HEAD_2);
        }
    };
    this.initSeatUI=function(index){

        var  originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        var parent=this.node;
        if(index==0){
            //背景
            var headBg0=new cc.Sprite("res/head_nm.png");
            headBg0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+90));
            this.node.addChild(headBg0, 0, HEAD_0);
            var nameBg0=new cc.Sprite("res/main_name_bg.png");
            nameBg0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+30));
            this.node.addChild(nameBg0);

            var onlineSprite=new cc.Sprite("res/offlinePic.png");
            onlineSprite.setScale(0.5);
            onlineSprite.setPosition(cc.p(60+50, 30+100));
            nameBg0.addChild(onlineSprite);
            this.offLineNode=onlineSprite;

            var head0=new cc.Sprite();
            head0.setScale(0.2);
            head0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+90));
            this.node.addChild(head0, 0, MY_HEAD);
            this.headNode=head0;


            var name0=new cc.LabelTTF("", "MarkerFelt", 20);
            name0.setPosition(cc.p(originPoint.x+60, size.height/4+originPoint.y+30));
            this.node.addChild(name0);
            this.nameNode=name0;


            //剩余牌的数目
            var poker0=new cc.Sprite("res/main_shoupai.png");
            poker0.setPosition(cc.p(60+50, 30+100));
            this.node.addChild(poker0);
            var  text0;
            text0="17";
            var ttf0=new cc.LabelTTF(text1, "MarkerFelt", 25);
            ttf0.setPosition(cc.p(60+50, 30+100-40));
            this.node.addChild(ttf0);
            poker0.setVisible(false);
            ttf0.setVisible(false);

            this.pokerNum=poker0;
            this.pokerNumTxt=ttf0;

            console.log("testName="+this.nameNode);




        }
        else if(index==1){
            var headBg1=new cc.Sprite("res/head_nm.png");
            headBg1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-60));
            this.node.addChild(headBg1, 0, HEAD_1);
            var nameBg1=new cc.Sprite("res/main_name_bg.png");
            nameBg1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-120));
            this.node.addChild(nameBg1);

            var onlineSprite=new cc.Sprite("res/offlinePic.png");
            onlineSprite.setScale(0.5);
            onlineSprite.setPosition(cc.p(60+50, 30+100));
            nameBg1.addChild(onlineSprite);
            this.offLineNode=onlineSprite;


            var head1=new cc.Sprite();
            head1.setScale(0.2);
            head1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-60));
            this.node.addChild(head1);
            this.headNode=head1;

           // charName= "name_"+ (1+this.personId*2);
            var name1=new cc.LabelTTF("", "MarkerFelt", 20);
            name1.setPosition(cc.p(size.width-originPoint.x-60, size.height-originPoint.y-120));
            this.node.addChild(name1);
            this.nameNode=name1;

            var poker1=new cc.Sprite("res/main_shoupai.png");
            poker1.setPosition(cc.p(size.width-originPoint.x-130, size.height-originPoint.y-70));
            this.node.addChild(poker1);
            var  text1;
            text1="17";
            var ttf1=new cc.LabelTTF(text1, "MarkerFelt", 25);
            ttf1.setPosition(cc.p(size.width-originPoint.x-130, size.height-originPoint.y-30));
            this.node.addChild(ttf1);

            this.pokerNum=poker1;
            this.pokerNumTxt=ttf1;
        }
        else if(index==2){
            //左上角玩家
            var headBg2=new cc.Sprite("res/head_nm.png");
            headBg2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-60));
            this.node.addChild(headBg2, 0, HEAD_2);
            var nameBg2=new cc.Sprite("res/main_name_bg.png");
            nameBg2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-120));
            this.node.addChild(nameBg2);

            var onlineSprite=new cc.Sprite("res/offlinePic.png");
            onlineSprite.setScale(0.5);
            onlineSprite.setPosition(cc.p(60+50, 30+100));
            nameBg2.addChild(onlineSprite);
            this.offLineNode=onlineSprite;

           // var charName= "res/head_"+(2+this.personId*2)+".png";
            var head2=new cc.Sprite();
            head2.setScale(0.2);
            head2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-60));
            this.node.addChild(head2);
            this.headNode=head2;

           // charName= "name_"+ (2+this.personId*2);
            var name2=new cc.LabelTTF("", "MarkerFelt", 20);
            name2.setPosition(cc.p(originPoint.x+60, size.height-originPoint.y-120));
            this.node.addChild(name2);
            this.nameNode=name2;


            var poker2=new cc.Sprite("res/main_shoupai.png");
            poker2.setPosition(cc.p(originPoint.x+130, size.height-originPoint.y-70));
            this.node.addChild(poker2);
            var text2="17";
            var ttf2=new cc.LabelTTF(text2, "MarkerFelt", 25);
            ttf2.setPosition(cc.p(originPoint.x+130, size.height-originPoint.y-30));
            this.node.addChild(ttf2);

            this.pokerNum=poker2;
            this.pokerNumTxt=ttf2;

        }


    };
    this.setPokerNum=function(num){
        this.pokerNumTxt.setString(num);
    };
    this.setPokerNumEnable= function (visible) {
        this.pokerNum.setVisible(visible);
        this.pokerNumTxt.setVisible(visible);
    };
    this.refresh=function(){
        if(this.nameNode != null){
            this.nameNode.setString(this.userName);
        }
        if(this.headNode) {
            //   cc.textureCache.add
            if (this.headImg) {
             var position=this.headNode.getPosition();
                var newSprite=new cc.Sprite(this.headImg);
                newSprite.setPosition(position);
                this.headNode.getParent().addChild(newSprite);
                this.headNode.removeFromParent();
                this.headNode=newSprite;
                this.headNode.setScale(0.2);

            }
        }

        if(this.offLineNode){
            this.offLineNode.setVisible(this.isOffline && this.userName != "");
        }

        if(this.isReady){
        }

        if(this.userName!=null&&this.userName!=""){
            this.node.setVisible(true);
        }
        else {
            this.node.setVisible(false);
        }

    };

    this.setInfo=function(name,score){
        this.userName = name;
        this.score = score;
        this.headImg=cc.vv.userMgr.getImgByName(name);

        if(this.score == null){
            this.score = 0;
        }

        this.refresh();
    };

    this.setReady=function(isReady){
        this.isReady = isReady;
        //if(this._ready){
        //    this._ready.active = this._isReady && (cc.vv.gameNetMgr.numOfGames > 0);
        //}
    };

    this.setID=function(id){

        this.userId = id;

    };

    this.setOffline=function(isOffline){
        this.isOffline = isOffline;
        if(this.offLineNode){
            this.offLineNode.setVisible(this.isOffline && this.userName != "");
        }
    };
    this.initSeatUI(this.index);
}