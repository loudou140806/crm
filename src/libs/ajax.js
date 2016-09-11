define('lib/ajax',function(require, exports, module){
	var Util = require('lib/util');
	var host = location.host;
	var base = 'http://';
	base += 'api.tiaozaoj.com/';
	function merge(dest, src){
		var tmp = dest;
		for( var i in src ){
			tmp[i] = src[i];
		}
		return dest;
	}
	function common(obj,config){
		var self = this;
		obj = merge(config, obj);
		self._success = obj.success;
		self._error = obj.error;
		self._complete = obj.complete;

		if(obj['url'].indexOf('http://') != 0){
			obj['url'] = base + obj['url'];
		}

		if( !obj.data )
			obj.data = {};

		if( obj.type == 'POST' && obj.contentType == 'application/json')
			obj.data = JSON.stringify(obj.data);
		obj.success = function(res, status, xhr){
			if( obj.loading && Util.loading.exist() )
				Util.loading.hide();
			if( res && res.responseCode && res.responseCode == 10212 && !obj.noLogin ){
				var path = location.pathname,prefix = '';
				if( path.indexOf('sdw/') != -1 )
          			prefix = '/sdw';
				var redirect = location.href;
				location.href = prefix + '/user/login.html?page=new-app-page&redirect=' + encodeURIComponent(redirect);
				return;
			}
			self._success && self._success(res, status, xhr);
		}
		obj.error = function(xhr, errorType, error){

			Util.alert('系统异常','error');
			
			if( obj.loading && Util.loading.exist() )
				Util.loading.hide();
			
			self._error && self._error(xhr, errorType, error);

		}
		if( obj.loading && !Util.loading.exist() )
			Util.loading.show();
		$.ajax(obj);
	}
	var ajax = {
		post: function(obj){
			return new common(obj,{
				type: 'POST',
				contentType: 'application/json',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				timeout: 15000
			});
		},
		get: function(obj){
			return new common(obj,{
				type: 'GET',
				dataType: 'json',
				xhrFields: {
					withCredentials: false
				},
				timeout: 15000
			});
		},
		jsonp : function(obj){
			return new common(obj,{
				type: 'GET',
				dataType: 'jsonp',
				xhrFields: {
					withCredentials: true
				},
				timeout: 15000
			});
		},
		form : function(obj){
			return new common(obj,{
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				timeout: 15000
			});
		}
	}
	module.exports = ajax;
});