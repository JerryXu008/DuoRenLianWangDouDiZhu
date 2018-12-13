/**
 * Created by song on 16/11/22.
 */
var Person=function(){

    this.next=null;
    this.pokes=[];
    this.id=0;
    this.sex=0;
    this.name=null;
    this.personCard=new Card();

    this.setId=function(personId){
        this.id=personId;
    };
    this.setPokes=function(p){
        this.pokes=p;

    };
    this.setPosition=function(l, n) {
        this.last = l;
        this.next = n;
    };
    this.cardIndexFromeValue=function(value){
       // cc.log("后来的="+value);

        for(var i=0; i!=this.pokes.length; i++){


            if(value==this.pokes[i]){
                return i;
            }
        }
        return -1;
    };
    this.paintPoker=function(layer,op){
        var len= arguments.length;
        if(1 == len)
        {
            this.paintPoker1(layer)
        }
        else{
            this.paintPoker2(layer,op)
        }

    };
    this.paintPoker1=function(layer){
        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();

        if(this.id==1){

          //  var w=(size.width-originPoint.x)/21-1.0;
          //  w*=0.5;
            var  count=this.pokes.length;
            var w;
            if(count%2==0){
                var w=(size.width-originPoint.x)/20*0.8;
            }
            else{
                var w=(size.width-originPoint.x)/21*0.8;
            }
            w*=0.5;
            for(var i=0; i!=count; i++){

                var text= "#poke"+this.pokes[i]+".png";
                var tempPoker=new cc.Sprite(text);
                var  x;
                if(count%2==0) {
                    x=size.width*0.5+(i-parseInt(count*0.5))*w+250;
                    x = x + w/2;
                }
                else{
                    x=size.width*0.5+(i-parseInt(count*0.5))*w+250;
                }
                var  y=size.height*0.5+80;
                layer.addChild(tempPoker);
                tempPoker.setScale(0.6);
                tempPoker.setPosition(cc.p(x, y));
            }

        }else if(this.id==2){

            var  count=this.pokes.length;
            var w;
            if(count%2==0){
                var w=(size.width-originPoint.x)/20*0.8;
            }
            else{
                var w=(size.width-originPoint.x)/21*0.8;
            }
            w*=0.5;
            for(var i=0; i!=count; i++){

                var text= "#poke"+this.pokes[i]+".png";
                var tempPoker=new cc.Sprite(text);
                var  x;
                if(count%2==0) {
                    x=size.width*0.5+(i-parseInt(count*0.5))*w-250;
                    x = x + w/2;
                }
                else{
                    x=size.width*0.5+(i-parseInt(count*0.5))*w-250;
                }
                var  y=size.height*0.5+80;
                layer.addChild(tempPoker);
                tempPoker.setScale(0.6);
                tempPoker.setPosition(cc.p(x, y));
            }

        }

    };
    this.paintPoker2=function(layer, op){

        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        if(this.id==0){

            var  count=this.pokes.length;

            var w;
            if(count%2==0){
            var w=(size.width-originPoint.x)/20*0.8;
            }
            else{
                var w=(size.width-originPoint.x)/21*0.8;
            }
            var y=originPoint.y+85*0.8;


                var startX;

                for(var i=0; i!=count; i++){

                    var text= "#poke"+this.pokes[i]+".png";
                    var tempPoker=cc.Sprite.create(text);
                    tempPoker.setScale(0.8);
                    var  x=size.width*0.5+(i-parseInt(count*0.5))*w;

                    if(count%2==0) {
                        x=size.width*0.5+(i-parseInt(count*0.5))*w;
                        x = x + w/2;
                    }
                    else{
                        x=size.width*0.5+(i-parseInt(count*0.5))*w;
                    }
                    if(i==0){
                        startX=x;
                    }
                    layer.addChild(tempPoker, 0, POKER_STRAT_ID+i);

                    if(op==-2){
                        tempPoker.setPosition(cc.p(x, y));
                        //屏蔽动画
                        //tempPoker.setPosition(startX, y);
                        //tempPoker.runAction(new cc.Sequence(new cc.DelayTime(0.5), new cc.MoveTo.create(i*0.05, cc.p(x, y))));
                    }
                    else{
                      tempPoker.setPosition(cc.p(x, y));
                     }
                }


        }
        else if(this.id==1){
               //比赛结束之后 电脑的剩下的牌都显示出来
                var  count=this.pokes.length;
                var w;
                if(count%2==0){
                    var w=(size.width-originPoint.x)/20*0.8;
                }
                else{
                    var w=(size.width-originPoint.x)/21*0.8;
                }
                w*=0.5;
                for(var i=0; i!=count; i++){

                    var text= "#poke"+this.pokes[i]+".png";
                    var tempPoker=new cc.Sprite(text);
                    var  x;
                    if(count%2==0) {
                        x=size.width*0.5+(i-parseInt(count*0.5))*w+250;
                        x = x + w/2;
                    }
                    else{
                        x=size.width*0.5+(i-parseInt(count*0.5))*w+250;
                    }
                    var  y=size.height*0.5+80;
                    layer.addChild(tempPoker);
                    tempPoker.setScale(0.6);
                    tempPoker.setPosition(cc.p(x, y));

            }
        }
        else if(this.id==2){

                var  count=this.pokes.length;
                var w;
                if(count%2==0){
                    var w=(size.width-originPoint.x)/20*0.8;
                }
                else{
                    var w=(size.width-originPoint.x)/21*0.8;
                }
                w*=0.5;
                for(var i=0; i!=count; i++){

                    var text= "#poke"+this.pokes[i]+".png";
                    var tempPoker=new cc.Sprite(text);
                    var  x;
                    if(count%2==0) {
                        x=size.width*0.5+(i-parseInt(count*0.5))*w-250;
                        x = x + w/2;
                    }
                    else{
                        x=size.width*0.5+(i-parseInt(count*0.5))*w-250;
                    }
                    var  y=size.height*0.5+80;
                    layer.addChild(tempPoker);
                    tempPoker.setScale(0.6);
                    tempPoker.setPosition(cc.p(x, y));
                }
            }



    };
    this.painChuPai=function(layer, pokesFlag,num){

        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();
        var cardIndex=[], pokerIndex=[];

        for (var i = 0; i <num; i++) {
            if (pokesFlag[i]) {
                cardIndex.push(i); //应该出的牌
            }else{
                pokerIndex.push(i); //剩余的牌
            }
        }


        var count=pokerIndex.length;
        //var w=(size.width-originPoint.x)/count*0.8;
        if(count%2==0){
            var w=(size.width-originPoint.x)/20*0.8;
        }
        else{
            var w=(size.width-originPoint.x)/21*0.8;
        }

        var y=originPoint.y+85*0.8;


        for(var i=0; i!=count; i++){
            var  x;

            if(count%2==0) {
                x=size.width*0.5+(i-parseInt(count*0.5))*w;
                x = x + w/2;
            }
            else{
                x=size.width*0.5+(i-parseInt(count*0.5))*w;

            }

            var pokerSprite=layer.getChildByTag(POKER_STRAT_ID+pokerIndex[i]);
            pokerSprite.runAction(new cc.MoveTo(0.3, cc.p(x, y)));
        }
        count=cardIndex.length;
        w*=0.5;
        //y=originPoint.y+280*0.8;
        y=originPoint.y+260*0.8;
        for(var i=0; i!=count; i++){
            var cardSprite=(layer.getChildByTag(POKER_STRAT_ID+cardIndex[i]));
            var x=size.width*0.5+(i-count*0.5)*w+w;
            cardSprite.runAction(new cc.Spawn(new cc.ScaleTo(0.3, 0.6),new cc.MoveTo(0.3, cc.p(x, y))));
        }


    };



    this.chupaiAI=function(card, boss, persons){

        var pokeWanted=[];
        if (card==null) { //新一轮出牌
            // 玩家随意出一手牌
            pokeWanted = AIUtil.outCardByItsself(this.pokes, this.last, this.next, boss);
           // alert(pokeWanted);

        } else {
            // 玩家需要出一手比card大的牌
            //或者其余两人都不要，那么card还是当前自己的
            pokeWanted = AIUtil.findTheRightCard(card, this.pokes, this.last, this.next, boss, persons);

        }
        if (pokeWanted.length==0) {
            return null;
        }
         return  pokeWanted;
        //// 如果不能出牌，则返回
        //if (pokeWanted.length==0) {
        //    this.personCard.setPersonID(this.id);
        //    this.personCard.pokes=[]; //清空刚出过的牌的数组
        //    return null;
        //}
        //// 以下为出牌的后续操作，将牌从玩家手中剔除
        //var num = 0;
        //for (var i = 0; i < pokeWanted.length; i++) {
        //    for (var j = 0; j < this.pokes.length; j++) {
        //        if (this.pokes[j] == pokeWanted[i]) {
        //            this.pokes[j] = -1;
        //            num++;
        //            break;
        //        }
        //    }
        //}
        //var newpokes=[];
        //for (var i = 0; i < this.pokes.length; i++) {
        //    if (this.pokes[i] != -1) {
        //        newpokes.push(this.pokes[i]);
        //    }
        //}
        //for(var i=0;i<newpokes.length;i++){
        //    this.pokes[i]=newpokes[i];
        //}
        //this.pokes.length=newpokes.length;
        //
        //this.personCard.setPokes(pokeWanted); //重设刚出的牌的数组
        //this.personCard.setPersonID( this.id);
        //
        //return this.personCard;

    };








    /**判断是否可以出牌*/
    this.enableChupai=function(card,pokesFlag){

        var cardPokes=[];
        for (var i = 0; i < this.pokes.length; i++) {
            if (pokesFlag[i]) {
                cardPokes.push(this.pokes[i]);
            }
        }
        var cardType = AIUtil.getPokeType(cardPokes);
       // cc.log("牌的类型="+cardType);
        if (cardType == PokerType.error) {
            return false;
        }
        if (card != null) {
            var tempCard=new Card();
            tempCard.setPokes(cardPokes);
            tempCard.setPersonID(this.id);
            if (!AIUtil.compare(tempCard, card)) {
                return false;
            }

        }
        //如果card为空，那么肯定可以出牌了
        return true;
    };



    this.chupai=function(card, pokesFlag, layer){

        var cardPokes=[];
        for (var i = 0; i < this.pokes.length; i++) {
            if (pokesFlag[i]) {
                cardPokes.push(this.pokes[i]); //把将要出的牌加入数组
            }
        }



        this.personCard.setPokes(cardPokes); //目前将要出的最新牌，保存到person的card中
        this.personCard.setPersonID(this.id);

        if (card ==null) { //传过来的card为空，那么不用比较大小，直接把选的规则的牌出出去

            this.painChuPai(layer, pokesFlag);//把该出的牌和剩余的牌重新排列位置



            var newPokes=[];
            for (var i = 0; i < this.pokes.length; i++) {
                if (!pokesFlag[i]) {
                    newPokes.push(this.pokes[i]);//保存没有出的牌
                }
            }

            //目前为止剩余的未出的牌，指针内容重新变化,
            for(var i=0;i<newPokes.length;i++){
                this.pokes[i]=newPokes[i];
            }
            this.pokes.length=newPokes.length;

           // cc.log("剩余："+this.pokes+"   出牌："+this.personCard.pokes);

            return this.personCard;
        } else {

            if (AIUtil.compare(this.personCard, card)) { //先比较目前在手里将要出的牌和传过来的上一个人的牌比较大小，有没有大于后者的

                this.painChuPai(layer, pokesFlag);//把该出的牌和剩余的牌重新排列位置
                //当前的卡指向新的刚出的牌的卡
                card=this.personCard;


                var newPokes=[];
                for (var i = 0; i < this.pokes.length; i++) {
                    if (!pokesFlag[i]) {
                        newPokes.push(this.pokes[i]);
                    }
                }

                for(var i=0;i<newPokes.length;i++){
                    this.pokes[i]=newPokes[i];
                }
                this.pokes.length=newPokes.length;


                for(var i=0; i<20; i++){ //这个地方不写也行，displayPersonPoker会重置  ,具体在GameMain::updatePoker屌用
                   pokesFlag[i]=false;
                }
                cc.log("剩余："+this.pokes+"   出牌："+this.personCard.pokes);
                return this.personCard;
            } else {//没有更大的牌
                this.personCard.setPersonID(this.id);
                this.personCard.pokes=[];
                cc.log("剩余："+this.pokes+"   出牌："+this.personCard.pokes);
                return null;
            }
        }
    };
    this.tiShiAI=function(layer, pokesFlag, card, boss){
       return this.tiShiAIInternal(layer, pokesFlag, card, boss,this.pokes);
    };
    this.tiShiAIInternal=function(layer, pokesFlag,card,  boss
        ,pokes){
        for(var i=0; i<20; i++){
            if(pokesFlag[i]){
                pokesFlag[i]=false;
                var poker=layer.getChildByTag(POKER_STRAT_ID+i);
                poker.setPosition(cc.p(poker.getPositionX(), poker.getPositionY()-12));
            }
        }
        var pokeWanted=[];

        if (card == null) {
            // 玩家随意出一手牌， 可能是三代一，或者单顺等等，看过了
            pokeWanted = AIUtil.outCardByItsself(this.pokes);
        } else {
            // 玩家需要出一手比card大的牌 看过了，其实这个方法并不完善，有bug,不过目前暂时这样吧
            pokeWanted = AIUtil.findBigThanCardSimple2(card, this.pokes);
        }


        // 如果不能出牌，则返回
        if (pokeWanted.length==0) {
            //AIUtil.show(context, "不出牌！", Toast.LENGTH_SHORT);
            return false;
        }else{
            for(var i=0; i!=pokeWanted.length; i++){
                //找到对应的牌值的索引
                var index=this.cardIndexFromeValue(pokeWanted[i]);

                if(index!=-1){
                    pokesFlag[index]=true;
                    var poker=layer.getChildByTag(POKER_STRAT_ID+index);
                    poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), poker.getPositionY()+12)));
                }
            }
        }
        return true;

    };
    this.tiShiAI2=function(layer,  pokesFlag, card,  boss
        ,  p){

        var havePokeFlag=false;
        var originPoint=cc.director.getVisibleOrigin();
        var yy=originPoint.y+85*0.8;
        var selectPokers=p;
        for(var i=0; i!=selectPokers.length; i++){
            var index=this.cardIndexFromeValue(selectPokers[i]);
            if(pokesFlag[index]){
                havePokeFlag=true;
                break;
            }
        }
        if(!havePokeFlag){ //pokesFlag某个是true
            var pokeWanted=[];

            if (card == null) { //如果是第一个出牌
                // 玩家随意出一手牌
                pokeWanted = AIUtil.outCardByItsself(selectPokers);
            } else {
                // 玩家需要出一手比card大的牌
                pokeWanted = AIUtil.findBigThanCardSimple2(card, selectPokers);
            }


            // 如果没有合适的牌，那么选几个就出几个
            if ((card==null&&pokeWanted.length<2)
                || (card!=null && pokeWanted.length==0)) {

                for(var i=0; i!=selectPokers.length; i++){
                    var index=this.cardIndexFromeValue(selectPokers[i]);
                    var poker=layer.getChildByTag(POKER_STRAT_ID+index);
                    if(!pokesFlag[index]){
                        pokesFlag[index]=true;
                        if(poker!=null){
                            poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), yy+12)));
                        }
                    }
                }
                return false;
            }

            else{//有合适的牌
                for(var i=0; i!=pokeWanted.length; i++){
                     index=this.cardIndexFromeValue(pokeWanted[i]);
                    if(index!=-1){
                        pokesFlag[index]=true;
                        var poker=layer.getChildByTag(POKER_STRAT_ID+index);
                        if(poker!=null){
                            poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), yy+12)));
                        }
                    }
                }
            }
        }else{//这个很简单，调换位置
              for(var i=0; i!=selectPokers.length; i++){
                var index=this.cardIndexFromeValue(selectPokers[i]);
                var poker=layer.getChildByTag(POKER_STRAT_ID+index);
                if(pokesFlag[index]){
                    pokesFlag[index]=false;
                    if(poker!=null){
                        poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), yy)));
                    }
                }else{
                   pokesFlag[index]=true;
                    if(poker!=null){
                        poker.runAction(new cc.MoveTo(0.1 , cc.p(poker.getPositionX(), yy+12)));
                    }
                }
            }
        }

        return true;




    };
    this.tiShiPoker=function(layer, pokesFlag, card){
        var pokerNum=0;
        var poker0=-1;
        var poker1=-1;

        for(var i=0; i<20; i++){
            if(pokesFlag[i]){
                pokerNum++; //如果选中过，不断递增
                if(pokerNum==1){
                    if(this.pokes.length>i){
                        poker0=this.pokes[i];

                    }else{
                        return;
                    }

                }
                if(pokerNum==2){
                    if(this.pokes.length>i){
                        poker1=this.pokes[i];

                    }else{
                        return;
                    }

                }
            }
        }
        var pokeWanted=[];
        if(pokerNum==2){ //适用于顺子的情况,自己第一个出顺子和对方出顺子才有效

            //printf("poker0=%d,poker1=%d\n",poker0,poker1);

            pokeWanted=AIUtil.getDanShunPoker(card, this.pokes, poker0, poker1);
        }

        else if(pokerNum == 1 && card!=null){
            //这个看完了 ,根据对手的牌型，给予一定提示，不一定准确，这里就判断了几种牌型，没有判断到的最后返回空数组，必须对手出牌之后在进行提示判断
            pokeWanted=AIUtil.getTiShiPoker(card, this.pokes ,poker0);
        }

        for(var i=0; i!=pokeWanted.length; i++){
            if(poker0==pokeWanted[i]){//手动选择了的，就不要再走动画了，因为cocos2dx会叠加moveto（手动点击此牌也会走moveoto），cocos2d-iphone最初版本不会
                continue;
            }
            if(poker1==pokeWanted[i]){
                continue;
            }
            var index=this.cardIndexFromeValue(pokeWanted[i]);
            if(index!=-1){
                pokesFlag[index]=true;
                var poker=layer.getChildByTag(POKER_STRAT_ID+index);
                poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), poker.getPositionY()+12)));
            }
        }
    };

    this.chongChu=function(layer,  pokesFlag){
        for(var i=0; i<20; i++){
            if(pokesFlag[i]){
                pokesFlag[i]=false;
                var poker=layer.getChildByTag(POKER_STRAT_ID+i);
                poker.runAction(new cc.MoveTo(0.1, cc.p(poker.getPositionX(), poker.getPositionY()-12)));
            }
        }
    };
    this.noBigCard=function(card){
        if(card==null || card.personID==this.id){
            return false;
        }
        return AIUtil.noBigCard(card, this.pokes);
    }



};









