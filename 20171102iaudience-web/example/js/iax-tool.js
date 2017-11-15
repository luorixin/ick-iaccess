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
  	
  	//转换数据 begin
	var column = new Array();
	var dataTh = paramsJson.tableData.tHead;
	var retHead = new Array();
	if(dataTh){
		for(var key in dataTh){
			var obj = new Object();
			obj.name = dataTh[key];
			retHead.push(obj);
			column.push(key);
		}
	}
	paramsJson.tableData.tHead = retHead;
	var dataTb = paramsJson.tableData.tBody;
	var retBody = new Array();
	if(dataTb){
		for(var obj in dataTb){
			if(dataTb[obj]){
				var trArr = new Array();
				var trObj = new Object();
				for(var index in column){
					var tdObj = new Object();
					var key = column[index];
					var keyOmit = key+"Omit";
					if(dataTb[obj][keyOmit]){
						tdObj.name = dataTb[obj][keyOmit];
						tdObj.detail = dataTb[obj][key];
					}else{
						tdObj.name = dataTb[obj][key];
					}
					trArr.push(tdObj);
				}
				trObj.tdValues = trArr;
				retBody.push(trObj);
			}
		}
	}
	paramsJson.tableData.tBody = retBody;
  	//转换数据 end
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
   //分析确认框
  analysisBox : function(paramsJson){
  	if (!paramsJson) {return false};
  	if ($(".analysis-confirm-box").length) {
  		$(".analysis-confirm-box").modal("hide");
  		$(".analysis-confirm-box").remove();
  	};
  	$("body").append(Hogan.compile(IAX_TEMPLATE.analysisBox).render(
  		paramsJson
  	));
  	$(".analysis-confirm-box").modal('show');
  },
  //分析确认进度框
  analysisLoadingBox : function(paramsJson){
    if (!paramsJson) {return false};
    if ($(".analysis-loading-box").length) {
      $(".analysis-loading-box").modal("hide");
      $(".analysis-loading-box").remove();
    };
    $("body").append(Hogan.compile(IAX_TEMPLATE.analysisLoadingBox).render(
      paramsJson
    ));
    $(".analysis-loading-box").modal('show');
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
  //中文算2个，英文算一个
  substrByLength:function(str,maxLen){
    if (!str) return "";
    if (!Number(maxLen)) maxLen = 0;
    var strLen = this.getLength(str);
    var newStr = str;
    if (strLen > Number(maxLen)) {
      newStr = "";
      var len=0;
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i); 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
          len++; 
        } 
        else { 
         len+=2; 
        }
        if (len<=Number(maxLen)) {
          newStr += str[i];
        }; 
      };
      newStr +="...";
    };
    return newStr
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
    format_to_numeric: function(str){
        str = this.format_to_machine_number(str);
        if(/^-?\d+(?:\.\d+)?/.test(str)){
            digitalGroup = /(\d)((\d{3}?)+)$/;
            var zhengshu = Math.floor(parseFloat(str)) + '';
            var xiaoshu = Math.floor(parseFloat(str) * 100 % 100) + '';
            while (digitalGroup.test(zhengshu)) {
                zhengshu = zhengshu.replace(digitalGroup, '$1' + "," + '$2');
            };
            if(parseInt(xiaoshu) < 10){
                xiaoshu = '0' + xiaoshu
            };
            str = zhengshu + "." + xiaoshu;

            while (digitalGroup.test(str)) {
                str = str.replace(digitalGroup, '$1' + "," + '$2');
            };
            if(/\.\d$/.test(str)){
                str += '0';
            }else if(/^[^\.]+$/.test(str)){
                str += '.00';
            }
        }
        return str;
    },
    format_to_machine_number: function(str){
        str += '';
        str = str.replace(/[^\d\.\,\-]/g,"");
        if(/^-?(?:\d+|\d{1,3}(?:,\d{3})*)(?:\.\d+)?/.test(str)){
            str = str.replace(/,/g,"").replace(/^0+/g,"0").replace(/^0(\d)/g, "$1");
            str = Math.round( parseFloat(str) * 100 )/ 100 + "";
            return str;
        }else{
            return str
        }
    }
}
//全局变量
IAX_TOOL.G={
		notification_timer:''
}
