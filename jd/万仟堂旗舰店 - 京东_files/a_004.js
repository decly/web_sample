/**
 * @description: 预售模块
 */
/*
 author:huangxiaoyi@jd.com
 date:20130701
 ver:v1.0.0
 */

(function($,w) {
    w.jshop.module.forwardSale  =  w.jshop.module.forwardSale || {};
    $.extend(w.jshop.module.forwardSale,{
        modeTimer : {},
        base : function(args){
            var _param=$.extend({node:'div'}, args || {}),
                _this = this,
                _prefixUrl = 'http://soa.yushou.jd.com/youshouinfo.action?sku=',
                _suffixUrl = '&callback=callBackService',
                _sku = _param.skuid,
                _remain_t= 0,
                _url = _prefixUrl + _param.skuid + _suffixUrl;

            w.callBackService = function(data){
                var __$this = $('[sku="' + data.sku + '"]'),
                    __arr = ['.presale','.appoint','.wait','.go','.over'];
                for(var i= 0;len=__arr.length,i<len;i++){
                    $(__$this).find(__arr[i]).addClass('hide');
                }
                data.state = data.state==0?5:data.state;
                $(__$this).find(__arr[data.state-1]).removeClass('hide');
                $('.has_appointed',__$this).addClass('hide');
                if(data.state==2){
                    if(data.flag==false){
                        $('.appoint').removeClass('wait2');
                        $(__arr[data.state-1]+">a",__$this).attr('href',data.url);
                        $(__arr[data.state-1]+">a",__$this).attr('target','_blank');
                    }else{
                        $(__arr[data.state-1]+">a",__$this).attr('href','#none');
                        $(__arr[data.state-1]+">a",__$this).attr('target','');
                        $('.appoint').addClass('wait2');
                        $('.appoint .button',__$this).unbind('click');
                    }
                    $('.has_appointed',__$this).removeClass('hide');
                    $('.has_appointed>span',__$this).html(data.num);
                }else if(data.state==4){
                    $(__arr[data.state-1]+">a",__$this).attr('href',data.url);
                }
                if((data.state!=0) && (data.state!=5)){
                    _remain_t = data.d;
                    _start_timer(_remain_t,__$this);
                }

                $('.appoint .button',__$this).unbind('click');
                $('.appoint .button',__$this).click(function(){
                    if($(this).attr('href')=='#none' || !$(this).attr('href')){
                        return false;
                    }
                    var r = window.open($(this).attr('href'));
                    if(r){
                        $('.appoint',__$this).addClass('wait2');
                        $('.appoint>a',__$this).attr('target','');
                        $('.appoint>a',__$this).attr('href','#none');
                        $('.appoint .button',__$this).unbind('click');
                    }
                    return false;
                });
            }

            function _start_timer(t,arg){
                var __mode =  arg,
                    _remain_t = t,
                    __instanceid = __mode.parents('[instanceid]').attr('instanceid');
                if(w.jshop.module.forwardSale.modeTimer[__instanceid])
                    clearInterval(w.jshop.module.forwardSale.modeTimer[__instanceid]);
                w.jshop.module.forwardSale.modeTimer[__instanceid] = setInterval(function(){
                    if(_remain_t <= 0)
                        clearInterval(w.jshop.module.forwardSale.modeTimer[__instanceid]);
                    var __tt = _remain_t,
                        __seconds = parseInt(__tt)%60,
                        __minutes = parseInt((__tt) / 60) % 60,
                        __hours = parseInt((__tt / 60 / 60) % 24),
                        __days = parseInt(__tt / 60 / 60 / 24);

                    __days < 10 ? __days = "0" + __days : __days = __days;
                    __hours < 10 ? __hours = "0" + __hours : __hours = __hours;
                    __seconds < 10 ? __seconds = "0" + __seconds : __seconds = __seconds;
                    __minutes < 10 ? __minutes = "0" + __minutes : __minutes = __minutes;
                    if((__days==0 || __days=='00') && (__hours==0 || __hours=='00')  && (__minutes==0 || __minutes=='00') && (__seconds==0 || __seconds=='00')){
                        var __arg = eval('(' + __mode.attr('module-param') + ')');
                        w.jshop.module.forwardSale.base.call(__mode,__arg);
                    }
                    $('.days', __mode).html(__days);
                    $('.hours',__mode).html(__hours);
                    $('.minutes',__mode).html(__minutes);
                    $('.seconds',__mode).html(__seconds);
                    _remain_t -= 1;
                },1000);
            }

            function _init(){
                if(_sku){
                    $.getScript(_url);
                }
            }

            _init();
        },
        phase2 : function(arg){
            var _this = $(this),
                _args = $.extend({
                    node : '.jItem',
                    isNeedSecond : false,
                    isFillZero : true,
                    priceNode : '.presellprice',
                    earnestNode : '.presellearnest',
                    presellNum : '.presellnum',
                    day:'.days',
                    hour : '.hours',
                    minute : '.minutes',
                    second : '.seconds',
                    waitCls : 'wait',
                    undergoCls : 'go',
                    overCls : 'over',
                    stairpreCls : 'state',
                    stateCls : 'jCurrent',
                    stairNode : '.jdPrice',
                    stairPreNum : '.prenum',
                    stairPrice : '.pricenode',
                    presell : '.jpresell'
                },arg || {}),
                _base_url = 'http://soa.yushou.jd.com/youshouinfo.action?source=2',
                _instanceid = _this.parents('[instanceid]').attr('instanceid'),
                _left = 0,
                _url = 'http://cart.jd.com/cart/dynamic/presale.action?pcount=1&ptype=1&pid=' + _args.skuid;


            _duration = _args.isNeedSecond ? 1000 : (60*1000);

            function init(){
                if(jshop.module.forwardSale.modeTimer[_instanceid])
                    clearInterval(jshop.module.forwardSale.modeTimer[_instanceid]);

                if(!_args.skuid) return;

                $.ajax({
                    url : _base_url + '&sku=' + _args.skuid,
                    dataType : 'jsonp',
                    success : function(data){
                        if(data&&data.type){
                            var ret = data.ret;
                            if(ret.sa){
                                var nodes = _this.find(_args.stairNode);
                                nodes.each(function(index,n){
                                    $(n).find(_args.stairPreNum).html(ret.sa[index].c);
                                    $(n).find(_args.stairPrice).html(ret.sa[index].m);
                                });
                                if(ret.s === 1){
                                    _this.find(_args.stairNode).eq(ret.cs - 1).addClass(_args.stateCls).parent().addClass(_args.stairpreCls + (ret.cs || 1));
                                    _this.find(_args.stairNode + ':lt(' + (ret.cs - 1) +')').addClass('history');
                                }
                            }
                            else{
                                _this.find(_args.priceNode).html(ret.cp);
                            }
                            _this.find(_args.earnestNode).html(ret.pm);
                            if(!!ret.s)
                                _this.find(_args.presellNum).html(ret.cc);
                            _left = ret.d;
                            _this.find(_args.node).addClass((!ret.s)?_args.waitCls:((ret.s === 1) ? _args.undergoCls :_args.overCls));
                            if(ret.s === 1){
                                _this.find(_args.presell).attr('href',_url).attr('target','blank');
                            }
                            if(!!_left && ret.s != 2){
                                _countdown_start();
                            }
                        }
                    }
                });
            }

            function _countdown_start(){
                _time_fill();
                jshop.module.forwardSale.modeTimer[_instanceid] = setInterval(function(){
                    _handle();
                },_duration);
            }

            function _time_fill(){
                var __days = Math.floor(_left/(60*24*60)),
                    __hours = Math.floor(_left/3600)%24,
                    __minutes = Math.floor(_left/60)%60,
                    __seconds = _left%60;

                if(_args.isFillZero){
                    __days = __days > 9 ? __days : '0' + __days;
                    __hours = __hours > 9 ? __hours : '0' + __hours;
                    __minutes = __minutes > 9 ? __minutes : '0' + __minutes;
                    __seconds = __seconds > 9 ?__seconds : '0' + __seconds;
                }

                _this.find(_args.day).html(__days);
                _this.find(_args.hour).html(__hours);
                _this.find(_args.minute).html(__minutes);

                if(_args.isNeedSecond){
                    _this.find(_args.second).html(__seconds);
                }
            }

            function _handle(){
                _time_fill()
                if(_args.isNeedSecond){
                    _left --;
                }
                else{
                    _left -= 60;
                }

                if(_left <= 0)
                    init();
            }

            init();
        },
        phase1 : function(arg){
            var _args=$.extend({
                    isFillZero : true,
                    node:'div',
                    defaultCls : 'd-current',
                    isNeedSecond : false,
                    day : '.days',
                    hour : '.hours',
                    minute : '.minutes',
                    second : '.seconds',
                    hasAppoint : '.has_appointed>span',
                    button : '.button'
                }, arg || {}),
                _this = $(this),
                _prefixUrl = 'http://soa.yushou.jd.com/youshouinfo.action?sku=',
                _sku = _args.skuid,
                _left= 0,
                _instanceid = _this.parents('[instanceid]').attr('instanceid'),
                _node = _this.find(_args.node),
                _duration = _args.isNeedSecond ? 1000 : (60*1000),
                _url = _prefixUrl + _sku;

            function _init(){
                if(jshop.module.forwardSale.modeTimer[_instanceid])
                    clearInterval(jshop.module.forwardSale.modeTimer[_instanceid]);
                if(!_args.skuid) return;

                $.ajax({
                    url : _url,
                    dataType : 'jsonp',
                    success : function(data){
                        var __arr = ['presale','appoint','wait','go','over'];
                        data.state = data.state==0?5:data.state;
                        _node.addClass(__arr[data.state - 1]).addClass(_args.defaultCls);
                        if(data.state === 2){
                            if(data.flag){
                                _node.find(_args.button).attr('href','#none').attr('target','');
                                _node.addClass('wait2');
                            }else{
                                _node.removeClass('wait2');
                                _node.find(_args.button).attr('href',data.url).attr('target','_blank');
                            }
                            _node.find(_args.hasAppoint).html(data.num);
                        }

                        if(data.state == 4)
                            _node.find(_args.button).attr('href',data.url);
                        _node.find(_args.button).click(function(){
                            if($(this).attr('href')=='#none' || !$(this).attr('href')){
                                return false;
                            }
                            var __r = window.open($(this).attr('href'));
                            if(__r){
                                _node.addClass('wait2');
                                _node.children('a').attr('target','').attr('href','#none');
                                $(this).unbind('click');
                            }
                            return false;
                        });

                        if(data.state != 5){
                            _left = data.d;
                            _countdown_start();
                        }
                    }
                });
            }

            function _countdown_start(){
                _time_fill();
                jshop.module.forwardSale.modeTimer[_instanceid] = setInterval(function(){
                    _handle();
                },_duration);
            }

            function _time_fill(){
                var __days = Math.floor(_left/(60*24*60)),
                    __hours = Math.floor(_left/3600)%24,
                    __minutes = Math.floor(_left/60)%60,
                    __seconds = _left%60;

                if(_args.isFillZero){
                    __days = __days > 9 ? __days : '0' + __days;
                    __hours = __hours > 9 ? __hours : '0' + __hours;
                    __minutes = __minutes > 9 ? __minutes : '0' + __minutes;
                    __seconds = __seconds > 9 ?__seconds : '0' + __seconds;
                }
                _this.find(_args.day).html(__days);
                _this.find(_args.hour).html(__hours);
                _this.find(_args.minute).html(__minutes);

                if(_args.isNeedSecond){
                    _this.find(_args.second).html(__seconds);
                }
            }

            function _handle(){
                _time_fill()
                if(_args.isNeedSecond){
                    _left --;
                }
                else{
                    _left -= 60;
                }
                if(_left <= 0)
                    _init();
            }

            _init();
        }
    });
})(jQuery,window);/*
 * author:wanghaixin@jd.com
 * date:20140312
 * version:1.0.0
*/
jshop.module.auction = {};
$.extend(jshop.module.auction,{
	base : (function(){
		var timer = null,
			auctionList = [],
			count = 0,
			tempList = [];
		return function(arg){
			var _this = this,
				_options = $.extend({
					status : ['wait','go','over'],
					item : 'li',
					timePanel : '.jNum',
					btnArea : '.jBtnArea a',
					priceNode : '.jdNum',
					process : '.jBgCurrent',
					text : '.jText',
					text1 : '.jText1',
					dataMsg : '.jDataMessage',
					day : '.days',
					hour : '.hours',
					minute : '.minutes',
					second : '.seconds',
					stock : '.stock',
					needDay : false
				},arg || {});
				
			function _unique(arr){
				var newArr = [],
					temp = {};
					
				for(var i = 0, len = arr.length; i < len;i++){
					if(!temp[arr[i]]){
						temp[arr[i]] = 1;
						newArr.push(arr[i]);
					}
				}
				return newArr;
			}
			
			function _getAuctionData(flag){
				var list = flag?tempList : auctionList,
					level = Math.ceil(list.length/10);
				for(var i = 0, len = level; i < len ; i++){
					var tempArr = [];
					for(var inner = i*10, innerLen = Math.min(list.length, (i+1)*10); inner < innerLen; inner ++){
						tempArr.push(list[inner]);
					}
					$.ajax({
						url : 'http://paimai.jd.com/services/currentList.action',
						type : 'POST',
						dataType : 'jsonp',
						data : {
							paimaiIds : tempArr.join('-')
						},
						success : function(data){
							_ajaxHandle(data);
						}
					});
				}
			}
			
			function _ajaxHandle(data){
				if(data){
					$.each(data,function(index,n){
						var __item = $('[paimaiId=' + n.paimaiId + ']');
						__item.closest(_options.item).attr('class',_options.status[n.auctionStatus]);
						__item.find(_options.priceNode).html(parseInt(n.currentPrice,10) <= 0 ? '暂无报价' : n.currentPrice);
						__item.find('.jRmb').html(n.currentPrice < 0 ? '' : '￥');
						__item.find('.startPrice').html(n.startPrice < 0 ? '暂无报价' : n.startPrice.toFixed(2));
						if(n.auctionType === 0){
                            __item.find('.minPrice').html(n.minPrice < 0 ? '暂无报价' : n.minPrice.toFixed(2));
                            if(n.auctionStatus == 2)
                                __item.find(_options.priceNode).html(n.minPrice < 0 ? '暂无报价' : n.minPrice.toFixed(2));
                        }
						if(n.auctionStatus == 0 || n.remainTime == - 1 || n.auctionStatus == 2){
							__item.find(_options.process).css('width','0%');
						}
						else{
							var __progress = (n.reduceTime*60*1000 - n.remainTime)/(n.reduceTime*60*1000);
							__item.find(_options.process).css('width',(__progress.toFixed(2)*100) + '%');
						}
						
						if(n.auctionStatus == 2){
							__item.find(_options.text).html('');
							__item.find(_options.text1).html();
							__item.find(_options.dataMsg).html(__item.find(_options.dataMsg).attr('endText'));
							__item.removeClass(_options.item.replace('.',''));
						}
						else{
							__item.find(_options.text).html(__item.find(_options.text).attr('defaultTxt'));
							__item.data('leftTime',parseInt(n.remainTime/1000));
							_showTime.call(__item);
							__item.find(_options.text1).html(n.auctionStatus == 0 || n.nextPrice == n.currentPrice || n.nextPrice < 0 ?'':__item.find(_options.text1).attr('defaultTxt'));
							__item.find(_options.dataMsg).html(n.auctionStatus == 0 ? __item.find(_options.dataMsg).attr('startTxt') : (n.nextPrice == n.currentPrice || n.nextPrice < 0?__item.find(_options.dataMsg).attr('endTxt'):'￥' + n.nextPrice.toFixed(2)));
							if(!!_options.stock)
								__item.find(_options.stock).html(n.currentNum);
						}
						var __btn = __item.find(_options.btnArea);
						if(n.auctionStatus == 1){
							__btn.attr('href',__btn.attr('detailUrl')).attr('target','_blank');
						}
						else{
							__btn.attr('href','#none').removeAttr('target');
						}
					});
				}		
			}
			
			function _showTime(){
				var __item = $(this),
					__left = __item.data('leftTime'),
					__second = __left%60,
					__minute = Math.floor(__left/60)%60,
					__hour = Math.floor(__left/3600)%24,
					__day = Math.floor(__left/60/60/24),
					__date = [];
				if(_options.needDay){
					__item.find(_options.day).html(__day>9?__day:'0'+__day)
				}
				else{
					__hour += __day*24;
				}
				__item.find(_options.hour).html(__hour>9?__hour:'0'+__hour);
				__item.find(_options.minute).html(__minute>9?__minute:'0'+__minute);
				__item.find(_options.second).html(__second>9?__second:'0'+__second);	
			}
			
			function _excute(){
				count = count%30;
				if(count == 0){
					_getAuctionData();
				}
				else{
					var items = $('[paimaiId]');
					items.each(function(index,n){
						var _remaindTime = $(n).data('leftTime');
						if(typeof _remaindTime !='undefined'){
							if(_remaindTime >0){
								_remaindTime --;
								$(n).data('leftTime',_remaindTime);
								_showTime.call($(n));
							}
							else{
								$(n).removeData('leftTime');
								tempList.push($(n).attr('paimaiId'));
							}
						}
					});
					if(tempList.length)
						_getAuctionData(true);
					tempList = [];
				}
				count ++;
			}
			
			function _init(){
				var __item =  $(_this).find(_options.item);
				if(__item.length === 0) return;
				
				if(timer){
					clearInterval(timer);
					timer = null;
					count = 0;
				}
				$(_this).find(_options.item).each(function(index,n){
					auctionList.push($(n).attr('paimaiId'));
				});
				auctionList = _unique(auctionList);
				timer = setInterval(function(){
					_excute();
				},1000);
			}
			_init();
		}
	})()
});


