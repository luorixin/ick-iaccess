var IAX_PLANNER = {
	colorMap : ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'],
	brandData: [],
	sets: [],
	maxkeywords : 7,
	init : function(){
		this.bindEvent();
	},
	bindEvent: function(){
	  //关键词删除相关
	  var _this = this;
      $(".keywords-tag").on("click","i",function(){
        var constLen = _this.maxkeywords,constLast=1;
        var $li = $(this).parent();
        var li_id = $li.attr("id");
        var $con = $li.parent().parent();
        var lengthOut = $li.siblings(".keywords-tag").length;
        if (lengthOut > constLast-1 || $li.parent().hasClass("keyword-hide")) {
          $(this).parent().remove();
        };

        if (lengthOut==constLen-1 && !$li.parent().hasClass("keyword-hide")) {
          $(".keywords-more").before($con.find(".keyword-hide>.keywords-tag:first"));
        }
        var lengthIn = $con.find(".keyword-hide>.keywords-tag").length;
        if (lengthIn==0) {
          $(".keywords-more").remove();
        }
        if (lengthOut > constLast-1 || $li.parent().hasClass("keyword-hide")) {
        //删除图表相关，例子
          _this.reDraw(li_id);
        }

        _this.initResultData();
      })

      //关键词点选
      $(document).on("click",".keywords-tag :not(i)",function(){
        $(this).parent().toggleClass("selected");
        _this.relateGraph();
        _this.initResultData();
      })

      //提示显示工具
      var time = 250;
      var hideDelay = 500;
      var hideDelayTimer = null;
      $(document).on('mouseover', '.graph-tiptool',function(){
          if (hideDelayTimer) clearTimeout(hideDelayTimer);
      });
      $(document).on('mouseover', '.graph-tiptool',function(){
          if (hideDelayTimer) clearTimeout(hideDelayTimer);
          var position = $(this).attr('data-position') || 'rightbottom';
          var id = $(this).attr('data-id');
          var width_info = parseInt($(this).attr('data-width'));
          var data_wordbreak = $(this).attr('data-wordbreak');
          var opt_offset = $(this).attr('data-offset');
          if(!id){
              id = ('a' + Math.random()).replace('.','');
          }
          $(this).attr('data-id',id);
          if($('#' + id).length > 0) return false;
          var info = $(this).find('.graph-tip-content').clone(true).addClass('graph-tip-content-showbox').attr('id',id).show();
          var top = 0;
          var left = 0;
          var offset_left = $(this).find(".graph-tip").offset().left;
          var offset_top = $(this).find(".graph-tip").offset().top;
          var width = $(this).find(".graph-tip").width();
          var height = $(this).find(".graph-tip").height();
          $('.graph-tip-content-showbox').remove(); 
          info.hide().appendTo($('body'));
          if(!!width_info) info.width(width_info);
          if(!!data_wordbreak){
              info.find('.graph-tip-content').css({'word-break':'break-all'});
          }

          if(position == 'right'){
              tar_top = offset_top + height/2 - info.outerHeight()/2;
              tar_left = offset_left + width;
          }else if(position == 'top'){
              tar_top = offset_top - info.outerHeight();
              tar_left = offset_left + width/2 - info.outerWidth()/2;
          }else if(position == 'left'){
              tar_top = offset_top + height/2 - info.outerHeight()/2;
              tar_left = offset_left - info.outerWidth();
          }else if(position == 'bottom'){
              tar_top = offset_top + height;
              tar_left = offset_left + width/2 - info.outerWidth()/2;
          }else if(position == 'rightbottom'){
              tar_top = offset_top + height;
              tar_left = offset_left + width;
          }
          if(!!opt_offset){
              opt_offset = opt_offset.split('_');
              if(opt_offset[0] == 'top'){
                  tar_top += parseInt(opt_offset[1]);
              }else if(opt_offset[0] == 'left'){
                  tar_left += parseInt(opt_offset[1]);
              }
          }
          info.addClass(position).css({top: tar_top,left: tar_left}).fadeIn(200);
          return false;
      });
      $(document).on('mouseout', '.graph-tiptool',function(){
            if (hideDelayTimer) clearTimeout(hideDelayTimer);
            hideDelayTimer = setTimeout(function () {
                hideDelayTimer = null;
                $('.graph-tip-content-showbox').remove();
                shown = false;
            }, hideDelay);
            return false;
      });
	},
	initData: function(data){
		if (!data) return;
		this.initKeywords(data.result);
		if (data.bubble.length>0) this.initBubble(data.bubble);;
		this.bindEvent();
		//默认进入第一个
		$(".keywords-tag:first").find("span").click();
	},
	initResultData: function(){
		if (this.brandData.length==0) return;
		var vsLeft="",vsRight="",vs="";
		//获取对应选中id的数据
		if($("#other_brand_0").hasClass("selected")){
          vsLeft = "0";
        };
        var vsRightArr = [];
        
        $(".keywords-other .selected").each(function(){
          vsRightArr.push($(this).attr("id").split("other_brand_")[1]);
        })
        vsRight = vsRightArr.join("_");
        if (vsLeft!="" && vsRight!="") vs="_";
        var val = vsLeft + vs +vsRight;
        var data = this.getDataFromJson(this.brandData,"id",val);
        if (data) {
        	this.initAudience(data.result);
			this.initGender(data.result);
			this.initAgeGroup(data.result);
			this.initDevice(data.result);
			this.initRegions(data.result);
			this.initInterests(data.result);
        };
	},
	initKeywords: function(data){
		var maxLi = this.maxkeywords;
		// $(".keywords-area").empty();
		for (var i = data.length - 1; i >= 0; i--) {
			this.initBrand(data[i]);
		};
		$(".keywords-area").each(function(){
			var len = $(this).find(".keywords-tag").length ;
			if (len <= maxLi) {
				// $(".keywords-more").remove();
			};
		})
	},
	initBrand: function(data){
		var id = data.id, name = data.name, title = "", maxLen = 10, maxLi = this.maxkeywords,type = data.type;
		var closeImg = '<i class="fa fa-times-circle" aria-hidden="true"></i>';
		var $container = $(".keywords-area:last");
		var dataJson = {};
		var length = this.getLength(name);
		if (length > maxLen) {
			name = name.substring(0,maxLen-1) + "...";
			title = data.name;
		};
		if(type == "mainBrand"){
			closeImg = "";
			$container = $(".keywords-area:first");
		}
		if (type!="mixBrand") {
			var _html = '<li class="keywords-tag" id="other_brand_'+id+'" title="'+title+'"><span>'+name+'</span>'+closeImg+'</li>';
			var len = $container.find(".keywords-tag").length ;
			if (len >= maxLi) {
				_html = '<li class="keywords-tag" id="other_brand_'+id+'"><span>'+data.name+'</span>'+closeImg+'</li>';
				$container.find(".keywords-more .keyword-hide").append(_html);
				$container.find(".keywords-more").show();
			}else{
				$container.find(".keywords-more").before(_html);
			}
		}
		dataJson.id = data.id;
		dataJson.name = data.name;
		dataJson.result = data.data;
		this.brandData.push(dataJson);

	},
	
	initBubble: function(sets){
		if (!sets) return;
		var _this = this;
		this.sets = sets;
		var chart = venn.VennDiagram()
                 .width(400)
                 .height(500);

        var div = d3.select(".bubble-venn")
        div.datum(sets).call(chart);

        var tooltip = d3.select("body").append("div")
            .attr("class", "venntooltip");

        div.selectAll("path")
            .style("stroke-opacity", 1)
            .style("stroke", "#fff")
            .style("stroke-width", 1)
            .style("stroke-dasharray",[5,5])
        d3.selectAll(".venn-circle path:not(.path_select)")
            .style("fill-opacity",  .5);
        d3.selectAll(".venn-intersection path:not(.path_select)")
            .style("fill-opacity",  .1);
        div.selectAll("g")
          .on("mouseover", function(d, i) {
              // sort all the areas relative to the current item
              // venn.sortAreas(div, d);

              // Display a tooltip with the current size
              tooltip.transition().duration(400).style("opacity", .9);
              var ranking = d.ranking>0? ("Ranking: "+d.ranking+"<br>"):"";
              var overlap = d.overlap? ("Overlapping: "+d.overlap+"<br>"):"";
              var audiences = "Audience: "+d.size;
              tooltip.html(ranking+overlap+audiences);

              // highlight the current path
              var selection = d3.select(this);
              selection.select("path")
                  .style("fill-opacity", d.sets.length == 1 ? .8 : .1)
                  .style("stroke-opacity", 1)
                  .style("stroke-width", 1)
                  .style("stroke-dasharray",[0,0]);
          })

          .on("mousemove", function() {
              tooltip.style("left", (d3.event.pageX + 10) + "px")
                     .style("top", (d3.event.pageY - 38) + "px");
          })

          .on("mouseout", function(d, i) {
              tooltip.transition().duration(400).style("opacity", 0);

              var selection = d3.select(this);
              
              selection.select("path")
                  .style("fill-opacity",  d.sets.length == 1 ? .5 : 0)

              d3.selectAll("path")
                  .style("stroke-opacity", 1)
                  .style("stroke-width", 1)
                  .style("stroke-dasharray",[5,5]); 
              d3.selectAll(".venn-circle path")
                  .style("fill-opacity",  .5);
              d3.selectAll(".venn-intersection path")
                  .style("fill-opacity",  .1);
              var len = d3.selectAll(".path_select").data()[0] ? d3.selectAll(".path_select").data()[0].sets.length : 0;
              d3.select(".path_select")
                  .style("stroke-opacity", 1)
                  .style("stroke-width", 3)
                  .style("stroke-dasharray",[0,0]);
              if(len>0){
                d3.select(".path_select").transition("tooltip").duration(400)
                  .style("fill-opacity",  len == 1 ? .8 : .1)
              }
              
          })

          .on("click", function(d, i) {
              //highlight the keyword
              $(".keywords-other").find(".selected").removeClass("selected");
              $("#other_brand_0").removeClass("selected");
              if (d.ranking>0) {
                $("#other_brand_"+d.ranking).addClass("selected");
              }else{
                if (d.sets.length>0) {
                  for (var i = 0; i < d.sets.length; i++) {
                    $("#other_brand_"+d.sets[i]).addClass("selected");
                  };
                };
              }
              
              var selection = d3.select(this);
              d3.selectAll(".path_select")
                  .classed("path_select",false)
                  .style("stroke-opacity", 0)
                  .style("stroke-width", 1)
                  .style("stroke-dasharray",[5,5]);

              selection.select("path")
                  .attr("class","path_select")
                  .style("fill-opacity", d.sets.length == 1 ? .8 : .1)
                  .style("stroke-opacity", 1)
                  .style("stroke-width", 3)
                  .style("stroke-dasharray",[0,0]); 
              venn.sortAreas(div, d);
              _this.showCampare();
              _this.initResultData();
          });
	},
	showCampare: function(){
		var vsLeft = "";
        var vs = "";
        var vsRight = "";
        var vsTitle = "";
        if($("#other_brand_0").hasClass("selected")){
          vsLeft = $("#other_brand_0").attr("title") || $("#other_brand_0").find("span").text();
        };
        var vsRightArr = [];
        
        $(".keywords-other .selected").each(function(){
          vsRightArr.push($(this).attr("title") || $(this).find("span").text());
        })
        vsRight = vsRightArr.join(" <b>VS</b> ");
        if (vsLeft!="" && vsRightArr.length>0) {
          vs = " <b>VS</b> ";
        };
        if (vsLeft!="" || vsRight!="") {
          vsTitle = "Selected brand(s): ";
          $("#compare-key").addClass("showcon");
        }else{
          $("#compare-key").removeClass("showcon");
        }
        $("#compare-key").html(vsTitle + vsLeft + vs + vsRight);
	},
	reDraw: function(id){
		if (id) {
		  console.log(this)
		  if (this.sets.length == 0) return;
          this.sets = this.sets.filter(function(value){
            var relateArr = value.sets;
            return !($.inArray(parseInt(id.split("other_brand_")[1]), relateArr)>-1)
          })
          $(".bubble-venn").empty();
          this.initBubble(this.sets);
          this.relateGraph();
        };
	},
	relateGraph: function(){
		if (this.sets.length == 0) return;
		var otherBrandSelected = $(".keywords-area").find(".selected").map(function(){
          if ($(this).attr("id")!="") {
            return $(this).attr("id").split("other_brand_")[1];
          }
          return "";
        }).get().join("_");
        d3.selectAll(".path_select")
                  .classed("path_select",false)
                  .style("stroke-opacity", 0)
                  .style("stroke-width", 1)
                  .style("stroke-dasharray",[5,5]);
        d3.select("[data-venn-sets='"+otherBrandSelected+"'] path")
                  .attr("class","path_select")
                  .style("stroke-opacity", 1)
                  .style("stroke-width", 3)
                  .style("stroke-dasharray",[0,0]);
        d3.selectAll(".venn-circle path")
                .style("fill-opacity",  .5);
        d3.selectAll(".venn-intersection path")
                .style("fill-opacity",  .1);
        var opacity = 0.8;

        if(otherBrandSelected.indexOf("_")>-1){
            opacity = 0.1
        }
        d3.select(".path_select").transition("tooltip").duration(400)
                  .style("fill-opacity",  opacity)
        var div = d3.select(".bubble-venn");
        var d = d3.select(".bubble-venn .path_select").data()[0];
        d && venn.sortAreas(div, d);
        this.showCampare();
	},
	initAudience: function(data){
		$("#audience_total").text(data ? data.audience : 0);
	},

	initGender: function(data){
		var male = data ? data.gender.male : 0;
		var female = data ? data.gender.female : 0;
		$(".plan-reports-bg-male").find("label").text(male+"%");
		$(".plan-reports-bg-female").find("label").text(female+"%");
	},

	initAgeGroup: function(data){
		if (!data) return;
		$("#select_age_group").find(".result-graph-word-content").empty();
		for (var i in data.age_group) {
		
			var _html = '<div class="xmo-bar_per">'+
				  	   	'<span class="name">'+i+'</span>'+
				  	   	'<span class="result">'+data.age_group[i]+'%</span>'+
				  	    '<span class="bar_main">'+
				  	      '<div class="bar_bg"></div>'+
				  	      '<div class="bar_content">'+
				  	        '<i style="height: '+data.age_group[i]+'px; background: #EF4136;"></i>'+
				  	      '</div>'+
				  	    '</span>'+
				  	  '</div>';
			$("#select_age_group").find(".result-graph-word-content").append(_html);
		};	
		//根据个数设置agegroups宽度
	      if($(".xmo-bar_per").length>0){
	        var ageW = $(".xmo-bar_per").length*46;
	        $(".xmo-bar_per").parent().css("width",ageW+"px");
	      }	
	},

	initDevice: function(data){
		if (!data) return;
		if (!document.getElementById('device-map')) return;
		var myChart = echarts.init(document.getElementById('device-map'));
		var legendData = [], seriesData = [];
		for(var i in data.device){
			var legendJson = {};
			var seriesJson = {};
			legendJson.name = i;
			legendJson.icon = "circle";
			seriesJson.name = i;
			seriesJson.value = data.device[i];
			legendData.push(legendJson);
			seriesData.push(seriesJson);
		}
		var option = {
          tooltip: {
              trigger: 'item',
              formatter: "{b}: {c} ({d}%)"
          },
          legend: {
              orient: 'horizontal',
              bottom: '0',
              itemWidth:10,
              itemHeight:10,
              data:legendData
          },
          color: ['#ef4136','#f9a5a5', '#ffcfcf'],
          series: [
              {
                  name:'DEVICE',
                  type:'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      normal: {
                          show: true,
                          position: 'outside',
                          formatter: '{d}%',
                          textStyle: {
                            color:'#333',
                            fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:seriesData
              }
          ]
      };
      myChart.setOption(option);
	},
	initRegions: function(data){
		if (!data) return;
		if (!document.getElementById('region-map')) return;
		var myChart = echarts.init(document.getElementById('region-map'));
		var rangeColor = ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'];
		var option = {
          tooltip: {},
          visualMap: {
              min: 0,
              max: 150,
              type: 'piecewise',
              left: 'left',
              top: 'bottom',
              text: ['High','Low'],
              orient:'horizontal',
              splitNumber:6,
              inverse:true,
              itemGap:5,
              seriesIndex: [1],
              inRange: {
                  color: rangeColor
              },
              calculable : true
          },
          geo: {
              map: 'china',
              // roam: true,
              label: {
                  normal: {
                      show: false,
                      textStyle: {
                          color: 'rgba(0,0,0,0.4)'
                      }
                  }
              },
              itemStyle: {
                  normal:{
                      borderColor: '#fff'
                  }
                  ,emphasis:{
                      areaColor: '',
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                      shadowBlur: 20,
                      borderWidth: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              },
              nameMap:{
				    // '北京' : '北京',
				    // '天津' : '天津'
				}
          },
          series : [
             {
                 type: 'scatter',
                 coordinateSystem: 'geo',
                 data: [],
                 symbolSize: 20,
                 symbol: '',
                 symbolRotate: 35,
                 label: {
                     normal: {
                         formatter: '{b}',
                         position: 'right',
                         show: false
                     },
                     emphasis: {
                         show: true
                     }
                 },
                 itemStyle: {
                     normal: {
                          color: '#F06C00'
                     }
                 }
              },
              {
                  name: '数量',
                  type: 'map',
                  geoIndex: 0,
                  // tooltip: {show: false},
                  data:data.regions,

	              
              }
          ]
      };
      myChart.setOption(option);

      var _total = 0;
      for (var i = 0; i < data.regions.length; i++) {
      	_total +=parseFloat(data.regions[i].value);
      }
      $("#select_province").find(".result-graph-word-content").empty();
      for (var i = 0; i < data.regions.length; i++) {
      	var per = (parseFloat(data.regions[i].value)/_total)*100;
      	var _html = '<div class="xmo-line_per">'+
				  	   '<span class="name">'+(i+1)+'.'+data.regions[i].name+'</span>'+
				    		'<span class="result">'+per.toFixed(2)+'%</span>'+
				    		'<span class="line_main">'+
				    		  '<div class="xmo-progress-line left">'+
				    		    '<div style="width: '+per.toFixed(2)+'%;" class="bar"></div>'+
				    		  '</div>'+
				    		'</span>'+
				  	  '</div>';
	    $("#select_province").find(".result-graph-word-content").append(_html);
      }
	},
	initInterests: function(data){
		if (!data) return;
		if (!document.getElementById('interest-map')) return;
		
		var indicator  =[],topPointArr = [],dataArr = [];
		var datas = [],categories = [],liCon = {};
		if ($("#select_interests").find(".result-graph-word-content").length>0) {
			$("#select_interests").find(".result-graph-word-content").empty();
		};
		for(var i in data.interest){
			var indicatorJson = {};
			indicatorJson.text = data.interest[i].name;
			indicatorJson.max = 100;
			indicator.push(indicatorJson);
			var topPointJson = {};
			topPointJson.name= data.interest[i].name;
			topPointJson.value = data.interest[i].value+"%";
			topPointArr.push(topPointJson);
			dataArr.push(data.interest[i].value);

			datas.push(data.interest[i].value);
			categories.push(data.interest[i].name);
			//初始化副标题
		    if($("#select_interests").find(".result-graph-word-content").length>0){
		      var _li = "";
		      for (var j = 0; j < data.interest[i].sub.length; j++) {
              	_li += '<li>'+(j+1)+'.'+data.interest[i].sub[j]+'</li>';
              };
		      var _html = '<div class="result-graph-word-interest">'+
                            '<div class="result-graph-word-interest-inner">'+
                              '<label>'+data.interest[i].name+'</label>'+
                              '<ul>'+
                              _li+
                              '</ul>'+
                            '</div>'+
                          '</div>';
               $("#select_interests").find(".result-graph-word-content").append(_html);
		    }else{
		    	var _li = "";
		    	for (var j = 0; j < data.interest[i].sub.length; j++) {
	              _li += '<li title="'+data.interest[i].sub[j]+'">'+data.interest[i].sub[j]+'</li>';
	             };
		      	var _html = '<ul>'+_li+'</ul>';
		      	liCon[data.interest[i].name] = _html;
		    }
		}
		if($("#select_interests").find(".result-graph-word-content").length>0){
			this.createSpiderByEchart(indicator,topPointArr,dataArr);
		}else{
			this.createSpiderByHighChart(datas,categories,liCon);
		}
		
      
	},
	createSpiderByEchart: function(indicator,topPointArr,dataArr){
		var myChart = echarts.init(document.getElementById('interest-map'));
		var option = {
          radar: [

              {
                  indicator: indicator,
                  center: ['50%', '50%'],
                  radius: 120,
                  splitNumber:4,
                  nameGap:17,
                  name:{
                    show:true,
                    formatter:"",
                    textStyle:{
                      color: '#333',
                      fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                    }
                  }
              }
          ],
          series: [

              {
                  name: 'interest',
                  type: 'radar',
                  radarIndex: 0,
                  symbol:'rect',
                  data: [
                    //数据1
                        {
                          value: [100, -1, -1, -1, -1],
                          name: topPointArr[0].value,//顶点1的实际值
                          symbol:"d",
                          symbolSize:0.01,
                          label: {
                              normal: {
                                  show: true,
                                  offset:[0,0],
                                  formatter:function(params) {
                                      if(params.value==-1) return "";
                                      return params.name;
                                  },
                                  textStyle:{
                                    color:'#ef4136',
                                    fontSize:20,
                                    fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                                  }
                              }
                          },
                          lineStyle:{
                              normal:{
                                  opacity:0
                              }
                          }
                      },
                      {
                          value: [100, -1, -1, -1, -1],
                          name: topPointArr[0].name,//顶点1的label
                          symbol:"d",
                          symbolSize:0.01,
                          label: {
                              normal: {
                                  show: true,
                                  offset:[0,-20],
                                  formatter:function(params) {
                                      if(params.value==-1) return "";
                                      return params.name;
                                  },
                                  textStyle:{
                                    color:'#333',
                                    fontSize:12,
                                    fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                                  }
                              }
                          },
                          lineStyle:{
                              normal:{
                                  opacity:0
                              }
                          }
                      },
                      //数据2
                      {
                        value: [-1, 100, -1, -1, -1],
                        name: topPointArr[1].value,
                        symbol:"d",
                        symbolSize:0.01,
                        label: {
                            normal: {
                                show: true,
                                offset:[-50,20],
                                formatter:function(params) {
                                    if(params.value==-1) return "";
                                    return params.name;
                                },
                                textStyle:{
                                  color:'#ef4136',
                                  fontSize:20,
                                  fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                                }
                            }
                        },
                        lineStyle:{
                            normal:{
                                opacity:0
                            }
                        }
                    },
                    {
                        value: [-1, 100, -1, -1, -1],
                        name: topPointArr[1]['name'],//顶点1的label
                        symbol:"d",
                        symbolSize:0.01,
                        label: {
                            normal: {
                                show: true,
                                offset:[-50,0],
                                formatter:function(params) {
                                    if(params.value==-1) return "";
                                    return params.name;
                                },
                                textStyle:{
                                  color:'#333',
                                  fontSize:12,
                                  fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                                }
                            }
                        },
                        lineStyle:{
                            normal:{
                                opacity:0
                            }
                        }
                    },
                    //数据3
                    {
                      value: [-1, -1, 100, -1, -1],
                      name: topPointArr[2]['value'],
                      symbol:"d",
                      symbolSize:0.01,
                      label: {
                          normal: {
                              show: true,
                              offset:[-50,40],
                              formatter:function(params) {
                                  if(params.value==-1) return "";
                                  return params.name;
                              },
                              textStyle:{
                                color:'#ef4136',
                                fontSize:20,
                                fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                              }
                          }
                      },
                      lineStyle:{
                          normal:{
                              opacity:0
                          }
                      }
                  },
                  {
                      value: [-1, -1, 100, -1, -1],
                      name: topPointArr[2]['name'],//顶点1的label
                      symbol:"d",
                      symbolSize:0.01,
                      label: {
                          normal: {
                              show: true,
                              offset:[-50,20],
                              formatter:function(params) {
                                  if(params.value==-1) return "";
                                  return params.name;
                              },
                              textStyle:{
                                color:'#333',
                                fontSize:12,
                                fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                              }
                          }
                      },
                      lineStyle:{
                          normal:{
                              opacity:0
                          }
                      }
                  },
                  //数据4
                  {
                      value: [-1, -1, -1, 100,-1],
                      name: topPointArr[3]['value'],
                      symbol:"d",
                      symbolSize:0.01,
                      label: {
                          normal: {
                              show: true,
                              offset:[50,40],
                              formatter:function(params) {
                                  if(params.value==-1) return "";
                                  return params.name;
                              },
                              textStyle:{
                                color:'#ef4136',
                                fontSize:20,
                                fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                              }
                          }
                      },
                      lineStyle:{
                          normal:{
                              opacity:0
                          }
                      }
                },
                {
                    value: [-1, -1, -1, 100, -1],
                    name: topPointArr[3]['name'],//顶点1的label
                    symbol:"d",
                    symbolSize:0.01,
                    label: {
                        normal: {
                            show: true,
                            offset:[50,20],
                            formatter:function(params) {
                                if(params.value==-1) return "";
                                return params.name;
                            },
                            textStyle:{
                              color:'#333',
                              fontSize:12,
                              fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                            }
                        }
                    },
                    lineStyle:{
                        normal:{
                            opacity:0
                        }
                    }
                },
                //数据5
                {
                    value: [-1, -1, -1, -1, 100],
                    name: topPointArr[4]['value'],
                    symbol:"d",
                    symbolSize:0.01,
                    label: {
                        normal: {
                            show: true,
                            offset:[50,20],
                            formatter:function(params) {
                                if(params.value==-1) return "";
                                return params.name;
                            },
                            textStyle:{
                              color:'#ef4136',
                              fontSize:20,
                              fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                            }
                        }
                    },
                    lineStyle:{
                        normal:{
                            opacity:0
                        }
                    }
                },
                {
                      value: [-1, -1, -1, -1, 100],
                      name: topPointArr[4]['name'],//顶点1的label
                      symbol:"d",
                      symbolSize:0.01,
                      label: {
                          normal: {
                              show: true,
                              offset:[50,0],
                              formatter:function(params) {
                                  if(params.value==-1) return "";
                                  return params.name;
                              },
                              textStyle:{
                                color:'#333',
                                fontSize:12,
                                fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                              }
                          }
                      },
                      lineStyle:{
                          normal:{
                              opacity:0
                          }
                      }
                  },
                  {
                      value: dataArr,
                      name: 'interest1',
                      areaStyle: {
                         normal: {
                             opacity: 0.5,
                             color: '#EF4136'
                         }
                      },
                      lineStyle: {
                         normal: {
                             opacity: 0.5,
                             color: '#EF4136'
                         }
                      },
                      itemStyle: {
                         normal: {
                             opacity: 0.5,
                             color: '#EF4136'
                         }
                      }

                  }
              ]
            }
        ]
      }
      myChart.setOption(option);
	},
	createSpiderByHighChart: function(datas,categories,liCon){
		if(datas.length != 0 && categories.length != 0){
     		new Highcharts.Chart({
		        chart: {
		            polar: true,
		            type: 'area',
		            height:350,
		            width: 500,
		            reflow:true,
		            renderTo:'interest-map'
		        },
		        title: "",
		        pane: {
		            size: '66%'
		        },
		        plotOptions: {
		            series: {
		                lineWidth: 0,
		                lineColor: "#ef4136",
		                enableMouseTracking: false,
		                marker: {
		                    enabled: false
		                }
		            }
		        },
		        xAxis: {
		            categories: categories,
		            labels:{
		        		useHTML:true,
		        		formatter:function(){
		        			var yData = this.chart.series[0].yData;
		        			var xData = this.axis.categories;
		        			var yValue;
		        			var revert = false;
		        			var middle = false;
		        			var revert_2 = false;
		        			for (var i = 0; i < xData.length; i++) {
		        				if(this.value==xData[i]){
		        					yValue = yData[i];
		        					if (i==3) {revert=true};
		        					if (i==1 || i==4) {middle=true};
		        					if (i==2) {revert_2=true};
		        					break;
		        				}
		        			};
		        			var ul_li =  liCon[this.value];
		        			if (revert) {
		        				
		        				return '<div style="width:200px;margin-left:-55px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;"><div class="graph-tiptool" data-position="top" style="margin-top:6px;margin-bottom: 7px;margin-right: -1px"><span class="graph-tip">...</span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div><span style="color:#ef4136;font-size:18px;">'+yValue+'%</span><br><span style="font-size:14px;">'+this.value+'</span></div>'
		        			}else if (revert_2){
		        				return '<div style="min-width:100px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;"><div class="graph-tiptool" data-position="top" ><div style="padding-bottom: 7px;padding-right: 20px"><span class="graph-tip">...</span></div><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div><span style="color:#ef4136;font-size:18px;margin-left:-20px;">'+yValue+'%</span><br><span style="font-size:14px;margin-left:-20px;">'+this.value+'</span></div>'
		        			}else if (middle) {
		        				return '<div style="min-width:100px;text-align:center;margin-top:-30px;display:inline-block;*display:inline;"><span style="font-size:14px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:5px"><span class="graph-tip">...</span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
		        			}else{
		        				return '<div data-id="chart_0" style="width:586px;margin-left:-251px;text-align:center;margin-bottom:40px;white-space: nowrap;display:inline-block;*display:inline;"><span style="font-size:14px;margin-left: 10px">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;margin-left: 10px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:6px;margin-left: 10px;"><span class="graph-tip">...</span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
		        			}

		        		}
		        	},
		            tickmarkPlacement: 'on',
		            lineWidth: 0,
		            tickWidth:0
		        },

                yAxis: {
		            gridLineInterpolation: 'polygon',
		            lineWidth: 0,
		            min: 0,
		            labels:{enabled:false},
		            plotBands: [{
		                color: '#fff',
		                from: 0,
		                to: 25
		            },{
		                color: '#F1F1F2',
		                from: 25,
		                to: 50
		            },{
		                color: '#fff',
		                from: 50,
		                to: 75
		            },{
		            	color: '#F1F1F2',
		                from: 75,
		                to: 100
		            }],
                    tickPositioner: function () {
		                var positions = [],
		                    tick =0,
		                    increment = 25;
		                for (i=0;i<5;i++) {
		                    positions.push(tick);
		                    tick=tick+increment;
		                }
		                return positions;
		            },
		            lineWidth :0,
    				tickWidth:0
		        },

		        tooltip: {
		           enabled:false
		        },

		        legend: {
		            enabled:false
		        },

		        series: [{
		            name: 'Allocated Budget',
		            data: datas,
		            pointPlacement: 'false',
		            color: '#ef4136',
		            fillOpacity:'0.6'
		        }],
		        credits :{
		        	enabled:false
		        }
		    },function(chart){
				
			});
        }
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
	getDataFromJson: function(jsonArr,key,value){
		if (!jsonArr) return;
		if (!key || !value) return;
		var result = {};
		for (var i = 0; i < jsonArr.length; i++) {
			if(jsonArr[i][key] == value){
				result = jsonArr[i];
			}
		};
		return result;
	}

}
