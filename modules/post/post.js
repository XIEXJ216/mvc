define(function(require, exports, module) {
	require('./post.css')
	MVC.addView("post",function(M,F){
		// 第一步 创建dom元素
		var dom = document.createElement("div");
		dom.id = "post";
		var tpl = ['<div class="container"><ul class="clear">',
		'<li class="latestPost"><%latest_html%></li>',
		'<li class="flickr"><%flickr%></li>',
		'<li class="about"><%about%></li>',
		'<li class="getInTouch"><%getintouch%></li>',
		'</ul></div>'].join("");
		var data = M.get("post");
		var date_data = data["Latest Post"].data
		// 第一部分
		var latest_tpl ="<h3><%title%></h3><ul><%date_list%></ul>",latest_html = "";
		// 第一部分的date_list
		var date_list = "",date_tpl = '<li class="clear"><span class="left"><%title%></span><span class="content"><%content%></span></li>';
		for(var i =0;i<date_data.length;i++){
	    date_list+=F(date_tpl,date_data[i]);
		}
		latest_html = F(latest_tpl,{title:data["Latest Post"].title,date_list:date_list});
		// 第二部分的flickr
		var flickr_tpl ="<h3><%title%></h3><ul><%img_list%></ul>",flickr_html ="";
		var img_tpl = '<li><img src="<%src%>" alt="" /></li>',img_html = '';
		var img_data = data["Flickr"];
		for(var i =0;i<img_data.images.length;i++){
			img_html+=F(img_tpl,{src:img_data.images[i]});
		}
		flickr_html = F(flickr_tpl,{title:img_data.title,img_list:img_html});
	  // 第三部分
	  var about_tpl = "<h3>About</h3><p class='p1'><%part1%></p><p class='p2'><%part2%></p>";
	  var about_html = F(about_tpl,data.About);
	  // 第四部分
	  var getInTouch_html = ['<h3>Get In Touch</h3>',
	  '<form>',
	     '<div class="line1">',
	        '<input type="text"/><label>&nbsp;Name*</label>',
	      '</div>',
	     '<div class="line1">',
	        '<input type="email"/><label>&nbsp;Email*</label>',
	      '</div>',
	      '<div class="line1">',
	        '<textarea name="" id="" cols="30" rows="8"></textarea>',
	      '</div>',
	      '<div class="line1">',
	        '<input type="submit" value="submit"/>',
	      '</div>',
	  '</form>'].join("");
	  var html = F(tpl,{latest_html:latest_html,flickr:flickr_html,about:about_html,getintouch:getInTouch_html});
	  dom.innerHTML = html;
	  return dom;
	})
	.addController("post",function(M,V,$){
		$("data/list.json","get","",function(data){
			if(!data.errno){
			  M.add("post",data.data);
			  var dom = V.create("post");
			  document.body.appendChild(dom)
			}
		})
	})
})