define(function(require, exports, module) {
	// 引入样式，以及子模块
	require('./home.css')
	require('./carousel/carousel')
	require('./whatwedo/whatwedo')
	require('./latestworks/latestworks')
	// 请求数据
	// 这个模块只是负责请求数据 并搭建骨架 数据请求回来之后由子模块负责搭建视图
	MVC.addController("home",function(model,view,$,animate,OB){
		// 发送ajax请求数据
		$("/data/home.json","get","",function(data){
			 model.add("home",data.data);
			 // 这里一定已经将数据填充到Model里了
			 OB.emit("dataReady")
		});
	});
})