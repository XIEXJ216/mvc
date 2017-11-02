var MVC = (function(){
	// 观察者模式 第一版本  dom0级事件绑定方式 只能够添加一个事件函数
	// var Observer = (function(){
	//   	var observer = { 
	// 	  };
	// 	  return {
	//       on :function(name,fn){
	//       	observer[name] = fn;
	//       	console.log("添加了一个"+name+"事件");
	//       	console.log(observer)
	//       },
	//       emit:function(name,data){
	//       	if(observer[name]){
	//       		observer[name](data)
	//       	}
	//       }
	// 	  }
	// 	})(); 
  // 观察者模式 第二版本 dom2级事件绑定方式 可以添加多个函数 
	var Observer = (function(){
	  // 保护内部变量
	  var _observer = { 
	  }	
	  // 返回接口
	  return {
	     // 接口定义的发布消息的方法 每当发布一个新的name 就会将_observer中开辟一个新的属性 属性值是数组 数组中的每一项是存的方法。
	  	// 每当发布一个已经存在的name就会往已经存在的数组中添加进去
	     on:function(name,fn){
	          // 判断是否已经是数组
	     	if(_observer[name] instanceof Array){
	     		_observer[name].push(fn);
	     		return;
	     	}
	          // 如果不是数组则初始化为数组
	     	_observer[name] = [fn];
	  	},
	     // 接口定义的订阅消息的方法 订阅的必须是已经发布的消息。 因为已经发布了所以一定是数组。那么数组中的每一项是函数。就循环数组并让数组中的函数执行。执行的时候就可以传递参数了。
	  	emit:function(name,data){
	  	  if(_observer[name]){
	  	  	for(var i =0;i<_observer[name].length;i++){
	  	  		_observer[name][i](data);
	  	  	}
	  	  }
	  	}
	  } 
	})();
 
	// 动画框架
	function animate(dom,json,time,callback){
		// 获得当前的位置
		// 定义一个json用来装现在的属性状态
		var now_json = {};
		// 定义一个改变的json
		var change_json ={}
		for(var i in json){
			// 循环获取当前元素的要更改的属性的现在状态
			now_json[i] = parseInt(getComputedStyle(dom)[i])
			// 循环获取目标与当前之间的差值
			change_json[i] =json[i]-now_json[i];
		} 
	  // 定义频率
	  var frame = 20;
	  // 总次数
	  var all_count = time/frame;
	  // 定义计数器
	  var count = 0;
	  // 开始定时器的执行
	  dom.timer = setInterval(function(){
	  	// 计数器累加
	  	count ++;
	  	// 循环改变一次dom元素的状态
	  	for(var i in json){
	  		if(i.toLowerCase() === "opacity"){
	  			dom.style[i] = change_json[i]/all_count * count + now_json[i]
	  		}else{
	  			dom.style[i] = change_json[i]/all_count * count + now_json[i] +"px";
	  		}
	  	}
	  	// 累加器如果执行次数大于等于总次数 则停止定时器的执行
	  	if(count>=all_count){
	  		// 停表
	  		clearInterval(dom.timer);
	  		// 强制拉到终点 因为计算的偏差原因 可能很接近目标值但是不一定会是目标值
	  		for(var i in json){
	  			if(i.toLowerCase() === "opacity"){
		  			dom.style[i] = json[i];
		  		}else{
		  			dom.style[i] = json[i]+"px";
		  		} 
	  		} 
	  		// 短路语法 如果传递了回调函数，则执行 否则不执行
	    	callback && callback.call(dom);
	  	}
	  },frame)
	}
	// 发送ajax的轮子
	function sendAjax(url,method,data,callback){
    // 第一步 初始化xhr对象
    var xhr = new XMLHttpRequest();
    // 第二步 定义事件
    xhr.onreadystatechange = function(){
        // 判断 如果是最后一次执行
        if(xhr.readyState === 4){
            callback(JSON.parse(xhr.responseText));
        }
    }
    if(method.toLowerCase()==="get"){
        // 第三步 填参数 
        xhr.open(method,url+"?"+data,true); 
        // 第四步 发送
        xhr.send(); 
    }else if(method.toLowerCase()==="post"){
        xhr.open(method,url,true);
        // 先设置一下请求头 
        xhr.setRequestHeader("content-type","application/x-www-form-urlencoded"); 
        // 第四步 如果是post请求 一定要将数据放在send中作为参数传递
        xhr.send(data);
    } 
  }
 	// 存储数据
	var M = (function(){
		// _M就是一个存值器
		var _M = { 
		}
		// 返回的是一个接口 接口提供两个方法 一个是存储数据 一个是获取数据
		return {
			add:function(path,value){
				// 解析path
				var arr = path.split(".");
				var result = _M ;
				for(var i =0;i<arr.length-1;i++){
					if(result[arr[i]] === undefined){
						result[arr[i]] = {};
					}else if(typeof result[arr[i]] === "object" && result[arr[i]] != null){
						// 真的是引用类型 
					}else{
						// 是非undefined的值类型
						throw new Error("不能往值类型身上添加数据");
					}
					// 指向下一层
					result=result[arr[i]];
				}
				if(result[arr[i]]){
					throw new Error("该属性已经存在");
				}
				result[arr[i]] = value;
			},
			get:function(path){
				// 解析path
				var arr = path.split(".");
				var result = _M;
				for(var i =0;i<arr.length-1;i++){
					if(result[arr[i]] === undefined){
						return  "";
					}else if(typeof result[arr[i]] === "object" && result[arr[i]] != null){
						// 真的是引用类型 能够从它身上得到数据

					}else{
						return "";
					}
					// 指向下一层
					result=result[arr[i]];
				}
				return result[arr[i]];
			} 
		}	
	})()
	// 存储视图
	var V = (function(){
		// 存储视图的真正对象
		var _V = { 
		}
		return {
			// 向_V中添加内容
			add:function(name,view){
				if(_V[name]){
					throw new Error("不能覆盖视图")
				}
				_V[name] = view;
			},
			create:function(name){
				if(_V[name]){
					// 在函数执行的时候 将M作为参数传递进去 那么我们就可以在该函数中使用M对象的方法
					return _V[name](M,format);
				}
			}
		}
	})()
	// 存储控制器
	var C = (function(){
		var _C = {
			
		}
		return {
			// 添加控制器方法
			add:function(name,controller){
				if(_C[name]){
					throw new Error("不能覆盖控制器")
				}
				_C[name] = controller;
			},
			install:function(){
				for(var i in _C){
					_C[i](M,V,sendAjax,animate,Observer);
				}
			}
		}
	})()
	// 解析多级嵌套关系的模板
	var format = function(tpl,dir){
		// 第一步 定义正则表达式
		var regexp = /<%((\w+\.){0,}\w+)%>/g;
		return tpl.replace(regexp,function(match,$1){
			var pathArr = $1.split("."); 
			var result = dir;
			for(var i =0;i<pathArr.length-1;i++){
				if(typeof result[pathArr[i]] ==="object" && result[pathArr[i]] != null){
					result = result[pathArr[i]];
				}else{
					return "";
				}
			} 
			return  result[pathArr[i]];
		})
	}
	/*
	测试format函数的代码
	var obj = {
		a:{
			b:{
				c:123
			}
		}
	}
	var tpl = "<div><%a.b.c%></div>";
	var result = format(tpl,obj);
	console.log(result)*/
	return {
		addModel:function(path,value){
			M.add(path,value);
			return this;
		},
		addView:function(name,view){
			V.add(name,view);
			return this;
		},
		addController:function(name,controller){
			C.add(name,controller);
			return this;
		},
		install:function(){
			C.install();
		}
	}
 })() 