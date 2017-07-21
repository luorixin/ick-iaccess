function timeRangeSchedule(options){
	var _this = this;
	_this.settings = $.extend({
    }, options || {});
    _this.inputCon = options["input"] || $("body");
    _this.container = _this.inputCon.parent();
    _this.lang_opt = options['lang'] || "en";
    _this.boxId = "timeRangeSchedule_"+new Date().getTime()
    _this.initTime = _this.timeToAry(options['initTime'] || "00:00 - 23:59");
    _this.renderHtml();
    _this.bindEvent();
};
timeRangeSchedule.prototype.isNumber = function(n){
	var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(n));
}
timeRangeSchedule.prototype.bindEvent = function(){
	var _this = this;
	$("#"+_this.boxId).on("keyup",".timeRangeSchedule-con input",function(e){
		//上下左右键delete跳过
		if ((e.keyCode < 40 && e.keyCode > 36)) {
        	return;
        }
        if (e.keyCode==8) return;
		//获取所属input框位置
		var inputName = $(this).attr("name");
		var inputOldValue = $(this).attr("title");
		var inputNewValue = $(this).val().replace(/[^0-9]/g, '');
		
		if (inputNewValue=="") {
			inputNewValue=inputOldValue;
		};
		
		$(this).val(inputNewValue);
		
	})
	$("#"+_this.boxId).on("blur",".timeRangeSchedule-con input",function(e){
		var $inputCon = $(this).parents(".timeRangeSchedule-con").parent();
		var inputOldValue = $(this).attr("title");
		var inputNewValue = $(this).val();
		if (inputNewValue.length==0) {
			inputNewValue = "00";
		};
		if (inputNewValue.length<2) {
			inputNewValue = "0"+inputNewValue;
		};
		$(this).val(inputNewValue);
		var timeArr = $inputCon.parent().find("input").map(function(){
			return $(this).attr("value");
		}).get();
		var isVerify = _this.verifyInput(timeArr);
		if (!isVerify) {
			$(this).val(inputOldValue);
		}else{
			$(this).attr("title",inputNewValue);
		}
	})
	//下拉框选址
	$("#"+_this.boxId).on("click",".dropdown-menu li",function(){
      	var inputNewValue = $(this).find("a").text();
      	var $inputCon = $(this).parents(".timeRangeSchedule-con").parent();
      	var $input = $(this).parents(".dropdown").find("input:first");
      	var inputOldValue = $input.attr("title");
      	$input.val(inputNewValue);
      	var timeArr = $inputCon.parent().find("input").map(function(){
			return $(this).attr("value");
		}).get();
		var isVerify = _this.verifyInput(timeArr);
		if (!isVerify) {
			$input.val(inputOldValue);
		}else{
			$input.attr("title",inputNewValue);
		}
    })
    //选择容器显示隐藏赋值
    _this.container.hover(function(){
      $("body").unbind("mousedown");
    },function(){
      $("body").bind("mousedown",function(){
        $("#"+_this.boxId).hide();
      })
    })

    _this.inputCon.attr("readonly",true);
    _this.inputCon.addClass('timeRangeScheduleInput').click(function(){
	    $("#"+_this.boxId).toggle();
	});
    $("#"+_this.boxId).on("click",".btn-cancel",function(){
    	$("#"+_this.boxId).hide();
    })
    $("#"+_this.boxId).on("click",".btn-success",function(){
    	var timeArr = $("#"+_this.boxId).find("input").map(function(){
			return $(this).attr("value");
		}).get();
		var isVerify = _this.verifyInput(timeArr);
		if (!isVerify) {
			return;
		};
		_this.inputCon.val(timeArr[0]+":"+timeArr[1]+" - "+timeArr[2]+":"+timeArr[3]);
    	$("#"+_this.boxId).hide();
    })
};
timeRangeSchedule.prototype.showTimeRange = function(){
	var _this = this;
	$("#"+_this.boxId).show();
}
timeRangeSchedule.prototype.verifyInput = function(timeArr){
	var _this = this;
	var timeBegin = timeArr[0]+timeArr[1];
	var timeEnd = timeArr[2]+timeArr[3];
	var isVerify = true;
	if (parseInt(timeArr[0])>23 || parseInt(timeArr[2])>23 || parseInt(timeArr[1])>59 || parseInt(timeArr[3])>59) {
		isVerify = false;
	};
	if (parseInt(timeBegin)>parseInt(timeEnd)) {
		isVerify = false;
	};
	return isVerify;
}
timeRangeSchedule.prototype.renderHtml = function() {
	var _this = this;
	var translate = _this.lang[_this.lang_opt];
	var beginhtml = [],endhtml=[];
	for (var i = 0; i < 60; i++) {
		var t = i;
		if(i<10) t="0"+i;
		var _html = '<li><a href="javascript:;">'+t+'</a></li>';
		if (i<24) {
			beginhtml.push(_html);
		};
		endhtml.push(_html);
	}
	var html = '<div class="timeRangeSchedule" id="'+_this.boxId+'">'+
	           '		<div class="timeRangeSchedule-begin">'+
	           '			<label>'+translate['from']+'</label>'+
	           '			<div class="timeRangeSchedule-con">'+
	           '    			<div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="text" maxlength="2" title="'+_this.initTime[0]+'" value="'+_this.initTime[0]+'" name="schedule-begin">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           beginhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '             <span class="timeSplit"> : </span>'+
	           '             <div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="text" maxlength="2" title="'+_this.initTime[1]+'" value="'+_this.initTime[1]+'" name="schedule-end">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           endhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '         </div>'+
	           '		</div>'+
	           '		<div class="timeRangeSchedule-end">'+
	           '			<label>'+translate['to']+'</label>'+
	           '			<div class="timeRangeSchedule-con">'+
	           '    			<div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="text" maxlength="2" title="'+_this.initTime[2]+'" value="'+_this.initTime[2]+'" name="schedule-begin">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           beginhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '             <span class="timeSplit"> : </span>'+
	           '             <div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="text" maxlength="2" title="'+_this.initTime[3]+'" value="'+_this.initTime[3]+'" name="schedule-begin">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           endhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '         </div>'+
	           '		</div>'+
	           '		<div class="timeRangeSchedule-opt">'+
	           '			<button type="button" class="btn btn-cancel" >'+translate['cancel']+'</button>'+
	           '			<button type="button" class="btn btn-success" >'+translate['save']+'</button>'+
	           '		</div>'+
	           '</div>';
    _this.container.append(html);
};
timeRangeSchedule.prototype.timeToAry = function(time){
	var timeArr = [];
  	if(typeof(time)==="string" && time.indexOf("-")>-1){
    	var part = time.split(" - ");
    	for (var i = 0; i < part.length; i++) {
    		var nextPart = part[i].split(":");
    		for (var j = 0; j < nextPart.length; j++) {
    			timeArr.push(nextPart[j]);
    		};
    	};
  	}
  	return timeArr;
}
timeRangeSchedule.prototype.lang = {
  'zh' : {
      from : '从',
      to : '到',
      cancel : '取消',
      save : '完成',
  },
  'en' : {
      from : 'from',
      to : 'to',
      cancel : 'Cancel',
      save : 'Done',
  }
}