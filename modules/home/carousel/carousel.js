define(function(require, exports, module) {
  require('./carousel.css')
  // home的第一个子模块
  MVC.addView("home.carousel",function(m,format){
     // 第一步创建元素
     var dom = document.createElement("div");
     dom.id = "carousel";
     // 第二步 定义模板
     var tpl = [
        '<ul class="images clear">',
          '<%li_list%>',
        '</ul>',
        '<ul id="cirs" class="clear"><li class="first">&lt;</li>',
          '<%cir_list%>',
        '<li class="last">&gt;</li></ul>',
        '<p><%title%></p>'
     ].join("");
     // 第三步 得到数据
     var data = m.get("home.carousel");
     // 第四步 小模板定义
     var li_tpl = '<li><img src="<%src%>" alt="" /><p class="intro"><%intro%></p></li>';
     var cir_tpl = '<li></li>';
     // 第五步 定义小模板字符串
     var li_list = "";
     var cir_list = "";
     // 第六步 格式化小模板
     for(var i = 0;i<data.list.length;i++){
      li_list += format(li_tpl,data.list[i]);
      cir_list += cir_tpl;
     }
     // 组织一个对象格式化整个模板
     // var obj = {};
     // obj.li_list = li_list;
     // obj.cir_list = cir_list;
     // obj.title = data.title;
     var html =  format(tpl,{
      li_list:li_list,
      cir_list:cir_list,
      title:data.title
     });
     dom.innerHTML = html;
     return dom;
  })
  .addController("home.carousel",function(model,view,$,animate,OB){
        // 解决跨模块通信的方式：观察者模式
        OB.on("dataReady",function(){
          //当dataReady事件触发的时候，就执行创建视图这个行为 
        var dom =  view.create("home.carousel"); 
          document.querySelector("#home>.container").appendChild(dom);
          // 定义信号量
          var idx = 0;
          var carousel = dom.querySelector("ul");
          var cirs = [].slice.call(dom.querySelectorAll("#cirs li"),0);
          var leftBtn = cirs.shift();
          var rightBtn = cirs.pop();
          var width = dom.clientWidth;
          var lock = true;
          var img = dom.querySelector(".images li").cloneNode(true);
          carousel.appendChild(img);
          leftBtn.onclick = function(){
            if(!lock){
              return;
            }
            lock = false;
            idx --;
            if(idx<0){
              idx = cirs.length;
              carousel.style.left = -idx * width + "px";
              idx--;
            }
            animate(carousel,{"left":-idx*width},1000,function(){
              lock = true;
            })
          }
          rightBtn.onclick = function(){
            if(!lock){
              return;
            }
            lock = false;
            idx++;
            animate(carousel,{"left":-idx*width},1000,function(){
              lock = true; 
             if(idx>=cirs.length){ 
              idx=0;
              carousel.style.left =0+ "px"; 
             }
            })
          }
          for(var i =0;i<cirs.length;i++){
           cirs[i].index = i ;
           cirs[i].onclick  = function(){
              if(!lock){
                 return;
              }
              lock = false;
              idx = this.index;
              animate(carousel,{"left":-this.index*width},1000,function(){
                 lock = true;
              })
           }
          }
        }) 
  })
})