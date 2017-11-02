define(function (require, exports, module) {
	// 引入background模块
	require('background/background')
	// 使用header模块
	require('header/header')
	// 引入home模块
	require('home/home')
	// 引入post
	require('post/post')

	// 定义启动的方法
	module.exports = function () {
		// 启动应用程序
		MVC.install()
	}
})