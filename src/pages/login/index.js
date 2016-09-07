function openUrl(url) {
        window.location = url;
    }

    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        } (),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    function trim(str){ //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    /**
     2          * json对象转字符串形式
     3         */
    function json2str(o) {
        var arr = [];
        var fmt = function(s) {
            if (typeof s == 'object' && s != null) return json2str(s);
            return /^(string|number)$/.test(typeof s) ? "\"" + s + "\"" : s;
        }
        for (var i in o) arr.push("\"" + i + "\":" + fmt(o[i]));
        return '{' + arr.join(',') + '}';
    }

    function bridge(action,params) {
        setTimeout(function(){
                    },20);

    }

    function save(key,value) {
        value = ""+value;
        var params = {};
        params[key] = value;
        bridge("save",params);
    }

    function get(key,callback) {
        var params = {"key":key,"callback":callback};
        bridge("get",params);
    }

    function needDisplayReload(callback) {
        var params = {"callback":callback};
        bridge("displayReload",params);
    }

    function doubleClickBack(){
        var params = {};
        bridge("doubleback",params);
    }

    function goBackSelf(callback){
        var params = {"callback":callback};
        bridge("goBackSelf",params);
    }

    storgeUtils = {
        setParam : function (name,value) {
            localStorage.setItem(name,value);
            save(name,value);
        },
        getParam : function(name){
            var value = localStorage.getItem(name);
            return value;
        },
        getParamWithNative : function(name,callback){
            var value = localStorage.getItem(name);
            if (value == null) {
                get(name,callback);
            }
            return value;
        },
        delParam : function(name){
            localStorage.removeItem(name);
        }
    };

    function sendPost(url,data,sequence,callback) {
        var params = {"url":url,"data":data,"sequence":sequence,"callback":callback};
        bridge("sendPost",params);
    }

    function sendGet(url,data,sequence,callback) {
        var params = {"url":url,"data":data,"sequence":sequence,"callback":callback};
        bridge("sendGet",params);
    }

    var sequenceData = {};
    var sequenceId = 1;
    function sendGetBack(sequence,data) {
        console.log("shandiangou sendGetBack->"+data)
        var callBack = sequenceData[sequence];
        callBack.success(trim(decodeURIComponent(data)));
    }

    function getUrl(data) {
        var xmlhttp;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        var baseurl = data["url"];
        if (baseurl.indexOf("?")>-1) {

        } else {
            baseurl = baseurl + "?1=1"
        }

        var params = data["data"];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                baseurl = baseurl + "&" + key + "=" + params[key];
            }
        }

        xmlhttp.open("GET",baseurl,true);
        xmlhttp.onreadystatechange = function () {
            if(xmlhttp.readyState == 4) {
                if( xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status == 304 ) {
                    var result = trim(xmlhttp.responseText);
                    data.success(result);
                }else if(data.error){
                    var errorText = "网络异常，请稍后再试";
                    data.error(errorText);
                }
                xmlhttp = null;
            }
        };
        xmlhttp.send();
    }

    function postUrl(data){
        var xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        var baseUrl = data["url"];
        var params = data["data"];
        var dataParams = null;
    //      定义回调函数，用来识别请求完成,清空xmlHttp,防止内存泄露
    //        xmlHttp.complete = function(){};
        for( var key in params ){
            if (params.hasOwnProperty(key)) {
                dataParams = dataParams ? (dataParams + "&" + key + "=" + params[key]) : key + "=" + params[key];
            }
        }
        xmlHttp.open("POST", baseUrl, true);
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.onreadystatechange = function () {
            if ( xmlHttp.readyState == 4 ){
                if( xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304 ) {
                    var responseText = trim(xmlHttp.responseText);
                    data.success(responseText);
                }else{
                    var errorText = "网络异常，请稍后再试";
                    data.error(errorText);
                }
    //                xmlHttp.complete();
                xmlHttp = null;
            }
        };
        xmlHttp.send(dataParams);
    }

    function showAlert(title, content) {
                            alert(content);
            }

    function alisafepay(tradeNo,productName,productDescription,amount,notifyURl) {
        var params = {"tradeNO":tradeNo,"productName":productName,"productDescription":productDescription,"amount":amount,"notifyURL":notifyURl};
        bridge("alipay",params);
    }

    function alisafepayWithCallBack(tradeNo,productName,productDescription,amount,notifyURl,callBackUrl) {
        var params = {"tradeNO":tradeNo,"productName":productName,"productDescription":productDescription,"amount":amount,"notifyURL":notifyURl,"callbackURL":callBackUrl};
        bridge("alipay",params);
    }


    function getLocation(callback) {
        var params = {"callback":callback};
        bridge("getLocation",params);
    }

    function nextPage(url) {
                    window.location.href = url;
            }

    function updateTitle(title) {
        var params = {"title":title};
        bridge("updateNTitle",params);
    }

    function updateRightButtonWithClicked(title,clicked) {
        var params = {"title":title,"clicked":clicked};
        bridge("updateNTRButton",params);
    }

    function updateRightButtonToRAWURL(title,url) {
        var params = {"title":title,"clicked":"openUrl('"+url+"')"};
        bridge("updateNTRButton",params);
    }

    function updatePushRightButtonToRAWURL(badge,title,url) {
        var params = {"title":title,"clicked":"openUrl('"+url+"')","badge":badge};
        bridge("updateNTRButton",params);
    }

    function updateNTRPlus(action) {
        var params = {"badge":3,"clicked":action};
        bridge("updateNTRPlus",params);
    }

    function closeNTRPlus(action) {
        var params = {"badge":3,"clicked":action,"close":"true"};
        bridge("updateNTRPlus",params);
    }

    function openPicPicker(callback) {
        var params = {"callback":callback};
        bridge("openPicPicker",params);
    }

    function openScan(callback) {
        var params = {"callback":callback};
        bridge("openScan",params);
    }

    function searchBlueTooth() {
        bridge("searchBlueTooth",null);
    }
    function printOrder(title) {
        var params = {"title":title}
        bridge("printOrder",params);
    }

    function getDeviceID(callback){
        var params = {"callback":callback};
        bridge("getDeviceID",params);
    }
    function playSound() {
        bridge("playSound","");
    }

    function gobackspecified(backNum) {
        var params = {
            "backNum": backNum
        };
        bridge("gobackspecified", params);
    }

    function clearCache(callback) {
        var params = {"callback":callback};
        bridge("clearCache",params);
    }

    function getCacheSize(callback) {
        var params = {"callback":callback};
        bridge("getCacheSize",params);
    }

    function showNativeLoading() {
        bridge("showLoading","");
    }

    function hideNativeLoading() {
        bridge("hideLoading","");
    }

    function navigationbBack(disableAnimation) {
        if (disableAnimation == 'false') {
            var params = {"animation":"false"};
            bridge("backNavigation",params);

        } else {
            var params = {"animation":"true"};
            bridge("backNavigation",params);
        }
    }

    function testSetStatusBarWhiteShare() {
        var params = {"type":"setWhite"};
        bridge("setStatusBar",params);
    }

    function findSuperTargetWithClass(target,className) {
        if (target.classList.contains(className)) {
            return target;
        } else if (target.parentElement != null) {
            return findSuperTargetWithClass(target.parentElement,className);
        } else {
            return null;
        }
    }

    function addClickPerform(target) {
        if (target == null) {
            return;
        }
        target.addEventListener("touchmove",function (evt) {
            evt.target.classList.remove("clicked");
        },false);

        target.addEventListener("touchstart",function (evt) {
            evt.target.classList.add("clicked");
        },false);

        target.addEventListener("touchend",function (evt) {
            evt.target.classList.remove("clicked");
        },false);
    }

    function addClickPerformWithAction(target,action) {
        if (target == null) {
            return;
        }
        target.addEventListener("touchmove",function (evt) {
            evt.preventDefault();
            evt.target.style.backgroundColor= "";
        },false);

        target.addEventListener("touchstart",function (evt) {
            evt.preventDefault();
            evt.target.style.backgroundColor= "rgba(210, 210, 210, 0.4)";
        },false);

        target.addEventListener("touchend",function (evt) {
            evt.preventDefault();
            evt.target.style.backgroundColor= "";
            if (target != null) {
                evt.target.style.backgroundColor= "";
                if (action) {
                    action(target);
                }
            }
        },false);
    }

    function addTouchClickWithAction(target,action) {
        if (target == null) {
            return;
        }
        target.addEventListener("touchmove",function (evt) {
            evt.preventDefault();
        },false);

        target.addEventListener("touchstart",function (evt) {
            evt.preventDefault();
        },false);

        target.addEventListener("touchend",function (evt) {
            evt.preventDefault();
            if (target != null) {
                if (action) {
                    action(evt);
                }
            }
        },false);
    }

    function addClickPerformInSubClass(target,subClassName, clickAction) {
        target.addEventListener("touchmove",function (evt) {
            evt.preventDefault();
            var target = findSuperTargetWithClass(evt.target,subClassName);
            if (target != null) {
                target.classList.remove("clicked");
            }
        },false);

        target.addEventListener("touchstart",function (evt) {
            evt.preventDefault();
            var target = findSuperTargetWithClass(evt.target,subClassName);
            if (target != null) {
                target.classList.add("clicked");
            }
        },false);

        target.addEventListener("touchend",function (evt) {
            evt.preventDefault();
            var target = findSuperTargetWithClass(evt.target,subClassName);
            if (target != null) {
                target.classList.remove("clicked");
                setTimeout(function(){
                        clickAction(target);
                },20);
            }
        },false);
    }
    function alert(words){
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert(words);
        iframe.parentNode.removeChild(iframe);
    }

            var ismousedown = false;
        document.addEventListener("mousedown", function(e) {
            ismousedown = true;
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("touchstart",true,true);
            var param = {
                clientX: e.clientX,
                clientY: e.clientY
            };
            evt.touches = [param];
            evt.changedTouches = [param];
            e.target.dispatchEvent(evt);
            //console.log("mousedown->"+e);
        });

        document.addEventListener("mousemove", function(e) {
            if (!ismousedown) return;

            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("touchmove",true,true);
            var param = {
                clientX: e.clientX,
                clientY: e.clientY
            };
            //console.log("mousemove->"+e+"->"+param+"x->"+e.clientX+"y->"+e.clientY);
            evt.touches = [param];
            evt.changedTouches = [param];
            e.target.dispatchEvent(evt);
        });

        document.addEventListener("mouseup", function(e) {
            ismousedown = false;
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("touchend",true,true);
            var param = {
                clientX: e.clientX,
                clientY: e.clientY
            };
            evt.touches = [param];
            evt.changedTouches = [param];
            e.target.dispatchEvent(evt);
            //console.log("mouseup->"+e);
        });

        var baseWheelClientX = 0;
        var baseWheelClientY = 0;
        var opWheelClientX = 0;
        var opWheelClientY = 0;
        document.addEventListener("mousewheel", function(e) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("touchmove",true,true);

            if (e.clientX != baseWheelClientX && e.clientY != baseWheelClientY ) {
                baseWheelClientX = e.clientX;
                baseWheelClientY = e.clientY;
                opWheelClientX = baseWheelClientX + e.deltaX;
                opWheelClientY = baseWheelClientY + e.deltaY;
            } else {
                opWheelClientX = opWheelClientX + e.deltaX;
                opWheelClientY = opWheelClientY + e.deltaY;
            }

            var param = {
                clientX: opWheelClientX,
                clientY: opWheelClientY
            };
            //console.log("mousewheel->"+e+"->"+param+"x->"+e.clientX+"y->"+e.clientY);
            evt.touches = [param];
            evt.changedTouches = [param];
            e.target.dispatchEvent(evt);
        });
    
    (function() {
        var escapeEl = document.createElement('textarea');

        window.escapeHTML = function(html) {
            escapeEl.textContent = html;
            return escapeEl.innerHTML;
        };

        window.unescapeHTML = function(html) {
            escapeEl.innerHTML = html;
            return escapeEl.textContent;
        };
    })();

//------------------时间处理相关-------------

function getDateTimeStamp(dateStr){
    return Date.parse(dateStr.replace(/-/gi,"/"));
}

function jsDateDiff(publishTime){
    var d_minutes,d_hours,d_days;
    var timeNow = parseInt(new Date().getTime()/1000);
    var d;
    d = timeNow - publishTime;
    d_days = parseInt(d/86400);
    d_hours = parseInt(d/3600);
    d_minutes = parseInt(d/60);
    if(d_days>0 && d_days<4){
        return d_days+"天前";
    }else if(d_days<=0 && d_hours>0){
        return d_hours+"小时前";
    }else if(d_hours<=0 && d_minutes>0){
        return d_minutes+"分钟前";
    }else{
        var s = new Date(publishTime*1000);
        // s.getFullYear()+"年";
        return (s.getMonth()+1)+"月"+s.getDate()+"日";
    }
}

function jsDateDiffFromDate(publishTime) {
    return jsDateDiff(getDateTimeStamp(publishTime)/1000);
}
 