;(function (window,document,undefined){
	/*jQuery工厂函数*/
	function jQuery(selector,prevObject,baseEles){
		return new jQuery.fn.init(selector,prevObject,baseEles);
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
		},
		/*判断元素是否含有指定class、id或元素是否是指定的标签*/
		elementIsAvailableIn: function (ele,selector){
			if(!ele || !jQuery.isElement(ele)){
				return false;
			}
			if(!selector){
				return false;
			}
			if(selector.charAt(0) === "#"){
				return ele.id === selector.substr(1);
			}
			if(selector.charAt(0) === "."){
				return jQuery(ele).hasClass(selector.substr(1));
			}
			return ele.nodeName.toUpperCase() === selector.toUpperCase();
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

	/*处理dom树加载，dom树加载完毕后会立即执行传递的函数*/
	jQuery.ready = function (fn){
		if(!jQuery.isFunction(fn)){return;}
		if(this.execQueue == undefined){
			this.isReady = false;//判断dom树是否加载完毕
		}
		if(this.execQueue == undefined){
			this.execQueue = [];//存放事件队列，如果同时调用了多次ready方法，那么就要将回调存储起来，等dom树加载完毕后一起执行
		}
		var that = this;
		if(document.addEventListener){
			document.addEventListener("DOMContentLoaded", function (){
				fn.call(window);
				document.removeEventListener("DOMContentLoaded", arguments.callee);
			}, false);
			return;
		}else{
			//IE8判断dom是否加载完毕可以使用元素的doScroll()方法来实现
			this.execQueue.push(fn);
			doScroll();
		}
		function doScroll(){
			try{
				document.documentElement.doScroll("left");
			}catch(e){
				//如果dom树没有加载完成就一直调用doScoll方法，直到加载完成为止
				return setTimeout(arguments.callee, 20);
			}
			//走到这里说明dom树已经加载完毕了，dom树加载完毕后就可以执行回调函数了
			doExec();
		}
		/*执行事件回调*/
		function doExec(){
			if(!that.isReady){
				that.isReady = true;
				while(that.execQueue.length > 0){
					that.execQueue.shift().call(window);
				}
			}
		}
	}

	/*jQuery构造函数，入口函数。
	selector为选择器，prevObject为当前元素的上一级元素（不一定为当前元素的父元素，可以理解为当前元素是通过谁查找的），
	baseEles为查询前的元素*/
	var init = jQuery.fn.init = function (selector,prevObject,baseEles){
		var that = this;
		/*如果传入的是""、false、undefined、null等转换后为false的值直接返回this*/
		if(!selector){return this;}
		baseEles = baseEles ? baseEles : [document];
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
					var ret = [];
					jQuery.each(baseEles, function(index, ele) {
						if(jQuery.isElement(ele) || ele === document){
							ret.push.apply(ret,jQuery.toArray(ele.querySelectorAll(selector)));
						}
					});
					call_push.apply(that, ret);
				}
			}
			that.prevObject = {"0": document,"length": 1,"prevObject": null,"end": function (){return null}};
			return this;
		}
		/*处理传递对象，数组，伪数组，加上!selector.nodeType && !selector.nodeName这两个判断是为了排除select元素*/
		if(jQuery.isLikeArray(selector) && !selector.nodeType && !selector.nodeName){
			call_push.apply(that, jQuery.toArray(selector));
			var _prevObject = prevObject || {"0": document,"length": 1,"end": function (){return null}};
			that.prevObject = _prevObject;
			return this;
		}
		/*处理函数*/
		if(jQuery.isFunction(selector)){
			jQuery.ready(selector);
		}
		/*处理传递dom对象或其他基本数据类型*/
		if(selector){
			call_push.apply(that,[selector]);
			if(selector.nodeType && selector.nodeName){
				var _prevObject = prevObject || {"0": document,"length": 1,"end": function (){return null}};
				that.prevObject = _prevObject;
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
			return jQuery(this.get(index), this.prevObject);
		},
		/*获取元素集合中指定index的dom元素*/
		get: function (index){
			var _index = isNaN(index * 1) ? 0 : (index < 0 ? (this.length + index) : index);
			_index > (this.length - 1) ? (this.length - 1) : _index;
			return this[_index];
		},
		/*筛选指定表达式的元素*/
		filter: function (express){
			var eles = jQuery.isElement(express) ? jQuery(express) : jQuery(express, this, this.prevObject),
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
			return jQuery(ret, this.prevObject);
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
			return jQuery(jQuery.map(this, fn), this.prevObject);
		},
		slice: function (){
			return jQuery(call_slice.apply(jQuery.toArray(this), arguments), this.prevObject);
		},
		splice: function (){
			return jQuery(call_splice.apply(this, arguments), this.prevObject);
		},
		/*判断元素集合中是否有指定的元素、class、id*/
		has: function (express){
			var eles = jQuery(express),
				that = this,
				ret = true;
			that.each(function(index, ele) {
				var breakNow = false;
				eles.each(function(index2, ele2) {
					if(ele === ele2){
						breakNow = true;
						return (ret = false);
					}
				});
				if(breakNow){
					return false;
				}
			});
			return !ret;
		},
		/*获取所有元素中与传入的express不符合的元素*/
		not: function (express){
			var eles = jQuery(express),
				that = this;
			/**TODO
				目前IE8不能将指定项删除，但是length会改变
			*/
			that.each(function(index, ele) {
				eles.each(function(index2, ele2) {
					if(ele == ele2){
						call_splice.call(that,index,1);
					}
				});
			});
			return that;
		}	
	});

	/*遍历查找（遍历元素）*/
	jQuery.fn.extend({
		/*获取元素的子元素*/
		children: function (selector){
			var childrens = [],
				ret = [];
			this.each(function(index, ele) {
				childrens.push.apply(childrens, jQuery.toArray(ele.children));
			});
			//如果未传参数，则获取当前元素的所有子元素
			if(!selector){
				ret = childrens;
			}else if(typeof selector === "string"){
			/*如果传入了参数则按条件进行筛选*/
				$.each(childrens, function(index, ele) {
					if(jQuery.elementIsAvailableIn(ele, selector)){
						ret.push(ele);
					}
				});
			}
			if(ret.length === 0){
				ret = null;
			}
			childrens = null;
			return jQuery(ret, this);
		},
		/*获取元素的父元素，如果不传参则获取找到的第一个父元素，如果判断父元素是否符合
		传入的参数的要求*/
		parent: function (selector){
			var ret = [];
			this.each(function(index, ele) {
				var parent = null;
				if(ele.parentElement){
					/*如果是w3c标准浏览器则使用parentElement来获取元素的父元素，这样就不用
					考虑空白节点的问题了*/
					parent = ele.parentElement;
				}else{
					/*如果是IE或不支持parentElement的，则使用parentNode来获取，因为有可能获取的会
					是空白节点或注释节点，所以在这里清除下*/
					parent = ele.parentNode;
					while(parent && parent.nodeType !== 1){
						parent = parent.parentNode;
					}
				}
				if(selector){
					if(parent && jQuery.elementIsAvailableIn(parent, selector + ("")) && jQuery.inArray(ret, parent) == -1){
						ret.push(parent);
					}
				}else{
					if(parent && jQuery.inArray(ret, parent) == -1){
						ret.push(ele.parentElement);
					}
				}
			});
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret, this);
		},
		/*获取原素的所有父元素，如果不传参则获取当前元素的所有父元素，如果传参则一直找直到找到指定的那个父元素
		就不再往上找了，包括匹配到的那个*/
		parents: function (selector){
			var ret = [],
				parents = this.parent();

			/*首先默认当做没有传递参数，先获取当前元素的所有父元素，一直找到html标签为止*/
			ret.push.apply(ret, jQuery.toArray(parents));
			while(parents && parents.length && parents[parents.length - 1] !== null){
				parents = parents.parent();
				ret.push.apply(ret, jQuery.toArray(parents));
			}
			//如果传递了参数则从获取的所有父元素中进行筛选，只筛选符合参数的父元素
			if(selector){
				var _parents = [];
				jQuery.each(ret, function (index, item){
					if(item && jQuery.elementIsAvailableIn(item, (selector + ""))){
						_parents.push(item);
					}
				});
				ret = _parents;
			}
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret, this);
		},
		/*获取元素所有的父元素，直到遇到匹配的那个为止，不包括匹配到的那个*/
		parentsUntil: function (selector){
			var ret = [];

			if(!selector){
				//如果没有传递参数则获取当前元素的所有父元素
				return this.parents();
			}else{
				var parents = this.parent();
				parents.each(function(index, ele) {
					//遍历每一个获取到的父元素，如果该父元素不是用户想匹配的那个则继续往上查找，找到后就不再往上查找了
					if(!jQuery.elementIsAvailableIn(ele, (selector + ""))){
						//避免重复添加
						if(jQuery.inArray(ret,ele) == -1){
							ret.push(ele);
						}
						var tempParents = jQuery(ele).parent();
						var temp2 = [];
						while(tempParents.length && tempParents.length > 0 && tempParents[tempParents.length - 1]){
							var breakNow = true;
							tempParents.each(function(index2, ele2) {
								if(!jQuery.elementIsAvailableIn(ele2, (selector + ""))){
									//避免重复添加
									if(jQuery.inArray(ret,ele2) == -1){
										ret.push(ele2);
										temp2.push(ele2);
									}
								}
							});
							//如果temp2.length == 0就说明已经找到顶了，即html元素的父元素
							if(temp2.length == 0){
								temp2 = null;
								break;
							}
							/*如果temp2.length不等0就说明该元素还有父元素，并且该元素不是用户想匹配的那个元素，还可以继续往上找*/
							tempParents = jQuery(temp2).parent();
							temp2 = [];
						}
					}
				});
				parents = null;
				/* //这种方法会造成堆内存溢出
				var parents = this.parent();
				getParents(parents);
				function getParents(parents){
					var fn = arguments.callee;
					parents.each(function(index, ele) {
						//如果当前的这个父元素不是用户指定的则将其保存起来并继续往上查找
						if(!jQuery.elementIsAvailableIn(ele, (selector + ""))){
							ret.push(ele);
							fn($(ele).parent());
						}else{
							return false;
						}
					});
				}*/
			}
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret, this);
		},
		/*返回父元素中第一个position值为relative或absolute的元素*/
		offsetParent: function (selector){
			var ret = [];
			this.each(function(index, ele) {
				if(jQuery.isElement(ele)){
					var offsetParent = ele.offsetParent;
					if(selector){
						//符合用户查找的要求
						if(jQuery.elementIsAvailableIn(offsetParent, (selector + ""))){
							if(jQuery.inArray(ret,offsetParent) == -1){
								ret.push(ele.offsetParent);	
							}
						}else{
							//如果不符合则继续向上查找，直到找到null为止
							while((offsetParent = offsetParent.offsetParent) != null){
								if(jQuery.elementIsAvailableIn(offsetParent, (selector + ""))){
									if(jQuery.inArray(ret,offsetParent) == -1){
										ret.push(ele.offsetParent);	
									}
								}
							}
						}
					}else{
						if(jQuery.inArray(ret,offsetParent) == -1){
							ret.push(offsetParent);	
						}
					}
				}
			});
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*获取当前元素紧后面的第一个元素*/
		next: function (selector){
			var ret = [];
			//支持nextElementSibling的浏览器
			if(document.createElement("div").nextElementSibling){
				this.each(function(index, ele) {
					var next = ele.nextElementSibling;
					if(selector){
						if(jQuery.elementIsAvailableIn(next, (selector + ""))){
							if(next && jQuery.inArray(ret,next) == -1){
								ret.push(next);
							}
						}
					}else{
						if(next && jQuery.inArray(ret,next) == -1){
							ret.push(next);
						}
					}
				});
			}else{
				//不支持nextElementSibling的浏览器或者说是IE9以下的浏览器
				this.each(function(index, ele) {
					var next = ele.nextSibling;
					next = findNextElementSiblling(next);
					if(selector){
						if(jQuery.elementIsAvailableIn(next, (selector + ""))){
							if(next && jQuery.inArray(ret,next) == -1){
								ret.push(next);
							}
						}
					}else{
						if(next && jQuery.inArray(ret,next) == -1){
							ret.push(next);
						}
					}
				});
				//查找节点的下一个兄弟节点，并且查找到的节点必须是元素节点
				function findNextElementSiblling(ele){
					var nextElementSiblling = ele;
					if(!nextElementSiblling){return null;}
					//如果传递进来的下一个兄弟节点是一个元素节点的话直接返回该节点
					if(nextElementSiblling.nodeType === 1){
						return nextElementSiblling;
					}else{
						while((nextElementSiblling = nextElementSiblling.nextSibling) && nextElementSiblling.nodeType !== 1){
							if(nextElementSiblling == 1){
								break;
							}
						}
						return nextElementSiblling;
					}
				}
			}
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*获取当前元素后面的所有元素*/
		nextAll: function (selector){
			var ret = [];
			this.each(function(index, ele) {
				//先获取到当前元素的所有兄弟元素（包括它自己），并把它们转换成数组
				var childrenArr = selector ? jQuery.toArray($(ele).parent().children(selector + "")) : jQuery.toArray($(ele).parent().children()),
 					currentIndex = jQuery.inArray(childrenArr,ele);
 				/*如果没有传递参数则可以将当前元素及前面的元素全部干掉，然后剩下的就是当前元素的后面的所有兄弟元素了。
 				如果传递了参数就不可以这样，因为这样可能会导致杀不干净，即当前元素前面的元素杀不掉*/
 				if(!selector){
	 				childrenArr.splice(0, (currentIndex + 1));
	 				if(childrenArr.length > 0){
	 					//ret.push.apply(ret, childrenArr);//使用这种方式会重复添加
	 					jQuery.each(childrenArr, function (index2,item){
	 						if(jQuery.inArray(ret, item) == -1){
	 							ret.push(item);
	 						}
	 					});
	 				}
 				}else{
 					jQuery.each(childrenArr, function(index, item) {
 						if(index > currentIndex){
 							if(jQuery.elementIsAvailableIn(item,(selector + "")) && jQuery.inArray(ret, item) == -1){
	 							ret.push(item);
	 						}
 						}
 					});
 				}
			});
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*获取当前元素前面的第一个元素*/
		prev: function (selector){
			var ret = [];
			//支持previousElementSibling的浏览器
			if(document.createElement("div").previousElementSibling){
				this.each(function(index, ele) {
					var next = ele.previousElementSibling;
					if(selector){
						if(jQuery.elementIsAvailableIn(next, (selector + ""))){
							if(next && jQuery.inArray(ret,next) == -1){
								ret.push(next);
							}
						}
					}else{
						if(next && jQuery.inArray(ret,next) == -1){
							ret.push(next);
						}
					}
				});
			}else{
				//不支持previousElementSibling的浏览器或者说是IE9以下的浏览器
				this.each(function(index, ele) {
					var next = ele.previousSibling;
					next = findPrevElementSiblling(next);
					if(selector){
						if(jQuery.elementIsAvailableIn(next, (selector + ""))){
							if(next && jQuery.inArray(ret,next) == -1){
								ret.push(next);
							}
						}
					}else{
						if(next && jQuery.inArray(ret,next) == -1){
							ret.push(next);
						}
					}
				});
				//查找节点的下一个兄弟节点，并且查找到的节点必须是元素节点
				function findPrevElementSiblling(ele){
					var prevElementSiblling = ele;
					if(!prevElementSiblling){return null;}
					//如果传递进来的下一个兄弟节点是一个元素节点的话直接返回该节点
					if(prevElementSiblling.nodeType === 1){
						return prevElementSiblling;
					}else{
						while((prevElementSiblling = prevElementSiblling.previousSibling) && prevElementSiblling.nodeType !== 1){
							if(prevElementSiblling == 1){
								break;
							}
						}
						return prevElementSiblling;
					}
				}
			}
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*获取当前元素前面的所有元素*/
		prevAll: function (selector){
			var ret = [];
			this.each(function(index, ele) {
				//先获取到当前元素的所有兄弟元素（包括它自己），并把它们转换成数组
				var childrenArr = jQuery.toArray($(ele).parent().children()),
 					currentIndex = jQuery.inArray(childrenArr,ele);

 				jQuery.each(childrenArr, function (index, item){
 					//如果传递了参数则先判断元素是否符合要求
 					if(selector){
 						//如果符合要求并且是当前这个元素前面的元素则添加进去
 						if(jQuery.elementIsAvailableIn(item,(selector + "")) && index < currentIndex && jQuery.inArray(ret, item) == -1){
							ret.push(item);
						}
 					}else{
 						//如果没有传递参数，并且遍历到的这个元素是当前元素前面的元素则添加进去
 						if(index < currentIndex && jQuery.inArray(ret, item) == -1){
							ret.push(item);
						}
 					}
 					if(index >= currentIndex){return false;}
 				});
			});
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*指定元素后面的所有的同辈元素，直到遇到匹配的那个为止，不包括匹配到的那个*/
		nextUntil: function (selector){
			//如果没有传递参数则获取当前元素后面的所有兄弟元素
			if(!selector){
				return jQuery(this.nextAll(), this);
			}
			var ret = [];
			//如果传递了参数，则获取到匹配的那个兄弟元素为止，不包括匹配的那个兄弟元素
			this.each(function(index, ele) {
				//先获取到当前元素的所有兄弟元素（包括它自己），并把它们转换成数组
				var allBrotherAndSelfArr = jQuery.toArray($(ele).parent().children()),
					currentIndex = jQuery.inArray(allBrotherAndSelfArr, ele);
				//从当前元素的下一个元素开始遍历
				for(var i = (currentIndex + 1),len = allBrotherAndSelfArr.length; i < len; i ++){
					var nextBrother = allBrotherAndSelfArr[i];
					if(jQuery.elementIsAvailableIn(nextBrother,(selector + ""))){
						break;
					}
					if(nextBrother && jQuery.inArray(ret,nextBrother) == -1){
						ret.push(nextBrother);
					}
				}
			});
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*指定元素前面的所有的同辈元素，直到遇到匹配的那个为止*/
		prevUntil: function (selector){
			if(!selector){
				return this.prevAll();
			}
			var ret = [];
			//如果传递了参数，则获取到匹配的那个兄弟元素为止，不包括匹配的那个兄弟元素
			this.each(function(index, ele) {
				//先获取到当前元素的所有兄弟元素（包括它自己），并把它们转换成数组
				var allBrotherAndSelfArr = jQuery.toArray($(ele).parent().children()),
					currentIndex = jQuery.inArray(allBrotherAndSelfArr, ele);
				/*因为是获取元素的前面的兄弟元素，所以必须要倒着来遍历*/
				for(var i = allBrotherAndSelfArr.length - 1; i >= 0; i --){
					//如果i小于当前元素的下标，那么它肯定是当前元素前面的元素
					if(i < currentIndex){
						var prevBrother = allBrotherAndSelfArr[i];
						if(jQuery.elementIsAvailableIn(prevBrother,(selector + ""))){
							break;
						}
						if(prevBrother && jQuery.inArray(ret,prevBrother) == -1){
							ret.push(prevBrother);
						}
					}
				}
			});
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*获取元素的子元素，包括文字和注释节点*/
		contents: function (){
			var ret = [];
			this.each(function (index, ele){
				ret.push.apply(ret, jQuery.toArray(ele.childNodes));
			});
			/*因为不会有重复的节点所以可以不用这种方式
			this.each(function (index, ele){
				jQuery.each(ele.childNodes, function (indexe,item){
					if(jQuery.inArray(ret, item) == -1){
						ret.push(item);
					}
				});
			});*/
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*终止在当前链的最新过滤操作，并返回匹配元素的以前状态*/
		end: function (){
			if(this.prevObject){
				return this.prevObject;
			}
			return null;
		},
		/*查找当前元素下指定的所有后代元素*/
		find: function (selector){
			var ret = [],
				_selector = selector ? selector : "*";
			this.each(function(index, ele) {
				ret.push.apply(ret, ele.querySelectorAll(_selector));
			});
			if(ret.length == 0){
				ret = null;
			}
			return jQuery(ret,this);
		},
		/*获取元素的索引值*/
		index: function (ele){
			//如果不传参数则获取当前元素在当前元素的所有兄弟元素中的位置
			if(!ele){
				var allBrotherElesArr = jQuery.toArray($(this[0]).parent().children());
				return jQuery.inArray(allBrotherElesArr, this[0]);
			}
			//如果传递参数了则获取指定元素在当前元素集合中的位置
			//不管用户传递的是什么都将其包装下，这样就不需要过多的判断了，然后再获取第一个元素
			var _ele = jQuery(ele)[0],
				currentElesArr = jQuery.toArray(this);
			return jQuery.inArray(currentElesArr, _ele);
		}
	});
	
	/*获取元素的HTML、text或值*/
	jQuery.fn.extend({
		/*设置或获取元素的html内容*/
        html: function (html){
        	if(!html || (html + "").length == 0){
        		return this[0].innerHTML;
        	}
        	this.each(function(index, ele) {
        		ele.innerHTML = (html + "");
        	});
        	return this;
        },
        /*设置或获取元素的文本内容*/
        text: function (text){
        	if(!text || (text + "").length == 0){
        		var textArr = [];
        		this.each(function(index, ele) {
        			textArr.push(ele.innerText);
        		});
        		return textArr.join("");
        	}
        	this.each(function(index, ele) {
        		ele.innerText = (text + "");
        	});
        	return this;
        },
        val: function (val){
        	//如果没有传递参数，则是获取元素的值
        	if(val === undefined || val === null){
        		var ele = this[0],
        			returnvalue = "";
        		if(ele.nodeName === "SELECT"){
        			returnvalue = getAndSetSelectValue(ele);
        		}else if(ele.nodeName === "OPTION"){
        			returnvalue = getOptionValue(ele);
        		}else if(ele.type === "checkbox"){
        			//如果是checkbox，则获取所有选中的checkbox的值
        			returnvalue = [];
        			this.each(function(index, ele) {
        				if(this.checked){
        					returnvalue.push(this.value);
        				}
        			});
        		}else{
        			//如果元素不是select或option，则直接获取它们的value值
        			returnvalue = ele.value;
        		}
        		return returnvalue;
        	}
        	//如果传递了参数则设置值
        	this.each(function(index, ele) {
        		if(ele.nodeName === "SELECT"){
        			getAndSetSelectValue(ele,val);
        		}else{
        			this.value = (val + "");
        		}
        	});
        	return this;
        }
	});
	/*获取或设置select元素的值*/
	function getAndSetSelectValue(ele,val){
		if(ele.nodeName !== "SELECT"){
			return "";
		}
		//设置select元素的值
		if(val !== undefined){
			var options = ele.options,
				multiple = ele.multiple;
			for(var i = 0,len = options.length; i < len; i ++){
				if(getOptionValue(options[i]) == (val + "")){
					options[i].selected = true;
					//如果不是多选的，则设置第一个后就退出循环
					if(!multiple){
						break;
					}
				}
			}
			return ele;
		}
		var returnvalue = "";
		//select元素是多选的
		if(ele.multiple){
			returnvalue = [];
			//w3c标准浏览器中多选下拉框有被选中的选项都可以通过selectedOptions来获取
			if(ele.selectedOptions){
				var selectedOptions = ele.selectedOptions;
				for(var i = 0,len = selectedOptions.length; i < len; i ++){
					returnvalue.push(getOptionValue(selectedOptions[i]));
				}
			}else{
				var options = ele.options;
				for(var i = 0,len = options.length; i < len; i ++){
					var option = options[i];
					if(option.selected){
						returnvalue.push(getOptionValue(option));
					}
				}
			}
		}else{
			returnvalue = ele.value;
		}
		return returnvalue;
	}
	/*获取或设置option元素的值*/
	function getOptionValue(ele, val){
		if(ele.nodeName !== "OPTION"){
			return "";
		}
		//设置option元素的值
		if(val !== undefined){
			ele.value = (val + "");
			return ele;
		}
		if(ele.hasAttribute){
			return ele.hasAttribute("value") ? ele.value : "";
		}else{
			//IE浏览器判断option标签是否有value属性及获取option标签获取value属性值得方式
			return ele.attributes["value"].specified ? ele.value : "";
		}
	}
	
	/*获取css属性值及转换驼峰命名*/
	jQuery.extend({
		/*获取css属性值*/
		getCss: function (ele,cssAttr){
			if(!jQuery.isElement(ele)){
				throw "第一个参数必须是一个dom元素！";
			}
			if(cssAttr === undefined){
				throw "必须传递需要获取的css属性名称！";
			}
			cssAttr = jQuery.convertToHump(cssAttr + "");
			var val = "";
			//w3c获取元素css属性值
			if(window.getComputedStyle){
				val = ele.ownerDocument.defaultView.getComputedStyle(ele,null)[cssAttr];
			}else{
				//IE获取元素css属性值
				val = ele.currentStyle[cssAttr];
			}
			return val;
		},
		/*将background-color、-webkit-、-moz等转换成驼峰命名*/
		convertToHump: function (name){
			name = (name + "");
			name = name.charAt(0) == "-" ? name.substr(1) : name;
			return name.replace(/\-(\w{1})/g, function (matchedStr, g1){
				return g1.toUpperCase();
			});
		}
	});


	/*操作样式*/
	jQuery.fn.extend({
		/*判断元素是否有指定的class*/
		hasClass: function (classname){
			var classnameArr = (classname + " ").split(" "),
				hasClass = false;
			this.each(function(index, ele) {
				var _className = ele.className.split(" "),
					breakNow = false;
				//确保元素一开始就没有class的情况也能判断正确
				if(_className.length == 1 && (_className[0] == "" || _className[0] == " ")){
					return false;
				}
				$.each(classnameArr,function(i, item) {
					/*//使用这种方法，在匹配bg-red等class时就会出错，因为"-"符号在正则中是连接符
						//目前还没找到转义"-"字符的方法
					if(new RegExp("\\b" + item + "\\b","g").test(_className)){
						hasClass = true;
						breakNow = true;
						return false;
					}*/
					//如果用户传递不是字符串，则将其转成字符串
					item = (item + "");
					if(item.length > 0 && jQuery.inArray(_className, item) != -1){
						hasClass = true;
						breakNow = true;
						return false;
					}
				});
				if(breakNow){
					return false;
				}
			});
			return hasClass;
		},
		/*添加样式*/
		addClass: function (classname){
			if(classname === undefined){
				return this;
			}
			var classnameArr = (classname + "").split(" ");
			//支持classList的浏览器则使用classList来操作样式
			if(document.createElement("div").classList){
				this.each(function(index, ele) {
					var classList = ele.classList;
					jQuery.each(classnameArr, function (index, classname){
						if(!classList.contains(classname)){
							ele.classList.add(classname);
						}
					});
				});
			}else{
				//IE9及以下IE浏览器或不支持classList的元素使用这种方式添加class
				this.each(function(index, ele) {
					var eleClassname = ele.className || "";
					jQuery.each(classnameArr, function (index2, classname){
						if(!$(ele).hasClass(classname)){
							eleClassname += (" " + classname);
						}
					});
					ele.className = eleClassname;
				});
			}
			return this;
		},
		/*移除样式*/
		removeClass: function (classname){
			//如果没有传递参数则移除元素的所有class
			if(!classname){
				this.each(function(index, ele) {
					this.className = "";
				});
				return this;
			}
			var classnameArr = (classname + "").split(" ");
			//支持classList的浏览器则使用classList来操作样式
			if(document.createElement("div").classList){
				this.each(function(index, ele) {
					var classList = ele.classList;
					jQuery.each(classnameArr, function (index, classname){
						if(classList.contains(classname)){
							ele.classList.remove(classname);
						}
					});
				});
			}else{
				//IE9及以下IE浏览器或不支持classList的元素使用这种方式移除class
				this.each(function(index, ele) {
					var eleClassname = (ele.className || "").split(" ");
					jQuery.each(classnameArr, function (index2, classname){
						var index = jQuery.inArray(eleClassname, classname);
						if(index !== -1){
							eleClassname.splice(index, 1);
						}
					});
					ele.className = eleClassname.join(" ");
				});
			}
			return this;
		},
		/*切换样式*/
		toggleClass: function (classname){
			if(!classname){
				this.each(function(index, el) {
					this.className = "";
				});
				return this;
			}
			var classnameArr = (classname + "").split(" ");
			this.each(function(index, ele) {
				var self = $(this);
				jQuery.each(classnameArr, function (index2, classname){
					if(self.hasClass(classname)){
						self.removeClass(classname);
					}else{
						self.addClass(classname);
					}
				});
			});
			return this;
		},
		/*设置或获取元素的css属性值 */
		css: function (){
			var args = arguments,
				argsLen = args.length;
			if(argsLen == 1){
				var cssAttr = args[0];
				//如果只传递了一个参数，并且该参数还是字符串，则获取元素指定的css属性值
				if(typeof cssAttr === "string"){
					return jQuery.getCss(this[0], cssAttr);
				}
				//如果传递的参数是一个对象，则设置元素的css属性
				if(jQuery.type(cssAttr) == "object" && !jQuery.isLikeArray(cssAttr)){
					this.each(function(index, ele) {
						jQuery.each(cssAttr, function(cssAttr, cssVal) {
							//如果传递的值不能转换成数字则直接使用这些值，如果可以转换成数字则转换成数字，但百分百的除外，如：100%、50%等
							var _cssVal = (cssVal + "").charAt((cssVal + "").length - 1) == "%" ? (cssVal + "") : (isNaN(parseFloat(cssVal)) ? cssVal : (parseFloat(cssVal) + "px"));
							if(_cssVal == undefined || _cssVal == null){
								return;
							}
							ele.style[jQuery.convertToHump(cssAttr)] = _cssVal;
						});
					});
					return this;
				}
			}
			if(argsLen >= 2){
				var cssAttr = jQuery.convertToHump(args[0]),
					cssVal = args[1];
				this.each(function(index, ele) {
					ele.style[cssAttr] = cssVal;
				});
			}
			return this;
		}
	});
	/*获取浏览器滚动条的位置*/
	function scroll(){
		if(window.pageXOffset && window.pageXOffset != undefined){
			return {
				top: window.pageXOffset,
				left: window.offsetYOffset
			}
		}else if(document.compactMode == "CSS1Compat"){
			//如果浏览器不是处于怪异模式，即网页有声明dtd（即有声明<!DOCTYPE html>）
			return {
				top: document.documentElement.scrollTop,
				left: document.documentElement.scrollLeft	
			}
		}
		//浏览器处于怪异模式
		return {
			top: document.body.scrollTop,
			left: document.body.scrollLeft
		}
	}
	
	/*获取或设置元素的宽度、高度、元素的位置*/
	jQuery.fn.extend({
		/*设置或获取元素的宽度*/
		width: function (width){
			//如果未传递参数则获取第一个元素的宽度
			if(width != "auto" && isNaN(parseFloat(width))){
				var _width = jQuery.getCss(this[0],"width");
				/**TODO*/
				/*在IE8中会有问题，如果元素设置的宽度为100%，那么获取到的就是100%，而如果元素的宽度为auto则可以获取到该元素的宽度，
				所以在这里做个兼容，但对于10%、50%这种就没办法了，还有待解决*/
				if(_width === "100%"){
					this[0].style.width = "auto";
					_width = jQuery.getCss(this[0],"width");
				}
				return isNaN(parseFloat(_width)) ? this[0].offsetWidth : parseFloat(_width);
			}

			if(width != "auto" && (width + "").charAt(width.length - 1) != "%"){
				width = parseFloat(width) + "px";
			}
			this.each(function (){
				//IE8中如果设置宽度为50%，则必须将其转成字符串才能添加上去
				this.style.width = (width + "");
			});
			return this;
		},
		/*设置或获取元素的高度*/
		height: function (height){
			//如果未传递参数则获取第一个元素的宽度
			if(height != "auto" && isNaN(parseFloat(height))){
				var _height = jQuery.getCss(this[0],"height");
				/**TODO*/
				/*在IE8中会有问题，如果元素设置的高度为100%，那么获取到的就是100%，而如果元素的高度为auto则可以获取到该元素的高度，
				所以在这里做个兼容，但对于10%、50%这种就没办法了，还有待解决*/
				if(_height === "100%"){
					this[0].style.height = "auto";
					_height = jQuery.getCss(this[0],"height");
				}
				return isNaN(parseFloat(_height)) ? this[0].offsetHeight : parseFloat(_height);
			}

			if(height != "auto" && (height + "").charAt(height.length - 1) != "%"){
				height = parseFloat(height) + "px";
			}
			this.each(function (){
				this.style.height = (height + "");
			});
			return this;
		},
		/*设置或获取元素的位置*/
		offset: function (offset){
			//如果未传递参数，或传递到额参数不是一个对象的话则直接返回第一个元素距离浏览器最左边及最上边的距离
			if(offset == undefined || (jQuery.type(offset) != "object" || jQuery.isLikeArray(offset))){
				var returnvalue = {},
					ele = this[0].offsetParent,
					left = this[0].offsetLeft,
					top = this[0].offsetTop;
				while(ele != null){
					left += ele.offsetLeft;
					top += ele.offsetTop;
					ele = ele.offsetParent;
				}

				returnvalue.left = left;
				returnvalue.top = top;
				return returnvalue;
			}
			//如果传递了参数，并且该参数参数是一个对象，并且该对象中有left、top属性则设置这些元素的left、top值
			if(offset == undefined && (offset.left == undefined || offet.top == undefined)){
				return this;
			}
			var top = (offset.top + "").charAt((offset.top + "").length - 1) == "%" ? (offset.top + "") : (isNaN(parseFloat(offset.top)) ? offset.top : parseFloat(offset.top)),
				left = (offset.left + "").charAt((offset.left + "").length - 1) == "%" ? (offset.left + "") : (isNaN(parseFloat(offset.left)) ? offset.left : parseFloat(offset.left))
			this.each(function(index, ele) {
				var self = $(ele);
				if(self.css("position") == "static"){
					self.css({
						"position": "relative",
						"top": top,
						"left": left
					});
				}else{
					self.css({
						"top": top,
						"left": left
					});
				}
			});
			return this;
		},
		/*获取元素相对于它父元素的位置（父元素必须有position）*/
		position: function (){
			//获取元素相对于父元素的距离
			var returnvalue = {},
				ele = this[0];

			returnvalue.left = ele.offsetLeft;
			returnvalue.top = ele.offsetTop;
			return returnvalue;
		},
		/*获取或设置元素滚动条距离顶端的位置*/
		scrollTop: function (val){
			//如果没有传递参数，则获取元素滚动条的位置
			if(isNaN(parseFloat(val))){
				var ele = this[0];
				if(jQuery.isWindow(ele) || ele === document){
					return scroll().top;
				}
				return ele.scrollTop;
			}
			/*TODO
				给浏览器设置滚动条的位置在webkit引擎浏览器中不起作用
				给元素设置滚动条的位置在所有浏览器中都不起作用*/
			val = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
			this.each(function(index, ele) {
				if(!jQuery.isWindow(ele) && ele !== document){
					ele.scrollTop = val + "px";
				}else{
					window.scrollTo(0,val);
				}
			});
			return this;
		},
		/*获取或设置元素滚动条距离最左端的位置*/
		scrollLeft: function (val){
			//如果没有传递参数，则获取元素滚动条的位置
			if(isNaN(parseFloat(val))){
				var ele = this[0];
				if(jQuery.isWindow(ele) || ele === document){
					return scroll().left;
				}
				return ele.scrollLeft;
			}
			val = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
			this.each(function(index, ele) {
				if(!jQuery.isWindow(ele) && ele !== document){
					ele.scrollLeft = val + "px";
				}else{
					window.scrollTo(val,0);
				}
			});
			return this;
		}
	});

	/*获取元素中以 data- 开头的所有节点及节点值*/
	function getDataAttr(ele,attrName){
		var ret = {},
			attrs = ele.attributes;
		for(var i = 0,len = attrs.length; i < len;i ++){
			var attrAndVal = attrs[i],
				attr = attrAndVal["name"],
				val = attrAndVal["value"];
			if(attrName){
				if(/data\-/.test(attr) && attr === ("data-" + attrName)){
					ret[attr.replace(/data\-/,"")] = val;
					break;
				}
			}else{
				if(/data\-/.test(attr)){
					ret[attr.replace(/data\-/,"")] = val;
				}
			}
		}
		return ret;
	}

	/*操作元素节点属性及操作属性*/
	jQuery.fn.extend({
		//判断元素是否有指定的属性
		hasAttr: function (attr){
			if(typeof attr !== "string"){
				return false;
			}
			var ele = this[0];
			if(!jQuery.isElement(ele)){
				return false;
			}
			if(ele.nodeName === "OPTION" && attr === "value"){
				if(ele.hasAttribute){
					return ele.hasAttribute("value");
				}else{
					//在IE中判断option元素是否有value元素时必须使用这种方式
					return ele.attributes("value").specified;
				}
			}
			return ele.hasAttribute(attr);
		},
		//操作元素节点属性
		attr: function (){
			var args = arguments,
				argsLen = args.length;
			/*如果只传递了一个参数，并且该参数是字符串，则获取元素指定的属性节点值。
			如果传递的参数是一个对象，并且该对象不是数组、伪数组，则对元素进行设置属性节点*/
			if(argsLen == 1){
				var attrs = args[0];
				if(typeof attrs === "string"){
					if(!jQuery(this[0]).hasAttr(attrs)){
						return "";
					}else{
						return this[0].getAttribute(attrs);
					}
				}
				if(jQuery.type(attrs) == "object" && !jQuery.isLikeArray(attrs)){
					this.each(function(index, ele) {
						jQuery.each(attrs, function(attr, val) {
							ele.setAttribute((attr + ""), val);
						});
					});
				}
				return this;
			}
			//如果传递了2个及以上参数，那么设置元素指定的属性节点值
			var attr = args[0] + "",
				val = args[1];
			this.each(function(index, ele) {
				ele.setAttribute((attr + ""), val);
			});
			return this;
		},
		//操作属性
		prop: function (){
			var args = arguments,
				argsLen = args.length;
			/*如果只传递了一个参数，并且该参数是字符串，则获取元素指定的属性节点值。
			如果传递的参数是一个对象，并且该对象不是数组、伪数组，则对元素进行设置属性节点*/
			if(argsLen == 1){
				var attrs = args[0];
				if(typeof attrs === "string"){
					return this[0][attrs];
				}
				if(jQuery.type(attrs) == "object" && !jQuery.isLikeArray(attrs)){
					this.each(function(index, ele) {
						jQuery.each(attrs, function(attr, val) {
							ele[(attr + "")] = val;
						});
					});
				}
				return this;
			}
			//如果传递了2个及以上参数，那么设置元素指定的属性节点值
			var attr = args[0] + "",
				val = args[1];
			this.each(function(index, ele) {
				ele[(attr + "")] = val;
			});
			return this;
		},
		//操作以 data-xxx 的节点属性
		data: function (){
			var args = arguments,
				argsLen = args.length;
			//如果不传参数则获取元素的所有以 data- 开头的节点属性
			if(argsLen == 0){
				return getDataAttr(this[0]);
			}
			
			if(argsLen == 1){
				var attrs = args[0];
				//如果传了一个参数并且该参数是字符串类型的则获取元素的指定名字的以 data- 开头的节点属性
				if(typeof attrs === "string"){
					return getDataAttr(this[0], attrs)[attrs];
				}
				//如果传递的参数是一个对象，并且该对象不是数组、伪数组，则给该元素进行批量设置以 data- 开头的节点属性
				if(jQuery.type(attrs) == "object" && !jQuery.isLikeArray(attrs)){
					this.each(function(index, ele) {
						jQuery.each(attrs, function (attr, val){
							ele.setAttribute(("data-" + attr), val);
						});
					});	
				}
				return this;
			}
			//如果传递了2个及以上参数，则给该元素设置指定的以 data- 开头的节点属性
			var attr = args[0],
				val = args[1];
			this.each(function(index, ele) {
				ele.setAttribute(("data-" + attr), val);
			});	
			return this;
		}
	});

	//绑定事件
	function bindEvent(ele, delegationSelector, eventType, callBack, one){
		if(document.addEventListener){
			//给元素绑定事件
			ele.addEventListener(eventType, function (event){
				var that = this,
					target = event.target;
				//循环遍历指定事件类型中存储的所有回调函数，然后依次调用它
				jQuery.each(ele.eventCache[eventType], function(index, fn) {
					//事件委托模式事件绑定
					if(delegationSelector && (delegationSelector).length > 0){
						//jQuery(delegationSelector)这里可能会造成一定的性能浪费，但目前还没想到更好的解决方案
						jQuery.each(jQuery(delegationSelector), function(index2, item) {
							if(target === item){
								fn.call(item, event);
								//如果one为true，则表示只绑定一次，然后就移除
								if(one){
									ele.eventCache[eventType].splice(index, 1);
								}
							}
						}); 
					}else{
						//普通事件绑定
						fn.call(that, event);
						if(one){
							ele.eventCache[eventType].splice(index, 1);
						}
					}
				});
			}, false);
		}else if(document.attachEvent){
			//IE浏览器使用attachEvent绑定事件有可能会造成内存溢出，但不使用这个方式而使用onxxx方式的话，很容易被人覆盖掉
			ele.attachEvent(("on" + eventType), function (){
				var event = window.event,
					target = event.srcElement;
				//统一阻止默认行为及阻止事件冒泡的方法
				event.preventDefault = function (){
					event.returnValue = false;
				}
				event.stopPropergation = function (){
					event.calcelBubble = true;
				}

				//循环遍历指定事件类型中存储的所有回调函数，然后依次调用它
				jQuery.each(ele.eventCache[eventType], function(index, fn) {
					//事件委托模式事件绑定
					if(delegationSelector && (delegationSelector).length > 0){
						jQuery.each(jQuery(delegationSelector), function(index2, item) {
							if(target === item){
								fn.call(item, event);
								if(one){
									ele.eventCache[eventType].splice(index, 1);
								}
							}
						}); 
					}else{
						//普通事件绑定
						fn.call(ele, event);
						if(one){
							ele.eventCache[eventType].splice(index, 1);
						}
					}
				});
			});
		}
	}

	/*事件绑定，这两个方法仅作为内部使用，外部要调用也是可以使用的*/
	jQuery.extend({
		/*绑定事件，该方法仅作为内部使用。ele代表给谁绑定事件，delegationSelector表示被委托元素的选择器（如果传递了该元素则使用事件委托绑定事件）。
		eventType为事件类型，callBack为回调函数*/
		bindEvent: function (ele,delegationSelector,eventType,callBack,one){
			if(!jQuery.isElement(ele)){
				throw "必须传递绑定事件的元素！";
			}
			if(!jQuery.isString(eventType) || eventType.length === 0){
				throw "必须传递事件类型！";
			}

			callBack = jQuery.isFunction(callBack) ? callBack : function (){};
			/*将所有的事件回调函数都保存到元素本身的eventCache属性中，这样就方便我们去操作这些回调函数*/
			//如果元素本身没有eventCache，则说明还没有绑定过任何类型的事件，那么我们就给该元素绑定指定的事件，并把事件回调存储到元素本身的eventCache中
			if(ele.eventCache == undefined){
				ele.eventCache = {};

				ele.eventCache[eventType] = [callBack];
				bindEvent(ele, delegationSelector, eventType, callBack, one);
			}else{
				/*如果元素本身有了eventCache，那么判断这个eventCache中是否有指定类型事件的数组，如果没有则说明该元素还没有添加过该类型的事件，
				那么就在eventCache中存储该事件类型，并存储事件回调函数。如果有则直接添加即可*/
				if(ele.eventCache[eventType] != undefined){
					/*如果元素已经绑定过一次指定类型的事件了，我们只需要把传递的事件回调函数存储到元素本身上的eventCache对象上即可，然后就会执行它了*/
					ele.eventCache[eventType].push(callBack);
				}else{
					ele.eventCache[eventType] = [callBack];
					bindEvent(ele, delegationSelector, eventType, callBack, one);
				}
			}
			return ele;
		},
		/*解绑事件，该方法仅作为内部使用*/
		offEvent: function (ele, eventType, callBack){
			if(!jQuery.isElement(ele)){
				throw "必须传递需要移除事件的dom元素！";
			}
			var argsLen = arguments.length,
				eventCache = ele.eventCache;
			//如果只传递了元素，则清空该元素的所有事件
			if(argsLen == 1){
				jQuery.each(eventCache, function(index, item) {
					item.length = 0;
				});
			}else if(argsLen == 2){
				//如果传递了指定事件类型，但未传递要移除哪个事件则移除所有的指定类型的回调
				eventCache[eventType] != undefined ? (eventCache[eventType] = []) : 1;
			}else if(argsLen == 3){
				var events = eventCache[eventType];
				//既传递了事件类型，又传递了指定回调函数，则删除指定事件类型中的指定回调函数
				if(events.length > 0){
					jQuery.each(events, function(index, fn) {
						if(fn === callBack){
							events.splice(index, 1);
							return false;
						}
					});
				}
			}
			return ele;
		}
	});
	/*事件绑定，对外使用*/
	jQuery.fn.extend({
		/*绑定事件*/
		on: function (eventType, delegationSelector, callBack){
			//如果只传递了一个参数，并且该参数是一个对象，注意不是数组或伪数组，则说明用户可能想一次性绑定多个事件 
			if(arguments.length == 1 && jQuery.type(eventType) == "object" && !jQuery.isLikeArray(eventType)){
				var events = eventType;
				this.each(function(index, ele) {
					jQuery.each(events, function (eventName, cb){
						jQuery.bindEvent(ele, "", (eventName + ""), cb);
					});
				});
				return this;
			}

			if(jQuery.isFunction(delegationSelector)){
				callBack = delegationSelector;
				delegationSelector = "";
			}
			this.each(function(index, ele) {
				jQuery.bindEvent(ele, delegationSelector, eventType, callBack);
			});
			return this;
		},
		/*移除事件*/
		off: function (eventType, callBack){
			this.each(function(index, ele) {
				if(eventType != undefined && callBack != undefined){
					jQuery.offEvent(ele, eventType, callBack);
				}else if(eventType != undefined){
					jQuery.offEvent(ele, eventType);
				}else if(eventType == undefined){
					jQuery.offEvent(ele);
				}
				
			});
			return this;
		},
		/*只绑定一次事件*/
		one: function (eventType, fn){
			if(!jQuery.isFunction(fn)){
				throw "必须传递回调函数！";
			}
			this.each(function(index, ele) {
				jQuery.bindEvent(ele, "", eventType, fn, true);
			});
			return this;
		}
	});
	
	/*添加便捷操作的事件方法*/
	jQuery.each(( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu" ).split(" "),function (index,eventName){
		jQuery.fn[eventName] = function (fn){
			fn = jQuery.isFunction(fn) ? fn : function (){};
			this.each(function(index, ele) {
				jQuery.bindEvent(ele, "", eventName, fn, false);
			});
		}
	});

	/*TODO
		动画、动画这块的小算法暂未去研究，因此这里只做show、hide两个方法*/
	jQuery.fn.extend({
		//显示元素
		show: function (){
			this.each(function(index, ele) {
				if(this._display == undefined && $(this).css("display") != "none"){
					this._display = $(this).css("display");
				}
				if(this._display == undefined){
					this.style.display = "block";
				}else{
					this.style.display = this._display;
				}
			});
			return this;
		},
		//隐藏元素
		hide: function (){
			this.each(function(index, ele) {
				if(this._display == undefined && $(this).css("display") != "none"){
					this._display = $(this).css("display");
				}
				this.style.display = "none";
			});
			return this;
		}
	});

	/*生成指定位数的随机字符串*/
	function getUUID(count){
		count = count || 32;
		var chars = "";
		for(;chars.length < count;){
			chars += Math.random().toString(36).substr(2);
		}
		return chars.substr(0, count);
	}

	/*ajax操作*/
	jQuery.extend({
		/*ajax默认设置*/
		_ajaxSetting: {
			url: "",
			type: "get",
			dataType: "json",//返回的数据类型
			contentType: "application/x-www-form-urlencoded",//如果为post请求则必须加上这个请求头
			data: null,
			async: true,//是否异步
			cache: false,//是否缓存
			timeout: 5000,//超时时间
			callBackParam: "callBack",//回调函数参数名称
			callBackFn: "",//jsonp时的回调函数名称
			success: function (){},//成功回调
			error: function (){},//失败回调
			complete: function (){},//请求完成回调
			beforeSend: function (){}//请求发送前回调
		},
		/*获取XMLHttpRequest对象*/
		_getXhr: function (){
			try{
				return new XMLHttpRequest();//现代浏览器
			}catch(e){
				return new ActiveXObject("Msxml2.XMLHTTP");//IE6
				try{
					return new ActiveXObject("Microsoft.XMLHTTP");//IE5.5及更早版本的IE浏览器
				}catch(e){
					return null;
				}
			}
		},
		/*拼接参数，将一个对象拼接成地址栏中的参数的格式*/
		_jointParam: function (data){
			if(data == undefined || jQuery.type(data) != "object" || jQuery.isLikeArray(data)){
				return null;
			}
			var param = '';
			for(var attr in data){
				param += (attr + "") + "=" + encodeURI(data[attr]) + "&";
			}
			param = param.substr(0, (param.length - 1));
			return param;
		},
		_notJsonp: function (options){
			var _options = jQuery.extend({}, jQuery._ajaxSetting, options),
				xhr = jQuery._getXhr(),//第一步，获取xhr对象
				data = jQuery._jointParam(_options.data),
				type = _options.type.toLowerCase(),
				url = _options.url.length == 0 ? location.href : _options.url,
				timer = null;
			if(!_options.cache){
				//加上时间戳为了避免缓存
				url += "?_timestep=jQuery_" + new Date().getTime();
			}
			//第二步，打开与服务器的链接
			if(type === "get"){//get请求
				if(data && data.length > 0){
					xhr.open("GET", (url + (!_options.cache ? "&" : "?") + data), _options.async);
				}else{
					xhr.open("GET", url, _options.async);
				}
				data = null;
			}else if(type === "post"){
				xhr.open("POST", url, _options.async);
			}
			//第三步：设置回调函数
			xhr.onreadystatechange = function (){
				if(this.readyState == 4){
					_options.complete();
					if(this.status >= 200 && this.status <= 304){
						var responseText = this.responseText;
						clearTimeout(timer);
						if(_options.dataType.toLowerCase() == "json"){
							responseText = jQuery.parseJson(responseText);
						}
						_options.success(responseText);
					}
				}
			}
			//第四步：发送请求
			if(type === "post"){
				xhr.setRequestHeader("Content-type", _options.contentType);
			}
			xhr.send(data);//get请求时发送的数据为null，如果不传可能会造成部分浏览器请求发送失败
			//超时后直接中断请求
			setTimeout(function (){
				xhr.abort();
			}, _options.timeout);
		},
		//jsonp请求
		jsonp: function (options){
			var _options = jQuery.extend({}, jQuery._ajaxSetting, options),
				data = jQuery._jointParam(_options.data),
				url = _options.url.length == 0 ? "" : _options.url,
				callBackParam = _options.callBackParam || "callBack",
				callBackFn = "";
			if(!_options.callBackFn){
				callBackFn = "jQuery_" + getUUID();
				window[callBackFn] = function (data){
					_options.success.call(window, data);
				}
			}else{
				callBackFn = _options.callBackFn;
			}
			if(!_options.cache){
				url += "?_timestep=jQuery_" + new Date().getTime();
				url += (data == null ? "" : ("&" + data)) + "&" + callBackParam + "=" + callBackFn;
			}else{
				//加?_lyn_a=1参数是为了后面好连接参数，不然又要做判断
				url += (data == null ? "?_lyn_a=1" : ("?" + data)) + "&" + callBackParam + "=" + callBackFn;
			}
			
			//创建script标签
			var scriptEle = document.createElement("script");
			scriptEle.type = "text/javascript";
			scriptEle.src = url;
			scriptEle.onload = scriptEle.onreadystatechange = function (data){
				if(!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
					document.body.removeChild(scriptEle);
					scriptEle.onload = scriptEle.onreadystatechange = null;
				}
			}
			document.body.appendChild(scriptEle);
		},
		ajax: function (options){
			if(options.type != undefined && (options.type + "").toLowerCase() === "jsonp"){
				jQuery.jsonp(options);
			}else if(options != undefined){
				jQuery._notJsonp(options);
			}
		},
		post: function (url,data,fn){
			if(jQuery.isFunction(data)){
				fn = data;
			}
			jQuery.ajax({
				url: url,
				type: "post",
				data: data,
				success: fn
			});
		},
		get: function (url,data,fn){
			if(jQuery.isFunction(data)){
				fn = data;
			}
			jQuery.ajax({
				url: url,
				type: "get",
				data: data,
				success: fn
			});
		},
		//将json字符串转换成json对象
		parseJson: function (jsonStr){
			if(!jQuery.isString(jsonStr) || jsonStr.length < 2){
				return null;
			}
			if(window.JSON){
				return JSON.parse(jsonStr);
			}else{
				return new Function ("return " + jsonStr + ";")();
			}
		}
	});
	
	/*获取表单元素的值*/
	function getFormElementValue(ele){
		if(!jQuery.isElement(ele) || !ele.value){return null;}
		var ret = {},
			nodeName = ele.nodeName.toLowerCase(),
			name = ele.name,
			//排除的input标签
			ignoreEle = {"button": 1,"submit": 1,"file": 1};
		switch(nodeName){
			case "input":
				var type = ele.type;
				if(!(type in ignoreEle)){
					if(type == "radio" ){
						if(ele.checked){
							ret[name] = ele.value;
						}
					}else if(type == "checkbox"){
						ret = [];
						var values = jQuery(ele).val();
						for(var i = 0,len = values.length; i < len;i ++){
				 			ret.push({
				 				name: values[i]
				 			});
				 		}
					}else{
						ret[name] = ele.value;
					}
				}
				break;
			case "textarea":
				ret[name] = ele.value;
			 	break;
			case "select":
			 	var values = jQuery(ele).val();
			 	//下来框为单选的
			 	if(typeof values === "string"){
			 		ret[name] = values;
			 	}else{
			 		//下来框为多选的
			 		ret = [];
			 		for(var i = 0,len = values.length; i < len;i ++){
			 			ret.push({
			 				name: values[i]
			 			});
			 		}
			 	}
			 	break;
			default: 
				ret[name] = ele.value;
				break;
		}
		return ret;
	}

	/*表单序列化*/
	jQuery.fn.extend({
		//将表单序列化成参数形式的字符串
		serialize: function (){},
		//将表单序列化成一个数组
		serializeArray: function (){
			var formEles = [],
				ret = [];
			//筛选form标签
			this.each(function(index, ele) {
				if(this.nodeName === "FORM"){
					formEles.push(this);
				}
			});
			jQuery.each(formEles, function (index,form){
				//遍历每一个form标签下面的所有表单元素
				jQuery.each(this.elements, function(index2, ele) {
					var values = getFormElementValue(ele);
					if(jQuery.isArray(values)){
						for(var i = 0,len = values.length; i < len; i ++){
							var value = values[i];
							if(!jQuery.isEmptyObject(value)){
								ret.push(value);
							}
						}
					}else{
						if(values && !jQuery.isEmptyObject(values)){
							ret.push(values);	
						}
					}
				});
			});
			return ret;
		}
	});

	window.$ = window.jQuery = jQuery;
})(window,document,undefined);