/*
 * author:wanghaixin@jd.com
 * date:2013-08-19
 * date:2013-08-27
 * ver:v1.0.1
 */

(function($,w){
	
	w.jshop.module.saleFollow = w.jshop.module.saleFollow || {};
	
	$.extend(w.jshop.module.saleFollow, {
		base : function(arg){
			var _this = this,
				_args = $.extend({
					item : 'li',
					follow : '.J-attention',
					favorite : '.J-addFavorite'
				},arg || {}),
				_url = 'http://follow.soa.jd.com/activity/follow?activityId=',
				_follow_con = $('.jPageExtra .pop_cnt');
			
			function _init(){
				$(_this).find(_args.item).each(function(index,n){
					var __id = $(n).attr('id'),
						__address = $(n).attr('address'),
						__title = $(n).attr('title'),
						__type = $(n).attr('srcType');
					if(!__id || !__address || !__title) return;
					$(n).find(_args.follow).click(function(){
						function __follow(){
							$.ajax({
								url : _url + __id + '&srcType=' + __type,
								dataType : 'jsonp',
								async : false,
								success : function(data){
									_followSuccess(data);
								},
								error : function(){
									_followFail('followTopicFailDiv');
								}
							});
						}
						thick_login(__follow);
					});
					
					$(n).find(_args.favorite).click(function(){
						try{
							if (document.all) {
								window.external.AddFavorite(__address, __title);
							} else if (window.sidebar) {
								window.sidebar.addPanel(__title, __address, "");
							} else {
								alert('对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏，收藏地址为' + __address + '。');
							}
						}
						catch(e){
							alert('对不起，您的浏览器不支持此操作!\n请您使用菜单栏或Ctrl+D收藏，收藏地址为' + __address + '。');
						}
					});
				});
			}
			
			function _followSuccess(data){
				//FIXME
				if( data.code == 'F10000' ){//F10000 成功
					_followed("followTopicSuccessDiv");
					return;
				}
				
				if( data.code == 'F0409' ){//F0409 已关注过，不能加关注
					_followed("followedTopicDiv");
					return;
				}
				if(data.code == 'F0410'){
					_followFail("followTopicMaxDiv");
					return;
				}
				//弹出错误页面
				_followFail("followTopicFailDiv");
			}
			
			function _followFail(divElem){
				jQuery.jdThickBox({
    						width: 300,
    						height: 80,
    						title: '关注失败', 
    				        source: _follow_con.find('#'+divElem).html()
    					}); 
    					return;
			}
			
			function _getFollowNum(url,followNumSuccessCallBack){
				jQuery.ajax({
					 async: false,//同步调用
					 url:url,
					 dataType:"jsonp",
					 success:function(data){
						followNumSuccessCallBack(data);
						
					 },
					 error: function(reques,msg){
						//弹出关注失败；
						_followShopFail();
						 
					 }
				 });
			};
			
			function _followed(divElem){
    					//获取关注数量
    					var title;
    					var url;
    
    					title="提示";
    					url = "http://follow.soa.jd.com/activity/queryForCount";
    					_getFollowNum(url,function(data){
    						var followedNum="您已关注"+data.data+"个活动\， ";
    						_follow_con.find('#followedNum').html(followedNum);
    
    						jQuery.jdThickBox({
    							width: 300,
    							height: 80,
    							title: title, 
    					        source: _follow_con.find('#'+divElem).html()
    						}); 
    					});
			}
			
			_init();
		}
		
	});
	
})(jQuery,window);/*
 * author:wanghaixin@jd.com
 * date:2013-10-10
 * version:1.0.0
 */
		
