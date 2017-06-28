;(function (window,document,undefined){
	/*jQuery工厂函数*/
	function jQuery(selector,prevObject){
		return new jQuery.fn.init(selector,prevObject);
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
			return (typeof obj === "object") && !jQuery.isWindow(obj) && obj.length && (typeof obj[obj.length - 1] !== "undefined");
		},
		/*判断传入的参数是否是window对象*/
		isWindow: function (obj){
			return obj && obj.window === obj;
		},
		/*判断传入的参数是否是数字*/
		isNumber: function (num){
			return num && !isNaN(parseFloat(num)) && isFinite(num);
		},
		/*判断传入的参数是否是元素*/
		isElement: function (ele){
			return ele && isFinite(ele.nodeType) && (ele.nodeName !== undefined);
		},
		/*判断传入的参数是否是函数*/
		isFunction: function (fn){
			return call_toString.call(fn) === "[object Function]";
		},
		/*获取传入的参数的数据类型*/
		type: function (data){
			//Boolean Number String Function Array Date RegExp Object
			return returnTypes[jQuery.inArray(types, call_toString.call(data))];
		},
		/*判断传入的参数是否是空对象*/
		isEmptyObject: function (obj){
			var name;
			//如果对象不是空的，则会进入这个循环中
			for(name in obj){
				return false;
			}
			return true;
		}
	});
	/*操作数组或伪数组*/
	jQuery.extend({
		/*获取指定元素在指定数组中的位置*/
		inArray: function (arr,target){
			if(!jQuery.isArray(arr)){
				return -1;
			}
			if(arr.indexOf){
				return arr.indexOf(target);
			}else{
				for (var i = 0,len = arr.length; i < len; i++) {
					if(arr[i] === target){
						return i;
					}
				}
			}
			return -1;
		},
		/*遍历数组的每一项并执行回调函数*/
		each: function (obj,fn){
			if(!obj || (typeof obj !== "object")){
				throw "必须传递需要遍历的对象或数组！";
			}
			if(!fn || !jQuery.isFunction(fn)){
				throw "必须传递一个回调函数！";
			}
			if(jQuery.isLikeArray(obj)){
				for (var i = 0,len = obj.length; i < len; i++) {
					var val = obj[i];
					if(fn.call(val, i, val) === false){
						break;
					}
				}
			}else{
				for (var i in obj) {
					var val = obj[i];
					if(fn.call(val, i, val) === false){
						break;
					}
				}
			}
			return obj;
		},
		/*过滤数组中的元素，如果回调函数返回false，那么就把该项过滤掉，
		如果该函数返回true，那么就把该项放入到一个新的数组中，最终返回一个新的数组*/
		grep: function (obj,fn){
			if(!obj || (typeof obj !== "object")){
				throw "必须传递需要遍历的对象或数组！";
			}
			if(!fn || !jQuery.isFunction(fn)){
				throw "必须传递一个回调函数！";
			}
			var ret = [];
			if(jQuery.isLikeArray(obj)){
				for (var i = 0,len = obj.length; i < len; i++) {
					var val = obj[i];
					if(fn.call(val, i, val) === true){
						ret.push(val);
					}
				}
			}else{
				for (var i in obj) {
					var val = obj[i];
					if(fn.call(val, i, val) === true){
						ret.push(val);
					}
				}
			}
			return ret;
		},
		/*遍历一个数组或对象，然后把遍历到的key和value传递给回调函数，
		并把回调函数的返回值收集起来装到一个数组中并返回该数组*/
		map: function (obj, fn){
			if(!obj || (typeof obj !== "object")){
				throw "必须传递需要遍历的对象或数组！";
			}
			if(!fn || !jQuery.isFunction(fn)){
				throw "必须传递一个回调函数！";
			}
			var ret = [],
				arr = jQuery.toArray(obj);
			if(jQuery.isLikeArray(obj)){
				for (var i = 0,len = obj.length; i < len; i++) {
					var val = obj[i];
					ret.push(fn.call(val, i, val));
				}
			}else{
				for (var i in obj) {
					var val = obj[i];
					ret.push(fn.call(val, i, val));
				}
			}
			return ret;
		},
		/*将一个伪数组转成真数组*/
		toArray: function (likeArray){
			if(typeof likeArray === "object" && !jQuery.isWindow(likeArray)){
				try{
					return call_slice.call(likeArray);
				}catch(e){
					/*IE8在将dom对象组成的伪数组通过call调用Array.prototype.slice时会报错，因此
						需要做额外处理*/
					return call_slice.call( [].concat.apply([], likeArray).slice(0));
				}
			}else{
				return [likeArray];
			}
		}
	});
	/*jQuery构造函数，入口函数*/
	var init = jQuery.fn.init = function (selector,prevObject){
		var that = this;
		/*如果传入的是""、false、undefined、null等转换后为false的值直接返回this*/
		if(!selector){return this;}
		/*处理传递字符串*/
		if(typeof selector === "string" && !jQuery.isNumber(selector)){
			//判断是否是HTML片段，如果是则生成dom元素
			if(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3){
				var div = document.createElement("div");
				div.innerHTML = selector;

				call_push.apply(that, jQuery.toArray(div.children));
			}else{
				//如果不是HTML片段则当做选择器来处理
				if(selector.charAt(0) === "#"){
					call_push.apply(that, [document.getElementById(selector.substr(1))]);
				}else{
					call_push.apply(that, jQuery.toArray(document.querySelectorAll(selector)));
				}
			}
			that.prevObject = {"0": document,"length": 1};
			return this;
		}
		/*处理传递对象，数组，伪数组*/
		if(jQuery.isLikeArray(selector)){
			call_push.apply(that, jQuery.toArray(selector));
			var prevObject = prevObject || {"0": document,"length": 1}
			that.prevObject = prevObject;
			return this;
		}
		/*处理传递dom对象或其他基本数据类型*/
		if(selector){
			call_push.apply(that,[selector]);
			if(selector.nodeType && selector.nodeName){
				var prevObject = prevObject || {"0": document,"length": 1}
				that.prevObject = prevObject;
			}
			return this;
		}
	}
	/*将init的原型对象设置为jQuery.fn的原因是为了方便对外编写插件*/
	init.prototype = jQuery.fn;

	/*筛选选折器*/
	jQuery.fn.extend({
		each: function (fn){
			if(!fn || !jQuery.isFunction(fn)){
				throw "必须传递一个回调";
			}
			return jQuery.each(this, fn);
		},
		/*获取元素集合中指定index的元素*/
		eq: function (index){
			return jQuery(this.get(index), this);
		},
		/*获取元素集合中指定index的dom元素*/
		get: function (index){
			var _index = isNaN(index * 1) ? 0 : (index < 0 ? (this.length + index) : index);
			_index > (this.length - 1) ? (this.length - 1) : _index;
			return this[_index];
		},
		/*筛选指定表达式的元素*/
		filter: function (express){
			var eles = jQuery(express),
				that = this,
				ret = [];
			that.each(function(index, ele) {
				eles.each(function(index2, ele2) {
					if(ele === ele2){
						ret.push(ele);
					}
				});
			});
			if(ret.length == 0){
				ret = undefined;
			}
			return jQuery(ret);
		},
		first: function (){
			return this.eq(0);
		},
		last: function (){
			return this.eq(this.length - 1);
		},
		map: function (fn){
			if(!fn || !jQuery.isFunction(fn)){
				throw "必须传递一个回调函数！";
			}
			return jQuery(jQuery.map(this, fn));
		},
		slice: function (){
			return jQuery(call_slice.apply(jQuery.toArray(this), arguments));
		},
		splice: function (){
			return call_splice.apply(this, arguments);
		},
		has: function (){},
		not: function (){}	
	});


	window.$ = window.jQuery = jQuery;
})(window,document,undefined);