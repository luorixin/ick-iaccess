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
    //将泡泡中文字居中
    $(".venn-circle").each(function(){
      var Marr = $(this).find("path").attr("d").split("\n")[1].split(" ");
      $(this).find(".label").find("tspan").each(function(){
        $(this).attr("x",Marr[1]);
        $(this).attr("y",Marr[2]);
      })
    })
  },
  resizeChart:function(data){
    var _this = this;
    window.onresize = function(){
      for (var i = 0; i < _this.charts.length; i++) {
        _this.charts[i].chart.resize();
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
      // _this.initMarketGraphByBubble(data.result[0]);
      $("g").show();
      jQuery.fn.d3Click = function () {
       this.each(function (i, e) {
         var evt = document.createEvent("MouseEvents");
         evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
         e.dispatchEvent(evt);
       });
      };
      _this.currentBubble = data.result[1].id;
      _this.brandData = data.result;
      _this.bubbleData = data.bubble;
      $("[data-venn-sets='0']").d3Click();
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
          $(this).css("opacity","1");
          $(this).addClass("bubble-select");
          var subTitle = "The Market";
          var audience = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[0];
          var market = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[1];
          var selectLabel = $("#"+id).find(".bubble-info").find("#bubble-brandall").next().text();
          var audienceTitle = 'Audience Scale <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
          var marketTitle = 'Industry Penetration <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
          $(audience).find(".result-text-header label").html(audienceTitle);
          $(market).find(".result-text-header label").html(marketTitle);
          $(market).find(".result-graph-word-content>label").text(subTitle);
          $("#"+id).find(".bubble-info-selected span").text(selectLabel);
          if (_this.currentBubble != _this.brandData[0].id) {
            _this.initMarketGraphByBubble(_this.brandData[0]);
            _this.currentBubble = _this.brandData[0].id;
          };
      })
      $("#"+id).on("mouseover",".bubble-map",function(e){
          e = e || window.event;
          e.stopPropagation();
          if (e.target.nodeName=="path"||e.target.nodeName=="tspan") {
            $(this).css("opacity","1");
            return
          }
          $(this).css("opacity","0.8");
      })
      $("#"+id).on("mouseout",".bubble-map",function(e){
          e = e || window.event;
          e.stopPropagation();
          $(this).css("opacity","1");
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
    var marketTitle = 'Industry Penetration <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="Find out how many of the same people are in your brand"></i>';
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
      //audience scale & Industry Penetration 变更标题
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
                  ' <span>Audience: '+this.getKWMformat(data[i])+'</span>'+
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
    var _this = this;
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
          show:false,
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
                var result = "<p style='color:#999;font-size:10px'>"+params[0].name+"</p>"+
                             "<p style='color:#333;font-weight:bold;'>Audience Scale</p>";
                params.forEach(function (item) {
                    result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+': '+_this.getKWMformat(item.value)+'</p>';
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
            formatter : function (value, index) {
              return _this.getKWMformat(value);
            },
            textStyle: {
                color: '#999',
                fontSize:10,
            }
          },
        } ,
        series : series,
      }; 
        
      myChart.setOption(option);
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
  },
  initMixTrend: function(id,data){
    if(!data || !data.mixTrend) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var _this = this;
    var legends=[],date=[],series=[],seriesJson={},title,dateJson={},yAxis=[],yAxisIndex=0,splitNumber=5;
    title = data.mixTrend.dataPeriod;
    if($("#"+id).parents(".plan-result-graph").find("#daterange").length>0){
      var period = title.replace("Period: ","").split(" - ").join(" ~ ");
      $("#"+id).parents(".plan-result-graph").find("#daterange").val(period.replace(/\//g,"-"));
    }
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
      //根据date进行归纳
      for (var j = 0; j < result.length; j++) {
        if (!dateJson[result[j].date]) {
          date.push(result[j].date);
          dateJson[result[j].date] = result[j];
        };
        seriesJson.data.push({
          "value":result[j].value,
          "textStyle":{"color":"#999","fontSize":10},
        })
        if (max < parseInt(result[j].value)) {
          max = parseInt(result[j].value);
        };
      };
      yAxisJson.interval = Math.ceil(max/splitNumber);
      yAxisJson.max = yAxisJson.interval*splitNumber;
      if (yAxisIndex==0) {
        yAxisJson.axisLabel.formatter = function (value, index) {
            return _this.getKWMformat(value);
        }
      };
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
    if (data.mixTrend.topBrands.length>0) {
      var itemtitle = '<div class="pic-title-title"><b>Related Articles in '+data.mixTrend.topBrands[data.mixTrend.topBrands.length-1].date+'</b></div>';
      var itemHtmls = itemtitle + this.markeArticle(data.mixTrend.topBrands[data.mixTrend.topBrands.length-1].articles);
      $("#"+id).next().html(itemHtmls);
    };
    // $("#"+id).find(".fa").remove();
    // $("#"+id).append('<i class="fa fa-caret-up" style="position:absolute;color:#999;font-size:18px;transform: translateX(-50%);left:592px;top:128px;"></i>')
    //默认选中最后一个，及最后一个出现三角形。添加三角形线条
    var angleSeries = {
      name : 'test',
      type : 'line',
      stack : 'symbol:',
      yAxisIndex:0,
      symbol : 'triangle',
      symbolSize : "14",
      showAllSymbol:true,
      symbolOffset:[0,'-50%'],
      hoverAnimation:false,
      lineStyle : {
        normal : {
          opacity:0,
          color:"#ef4136",
        }
      },
      itemStyle:{
        normal:{
          color:"#999",
          label:{
            show:false,
            position:"inside",
            offset:[0,2],
            formatter:function(params){
              return params.data.index;
            },
            textStyle:{
              fontSize:12,
              color:"#fff",
            }
          }
        },
        emphasis:{
          color:"#ef4136"
        }
      },
      areaStyle : {
        normal : {
          opacity:0
        }
      },
      data : topBrandsData,
    }
    topBrandsData[topBrandsData.length-1].value = 0;
    angleSeries.data = topBrandsData;
    series.push(angleSeries);
    var option = {
        title : {
          text: title,
          show: false,
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
                      if (item.value) {
                        var unit = item.seriesIndex=="1" ? "%" : "";
                        result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+': '+_this.getKWMformat(item.value)+unit+'</p>';
                      };
                    };
                });
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
          var itemtitle = '<div class="pic-title-title"><b>Related Articles in '+date+'</b></div>';
          var aritclesHtml = itemtitle+_this.markeArticle(articles);
          $("#"+id).next().html(aritclesHtml);
          //小三角显示在报表中
          // console.log(params);
          // var offsetX = params.event.offsetX;
          // var offsetY = params.event.offsetY;
          // $("#"+id).find(".fa").remove();
          // $("#"+id).append('<i class="fa fa-caret-up" style="position:absolute;color:#999;font-size:18px;transform: translateX(-50%);left:'+offsetX+'px;top:128px;"></i>')
          for (var i = 0; i < topBrandsData.length; i++) {
            topBrandsData[i].value = null;
            if (topBrandsData[i].date == date) {
              topBrandsData[i].value = 0;
            };
          };
          angleSeries.data = topBrandsData;
          series.splice(series.length-1,0,angleSeries);
          option.series = series;
          myChart.setOption(option);
      });
      
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
      // $("#"+id).next().find(".pic-title-item").on("hover",function(){
      //   var date = $(this).attr("data-date");
      //   myChart.dispatchAction({type: 'showTip', seriesIndex: '1', name: date});
      // })
  },
  markeArticle : function(data){
    if (!data) {return ""};
    var _itemhtml="",maxContentLen=20,maxTitleLen = 40;
    window.errorImg = function errorimg(that){
      that.src="../images/icon_news.png";
    }
    for(var j=0;j<data.length;j++){
      var item = data[j];
      var convertDate = item.date.split(" ")[0].replace(/\//g,"-");
      var content = item.content;
      var lengthCon = this.getLength(item.content);
      if (lengthCon > maxContentLen) {
        content = content.substring(0,maxContentLen-1) + "...";
      };
      var title = item.title;
      var index = j+1;
      var lengthTitle = this.getLength(item.title);
      if (lengthTitle > maxTitleLen) {
        title = title.substring(0,maxTitleLen-1) + "...";
      };
      if (!item.pic) {
        item.pic = "../images/icon_news.png";
      };
      //竖着排12345.。。。。
      if (j==0 || j==5) {
        _itemhtml += '<div style="float:left;width:50%;">'
      };
      _itemhtml += '<div class="pic-title-item" style="width:100%;" data-date="'+convertDate+'">'+
                      '  <a href="'+item.url+'" target="_blank" class="pic-title-item-a"></a>'+
                      '  <div class="pic-title-item-inner">'+
                      '    <span class="pic-title-item-index">'+index+'</span>'+
                      '    <div class="pic-title-item-pic">'+
                      '      <a href="javascript:;">'+
                      '        <img src="'+item.pic+'" height="55" width="55" onerror="errorImg(this)">'+
                      '      </a>'+
                      '    </div>'+
                      '    <div class="pic-title-item-container">'+
                      '      <div class="pic-title-item-container-title">'+
                      '        <p>'+title+'</p>'+
                      '      </div>'+
                      '      <div class="pic-title-item-container-info">'+
                      '        <span>'+content+' '+item.date+'</span>'+
                      '      </div>'+
                      '    </div>'+
                      '  </div>'+
                      '</div>';
      if (j==4 || j==9 || j==data.length-1) {
        _itemhtml += '</div>';
      };
    }
    return _itemhtml;
  },
  initAudienceFunnel: function(id, data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var legends=[],date=[],series=[],seriesJson={},title,dateJson={},yAxis=[],yAxisIndex=0,nameJson={},splitNumber=5;
    title = data.audienceFunnel.dataPeriod;
    var _this = this;
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
            seriesCount[result[j].date] = parseInt(result[j].value);
          }else{
            for (var k = 0; k < date.length; k++) {
              if(date[k]==result[j].date){
                seriesCount[result[j].date] = parseInt(seriesCount[result[j].date]) + parseInt(result[j].value);
                break;
              }
            };
          }
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
        console.log(seriesCount)
        for(var z in seriesCount){
          if (max < seriesCount[z]) {
            max = seriesCount[z];
          };
        }
        yAxisJson.interval = Math.ceil(max/splitNumber);
        yAxisJson.max = yAxisJson.interval*splitNumber;
        if (yAxisIndex==0) {
          yAxisJson.axisLabel.formatter = function (value, index) {
              return _this.getKWMformat(value);
          }
        };
        if (yAxisIndex==1) {
          yAxisJson.max=100;
          yAxisJson.interval = parseInt(100/splitNumber);
          yAxisJson.axisLabel.formatter='{value}%';
        };
        //折线图需要算出百分比,根据原有value计算出percent
        //算出percent
        if (i=="line") {
          for (var k = 0; k < series.length; k++) {
            if (series[k].type=="line") {
              var totalCount = seriesCount[series[k].name];
              for (var z = 0; z < series[k].data.length; z++) {
                series[k].data[z].trueValue = series[k].data[z].value;
                // series[k].data[z].value = (parseFloat(series[k].data[z].value)/totalCount)*100;
                series[k].data[z].value = parseFloat(series[k].data[z].value);
              };
            };
          };
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
            // formatter: "<p style='color:#999;'>{b}</p><p><b>{a}</b></p><p>Audience: {c}</p>",
            formatter: function(params){
              var type = params.seriesType;
              var seriesName = params.seriesName;
              var value = _this.getKWMformat(params.value);
              if (type=="line") {
                // value = params.value.toFixed(2) + "% ("+_this.getKWMformat(params.data.trueValue)+")";
                value = params.value.toFixed(2) + "%";
              };
              if (type=="bar") {
                seriesName = seriesName + " Audience";
              };
              return "<p style='color:#999;'>"+params.name+"</p><p><b>"+seriesName+"</b></p><p>Audience: "+value+"</p>";
            },
            textStyle:{
              fontSize:10,
              fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
              color:"#333"
            },
            borderWidth : 1,
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
      // myChart.on('click', function (params) {
      //     if (typeof params.seriesIndex == 'undefined') {      
      //      return;      
      //     }
      //     var type = params.seriesType;
      //     var name = params.seriesName;
      //     var date = params.name;
      //     var json = data.audienceFunnel.result.total[0];
      //     function isEmptyObject(e) {   
      //     　　for (var name in e){
      //     　　　　return false;//返回false，不为空对象
      //     　　}　　
      //     　　return true;//返回true，为空对象
      //     }
      //     for (var i in data.audienceFunnel.result) {
      //       var result = data.audienceFunnel.result[i];
      //       if (i==type) {
      //         for (var j = 0; j < result.length; j++) {
      //           if (result[j].date == date && result[j].name == name && !isEmptyObject(result[j].graphData)) {
      //             json = result[j]; 
      //           };
      //         };
      //       };
      //     }
      //     _this.initFunnelGraph(json);
      //     $(".plan-reports-message").find("span:last").text(date+" - "+name +" Audience");
      // });
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
      //初始化all week相关的grpah
      // this.initFunnelGraph(data.audienceFunnel.result.total[0]);
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
      $("#"+mainId).find(".plan-result-middle-line").find("span").text(this.getKWMformat(data.allMarket));
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
    $("#"+id).text(data ? this.getKWMformat(data.audience) : 0);
  },
  initMarketShare: function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var myChart = echarts.init(document.getElementById(id));
    var seriesData = [],borderWidth=3;
    var _this = this;
    for(var i in data.market_share){
      var seriesJson = {};
      seriesJson.name = i;
      seriesJson.value = data.market_share[i];
      if (i=="market-show") {
        seriesJson.selected = true;
      };
      if (seriesJson.value==0) {
        borderWidth = 0;
      };
      seriesData.push(seriesJson);
    }
    var option = {
          tooltip: {
              trigger: 'item',
              formatter: function(params){
                return "Audience: "+_this.getKWMformat(params.value);
              },
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
                            if (params.percent<0.01) {params.percent=0.01};
                            return params.percent.toFixed(2)+"%";
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
                      borderWidth:borderWidth,
                      opacity:1,
                      borderType:"solid",
                      borderColor:"#f2f2f2",
                    },
                    emphasis:{
                      borderWidth:borderWidth,
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
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
  },
  initGender: function(id,data){
    if (!document.getElementById(id)) return;
    var male = data ? data.gender.male : 0;
    var female = data ? data.gender.female : 0;
    var _total = male+female;
    var malePercent = (parseFloat(male)/_total)*100; 
    var femalePercent = (parseFloat(female)/_total)*100; 
    var _this = this;
    $("#"+id).parent().find(".gender-male").find("p").text(malePercent.toFixed(0)+"%");
    $("#"+id).parent().find(".gender-female").find("p").text(femalePercent.toFixed(0)+"%");
    var myChart = echarts.init(document.getElementById(id));
    var option = {
          tooltip: {
              trigger: 'item',
              formatter: function(params){
                return "<p><b>"+params.name+"</b></p><p>Audience: "+_this.getKWMformat(params.value)+"</p>";
              },
              backgroundColor:"#f2f2f2",
              borderColor:"#dfdfdf",
              borderWidth:1,
              textStyle:{
                fontSize:10,
                fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
                color:"#333"
              },
              extraCssText:'text-align:left;',
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
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
  },
  initAgeGroup: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var _this = this;
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
                  ' <span>Audience: '+_this.getKWMformat(data.age_group[i])+'</span>'+
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
    var _this = this;
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
              formatter: function(params){
                return "<p><b>"+params.name+"</b></p><p>Audience: "+_this.getKWMformat(params.value)+"</p>";
              }
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
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
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
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
  },
  initRegions: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    var myChart = echarts.init(document.getElementById(id));
    var rangeColor = ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'];
    var min = 0,max = 0;
    for (var i = 0; i < data.regions.length; i++) {
      if (!data.regions[i].name) data.regions[i].name="null";
      var isOthers = data.regions[i].name=="其他" || data.regions[i].name=="其他城市" || data.regions[i].name.indexOf("Other")>-1;
      if (!isOthers) {
        var value = parseInt(data.regions[i].value);
        if (min==0 || min>value) {
          min = value;
        };
        if (max<value) {
          max = value;
        };
      };
    };
    var nameMap = {
      "北京":"BeiJing", 
      "天津":"TianJin", 
      "河北":"HeBei",
      "山西":"ShanXi", 
      "内蒙古":"NeiMeng", 
      "辽宁":"LiaoNing", 
      "吉林":"JiLin",
      "黑龙江":"Heilongjiang", 
      "上海":"Shanghai", 
      "江苏":"Jiangsu", 
      "浙江":"Zhejiang",
      "安徽":"AnHui", 
      "福建":"FuJian", 
      "江西":"JiangXi", 
      "山东":"ShanDong",
      "河南":"HeNan", 
      "湖北":"HuBei", 
      "湖南":"HuNan", 
      "广东":"GuangDong",
      "广西":"GuangXi", 
      "海南":"HaiNan", 
      "重庆":"ChongQing", 
      "四川":"SiChuan",
      "贵州":"GuiZhou", 
      "云南":"YunNan", 
      "西藏":"XiZang", 
      "陕西":"ShanXi1",
      "甘肃":"GanSu", 
      "青海":"QingHai", 
      "宁夏":"NingXia", 
      "新疆":"XinJiang",
      "台湾":"TaiWan", 
      "香港":"HongKong", 
      "澳门":"Macao"
    }
    if (true) {};
    var option = {
          tooltip: {
            backgroundColor:"#f2f2f2",
            borderColor:"#dfdfdf",
            borderWidth:1,
            textStyle:{
              fontSize:10,
              fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
              color:"#333"
            },
            extraCssText:'text-align:left;',
            formatter: function(params){
              var value = params.value;
              if (isNaN(params.value)) return;
              return "<p><b>Region: "+params.name+"</b></p><p>Audience: "+_this.getKWMformat(value)+"</p>";
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
              nameMap:nameMap
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
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };

      var _total = 0;
      for (var i = 0; i < data.regions.length; i++) {
        _total +=parseFloat(data.regions[i].value);
      }
      $("#"+id).parent().parent().find(".result-graph-word-content").empty();
      //json排序
      var sortJson = function(order, sortBy,fun){
        var ordAlpah = (order == 'asc') ? '>' : '<';
        var sortFun = new Function('a', 'b', 'return '+fun+'(a.' + sortBy + ')'+ordAlpah +fun+ '(b.' + sortBy + ')?1:-1');
        return sortFun;
      }
      data.regions = data.regions.sort(sortJson("desc","value","parseInt"));
      var others = "",index=1,othersName="";
      var totalItem = data.regions.length;
      var pageItem = 10;
      for (var i = 0; i < data.regions.length; i++) {
        if (!data.regions[i].name) data.regions[i].name="null";
        var isOthers = data.regions[i].name=="其他" || data.regions[i].name=="其他城市" || data.regions[i].name.indexOf("Other")>-1;
        var per = (parseFloat(data.regions[i].value)/_total)*100;
        var display = "block";
        if(index > pageItem){
          display = "none";
        }
        var _html = '<div class="xmo-line_per" style="display:'+display+'">'+
               '<span class="name">'+index+'.'+data.regions[i].name+'</span>'+
                '<span class="result">'+per.toFixed(2)+'%</span>'+
                '<span class="line_main">'+
                  '<div class="tooltip-content">'+
                  '  <p>Region: '+data.regions[i].name+'</p>'+
                  ' <span>Audience: '+_this.getKWMformat(data.regions[i].value)+'</span>'+
                  '</div>'+
                  '<div class="xmo-progress-line left">'+
                    '<div style="width: '+(per*2).toFixed(2)+'%;" class="bar"></div>'+
                  '</div>'+
                '</span>'+
              '</div>';
        if(isOthers){
          others = _html;
          othersName = data.regions[i].name;
        }
        if(!isOthers){
          $("#"+id).parent().parent().find(".result-graph-word-content").append(_html);
          index++;
        }
      }
      $("#"+id).parent().parent().find(".result-graph-word-content").append(others);
      
      var disabledPrev = "disabled",
          disabledNext = totalItem>pageItem ? "" : "disabled";
      var _page = '<div style="display:flex;padding-left:80px;" id="">'+
                  '  <span class="paginate_button previous glyphicon glyphicon-menu-left '+disabledPrev+'"></span>'+
                  '  <span class="paginate_button next glyphicon glyphicon-menu-right '+disabledNext+'"></span>'+
                  '</div>';
      $("#"+id).parent().parent().find(".result-graph-word-content").append(_page);
      //绑定分页事件
      $("#"+id).parent().parent().find(".result-graph-word-content").off();
      $("#"+id).parent().parent().find(".result-graph-word-content").on("click",".paginate_button.previous",function(){
        if($(this).hasClass("disabled")) return;
        var end = $(this).parent().parent().find(".xmo-line_per:visible").first().index();
        var start = 0;
        var hasNext = false,hasPrev = false;
        if (end > -1) {
          start = end-pageItem;
          hasNext = true;
        }else{
          end = 10;
        } 
        if (start > 0) {
          hasPrev = true
        };
        hasPrev ? $(this).removeClass("disabled") : $(this).addClass("disabled");
        hasNext ? $(this).next().removeClass("disabled") : $(this).next().addClass("disabled");
        $(this).parent().parent().find(".xmo-line_per").hide();
        $(this).parent().parent().find(".xmo-line_per").slice(start,end).show();
      })
      $("#"+id).parent().parent().find(".result-graph-word-content").on("click",".paginate_button.next",function(){
        if($(this).hasClass("disabled")) return;
        var start = $(this).parent().parent().find(".xmo-line_per:visible").last().index()+1;
        var end = pageItem  ;
        var hasNext = false,hasPrev = false;
        if (start>-1) {
          end = start+pageItem;
          hasPrev = true;
        }else{
          start = 0;
        } 
        if (end < totalItem) {
          hasNext = true
        }else{
          end = totalItem;
        }
        hasPrev ? $(this).prev().removeClass("disabled") : $(this).prev().addClass("disabled");
        hasNext ? $(this).removeClass("disabled") : $(this).addClass("disabled");
        $(this).parent().parent().find(".xmo-line_per").hide();
        $(this).parent().parent().find(".xmo-line_per").slice(start,end).show();
      })
      var lastindex =  $("#"+id).parent().parent().find(".result-graph-word-content").find(".xmo-line_per").length;
      if (lastindex > pageItem) {
        $("#"+id).parent().parent().find(".result-graph-word-content").find(".xmo-line_per:last").hide();
      };
      $("#"+id).parent().parent().find(".result-graph-word-content").find(".xmo-line_per:last").find(".name").text(lastindex+"."+othersName);
  },
  initInterests: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    
    var indicator  =[],topPointArr = [],dataArr = [];
    var datas = [],categories = [],liCon = {};
    if ($("#"+id).parent().parent().find(".result-graph-word-content").length>0) {
      $("#"+id).parent().parent().find(".result-graph-word-content").empty();
    };
    var counter = 0,maxLen=22;
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
            _li += '<li title="'+data.interest[i].sub[j]+'">'+(j+1)+'.'+data.interest[i].sub[j]+'</li>';
          };
          var _html = '<div class="result-graph-word-interest">'+
                            '<div class="result-graph-word-interest-inner">'+
                              '<label title="'+data.interest[i].name+'">'+data.interest[i].name+'</label>'+
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
      var isExists = false;
      for (var i = 0; i < this.charts.length; i++) {
        if(this.charts[i].id == id){
          this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        this.charts.push({id:id,chart:myChart});
      };
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
                    return '<div style="min-width:100px;margin-left:-10px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;margin-top:40px;"><div class="graph-tiptool" data-position="top" ><div style="padding-bottom: 7px;padding-right: 20px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span></div><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div><span style="color:#ef4136;font-size:18px;margin-left:-20px;">'+yValue+'%</span><br><span style="font-size:14px;margin-left:-20px;">'+this.value+'</span></div>'
                  }else if (revert_5) {
                    return '<div style="min-width:100px;text-align:center;margin-top:-30px;margin-left:-40px;display:inline-block;*display:inline;"><span style="font-size:14px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:5px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
                  }else if (middle) {
                    return '<div style="min-width:100px;text-align:center;margin-top:-30px;display:inline-block;*display:inline;"><span style="font-size:14px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:5px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
                  }else{
                    return '<div data-id="chart_0" style="width:586px;margin-left:-271px;text-align:center;margin-bottom:40px;white-space: nowrap;display:inline-block;*display:inline;"><span style="font-size:14px;margin-left: 10px">'+this.value+'</span><br><span style="color:#ef4136;font-size:18px;margin-left: 10px;">'+yValue+'%</span><br/><div class="graph-tiptool" data-position="top" style="margin-top:6px;margin-left: 10px;"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
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
                    to: 12.5
                },{
                    color: '#F1F1F2',
                    from: 12.5,
                    to: 25
                },{
                    color: '#fff',
                    from: 25,
                    to: 37.5
                },{
                  color: '#F1F1F2',
                    from: 37.5,
                    to: 50
                }],
                    tickPositioner: function () {
                    var positions = [],
                        tick =0,
                        increment = 12.5;
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
        _this.pdfDataStep1(i,cloneConId);
      }
    });
  },
  pdfDataStep1: function(id,cloneConId){
    var _this = this;
    this.id2base64(id,cloneConId,function(data,id,cloneConId){
      _this.pdfData[id] = data;
      for(var i in _this.pdfData){
        if(_this.pdfData[i] == '') return false;
      }
      // _this.pdfDataStep2();
      _this.exportPdf(_this.pdfData,cloneConId);
    });
  },
  pdfDataStep2: function(){
    var _this = this;
  },
  id2base64: function(id,cloneConId,callback){
    var par = $('#' + id).parent();
    par.show();
    if (id=="reports_pdf") {
      $("#"+id).find(".plan-title").find(".button-right").hide();
      $("#"+id).find(".plan-reports-result").css({"height":"100%","width":"100%","overflow-y":"hidden","padding-top":0});
      //去除fixed
      $("#"+id).find(".forFixed-con").removeClass("forFixed-con");
      function getParentId($this){
        var id = $this.attr("id");
        if (id) {
          return id;
        }else{
          return getParentId($this.parent());
        }
      }
      $("#"+id).find("canvas").each(function(i){
        var container = $(this).parent();
        var cloneId = getParentId($(this).parent());
        var width = parseInt($(this).parent().parent().css("width"));
        var oldCanvas = document.querySelectorAll('#'+cloneConId+' canvas')[i];
        var oldStyle = $("#"+cloneConId+" canvas").eq(i).attr("style");
        //create a new canvas
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');

        //set dimensions
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        newCanvas.style = oldCanvas.style;

        //apply the old canvas to the new one
        context.drawImage(oldCanvas, 0, 0);
        // container.html(newCanvas);
        $(this).after(newCanvas);
        $(this).next().attr("style",oldStyle);
        $(this).remove();
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
      //input输入框问题
      $("#"+id).find("input").each(function(i){
        var name=$(this).attr("name");
        $(this).attr("value",$("#"+cloneConId).find("input").eq(i).val());
      })
      //daterange问题
      $("#"+id).find(".date-range .date-range-ico").attr("style","position:relative;margin-right:-1px;float:left;padding-top:6px;");
      $("#"+id).find(".date-range .fa").attr("style","position:relative;margin-top:8px;");
      $("#"+id).find(".date-range input").attr("style","padding-left:10px;width:160px;");
    };
    html2canvas($("#"+id),{
      onrendered: function(canvas) {
        // $("#result_jpg").attr("src",data);
        var data = canvas.toDataURL("image/jpeg");
        callback && callback(canvas,id,cloneConId);
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
      reports_pdf:'',
    }
  },
  /**
  *为导出pdf做的一些准备
  */
  init_for_pdf: function(containerId){
    $('#title_pdf').html("<span style='font-size:20px;'>"+$('.page_title').find('h1').html()+$('.page_title').find('a').html()+"</span>");

    $("#reports_pdf").css("width","100%");

    $("#reports_pdf").empty();
    var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var myheading = $(".myheading:first").clone();
    myheading.find(".navbar-inverse").attr("style","border-bottom:1px solid #dfdfdf;padding: 0 20px;margin: 0 -20px;");
    myheading.find(".container-fluid").css("padding-left",0);
    myheading.find(".x-search").remove();
    myheading.find(".x-top-menu").remove();
    myheading.find(".x-user-main:last").html('<div class="x-user-con" style="min-width: 90px;background:none"><span class="x-user-dis">&nbsp;Date: '+date+'</span></div>');
    myheading.find(".navbar-form").remove();
    myheading.find(".navbar-collapse").append('<div style="float: left;height: 60px;line-height: 60px;font-weight: bold;font-size: 15px;">Symphony-iAudience</div>');
    
    var $pageTitle = $(".page_title:first").clone();
    $pageTitle.find(".fa").remove();
    $pageTitle.find("input").remove();
    var pageTitle = '<div class="page_title">'+$pageTitle.html() +'</div>';

    var $nav = $("#myTab").clone();
    var nav = '<ul class="nav nav-tabs sub-nav-tabs" style="margin-bottom:20px;">'+$nav.html()+'</ul>';

    $("#reports_pdf").html(myheading.html()+pageTitle+nav+$("#"+containerId).html());
    if (containerId=="for_export_location") {
      $("#reports_pdf").find(".map-container").prev().remove();
      $("#reports_pdf").find(".map-container").prev().remove();
      $("#reports_pdf").find(".fa").remove();
      $("#reports_pdf").find("[name='Locations']").each(function(){
        $(this).attr("style","margin-top:10px;")
      })
      $("#reports_pdf").find(".plus-area").remove();
    };
    // if(containerId=="for_export_share"){
      var width = parseInt($("#"+containerId).css("width"))+40;
      $("#reports_pdf").attr("style","width:"+width+"px;padding:0 20px;");
    // }
    $("#reports_pdf").find(".plan-reports").css("width","100%");

  },
  exportPdf: function(canvas,cloneConId){
    var title_pdf = canvas.title_pdf.toDataURL("image/jpeg");;
    var reports_pdf = canvas.reports_pdf.toDataURL("image/jpeg");;
    // var doc = new jsPDF();
    // var top = 3;
    // // top += 4;
    // //添加标题
    // // doc.addImage(title_pdf, 'JPEG',10, top, 90, 10);
    // //添加报表内容
    // // top+=24;
    // var height = 180;
    // if (cloneConId=="for_export_location") {
    //   height=100;
    // };
    // doc.addImage(reports_pdf, 'JPEG',10, top, 110, 67.6);
    var imgWidth = 210; 
    var pageHeight = 285;  
    var imgHeight = canvas.reports_pdf.height * imgWidth / canvas.reports_pdf.width;
    var heightLeft = imgHeight;

    var doc = new jsPDF('p', 'mm');
    var position = 0;

    doc.addImage(reports_pdf, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(reports_pdf, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    doc.save('Symphony-iAudience'+'.pdf');
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
  },
  getKWMformat:function($num){
    if ($num >= 1000000){
        $num = Math.round($num / 1000000 * 100) / 100;
        $num = this.formatNum($num) +' M';
    } else if($num >= 1000) {
        $num = Math.round($num / 1000 * 100) / 100 
        $num = this.formatNum($num)+ ' K';
    } else {
        $num = $num;
    }
    return $num;
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
    str = str+"";
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
}
