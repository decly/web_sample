var S_ifollow = S_ifollow||{};

(function(j,$) {
	j.follow=function( idName , id, divName ){
		j.init(divName);
		j.id = id;
		if( idName == 'shopId' ){
			j.followWhat=1;//关注店铺
		}else{
			j.followWhat=2;//关注活动
		}
		 jdModelCallCenter.settings.fn = function() {
			 j.addFollow();//登录后回调函数 。增加关注
		 };
		$.login({
            modal: true,
            complete: function(result) {
                if (result != null && result.IsAuthenticated != null && result.IsAuthenticated) {
                	jdModelCallCenter.settings.fn();//已经登陆后。增加关注
                }
            }
		 });
	};
	
	j.init=function(divName){
		if( document.getElementById("dialogA") == undefined ){
			jQuery('#'+divName).append("<div id='dialogDiv' style='display:none'></div>");
		}
	};
	
	j.addFollow=function(){
		var url;
		if( j.followWhat == 1 ){
			url = "http://follow.soa.jd.com/vender/follow";
			url+="?venderId="+j.id;
		}else{
			url = "http://follow.soa.jd.com/activity/follow";
			url+="?activityId="+j.id;
			url+="&srcType=0";
		}
		//把静态的内容拿出来 变成jQuery对象
		j.followVM=jQuery(j.FollowVMContent);
		//这里调用关注接口
		 $.ajax({
			async: false,//同步调用
            url:url,
            dataType:"jsonp",
            success:function(data){
				j.followSuccess(data);
            },
            error: function(reques,msg){
            	j.followShopFail();
            }
		 });
		
	};
	
	j.followSuccess=function(data){
		j.checkResult(data, j.followSuccessCallBack , j.followed ,j.followShopMax);
	};
	
	j.checkResult=function(data,successCallBack,followedCallBack,followShopMaxCallBack){
		if( data.code == 'F10000' ){//F10000 成功
			successCallBack();
			return;
		}
		
		if( data.code == 'F0409' ){//F0409 已关注过，不能加关注
			followedCallBack();
			return;
		}
		if( data.code == 'F0410' ){//F0410关注达到最大数量，不能加关注
			followShopMaxCallBack();
			return;
		}
		
		//弹出错误页面
		j.followShopFail();
	};
	
	j.followSuccessCallBack=function(){
		
		var content;
		var getFollowNumSuc=false;
//		var getTagSuc=false;
		//发请求 获取关注数量
		var url;
		if( j.followWhat == 1 ){
			url = "http://follow.soa.jd.com/vender/queryForCount";
		}else{
			url = "http://follow.soa.jd.com/activity/queryForCount";
		} 
		
		j.getFollowNum(url,function(data){
			if( data.code == 'F10000' ){//获取到标签信息才显示，否则不显示
				var followNum;
				if( j.followWhat == 1 ){
					followNum="您已关注"+data.data+"个店铺";
					j.followVM.find('#followNum').html(followNum);
				}else{
					followNum="您已关注"+data.data+"个活动";
					j.followVM.find('#followTopicNum').html(followNum);
				}  
			 	
			}
		 	
			if( j.followWhat == 1 ){
				j.getFollowTags();
				
			}else{
				j.ShowFollowTopicSuc();
			}  
		});
	};
	
	/**
	 * 获取关注数量
	 */
	j.getFollowNum=function(url,followNumSuccessCallBack){
		 $.ajax({
			 async: false,//同步调用
			 url:url,
             dataType:"jsonp",
             success:function(data){
			 	followNumSuccessCallBack(data);
             },
             error: function(reques,msg){
            	//弹出关注失败；
        		j.followShopFail();
             }
		 });
	};
	
	/**
	 * 获取关注标签
	 */
	j.getFollowTags=function(){
		//获取标签信息
		 $.ajax({
			 async: false,//同步调用
            url:'http://follow.soa.jd.com/vender/queryTagForListByCount?count=5',
            dataType:"jsonp",
            success:function(data){
			 	j.fillInTags(data);
				j.ShowFollowSuc();
            },
            error: function(reques,msg){
	           	//弹出关注失败；
	       		j.followShopFail();
            }
		 });
	};
	
	
	j.fillInTags=function(data){
	 	var jsonData =  data;
		var tagNum = jsonData.data.length;
		var tagContent="";
		tagContent+="<ul id='oldTags' class='att-tag-list'>";
		var tagValue;
		
		for(var i=0;i<tagNum;i++){
			var id ="att-tag"+i;
			tagValue = jsonData.data[i];
			tagValue = decodeURIComponent(tagValue);
			tagContent+="<li><a href='javascript:void(0)' onclick='S_ifollow.chooseTag(this)' >"+tagValue+"</a></li>";
		}
		
		tagContent+="</ul>";
		tagContent+="<ul id='newTags' class='att-tag-list att-tag-list-save' >";
		tagContent+="<li id='att-tag-new' class='att-tag-new'><input id='newTag' type='text' placeholder='自定义' onfocus='newTagOnfocus()' onkeyup='checkLength(this)' maxlength='10' /><span onclick='S_ifollow.saveNewTag()'>添加</span></li>";
		tagContent+="</ul>";
		tagContent+="";
		j.followVM.find('#followTags').html(tagContent);
	};
	
	//关注成功
	j.ShowFollowSuc=function(){
		var title="提示";
		var div = document.getElementById("dialogDiv");
		div.innerHTML = '<a id="dialogA" href="#"></a>';
		jQuery('#dialogA').jdThickBox({
			width: 510,
			height: 260,
			title: title, 
			_box: 'btn_coll_shop_pop',
	        source: j.followVM.find('#followSuccessDiv').html()
		}, function() {
		    var pop = $('#btn_coll_shop_pop'),
	        target = $('#attention-tags').find('.mc');
		    pop.find('.thickcon').css('height', 'auto');
		    pop.css('height', 'auto');
		    //IE下占位符不起作用的补偿方式
		    $('#newTag').val( $('#newTag').attr('placeholder') );
		}); 
		jQuery("#dialogA").click();
	};
	
	
	//关注活动成功
	j.ShowFollowTopicSuc=function(){
		var title="提示";
		var div = document.getElementById("dialogDiv");
		div.innerHTML = '<a id="dialogA" href="#"></a>';
		jQuery('#dialogA').jdThickBox({
			width: 300,
			height: 80,
			title: title, 
			_box: 'btn_coll_shop_pop',
	        source: j.followVM.find('#followTopicSuccessDiv').html()
		}); 
		
		jQuery("#dialogA").click();
	};
	
	//弹出关注失败；
	j.followShopFail=function(){
		var div = document.getElementById("dialogDiv");
		div.innerHTML = '<a id="dialogA" href="#"></a>';
		
		if( j.followWhat == 1 ){
			j.followVM.find('#followFailSeeFollowUrl').attr('href','http://t.jd.com/vender/followVenderList.action');
			
		}else{
			j.followVM.find('#followFailSeeFollowUrl').attr('href','http://t.jd.com/activity/followActivityList.action');
		}  
		
		$('#dialogA').jdThickBox({
			width: 300,
			height: 80,
			title: '提示', 
	        source: j.followVM.find('#followFailDiv').html()
		}); 
		
		$("#dialogA").click();
		return;
	};
	
	//弹出关注达到最大限制；
	j.followShopMax=function(){
		var div = document.getElementById("dialogDiv");
		div.innerHTML = '<a id="dialogA" href="#"></a>';
		
		
		if( j.followWhat == 1 ){
			j.followVM.find('#followMaxSeeFollowUrl').attr('href','http://t.jd.com/vender/followVenderList.action');
			
		}else{
			j.followVM.find('#followMaxSeeFollowUrl').attr('href','http://t.jd.com/activity/followActivityList.action');
		}  
		
		$('#dialogA').jdThickBox({
			width: 300,
			height: 80,
			title: '提示', 
	        source: j.followVM.find('#followMaxDiv').html()
		}); 
		
		$("#dialogA").click();
		return;
	};
	
	
	//弹出已关注
	j.followed=function(){
		//获取关注数量
		var title="";
		var url;
		if( j.followWhat == 1 ){
			title="已关注过该店铺";
			url = "http://follow.soa.jd.com/vender/queryForCount";
			j.followVM.find('#followedSeeFollowUrl').attr('href','http://t.jd.com/vender/followVenderList.action');
		}else{
			title="已关注过该活动";
			url = "http://follow.soa.jd.com/activity/queryForCount";
			j.followVM.find('#followedSeeFollowUrl').attr('href','http://t.jd.com/activity/followActivityList.action');
		}  
		
		
		j.followVM.find('#followedTitle').html(title);
		j.getFollowNum(url,function(data){
			if( data.code == 'F10000' ){//获取到标签信息才显示，否则不显示
				var followedNum;
				if( j.followWhat == 1 ){
					followedNum="您已关注"+data.data+"个店铺";
				}else{
					followedNum="您已关注"+data.data+"个活动";
				}
				j.followVM.find('#followedNum').html(followedNum);
			}
			var div = document.getElementById("dialogDiv");
			div.innerHTML = '<a id="dialogA" href="#"></a>';
			$('#dialogA').jdThickBox({
				width: 300,
				height: 80,
				title: "提示", 
		        source: j.followVM.find('#followedDiv').html()
			}); 
			$("#dialogA").click();
		});
	};
	
	//店铺关注成功点击保存
	j.doSubmit=function(){
		var eachLi;
		var tagNames="";
		var tagName="";
		var chooseCount=0;
		$('#oldTags').find('a').each(function(index,element){
			if( 'true' == $(this).attr('isCheck') ){
				chooseCount++;
				if( tagNames == "" ){
					tagNames= $(this).html();
				}else{
					tagNames=tagNames+","+$(this).html();
				}
			}
		});
		
		
		$('#newTags').find('a').each(function(index,element){
			if( 'true' == $(this).attr('isCheck') ){
				chooseCount++;
				if( tagNames == "" ){
					tagNames= $(this).html();
				}else{
					tagNames=tagNames+","+$(this).html();
				}
			}
		});
		
		if( tagNames == "" ){
			j.showErrorMsg("请至少提供1个标签");
			return;
		}
		
		if( chooseCount >3 ){
			j.showErrorMsg("最多可选择3个标签");
			return;
		}	
		//编码防止乱码
		tagNames = encodeURIComponent(tagNames);
		var url = 'http://follow.soa.jd.com/vender/editTag';
		//调用接口
		 $.ajax({
			 async: false,//同步调用
	         url:url,
	         dataType:"jsonp",
	         data:{venderId:j.id,tagNames:tagNames},
	         success:function(data){
	        	if( data.code == 'F10000' ){//F10000 成功
	        		$('#follow_error_msg').removeClass();
	        		$('#follow_error_msg').addClass("hl_green fl");
	        		$('#follow_error_msg').html("设置成功");
	        		$('#follow_error_msg').show();
	        		setTimeout(function(){
	        		  jdThickBoxclose();
	            	}, 5000);
	        		
    			}else if( data.code == 'F0410' ){
    				j.showErrorMsg("设置的标签数超过最大限制");
    			}else{
    				j.showErrorMsg("设置失败");
    			}
	         },
	         error: function(reques,msg){
	        	 j.showErrorMsg("设置失败");
	         }
		 });
	};
	
	/**
	 * 错误提示区域
	 */
	j.showErrorMsg=function(msg){
		$('#follow_error_msg').removeClass();
		$('#follow_error_msg').addClass("att-tips fl");
		$('#follow_error_msg').html(msg);
    	$('#follow_error_msg').show();
    	setTimeout(function(){
    		$('#follow_error_msg').hide();
     	}, 3000);
	};
	
	/**
	 * 保存新标签
	 * @return
	 */	
	j.saveNewTag=function(){
		var newTag = $('#newTag').val();
		if( newTag.length > 10 || newTag.trim().length > 10  ){
			j.showErrorMsg("标签数字、字母、汉字组成");
			return;
		}
		
		newTag = newTag.trim();
		var isValidate = j.validateNewTag(newTag);
		if(!isValidate){
			j.showErrorMsg("标签数字、字母、汉字组成");
		    return;
		}
		
		
		if( newTag =="" || newTag == $('#newTag').attr('placeholder') ){
			j.showErrorMsg("请输入自定义名称！");
			$('#newTag').val( $('#newTag').attr('placeholder') );
			return ;
		}
		$("<li isNewAdd='true' ><a class='current' href='javascript:void(0)' onclick='S_ifollow.chooseTag(this)' isCheck='true' >"+newTag+"</a></li>").insertBefore( $('#att-tag-new') );
		
		//隐藏掉自定义标签的框
		var savedTag = $('li[isNewAdd]');
		if( savedTag.length >=3 ){
			//提示用户不能再新增标签了。
			$('#att-tag-new').attr('style','display:none');
		}
		
		$('#newTag').val( $('#newTag').attr('placeholder') );
		 
	};
	
	/**
	 * 选择一个标签
	 */
	j.chooseTag=function(obj){
		var isCheck=jQuery(obj).attr("isCheck");
		if( 'undefined' == typeof isCheck || isCheck=='false' ){
			jQuery(obj).attr("isCheck","true");
			jQuery(obj).addClass("current");
		}else{
			jQuery(obj).attr("isCheck","false");
			jQuery(obj).removeClass("current");
		}
	};
	
	/**
	 * 验证新添加的标签
	 */
	j.validateNewTag=function(newTag){
		var regTest=/[\u4e00-\u9fa5]|[0-9]|[a-z]|[A-Z]/g;
		var matchObject = newTag.match(regTest);
		var matchLength = 0;
		if( matchObject != null ){
			matchLength=newTag.match(regTest).length;
		}
		if( matchLength!=newTag.length ){
			return false;
		}
		return true;
	};
	
	/**
	 * 获取关注数量
	 */
	j.getFollowedCount=function( venderId ){
		 $.ajax({
			 async: false,//同步调用
	         url:'http://follow.soa.jd.com/vender/queryForCountByVid',
	         dataType:"jsonp",
	         data:{venderId:venderId},
	         success:function(data){
        		 var followedCount = data.data;
        		 if( followedCount > 500 ){//小于500不显示
        			 if( followedCount >10000 ){//大于10000 除一个单位
        				 followedCount=parseInt(followedCount/10000);
        				 followedCount = followedCount +"万";
        			 }
        			 $('#followedCount').html(followedCount);
        		 }
	         },
	         error: function(reques,msg){
	        	
	         }
		 });
	};
	
	
	j.FollowVMContent="<div id=\"whole\">" +
				"<div id=\"followSuccessDiv\">" +
					"<div class=\"tips\" id=\"success\"> <h2>关注成功！</h2>" +
						"<p><em id=\"followNum\"></em>" +
						"<a target=\"_blank\" href=\"http://t.jd.com/vender/followVenderList.action\">查看我的关注&gt;&gt;</a>" +
						"</p>" +
					"</div>" +
					"<div id=\"attention-tags\">" +
						"<div class=\"mt\">" +
							"<h4>选择标签<em>（最多可选3个）</em></h4>" +
							"<div class=\"extra\"></div>" +
						"</div>" +
						"<div class=\"mc\">" +
							"<div id=\"followTags\" ></div>" +
							"<div class=\"att-tag-btn\">" +
								"<a href=\"javascript:S_ifollow.doSubmit()\" class=\"att-btn-ok\">确定</a>" +
								"<a class=\"att-btn-cancal\" href=\"javascript:jdThickBoxclose()\">取消</a>" +
								"<span id=\"follow_error_msg\"  class=\"att-tips fl\"></span>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"<div id=\"followTopicSuccessDiv\">" +
				"<div id=\"att-mod-success\">" +
					"<div class=\"att-img fl\"><img src=\"http://misc.360buyimg.com/201007/skin/df/i/icon_correct.jpg\" alt=\"\"/></div>" +
					"<div class=\"att-content\"><h2>关注成功</h2>" +
						"<p><em id=\"followTopicNum\" ></em>" +
							"<a target=\"_blank\" href=\"http://t.jd.com/activity/followActivityList.action\">查看我的关注 &gt;&gt;</a>" +
						"</p>" +
					"</div>" +
					"<div class=\"att-tag-btn\">" +
						"<a class=\"att-btn-cancal\" href=\"javascript:jdThickBoxclose()\" onclick=\"jdThickBoxclose()\">关闭</a>" +
					"</div>" +
				"</div>" +
			"</div>" +
			"<div id=\"followFailDiv\" >" +
				"<div id=\"att-mod-again\">" +
					"<div class=\"att-img fl\">" +
						"<img src=\"http://misc.360buyimg.com/201007/skin/df/i/icon_sigh.jpg\" alt=\"\"/>" +
					"</div>" +
					"<div class=\"att-content\"><h2>关注失败</h2>" +
						"<p><a id='followFailSeeFollowUrl' target=\"_blank\" href=\"http://t.jd.com/vender/followVenderList.action\">查看我的关注 &gt;&gt;</a></p>" +
					"</div>" +
					"<div class=\"att-tag-btn\"><a class=\"att-btn-cancal\" href=\"javascript:jdThickBoxclose()\">关闭</a></div>" +
				"</div>" +
			"</div>" +
			"<div id=\"followMaxDiv\">" +
				"<div id=\"att-mod-again\">" +
					"<div class=\"att-img fl\">" +
						"<img src=\"http://misc.360buyimg.com/201007/skin/df/i/icon_sigh.jpg\" alt=\"\"/>" +
					"</div>" +
					"<div class=\"att-content\">" +
						"<h2>关注数量达到最大限制</h2>" +
						"<p><a id='followMaxSeeFollowUrl' target=\"_blank\" href=\"http://t.jd.com/vender/followVenderList.action\">查看我的关注 &gt;&gt;</a></p>" +
					"</div>" +
					"<div class=\"att-tag-btn\"><a class=\"att-btn-cancal\" href=\"javascript:jdThickBoxclose()\">关闭</a></div>" +
				"</div>" +
			"</div>" +
			"<div id=\"followedDiv\">" +
				"<div id=\"att-mod-again\">" +
					"<div class=\"att-img fl\">" +
						"<img src=\"http://misc.360buyimg.com/201007/skin/df/i/icon_sigh.jpg\" alt=\"\"/>" +
					"</div>" +
					"<div class=\"att-content\">" +
						"<h2 id=\"followedTitle\"></h2>" +
						"<p><em id=\"followedNum\"></em>" +
							"<a id='followedSeeFollowUrl' target=\"_blank\" href=\"\">查看我的关注 &gt;&gt;</a>" +
						"</p>" +
					"</div>" +
					"<div class=\"att-tag-btn\"><a class=\"att-btn-cancal\" href=\"javascript:jdThickBoxclose()\">关闭</a></div></div>" +
				"</div>" +
			"</div>";
	
})(S_ifollow,jQuery);




/**
 * 点击保存的Input框中
 * @return
 */
function newTagOnfocus(){
	var newTag = $('#newTag').val();
	newTag = newTag.trim();
	if(  newTag == $('#newTag').attr('placeholder') ){
		 $('#newTag').val('');
	}
}

/**
 * safari浏览器在输入为中文的情况下不能正确处理maxlength=10的情况
 * 手动处理
 * @param e
 * @return
 */
function checkLength(e){
	if(e.value.length > 10){
		e.value=e.value.substring(0,10);
	}
}
