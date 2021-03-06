(function($) {
    jshop.module.imgShow = {};
    $.extend(jshop.module.imgShow, jshop.module);
    $.extend(jshop.module.imgShow, {
        showImg: function(args) {
            var silde = true;
			// 定义传入的CSS调用变量
			var param=$.extend({timer:0,node:'li', nodeChild:'.jItem', imgNodeArea:'.jPic', imgNode:'.jPic a', defaultClass:'current', slideDirection:'left', subFunction:'moveEffect'}, args),
				_this=this,
				imgArea = $(_this).find(param.node),
				nodeChild = $(_this).find(param.nodeChild),
				defaultClass = param.defaultClass,
				currentNode = imgArea.eq(0).find(param.imgNode),
				_duration = parseInt(parseFloat(param.timer || 0)*1000);
			
			if(!imgArea.length) return;
			
			//全局变量
			var index = 0,moveRange = 0,partTime = null,animate = null;
			var isTop = (param.slideDirection == 'top')?true:false;
            var enterFlag =[],count = 0;
			
			/**
			 * 轮播图所有效果
			 */
			var banner = {
				transparentEffect : function(){
					// 调用函数
					init();
					animate = transparent;
					_event();
				},
				moveEffect : function(){
					//初始化
					imgArea.each(function(i,n){
						var imgNodeArea = $(n).find(param.imgNodeArea);
						if(isTop){
							imgNodeArea.css({height:100000});
							imgNodeArea.children().css({width:imgNodeArea.width(),height:"auto","float":"none",display:"block"});
						}else{
							imgNodeArea.css({width:100000});
							imgNodeArea.children().css({width:imgNodeArea.find('img').width(),height:"100%","float":"left",display:"block"});//将这个宽度写在css里，在ie6下面，获取到的父级宽度是被这个元素撑开的宽度
						};
					});
					
					// 调用函数
					init();
					animate = oneImgMove;
					_event();
				}
			};
			
			/**
			 * 根据传入的子方法名执行对应的子方法
			 */
			if(banner[param.subFunction])
				banner[param.subFunction].call(_this);
			
			/**
			 * 轮播图初始化
			 */
			function init(){
				imgArea.css({width:currentNode.find('img').width(),height:currentNode.find('img').height()});
				nodeChild.css({width:currentNode.find('img').width(),height:currentNode.find('img').height()});
			}
			
			 function _event(){
                imgArea.each(function(index,n){
                	var _ele = $(n);
                    _ele.data('index',0);
                	_ele.data('count',0);
                	_ele.data('animating',false);
					_ele.data('direction',1);

                	_ele.bind({
                        mouseenter:function(){
							var _this = this,_area = $(this),_count = _area.data('count') + 1, _node = _area.find(param.imgNode);
							_area.data('count',_count),currentNode = _area.find(param.imgNode);
							if(!_area.data('animating')){
								_area.data('direction',1);
								_area.data('index',1);
								currentNode.removeClass(defaultClass).eq(1).addClass(defaultClass);	
								animate.call(_this);
							}			
						},
                        mouseleave:function(){
							var _this = this,_area = $(this),_count = _area.data('count') + 1, _node = _area.find(param.imgNode);
							_area.data('count',_count),currentNode = _area.find(param.imgNode);
							if(!_area.data('animating')){
								_area.data('direction',2);
								_area.data('index',0);
								currentNode.removeClass(defaultClass).eq(0).addClass(defaultClass);	
								animate.call(_this);
							}	   
						}
                    });
                });
			 }
			
			/**
			 * 透明效果
			 */
			function transparent(){
			
				var _this = this, _area = $(_this),_index = _area.data('index');
					_currentnode = _area.find(param.imgNode); 
				
				_area.data('animating',true);
				_currentnode.animate({
					opacity: 0
				  }, 0, function() {
				  });
				_currentnode.eq(_index).animate({
					opacity: 1
				  }, _duration, function() {
						_area.data('animating',false);
						var _count = _area.data('count'), _direction = _area.data('direction');
						if(_direction == 1){
							if(_count%2 == 0){
								_area.data('direction',2);
								_area.data('index',0);
								_area.find(param.imgNode).removeClass(defaultClass).eq(0).addClass(defaultClass);	
								animate.call(_this);
							}
						}
						else{
							if(_count%2 == 1){
								_area.data('direction',1);
								_area.data('index',1);
								_area.find(param.imgNode).removeClass(defaultClass).eq(1).addClass(defaultClass);	
								animate.call(_this);		
							}
						}
				  });
			}
			
			/** 
			 * 移动效果：每一张图片分10次移动
			 */
			 
			function oneImgMove(){
				var _this = this,_area = $(_this),_css = {},
					_index = _area.data('index');
				_area.data('animating',true);
					
				if(isTop){
					_css.marginTop = -_index*_area.find(param.imgNode).height() + 'px';
				}
				else{
					_css.marginLeft = -_index*_area.find(param.imgNode).width() + 'px';
				}
				
				_area.find(param.imgNodeArea).animate(_css,_duration,function(){
					_area.data('animating',false);
					var _count = _area.data('count'), _direction = _area.data('direction');
					if(_direction == 1){
						if(_count%2 == 0){
							_area.data('direction',2);
							_area.data('index',0);
							_area.find(param.imgNode).removeClass(defaultClass).eq(0).addClass(defaultClass);	
							animate.call(_this);
						}
					}
					else{
						if(_count%2 == 1){
							_area.data('direction',1);
							_area.data('index',1);
							_area.find(param.imgNode).removeClass(defaultClass).eq(1).addClass(defaultClass);	
							animate.call(_this);		
						}
					}
				});
			}
        },
        autoLayout: function(args) {
 
            var param = $.extend({
                node: "li",
                extra: {}
            },
            args),
            _this = this,
            elems = $(_this).find(param.node),
            elem = elems.eq(0);
            elem.css(param.extra);
            var outerWidth = parseInt(elem.data("outerWidth") || elem.outerWidth(true)),
            width = parseInt(elem.data("width") || elem.css("width")),
            qty = parseInt(elem.parent().parent().width() / outerWidth);
            elem.data({
                "outerWidth": outerWidth,
                "width": width
            });
            var extraWidth = outerWidth - width;
            var newWidth = (elem.parent().parent().width() - extraWidth * qty) / qty - 0.1;
            elems.css({
                width: newWidth
            });
        },
        autoImgShow: function(args) {
            var param = $.extend({},
            args || {} );
            jshop.module.imgShow.showImg.call(this, param);
            jshop.module.imgShow.autoLayout.call(this, param);
        }
    });
})(jQuery);/*
 * author:wanghaixin@jd.com
 * date:2013-09-27
 * ver:v1.0.0
 */

