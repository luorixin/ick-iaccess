var IAX_CHART_TOOL = {
  colorMap : ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'],
  brandData: [],
  sets: [],
  currentBubble:"",
  bubbleData:"",
  charts:[],
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
      var vennSets = [];
      //去除泡泡
      for (var i = 0; i < unselectArr.length; i++) {
        var unselectId = unselectArr[i];
        for (var j = 0; j < _this.bubbleData.length; j++) {
          var sets = _this.bubbleData[j].sets;
          if ($.inArray(parseInt(unselectId),sets)>-1) {
            newBubbleData[j].remove = true;
            vennSets.push(sets.join("_"));
          };
        };
      };
      newBubbleData = newBubbleData.filter(function(data){
        return !data.remove;
      })
      $(this).parents(".bubble-container").find(".bubble-map svg").click();
      // $(this).parents(".bubble-container").find(".bubble-map").empty();
      // _this.initBubble($(this).parents(".bubble-container").attr("id"),newBubbleData);
      $("g").show();
      for (var i = 0; i < vennSets.length; i++) {
        $("[data-venn-sets='"+vennSets[i]+"']").hide();
      };
    })
  },
  resizeChart:function(data){
    var _this = this;
    window.onresize = function(){
      for (var i = 0; i < _this.charts.length; i++) {
        _this.charts[i].resize();
      };
    }
  },
  initData: function(data){
    var _this = this;
    if (!data) return;
    _this.charts=[];
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
      $("g").show();
      _this.currentBubble = data.result[0].id;
      _this.brandData = data.result;
      _this.bubbleData = data.bubble;
    };
  },
  initBubbleInfo:function(id,keywords){
    if (!keywords || keywords.length==0) return;
    if (!document.getElementById(id)) return;
    var liHtml =  '<li style="display:none;"><div class="checkbox checkbox-primary checkbox-switch">'+
                  '    <input type="checkbox" name="bubble-brand" disabled id="bubble-brandall" value="all" checked="checked">'+
                  '    <label for="bubble-brandall">The market</label>'+
                  '</div></li>';
    
    for (var i = 0; i < keywords.length; i++) {
      var style = "";
      if (i==0) {
        style = "display:none";
      }
      liHtml += '<li style="'+style+'"><div class="checkbox checkbox-primary checkbox-switch">'+
                '    <input type="checkbox" name="bubble-brand" id="bubble-brand'+i+'" value="'+i+'" checked="checked">'+
                '    <label for="bubble-brand'+i+'">'+keywords[i]+'</label>'+
                '</div></li>';
    };
    $("#"+id).find(".bubble-info").find("ul").html(liHtml);
    $("#"+id).find(".bubble-info-selected span").text("The market");
  },
  initBubble:function(id,sets){
    if (!sets || sets.length==0) return;
    var _this = this;
    _this.sets = sets;
    var width = 380*0.7;
    var paddingtop = (380-width)/2;
    var chart = venn.VennDiagram()
                 .width(width)
                 .height(width);

    var div = d3.select("#"+id).select(".bubble-map").attr("style","padding-top:"+paddingtop+"px");
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
          var audiences = "Audience: "+IAX_TOOL.formatNum(d.size+"",0);
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
      //将泡泡中文字居中
      $(".venn-circle").each(function(){
        var Marr = $(this).find("path").attr("d").split("\n")[1].split(" ");
        $(this).find(".label").find("tspan").each(function(){
          $(this).attr("x",Marr[1]);
          $(this).attr("y",Marr[2]);
        })
      })
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
          var subTitle = "The Market";
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
    var subTitle = label + " overlaps The Market";
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
                  '<div class="tooltip-content">'+
                  '  <p>Brand: '+i+'</p>'+
                  ' <span>Percent: '+per.toFixed(0)+'%</span>'+
                  '</div>'+
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
                    result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+': '+item.value+'</p>';
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
      this.charts.push(myChart);
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
    var itemtitle = '<div class="pic-title-title"><b>Top 8 Articles in '+data.mixTrend.topBrands[data.mixTrend.topBrands.length-1].date+'</b></div>';
    var itemHtmls = itemtitle + this.markeArticle(data.mixTrend.topBrands[data.mixTrend.topBrands.length-1].articles);
    $("#"+id).next().append(itemHtmls);
    $("#"+id).find(".fa").remove();
    $("#"+id).append('<i class="fa fa-caret-up" style="position:absolute;color:#999;font-size:18px;transform: translateX(-50%);left:592px;top:128px;"></i>')
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
                      var unit = item.seriesIndex=="1" ? "%" : "";
                      result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+': '+item.value+unit+'</p>';
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
            interval:date.length-2,
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
          var itemtitle = '<div class="pic-title-title"><b>Top 8 Articles in '+date+'</b></div>';
          var aritclesHtml = itemtitle+_this.markeArticle(articles);
          $("#"+id).next().html(aritclesHtml);
          //小三角显示在报表中
          console.log(params);
          var offsetX = params.event.offsetX;
          var offsetY = params.event.offsetY;
          $("#"+id).find(".fa").remove();
          $("#"+id).append('<i class="fa fa-caret-up" style="position:absolute;color:#999;font-size:18px;transform: translateX(-50%);left:'+offsetX+'px;top:128px;"></i>')
      });
      this.charts.push(myChart);
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
                      '        <img style="background:#ddd;" src="'+item.pic+'" height="55" width="55">'+
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
      if (i!="total") {;
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
          axisPointer:{
            show:false,
            type:"line",
            lineStyle:{
              show:false,
            }
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
                  color:"#FB8731",
                }
              },
              axisPointer:{
                show:false,
                type:"line",
                lineStyle:{
                  show:false,
                }
              },
              areaStyle : {
                normal : {
                  opacity:0
                }
              },
              data : [{"value":result[j].value,"textStyle":{"color":"#999","fontSize":10},"color":"#FB8731"},],
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
        color:['#ef4136','#F97373','#EBA5A7','#ECD3D3','#FB8731'],
        tooltip : {
            trigger : 'item',
            backgroundColor : "#f2f2f2",
            borderColor : "#dfdfdf",
            axisPointer:{
              show:false,
              type:"line",
              lineStyle:{
                opacity:0,
              }
            },
            borderWidth : 1,
            textStyle : {
              color : "#333",
              fontFamily : "Open Sans"
            },
            extraCssText:'text-align:left;',
        },
        axisPointer:{
          show:false,
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
          axisPointer:{
            show:false,
            type:"line",
            lineStyle:{
              show:false,
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
      var _this = this;
      myChart.on('click', function (params) {
          if (typeof params.seriesIndex == 'undefined') {      
           return;      
          }
          var type = params.seriesType;
          var name = params.seriesName;
          var date = params.name;
          var json = data.audienceFunnel.result.total[0];
          function isEmptyObject(e) {   
          　　for (var name in e){
          　　　　return false;//返回false，不为空对象
          　　}　　
          　　return true;//返回true，为空对象
          }
          for (var i in data.audienceFunnel.result) {
            var result = data.audienceFunnel.result[i];
            if (i==type) {
              for (var j = 0; j < result.length; j++) {
                if (result[j].date == date && result[j].name == name && !isEmptyObject(result[j].graphData)) {
                  json = result[j]; 
                };
              };
            };
          }
          _this.initFunnelGraph(json);
          $(".plan-reports-message").find("span:last").text(date+" - "+name);
      });
      this.charts.push(myChart);
      //初始化all week相关的grpah
      this.initFunnelGraph(data.audienceFunnel.result.total[0]);
  },
  initFunnelGraph: function(json){
    IAX_CHART_TOOL.initGender("gender-map",json.graphData);
    IAX_CHART_TOOL.initAgeGroup("select_age",json.graphData);
    IAX_CHART_TOOL.initRegions("region-map",json.graphData);
    IAX_CHART_TOOL.initInterests("interest-map",json.graphData);
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
      $("#"+id).empty();
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
      this.charts.push(myChart);
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
      this.charts.push(myChart);
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
                  '  <p>Age: '+i+'</p>'+
                  ' <span>Audience: '+data.age_group[i]+'</span>'+
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
    var legendData = [], seriesData = [],maxLen=60,length=0,itemGap=10,width=parseInt($("#"+id).css("width"));
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
    if (length>maxLen && width<500) {
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
                  hoverAnimation:false,
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
      this.charts.push(myChart);
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
      this.charts.push(myChart);
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
              selectedMode:false,
              hoverLink:true,
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
                  silent:true,
                  // tooltip: {show: false},
                  data:data.regions,
              }
          ]
      };
      myChart.setOption(option);
      this.charts.push(myChart);

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
                  '<div class="tooltip-content">'+
                  '  <p>Region: '+data.regions[i].name+'</p>'+
                  ' <span>Percent: '+per.toFixed(0)+'%</span>'+
                  '</div>'+
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
    var counter = 0;
    for(var i in data.interest){
      counter++;
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
                              '<div class="counter">'+counter+'</div>'+
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
      this.charts.push(myChart);
  },
  createSpiderByHighChart: function(id,datas,categories,liCon){
    if(datas.length != 0 && categories.length != 0){
        new Highcharts.Chart({
            chart: {
                polar: true,
                type: 'area',
                height:350,
                width: 470,
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
  exportForPdf:function(clickId,containerId){
    var _this = this;

    // Event Bind
    // 导出PDF
    $('#'+clickId).click(function(e){
      // For Pdf
      //获取当前的tab
      var cloneConId = $("#"+containerId).find(".tab-pane.active").find("div:first").attr("id");
      e.preventDefault();
      _this.init_for_pdf(cloneConId);
      _this.resetData();
      var idMap = _this.pdfData;
      for(var i in idMap){
        _this.pdfDataStep1(i);
      }
    });
  },
  pdfDataStep1: function(id){
    var _this = this;
    this.id2base64(id,function(data,id){
      _this.pdfData[id] = data;
      for(var i in _this.pdfData){
        if(_this.pdfData[i] == '') return false;
      }
      // _this.pdfDataStep2();
      _this.exportPdf(_this.pdfData);
    });
  },
  pdfDataStep2: function(){
    var _this = this;
  },
  id2base64: function(id,callback){
    var par = $('#' + id).parent();
    par.show();
    if (id=="reports_pdf") {
      $("#"+id).find(".plan-title").find(".button-right").hide();
      $("#"+id).find(".plan-reports-result").css({"height":"100%","width":"100%","overflow-y":"hidden","padding-top":0});
      $("#"+id).find(".date-range").hide();
      //去除fixed
      $("#"+id).find(".forFixed-con").removeClass("forFixed-con");

      $("#"+id).find("canvas").each(function(){
        var container = $(this).parent();
        var cloneId =  $(this).parent().parent().attr("id");
        var width = parseInt($(this).parent().parent().css("width"));
        var oldCanvas = document.querySelectorAll('#'+cloneId+' canvas')[0];
        //create a new canvas
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');

        //set dimensions
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;

        //apply the old canvas to the new one
        context.drawImage(oldCanvas, 0, 0);
        container.html(newCanvas);
      })
      //svg问题
      if ($("#"+id).find(".bubble-map").length>0) {
        $("#"+id).find(".bubble-map").css("cssText",$("#"+id).find(".bubble-map").attr("style")+";border-radius:180px!important");
        $("#"+id).find(".bubble-map").append('<canvas id="result_canvas_21"></canvas>');
        $("#"+id).append("<div id='test_canvas'></div>");
        $("#"+id).find("#test_canvas").append( $("#"+id).find(".bubble-map").find("svg").clone());
        var svgHtml = $("#"+id).find("#test_canvas").html();
        $("#"+id).find("#test_canvas").remove();
        $("#"+id).find(".bubble-map").find("svg").remove();
        canvg(document.getElementById("result_canvas_21"),svgHtml);
      }
      if($("#"+id).find(".interest-map").length>0){
        $("#"+id).find(".interest-map").children().append('<canvas id="result_canvas_31"></canvas>');
        $("#"+id).append("<div id='test_canvas'></div>");
        $("#"+id).find("#test_canvas").append( $("#"+id).find(".interest-map").find("svg").clone());
        var svgHtml = $("#"+id).find("#test_canvas").html();
        $("#"+id).find("#test_canvas").remove();
        $("#"+id).find(".interest-map").find("svg").remove();
        canvg(document.getElementById("result_canvas_31"),svgHtml);
      }
      //背景色问题
      var $male = $("#"+id).find(".gender-male");
      $male.find(".gender-map-ico").after('<img src="../images/icon_male_chart.png" style="margin: 40px auto 10px auto;">');
      $male.find(".gender-map-ico").remove();
      var $female = $("#"+id).find(".gender-female");
      $female.find(".gender-map-ico").after('<img src="../images/icon_female_chart.png" style="margin: 40px auto 10px auto;">');
      $female.find(".gender-map-ico").remove();
      var $bgtotal = $("#"+id).find(".plan-reports-bg-total");
      $bgtotal.removeClass("plan-reports-bg-total");
      $bgtotal.before('<img src="../images/icon-ta.png" style="position: absolute;margin-top:20px;left: 50%;margin-left: -60px;" width="120px">');
      //多选单选问题
      $("#"+id).find(".checkbox").each(function(){
        $(this).attr("class","");
        var checkId = $(this).find("input").attr("id");
        $(this).find("input").remove();
        var checkClass = $("#"+checkId).is(":checked") ? "fa-check-square" : "fa-square-o";
        $(this).prepend('<span class="fa '+checkClass+'" style="color: #5AAAEA;font-size: 17px;"></span>');
        $(this).find("label").attr("style","display:inline-block;padding-left:5px;");
      })
      $("#"+id).find(".radio").each(function(){
        $(this).removeClass("radio");
        var checkId = $(this).find("input").attr("id");
        $(this).find("input").remove();
        var checkClass = $("#"+checkId).is(":checked") ? "fa-dot-circle-o" : "fa-circle-o";
        $(this).prepend('<span class="fa '+checkClass+'" style="color: #5AAAEA;font-size: 17px;"></span>');
        $(this).find("label").attr("style","display:inline-block;padding-left:5px;");
      })
    };
    html2canvas($("#"+id),{
      onrendered: function(canvas) {
        var data = canvas.toDataURL("image/jpeg");
        // $("#result_jpg").attr("src",data);
        callback && callback(data,id);
        if (id=="reports_pdf") {
          // console.log(data);
          // $("#"+id).find(".plan-title").find(".button-right").show();
          // $("#"+id).find(".plan-reports-result").css({"height":"500px","overflow-y":"auto"});
        }
        if(par.hasClass('hide')) par.hide();

        return data;
      }
    });
  },
  resetData: function(){
    this.pdfData = {
      title_pdf: '',
      reports_pdf:''
    }
  },
  /**
  *为导出pdf做的一些准备
  */
  init_for_pdf: function(containerId){
    $('#title_pdf').html("<span style='font-size:20px;'>"+$('.page_title').find('h1').html()+$('.page_title').find('a').html()+"</span>");

    $("#reports_pdf").css("width","100%");

    $("#reports_pdf").empty();

    $("#reports_pdf").html($("#"+containerId).html());
    // if(containerId=="for_export_share"){
      $("#reports_pdf").css("width",$("#"+containerId).css("width"));
    // }
    $("#reports_pdf").find(".plan-reports").css("width","100%");

  },
  exportPdf: function(imgData){
    var img_bg = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAYAAD/4QNtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OUZEMjFDNzQwNzIwNjgxMTk5NEM4NjQ2MjVFMEM0MzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzQ2MEMyQzVEMTVGMTFFMjkxMDRFQTQ1MjA4QzVBQTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzQ2MEMyQzREMTVGMTFFMjkxMDRFQTQ1MjA4QzVBQTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgSW5EZXNpZ24gQ1M1LjUgKDcuNSkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0idXVpZDo2YjM0NWQ1Mi01Njc0LWIzNDAtYTljZS1kOTVmMmE1Zjk1YjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjQ3RjExNzQwNzIwNjgxMTk1RkVCQTQ1RkE0N0M4MzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAARDQ0NDg0TDg4TGxIPEhsgGBMTGCAiFxcYFxciIxwfHh4fHCMjKSwuLCkjODg8PDg4QUFBQUFBQUFBQUFBQUFBARMSEhQWFBkVFRkYFBcUGB4YGhoYHiweHiEeHiw5KSMjIyMpOTI2Li4uNjI+Pjk5Pj5BQUFBQUFBQUFBQUFBQUH/wAARCA0PCRYDASIAAhEBAxEB/8QAdAABAQEBAQEAAAAAAAAAAAAAAAMEAgEGAQEAAAAAAAAAAAAAAAAAAAAAEAEAAAMGBwEAAQIFAgUFAAAAAQIDscEycoIzkRJSkhNDBGMRITFBUWGBItGycUJiIxTwoeGiwhEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+8AAeRjCEP5jH+If5xS8k9T+lL+kv+NSP/8AMP8AF7ChT/n+Zv8AnN1Tf1//ABAD/wCRS/8ALGM2WEZv+2B55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqAl55eiftieeXon7YqgJeeXon7Ynnl6J+2KoCXnl6J+2J55eiftiqA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8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fi/PjAGkZuX4vz4wOX4vz4wBpGbl+L8+MDl+L8+MAaRm5fi/PjA5fh/x8f+8YAtNWpS/0mmhCP+X8/wBeDnyVJ/6U5f4h1T/0/wD1/vY6p+H+P/a5f4/9P8XOwTkpQljGaMeaeP8AeaN3+SgAAA//2Q=='
    var img_logo = 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAYAAD/4QNtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OUZEMjFDNzQwNzIwNjgxMTk5NEM4NjQ2MjVFMEM0MzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzQ2MEMyQzlEMTVGMTFFMjkxMDRFQTQ1MjA4QzVBQTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzQ2MEMyQzhEMTVGMTFFMjkxMDRFQTQ1MjA4QzVBQTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgSW5EZXNpZ24gQ1M1LjUgKDcuNSkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0idXVpZDo2YjM0NWQ1Mi01Njc0LWIzNDAtYTljZS1kOTVmMmE1Zjk1YjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjQ3RjExNzQwNzIwNjgxMTk1RkVCQTQ1RkE0N0M4MzkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94Onht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';
   
    

    var title_pdf = imgData.title_pdf;
    var reports_pdf = imgData.reports_pdf;
    var doc = new jsPDF();
    var top = 3;
    function title(){
      doc.setFontSize(10);
      doc.setTextColor(40);
    }
    doc.addImage(img_bg, 'JPEG', 5, top, 200, 250);
    top += 4;
    doc.addImage(img_logo, 'JPEG',156, top, 40.7, 14.7);
    //添加标题
    doc.addImage(title_pdf, 'JPEG',10, top, 90, 10);
    //添加报表内容
    top+=24;
    doc.addImage(reports_pdf, 'JPEG',10, top, 190, 180);
    doc.save('售前策划'+'.pdf');
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
