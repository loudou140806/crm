define('manage/commodity/index',function(require, exports, module){
	require('./mods/tableTpl.js');
	var Ajax = require('lib/ajax');
	var pageIndex = 0;
	var page = {
		init: function(){
			page.bindEvent();
			page.initTable();
			page.initLayPage();
		},
		initTable: function(){
			console.log('test');
			Ajax.get({
				url: 'admin/commodity/lists',
				data:{
					page: pageIndex,
					limit: 10,
					// name: '',
					// description: '',
					// price: '',
					// release_time: ''
				},
				success: function( res ){
					if(!res.errNum){
						console.log('test');
						$(juicer.templates['table.juicer']({
							rs: res.retData
						})).appendTo($('.table'));
					}
				}
			});
		},
		//分页
		initLayPage: function(){
			$.getJSON('test/demo1.json', {curr: 6}, function(res){ //从第6页开始请求。返回的json格式可以任意定义
				laypage({
					cont: 'page1', //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：&lt;div id="page1">&lt;/div>
			        pages: res.pages, //通过后台拿到的总页数
			        curr: 6, //初始化当前页
			        jump: function(e){ //触发分页后的回调
			            $.getJSON('test/demo1.json', {curr: e.curr}, function(res){
			                e.pages = e.last = res.pages; //重新获取总页数，一般不用写
			                //渲染
			                var view = document.getElementById('view1'); //你也可以直接使用jquery
			                var demoContent = (new Date().getTime()/Math.random()/1000)|0; //此处仅仅是为了演示
			                view.innerHTML = res.content + demoContent; 
			            });
			        }
			    });
			});
		},
		bindEvent:function(){
			$(document).on('focus', '.J_focusEvent', function(e){
				var tag = $(e.currentTarget);
				console.log(tag.data('event'));
				page[tag.data('event')] && page[tag.data('event')](tag);
			});
			$(document).on('click', '.J_clickEvent', function(e){
				var tag = $(e.currentTarget);
				page[tag.data('event')] && page[tag.data('event')](tag);
			});
		},
		upDownEvent:function( tag ){
			if( tag.html() === '收起筛选' ){
				$('form').slideUp();
				tag.html('展开筛选');
			}else{
				$('form').slideDown();
				tag.html('收起筛选');
			}
		},
		focusEvent:function( tag ){
			console.log(tag.attr('id'));
			laydate({
                elem: '#' + tag.attr('id')
            });
		},
		//删除用户
		deleteEvent: function( tag ){
			
		}
	};
	page.init();
});