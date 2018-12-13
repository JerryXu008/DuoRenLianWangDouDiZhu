/**
 * Created by brucexu on 17/11/2.
 */
/**
 * Created by brucexu on 17/10/30.
 */
var JoinGameInput=function(parentLayer){
    this.nums=[6];
    this._inputIndex=0;
    this.bgLayer=null;
   this.initUI=function(){
       cc.spriteFrameCache.addSpriteFrames("res/JoinRoom.plist");

       cc.spriteFrameCache.addSpriteFrames("res/setting.plist");
       var originPoint=cc.director.getVisibleOrigin();
       var size=cc.director.getWinSize();
       //阴影层，防止下面的按钮可以点击
       this.bgLayer= new cc.Layer();
       var bgLayer=this.bgLayer;
       parentLayer.addChild(this.bgLayer);
       this.bgLayer.setVisible(false);

       cc.eventManager.addListener(
           {event: cc.EventListener.TOUCH_ONE_BY_ONE,
               onTouchBegan:this.ccTouchBegan2}, bgLayer);



       this.ccTouchBegan2=function(touch,event){

           event.stopPropagation();
           return false;
       };




       //背景图片
       var bg=new cc.Sprite("#Num25.png");// 845 592
       // bg.setContentSize(cc.size(size.width/2,size.height/2));

       bg.x=size.width*0.5 ;
       bg.y=size.height*0.5 ;
       bgLayer. addChild(bg, 0, GAME_SETTING_BG);

       var labelStart=new cc.LabelTTF("输入房间号", "MarkerFelt", 26);
        bg.addChild(labelStart);
       labelStart.setPosition(bg.getContentSize().width/2,bg.getContentSize().height-56);

       var lblShuRuKuang1=new cc.LabelTTF("___", "MarkerFelt", 26);
       lblShuRuKuang1.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang1);
       lblShuRuKuang1.setPosition(size.width/2-150,400);

       var lblShuRuKuang2=new cc.LabelTTF("___", "MarkerFelt", 26);
       lblShuRuKuang2.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang2);
       lblShuRuKuang2.setPosition(size.width/2-100,400);

       var lblShuRuKuang3=new cc.LabelTTF("___", "MarkerFelt", 26);
       lblShuRuKuang3.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang3);
       lblShuRuKuang3.setPosition(size.width/2-50,400);

       var lblShuRuKuang4=new cc.LabelTTF("___", "MarkerFelt", 26);
       lblShuRuKuang4.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang4);
       lblShuRuKuang4.setPosition(size.width/2,400);

       var lblShuRuKuang5=new cc.LabelTTF("___", "MarkerFelt", 26);
       lblShuRuKuang5.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang5);
       lblShuRuKuang5.setPosition(size.width/2+50,400);

       var lblShuRuKuang6=new cc.LabelTTF("___", "MarkerFelt", 26);
       lblShuRuKuang6.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang6);
       lblShuRuKuang6.setPosition(size.width/2+100,400);



       var lblShuRuKuang1=new cc.LabelTTF("", "MarkerFelt", 46);
       lblShuRuKuang1.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang1);
       lblShuRuKuang1.setPosition(size.width/2-150,400+20);

       var lblShuRuKuang2=new cc.LabelTTF("", "MarkerFelt", 46);
       lblShuRuKuang2.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang2);
       lblShuRuKuang2.setPosition(size.width/2-100,400+20);

       var lblShuRuKuang3=new cc.LabelTTF("", "MarkerFelt", 46);
       lblShuRuKuang3.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang3);
       lblShuRuKuang3.setPosition(size.width/2-50,400+20);

       var lblShuRuKuang4=new cc.LabelTTF("", "MarkerFelt", 46);
       lblShuRuKuang4.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang4);
       lblShuRuKuang4.setPosition(size.width/2,400+20);

       var lblShuRuKuang5=new cc.LabelTTF("", "MarkerFelt", 46);
       lblShuRuKuang5.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang5);
       lblShuRuKuang5.setPosition(size.width/2+50,400+20);

       var lblShuRuKuang6=new cc.LabelTTF("", "MarkerFelt", 46);
       lblShuRuKuang6.setColor({r:100,g:200,b:33});
       bg.addChild(lblShuRuKuang6);
       lblShuRuKuang6.setPosition(size.width/2+100,400+20);




       this.nums=[lblShuRuKuang1,lblShuRuKuang2,lblShuRuKuang3,lblShuRuKuang4,lblShuRuKuang5,lblShuRuKuang6];

       this.onInput=function(num){
           if(this._inputIndex >= this.nums.length){
               return;
           }
           this.nums[this._inputIndex].setString(num);
           this._inputIndex += 1;

           if(this._inputIndex == this.nums.length){
               var roomId = this.parseRoomID();
               console.log("ok:" + roomId);
               this.onInputFinished(roomId);
           }
       };



       this.parseRoomID=function(){
           var str = "";
           for(var i = 0; i < this.nums.length; ++i){
               str += this.nums[i].getString();
           }
           return str;
       };
       this.onInputFinished=function(roomId){
           cc.vv.userMgr.enterRoom(roomId,function(ret){
               if(ret.errcode == 0){
                   this.bgLayer.setVisible(false);
               }
               else{
                   var content = "房间["+ roomId +"]不存在，请重新输入!";//ret.errcode == 3
                   if(ret.errcode == 4){
                       content = "房间["+ roomId + "]已满!";
                   }

                   AlertWindow.show(content);

                   this.onResetClicked();
               }
           }.bind(this));
       };


       this.onN0Clicked=function(){
           this.onInput(0);
       };
       this.onN1Clicked=function(){

           this.onInput(1);
       };
       this.onN2Clicked=function(){
           this.onInput(2);
       };
       this.onN3Clicked=function(){
           this.onInput(3);
       };
       this.onN4Clicked=function(){
           this.onInput(4);
       };
       this.onN5Clicked=function(){
           this.onInput(5);
       };
       this.onN6Clicked=function(){
           this.onInput(6);
       };
       this.onN7Clicked=function(){
           this.onInput(7);
       };
       this.onN8Clicked=function(){
           this.onInput(8);
       };
       this.onN9Clicked=function(){
           this.onInput(9);
       };

       this.onResetClicked=function(){
           for(var i = 0; i < this.nums.length; ++i){
               this.nums[i].string = "";
           }
           this._inputIndex = 0;
       };
       this.onDelClicked=function(){
           if(this._inputIndex > 0){
               this._inputIndex -= 1;
               this.nums[this._inputIndex].string = "";
           }
       };
       this.onCloseClicked=function(){
           this.bgLayer.setVisible(false);
       };

       var menu=new cc.Menu();
       menu.setPosition(cc.p(0,0));
       bg.addChild(menu);


       var spriteNormal= new cc.Sprite("#setting1.png");
       var spriteSelected=new cc.Sprite("#setting1.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onCloseClicked,this);
       menuSprite.setPosition(cc.p(845-100,592-50));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);


       var spriteNormal= new cc.Sprite("#Num1.png");
       var spriteSelected=new cc.Sprite("#Num1.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN1Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2-257/2,bg.getContentSize().height/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num2.png");
       var spriteSelected=new cc.Sprite("#Num2.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN2Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num3.png");
       var spriteSelected=new cc.Sprite("#Num3.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN3Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2+257/2,bg.getContentSize().height/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num4.png");
       var spriteSelected=new cc.Sprite("#Num4.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN4Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2-257/2,bg.getContentSize().height/2-87/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num5.png");
       var spriteSelected=new cc.Sprite("#Num5.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN5Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2-87/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num6.png");
       var spriteSelected=new cc.Sprite("#Num6.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN6Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2+257/2,bg.getContentSize().height/2-87/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num7.png");
       var spriteSelected=new cc.Sprite("#Num7.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN7Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2-257/2,bg.getContentSize().height/2-87));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num8.png");
       var spriteSelected=new cc.Sprite("#Num8.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN8Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2-87));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num9.png");
       var spriteSelected=new cc.Sprite("#Num9.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN9Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2+257/2,bg.getContentSize().height/2-87));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num11.png");
       var spriteSelected=new cc.Sprite("#Num11.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onResetClicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2-257/2,bg.getContentSize().height/2-87-87/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num10.png");
       var spriteSelected=new cc.Sprite("#Num10.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onN0Clicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2,bg.getContentSize().height/2-87-87/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);
       var spriteNormal= new cc.Sprite("#Num12.png");
       var spriteSelected=new cc.Sprite("#Num12.png");
       var menuSprite=new cc.MenuItemSprite(spriteNormal,spriteSelected,null,this.onDelClicked,this);
       menuSprite.setPosition(cc.p(bg.getContentSize().width/2+257/2,bg.getContentSize().height/2-87-87/2));
       menuSprite.setScale(0.5);
       menu.addChild(menuSprite);






       //防止Layer下面可点击
//       var item= cc.MenuItemImage.create();
//       item.setContentSize(size);
//       item.initWithCallback(function () {
////alert(222);
//       }, this.reconnect);
//

    }

    this.initUI();


}