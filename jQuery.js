;(function (window,document,undefined){
	/*jQuery工厂函数*/
	function jQuery(selector){
		return new jQuery.fn.init(selector);
	}
	var call_push = Array.prototype.push,
		call_slice = Array.prototype.slice,
		call_splice = Array.prototype.splice,
		call_toString = Object.prototype.toString;

	jQuery.fn = jQuery.prototype = {
		constructor: jQuery,
		version: "1.0.0"
	}

	jQuery.extend = jQuery.fn.extend = function (){
		var deep,target = arguments[0] ,original,current,i = 0,args = arguments,argsLen = args.length;
		
		if(typeof args[0] !== "boolean" && !args[0]){
			return this;
		}
		//如果只传递了一个参数，则目标对象就是this
		if(argsLen === 1 && typeof args[0] !== "boolean"){
			target = this;
		}
		if(argsLen >= 2 && typeof args[0] !== "boolean"){
			target = args[0];
		}
		//如果传递了多个参数，并且第一个参数为boolean类型，那么用户可能是想进行深度合并
		if(argsLen >= 2 && typeof args[0] === "boolean"){
			deep = args[0];
			target = args[1];
			i = 2;
		}

		for( ; i < argsLen; i ++){
			var tempobj = args[i];
			for(var attr in tempobj){
				original = target[attr];
				current = tempobj[attr];
				var originalIsObject = typeof original === "object",
					currentIsObject = typeof current === "object";

				if(original === current){
					continue;
				}
				//进行深度合并
				if(deep && originalIsObject && currentIsObject){
					/*如果需要深度合并，则目标对象的值需是一个对象，并且当前对象的值也需是一个对象，
					并且值不能是一个数组*/
					var originalIsArray = ({}).toString.call(original) === "[object Array]",
						currentIsArray = ({}).toString.call(current) === "[object Array]";

					if(!originalIsArray && !currentIsArray){
						/*因为这里的original是目标对象的一个属性值，并且original也是一个对象，它在内存中存储的也是一个地址，
						所以改变original，目标对象的original也就改变了
						*/
						args.callee(deep, original, current);
					}
				}else{
					target[attr] = current;
				}
			}
		}
		/*返回目标对象，如果目标对象是一个jQuery对象则可以链式编程，如果不是也可以方便操作*/
		return target;
	}

	var types = [],//存储原始数据类型
		//返回的数据类型
		returnTypes = ["boolean","number","string","function","array","date","regExp","object"];
	;(function (){
		for(var i = 0, len = returnTypes.length; i < len; i ++){
			types.push("[object " + (returnTypes[i].substr(0,1).toUpperCase() + returnTypes[i].substr(1)) + "]");
		}
	})();
	
	/*工具函数*/
	jQuery.extend({
		/*去除字符串两端空格*/
		trim: function (str){
			if(("").trim){
				return (str + "").trim();
			}else{
				/*(str + "").replace(/(^\s*)|(\s*$)/g,"")，IE8及以下不支持*/
				return (str + "").replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
			}
		},
		each: function (){

		},
		/*判断传入的参数是否是字符串*/
		isString: function (str){
			return typeof str;
		},
		/*判断传入的参数是否是数组*/
		isArray: function (arr){
			return call_toString.call(arr) === "[object Array]";
		},
		/*判断传入的参数是否是数组或伪数组*/
		isLikeArray: function (obj){

		},
		/*判断传入的参数是否是window对象*/
		isWindow: function (obj){
			return obj && obj.window === obj;
		},
		/*判断传入的参数是否是数字*/
		isNumber: function (num){

		},
		/*判断传入的参数是否是元素*/
		isElement: function (ele){
			return ele && ele.nodeType && ele.nodeName;
		},
		/*判断传入的参数是否是函数*/
		isFunction: function (fn){
			return fn && call_toString.call(fn) === "[object Function]";
		},
		/*获取传入的参数的数据类型*/
		type: function (data){
			//Boolean Number String Function Array Date RegExp Object

		},
		/*判断传入的参数是否是空对象*/
		isEmptyObject: function (obj){
			var name;
			if(!obj){
				return false;
			}
			//如果对象不是空的，则会进入这个循环中
			for(name in obj){
				return true;
			}
			return false;
		}
	});

	/*jQuery构造函数*/
	var init = jQuery.fn.init = function (selector){

	}
	/*将init的原型对象设置为jQuery.fn的原因是为了方便对外编写插件*/
	init.prototype = jQuery.fn;




	window.$ = window.jQuery = jQuery;
})(window,document,undefined);