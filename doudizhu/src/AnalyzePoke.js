/**
 * Created by song on 16/11/24.
 */

function AnalyzePoke(){
    this.init=function(){

        for (var i = 0; i < 12; i++) {
            this.countPokes[i] = 0;
        }
        this.count2 = 0;
        this.countWang = 0;
        this.card_zhadan=[];
        this.card_sanshun=[];
        this.card_shuangshun=[];
        this.card_sanzhang=[];
        this.card_danshun=[];
        this.card_duipai=[];
        this.card_danpai=[];

    };
   // private:
    this.pokes=[];
        this.countPokes=[];
        this.count2=0;
        this.countWang=0;
    /**炸弹*/
        this.card_zhadan=[];
    /**三顺*/
        this.card_sanshun=[];
    /**双顺*/
        this.card_shuangshun=[];
    /**三张*/
        this.card_sanzhang=[];
    /**单顺*/
        this.card_danshun=[];
    /**对牌*/
        this.card_duipai=[];
    /**单牌*/
        this.card_danpai=[];

    //public:
        this.getCountPokes=function() {
       return this.countPokes;
 };

        this.getCount2=function() {
        return this.count2;
};

        this.getCountWang=function() {
        return this.countWang;
};

        this.getCard_zhadan=function() {
        return this.card_zhadan;
};

        this.getCard_sanshun=function() {
        return this.card_sanshun;
};

        this. getCard_shuangshun=function() {
        return this.card_shuangshun;
};

        this.getCard_sanzhang=function() {
        return this.card_sanzhang;
};

        this.getCard_danshun=function() {
        return this.card_danshun;
};

        this.getCard_duipai=function(){
        return  this.card_duipai;
};

        this.getCard_danpai=function(){
        return this.card_danpai;
};

        this.getInstance=function() {
         return new AnalyzePoke();
};
        this.getPokes=function(){
        return this.pokes;
};

    this.lastCardTypeEq=function(pokeType){
        if (this.remainCount() > 1) {
            return false;
        }
        switch (pokeType) {
            case PokerType.sanzhang:
                return this.card_sanzhang.length == 1;
            case PokerType.duipai:
                return this.card_duipai.length == 1;
            case PokerType.danpai:
                return this.card_danpai.length == 1;
        }
        return false;
    };
    this.setPokes=function(pokes,type){
        var len= arguments.length;
        if(1 == len)
        {
            this.setPokes1(pokes);
        }
        else{
            this.setPokes2(pokes,  type);
        }
    };

        this.setPokes1=function(p){
            AIUtil.sort(p);
            this.pokes = p;
            this.analyze();
        };
        this.setPokes2=function(p,  type){
            AIUtil.sort(p);
            this.pokes = p;
            this.analyze(type);
    };
     this.remainCount=function(){
         return this.card_zhadan.length + this.card_sanshun.length
             + this.card_shuangshun.length + this.card_sanzhang.length
             + this.card_danshun.length + this.card_duipai.length + this.card_danpai.length;
     };
    this.getMinType=function(last, next, boss){

        var needSmart = -1;
        //如果地主是下家或者地主就是自己
        if (boss == next.id
            || (boss != next.id && boss != last.id)) {

            if (next.pokes.length<= 2) {
                needSmart = next.pokes.length;
            }
        }

        // TODO
        var pokeType = -1;
        var minValue = 55;
        var pokeIdx = 0;
        var size;
        var temp=[];

        temp = this.card_sanshun; //比如数组里面为 555444   999888777
        size = temp.length;

        for (var i = 0; i < size; i++) {
            var p = temp[i];
            if (minValue > p[0]) {
                pokeType = PokerType.sanshun;
                minValue = p[0];  //那么minValue= 5对应的实际值 i 为 0
                pokeIdx = i;
            }
        }

        temp = this.card_shuangshun; //比如554433
        size = temp.length;

        for (var i = 0; i < size; i++) {
           var p= temp[i];
            if (minValue > p[0]) {
                pokeType = PokerType.shuangshun;
                minValue = p[0];
                pokeIdx = i;
            }
        }

        temp = this.card_danshun;
        size = temp.length;

        for (var i = 0; i < size; i++) {
            var p = temp[i];
            if (minValue > p[0]) {
                pokeType = PokerType.danshun;
                minValue = p[0];
                pokeIdx = i;
            }
        }
        temp = this.card_sanzhang;
        size = temp.length;

        for (var i = 0; i < size; i++) {
            var p = temp[i];
            if (minValue > p[0]) {
                pokeType = PokerType.sanzhang;
                minValue = p[0];
                pokeIdx = i;
            }
        }

        if (needSmart == 2) { //needSmart＝2 说明下家就还有2张，并且自己和下家不是一伙的
            if (pokeType != -1) { //如果有上面统计到的牌，三张，单顺，双顺，三顺，那么就出
                //int result[2]={ pokeType, pokeIdx };
                var result=[];
                result.push(pokeType);
                result.push(pokeIdx);
                return result;
            } else {//如果没有统计到有上面的牌
                temp = this.card_duipai; //比如  99   77   66
                size = temp.length;
                var min2 = -1;
                for (var i = 0; i < size; i++) {
                    var p = temp[i];
                    if (min2 <= p[0]) {
                        pokeType = PokerType.duipai;
                        minValue = p[0];
                        min2 = p[0]; //统计出最大的对子，防止下家跑了
                        pokeIdx = i;
                    }
                }
            }

        } else {  /*
         情况1 ：needSmart==1，这个县不用管，后面会处理
         情况2  说明自己不是boss，下家也不是，2人盟友

         */
            temp = this.card_duipai;
            size = temp.length;

            for (var i = 0; i < size; i++) {
                var p = temp[i];
                if (minValue > p[0]) {
                    pokeType = PokerType.duipai;
                    minValue = p[0]; //出最小的牌
                    pokeIdx = i;
                }
            }
        }
        if (needSmart == 1) {  //needSmart＝1 说明下家就还有1张，并且自己和下家不是一伙的
            if (pokeType != -1) { //如果有上面统计到的牌，三张，单顺，双顺，三顺，那么就出
                //int result[2]={ pokeType, pokeIdx };
                var result=[];
                result.push(pokeType);
                result.push(pokeIdx);
                return result;
            } else { //没有统计到，出最大的单牌
                var min1 = -1;
                for (var i = 0; i < size; i++) {
                    var p = temp[i];
                    if (min1 <= p[0]) {
                        pokeType = PokerType.danpai;
                        minValue = p[0];
                        min1 = p[0];
                        pokeIdx = i;
                    }
                }
            }

        } else {
            temp = this.card_danpai;
            size = temp.length;

            for (var i = 0; i < size; i++) {
                var p = temp[i];
                if (minValue > p[0]) {
                    pokeType = PokerType.danpai;
                    minValue = p[0];
                    pokeIdx = i;
                }
            }
        }
        //int result[2]={ pokeType, pokeIdx };
        var result=[];
        result.push(pokeType);
        result.push(pokeIdx);
        return result;
    };
    this.testAnalyze=function(pokes){

    };
    this.analyze=function(type){
        var len= arguments.length;
        if(1 == len)
        {
            this.analyze2(type);
        }
        else{
            this.analyze1();
        }
    };
    /**分析几大主要牌型*/
    this.analyze1=function(){
        this.init();
        //  统计各种类型的单牌有几张
        for (var i = 0; i < this.pokes.length; i++) {
            var v = AIUtil.getPokeValue(this.pokes[i]);
            if (v == 16 || v == 17) {//统计王
                this.countWang++;
            } else if (v == 15) { //统计2
                this.count2++;
            } else {
                this.countPokes[v - 3]++; //其余各种数目的牌,数组大小为12
            }
        };

        // 统计除2之外的炸弹
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 4) { //看看哪个牌有4张，搜集炸弹
                /*card_zhadan.addElement(new int[] { i * 4 + 3, i * 4 + 2,
                 i * 4 + 1, i * 4 });*/
                var temp=[];
                temp.push(i * 4 + 3);
                temp.push(i * 4 + 2);
                temp.push(i * 4 + 1);
                temp.push(i * 4);
                this.card_zhadan.push(temp); //比如有 4张4，那么实际数值为 4,5,6,7 ，加入到card_zhadan
                this.countPokes[i] = -1;//统计完，清空
            }
        }

        // 统计3顺的牌，比如有2组  444333    999888777 都会加到card_sanshun中
        //并且各个数组的顺序为从小到大 ，比如card_sanshun中为 444333   999888777 两组
        var start = -1;
        var end = -1;
        for (var i = 0; i <13; i++) {

            if (i<12 && this.countPokes[i] == 3) {
                if (start == -1) {
                    start = i;
                } else {
                    end = i;
                }
            }
            else {
                if (end != -1 && start != -1) {

                    var ss=[];

                    for (var j = 0; j < this.pokes.length; j++) {
                        var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                        if (v >= start && v <= end) {
                            ss.push(this.pokes[j]);//把符合三顺的牌加到数组
                        }
                    }

                    this.card_sanshun.push(ss);
                    for (var s = start; s <= end; s++) {
                        this.countPokes[s] = -1;
                    }
                    start = end = -1;
                    continue;
                } else {
                    start = end = -1;
                }
            }
        }





        //  统计双顺的数组个数 比如 443322   998877 都加到card_shuangshun
        var sstart = -1;
        var send = -1;
        for (var i = 0; i < 13; i++) {
            if (i<12 && this.countPokes[i] == 2) { //这是真正的双顺，不会统计555444333里面的双顺
                if (sstart == -1) {
                    sstart = i;
                } else {
                    send = i;
                }
            } else {
                if (sstart != -1 && send != -1) {
                    var dur = send - sstart + 1;
                    if (dur < 3) {//双顺必须连续超过3种才行，比如443322可以，3322不行
                        sstart = send = -1;
                        continue;
                    } else {

                        var shuangshun=[];
                        for (var j = 0; j < this.pokes.length; j++) {
                            var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                            if (v >= sstart && v <= send) {

                                shuangshun.push(this.pokes[j]);
                            }
                        }

                        this.card_shuangshun.push(shuangshun);
                        for (var s = sstart; s <= send; s++) {
                            this.countPokes[s] = -1;//把属于双顺的清－1
                        }
                        sstart = send = -1;
                        continue;
                    }
                } else {
                    sstart = send = -1;
                }
            }
        }






        // 单顺牌的统计，加入到card_danshun ，比如87654        11 10 9 8 7 6
        var dstart = -1;
        var dend = -1;
        for (var i = 0; i < 13; i++) {
            if (i<12 && this.countPokes[i] >= 1) {//真正的单顺，不包括6655443322里面的，因为前面双顺的countPokes已经清-1
                if (dstart == -1) {
                    dstart = i;
                } else {
                    dend = i;
                }
            } else {
                if (dstart != -1 && dend != -1) {
                    var dur = dend - dstart + 1;
                    if (dur >= 5) {//单顺必须超过或者等于5张
                        //int m = 0;
                        //int[] danshun = new int[dur];
                       var danshun=[];
                        for (var j = 0; j < this.pokes.length; j++) {
                            var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                            if (v == dend) {//poke是倒叙派的，大的在前面,所以先比较大的

                                danshun.push( this.pokes[j]);
                                this.countPokes[dend]--;//这个类型的牌的数目减去一，剩余的还要判断别的
                                dend--;
                            }
                            if (dend == dstart - 1) {
                                break;
                            }
                        }
                        this.card_danshun.push(danshun);

                    }
                    dstart = dend = -1;
                } else {
                    dstart = dend = -1;
                }
            }
        }

        //  统计3张牌的，比如333    666     ，这里是排除了3顺之后的三张
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 3) {
                this.countPokes[i] = -1;

                var sanzhang=[];
                for (var j = 0; j < this.pokes.length; j++) {
                    var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                    if (v == i) {

                         sanzhang.push(this.pokes[j]);
                    }
                }

                this.card_sanzhang.push(sanzhang);
            }
        }


        //  统计对牌，去除双顺
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 2) {

               var duipai=[];
                for (var j = 0; j < this.pokes.length; j++) {
                    var v = AIUtil.getPokeValue( this.pokes[j]) - 3;
                    if (v == i) {
                        duipai[0] = this.pokes[j];
                        duipai[1] = this.pokes[j + 1];

                        this.card_duipai.push(duipai);
                        break;
                    }
                }
                this.countPokes[i] = -1;
            }
        }
        //统计单牌
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 1) {
                for (var j = 0; j < this.pokes.length; j++) {
                    var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                    if (v == i) {
                        var temp=[];
                        temp.push(this.pokes[j]);
                        this.card_danpai.push(temp);

                        this.countPokes[i] = -1;
                        break;
                    }

                }
            }
        }
        //  把 2 加到合适的位置
        switch (this.count2) {
            case 4:

            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                temp.push(this.pokes[this.countWang+1]);
                temp.push(this.pokes[this.countWang+2]);
                temp.push(this.pokes[this.countWang+3]);
                this.card_zhadan.push(temp);
            }
                break;
            case 3:

            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                temp.push(this.pokes[this.countWang+1]);
                temp.push(this.pokes[this.countWang+2]);
                this.card_sanzhang.push(temp);
            }
                break;
            case 2:
                /*card_duipai.addElement(new int[] { pokes[countWang],
                 pokes[countWang + 1] });*/
            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                temp.push(this.pokes[this.countWang+1]);
                this.card_duipai.push(temp);
            }
                break;
            case 1:

            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                this.card_danpai.push(temp);
            }

                break;
        }

        //  把王放在合适的位置
        if ( this.countWang == 1) {
            //card_danpai.addElement(new int[] { pokes[0] });
            var temp=[];
            temp.push(this.pokes);
            this.card_danpai.push(temp);
        } else if (this.countWang == 2) {
            //card_zhadan.addElement(new int[] { pokes[0], pokes[1] });
            var temp=[];
            temp.push(this.pokes[0]);
            temp.push(this.pokes[1]);
            this.card_zhadan.push(temp);
        }
    };
    /**根据扑克类型分析牌型*/
    this.analyze2=function(type){
        this.init();
        // //  统计各种类型的单牌有几张
        for (var i = 0; i < this.pokes.length; i++) {
            var v = AIUtil.getPokeValue(this.pokes[i]);
            if (v == 16 || v == 17) {//统计王
                this.countWang++;
            } else if (v == 15) { //统计2
                this.count2++;
            } else {
                this.countPokes[v - 3]++; //其余各种数目的牌,数组大小为12
            }
        };


        // 统计除2之外的炸弹
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 4) { //看看哪个牌有4张，搜集炸弹
                /*card_zhadan.addElement(new int[] { i * 4 + 3, i * 4 + 2,
                 i * 4 + 1, i * 4 });*/
                var temp=[];
                temp.push(i * 4 + 3);
                temp.push(i * 4 + 2);
                temp.push(i * 4 + 1);
                temp.push(i * 4);
                this.card_zhadan.push(temp); //比如有 4张4，那么实际数值为 4,5,6,7 ，加入到card_zhadan
                this.countPokes[i] = -1;//统计完，清空
            }
        }

        //统计三顺数组 ，组与组之间 是由小到大 ,比如 444333   999888
        if(type==PokerType.sanshun){

            var start = -1;
            var end = -1;
            for (var i = 0; i <13; i++) {

                if (i<12 && this.countPokes[i] == 3) {
                    if (start == -1) {
                        start = i;
                    } else {
                        end = i;
                    }
                }
                else {
                    if (end != -1 && start != -1) {

                        var ss=[];

                        for (var j = 0; j < this.pokes.length; j++) {
                            var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                            if (v >= start && v <= end) {
                                ss.push(this.pokes[j]);//把符合三顺的牌加到数组
                            }
                        }

                        this.card_sanshun.push(ss);
                        for (var s = start; s <= end; s++) {
                            this.countPokes[s] = -1;
                        }
                        start = end = -1;
                        continue;
                    } else {
                        start = end = -1;
                    }
                }
            }

        }
        //统计双顺
        if(type==PokerType.shuangshun){

            var sstart = -1;
            var send = -1;
            for (var i = 0; i < 13; i++) {
                if (i<12 && this.countPokes[i] == 2) { //这是真正的双顺，不会统计555444333里面的双顺
                    if (sstart == -1) {
                        sstart = i;
                    } else {
                        send = i;
                    }
                } else {
                    if (sstart != -1 && send != -1) {
                        var dur = send - sstart + 1;
                        if (dur < 3) {//双顺必须连续超过3种才行，比如443322可以，3322不行
                            sstart = send = -1;
                            continue;
                        } else {

                            var shuangshun=[];
                            for (var j = 0; j < this.pokes.length; j++) {
                                var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                                if (v >= sstart && v <= send) {

                                    shuangshun.push(this.pokes[j]);
                                }
                            }

                            this.card_shuangshun.push(shuangshun);
                            for (var s = sstart; s <= send; s++) {
                                this.countPokes[s] = -1;//把属于双顺的清－1
                            }
                            sstart = send = -1;
                            continue;
                        }
                    } else {
                        sstart = send = -1;
                    }
                }
            }

        }
        // 统计单顺
        if(type==PokerType.danshun){
            var dstart = -1;
            var dend = -1;
            for (var i = 0; i < 13; i++) {
                if (i<12 && this.countPokes[i] >= 1) {//真正的单顺，不包括6655443322里面的，因为前面双顺的countPokes已经清-1
                    if (dstart == -1) {
                        dstart = i;
                    } else {
                        dend = i;
                    }
                } else {
                    if (dstart != -1 && dend != -1) {
                        var dur = dend - dstart + 1;
                        if (dur >= 5) {//单顺必须超过或者等于5张
                            //int m = 0;
                            //int[] danshun = new int[dur];
                            var danshun=[];
                            for (var j = 0; j < this.pokes.length; j++) {
                                var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                                if (v == dend) {//poke是倒叙派的，大的在前面,所以先比较大的

                                    danshun.push( this.pokes[j]);
                                    this.countPokes[dend]--;//这个类型的牌的数目减去一，剩余的还要判断别的
                                    dend--;
                                }
                                if (dend == dstart - 1) {
                                    break;
                                }
                            }
                            this.card_danshun.push(danshun);

                        }
                        dstart = dend = -1;
                    } else {
                        dstart = dend = -1;
                    }
                }
            }

        }
        //  统计3张牌的，比如333    666     ，这里是排除了3顺之后的三张
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 3) {
                this.countPokes[i] = -1;

                var sanzhang=[];
                for (var j = 0; j < this.pokes.length; j++) {
                    var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                    if (v == i) {

                        sanzhang.push(this.pokes[j]);
                    }
                }

                this.card_sanzhang.push(sanzhang);
            }
        }

        //  统计对牌，去除双顺
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 2) {

                var duipai=[];
                for (var j = 0; j < this.pokes.length; j++) {
                    var v = AIUtil.getPokeValue( this.pokes[j]) - 3;
                    if (v == i) {
                        duipai[0] = this.pokes[j];
                        duipai[1] = this.pokes[j + 1];

                        this.card_duipai.push(duipai);
                        break;
                    }
                }
                this.countPokes[i] = -1;
            }
        }

        //统计单牌
        for (var i = 0; i < 12; i++) {
            if (this.countPokes[i] == 1) {
                for (var j = 0; j < this.pokes.length; j++) {
                    var v = AIUtil.getPokeValue(this.pokes[j]) - 3;
                    if (v == i) {
                        var temp=[];
                        temp.push(this.pokes[j]);
                        this.card_danpai.push(temp);

                        this.countPokes[i] = -1;
                        break;
                    }

                }
            }
        }

        //  把 2 加到合适的位置
        switch (this.count2) {
            case 4:

            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                temp.push(this.pokes[this.countWang+1]);
                temp.push(this.pokes[this.countWang+2]);
                temp.push(this.pokes[this.countWang+3]);
                this.card_zhadan.push(temp);
            }
                break;
            case 3:

            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                temp.push(this.pokes[this.countWang+1]);
                temp.push(this.pokes[this.countWang+2]);
                this.card_sanzhang.push(temp);
            }
                break;
            case 2:
                /*card_duipai.addElement(new int[] { pokes[countWang],
                 pokes[countWang + 1] });*/
            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                temp.push(this.pokes[this.countWang+1]);
                this.card_duipai.push(temp);
            }
                break;
            case 1:

            {
                var temp=[];
                temp.push(this.pokes[this.countWang]);
                this.card_danpai.push(temp);
            }

                break;
        }


        //  把王放在合适的位置
        if ( this.countWang == 1) {
            //card_danpai.addElement(new int[] { pokes[0] });
            var temp=[];
            temp.push(this.pokes);
            this.card_danpai.push(temp);
        } else if (this.countWang == 2) {
            //card_zhadan.addElement(new int[] { pokes[0], pokes[1] });
            var temp=[];
            temp.push(this.pokes[0]);
            temp.push(this.pokes[1]);
            this.card_zhadan.push(temp);
        }
    };
};


