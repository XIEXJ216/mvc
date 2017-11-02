define(function(require, exports, module) {
  require('header/header.css')
  // 因为header的数据是请求回来的 所以我们无法事先添加模型。
  MVC.addView("header",function(m,format){
    // 第一步：获取元素
    var dom = document.querySelector("#header .container");
    // 第二步：获取数据
    var data = m.get("header");
    // 第三步：定义模板
    var html= ""; 
    var tpl = ['<div class="top clear"><h1><img src="<%logo%>" alt="" /></h1><ul class="nav clear"><%icon_list%></ul></div>',
                  '<nav class="bottom">',
                   '<ul class="clear">',
                    '<%nav_list%>',
                   '</ul>',
                  '</nav>'].join("");
    var icon_tpl = '<li><a href="<%href%>"><img src="<%img%>" alt="" /></a></li>';
    var icon_list = "";
    for(var i =0;i<data.icon.length;i++){
      icon_list += format(icon_tpl,data.icon[i]);
    }
    // 定义与html模板匹配的源
    var obj = {};
    obj.logo = "style/images/logo.png";
    obj.icon_list = icon_list;
    // 每一个nav的导航li模板
    var nav_tpl = '<li><a href="<%href%>"><%title%></a><ul><%ul_list%></ul></li>';
    // nav_list是所有的li的集合
    var nav_list = "";
    var li_tpl = '<li><a href="<%href%>"><%title%></a></li>';
    var li_str = "";
    for(var i =0;i<data.nav.length;i++){
      li_str = "";
      if(data.nav[i].list){
        // 循环每一个有list的li 形成li下面的子模板
        for(var j =0;j<data.nav[i].list.length;j++){
          li_str+= format(li_tpl,data.nav[i].list[j]);
        } 
      } 
        data.nav[i].ul_list = li_str;
       nav_list += format(nav_tpl,data.nav[i]);
    } 
    obj.nav_list = nav_list;
    html = format(tpl,obj);
    dom.innerHTML = html;
    return dom;
  })
  .addController("header",function(m,v,$,animate){
     // 在控制器中 去请求数据并填入模型中
     $("data/header.json","get","",function(data){
      // 将数据填入模型
      m.add("header",data);
      // 因为已经有数据了，所以可以创建视图了
      var dom = v.create("header");
      // 获取要添加事件的lis
      var lis = dom.querySelectorAll("nav>ul>li");
      // 定义锁数据
      var lock = [];
      // 循环给每一个lis成员添加事件
      for(var i = 0;i<lis.length;i++){
        // 根据成员数添加对应个锁
        lock.push(true);
        // 因为lock是数组 所以我们在函数中获取对应锁的时候要使用i变量 添加属性防止闭包。
        lis[i].idx = i;
        // 设置鼠标移入事件
        lis[i].onmouseenter = function(){
          // 函数节流
          if(!lock[this.idx]){
            return;
          }
          // 过河拆桥
          lock[this.idx] = false;
          // 让自己的子元素ulslideDown
          var ul = this.querySelector("ul");
          ul.style.display = "block"; 
          if(!lis[this.idx].height){
           lis[this.idx].height = ul.clientHeight;
          }
          var height = lis[this.idx].height;
          ul.style.height = 0+"px";
          var me = this;
          animate(ul,{height:height},1000,function(){
            lock[me.idx] = true;
          })
        }
        // 添加鼠标移出事件
        lis[i].onmouseleave = function(){
          var ul = this.querySelector("ul");
          clearInterval(ul.timer)
          lock[this.idx] = true; 
          this.querySelector("ul").style.display = "none";
        }
      }
     })
  })  
})