//基于高德地图，编辑需要:bootstrap#modal,city_choose,
(function($){
	var city_map = {"1156110000":"北京市","1156120000":"天津市","1156130100":"石家庄市","1156130200":"唐山市","1156130300":"秦皇岛市","1156130400":"邯郸市","1156130500":"邢台市","1156130600":"保定市","1156130700":"张家口市","1156130800":"承德市","1156130900":"沧州市","1156131000":"廊坊市","1156131100":"衡水市","1156140100":"太原市","1156140200":"大同市","1156140300":"阳泉市","1156140400":"长治市","1156140500":"晋城市","1156140600":"朔州市","1156140700":"晋中市","1156140800":"运城市","1156140900":"忻州市","1156141000":"临汾市","1156141100":"吕梁市","1156150100":"呼和浩特市","1156150200":"包头市","1156150300":"乌海市","1156150400":"赤峰市","1156150500":"通辽市","1156150600":"鄂尔多斯市","1156150700":"呼伦贝尔市","1156150800":"巴彦淖尔市","1156150900":"乌兰察布市","1156152200":"兴安盟","1156152500":"锡林郭勒盟","1156152900":"阿拉善盟","1156210100":"沈阳市","1156210200":"大连市","1156210300":"鞍山市","1156210400":"抚顺市","1156210500":"本溪市","1156210600":"丹东市","1156210700":"锦州市","1156210800":"营口市","1156210900":"阜新市","1156211000":"辽阳市","1156211100":"盘锦市","1156211200":"铁岭市","1156211300":"朝阳市","1156211400":"葫芦岛市","1156220100":"长春市","1156220200":"吉林市","1156220300":"四平市","1156220400":"辽源市","1156220500":"通化市","1156220600":"白山市","1156220700":"松原市","1156220800":"白城市","1156222400":"延边朝鲜族自治州","1156230100":"哈尔滨市","1156230200":"齐齐哈尔市","1156230300":"鸡西市","1156230400":"鹤岗市","1156230500":"双鸭山市","1156230600":"大庆市","1156230700":"伊春市","1156230800":"佳木斯市","1156230900":"七台河市","1156231000":"牡丹江市","1156231100":"黑河市","1156231200":"绥化市","1156232700":"大兴安岭地区","1156310000":"上海市","1156320100":"南京市","1156320200":"无锡市","1156320300":"徐州市","1156320400":"常州市","1156320500":"苏州市","1156320600":"南通市","1156320700":"连云港市","1156320800":"淮安市","1156320900":"盐城市","1156321000":"扬州市","1156321100":"镇江市","1156321200":"泰州市","1156321300":"宿迁市","1156330100":"杭州市","1156330200":"宁波市","1156330300":"温州市","1156330400":"嘉兴市","1156330500":"湖州市","1156330600":"绍兴市","1156330700":"金华市","1156330800":"衢州市","1156330900":"舟山市","1156331000":"台州市","1156331100":"丽水市","1156340100":"合肥市","1156340200":"芜湖市","1156340300":"蚌埠市","1156340400":"淮南市","1156340500":"马鞍山市","1156340600":"淮北市","1156340700":"铜陵市","1156340800":"安庆市","1156341000":"黄山市","1156341100":"滁州市","1156341200":"阜阳市","1156341300":"宿州市","1156341500":"六安市","1156341600":"亳州市","1156341700":"池州市","1156341800":"宣城市","1156350100":"福州市","1156350200":"厦门市","1156350300":"莆田市","1156350400":"三明市","1156350500":"泉州市","1156350600":"漳州市","1156350700":"南平市","1156350800":"龙岩市","1156350900":"宁德市","1156360100":"南昌市","1156360200":"景德镇市","1156360300":"萍乡市","1156360400":"九江市","1156360500":"新余市","1156360600":"鹰潭市","1156360700":"赣州市","1156360800":"吉安市","1156360900":"宜春市","1156361000":"抚州市","1156361100":"上饶市","1156370100":"济南市","1156370200":"青岛市","1156370300":"淄博市","1156370400":"枣庄市","1156370500":"东营市","1156370600":"烟台市","1156370700":"潍坊市","1156370800":"济宁市","1156370900":"泰安市","1156371000":"威海市","1156371100":"日照市","1156371200":"莱芜市","1156371300":"临沂市","1156371400":"德州市","1156371500":"聊城市","1156371600":"滨州市","1156371700":"菏泽市","1156410100":"郑州市","1156410200":"开封市","1156410300":"洛阳市","1156410400":"平顶山市","1156410500":"安阳市","1156410600":"鹤壁市","1156410700":"新乡市","1156410800":"焦作市","1156410900":"濮阳市","1156411000":"许昌市","1156411100":"漯河市","1156411200":"三门峡市","1156411300":"南阳市","1156411400":"商丘市","1156411500":"信阳市","1156411600":"周口市","1156411700":"驻马店市","1156420100":"武汉市","1156420200":"黄石市","1156420300":"十堰市","1156420500":"宜昌市","1156420600":"襄阳市","1156420700":"鄂州市","1156420800":"荆门市","1156420900":"孝感市","1156421000":"荆州市","1156421100":"黄冈市","1156421200":"咸宁市","1156421300":"随州市","1156422800":"恩施土家族苗族自治州","1156430100":"长沙市","1156430200":"株洲市","1156430300":"湘潭市","1156430400":"衡阳市","1156430500":"邵阳市","1156430600":"岳阳市","1156430700":"常德市","1156430800":"张家界市","1156430900":"益阳市","1156431000":"郴州市","1156431100":"永州市","1156431200":"怀化市","1156431300":"娄底市","1156433100":"湘西土家族苗族自治州","1156440100":"广州市","1156440200":"韶关市","1156440300":"深圳市","1156440400":"珠海市","1156440500":"汕头市","1156440600":"佛山市","1156440700":"江门市","1156440800":"湛江市","1156440900":"茂名市","1156441200":"肇庆市","1156441300":"惠州市","1156441400":"梅州市","1156441500":"汕尾市","1156441600":"河源市","1156441700":"阳江市","1156441800":"清远市","1156441900":"东莞市","1156442000":"中山市","1156445100":"潮州市","1156445200":"揭阳市","1156445300":"云浮市","1156450100":"南宁市","1156450200":"柳州市","1156450300":"桂林市","1156450400":"梧州市","1156450500":"北海市","1156450600":"防城港市","1156450700":"钦州市","1156450800":"贵港市","1156450900":"玉林市","1156451000":"百色市","1156451100":"贺州市","1156451200":"河池市","1156451300":"来宾市","1156451400":"崇左市","1156460100":"海口市","1156460200":"三亚市","1156460400":"儋州市","1156500000":"重庆市","1156510100":"成都市","1156510300":"自贡市","1156510400":"攀枝花市","1156510500":"泸州市","1156510600":"德阳市","1156510700":"绵阳市","1156510800":"广元市","1156510900":"遂宁市","1156511000":"内江市","1156511100":"乐山市","1156511300":"南充市","1156511400":"眉山市","1156511500":"宜宾市","1156511600":"广安市","1156511700":"达州市","1156511800":"雅安市","1156511900":"巴中市","1156512000":"资阳市","1156513200":"阿坝藏族羌族自治州","1156513300":"甘孜藏族自治州","1156513400":"凉山彝族自治州","1156520100":"贵阳市","1156520200":"六盘水市","1156520300":"遵义市","1156520400":"安顺市","1156520500":"毕节市","1156520600":"铜仁市","1156522300":"黔西南布依族苗族自治州","1156522600":"黔东南苗族侗族自治州","1156522700":"黔南布依族苗族自治州","1156530100":"昆明市","1156530300":"曲靖市","1156530400":"玉溪市","1156530500":"保山市","1156530600":"昭通市","1156530700":"丽江市","1156530800":"普洱市","1156530900":"临沧市","1156532300":"楚雄彝族自治州","1156532500":"红河哈尼族彝族自治州","1156532600":"文山壮族苗族自治州","1156532800":"西双版纳傣族自治州","1156532900":"大理白族自治州","1156533100":"德宏傣族景颇族自治州","1156533300":"怒江傈僳族自治州","1156533400":"迪庆藏族自治州","1156540100":"拉萨市","1156540200":"日喀则市","1156540300":"昌都市","1156540400":"林芝市","1156540500":"山南市","1156542400":"那曲地区","1156542500":"阿里地区","1156610100":"西安市","1156610200":"铜川市","1156610300":"宝鸡市","1156610400":"咸阳市","1156610500":"渭南市","1156610600":"延安市","1156610700":"汉中市","1156610800":"榆林市","1156610900":"安康市","1156611000":"商洛市","1156620100":"兰州市","1156620200":"嘉峪关市","1156620300":"金昌市","1156620400":"白银市","1156620500":"天水市","1156620600":"武威市","1156620700":"张掖市","1156620800":"平凉市","1156620900":"酒泉市","1156621000":"庆阳市","1156621100":"定西市","1156621200":"陇南市","1156622900":"临夏回族自治州","1156623000":"甘南藏族自治州","1156630100":"西宁市","1156630200":"海东市","1156632200":"海北藏族自治州","1156632300":"黄南藏族自治州","1156632500":"海南藏族自治州","1156632600":"果洛藏族自治州","1156632700":"玉树藏族自治州","1156632800":"海西蒙古族藏族自治州","1156640100":"银川市","1156640200":"石嘴山市","1156640300":"吴忠市","1156640400":"固原市","1156640500":"中卫市","1156650100":"乌鲁木齐市","1156650200":"克拉玛依市","1156650400":"吐鲁番市","1156652300":"昌吉回族自治州","1156652700":"博尔塔拉蒙古自治州","1156652800":"巴音郭楞蒙古自治州","1156652900":"阿克苏地区","1156653000":"克孜勒苏柯尔克孜自治州","1156653100":"喀什地区","1156653200":"和田地区","1156654000":"伊犁哈萨克自治州","1156654200":"塔城地区","1156654300":"阿勒泰地区","1344000000":"其他"};

	var methods = {
		init: function(options){
			var opts = $.extend({},$.fn.lbs.defaults,options);
			this.each(function(){
				var self = $(this);
				// 区 街道 如果checked=0 则相应其下的街道 和 店铺都不存在 exclede 对象了
        		// 只有在checked = 1 才将相应的街道 店铺存起来
				self.data('base_option',{
					mapObj : null,
					heatMapObj:null,
					markers : [], //放置marker点的数组
					polygons : [], //区边界
					current_district : [],
					current_street : [],
					current_poi : [],
					zoomListener:null, //存储监听zoomend事件的变量
					analysis_db:opts.lbsData, // 存储当前请求过来多个城市的数据
					analysis_result:null, //存储当前选择的城市数据
					current_city_filter:null, //当前城市对应的排除数据_
					current_params:null, //存储求数接口的参数 对比后面用户操作是否改变了请求参数
					current_zoom:11, //存储setMarker后赋值的zoom值 用来减少不必要的更新marker
					INIT_ZOOM : 11,
					heatmapOptions:{
		                radius: 45, //给定半径
		                opacity: [0, 0.6]
		                ,gradient:{
		                 0.6: '#168bed',
		                 0.75: '#7cfa5f',
		                 0.9: '#f9fa65',
		                 0.95: '#fddf3d',
		                 1.0: '#ef4136' 
		                 }
		            },
		            fillColor:{
		                normal:'#4484CF',
		                gray:'gray',
		                hover:'red'
		            },
					LEVEL_1_ZOOM : 11,
					LEVEL_2_ZOOM : 14,
					LEVEL_3_ZOOM : 17
				});
				self.data('analysis_db',opts.lbsData);
				self.data('filter_total',opts.params.filter_total);
				self.data('radius',opts.params.distance);
				self.data('map-id',"container_"+new Date().getTime());
				_render(self,opts);
				_call(self,opts.onInit,opts);
			})
		}
	}

	function _render(elem,opts){
		_citySort(opts.params.cities,opts);
		var translate = $.fn.lbs.langConfig[opts.lang],
			$baseHtml = $('<div class="lbs-container"><div id="lbs-slider-bar" class="lbs-slider-bar"><i class="fa fa-angle-double-left" aria-hidden="true"></i></div></div>'),
			$mapHtml = $('<div class="lbs-content"><div class="lbs-content-inner"><div class="lbs-map" id="'+elem.data("map-id")+'"></div></div></div>'),
			heatMapHtml = '<div class="lbs-control">'+
		                  '    <input type="button" data-id="footFallMap" class="button selected" value="'+translate["footFall"]+'"/>'+
		                  '    <input type="button" data-id="heatMap" class="button" value="'+translate["heatMap"]+'"/>'+
		                  '</div>',
			$infoHtml = $('<div class="lbs-info"></div>'),
			brandHtml =  '<div class="lbs-info-detail">'+
	                     ' <div class="info-detail-con">'+
	                     '   <div class="lbs-edit">'+
	                     '     <i class="fa fa-edit"></i>'+
	                     '     <button class="btn dropdown-toggle" type="button">'+
	                     '       '+translate["edit"]+'&nbsp;            '+
	                     '      </button>'+
	                     '   </div>'+
	                     ' </div>'+
	                     '</div>',
	        keywordsLi = opts.params.keywords.map(function(v,i){return "<li>"+v+"</li>"}).join(""),
	        keywordsHtml =  '<div class="lbs-info-detail">'+
				            '  <label class="info-detail-title">'+translate["keywords"]+'</label>'+
				            '  <div class="info-detail-con">'+
				            '    <ul class="tag">'+
				            		keywordsLi +
				            '    </ul>'+
				            '  </div>'+
				            '</div>',
			distanceHtml =  '<div class="lbs-info-detail">'+
				            '  <label class="info-detail-title">'+translate["distance"]+'</label>'+
				            '  <span>'+opts.params.distance+'km</span>'+
				            '</div>',
			citiesLi = opts.params.cities.map(function(v,i){
				return "<li data-id='"+v.id+"'>"+v.name.toLowerCase()+"</li>";
			}).join(""),
	        citiesHtml =  '<div class="lbs-info-detail">'+
				            '  <label class="info-detail-title">'+translate["cities"]+'</label>'+
				            '  <div class="info-detail-con">'+
				            '    <ul class="tag tag-city">'+
				            		citiesLi +
				            '    </ul>'+
				            '  </div>'+
				            '</div>',
			locationsTab =  '<ul class="area-level-box">'+
							' 	<li class="active">'+translate["districts"]+'</li>'+
							' 	<li>'+translate["streets"]+'</li>'+
							' 	<li>'+translate["locations"]+'</li>'+
							'</ul>',	  
			locationsBox = 	'<div class="lbs-area-box m-t-sm">'+
		                    '        <div class="lbs-list-box active">'+
		                    '            <div class="lbs-list-search">'+
		                    '                <input type="text"  class="form-control lbs-search"  placeholder="Search">'+
		                    '                <div class="filter-search-ico"><i class="fa fa-search"></i></div>'+
		                    '            </div>'+
		                    '            <ul class="lbs-item-list" ></ul>'+
		                    '        </div>'+
		                    '        <div class="lbs-list-box">'+
		                    '            <select class="district-filter" style="width:210px;"></select>'+
		                    '            <div class="lbs-list-search">'+
		                    '                <input type="text" class="form-control lbs-search"  placeholder="Search">'+
		                    '                <div class="filter-search-ico"><i class="fa fa-search"></i></div>'+
		                    '            </div>'+
		                    '            <ul class="lbs-item-list"></ul>'+
		                    '        </div>'+
		                    '        <div class="lbs-list-box">'+
		                    '            <select class="street-filter" style="width:210px;"></select>'+
		                    '            <div class="lbs-list-search">'+
		                    '                <input type="text" class="form-control lbs-search"  placeholder="Search">'+
		                    '                <div class="filter-search-ico"><i class="fa fa-search"></i></div>'+
		                    '            </div>'+
		                    '            <ul class="lbs-item-list"></ul>'+
		                    '        </div>'+
		                    '    </div>'+
		                    '</div>',	          
		    locationsHtml = '<div class="lbs-info-detail">'+
				            '  <label class="info-detail-title">'+translate["locations"]+'</label>'+
				            '  <div class="info-detail-con">'+
				            		locationsTab+
				            		locationsBox+
				            '  </div>'+
				            '</div>',
			unsavetipHtml = '<label class="lbs-unsave-tip">'+translate["noDataTip"]+'</label>';
			saveLocationHtml =  '<div class="lbs-info-detail" style="margin-bottom:0;">'+
								'  <div class="info-detail-con">'+
									unsavetipHtml+
								'	<button type="button" style="float:left;" class="btn btn-success save-location" >'+translate["savelocation"]+'</button>'+
								'  </div>'+
								'</div>',
		    totalHtml = '<div class="lbs-total">'+
		    			'   <div><p class="info-detail-title">'+translate["myBrand"]+' : '+opts.params.name+'</p></div>'+
		    			'	<div name="impressions_sum"><p>'+translate["impressions"]+':</p><p></p></div>'+
		    			'	<div name="audience_sum"><p>'+translate["audience"]+':</p><p></p></div>'+
		    			'</div>';
			$mapHtml.append(heatMapHtml);				            
			$infoHtml.append(brandHtml).append(keywordsHtml).append(distanceHtml).append(citiesHtml).append(locationsHtml).append(saveLocationHtml);
			$baseHtml.append($mapHtml).append($infoHtml).append(totalHtml);
			elem.off("click");
			elem.empty().append($baseHtml);
			if (opts.isReload) {
				elem.find(".lbs-unsave-tip").show();
			};
			//初始化数据
			var base_option = elem.data('base_option');
            base_option.dom = {
                district_filter: elem.find('.district-filter'),
                street_filter: elem.find('.street-filter')
            };
			var cityId = 0,_target_data;
			_target_data = _getData(elem,opts);
			if (_target_data) {
				cityId = elem.find('.lbs-container').attr('cur_city_code');
				_filterChange(elem,_target_data.city, cityId);
	            _cityChangeInit(elem,_target_data);
			}else{
				base_option.mapObj && base_option.mapObj.remove(base_option.polygons);
                base_option.mapObj && base_option.mapObj.remove(base_option.markers);
				opts.onNoData.call(elem, opts,true);
			}
			
			_bindEvent(elem,opts);
	}	

	function _bindEvent($elem,opts){
		var analysis_db = $elem.data('analysis_db');
		var base_option = $elem.data('base_option');
		_maplistItemClick($elem);
		_maplistItemHover($elem);
		//搜索符合条件的item
        $elem.find('.lbs-search').on('input', function() {

            var _val = $(this).val().trim();
            var targe_em = $(this).parent().next('ul').find('em');
            var result;

            targe_em.removeClass('selected');
            if (_val == '') return;
            result = targe_em.filter(function(index) {
                return $(this).text().indexOf(_val) >= 0;
            });

            if (result.length == 0) return;
            var _target = result.eq(0).parents('li');
            var _parent_ul = $(this).parent().next('ul');
            var dis = _target.offset().top - _parent_ul.offset().top;

            _parent_ul.scrollTop(_parent_ul.scrollTop() + dis);

            result.addClass('selected');
        });
        $elem.find('.area-level-box>li').on('click', function() {
            var _index = $(this).index();
            var _zoomLevel = base_option.LEVEL_1_ZOOM;
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            _zoomLevel = _index == 0 ? base_option.LEVEL_1_ZOOM : (_index == 1 ? base_option.LEVEL_2_ZOOM : base_option.LEVEL_3_ZOOM);
            base_option.mapObj.setZoom(_zoomLevel);
            $elem.find('.lbs-area-box>.lbs-list-box').hide().eq(_index).show();
        });
		$elem.on("click",".tag-city li",function(){
			var code = $(this).attr('data-id');
            var target_city_data;

            target_city_data = _findByKey(analysis_db.city,'city', city_map[code]);

            if (!target_city_data) {
            	_call($elem,opts.onNoData,opts);
                return;
            }

            $elem.find('.lbs-container').attr('cur_city_code',code);

            $(this).siblings().removeClass('selected');
            $(this).addClass('selected');
            _addZoomListener($elem,false);
            _filterChange($elem,city_map[code], code);
            _cityChangeInit($elem,target_city_data);
		});
		$elem.on('click','.lbs-slider-bar',function(){
            if($(this).hasClass('right')){
              $(this).removeClass('right');
              $elem.find('.lbs-info').css("left","0px");
              $elem.find('.lbs-info').css("background","#fff");
              $elem.find('.lbs-total').css("left","0px");
              $elem.find('.lbs-total').css("background","#fff");
              $elem.find('.lbs-control').css("left","320px");
              $elem.find('.lbs-content-inner').css("margin-left",'250px');  
            }else{
              $(this).addClass('right');
              $elem.find('.lbs-info').css("left","-235px");
              $elem.find('.lbs-info').css("background","#ccc");
              $elem.find('.lbs-total').css("left","-250px");
              $elem.find('.lbs-total').css("background","#ccc");
              $elem.find('.lbs-control').css("left","80px");
              $elem.find('.lbs-content-inner').css("margin-left",'0');  
            }
        }); 
        $elem.on("click",".lbs-edit",function(){
        	_call($elem,opts.onEdit,opts);
        });
        $elem.on("click",".lbs-control input",function(){
        	var type =  $(this).attr("data-id");
        	$(this).siblings().removeClass('selected');
            $(this).addClass('selected');
        	if (type=="footFallMap") {
        		base_option.heatMapObj && base_option.heatMapObj.hide();
        		for (var i = 0; i < base_option.markers.length; i++) {
        			base_option.markers[i].show();
        		};
        	}else{
        		if (!base_option.heatMapObj) {
        			base_option.mapObj.plugin(["AMap.Heatmap"], function() {
		              //初始化heatmap对象
		              base_option.heatMapObj = new AMap.Heatmap(base_option.mapObj, base_option.heatmapOptions);
		              //设置数据集
		              base_option.heatMapObj.setDataSet({
		                  data: opts.heatmapData,
		                  max: 100
		              });
		          });
        		}else{
        			base_option.heatMapObj.show();
        		}
        		for (var i = 0; i < base_option.markers.length; i++) {
        			base_option.markers[i].hide();
        		};
        	}
        })
		$elem.on('click',".save-location",function(){
			_call($elem,opts.onSave,opts);
		})
		$elem.on("mouseover",".lbs-infowindow",function(){
			$elem.data("noclick",true);
		})
		$elem.on("mouseout",".lbs-infowindow",function(){
			$elem.data("noclick",false);
		})
		$elem.on("click",".lbs-infowindow label",function(){
			var location = $(this).attr("location");
			$elem.find('.lbs-area-box').find('label[location="'+location+'"]').trigger("click");
		})

		base_option.dom.district_filter.off('change');
		base_option.dom.district_filter.on('change', function() {//区change时街道和店铺都要重新生成
            console.log('district-filter change')
            _setCurStreet($elem,base_option.analysis_result.district[$(this).val()].name, 2);
            _setCurPoi($elem,base_option.current_street[0].name, 1);
        });
        base_option.dom.street_filter.off('change');
		base_option.dom.street_filter.on('change', function() {
            console.log('street-filter change')
            _setCurPoi($elem,base_option.current_street[$(this).val()].name, 2);
        });
        // var left = parseInt($elem.find(".lbs-total").css("left"));
		// $(window).scroll(function(){
	 //        var scrollLeft = $(window).scrollLeft();
	 //        $elem.find(".lbs-total").css("left",left-scrollLeft+"px");
		// });
	}

	function _getData(elem,opts){
		var _target_data;
		if (opts.lbsData && opts.lbsData.city && opts.lbsData.city.length>0) {
			for(var i = 0; i<opts.params.cities.length; i++){
                var _tmp_city = opts.params.cities[i];
                _target_data = _findByKey(opts.lbsData.city,'city',city_map[_tmp_city.id]);
                if(_target_data){
                    cityId = _tmp_city.id;
                    if (elem) {
                    	elem.find('.lbs-container').attr('cur_city_code',cityId);
	                    elem.find('.tag-city').find("selected").removeClass('selected');
	                    elem.find('.tag-city').find('li[data-id=' + cityId + ']').addClass('selected');
                    };
                    break;
                }
            }
           
		}
		return _target_data;
	}

	function _filterChange($elem,name,id){
		var filter_total = $elem.data('filter_total');
		var base_option = $elem.data('base_option');
		var _tmp_filter = _findByKey(filter_total,'city', name);
        if (_tmp_filter) {
            base_option.current_city_filter = _tmp_filter;
        } else {
            filter_total.push({
                city: name,
                code: parseInt(id),
                district: [],
                street: [],
                poi: []
            });
            base_option.current_city_filter = _findByKey(filter_total,'city', name);
        }
	}

	function _cityChangeInit($elem,data){
		var base_option = $elem.data('base_option');
        //将当前城市数据赋值给全局变量 analysis_result
        base_option.analysis_result = data;
        //赋值给中间变量
        base_option.current_district = data.district;
        base_option.current_street = data.street;
        base_option.current_poi = data.poi;

        _initMap($elem,base_option.current_district[0]);
        _addZoomListener($elem,true);
        base_option.mapObj.setZoom(base_option.LEVEL_1_ZOOM); //设置zoom level 并更新地图中心
        //主动触发 zoomend 事件 因为切换城市后不触发zoomend事件
        // AMap.event.trigger(mapObj,'zoomend');
        _cityChange($elem,data);

        _setMarkers($elem,{
            marker_list: base_option.current_district,
            level: 1,
        });

        _totalComputed($elem);
	}

	function _initMap($elem,center){
		var base_option = $elem.data('base_option');
        if (base_option.mapObj) {
            //重新设置中心
            base_option.mapObj.setCenter([center.lng, center.lat]);
            return;
        };

        base_option.mapObj = new AMap.Map($elem.data("map-id"), {
            resizeEnable: true,
            zoom: base_option.INIT_ZOOM,
            animateEnable:true,
            scrollWheel: true,
            // center: [116.480983, 40.0958]
        });


        //添加左上角toolBar 和比例尺
        base_option.mapObj.plugin(["AMap.ToolBar", "AMap.Scale"], function() {
            var tool = new AMap.ToolBar();
            base_option.mapObj.addControl(tool);
            var scale = new AMap.Scale();
            base_option.mapObj.addControl(scale);
        });
	}

	function _addZoomListener($elem,isAdd){
		var base_option = $elem.data('base_option');
        if (isAdd) {
            base_option.zoomListener = AMap.event.addListener(base_option.mapObj, 'zoomend', function() {
                var btn_index;
                if (!base_option.analysis_result) return;
                var zoom = base_option.mapObj.getZoom();
                if (zoom <= base_option.LEVEL_1_ZOOM && base_option.current_zoom > base_option.LEVEL_1_ZOOM) { //区级别
                    _setMarkers($elem,{
                        marker_list: base_option.current_district,
                        level: 1,
                    });
                    btn_index = 1;
                } else if ((zoom > base_option.LEVEL_1_ZOOM && zoom <= base_option.LEVEL_2_ZOOM) && (base_option.current_zoom >= base_option.LEVEL_2_ZOOM || base_option.current_zoom <= base_option.LEVEL_1_ZOOM)) { //街道
                    _setMarkers($elem,{
                        marker_list: base_option.current_street,
                        level: 2,
                    });
                    btn_index = 2;
                } else if (zoom > base_option.LEVEL_2_ZOOM && base_option.current_zoom <= base_option.LEVEL_2_ZOOM) { //店铺
                    _setMarkers($elem,{
                        marker_list: base_option.current_poi,
                        level: 3,
                    });
                    btn_index = 3;
                }

                if (zoom <= base_option.LEVEL_1_ZOOM) {
                    btn_index = 1;
                }

                if (zoom > base_option.LEVEL_1_ZOOM && zoom <= base_option.LEVEL_2_ZOOM) {
                    btn_index = 2;
                }

                if (zoom > base_option.LEVEL_2_ZOOM) {
                    btn_index = 3;
                }

                var control_btn = $elem.find('.area-level-box>li');
                control_btn.removeClass('active');
                control_btn.eq(btn_index - 1).addClass('active');
                $elem.find('.lbs-area-box>.lbs-list-box').hide().eq(btn_index - 1).show();
            });
        } else {
            AMap.event.removeListener(base_option.zoomListener);
        }
	}

	function _setMarkers($elem,options){
		var base_option = $elem.data('base_option'),
            newCenter, splitArray, first_marker;
        var init_options = {
            marker_list: [], //marker的坐标点
            level: 1, // 1=>区 2=>街道 3=>店铺
            setFitView: false //是否 当前markers点适应视窗
        };
        $.extend(init_options, options);
        base_option.mapObj.remove(base_option.polygons);
        base_option.mapObj.remove(base_option.markers);
        base_option.polygons.length = 0;
        base_option.markers.length = 0;
        setTimeout(function(){
        	init_options.marker_list.map(function(item) {
	            _createMarkerDom($elem,item, init_options.level);
	        });
        },10)
        
        first_marker = init_options.marker_list[0];

        if (first_marker && first_marker.location) {
            splitArray = first_marker.location.split(',').reverse();
            newCenter = {
                lng: splitArray[0],
                lat: splitArray[1]
            };
        } else {
            newCenter = first_marker;
        }
        base_option.current_zoom = base_option.mapObj.getZoom();
        base_option.mapObj.setCenter([newCenter.lng, newCenter.lat]);
	}

	function _createMarkerDom($elem,item,level){
		var base_option = $elem.data('base_option');
		var radius = $elem.data('radius');
		var level = level || 1; //1=>到区 2=>到街道  3=>到店
        var content, marker_offset, _radius, excluded;
        item = $.extend(true, {}, item);

        var lng_lat = level == 3 ? item.location.split(',').reverse() : [item.lng, item.lat];
        var _level = (level == 1 ? 'district' : (level == 2 ? 'street' : 'poi'));
        
        var _tmp_street_array, _tmp_poi_array, _tmp_target;
        var _tmp_pv = _tmp_uv = 0;

        if(_level == 'poi'){
            _tmp_target = _findByKey(base_option.current_city_filter.poi,'location', item.location); 
        }else{
            _tmp_target = _findByKey(base_option.current_city_filter[_level],'name', item.name);  
        }
        
        if (_tmp_target && _tmp_target.checked == 0) {
            item.pv = 0;
            item.uv = 0;
            excluded = true;
        }

        if (level == 1) {
            _radius = radius;//对于区的radius直接使用用户自己设置的距离
            if (_tmp_target && _tmp_target.checked == 1) {
                //找exclude 中street / poi
                _tmp_street_array = base_option.current_city_filter.street.filter(function(i) {
                    return i.district == item.name && i.checked == 0;
                });

                _tmp_poi_array = base_option.current_city_filter.poi.filter(function(i) {
                    return i.district == item.name;
                });

                for (var i = 0; i < base_option.analysis_result.street.length; i++) {
                    var _tmp_street_item = base_option.analysis_result.street[i];
                    if (_findByKey(_tmp_street_array,'name', _tmp_street_item.name)) {
                        _tmp_pv += _tmp_street_item.pv;
                        _tmp_uv += _tmp_street_item.uv;
                    }
                }
                for(var j=0; j<_tmp_poi_array.length; j++){
                    var _tmp_cur_poi = _findByKey(base_option.analysis_result.poi,'location',_tmp_poi_array[j].location);
                    if(_tmp_cur_poi){
                        _tmp_pv += _tmp_cur_poi.pv;
                        _tmp_uv += _tmp_cur_poi.uv;
                    }
                }
                item.pv  -= _tmp_pv;
                item.uv  -= _tmp_uv;
            }
        } else if (level == 2) {
            _radius = 1.5;
            if (_tmp_target && _tmp_target.checked == 1) {
                //找exclude  poi 中当前街道的poi
                _tmp_poi_array = base_option.current_city_filter.poi.filter(function(i) {
                    return i.street == item.name;
                });


                var _tmp_init_poi = base_option.analysis_result.poi.filter(function(i){
                    return i.street == item.name && i.district == item.district;
                });

                for (var i = 0; i < _tmp_poi_array.length; i++) {
                    var _tmp_cur_poi = _findByKey(_tmp_init_poi,'location', _tmp_poi_array[i].location);
                    if (_tmp_cur_poi) {
                        _tmp_pv += _tmp_cur_poi.pv;
                        _tmp_uv += _tmp_cur_poi.uv;
                    }
                }
                item.pv = item.pv - _tmp_pv;
                item.uv = item.uv - _tmp_uv;
            }
            var _tmp_target_parent = _findByKey(base_option.current_city_filter.district,'name', item.district);
            if (!_tmp_target && _tmp_target_parent && (_tmp_target_parent.checked == 0)) { //如果不在filter street中 可能其父级区时不选的
                item.pv = 0;
                item.uv = 0;
                excluded = true;
            }
        } else if (level == 3) {
            _radius = 0.1;
            var _tmp_target_top = _findByKey(base_option.current_city_filter.district,'name', item.district);
            var _tmp_target_parent = _findByKey(base_option.current_city_filter.street,'name', item.street);
            if (!_tmp_target) { // 1 其父级街道不选  或是 2 其父级区不选（街道也没有）
                if ((_tmp_target_parent && (_tmp_target_parent.checked == 0)) || (_tmp_target_top && _tmp_target_top.checked == 0)) {
                    item.pv = 0;
                    item.uv = 0;
                    excluded = true;
                }
            }else{
                excluded = true;
            }
        }

        marker_offset = new AMap.Pixel(-20, -34);

        var marker = new AMap.Marker({
            content: _createInfoBox($elem,item, excluded),
            // icon:'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            // position: item.location.split(',').reverse(),
            position: lng_lat,
            offset: marker_offset,
            extData: {
                type:'point',
                name: item.name
            }
        }).on('click',function(){_markerClick($elem,this.getExtData().name,level)});

        var circle = new AMap.Circle({
            center: lng_lat, // 圆心位置
            radius: _radius*1000, //半径
            strokeColor: "#F33", //线颜色
            strokeOpacity: 0, //线透明度
            resizeEnable:true,
            strokeWeight: 3, //线粗细度
            zIndex: 1000,
            fillColor: excluded ? base_option.fillColor.gray : base_option.fillColor.normal , //填充颜色
            fillOpacity: 0.3, //填充透明度
            extData: {
                type:'circle',
                name: item.name
            }
        }).on('click',function(){
        	if ($elem.data("noclick")) {

        	}else{
        		_markerClick($elem,this.getExtData().name,level);
        	}
        }).on('mouseover', function() {
            if(this.getOptions().fillColor != base_option.fillColor.gray){
               this.setOptions({
                   fillOpacity: 0.5,
                   zIndex: 1200
               }); 
            }
            if (level != 1) return;
            _showDistrictArea($elem,item.name);
        }).on('mouseout', function() {
            base_option.mapObj.remove(base_option.polygons);
            if(this.getOptions().fillColor == base_option.fillColor.gray) return;
            this.setOptions({
                fillOpacity: 0.3,
                zIndex: 1000
            });
        });
        marker.setMap(base_option.mapObj);
        circle.setMap(base_option.mapObj);
        //根据类型判断
        if($elem.find(".lbs-control .selected").attr("data-id")!="footFallMap"){
        	marker.hide();
        	circle.hide();
        }
        base_option.markers.push(circle); //收集所有marker
        base_option.markers.push(marker); //收集所有marker
	}
	function _createInfoBox($elem,item, excluded){
		var base_option = $elem.data('base_option');
		var exclude_class = excluded ? 'gray' : '';
	    var _location = item.lat ?  item.lat+','+item.lng : item.location;
		var check_class = $elem.find('.lbs-area-box').find('label[location="'+_location+'"]').find("i").attr("class");
	    content = '<div location="'+_location+'" data-id="" class="lbs-infowindow-box ' + exclude_class + '" style="position:relative;" >' + '<img src="../images/marker.png" alt="" />' + '<div class="lbs-infowindow" >' + '<p class="name" ><label location="'+_location+'" title="'+item.name+'"><i class="'+check_class+'"></i><em>' + item.name + '</em></label></p>' + '<p>Ad Opportunity：<span class="pv-num">' + _commaft(item.pv) + '</span></p>' + '<p>Unique Audience：<span class="uv-num">' + _commaft(item.uv) + '</span></p>' + '<img class="arrow" src="../images/icon_tip.png" alt="" />' + '</div></div>';
	    return content;  
	}

	function _showDistrictArea($elem,str){
		var base_option = $elem.data('base_option');
		//加载行政区划插件
        base_option.mapObj.remove(base_option.polygons);
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                subdistrict: 1, //返回下一级行政区
                extensions: 'all', //返回行政区边界坐标组等具体信息
                level: 'city' //查询行政级别为 市
            };
            //实例化DistrictSearch
            district = new AMap.DistrictSearch(opts);
            district.setLevel('district');
            //行政区查询
            district.search(str, function(status, result) {
                var bounds = result.districtList[0].boundaries;
                if (bounds) {
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: base_option.mapObj,
                            strokeWeight: 1,
                            path: bounds[i],
                            fillOpacity: 0.7,
                            fillColor: '#CCF3FF',
                            strokeColor: '#CC66CC'
                        });
                        base_option.polygons.push(polygon);
                    }
                    // map.setFitView();//地图自适应
                }
            });
        });
	}

	function _markerClick($elem,name,level){
		var base_option = $elem.data('base_option');
        console.log('当前名称：' + name)
        if (level == 2 || level == 'street') {
            base_option.dom.street_filter.val(_findIndexByKey(base_option.current_street,'name', name)).trigger("liszt:updated").trigger('change');
        }

        if (level == 1 || level == 'district') {
            base_option.dom.district_filter.val(_findIndexByKey(base_option.current_district,'name', name)).trigger("liszt:updated").trigger('change');

        }
	}

	function _cityChange($elem,data){
        var base_option = $elem.data('base_option');

        _createList($elem,base_option.analysis_result.district, 0);

        //先获取该区下的街道
        _setCurStreet($elem,base_option.analysis_result.district[0].name, 1);
        //先获取该街道下的所有店铺
        _setCurPoi($elem,base_option.current_street[0].name, 1);
	}

	function _maplistItemClick($elem){
		var base_option = $elem.data('base_option');
        $elem.on('click', '.lbs-area-box label', function(ev) {
            var _level = $(this).attr('level');
            var _name = $(this).find('em').eq(0).text();
            var _location = $(this).attr('location');
            var target_dom = ev.target.nodeName;
            var _this = this;
           
            if (target_dom == 'EM'){//如果点击的是文本进入其下级
                _markerClick($elem,_name,_level); 
                return;
            }; 
            
            var is_checked = _custom_checked($(_this));
            var tmp_infowindow = $elem.find('.lbs-infowindow-box[location="'+_location+'"]');
            var _circle = base_option.markers.filter(function(item){
                var _tmp_data = item.getExtData();
                return _tmp_data.name == _name && _tmp_data.type == 'circle';
            });
            _custom_checked(tmp_infowindow,is_checked);
            if (is_checked) { //控制地图marker样式
                tmp_infowindow.removeClass('gray');
                _circle[0].setOptions({
                    fillColor:base_option.fillColor.normal
                });
                _infoRealTimeComputed($elem,{
                    target:tmp_infowindow, 
                    level:_level, 
                    location:_location,
                    name:_name
                });
            } else {
                tmp_infowindow.addClass('gray');
                _circle[0].setOptions({
                    fillColor:base_option.fillColor.gray
                });
                _infoRealTimeComputed($elem,{
                    target:tmp_infowindow, 
                    level:_level, 
                    location:_location,
                    name:_name,
                    empty:true
                });
            }

            if (_level == 'district') {
                _districtClick($elem,_name, is_checked);
                //该district下的所有 街道 是否在exclede steet  字段中 有的haul去掉
                //改district下所有店铺 是否在 exclede poi 中有的haul去掉
                //如果点击distric item 的区 和 street box 顶部select显示的区一致 则更新其下的list
                if ($(this).attr('index') == base_option.dom.district_filter.val()) {
                    _setCurStreet($elem,base_option.analysis_result.district[$(this).attr('index')].name, 1);
                    _setCurPoi($elem,base_option.current_street[0].name, 1);
                }
            }

            var street_click = function(obj, is_checked) {
                var parent_name = base_option.current_street[0].district;
                //要知道当前 item平级有多少个
                var box_praent = $(obj).parents('.lbs-item-list');
                var total_items = box_praent.children();
                var checked_o_items = box_praent.find('.fa-square-o');
                var checked_half_items = box_praent.find('.fa-minus-square');

                var parent_node = $elem.find('.lbs-item-list').eq(0).find('label:contains("' + parent_name + '")');
                if (checked_o_items.length == total_items.length) {
                    //点完当前平级全部不选 =》其父级区 不选  => exclude 取其父级区名 同上一级 区选中取消逻辑
                    _districtClick($elem,parent_name, false);
                    // 让对应父级 不选
                    _custom_checked(parent_node,false);
                } else if (checked_o_items.length == 0 && checked_half_items.length == 0) {
                    //点完当前所有平级全选 =》其父级区 选中  => exclude 取其父级区名 同上一级 区选中取消逻辑
                    _districtClick($elem,parent_name, true);
                    // 让对应父级 选中
                    _custom_checked(parent_node,true);
                } else {
                    _custom_checked(parent_node,-1);
                    _districtClick($elem,parent_name, -1);
                    var half_item_array = [];

                    half_item_array = base_option.current_city_filter.street.filter(function(item) {
                        return item.district == parent_name && item.checked == 1;;
                    });

                    base_option.current_city_filter.street = base_option.current_city_filter.street.filter(function(item) {
                        return item.district != parent_name;
                    });

                    base_option.current_city_filter.street.concat(half_item_array);

                    checked_o_items.each(function() {
                        base_option.current_city_filter.street.push({
                            name: $(this).siblings('em').text(),
                            district: base_option.current_street[0].district,
                            checked: 0
                        });
                    });
                    checked_half_items.each(function() {
                        base_option.current_city_filter.street.push({
                            name: $(this).siblings('em').text(),
                            district: base_option.current_street[0].district,
                            checked: 1
                        });
                    });
                    //排除掉poi中其父级街道已经选中或不选中的
                    base_option.current_city_filter.poi = base_option.current_city_filter.poi.filter(function(item){
                        var _tmp_cur_poi = _findByKey(base_option.current_city_filter.street,'name',item.street);
                        if (!_tmp_cur_poi) {
                            return false;
                        } else {
                            if (_tmp_cur_poi.checked == 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                }
            };

            if (_level == 'street') {
                street_click(this, is_checked);

                if ($(this).attr('index') == base_option.dom.street_filter.val()) {
                    _setCurPoi($elem,base_option.current_street[0].name, 1);
                }
            }

            if (_level == 'poi') {
                var parent_name = base_option.dom.street_filter.find("option:selected").text();
                //要知道当前 item平级有多少个
                var total_items = $(this).parents('.lbs-item-list').children();
                var checked_o_items = $(this).parents('.lbs-item-list').find('.fa-square-o');

                var parent_node = $elem.find('.lbs-item-list').eq(1).find('label:contains("' + parent_name + '")');


                base_option.current_city_filter.poi = base_option.current_city_filter.poi.filter(function(item) {
                    return item.street != parent_name;
                });

                if (total_items.length == checked_o_items.length) {
                    _custom_checked(parent_node,false);
                    street_click(parent_node, -1);
                } else if (checked_o_items.length == 0) {
                    _custom_checked(parent_node,true);
                    street_click(parent_node, true);
                } else {
                    _custom_checked(parent_node,-1);
                    street_click(parent_node, -1);

                    base_option.current_city_filter.street = base_option.current_city_filter.street.filter(function(item) {
                        return item.name != parent_name;
                    });

                    base_option.current_city_filter.street.push({
                        district: base_option.current_street[0].district,
                        name: parent_name,
                        checked: 1
                    });

                    checked_o_items.each(function() {
                        base_option.current_city_filter.poi.push({
                            district: base_option.current_street[0].district,
                            street: parent_name,
                            location:$(this).parent().attr('location'),
                            name: $(this).siblings('em').text(),
                            checked: 0
                        });
                    });
                }
            }
            _totalComputed($elem);//所有筛选结束后统计pv uv 并更新底部汇总显示
        });
	}

	function _maplistItemHover($elem){
		var base_option = $elem.data('base_option');
        var _timer = null;
        $elem.on('mouseenter', '.lbs-area-box label', function(ev) {
            var _this = this;
            _timer = setTimeout(function(){
              base_option.mapObj.setCenter($(_this).attr('location').split(',').reverse()); 
            },500);
            
        }).on('mouseleave','.lbs-area-box label',function(ev){
            clearTimeout(_timer);
        });
    }

	function _findByKey(arr,key,value){
		for(var ii=0; ii<arr.length;ii++){
            if(arr[ii][key]==value){
                return arr[ii];
                break;
            }
        }
	}

	function _findIndexByKey(arr,key,value){
		for(var ii=0; ii<arr.length;ii++){
            if(arr[ii][key]==value){
                return ii;
                break;
            }
        }
	}

	function _totalComputed($elem) {
		var base_option = $elem.data('base_option');
		var filter_total = $elem.data('filter_total');
		var analysis_db = $elem.data('analysis_db');
        var total = analysis_db.total // 全部城市的pv uv 汇总数据
        var total_pv = 0;
        var total_uv = 0;
        console.log('totalComputed begin', filter_total, total, total_pv, total_uv)
        var city_filter = function(cur_filter) {

            var tmp_district = cur_filter.district.filter(function(item) {
                return item.checked == 0;
            });

            var tmp_street = cur_filter.street.filter(function(item) {
                return item.checked == 0;
            });

            var init_data = _findByKey(analysis_db.city,'city', cur_filter.city);

            for (var i = 0; i < init_data.district.length; i++) {

                var _tmp = init_data.district[i];
                if (_findByKey(tmp_district,'name', _tmp.name)) {
                    total_pv += _tmp.pv;
                    total_uv += _tmp.uv;
                }
            }

            for(var i=0; i < tmp_street.length; i++ ){
                var _tmp_data_street = init_data.street.filter(function(item){
                    return item.district == tmp_street[i].district;
                });

                var _tmp_target_street = _findByKey(_tmp_data_street,'name',tmp_street[i].name);
                if(!_tmp_target_street) continue;
                total_pv += _tmp_target_street.pv;
                total_uv += _tmp_target_street.uv;
            }
            for (var i = 0; i < cur_filter.poi.length; i++) {
                var _tmp_poi = cur_filter.poi[i];
                var _tmp_data_poi = init_data.poi.filter(function(item){
                    return item.location == _tmp_poi.location;
                });
                if(!_tmp_data_poi[0]) continue;
                total_pv += _tmp_data_poi[0].pv;
                total_uv += _tmp_data_poi[0].uv;
            }
            console.log('totalComputed end', total, total_pv, total_uv)
        };

        for (var i = 0; i < filter_total.length; i++) {
            city_filter(filter_total[i]);
        }

        $elem.find("[name='impressions_sum']").find("p").last().html(_commaft(total.pv - total_pv));
        $elem.find("[name='audience_sum']").find("p").last().html(_commaft(total.uv - total_uv));

    }

	function _custom_checked($elem,checked) { //自定义元素选中不选
        var icon;  // checked true 选中 false 不选 -1 部分选中
        if ($elem.find('i').length > 0) {
            icon = $elem.find('i');
        } else if ($elem[0].nodeName.toLowerCase() == 'i') {
            icon = $elem;
        }

        if (checked == true) {
            icon.removeClass('fa-square-o fa-minus-square').addClass('fa-check-square');
        } else if (checked == false) {
            icon.removeClass('fa-check-square fa-minus-square').addClass('fa-square-o');
        } else if(checked == -1){
            icon.removeClass('fa-check-square fa-square-o').addClass('fa-minus-square');
        } else {
            if (icon.hasClass('fa-check-square') || icon.hasClass('fa-minus-square')) {
                icon.removeClass('fa-check-square fa-minus-square').addClass('fa-square-o');
                checked = false;
            } else {
                icon.removeClass('fa-square-o').addClass('fa-check-square');
                checked = true;
            }
        }
        return checked;
    }

    function _infoRealTimeComputed($elem,options) {
    	var base_option = $elem.data('base_option');
        if (options.empty) {
            options.target.find('.pv-num').eq(0).html(0);
            options.target.find('.uv-num').eq(0).html(0);
            return;
        }
        var _filter_obj = options.level == 'district' ? base_option.current_district : (options.level == 'street' ? base_option.current_street : base_option.current_poi);
        if (options.level == 'poi') {
            var _total_result = _findByKey(base_option.current_poi,'location', options.location);
        } else {
            var _total_result = _findByKey(_filter_obj,'name', options.name);
        }
        options.target.find('.pv-num').eq(0).html(_commaft(_total_result.pv));
        options.target.find('.uv-num').eq(0).html(_commaft(_total_result.uv));
    }

    function _districtClick($elem,_name, is_checked) {
    	var base_option = $elem.data('base_option');
        var tmp_index = _findIndexByKey( base_option.current_city_filter.district,'name', _name);
        base_option.current_city_filter.district = base_option.current_city_filter.district.filter(function(item) {
            return item.name != _name;
        });

        if (is_checked == true || is_checked == 0) {
            base_option.current_city_filter.street = base_option.current_city_filter.street.filter(function(item) {
                return item.district != _name;
            });

            base_option.current_city_filter.poi = base_option.current_city_filter.poi.filter(function(item) {
                return item.district != _name;
            });
        }
        console.log('district', is_checked)
        if (!is_checked || is_checked == -1) {
            //是否在exclede district 字段中 有去掉
            base_option.current_city_filter.district.push({
                name: _name,
                checked: Math.abs(Number(is_checked))
            });
        }
    }

    function _filterResult(list, filterkey, filter){
    	// filterkey: '' 过滤 list的结果 筛选需要的数据的key  不设置默认全部
        // filter: ''    过滤 list的结果 筛选需要的数据的值
        var result;
        if (filterkey) {
            result = list.filter(function(item) {
                return item[filterkey] == filter;
            });
        } else {
            result = list;
        }
        return result;
    }

    function _setCurStreet($elem,districtname, type) {
        // type=>(不设 || 0) 只更新数据
        // type=>1 并更新相应list dom结构  type=>2 并显示当前层级地图和更新marker
        var base_option = $elem.data('base_option');
        base_option.current_street = _filterResult(base_option.analysis_result.street, 'district', districtname);
        if (!type) return;
        if (type == 1 || type == 2) {
            _createList($elem,base_option.current_street, 1);
        }
        console.log('ditrict change', type)
        if (type == 2) {
            base_option.mapObj.setZoom(base_option.LEVEL_2_ZOOM);
            _setMarkers($elem,{
                marker_list: base_option.current_street,
                level: 2,
            });
        }
    }

    function _setCurPoi($elem,streetname, type) { //type 同setCurStreet 参数
        var base_option = $elem.data('base_option');
        base_option.current_poi = _filterResult(base_option.analysis_result.poi, 'street', streetname);
        if (!type) return;
        if (type == 1 || type == 2) {
            _createList($elem,base_option.current_poi, 2);
        }
        if (type == 2) {
            base_option.mapObj.setZoom(base_option.LEVEL_3_ZOOM);
            _setMarkers($elem,{
                marker_list: base_option.current_poi,
                level: 3,
            });
        }
    }

    function _createList($elem,list, index) {
        var base_option = $elem.data('base_option');
        var oParent = $elem.find('.lbs-list-box').eq(index).find('ul.lbs-item-list');
        var select2_data = [];
        var _level = index == 0 ? 'district' : (index == 1 ? 'street' : 'poi');
        oParent.empty();

        var createItem = function(item, ii, level) {
            var oLi = $('<li>');
            var _location = item.lat ? item.lat + ',' + item.lng : item.location;
            var check_class = item.checked == 0 ? 'fa-square-o' : (item.checked == 1 ? 'fa-minus-square' : 'fa-check-square');
            var oLabel = '<label index="' + ii + '" location="' + _location + '" title="' + item.name + '" level="' + level + '"><i class="fa ' + check_class + '"></i><em>' + item.name + '</em></label>';

            oLi.append(oLabel);       
           
            if(level != 'poi'){
                oLi.append('<i class="fa fa-angle-right"></i>');
            }
            return oLi;
        };

        //要判断相应级别item的选中状态 对list数据进行处理
        var filler_array = base_option.current_city_filter[_level];
        var _empty_parent = [];
        var _empty_sub_parent = [];

        if (list[0].district) {
            _empty_parent = base_option.current_city_filter.district.filter(function(item) {
                return item.checked == 0 && item.name == base_option.current_street[0].district;
            });
        }
        //当前街道的区是不是checked = 0
        if (list[0].district && !list[0].street) { //街道渲染

            filler_array = filler_array.filter(function(item) {
                return item.district == base_option.current_street[0].district;
            });
        }

        if (list[0].street) { //店铺渲染

            _empty_parent = base_option.current_city_filter.district.filter(function(item) {
                return item.checked == 0 && item.name == base_option.current_street[0].district;
            });

            _empty_sub_parent = base_option.current_city_filter.street.filter(function(item) {
                return item.checked == 0 && item.name == base_option.current_poi[0].street;
            });

            filler_array = filler_array.filter(function(item) {
                return item.street == base_option.current_poi[0].street;
            });
            console.log('店铺渲染', _empty_parent)
        }

        var tmp_list = $.extend(true, [], list); //断开与传入list的引用关系 不影响下次结果

        for (var i = 0; i < tmp_list.length; i++) {
            if (_empty_parent.length > 0 || (tmp_list[0].street && _empty_sub_parent.length > 0)) {
                tmp_list[i].checked = 0;
            } else {
                for (var j = 0; j < filler_array.length; j++) {
                    if(index == 2){ //poi时用location来判断防止重名店铺干扰
                        if (tmp_list[i].location == filler_array[j].location) {
                            tmp_list[i].checked = filler_array[j].checked;
                        }
                    }else{
                        if (tmp_list[i].name == filler_array[j].name) {
                            tmp_list[i].checked = filler_array[j].checked;
                        } 
                    }
                }
            }
            select2_data.push('<option value="'+i+'">'+tmp_list[i].name+'</option>');

            oParent.append(createItem(tmp_list[i], i, _level));
        }
        if (index == 0) {

            if (base_option.dom.district_filter.hasClass("chzn-done")) {
                base_option.dom.district_filter.html(select2_data.join(""));
                base_option.dom.district_filter.trigger("liszt:updated");
            }else{
            	base_option.dom.district_filter.html(select2_data.join(""));
            	base_option.dom.district_filter.chosen({
                    width: 199,
                })
            }
            
        }

        if (index == 1) {

            if (base_option.dom.street_filter.hasClass("chzn-done")) {
                base_option.dom.street_filter.html(select2_data.join(""));
                base_option.dom.street_filter.trigger("liszt:updated");
            }else{
            	base_option.dom.street_filter.html(select2_data.join(""));
            	base_option.dom.street_filter.chosen({
	                width: 199,
	            });
            }
            
        }

    }
    function _modalHtml($elem,opts){
    	var translate = $.fn.lbs.langConfig[opts.lang],
    	    editHtml =  '<div class="modal fade" style="display:none;">'+
						'       <div class="modal-dialog" style="width:800px;">'+
						'         <div class="modal-content">'+
						'           <div class="modal-body">'+
						'             <p class="modal-title" style="font-size:20px;">'+translate["edit"]+'</p>'+
						'             <div class="plan-container" style="padding:0;">'+
						'               <form class="form-horizontal"  method="post">'+
						'                 <div class="plan-group">'+
						'					<div class="plans">'+
						'						<div class="location-con">'+
				        '                         <div class="location-suggest-con">'+
				        '                           <label class="location-label">'+translate["keywords"]+'</label>'+
				        '                           <div style="position:relative;">'+
				        '                             <input type="text" value="" id="tipinput" placeholder="'+translate["search"]+'" name="Locations">'+
				        '                           </div>'+
				        '                           <div class="plus-area">            '+
				        '                             <i class="fa fa-plus-circle"></i>  '+         
				        '                              <button class="btn dropdown-toggle" type="button">'+
				        '                               '+translate["addkeyword"]+'&nbsp;            '+
				        '                              </button>  '+
				        '                           </div>'+
				        '                         </div>'+
				        '                         <div class="location-suggest-con">'+
				        '                           <label class="location-label">'+translate["distance"]+'</label>'+
				        '                           <div class="slide-bar" style="width:380px;">'+
				        '                           </div>'+
				        '                         </div>'+
				        '                         <div class="location-suggest-con">'+
				        '                           <label class="location-label">'+translate["city"]+'</label>'+
				        '                           <div class="cityChoose_city">'+
				        '                           </div>'+
				        '                         </div>'+
				        '                       </div>'+
						'					</div>'+
						'				  </div>'+
						'               </form>'+
						'             </div>'+
						'           </div>'+
						'           <div class="modal-footer" style="background-color:#fff;">'+
						'             <button type="button" style="float:left;" class="btn btn-success analysis" >'+translate["save"]+'</button>'+
						'             <button type="button" style="float:left;" class="btn btn-cancel" data-dismiss="modal">'+translate["cancel"]+'</button>'+
						'             <label style="display:none;color:#ef4136;float:left;line-height:30px;margin-left:10px;">'+translate["noDataBox"]+'</label>'+
						'           </div>'+
						'         </div>'+
						'       </div>'+
						'     </div>';
		return editHtml;				
    }

    function _isChanged(current_params,params){
    	var isChanged = false;
    	if (!current_params) return true;
    	var currentCity = current_params.cities.map(function(){
    		return this.id;
    	}).join(",");
    	var newCity = params.cities.map(function(){
    		return this.id;
    	}).join(",");
    	if (!_isArrayEqual(current_params.keywords,params.keywords)) {
    		isChanged = true;
    	}else if(currentCity!=newCity){
    		isChanged = true;
    	}else if(String(current_params.distance) != String(params.distance)){
    		isChanged = true;
    	}
    	return isChanged;
    }

    function _isArrayEqual(arr,arr2){
    	if(!(arr instanceof Array) || !(arr2 instanceof Array)){
            throw new Error('参数需要是数组');
        }
        if(JSON.stringify(arr) == JSON.stringify(arr2)){
            return true;
        }
        return false;
    }	

	function _commaft(n) {
        var re = /\d{1,3}(?=(\d{3})+$)/g;
        var n1 = String(n).replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });
        return n1;
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

	function _call(elem,func,param){
		if(func && typeof func === 'function'){
			if(param){
				func.call(elem, param);
			}else{
				return func.call(elem);
			}
		}
	}

	function _initSlidebar(){
		$.fn.sliderBar = function(params,callback){
            var _self = this;
            var options;
            var init = {
                current:1, //当前bar显示在哪个刻度位置
                data:[1,20], 
                step:0.5,
                scale:1,
                unit:'km' //x轴刻度单位
            };

            options = $.extend(init,params);

            //取值
            if(params == undefined){
                return $(_self).data('current');
            }

            $(_self).data('current',params.current);

            options.current = options.current / options.scale;

            var $scalewrap = $('<div class="sliderBar-wrap"></div');
            var $bar = $('<div class="sliderBar-bar"><span></span></div>');
            var real_val = $('<div class="realval" >'+options.current+'km</div>');

            $scalewrap.append($bar).append(real_val);

            $(_self).append($scalewrap);

            var parentWidth = $bar.parent().parent().width()-$bar.width();
            var bar_scale = (options.data[1] - options.data[0]) / parentWidth;

            var init_left = (options.current - options.data[0])/bar_scale;

            $bar.css('left',init_left);
           
            //bar x轴拖动
            $bar.on('mousedown',function(ev){
                var _bar = this;
                var parentLeft = $(_bar).parent().offset().left;
                var curval;
                var distance = ev.pageX - $(this).offset().left;
                $(document).on('mousemove',function(ev){
                    var left_dis = ev.pageX - distance - parentLeft;
                    ev.preventDefault();
                   
                    if(left_dis <= 0){
                        left_dis = 0;
                    }else if(left_dis >= parentWidth){
                        left_dis = parentWidth;
                    }

                    curval = left_dis*bar_scale;
                    curval = curval - curval%options.step;

                    curval = curval > options.data[1] ? options.data[1] : curval;

                   $('.sliderBar-wrap .realval').html(Number(options.data[0]) + Number(curval) +options.unit);
                   $(_bar).css('left',left_dis);

                }); 
                var oScale = $(_bar).parent().find('.slider-item');
                
                $(document).on('mouseup',function(){
                    var oBarLeft = $bar.position().left;
                    $(_self).data('current',Number(options.data[0]*options.scale) + Number(curval*options.scale));
                    callback && callback();
                    $(document).off('mousemove');
                });
            });
		}
	}

	function _addOneKeyword(self,opts){
		var translate = $.fn.lbs.langConfig[opts.lang];
		for (var i = 0; i < opts.params.keywords.length; i++) {
			if (i==0) {
				self.find(".plus-area").prev().find("input").val(opts.params.keywords[i]);
			}else{
				var id = "tipinput_"+new Date().getTime();
				var $clone= $('<div style="position:relative"><input type="text" value="'+opts.params.keywords[i]+'" id="'+id+'" placeholder="'+translate["search"]+'" name="Locations"><i class="fa fa-remove input-remove"></i></div>');
				self.find(".plus-area").before($clone);
			}
		};
		self.find(".plus-area .btn").off("click").on("click",function() {
          var length = $(this).parent().parent().find("input").length,max=5;
          var id = "tipinput_"+new Date().getTime();
          var $clone= $('<div style="position:relative"><input type="text" value="" id="'+id+'" placeholder="'+translate["search"]+'" name="Locations"><i class="fa fa-remove input-remove"></i></div>');
          $(this).parent().before($clone);
          if (length == max-1) {
            $(this).parent().hide();
          }
          $clone.find("input").focus();
        })
        self.on("click",".modal .input-remove",function(){
	      var $form = $(this).parents(".location-suggest-con");
	      $(this).parent().parent().find(".plus-area").show();
	      $(this).parent().remove();
	      disableVerify($form);
	    })
        self.on("keyup",".modal [name=Locations]",function(){
	      disableVerify($(this).parents(".location-suggest-con"));
	    })
	    function disableVerify($form) {
	      var isEmpty = true;        
	      $form.find("[name='Locations']").each(function(i) {
	        if ($(this).val()!="") {
	          isEmpty = false;
	        }
	      })
	      // $form.find(".word-save").attr("disabled",isEmpty);
	    }
	}

	$.fn.lbs = function(method){
		if (methods[method]) {
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method === 'object' || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error('Method ' + method + ' does not exist on lbs.plugin');
		}
	}

	$.fn.lbs.defaults = {
		lang:'en',
		lbsData:'',
		heatmapData:'',
		cityJson:'',
		isReload:false,
		params:{name:'',keywords:[],distance:"1",cities:[],filter_total:[]},
		onGetLbsData:function(params,callback){console.log(1);callback(params.lbsData,params.heatmapData)},
		onSaveLocation:function(params,callback){callback();},
		onInit:function(){},
		onComplete : function(){},
		onNoData:function(opts,reset){
			var self = this,
				translate = $.fn.lbs.langConfig[opts.lang],
				html = '<div  class="modal fade" tabindex="-1" data-backdrop="static" style="z-index: 1051;" role="dialog">'+
							'<div class="modal-dialog modal-sm" role="document">'+
							    '<div class="modal-content">'+
							        '<div class="modal-body">'+
							            '<div class="del-confirm-container">'+
							            	'<p class="del-confirm-content">'+translate["noDataBox"]+'</p>'+
							            '</div>'+
								'		<div class="del-confirm-btn">'+
							            	'<button type="button" class="btn btn-success reset"  data-dismiss="modal">'+translate["ok"]+'</button>'+
							            '</div>'+
							        '</div>'+
							    '</div>'+
							'</div>'+
						'</div>';
			self.find(".modal").remove();
			self.find(".lbs-container").append(html);
			self.find(".reset").on("click",function(){
				if (reset) {
					$(".modal-backdrop").remove();
					setTimeout(function(){
						_call(self,opts.onEdit,opts);
					},300);
				};
			})
			self.find(".modal").modal("show");
		},
		onSave: function(opts){
			var self = this,
			    translate = $.fn.lbs.langConfig[opts.lang];
			var pdata = {
                _id: opts.params.id,
                name: opts.params.name,
                dim_location: opts.params.cities.map(function(v){return v.id}),
                filter: JSON.stringify(self.data("filter_total")),
                radius: opts.params.distance,
                keywords: opts.params.keywords, //获取关键字，数组形式,
            };
            console.log(pdata);
            opts.onSaveLocation(pdata,function(){
            	self.find(".lbs-unsave-tip").hide();
            	console.log("save success");
            })
		},
		onEdit:function(opts){
			var self = this,
			    translate = $.fn.lbs.langConfig[opts.lang],
			    html = _modalHtml(self,opts);
			self.find(".modal").remove();
			self.append(html);
			//add one more keyword
			_addOneKeyword(self,opts)

	        //radius
	        if(!$.fn.sliderBar || typeof $.fn.sliderBar !== 'function'){
	        	_initSlidebar();
	        }
	        self.find(".slide-bar").sliderBar({current:opts.params.distance},function(){
	        });

	        //city
	        var cityData = [];
	        if ($.fn.cityChoose && typeof $.fn.cityChoose === 'function' && opts.cityJson) {
	        	self.find(".cityChoose_city").cityChoose({
		          data:opts.cityJson,
		          results:opts.params.cities,
		          lang:opts.lang,
		          max:10,
		          callback:function(results){
		          	cityData = results;
		          }
		        });
	        };

	        //save
	        self.find(".analysis").on('click',function(){
	        	var _temp_params = $.extend(true,{},opts.params);
		        _temp_params.keywords = self.find('[name=Locations]').map(function(){ if($.trim($(this).val())!="") return $(this).val()}).get();
		        _temp_params.distance = self.find(".slide-bar").sliderBar();
		        _temp_params.cities = self.find(".cityChoose_city").cityChoose("data");
		        _temp_params.filter_total=[];
		        var isChanged = _isChanged(_temp_params,opts.params);
		        console.log("参数是否改变：",_temp_params,opts.params,isChanged)
		        if (!isChanged) {
		        	self.find(".modal").modal("hide");
		        	return;
		        }
		        opts.onGetLbsData(_temp_params,function(lbsData,heatmapData){
		        	var target_data = _getData(null,{
		        		lbsData:lbsData,//lbs数据
		        		params:_temp_params,
		        	});
		        	if (target_data) {
		        		self.find(".modal").modal("hide");
			        	setTimeout(function(){
			        		var newOpts = $.extend(opts,{
					          lbsData:lbsData,//lbs数据
					          heatmapData:heatmapData,
					          cityJson:opts.cityJson,//城市组件数据
					          isReload:true,
					          params:_temp_params,
					        });
			        		self.lbs(newOpts);
			        	},500)
		        	}else{
		        		self.find(".modal-footer label").show();
		        	}
		        })
	        })
			self.find(".modal").modal("show");
		},
		callback:function(results){console.log(results)}
	}

	$.fn.lbs.langConfig = {
		'zh':{
			'edit':'Edit Footfall Targeting',
			'myBrand':'My brand',
			'keywords':'keywords',
			'distance':'Distance',
			'cities':'Selected City(ies)',
			'locations':'Locations',
			'search':'Search',
			'districts':'Districts',
			'city':'City',
			'streets':'Streets',
			'save':'Save Locations',
			'impressions':'Estimated Impressions',
			'audience':'Estimated Number of Audience',
			'impressions_small':'Est. Impressions',
			'audience_small':'No. of Audience',
			'footFall':'Hyperlocation',
			'heatMap':'Heat Map',
			'save':'Save',
			'cancel':'Cancel',
			'addkeyword':'Add a keyword',
			'savelocation':'Save Locations',
			'noDataTip':'There are unsaved changes in footfall analysis. You can save to the plan now.',
			'noDataBox':'There is no data in the selected city.',
			'ok':'Ok'
		},
		'en':{
			'edit':'Edit Footfall Targeting',
			'myBrand':'My brand',
			'keywords':'keywords',
			'distance':'Distance',
			'cities':'Selected City(ies)',
			'locations':'Locations',
			'search':'Search',
			'districts':'Districts',
			'city':'City',
			'streets':'Streets',
			'save':'Save Locations',
			'impressions':'Estimated Impressions',
			'audience':'Estimated Number of Audience',
			'impressions_small':'Est. Impressions',
			'audience_small':'No. of Audience',
			'footFall':'Hyperlocation',
			'heatMap':'Heat Map',
			'save':'Save',
			'cancel':'Cancel',
			'addkeyword':'Add a keyword',
			'savelocation':'Save Locations',
			'noDataTip':'There are unsaved changes in footfall analysis. You can save to the plan now.',
			'noDataBox':'There is no data in the selected city.',
			'ok':'Ok'
		}
	}
})(jQuery)