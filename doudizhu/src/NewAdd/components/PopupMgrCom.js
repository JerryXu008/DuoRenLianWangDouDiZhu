/**
 * Created by brucexu on 17/12/5.
 */
var PopupMgrCom=function(parent) {
    this.node = parent;
    this.gameRoom=this.node.gameRoom;
    this.gameRootNode=this.node.gameRootNode;
    this.extraInfo="";
    this.endTime="";
    var self = this;
    this.mainLayer=null;
    this.node.on("dissolve_notice",function(event){
        var data = event.detail;
        self.showDissolveNotice(data);
    });

    this.node.on("dissolve_cancel",function(event){
        self.closeAll();
    });

    this.closeAll=function(){
        this.mainLayer.removeFromParent();
    };
    this.showDissolveNotice=function(data){
        this.endTime = Date.now()/1000 + data.time;
        this.extraInfo = "";

        for(var i = 0; i < data.states.length; ++i){
            var b = data.states[i];
            if( cc.vv.gameNetMgr.seats[i]){
              var name = cc.vv.gameNetMgr.seats[i].name;
              if(b){
                this.extraInfo += "\n[已同意] "+ name;
              }
               else{
                this.extraInfo += "\n[待确认] "+ name;
              }
            }
        }
        var  layer=new ChooseQuitLayer();
        this.mainLayer=layer;
        layer.show(this.extraInfo);

        this.gameRootNode.addChild(layer);

    };
    this.update=function (dt) {
        if(this.endTime > 0){
            var lastTime = this.endTime - Date.now() / 1000;
            if(lastTime < 0){
                this.endTime = -1;
            }

            var m = Math.floor(lastTime / 60);
            var s = Math.ceil(lastTime - m*60);

            var str = "";
            if(m > 0){
                str += m + "分";
            }
            this.mainLayer.setString(str + s + "秒后房间将自动解散" + this.extraInfo);

        }
    };

};