(function(w,$){
	
	jshop.module.samoye = jshop.module.samoye || {};
	
	$.extend(jshop.module.samoye,{
		base : function(args){
			var _this = $(this),
				_arg = $.extend({
					attention : '.btnAttention',
					attentionCls : 'jVisited',
					like : '.iconLike',
					likeCls : 'jVisited',
					attNumNode : '.jNum>em',
					ticket : '.icon-certificate'
				},args || {}),
				_brand_id = _arg.brandId,
				_app_id = _arg.appId,
				_smy_act_id = null,
				_atten_state = 0,
				_like_state = 0,
				_callback = null,
				_like = _this.find(_arg.like),
				_attention = _this.find(_arg.attention),
				_is_login = false;
			function _init(){
				_get_login_state();
				_get_state();
				_event_init();	
			}
				
			function _get_login_state(){
				 $.ajax({
			        url: ("https:" == document.location.protocol ? "https://": "http://") + "passport.jd.com" + "/new/helloService.ashx?m=ls",
			        dataType: "jsonp",
			        scriptCharset: "gb2312",
			        success: function(a) {
			            if(a && a.info &&a.info.match(/\<a/g).length != 1){
			            	_is_login = false;
			            }else{
			            	_is_login = true;
			            }
			        }
			    });
			}
			function _event_init(){
				if(!_atten_state)
					_attention.click(_samoye_atten);
				if(!_like_state)
					_like.click(_samoye_like);
			}
			function _samoye_atten(){
				if(_is_login){
					_attention_handle();
				}else{
					thick_login(function(){
						_callback = _attention_handle;
						_get_state();
					});
				}
			}
			
			function _samoye_like(){
				if(_is_login){
					_like_handle();
				}else{
					thick_login(function(){
						_callback = _like_handle;
						_get_state();
					});
				}
			}
			w.smyAttentionBrand  = function(data){
				if(data.result == 1){
					alert('关注成功！');
					_attention.unbind('click').html('已关注');
					_this.find(_arg.attNumNode).html(parseInt(_this.find(_arg.attNumNode).html()) + 1);
				}
				else{
					alert(data.msg);
				}
			};
			w.smyActFavorite = function(data){
				if(data.result == 1){
					alert('喜欢成功！');
					_like.unbind('.click').find('a').html('已喜欢');
				}
				else{
					alert(data.msg);
				}
			};
			function _like_handle(){
				var __url = 'http://qingchun.jd.com/smyJ/addFavorite.html?smyactId=' + _smy_act_id;
				$.getScript(__url);
			}
			
			function _attention_handle(){	
				var __url = 'http://qingchun.jd.com/smyJ/addAttention.html?brandId=' + _brand_id;
				$.getScript(__url);
			}
			
			function _get_state(){
				var __url = 'http://qingchun.jd.com/smyJ/smyInfo.html?&type=2&';
				$.getScript(__url + 'brandId=' + _brand_id + '&actId=' + _app_id);
			}
			
			w.brandInfo = function(data){
				if(data.result == 1){
					_atten_state = data.isAtten;
					_like_state = data.isFavo;
					_this.find(_arg.attNumNode).html(data.attNumb);
					_smy_act_id = data.smyactId;
					if(data.hasPreferential == 1)
					{
						_this.find(_arg.ticket).show();
					}
					else{
						_this.find(_arg.ticket).hide();
					}
					if(_atten_state){
						_attention.html('已关注').unbind('click');
						_attention.addClass(_arg.attentionCls);
					}
					if(_like_state){
						_like.unbind('click').find('a').html('已喜欢');
						_like.addClass(_arg.likeCls);
					}
					if(_callback){
						_callback.call(_this);
						_callback = null;
					}
				}
			};
			
			_init();
		}
	});
	
})(window,jQuery);/**
	* @description: 分类推荐模块方法库
*/

