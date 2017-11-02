define(function(require, exports, module) {
	require('./latestworks.css')
	MVC.addView("home.latestworks",function(M,F){
		/*创建视图的具体步骤*/
		// 第一步 创建元素
		var dom = document.createElement("div");
		dom.id = "works";
		// 第二步 得到数据
		var data = M.get("home.latestworks");
	  // 第三步 定义模板
	  var tpl = [
	     '<div class="top clear">',
	       '<h3><%title%></h3>',
	       '<div class="btns clear"><div class="leftBtn">&lt;</div><div class="rightBtn">&gt;</div></div>',
	     '</div>',
	     '<div class="bottom "><ul class="clear"><%li_list%></ul></div>'
	  ].join("");
	  // 第四步 定义小模板
	  var li_tpl = '<li><img src="<%src%>" alt="" /><span><a ></a></span></li>';
	  // 第五步 定义html变量 
	  var html="",li_html ="";
	  // 第六步 格式化小模板
	  for(var i=0;i<data.list.length;i++){
	  	li_html += F(li_tpl,{src:"style/images/art/"+data.list[i]});
	  }
	  // 定义字典
	  var obj = {
	  	title:data.title,
	  	li_list:li_html
	  };
	  // 格式化 大模板
	  html = F(tpl,obj);
	  dom.innerHTML = html;
	  return dom;
	})
	.addController("home.latestworks",function(M,V,$,A,O){
		 O.on("dataReady",function(){
		 	 // 调用V.create方法去创建视图
		 	 var dom = V.create("home.latestworks");
		 	 document.querySelector("#home .container").appendChild(dom);
		 	 // 添加交互
		 	 var leftBtn = dom.querySelector(".btns .leftBtn");
		 	 var rightBtn = dom.querySelector(".btns .rightBtn");
		 	 var ul = dom.querySelector(".bottom ul");
		 	 // 先得到整个界面的宽度
		 	 var width = dom.clientWidth / 5;
		 	 var idx = 0;
		 	 var lock = true;
		 	 rightBtn.onclick = leftBtn.onclick = function(){
			 	 	if(!lock){
			 	 		return;
			 	 	}
			 	 	lock = false;
			 	 	 idx--;
			 	 	 if(idx<0){
			 	 	 	idx=1;
			 	 	 }
			 	 	 A(ul,{left:-idx * width},1000,function(){
			 	 	 	lock =true;
			 	 	 });
		 	 }
		 	 setInterval(function(){
		 	 	 rightBtn.onclick();
		 	 },1500);
		 })
	})
})