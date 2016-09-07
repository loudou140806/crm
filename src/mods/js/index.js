$(function(){

	var sideBar = $('aside');
	$('.skin-minimal input').iCheck({
		checkboxClass: 'icheckbox-blue',
		radioClass: 'iradio-blue',
		increaseArea: '20%'
	});
	$("#demoform").Validform({
		tiptype:2
	});

	//左侧折叠菜单
	$.Huifold(".menu_dropdown dt", ".menu_dropdown", "fast", 3, "click");//可设置类型，1.只打开一个，可以全部关闭2.必须有一个打开3.可打开多个

	//响应式菜单
	$('.nav-toggle').click(function(){
		sideBar.css('display') === 'none' ? sideBar.css('display', 'block') : sideBar.css('display', 'none');
	})

})
