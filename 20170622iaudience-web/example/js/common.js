
$(function(){
       //对Date的扩展，将 Date 转化为指定格式的String   
      //月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
      //年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
      //例子：   
      //(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
      //(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
      Date.prototype.Format = function(fmt)   
      { //author: meizz   
       var o = {   
         "M+" : this.getMonth()+1,                 //月份   
         "d+" : this.getDate(),                    //日   
         "h+" : this.getHours(),                   //小时   
         "m+" : this.getMinutes(),                 //分   
         "s+" : this.getSeconds(),                 //秒   
         "q+" : Math.floor((this.getMonth()+3)/3), //季度   
         "S"  : this.getMilliseconds()             //毫秒   
       };   
       if(/(y+)/.test(fmt))   
         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
       for(var k in o)   
         if(new RegExp("("+ k +")").test(fmt))   
       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
       return fmt;   
      }  
      $(".x-show-control").click(function(){
        var menu_display="show";
        if($("body.x-hide").length>0){
          $("body").removeClass("x-hide");
        }else{
          $("body").addClass("x-hide");
          menu_display="hide";
        }
        if (window.localStorage) {
            localStorage.setItem("menu-display", menu_display);
        } else {
            Cookie.write("menu-display", menu_display);
        }
      })
      $(".x-show-control").click(function(){
        var menu_display="show";
        if($("body.x-hide").length>0){
          $("body").removeClass("x-hide");
        }else{
          $("body").addClass("x-hide");
          menu_display="hide";
        }
        if (window.localStorage) {
            localStorage.setItem("menu-display", menu_display);
        } else {
            Cookie.write("menu-display", menu_display);
        }
      })
      //提示框
      $('[data-toggle="tooltip"]').tooltip();

      $('.x-user-con').on('click',':not(a)',function(event){
        var event = event || window.event;
        if($(this)[0].tagName!="I"){
          var $userlist = $(this).parents(".x-user-main").find(".x-user-list");
          if($userlist.css("visibility")=="hidden"){
            $userlist.css({"visibility":"visible","opacity":"1"});
          }else{
            $userlist.css({"visibility":"hidden","opacity":"0"});
          }
        }
         event.stopPropagation();
      });

      $(".x-user-main").hover(function(){
        $('body').unbind('mousedown');
        },function(){
        $('body').bind('mousedown', function(){
            $(".x-user-main").find(".x-user-list").css("visibility","hidden");
            $(".x-user-main").find(".x-user-list").css("opacity","0");

          });
      });
      //下拉框按钮
      $(document).on("click","[class=dropdown-menu] li:not(.divider)",function(){
          $(".dropdown-toggle",$(this).parent().parent()).html($(this).children().text()+"<span class='caret arrow-down'></span>");
          $(this).parent().find(".active").removeClass("active");
          $(this).addClass("active");
          var value= $(this).attr("value");
          if(typeof(value)!="object"){
          }else{
            value=value.context.value;
          }
          var data_value=$(this).attr("data-value");
          if(typeof(data_value)!="undefined"){
            value=data_value;
          }
          $(this).parent().parent().find("input").first().attr("value",value);
          $(this).parent().parent().find("input").first().attr("title",($(this).children().text()));
          $(this).parent().parent().find("input").first().change();
          $(this).parent().parent().removeClass("open");
      });


    //顶部菜单搜索功能
   $("input",".x-top-search-search").keyup(function(event){
        var this_val= $.trim($(this).val());
        var liHtml;
        if(this_val!=""){
          $(".x-top-recent").hide();
          $(".x-top-result").addClass("x-top-result-show");
          $(".x-top-result").find("ul").hide();
          if($("#x-top-show-result").length>0) $("#x-top-show-result").remove();
          $(".x-top-result").append("<ul id='x-top-show-result'></ul>");
            var objArr = [];
           var reg = new RegExp(this_val,"gi");
           var searchResult=$(".x-top-result").find("li").map(function(){

              return {"obj":$(this).find("a"),"text":$(this).find("span:first").text(),"tag":$(this).find("span:last").text()};
            }).get();

          var $ul = $("#x-top-show-result");
           for (var i = 0; i < searchResult.length; i++) {
              if(reg.test(searchResult[i]["text"]) || reg.test(searchResult[i]["tag"])){
                  //向上的对应父元素也要显示
                  // search_doUpShow(searchResult[i]["obj"],true);
                  // if(!findIt(objArr,searchResult[i]["obj"])){
                    liHtml = searchResult[i]["obj"].prop('outerHTML');
                    $ul.append("<li>"+liHtml+"</li>");
                    objArr.push(liHtml);
                  // }

              }
              reg.lastIndex=0;
            };
            if($ul.find("li").length==0){
              $ul.append('<li><a href="javascript:;"><span>No accounts found</span></a></li>');
            }
        }else{
          $(".x-top-recent").show();
          $(".x-top-result").removeClass("x-top-result-show");
          if($("#x-top-show-result").length>0) $("#x-top-show-result").remove();
          $(".x-top-result").find("ul").show();
        }

    })
    function findIt(arr,obj){
      if(arr.length>0){
        for (var i=0;i<arr.length;i++){
           if(arr[i]===obj.prop('outerHTML')){
            //  console.log(obj.prop('outerHTML'),arr[i]);
             return true;
           }
         }
      }
      return false;
    }
    function search_doUpShow(node,isFirst){
      node.show();
      node.parent().show();
      if (node.prev().length>0) {
        node.prev().attr("class","fa fa-caret-down");
        node.next().show();
        if (isFirst) {
          node.next().find("li").show();
          node.next().find("a").show();
        }
      }
      if (node.parent().parent().hasClass("x-top-tree-child")) {
        node.parent().parent().show();
        search_doUpShow(node.parent().parent().prev(),false);
      }else{
        node.parent().parent().prev().show();
      }
    }

    function nextnode(node){//寻找下一个兄弟并剔除空的文本节点
      if(!node)return ;
      if(node.nodeType == 1)
        return node;
      if(node.nextSibling)
        return nextnode(node.nextSibling);
    }
    function prevnode(node){//寻找上一个兄弟并剔除空的文本节点
      if(!node)return ;
      if(node.nodeType == 1)
        return node;
      if(node.previousSibling)
        return prevnode(node.previousSibling);
    }
    //顶部搜索多级菜单点击事件
  $(".x-top-result").on('click',function(e){//绑定input点击事件，使用root根元素代理
    e = e||window.event;
    var target = e.target||e.srcElement;
    var tp = nextnode(target.parentNode.nextSibling);
    switch(target.nodeName){
      case 'I'://点击A标签展开和收缩树形目录

        if(tp&&tp.nodeName == 'UL'){
          if(tp.style.display != 'block' ){
            tp.style.display = 'block';
            target.className = 'fa fa-caret-down' ;
          }else{
            tp.style.display = 'none';
            target.className = 'fa fa-caret-right' ;
          }

        }
        break;
      case 'SPAN'://点击图标只展开或者收缩

        break;
    }
  });
  //调整顶部搜索框位置
  $('.x-top-search-list').hover( function(){
    //   // $('body').css('overflow', 'hidden');
    //   $('.x-top-search-list').css('overflow-y', 'auto');
    //   var scrollTop = $(window).scrollTop();
    //   var scrollLeft = $(window).scrollLeft();
    //   var top = 62-scrollTop;
    //   var left = 0 - scrollLeft;
    //   console.log(top);
    //   if(top<0) top=0;
    //   console.log(top);
    //   $(".x-top-search").attr("style","top:"+top+"px;");
    //   $(".x-top-recent").css("margin-top","45px");
    // }, function(){
    //   // $('body').css('overflow', 'auto');
    //   $('.x-top-search-list').css('overflow-y', 'hidden');
    //   $(".x-top-search").attr("style","position:relative;top:0px;");
    //   $(".x-top-recent").css("margin-top","0");
  })
  // search position adjust
  var leftTrue = 0;
  $(".x-top-content").scroll(function(){
    if($(".x-top-search").length>0){
      var _this = this;
      var scrollTop = $(window).scrollTop();
      var scrollLeft = $(window).scrollLeft();
      var headTop = $(".myheading").css("height");
      var clienTop = $(this).scrollTop();
      var left = $(".x-top-search").offset().left;
      var top = 62-scrollTop;
      if(top<0) top=0;
      if(leftTrue==0){
          leftTrue = left;
      }
      if(clienTop<=130){
        $(".x-top-search").css({"position":"absolute","top":"0px","left":"0"});
      }else if(top==0 ){
        $(".x-top-search").css({"position":"fixed","top":"0","left":leftTrue-scrollLeft+"px"});
      }else{
        $(".x-top-search").css({"position":"fixed","top":top,"left":leftTrue-scrollLeft+"px"});
      }
    }
  });

  $(window).scroll(function(){
    var scrollTop = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    var top = 62-scrollTop;
    if(top<0) top=0;
    if(!$(".x-top-search-list").is(":hidden") && $(".x-top-search").length>0){
        var left = $(".x-top-search").offset().left;
        // console.log(left,scrollLeft,leftTrue);
        if(leftTrue==0){
            leftTrue = left;
        }
        
        if(top==0 ){
          $(".x-top-search").css({"position":"fixed","top":"0","left":leftTrue-scrollLeft+"px"});
        }else{
          $(".x-top-search").css({"position":"absolute","top":0,"left":0});
        }
    }
    //更改消息框位置
    if(top==0 ){
      $("#notifications").css({"position":"fixed","top":"0"});
    }else{
      $("#notifications").css({"position":"absolute","top":0});
    }

    //左侧栏根据滚动高度变更position
    changeSidebarPos(top);
  });
  $(window).resize(function() {
    var scrollTop = $(window).scrollTop();
    var scrollLeft = $(window).scrollLeft();
    var top = 62-scrollTop;
    if(top<0) top=0;
    //左侧栏根据滚动高度变更position
    changeSidebarPos(top);
  });
  function changeSidebarPos(top){
    if($(window).width()>1280){
      top = 62;
    }
    if(top==0){
      $(".x-sidebar").css("cssText","position:fixed!important;top:"+top+"!important");
      $(".x-menu-lang-select").css("cssText","position:fixed!important;width:185px!important");
      $(".x-menu-lang").css("cssText","position:fixed!important;width:185px!important");
    }else{
      $(".x-sidebar").css("cssText","");
      $(".x-menu-lang-select").css("cssText","");
      $(".x-menu-lang").css("cssText","");
    }
  }
  //左侧栏相应js
  $(".x-menu>li>a").on("click",function(){
        if($(this).parent().find("ul")){
           if(!$(this).parent().hasClass("selected")){
             $(this).parent().parent().find("ul").slideUp();
             $(this).parent().parent().find(".selected").removeClass("selected");
             $(this).parent().parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-right");
             $(this).parent().find(".fa-caret-right").removeClass("fa-caret-right").addClass("fa-caret-down");
           }else{
             $(this).parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-right");
           }
          $(this).parent().find("ul").slideToggle();
          $(this).parent().toggleClass("selected");
        }
    });
    $(".sub-menu>li>a").on("click",function(){
        !$(this).parent().hasClass("active") && $(".x-menu").find(".active").removeClass("active");
         $(this).parent().toggleClass("active");
    });
    //选择语言版本
    $(".x-menu-lang>li").on("click",function(){
      $(".x-menu-lang-select").toggle();
    })
    $('body').on('click',function(e) {
        if (!$('.dropdown-stop').is(e.target)
            && $('.dropdown-stop').has(e.target).length === 0
            && $('.dropdown-stop.open').has(e.target).length === 0) {
          $('.dropdown-stop').removeClass('open');
        }
      });
    $(document).on('click', '.dropdown-stop .dropdown-toggle',function(event) {
      $(this).parent().addClass('open');
    });
    // function resizeFooter(){
    //   if($(".x-main").height()<$(".x-sidebar").height()){
    //    $("body").css("height","100%");
    //   }else{
    //    $("body").css("height","auto");
    //     var dHeight = $(document).height()-61;
    //     if(dHeight>600){
    //       $(".x-main").css("min-height",dHeight+"px");
    //       $(".x-sidebar").css("min-height",dHeight+"px");
    //     }
    //   }
    // }
    //  $(window).resize(function() {
    //    resizeFooter();
    //  });
    //  setTimeout(resizeFooter,300);


});
