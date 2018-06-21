function monthRangeSchedule(options){
	var _this = this;
	_this.settings = $.extend({
    }, options || {});
    _this.inputCon = options["input"] || $("body");
    _this.container = _this.inputCon.parent();
    _this.lang_opt = options['lang'] || "en";
    _this.monthArr = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
    _this.boxId = "monthRangeSchedule_"+new Date().getTime()
    var year = new Date().getFullYear();
    var month = new Date().getMonth()+1;
    var initTime = _this.monthArr[month-2]+" "+year+" - "+_this.monthArr[month-1]+" "+year;
    _this.initTime = _this.timeToAry(options['initTime'] || initTime);
    _this.renderHtml();
    _this.bindEvent();
};
monthRangeSchedule.prototype.isNumber = function(n){
	var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(n));
}
monthRangeSchedule.prototype.bindEvent = function(){
	var _this = this;
	//下拉框选址
	$("#"+_this.boxId).on("click",".dropdown-menu li",function(){
      	var inputNewValue = $(this).find("a").text();
      	var $inputCon = $(this).parents(".monthRangeSchedule-con").parent();
      	var $input = $(this).parents(".dropdown").find("input:first");
      	var $button = $(this).parents(".dropdown").find(".btn");
      	var inputOldValue = $input.attr("title");
      	$input.val(inputNewValue);
      	var timeArr = $inputCon.parent().find("input").map(function(){
			return $(this).val();
		}).get();
		var isVerify = _this.verifyInput(timeArr);
		if (!isVerify) {
			$input.val(inputOldValue);
		}else{
			$input.attr("title",inputNewValue);
			$button.html(inputNewValue+'<span class="caret arrow-down"></span>');
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
    _this.inputCon.addClass('monthRangeScheduleInput').click(function(){
	    $("#"+_this.boxId).toggle();
	});
    $("#"+_this.boxId).on("click",".btn-cancel",function(){
    	$("#"+_this.boxId).hide();
    })
    $("#"+_this.boxId).on("click",".btn-success",function(){
    	var timeArr = $("#"+_this.boxId).find("input").map(function(){
			return $(this).val();
		}).get();
		var isVerify = _this.verifyInput(timeArr);
		if (!isVerify) {
			return;
		};
		_this.inputCon.val(timeArr[0]+" "+timeArr[1]+" - "+timeArr[2]+" "+timeArr[3]);
    	$("#"+_this.boxId).hide();
    })
};
monthRangeSchedule.prototype.showTimeRange = function(){
	var _this = this;
	$("#"+_this.boxId).show();
}
monthRangeSchedule.prototype.verifyInput = function(timeArr){
	var _this = this;
	var timeBegin = timeArr[1]+_this.monthArr.indexOf(timeArr[0]);
	var timeEnd = timeArr[3]+_this.monthArr.indexOf(timeArr[2]);
	var isVerify = true;
	if (parseInt(timeBegin)>parseInt(timeEnd)) {
		isVerify = false;
	};
	return isVerify;
}
monthRangeSchedule.prototype.renderHtml = function() {
	var _this = this;
	var translate = _this.lang[_this.lang_opt];
	var beginhtml = [],endhtml=[];
	for (var i = 0; i < _this.monthArr.length; i++) {
		var t = _this.monthArr[i];
		var _html = '<li><a href="javascript:;">'+t+'</a></li>';
		beginhtml.push(_html);
	}
	var nowYear = new Date().getFullYear();
	for (var i = 0; i < 20; i++) {
		var t = nowYear-i;
		var _html = '<li><a href="javascript:;">'+t+'</a></li>';
		endhtml.push(_html);
	};
	var html = '<div class="monthRangeSchedule" id="'+_this.boxId+'">'+
	           '		<div class="monthRangeSchedule-begin">'+
	           '			<label>'+translate['from']+'</label>'+
	           '			<div class="monthRangeSchedule-con">'+
	           '    			<div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="hidden" title="'+_this.initTime[0]+'" value="'+_this.initTime[0]+'" name="schedule-begin">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" style="width:72px;" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           						_this.initTime[0]+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           beginhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '             <span class="timeSplit">  </span>'+
	           '             <div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="hidden" title="'+_this.initTime[1]+'" value="'+_this.initTime[1]+'" name="schedule-end">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" style="width:72px;" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           						_this.initTime[1]+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           endhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '         </div>'+
	           '		</div>'+
	           '		<div class="monthRangeSchedule-end">'+
	           '			<label>'+translate['to']+'</label>'+
	           '			<div class="monthRangeSchedule-con">'+
	           '    			<div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="hidden" title="'+_this.initTime[2]+'" value="'+_this.initTime[2]+'" name="schedule-begin">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" style="width:72px;" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           						_this.initTime[2]+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           beginhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '             <span class="timeSplit">  </span>'+
	           '             <div class="dropdown ">'+
	           '               <div class="enter-select-enter">'+
	           '                 <div>'+
	           '                   <input type="hidden" title="'+_this.initTime[3]+'" value="'+_this.initTime[3]+'" name="schedule-begin">'+
	           '                 </div>'+
	           '               </div>'+
	           '               <button class="btn  dropdown-toggle" style="width:72px;" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">'+
	           						_this.initTime[3]+
	           '                 <span class="caret arrow-down"></span>'+
	           '               </button>'+
	           '               <ul class="dropdown-menu doself" aria-labelledby="dropdownMenu1">'+
	           endhtml.join("")+
	           '               </ul>'+
	           '             </div>'+
	           '         </div>'+
	           '		</div>'+
	           '		<div class="monthRangeSchedule-show form-horizontal">'+
	           '			<div class="checkbox checkbox-primary checkbox-switch">'+
               '                <input type="checkbox" name="monthlyShow" data-target="" id="monthlyShow" value="0" checked="checked">'+
               '                <label for="monthlyShow">'+translate['show']+'</label>'+
               '            </div>'+
	           '		</div>'+
	           '		<div class="monthRangeSchedule-opt">'+
	           '			<button type="button" class="btn btn-cancel" >'+translate['cancel']+'</button>'+
	           '			<button type="button" class="btn btn-success" >'+translate['save']+'</button>'+
	           '		</div>'+
	           '</div>';
    _this.container.append(html);
};
monthRangeSchedule.prototype.timeToAry = function(time){
	var timeArr = [];
  	if(typeof(time)==="string" && time.indexOf("-")>-1){
    	var part = time.split(" - ");
    	for (var i = 0; i < part.length; i++) {
    		var nextPart = part[i].split(" ");
    		for (var j = 0; j < nextPart.length; j++) {
    			timeArr.push(nextPart[j]);
    		};
    	};
  	}
  	return timeArr;
}
monthRangeSchedule.prototype.lang = {
  'zh' : {
      from : '从',
      to : '到',
      cancel : '取消',
      save : '完成',
      show : '按月份展示数据'
  },
  'en' : {
      from : 'from',
      to : 'to',
      cancel : 'Cancel',
      save : 'Done',
      show : 'Show monthly data'
  }
}