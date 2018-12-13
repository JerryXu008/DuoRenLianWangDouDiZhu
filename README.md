# DuoRenLianWangDouDiZhu
斗地主
ps：此套源码是根据网上cocos开源的棋牌麻将进行改写，服务端架构大体类似，只是把麻将玩法改成了斗地主，客户端没有采用cocos creator，
而是采用传统的cocos2d-js编写。
客户端为:doudizhu文件夹,采用cocosjs 编写，用webstrom等工具打开可直接运行
服务端：server文件夹，采用nodejs。

配置：
客户端：进入HTTP.js页面，把var URL="XXX"改为自己的地址，如本机地址192.168.xx.xx
服务端：
   数据库
   1 安装 MySQL 5.1以上
   2 找到server文件夹下的一个sql文件夹，里面有一个sql文件，可以用可视化工具比如WorkBench等执行一下这个文件，创建数据库和表。
 
   编辑器：
   1 安装NodeJS，步骤略
   2 安装完毕之后，用Node打开server项目，这里假设拿mac来配置环境，进入configs.js（如果是windows，进入configs_win.js）,
   修改 HALL_IP为自己的地址
   修改 exports.mysql 中的配置改为自己的配置
   
   运行：
   修改完前面的配置后，开始启动服务，这里有3个服务，账户服务器，大厅服务器，游戏服务器，用node命令行启动
   cd server
   node ./account_server/app.js ../configs.js 
   node ./hall_server/app.js ../configs.js 
   node ./game_server/app.js ../configs.js 
   
   启动成功后，用webstorm运行客户端项目，如果成功，就会出现如下界面:
  ![图片说明1](https://github.com/JerryXu008/DuoRenLianWangDouDiZhu/blob/master/pic/1.png)
  ![图片说明2](https://github.com/JerryXu008/DuoRenLianWangDouDiZhu/blob/master/pic/2.png)
  ![图片说明3](https://github.com/JerryXu008/DuoRenLianWangDouDiZhu/blob/master/pic/3.png)
