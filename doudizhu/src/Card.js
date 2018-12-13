function Card(){
    this.personID=null;
    this.pokes=[];

    this.setPokes=function( p){
        this.pokes=p;
    }
    this.setPersonID=function(id){
        this.personID=id;
    }
    this.getPokeType=function(){
        return AIUtil.getPokeType(this.pokes);
    }
    this.getValue=function(){
        var pokeType=AIUtil.getPokeType(this.pokes);
        return AIUtil.getPokeTypeValue(this.pokes, pokeType);
    }
    this.paint=function(layer,isMove){//调整打出去的牌的坐标

        if(isMove==null)isMove=false;
        var  originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();


        var w=(size.width-originPoint.x)/21-1.0;
        w*=0.5;
        var count=this.pokes.length;

        for(var i=0; i!=count; i++){

            var x=size.width*0.5+(i-count*0.5)*w+w;
            var  y=originPoint.y+280*0.8;


            if(this.personID==1){
                y=originPoint.y+280;
                y+=100;
                x+=200;
            }else if(this.personID==2){

                y=originPoint.y+280;
                y+=100;
                x-=200;
            }



            var text= "#poke"+this.pokes[i]+".png";
            var tempPoker=new cc.Sprite(text);
            layer.addChild(tempPoker);
            if(this.personID!=0 && isMove){
                if(this.personID==1){
                    tempPoker.setPosition(cc.p(size.width-originPoint.x-120, size.height-originPoint.y-70));
                }else if(this.personID==2){

                    tempPoker.setPosition(cc.p(originPoint.x+120, size.height-originPoint.y-70));
                }
                tempPoker.setScale(0);
                tempPoker.runAction(new cc.Spawn(new cc.ScaleTo(0.3, 0.6, 0.6), new cc.MoveTo.create(0.3, cc.p(x, y))));
            }
            else{ //本人的话，不写动画，直接定位坐标
                tempPoker.setPosition(cc.p(x, y));
                tempPoker.setScale(0.6);



            }
        }

    }

};