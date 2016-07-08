/**
 *
 * @authors 张明臣 (vest0804@gamil.com)
 * @date    2014-11-19 17:39:26
 * @version 1.0
 */
if(top.location.href != window.location.href){
	top.location.href = window.location.href
}
var app = {};
(function () {
	app = {
		client: {
			ios:'http://www.365rili.com/temp/tj.html?url=https://itunes.apple.com/us/app/pu-tao/id1116047926?l=zh&ls=1&mt=8',
			android: 'http://beta.qq.com/m/nlun'
		},
		open: function(url, ios, callback){
			var _url;
			var unInstallCallBack = function(){
				//判断回调如果不是function 就下载客户端
				if(Object.prototype.toString.call(callback) != "[object Function]"){
					if(app.getUa.weixin){
						//可以直接下载
						if(app.getUa.ios){
							location.href = 'http://itunes.apple.com/cn/app/365ri-li-xin-ban/id642101382?ls=1&mt=8';
						}
						else{
							location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.when.coco&g_f=991609";
						}
						// location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.when.coco&g_f=991609";
					}
					else{
						if(app.getUa.ios){
							location.href = 'http://itunes.apple.com/cn/app/365ri-li-xin-ban/id642101382?ls=1&mt=8';
						}
						else{
							location.href = "http://d2.365rili.com/coco.apk";
						}
					}
				}else{
					callback();
				}
			};
			if(Object.prototype.toString.call(url)=="[object Object]"){
				if(app.getUa.ios){
					_url = url.ios;
				}
				else if(app.getUa.android){
					_url = url.android;
				}
			}
			else{
				_url = url;
			}

			var openApp = function () {
				var iframe = document.createElement("iframe");
				iframe.style.display = "none";
				iframe.src = _url;
				document.body.appendChild(iframe);
				//保证所有浏览器能打开客户端，个别浏览器不支持iframe
				// window.location.href = _url;
			};

			/**
			 * 微信内判断
			 * 私有协议
			 */
			if(app.getUa.weixin && (function () {
				// 9以上微信会直接判断为已安装
				var ua = navigator.userAgent.toLowerCase();
				var re = /\(iphone; cpu iphone os ([\d\_]*) like mac os x\)/;
				var rs = ua.match(re);
				if(rs){
					var version = +rs[1].split('_')[0];
					if(version > 8){
						return false;
					}
				}
				return true;
			})()){
				app.getInstallStateInWeixin(
					function () {
						//安卓和某些情况下，此处打开app失败，需要setTimeout
						setTimeout(openApp, 16)
						WeixinJSBridge.invoke('closeWindow',{},function(res){});
					},
					_do
				);
				return false;
			}

			/**
			 * 其他环境判断（主要是正常浏览器内）
			 */
			if(window.AliansBridge || app.getUa.coco){
				window.location.href = _url;
				return false;
			}

			function _do () {
				var startTime = new Date().getTime();
				openApp();
				var interval = setTimeout(function () {
					var delay = (new Date().getTime()) - startTime;
					delay < 1020 && unInstallCallBack();
				}, 1000);

				/**
				 * 安卓注销callback， 大部分情况不好使
				 */
				window.onblur = function(){
					interval && clearTimeout(interval);
				};
			}

			_do();
		},
		getInstallStateInWeixin: function (yes, no) {
			var res = {};
			var onBridgeReady = function () {
				WeixinJSBridge.invoke("getInstallState",{
			        "packageUrl":"coco://",
			        "packageName":"com.when.coco"
			    },
			    function(e){
			        if(e.err_msg.indexOf("get_install_state:yes") > -1){
			        	yes && yes();
			        	res.state = 'yes';
			        	return res;
			        }
			        else{
			        	no && no();
			        	res.state = 'no';
			        	return res;
			        }
			    });
			}
			if (typeof WeixinJSBridge === "undefined"){
			    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			    res.state = 'notReady';
			    return res;
			}else{
			    onBridgeReady();
			}
		},
		call: function (opt) {
			/**
			 * opt.action
			 * 调用客户端的方法名
			 *
			 * opt.callBack
			 * 客户端返回值的回调方法
			 *
			 * opt.param
			 * 需要传递给客户端的参数，必须以数组的方式储存（保持有序提供给安卓），并且单元必须是hash指名形参与实参（ios需要形参），形式如下
			 * [
			 * 	{name: paramName},
			 * 	{value: paramValue}
			 * ]
			 */
			/**
			 * example
			 *  app.call({
					action: 'getEncryptHeaders',
					params: [
						{
							name: 'url',
							value: url
						}
					],
					callBack: function (headers) {

					}
				});
			 */
			var action = opt.action || null;
			var	callBack = opt.callback || opt.callBack || function(){};
			var	params = opt.params || [];
			//无方法名
			if(!action){
				throw '没有调用的action';
				return false;
			}

			//参数非数组：由于安卓的参数是有序的，不像ios是自取，所以必须是数组
			if(params && Object.prototype.toString.call(params).toLowerCase() != '[object array]'){
				throw '参数集不是数组';
				return false;
			}

			if(app.getUa.ios){
				//coco基底
				var cocourl = ['coco://365rili.com'];

				//加入action
				cocourl.push('/' + action);

				//生成随机函数名绑定客户端回调伪静态函数
				var staticFnRand = 'fn' + Math.ceil(app.random(1000000, 9999999));
				window[staticFnRand] = function () {
					// 只执行一次，发现里ios会执行2次
					if(window[staticFnRand]._exec > 0) return;
					window[staticFnRand]._exec++;
					//回调，传入所有参数
					callBack(arguments[0]);
					//删除随机方法
					setTimeout(function () {
						delete window[staticFnRand];
						//删除随机变量
						for (var i = 0; i < paramRandNameList.length; i++) {
							delete window[paramRandNameList[i]];
						};
					}, 16)
				};
				window[staticFnRand]._exec = 0;
				cocourl.push('?static=' + staticFnRand);
				/**
				 * 加入参数，生成名仍然是随机名，需要在使用完后清空
				 */
				var paramRandNameList = [];
				var paramRand;
				for (var i = 0; i < params.length; i++) {
					paramRand = 'p' + Math.ceil(app.random(1000000, 9999999));
					//抛出到window方便客户端调用，如
					//window['1000000'] = 'http://www.365rili.com';
					window[paramRand] = params[i]['value'];

					//生成参数表，如
					//&url=p1000000
					cocourl.push('&' + params[i]['name'] + '=' + paramRand);
					//储存随机变量名方便后面销毁
					paramRandNameList.push(paramRand);
				};

				//生成Coco地址
				cocourl = cocourl.join('');
				//调用coco
				window.location.href = cocourl;
			}
			else if(app.getUa.android){
				//处理参数，生成数组
				var args = [];
				for (var i = 0; i < params.length; i++) {
					args.push(params[i]['value']);
				}

				//执行安卓调用，以apply的形式调用，args为需要传递的参数
				var _val = AliansBridge[action].apply(AliansBridge, args);

				//执行前端回调，传入返回值
				callBack(_val);
			}
		},
		coco: (navigator.userAgent.toLowerCase().match(/vino/gi) || [''])[0],
		version: (function () {
			var data = (navigator.userAgent.toLowerCase().match(/(android|ios)-coco\|(.+)/gi) || [''])[0].split('|');

			if(data.length === 1){
				return 0;
			}

			var ver = data[2].split('.');

			for (var i = 0; i < ver.length; i++) {
				ver[i] || (ver[i] = 0);
			};

			return parseInt(ver.join(''));
		})(),
		random: function(n, m) {
	        return Math.random() * (m - n) + n
	    },
		getUa:(function(){
			//根据useragent判断当前的设备类型
			var sUserAgent = navigator.userAgent.toLowerCase();
			var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
			var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			var bIsAndroid = sUserAgent.match(/android/i) == "android";
			var bIsWeixin = sUserAgent.match(/micromessenger/i) == "micromessenger";
			var bIsWeibo = sUserAgent.match(/weibo/i) == "weibo";
			var bIsqq = sUserAgent.match(/qq/i) == "qq";
			var bIsIosCoco = sUserAgent.match(/ios-coco/i) == "ios-coco";
			var bIsAndroidCoco = sUserAgent.match(/android-coco/i) == "android-coco";
			return {
				ipad: bIsIpad,
				iphone: bIsIphoneOs,
				android:bIsAndroid,
				weibo: bIsWeibo,
				weixin: bIsWeixin,
				qq: bIsqq,
				ios: bIsIphoneOs || bIsIpad,
				iosCoco: bIsIosCoco,
				androidCoco: bIsAndroidCoco,
				coco: bIsIosCoco || bIsAndroidCoco
			}
		})(),
		query: query,
		_hm: function () {
			var hm = document.createElement("script");
			switch(window.location.host){
				case 'm.putaoputao.cn' :
					hm.src = "//hm.baidu.com/hm.js?d45e72c64de3950acfc6283146f8e46a";
					break;
			}
			document.getElementsByTagName("head")[0].appendChild(hm);
		},
		TJ: {
			send: function () {
				if(location.hostname !== 'qq.365rili.com'){
					return;
				}
			    var params = {};
			    //Document对象数据
			    if(document) {
			        params.domain = document.domain || '';
			        params.url = document.URL || '';
			        params.title = document.title || '';
			        params.referrer = document.referrer || '';
			    }
			    //Window对象数据
			    if(window && window.screen) {
			        params.sh = window.screen.height || 0;
			        params.sw = window.screen.width || 0;
			    }

			    //navigator对象数据
			    if(navigator) {
			    	var ua = navigator.userAgent.toLowerCase();
			        params.lang = navigator.language || '';
			        params.bs =  (function () {
				        if (ua == null) return "ie";
				        else if (ua.indexOf('chrome') != -1) return "chrome";
				        else if (ua.indexOf('opera') != -1) return "opera";
				        else if (ua.indexOf('msie') != -1) return "ie";
				        else if (ua.indexOf('safari') != -1) return "safari";
				        else if (ua.indexOf('firefox') != -1) return "firefox";
				        else if (ua.indexOf('gecko') != -1) return "gecko";
				        else return "ie";
				    })();
				    params.bsv = (function () {
				        if (ua == null) return "null";
				        else if (ua.indexOf('chrome') != -1) return ua.substring(ua.indexOf('chrome') + 7, ua.length).split(' ')[0];
				        else if (ua.indexOf('opera') != -1) return ua.substring(ua.indexOf('version') + 8, ua.length);
				        else if (ua.indexOf('msie') != -1) return ua.substring(ua.indexOf('msie') + 5, ua.length - 1).split(';')[0];
				        else if (ua.indexOf('safari') != -1) return ua.substring(ua.indexOf('safari') + 7, ua.length);
				        else if (ua.indexOf('gecko') != -1) return ua.substring(ua.indexOf('firefox') + 8, ua.length);
				        else return "null";
				    })();
				    params.sys = (function getSysInfo() {
				        if (ua.indexOf("nt 6.1") > -1) return 'Windows 7';
				        else if (ua.indexOf("nt 6.0") > -1) return 'Vista';
				        else if (ua.indexOf("nt 5.2") > -1) return 'Windows xp';
				        else if (ua.indexOf("nt 5.1") > -1) return 'Windows 2003';
				        else if (ua.indexOf("nt 5.0") > -1) return 'Windows 2000';
				        else if ((ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1)) return 'Windows';
				        else if ((ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1)) return 'Mac';
				        else if ((ua.indexOf("adobeair") != -1)) return 'Adobeair';
				        else if ((ua.indexOf("linux") != -1)) return 'Linux';
				        else return 'Unknow';
				    })();
					params.d = (function () {
			            if(ua.match(/ipad/i) != -1) return 'ipad';
			            else if(ua.match(/iphone os/i) != -1) return 'iphone';
			            else if(ua.match(/midp/i) != -1) return 'midp';
			            else if(ua.match(/ucweb/i) != -1) return 'ucweb';
			            else if(ua.match(/android/i) != -1) return 'android';
			            else if(ua.match(/windows ce/i) != -1) return 'windows ce';
			            else if(ua.match(/windows mobile/i) != -1) return 'windows mobile';
			            else return 'pc';
					})();
			    }

			    //解析_maq配置
			    var _maq = window._maq;
			    if(!_maq) {
			    	_maq = window._maq = [];
			    }

		        for(var i =0, len = _maq.length; i < len; i++) {
		            switch(_maq[i][0]) {
		                case '_setAccount':
		                    params.account = _maq[i][1];
		                    break;
		                case '_trackEvent':
		                	params.event = _maq[i].slice(1).join('|');
		                default:
		                    break;
		            }
		        }

		    	_maq.length = 0;
			    window._maq.push = app.TJ.push;

			    //拼接参数串
			    var args = '';
			    for(var i in params) {
			        if(args != '') {
			            args += '&';
			        }
			        args += i + '=' + encodeURIComponent(params[i]);
			    }

			    //通过Image对象请求后端脚本
			    var img = new Image(1, 1);
			    img.src = 'http://119.29.61.161/1.gif?' + args;
			    setTimeout(function () {
			    	img.src = '';
			    }, 2000);
			},
			push: function () {
				window._map[0] = arguments[0];
				app.TJ.send();
			}
		},
		template: function (s,o,defaults, index) {
		    index = index || 0;
		    if(typeOf(s) === 'undefined' || typeOf(o) === 'undefined') return '';
		    var _html = [];
		    defaults = defaults || {};
		    if(typeOf(o) === 'array'){
		        for (var i = 0, len = o.length; i < len; i++) {
		            _html.push(app.template(s, o[i], defaults, i));
		        };
		    }else{
		        var __o = {};
		        copyTo(o, __o);
		        apply(__o, defaults);
		        _html.push(s.replace(/\{\$([^}]*)\}/g, function(_,_o){
		        	var pValue = __o, dValue = o;
	        		for(var i = 0, pS = _o.split('.'); i < pS.length; i++){
	        			pValue = pValue ? pValue[pS[i]] : null;
	        			dValue = dValue ? dValue[pS[i]] : null;
	        		}
		            return typeOf(pValue) === 'function' ? pValue(dValue, o, __o, index) : (dValue || pValue || '');
		        }));
		    }
		    return _html.join('');
		},
		connectWebViewJavascriptBridge: function (callback) {
			if (window.WebViewJavascriptBridge) {
				callback(window.WebViewJavascriptBridge);
			} else {
				document.addEventListener('WebViewJavascriptBridgeReady', function() {callback(window.WebViewJavascriptBridge);}, false);
			}
		},
		needLogin: function (callback, url, data, backurl) {
			var _param = '';
			if(data){
				_param = $.param(data);
				url = url.indexOf('?') >= 0 ? url + '&' + _param : url + '?' + _param;
			}

			url = url ? window.location.protocol + '//' + location.hostname + url : window.location.href;
			if(app.coco){
				app.connectWebViewJavascriptBridge(function(bridge) {
	                bridge.callHandler('signature', {url: url}, function (response) {
	                	if(response['x-vino-http-key']){
	                		callback(response, url);
	                	}
	                	else{
	                		bridge.callHandler('login', {back: backurl || window.location.href}, function (){});
	                	}
	                });
	            });
			}
			else{
				if(app.GetCookie('auto-vino')){
					callback({}, url);
				}
				else{
					window.location.href = 'https://'+ window.location.hostname +'/action/account/login.html?back='+ (backurl ? encodeURIComponent(backurl) : '');
				}
			}
		},
		registForApp: function (name, fn) {
			if(app.coco){
				app.connectWebViewJavascriptBridge(function(bridge) {
					bridge.registerHandler(name, fn);
				})
			}else{
				window[name] = fn;
			}
		},
		setCookie: function (name, value, expires, path, domain, secure) {
	        var today = new Date();
	        today.setTime(today.getTime());
	        if (expires) {
	            expires = expires * 1000 * 60 * 60 * 24
	        };
	        var expires_date = new Date(today.getTime() + (expires));
	        document.cookie = name + '=' + escape(value) + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + ((path) ? ';path=' + path : '') + ((domain) ? ';domain=' + domain : '') + ((secure) ? ';secure' : '')
	    },
	    GetCookie: function (name) {
	        var value = null;
	        if (document.cookie && document.cookie != '') {
	            var cookies = document.cookie.split(';');
	            for (var i = 0; i < cookies.length; i++) {
	                var cookie = cookies[i].replace(/^\s+|\s+$/g, '');
	                if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    value = decodeURIComponent(cookie.substring(name.length + 1));
	                    break
	                }
	            }
	        }
	        return value
	    },
	    footer: function () {
			function getCss (opt) {
		        var link, href = opt.href || '',
		            datas = opt.datas || null,
		            callback = opt.callback || function() {};
		        var link = document.createElement('link');
		        link.href = href + '?' + (new Date).getTime();
		        link.rel = 'stylesheet';
		        var checkLink = function() {
		            var _t = false;
		            try {
		                if (link.sheet && link.sheet.cssRules.length > 0)
		                    _t = true;
		                else if (link.styleSheet && link.styleSheet.cssText.length > 0)
		                    _t = true;
		                else if (link.innerHTML && link.innerHTML.length > 0)
		                    _t = true;
		            } catch (ex) {
		                if (ex.name && ex.name == 'NS_ERROR_DOM_SECURITY_ERR')
		                    _t = true;
		            }
		            if (t) {
		                clearInterval(t);
		                callback(datas);
		            }
		        }

		        $(link).appendTo('head');
		        checkLink();
		        var t = setInterval(checkLink, 200);
		    }
		    getCss({
				href: 'http://m.putaoputao.cn/css/footer.css',
				callback: function () {
					var tmpl = $('<div class="___footer"><a href="javascript:;" class="footer_down_btn"><img src="/images/footerLogo.png" width="43" alt="" /><span>下载葡萄客户端，注册即享10元礼券！</span></a></div>');
					$("body").append(tmpl);
					var btn = $('.footer_down_btn');
					btn.on('click', function(){
		                if(app.getUa.ios){
		                    window.location.href = app.client.ios;
		                }
		                if(app.getUa.android){
		                    window.location.href = app.client.android;
		                }
					});
				}
			});
	    }
	}
	function copyTo(ce, e) {
	    for (var i in ce) {
	        if (typeof i === 'undefined') continue;
	        if (typeof ce[i] == 'object') {
	            e[i] = {};
	            if (ce[i] instanceof Array) e[i] = [];
	            copyTo(ce[i], e[i]);
	            continue;
	        }
	        e[i] = ce[i];
	    }
	}

	function apply(object, config, defaults) {
	    if (defaults) {
	        apply(object, defaults);
	    }
	    if (object && config && typeof config === 'object') {
	        var i, j;

	        for (i in config) {
	            object[i] = config[i];
	        }
	    }

	    return object
	}

	function typeOf(o) {
	    return /^\[object (.*)\]$/.exec(Object.prototype.toString.call(o).toLowerCase())[1];
	}
	function  query(name, href) {
	    var reg = new RegExp("(^|\\?|&)" + name + "=([^&^\#]*)(\\s|&|\#|$)", "i");
	    href = href || location.href;
	    if (reg.test(href)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " "));
	    return "";
	}

	if(app.coco){
		(function () {
	        var WVJBIframe = document.createElement('iframe');
	        WVJBIframe.style.display = 'none';
	        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	        document.documentElement.appendChild(WVJBIframe);
	        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 1000);
	    })();
	}

	app.TJ.send();

	if(app.GetCookie('needReload')){
		app.setCookie('needReload', '1', '-1', '/')
		window.location.reload(true);
	}

})();
if(typeof $ !== 'undefined')
	$(app._hm)
else
	app._hm();

export default app;
