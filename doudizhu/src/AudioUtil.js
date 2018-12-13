var AudioUtil={

    getMusicPlay:function(){
     isPlay=cc.sys.localStorage.getItem(KEY_MUSIC);
        if(isPlay==null){
            isPlay="1";
        }
        else {
            return isPlay;
        }

    //if(isPlay){
    //    cc.audioEngine.resumeMusic();
    //    cc.audioEngine.resumeAllEffects();
    //
    //}else{
    //    cc.audioEngine.pauseMusic();
    //}
       // alert(isPlay);
    return isPlay;
},
playBackMusic:function(){
    var isPlay=cc.sys.localStorage.getItem(KEY_MUSIC);
    if(isPlay==null){
        isPlay="1";
    }
    if(isPlay=="1"){
        cc.audioEngine.playMusic("res/sound/music/game_music.mp3", true);
        AudioUtil.setMusicPlay("1");
    }
    else{
        cc.audioEngine.playMusic("res/sound/music/game_music.mp3", true);
        AudioUtil.setMusicPlay("0");
    }
},
setMusicPlay:function( isPlay){

    if(isPlay=="1"){


        cc.audioEngine.resumeMusic();
        //cc.audioEngine.playMusic("res/sound/music/game_music.mp3", true);
    }else if(isPlay=="0"){

       cc.audioEngine.pauseMusic();
        //cc.audioEngine.stopMusic();
    }
    cc.sys.localStorage.setItem(KEY_MUSIC, isPlay);

},
  soundQDZ:function(  score,  sex){
     var tag= cc.sys.localStorage.getItem(KEY_MUSIC);

      tag=tag==null?"1":tag;

    if(tag=="1"){
        var name="res/sound/qdz/dz_";
        switch(score){
            case 0:
                name+="bj_";
                break;
            case 1:
                name+="score1_";
                break;
            case 2:
                name+="score2_";
                break;
            case 3:
                name+="score3_";
                break;
        }
        if(sex==0){
            name+="M.mp3";
        }else{
            name+="W.mp3";
        }
        cc.audioEngine.playEffect(name);

    }
},
  soundBuYao:function(sex){

      var tag= cc.sys.localStorage.getItem(KEY_MUSIC);
      tag=tag==null?"1":tag;
    if(tag=="1"){
        var num=Math.getRandomNum(4)+1;
        if(sex==0){
            var  name="res/sound/card/card_pass_M"+num+".mp3";
            cc.audioEngine.playEffect(name);
        }else{
            var  name="res/sound/card/card_pass_W"+num+".mp3";
            cc.audioEngine.playEffect(name);
        }

    }
},
 soundCard:function( type,  value,   sex,   last1,isfirst){
     var tag= cc.sys.localStorage.getItem(KEY_MUSIC);
     tag=tag==null?"1":tag;
    if(tag=="1"){
        var  name="res/sound/card/card_";
        var  strValue=value+"";

        //var num=Math.getRandomNum(10);
        //if(num>=7&&isfirst==false){
        //   var num1=Math.getRandomNum(3)+1;
        //    strValue="dani"+num1+"_";
        //    name+=strValue;
        //}
        //else{
        switch(type){
            case PokerType.danpai:
                name+="single_"+strValue+"_";
                break;
            case PokerType.duipai:
                name+="double_"+strValue+"_";
                break;
            case PokerType.danshun:
                name+="shunzi_";
                break;
            case PokerType.shuangshun:
                name+="doubleline_";
                break;
            case PokerType.feiji://普通飞机
                case PokerType.feijicb://炸弹飞机
                name+="plane_";
                break;
            case PokerType.sanzhang:
                name+="three_"+strValue+"_";
                break;
            case PokerType.sandaiyi:
                name+="three_1_";
                break;
            case PokerType.sandaier:
                name+="three_2_";
                break;
            case PokerType.zhadan:
                name+="bomb_";
                break;
            case PokerType.huojian:
                name+="rocket_";
                break;
            case PokerType.sidaier:
                name+="sidaier_";
            case PokerType.sidaitwodui:
                name+="sidaitwodui_";
                break;

        }
       // }
        if(sex==0){
            name+="M.mp3";
        }else{
            name+="W.mp3";
        }

        cc.audioEngine.playEffect(name);
    }
},
 soundLast:function( last,   sex){
    if(last>0 && last<3){
        var tag= cc.sys.localStorage.getItem(KEY_MUSIC);
        tag=tag==null?"1":tag;
        if(tag=="1"){
            var  name="res/sound/card/card_";
            if(last==1){
                name+="last_1_";
            }else{
                name+="last_2_";
            }
            if(sex==0){
                name+="M.mp3";
            }else{
                name+="W.mp3";
            }
            cc.audioEngine.playEffect(name);
        }
        //if(CCUserDefault::sharedUserDefault()->getBoolForKey(KEY_VIBRATOR, true)){
        //    //#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
        //    //sendStringJNI("vibrator");
        //    //#endif
        //    JniUtil::sendStringJNI("vibrator");
        //}
    }
},
    soundControl:function ( state){
        var tag= cc.sys.localStorage.getItem(KEY_MUSIC);
        tag=tag==null?"1":tag;
    if(tag=="1"){
       var  name="res/sound/card/card_";
        switch(state){
            case 0:
                name+="click.mp3";
                break;
            case 1:
                name+="deal.mp3";
                break;
        }
        cc.audioEngine.playEffect(name);
    }
},
    playWinSound:function(){

        var isPlay=cc.sys.localStorage.getItem(KEY_MUSIC);
        if(isPlay==null){
            isPlay="1";
        }
        if(isPlay=="1"){
            AudioUtil.setMusicPlay("1");
        }
        else{
            AudioUtil.setMusicPlay("0");
        }
        if(isPlay=="1"){
        cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic("res/sound/music/MusicEx_Win.mp3", false);
        }
},
   playLoseSound:function(){
       var isPlay=cc.sys.localStorage.getItem(KEY_MUSIC);
       if(isPlay==null){
           isPlay="1";
       }
       if(isPlay=="1"){
           AudioUtil.setMusicPlay("1");
       }
       else{
           AudioUtil.setMusicPlay("0");
       }
       if(isPlay=="1"){
           cc.audioEngine.stopMusic();
           cc.audioEngine.playMusic("res/sound/music/MusicEx_Lose.mp3", false);
       }

   }






};