define('home/index', function(require, expotrs, moudle) {
	// console.log(require.resolve('lib/ajax'));
	// console.log(moudle.uri);
	// var Ajax = require('lib/ajax');

	var page = {
		init:function(){
			page.getData();
		},
		getData: function(){
			$.ajax({
				url: 'http://api.tiaozaoj.com/admin/index/allCount',
				dataType: 'json',
				success: function( rs ){
					if ( !rs.errNum ){
						page.fillData(rs.retData);
					}
				}
			})
		},
		fillData: function( data ){
			for( key in data ){
				$('.' + key).find('span').html(data[key]);
			}
		}
	};
	page.init();
})