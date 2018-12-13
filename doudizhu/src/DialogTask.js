/**
 * Created by song on 16/11/29.
 */
var DialogTask= cc.Layer.extend({
    isTouched:false,
    ctor: function () {
        this._super();


        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();


        var bgLayer=new cc.Layer();
        this.addChild(bgLayer);
        cc.eventManager.addListener(
            {event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan:this.ccTouchBegan2}, bgLayer);




        var bg=new cc.Sprite("res/transparent_task_bg.png");
        bg.setPosition(cc.p(size.width-originPoint.x+531, size.height*0.5+40));
        this.addChild(bg, 0, DIALOG_TASK_BG);

        var w=bg.getContentSize().width;
        var h=bg.getContentSize().height;

        /*
        * <key>task0</key>
         <string>%d.对战10局奖励重新发牌道具                %d/10</string>
         <key>task1</key>
         <string>%d.赢取50局奖励看对家牌道具               %d/50</string>
         <key>task2</key>
         <string>%d.对战20局奖励底分倍数翻倍道具        %d/20</string>
         <key>task3</key>
         <string>%d.赢取30局奖励看一张底牌道具            %d/30</string>
         <key>task4</key>
         <string>%d.对战30局奖励看一张底牌道具            %d/30</string>
         <key>task5</key>
         <string>%d.赢取20局奖励底分倍数翻倍道具         %d/20</string>
         <key>task6</key>
         <string>%d.对战50局奖励看对家牌道具                %d/50</string>
         <key>task7</key>
         <string>%d.赢取10局奖励重新发牌道具                %d/10</string>

         * */


        var taskstxt=["..对战10局奖励重新发牌道具                ",".赢取50局奖励看对家牌道具               ",".对战20局奖励底分倍数翻倍道具        ",".赢取30局奖励看一张底牌道具            ",
            ".对战30局奖励看一张底牌道具            ",".赢取20局奖励底分倍数翻倍道具         ",".对战50局奖励看对家牌道具                ",".赢取10局奖励重新发牌道具                "];

        var tasksCountArr=["/10","/50","/20","/30<","/30","/20","/50","/10"]

        var tasks=["task0", "task1", "task2", "task3", "task4", "task5", "task6", "task7"];

        var task=cc.sys.localStorage.getItem(KEY_TASK);
        if(task==null)task=0;


        var task0=task*2;
        var task1=task*2+1;
        //每次2个任务  0 1       2 3       4 5        6 7
        var count=cc.sys.localStorage.getItem(KEY_TASK_TIMES);
        var win=cc.sys.localStorage.getItem(KEY_TASK_WIN);
        var c;

        //对战任务的局数
        if(task0<6){
            if(count<(task0+2)/2   *10){
               c= "1"+taskstxt[task0]+ count+tasksCountArr[task0];

                var text0=new cc.LabelTTF(c, "MarkerFelt", 23);
                text0.setPosition(cc.p(w*0.5, h*0.5+20));
                bg.addChild(text0);

                cout<<"结果是:"<<c;


            }else{

                c= "1"+taskstxt[task0]+ ((task0+2)/2*10)+tasksCountArr[task0];
                var text0=new cc.LabelTTF(c, "MarkerFelt", 23);
                text0.setPosition(cc.p(w*0.5 , h*0.5 +20));
                text0.setColor({r:255,g:0,b:0});
                bg.addChild(text0);
            }
        }else{ //只在任务6的特殊处理
            if(count<50){
                c= "1"+taskstxt[task0]+ count+tasksCountArr[task0];

                var text0=new cc.LabelTTF(c, "MarkerFelt", 23);
                text0.setPosition(cc.p(w*0.5, h*0.5+20));
                bg.addChild(text0);
            }else{
                c= "1"+taskstxt[task0]+ 50+tasksCountArr[task0];

                var text0=new cc.LabelTTF(c, "MarkerFelt", 23);
                text0.setPosition(cc.p(w*0.5, h*0.5+20));
                text0.setColor({r:255,g:0,b:0});
                bg.addChild(text0);
            }
        }



        //胜利局数的任务
        if(task1>1){
            if(win<(11-task1)/2*10-10){


                c= "2"+taskstxt[task1]+ win+tasksCountArr[task1];

                var text1=new cc.LabelTTF(c, "MarkerFelt", 23);
                text1.setPosition(cc.p(w*0.5, h*0.5-20));
                bg.addChild(text1);
            }else{


                c= "2"+taskstxt[task1]+ ((11-task1)/2*10-10)+tasksCountArr[task1];


                var text1=new cc.LabelTTF(c, "MarkerFelt", 23);
                text1.setPosition(cc.p(w*0.5 , h*0.5 -20));
                text1.setColor({r:255,g:0,b:0});
                bg.addChild(text1);
            }
        }else{//针对task1 的特殊处理
            if(win<50){

                c= "2"+taskstxt[task1]+ win+tasksCountArr[task1];

                var text1=new cc.LabelTTF(c, "MarkerFelt", 23);
                text1.setPosition(cc.p(w*0.5 , h*0.5 -20));
                bg.addChild(text1);
            }else{

                c= "2"+taskstxt[task1]+ 50+tasksCountArr[task1];

                var text1=new cc.LabelTTF(c, "MarkerFelt", 23);
                text1.setPosition(cc.p(w*0.5 , h*0.5 -20));
                text1.setColor({r:255,g:0,b:0});
                bg.addChild(text1);
            }
        }
    },
    show: function () {
        var originPoint=cc.director.getVisibleOrigin();
        var size=cc.director.getWinSize();

        var bg=this.getChildByTag(DIALOG_TASK_BG);

        bg.runAction(new cc.MoveTo(0.5, cc.p(size.width-originPoint.x-265-38, size.height*0.5+40)));
    },
    cancel:function(){
       this.removeFromParent();
    },
    onEnter:function(){
        this.parent.pause();
            if("touches" in cc.sys.capabilities)//如果是终端设备
                if( 'touches' in cc.sys.capabilities ) {
                    cc.eventManager.addListener({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: true,
                        onTouchBegan: this.ccTouchBegan.bind(this),
                        onTouchMoved: this.ccTouchMoved.bind(this),
                        onTouchEnded: this.ccTouchEnded.bind(this)

                    }, this);
                }
            else if("mouse" in cc.sys.capabilities)//如果是网页
                cc.eventManager.addListener
                ({event: cc.EventListener.MOUSE, onMouseDown:this.ccMouseBegan.bind(this),
                        onMouseUp:this.ccMouseEnded.bind(this),onMouseMove:this.ccMouseMoved.bind(this)},
                    this);
        this._super();



    },
    onExit:function(){
        this._super();
    },

    //鼠标事件
    ccMouseBegan:function(event){
        event.stopPropagation();
        this.isTouched=true;
   cc.log("鼠标放下");

    },
    ccMouseMoved:function(event){


    },
    ccMouseEnded:function(event){
        if(this.isTouched){
        cc.log("鼠标抬起");
        var size=cc.director.getWinSize();
        var originPoint=cc.director.getVisibleOrigin();
        var point=event.getLocation();
        var x=size.width-originPoint.x-265-38;
        var y=size.height*0.5+40;
        if(point.x<x-265 || point.x>x+256 || point.y>y+76 || point.y<y-76){
            this.removeFromParent();
        }
        this.isTouched=false;
        }
    },





    ccTouchBegan:function(touch, event){

    return false;
},
ccTouchMoved:function(touch,event){

},
ccTouchEnded:function(touch,event){
    //var size=cc.director.getWinSize();
    //CCPoint originPoint=CCDirector::sharedDirector()->getVisibleOrigin();
    //CCPoint point=touch->getLocation();
    //float x=size.width-originPoint.x-265-38;
    //float y=size.height*0.5f+40;
    //if(point.x<x-265 || point.x>x+256 || point.y>y+76 || point.y<y-76){
    //    removeFromParentAndCleanup(true);
    //}
},
    ccTouchBegan2:function(touch,event){

        event.stopPropagation();
        return false;
    },
});