(function($){
	var liDoms = "",results=[],searchId="",searchOnIndex=0,maxSelect=0;
	var methods = {
		init: function(options){
			var opts = $.extend({},$.fn.cityChoose.defaults,options);
			results = opts.results;
			maxSelect = opts.max;
			this.each(function(){
				var self = $(this);
				self.data('results', results);
				self.data('searchId', searchId);
				self.data('searchOnIndex', searchOnIndex);
				self.data('maxSelect', maxSelect);
				_render(self,opts);
				_call(self,opts.onInit,opts);
			})
			return this;
		},
		data: function(){
			return $(this).data("results");
		}	
	}
	function _render(elem,opts){
		var translate = $.fn.cityChoose.langConfig[opts.lang],
		    $baseHtml = $('<div class="city-choose"></div>'),
		    filterHtml = '<div class="city-choose-filter">'+
					     ' <ul class="city-choose-tab">'+
					     '   <li class="selected" data-value="tier-layer">'+translate["tab_tiers"]+'</li>'+
					     '   <li data-value="province-layer">'+translate["tab_province"]+'</li>'+
					     ' </ul>'+
					     ' <div class="city-choose-search">'+
					     '   <input type="text" placeholder="'+translate["search"]+'">'+
					     '   <div class="filter-search-ico"><i class="fa fa-search"></i></div>'+
					     '	 <div class="filter-result"><ul></ul></div>'
					     ' </div>'+
					     '</div>',
						     
		    $contentHtml = $('<div class="city-choose-content"></div>'),
		    $tierHtml = $('<div class="content-parent tier-layer"></div>'),
		    $provinceHtml = $('<div class="content-parent province-layer"></div>'),
		    $cityHtml = $('<div class="content-child"></div>'),
		    tierPannel = ' <div class="pannel">'+
					     '    <span>'+translate["tier_layer"]+'</span>'+
					     '    <span style="float:right; margin: 0 5px 0 0!important;">'+
					     '      <i class="fa fa-angle-right"></i>'+
					     '    </span>'+
					     '  </div>',
			provincePannel = ' <div class="pannel">'+
					     '    <span>'+translate["province_layer"]+'</span>'+
					     '    <span style="float:right; margin: 0 5px 0 0!important;">'+
					     '      <i class="fa fa-angle-right"></i>'+
					     '    </span>'+
					     '  </div>',
			cityPannel = ' <div class="pannel">'+
					     '    <span>'+translate["city_layer"]+'</span>'+
					     '  </div><ul class="tree"></ul>',
			$selectedAreaHtml = $('<div class="city-choose-area"><label>'+translate["choose_label"]+'</label><ul><li class="noResult">'+translate["noSelects"]+'</li></ul></div><span class="err-msg"></span>');


		$tierHtml.append(tierPannel);
		$provinceHtml.append(provincePannel);
		$cityHtml.append(cityPannel);

		//判断城市数据有无
		var countryData,contientData,tiersName = translate["tiers_input"],$tiers=$("<ul class='tree'></ul>"),tierJson={};
		var $provinces= $("<ul class='tree'></ul>");
		if (opts.data && opts.data.continent) {
			//补充等级数据
			for (var i = 0; i < tiersName.length; i++) {
				var level = i+1;
				if (level==tiersName.length) level=0;
				tierJson = {
					name : tiersName[i],
					level : level
				};
				$tiers.append('<li title="'+tierJson.name+'" level="'+tierJson.level+'"><a href="javascript:;"><i class="fa fa-square-o"></i><span>'+tierJson.name+'</span></a></li>');
			};
			$tierHtml.append($tiers);
			//补充省份城市数据
			for (var i = 0; i < opts.data.continent.length; i++) {
				if(opts.data.continent[i].name_en_us == opts.continent){
					contientData = opts.data.continent[i];
					for (var j = 0; j < contientData.country.length; j++) {
						if(contientData.country[j].name_en_us == opts.country){
							countryData = contientData.country[j];
						}
					};
				}
			};
			if (countryData) {
				liDoms = "<ul class='tree'>";
				_createItem(countryData.province,opts);
				liDoms+="</ul>";
				$provinceHtml.append(liDoms);
			};
		};
		$contentHtml.append($tierHtml);
		$contentHtml.append($provinceHtml);
		$contentHtml.append($cityHtml);

		$baseHtml.append(filterHtml);	
		$baseHtml.append($contentHtml);
		$baseHtml.append($selectedAreaHtml);
		elem.append($baseHtml);
		//编辑回填
		var results = elem.data('results');
		if (results.length>0) {
			for (var i = 0; i < results.length; i++) {
				var id = results[i].id;
				elem.find(".province-layer").find("li[_id='"+id+"']").find("a:first").find("i").attr("class","fa fa-check-square");
			};
			_justifyCheck(elem);
			_getResult(elem,opts);
		};
		_bindEvent(elem,opts);
		$tierHtml.find('.tree').find("li:first").click();
	}
	function _createItem(data,opts){
		var nameIndex = {'en':'name_en_us','zh':'name_zh_cn'};
		var search= "";
		if (data && data.length>0) {
			for(var i=0;i<data.length;i++){
	            try{
	              search = data[i]['name_en_us']+"|"+data[i]['name_zh_cn']+"|"+data[i]['id'];
	              liDoms += '<li _id="'+data[i].id+'" level="'+data[i].tier_level+'" title="'+data[i][nameIndex[opts.lang]]+'" search="'+search+'"><a href="javascript:;"><i class="fa fa-square-o"></i><span>'+data[i][nameIndex[opts.lang]].toLowerCase()+'</span></a>';
	              if(data[i]["city"] != null && data[i]["city"].length>0){
	                 liDoms += '<ul class="childs" style="display:none">';
	                 _createItem(data[i]["city"],opts);
	                 liDoms += '</ul>';
	              }
	              liDoms += "</li>";
	            }catch(e){}
	        }
	        return liDoms;
		};
	}
	function _bindEvent($elem,otps){
		$elem.on("click",".city-choose-tab li",function(){
			$(this).parent().find(".selected").removeClass("selected");
			$(this).addClass("selected");
			$elem.find(".content-parent").hide();
			var $parent = $elem.find(".city-choose-content").find("."+$(this).attr("data-value"));
			$parent.show();
			var searchText = $.trim($elem.find(".city-choose-search").find("input").val());
			var searchId = $elem.data('searchId');
			if (searchId!="" && searchText!="") {
				_searchById($elem,searchId);
			}else{
				$parent.find(".tree").find("li:first").trigger("click");
				$parent.find(".tree").animate({
		            scrollTop: 0,
		        }, 200);
				$(".content-child .tree").animate({
		            scrollTop: 0,
		        }, 200);
			}
		})
		$elem.on("click",".city-choose-content li",function(e){
			e = e || window.event;
			var isParent = $(this).parents(".tree").parent().hasClass("content-parent");
			if (!isParent) {
				$(this).find("a:first").find("i").trigger("click");
			}else{
				var isTier = $(this).parents(".content-parent").hasClass("tier-layer");
				var childs = "";
				if (isTier) {
					var level = $(this).attr("level");
					childs = $elem.find(".province-layer").find("[level='"+level+"']").map(function(){
						return $(this).prop("outerHTML");
					}).get().join("");
				}else{
					childs = $(this).find(".childs").html();
				}
				$elem.find(".content-child .tree").html(childs).animate({
		            scrollTop: 0,
		        }, 200);
				$elem.find(".active").removeClass("active");
				$(this).addClass("active");
			}
			e.stopPropagation();
        	e.preventDefault();
		})
		$elem.on("click",".city-choose-content li i",function(e){
			e = e || window.event;
			var isParent = $(this).parents(".tree").parent().hasClass("content-parent");
			var isTier = $(this).parents(".tree").parent().hasClass("tier-layer");
			var id = $(this).parent().parent().attr("_id");
			var translate = $.fn.cityChoose.langConfig[otps.lang];
			_check($(this));
			var className = $(this).attr("class");
			var results = $elem.data('results');
			var selecteds = results.length;
			var isError = false;
			var maxSelect = $elem.data('maxSelect');
			if (isParent) {
				if (isTier) {
					var level = $(this).parent().parent().attr("level");
					$elem.find(".province-layer").find("[level='"+level+"']").each(function(){
						if (maxSelect=="" || selecteds < maxSelect || className.indexOf("fa-square-o")>-1) {
							$(this).find("a:first").find("i").attr("class",className);
							id = $(this).attr("_id");
							$elem.find(".content-child").find("[_id='"+id+"']").find("a:first").find("i").attr("class",className);
							className.indexOf("fa-check-square") ? selecteds++ : selecteds--;
						}else{
							isError = true;
						}
					});
				}else{
					if($(this).parent().next().length>0){
						$(this).parent().next().find("li").each(function(){
							if (maxSelect=="" || selecteds < maxSelect || className.indexOf("fa-square-o")>-1) {
								$(this).find("a:first").find("i").attr("class",className);
								id = $(this).attr("_id");
								$elem.find(".content-child").find("[_id='"+id+"']").find("a:first").find("i").attr("class",className);
								className.indexOf("fa-check-square") ? selecteds++ : selecteds--;
							}else{
								isError = true;
							}
						})
					}
				}
			}else{
				if (maxSelect=="" || selecteds < maxSelect || className.indexOf("fa-square-o")>-1) {
					$elem.find(".content-parent").find("[_id='"+id+"']").find("a:first").find("i").attr("class",className);
					className.indexOf("fa-check-square")>-1 ? selecteds++ : selecteds--;
				}else{
					isError = true;
				}
			}
			//验证子元素判断父元素
			if (isError) {
				_check($(this),false);
				_call($elem,otps.onError,translate['rangeErr'][0]+maxSelect+translate['rangeErr'][1]);
			}else{
				$elem.find(".err-msg").hide();
			}
			_justifyCheck($elem);
			//结果显示根据max有无设置会有所不同，如果没设置max，需要混合展示省份和城市
			_getResult($elem,otps);
			e.stopPropagation();
        	e.preventDefault();
		})
		$elem.on("keyup",".city-choose-search input",function(e){
			event = event || window.event;
        	var keycode = event.keyCode;
        	var special = [13,38,40];
        	if ($.inArray(keycode,special)==-1) {
        		_createUI(this,otps);
        	};
			_keybordEvent(this,e);
		})
		$elem.on("click",".city-choose-search input",function(){
			if ($elem.find(".filter-result").is(":hidden")) {
				_createUI(this,otps)
			};
		})
		$elem.on("click",".filter-result li",function(){
			var id = $(this).attr("_id");
			if (id) {
				_searchById($elem,id);
	            $elem.data('searchId',id);
				$(this).parent().parent().parent().find("input").val($(this).text());
			};
			$(this).parent().parent().hide();
 		})
 		$elem.on("click",".filter-search-ico",function(){
 			var searchText = $.trim($elem.find(".city-choose-search").find("input").val());
 			var searchId = $elem.data('searchId');
			if (searchId!="" && searchText!="") {
				_searchById($elem,searchId);
			}
 		})
 		$elem.on("mouseover",".filter-result li",function(){
 			$elem.data('searchOnIndex',$(this).index());
 			$(this).parent().find(".on").removeClass("on");
 			$(this).addClass("on");
 		})
 		$elem.on("mouseout",".filter-result li",function(){
 			if($(this).parent().find(".on").length>1){
 				$(this).removeClass("on");
 			}
 		})
 		$elem.find(".city-choose-search").hover(function(){
		    $('body').unbind('mousedown');
		},function(){
		    $('body').bind('mousedown', function(){
		       $(".filter-result").hide();
		    });
		});
	}
	function _keybordEvent(input,event){
		event = event || window.event;
        var keycode = event.keyCode;
        var lis = $(input).parent().find(".filter-result").find("li");
        var len = lis.length;
        var searchOnIndex = $(input).parents("city-choose").parent().data('searchOnIndex');
		switch(keycode){
            case 40: //向下箭头↓
                searchOnIndex++;
                if(searchOnIndex > len-1) searchOnIndex = 0;
                for(var i=0;i<len;i++){
                    $(lis[i]).removeClass('on');
                }
                $(lis[searchOnIndex]).addClass('on');
                break;
            case 38: //向上箭头↑
                searchOnIndex--;
                if(searchOnIndex<0) searchOnIndex = len-1;
                for(i=0;i<len;i++){
                    $(lis[i]).removeClass('on');
                }
                $(lis[searchOnIndex]).addClass('on');
                break;
            case 13: // enter键
                $(input).parent().find(".filter-result").find(".on").trigger("click");
                break;
            default:
                break;
        }
        $(input).parents("city-choose").parent().data('searchOnIndex',searchOnIndex);
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
	function _justifyCheck($elem){
		function comapre(length,notChecklength,$i){
			if (notChecklength==0) {
				$i.attr("class","fa fa-check-square");
			}else if(notChecklength==length){
				$i.attr("class","fa fa-square-o");
			}else{
				$i.attr("class","fa fa-minus-square");
			}
		}
		$elem.find(".tier-layer").find("li").each(function(){
			var level = $(this).attr("level");
			var length = $elem.find(".province-layer").find("[level='"+level+"']").length;
			var notChecklength = $elem.find(".province-layer").find("[level='"+level+"']").filter(function(){
				return $(this).find("a:first").find("i").hasClass("fa-square-o");
			}).get().length;
			comapre(length,notChecklength,$(this).find("a:first").find("i"));
		})
		$elem.find(".province-layer").find("li[level='undefined']").each(function(){
			var length = $(this).find(".childs").find("li").length;
			var notChecklength = $(this).find(".childs").find(".fa-square-o").length;
			comapre(length,notChecklength,$(this).find("a:first").find("i"));
		})
	}
	function _getResult($elem,opts){
		var json = {};
		var results = $elem.data('results'),mixResults=[],isAllSelected=false;
		results = [];
		$elem.find(".province-layer").find("li[level='undefined']").each(function(){
			isAllSelected = $(this).find("a:first").find("i").hasClass("fa-check-square");
			if (isAllSelected) {
				mixResults.push({
					id:$(this).attr("_id"),
					name:$(this).attr("title"),
					level:$(this).attr("level")
				})
			};
			$(this).find(".childs").find("li").each(function(){
				if ($(this).find("a:first").find("i").hasClass("fa-check-square")) {
					json = {
						id:$(this).attr("_id"),
						name:$(this).attr("title"),
						level:$(this).attr("level")
					}
					results.push(json);
					if (!isAllSelected) mixResults.push(json);
				};
			})
		})
		_citySort(results,opts);
		_citySort(mixResults,opts);
		$elem.data('results',results);
		if (opts.max=="") {
			_addChooseLi($elem,mixResults);
		}else{
			_addChooseLi($elem,results);
		}
		_call($elem,opts.callback,results);
	}
	function _addChooseLi($elem,results){
		var li = $elem.find(".city-choose-area").find(".noResult").clone().prop("outerHTML");
		$elem.find(".city-choose-area").find("ul").empty();
		$elem.find(".city-choose-area").find("ul").append(li);
		for (var i = 0; i < results.length; i++) {
			var li = '<li>'+results[i].name.toLowerCase()+'</li>';
			$elem.find(".city-choose-area").find("ul").append(li);
		};
		if (results.length>0) {
			$elem.find(".city-choose-area").find("ul").find(".noResult").hide();
		}else{
			$elem.find(".city-choose-area").find("ul").find(".noResult").show();
		}
	}
	function _createUI(elem,opts){
		var value = $.trim($(elem).val());
		var reg = new RegExp(value + "|\\|" + value, 'gi');
		var translate = $.fn.cityChoose.langConfig[opts.lang];
		var searchResult = [],searchArr=[];
		if (value!="") {
			$(elem).parents(".city-choose").find(".province-layer").find("li").each(function(){
				searchArr.push($(this).attr("search").toLowerCase());
			})
			for (var i = searchArr.length - 1; i >= 0; i--) {
               if (reg.test(searchArr[i])) {
                    var match = searchArr[i].split("|");
                    if (searchResult.length !== 0) {
                        str = '<li _id="'+match[2]+'">' + match[0] + '</li>';
                    } else {
                        str = '<li _id="'+match[2]+'" class="on">' + match[0] + '</li>';
                    }
                    searchResult.push(str);
                }
            };
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">'+translate["noResult"]+'</li>';
                searchResult.push(str);
            }
            $(elem).parent().find(".filter-result").show().find("ul").html(searchResult.join(""));
		};
	}
	function _searchById($elem,id){
		var	$selectLi = $elem.find(".province-layer").find("[_id='"+id+"']"),
	   		level = $selectLi.attr("level"),
		 	isProvince = level=="undefined",
			$parentLi = isProvince ? $selectLi : $selectLi.parents(".childs").parent(),
			parentId = $parentLi.attr("_id"),
			tab = $elem.find(".city-choose-tab").find(".selected").attr("data-value"),
			thisIndex = $selectLi.index(),
			parentIndex = $parentLi.index();

		$elem.find(".search").removeClass("search");
		$selectLi.find("a:first").find("span").addClass("search");
		if (level!="undefined" && tab == "tier-layer") {
			$elem.find(".tier-layer").find("[level='"+level+"']").trigger("click");
			$parentLi.addClass("active");
		}else{
			$parentLi.trigger("click");
		}
		$selectLi = $elem.find(".content-child").find("[_id='"+id+"']");
		$parentLi = $elem.find(".content-parent").find("[_id='"+parentId+"']");
		$(".content-parent .tree").animate({
            scrollTop: $parentLi.prop('offsetTop'),
        }, 200);
		$(".content-child .tree").animate({
            scrollTop: $selectLi.prop('offsetTop'),
        }, 200);	
	}
	function _citySort(city_obj,opts){
        if(opts.lang=='en'){
            city_obj = city_obj.sort(function(a,b){
                return a.name > b.name;
            }); 
        }else{
            city_obj = city_obj.sort(function(a, b){
                    return a.name.localeCompare(b.name, 'zh-Hans-CN', {sensitivity: 'accent'});
            });
        }
        return city_obj;
    }
	function _call(elem, func, param){
		if(func && typeof func === 'function'){
			if(param){
				func.call(elem, param);
			}else{
				return func.call(elem);
			}
		}
	}
	$.fn.cityChoose = function(method){
		if (methods[method]) {
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method === 'object' || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error('Method ' + method + ' does not exist on iax.cityChoose.plugin');
		}
	}
	$.fn.cityChoose.defaults = {
		lang:"en",
		data:"",
		max:"",
		results:[],//[{id: "1156110000", name: "BEIJING", level: "1"}],
		continent:"Asia",
		country:"China",
		onInit : function(){},
		onComplete : function(){},
		onError:function(errorMsg){
			$(this).find(".err-msg").show().text(errorMsg);
		},
		callback:function(results){console.log(results)}
	}
	$.fn.cityChoose.langConfig = {
		'zh':{
			'tab_tiers':"By City Tiers",
			'tab_province':"By Provinces",
			'search':"Search",
			'tier_layer':"Tiers",
			'city_layer':"Cities",
			'province_layer':"Provinces",
			'choose_label':'Selected City(ies)',
			'tiers_input':["一线城市","二线城市","三线城市","四线城市","未分级城市"],
			'noResult':'没有结果',
			'noSelects':'No selected cities',
			'rangeErr':['Max. ',' cities']
		},
		'en':{
			'tab_tiers':"By City Tiers",
			'tab_province':"By Provinces",
			'search':"Search",
			'tier_layer':"Tiers",
			'city_layer':"Cities",
			'province_layer':"Provinces",
			'choose_label':'Selected City(ies)',
			'tiers_input':["First-tier City","Second-tier City","Third-tier City","Fourth-tier City","Non-tier City"],
			'noResult':'No Results',
			'noSelects':'No selected cities',
			'rangeErr':['Max. ',' cities']
		}
	}
})(jQuery)