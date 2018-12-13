var crypto = require("../utils/crypto");

var tokens = {};
var users = {};

exports.createToken = function(userId,lifeTime){
	var token = users[userId];
	if(token != null){
		this.delToken(token);
	}

	var time = Date.now();
	token = crypto.md5(userId + "!@#$%^&" + time);
	tokens[token] = {
		userId: userId,
		time: time,
		lifeTime: lifeTime
	};
	users[userId] = token;
	//console.log("创建token");
	return token;
};

exports.getToken = function(userId){
	return users[userId];
};

exports.getUserID = function(token){
	return tokens[token].userId;
};
function getNowFormatDate(date) {
    var date =new Date(date);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
} 

exports.isTokenValid = function(token){
	var info = tokens[token];
	if(info == null){
		return false;
	}
	console.log("当前的token时间="+getNowFormatDate(info.time));
	console.log("5000之后的时间="+getNowFormatDate(info.time+info.lifeTime));
	console.log("最新时间="+getNowFormatDate(Date.now()));
	
	if(info.time + info.lifetime < Date.now()){
		console.log("token是否有效="+"无效");
		return false;
	}
	console.log("token是否有效="+"有效");
	return true;
};

exports.delToken = function(token){
	var info = tokens[token];
	if(info != null){
		tokens[token] = null;
		users[info.userId] = null;
	}
};