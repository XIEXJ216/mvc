define(function(require, exports, module) {
	// 依赖样式
	require('background/background.css')
	MVC.addModel("bg",{
		data:["style/images/art/bg1.jpg","style/images/art/bg2.jpg","style/images/art/bg3.jpg","style/images/art/bg4.jpg","style/images/art/bg5.jpg","style/images/art/bg6.jpg"],
		idx:(function(){
			return parseInt(Math.random()*6);
		})()
	}) 
	.addView("bg",function(model,format){
		// 第一步获取元素
		var div = document.createElement("div");
		div.id = "bg";
		// 第二步 获取数据
		var data = model.get("bg");
		// 定义html字符串
		var html = "";
		// 第三步 定义模板
		var tpl = '<ul><%list%></ul>';
		// 第四步 定义小模板
		var li_tpl = '<li class="<%idx%>" style="background:url(<%src%>) no-repeat;background-size:cover"></li>';
		// 第五步 格式化小模板
		var li_str = "";
		for(var i=0;i<data.data.length;i++){
			var obj ={src:data.data[i]};
			obj.idx = (data.idx === i) ?  "active": ""; 
			

			li_str+= format(li_tpl,obj)
		}
		// 第六步 格式化大模板
		html = format(tpl,{list:li_str});
		div.innerHTML = html;
		return div; 
	})
	.addController("bg",function(m,v,$,animate){
		var dom = v.create("bg");
		document.body.appendChild(dom)
		var lis = dom.getElementsByTagName("li");
		var idx = m.get("bg.idx"); 
		setInterval(function(){
			idx++;
			if(idx>=lis.length){
				idx = 0;
			}
			for(var i =0;i<lis.length;i++){
				lis[i].className = "";
			}
			lis[idx].className = "active";
		},2000)
	})

})