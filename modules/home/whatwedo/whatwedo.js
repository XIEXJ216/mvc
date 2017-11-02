define(function(require, exports, module) {
  // 引入样式
  require('./whatwedo.css')
  // 添加控制器
  MVC.addController("home.whatwedo",function(M,V,$,A,O){
    // 监听dataReady事件
    O.on("dataReady",function(){
      var dom = V.create("home.whatwedo");
      document.querySelector("#home .container").appendChild(dom);
    })
  })
  // 添加创建视图方法
  .addView("home.whatwedo",function(M,F){
    // 第一步 创建元素
    var dom = document.createElement("div");
    dom.id = "what";
    // 第二步 获取数据
    var data = M.get("home.whatwedo");
    console.log(data)
    // 第三步 定义模板
    var tpl = [
      '<h3 class="top"><%title%></h3>',
      '<div class="top clear">',
        '<p class="left"><%content%></p>',
        '<ul><%li_list%></ul>',
      '</div>',
      '<ul class="bottom clear"><%abc_list%></ul>'
    ].join(""); 
    // 第四步 定义html文案字符串
    var html = "";
    // 第五步 定义小模板和小模板字符串
    var sub_tpl="<li><%content%></li>",sub_html="",
    abc_tpl='<li><img src="<%img%>" alt="" /><h4><%title%></h4><p><%content%></p></li>',abc_html = '';
    // 第六步 格式化小模板
    for(var i =0;i<data.list.length;i++){
      sub_html += F(sub_tpl,{content:data.list[i]});
    }
    for(var i =0;i<data.intro.length;i++){
      abc_html += F(abc_tpl,data.intro[i]);
    }
    var dir = {
      title:data.title,
      content:data.content,
      li_list:sub_html,
      abc_list:abc_html
    }
    html = F(tpl,dir);
    dom.innerHTML = html;
    return dom;
  })
})