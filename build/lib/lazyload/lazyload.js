
;(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory)}else{factory(window.jQuery||window.Zepto)}})(function($,undefined){var w=window,$window=$(w),defaultOptions={threshold:0,failure_limit:0,event:'scroll',effect:'show',effect_params:null,container:w,data_attribute:'original',data_srcset_attribute:'original-srcset',skip_invisible:true,appear:emptyFn,load:emptyFn,vertical_only:false,minimum_interval:300,use_minimum_interval_in_ios:false,url_rewriter_fn:emptyFn,no_fake_img_loader:false,placeholder_data_img:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC',placeholder_real_img:'http://ditu.baidu.cn/yyfm/lazyload/0.0.1/img/placeholder.png'},isIOS=(/(?:iphone|ipod|ipad).*os/gi).test(navigator.appVersion),isIOS5=isIOS&&(/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion),type
function emptyFn(){}
type=(function(){var object_prototype_toString=Object.prototype.toString
return function(obj){return object_prototype_toString.call(obj).replace('[object ','').replace(']','')}})()
function belowthefold($element,options){var fold
if(options._$container==$window){fold=('innerHeight'in w?w.innerHeight:$window.height())+$window.scrollTop()}else{fold=options._$container.offset().top+options._$container.height()}
return fold<=$element.offset().top-options.threshold}
function rightoffold($element,options){var fold
if(options._$container==$window){fold=$window.width()+($.fn.scrollLeft?$window.scrollLeft():w.pageXOffset)}else{fold=options._$container.offset().left+options._$container.width()}
return fold<=$element.offset().left-options.threshold}
function abovethetop($element,options){var fold
if(options._$container==$window){fold=$window.scrollTop()}else{fold=options._$container.offset().top}
return fold>=$element.offset().top+options.threshold+$element.height()}
function leftofbegin($element,options){var fold
if(options._$container==$window){fold=$.fn.scrollLeft?$window.scrollLeft():w.pageXOffset}else{fold=options._$container.offset().left}
return fold>=$element.offset().left+options.threshold+$element.width()}
function checkAppear($elements,options){var counter=0
$elements.each(function(i,e){var $element=$elements.eq(i)
if(options.skip_invisible&&!($element.width()||$element.height())&&$element.css("display")!=="none"){return}
function appear(){$element.trigger('_lazyload_appear')
counter=0}
if(options.vertical_only){if(abovethetop($element,options)){}else if(!belowthefold($element,options)){appear()}else{if(++counter>options.failure_limit){return false}}}else{if(abovethetop($element,options)||leftofbegin($element,options)){}else if(!belowthefold($element,options)&&!rightoffold($element,options)){appear()}else{if(++counter>options.failure_limit){return false}}}})}
function getUnloadElements($elements){return $elements.filter(function(i,e){return!$elements.eq(i)._lazyload_loadStarted})}
if(!$.fn.hasOwnProperty('lazyload')){$.fn.lazyload=function(options){var $elements=this,isScrollEvent,isScrollTypeEvent,scrollTimer=null,hasMinimumInterval
if(!$.isPlainObject(options)){options={}}
$.each(defaultOptions,function(k,v){if($.inArray(k,['threshold','failure_limit','minimum_interval'])!=-1){if(type(options[k])=='String'){options[k]=parseInt(options[k],10)}else{options[k]=v}}else if(k=='container'){if(options.hasOwnProperty(k)){if(options[k]==w||options[k]==document){options._$container=$window}else{options._$container=$(options[k])}}else{options._$container=$window}
delete options.container}else if(defaultOptions.hasOwnProperty(k)&&(!options.hasOwnProperty(k)||(type(options[k])!=type(defaultOptions[k])))){options[k]=v}})
isScrollEvent=options.event=='scroll'
isScrollTypeEvent=isScrollEvent||options.event=='scrollstart'||options.event=='scrollstop'
$elements.each(function(i,e){var element=this,$element=$elements.eq(i),placeholderSrc=$element.attr('src'),originalSrcInAttr=$element.attr('data-'+options.data_attribute),originalSrc=options.url_rewriter_fn==emptyFn?originalSrcInAttr:options.url_rewriter_fn.call(element,$element,originalSrcInAttr),originalSrcset=$element.attr('data-'+options.data_srcset_attribute),isImg=$element.is('img')
if($element._lazyload_loadStarted==true||placeholderSrc==originalSrc){$element._lazyload_loadStarted=true
$elements=getUnloadElements($elements)
return}
$element._lazyload_loadStarted=false
if(isImg&&!placeholderSrc){$element.one('error',function(){$element.attr('src',options.placeholder_real_img)}).attr('src',options.placeholder_data_img)}
$element.one('_lazyload_appear',function(){var effectParamsIsArray=$.isArray(options.effect_params),effectIsNotImmediacyShow
function loadFunc(){if(effectIsNotImmediacyShow){$element.hide()}
if(isImg){if(originalSrcset){$element.attr('srcset',originalSrcset)}
if(originalSrc){$element.attr('src',originalSrc)}}else{$element.css('background-image','url("'+originalSrc+'")')}
if(effectIsNotImmediacyShow){$element[options.effect].apply($element,effectParamsIsArray?options.effect_params:[])}
$elements=getUnloadElements($elements)}
if(!$element._lazyload_loadStarted){effectIsNotImmediacyShow=(options.effect!='show'&&$.fn[options.effect]&&(!options.effect_params||(effectParamsIsArray&&options.effect_params.length==0)))
if(options.appear!=emptyFn){options.appear.call(element,$elements.length,options)}
$element._lazyload_loadStarted=true
if(options.no_fake_img_loader||originalSrcset){if(options.load!=emptyFn){$element.one('load',function(){options.load.call(element,$elements.length,options)})}
loadFunc()}else{$('<img />').one('load',function(){loadFunc()
if(options.load!=emptyFn){options.load.call(element,$elements.length,options)}}).attr('src',originalSrc)}}})
if(!isScrollTypeEvent){$element.on(options.event,function(){if(!$element._lazyload_loadStarted){$element.trigger('_lazyload_appear')}})}})
if(isScrollTypeEvent){hasMinimumInterval=options.minimum_interval!=0
options._$container.on(options.event,function(){if(isScrollEvent&&hasMinimumInterval&&(!isIOS||options.use_minimum_interval_in_ios)){if(!scrollTimer){scrollTimer=setTimeout(function(){checkAppear($elements,options)
scrollTimer=null},options.minimum_interval)}}else{return checkAppear($elements,options)}})}
$window.on('resize load',function(){checkAppear($elements,options)})
if(isIOS5){$window.on('pageshow',function(e){if(e.originalEvent&&e.originalEvent.persisted){$elements.trigger('_lazyload_appear')}})}
$(function(){checkAppear($elements,options)})
return this}}})