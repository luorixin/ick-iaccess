(function($){
	var liDoms = "",results=[],rate=0;
	var methods = {
		init: function(options){
			var opts = $.extend({},$.fn.dropdownTree.defaults,options);
			results = opts.results;			
			this.each(function(){
				var self = $(this);
				self.data('results', results);
				
				_render(self,opts);

			})
			return this;
		},
	}

	function _render(elem,opts){
		var translate = $.fn.dropdownTree.langConfig[opts.lang],
		    $baseHtml = $('<div class="dropdown-tree dropdown "></div>'),
		    buttonHtml = '<input name="results" value="" type="hidden" />'+
		    			 '<input class="" type="text" name="search" placeholder="'+translate["search"]+'"/>',
		   	$selectArea = $('<ul class="dropdown-tree-con dropdown-menu" style="max-height: 200px;overflow-y:auto;position:relative;top:0!important;border-top:0!important;display: block!important;z-index:0!important;"></ul>');
		liDoms = "";
		_createItem(elem,opts.data,opts);
		$selectArea.append(liDoms);
		$selectArea.find("ul").each(function(index, element) {
          var ulContent = $(element).html();
          var _rate = $(element).attr("rate");
          var left = 5+_rate*15;
          if(ulContent){
            $(element).prev().after('<i style="position:absolute;cursor:pointer;color:#999;top:9px;left:'+left+'px;" class="fa fa-plus-square expand-button"></i>') ;
          }
        });
		$baseHtml.append(buttonHtml).append($selectArea);
		elem.html($baseHtml);

		_bindEvent(elem,opts);   	
		//编辑回填
		var results = elem.data('results');
		if (results.length>0) {
			for (var i = 0; i < results.length; i++) {
				var id = results[i];
				elem.find("ul[rate=1]").find("li[_id='"+id+"']").find("a:first").trigger("click");
			};
		};
	}

	function _createItem($elem,data,opts){
		if (data && data.length>0) {
			for (var i = 0; i < data.length; i++) {
				var date = "";
				var _rate = rate;//记录原值，以防混淆
				if (data[i].addDate) {
					date = " ("+data[i].addDate+")";
				};
				var pl = 20+15*rate;
				liDoms += '<li style="position:relative;" _id="'+data[i].id+'" title="'+data[i].name+'" ><a href="javascript:;" style="padding-left:'+pl+'px;"><i class="fa fa-square-o" style="font-size:18px;width:15px;color:#5EABE8;margin-right:5px;vertical-align: middle;"></i><span>'+data[i].name+date+'</span></a>';
	            if(data[i]["children"] != null && data[i]["children"].length>0){
	               liDoms += '<ul class="childs" style="display:none" rate="'+rate+'">';
	               rate++;//递归时候才展示间距
	               _createItem($elem,data[i]["children"],opts);
	               liDoms += '</ul>';
	            }
	            liDoms += "</li>";
	            rate=_rate;//恢复原值
			};
		}
		return liDoms;
	}

	function _bindEvent($elem,opts){
        
        $elem.on("input","[name=search]",function(e){

	        var _val = $.trim($(this).val());
	        var targe_li = $(this).next('ul').find('li');
            var result;
            result = targe_li.filter(function(index) {
            	var isFilter = true;
            	if (_val!="" && $(this).attr("title").indexOf(_val) >= 0) {
            		$(this).find("a:first").find("span").addClass("selected").css("background","#F8E71C");
            		var $prev = $(this).parent().prev();
            		while ($prev.hasClass("expand-button")) {
            			if ($prev.hasClass("fa-plus-square")) {
            				$prev.click();
            			};
            			$prev = $prev.parent().parent().prev();
            		};
            	}else{
            		isFilter = false;
            		$(this).find("a:first").find("span").removeClass("selected").css("background","transparent");
            		var $prev = $(this).parent().prev();
            		while ($prev.hasClass("expand-button")) {
            			if ($prev.hasClass("fa-minus-square") && $prev.next().find("span.selected").length==0) {
            				$prev.click();
            			};
            			$prev = $prev.parent().parent().prev();
            		};
            	}
                return isFilter;
            });

            if (result.length == 0) return;


        })
        $elem.on("click",".dropdown-tree .expand-button",function(e){
        	e = e || window.event;
	        var target = e.target || e.srcElement;
	        e.stopPropagation();
	        if (target.nodeName == "I") {
	          if ($(this).hasClass("fa-plus-square")) {
	            $(this).removeClass("fa-plus-square").addClass("fa-minus-square");
	            $(this).next().show();
	          }else{
	            $(this).removeClass("fa-minus-square").addClass("fa-plus-square");
	            $(this).next().hide();
	          }
	        };
        })
        $elem.on("click",".dropdown-tree .dropdown-menu a",function(){
        	_check($(this).find("i"));
        	var className = $(this).find("i").attr("class");
        	_childCheck($(this),className);
        	//上层元素
        	_parentCheck($(this),className);
        	//结果展示
        	var results = $elem.data('results')
        	results = $elem.find("ul[rate=1]").find(".fa-check-square").map(function(){
        		return $(this).parent().parent().attr("_id");
        	}).get();
        	$elem.data('results',results);
        	$elem.find('[name="results"]').attr("value",results.join(","));
        	_call($elem,opts.callback,results);
        })
	}	

	function _parentCheck($elem,className){
		var $parent = $elem.parent().parent();
		var checkedLen = $parent.find(".fa-check-square").length;
		var allLen = $parent.find("li").length;
		if ($parent.hasClass("childs")) {
			if (className.indexOf("fa-square-o")>-1) {
				if (checkedLen>0) {
					$parent.parent().find("a:first").find("i").attr("class","fa fa-minus-square");
				}else{
					$parent.parent().find("a:first").find("i").attr("class","fa fa-square-o");
				}
			}else{
				if (checkedLen!=allLen) {
					$parent.parent().find("a:first").find("i").attr("class","fa fa-minus-square");
				}else{
					$parent.parent().find("a:first").find("i").attr("class","fa fa-check-square");
				}
			}
			_parentCheck($parent.parent().find("a:first"),$parent.parent().find("a:first").find("i").attr("class"))
		};
	}

	function _childCheck($elem,className){
		var $parent = $elem.parent();
		if ($parent.find(".childs").length>0) {
			$parent.find(".childs").find("li").each(function(){
				if (className.indexOf("fa-square-o")>-1) {
					$(this).find("a:first").find("i").attr("class","fa fa-square-o");
				}else{
					$(this).find("a:first").find("i").attr("class","fa fa-check-square");
				}
				_childCheck($(this).find("a:first"),$(this).find("a:first").find("i").attr("class"))
			})
		};
	}

	function _check($elem,checked){
		if (checked=="true") {
			$elem.attr("class","fa fa-check-square");
		}else if(checked=="false"){
			$elem.attr("class","fa fa-square-o");
		}else{
			if ($elem.hasClass('fa-check-square') || $elem.hasClass('fa-minus-square')) {
                $elem.attr("class","fa fa-square-o");
            }else {
                $elem.attr("class","fa fa-check-square");
            }
		}
	}

	function _call(elem,func,param){
		if (func && typeof func == 'function') {
			if (param) {
				func.call(elem,param)
			}else{
				return func.call(elem);
			}
		};
	}

	$.fn.dropdownTree = function(method){
		if (methods[method]) {
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1))
		}else if(typeof method === 'object' || !method){
			methods.init.apply(this,arguments)
		}else{
			$.error('Method ' + method + ' does not exist on iax.dropdownTree.plugin');
		}
	}

	$.fn.dropdownTree.defaults = {
		lang : "en",
		data : "",
		results:[],
		callback : function(results){
			console.log(results)
		}
	}

	$.fn.dropdownTree.langConfig = {
		"en":{
			"default" : 'please select an option',
			"search" : 'Search'
		},
		"zh":{
			"default" : "请选择",
			"search" : '搜索'
		}
	}
})(jQuery)