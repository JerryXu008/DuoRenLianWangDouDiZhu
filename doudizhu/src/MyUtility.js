/*
 * 对Date的扩展，将 Date 转化为指定格式的String   
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 * (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
 */

Math.GetRandomNum=function (Max,Min)
{
	if(Min==null)Min=0;
	var Range = Max - Min;
	var Rand = Math.random();
	 var result=(Min + Math.round(Rand * Range));
	if(result>=Max){
		result=Max-1;
	}
	return  result;
}

Math.getRandomNum=function (Max,Min)
{
	if(Min==null)Min=0;
	var Range = Max - Min;
	var Rand = Math.random();
	var result=(Min + Math.round(Rand * Range));
	if(result>=Max){
		result=Max-1;
	}
	return  result;
}


Date.prototype.format = function(fmt) {
	var o = {   
			"M+" : this.getMonth()+1,                 //月份   
			"d+" : this.getDate(),                    //日   
			"h+" : this.getHours(),                   //小时   
			"m+" : this.getMinutes(),                 //分   
			"s+" : this.getSeconds(),                 //秒   
			"q+" : Math.floor((this.getMonth()+3)/3), //季度   
			"S"  : this.getMilliseconds()             //毫秒   
	};   
	if(/(y+)/.test(fmt))   
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	for(var k in o)   
		if(new RegExp("("+ k +")").test(fmt))   
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	return fmt;   
}

/*
 * 对Number的扩展，通过Error Code获得Error Message   
 */
Number.prototype.errorMessage = function() { 
	var errorStr = "";
	switch (this.valueOf()) {
	case -7:
		errorStr = "没有数据.";
		break;
	case -6:
		errorStr = "日期没有输入.";
		break;
	case -5:
		errorStr = "内容没有输入.";
		break;
	case -4:
		errorStr = "ID没有输入.";
		break;
	case -3:
		errorStr = "据访问失败.";
		break;
	case -2:
		errorStr = "您的账号最多能插入10条数据.";
		break;            
	case -1:
		errorStr = "用户不存在，请到http://cocoagame.net注册.";
	}
	return errorStr;
}

