function jdim(){var p=null;var defaultDomain="chat1.jd.com";function loadStyle(lit){var imStyle="";if(lit){imStyle="."+p.iconClass+" {float:right;overflow:hidden;width:68px;height:27px;padding-left:24px;margin:6px 10px 0 0;background:url(http://misc.360buyimg.com/lib/skin/2013/i/djd-im.gif) no-repeat;line-height:25px;text-align:center;*zoom:1;}."+p.iconClass+":hover {text-decoration:none;} ."+p.iconClass+" b {font-weight:normal;}"}else{imStyle="."+p.iconClass+" {background:url(http://misc.360buyimg.com/lib/skin/2013/i/jd-im.png) no-repeat -142px -127px;line-height:100px;}"}
var doc=document,heads=doc.getElementsByTagName("head"),style=doc.createElement("style");style.setAttribute("type","text/css");if(style.styleSheet){style.styleSheet.cssText=imStyle}else{var cssText=doc.createTextNode(imStyle);style.appendChild(cssText)}
if(heads.length){heads[0].appendChild(style)}else{doc.documentElement.appendChild(style)}}
function onlineService(code,jsonObject){var params=null;var chatDomain=jsonObject.chatDomain?jsonObject.chatDomain:"chat.jd.com";if(p.shopId||(p.from=="orderDetail"&&jsonObject.shopId)){if(p.from=="orderDetail"){params="shopId="+jsonObject.shopId}else{params="shopId="+p.shopId}}else{if(p.venderId||(p.from=="orderDetail"&&jsonObject.venderId)){if(p.from=="orderDetail"){params="venderId="+jsonObject.venderId}else{params="venderId="+p.venderId}}else{if(p.brandName||(p.from=="orderDetail"&&jsonObject.brandName)){if(p.from=="orderDetail"){params="brandName="+encodeURIComponent(encodeURIComponent(jsonObject.brandName));if(jsonObject.rank3){params="classify="+jsonObject.rank3+"&"+params}}else{params="brandName="+encodeURIComponent(encodeURIComponent(p.brandName));if(p.rank3){params="classify="+p.rank3+"&"+params}}}else{if(p.pid){params="pid="+p.pid}else{if(p.virtualId){params="virtualId="+p.virtualId}}}}}
if(p.from){params="from="+p.from+"&"+params}
var chatUrl="http://"+chatDomain+"/pop/chat?"+params+"&code="+code;open(chatUrl,p.pid?p.pid:521360,"status=no,toolbar=no,menubar=no,location=no,titlebar=no,resizable=no,width=1018px,height=590")}
function showIcon(){var params=null;if(p.shopId){params="shopId="+p.shopId}else{if(p.venderId){params="venderId="+p.venderId}else{if(p.brandName){params="brandName="+encodeURIComponent(encodeURIComponent(p.brandName));if(p.rank3){params="rank3="+p.rank3+"&"+params}}else{if(p.pid){params="pid="+p.pid}else{if(p.virtualId){params="virtualId="+p.virtualId}}}}}
if(p.from){params="from="+p.from+"&"+params}
if(params){var d=defaultDomain;if(p.domain){d=p.domain}
jQuery.getJSON("http://"+d+"/api/checkChat?"+params+"&callback=?"+(p.charset?"&returnCharset="+p.charset:""),function(obj){if(obj){var code=0;var seller="";eval('var txtOnline=decodeURIComponent("%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D")');eval('var txtOffline=decodeURIComponent("%E5%AE%A2%E6%9C%8D%E7%9B%AE%E5%89%8D%E4%B8%8D%E5%9C%A8%E7%BA%BF")');eval('var txtLeaveWords=decodeURIComponent("%E7%BB%99%E5%AE%A2%E6%9C%8D%E7%95%99%E8%A8%80")');eval('var txtNewsWizard=decodeURIComponent("%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D%E7%9B%AE%E5%89%8D%E4%B8%8D%E5%9C%A8%E7%BA%BF%EF%BC%8C%E6%82%A8%E5%8F%AF%E4%BB%A5%E7%82%B9%E5%87%BB%E6%AD%A4%E5%A4%84%E7%BB%99%E5%95%86%E5%AE%B6%E7%95%99%E8%A8%80%EF%BC%8C%E5%B9%B6%E5%9C%A8%E3%80%90%E6%88%91%E7%9A%84%E4%BA%AC%E4%B8%9C-%3E%E6%B6%88%E6%81%AF%E7%B2%BE%E7%81%B5%E3%80%91%E4%B8%AD%E6%9F%A5%E7%9C%8B%E5%9B%9E%E5%A4%8D")');code=obj.code;seller=obj.seller;if(code==1){loadStyle(true);$("."+p.iconClass).each(function(i){$(this).html("<b><a href='#'>"+txtOnline+"</a></b>");$(this).attr("title",seller+txtOnline);$(this).click(function(){onlineService(1,obj)})})}else{if(code==2){loadStyle(false);$("."+p.iconClass).each(function(i){$(this).html("<b>"+txtOnline+"</b>");$(this).attr("title",seller+txtOffline)})}else{if(code==3||code==9){loadStyle(false);$("."+p.iconClass).each(function(i){$(this).html("<b><a href='#'>"+txtLeaveWords+"</a></b>");$(this).attr("title",seller+txtNewsWizard);$(this).click(function(){onlineService(3,obj)})})}}}}})}}
this.show=function(v){p=v;showIcon()}}
var JDIM=new jdim();