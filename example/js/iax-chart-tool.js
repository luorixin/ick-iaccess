var IAX_CHART_TOOL = {
  colorMap : ['#EF4136', '#FFBD00', '#4484CF', '#946EDB', '#8D7B7B', '#54C7B0','#F47920','#194283','#59C754'],
  brandData: [],
  sets: [],
  currentBubble:"",
  bubbleData:"",
  charts:[],
  version:"CN",
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

      $(this).parents(".bubble-container").find(".bubble-map").empty();
      _this.initBubble($(this).parents(".bubble-container").attr("id"),newBubbleData);
      $("g").show();

      // for (var i = 0; i < vennSets.length; i++) {
      //   $("[data-venn-sets='"+vennSets[i]+"']").hide();
      // };
    })
    //将泡泡中文字居中
    $(".venn-circle").each(function(){
      // console.log($(this).find("path").attr("d").split("M ")[1].split("m ")[0])
      var Marr = $(this).find("path").attr("d").split("M ")[1].split("m ")[0].split(" ");
      $(this).find(".label").find("tspan").each(function(){
        $(this).attr("x",Marr[0]);
        $(this).attr("y",Marr[1]);
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
  loadingGif:function(id){
    $("#myTab").append('<div class="loading-unclicklayer"></div>');
    $(".x-sidebar").find("li.selected").css("position","relative").append('<div class="loading-unclicklayer"></div>');
    var html ='<div style="width:510px;left:50%;margin-top:20px;margin-left:-200px;position:relative">'+
              '  <div class="loading-gif-gender" style="position:relative;width:100px;">'+
              '    <div class="gender-male"> '+
              '      <span class="gender-map-ico loading-hide"></span> '+
              '      <span class="gender-map-ico" style=""></span> '+
              '    </div>'+
              '    <p data-per="0" style="color:#ef4136;margin-top:5px;text-align:center;">0.00%</p>'+
              '  </div>'+
              '  <div style="float:left;width:310px;">'+
              '    <p style="display:table;text-align:left;height:60px;"><label style="display:table-cell;vertical-align: middle;font-size:20px;line-height:30px;"><span style="font-size:20px;line-height:30px;">Defining the market</span><dot>...</dot></label></p><hr/>'+
              '    <p style="color:#999;text-align:left;width:310px;font-size:12px;">Audience plan is running and that can take a few moments. Hang in there, the analysis will be worth the wait.</p>'+
              '  </div>'+
              '</div>';
    $("#"+id).append('<div class="analysis-loading">'+html+'</div>');
    var changeText = ["Defining the market"," Looking for your brand audience ","Analysing your brand keywords and products","Searching for your brand related LBS audience","Looking for your brand potential audience ","Looking for competitor audience"," Analysing your competitor keywords and products","Comparing your brand with competitors","Comparing your brand products with competitor products","Comparing your brand products with competitor products"];
    function setProcess(terminal){  
      var processbar = $(".analysis-loading").find(".loading-hide");  
      var widthArr = processbar.parent().next().text();
      var width = parseFloat(widthArr) + 1.7 ;
      if (width>100 || terminal) width=100;
      // console.log(width)
      var text = changeText[parseInt(width/10)];
      var bgy = width*1.54-154;
      var top = -width*1.54+154;
      processbar.attr("style","background-position-y:"+bgy+"px;top:"+top+"px;");
      processbar.parent().next().text(width.toFixed(2)+"%");
      processbar.parent().parent().next().find("p:first").find("label span").html(text);

      
      if(width == 100){  
         window.clearInterval(intervalTimer);  
         $(".loading-unclicklayer").remove();
         // window.location = './audiencePlans.html'; 
      }  
     }  
    var intervalTimer = window.setInterval(function(){setProcess();},100); 
    return setProcess;
  },
  initData: function(data){
    var _this = this;
    if (!data) return;
    _this.charts=[];
  },
  initBubbleGraph:function(id,data,v){
    if (!data || !data.bubble || data.bubble.length==0) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    _this.version = v;
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
      //处理圆圈大小，防止超出界限，取最大值得33%作为brand，增加属性audience
      var sets = data.bubble,maxBubble = sets[0].size,change=false;
      for (var i = 0; i < sets.length; i++) {
        sets[i].audience = sets[i].size;
        if(i>0 && maxBubble < sets[i].size/3){
          maxBubble = sets[i].size;
          change = true;
        }
      };
      if (change) sets[0].size = parseInt(maxBubble/3);

      _this.initBubble(id,sets);
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
    var liHtml =  '<li style="display:block;"><div class="checkbox checkbox-primary checkbox-switch">'+
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
    $("#"+id).find(".bubble-map").empty();
    var div = d3.select("#"+id).select(".bubble-map");
    div.attr("style","padding-top:"+paddingtop+"px")
    div.datum(sets).call(chart);

    var tooltip = $(".venntooltip").length>0 ? d3.select(".venntooltip") : d3.select("body").append("div").attr("class", "venntooltip");

    div.selectAll("path")
        .style("stroke-opacity", 1)
        .style("stroke", "#fff")
        .style("stroke-width", 0)
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
          var audiences = "Audience: "+IAX_TOOL.formatNum(d.audience+"",0);
          tooltip.html(label+audiences);

          // highlight the current path
          var selection = d3.select(this);
          selection.select("path")
              .style("fill-opacity", d.sets.length == 1 ? .8 : .1)
              .style("stroke-opacity", 1)
              .style("stroke-width", 3)
              .style("stroke-dasharray",[0,0]);
      })

      .on("mousemove", function() {
          tooltip.style("left", (d3.event.pageX + 10) + "px")
                 .style("top", (d3.event.pageY - 38) + "px")
                 .style("z-index","1000");
      })

      .on("mouseout", function(d, i) {
          tooltip.transition().duration(400).style("opacity", 0).style("z-index","1");;

          var selection = d3.select(this);
          
          selection.select("path")
              .style("fill-opacity",  d.sets.length == 1 ? .5 : 0)

          d3.select("#"+id).selectAll("path")
              .style("stroke-opacity", 1)
              .style("stroke-width", 0)
              // .style("stroke-dasharray",[5,5]); 
          d3.select("#"+id).selectAll(".venn-circle path")
              .style("fill-opacity",  .5);
          d3.select("#"+id).selectAll(".venn-intersection path")
              .style("fill-opacity",  .1);
          var len = d3.selectAll(".path_select").data()[0] ? d3.selectAll(".path_select").data()[0].sets.length : 0;
          d3.select("#"+id).select(".path_select")
              .style("stroke-opacity", 1)
              .style("stroke-width", 3)
              .style("stroke-dasharray",[0,0]);
          if(len>0){
            d3.select("#"+id).select(".path_select").transition("tooltip").duration(400)
              .style("fill-opacity",  len == 1 ? .8 : .1)
          }
          
      })

      .on("click", function(d, i) {
          //highlight the keyword
          var selection = d3.select(this);
          d3.selectAll(".path_select")
              .classed("path_select",false)
              .style("stroke-opacity", 0)
              .style("stroke-width", 0)
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
          if (e.target.nodeName=="path" || e.target.nodeName=="tspan" || e.target.nodeName=="g") {return};
          d3.selectAll(".path_select")
              .classed("path_select",false)
              .transition().duration(400)
              // .style("fill-opacity", 0.5)
              .style("stroke-opacity", 0)
              .style("stroke-width", 0)
          $(this).css("opacity","1");
          $(this).addClass("bubble-select");
          var subTitle = "The Market";
          var audience = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[0];
          var market = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[1];
          var selectLabel = $("#"+id).find(".bubble-info").find("#bubble-brandall").next().text();
          var audienceTitle = 'Audience Size <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="The number of audience in the industry."></i>';
          var marketTitle = 'Market Share <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="The audience percentage of the industry."></i>';
          $(audience).find(".result-text-header label").html(audienceTitle);
          $(market).find(".result-text-header label").html(marketTitle);
          $(market).find(".result-graph-word-content>label").text(subTitle);
          $("#"+id).find(".bubble-info-selected span").text(selectLabel);
          $('[data-toggle="tooltip"]').tooltip();
          if (_this.currentBubble != _this.brandData[0].id) {
            _this.initMarketGraphByBubble(_this.brandData[0]);
            _this.currentBubble = _this.brandData[0].id;
          };
          //文字变会正常色
         $("#"+id).find(".label").attr("fill","#333"); 
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
      //初始化背景圆的文字标题
      $("#"+id).find(".bubble-map").append('<label class="bubble-main-title">The Market</label>');
  },
  showCampare: function(id,d){
    var _this = this;
    var label = d.label ? d.label:"";
    var bubbleid = d.sets.join("-");
    var bubbleData = "";
    var subTitle = label + " vs. The Market";
    var audience = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[0];
    var market = $("#"+id).parents(".plan-reports-result").find(".audience_total").find(".plan-result-text")[1];
    var tooltip_title_num = 'The number of audience in competitors.';
    var tooltip_title_per = 'The audience percentage of competitors that overlaps the market.';
    //文字变会正常色
    $("#"+id).find(".label").attr("fill","#333"); 
    if (label!="") {
      if (d.sets[0]==0) {
        tooltip_title_num = 'The number of audience in my brand.';
        tooltip_title_per = 'The audience percentage of my brand that overlaps the market.';
      }
    };
    var audienceTitle = 'Audience Size <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="'+tooltip_title_num+'"></i>';
    var marketTitle = 'Market Share <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="'+tooltip_title_per+'"></i>';
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
      subTitle = label.split(" & ").reverse().join(" vs. ");
      //Audience Size & Market Share 变更标题
      tooltip_title_num = 'The number of audience between my brand and my competitors.';
      tooltip_title_per = 'The audience percentage of competitors that overlaps my brand.';
      audienceTitle = 'Overlapping Audience Scale <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="'+tooltip_title_num+'"></i>';
      marketTitle = '% Overlap with My Brand <i class="fa fa-question-circle-o" data-toggle="tooltip" data-placement="bottom" data-original-title="'+tooltip_title_per+'"></i>';
      //交叉的两圆文字变成白色
      for (var i = 0; i < d.sets.length; i++) {
        $("#"+id).find("[data-venn-sets='"+d.sets[i]+"']").find(".label").attr("fill","#fff");
      };
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
    this.initDevice("device-map",json.data);
    this.initAgeGroup("select_age",json.data);
    if (this.version=="HK") {
      this.initRegionsCity("region-map",json.data,'{"name":"HongKong","smallName":"HK"}');
    }else{
      this.initRegions("region-map",json.data);
    }
    
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
    var _this = this;
    //要进行排序，先进行转换
    var newData = [],json={};
    for(var i in data){
      json = {};
      json.per = (parseFloat(data[i])/_total)*100; 
      json.name = i;
      json.value = data[i];
      newData.push(json);
    }
    newData = newData.sort(_this.sortJson("desc","per","parseFloat"));
    for (var i = 0; i < newData.length; i++) {
      var datajson = newData[i];
      var _html = '<div class="xmo-line_per">'+
                '<span class="name">'+datajson.name+'</span>'+
                '<span class="result">'+this.getKWMformat(datajson.value)+'</span>'+
                '<span class="line_main">'+
                  '<div class="tooltip-content">'+
                  '  <p>Brand: '+datajson.name+'</p>'+
                  ' <span>Audience: '+this.formatNum(datajson.value,0)+'</span>'+
                  '</div>'+
                  '<div class="xmo-progress-line left">'+
                    '<i style="width: '+datajson.per.toFixed(0)+'%;" class="bar"></i>'+
                  '</div>'+
                '</span>'+
              '</div>';
      $("#"+id).find(".result-graph-word-content").append(_html);
    };  
  },
  initTop5Graph_product:function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    $("#"+id).find(".result-graph-word-content").empty();
    var _total = 0;
    for (var i = 0; i < data.length; i++) {
      _total +=parseFloat(data[i].value);
    };
    var _this = this;
    //要进行排序，先进行转换
    var newData = [];
    data = data.sort(_this.sortJson("desc","value","parseFloat"));
    for (var i = 0; i < data.length; i++) {
      var datajson = data[i];
      var per = (parseFloat(datajson.value)/_total)*100; 
      var _html = '<div class="xmo-line_per">'+
                '<span class="name">'+datajson.name+'</span>'+
                '<span class="result">'+this.getKWMformat(datajson.value)+'</span>'+
                '<span class="line_main">'+
                  '<div class="tooltip-content">'+
                  '  <p>Product: '+datajson.name+'</p>'+
                  '  <p style="font-weight:normal;">Brand: '+datajson.brandName+'</p>'+
                  ' <span>Audience: '+this.formatNum(datajson.value,0)+'</span>'+
                  '</div>'+
                  '<div class="xmo-progress-line left">'+
                    '<i style="width: '+per.toFixed(0)+'%;" class="bar"></i>'+
                  '</div>'+
                '</span>'+
              '</div>';
      $("#"+id).find(".result-graph-word-content").append(_html);
    };  
  },
  initTop5Trend:function(id,dateId,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var _this = this;
    var legends=[],date=[],series=[],seriesJson={},legendJson={},title,dateJson={},convertResult=[],colorMap=[],legendSelect=false,
    title = "";
    var index = 0;
    console.log(data)
    for (var i in data) {
      if (data[i]) {
        if (data[i].top5productsTrend) {
          convertResult = convertResult.concat(data[i].top5productsTrend.result);  
        };
        if (data[i].mixTrend) {
          convertResult = convertResult.concat(data[i].mixTrend.result["product"]);
        };
        colorMap.push(data[i].graphColor);
        if(data[i].legendSelect) legendSelect = data[i].legendSelect;
        index++;
      };
    };
    if (index==1) {
      colorMap = this.colorMap;
    };
    for (var i = 0; i < convertResult.length; i++) {
      var json = convertResult[i];
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
          stack : '总量:'+json.name,
          symbol : 'circle',
          symbolSize : "8",
          showAllSymbol:true,
          hoverAnimation:false,
          cursor:'default',
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
    var axisinterval = date.length-2;
    if (date.length<6){
      axisinterval=0;
    }else if(date.length<11){
      axisinterval=1;
    }else if(date.length<21){
      axisinterval=2;
    }else if(date.length<31){
      axisinterval=3;
    }
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
        color:colorMap,
        dataZoom:[{
          type:"slider",
          show:false
        }],
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
                    result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+': '+_this.formatNum(item.value,0)+'</p>';
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
          selectedMode:legendSelect,
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
            // showMinLabel:false,
            interval:axisinterval,
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
            // showMinLabel:false,
            formatter : function (value, index) {
              return _this.formatNum(value,0);
            },
            textStyle: {
                color: '#999',
                fontSize:10,
            }
          },
        } ,
        series : series,
      }; 
      if (dateId) {
        var options = {
           inputId : '#' + dateId,
           lang : "en", //"zh" "en"
           wrapContainer: $('#'+dateId).parents(".result-text-header"),
           relativeTop:"60",
           relativeRight:20,
           startTime:date[0],
           endTime:date[date.length-1],
           maxRange:31,
           menu : [ "last_7_days", "last_30_days", "this_week", "this_month",
                "last_week", "last_month" ],
           submitCallback : function(){
            var during = $("#" + dateId).val();
            $("#" + dateId).attr("value",during);
            var duringArr = during.split(" ~ ");
            $("#" + dateId).parent().find("[name=begin]").val(duringArr[0]);
            $("#" + dateId).parent().find("[name=end]").val(duringArr[1]);
            
            var diffDate = new Date(duringArr[1]).getTime()-new Date(duringArr[0]).getTime();
            var days=Math.floor(diffDate/(24*3600*1000))
            var interval = days -1 ;
            if (days<6){
              interval=0;
            }else if(days<11){
              interval=1;
            }else if(days<21){
              interval=2;
            }else if(days<31){
              interval=3;
            }
            myChart.setOption({
                xAxis : {
                  axisLabel: {
                    interval:interval,
                  }
                }
            })
            _this.dataZoomAction(myChart,duringArr);
            // search_column && typeof(search_column)==='function' && search_column(dateId);
           },
         }
         $(".xmoCalendarWraper").remove();
         $("#" + dateId).val(date[0]+" ~ "+date[date.length-1]);
         $("#" + dateId).attr("value",date[0]+" ~ "+date[date.length-1]);
         initCalendar(dateId,options);
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
  initMixTrend: function(id,articleId,dateId,data){
    if(!data || !data.mixTrend) return;
    if (!document.getElementById(id)) return;
    if (!document.getElementById(articleId)) articleId = $("#"+id).parents(".plan-result-graph").attr("id");
    echarts.dispose(document.getElementById(id));
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
          // showMinLabel:false,
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
        cursor:'default',
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
      var max=0,min = parseFloat(result[0].value);diff=0;
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
        if (max < parseFloat(result[j].value)) {
          max = parseFloat(result[j].value);
        };
        if (min > parseFloat(result[j].value)) {
          min = parseFloat(result[j].value);
        };
      };
      diff = 1.1*max-0.9*min;
      diff = Math.ceil(diff);
      yAxisJson.interval = parseFloat((diff/splitNumber));
      yAxisJson.min = (0.9*min).toFixed(2);
      yAxisJson.max = (yAxisJson.interval*splitNumber+0.9*min).toFixed(2);
      if (yAxisIndex==0) {
        yAxisJson.axisLabel.formatter = function (value, index) {
            return _this.getKWMformat(value);
        }
      };
      if (yAxisIndex==1) {
        // yAxisJson.max=100;
        // yAxisJson.interval = parseInt(100/splitNumber);
        seriesJson.lineStyle.normal.color = "#4484CF";
        seriesJson.itemStyle.normal.color = "#4484CF";
        yAxisJson.axisLabel.formatter=function (value, index) {
            return _this.formatNum(value,2)+"%";
        }
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
      var itemtitle = '<b>'+data.mixTrend.topBrands[data.mixTrend.topBrands.length-1].date.replace(/-/g,"/")+'</b>';
      var itemHtmls = this.markeArticle(data.mixTrend.topBrands[data.mixTrend.topBrands.length-1].articles);
      $("#"+articleId).find("#acticle-title").find(".pic-title-title").find("b").next().remove();
      $("#"+articleId).find("#acticle-title").find(".pic-title-title").find("b").after(itemtitle);
      $("#"+articleId).find(".pic-title-list").html(itemHtmls);
    };
    // $("#"+id).find(".fa").remove();
    // $("#"+id).append('<i class="fa fa-caret-up" style="position:absolute;color:#999;font-size:18px;transform: translateX(-50%);left:592px;top:128px;"></i>')
    //默认选中最后一个，及最后一个出现三角形。添加三角形线条
    var angleSeries = {
      name : 'test',
      type : 'line',
      stack : 'symbol:',
      cursor:'default',
      yAxisIndex:0,
      symbol : 'triangle',
      symbolSize : "14",
      showAllSymbol:true,
      symbolOffset:[0,'-50%'],
      hoverAnimation:false,
      // markPoint: {
      //     symbolRotate:180,
      //     symbolSize:60,
      //     silent:true,
      //     label:{
      //         normal:{
      //             show:true,
      //             textStyle:{color:"#fff",fontSize:12},
      //             formatter:'{b}',
      //             position:['1','50%']              
      //           }
      //     },
      //     data: [
      //         {name: 'Article', value: 0, xAxis: topBrandsData.length-1, yAxis: 0},
      //     ]
      // },
      markLine: {
        silent: true,
        symbolSize:[0,0],
        label:{
          normal:{
            show:false
          }
        },
        lineStyle:{
          normal:{
            width:1,
            type:"solid",
          }
        },
        data:[{xAxis:topBrandsData.length-1}]

      },
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
    topBrandsData[topBrandsData.length-1].value = yAxis[0].min;
    angleSeries.data = topBrandsData;
    series.push(angleSeries);
    var axisinterval = date.length-2;
    if (date.length<6){
      axisinterval=0;
    }else if(date.length<11){
      axisinterval=1;
    }else if(date.length<21){
      axisinterval=2;
    }else if(date.length<31){
      axisinterval=3;
    }
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
        color:this.colorMap,
        dataZoom:[{
          type:"slider",
          show:false
        }],
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
                var result = "";
                if(params.length) {
                  result = "<p style='color:#999;font-size:10px'>"+params[0].name+"</p>";
                  params.forEach(function (item) {
                      if (item.seriesName!="test") {
                        if (item.value) {
                          var unit = item.seriesIndex=="1" ? "%" : "";
                          var num = item.seriesIndex=="1" ? _this.formatNum(item.value,2) : _this.formatNum(item.value,0);
                          result += '<p><span style="display:inline-block;margin-right:5px;border-radius:10px!important;width:9px;height:9px;background-color:' + item.color + '"></span>'+item.seriesName+': '+num+unit+'</p>';
                        };
                      };
                  });
                }
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
          bottom:0
        },
        grid : {
            left : '0',
            bottom : '40',
            top:'40',
            right:'20',
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
            // showMinLabel:false,
            interval:axisinterval,
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
      // myChart.on('click', function (params) {
      $("#"+id).on("click","canvas",function(){
          // if (typeof params.seriesIndex == 'undefined') {      
          //  return;      
          // }
          // var date = params.name;
          var date = $(this).parent().next().find("p:first").text();
          var articles = "";
          for (var i = 0; i < data.mixTrend.topBrands.length; i++) {
            var json = data.mixTrend.topBrands[i];
            if (json.date==date) {
              articles = json.articles;
            };
          };
          var itemtitle = '<b>'+date.replace(/-/g,"/")+'</b>';
          var itemHtmls = _this.markeArticle(articles);
          $("#"+articleId).find("#acticle-title").find(".pic-title-title").find("b").next().remove();
          $("#"+articleId).find("#acticle-title").find(".pic-title-title").find("b").after(itemtitle);
          $("#"+articleId).find(".pic-title-list").html(itemHtmls);
          //小三角显示在报表中
          // console.log(params);
          // var offsetX = params.event.offsetX;
          // var offsetY = params.event.offsetY;
          // $("#"+id).find(".fa").remove();
          // $("#"+id).append('<i class="fa fa-caret-up" style="position:absolute;color:#999;font-size:18px;transform: translateX(-50%);left:'+offsetX+'px;top:128px;"></i>')
          var xAxis = topBrandsData.length-1;
          for (var i = 0; i < topBrandsData.length; i++) {
            topBrandsData[i].value = null;
            if (topBrandsData[i].date == date) {
              topBrandsData[i].value = yAxis[0].min;
              xAxis = i;
            };
          };
         
          angleSeries.data = topBrandsData;
          // angleSeries.markPoint.data = [{name: 'Article', value: 0, xAxis: xAxis, yAxis: 0}];
          angleSeries.markLine.data = [{xAxis: xAxis}];
          series.splice(series.length-1,1,angleSeries);
          myChart.setOption({
            series : series
          });
      });
      if (dateId) {
        var options = {
           inputId : '#' + dateId,
           lang : "en", //"zh" "en"
           wrapContainer: $('#'+dateId).parents(".result-text-header"),
           relativeTop:"70",
           relativeRight:20,
           startTime:date[0],
           endTime:date[date.length-1],
           maxRange:31,
           menu : [ "last_7_days", "last_30_days", "this_week", "this_month",
                "last_week", "last_month" ],
           submitCallback : function(){
             var during = $("#" + dateId).val();
             $("#" + dateId).attr("value",during);
             var duringArr = during.split(" ~ ");
             $("#" + dateId).parent().find("[name=begin]").val(duringArr[0]);
             $("#" + dateId).parent().find("[name=end]").val(duringArr[1]);
             var diffDate = new Date(duringArr[1]).getTime()-new Date(duringArr[0]).getTime();
             var days=Math.floor(diffDate/(24*3600*1000))
             var interval = days -1 ;
             if (days<6){
               interval=0;
             }else if(days<11){
               interval=1;
             }else if(days<21){
               interval=2;
             }else if(days<31){
               interval=3;
             }
             myChart.setOption({
                 xAxis : {
                   axisLabel: {
                     interval:interval,
                   }
                 }
             })
             _this.dataZoomAction(myChart,duringArr);
            // search_column && typeof(search_column)==='function' && search_column(dateId);
           },
         }
         $(".xmoCalendarWraper").remove();
         $("#" + dateId).val(date[0]+" ~ "+date[date.length-1]);
         $("#" + dateId).attr("value",date[0]+" ~ "+date[date.length-1]);
         initCalendar(dateId,options);
      };
      
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
  dataZoomAction : function(myChart,duringArr){
    myChart.dispatchAction({
      type: 'dataZoom',
      startValue: duringArr[0],
      // 结束位置的数值
      endValue: duringArr[1]
    })
  },
  markeArticle : function(data){
    if (!data) {return ""};
    var _itemhtml="",maxContentLen=40,maxTitleLen = 20;
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
        // _itemhtml += '<div style="float:left;width:50%;">'
      };
      _itemhtml += '<div class="pic-title-item" style="width:50%;" data-date="'+convertDate+'">'+
                      '  <a href="'+item.url+'" target="_blank" class="pic-title-item-a"></a>'+
                      '  <div class="pic-title-item-inner">'+
                      '    <span class="pic-title-item-index">'+index+'</span>'+
                      '    <div class="pic-title-item-pic">'+
                      '      <a href="javascript:;">'+
                      '        <img src="'+item.pic+'" height="65" width="65" onerror="errorImg(this)">'+
                      '      </a>'+
                      '    </div>'+
                      '    <div class="pic-title-item-container">'+
                      '      <div class="pic-title-item-container-title">'+
                      '        <p>'+title+'</p>'+
                      '      </div>'+
                      '      <div class="pic-title-item-container-info">'+
                      '        <span>'+content+'</span>'+
                      '         <p>'+item.date+'</p>'+
                      '      </div>'+
                      '    </div>'+
                      '  </div>'+
                      '</div>';
      if (j==4 || j==9 || j==data.length-1) {
        // _itemhtml += '</div>';
      };
    }
    return _itemhtml;
  },
  initAudienceFunnel: function(id, data ,v){
    if(!data) return;
    if (!document.getElementById(id)) return;
    echarts.dispose(document.getElementById(id));
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
            // showMinLabel:false,
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
            seriesCount[result[j].date] = parseFloat(result[j].value);
          }else{
            for (var k = 0; k < date.length; k++) {
              if(date[k]==result[j].date){
                seriesCount[result[j].date] = parseFloat(seriesCount[result[j].date]) + parseFloat(result[j].value);
                break;
              }
            };
          }
          if (!nameJson[result[j].name]) {
            seriesJson = {
              name : result[j].name,
              type : i,
              stack : '总量:'+yAxisIndex,
              cursor:'default',
              yAxisIndex:yAxisIndex,
              symbol : 'circle',
              symbolSize : "8",
              showAllSymbol:true,
              hoverAnimation:false,
              lineStyle : {
                normal : {
                  color:"#4484CF",
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
              data : [{"value":result[j].value,"textStyle":{"color":"#999","fontSize":10},"color":"#4484CF"},],
            }
            if(i=="bar"){
              seriesJson.barWidth=40;
              
            }else{
              seriesJson.itemStyle = {
                normal : {
                  color:"#4484CF",
                }
              }
            }
            legends.push({
              icon:"circle",
              name:result[j].name,
            })
            series.push(seriesJson);
            seriesCount[result[j].name] = parseFloat(result[j].value);
            nameJson[result[j].name] = result[j];
          }else{
            for (var k = 0; k < series.length; k++) {
              if(series[k].name==result[j].name){
                series[k].data.push({
                  "value":result[j].value,
                  "textStyle":{"color":"#999","fontSize":10},
                });
                seriesCount[result[j].name] = parseFloat(seriesCount[result[j].name]) + parseFloat(result[j].value);
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
        console.log(seriesCount)
        yAxisJson.interval = Math.ceil(max/splitNumber);
        yAxisJson.max = yAxisJson.interval*splitNumber;
        if (yAxisIndex==0) {
          yAxisJson.axisLabel.formatter = function (value, index) {
              return _this.getKWMformat(value);
          }
        };
        if (yAxisIndex==1) {
          // yAxisJson.max=100;
          // yAxisJson.interval = parseInt(100/splitNumber);

          var diff = 1.1*max;
          // yAxisJson.interval = parseFloat((diff/splitNumber));
          yAxisJson.interval = Math.ceil(diff)/splitNumber;
          yAxisJson.max = (yAxisJson.interval*splitNumber).toFixed(2);

          yAxisJson.axisLabel.formatter = function (value, index) {
              return _this.formatNum(value,2)+"%";
          }
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
    //重组顺序，potential要在brand前面(Bar 由上而下應為Potential > Brand > Visitor (不是Onsite) > Owned,)
    var newSeries = [],newSeriesJson={};
    for (var i = 0; i < series.length; i++) {
      if (series[i].name=="Brand" || series[i].name=="Potential" || series[i].name=="Visitor" || series[i].name=="Owned") {
        newSeriesJson[series[i].name]=series[i];
      }else{
        newSeries.push(series[i]);
      }
       
    };
    newSeries.splice(0,0,newSeriesJson["Brand"],newSeriesJson["Potential"]);
    var option = {
        title : {
          text: title,
          textStyle : {
            'fontWeight':"normal",
            'fontFamily' : "Open Sans",
            'fontSize' : 12,
          }
        },
        color:[ '#FFBD00', '#EF4136', '#8D7B7B', '#54C7B0','#F47920','#194283','#59C754'],
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
              var value = _this.formatNum(params.value,0);
              if (type=="line") {
                // value = params.value.toFixed(2) + "% ("+_this.formatNum(params.data.trueValue,0)+")";
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
            // showMinLabel:false,
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
        series : newSeries,
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
      this.initFunnelGraph(data.audienceFunnel.result.total[0],v);
  },
  initFunnelGraph: function(json,v){
    IAX_CHART_TOOL.initGender("gender-map",json.graphData);
    IAX_CHART_TOOL.initDevice("device-map",json.graphData);
    IAX_CHART_TOOL.initAgeGroup("select_age",json.graphData);
    IAX_CHART_TOOL.initInterests("interest-map",json.graphData);
    
    if (v && v=="HK") {
        IAX_CHART_TOOL.initRegionsCity("region-map",json.graphData,'{"name":"HongKong","smallName":"HK"}');
      }else{
        IAX_CHART_TOOL.initRegions("region-map",json.graphData);
    }
    
    IAX_CHART_TOOL.initTGI("select_gender_target_brand","select_agegroup_target_brand",[json.graphData])//preferenceIndex
    // IAX_CHART_TOOL.initSentiment("sentiment-map",json.graphData);
    var data = {
      'Lancome':[
        [0,55,"30%","Age","0-17" ],
        [1,25,"20%","Age","18-24"],
        [2,56,"10%","Age","25-34"],
        [3,33,"20%","Age","35-44"],
        [4,42,"10%","Age","45-54"],
        [5,82,"60%","Age","55-64"]
      ],
      'series':[
        [0,35,"30%","Age","0-17" ],
        [1,15,"20%","Age","18-24"],
        [2,26,"10%","Age","25-34"],
        [3,43,"20%","Age","35-44"],
        [4,52,"10%","Age","45-54"],
        [5,12,"60%","Age","55-64"]
      ]
    };
    // IAX_CHART_TOOL.initGroupIndex("group-index-map",data);
  },
  initTGI: function(genderId,ageGroupId,dataArr){
    if (!dataArr) return;
    if (!document.getElementById(genderId) && document.getElementById(ageGroupId)) return;
    var genderLegend=[],genderSeries=[],genderSeriesData=[],genderLegendIndex={'male':'Male','female':'Female','UNKNOWN':'UNKNOWN'};
    var ageGroupLegend=[],ageGroupSeries=[],ageGroupSeriesData=[];
    var genderColor = {'male':'#4484CF','female':'#EF4136','UNKNOWN':'#c1c1c1'};
    var colorMap = dataArr.length>1 ? [] : this.colorMap;
    var _this = this;
    function getChartsData(name,data){
      var json = {"data":{},"xAxisData":[],"name":data.brandName};
      console.log( data.preferenceIndex)
      for (var i in data.preferenceIndex) {
        if (name==i) {
          var index = 0;
          var plus55=0;
          var _total=0,all=0;
          var unknowPart=0,unknownlast=0;
          for (var j in data.preferenceIndex[i]) {
            if (j!="UNKNOWN") {
              _total += data.preferenceIndex[i][j];
            };
            all += data.preferenceIndex[i][j];
          }
          //特殊处理，将unknown部分按比例分配,55-64与65+合并
          
          var specialTotal = 0
          for (var k in data.preferenceIndex[i]) {
            if (!data.preferenceIndex[i]['UNKNOWN']) data.preferenceIndex[i]['UNKNOWN']=0;
            if (k!="UNKNOWN" && k!='65+' && k!="55-64" && k!="female") {
              var per = (parseFloat(data.preferenceIndex[i][k]*100)/_total); 
              var unknowPart = Math.ceil(per*data.preferenceIndex[i]['UNKNOWN']*0.01);
              unknownlast += unknowPart;
              data.preferenceIndex[i][k] += unknowPart;
              specialTotal += data.preferenceIndex[i][k];
            }
            if (k=="55-64"||k=="65+") {
              plus55 += parseFloat(data.preferenceIndex[i][k]);
            };

          }
          if(i=="ageGroup"){
            plus55 += data.preferenceIndex[i]['UNKNOWN'] - unknownlast;
          }
          if (i=="gender") {
            data.preferenceIndex[i]['female']=_total+data.preferenceIndex[i]['UNKNOWN']-specialTotal;
            data.preferenceIndex[i]['UNKNOWN']=0;
          };

          for (var j in data.preferenceIndex[i]) {
            if (j!="UNKNOWN" && j!="65+") {
              var dataName = j;
              var innerdata = data.preferenceIndex[i][j];
              if (j=="55-64") {
                dataName = "55+";
                innerdata = plus55;
              };
              var _json = {
                name:dataName,
                value:parseFloat(innerdata),
                trueValue:parseFloat(innerdata),
                itemStyle:{
                  normal:{
                    color:data.graphColor
                  }
                }
              };
              json.data[dataName] = _json;
              json.xAxisData.push(dataName);
              index++;
            };
          }
        };
      };
      return json;
    }
    var genderMax =0;
    for (var i = 0; i < dataArr.length; i++) {
      var data = $.extend({},dataArr[i]),genderSeriesData=[],genderLegend = [],ageGroupSeriesData=[],ageGroupLegend=[],genderMarkPointData=[],ageGroupMarkPointData=[];
      var barGap = 15,bubbleSize=27;
      if (dataArr.length>1) {
        barGap = 15;
        bubbleSize = 15;
      };
      colorMap.push(data.graphColor);
      //处理gender数据
      var _genderMax = 0;
      var gender_data = getChartsData("gender",data);
      for (var k in gender_data.data) {
        _genderMax+=gender_data.data[k].value;
      }
      if (genderMax < _genderMax) genderMax = _genderMax;
      var xAxis =0 ;
      for (var j in gender_data.data) {
        genderLegend.push(genderLegendIndex[j]);
        if (dataArr.length==1) {
          gender_data.data[j].itemStyle.normal.color = genderColor[j];
        }else{
          gender_data.data[j].itemStyle.normal.color = data.graphColor;
        }
        gender_data.data[j].max = genderMax;
        genderSeriesData.push(gender_data.data[j]);
        genderMarkPointData.push({
            name: gender_data.data[j].name,
            value:gender_data.data[j].value,
            trueValue:gender_data.data[j].trueValue,
            xAxis: xAxis,
            yAxis: gender_data.data[j].value,
            itemStyle:gender_data.data[j].itemStyle,
        })
        xAxis++;
      };
      
      genderSeries.push({
        name:gender_data.name ? gender_data.name : "Gender",
        type:"bar",
        // stack:"gender",
        cursor:'default',
        yAxisIndex:0,
        barWidth:1,
        barGap:barGap,
        data:genderSeriesData,
        markPoint:{
          symbol:"circle",
          symbolSize:bubbleSize,
          data:genderMarkPointData,
          label:{
              normal:{
                  show:false
              }
          }
        }
      })
      

      //处理agegroup数据
      var ageGroup_data = getChartsData("ageGroup",data);
      var xAxis =0 ;

      for (var j in ageGroup_data.data) {
        if (j!="UNKNOWN" && j!="65+") {
          var name = j;
          ageGroupLegend.push(name);
          if (dataArr.length==1) {
            ageGroup_data.data[j].itemStyle.normal.color = colorMap[0];
          }else{
            ageGroup_data.data[j].itemStyle.normal.color = data.graphColor;
          }
          ageGroupSeriesData.push(ageGroup_data.data[j])
          ageGroupMarkPointData.push({
              name: ageGroup_data.data[j].name,
              value:ageGroup_data.data[j].value,
              trueValue:ageGroup_data.data[j].trueValue,
              xAxis: xAxis,
              yAxis: ageGroup_data.data[j].value
          })
          xAxis++;
        };
      };
      ageGroupSeries.push({
        name:ageGroup_data.name ? ageGroup_data.name : "Age",
        type:"bar",
        // stack:"ageGroup",
        cursor:'default',
        yAxisIndex:0,
        barWidth:1,
        barGap:bubbleSize,
        data:ageGroupSeriesData,
        markPoint:{
          symbol:"circle",
          symbolSize:bubbleSize,
          data:ageGroupMarkPointData,
          label:{
              normal:{
                  show:false
              }
          }
        }
      })
    };
     //横坐标轴的图片。。
    var picData = [];
    var picSeries = {
      name : 'test',
      type : 'line',
      stack : 'symbol:1',
      cursor:'default',
      yAxisIndex:1,
      symbol : 'image://../images/icon_0-17.png',
      symbolSize : [26,26],
      showAllSymbol:true,
      clipOverflow:false,
      symbolOffset:[0,'18'],
      hoverAnimation:false,
      lineStyle : {
        normal : {
          opacity:0,
        }
      },
      itemStyle:{
        normal:{
          label:{
            show:false,
          }
        }
      },
      areaStyle : {
        normal : {
          opacity:0
        }
      },
      data : picData,
    }
   
    function makePicSeries(series,type){
      var arrs = [];
      for (var i = 0; i < series[0].data.length; i++) {
        arrs.push(series[0].data[i].name);
      };
      for (var i = 0; i < arrs.length; i++) {
        var picSeries2 = $.extend({},picSeries);
        var picData = [];
        for (var k = 0; k < series[0].data.length; k++) {
          var json = {};
          json.value = null;
          json.size = 24;
          picData.push(json);
        };
        picData[i].value=0;
        picSeries2.stack = type;
        picSeries2.data = [].concat(picData);
        picSeries2.symbol = 'image://../images/icon_'+arrs[i].toLocaleLowerCase()+'.png';
        if (type=="gender") {
           picSeries2.symbol = 'image://../images/icon_'+arrs[i].toLocaleLowerCase()+'_chart.png';
           picSeries2.symbolSize = [25,45];
           picSeries2.symbolOffset = [0,26];
        };
        series.push(picSeries2);
      };
    }
    makePicSeries(genderSeries,'gender');
    makePicSeries(ageGroupSeries,'ageGroup');
    
    // console.log(genderLegend,genderSeries)
    // console.log(colorMap)
    var genderColorMap = dataArr.length>1 ? colorMap : ["#4484CF","#ef4136","#c1c1c1"];
    _this.initBubbleBar(genderId,genderLegend,genderSeries,gender_data.xAxisData,genderColorMap);
    _this.initBubbleBar(ageGroupId,ageGroupLegend,ageGroupSeries,ageGroup_data.xAxisData,colorMap);
  },
  initBubbleBar: function(id,legend,series,xAxisData,color){
    if (!legend) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var splitNumber = 4,xaxisLabel=true,yaxisLabel=true,yaxisLabelFormatter="",legendshow = true,xAixsShow = true,gridleft=30,bottom=90,offsetX=30;
    var ymin=0,ymax=0;
    var xSplitLine = {
            show: false
        }
    if (series[series.length-1].stack=="gender") {
      xaxisLabel = false;
      // bottom=120;
    };
    for (var i = 0; i < series.length; i++) {
      ymax = 100;
    };
    if (series.length-legend.length>1) {
      xSplitLine = {
        show:true,
        interval:function(index){
          if (index===0 || index===series.length) return false;
          return true;
        },
        lineStyle:{
          color:"#e5e5e5",
          width:2,
          type:"dotted",
        }
      }
      //生成legend
      $("#"+id).parents(".plan-result-graph").find(".legendUl").remove();
      var legendLi="<div class='legendUl' style='width:100%;position: absolute;top: 410px;z-index:999'><ul style='float:left;white-space: nowrap;margin-left:50%;transform: translateX(-50%);'>";
      for (var i = 0; i < series.length-legend.length; i++) {
        var name = series[i].name;
        var lecolor = color[i];
        legendLi += '<li style="line-height:25px;display:inline-block;text-align:left;margin-right:10px;"><span style="width:8px;height:8px;border-radius:8px!important;background:'+lecolor+';display:inline-block;margin-right:5px;"></span>'+name+'</li>';
      };
      legendLi+="</ul></div>";
      $("#"+id).parents(".plan-result-graph").append(legendLi);
    };
    var interval = Math.ceil(ymax/splitNumber);
    ymax = interval*splitNumber;
    var option = {
        color: color,
        legend: {
            show:legendshow,
            data: legend,
            itemWidth:8,
            itemHeight:8,
            itemGap:20,
            bottom:0,
            icon:"circle",
        },
        grid: {
            y: '20',
            left:gridleft,
            right:0,
            bottom:bottom,
        },
        tooltip: {
            trigger:"item",
            axisPointer: {
                type: 'none'
            },
            formatter: function (params) {
              if (params.seriesName!="test") {
                return "<p><b>"+params.seriesName+" : "+params.data.name+"</b></p><p>TGI: "+_this.formatNum(params.data.trueValue,0)+"</p>";
              }
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
        xAxis: {
            type: 'category',
            show:true,
            name: '',
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            offset:offsetX,
            data:xAxisData,
            splitLine: xSplitLine,
            axisLine: {
                show:false
            },
            axisTick:{
              show:false
            },
            axisPointer:{
              show:false
            },
            axisLabel:{
              show:xaxisLabel
            }
        },
        yAxis: [{
            type: 'value',
            name: '',
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            min:ymin,
            max:ymax,
            interval:interval,
            axisLine: {
                show:false,
            },
            axisPointer:{
              show:false
            },
            axisTick:{
              show:false
            },
            axisLabel:{
              show:yaxisLabel,
            },
            splitLine:{
              show:true,
              lineStyle:{
                color:"#dfdfdf"
              }
            },
        },{
            type: 'value',
            name: 'icon',
            show:false,
        }],
        series: series
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
  initBubbleCross: function(colorMap,id,data,xy,xArea,yArea){
    // if (!data) return;
    if (!document.getElementById(id)) return;
    if (!xy) xy = ["Market Share (%)","Market Growth (%)"];
    if (!xArea) xArea = [0, 100];
    if (!yArea) yArea = [-100,100];
    if(!data) {
      data = {
        'Lancome':[
          [40,70,40,70,0],
        ],
        'Estee Lauder':[
          [90,90,90,90,1]
        ],
        'SKII':[
          [10,30,10,30,5]
        ],
        'Bobbi Brown':[
          [90,-70,90,-70,7]
        ],
        'Shiseido':[
          [60,-60,60,-60,6]
        ]
      };
    };
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var _this = this;
    var legend=[];
    var picData = [];
    
    var picSeriesArr = [],sizeBubble=[45,50,55,60,70,80,85,90,100],labeLimit=[5,5,6,7,9,10,11,12,13];
    for(var i in data){
      var series = {
          name: i,
          type: 'scatter',
          seriesIndex:0,
          hoverAnimation:false,
          label:{
            normal:{
              show:true,
              position:"inside",
              formatter:function(params){
                var limit = labeLimit[params.value[4]];
                return _this.substrByLength(params.seriesName,limit);
              },
              textStyle:{
                color:"#fff",
              }
            }
          },
          itemStyle: {
            normal: {
              opacity: 1,
            },
            emphasis:{
              borderColor:"#dfdfdf",
              borderWidth:5,
            }
          },
          data: data[i],
          symbolSize: function(val) {
              return sizeFunction(val);
          }
      }
      // series.label.normal.show=false;
      picSeriesArr.push(series);
      legend.push(i);
    }
    function sizeFunction(val){
      var x = val[4];
      if (x<0) x = -x;
      return sizeBubble[x];
    }
    
    var seriesIndexArr = new Array(picSeriesArr.length);
    for (var i = 0; i < seriesIndexArr.length; i++) {
      seriesIndexArr[i] = i;
    };
    picSeriesArr.push({
        name: 'test' ,
        type: 'scatter',
        seriesIndex:1,
        cursor:'default',
        label:{
          normal:{
            show:true,
            position:"top",
            offset:[0,0],
            align:"right",
            width:100,
            rich:{
              a:{
                width:100,
                color:"#333"
              }
            },
            formatter:function(){
              var label = xy[0];
              return '{a|'+label+'}';
            },
            textStyle:{
              color:"#333",
            }
          }
        },
        animation: false,
        silent:false,
        symbolSize:1,
        hoverAnimation:false,
        data: [[100, 0]],
    });
  
    var imageEl = document.createElement('img'); // use DOM HTMLImageElement
    imageEl.src = '../images/cross_bg.png';
    imageEl.alt = 'background';
    var option = {
        color: colorMap,
        backgroundColor:{
            image: imageEl, // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
            repeat: 'repeat' // 是否平铺, 可以是 'repeat-x', 'repeat-y', 'no-repeat'
        },
        legend: {
            show:false,
            data: legend,
            itemWidth:8,
            itemHeight:8,
            itemGap:20,
            bottom:0,
        },
        grid: {
            y: '20',
            right:10,
            left:10,
            bottom:'10',
            top:30,
        },
        tooltip: {
            // trigger:"item",
            formatter: function (params) {
              if (params.seriesName!="test") {
                return "<p><b>"+params.seriesName+"</b></p><p>Market Growth: "+params.value[3]+"%</p><p>Market Share: "+_this.formatNum(params.value[2],0)+"%</p>";
              }
            },
            // axisPointer:{
            //     show: true,
            //     type : 'cross',
            //     z:0,
            //     lineStyle: {
            //         type : 'dashed',
            //         width : 1
            //     },
            //     label:{
            //         show:false,
            //         formatter:null,
            //         backgroundColor:"transparent",
            //         textStyle:{
            //             color:"transparent"
            //         }
            //     }
            // },
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

        xAxis: {
            type: 'value',
            name: '',
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            axisLine:{
              lineStyle:{
                color:"#dfdfdf"
              }
            },
            axisLabel:{
              textStyle: {
                  color: '#999',
                  fontSize:10,
                  fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
              },
            },
            max:xArea[1],
            min:xArea[0],
            splitNumber:10,
            boundaryGap:["10%","10%"],
            offset:-200,
            splitLine: {
                show: false
            },
            axisTick:{
              show:false
            },
        },
        yAxis: [{
            type: 'value',
            name: xy[1],
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            max:100,
            min:-100,
            splitNumber:10,
            offset:-255,
            axisLine:{
              lineStyle:{
                color:"#dfdfdf"
              }
            },
            axisLabel:{
              textStyle: {
                  color: '#999',
                  fontSize:10,
                  fontFamily:"Open Sans, Noto Sans SC,Arial,sans-serif",
              },
            },
            axisTick:{
              show:false
            },
            splitLine:{
              show:false,
              lineStyle:{
                color:"#dfdfdf"
              }
            },
        },{
            type: 'value',
            name: 'icon',
            show:false,
        }],
        series: picSeriesArr
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
  initProductAssociaton: function(id,data,isChage,ytype){
    if(!data) return;
    if (!document.getElementById(id)) return;
    if (!ytype) ytype="dailyGrowthP";
    var sizeBubble = [15,20,25,30,35,37,40,43,47,50,53,57,60,65,70];
    var brands = {},timeCircle={},audience=0,times=[],minY=0,maxY=0;
    for (var i = 0; i < data.length; i++) {
      if (brands[data[i].brandName]) {
      }else{
        brands[data[i].brandName] = data[i].color;
      }
      audience += parseInt(data[i].audience);
      if (minY > data[i][ytype]) minY=data[i][ytype];
      if (maxY < data[i][ytype]) maxY=data[i][ytype];
    };
    if (minY >= 0 || Math.abs(minY) < Math.abs(maxY)) minY = -maxY;
    if (maxY <= 0 || Math.abs(maxY) < Math.abs(minY)) maxY = -minY;
    console.log(minY,maxY)
    for (var i = 0; i < data.length; i++) {
      var percent = parseFloat((parseInt(data[i].value) +100)/200);
      var percentY = parseFloat(data[i][ytype]/maxY);
      timeCircle = {};
      timeCircle.id = "time_"+data[i].brandId+"_"+data[i].productId;
      timeCircle.name = data[i].productName;
      timeCircle.color = data[i].color;
      timeCircle.r = sizeBubble[Math.ceil(parseInt(data[i].audience)/(audience/15))];
      timeCircle.left = (890-130) * percent + timeCircle.r/2;
      timeCircle.top = 330/2 - 135 * percentY;
      timeCircle.marginTop = -timeCircle.r -3;
      timeCircle.index = Math.ceil(timeCircle.left);
      timeCircle.audience = data[i]["audience"];
      timeCircle.y = data[i][ytype];
      timeCircle.x = data[i]["value"];
      times.push(timeCircle);
    };
    var html = "",isRight="";
    times = times.sort(this.sortJson("desc","left","parseFloat"));
    if (isChage) {
      for (var i = 0; i < times.length; i++) {
        var direct = times[i].y>0? "top" :"bottom";
        $("#"+times[i].id).css("left",times[i].left+"px");
        $("#"+times[i].id).css("top",times[i].top+"px");
        var innerhtml = '<span style="top:50%;position:absolute;width:100%;transform: translateY(-50%);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;left:0;color:#fff;">'+times[i].name+'</span>'
                    // '<span style="'+direct+':-30px;position:absolute;width:200px;transform: translateX(-50%);text-align:center;">'+times[i].name+'</span>'
                    +'<div class="tooltip-content '+isRight+'">'
                    +' <p><b>'+times[i].name+'</b></p>'
                    +' <p style="font-weight:normal">Association: '+times[i].x+'</p>'
                    +' <p style="font-weight:normal">Audience: '+times[i].audience+'</p>'
                    +'</div>';

        $("#"+times[i].id).html(innerhtml);
      }
    }else{
      for (var i = 0; i < times.length; i++) {
        var direct = times[i].y>0? "top" :"bottom";
        // console.log(times[i]);
        html += '<div id="'+times[i].id+'" class="time-circle" style="background:'+times[i].color+';left:'+times[i].left+'px;top:'+times[i].top+'px;margin-top:'+times[i].marginTop+'px;width:'+times[i].r*2+'px;height:'+times[i].r*2+'px;border-radius:'+times[i].r*2+'px!important;z-index:'+times[i].index+';">'
                // +'<span style="'+direct+':-30px;position:absolute;width:200px;transform: translateX(-50%);text-align:center;">'+times[i].name+'</span>'
                +'<span style="top:50%;position:absolute;width:100%;transform: translateY(-50%);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;left:0;color:#fff;">'+times[i].name+'</span>'
                +'<div class="tooltip-content '+isRight+'">'
                +' <p><b>'+times[i].name+'</b></p>'
                +' <p style="font-weight:normal">Association: '+times[i].x+'</p>'
                +' <p style="font-weight:normal">Audience: '+times[i].audience+'</p>'
                +'</div>'
                +'</div>';
      };
      $("#"+id).html(html);
    }
    var brandHtml = "<ul id='product_association_legend' style='position:absolute;bottom:0;width:100%;display:flex; justify-content:center;'>";
    for(var i in brands){
      brandHtml += '<li style="width:200px;line-height:25px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><span style="width:8px;height:8px;border-radius:8px!important;background:'+brands[i]+';display:inline-block;margin-right:5px;"></span>'+i+'</li>'
    }
    $("#"+id).parent().find('#product_association_legend').remove();
    $("#"+id).after(brandHtml+"</ul>");
  },
  initProductCategoryAnalysis: function(categoryId,productsId,categoryPie,allCategoryJSON){
    if (!categoryPie || !allCategoryJSON) return;
    if (!document.getElementById(categoryId) || !document.getElementById(productsId)) return;
    echarts.dispose(document.getElementById(categoryId));
    var myChart = echarts.init(document.getElementById(categoryId));
    var _this = this;    
    var productPie = [],colorMap=[],outerColorMap=[];
    var colorMapArr = {
                       '#EF4136':['#EF4136','#F26B62','#F6948E','#F9BEBA','#FDE8E6','#E5C1BF','#E09B96','#D06D66','#C64E46'],
                       '#FFBD00':['#FFBD00','#FFCB38','#FFDA70','#FFE8A8','#FFF7E0','#E7D8B2','#E5CA7E','#E0B949','#E7B11A'],
                       '#4484CF':['#4484CF','#6D9FD9','#96BAE4','#BFD5EE','#E8F0F9','#CDD9E8','#9AB0CB','#779AC4','#4D7AB1'],
                       '#946EDB':['#946EDB','#AB8EE3','#C3AEEB','#DACDF2','#F2EDFA','#D9D1E7','#B6A8D2','#A38DCE','#8F73C2'],
                       '#8D7B7B':['#8D7B7B','#A69898','#BFB5B5','#D8D2D2','#F1EFEF','#E4E0E0','#CBC3C3','#B2A6A6','#998989'],
                       '#54C7B0':['#54C7B0','#7AD3C1','#9FDFD3','#C5ECE4','#EAF8F5','#C3DED8','#A5D0C7','#7DC1B3','#5DB6A5'],
                       '#F47920':['#F47920','#F69651','#F9B482','#FBD1B3','#FDEFE4','#E2C7B3','#E7B48F','#DE9662','#DB7B35'],
                       '#194283':['#194283','#4C6B9E','#7E95B9','#B1BED5','#E3E8F0','#B7BFCB','#8697B1','#576D92','#2F4D7D'],
                       '#59C754':['#59C754','#7DD37A','#A2DF9F','#C6ECC5','#EBF8EA','#C4D9C3','#9FC49D','#78AF75','#5AA357']
                     }
    var index = 0,all=0;
    for (var i in allCategoryJSON) {
      allCategoryJSON[i] = allCategoryJSON[i].sort(_this.sortJson("desc","value","parseInt"));
      colorMap.push(_this.colorMap[index]);
      for(var j=0;j<allCategoryJSON[i].length;j++){
        productPie.push(allCategoryJSON[i][j]);
        outerColorMap.push(colorMapArr[_this.colorMap[index]][j]);
        all+=allCategoryJSON[i][j].value;
      }
      index++;
    };
    var option = {
      tooltip: {
          trigger:"item",
          formatter: function (params) {
            if (params.seriesName!="product") {
               return "<p><b>"+params.name+"</b></p><p>Audience / All products: "+params.percent+"% ("+_this.formatNum(params.value,0)+")</p>";
            }else{
               return "<p><b>"+params.name+"</b></p><p>Audience: "+params.percent+"% ("+_this.formatNum(params.value,0)+")</p>";
            }
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
      series:[{
          name:'category',
          color: colorMap,
          type:'pie',
          radius: [0, '30%'],
          selectedMode:false,
          cursor:'default',
          hoverAnimation:false,
          label: {
              normal: {
                  show:false,
                  position: 'inner'
              }
          },
          labelLine: {
              normal: {
                  show: false
              }
          },
          data:categoryPie
        },
        {
            name:'product',
            color: outerColorMap,
            type:'pie',
            radius: ['40%', '55%'],
            selectedMode:false,
            cursor:'default',
            hoverAnimation:false,
            label: {
                normal: {
                    color:"#333",
                    formatter: function(params){
                      return _this.substrByLength(params.name,12);
                    },
                }
            },
            labelLine: {
                normal: {
                    lineStyle:{
                      color:"#999"
                    }
                }
            },
            data:productPie
        }
      ]
    }
    console.log(categoryPie)
    console.log(productPie)
    console.log(outerColorMap)
    myChart.setOption(option,{
      notMerge:true
    });
    //无需resize
    // var isExists = false;
    // for (var i = 0; i < this.charts.length; i++) {
    //   if(this.charts[i].id == categoryId){
    //     this.charts[i].chart = myChart;
    //     isExists = true;
    //   }
    // };
    // if (!isExists) {
    //   this.charts.push({id:categoryId,chart:myChart});
    // };
    
    index = 0;
    $("#"+productsId).empty();
    for (var i in allCategoryJSON) {
      allCategoryJSON[i] = allCategoryJSON[i].sort(_this.sortJson("desc","value","parseInt"));
      var productId = productsId+"_product_"+new Date().getTime();
      var categoryValue = 0;
      for(var j=0;j<allCategoryJSON[i].length;j++){
        categoryValue+=allCategoryJSON[i][j].value;
      }
      var percent = ((categoryValue/all)*100).toFixed(2);
      var title = '<div style="width:180px;line-height:20px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><span style="width:8px;height:8px;border-radius:8px!important;background:'+_this.colorMap[index]+';display:inline-block;margin-right:5px;"></span>'+i+'</div><p>'+percent+'%</p>';
      $("#"+productsId).append('<div style="height:200px;width:180px;float:left;position:relative;"><div style="position:absolute;top:-10px;left:50%;transform: translateX(-50%);">'+title+'</div><div style="height:200px;width:180px;" id="'+productId+'"></div>');
      _this.initProductsAnalysis(productId,allCategoryJSON[i],colorMapArr[_this.colorMap[index]]);
      index++;
    };
  },
  initProductsAnalysis: function(id,data,colorMap){
    if(!data) return;
    if (!document.getElementById(id)) return;
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var _this = this;   
    var legend = [];
    for (var i = 0; i < data.length; i++) {
      legend.push(data[i].name);
    };
    var option = {
      legend: {
          orient: 'vertical',
          icon:"circle",
          itemWidth:8,
          itemHeight:8,
          x: 'center',
          y:'center',
          data:legend,
          formatter:function(name){
            return _this.substrByLength(name,8);
          },
      },
      tooltip: {
          trigger:"item",
          formatter: function (params) {
              return "<p><b>"+params.name+"</b></p><p>Audience: "+params.percent+"% ("+_this.formatNum(params.value,0)+")</p>";
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
      series:[
        {
            name:'product',
            color: colorMap,
            type:'pie',
            radius: ['55%', '75%'],
            selectedMode:false,
            cursor:'default',
            hoverAnimation:false,
            label: {
                normal: {
                    formatter: '{b}',
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:data
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
  initSentiment: function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var sentiment = (180/100)*(data.sentiment+50);
    var degreeArr = ["0~22.5","22.5~67.5","67.5~112.5","112.5~157.5","157.5~180"];
    var scaleArr = ["10~17.5","17.5~22.5","22.5~27.5","27.5~32.5","55~62.5","62.5~67.5","67.5~72.5","72.5~77.5","100~107.5","107.5~112.5","112.5~117.5","117.5~122.5","145~152.5","152.5~157.5","157.5~162.5","162.5~167.5"];
    var origin = 15;
    $("#"+id).find(".sentiment-scale").each(function(i){
      if (i%4==0 && i!=0) {
        origin += 45;
      };
      var rotate = 5*(i%4)+origin;
      var left = 100-Math.cos(2*Math.PI / 360*rotate)*130;
      var bottom = Math.sin(2*Math.PI / 360*rotate)*130-3;
      $(this).css("transform","rotate("+(rotate-180)+"deg)");
      $(this).css("left",left+"px");
      $(this).css("bottom",bottom+"px");
    })
    $("#"+id).find(".sentiment-selected").removeClass("sentiment-selected");
    $("#"+id).find(".sentiment-scale").removeClass("selected");
    var scaleIndex = 0,degreeIndex = 0;
    for (var i = 0; i < scaleArr.length; i++) {
      var scale = scaleArr[i].split("~");
      if (sentiment>=scale[0] && sentiment<=scale[1]) {
        $("#"+id).find(".sentiment-scale").eq(i).addClass("selected");
        scaleIndex = $("#"+id).find(".sentiment-scale").eq(i).index();
        // $("#"+id).find(".sentiment-scale").eq(i).prevAll().addClass("selected");
      };
    };
    for (var i = 0; i < degreeArr.length; i++) {
      var degree = degreeArr[i].split("~");
      if (sentiment>=degree[0] && sentiment<=degree[1]) {
        $("#"+id).find("div").eq(i*5).addClass("sentiment-selected");
        // $("#"+id).find("div").eq(i*5).prevAll(".sentiment-scale").addClass("selected");
        degreeIndex = i*5;
      };
    };
    //两者之间的元素也要点亮
    if (scaleIndex!=0) {
      var middle=0;
      if (scaleIndex>degreeIndex) {
        middle = degreeIndex;
        degreeIndex = scaleIndex;
        scaleIndex = middle;
      };
      console.log(scaleIndex,degreeIndex)
      for (var i = scaleIndex; i < degreeIndex; i++) {
        $("#"+id).find("div").eq(i).addClass("selected");
      };
    };
    
    $("#"+id).find(".sentiment-pointer").css("transform","rotate("+(sentiment-180)+"deg)");
  },
  changeToGroupIndex:function(data){
    if (!data) return "";
    var indexArr = [],index = 0;
    var _total = 0;
    for (var k in data) {
      if (k!="name") {
        _total +=parseFloat(data[k]);
      }
    }
    for(var i in data){
      var per = (parseFloat(data[i])/_total)*100; 
      var indexData = [index];
      indexData.push(data[i]);
      indexData.push(per.toFixed(2)+"%");
      indexData.push("Age");
      indexData.push(i);
      indexArr.push(indexData);
      index++;
    }
    return indexArr;
  },
  initGroupIndex:function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var _this = this;
    var legend=[];
    var picData = [];
    
    var picSeriesArr = [];
    for(var i in data){
      var series = {
          name: i,
          type: 'scatter',
          cursor:'default',
          seriesIndex:0,
          label:{
            normal:{
              show:true,
              position:"top",
              formatter:function(params){
                return params.data[2];
              },
              textStyle:{
                color:"#333",
              }
            }
          },
          itemStyle: {
            normal: {
              opacity: 0.8,
            }
          },
          data: data[i]
      }
      series.label.normal.show=false;
      picSeriesArr.push(series);
      legend.push(i);
    }
    //横坐标轴的图片。。
    var picSeries = {
      name : 'test',
      type : 'line',
      stack : 'symbol:1',
      cursor:'default',
      yAxisIndex:1,
      symbol : 'image://../images/icon_0-17.png',
      symbolSize : [26,26],
      showAllSymbol:true,
      clipOverflow:false,
      symbolOffset:[0,'18'],
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
      data : picData,
    }
    var arrs = [];
    for (var i = 0; i < picSeriesArr[0].data.length; i++) {
      arrs.push(picSeriesArr[0].data[i][4]);
    };
    for (var i = 0; i < arrs.length; i++) {
      var picSeries2 = $.extend({},picSeries);
      var picData = [];
      for (var k = 0; k < picSeriesArr[0].data.length; k++) {
        var json = {};
        json.value = null;
        json.size = 24;
        picData.push(json);
      };
      picData[i].value=0;
      picSeries2.data = [].concat(picData);
      picSeries2.symbol = 'image://../images/icon_'+arrs[i].toLocaleLowerCase()+'.png';
      picSeriesArr.push(picSeries2);
    };
    var seriesIndexArr = new Array(picSeriesArr.length-arrs.length);
    for (var i = 0; i < seriesIndexArr.length; i++) {
      seriesIndexArr[i] = i;
    };
    var option = {
        color: this.colorMap,
        legend: {
            data: legend,
            itemWidth:8,
            itemHeight:8,
            itemGap:20,
            bottom:0,
        },
        grid: {
            y: '20',
            right:'0',
            left:40,
            bottom:'90',
        },
        tooltip: {
            trigger:"item",
            formatter: function (params) {
              if (params.seriesName!="test") {
                return "<p><b>"+params.value[3]+": "+params.value[4]+"</b></p><p>Audience: "+_this.formatNum(params.value[1],0)+"</p>";
              }
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
        xAxis: {
            type: 'category',
            name: '',
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            data:arrs,
            offset:30,
            splitLine: {
                show: false
            },
            axisLine: {
                show:false
            },
            axisTick:{
              show:false
            },
            axisPointer:{
              show:false
            }
        },
        yAxis: [{
            type: 'value',
            name: '',
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            axisLine: {
                show:false,
            },
            axisPointer:{
              show:false
            },
            axisTick:{
              show:false
            },
            splitLine:{
              show:true,
              lineStyle:{
                color:"#dfdfdf"
              }
            },
        },{
            type: 'value',
            name: 'icon',
            show:false,
        }],
        visualMap: [
            {
                left: 'right',
                top: '10%',
                dimension: 1,
                min: 0,
                max: 100,
                show:false,
                itemWidth: 30,
                itemHeight: 120,
                calculable: true,
                seriesIndex:seriesIndexArr,
                precision: 0.1,
                text: ['圆形大小'],
                textGap: 30,
                textStyle: {
                    color: '#333'
                },
                inRange: {
                    symbolSize: [10, 70]
                },
                outOfRange: {
                    symbolSize: [10, 70],
                    color: ['rgba(255,255,255,.2)']
                },
                controller: {
                    inRange: {
                        color: ['#c23531']
                    },
                    outOfRange: {
                        color: ['#444']
                    }
                }
            }
        ],
        series: picSeriesArr
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
  initBrandFunnel: function(genderId,deviceId,ageGroupId,groupIndexId,data){
    if(!data) return;
    if (!document.getElementById(genderId)) return;
    if (!document.getElementById(deviceId)) return;
    if (!document.getElementById(ageGroupId)) return;
    if (!document.getElementById(groupIndexId)) return;
    var genderArr=[],deviceArr=[],ageGroupArr=[],groupIndexArr=[];
    var genderSeries=[],deviceSeries=[],ageGroupSeries=[],groupIndexSeries=[];
    var genderJson={},deviceJson={},ageGroupJson={},groupIndexJson={};
    var genderLegend=['Male','Female','UNKNOWN'],deviceLegend=['PC','Mobile','UNKNOWN'];
    var genderLegendIndex={'male':'Male','female':'Female','UNKNOWN':'UNKNOWN'};
    var ageGroupLegend=[],groupIndexLegend=[];
    var _this = this;
    var dataArr = data.brandFunnel;
    for (var i = 0; i < dataArr.length; i++) {
      var data = dataArr[i];
      var indexValue = $.extend({},data.age_group);
      data.gender.name=data.name;
      data.device.name=data.name;
      genderArr.push(data.gender);
      deviceArr.push(data.device);
      ageGroupArr.push({name:data.name,value:data.age_group});
      groupIndexArr.push({name:data.name,value:data.age_group});
    };
    //处理gender数据
    var gender_data={},xAxisData_gender=[];
    for (var i = 0; i < genderArr.length; i++) {
      var data = genderArr[i]
      var _total = 0;
      for (var k in data) {
        if (k!="name") {
          _total +=parseFloat(data[k]);
        }
      }
      for (var j in data) {
        var per = (parseFloat(data[j])/_total)*100; 
        var json = {
          name:j,
          percent:per,
          value:parseFloat(data[j]),
          trueValue:parseFloat(data[j]),
        };
        if(gender_data[j]){
          gender_data[j].push(json);
        }else{
          gender_data[j] = [json];
        }
      }
      xAxisData_gender.push(data.name);
    };
    for (var i in gender_data) {
      genderSeries.push({
        name:genderLegendIndex[i],
        type:"bar",
        stack:"gender",
        yAxisIndex:0,
        barWidth:20,
        data:gender_data[i]
      })
    };
    //处理device数据
    var device_data={},xAxisData_device=[];
    for (var i = 0; i < deviceArr.length; i++) {
      var data = deviceArr[i]
      var _total = 0;
      for (var k in data) {
        if (k!="name") {
          _total +=parseFloat(data[k]);
        }
      }
      for (var j in data) {
        var per = (parseFloat(data[j])/_total)*100; 
        var json = {
          name:j,
          percent:per,
          value:parseFloat(data[j]),
          trueValue:parseFloat(data[j]),
        };
        if(device_data[j]){
          device_data[j].push(json);
        }else{
          device_data[j] = [json];
        }
      }
      xAxisData_device.push(data.name);
    };
    for (var i in device_data) {
      deviceSeries.push({
        name:i,
        type:"bar",
        stack:"device",
        yAxisIndex:0,
        barWidth:20,
        data:device_data[i]
      })
    };
    //处理age group数据
    var group_data={},xAxisData_age_group=[];
    for (var i = 0; i < ageGroupArr.length; i++) {
      var data = ageGroupArr[i].value;
      var _total = 0;
      group_data[ageGroupArr[i].name]=[];
      ageGroupLegend.push(ageGroupArr[i].name);
      for (var k in data) {
        if (k!="name") {
          _total +=parseFloat(data[k]);
        }
      }
      for (var j in data) {
        var per = (parseFloat(data[j])/_total)*100; 
        var json = {
          name:j,
          percent:per,
          yAxisIndex:0,
          trueValue:parseFloat(data[j]),
          value:per
        };
        group_data[ageGroupArr[i].name].push(json);
        if (i==0) {
          xAxisData_age_group.push(j);
        };
      }
    };
    for (var i in group_data) {
      if (i!="name") {
        ageGroupSeries.push({
          name:i,
          type:"bar",
          yAxisIndex:0,
          barWidth:10,
          data:group_data[i]
        })
      };
    };
    //处理groupindex数据
    var groupindexData = {};
    for (var i = 0; i < groupIndexArr.length; i++) {
      groupindexData[groupIndexArr[i].name] = _this.changeToGroupIndex(groupIndexArr[i].value);
    };
    _this.initBarFunnel(genderId,genderLegend,genderSeries,xAxisData_gender,['#4484CF', '#EF4136 ', '#c1c1c1']);
    _this.initBarFunnel(deviceId,deviceLegend,deviceSeries,xAxisData_device,['#4484CF', '#FFBD00 ', '#c1c1c1']);
    _this.initBarFunnel(ageGroupId,ageGroupLegend,ageGroupSeries,xAxisData_age_group,this.colorMap);
    _this.initGroupIndex(groupIndexId,groupindexData);
  },
  initBarFunnel: function(id,legend,series,xAxisData,color){
    if (!legend) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var splitNumber = 1,interval=0,yaxisLabel=false,yaxisLabelFormatter="",legendshow = true,gridleft=0,bottom=50,offsetX=0;
    var ymin=null,ymax=null;
    if (id=="select_age_brand_multi_map" || id=="select_age_product_multi_map") {
      splitNumber = 5;
      yaxisLabel = true;
      yaxisLabelFormatter='{value}%';
      ymin=0;
      ymax=Math.ceil(series[0].max/10)*10;
      offsetX=28;
      gridleft=40;
      bottom=95;
      //横坐标轴的图片。。
      var picData = [];
      var picSeries = {
        name : 'test',
        type : 'line',
        stack : 'symbol:1',
        yAxisIndex:1,
        symbol : 'image://../images/icon_0-17.png',
        symbolSize : [26,26],
        showAllSymbol:true,
        clipOverflow:false,
        symbolOffset:[0,'15'],
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
        data : picData,
      }
      var arrs = [];
      for (var i = 0; i < series[0].data.length; i++) {
        arrs.push(series[0].data[i].name);
      };
      for (var i = 0; i < arrs.length; i++) {
        var picSeries2 = $.extend({},picSeries);
        var picData = [];
        for (var k = 0; k < series[0].data.length; k++) {
          var json = {};
          json.value = null;
          json.size = 24;
          picData.push(json);
        };
        picData[i].value=0;
        picSeries2.data = [].concat(picData);
        picSeries2.symbol = 'image://../images/icon_'+arrs[i].toLocaleLowerCase()+'.png';
        if (arrs[i].toLocaleLowerCase()=='55+') {
          picSeries2.symbol = 'image://../images/icon_55-64.png';
        };
        series.push(picSeries2);
      };
      
    };
    if (ymax) {
      interval = parseFloat((ymax/splitNumber));
      ymax = interval * splitNumber; 
    };
     
    var option = {
        color: color,
        legend: {
            show:legendshow,
            data: legend,
            selectedMode:false,
            itemWidth:8,
            itemHeight:8,
            itemGap:10,
            top:"bottom",
            // bottom:0,
            padding:[0,5,0,5],
            icon:"circle",
        },
        grid: {
            y: '20',
            left:gridleft,
            right:0,
            bottom:bottom,
        },
        tooltip: {
            trigger:"item",
            formatter: function (params) {
              // console.log(params)
              if (params.seriesName!="test") {
                return "<p><b>"+params.seriesName+"</b></p><p>Audience: "+_this.formatNum(params.data.percent,2)+"% ("+_this.formatNum(params.data.trueValue,0)+")</p>";
              }
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
        xAxis: {
            type: 'category',
            name: '',
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            offset:offsetX,
            data:xAxisData,
            splitLine: {
                show: false
            },
            axisLine: {
                show:false
            },
            axisTick:{
              show:false
            },
            axisPointer:{
              show:false
            }
        },
        yAxis: [{
            type: 'value',
            name: '',
            nameTextStyle: {
                color: '#333',
                fontSize: 12
            },
            min:ymin,
            max:ymax,
            interval:interval,
            axisLine: {
                show:false,
            },
            axisPointer:{
              show:false
            },
            axisTick:{
              show:false
            },
            axisLabel:{
              show:yaxisLabel,
              formatter:yaxisLabelFormatter,
            },
            splitLine:{
              show:true,
              lineStyle:{
                color:"#dfdfdf"
              }
            },
        },{
            type: 'value',
            name: 'icon',
            show:false,
        }],
        series: series
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
  initTotalAudience: function(mainId,audId,marketId,data){
    if(!data) return;
    if (!document.getElementById(mainId)) return;
    if ($("#"+mainId).find(".plan-result-middle-line").length>0) {
      $("#"+mainId).find(".plan-result-middle-line").find("span").text(this.formatNum(data.allMarket,0));
    };
    this.initAudience(audId,data);
    this.initMarketShare(marketId,data);
  },
  initAudienceScale: function(mainId,da,mapShareId){
      if(!da) return;
      var data = da.audienceScale;
      if (!document.getElementById(mainId)) return;
      var id = "#"+mainId;
      //进度条百分比 = 实际百分比/最高百分比
      var max = Math.max(Math.abs(data.averageP),Math.abs(data.averageWeekP),Math.abs(data.averageMonthP));

      $(id).find(id+"_"+"total").text(this.getKWMformat(data.total));
      $(id).find(id+"_"+"dailyGrowth").text(this.getKWMformat(data.dailyGrowth));
      $(id).find(id+"_"+"dailyGrowth").prev().attr("class",data.dailyGrowth>0 ? "fa fa-caret-up" : "fa fa-caret-down");
      $(id).find(id+"_"+"dailyGrowthP").text(this.addPercent(data.dailyGrowthP));
      $(id).find(id+"_"+"weeklyGrowth").text(this.getKWMformat(data.weeklyGrowth));
      $(id).find(id+"_"+"weeklyGrowth").prev().attr("class",data.weeklyGrowth>0 ? "fa fa-caret-up" : "fa fa-caret-down");
      $(id).find(id+"_"+"weeklyGrowthP").text(this.addPercent(data.weeklyGrowthP));
      $(id).find(id+"_"+"monthlyGrowth").text(this.getKWMformat(data.monthlyGrowth));
      $(id).find(id+"_"+"monthlyGrowth").prev().attr("class",data.monthlyGrowth>0 ? "fa fa-caret-up" : "fa fa-caret-down");
      $(id).find(id+"_"+"monthlyGrowthP").text(this.addPercent(data.monthlyGrowthP));

      $(id).find(id+"_"+"date").text(data.date);
      $(id).find(id+"_"+"totalDay").text(data.totalDay);
      $(id).find(id+"_"+"rangeMin").text(this.getKWMformat(data.rangeMin));
      $(id).find(id+"_"+"rangeMax").text(this.getKWMformat(data.rangeMax));
      $(id).find(id+"_"+"average").text(this.getKWMformat(data.average));
      $(id).find(id+"_"+"averageP").text(this.getKWMformat(data.averageP)+"%");
      var averageP_progress = (Math.abs(data.averageP)/max)*100; 
      if(data.averageP>0){
        $(id).find(id+"_"+"averageP").parent().next().empty();
        $(id).find(id+"_"+"averageP").parent().next().next().html('<div class="compare-progress-line caret-up" data-toggle="tooltip" data-placement="bottom" data-original-title="'+this.getKWMformat(data.averageP)+'%"><div style="width: '+averageP_progress+'%;" class="bar"></div></div>');
      }else{
        $(id).find(id+"_"+"averageP").parent().next().next().empty();
        $(id).find(id+"_"+"averageP").parent().next().html('<div class="compare-progress-line caret-down" data-toggle="tooltip" data-placement="bottom" data-original-title="'+this.getKWMformat(data.averageP)+'%"><div style="width: '+averageP_progress+'%;" class="bar"></div></div>');
      }
      
      $(id).find(id+"_"+"averageP").prev().attr("class",data.averageP>0 ? "fa fa-caret-up" : "fa fa-caret-down");
      
      $(id).find(id+"_"+"averageWeek").text(this.getKWMformat(data.averageWeek));
      $(id).find(id+"_"+"averageWeekP").text(this.getKWMformat(data.averageWeekP)+"%");
      var averageWeek_progress = (Math.abs(data.averageWeekP)/max)*100; 
      if(data.averageWeekP>0){
        $(id).find(id+"_"+"averageWeekP").parent().next().empty();
        $(id).find(id+"_"+"averageWeekP").parent().next().next().html('<div class="compare-progress-line caret-up" data-toggle="tooltip" data-placement="bottom" data-original-title="'+this.getKWMformat(data.averageWeekP)+'%"><div style="width: '+averageWeek_progress+'%;" class="bar"></div></div>');
      }else{
        $(id).find(id+"_"+"averageWeekP").parent().next().next().empty();
        $(id).find(id+"_"+"averageWeekP").parent().next().html('<div class="compare-progress-line caret-down" data-toggle="tooltip" data-placement="bottom" data-original-title="'+this.getKWMformat(data.averageWeekP)+'%"><div style="width: '+averageWeek_progress+'%;" class="bar"></div></div>');
      }
      $(id).find(id+"_"+"averageWeekP").prev().attr("class",data.averageWeekP>0 ? "fa fa-caret-up" : "fa fa-caret-down");
      
      $(id).find(id+"_"+"averageMonth").text(this.getKWMformat(data.averageMonth));
      $(id).find(id+"_"+"averageMonthP").text(this.getKWMformat(data.averageMonthP)+"%");
      var averageMonth_progress = (Math.abs(data.averageMonthP)/max)*100; 
      if(data.averageMonthP>0){
        $(id).find(id+"_"+"averageMonthP").parent().next().empty();
        $(id).find(id+"_"+"averageMonthP").parent().next().next().html('<div class="compare-progress-line caret-up" data-toggle="tooltip" data-placement="bottom" data-original-title="'+this.getKWMformat(data.averageMonthP)+'%"><div style="width: '+averageMonth_progress+'%;" class="bar"></div></div>');
      }else{
        $(id).find(id+"_"+"averageMonthP").parent().next().next().empty();
        $(id).find(id+"_"+"averageMonthP").parent().next().html('<div class="compare-progress-line caret-down" data-toggle="tooltip" data-placement="bottom" data-original-title="'+this.getKWMformat(data.averageMonthP)+'%"><div style="width: '+averageMonth_progress+'%;" class="bar"></div></div>');
      }
      $(id).find(id+"_"+"averageMonthP").prev().attr("class",data.averageMonthP>0 ? "fa fa-caret-up" : "fa fa-caret-down");
      
      if(mapShareId){
        this.initMarketShare(mapShareId,da);
      }
      // $("[data-toggle=tooltip]").tooltip();
    },

  initTotalAudienceMulti: function(mainId,nameId,scaleId,shareId,data){
    if(!data) return;
    if (!document.getElementById(mainId)) return;
    var index = 0,nameList=[],scaleList=[],shareList=[],allMarket=0;

    for(var i in data){
      if (data[i]) {
        allMarket = this.getKWMformat(data[i].allMarket);
        nameList.push('<li style="line-height:25px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><span style="width:8px;height:8px;border-radius:8px!important;background:'+data[i].graphColor+';display:inline-block;margin-right:5px;"></span>'+data[i].productName+'</li>');
        scaleList.push('<li style="line-height:25px;">'+this.getKWMformat(data[i].audience)+'</li>')
        var percent = (parseFloat(data[i].market_share.market_show)/data[i].market_share.market)*100; 
        shareList.push('<li style="line-height:25px;">'+percent.toFixed(2)+'%</li>')
        index++;
      };
    }
    if ($("#"+mainId).find(".plan-result-middle-line").length>0) {
      $("#"+mainId).find(".plan-result-middle-line").find("span").text(allMarket);
    };
    $("#"+nameId).find("ul").html(nameList.join(""));
    $("#"+scaleId).find("ul").html(scaleList.join(""));
    $("#"+shareId).find("ul").html(shareList.join(""));
  },
  initCloudTag: function(id,data,height){
    if(!data || !data.cloud_tag) return;
    if (!document.getElementById(id)) return;
    //判断是否引进了jQCloud插件
    if (typeof $().jQCloud == "function") {
      window.stopCloud = true;
      setTimeout(function(){
        $("#"+id).empty();
        $("#"+id).show();
        window.stopCloud = false;
        $("#"+id).jQCloud(data.cloud_tag,{
          height:height
        });
      },200)
      
    };
  },
  initAudience: function(id,data){
    if (!document.getElementById(id)) return;
    $("#"+id).text(data ? this.getKWMformat(data.audience) : 0);
  },
  initMarketShare: function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var seriesData = [],borderWidth=3,showColor = "#F9A5A5",showPosition="center";
    var labelStyle ={
                      color:"#ef4136",
                      fontSize:30,
                      fontWeight:"bold",
                      fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
                    };
    var _this = this,showValue=0;
    //首页的颜色位置不一样。。
    if (id=="market-map_share") {
      showColor = '#96BAE4';
      // showPosition="outside";
      labelStyle.color = '#4484CF';
      // labelStyle.fontSize=20;
      labelStyle.fontWeight="bold";
    };
    for(var i in data.market_share){
      var seriesJson = {};
      seriesJson.name = i;
      seriesJson.value = data.market_share[i];
      if (i=="market_show") {
        // seriesJson.selected = true;
        showValue = data.market_share[i];
      };
      seriesData.push(seriesJson);
    }
    for (var i = 0; i < seriesData.length; i++) {
      if(seriesData[i].name == "market"){
        seriesData[i].value = seriesData[i].value - showValue;
        if (seriesData[i].value==0) {
          borderWidth = 0;
        };
      }
    };    
    var option = {
          tooltip: {
              trigger: 'item',
              formatter: function(params){
                return "Audience: "+_this.formatNum(params.value,0);
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
          color: ['#fff',showColor],
          series: [
              {
                  name:'market',
                  type:'pie',
                  radius: '70%',
                  cursor:'default',
                  hoverAnimation:false,
                  avoidLabelOverlap: false,
                  clockwise:false,
                  selectedOffset:5,
                  label: {
                      normal: {
                          show: true,
                          position: showPosition,
                          formatter: function(params){
                            if(params.name=="market") return "";
                            if (params.percent<0.01) {params.percent=0.01};
                            return params.percent.toFixed(2)+"%";
                          },
                          textStyle: labelStyle
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
    var male = (data && data.gender && data.gender.male) ? data.gender.male : 0;
    var female = (data && data.gender && data.gender.female)  ? data.gender.female : 0;
    var unknown = (data && data.gender && data.gender.UNKNOWN)  ? data.gender.UNKNOWN: 0;
    // var _total = male+female+unknown;
    var _total = male+female;
    var malePercent = (parseFloat(male)/_total)*100; 
    var femalePercent = (parseFloat(female)/_total)*100; 
    var unknownPercent = 100-malePercent-femalePercent;
    if(unknownPercent<0){
      unknownPercent =0;
    }
    //特殊处理，吧unknown按比例分给其他地方
    female = female+parseInt(unknown*femalePercent*0.01);
    male = _total+unknown-female;
    malePercent = (parseFloat(male)/(female+male))*100; 
    femalePercent = 100-malePercent; 

    var _this = this;
    $("#"+id).parent().find(".gender-male").find("p").text(malePercent.toFixed(0)+"%");
    $("#"+id).parent().find(".gender-female").find("p").text(femalePercent.toFixed(0)+"%");
    $("#"+id).parent().find(".gender-unknown").find("p").text(unknownPercent.toFixed(0)+"%");
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var option = {
          tooltip: {
              trigger: 'item',
              formatter: function(params){
                return "<p><b>"+params.name+"</b></p><p>Audience: "+_this.formatNum(params.value,0)+"</p>";
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
          color: ['#ef4136','#4484CF','#c1c1c1'],
          series: [
              {
                  name:'Gender',
                  type:'pie',
                  cursor:'default',
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
                      // {value: unknown, name:'Unknown'},
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
  initGenderMulti: function(nameId ,maleId,femaleId,data){
    if (!data) return;
    if (!document.getElementById(nameId)) return;
    var index = 0,nameList=[],maleList=[],femaleList=[];
    data = $.extend({},data);
    for(var i in data){
      if (data[i]) {
        nameList.push('<li title="'+data[i].productName+'">'+data[i].productName+'</li>');
        var male = (data[i] && data[i].gender && data[i].gender.male) ? data[i].gender.male : 0;
        var female = (data[i] && data[i].gender && data[i].gender.female) ? data[i].gender.female : 0;
        var unknown = (data[i] && data[i].gender && data[i].gender.UNKNOWN) ? data[i].gender.UNKNOWN: 0;
        // var _total = male+female+unknown;
        var _total = male+female;
        var malePercent = (parseFloat(male)/_total)*100; 
        var femalePercent = (parseFloat(female)/_total)*100; 
        var unknownPercent = 100-malePercent-femalePercent;
        if(unknownPercent<0){
          unknownPercent =0;
        }
        //特殊处理，吧unknown按比例分给其他地方
        female = female+parseInt(unknown*femalePercent*0.01);
        male = _total+unknown-female;
        malePercent = (parseFloat(male)/(female+male))*100; 
        femalePercent = 100-malePercent;
        var maleHtml = '<li>'+
                       '   <div class="line_main">'+
                       '     <div class="tooltip-content">  '+
                       '       <p>Male</p> <span>Audience: '+malePercent.toFixed(2)+'% ('+this.formatNum(male,0)+')</span>'+
                       '     </div>'+
                       '     <div class="compare-progress-line">'+
                       '       <div style="width: '+malePercent.toFixed(2)+'%;" class="bar"></div>'+
                       '     </div>'+
                       '   </div>'+
                       ' </li>';
        maleList.push(maleHtml);
        var femaleHtml = '<li>'+
                       '   <div class="line_main">'+
                       '     <div class="tooltip-content">  '+
                       '       <p>Female</p> <span>Audience: '+femalePercent.toFixed(2)+'% ('+this.formatNum(female,0)+')</span>'+
                       '     </div>'+
                       '     <div class="compare-progress-line">'+
                       '       <div style="width: '+femalePercent.toFixed(2)+'%;" class="bar"></div>'+
                       '     </div>'+
                       '   </div>'+
                       ' </li>';
        femaleList.push(femaleHtml);
        index++;
      };
    }
    $("#"+nameId).html(nameList.join(""));
    $("#"+maleId).html(maleList.join(""));
    $("#"+femaleId).html(femaleList.join(""));
  },

  initAgeGroup: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    $("#"+id).find(".result-graph-word-content").empty();
    var _total = 0,plus55 = 0,all = 0,unknownlast=0;
    for (var i in data.age_group) {
      if (i!="UNKNOWN" || i=="未知"){
        _total +=parseFloat(data.age_group[i]);
      }
      all += parseFloat(data.age_group[i]);
    }
    //特殊处理，将unknown部分按比例分配,55-64与65+合并
    //var specialTotal = 0
    for (var i in data.age_group) {
      if (i!="UNKNOWN" && i!="55-64" && i!="65+") {
        var per = (parseFloat(data.age_group[i]*100)/_total); 
        var unknowPart = Math.ceil(per*data.age_group['UNKNOWN']*0.01);;
        unknownlast += unknowPart;
        data.age_group[i] += unknowPart
        //specialTotal += data.age_group[i];
      }
      if (i=="55-64"||i=="65+") {
        plus55 += parseFloat(data.age_group[i]);
      };
    }
   
    plus55 += data.age_group['UNKNOWN'] - unknownlast;
    var per55 = 100;
    for (var i in data.age_group) {
      if( i=="UNKNOWN" || i=="未知" || i=="65+" ){
        continue;
      }
      var per = (parseFloat(data.age_group[i])*100/all); 
      var isRight = "";
      var bgname = i.replace("+","");
      var value = _this.formatNum(data.age_group[i],0);
      var name = i;
      if (i=="55-64") {
        isRight = "toolright";
        name = "55+";
        per = per55; 
        value = _this.formatNum(plus55,0);
      };
      per55 -=per.toFixed(0);
      var barHeight = 128 * (per) * 0.01 ;
      if ($("#"+id).find(".result-graph-word-content").hasClass("min-age-group")) {
        var barHeight = 100 * (per) * 0.01 ;
      };
      var _html = '<div class="xmo-bar_per">'+
                '<span class="name">'+name+'</span>'+
                '<span class="result">'+per.toFixed(0)+'%</span>'+
                '<span class="bg_ico bg_ico_'+bgname+'"></span>'+
                '<span class="bar_main">'+
                  '<div class="bar_bg"></div>'+
                  '<div class="tooltip-content '+isRight+'">'+
                  '  <p>Age: '+name+'</p>'+
                  ' <span>Audience: '+value+'</span>'+
                  '</div>'+
                  '<div class="bar_content">'+
                    '<i style="height: '+barHeight.toFixed(2)+'px; background: #EF4136;"></i>'+
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
  initAgeGroupMulti: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var ageGroupArr=[],ageGroupSeries=[],ageGroupJson={},ageGroupLegend=[],colorMap=[];
    var _this = this;
    //处理age group数据
    var newdata = $.extend({},data);
    var group_data={},xAxisData_age_group=[];
    for (var i in newdata) {
      var indexValue = $.extend({},newdata[i].age_group);
      ageGroupArr.push({name:newdata[i].productName,value:indexValue});
      colorMap.push(newdata[i].graphColor);
    };
    var max=0;
    for (var i = 0; i < ageGroupArr.length; i++) {
      var newdata = ageGroupArr[i].value;
      var _total = 0,plus55=0,all=0,unknowPart=0,unknownlast=0;
      group_data[ageGroupArr[i].name]=[];
      ageGroupLegend.push(ageGroupArr[i].name);
      for (var k in newdata) {
        if (k!="name") {
          if ( k!="UNKNOWN") {;
            _total +=parseFloat(newdata[k]);
          }
          all += parseFloat(newdata[k]);
        }
      }
      //特殊处理，将unknown部分按比例分配,55-64与65+合并
      for (var k in newdata) {
        if (k!="name") {
          if (k!="UNKNOWN" && k!="55-64" && k!="65+") {
            var per = (parseFloat(newdata[k]*100)/_total); 
            var unknowPart = Math.ceil(per*newdata['UNKNOWN']*0.01);;
            unknownlast += unknowPart;
            newdata[k] += unknowPart
          }
          if (k=="55-64"||k=="65+") {
            plus55 += parseFloat(newdata[k]);
          };
        }
      }
     
      plus55 += newdata['UNKNOWN'] - unknownlast;
      newdata['UNKNOWN']=0;
      var per55 = 100;
      for (var j in newdata) {
        if (j!="UNKNOWN" && j!="65+") {
          var per = (parseFloat(newdata[j])/all)*100; 
          var trueValue = parseFloat(newdata[j]);
          var name = j;
          if (j=="55-64") {
            name = "55+";
            per = per55; 
            trueValue = parseFloat(plus55);
          };
          per55 -=per.toFixed(0);
          if(max < per) max = parseInt(per);
          var json = {
            name:name,
            percent:per,
            value:per,
            trueValue:trueValue          
          };
          group_data[ageGroupArr[i].name].push(json);
          if (i==0) {
            xAxisData_age_group.push(name);
          };
        };
      }
    };
    for (var i in group_data) {
      if (i!="name") {
        ageGroupSeries.push({
          name:i,
          type:"bar",
          // barGap:10,
          cursor:'default',
          seriesIndex:0,
          barWidth:10,
          max:max,
          data:group_data[i]
        })
      };
    };
    // console.log(ageGroupSeries,ageGroupLegend)
    _this.initBarFunnel(id,ageGroupLegend,ageGroupSeries,xAxisData_age_group,colorMap);
  },
  initProductShare: function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    var legendData = [], seriesData = [],maxLen=60,length=0,itemGap=10,width=parseInt($("#"+id).css("width"));
    var _total = 0;
    for(var i in data.product_share){
      _total += parseFloat(data.product_share[i]);
    };
    for(var i in data.product_share){
      var legendJson = {};
      var seriesJson = {};
      legendJson.name = i;
      legendJson.icon = "circle";
      seriesJson.name = i;
      seriesJson.value = data.product_share[i];
      seriesJson.percent = (parseFloat(data.product_share[i])/_total)*100; 
      legendData.push(legendJson);
      seriesData.push(seriesJson);
      length+=this.getLength(i);
    }
    if (length>maxLen && width<500) {
      itemGap=5;
    };
    var showLegend = true;
    if ($("#"+id).width()<1000) {
      showLegend = false;
    };
    echarts.dispose(document.getElementById(id));
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
                return "<p><b>"+params.name+"</b></p><p>Audience: "+_this.formatNum(params.data.percent,2)+"% ("+_this.formatNum(params.value,0)+")</p>";
              }
          },
          legend: {
              orient: 'horizontal',
              bottom: '0',
              show:showLegend,
              itemGap:itemGap,
              itemWidth:10,
              itemHeight:10,
              data:legendData,
              selectedMode:false,
              textStyle:{
                color:'#333',
                fontFamily: 'Open Sans, Noto Sans SC,Arial,sans-serif'
              }
          },
          color: this.colorMap,
          series: [
              {
                  name:'PRODUCT',
                  type:'pie',
                  cursor:'default',
                  radius: ['45%', '70%'],
                  avoidLabelOverlap: false,
                  hoverAnimation:false,
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
                  data:seriesData
              }
          ]
      };
      myChart.setOption(option);
      //图例样式不好控制，生成图例
      if (!showLegend) {
        $("#"+id).next().remove();
        var legendLi="<ul>";
        for (var i = 0; i < legendData.length; i++) {
          var name = legendData[i].name;
          var color = this.colorMap[i];
          legendLi += '<li style="line-height:25px;float:left;width:33%;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><span style="width:8px;height:8px;border-radius:8px!important;background:'+color+';display:inline-block;margin-right:5px;"></span>'+name+'</li>';
        };
        legendLi+="</ul>";
        $("#"+id).after(legendLi);
      };
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
  initProductShareMulti: function(id,data){
    if(!data) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    var legendData = [], seriesData = [],graphColorMap=[];maxLen=60,length=0,itemGap=10,width=parseInt($("#"+id).css("width")),colorMap=this.colorMap;
    var colorMapArr = {
                       '#EF4136':['#EF4136','#F26B62','#F6948E','#F9BEBA','#FDE8E6','#E5C1BF','#E09B96','#D06D66','#C64E46'],
                       '#FFBD00':['#FFBD00','#FFCB38','#FFDA70','#FFE8A8','#FFF7E0','#E7D8B2','#E5CA7E','#E0B949','#E7B11A'],
                       '#4484CF':['#4484CF','#6D9FD9','#96BAE4','#BFD5EE','#E8F0F9','#CDD9E8','#9AB0CB','#779AC4','#4D7AB1'],
                       '#946EDB':['#946EDB','#AB8EE3','#C3AEEB','#DACDF2','#F2EDFA','#D9D1E7','#B6A8D2','#A38DCE','#8F73C2'],
                       '#8D7B7B':['#8D7B7B','#A69898','#BFB5B5','#D8D2D2','#F1EFEF','#E4E0E0','#CBC3C3','#B2A6A6','#998989'],
                       '#54C7B0':['#54C7B0','#7AD3C1','#9FDFD3','#C5ECE4','#EAF8F5','#C3DED8','#A5D0C7','#7DC1B3','#5DB6A5'],
                       '#F47920':['#F47920','#F69651','#F9B482','#FBD1B3','#FDEFE4','#E2C7B3','#E7B48F','#DE9662','#DB7B35'],
                       '#194283':['#194283','#4C6B9E','#7E95B9','#B1BED5','#E3E8F0','#B7BFCB','#8697B1','#576D92','#2F4D7D'],
                       '#59C754':['#59C754','#7DD37A','#A2DF9F','#C6ECC5','#EBF8EA','#C4D9C3','#9FC49D','#78AF75','#5AA357']
                     }
    $("#"+id).empty();
    var index = 0;
    for(var k in data){
      if (data[k]) {
        var graphid = "graph_brand_"+id+k;
        legendData = [], seriesData = [],graphColorMap=colorMapArr[data[k].graphColor];
        var _total = 0;
        for(var i in data[k].product_share){
          _total += parseFloat(data[k].product_share[i]);
        };
        for(var i in data[k].product_share){
          var legendJson = {};
          var seriesJson = {};
          legendJson.name = i;
          legendJson.icon = "circle";
          seriesJson.name = i;
          seriesJson.value = data[k].product_share[i];
          seriesJson.percent = (parseFloat(data[k].product_share[i])/_total)*100; 
          legendData.push(legendJson);
          seriesData.push(seriesJson);
        }
        var liHtml = '<label title="'+data[k].productName+'">'+data[k].productName+'</label><ul style="margin-left: 40px;">';
        for (var i = 0; i < legendData.length; i++) {
          //初始化副标题
          liHtml += '<li title="'+legendData[i].name+'"><span style="width:8px;height:8px;border-radius:8px!important;background:'+graphColorMap[i]+';display:inline-block;margin-right:5px;"></span>'+legendData[i].name+'</li>';
        } 
        var conhtml = '<div class="interest-multi-container">'+
                    '  <div class="interest-multi-graph" id="'+graphid+'"></div>'+
                    '  <div class="interest-multi-content">'+liHtml+'</ul>'+
                    '  </div>'+
                    '</div>';  
        $("#"+id).append(conhtml);     
        this.createProductShareChart(graphid,legendData,seriesData,graphColorMap);
        index++;
      };
    }
    //调整距离
    var totalW = $("#"+id).width();
    var count = $("#"+id).find(".interest-multi-container").length;
    var marginLeft=  totalW/2 - $("#"+id).find(".interest-multi-container").width()/2*count;
    if (count<5) {
      $("#"+id).find(".interest-multi-container").first().css("margin-left",marginLeft+"px");
    };
  },
  createProductShareChart: function(id,legendData,seriesData,graphColorMap){
    if(!legendData) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    echarts.dispose(document.getElementById(id));
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
                return "<p><b>"+params.name+"</b></p><p>Audience: "+_this.formatNum(params.data.percent,2)+"% ("+_this.formatNum(params.value,0)+")</p>";
              }
          },
          legend: {
              orient: 'horizontal',
              show:false,
          },
          color: graphColorMap,
          series: [
              {
                  name:'PRODUCT',
                  type:'pie',
                  cursor:'default',
                  radius: ['45%', '70%'],
                  cursor:'default',
                  avoidLabelOverlap: false,
                  hoverAnimation:false,
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
    if (!document.getElementById(id)) return;
    var pc = (data && data.device && data.device.PC) ? data.device.PC : 0;
    var mobile = (data && data.device && data.device.Mobile) ? data.device.Mobile : 0;
    var unknown = (data && data.device && data.device.UNKNOWN) ? data.device.UNKNOWN: 0;
    // var _total = pc+mobile+unknown;
    var _total = pc+mobile;
    var pcPercent = (parseFloat(pc)/_total)*100; 
    var mobilePercent = (parseFloat(mobile)/_total)*100; 
    var unknownPercent = 100-pcPercent-mobilePercent;
    if(unknownPercent<0){
      unknownPercent =0;
    }
    //特殊处理，吧unknown按比例分给其他地方
    mobile = mobile+parseInt(unknown*mobilePercent*0.01);
    pc = _total+unknown-mobile;
    pcPercent = (parseFloat(pc)/(pc+mobile))*100; 
    mobilePercent = 100-pcPercent; 


    var _this = this;
    $("#"+id).parent().find(".device-pc").find("p").text(pcPercent.toFixed(0)+"%");
    $("#"+id).parent().find(".device-mobile").find("p").text(mobilePercent.toFixed(0)+"%");
    $("#"+id).parent().find(".device-unknown").find("p").text(unknownPercent.toFixed(0)+"%");
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var option = {
          tooltip: {
              trigger: 'item',
              formatter: function(params){
                return "<p><b>"+params.name+"</b></p><p>Audience: "+_this.formatNum(params.value,0)+"</p>";
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
          color: ['#946EDB','#FFBD00','#c1c1c1'],
          series: [
              {
                  name:'Gender',
                  type:'pie',
                  radius: ['40%', '70%'],
                  hoverAnimation:false,
                  avoidLabelOverlap: false,
                  cursor:'default',
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
                      {value: mobile, name:'Mobile'},
                      {value: pc, name:'PC'},
                      // {value: unknown, name:'Unknown'},
                  ]
              }
          ]
      };
      console.log(option)
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
  initDeviceMulti: function(nameId ,pcId,mobileId,data){
    if (!data) return;
    if (!document.getElementById(nameId)) return;
    var index = 0,nameList=[],pcList=[],mobileList=[];

    for(var i in data){
      if (data[i]) {
        nameList.push('<li title="'+data[i].productName+'">'+data[i].productName+'</li>');
        var pc = (data[i] && data[i].device && data[i].device.PC) ? data[i].device.PC : 0;
        var mobile = (data[i] && data[i].device && data[i].device.Mobile) ? data[i].device.Mobile : 0;
        var unknown = (data[i] && data[i].device && data[i].device.UNKNOWN) ? data[i].device.UNKNOWN: 0;
        // var _total = male+female+unknown;
        var _total = pc+mobile;
        var pcPercent = (parseFloat(pc)/_total)*100; 
        var mobilePercent = (parseFloat(mobile)/_total)*100; 
        var unknownPercent = 100-pcPercent-mobilePercent;
        if(unknownPercent<0){
          unknownPercent =0;
        }
        //特殊处理，吧unknown按比例分给其他地方
        mobile = mobile+parseInt(unknown*mobilePercent*0.01);
        pc = _total+unknown-mobile;
        pcPercent = (parseFloat(pc)/(mobile+pc))*100; 
        mobilePercent = 100-pcPercent; 

        var pcHtml = '<li>'+
                       '   <div class="line_main">'+
                       '     <div class="tooltip-content">  '+
                       '       <p>PC</p> <span>Audience: '+pcPercent.toFixed(2)+'% ('+this.formatNum(pc,0)+')</span>'+
                       '     </div>'+
                       '     <div class="compare-progress-line">'+
                       '       <div style="width: '+pcPercent.toFixed(2)+'%;" class="bar"></div>'+
                       '     </div>'+
                       '   </div>'+
                       ' </li>';
        pcList.push(pcHtml);
        var mobileHtml = '<li>'+
                       '   <div class="line_main">'+
                       '     <div class="tooltip-content">  '+
                       '       <p>Mobile</p> <span>Audience: '+mobilePercent.toFixed(2)+'% ('+this.formatNum(mobile,0)+')</span>'+
                       '     </div>'+
                       '     <div class="compare-progress-line">'+
                       '       <div style="width: '+mobilePercent.toFixed(2)+'%;" class="bar"></div>'+
                       '     </div>'+
                       '   </div>'+
                       ' </li>';
        mobileList.push(mobileHtml);
        index++;
      };
    }
    $("#"+nameId).html(nameList.join(""));
    $("#"+pcId).html(pcList.join(""));
    $("#"+mobileId).html(mobileList.join(""));
  },
  initRegions: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    var rangeColor = ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'];
    var symbolSizeRange = [5,30];
    var min = 0,max = 0;
    for (var i = 0; i < data.regions.length; i++) {
      if (!data.regions[i].name) data.regions[i].name="null";
      var isOthers = data.regions[i].name=="未知" || data.regions[i].name=="Unknown" || data.regions[i].name=="Overseas";
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
    var geoCoordMap = {
      "海门":[121.15,31.89],
      "鄂尔多斯":[109.781327,39.608266],
      "招远":[120.38,37.35],
      "舟山":[122.207216,29.985295],
      "齐齐哈尔":[123.97,47.33],
      "盐城":[120.13,33.38],
      "赤峰":[118.87,42.28],
      "青岛":[120.33,36.07],
      "乳山":[121.52,36.89],
      "金昌":[102.188043,38.520089],
      "泉州":[118.58,24.93],
      "莱西":[120.53,36.86],
      "日照":[119.46,35.42],
      "胶南":[119.97,35.88],
      "南通":[121.05,32.08],
      "拉萨":[91.11,29.97],
      "云浮":[112.02,22.93],
      "梅州":[116.1,24.55],
      "文登":[122.05,37.2],
      "上海":[121.48,31.22],
      "攀枝花":[101.718637,26.582347],
      "威海":[122.1,37.5],
      "承德":[117.93,40.97],
      "厦门":[118.1,24.46],
      "汕尾":[115.375279,22.786211],
      "潮州":[116.63,23.68],
      "丹东":[124.37,40.13],
      "太仓":[121.1,31.45],
      "曲靖":[103.79,25.51],
      "烟台":[121.39,37.52],
      "福州":[119.3,26.08],
      "瓦房店":[121.979603,39.627114],
      "即墨":[120.45,36.38],
      "抚顺":[123.97,41.97],
      "玉溪":[102.52,24.35],
      "张家口":[114.87,40.82],
      "阳泉":[113.57,37.85],
      "莱州":[119.942327,37.177017],
      "湖州":[120.1,30.86],
      "汕头":[116.69,23.39],
      "昆山":[120.95,31.39],
      "宁波":[121.56,29.86],
      "湛江":[110.359377,21.270708],
      "揭阳":[116.35,23.55],
      "荣成":[122.41,37.16],
      "连云港":[119.16,34.59],
      "葫芦岛":[120.836932,40.711052],
      "常熟":[120.74,31.64],
      "东莞":[113.75,23.04],
      "河源":[114.68,23.73],
      "淮安":[119.15,33.5],
      "泰州":[119.9,32.49],
      "南宁":[108.33,22.84],
      "营口":[122.18,40.65],
      "惠州":[114.4,23.09],
      "江阴":[120.26,31.91],
      "蓬莱":[120.75,37.8],
      "韶关":[113.62,24.84],
      "嘉峪关":[98.289152,39.77313],
      "广州":[113.23,23.16],
      "延安":[109.47,36.6],
      "太原":[112.53,37.87],
      "清远":[113.01,23.7],
      "中山":[113.38,22.52],
      "昆明":[102.73,25.04],
      "寿光":[118.73,36.86],
      "盘锦":[122.070714,41.119997],
      "长治":[113.08,36.18],
      "深圳":[114.07,22.62],
      "珠海":[113.52,22.3],
      "宿迁":[118.3,33.96],
      "咸阳":[108.72,34.36],
      "铜川":[109.11,35.09],
      "平度":[119.97,36.77],
      "佛山":[113.11,23.05],
      "海口":[110.35,20.02],
      "江门":[113.06,22.61],
      "章丘":[117.53,36.72],
      "肇庆":[112.44,23.05],
      "大连":[121.62,38.92],
      "临汾":[111.5,36.08],
      "吴江":[120.63,31.16],
      "石嘴山":[106.39,39.04],
      "沈阳":[123.38,41.8],
      "苏州":[120.62,31.32],
      "茂名":[110.88,21.68],
      "嘉兴":[120.76,30.77],
      "长春":[125.35,43.88],
      "胶州":[120.03336,36.264622],
      "银川":[106.27,38.47],
      "张家港":[120.555821,31.875428],
      "三门峡":[111.19,34.76],
      "锦州":[121.15,41.13],
      "南昌":[115.89,28.68],
      "柳州":[109.4,24.33],
      "三亚":[109.511909,18.252847],
      "自贡":[104.778442,29.33903],
      "吉林":[126.57,43.87],
      "阳江":[111.95,21.85],
      "泸州":[105.39,28.91],
      "西宁":[101.74,36.56],
      "宜宾":[104.56,29.77],
      "呼和浩特":[111.65,40.82],
      "成都":[104.06,30.67],
      "大同":[113.3,40.12],
      "镇江":[119.44,32.2],
      "桂林":[110.28,25.29],
      "张家界":[110.479191,29.117096],
      "宜兴":[119.82,31.36],
      "北海":[109.12,21.49],
      "西安":[108.95,34.27],
      "金坛":[119.56,31.74],
      "东营":[118.49,37.46],
      "牡丹江":[129.58,44.6],
      "遵义":[106.9,27.7],
      "绍兴":[120.58,30.01],
      "扬州":[119.42,32.39],
      "常州":[119.95,31.79],
      "潍坊":[119.1,36.62],
      "重庆":[106.54,29.59],
      "台州":[121.420757,28.656386],
      "南京":[118.78,32.04],
      "滨州":[118.03,37.36],
      "贵阳":[106.71,26.57],
      "无锡":[120.29,31.59],
      "本溪":[123.73,41.3],
      "克拉玛依":[84.77,45.59],
      "渭南":[109.5,34.52],
      "马鞍山":[118.48,31.56],
      "宝鸡":[107.15,34.38],
      "焦作":[113.21,35.24],
      "句容":[119.16,31.95],
      "北京":[116.46,39.92],
      "徐州":[117.2,34.26],
      "衡水":[115.72,37.72],
      "包头":[110,40.58],
      "绵阳":[104.73,31.48],
      "乌鲁木齐":[87.68,43.77],
      "枣庄":[117.57,34.86],
      "杭州":[120.19,30.26],
      "淄博":[118.05,36.78],
      "鞍山":[122.85,41.12],
      "溧阳":[119.48,31.43],
      "库尔勒":[86.06,41.68],
      "安阳":[114.35,36.1],
      "开封":[114.35,34.79],
      "济南":[117,36.65],
      "德阳":[104.37,31.13],
      "温州":[120.65,28.01],
      "九江":[115.97,29.71],
      "邯郸":[114.47,36.6],
      "临安":[119.72,30.23],
      "兰州":[103.73,36.03],
      "沧州":[116.83,38.33],
      "临沂":[118.35,35.05],
      "南充":[106.110698,30.837793],
      "天津":[117.2,39.13],
      "富阳":[119.95,30.07],
      "泰安":[117.13,36.18],
      "诸暨":[120.23,29.71],
      "郑州":[113.65,34.76],
      "哈尔滨":[126.63,45.75],
      "聊城":[115.97,36.45],
      "芜湖":[118.38,31.33],
      "唐山":[118.02,39.63],
      "平顶山":[113.29,33.75],
      "邢台":[114.48,37.05],
      "德州":[116.29,37.45],
      "济宁":[116.59,35.38],
      "荆州":[112.239741,30.335165],
      "宜昌":[111.3,30.7],
      "义乌":[120.06,29.32],
      "丽水":[119.92,28.45],
      "洛阳":[112.44,34.7],
      "秦皇岛":[119.57,39.95],
      "株洲":[113.16,27.83],
      "石家庄":[114.48,38.03],
      "莱芜":[117.67,36.19],
      "常德":[111.69,29.05],
      "保定":[115.48,38.85],
      "湘潭":[112.91,27.87],
      "金华":[119.64,29.12],
      "岳阳":[113.09,29.37],
      "长沙":[113,28.21],
      "衢州":[118.88,28.97],
      "廊坊":[116.7,39.53],
      "菏泽":[115.480656,35.23375],
      "合肥":[117.27,31.86],
      "武汉":[114.31,30.52],
      "大庆":[125.03,46.58]
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
              return "<p><b>Provicne: "+params.name+"</b></p><p>Audience: "+_this.formatNum(value,0)+"</p>";
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
              seriesIndex: [0],
              inRange: {
                  symbolSize:symbolSizeRange,
                  color: rangeColor
              },
              calculable : true
          },
          geo: {
              map: 'china',
              // roam: true,
              cursor:'default',
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
                  name: '数量',
                  type: 'map',
                  cursor:'default',
                  geoIndex: 0,
                  silent:true,
                  // tooltip: {show: false},
                  data:data.regions,
              },
             {
                 type: 'scatter',
                 coordinateSystem: 'geo',
                 cursor:'default',
                 geoIndex: 1,
                 data:[],
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
      //省份城市选择tab
      var selectTab = '<ul class="region-select-tab" style="visibility:visible">'+
                        '<li class="selected" data-value="0">Provicne</li>'+
                        '<li class="" data-value="1">City</li></ul>'+
                      '</ul><hr style="width:100%;visibility:visible;display: inline-block;margin: 0px 0 10px 0;"/>';
      $("#"+id).parent().parent().find(".result-graph-word-content").append(selectTab);
      //绑定selectTab事件
      var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
              var geoCoord = geoCoordMap[data[i].name];
              if (geoCoord) {
                  res.push({
                      name: data[i].name,
                      value: geoCoord.concat(data[i].value)
                  });
              }
          }
          return res;
      };
      var _this = this;
      $("#"+id).parent().parent().find(".region-select-tab").off();
      $("#"+id).parent().parent().find(".region-select-tab").on("click","li",function(){
        var value = $(this).attr("data-value");
        $(this).parent().find(".selected").removeClass("selected");
        $(this).addClass("selected");
        if (value==1) {
          var cityData =  [
                            {name: "海门", value: 9},
                            {name: "鄂尔多斯", value: 12},
                            {name: "招远", value: 12},
                            {name: "舟山", value: 12},
                            {name: "齐齐哈尔", value: 14},
                            {name: "盐城", value: 15},
                            {name: "赤峰", value: 16},
                            {name: "青岛", value: 18},
                            {name: "乳山", value: 18},
                            {name: "金昌", value: 19},
                            {name: "泉州", value: 21},
                            {name: "莱西", value: 21},
                            {name: "日照", value: 21},
                            {name: "胶南", value: 22},
                            {name: "南通", value: 23},
                            {name: "拉萨", value: 24},
                            {name: "云浮", value: 24},
                            {name: "梅州", value: 25},
                            {name: "文登", value: 25},
                            {name: "上海", value: 25},
                            {name: "攀枝花", value: 25},
                            {name: "威海", value: 25},
                            {name: "承德", value: 25},
                            {name: "厦门", value: 26},
                            {name: "汕尾", value: 26},
                            {name: "潮州", value: 26},
                            {name: "丹东", value: 27},
                            {name: "太仓", value: 27},
                            {name: "曲靖", value: 27},
                            {name: "烟台", value: 28},
                            {name: "福州", value: 29},
                            {name: "瓦房店", value: 30},
                            {name: "即墨", value: 30},
                            {name: "抚顺", value: 31},
                            {name: "玉溪", value: 31},
                            {name: "张家口", value: 31},
                            {name: "阳泉", value: 31},
                            {name: "莱州", value: 32},
                            {name: "湖州", value: 32},
                            {name: "汕头", value: 32},
                            {name: "昆山", value: 33},
                            {name: "宁波", value: 33},
                            {name: "湛江", value: 33},
                            {name: "揭阳", value: 34},
                            {name: "荣成", value: 34},
                            {name: "连云港", value: 35},
                            {name: "葫芦岛", value: 35},
                            {name: "常熟", value: 36},
                            {name: "东莞", value: 36},
                            {name: "河源", value: 36},
                            {name: "淮安", value: 36},
                            {name: "泰州", value: 36},
                            {name: "南宁", value: 37},
                            {name: "营口", value: 37},
                            {name: "惠州", value: 37},
                            {name: "江阴", value: 37},
                            {name: "蓬莱", value: 37},
                            {name: "韶关", value: 38},
                            {name: "嘉峪关", value: 38},
                            {name: "广州", value: 38},
                            {name: "延安", value: 38},
                            {name: "太原", value: 39},
                            {name: "清远", value: 39},
                            {name: "中山", value: 39},
                            {name: "昆明", value: 39},
                            {name: "寿光", value: 40},
                            {name: "盘锦", value: 40},
                            {name: "长治", value: 41},
                            {name: "深圳", value: 41},
                            {name: "珠海", value: 42},
                            {name: "宿迁", value: 43},
                            {name: "咸阳", value: 43},
                            {name: "铜川", value: 44},
                            {name: "平度", value: 44},
                            {name: "佛山", value: 44},
                            {name: "海口", value: 44},
                            {name: "江门", value: 45},
                            {name: "章丘", value: 45},
                            {name: "肇庆", value: 46},
                            {name: "大连", value: 47},
                            {name: "临汾", value: 47},
                            {name: "吴江", value: 47},
                            {name: "石嘴山", value: 49},
                            {name: "沈阳", value: 50},
                            {name: "苏州", value: 50},
                            {name: "茂名", value: 50},
                            {name: "嘉兴", value: 51},
                            {name: "长春", value: 51},
                            {name: "胶州", value: 52},
                            {name: "银川", value: 52},
                            {name: "张家港", value: 52},
                            {name: "三门峡", value: 53},
                            {name: "锦州", value: 54},
                            {name: "南昌", value: 54},
                            {name: "柳州", value: 54},
                            {name: "三亚", value: 54},
                            {name: "自贡", value: 56},
                            {name: "吉林", value: 56},
                            {name: "阳江", value: 57},
                            {name: "泸州", value: 57},
                            {name: "西宁", value: 57},
                            {name: "宜宾", value: 58},
                            {name: "呼和浩特", value: 58},
                            {name: "成都", value: 58},
                            {name: "大同", value: 58},
                            {name: "镇江", value: 59},
                            {name: "桂林", value: 59},
                            {name: "张家界", value: 59},
                            {name: "宜兴", value: 59},
                            {name: "北海", value: 60},
                            {name: "西安", value: 61},
                            {name: "金坛", value: 62},
                            {name: "东营", value: 62},
                            {name: "牡丹江", value: 63},
                            {name: "遵义", value: 63},
                            {name: "绍兴", value: 63},
                            {name: "扬州", value: 64},
                            {name: "常州", value: 64},
                            {name: "潍坊", value: 65},
                            {name: "重庆", value: 66},
                            {name: "台州", value: 67},
                            {name: "南京", value: 67},
                            {name: "滨州", value: 70},
                            {name: "贵阳", value: 71},
                            {name: "无锡", value: 71},
                            {name: "本溪", value: 71},
                            {name: "kelamayi", value: 72},
                            {name: "渭南", value: 72},
                            {name: "马鞍山", value: 72},
                            {name: "宝鸡", value: 72},
                            {name: "焦作", value: 75},
                            {name: "句容", value: 75},
                            {name: "北京", value: 79},
                            {name: "徐州", value: 79},
                            {name: "衡水", value: 80},
                            {name: "包头", value: 80},
                            {name: "绵阳", value: 80},
                            {name: "乌鲁木齐", value: 84},
                            {name: "枣庄", value: 84},
                            {name: "杭州", value: 84},
                            {name: "淄博", value: 85},
                            {name: "鞍山", value: 86},
                            {name: "溧阳", value: 86},
                            {name: "库尔勒", value: 86},
                            {name: "安阳", value: 90},
                            {name: "开封", value: 90},
                            {name: "济南", value: 92},
                            {name: "德阳", value: 93},
                            {name: "温州", value: 95},
                            {name: "九江", value: 96},
                            {name: "邯郸", value: 98},
                            {name: "临安", value: 99},
                            {name: "兰州", value: 99},
                            {name: "沧州", value: 100},
                            {name: "临沂", value: 103},
                            {name: "南充", value: 104},
                            {name: "天津", value: 105},
                            {name: "富阳", value: 106},
                            {name: "泰安", value: 112},
                            {name: "诸暨", value: 112},
                            {name: "郑州", value: 113},
                            {name: "哈尔滨", value: 114},
                            {name: "聊城", value: 116},
                            {name: "芜湖", value: 117},
                            {name: "唐山", value: 119},
                            {name: "平顶山", value: 119},
                            {name: "邢台", value: 119},
                            {name: "德州", value: 120},
                            {name: "济宁", value: 120},
                            {name: "荆州", value: 127},
                            {name: "宜昌", value: 130},
                            {name: "义乌", value: 132},
                            {name: "丽水", value: 133},
                            {name: "洛阳", value: 134},
                            {name: "秦皇岛", value: 136},
                            {name: "株洲", value: 143},
                            {name: "石家庄", value: 147},
                            {name: "莱芜", value: 148},
                            {name: "常德", value: 152},
                            {name: "保定", value: 153},
                            {name: "湘潭", value: 154},
                            {name: "金华", value: 157},
                            {name: "岳阳", value: 169},
                            {name: "长沙", value: 175},
                            {name: "衢州", value: 177},
                            {name: "廊坊", value: 193},
                            {name: "菏泽", value: 194},
                            {name: "合肥", value: 229},
                            {name: "武汉", value: 273},
                            {name: "大庆", value: 279}
                        ]
          myChart.setOption({
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
                  var value = params.value[2];
                  if (isNaN(value)) return;
                  return "<p><b>City: "+params.name+"</b></p><p>Audience: "+_this.formatNum(value,0)+"</p>";
                } 
              },
              visualMap: {
                  min: 0,
                  max: 200,
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
                  seriesIndex: [0],
                  inRange: {
                      symbolSize:symbolSizeRange,
                      color: rangeColor
                  },
                  calculable : true
              },
              geo: {
                  map: 'china',
                  label: {
                      normal: {
                          show: false,
                      },
                      emphasis: {
                          show: false
                      }
                  },
                  itemStyle: {
                      normal:{
                          borderColor: '#fff'
                      }
                      ,emphasis:{
                          areaColor: '#eee',
                          borderColor: '#fff'
                      }
                  },
                  nameMap:nameMap
              },
              series: [
                  {
                      type: 'scatter',
                      coordinateSystem: 'geo',
                      data:convertData(cityData),
                      cursor:'default',
                      symbolSize: 12,
                      label: {
                          normal: {
                              show: false
                          },
                          emphasis: {
                              show: false
                          }
                      },
                      itemStyle: {
                          emphasis: {
                              borderColor: '#fff',
                              borderWidth: 1
                          }
                      }
                  }
              ]
          },{
            notMerge:true,
          })
          _this.initRegionsPart(id,cityData,myChart);
        }else{
          myChart.setOption(option,{
            notMerge:true,
          });
          _this.initRegionsPart(id,data.regions,myChart);
        }
      });
      //regions排名
      _this.initRegionsPart(id,data.regions,myChart)
  },
  initRegionsCity: function(id,data,city){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var _this = this;
    city = JSON.parse(city);
    if (city.smallName=="HK") {
      // $("#"+id).css("width","600px")
      $("#"+id).css("width","100%");;
      $("#"+id).css("margin","0 auto");
      $("#"+id).css("padding","0");
    };
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
    myChart.showLoading();
    var rangeColor = ['#f2e1e1', '#ecd3d3', '#eab7b7', '#eca5a7', '#fa7373', '#ef4136'];
    var symbolSizeRange = [5,30];
    var min = 0,max = 0;
    for (var i = 0; i < data.regions.length; i++) {
      if (!data.regions[i].name) data.regions[i].name="null";
      var isOthers = data.regions[i].name=="未知" || data.regions[i].name=="Unknown" || data.regions[i].name=="Overseas";
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
    var nameMap = city.nameMap ? city.nameMap :{
      'Central and Western': '中西区',
      'Eastern': '东区',
      'Islands': '离岛',
      'Kowloon City': '九龙城',
      'Kwai Tsing': '葵青',
      'Kwun Tong': '观塘',
      'North': '北区',
      'Sai Kung': '西贡',
      'Sha Tin': '沙田',
      'Sham Shui Po': '深水埗',
      'Southern': '南区',
      'Tai Po': '大埔',
      'Tsuen Wan': '荃湾',
      'Tuen Mun': '屯门',
      'Wan Chai': '湾仔',
      'Wong Tai Sin': '黄大仙',
      'Yau Tsim Mong': '油尖旺',
      'Yuen Long': '元朗'
    };
    
    geoJson =HKjson;
    myChart.hideLoading();

    echarts.registerMap(city.smallName, geoJson);
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
          return "<p><b>Region: "+params.name+"</b></p><p>Audience: "+_this.formatNum(value,0)+"</p>";
        } 
      },
      grid : {
        left : '0',
        bottom : '0',
        top:'0',
        right:'0',
        containLabel : true
      },
      geo: {
          map: city.smallName,
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
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
              }
          },
          silent:true,
          nameMap:nameMap
      },
      series : [
         {
             type: 'scatter',
             coordinateSystem: 'geo',
             cursor:'default',
             data:[],
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
                     show: false
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
    }
    myChart.setOption(option);
      var isExists = false;
      for (var i = 0; i < _this.charts.length; i++) {
        if(_this.charts[i].id == id){
          _this.charts[i].chart = myChart;
          isExists = true;
        }
      };
      if (!isExists) {
        _this.charts.push({id:id,chart:myChart});
      };
      $("#"+id).parent().parent().find(".result-graph-word-content").empty();
      
      if (city.smallName=="HK") {
        var count = _this.formatNum(data.regions[0].value,0);
        $("#"+id).next().css("top","160px").css("left",0).css("right",0).html("Hong Kong<br><span style='color:#ef4136;font-size:20px;font-weight:bold;line-height:40px;'>"+count+"</span>");
        //添加中国地图
        $("#"+id+"_mini_china_title").remove();
        $("#"+id+"_mini_china_map").remove();
         $("#"+id).parents(".plan-result-text").append('<div id="'+id+'_mini_china_map" class="china-region" style="width:200px;height:150px;position:absolute;bottom:0px;right:0px;border:2px dotted #dfdfdf;border-right:none;border-bottom:none;"></div>');
         $("#"+id).parents(".plan-result-text").append("<div id='"+id+"_mini_china_title' style='position:absolute;bottom:35px;right:0px;width:200px;z-index:9999;'>Mainland China<br><span style='color:#ef4136;font-size:20px;font-weight:bold;line-height:40px;'>"+_this.formatNum(parseInt(data.regions[0].value)*19,0)+"</span></div>");
         echarts.dispose(document.getElementById(id+'_mini_china_map'));
         var miniChart = echarts.init(document.getElementById(id+'_mini_china_map'));
         option.geo.map='china';
         miniChart.setOption(option);
        return;
      };
      //省份城市选择tab
      var selectTab = '<label style="margin-bottom:10px;text-align:left;float:left;">'+
                        // '<a class="selected">Provicne</a>'+
                        '<b class="">Cities of '+city.name+'</li></b>'+
                      '</label><hr style="width:100%;display: inline-block;margin: 0px 0 10px 0;"/>';
      $("#"+id).parent().parent().find(".result-graph-word-content").append(selectTab);
      _this.initRegionsPart(id,data.regions)
  },
  initRegionsPart: function(id,regions,myChart){
    var _this = this;
    var _total = 0;
    $("#"+id).parent().parent().find(".result-graph-word-content").find(".xmo-line_per").remove();
    $("#paginate_"+id).remove();
    for (var i = 0; i < regions.length; i++) {
      _total +=parseFloat(regions[i].value);
    }
    regions = regions.sort(_this.sortJson("desc","value","parseInt"));
    var others = "",index=1,othersName="";
    var totalItem = regions.length;
    var pageItem = 10;
    for (var i = 0; i < regions.length; i++) {
      if (!regions[i].name) regions[i].name="null";
      var isOthers = regions[i].name=="未知" || regions[i].name=="Unknown" || regions[i].name=="Overseas";
      var per = (parseFloat(regions[i].value)/_total)*100;
      var display = "block";
      if(index > pageItem){
        display = "none";
      }
      var _html = '<div class="xmo-line_per" style="display:'+display+'">'+
                   '<span class="name">'+index+'.'+regions[i].name+'</span>'+
                    '<span class="result">'+per.toFixed(2)+'%</span>'+
                    '<span class="line_main">'+
                      // '<div class="tooltip-content">'+
                      // '  <p>Region: '+regions[i].name+'</p>'+
                      // ' <span>Audience: '+_this.formatNum(regions[i].value,0)+'</span>'+
                      // '</div>'+
                      '<div class="xmo-progress-line left">'+
                        '<div style="width: '+(per*2).toFixed(2)+'%;" class="bar"></div>'+
                      '</div>'+
                    '</span>'+
                  '</div>';
      //如果只有一个，不显示进度条百分比直接显示总数
      if (regions.length==1) { 
        _html = '<div class="xmo-line_per" style="display:'+display+'">'+
                   '<span class="name">'+index+'.'+regions[i].name+'</span>'+
                   '<span class="result">'+_this.formatNum(regions[i].value,0)+'</span>'+
                '</div>';
      };
      if(isOthers){
        others = _html;
        othersName = regions[i].name;
      }
      if(!isOthers){
        $("#"+id).parent().parent().find(".result-graph-word-content").append(_html);
        index++;
      }
    }
    if(others!="") $("#"+id).parent().parent().find(".result-graph-word-content").append(others);
    //如果只有一个，不显示进度条百分比直接显示总数
    if (regions.length==1) { 
      return;
    }
    //添加背景样式
    $("#"+id).parent().parent().find(".result-graph-word-content").removeClass("regions-line-map").addClass("regions-line-map")
    //关联地图
   
    $("#"+id).parent().parent().find(".result-graph-word-content").find(".xmo-line_per").on("mouseover",function(){
      var name = $(this).find(".name").text().split(".").pop();
      myChart.dispatchAction({type: 'hideTip', seriesIndex: '0'});
      myChart.dispatchAction({type: 'downplay', seriesIndex: '0'});
      myChart.dispatchAction({type: 'showTip', seriesIndex: '0', name: name});
      myChart.dispatchAction({type: 'highlight', seriesIndex: '0', name: name});
    })
    $("#"+id).parent().parent().find(".result-graph-word-content").find(".xmo-line_per").on("mouseout",function(){
      myChart.dispatchAction({type: 'hideTip', seriesIndex: '0'});
      myChart.dispatchAction({type: 'downplay', seriesIndex: '0'});
    })
    var disabledPrev = "disabled",
        disabledNext = totalItem>pageItem ? "" : "disabled";
    var _page = '<div style="display:flex;padding-left:80px;" id="paginate_'+id+'">'+
                '  <span class="paginate_button previous glyphicon glyphicon-menu-left '+disabledPrev+'"></span>'+
                '  <span class="paginate_button next glyphicon glyphicon-menu-right '+disabledNext+'"></span>'+
                '</div>';
    $("#"+id).parent().parent().find(".result-graph-word-content").append(_page);
    //绑定分页事件
    $("#"+id).parent().parent().find(".result-graph-word-content").off();
    $("#"+id).parent().parent().find(".result-graph-word-content").on("click",".paginate_button.previous",function(){
      if($(this).hasClass("disabled")) return;
      var end = $(this).parent().parent().find(".xmo-line_per:visible").first().index()-2;//前面有2个额外的dom
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
      var start = $(this).parent().parent().find(".xmo-line_per:visible").last().index()+1-2;//前面有2个额外的dom
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
    if(othersName!="") $("#"+id).parent().parent().find(".result-graph-word-content").find(".xmo-line_per:last").find(".name").text(lastindex+"."+othersName);
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
    var interestArr = [];
    for(var i in data.interest){
      interestArr.push(data.interest[i]);
    }
    var newData = interestArr.sort(this.sortJson("desc","value","parseFloat"));
    for (var i = 0; i < newData.length; i++) {
        counter++;
        var indicatorJson = {};
        indicatorJson.text = newData[i].name;
        indicatorJson.max = 50;
        indicator.push(indicatorJson);
        var topPointJson = {};
        topPointJson.name= newData[i].name;
        topPointJson.value = newData[i].value+"%";
        topPointArr.push(topPointJson);
        dataArr.push(newData[i].value);

        datas.push(newData[i].value);
        categories.push(newData[i].name);
        //初始化副标题
        if($("#"+id).parent().parent().find(".result-graph-word-content").length>0){
          var _li = "";
          for (var j = 0; j < newData[i].sub.length; j++) {
            _li += '<li title="'+newData[i].sub[j]+'" style="color:#999">'+(j+1)+'.'+newData[i].sub[j]+'</li>';
          };
          var _html = '<div class="result-graph-word-interest">'+
                            '<div class="result-graph-word-interest-inner">'+
                              '<label title="'+newData[i].name+'">'+newData[i].name+'</label>'+
                              '<ul>'+
                              _li+
                              '</ul>'+
                              '<div class="counter">'+counter+'</div>'+
                            '</div>'+
                          '</div>';
          $("#"+id).parent().parent().find(".result-graph-word-content").append(_html);
        }
        var _li = "";
        for (var j = 0; j < newData[i].sub.length; j++) {
          _li += '<span style="z-index:99999;display:block;margin-top:5px;float:left;overflow:hidden;text-overflow:ellipsis;width:150px;color:#999;" title="'+newData[i].sub[j]+'">'+(j+1)+'.'+newData[i].sub[j]+'</span>';
         };
        var _html = _li
        liCon[newData[i].name] = _html;
    }
    $("#"+id).empty();
    if($("#"+id).parent().parent().find(".result-graph-word-content").length>0){
      this.createSpiderByEchart(id,indicator,topPointArr,dataArr,liCon);
      // this.createSpiderByHighChart(id,datas,categories,liCon);
    }else{
      // this.createSpiderByHighChart(id,datas,categories,liCon);
    }
    this.bindEvent();
      
  },
  initInterestsMulti: function(id,data){
    if (!data) return;
    if (!document.getElementById(id)) return;
    var datas = [],datasEchart=[],categories = [],liCon = {},colorMap=[];
    $("#"+id).empty();
    var center = ['50%', '50%'];
    var index = 0;
    for(var k in data){
      if (data[k]) {
        var interestArr = [];
        for(var j in data[k].interest){
          interestArr.push(data[k].interest[j]);
          for (var i = 0; i < interestArr.length; i++) {
            if(parseFloat(interestArr[i].value)>50){
              center = ['50%', '60%'];
            }
          };
        }
      }
    }
    for(var k in data){
      if (data[k]) {
        var interestArr = [],indicator=[];
        var graphid = "graph_product_"+id+k;
        datas = [],categories = [],liCon = {};
        for(var j in data[k].interest){
          interestArr.push(data[k].interest[j]);
        }
        var newData = interestArr.sort(this.sortJson("desc","value","parseFloat"));
        var liHtml = '<label title="'+data[k].productName+'">'+data[k].productName+'</label><ul>';
        for (var i = 0; i < newData.length; i++) {
          var indicatorJson = {};
          indicatorJson.text = newData[i].name;
          indicatorJson.max = 50;
          indicator.push(indicatorJson);
          datas.push(newData[i].value);
          categories.push(newData[i].name);
          //初始化副标题
          liHtml += '<li title="'+newData[i].name+'">';
          liHtml += '  <span style="float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:150px;">'+(i+1)+'.'+newData[i].name+'</span>';
          liHtml += '  <span style="float:right">'+newData[i].value+'%</span></li>';
          var _li = "";
          for (var j = 0; j < newData[i].sub.length; j++) {
            _li += '<span style="z-index:99999;display:block;margin-top:5px;float:left;overflow:hidden;text-overflow:ellipsis;width:150px;color:#999;" title="'+newData[i].sub[j]+'">'+(j+1)+'.'+newData[i].sub[j]+'</span>';
           };
          var _html = _li
          liCon[newData[i].name] = _html;
        } 
        var conhtml = '<div class="interest-multi-container">'+
                    '  <div class="interest-multi-graph" id="'+graphid+'"></div>'+
                    '  <div class="interest-multi-content">'+liHtml+'</ul>'+
                    '  </div>'+
                    '</div>';  
        $("#"+id).append(conhtml);     
        this.createSmallSpiderByEchart(graphid,datas,categories,liCon,data[k].graphColor,indicator,center);
        index++;
      };
    }
     //调整距离
    var totalW = $("#"+id).width();
    var count = $("#"+id).find(".interest-multi-container").length;
    var marginLeft=  totalW/2 - $("#"+id).find(".interest-multi-container").width()/2*count;
    if (count<5) {
      $("#"+id).find(".interest-multi-container").first().css("margin-left",marginLeft+"px");
    };
  },
  createSpiderByEchart: function(id,indicator,topPointArr,datas,liCon){
    echarts.dispose(document.getElementById(id));
    var myChart = echarts.init(document.getElementById(id));
     //tooltip只能针对一整块图，所以新建5serires满足顶点tooltip
    //顺时针
    var start = datas[0];
    datas = datas.splice(1,datas.length-1).reverse();
    datas.splice(0,0,start);
    var start = topPointArr[0];
    topPointArr = topPointArr.splice(1,topPointArr.length-1).reverse();
    topPointArr.splice(0,0,start);

    var piontArr = [],pointData=[];
    for (var i = 0; i < 6; i++) {
      piontArr = [null, null, null, null, null, null];
      piontArr[i] = datas[i];  
      pointData.push({
          value: piontArr,
          name: topPointArr[i].name,
          symbol:'circle',
          symbolSize:10,
          tooltip:{
            trigger:"item",
            position: function (pos, params, dom, rect, size) {
                // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                if(pos[0]<240){
                  pos[0] = pos[0]-dom.clientWidth;
                }
                pos[1] += 10;
                return pos;
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
            formatter: function(params){
              // console.log(params)
              var header = '<span style="font-size: 12px;float:left;overflow:hidden;text-overflow:ellipsis;width:120px;margin-bottom:5px;">'+params.name+'</span><span style="float:right;">'+params.value[params.dataIndex]+'%</span>';
              var ul_li=  liCon[params.name];
              return '<div style="width:180px;overflow:hidden;zoom:1;">'+header+ul_li+'</div>';
            }
          },
          itemStyle:{
            normal:{
              color:"transparent"
            },
            emphasis: {
              color: "#ef4136",
              borderWidth:10
            }
          },
          lineStyle:{
              normal:{
                  opacity:0
              }
          }
      })
    };
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
          tooltip:{
            trigger:"item",
          },
          series: [
                {
                  name: 'interest-tool',
                  type: 'radar',
                  cursor:'default',
                  radarIndex: 0,
                  z:3,
                  symbol:'cricle',
                  data: pointData
                },
                {
                  name: 'interest',
                  type: 'radar',
                  cursor:'default',
                  radarIndex: 0,
                  symbol:'cricle',
                  z:2,
                  data: [
                    //数据1
                    {
                      value: [50, -1, -1, -1, -1,-1],
                      name: topPointArr[0].value,//顶点1的实际值
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
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
                      value: [50, -1, -1, -1, -1,-1],
                      name: topPointArr[0].name,//顶点1的label
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
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
                      value: [-1, 50, -1, -1, -1,-1],
                      name: topPointArr[1].value,
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
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
                      value: [-1, 50, -1, -1, -1,-1],
                      name: topPointArr[1]['name'],//顶点1的label
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
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
                      value: [-1, -1, 50, -1, -1,-1],
                      name: topPointArr[2]['value'],
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
                      label: {
                          normal: {
                              show: true,
                              offset:[-60,40],
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
                      value: [-1, -1, 50, -1, -1,-1],
                      name: topPointArr[2]['name'],//顶点1的label
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
                      label: {
                          normal: {
                              show: true,
                              offset:[-60,20],
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
                      value: [-1, -1, -1, 50,-1,-1],
                      name: topPointArr[3]['value'],
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
                      label: {
                          normal: {
                              show: true,
                              offset:[0,40],
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
                      value: [-1, -1, -1, 50, -1,-1],
                      name: topPointArr[3]['name'],//顶点1的label
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
                      label: {
                          normal: {
                              show: true,
                              offset:[0,20],
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
                      value: [-1, -1, -1, -1, 50,-1],
                      name: topPointArr[4]['value'],
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
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
                        value: [-1, -1, -1, -1, 50,-1],
                        name: topPointArr[4]['name'],//顶点1的label
                        symbol:"d",
                        symbolSize:0.01,
                        z:2,
                        tooltip:{
                          formatter:function(){
                            return ;
                          }
                        },
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
                    //数据6
                    {
                      value: [-1, -1, -1, -1, -1,50],
                      name: topPointArr[5]['value'],
                      symbol:"d",
                      symbolSize:0.01,
                      z:2,
                      tooltip:{
                        formatter:function(){
                          return ;
                        }
                      },
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
                        value: [-1, -1, -1, -1, -1,50],
                        name: topPointArr[5]['name'],//顶点1的label
                        symbol:"d",
                        symbolSize:0.01,
                        z:2,
                        tooltip:{
                          formatter:function(){
                            return ;
                          }
                        },
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
                        value: datas,
                        name: 'interest1',
                        z:2,
                        symbol:"cricle",
                        tooltip:{
                          formatter:function(){
                            return ;
                          }
                        },
                        areaStyle: {
                           normal: {
                               opacity: 0.5,
                               color: '#EF4136'
                           }
                        },
                        lineStyle: {
                           normal: {
                               opacity: 0,
                               color: '#EF4136'
                           }
                        },
                        itemStyle: {
                           normal: {
                               opacity: 1,
                               color: '#EF4136'
                           },
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
        var chart = new Highcharts.Chart({
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
                    stickyTracking:false,
                    marker:{
                      radius:2
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
                    return '<div style="width:200px;margin-left:-55px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;"><div class="graph-tiptool hide" data-position="top" style="margin-top:6px;margin-bottom: 7px;margin-right: -1px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div><span style="color:#ef4136;font-size:16px;">'+yValue+'%</span><br><span style="font-size:12px;">'+this.value+'</span></div>'
                  }else if (revert_2){
                    return '<div style="min-width:100px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;"><div class="graph-tiptool hide" data-position="top" ><div style="padding-bottom: 7px;padding-right: 20px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span></div><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div><span style="color:#ef4136;font-size:16px;margin-left:-20px;">'+yValue+'%</span><br><span style="font-size:12px;margin-left:-20px;">'+this.value+'</span></div>'
                  }else if (revert_3){
                    return '<div style="min-width:100px;margin-left:-10px;text-align:center;white-space: nowrap;display:inline-block;*display:inline;margin-top:20px;"><span style="font-size:12px;margin-left:-20px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:16px;margin-left:-20px;">'+yValue+'%</span><div class="graph-tiptool hide" data-position="top" ><div style="padding-bottom: 7px;padding-right: 20px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span></div><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div>'
                  }else if (revert_5) {
                    return '<div style="min-width:100px;text-align:center;margin-top:-30px;margin-left:-40px;display:inline-block;*display:inline;"><span style="font-size:12px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:16px;">'+yValue+'%</span><br/><div class="graph-tiptool hide" data-position="top" style="margin-top:5px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
                  }else if (middle) {
                    return '<div style="min-width:100px;text-align:center;margin-top:-30px;display:inline-block;*display:inline;"><span style="font-size:12px;">'+this.value+'</span><br><span style="color:#ef4136;font-size:16px;">'+yValue+'%</span><br/><div class="graph-tiptool hide" data-position="top" style="margin-top:5px"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
                  }else{
                    return '<div data-id="chart_0" style="width:586px;margin-left:-271px;text-align:center;margin-bottom:40px;white-space: nowrap;display:inline-block;*display:inline;"><span style="font-size:12px;margin-left: 10px">'+this.value+'</span><br><span style="color:#ef4136;font-size:16px;margin-left: 10px;">'+yValue+'%</span><br/><div class="graph-tiptool hide" data-position="top" style="margin-top:6px;margin-left: 10px;"><span class="graph-tip"><i class="fa-ellipsis-h fa"></i></span><div class="graph-tip-content"><label>'+this.value+'</label>'+ul_li+'</div></div></div>'
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
                shared: true,
                useHTML:true,
                stickyTracking:false,
                headerFormat:"",
                pointFormatter: function(){
                  var header = '<span style="font-size: 12px;float:left;overflow:hidden;text-overflow:ellipsis;width:120px;">'+this.category+'</span><span style="float:right;">'+this.y+'%</span>';
                  var ul_li=  liCon[this.category];
                  return '<div style="width:180px;overflow:hidden;zoom:1;background:#f2f2f2;padding:10px;border:1px solid #dfdfdf;">'+header+ul_li+'</div>';
                },
                backgroundColor:"rgba(255,255,255,0)",
                borderColor:"rgba(255,255,255,0)",
                borderRadius:0,
                shadow:false,
                padding:1
            },

            legend: {
                enabled:false
            },

            series: [{
                name: 'Allocated Budget',
                data: datas,
                cursor:'default',
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
  createSmallSpiderByHighChart: function(id,datas,categories,liCon,color){
    if(datas.length != 0 && categories.length != 0){
        new Highcharts.Chart({
            chart: {
                polar: true,
                type: 'area',
                height:180,
                reflow:true,
                renderTo:id
            },
            title: "",
            pane: {
                size: '100%'
            },
            plotOptions: {
                series: {
                    lineWidth: 0,
                    lineColor: color,
                    stickyTracking:false,
                    marker:{
                      radius:2
                    }
                }
            },
            xAxis: {
                categories: categories,
                labels:{
                useHTML:true,
                formatter:function(){
                  return "";

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
                shared: true,
                useHTML:true,
                stickyTracking:false,
                headerFormat:'<span style="font-size: 12px;float:left;overflow:hidden;text-overflow:ellipsis;width:100px;">{point.key}</span><span style="float:right;">{point.y}%</span>',
                pointFormatter: function(){
                  var ul_li=  liCon[this.category];
                  return ul_li;
                },
                backgroundColor:"#f2f2f2",
                borderColor:"#dfdfdf",
                borderRadius:0,
                shadow:false,
                padding:20,
            },

            legend: {
                enabled:false
            },

            series: [{
                name: 'Allocated Budget',
                data: datas,
                pointPlacement: 'false',
                color: color,
                fillOpacity:'0.6'
            }],
            credits :{
              enabled:false
            }
        },function(chart){
        
        });
    }
  },
  createSmallSpiderByEchart:function(id,datas,categories,liCon,color,indicator,center){
    if(datas.length != 0 && categories.length != 0){
      echarts.dispose(document.getElementById(id));
      var myChart = echarts.init(document.getElementById(id));
      //tooltip只能针对一整块图，所以新建5serires满足顶点tooltip
      //顺时针
      var start = datas[0];
      datas = datas.splice(1,datas.length-1).reverse();
      datas.splice(0,0,start);
      var start = categories[0];
      categories = categories.splice(1,categories.length-1).reverse();
      categories.splice(0,0,start);

      var piontArr = [],pointData=[];
      for (var i = 0; i < 6; i++) {
        piontArr = [null, null, null, null, null, null];
        piontArr[i] = datas[i];  
        pointData.push({
            value: piontArr,
            name: categories[i],
            symbol:'circle',
            symbolSize:10,
            tooltip:{
              trigger:"item",
              position: function (pos, params, dom, rect, size) {
                  // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                  if(pos[0]<115){
                    pos[0] = pos[0]-dom.clientWidth;
                  }
                  pos[1] += 10;
                  return pos;
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
              formatter: function(params){
                console.log(params)
                var header = '<span style="font-size: 12px;float:left;overflow:hidden;text-overflow:ellipsis;width:150px;margin-bottom:5px;">'+params.name+'</span><span style="float:right;">'+params.value[params.dataIndex]+'%</span>';
                var ul_li=  liCon[params.name];
                return '<div style="width:180px;overflow:hidden;zoom:1;">'+header+ul_li+'</div>';
              }
            },
            itemStyle:{
              normal:{
                color:"transparent"
              },
              emphasis: {
                color: color,
                borderWidth:10
              }
            },
            lineStyle:{
                normal:{
                    opacity:0
                }
            }
        })
      };
      var option = {
            radar: [

                {
                    indicator: indicator,
                    center: center,
                    radius: 80,
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
            tooltip:{
              trigger:"item"
            },
            series: [
                {
                  name: 'interest',
                  type: 'radar',
                  cursor:'default',
                  radarIndex: 0,
                  z:3,
                  symbol:'circle',
                  data: pointData
                },
                {
                      name: 'interest1',
                      type: 'radar',
                      cursor:'default',
                      radarIndex: 0,
                      symbol:'circle',
                      data: [
                        {
                            value: datas,
                            name: 'interest1',
                            z:2,
                            tooltip:{
                              formatter:function(){
                                return ;
                              }
                            },
                            areaStyle: {
                               normal: {
                                   opacity: 0.5,
                                   color: color
                               }
                            },
                            lineStyle: {
                               normal: {
                                   opacity: 0,
                                   color: color
                               }
                            },
                            itemStyle: {
                               normal: {
                                   opacity: 1,
                                   color: color
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
      _this.exportPdf(_this.pdfData,cloneConId,id);
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
        svgHtml && canvg(document.getElementById("result_canvas_21"),svgHtml);
      }
      if($("#"+id).find(".interest-map").length>0){
        $("#"+id).find(".interest-map").children().append('<canvas id="result_canvas_31"></canvas>');
        $("#"+id).append("<div id='test_canvas'></div>");
        $("#"+id).find("#test_canvas").append( $("#"+id).find(".interest-map").find("svg").clone());
        var svgHtml = $("#"+id).find("#test_canvas").html();
        $("#"+id).find("#test_canvas").remove();
        $("#"+id).find(".interest-map").find("svg").remove();
        if(svgHtml){
          canvg(document.getElementById("result_canvas_31"),svgHtml);
        }
      }
      if($("#"+id).find(".interest-multi-graph").length>0){
        $("#"+id).find(".interest-multi-graph").each(function(){
          var $graph = $(this).children();
          var graphid = $(this).attr("id");
          $graph.append('<canvas id="result_canvas_'+graphid+'"></canvas>');
          $("#"+id).append("<div id='test_canvas_"+graphid+"'></div>");
          $("#"+id).find("#test_canvas_"+graphid).append( $(this).find("svg").clone());
          var svgHtml = $("#"+id).find("#test_canvas_"+graphid).html();
          $("#"+id).find("#test_canvas_"+graphid).remove();
          $(this).find("svg").remove();
          svgHtml && canvg(document.getElementById("result_canvas_"+graphid),svgHtml);
        })
        
      }
      //背景色问题
      var $male = $("#"+id).find(".gender-male");
      var $pc = $("#"+id).find(".device-pc");
      var margin_gender = "40px auto 10px auto;";
      var margin_device = "40px auto 10px auto;";
      //特殊情况。。multi的时候
      if ($male.parent().hasClass("male_multi")) {
        margin_gender = "40px -100% 10px -60px";
      };
      if ($male.parent().hasClass("male_multi")) {
        margin_device = "40px -100% 10px -60px";
      };
      $male.find(".gender-map-ico").after('<img src="../images/icon_male_chart.png" style="margin:'+margin_gender+'">');
      $male.find(".gender-map-ico").remove();
      var $female = $("#"+id).find(".gender-female");
      $female.find(".gender-map-ico").after('<img src="../images/icon_female_chart.png" style="margin: 40px auto 10px auto;">');
      $female.find(".gender-map-ico").remove();

      $pc.find(".device-map-ico").after('<img src="../images/icon_pc.png" style="margin:'+margin_device+'">');
      $pc.find(".device-map-ico").remove();
      var $mobile = $("#"+id).find(".device-mobile");
      $mobile.find(".device-map-ico").after('<img src="../images/icon_mobile.png" style="margin: 40px auto 10px auto;">');
      $mobile.find(".device-map-ico").remove();

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
      $("#"+id).find("input:not(.date-range-input)").each(function(i){
        var name=$(this).attr("name");
        $(this).attr("value",$("#"+cloneConId).find("input:not(.date-range-input)").eq(i).val());
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
      $("#reports_pdf").find(".fa").remove();
      $("#reports_pdf").find(".plus-area").remove();
    };
    if (containerId == "for_export_product") {
      if ($("#"+containerId).find(".simulator-check-container").find(".selected").length>1) {
        //competitor brand
        $("#reports_pdf").find("#select_province_product_multi").parent().css("margin-top","200px");
        $("#reports_pdf").find("#select_province_product_multi").parent().prev().css("margin-top","200px");
        //my brand
        $("#reports_pdf").find("#select_province_multi").parent().css("margin-top","320px");
        $("#reports_pdf").find("#select_province_multi").parent().prev().css("margin-top","320px");
      };
    };
    if (containerId == "for_export_brand") {
      if ($("#"+containerId).find(".simulator-check-container").find(".selected").length>1) {
        //competitor product
        $("#reports_pdf").find("#select_province_multi").parent().css("margin-top","475px");
        $("#reports_pdf").find("#select_province_multi").parent().prev().css("margin-top","475px");

      };
    };
    // if(containerId=="for_export_share"){
      var width = parseInt($("#"+containerId).css("width"))+40;
      $("#reports_pdf").attr("style","width:"+width+"px;padding:0 20px;");
    // }
    $("#reports_pdf").find(".plan-reports").css("width","100%");

  },
  exportPdf: function(canvas,cloneConId,containerId){
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
    var isNegative = false;
    if($num<0){
      isNegative = true; 
      $num = 0-$num;
    }
    if ($num >= 1000000){
        $num = Math.round($num / 1000000 * 100) / 100;
        $num = this.formatNum($num) +' M';
    } else if($num >= 1000) {
        $num = Math.round($num / 1000 * 100) / 100 
        $num = this.formatNum($num)+ ' K';
    } else {
        $num = $num;
    }
    if(isNegative){
//      $num = "-"+$num;
    }
    return $num;
  },
  addPercent:function($num){
      return "("+this.getKWMformat($num)+"%)";
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
  sortJson: function(order, sortBy,fun){
    var ordAlpah = (order == 'asc') ? '>' : '<';
    var sortFun = new Function('a', 'b', 'return '+fun+'(a.' + sortBy + ')'+ordAlpah +fun+ '(b.' + sortBy + ')?1:-1');
    return sortFun;
  },
  substrByLength:function(str,maxLen){
    if (!str) return "";
    if (!Number(maxLen)) maxLen = 0;
    var strLen = this.getLength(str);
    var newStr = str;
    if (strLen > Number(maxLen)) {
      newStr = "";
      var len=0;
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i); 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
          len++; 
        } 
        else { 
         len+=2; 
        }
        if (len<=Number(maxLen)) {
          newStr += str[i];
        }; 
      };
      newStr +="...";
    };
    return newStr
  },
}
