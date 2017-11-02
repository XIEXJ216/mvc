define(function(require, exports, module) {
	require('./portfolio.css')
	MVC.addView("portfolio",function(M,F){
		// 第一步创建dom元素
		var dom = document.createElement("div");
		dom.id= "portfolio";
		var tpl  = [
		'<div class="container">',
		 '<div id="content">',
			'<h3><%title%></h3>',
			'<p><%content%></p>',
			'<div><span>FILTER:</span><%filter%></div>',
			'<ul id="waterfall"style="position:relative;" >',
			 	
			'</ul>',
			'</div>',
		'</div>'
		].join("");
		var data = M.get("portfolio");
	  var filter_tpl = '<span class="<%active%>"><%name%></span>';	
	  var filter_html = '';
	  for(var i in data.filter) {
	  
	  	filter_html+=F(filter_tpl,{name:i,active: i==="All" ? "active":""});
	  }
	  var obj = {
	  	title:data.title,
	  	content:data.content,
	  	filter:filter_html
	  }
	  var html = F(tpl,obj);
	  dom.innerHTML = html;
	  return dom
	})
	.addController("portfolio",function(M,V,$,A,O){
		// 启动控制器的时候要先请求数据 然后渲染模板
		$("/data/portfolio.json","get","",function(data){
			  M.add("portfolio",data);
				var dom = V.create("portfolio");
				document.body.appendChild(dom);
				// 要得到所有的图片
				var all = data.filter.All;
				var categoryI = data.filter.CategoryI;
				var categoryII = data.filter.CategoryII;
				var video = data.filter.Video;
				// 定义数组 用于记录每一个列的高度
				var arr = [0,0,0,0,0];
				// 定义数组 里面的每一个元素是展示哪些图片的判断条件
				var panduanArr = [all,categoryI,categoryII,video];
			   
				// 定义一个函数从一个数组中获取最小的数字的下标
		  	var min = function(arr){
		  		var a = arr[0];
		  		var idx= 0;
		  		for(var i=1;i<arr.length;i++){
		  			if(a>arr[i]){
		  				a=arr[i];
		  				idx = i;
		  			}
		  		}
		  		return idx;
		  	}
		  	var max = function(arr){
		  		var a = arr[0];
		  		var idx = 0;
		  		for(var i =1;i<arr.length;i++){
		  			if(a<arr[i]){
		  				a=arr[i];
		  				idx=i;
		  			}
		  		}
		  		return idx;
		  	}
		  	var lis = "";
		  	// 获取瀑布流的元素
		  	var waterfall = document.querySelector("#waterfall");
		  	var h = 0;
				for(var i =0;i<all.length;i++){
					var img = new Image();
					img.src= "style/images/art/"+all[i]+".jpg";
					img.onload = function(){
						var idx = min(arr);//当前的idx就是数组中的最小的数字的下标 也就是该li的定位值的left值

						var li = document.createElement("li");
						li.appendChild(this);
						li.setAttribute("data-height",this.height); 
						li.style="position:absolute;top:"+arr[idx]+"px;left:"+idx*20+"%;"
						arr[idx] += this.height;
						waterfall.appendChild(li);
						waterfall.style.height = arr[max(arr)]+"px";
						lis =[].slice.call(waterfall.querySelectorAll("li"),0);
					}
				} 
				var spans = [].slice.call(document.querySelectorAll("#content span"),1);
	      for(var xuhao =0;xuhao<panduanArr.length;xuhao++){
	      	(function(xuhao){
	      		spans[xuhao].onclick = function(){
						// 把所有的图片都显示  
						if(!lis){
							alert("图片未加载完毕 请等候");
						}
						// 定义一个数组 用于过滤所有元素
						var saveArr = [];
						for(var i =0;i<lis.length;i++){
							var src = lis[i].querySelector("img").src;
							var name = src.slice(src.lastIndexOf("/")+1,src.lastIndexOf("."));
							for(var j =0;j<panduanArr[xuhao].length;j++){
								if(panduanArr[xuhao][j]===name){
									saveArr.push(lis[i]);
								} 
							}
						}
						var newArr = lis.slice(0);
	 					for(var i =0;i<newArr.length;i++){
	 						for(var j=0;j<saveArr.length;j++){
	 							if(newArr[i]===saveArr[j]){
	 								newArr.splice(i,1);
	 							}
	 						}
	 					}
	 					for(var i =0;i<newArr.length;i++){
	 						newArr[i].style.opacity=0;
	 					}
	 					console.log(newArr)
						// 定义一个数组用于放每一个列的高度。
						var arr = [0,0,0,0,0]; 
						// 循环将每一个li插入到
			      for(var i =0;i<saveArr.length;i++){
			      	var height = +saveArr[i].getAttribute("data-height");
			      	saveArr[i].style.opacity=1;
			      	saveArr[i].style.top = arr[min(arr)]+"px";
			      	saveArr[i].style.left = min(arr) * 20 +"%";
			      	arr[min(arr)]+= height;
			      } 
					} 
	      	})(xuhao)
	      }
				 
		})
	})
})