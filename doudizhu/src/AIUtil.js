/**
 * Created by song on 16/11/22.
 */
var AIUtil={

    getPokeValue:function(poke){
        // 当扑克值为52时，是小王
        if (poke == 52) {
            return 16;
        }
        // 当扑克值为53时，是大王
        if (poke == 53) {
            return 17;
        }
        // 其它情况下返回相应的值(3,4,5,6,7,8,9,10,11(J),12(Q),13(K),14(A),15(2))
        return parseInt(poke / 4) + 3;
    },
    sort:function(array){
    var size=array.length;
    for (var i = 0; i < size; i++) {
        for (var j = i + 1; j < size; j++) {
            if (array[i] < array[j]) {
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
    }
},


shunzi:function(pokeArr){
    if(pokeArr.length==0){
        return false;
    }
    var start = this.getPokeValue(pokeArr[0]);
    // 顺子中不能包含2,king
    if (start >= 15) {
        return false;
    }
    var next;

    for(var i=1; i!=pokeArr.length; i++){
        next = this.getPokeValue(pokeArr[i]);
        if (start - next != 1) {
            return false;
        }
        start = next;
    }
    return true;
},
getPokeCount:function( pokeArr,  poke){
    var count = 0;
    for(var i=0;i!=pokeArr.length; i++){
        if (this.getPokeValue(pokeArr[i]) == this.getPokeValue(poke)) {
            count++;
        }
    }
    return count;
},

getPokeType:function( pokeparam){ //判断即将要出的牌的牌型

     var  pokes= pokeparam;

     var len = pokes.length;
     //cc.log("牌的长度="+len);
    // 当牌数量为1时,单牌
    if (len == 1) {
        return PokerType.danpai;
    }
    // 当牌数量为2时,可能是对牌和火箭
    if (len == 2) {
        if (pokes[0] == 53 && pokes[1] == 52) {
            return PokerType.huojian;
        }
        if (this.getPokeValue(pokes[0]) == this.getPokeValue(pokes[1])) {
            return PokerType.duipai;
        }
    }
    // 当牌数为3时,只可能是三顺
    if (len == 3) {
        if (this.getPokeValue(pokes[0]) == this.getPokeValue(pokes[1])
            && this.getPokeValue(pokes[2]) == this.getPokeValue(pokes[1])) {
            return PokerType.sanzhang;
        }
    }
    // 当牌数为4时,可能是三带一或炸弹
    if (len == 4) {
        var firstCount = this.getPokeCount(pokes, pokes[0]);
        if (firstCount == 3 || this.getPokeCount(pokes, pokes[1]) == 3) {
            return PokerType.sandaiyi;
        }
        if (firstCount == 4) {
            return PokerType.zhadan;
        }
    }
    //当牌数等于5时,判断是不是3带2
    if(len==5){
        var have3 = false;
        var have2 = false;
        for (var i = 0; i < len; i++) {
            var c = this.getPokeCount(pokes, pokes[i]);
            if (c == 3) {
                have3 = true;
            }
            if (c == 2) {
                have2 = true;
            }
        }
        if (have3 && have2) {
            return PokerType.sandaier;
        }
    }

    // 当牌数大于5时,判断是不是单顺
    if (len >= 5) {
        if (this.shunzi(pokes)) {
            return PokerType.danshun;
        }
    }
    // 当牌数为6时,四带二
    if (len == 6) {
        var have4 = false;
        var have1 = false;
        for (var i = 0; i < len; i++) {
            var c = this.getPokeCount(pokes, pokes[i]);
            if (c == 4) {
                have4 = true;
            }
            if (c == 1) {
                have1 = true;
            }
        }

        if (have4 && have1) {
            return PokerType.sidaier;
        }
    }
    //这里补充下，拉下了四带对子

    if (len == 8) {
        var have4 = false;
        var have1 = false;
        var t1,t2;
        var ii=0;
        var tempArr=[];
        for (var i = 0; i < len; i++) {
            var c = this.getPokeCount(pokes, pokes[i]);
            if (c == 4) {
                have4 = true;
                t1=this.getPokeValue(pokes[i]);
            }
            if (c == 2) {
                have1 = true;
                t2=this.getPokeValue(pokes[i]);
            }
        }
        if (have4 && have1) {
            var count=0;
            for (var i = 0; i < len; i++) {
                if(this.getPokeValue(pokes[i])!=t1&&this.getPokeValue(pokes[i])!=t2){
                    count++;
                    tempArr[ii++]=this.getPokeValue(pokes[i]);
                }
            }
            if(count==2){
                if(tempArr[0]==tempArr[1]){
                  return PokerType.sidaitwodui;
                }
            }
        }
    }


    // 当牌数大于等于6时,先检测是不是双顺和三顺
    if (len >= 6) {
        // 双顺
        var shuangshunflag = true; //比如334455
        for (var i = 0; i < len; i++) {
            if (this.getPokeCount(pokes, pokes[i]) != 2) {
                shuangshunflag = false;//肯定不是双顺了
                break;
            }
        }
        if (shuangshunflag) {//如果目前为止牌都是双份的，比如 22，44，55,再看看是不是顺子
            var tempPokes=[];
            for (var i = 0; i < len / 2; i++) {
                tempPokes.push( pokes[i * 2]);
            }
            if (this.shunzi(tempPokes)) {
                return PokerType.shuangshun;//双顺子
            }
        }
        // 三顺
        var sanshunflag = true;
        for (var i = 0; i < len; i++) {
            if (this.getPokeCount(pokes, pokes[i]) != 3) {
                sanshunflag = false;
                break;
            }
        }
        if (sanshunflag) {
            var tempPokes=[];
            for (var i = 0; i < len / 3; i++) {
                tempPokes.push(pokes[i * 3]);
            }
            if (this.shunzi(tempPokes)) {
                return PokerType.sanshun;//三顺子
            }
        }

    }
    // 当牌数大于等于8,且能够被4整除时,判断是不是飞机
    if (len >= 8 && (len % 4 == 0 || len%5==0)) { //5的倍数 比如 333444带55，66

        var list=[];
        var have1 = 0;
        var have2 = 0;
        for (var i = 0; i < pokes.length; i++) {
            var c = this.getPokeCount(pokes, pokes[i]);
            if (c == 3) { //把三顺的筛出来
                list.push(pokes[i]);
            }
             else if (c == 1) { //比如333444 5 6  中的5 和  6
                have1++;
            }else if(c == 2){ //比如333444 55 66  中的55 和66
                have2++;
            }
        }
        if(list.length==have1*3 && list.length+have1==len){ //三顺 带一 333444 5 6
            var tempArray=[];
            for(var i=0, size=list.length/3; i<size; i++){
                tempArray.push(list[i*3]);
            }
            this.sort(tempArray);
            if (this.shunzi(tempArray)) {
                return PokerType.feiji;
            }
        }
        if(list.length==have2/2*3 && list.length+have2==len){ // 333444 5566     三顺带双
            var tempArray=[];
            for(var i=0, size=list.length/3; i<size; i++){
                tempArray.push(list[i*3]);
            }
            this.sort(tempArray);
            if (this.shunzi(tempArray)) {
                return PokerType.feijicb;
            }
        }
    }

    // 如果不是可知牌型,返回错误型
    return PokerType.error;

},
getPokeTypeValue:function(pokes, pokeType){
// 这几种类型直接返回第一个值
    if (pokeType == PokerType.danpai || pokeType == PokerType.duipai
    || pokeType == PokerType.danshun || pokeType == PokerType.sanshun
    || pokeType == PokerType.shuangshun
    || pokeType == PokerType.sanzhang || pokeType == PokerType.zhadan) {
        return this.getPokeValue(pokes[0]);
    }
    // 三带一和飞机返回数量为3的牌的最大牌值
    if (pokeType == PokerType.feijicb || pokeType == PokerType.sandaiyi || pokeType == PokerType.feiji || pokeType == PokerType.sandaier) {
        for (var  i = 0; i <= pokes.length - 3; i++) {
            if (this.getPokeValue(pokes[i]) == this.getPokeValue(pokes[i + 1])
                && this.getPokeValue(pokes[i + 1]) == this.getPokeValue(pokes[i + 2])) {
                return this.getPokeValue(pokes[i]);
            }
        }
    }
    // 四带二返回数量为4的牌值
    if (pokeType == PokerType.sidaier||pokeType==PokerType.sidaitwodui) {
        for (var i = 0; i < pokes.length - 3; i++) {
            if (this.getPokeValue(pokes[i]) == this.getPokeValue(pokes[i + 1])
                && this.getPokeValue(pokes[i + 1]) == this.getPokeValue(pokes[i + 2])
                && this.getPokeValue(pokes[i + 2]) == this.getPokeValue(pokes[i + 3])) {
                return this.getPokeValue(pokes[i]);
            }
        }
    }
    return 0;
},
compare: function (f, s) {
    // 当两种牌型相同时
    if (f.getPokeType() == s.getPokeType()) {
        // 两手牌牌型相同时，数量不同将无法比较，默认为第二个大，使f不能出牌
        if (f.pokes.length != s.pokes.length)
            return false;
        // 牌型相同，数量相同时，比较牌值
        return f.getValue() > s.getValue();
    }
    // 在牌型不同的时候,如果f的牌型是火箭,则返回true
    if (f.getPokeType() == PokerType.huojian) {
        return true;
    }
    if (s.getPokeType() == PokerType.huojian) {
        return false;
    }
    // 排除火箭的类型，炸弹最大
    if (f.getPokeType() == PokerType.zhadan) {
        return true;
    }
    if (s.getPokeType() == PokerType.zhadan) {
        return false;
    }
    // 无法比较的情况，默认为s大于f
    return false;
},
/**随意出一手牌*/
 outCardByItsself:function(pokes
    , last,  next,  boss){
    var len= arguments.length;
    if(1 == len)
    {
       return this.outCardByItsself1(pokes)
    }
    else{
        return   this.outCardByItsself2(pokes, last,  next,  boss)
    }


},
/**随意出一手牌*/
outCardByItsself1:function(p){

    var analyze =new  AnalyzePoke();
    var pokes=p;
    analyze.setPokes(pokes);
    //for(var i=0;i<pokes.length;i++){
    //    cc.log("原来的="+pokes[i]);
    //}

    //截止到上面，把玩家手里的牌，分析出来了，都放到了相应的数组，比如单排数组，炸弹数组，3顺数组


    var cardArray=[];

    var card_danpai=analyze.getCard_danpai();

    var card_sanshun=analyze.getCard_sanshun();

    var card_duipai=analyze.getCard_duipai();

    var danpai = card_danpai.length;
    var duipai = card_duipai.length;

    var card_zhadan=analyze.getCard_zhadan();


    var card_shuangshun = analyze.getCard_shuangshun();

    var card_danshun = analyze.getCard_danshun();
    var card_sanzhang = analyze.getCard_sanzhang();


    //如果最后剩6张牌，一个炸弹，2个单排，直接一把出了
    if(pokes.length==6 && card_zhadan.length>0 && danpai>1){
        cardArray = card_zhadan[0];
        cardArray.push(card_danpai[0][0]);
        cardArray.push(card_danpai[1][0]);

        return cardArray;
    }


    var sanshun = card_sanshun.length;
    if (sanshun > 0) { //先看三顺
        cardArray = card_sanshun[0];//选取最小的一组
        if ( (cardArray.length / 3) <= duipai) {//如果三顺的都可以带1对牌，比如555444,  带 66 77
            var desArray=[];
            for (var i = 0; i < cardArray.length; i++){
                desArray[i] = cardArray[i];
            }
            var dIndex=0;
            for (var j = 0; j <= cardArray.length / 3; j+=2) {
                desArray[cardArray.length + j] = card_duipai[dIndex][0];//从最小的dindex开始，先带最小的
                desArray[cardArray.length + j+1] = card_duipai[dIndex][1];
                dIndex++;
            }
            AIUtil.sort(desArray);//由大到小排列
            return desArray;
        } else if (cardArray.length / 3 <= danpai) {//每个三张都可以带一张，比如 555444  带 7 8
           var desArray=[];
            for (var i = 0; i < cardArray.length; i++){
                desArray[i] = cardArray[i];
            }
            for (var j = 0; j < cardArray.length / 3; j++) {
                desArray[cardArray.length + j] = card_danpai[j][0];
            }
            AIUtil.sort(desArray);
            return desArray;
        } else { //不符合条件，单纯的出三顺
            return cardArray;
        }
    }
    //再看双顺

    if (card_shuangshun.length > 0) {
        cardArray = card_shuangshun[0];
        return cardArray;
    }
    //单顺

    if (card_danshun.length > 0) {
        return card_danshun[0];
    }
    //三张

    if (card_sanzhang.length > 0) {
        var sanzhangArray = card_sanzhang[0];
        if (duipai>0){//三代二
            var newA=[];
            newA.push( sanzhangArray[0]);
            newA.push( sanzhangArray[1]);
            newA.push( sanzhangArray[2]);
            newA.push(card_duipai[0][0]);
            newA.push(card_duipai[0][1]);
            AIUtil.sort(newA);
            return newA;
        }else if (danpai > 0) {//三带一
            var newA=[];
            newA.push( sanzhangArray[0]);
            newA.push( sanzhangArray[1]);
            newA.push( sanzhangArray[2]);
            newA.push(card_danpai[0][0]);
            AIUtil.sort(newA);
            return newA;
        } else {//只出三张
            return sanzhangArray;
        }
    }

    if (card_duipai.length > 0) {//对牌
        return card_duipai[0];
    }
    if (danpai > 0) { //单排
        return card_danpai[0];
    }

    if (card_zhadan.length > 0) { //炸弹
        return card_zhadan[0];
    }
    // 还需要判断下家的牌，是否是同盟
    // 出最大的单牌，上别人说去吧！
    var temp=[];
    temp.push(pokes[0]);
    return temp;
},

    outCardByItsself2:function(p
        , last,  next,  boss){

        var analyze = new AnalyzePoke();
        var pokes=p;
        analyze.setPokes(pokes);
        var cardArray=[];
        var card_danpai=analyze.getCard_danpai();
        var card_sanshun=analyze.getCard_sanshun();
        var card_duipai=analyze.getCard_duipai();


        var danpai = card_danpai.length;
        var duipai = card_duipai.length;
        var sanshun = card_sanshun.length;
        //返回值  哪种类型的牌，这种类型的牌的数组的第几个
        var miniType = analyze.getMinType(last, next, boss);


        switch (miniType[0]) {
            case PokerType.sanshun:
                if (sanshun > 0) {
                    cardArray = card_sanshun[miniType[1]];
                    if (cardArray.length / 3 < danpai) { //看看是否三代一
                        var desArray=[];
                        for (var i = 0; i < cardArray.length; i++){
                            desArray[i] = cardArray[i];
                        }
                        for (var j = 0; j < cardArray.length / 3; j++) {
                            desArray[cardArray.length + j] = card_danpai[j][0];
                        }
                        AIUtil.sort(desArray);
                        cc.log("三顺="+desArray);
                        return desArray;
                    } else {
                        cc.log("三顺="+cardArray);
                        return cardArray;
                    }
                }
                break;
            case PokerType.shuangshun:
            {
               var card_shuangshun = analyze.getCard_shuangshun();
                if (card_shuangshun.length > 0) {
                    cardArray = card_shuangshun[miniType[1]];
                    cc.log("双顺="+cardArray);
                    return cardArray;
                }
            }
                break;
            case PokerType.danshun:
            {
                var card_danshun = analyze.getCard_danshun();
                if (card_danshun.length > 0) {
                    cc.log("单顺="+card_danshun[miniType[1]]);
                    return card_danshun[miniType[1]];
                }
            }
                break;
            case PokerType.sanzhang:
            {
                var card_sanzhang = analyze.getCard_sanzhang();
                if (card_sanzhang.length > 0) {
                    var sanzhangArray = card_sanzhang[miniType[1]];
                    if (duipai>0){ //三代二
                        var newA=[];
                        newA.push( sanzhangArray[0]);
                        newA.push( sanzhangArray[1]);
                        newA.push( sanzhangArray[2]);
                        newA.push(card_duipai[0][0]);
                        newA.push(card_duipai[0][1]);
                        AIUtil.sort(newA);
                        cc.log("三张="+newA);
                        return newA;
                    }else if (danpai > 0) { //三代一
                        var newA=[];
                        newA.push( sanzhangArray[0]);
                        newA.push( sanzhangArray[1]);
                        newA.push( sanzhangArray[2]);
                        newA.push(card_danpai[0][0]);
                        AIUtil.sort(newA);
                        cc.log("三张="+newA);
                        return newA;
                    } else {
                        cc.log("三张="+sanzhangArray);
                        return sanzhangArray;
                    }
                }
            }

                break;
            case PokerType.duipai:
            {
               var card_duipai = analyze.getCard_duipai();
                if (card_duipai.length > 0) {
                    cc.log("对牌="+card_duipai[miniType[1]]);
                    return card_duipai[miniType[1]];
                }
            }

                break;
            case PokerType.danpai:
                if (danpai > 0) {
                    cc.log("单排4="+card_danpai[miniType[1]]);
                    return card_danpai[miniType[1]];
                }
                break;
        }
        var card_zhadan = analyze.getCard_zhadan();
        if (card_zhadan.length > 0) {
            cc.log("炸弹="+card_zhadan[0]);
            return card_zhadan[0];
        }
        // 还需要判断下家的牌，是否是同盟
        // 出最大的单牌，上别人说去吧！
        //最后各种情况都排出的，出第一张
        var temp=[];
        temp.push(pokes[0]);
        cc.log("啥也木有="+temp);
        return temp;


    },
/**出牌智能*/
findTheRightCard:function(card, p, last,
next, boss, persons){

    var an =new AnalyzePoke();
    var pokes=p;
    an.setPokes(pokes);
    var c = an.remainCount();


    // 当玩家只剩下一手牌的时候，无论如何都要出牌，意思就是没有合适的，就炸,这样就可以赢
    if (c == 1) {
        return this.findBigThanCardSimple2(card, pokes, 100);
    }

    // 判断我该不该要牌
    if (boss != last.id && boss != next.id) { //自己就是地主
        // 我是boss，就要要牌
        // 判断他的剩余牌数
        var pokeLength = persons[card.personID].pokes.length;
        var must = parseInt(pokeLength * 100 / 17);
        if (pokeLength <= 2) {
            must = 100;
        }
        return this.findBigThanCardSimple2(card, pokes, must);

    }
    else {//我不是地主

        if (boss == card.personID) { //上家是地主，也可能是上家的上家是地主,反正就是传过来的牌是地主
            // 是地主出的牌，根据概率要牌
            var pokeLength = persons[card.personID].pokes.length;
            var must = parseInt(pokeLength * 100 / 17);
            if (pokeLength <= 2) { //剩下2张，必须要
                must = 100;
            }
            return this.findBigThanCardSimple2(card, pokes, must);
        }
        else {// 传过来的牌不是地主
            // 我不是地主，牌也不是地主的牌，是自己家同盟的牌
            if (card.personID == next.id) {  // 自家的牌是我的下家，说明上家是地主，而且没要，那么我也不要，除非我一次出完

                if (c <= 3) {//如果我剩了3张牌，那么我必须要，即使是我的同盟，没有合适的就炸弹
                    return this.findBigThanCardSimple2(card, pokes, 100);
                }
               // alert(111);
                //否则我不要
                var temp=[];
                return temp;
            }
            else { // 同盟是我的上家，那么我的下家就是地主
                // 牌的大小如果大于一定值我不要，否则我顺一个
                if (card.getValue() < 12 &&(card.getPokeType()!=PokerType.zhadan
                    )  ) {//这里其实有个bug，炸弹，比如4444，返回的是4，然后会要，如果有更大的炸弹，会干掉，所以修改这个bug
                    var pokeLength = persons[card.personID].pokes.length;
                    var must = parseInt(100 - pokeLength * 100 / 17);//must越小，要的可能性越不大，0一定不要 100一定要
                    if (pokeLength <= 4) {//如果上家剩下4张， 那我有合适的该顺顺，没合适的，不会扔炸弹，must只是影响炸弹
                        must = 0;
                    }

                    //分析下地主的牌
                    var ana =new  AnalyzePoke();
                    ana.setPokes(next.pokes);

                    if (ana.remainCount() <= 1) {//地主只剩下一种牌型了，那么如果条件符合，必须出，不然地主就跑了

                        //这里有种作弊的嫌疑，分析了人家地主的牌，如果地主还剩一种类型，并且和card是一种牌型，那么强制要同盟的牌，挡一下
                        if (ana.lastCardTypeEq(card.getPokeType())
                            && (boss == next.id ||


                            (boss != next.id && boss != last.id)))//最下边这个条件没用，筛选到这里next一定是地主

                        {

                            return this.findBigThanCardSimple2(card, pokes, 100);
                        }
                        else{//不是一种牌型，那么先不要，反正如果地主没有炸弹，就跑不了

                        }

                    }
                    else {//如果地主不剩下一种牌型，那么按照must的概率出

                        return this.findBigThanCardSimple2(card, pokes, must);
                    }

                } else {//同盟的牌比较大，我先不要了
                    var temp=[];
                    return temp;
                }
            }
        }
    }
    //最后条件都不符合，不要
    var temp=[];
    return temp;
},

    findBigThanCardSimple2:function(card, p,  must){
        var len= arguments.length;
        if(2 == len)
        {
            return this.findBigThanCardSimple22(card, p)
        }
        else{
            return   this.findBigThanCardSimple21(card, p,  must)
        }
    },

findBigThanCardSimple21:function(card, p,  must){


        // 获取card的信息，牌值，牌型

        var pokes=p;
        var cardPokes=card.pokes;
        var cardValue = card.getValue();
        var cardType = card.getPokeType();
        var cardLength = cardPokes.length;
        // 使用AnalyzePoke来对牌进行分析
        var analyz = new AnalyzePoke();
        analyz.setPokes(pokes);




        var temp=[];
        var size = 0;
        // 根据适当牌型选取适当牌
        switch (cardType) {
            case PokerType.danpai:
            {
                temp = analyz.getCard_danpai();
                size = temp.length;
                for (var i = 0; i < size; i++) {

                var cardArray=temp[i];
                if(cardArray.length>0){
                    var v = AIUtil.getPokeValue(cardArray[0]);
                    if (v > cardValue) {
                        cc.log("单排5="+cardArray);
                        return cardArray;
                    }
                }
            }
                // 如果单牌中没有，则选择现有牌型中除火箭和4个2后的最大一个
                var st = 0;
                if (analyz.getCountWang() == 2) {
                    st += 2;
                }
                if (analyz.getCount2() == 4) {
                    st += 4;
                }
                if (pokes.length>0 && AIUtil.getPokeValue(pokes[st]) > cardValue){
                var temp=[];
                temp.push(pokes[st]);
                    cc.log("单排1="+temp);
                    return temp;

                }

            }break;
            case PokerType.duipai:
            {
                temp = analyz.getCard_duipai();
                size = temp.length;

                for (var i = 0; i < size; i++) {

                var cardArray=temp[i];
                if(cardArray.length>0){
                    var v = AIUtil.getPokeValue(cardArray[0]);
                    if (v > cardValue) {
                        cc.log("对排="+cardArray);
                        return cardArray;
                    }
                }
            }

                // 如果对子中没有，则需要检查双顺
                temp = analyz.getCard_shuangshun();
                size = temp.length;
                for (var i = 0; i < size; i++) {

                var cardArray=temp[i];
                for (var j = cardArray.length - 1; j > 0; j--) {
                    var v = AIUtil.getPokeValue(cardArray[j]);
                    if (v > cardValue) {
                        var temp=[];
                        temp.push(cardArray[j]);
                        temp.push(cardArray[j - 1]);
                        cc.log("对排="+temp);
                        return temp;

                    }
                }
            }
                // 如果双顺中没有，则需要检查三张
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {

                var cardArray=temp[i];
                if(cardArray.length>1){
                    var v = AIUtil.getPokeValue(cardArray[0]);
                    if (v > cardValue) {
                        var temp=[];
                        temp.push(cardArray[0]);
                        temp.push(cardArray[1]);
                        cc.log("对排="+temp);
                        return temp;

                    }
                }
            }
                // 如果三张中没有，则就考虑炸弹，下家也可以顺牌
            }
                break;
            case PokerType.sanzhang:
            {
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {
                    var cardArray=temp[i];
                if(cardArray.length>0){
                    var v = AIUtil.getPokeValue(cardArray[0]);
                    if (v > cardValue) {
                        cc.log("三张="+cardValue);
                        return cardArray;
                    }
                }
            }
            }
                break;
            case PokerType.sandaiyi:
            {
                if (pokes.length < 4) {
                    break;
                }
                var find = false;

                var sandaiyi=[0,0,0,0];
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {

                 var cardArray=temp[i];
                 if(cardArray.length>0){
                    var v = AIUtil.getPokeValue(cardArray[0]);
                    if (v > cardValue) {
                        for (var j = 0; j < cardArray.length; j++) {
                            sandaiyi[j] = cardArray[j];
                        }
                        find = true;
                        break;
                    }

                }
            }
                // 没有三张满足条件
                if (!find) {
                    break;
                }
                // 再找一张组合成三带一
                temp = analyz.getCard_danpai();
                size = temp.length;
                if (size > 0) {
                    var t=temp[0];
                    sandaiyi[3]=t[0];
                } else {
                    temp = analyz.getCard_danshun();
                    size = temp.length;
                    for (var i = 0; i < size; i++) {
                        var danshun=temp[i];
                        if (danshun.length >= 6) {
                            sandaiyi[3] = danshun[0];
                        }
                    }
                }
                // 从中随便找一个最小的
                if (sandaiyi[3] == 0) {
                    var start= (pokes.length - 1);
                    for (var i = start; i >= 0; i--) {
                        if (AIUtil.getPokeValue(pokes[i]) != AIUtil
                                .getPokeValue(sandaiyi[0])) {
                            sandaiyi[3] = pokes[i];
                        }
                    }
                }
                if (sandaiyi[3] != 0) {
                    cc.log("三贷一="+sandaiyi);
                    AIUtil.sort(sandaiyi);
                    return sandaiyi;
                }
            }
                break;
            case PokerType.sandaier:
            {
                if (pokes.length < 5) {
                    break;
                }
                var find = false;
                var sandaier=[-1,-1,-1,-1,-1];
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {
                var cardArray=temp[i];
                var v = AIUtil.getPokeValue(cardArray[0]);
                if(cardArray.length>0){
                    if (v > cardValue) {
                        for (var j = 0; j < cardArray.length; j++) {
                            sandaier[j] = cardArray[j];

                        }
                        find = true;
                        break;
                    }
                }
            }
                // 没有三张满足条件
                if (!find) {
                    break;
                }
                // 再找两张组合成三带二
                temp = analyz.getCard_duipai();
                size = temp.length;
                if (size > 1) {
                    var t=temp[0];
                    sandaier[3]=t[0];
                    sandaier[4]=t[1];
                }
                if (sandaier[3] != -1 && sandaier[4] != -1) {
                    AIUtil.sort(sandaier);
                    cc.log("三贷2="+sandaier);
                    return sandaier;
                }
            }
                break;
            case PokerType.danshun:
            {
                temp = analyz.getCard_danshun();
                size = temp.length;
                for (var i = 0; i < size; i++) {
                    var danshun=temp[i];
                if (danshun.length == cardLength) {
                    if (cardValue < AIUtil.getPokeValue(danshun[0])) {
                        cc.log("单顺="+danshun);

                        return danshun;
                    }
                 }
              }
                for (var i = 0; i < size; i++) {

                var danshun=temp[i];
                if (danshun.length > cardLength) {

                    if(danshun.length - cardLength == 1 || danshun.length - cardLength == 2){
                        if (cardValue >= AIUtil.getPokeValue(danshun[0])) {
                            continue;
                        }
                        var start = 0;
                        var end = 0;
                        if (danshun.length - cardLength == 1) {
                            if (cardValue < AIUtil.getPokeValue(danshun[1])) {
                                start = 1;
                            } else {
                                start = 0;
                                end = 1;
                            }
                        } else if (danshun.length - cardLength == 2) {
                            if (cardValue < AIUtil.getPokeValue(danshun[2])) {
                                start = 2;
                            } else if (cardValue < AIUtil.getPokeValue(danshun[1])) {
                                start = 1;
                                end = 1;
                            } else {
                                start = 0;
                                end = 2;
                            }
                        }

                        var dan=[];
                        for (var k = start; k < danshun.length-end; k++) {
                            dan.push(danshun[k]);
                        }
                        cc.log("单顺="+dan);
                        return dan;
                    }
                }
            }
            }
                break;
            case PokerType.shuangshun:
            {
                temp = analyz.getCard_shuangshun();
                size = temp.length;

                for (var i = size - 1; i >= 0; i--) {
                    var cardArray=temp[i];
                if (cardArray.length < cardLength) {
                    continue;
                }

                if (cardValue < AIUtil.getPokeValue(cardArray[0])) {
                    if (cardArray.length == cardLength) {
                        cc.log("双顺="+cardArray);
                        return cardArray;
                    } else {
                        var index = 0;
                        for (var j = cardArray.length - 1; j >= 0; j--) {
                            if (cardValue < AIUtil.getPokeValue(cardArray[j])) {
                                index = parseInt(j / 2);
                                break;
                            }
                        }

                        var total = parseInt(cardArray.length / 2);
                        var cardTotal = parseInt(cardLength / 2);
                        if (index + cardTotal > total) {
                            index = total - cardTotal;
                        }
                        var  shuangshun=[];
                        for(var ii=0;ii<cardLength;ii++){
                            shuangshun[ii]=0;
                        }

                        var m = 0;
                        for (var k = index * 2; k < cardArray.length; k++) {
                            shuangshun[m++] = cardArray[k];
                        }
                        cc.log("双顺="+shuangshun);
                        return shuangshun;
                    }
                }
            }
            }
                break;
            case PokerType.sanshun: //444333  999888 ,先找大的999888
            {
                temp = analyz.getCard_sanshun();
                size = temp.length;
                for (var i = size - 1; i >= 0; i--) {

                var cardArray=temp[i];
                if (cardLength > cardArray.length) {
                    continue;
                }

                if (cardValue < AIUtil.getPokeValue(cardArray[0])) {
                    if (cardLength == cardArray.length) {
                        cc.log("三顺="+cardArray);
                        return cardArray;
                    } else {
                        var  newArray=[];
                        for(var ii=0;ii<cardLength;ii++){
                            newArray[ii]=0;
                        }
                        for (var k = 0; k < cardLength; k++) {
                            newArray[k] = cardArray[k];
                        }
                        cc.log("三顺="+newArray);
                        return newArray;
                    }
                }
            }
            }
                break;
            case PokerType.feiji:
                break;
            case PokerType.zhadan:
            {
                temp = analyz.getCard_zhadan();
                size = temp.length;

                var zd=[];
                if (size > 0) {
                    for (var i = 0; i < size; i++) {
                        zd = temp[i];
                        if(zd.length>0){
                            if (cardValue < AIUtil.getPokeValue(zd[0])) {
                                cc.log("炸弹="+cardValue);
                                return zd;
                            }
                        }
                    }
                }
            }
                break;
            case PokerType.huojian:
            {
                var temp=[];
                cc.log("火箭空="+temp);
                return temp;
            }
            case PokerType.sidaier:
                break;
            case PokerType.sidaitwodui:
                break;
        }




        var needZd = false;
        if (must < 90) {
            must *= 0.2;
            if (Math.getRandomNum(100) < must) {
                needZd = true;
            }
        } else {
            needZd = true;
        }

        //强制让自己打上家
        if (needZd && cardType!=PokerType.zhadan && cardType!=PokerType.huojian) {
            temp = analyz.getCard_zhadan();
            size = temp.length;
            if (size > 0) {
                cc.log("炸弹="+temp[0]);
                return temp[0];
            }
        }



    var temp=[];
    cc.log("啥也没有="+temp);
    return temp;

},
findBigThanCardSimple22:function(card,  p){


        // 获取card的信息，牌值，牌型

    var pokes=p;
    var cardPokes=card.pokes;
    var cardValue = card.getValue();
    var cardType = card.getPokeType();
    var cardLength = cardPokes.length;
    // 使用AnalyzePoke来对牌进行分析
    var analyz = new AnalyzePoke();
    analyz.setPokes(pokes, card.getPokeType());


    var temp=[];
    var size = 0;
        // 根据适当牌型选取适当牌
        switch (cardType) {
            case PokerType.danpai: //单牌情况的判断
            {
                temp = analyz.getCard_danpai();
                size = temp.length;
                for (var i = 0; i < size; i++) {

                    var cardArray=temp[i];
                    if(cardArray.length>0){
                        var v = AIUtil.getPokeValue(cardArray[0]);
                        if (v > cardValue) {
                            cc.log("单排2="+cardArray);
                            return cardArray;
                        }
                    }


                }
                // 如果单牌中没有，则选择现有牌型中除火箭和4个2后的最大一个
                // 如果单牌中没有，则选择现有牌型中除火箭和4个2后的最大一个
                var st = 0;
                if (analyz.getCountWang() == 2) {
                    st += 2;
                }
                if (analyz.getCount2() == 4) {
                    st += 4;
                }

                if (AIUtil.getPokeValue(pokes[st]) > cardValue){
                    var temp=[];
                    temp.push(pokes[st]);
                    cc.log("单排3="+temp);
                    return temp;

                }

            }break;
            case PokerType.duipai: //对牌
            {
                temp = analyz.getCard_duipai();
                size = temp.length;

                for (var i = 0; i < size; i++) {

                var cardArray=temp[i];
                if(cardArray.length>0){
                    var v = AIUtil.getPokeValue(cardArray[0]);
                    if (v > cardValue) {
                        cc.log("对排="+cardArray);
                        return cardArray;
                    }
                }


            }

                // 如果对子中没有，则需要检查双顺
                temp = analyz.getCard_shuangshun();
                size = temp.length;
                for (var i = 0; i < size; i++) {
                    var cardArray=temp[i];
                //比如 998877  先出7
                    for (var j = cardArray.length - 1; j > 0; j--) {
                        var v = AIUtil.getPokeValue(cardArray[j]);
                        if (v > cardValue) {
                            var temp=[];
                            temp.push(cardArray[j]);
                            temp.push(cardArray[j - 1]);
                            cc.log("对排="+temp);
                            return temp;

                        }
                    }
            }
                // 如果双顺中没有，则需要检查三张
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {

                    var cardArray=temp[i];
                    if(cardArray.length>1){
                        var v = AIUtil.getPokeValue(cardArray[0]);
                        if (v > cardValue) {
                            var temp=[];
                            temp.push(cardArray[0]);
                            temp.push(cardArray[1]);
                            cc.log("对排="+temp);
                            return temp;

                        }
                    }
                }
                // 如果三张中没有，则就考虑炸弹，下家也可以顺牌
            }
                break;
            case  PokerType.sanzhang: //三张
            {
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {
                    var cardArray=temp[i];
                    if(cardArray.length>0){
                        var v = AIUtil.getPokeValue(cardArray[0]);
                        if (v > cardValue) {
                            cc.log("三张="+cardValue);
                            return cardArray;
                        }
                    }
                }

            }
                break;
            case PokerType.sandaiyi:
            {
                if (pokes.length < 4) {
                    break;
                }
                var find = false;

                var sandaiyi=[0,0,0,0];
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {

                    var cardArray=temp[i];
                    if(cardArray.length>0){
                        var v = AIUtil.getPokeValue(cardArray[0]);
                        if (v > cardValue) {
                            for (var j = 0; j < cardArray.length; j++) {
                                sandaiyi[j] = cardArray[j];
                            }
                            find = true;
                            break;
                        }

                    }
                }
                // 没有三张满足条件
                if (!find) {
                    break;
                }
                // 再找一张组合成三带一
                temp = analyz.getCard_danpai();
                size = temp.length;
                if (size > 0) {
                    var t=temp[0];
                    sandaiyi[3]=t[0];
                } else {
                    temp = analyz.getCard_danshun();
                    size = temp.length;
                    for (var i = 0; i < size; i++) {
                        var danshun=temp[i];
                        if (danshun.length >= 6) {
                            sandaiyi[3] = danshun[0];
                        }
                    }
                }
                // 从中随便找一个最小的
                if (sandaiyi[3] == 0) {
                    var start= (pokes.length - 1);
                    for (var i = start; i >= 0; i--) {
                        if (AIUtil.getPokeValue(pokes[i]) != AIUtil
                                .getPokeValue(sandaiyi[0])) {
                            sandaiyi[3] = pokes[i];
                        }
                    }
                }
                if (sandaiyi[3] != 0) {
                    cc.log("三贷一="+sandaiyi);
                    AIUtil.sort(sandaiyi);
                    return sandaiyi;
                }
            }

                break;
            case PokerType.sandaier:
            {
                if (pokes.length < 5) {
                    break;
                }
                var find = false;
                var sandaier=[-1,-1,-1,-1,-1];
                temp = analyz.getCard_sanzhang();
                size = temp.length;
                for (var i = 0; i < size; i++) {
                    var cardArray=temp[i];
                    var v = AIUtil.getPokeValue(cardArray[0]);
                    if(cardArray.length>0){
                        if (v > cardValue) {
                            for (var j = 0; j < cardArray.length; j++) {
                                sandaier[j] = cardArray[j];

                            }
                            find = true;
                            break;
                        }
                    }
                }
                // 没有三张满足条件
                if (!find) {
                    break;
                }
                // 再找两张组合成三带二
                temp = analyz.getCard_duipai();
                size = temp.length;
                if (size > 1) {
                    var t=temp[0];
                    sandaier[3]=t[0];
                    sandaier[4]=t[1];
                }
                if (sandaier[3] != -1 && sandaier[4] != -1) {
                    AIUtil.sort(sandaier);
                    cc.log("三贷2="+sandaier);
                    return sandaier;
                }
            }

                break;
            case PokerType.danshun:
            {
                temp = analyz.getCard_danshun();
                size = temp.length;
                for (var i = 0; i < size; i++) {
                    var danshun=temp[i];
                    if (danshun.length == cardLength) {
                        if (cardValue < AIUtil.getPokeValue(danshun[0])) {
                            cc.log("单顺="+danshun);

                            return danshun;
                        }
                    }
                }
                for (var i = 0; i < size; i++) {

                    var danshun=temp[i];
                    if (danshun.length > cardLength) {

                        if(danshun.length - cardLength == 1 || danshun.length - cardLength == 2){
                            if (cardValue >= AIUtil.getPokeValue(danshun[0])) {
                                continue;
                            }
                            var start = 0;
                            var end = 0;
                            if (danshun.length - cardLength == 1) {
                                if (cardValue < AIUtil.getPokeValue(danshun[1])) {
                                    start = 1;
                                } else {
                                    start = 0;
                                    end = 1;
                                }
                            } else if (danshun.length - cardLength == 2) {
                                if (cardValue < AIUtil.getPokeValue(danshun[2])) {
                                    start = 2;
                                } else if (cardValue < AIUtil.getPokeValue(danshun[1])) {
                                    start = 1;
                                    end = 1;
                                } else {
                                    start = 0;
                                    end = 2;
                                }
                            }

                            var dan=[];
                            for (var k = start; k < danshun.length-end; k++) {
                                dan.push(danshun[k]);
                            }
                            cc.log("单顺="+dan);
                            return dan;
                        }
                    }
                }
            }

                break;
            case PokerType.shuangshun:
            {
                temp = analyz.getCard_shuangshun();
                size = temp.length;

                for (var i = size - 1; i >= 0; i--) {
                    var cardArray=temp[i];
                    if (cardArray.length < cardLength) {
                        continue;
                    }

                    if (cardValue < AIUtil.getPokeValue(cardArray[0])) {
                        if (cardArray.length == cardLength) {
                            cc.log("双顺="+cardArray);
                            return cardArray;
                        } else {
                            var index = 0;
                            for (var j = cardArray.length - 1; j >= 0; j--) {
                                if (cardValue < AIUtil.getPokeValue(cardArray[j])) {
                                    index = parseInt(j / 2);
                                    break;
                                }
                            }

                            var total = parseInt(cardArray.length / 2);
                            var cardTotal = parseInt(cardLength / 2);
                            if (index + cardTotal > total) {
                                index = total - cardTotal;
                            }
                            var  shuangshun=[];
                            for(var ii=0;ii<cardLength;ii++){
                                shuangshun[ii]=0;
                            }

                            var m = 0;
                            for (var k = index * 2; k < cardArray.length; k++) {
                                shuangshun[m++] = cardArray[k];
                            }
                            cc.log("双顺="+shuangshun);
                            return shuangshun;
                        }
                    }
                }
            }

                break;
            case PokerType.sanshun: //444333  999888 ,先找大的999888
            {
                temp = analyz.getCard_sanshun();
                size = temp.length;
                for (var i = size - 1; i >= 0; i--) {

                    var cardArray=temp[i];
                    if (cardLength > cardArray.length) {
                        continue;
                    }

                    if (cardValue < AIUtil.getPokeValue(cardArray[0])) {
                        if (cardLength == cardArray.length) {
                            cc.log("三顺="+cardArray);
                            return cardArray;
                        } else {
                            var  newArray=[];
                            for(var ii=0;ii<cardLength;ii++){
                                newArray[ii]=0;
                            }
                            for (var k = 0; k < cardLength; k++) {
                                newArray[k] = cardArray[k];
                            }
                            cc.log("三顺="+newArray);
                            return newArray;
                        }
                    }
                }
            }

                break;
            case PokerType.feiji:
                break;
            case PokerType.zhadan:
            {
                temp = analyz.getCard_zhadan();
                size = temp.length;

                var zd=[];
                if (size > 0) {
                    for (var i = 0; i < size; i++) {
                        zd = temp[i];
                        if(zd.length>0){
                            if (cardValue < AIUtil.getPokeValue(zd[0])) {
                                cc.log("炸弹="+cardValue);
                                return zd;
                            }
                        }
                    }
                }
            }

                break;
            case PokerType.huojian:
            {
                var temp=[];
                cc.log("火箭空="+temp);
                return temp;
            }
            case PokerType.sidaier:
                break;
            case PokerType.sidaitwodui:
                break;


        }

        //如果截止到目前还没有合适的牌，那么如果本人有炸弹，那么就提示炸弹

        if (cardType!=PokerType.zhadan && cardType!=PokerType.huojian) {
            temp = analyz.getCard_zhadan();
            size = temp.length;
            if (size > 0) {
                cc.log("炸弹="+temp[0]);
                return temp[0];
            }

        }


    var temp=[];
    return temp;


},
getTiShiPoker:function(card, p,  poker){

    var result=[];
    var pokes=p;
    //判断火箭
    if(poker==52 || poker==53){
        if(pokes[0]==53 && pokes[1]==52){
            result.push(pokes[0]);
            result.push(pokes[1]);
            return result;
        }
    }
    //判断炸弹
    for(var i=0; i!=pokes.length; i++){
        if(this.getPokeValue(pokes[i])==this.getPokeValue(poker)){
            result.push(pokes[i]);
        }
    }
    if(result.length==4){
        return result;
    }else{
        result=[];
    }
    //判断是否为对牌
    if(card.getPokeType()==PokerType.duipai){
        for(var i=0; i!=pokes.length; i++){
            if(pokes[i]==poker){
                var temp=[];
                if(i+1<pokes.length && this.getPokeValue(poker)==this.getPokeValue(pokes[i+1])){
                    temp.push(poker);
                    temp.push(pokes[i+1]);

                }else if(i>0 && this.getPokeValue(poker)==this.getPokeValue(pokes[i-1])){
                    temp.push(pokes[i-1]);//感觉这个也不会走
                    temp.push(poker);
                }
                return temp;
            }
        }
    }
    //判断是否为三张
    if(card.getPokeType()==PokerType.sanzhang || card.getPokeType()==PokerType.sandaiyi
    || card.getPokeType()==PokerType.sandaier){

        var count=0;
        var temp=[];
        for(var i=0; i!=pokes.length; i++){
            if(this.getPokeValue(pokes[i])==this.getPokeValue(poker)){
                temp.push(pokes[i]);
                count++;
            }
        }
        if(count==3){
            return temp;
        }
    }
    //判断是否为双顺
    if(card.getPokeType()==PokerType.shuangshun){
        var index=0;
        var count=card.pokes.length/2;
        var temp=[];
        for(var i=pokes.length; i>0; i--){
            var ii=i-1;
            if(this.getPokeValue(pokes[ii])==this.getPokeValue(poker)+index && this.getPokeValue(poker)+index<15){


                if(this.getPokeCount(pokes, pokes[ii])>1){
                    temp.push(pokes[ii]);
                    if(ii-1>=0 && pokes.getPokeValue(pokes[ii])==pokesgetPokeValue(pokes[ii-1])){
                        temp.push(pokes[ii-1]);
                        //printf("走一\n");
                    }
                    else{
                        temp.push(pokes[ii+1]);
                        printf("我觉得这个不走\n");//我觉得这个不走,因为是倒叙来找的
                    }
                    index++;
                    if(count<=index){
                        break;
                    }
                }
            }
        }
        if(index==count){
            return temp;
        }
    }
    return result;
},
getDanShunPoker:function(card,  p
    ,  poker0,  poker1){

    var result=[];
    var pokes=p;
    if(poker0>poker1){
        var temp=poker1;
        poker1=poker0;
        poker0=temp;
    }
    if(card==null){ //如果是第一个出牌，根据选择的2个数字，出合适的顺子
        var index=0;
        var havePoker1=false;

        for(var i=pokes.length; i>0; i--){
            if(this.getPokeValue(pokes[i-1])==this.getPokeValue(poker0)+index && this.getPokeValue(poker0)+index<15){
                if(this.getPokeValue(poker0)==this.getPokeValue(pokes[i-1])&&poker0!=pokes[i-1]){
                    continue;//比如33，只是加入一个就可以
                }
                if(this.getPokeValue(poker1)==this.getPokeValue(pokes[i-1])){
                    havePoker1=true;
                    if(poker1!=pokes[i-1]){
                        continue;
                    }
                }
                result.push(pokes[i-1]);
                index++;
            }
        }

        if(index<5 || !havePoker1){
            result=[];
        }
    }

    //如果对方是单顺，如果有合适的只是提示和对方单顺一样的数目的顺子，并不管顺子大小
    else if(card.getPokeType()==PokerType.danshun){
        //对方单顺的牌数
        var count=card.pokes.length;

        var index=0;
        var havePoker1=false;
        if(this.getPokeValue(poker1)-this.getPokeValue(poker0)==1){
            for(var i=pokes.length; i>0; i--){
                if(this.getPokeValue(pokes[i-1])==this.getPokeValue(poker0)+index && this.getPokeValue(poker0)+index<15){
                    if(this.getPokeValue(poker0)==this.getPokeValue(pokes[i-1])&&poker0!=pokes[i-1]){
                        continue;
                    }
                    if(this.getPokeValue(poker1)==this.getPokeValue(pokes[i-1])){
                        havePoker1=true;
                        if(poker1!=pokes[i-1]){
                            continue;
                        }
                    }
                    result.push(pokes[i-1]);
                    index++;
                    if(count<=index){
                        break;
                    }
                }
            }
        }
        if(index!=count || !havePoker1){
            result=[];
        }
    }
    return result;
},

noBigCard:function(card,pokes){
    var v=AIUtil.findBigThanCardSimple2(card, pokes);
    if(v.length==0){
        return true;
    }
    return false;
},

 getPoker:function(card,  begin,  end){
     var result=[];
     return result;
 }

};