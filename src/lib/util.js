define('lib/util', function ( require, exports, module ) {
  
  var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	var util = {
		getUrlParam: function(key){
			var obj = {}, arr = location.search.substr(1).split("&");
			for (i in arr) {
				var n = arr[i].indexOf("=");
				-1 != n && (obj[arr[i].substr(0, n)] = decodeURIComponent(arr[i].substr(n + 1, arr[i].length)));
			}
			return obj[key];
		},
    portPrefix: function(){
      var base = 'http://',host = location.host;
      if ( /gray/.test(host) ) {
        base += 'gray.';
      }else if( /daily|dev/.test(host) ) {
        base += 'daily.';
      }else{
        base += '';
      }
      base += 'manage.51xianqu.com/';
      return base;
    },
    getLionPrefix: function(){
      var host = location.host;
      if ( /gray/.test(host) ) {
        return 'http://gray.m.52shangou.com/';
      }else if( /daily|dev/.test(host) ) {
        return 'http://gray.m.52shangou.com/';
      }
      return 'http://h5.m.52shangou.com/';
    },
    /*
    * 编码HTML特殊字符，防止存储型XSS
    */ 
    htmlspecialchars: function(str){
      var map = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '&': '&amp;'
      };
      return str.replace(/[><&"']/g,function(item){
        return map[item];
      });
    },
    /*
    *   CSS加前缀函数
    */
    _prefixStyle: function(style){
      var _elementStyle = document.createElement('div').style;
      var _vendor = (function () {
        var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
          transform,
          i = 0,
          l = vendors.length;

        for ( ; i < l; i++ ) {
          transform = vendors[i] + 'ransform';
          if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
        }

        return false;
      })();
      if ( _vendor === false ) return false;
      if ( _vendor === '' ) return style;
      return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
    },
		alert: function(str,type,time,callback){
      var self = this;
      var dft = ' com-alert-'+(type||'ok');
      time = time || 1200;
			var TPL = [
				'<div class="com-alert-wrap'+dft+'" id="J_alert">',
					'<div class="com-alert">'+str+'</div>',
				'</div>'
			].join('');
			$(TPL).appendTo('body');
      $('#J_alert .com-alert')[0].style[self._prefixStyle('animationDuration')] = time + 'ms';
			setTimeout(function(){
				$('#J_alert').remove();
        callback && callback();
			},time);
		},
    confirm: function(text, btnText, callback){
      var TPL = [
        '<div class="confirm-wrap confirm-in" id="J_confirm">',
          '<div class="confirm-main">',
            '<div class="confirm-inner">',
              text,
            '</div>',
            '<div class="confirm-btns">',
              '<a href="javascript:;" class="confirm-ok btn-ok">'+(btnText?btnText:'确定')+'</a>',
            '</div>',
            '<a href="javascript:;" class="confirm-close"></a>',
          '</div>',
          '<div class="confirm-bg"></div>',
        '</div>'
      ].join('');
      $(TPL).appendTo('body');
      var pObj = $('#J_confirm');
      pObj.on('click','.confirm-bg,.confirm-close',function(){
        pObj.addClass('confirm-out');
        setTimeout(function(){
          pObj.remove();
        },400);
      }).on('click','.confirm-ok',function(){
        if( callback ){
          callback();
          pObj.addClass('confirm-out');
          setTimeout(function(){
            pObj.remove();
          },400);
        }
      });
    },
		loading: {
			show: function(){
				$([
          '<div id="J_spinner" class="spinner-loading">\
            <div class="spinner-item"></div>\
            <div class="spinner-item"></div>\
            <div class="spinner-item"></div>\
            <div class="spinner-item"></div>\
            <div class="spinner-item"></div>\
            <div class="spinner-item"></div>\
            <div class="spinner-item"></div>\
            <div class="spinner-item"></div>\
          </div>'
				].join('')).appendTo('body');
			},
			hide: function(){
				$('#J_spinner').remove();
			},
			exist: function(){
				if( $('#J_spinner').length > 0 )
					return true;
				return false;
			}
		},
		getCookie: function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if( arr=document.cookie.match(reg) ){
				return arr[2];
			}
		},
    getPrefix: function(){
      var path = location.pathname,prefix = '';
      if( path.indexOf('/sdw/') != -1 )
        prefix = '/sdw';
      return prefix;
    },
		login: {
			isLogin: function(){
				var _uk = util.getCookie('_uk'),
					_cs = util.getCookie('_cs');
				if( _uk && _cs )
					return true;
				return false;
			},
			goLogin: function(){
        var prefix = util.getPrefix();
        window.refreshPage = function(){
          location.reload();
        }

        location.href = prefix + '/user/login.html?page=new-app-page&needBack=false&redirect=' + encodeURIComponent(location.href);
			}
		},
    /**
     *  Mobile格式化函数
     *  替换形如18500165858为185-0016-5858
     */
    formatMobile: function(mobile,separator){
      var reg = /^(\d{3})(\d{4})(\d{4})$/;

      mobile += '';
      separator = separator || '-';

      if( !reg.test(mobile) )
        return mobile;
      return mobile.replace(reg,'$1'+separator+'$2'+separator+'$3');
    },
    /*
    * 根据时间戳返回当天开始时间戳和结束时间戳
    */
    getDayStartAndEnd: function(timestamp){
      var self = this,
          SPAN = 3600 * 24 * 1000,
          start,
          ymd = self.formatDate('YYYY-MM-DD',timestamp,'/');
      start = +new Date(ymd + ' 00:00:00');
      return {
        startTime: start,
        endTime: start + SPAN
      }
    },
		/**
		 * 格式化时间
		 * 传入时间戳则获取时间戳时间,默认为now
		 * 分隔符separator
		 */
    formatDate: function ( type, stamp, separator ) {
      var
        ret     = '',
        d       = stamp ? new Date(stamp) : new Date(),
        year    = d.getFullYear(),
        month   = d.getMonth() + 1 < 10 ? '0'+ (d.getMonth() + 1) : d.getMonth() + 1,
        day     = d.getDate() < 10 ? '0'+ d.getDate() : d.getDate(),
        hours   = d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
        minutes = d.getMinutes() < 10 ? '0' +  d.getMinutes() : d.getMinutes(),
        seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds(),
        tmpSeparator = separator;

      separator || (separator = '-');

      switch ( type ) {
      case 'Ch-zh':
        ret = year +'年'+ month +'月'+ day +'日';
        break;
      case 'Ch-zh-MM-DD':
        ret = month +'月'+ day +'日';
        break;
      case 'YYYY-MM-DD HH:mm:ss':
        ret = year + separator + month + separator + day +
                ' '+ hours +':'+ minutes +':'+ seconds;
        break;
      case 'YYYY-MM-DD':
        ret = year + separator + month +separator+ day;
        break;
      case 'MM-DD':
        ret = month + separator + day;
        break;
      case 'HH:mm':
        ret = hours + (tmpSeparator?tmpSeparator:':') + minutes;
        break;
      default:
        ret = d;
      }

      return ret;
    },
    /*
    *   大数据千分位格式化
    *   input   123456789
    *   output  123,456,789
    */
    formatSeg: function(str){
      str += '';
      return str.replace(/(\d)(?=(\d{3})+\b)/g,'$1,');
    },
    /**
     * 格式化价格
     * n为小数点位数,默认2位
     * currency,货币单位
     * negSymbol,自定义负号样式,有时候需要空一格,默认-
     */
    formatPrice: function ( num, n, currency, negSymbol ) {
      var
        negative = false,
        numArr,
        l,
        r,
        ret;

      if ( !num ) {
        num = 0;
      }
      n = n >= 0 && n <= 20 ? n : 2;
      if ( num < 0 ) {
        negative = true;
        num = Math.abs(num);
      }
      num = parseFloat(num/100).toFixed(n);
      numArr = num.split('.');
      l      = (numArr[0] || 0).toString();
      r      = (numArr[1] || '').toString();
      ret    = '';

      while ( l.length > 3 ) {
        ret = ','+ l.slice(-3) + ret;
        l = l.slice(0, l.length - 3);
      }
      if ( l ) {
        ret = l + ret;
      }
      if ( r ) {
        ret += '.'+ r;
      }

      if ( currency ) {
        ret = currency + ret;
      }
      if ( negative ) {
        negSymbol || (negSymbol = '-');
        ret = negSymbol + ret;
      }

      return ret;
    },
    /**
     * 格式化银行卡
     * 样式为中间4位隐藏
     */
    formatCardNum: function ( num ) {
      num = num.toString();
      var
        l   = num.slice(0, 4),
        r   = num.slice(num.length-4, num.length),
        ret = '';

      ret = l +'****'+ r;

      return ret;
    },
    /**
     * 组装url
     * url=原始url
     * query,对象,query参数
     * noWebview, 默认添加webView参数,noWebview=true,取消
     */
    buildQuery: function ( url, query, noWebview ) {
      var
        ret = '',
        key;

      if ( !noWebview ) {
        ret += '&page=new-app-page';
      }
      for ( key in query ) {
        if ( query.hasOwnProperty(key) ) {
          ret += '&'+ key +'='+ encodeURIComponent(query[key]);
        }
      }

      if ( noWebview && !Object.keys(query) ) {
        ret = url;
      }
      else {
        ret = url +'?'+ ret.slice(1);
      }

      return ret;
    },
    /**
     * eg : substitute('my name is {name},age is {age}',{name:'bofang',age:18})
     *      return my name is bofang,age is 18
     **/
    substitute:function(tpl,data){
      return tpl
                .replace(/{(.*?)}/igm,function($,$1) {
                    return data[$1]?data[$1]:'';
                });
    },
    shopBigPic:function(src){
      var tpl = '<div class="bigpic-mask animated fadeIn">' +
                  '<div class="bigpic-bg"></div>'+
                  '<img class="bigpic-img" src="{src}" alt="" />' +
                '</div>';
      var elTpl = $(this.substitute(tpl, {
        src: src
      }));
      elTpl.appendTo('body').find('.bigpic-bg').on('tap', function() {
        elTpl.removeClass('fadeIn').addClass('fadeOut');
        elTpl.one(animationEnd,function(){
          elTpl.remove();
        });
      });
    },
    /*
     * 设置输入域(input/textarea)光标最右
     */
    setInputRight: function ( arr ) {
      var val;

      arr.forEach(function ( item ) {
        val = item.val();
        item.val('');
        item.val(val);
      });
    },
    /**
     * 获取当前页面环境
     */
    getEnv: function (nowww) {
      var
        host = location.host,
        ret = (nowww?'':'www');

      if ( /daily|dev/.test(host) ) {
        ret = 'daily';
      }
      else if ( /gray/.test(host) ) {
        ret = 'gray';
      }

      return ret;
    },

    /**
     * 获取对象的key
     */
    getObjKey: function ( obj, val ) {
      var key;

      for ( key in obj ) {
        if ( obj.hasOwnProperty(key) && obj[key] === val ) {
          return key;
        }
      }
      return false;
    }
	};

	module.exports = util;

});