(function($){
	jshop.module.sortRec = {};
	$.extend(jshop.module.sortRec, jshop.module);
	
	$.extend(jshop.module.sortRec, {
		/**
		 * args:
		 * setUpWidth: 0(span与滑动的距离是自动适应整个模块的宽度),1(span与滑动的距离为设置的css的span的宽度)
		 */
		tab:function(args){
			if(args == undefined){
				if(validateData($(this).attr("module-param"))){
					var args = eval('('+$(this).attr("module-param")+')');
				}
			}
			var param = $.extend({tabNode:'.jSortTab span', arrow:'.jSortTabArrow', defaultClass:'current', tabContent:'.jSortContent ul'}, args),
				_this = this,
				tabNode = $(_this).find(param.tabNode),
				tabContent = $(_this).find(param.tabContent),
				arrow = $(_this).find(param.arrow);
			//初始化结构
			tabNode.eq(0).addClass(param.defaultClass);
			tabContent.eq(0).addClass(param.defaultClass);
			tabNode.each(function(i,n){
				$(n).attr('data-num',i);
			});
			var width = 0;
			//自适应宽度
			if(param.setUpWidth) {
				if(tabNode.width() > 0) {
					width = tabNode.width();
				}else{
					width = (tabNode.parent().parent().width()-0.03)/tabNode.length;	
				}
			}else{
				width = (tabNode.parent().parent().width()-0.03)/tabNode.length;
			}
			tabNode.css({width: width});
			arrow.css({width: width});
			//绑定鼠标移动事件
			tabNode.bind({
				mouseenter: function(){
					$(this).addClass(param.defaultClass).siblings().removeClass(param.defaultClass);
					tabContent.eq($(this).attr('data-num')).addClass(param.defaultClass).siblings().removeClass(param.defaultClass);
					arrow.animate({left:($(this).attr('data-num'))*width},300,function(){});
				}
			});
		},
		/*
		 * 自适应布局：自适应布局宽度，根据布局的宽度判断能放下的一行数量，并将多余的宽度赋给每一个列表。支持css对象传入
		 * 参数传递：如{_this:'.template-area', node:'.item', extra:{}}。
		 */
		autoLayout:function(args){
			if(args == undefined){
				args = eval('('+$(this).attr("module-param")+')');
			}
			
			var param = $.extend({node:'li', extra:{}}, args),
				_this = this,
				elems = $(_this).find(param.node), 
				elem = elems.eq(0);
			
			elem.css(param.extra);
			
			var outerWidth = parseInt(elem.data('outerWidth') || elem.outerWidth(true)),
				width = parseInt(elem.data('width') || elem.css('width')),
				qty = parseInt(elem.parent().parent().width()/outerWidth);
			
			//记录初始化值
			elem.data({'outerWidth':outerWidth, 'width':width});
			
			var extraWidth = outerWidth - width;
			var newWidth = (elem.parent().parent().width()-extraWidth*qty-0.03)/qty;
			elems.css({width:newWidth});			
		},
		/*
		 * 自适应个数切换和商品自适应布局
		 */
		tabAutoLayout:function(){
			var args = eval('('+$(this).attr("module-param")+')');
			
			var param = $.extend({}, args);
			
			jshop.module.sortRec.tab.call(this,param);
			jshop.module.sortRec.autoLayout.call(this,param);
		}
	});
})(jQuery,window);/*
 * author:wanghaixin@jd.com
 * date:2013-08-13
 * ver:v1.0.1
 */
