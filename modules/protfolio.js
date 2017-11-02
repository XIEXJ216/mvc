define(function(require, exports, module) {
	// 需要背景模块
	require('background/background')
	// 需要header模块
	require('header/header')
	// 页面模块
	require('portfolio/portfolio1')	
	// 引入post
	require('post/post')

	// 暴露接口
	module.exports = function() {
		// 启动应用程序
		MVC.install();
	}
})