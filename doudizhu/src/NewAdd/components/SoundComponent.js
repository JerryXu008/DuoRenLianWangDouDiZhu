/**
 * Created by brucexu on 17/11/18.
 */
var SoundCom=function(parent){
    this.node=parent;
    var node=this.node;
    var pokerLast1M=function(dt){
        node.unschedule(pokerLast1M);
        AudioUtil.soundLast(1, 0);
    };
    var pokerLast1W=function(dt){
        node.unschedule(pokerLast1W);
        AudioUtil.soundLast(1, 1);
    };
    var pokerLast2M=function(dt){
        node.unschedule(pokerLast2M);
        AudioUtil.soundLast(2, 0);
    };
    var pokerLast2W=function(dt){
        node.unschedule(pokerLast2W);
        AudioUtil.soundLast(2, 1);
    };
    this.soundLast=function(last,sex){

        if(last==1){
            if(sex==0){
                node.schedule(pokerLast1M, 0.8);
            }else{
                node.schedule(pokerLast1W, 0.8);
            }
        }else if(last==2){
            if(sex==0){
                node.schedule(pokerLast2M, 0.8);
            }else{
                node.schedule(pokerLast2W, 0.8);
            }
        }
    };
}