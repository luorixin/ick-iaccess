function keywordsLayer (options) {
	var _this = this;
	_this.values=options['values'];
	_this.container=options['container'];
	_this.result=options['result'];
	_this.lang_opt = options["lang"] || "CN";
	_this.selectTexts = options["selectTexts"] || "";
	_this.selectArr=options["selectArr"] ||[];
	_this.callBack = options["callback"];
	_this.parent_layer = new Date().getTime();
	_this.child_layer=new Date().getTime()+999;
	_this.maxKeywords=options["maxKeywords"] || 20;
	_this.html="";
	_this.layer_init();
}
keywordsLayer.prototype.layer_init = function() {
	var _this = this;
	_this.renderHtml();
	// _this.selectArr && _this.setSelected();
};
keywordsLayer.prototype.forTree = function(o){
	var _this = this;
	var lang = "";//_this.lang_opt=="CN"?"":"_en";
	var length =o.length<_this.maxKeywords?o.length:_this.maxKeywords;
	for(var i=0;i<length;i++){
		var url,str = "";
		var id=o[i]["keywords_id"] || "";

		try{
			urlstr = "<li><span id='"+id+"' title='"+ o[i]["name"+lang] +"'>&nbsp;"+ o[i]["name"+lang] +"</span><input type='text' class='keywords_input' style='display:none' value='"+ o[i]["name"+lang] +"' /><label class='delete'><i class='fa fa-remove' /></label></li>";

			_this.html += urlstr;

		}catch(e){}
	}
	//console.log(_this.html);
	return _this.html;
}
keywordsLayer.prototype.functionBind = function(){
	var _this = this;

	$(_this.container).on("keydown",".keywords_search",function(event){
		event = event || window.event;
		if(event.keyCode==13){
			$(this).find(".fa-plus-circle").click();
		}
	});
	$(_this.container).on("paste",".keywords_input",function(event){
		event = event || window.event;
		var input = $(this).val();
		var pastedText = undefined;
        if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
          } else {
            pastedText = event.originalEvent.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
          }
        var texts = pastedText.split(/[\s\t\n]/);
        var limit = _this.maxKeywords- _this.selectArr.length;
        var totalAdd = 0;
        for (var i = 0; i < texts.length; i++) {
        	if (totalAdd<limit) {
        		if(_this.addTextHtml(texts[i])){
        			totalAdd++;
        		}
        	};
        };
        $(this).val("");
		_this.sum();
		return false;
	});
	$(".keywords_search",_this.container).on("click",".fa-plus-circle",function(){
		var $input = $(this).parents().find(".keywords_input");
		var text = $.trim($input.val());
		_this.addTextHtml(text);
		$input.val("");
		_this.sum();

	})
	$(".button_layer",_this.container).on("click","a",function(){
		var $childLayer = $("#"+_this.child_layer,_this.container);
		var label_lang = _this.lang[_this.lang_opt]["pLabel"];
		$childLayer.find("li.choosed").each(function() {
			var text = $(this).children().attr("title");
			if(_this.addTextHtml(text)){
				$(this).remove();
			}
		})


		if ($childLayer.find("li").length==0) {
			$childLayer.append("<li class='noresult'>"+label_lang[3]+"</li>");
		};
		_this.sum();
	});
	$(".parent_layer",_this.container).on("click",".btn",function(){
		var label_lang = _this.lang[_this.lang_opt]["pLabel"];
		if ( _this.selectArr.length>0) {
			//这部分需要自己从服务器请求获取数据，以下只是个例子
			var example = ["这","是","一个","例子"];
			$("#"+_this.child_layer,_this.container).html("<li style='text-align:center;padding-top:100px;margin:0;box-sizing:border-box;'>"+label_lang[7]+"</li>");
			setTimeout(function(){
				$("#"+_this.child_layer,_this.container).empty();
				for (var i = 0; i < example.length; i++) {
					var liDom = $('<li><span title="'+example[i]+'">&nbsp;'+example[i]+'</span></li>');
					$("#"+_this.child_layer,_this.container).append(liDom);
				};

			},2000);
		}else{
			$(".keywords_search",_this.container).find(".keywords_input").focus();
		}
	});
	$("#"+_this.parent_layer,_this.container).on("click","span",function(){
		$(this).hide();
		$(this).next().show();
		$(this).next().val($(this).attr("title"));
		$(this).next().focus();
	});
	$("#"+_this.parent_layer,_this.container).on("blur","input",function(){
		var lastValue = $(this).val();
		var prevValue = $(this).prev().attr("title");
		console.log($.inArray(lastValue, _this.selectArr));
		if(lastValue.replace(/[\s\t\n]/,"")=="" || $.inArray(lastValue, _this.selectArr)!=-1 ){
			lastValue = prevValue;
		}

		$(this).prev().attr("title",lastValue);
		$(this).prev().html("&nbsp;"+lastValue);
		$(this).hide();
		$(this).prev().show();
		_this.sum();
	});
	$(".child_layer",_this.container).on("click","li",function(){
		$(this).toggleClass("choosed");
	});
	$(_this.container).on("click",".delete",function(){
		$(this).parent().remove();
		_this.sum();
	});


	$(_this.container).on("click",".clearAll",function(){
		_this.clearAll();
	});
}
keywordsLayer.prototype.addTextHtml = function(text){
	var _this = this;
	var liDom = $('<li><span title="'+text+'">&nbsp;'+text+'</span><input type="text" class="keywords_input" style="display:none" value="'+text+'" /><label class="delete"><i class="fa fa-remove" /></label></li>');
	if (text && $.inArray(text, _this.selectArr)==-1 && _this.selectArr.length<_this.maxKeywords) {
		$("#"+_this.parent_layer,_this.container).append(liDom);
		return true;
	}
	return false;
}

