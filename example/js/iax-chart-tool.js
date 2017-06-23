var IAX_CHART_TOOL = {
  colorMap : ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'],
  brandData: [],
  sets: [],
  currentBubble:"",
  bubbleData:"",
  init : function(){
    this.bindEvent();
  },
  bindEvent: function(){
    //提示显示工具
    var time = 250;
    var hideDelay = 500;
    var hideDelayTimer = null;
    var _this = this;
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
    $(document).on("click","[name='bubble-brand']",function(){
      var unselectArr = $("[name='bubble-brand']").filter(function(){
                          return !$(this).is(":checked") && $(this).val()!="all";
                        }).map(function(){
                          return $(this).val();
                        }).get();
      var newBubbleData = $.extend(true,[],_this.bubbleData);
      //去除泡泡
      for (var i = 0; i < unselectArr.length; i++) {
        var unselectId = unselectArr[i];
        for (var j = 0; j < _this.bubbleData.length; j++) {
          var sets = _this.bubbleData[j].sets;
          if ($.inArray(parseInt(unselectId),sets)>-1) {
            newBubbleData[j].remove = true;
          };
        };
      };
      newBubbleData = newBubbleData.filter(function(data){
        return !data.remove;
      })
      $(this).parents(".bubble-container").find(".bubble-map svg").click();
      $(this).parents(".bubble-container").find(".bubble-map").empty();
      _this.initBubble($(this).parents(".bubble-container").attr("id"),newBubbleData);
    })
  },
  initData: function(data){
    if (!data) return;
    
  },
  initBubbleGraph:function(id,data){
    if (!data || !data.bubble || data.bubble.length==0) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    //判断是否引进了venn插件
    if (typeof venn == "object") {
      var keywords = [];
      for (var i = 0; i < data.bubble.length; i++) {
        var bubble = data.bubble[i];
        if (bubble.sets.length==1) {
          keywords.push(bubble.label);
        };
      };
      _this.initBubbleInfo(id,keywords);
      _this.initBubble(id,data.bubble);
      _this.bindEvent();
      _this.initMarketGraphByBubble(data.result[0]);
      _this.currentBubble = data.result[0].id;
      _this.brandData = data.result;
      _this.bubbleData = data.bubble;
    };
  },
  initBubbleInfo:function(id,keywords){
    if (!keywords || keywords.length==0) return;
    if (!document.getElementById(id)) return;
    var liHtml =  '<li><div class="checkbox checkbox-primary checkbox-switch">'+
                  '    <input type="checkbox" name="bubble-brand" disabled id="bubble-brandall" value="all" checked="checked">'+
                  '    <label for="bubble-brandall">All market</label>'+
                  '</div></li>';
    for (var i = 0; i < keywords.length; i++) {
      liHtml += '<li><div class="checkbox checkbox-primary checkbox-switch">'+
                '    <input type="checkbox" name="bubble-brand" id="bubble-brand'+i+'" value="'+i+'" checked="checked">'+
                '    <label for="bubble-brand'+i+'">'+keywords[i]+'</label>'+
                '</div></li>';
    };
    $("#"+id).find(".bubble-info").find("ul").html(liHtml);
    $("#"+id).find(".bubble-info-selected span").text("All market");
  },
  initBubble:function(id,sets){
    if (!sets || sets.length==0) return;
    var _this = this;
    _this.sets = sets;
    var chart = venn.VennDiagram()
                 .width(380)
                 .height(380);

    var div = d3.select("#"+id).select(".bubble-map");
    div.datum(sets).call(chart);

    var tooltip = $(".venntooltip").length>0 ? d3.select(".venntooltip") : d3.select("body").append("div").attr("class", "venntooltip");

    div.selectAll("path")
        .style("stroke-opacity", 1)
        .style("stroke", "none")
        .style("stroke-width", 1)
        // .style("stroke-dasharray",[5,5])
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
          var label = d.label ? d.label:"";
          if (label=="") {
            for (var i = 0; i < d.sets.length; i++) {
              var currentSet = d.sets[i];
              for (var j = 0; j < _this.sets.length; j++) {
                if(_this.sets[j].sets.length==1){
                  if(currentSet == _this.sets[j].sets[0]){
                    label = label + _this.sets[j].label + " & ";
                  };
                }
              };
            };
            label = label.substring(0,label.length-2);
          };
          label = "<b>"+label+"</b><br>";
          var overlap = d.overlap? ("Overlapping: "+d.overlap+"<br>"):"";
          var audiences = "Audience: "+d.size;
          tooltip.html(label+audiences);

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
              // .style("stroke-dasharray",[5,5]); 
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
          var selection = d3.select(this);
          d3.selectAll(".path_select")
              .classed("path_select",false)
              .style("stroke-opacity", 0)
              .style("stroke-width", 1)
              // .style("stroke-dasharray",[5,5]);

          selection.select("path")
              .attr("class","path_select")
              .style("fill-opacity", d.sets.length == 1 ? .8 : .1)
              .style("stroke-opacity", 1)
              .style("stroke-width", 3)
              .style("stroke-dasharray",[0,0]); 
          venn.sortAreas(div, d);
          _this.showCampare(id,d);
          $("#"+id).find(".bubble-map").removeClass("bubble-select");
          // _this.initResultData();
      });
      $("#"+id).on("click",".bubble-map",function(e){
          e = e || window.event;
          e.stopPropagation();
          if (e.target.nodeName!="svg") {return};
          d3.selectAll(".path_select")
              .classed("path_select",false)
              .transition().duration(400)
              // .style("fill-opacity", 0.5)
              .style("stroke-opacity", 0)
              .style("stroke-width", 1)
          $(this).addClass("bubble-select");
          var subTitle = "All Market";
          var audience = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[0];
          var market = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[1];
          var selectLabel = $("#"+id).find(".bubble-info").find("#bubble-brandall").next().text();
          var audienceTitle = 'Audience Scale <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
          var marketTitle = 'Market Share <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
          $(audience).find(".result-text-header label").html(audienceTitle);
          $(market).find(".result-text-header label").html(marketTitle);
          $(market).find(".result-graph-word-content>label").text(subTitle);
          $("#"+id).find(".bubble-info-selected span").text(selectLabel);
          if (_this.currentBubble != _this.brandData[0].id) {
            _this.initMarketGraphByBubble(_this.brandData[0]);
            _this.currentBubble = _this.brandData[0].id;
          };
      })
  },
  showCampare: function(id,d){
    var _this = this;
    var label = d.label ? d.label:"";
    var bubbleid = d.sets.join("-");
    var bubbleData = "";
    var subTitle = label + " overlaps All Market";
    var audience = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[0];
    var market = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[1];
    var audienceTitle = 'Audience Scale <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
    var marketTitle = 'Market Share <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
    if (label=="") {
      for (var i = 0; i < d.sets.length; i++) {
        var currentSet = d.sets[i];
        for (var j = 0; j < _this.sets.length; j++) {
          if(_this.sets[j].sets.length==1){
            if(currentSet == _this.sets[j].sets[0]){
              label = label + _this.sets[j].label + " & ";
            };
          }
        };
      };
      label = label.substring(0,label.length-3);
      subTitle = label.split(" & ").reverse().join(" overlaps ");
      //audience scale & market share 变更标题
      audienceTitle = 'Overlapping Audience Scale <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
      marketTitle = 'Overlapping Audience % <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
    };
    $(audience).find(".result-text-header label").html(audienceTitle);
    $(market).find(".result-text-header label").html(marketTitle);
    $(market).find(".result-graph-word-content>label").text(subTitle);
    $("#"+id).find(".bubble-info-selected span").text(label);
    for (var i = 0; i < _this.brandData.length; i++) {
      if(_this.brandData[i].id == bubbleid){
        bubbleData = _this.brandData[i];
      }
    };
    _this.initMarketGraphByBubble(bubbleData);
    _this.currentBubble = bubbleid;
    $('[data-toggle="tooltip"]').tooltip();
  },
  initMarketGraphByBubble:function(json){
    if (!json) return;
    this.initTotalAudience("select_audience","audience_total","market-map",json.data);
    this.initGender("gender-map",json.data);
    this.initAgeGroup("select_age",json.data);
    this.initRegions("region-map",json.data);
    this.initInterests("interest-map",json.data);
    this.initTop5Graph("select_top_brand",json.data.top5brand);
    this.initTop5Graph("select_top_products",json.data.top5products);
  },
  initTop5Graph:function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    $("#"+id).find(".result-graph-word-content").empty();
    var _total = 0;
    for (var i in data) {
      _total +=parseFloat(data[i]);
    }
    for (var i in data) {
      var per = (parseFloat(data[i])/_total)*100; 
     
      var _html = '<div class="xmo-line_per">'+
                '<span class="name">'+i+'</span>'+
                '<span class="result">'+per.toFixed(0)+'%</span>'+
                '<span class="line_main">'+
                  '<div class="xmo-progress-line left">'+
                    '<i style="width: '+per.toFixed(0)+'%;" class="bar"></i>'+
                  '</div>'+
                '</span>'+
              '</div>';
      $("#"+id).find(".result-graph-word-content").append(_html);
    };  
  },
  initTop5Trend:function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var legends=[],date=[],series=[],seriesJson={},legendJson={},title,dateJson={};
    title = data.top5productsTrend.dataPeriod;
    for (var i = 0; i < data.top5productsTrend.result.length; i++) {
      var json = data.top5productsTrend.result[i];
      if (!dateJson[json.date]) {
        date.push(json.date);
        dateJson[json.date] = json;
      };
      if (!legendJson[json.name]) {
        legends.push({
          icon:"circle",
          name:json.name
        });
        seriesJson = {
          name : json.name,
          type : 'line',
          stack : '总量:'+json.nameMap,
          symbol : 'circle',
          symbolSize : "8",
          showAllSymbol:true,
          hoverAnimation:false,
          lineStyle : {
            normal : {
              color:"#ef4136",
            }
          },
          
          areaStyle : {
            normal : {
              opacity:0
            }
          },
          data : [
                {"value":json.value,"textStyle":{"color":"#999","fontSize":10}},
            ],
        }
        series.push(seriesJson);
        legendJson[json.name] = json;
      }else{
        for (var j = 0; j < series.length; j++) {
          if(series[j].name==json.name){
            series[j].data.push({
              "value":json.value,
              "textStyle":{"color":"#999","fontSize":10},
            });
            break;
          }
        };
      }
    };
    var option = {
        title : {
          text: title,
          textStyle : {
            'fontWeight':"normal",
            'fontFamily' : "Open Sans",
            'fontSize' : 12,
          }
        },
        color:['#ef4136','#FB8731','#F4D96C','#F9A5A5'],
        tooltip : {
            trigger : 'axis',
            backgroundColor : "#f2f2f2",
            borderColor : "#dfdfdf",
            borderWidth : 1,
            textStyle : {
              color : "#333",
              fontFamily : "Open Sans"
            },
            extraCssText:'text-align:left;',
            formatter: function(params) {
                var result = "<p style='color:#999;font-size:10px'>"+params[0].name+"</p>"+
                             "<p style='color:#333;font-weight:bold;'>Audience Scale</p>";
                params.forEach(function (item) {
                    result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+':'+item.value+'</p>';
                });
                result += "</p>"
                return result;
            }
        },
        legend : {
          itemWidth:8,
          itemHeight:8,
          itemGap:20,
          data:legends,
          bottom:0,
        },
        grid : {
            left : '0',
            bottom : '40',
            top:'40',
            right:'0',
            containLabel : true
          },
        xAxis : {
          type : 'category',
          splitLine: {
               show: false
           },
           axisLine:{
             show:false
           },
           axisTick:{
             show:false
           },
           axisLabel: {
            showMinLabel:false,
            textStyle: {
                color: '#999',
                fontSize:10,
            }
          },
          min:"dataMin",
          max:"dataMax",  
          boundaryGap:true,
          data : date
        } ,
        yAxis : {
          type : 'value',
          splitNumber:3,
          scale:true,
          splitLine:{
            show:true,
            lineStyle:{
              color:"#dfdfdf"
            }
          },
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          },
          splitArea:{
            show:false
          },
          axisLabel: {
            showMinLabel:false,
            textStyle: {
                color: '#999',
                fontSize:10,
            }
          },
        } ,
        series : series,
      }; 
        
      myChart.setOption(option);
  },
  initMixTrend: function(id,data){
    if(!data || !data.mixTrend) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var legends=[],date=[],series=[],seriesJson={},title,dateJson={},yAxis=[],yAxisIndex=0,splitNumber=5;
    title = data.mixTrend.dataPeriod;
    for (var i in data.mixTrend.result) {
      var result = data.mixTrend.result[i];
      legends.push({
        icon:"circle",
        name:i,

      })
      var yAxisJson = {
        type : 'value',
        splitLine:{
          show:true,
          lineStyle:{
            color:"#dfdfdf"
          }
        },
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        splitArea:{
          show:false
        },
        axisLabel: {
          showMinLabel:false,
          textStyle: {
              color: '#999',
              fontSize:10,
          }
        },
      }
      

      seriesJson = {
        name : i,
        type : 'line',
        stack : '总量:'+i,
        yAxisIndex:yAxisIndex,
        symbol : 'circle',
        symbolSize : "8",
        showAllSymbol:true,
        hoverAnimation:false,
        lineStyle : {
          normal : {
            color:"#ef4136",
          }
        },
        itemStyle:{
          normal:{
            color:"#ef4136"
          }
        },
        areaStyle : {
          normal : {
            opacity:0
          }
        },
        data : [],
      }
      var max=0;
      for (var j = 0; j < result.length; j++) {
        if (!dateJson[result[j].date]) {
          date.push(result[j].date);
          dateJson[result[j].date] = result[j];
        };
        seriesJson.data.push({
          "value":result[j].value,
          "textStyle":{"color":"#999","fontSize":10},
        })
        if (max < result[j].value) {
          max = result[j].value;
        };
      };
      yAxisJson.interval = Math.ceil(max/splitNumber);
      yAxisJson.max = yAxisJson.interval*splitNumber;
      if (yAxisIndex==1) {
        yAxisJson.max=100;
        yAxisJson.interval = parseInt(100/splitNumber);
        seriesJson.lineStyle.normal.color = "#FB8731";
        seriesJson.itemStyle.normal.color = "#FB8731";
        yAxisJson.axisLabel.formatter='{value}%';
      };
      yAxis.push(yAxisJson)
      series.push(seriesJson);
      yAxisIndex++;
    };
    //生成topBrands列表
    var topBrandsData = [];
    for (var k = 0; k < date.length; k++) {
      var json = {};
      json.date = date[k];
      json.value = null;
      topBrandsData.push(json);
    };
    var itemHtmls = this.markeArticle(data.mixTrend.topBrands[0].articles);
    $("#"+id).next().append(itemHtmls);
    // series.push({
    //     name : 'test',
    //     type : 'line',
    //     stack : 'symbol:',
    //     yAxisIndex:0,
    //     symbol : 'rect',
    //     symbolSize : "14",
    //     showAllSymbol:true,
    //     symbolOffset:[0,'-50%'],
    //     hoverAnimation:false,
    //     lineStyle : {
    //       normal : {
    //         opacity:0,
    //         color:"#ef4136",
    //       }
    //     },
    //     itemStyle:{
    //       normal:{
    //         color:"#333",
    //         label:{
    //           show:true,
    //           position:"inside",
    //           offset:[0,2],
    //           formatter:function(params){
    //             return params.data.index;
    //           },
    //           textStyle:{
    //             fontSize:12,
    //             color:"#fff",
    //           }
    //         }
    //       },
    //       emphasis:{
    //         color:"#ef4136"
    //       }
    //     },
    //     areaStyle : {
    //       normal : {
    //         opacity:0
    //       }
    //     },
    //     data : topBrandsData,
    //   })
    var option = {
        title : {
          text: title,
          textStyle : {
            'fontWeight':"normal",
            'fontFamily' : "Open Sans",
            'fontSize' : 12,
          }
        },
        color:['#ef4136','#FB8731','#F4D96C','#F9A5A5'],
        tooltip : {
            trigger : 'axis',
            backgroundColor : "#f2f2f2",
            borderColor : "#dfdfdf",
            borderWidth : 1,
            textStyle : {
              color : "#333",
              fontFamily : "Open Sans"
            },
            axisPointer:{
              lineStyle:{
                type:"dotted",
              }
            },
            extraCssText:'text-align:left;',
            formatter: function(params) {
                var result = "<p style='color:#999;font-size:10px'>"+params[0].name+"</p>";
                params.forEach(function (item) {
                    if (item.seriesName!="test") {
                      result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+':'+item.value+'</p>';
                    };
                });
                result += "</p>"
                 //高亮列表部分关联的item
                // $("#"+id).next().find(".hoverItem").removeClass("hoverItem");
                // $("#"+id).next().find("[data-date='"+params[0].name+"']").addClass("hoverItem");
                return result;
            }
        },
        legend : {
          itemWidth:8,
          itemHeight:8,
          itemGap:20,
          data:legends,
          x: 'left',
          y:'bottom',
          bottom:0,
        },
        grid : {
            left : '0',
            bottom : '40',
            top:'40',
            right:'0',
            containLabel : true
          },
        xAxis : {
          type : 'category',
          splitLine: {
             show: false
           },
           axisLine:{
             show:false
           },
           axisTick:{
             show:false
           },
          axisLabel: {
            showMinLabel:false,
            textStyle: {
                color: '#999',
                fontSize:10,
            }
          },
          min:"dataMin",
          max:"dataMax",  
          boundaryGap:true,
          data : date
        } ,
        yAxis : yAxis ,
        series : series,
      }; 
      myChart.setOption(option);
      //绑定列表和图表的联动事件。。。
      var  _this = this;
      myChart.on('click', function (params) {
          if (typeof params.seriesIndex == 'undefined') {      
           return;      
          }
          var date = params.name;
          var articles = "";
          for (var i = 0; i < data.mixTrend.topBrands.length; i++) {
            var json = data.mixTrend.topBrands[i];
            if (json.date==date) {
              articles = json.articles;
            };
          };
          var aritclesHtml = _this.markeArticle(articles);
          $("#"+id).next().html(aritclesHtml);
      });
      // $("#"+id).next().find(".pic-title-item").on("hover",function(){
      //   var date = $(this).attr("data-date");
      //   myChart.dispatchAction({type: 'showTip', seriesIndex: '1', name: date});
      // })
  },
  markeArticle : function(data){
    if (!data) {return ""};
    var _itemhtml="";
    for(var j=0;j<data.length;j++){
      var item = data[j];
      var convertDate = item.date.split(" ")[0].replace(/\//g,"-");
      _itemhtml += '<div class="pic-title-item" data-date="'+convertDate+'">'+
                      '  <div class="pic-title-item-inner">'+
                      '    <span class="pic-title-item-index">'+item.index+'</span>'+
                      '    <div class="pic-title-item-pic">'+
                      '      <a href="javascript:;">'+
                      '        <img style="background:#ddd;" src="../images/icon_conversions.png" height="55" width="55">'+
                      '      </a>'+
                      '    </div>'+
                      '    <div class="pic-title-item-container">'+
                      '      <div class="pic-title-item-container-title">'+
                      '        <p>'+item.title+'</p>'+
                      '      </div>'+
                      '      <div class="pic-title-item-container-info">'+
                      '        <span>'+item.content+' '+item.date+'</span>'+
                      '      </div>'+
                      '    </div>'+
                      '  </div>'+
                      '</div>';
      //根据date信息，将ABCDEFG显示在图表中。。。
     
      //   var json = {}
      //   for (var k = 0; k < topBrandsData.length; k++) {
      //     json = topBrandsData[k];
      //     if(json.date==convertDate){
      //       json.value = 0;
      //       json.index = item.index;
      //     }
      //   };
    }
    return _itemhtml;
  },
  initAudienceFunnel: function(id, data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var legends=[],date=[],series=[],seriesJson={},title,dateJson={},yAxis=[],yAxisIndex=0,nameJson={},splitNumber=5;
    title = data.audienceFunnel.dataPeriod;
    for (var i in data.audienceFunnel.result) {
      var result = data.audienceFunnel.result[i];
      var yAxisJson = {
        type : 'value',
        splitLine:{
          show:true,
          lineStyle:{
            color:"#dfdfdf"
          }
        },
        axisLine:{
          show:false
        },
        axisTick:{
          show:false
        },
        splitArea:{
          show:false
        },
        axisLabel: {
          showMinLabel:false,
          textStyle: {
              color: '#999',
              fontSize:10,
          }
        },
      }
      
      //遍历result获取date，seriesjson,和分段间隔数
      var max=0,seriesCount={};
      for (var j = 0; j < result.length; j++) {
        if (!dateJson[result[j].date]) {
          date.push(result[j].date);
          dateJson[result[j].date] = result[j];
        };
        if (!nameJson[result[j].name]) {
          seriesJson = {
            name : result[j].name,
            type : i,
            stack : '总量:'+yAxisIndex,
            yAxisIndex:yAxisIndex,
            symbol : 'circle',
            symbolSize : "8",
            showAllSymbol:true,
            hoverAnimation:false,
            lineStyle : {
              normal : {
                color:"#ef4136",
              }
            },
            areaStyle : {
              normal : {
                opacity:0
              }
            },
            data : [{"value":result[j].value,"textStyle":{"color":"#999","fontSize":10}},],
          }
          if(i=="bar"){
            seriesJson.barWidth=40;
            legends.push({
              icon:"circle",
              name:result[j].name,
            })
          }
          series.push(seriesJson);
          seriesCount[result[j].name] = parseInt(result[j].value);
          nameJson[result[j].name] = result[j];
        }else{
          for (var k = 0; k < series.length; k++) {
            if(series[k].name==result[j].name){
              series[k].data.push({
                "value":result[j].value,
                "textStyle":{"color":"#999","fontSize":10},
              });
              seriesCount[result[j].name] = parseInt(seriesCount[result[j].name]) + parseInt(result[j].value);
              break;
            }
          };
        }
      };
      //获取interval值
      for(var z in seriesCount){
        if (max < seriesCount[z]) {
          max = seriesCount[z];
        };
      }
      yAxisJson.interval = Math.ceil(max/splitNumber);
      yAxisJson.max = yAxisJson.interval*splitNumber;
      if (yAxisIndex==1) {
        yAxisJson.max=100;
        yAxisJson.interval = parseInt(100/splitNumber);
        yAxisJson.axisLabel.formatter='{value}%';
      };
      yAxis.push(yAxisJson)
      yAxisIndex++;
    };
    var option = {
        title : {
          text: title,
          textStyle : {
            'fontWeight':"normal",
            'fontFamily' : "Open Sans",
            'fontSize' : 12,
          }
        },
        color:['#ef4136','#F97373','#EBA5A7','#ECD3D3','#ef4136'],
        tooltip : {
            trigger : 'axis',
            backgroundColor : "#f2f2f2",
            borderColor : "#dfdfdf",
            borderWidth : 1,
            textStyle : {
              color : "#333",
              fontFamily : "Open Sans"
            },
            extraCssText:'text-align:left;',
            formatter: function(params) {
                var result = "<p style='color:#999;font-size:10px'>"+params[0].name+"</p>";
                params.forEach(function (item) {
                    result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+':'+item.value+'</p>';
                });
                result += "</p>"
                return result;
            }
        },
        legend : {
          itemWidth:8,
          itemHeight:8,
          itemGap:20,
          data:legends,
          bottom:0,
        },
        grid : {
            left : '0',
            bottom : '40',
            top:'40',
            right:'0',
            containLabel : true
          },
        xAxis : {
          type : 'category',
          splitLine: {
             show: false
           },
           axisLine:{
             show:false
           },
           axisTick:{
             show:false
           },
          axisLabel: {
            showMinLabel:false,
            textStyle: {
                color: '#999',
                fontSize:10,
            }
          },
          min:"dataMin",
          max:"dataMax",  
          boundaryGap:true,
          data : date
        } ,
        yAxis : yAxis ,
        series : series,
      };
      myChart.setOption(option);
  },
  initTotalAudience: function(mainId,audId,marketId,data){
    if(!data) return;
    if (!document.getElementById(mainId)) return;
    if ($("#"+mainId).find(".plan-result-middle-line").length>0) {
      $("#"+mainId).find(".plan-result-middle-line").find("span").text(data.allMarket);
    };
    this.initAudience(audId,data);
    this.initMarketShare(marketId,data);
  },
  initCloudTag: function(id,data,height){
    if(!data || !data.cloud_tag) return;
    if (!document.getElementById(id)) return;
    //判断是否引进了jQCloud插件
    if (typeof $().jQCloud == "function") {
      $("#"+id).jQCloud(data.cloud_tag,{
        height:height
      });
    };
  },
  initAudience: function(id,data){
    if (!document.getElementById(id)) return;
    $("#"+id).text(data ? data.audience : 0);
  },
  initMarketShare: function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var seriesData = [];
    for(var i in data.market_share){
      var seriesJson = {};
      seriesJson.name = i;
      seriesJson.value = data.market_share[i];
      if (i=="market-show") {
        seriesJson.selected = true;
      };
      seriesData.push(seriesJson);
    }
    var option = {
          tooltip: {
              trigger: 'item',
              formatter: "Audience: {c}K",
              backgroundColor:"#f2f2f2",
              borderColor:"#dfdfdf",
              borderWidth:1,
              textStyle:{
                fontSize:10,
                fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
                color:"#333"
              }
          },
          legend: {
              show:false
          },
          color: ['#fff','#f9a5a5'],
          series: [
              {
                  name:'market',
                  type:'pie',
                  radius: '70%',
                  hoverAnimation:false,
                  avoidLabelOverlap: false,
                  clockwise:false,
                  selectedOffset:5,
                  label: {
                      normal: {
                          show: true,
                          position: 'center',
                          formatter: function(params){
                            if(params.name=="market") return "";
                            return params.percent.toFixed(0)+"%";
                          },
                          textStyle: {
                            color:'#ef4136',
                            fontSize:36,
                            fontWeight:"bold",
                            fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false,
                          length: 5,
                          length2: 0,
                      }
                  },
                  itemStyle:{
                    normal:{
                      borderWidth:3,
                      opacity:1,
                      borderType:"solid",
                      borderColor:"#f2f2f2",
                    },
                    emphasis:{
                      borderWidth:3,
                      opacity:1,
                      borderType:"solid",
                      borderColor:"#f2f2f2",
                    }
                  },
                  data:seriesData
              }
          ]
      };
      myChart.setOption(option);
  },
  initGender: function(id,data){
    if (!document.getElementById(id)) return;
    var male = data ? data.gender.male : 0;
    var female = data ? data.gender.female : 0;
    var _total = male+female;
    var malePercent = (parseFloat(male)/_total)*100; 
    var femalePercent = (parseFloat(female)/_total)*100; 
    $("#"+id).parent().find(".gender-male").find("p").text(malePercent.toFixed(0)+"%");
    $("#"+id).parent().find(".gender-female").find("p").text(femalePercent.toFixed(0)+"%");
    var myChart = echarts.init(document.getElementById(id));
    var option = {
          tooltip: {
              trigger: 'item',
              formatter: "{b}: {c}K",
              backgroundColor:"#f2f2f2",
              borderColor:"#dfdfdf",
              borderWidth:1,
              textStyle:{
                fontSize:10,
                fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
                color:"#333"
              }
          },
          legend: {
              show:false
          },
          color: ['#f9a5a5','#ef4136'],
          series: [
              {
                  name:'Gender',
                  type:'pie',
                  radius: ['40%', '70%'],
                  hoverAnimation:false,
                  avoidLabelOverlap: false,
                  selectedOffset:5,
                  label: {
                      normal: {
                          show: false,
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
                          show: false,
                          length: 5,
                          length2: 0,
                      }
                  },
                  data:[
                      {value: female, name:'Female'},
                      {value: male, name:'Male'},
                  ]
              }
          ]
      };
      myChart.setOption(option);
  },
  initAgeGroup: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    $("#"+id).find(".result-graph-word-content").empty();
    var _total = 0;
    for (var i in data.age_group) {
      _total +=parseFloat(data.age_group[i]);
    }
    for (var i in data.age_group) {
      var per = (parseFloat(data.age_group[i])/_total)*100; 
      var isRight = "";
      if (i=="55-64" || i=="65+") {
        isRight = "toolright";
      };
      var _html = '<div class="xmo-bar_per">'+
                '<span class="name">'+i+'</span>'+
                '<span class="result">'+per.toFixed(0)+'%</span>'+
                '<span class="bg_ico bg_ico_'+i.replace("+","")+'"></span>'+
                '<span class="bar_main">'+
                  '<div class="bar_bg"></div>'+
                  '<div class="tooltip-content '+isRight+'">'+
                  '  <p>Age:'+i+'</p>'+
                  ' <span>Audience:'+data.age_group[i]+'</span>'+
                  '</div>'+
                  '<div class="bar_content">'+
                    '<i style="height: '+per.toFixed(0)+'px; background: #EF4136;"></i>'+
                  '</div>'+
                '</span>'+
              '</div>';
      $("#"+id).find(".result-graph-word-content").append(_html);
    };  
    //根据个数设置agegroups宽度
    if($("#"+id).find(".xmo-bar_per").length>0){
      var ageW = $("#"+id).find(".xmo-bar_per").length*36;
      $("#"+id).find(".xmo-bar_per").parent().css("width",ageW+"px");
    } 
  },
  initProductShare: function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var legendData = [], seriesData = [],maxLen=60,length=0,itemGap=10;
    for(var i in data.product_share){
      var legendJson = {};
      var seriesJson = {};
      legendJson.name = i;
      legendJson.icon = "circle";
      seriesJson.name = i;
      seriesJson.value = data.product_share[i];
      legendData.push(legendJson);
      seriesData.push(seriesJson);
      length+=this.getLength(i);
    }
    if (length>maxLen) {
      itemGap=5;
    };
    var myChart = echarts.init(document.getElementById(id));
    var option = {
          tooltip: {
              trigger: 'item',
              backgroundColor : "#f2f2f2",
              borderColor : "#dfdfdf",
              borderWidth : 1,
              textStyle : {
                color : "#333",
                fontFamily : "Open Sans"
              },
              extraCssText:'text-align:left;',
              formatter: "<p><b>{b}</b></p><p>Audience: {c}</p>"
          },
          legend: {
              orient: 'horizontal',
              bottom: '0',
              itemGap:itemGap,
              itemWidth:10,
              itemHeight:10,
              data:legendData,
              textStyle:{
                color:'#333',
                fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
              }
          },
          color: ['#ef4136','#FB8731', '#F4D96C','#F9A5A5'],
          series: [
              {
                  name:'PRODUCT',
                  type:'pie',
                  radius: ['45%', '70%'],
                  avoidLabelOverlap: false,
                  selectedOffset:5,
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
                          show: false,
                          length: 5,
                          length2: 0,
                      }
                  },
                  data:seriesData
              }
          ]
      };
      myChart.setOption(option);
  },
  initDevice: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
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
  initRegions: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var rangeColor = ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'];
    var min = 0,max = 0;
    for (var i = 0; i < data.regions.length; i++) {
      var value = parseInt(data.regions[i].value);
      if (min==0 || min>value) {
        min = value;
      };
      if (max<value) {
        max = value;
      };
    };
    var option = {
          tooltip: {
            backgroundColor:"#f2f2f2",
            formatter: "{b}: {c}",
            borderColor:"#dfdfdf",
            borderWidth:1,
            textStyle:{
              fontSize:10,
              fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
              color:"#333"
            }
          },
          visualMap: {
              min: min,
              max: max,
              type: 'piecewise',
              left: 'left',
              top: 'bottom',
              text: ['High','Low'],
              orient:'horizontal',
              splitNumber:6,
              inverse:true,
              itemGap:3,
              itemWidth:8,
              itemHeight:15,
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
                  // '北京' : 'beijing',
                  // '天津' : 'tianjin'
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
      $("#"+id).parent().parent().find(".result-graph-word-content").empty();
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
        if(i < 10){
          $("#"+id).parent().parent().find(".result-graph-word-content").append(_html);
        }
      }
  },
  initInterests: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    
    var indicator  =[],topPointArr = [],dataArr = [];
    var datas = [],categories = [],liCon = {};
    if ($("#"+id).parent().parent().find(".result-graph-word-content").length>0) {
      $("#"+id).parent().parent().find(".result-graph-word-content").empty();
    };
    for(var i in data.interest){
      if (i!="xxx_test") {
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
      }
      //初始化副标题
        if($("#"+id).parent().parent().find(".result-graph-word-content").length>0){
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
          $("#"+id).parent().parent().find(".result-graph-word-content").append(_html);
        }
        var _li = "";
        for (var j = 0; j < data.interest[i].sub.length; j++) {
          _li += '<li title="'+data.interest[i].sub[j]+'">'+data.interest[i].sub[j]+'</li>';
         };
        var _html = '<ul>'+_li+'</ul>';
        liCon[data.interest[i].name] = _html;
    }
    if($("#"+id).parent().parent().find(".result-graph-word-content").length>0){
      // this.createSpiderByEchart(id,indicator,topPointArr,dataArr);
      this.createSpiderByHighChart(id,datas,categories,liCon);
    }else{
      this.createSpiderByHighChart(id,datas,categories,liCon);
    }
    this.bindEvent();
      
  },
  createSpiderByEchart: function(id,indicator,topPointArr,dataArr){
    var myChart = echarts.init(document.getElementById(id));
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
  createSpiderByHighChart: function(id,datas,categories,liCon){
    if(datas.length != 0 && categories.length != 0){
        new Highcharts.Chart({
            chart: {
                polar: true,
                type: 'area',
                height:350,
                width: 500,
                reflow:true,
                renderTo:id
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
                  var revert = false;//第1个
                  var middle = false;//中间部分
                  var revert_5 = false;//第5个
                  var revert_2 = false;//第三个
                  var revert_3 = false;//第四个
                  for (var i = 0; i < xData.length; i++) {
                    if(this.value==xData[i]){
                      yValue = yData[i];
                      if (xData.length==5) {
                        if (i==3) {revert=true};
                        if (i==1) {revert_5=true};
                        if (i==4) {middle=true};
                        if (i==2) {revert_2=true};
                      }else if(xData.length==6){
                        if (i==5 || i==4) {revert_5 = true}
                        if (i==2 || i==1) {middle=true};
                        if (i==3) {revert_3=true};
                      }
                      
                      break;
                    }
                  };
                  var ul_li =  liCon[this.value];
                  if (revert) {
                    return '<div style="width:200px;margin-left:-55px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;"><div class="graph-tiptool" data-position="top" style="margin-top:6px;margin-bottom: 7px;margin-right: -1px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div><span style="color:#ef4136;font-size:18px;">'+yValue+'%</span><br><span style="font-size:14px;">'+this.value+'</span></div>'
                  }else if (revert_2){
                    return '<div style="min-width:100px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;"><div class="graph-tiptool" data-position="top" ><div style="padding-bottom: 7px;padding-right: 20px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span></div><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div><span style="color:#ef4136;font-size:18px;margin-left:-20px;">'+yValue+'%</span><br><span style="font-size:14px;margin-left:-20px;">'+this.value+'</span></div>'
                  }else if (revert_3){
                    return '<div style="min-width:100px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;margin-top:30px;"><div class="graph-tiptool" data-position="top" ><div style="padding-bottom: 7px;padding-right: 20px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span></div><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div><span style="color:#ef4136;font-size:18px;margin-left:-20px;">'+yValue+'%</span><br><span style="font-size:14px;margin-left:-20px;">'+this.value+'</span></div>'
                  }else if (revert_5) {
                    return '<div style="min-width:100px;text-align:center;margin-top:-30px;margin-left:-40px;display:inline-block;*display:inline;"><span style="font-size:14px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:5px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
                  }else if (middle) {
                    return '<div style="min-width:100px;text-align:center;margin-top:-30px;display:inline-block;*display:inline;"><span style="font-size:14px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:5px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
                  }else{
                    return '<div data-id="chart_0" style="width:586px;margin-left:-251px;text-align:center;margin-bottom:40px;white-space: nowrap;display:inline-block;*display:inline;"><span style="font-size:14px;margin-left: 10px">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;margin-left: 10px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:6px;margin-left: 10px;"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
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
