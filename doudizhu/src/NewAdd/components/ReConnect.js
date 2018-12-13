/**
 * Created by brucexu on 17/11/1.
 */
var ReConnect=function(parent){
         var self=this;
         this.reconnect= null;
         this._lblTip=null;
         this._loading_image= null;
         this. _lastPing= 0;
         this.node=parent;

          this.initUI=function(){
              var size=cc.director.getWinSize();

              //  this.reconnect=new cc.LayerColor(cc.color(100,200,30));
              this.reconnect= new cc.Layer();
              this.reconnect.setVisible(false);
              this.node.addChild(this.reconnect,10000,10000);

              var sprite=new cc.Scale9Sprite("res/default_panel.png");

              sprite.setPosition(cc.p( size.width/2,size.height/2));
              sprite.setContentSize(size.width,size.height);
              sprite.setOpacity(128);
              this.reconnect.addChild(sprite);


              this._loading_image=new cc.Sprite("res/loading_image.png");
              var loading_image= this._loading_image
              loading_image.setPosition(cc.p( size.width/2,size.height/2));
              //sprite.setContentSize(size.width,size.height);

              this.reconnect.addChild(loading_image);

              //防止Layer下面可点击
              var item= cc.MenuItemImage.create();
              item.setContentSize(size);
              item.initWithCallback(function () {

              }, this.reconnect);

              var menu=   cc.Menu.create(item);
              this.reconnect.addChild(menu);
          };


          this.update=function(dt){
              if (this.reconnect.isVisible()) {
                  this._loading_image.setRotation (  this._loading_image.getRotation() - dt * 45);
                  //console.log("度数="+dt);
              }
          }
          //执行
          this.initUI();

    var fnTestServerOn = function () {

        cc.vv.net.test(function (ret) {
            if (ret) {//ret为true，说明服务器是存在的
                cc.vv.gameNetMgr.reset();//应该是重置打牌记录吧

                var roomId = cc.vv.userMgr.oldRoomId;

                if (roomId != null) {
                    cc.vv.userMgr.oldRoomId = null;
                    //重新进入房间

                    cc.vv.userMgr.enterRoom(roomId, function (ret) {
                        if (ret.errcode != 0) {//进入失败 1，2 比如找不到房间或者房间已满
                            cc.vv.gameNetMgr.roomId = null;//情况房间号，退回大厅

                            cc.director.runScene(new HallScene());
                        }
                    });
                }
            }
            else {
                setTimeout(fnTestServerOn, 3000);//每3秒 重练一次
            }
        });
    }

    var fn = function (data) {
        self.node.off('disconnect', fn);
        self.reconnect.setVisible(true);
        fnTestServerOn();
    };


    this.node.on('login_finished', function () {
        self.reconnect.setVisible(false);
        self.node.on('disconnect', fn);//关联上断网通知
    });
    this.node.on('disconnect', fn);//断开了的回调通知




}