keywordsLayer.prototype.renderHtml = function(){
	var _this = this;
	var label_lang = _this.lang[_this.lang_opt]["pLabel"];
	var $parentHtml = $("<div class='parent_layer'><ul class='pannel'><span>"+label_lang[0]+" (<b style='color:red'>0/"+_this.maxKeywords+"</b>) </span><span class='clearAll'><a href='javascript:;' style='color:#333;'>"+label_lang[5]+"</a></span></ul><div class='keywords_search'><input type='text' class='keywords_input' placeholder='"+label_lang[4]+"'><i class='fa fa-plus-circle' aria-hidden='true'></i></div><ul id='"+_this.parent_layer+"' class='tree'></ul><div class='keywords_sub'><button type='button' class='btn btn-success' disabled ><i class='fa fa-lightbulb-o' style='color: #fff;left:10px;'></i>"+label_lang[6]+"</button></div></div>");
	var $childHtml = $("<div class='child_layer'><ul class='pannel'><span>"+label_lang[1]+"</span></ul><ul id='"+_this.child_layer+"' class='tree'><li class='noresult'>"+label_lang[3]+"</li></ul></div>");
	var $button = $('<div class="button_layer"><label ><a href="javascript:;"><i class="fa fa-angle-left"></i></a></label></div>');
	$('<div id="keywords_layer" class="clearfloat"></div>').append($parentHtml).append($button).append($childHtml).appendTo(_this.container);
	var str= _this.forTree(_this.values);
	$("#"+_this.parent_layer,_this.container).append(str);
	_this.functionBind();
	_this.sum();
}

keywordsLayer.prototype.sum = function(){
	var _this = this,length=0;
	_this.selectArr=[];
	var $span = $(_this.container).find("#"+_this.parent_layer).find("span");
	$span.each(function(){
		length++;
		_this.selectArr.push($(this).attr("title"));

	})
	_this.selectTexts = _this.selectArr.join(",");
	$(_this.result).val(_this.selectTexts);
	$(_this.container).find("b").text(length+"/"+_this.maxKeywords);
	var isDisable = length>0 ? false:true;
	$(".btn-success",_this.container).attr("disabled",isDisable);
	// console.log(_this.selectTexts);
	//回调
	_this.callBack && typeof(_this.callBack)==="function" && _this.callBack(_this.selectTexts);
}
keywordsLayer.prototype.setSelected = function(){
	var _this = this;
	for (var i = 0; i < _this.selectArr.length; i++) {
		_this.addTextHtml(_this.selectArr[i]);
	};
	_this.sum();
}
keywordsLayer.prototype.clearAll = function(){
	var _this = this;
	$("#"+_this.parent_layer,_this.container).empty();
	_this.sum();
}
keywordsLayer.prototype.lang = {
	'CN' : {
			pLabel : ["关键词","建议", "联想关键词","没有结果","请输入关键词","清空","获取建议","加载中。。。"]
		},
	'EN' : {
		pLabel : ["keywords","Suggested keywords", "Suggest Keywords","No result(s)","Please enter keywords","Remove All","Get suggestions","Loading..."]

	}
}