(function($,w){
	
	w.jshop.module.sidePanel = w.jshop.module.sidePanel || {};
	
	$.extend(w.jshop.module.sidePanel,{
		base : function(arg){
			var _this = $(this),
				_args = $.extend({
					horizontal : 1,
					top : 0,
					show : false,
					animate : 'normal'
				},arg || {}),
			_slide = _this.find('.J-container'),
			_h = _slide.height(),
			_scroll_h = 609,
			_show = false,
			_duration = 1000,
			_animate;
			
			var _show_animate = {
				normal : {
					show : function(){
						_slide.show();
					},
					hide : function(){
						_slide.hide();
					}
				},
				fade : {
					show : function(){
						_slide.fadeIn(_duration);
					},
					hide : function(){
						_slide.fadeOut(_duration);
					}
				},
				fadeH : {
					show : function(){
						_slide.animate({'height':_args.height + 'px'},_duration);					
					},
					hide : function(){
						_slide.animate({'height':'0px'},_duration,function(){
							_slide.show();
						});
						
					}
				},
				fadeW : {
					show : function(){
						_slide.animate({'width':_args.width + 'px'},_duration);
					},
					hide : function(){
						_slide.animate({'width':'0px'},_duration,function(){
							_slide.show();
						});
						
					}
				}
			};
			function _init(){
				if(_this.parents('[instanceid]').data('panel'))
					_this.parents('[instanceid]').data('panel').remove();
				_this.parents('[instanceid]').data('panel',_slide); 
				_animate = _show_animate[_args.animate] || _show_animate.normal;
				_css_init();
			}
			
			function _css_init(){
				if(1 === _args.horizontal){
					w.window2013CSS(_slide,{
						right : '50%',
						marginRight : '505px'
					});
				}
				else{
					w.window2013CSS(_slide,{
						left : '50%',
						marginLeft : '505px'
					});
				}
				_slide.css({
					position : 'fixed',
					top : _args.top + 'px',
					zIndex : 7,
					overflow : 'hidden'
				});
				if(_args.height){
					_slide.height(_args.height);
				}
				if(_args.width){
					_slide.width(_args.width);
				}
				if($.browser.msie&&$.browser.version.match(/6/)){
					_slide.css('position','absolute');
					_ie_fix_handle();
				}
				if(_args.show === 1){
					if(w.window2013scrollTop() < _scroll_h){
						_animate.hide();
					}
					else{
						_slide.show();
						_show = true;
					}
					_scroll_handle();
				}
				else{
					_animate.hide();
					_animate.show();
				}
			}
			
			function _ie_fix_handle(){
				var _top = parseInt(_slide.css('top'));
				w.window2013scroll(function(){
					if(_show){
						_slide.css('top',_top + $(this).scrollTop() + 'px');
					}
				});
			}
			function _scroll_handle(){
				w.window2013scroll(function(){
					if(!_show && $(this).scrollTop() >= _scroll_h){
						_animate.show();
						_show = true;
					}
					if(_show && $(this).scrollTop() < _scroll_h){
						_animate.hide();
						_show = false;
					}
				});
			}
			_init();
		}
	});
})(jQuery,window);
