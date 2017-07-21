var IAX_TOOL = IAX_TOOL || {};
IAX_TOOL=
{
  //登录框
  /*{
    'title':'Sign-in Required',
    'subTitle':'Please sign in to confirm the app purchase.',
    'action':'',
    'ipPrice':'$15,000.00',
    'accountBalance':'$15,000.00',
    'fn':'toRegister()'
  }*/
  loginForm: function(paramsJson){
    if(!paramsJson) return false;
		if ($('.sign-in-box').length)
		{
			$('.sign-in-box').modal('hide');
			$('.sign-in-box').remove();
		}

		$('body').append(Hogan.compile(IAX_TEMPLATE.signInBox).render(
			paramsJson
		));

		$(".sign-in-box").modal('show');
  },

	//表单消息
	notification: function(text,type,delay)
	{
		if($('.notification-box').length){
			$('.notification-box').remove();
		}
		delay = delay || 5000;
		type = type || "info";
    var scrollTop = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    var top = 62-scrollTop;
		$('.x-body').append(Hogan.compile(IAX_TEMPLATE.notificationBox).render(
		{
			message: text,
			type:type
		}));

    if(top<0) $("#notifications").css({"position":"fixed","top":"0"});
		if (IAX_TOOL.G.notification_timer) {
	        clearTimeout(IAX_TOOL.G.notification_timer);
	    }
		IAX_TOOL.G.notification_timer = setTimeout(function() {
	        $(".notification-box").fadeOut();
	        $('.notification-box').remove();
	    }, delay);

	},
  //保存计划
  savePlan: function(paramsJson){
    if(!paramsJson) return false;
	if ($('.save-plan-box').length)
	{
		$('.save-plan-box').modal('hide');
		$('.save-plan-box').remove();
	}
	$('body').append(Hogan.compile(IAX_TEMPLATE.savePlan).render(
		paramsJson
	));

	$(".save-plan-box").modal('show');
    var form = $(".save-plan-box").find("form");
    paramsJson.callbackFun && typeof(paramsJson.callbackFun)==='function' && paramsJson.callbackFun(form,paramsJson);
  },
  //获取audience历史记录
  getAudienceHistory: function(paramsJson){
  	if (!paramsJson) {return false};
  	if ($(".audience-history-box").length) {
  		$(".audience-history-box").modal("hide");
  		$(".audience-history-box").remove();
  	};
  	$("body").append(Hogan.compile(IAX_TEMPLATE.getAudienceHistory).render(
  		paramsJson
  	));
  	$(".audience-history-box").modal('show');
    var form = $(".audience-history-box").find("form");
    paramsJson.callbackFun && typeof(paramsJson.callbackFun)==='function' && paramsJson.callbackFun(form,paramsJson);
  },
  //删除确认框
  confirmBox : function(paramsJson){
  	if (!paramsJson) {return false};
  	if ($(".del-confirm-box").length) {
  		$(".del-confirm-box").modal("hide");
  		$(".del-confirm-box").remove();
  	};
  	$("body").append(Hogan.compile(IAX_TEMPLATE.confirmBox).render(
  		paramsJson
  	));
  	$(".del-confirm-box").modal('show');
    var form = $(".del-confirm-box").find("form");
    paramsJson.callbackFun && typeof(paramsJson.callbackFun)==='function' && paramsJson.callbackFun(form,paramsJson);	
  },
	//数字格式化
	formatNum:function(str,len){
		var newStr = "";
		var count = 0;
		this.isNumber(len) || (len=2);
		var zero = "";
		for(var j =0 ;j<len;j++){
			zero += "0";
		}
		if(str.indexOf(".")==-1){
		   for(var i=str.length-1;i>=0;i--){
			 if(count % 3 == 0 && count != 0){
			   newStr = str.charAt(i) + "," + newStr;
			 }else{
			   newStr = str.charAt(i) + newStr;
			 }
			 count++;
		   }
       if(len==0){
         str = newStr;
       }else{
         str = newStr + "."+zero; //自动补小数点后len位
       }

		}
		else
		{
		   for(var i = str.indexOf(".")-1;i>=0;i--){
			 if(count % 3 == 0 && count != 0){
			   newStr = str.charAt(i) + "," + newStr;
			 }else{
			   newStr = str.charAt(i) + newStr; //逐个字符相接起来
			 }
			 count++;
		   }
		   str = newStr + (str + zero).substr((str + zero).indexOf("."),len+1);
		 }
		return str;
	},
  isNumber:function(n) {
  	var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(n));
  },
  getLength: function(str){
		var len = 0;
	    for (var i=0; i<str.length; i++) { 
	     var c = str.charCodeAt(i); 
	    //单字节加1 
	     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
	       len++; 
	     } 
	     else { 
	      len+=2; 
	     } 
	    } 
	    return len;
	},
	outRepeat: function(a){
	  var hash=[],arr=[];
	  for (var i = 0,elem;(elem=a[i])!=null; i++) {
	    if(!hash[elem]){
	      arr.push(elem);
	      hash[elem]=true;
	    }
	  }
	  return arr;
	},
}
//全局变量
IAX_TOOL.G={
		notification_timer:''
}
