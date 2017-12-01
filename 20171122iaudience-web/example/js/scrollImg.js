function scrollImg(options){
  var _this = this;
  _this.lang_opt = options['lang'] || 'EN';
  _this.index = 0;
  _this.timer = 0;
  _this.ulist = options['ulist'] || $('.scroll-imglist>ul');
  _this.blist = options['blist'] || $('.scroll-btnlist>ul');
  _this.link = options['link'] || $('.link');
  _this.autoInterval = options['autoInterval'] || 3000;
  _this.hoverbtn = options['hoverbtn'] || $('.scroll-imglist>ul li, .scroll-btnlist>ul li');
  if (_this.ulist.length>0) {
    _this.list = _this.ulist.find('li');
    _this.llength = _this.list.length;//li的个数，用来做边缘判断
    _this.lwidth = $(_this.list[0]).width();//每个li的长度，ul每次移动的距离
    _this.uwidth = _this.llength * _this.lwidth;//ul的总宽度
    _this.ulist.css("width",_this.uwidth);
  }
  _this.init();
}
scrollImg.prototype.init = function(){
  var _this = this;
  //生成按钮(可以隐藏)
  _this.addBtn(_this.list);
  //显示隐藏左右点击开关
  _this.link.css('display', 'block');
  _this.link.bind('click', function(event) {
    var elm = $(event.target);
    _this.doMove(elm.attr('id'));
    return false;
  });

  //初始化描述
  var text = _this.ulist.find('li').eq(0).find('img').attr('alt');
  var link = _this.ulist.find('li').eq(0).find('a').attr('href');
  // $('.scroll-intro .text a').text(text);
  // $('.scroll-intro .text a').attr('href',link);
  _this.auto();
}
scrollImg.prototype.doMove = function(direction){
  var _this = this;
  //向右按钮
  if (direction =="toRight") {
    _this.index++;
    if ( _this.index< _this.llength) {
      _this.uwidth = _this.lwidth *_this.index;
      // _this.ulist.css('left',-_this.uwidth);
      _this.ulist.animate({left: -_this.uwidth}, 1000);

    }else{
      // _this.ulist.css('left','0px');
      _this.ulist.animate({left: 0}, 1000);
      _this.index = 0;
    };
  //向左按钮
  }else if(direction =="toLeft"){
    _this.index--;
    if ( _this.index < 0) {
      _this.index = _this.llength - 1;
    }
    _this.uwidth = _this.lwidth *_this.index;
    // _this.ulist.css('left',-_this.uwidth);
    _this.ulist.animate({left: -_this.uwidth}, 1000);
  //点击数字跳转
  }else{
    _this.index = direction;
    _this.uwidth = _this.lwidth *_this.index;
    // _this.ulist.css('left',-_this.uwidth);
    _this.ulist.animate({left: -_this.uwidth}, 1000);
  };
  _this.changeBtn(_this.index);
}
scrollImg.prototype.auto = function(){
  var _this = this;
  //定时器
  _this.timer = setInterval(function(){
    _this.doMove('toRight')
  },_this.autoInterval);

  _this.hoverbtn.hover(function() {
    clearInterval(_this.timer);
  }, function() {
    _this.timer = setInterval(function(){
      _this.doMove('toRight')
    },_this.autoInterval);
  });
}

scrollImg.prototype.changeBtn = function(i){
  var _this = this;
  _this.blist.find('li').eq(i).addClass('on').siblings().removeClass('on');
  var text = _this.ulist.find('li').eq(i).find('img').attr('alt');
  var link = _this.ulist.find('li').eq(i).find('a').attr('href');
  // $('.scroll-intro .text a').text(text);
  // $('.scroll-intro .text a').attr('href',link);
}

scrollImg.prototype.addBtn = function(list){
  var _this = this;
  for (var i = 0; i < _this.list.length; i++) {
    var imgsrc = $(_this.list[i]).find('img').attr('src');
    var listCon = '<li><img src="'+imgsrc+'""></li>';
    $(listCon).appendTo(_this.blist);
    //隐藏button中的数字
    //_this.list.css('text-indent', '10000px');
  };
  _this.blist.find('li').first().addClass('on');
  _this.blist.find('li').click(function(event) {
    var _index = $(this).index();
    _this.doMove(_index);
  });
}