(function($,w){
	
	w.jshop.module.Countdown = w.jshop.module.Countdown || {};
	
	$.extend(w.jshop.module.Countdown,{
		_timer : null,
		_sysTime : null,
		_countdownList : [],
		base : (function(){
			var _timer = null,
				_sysTime = null,
				_countdownList = null;
			return function(arg){
				var _this = $(this),
				_args = $.extend({
					hasDay : true,
					dayCnt : '',
					hourCnt : '',
					minuteCnt : '',
					secondCnt : ''
				},arg || {}),
				_cut_time = null;
			
				function _init(){
					if(!_args.countDownInfo) return;
					_get_cut_time();
					_this.data('cutTime',_cut_time).data('arg',_args).data('over',false);
					_countdownList = $('[module-name="Countdown"] .j-module').toArray();
					if(!_timer){
						w.getServerTime(function(data){
							/*
							var __temp = data.split(' '),
								__string  = __temp[2];
							__string += ' ' + __temp[1] + ', ';
							__string += __temp[3] + ' ' + __temp[4];	
							
							
							 _sysTime = new Date() - new Date(__string) - 8*3600*1000;
							 */
							
							_sysTime = new Date() - data;
							
							 if(!_timer)
								_count_down()
						});
					}
				}
			
				function _get_cut_time(){
					var __cut_time_str = _args.countDownInfo,
						__row_temp = __cut_time_str.split(' '),
						__inplicit = __row_temp[0].split('-'),
						__explicit = __row_temp[1].split(':');
					_cut_time = new Date(Number(__inplicit[0]),(Number(__inplicit[1]) + 11)%12,Number(__inplicit[2]),Number(__explicit[0]),Number(__explicit[1]),Number(__explicit[2]));
				}
				
				function _count_down(){
					_timer = setInterval(function(){
						for(var i = 0, len = _countdownList.length ; i < len; i++){
							var __module = $(_countdownList[i]),
								__cut_time = __module.data('cutTime'),
								__arg = __module.data('arg'),
								__left_time = parseInt((__cut_time - new Date() + _sysTime)/1000);
							if(__left_time < 0){
								_countdownList.splice(i,1);
								break;
							}
							var __day = Math.floor(__left_time/(24*3600)),
								__hour = Math.floor(__left_time/3600) - (__arg.hasDay?__day*24:0),
								__minute = Math.floor(__left_time%3600/60),
								__second = __left_time%60;
							if(__arg.hasDay){
								__module.find(__arg.dayCnt).html(__day > 9?__day:'0' + __day);
							}
							__module.find(__arg.hourCnt).html(__hour > 9?__hour:'0' + __hour);
							__module.find(__arg.minuteCnt).html(__minute > 9? __minute:'0' + __minute);
							__module.find(__arg.secondCnt).html(__second > 9?__second:'0' + __second);
						}					
					},1000);
				}
				_init();
				
			};
		})()
			
	});
	w.getServerTime = function(callback){
		var _url = 'http://mall.jd.com/timeCache/getCurrentTime.html'+'?random=' + Math.random();
		$.ajax({
			url : _url,
			type : 'GET',
			dataType : 'jsonp',
			jsonp: 'jsonpCallback',
			success: function(date) {
				callback(date.systemTime);
	        },
	        error:function(){  
	        	
	        }  
		});
	};
})(jQuery,window);
(function($) {
	
	var ocurrent_module = null;
	var host = window.location.host;
	window.jshop.module.survey = window.jshop.module.survey || {};
	
	$.extend(window.jshop.module.survey,{
		base : function(args){
			
		},
		surveySummary:function(args){
			var that = $(this);
			//模块module-param参数非空校验
			if(args.surveyId == null || args.surveyId == '' || args.instanceId == null || args.instanceId == '' || args.modeId == null || args.modeId == '' || 
					args.templateId == null || args.templateId == '' || args.startBtn == null || args.startBtn == '' || args.verifyCode == null || args.verifyCode == ''){
				return;
			}
			var surveyId =  args.surveyId,
				instanceId = args.instanceId,
				modeId = args.modeId,
				templateId = args.templateId,
				startBtnObj = $(args.startBtn,that),
				verifyCodeObj = $(args.verifyCode,that),
				verifyCodeContent = null;
			
			
			
			verifyCodeObj.html(
					'<input type="text" class="surveyVerifyCode" maxlength="4"/>'+
					'<img class="surveyVerifyImg" title="看不清？点击刷新！" src="http://mall.jd.com/sys/vc/createVerifyCode.html?random=' + Math.random() +'"/>' + 
					'<span class="surveyVerifyError"></span>'
			);
			verifyCodeContent = $('.surveyVerifyCode',that);
			$('.surveyVerifyImg',that).click(function() {
		        $(this).attr('src', 'http://mall.jd.com/sys/vc/createVerifyCode.html' + '?random=' + Math.random());
		        verifyCodeContent.val('').focus();
		    });

			startBtnObj.click(function(){
				thick_login(function(){
					getSurveyDetail();
				});
			});	
			function getSurveyDetail(){
				if(host == 'jshop2013.jd.net' || host == 'jshop2013.jd.com'){
					alert('请在浏览页面查看问卷详情');
					return;
				}
				if(verifyCodeContent.val() == ''){
					$('.surveyVerifyError',that).html('验证码不能为空');
					return;
				}
				var module = that.closest('[instanceid]');
				var tempModule = module.html();
				module.html('<div class="loading"><span class="icon_loading"></span><em>努力加载中，请稍后...</em></div>');
				
				$.ajax({
		            type: 'post',
		            url : 'http://mall.jd.com/view/survey/getSurveyDetail.html',
		            dataType: 'jsonp',
		            data : {
						"moduleInstanceId":instanceId,
						"prototypeId":modeId,
				        "templateId": templateId,
				        "surveyId":surveyId,
				        "verifyCode":verifyCodeContent.val()
					},
		            success: function(data){
		            	if (data['result']&&data['result'] == true) {
							module.html(data['moduleText']);
							moduleRefresh.call(module.find('.j-module'));
						}else{
							module.html(tempModule);
							moduleRefresh.call(module.find('.j-module'));
							$('.surveyVerifyError',module).html(data['message']);
						}
		            },
		            error:function (XMLHttpRequest, textStatus, errorThrown) { }
		        });
			};
		},
		surveyDetail:function(args){

			var that = $(this);
			//模板预览时args.surveyId设置为空，不进行下面流程
			if(args.instanceId == null || args.instanceId == '' || args.modeId == null || args.modeId == '' || args.templateId == null || args.templateId == '' || 
					args.surveyId == null || args.surveyId == '' || args.startTime == null || args.startTime == '' || args.submitBtn == null || args.submitBtn == '' || 
					args.questions == null || args.questions == '' || args.scoreContent == null || args.scoreContent == '' || args.scoreIcon == null ||	args.scoreIcon == '' || 
					args.scoreIconCurrent == null || args.scoreIconCurrent == '' || args.scoreIdx == null || args.scoreIdx == '' ||
					args.matrixRow == null || args.matrixRow == '' || args.matrixContent == null || args.matrixContent == '' || args.matrixColumn == null || args.matrixColumn == '' ){
				return;
			}
			var instanceId = args.instanceId,
				modeId = args.modeId,
				templateId = args.templateId,
				surveyId =  args.surveyId,
				startTime = args.startTime,
				submitBtnObj = $(args.submitBtn,that),
				questionsObj = $(args.questions,that),
				scoreContent = args.scoreContent,
				scoreIcon = args.scoreIcon.replace(/\./g,''),
				scoreIconObj = $(args.scoreIcon,that),
				scoreIconCurrent = args.scoreIconCurrent.replace(/\./g,''),
				scoreIdx = args.scoreIdx,
				matrixRow = args.matrixRow,
				matrixContent = args.matrixContent,
				matrixColumn = args.matrixColumn;
				
			$('input[type="text"]',that).attr('maxlength','200');
			
			scoreIconObj.click(function(){
				var scoreTds = $(this).parent().parent().find(args.scoreIcon);
				$(scoreTds).attr('class', scoreIcon);
				for (var i = 1; i <= scoreTds.length; i++) {
					$(scoreTds[i - 1]).attr('class', scoreIcon + ' ' +scoreIconCurrent);
					if ($(this).attr(scoreIdx) == i) {
						break;
					}
				}
			});
			
	    	submitBtnObj.click(function(){
	    		thick_login(function(){
	    			submitSurvey();
				});
	    	});
	    	
	    	function submitSurvey(){
	    		if(host == 'jshop2013.jd.net' || host == 'jshop2013.jd.com'){
					alert('请在浏览页面查看问卷详情');
					return;
				}
				var size = questionsObj.length,
					originAnswers = '';
				for(var i=0; i<size; i++){
					var paramJson = questionsObj.eq(i).attr('param'),
					 	paramObj=eval("("+paramJson+")"),
					 	id = paramObj.id,
						type = paramObj.type,
						title = paramObj.title,
						answerValue = '';
						
					if(type == 'SingleChoice'){
						answerValue = $('input[name="' + id + '"]:checked').val();
						if(!validateAnswerValue(title,answerValue)){
							return;
						}
						answerValue = encodeURIComponent(answerValue);
						originAnswers = originAnswers + '{eQuestionId:"'+id+'",questionType:"'+type+'",answerDetails:"'+answerValue+'"},';
					}else if(type == 'MultipleChoice'){
						$('input[name="' + id + '"]:checked').each(function(){    
							answerValue = answerValue + $(this).val() + '|';    
						});
						answerValue = answerValue.substr(0, answerValue.length-1);
						if(!validateAnswerValue(title,answerValue)){
							return;
						}
						answerValue = encodeURIComponent(answerValue);
						originAnswers = originAnswers + '{eQuestionId:"'+id+'",questionType:"'+type+'",answerDetails:"'+answerValue+'"},';
					}else if(type == 'InputQuestion'){
						answerValue = $('input[name="' + id + '"]').val(); 
						if(!validateAnswerValue(title,answerValue)){
							return;
						}
						answerValue = encodeURIComponent(answerValue);
						originAnswers = originAnswers + '{eQuestionId:"'+id+'",questionType:"'+type+'",answerDetails:"'+answerValue+'"},';
					}else if(type == 'ScoreQuestion'){
						scoreObjList = $(args.scoreList,questionsObj.eq(i));
						for(var j=0;j<scoreObjList.length;j++){
							var optionContent = $(scoreContent,scoreObjList[j]).text();
							var score = $('.'+scoreIconCurrent,scoreObjList[j]).last().attr(scoreIdx);
							if(!validateAnswerValue(title,score)){
								return;
							}
							if(score){
								answerValue = answerValue + optionContent+'^'+score;
								if(j != scoreObjList.length-1) {
									answerValue += '|';
								}
							}
						}
						if(!validateAnswerValue(title,answerValue)){
							return;
						}
						answerValue = encodeURIComponent(answerValue);
						originAnswers = originAnswers + '{eQuestionId:"'+id+'",questionType:"'+type+'",answerDetails:"'+answerValue+'"},';
					}else if(type == 'MatrixSingle'){
						var rowOptionList = $(matrixRow,questionsObj.eq(i));
						for(var j=0;j<rowOptionList.length;j++){
							var answerValue = '';
							var index = $('td input[name="'+id+'-row-'+(j+1)+'"]:checked',rowOptionList[j]).parent().index();
							if(index<0) {
								alert('题目:' + title + '的答案不能为空！');
								return;
							}
							answerValue += $(matrixContent,rowOptionList[j]).text();
							answerValue += "&";
							answerValue += $(matrixColumn + ' th:eq('+index+')',questionsObj.eq(i)).text();
							answerValue = encodeURIComponent(answerValue);
							originAnswers = originAnswers + '{eQuestionId:"'+id+'",questionType:"'+type+'",answerDetails:"'+answerValue+'"},';
						};	
	
					}else if(type == 'MatrixMultiple'){
						var rowOptionList = $(matrixRow,questionsObj.eq(i));
						for(var j=0;j<rowOptionList.length;j++){
							var answerValue = "";
							answerValue += $(matrixContent,rowOptionList[j]).text();
							answerValue += "&";
							$('td input[name="'+id+'-row-'+(j+1)+'"]:checked',rowOptionList[j]).each(function(){
								var index = $(this).parent().index();
								if(index<0) {
									alert('题目:' + title + '的答案不能为空！');
									return;
								}
								answerValue += $(matrixColumn + ' th:eq('+index+')',questionsObj.eq(i)).text();
								answerValue += "|";
							});	
							answerValue = answerValue.substr(0, answerValue.length-1);
							answerValue = encodeURIComponent(answerValue);
							originAnswers = originAnswers + '{eQuestionId:"'+id+'",questionType:"'+type+'",answerDetails:"'+answerValue+'"},';
						};	
					}
				}
				originAnswers = originAnswers.substr(0, originAnswers.length-1);
				$.ajax({
		            type: 'post',
		            url : 'http://mall.jd.com/view/survey/submitSurvey.html',
		            dataType: 'jsonp',
		            data : {
		            	"moduleInstanceId":instanceId,
						"prototypeId":modeId,
				        "templateId": templateId,
						"surveyId":surveyId,
						"originAnswers":originAnswers,
						"startTime":startTime
					},
		            success: function(data){
		            	if (data['result']&&data['result'] == true) {
							var module = that.closest('[instanceid]');
							module.html(data['moduleText']);
						}else{
							alert(data['message']);
						}
		            },
		            error:function (XMLHttpRequest, textStatus, errorThrown) {
		            }
		        });
	    	};
	    	
	    	function validateAnswerValue(title,answerValue){
	    		if(!answerValue){
	    			if(title){
	    				alert('题目:' + title + '的答案不能为空！');
	    			}else{
	    				alert('答案不能为空！');
	    			}
	    			return false;
	    		}
	    		if(answerValue.length>500){
	    			alert('答案内容超长');
	    			return false;
	    		}
	    		var reg = /select|update|script|delete|exec|count|'|\\|"|\+|=|;|>|<|%/i;
	    		if(reg.test(answerValue)){
	    			alert('答案不能包含非法字符');
	    			return false;
	    		}
	    		return true;
	    	};
		}
	});
})(jQuery);
