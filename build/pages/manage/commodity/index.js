define("manage/commodity/index",function(t,e,n){t("./mods/tableTpl.js");var a=t("lib/ajax"),o=0,i={init:function(){i.bindEvent(),i.initTable(),i.initLayPage()},initTable:function(){console.log("test"),a.get({url:"admin/commodity/lists",data:{page:o,limit:10},success:function(t){t.errNum||(console.log("test"),$(juicer.templates["table.juicer"]({rs:t.retData})).appendTo($(".table")))}})},initLayPage:function(){$.getJSON("test/demo1.json",{curr:6},function(t){laypage({cont:"page1",pages:t.pages,curr:6,jump:function(t){$.getJSON("test/demo1.json",{curr:t.curr},function(e){t.pages=t.last=e.pages;var n=document.getElementById("view1"),a=(new Date).getTime()/Math.random()/1e3|0;n.innerHTML=e.content+a})}})})},bindEvent:function(){$(document).on("focus",".J_focusEvent",function(t){var e=$(t.currentTarget);console.log(e.data("event")),i[e.data("event")]&&i[e.data("event")](e)}),$(document).on("click",".J_clickEvent",function(t){var e=$(t.currentTarget);i[e.data("event")]&&i[e.data("event")](e)})},upDownEvent:function(t){"收起筛选"===t.html()?($("form").slideUp(),t.html("展开筛选")):($("form").slideDown(),t.html("收起筛选"))},focusEvent:function(t){console.log(t.attr("id")),laydate({elem:"#"+t.attr("id")})},deleteEvent:function(t){}};i.init()});