'use strict';

angular.module('core.utils').
factory('Utils', [
function() {
	return {
		'format' : function(){
			var str, args;
			(typeof arguments[0] == 'object') ? (str = arguments[0][0], args = arguments[0]) : (str = arguments[0], args = arguments);	

			if(args.length > 1 && !str.match(/{\d}/g)){
				return utils.objtoArray(args).join(' ');
			}	

			str = str.replace(/{\d}/g, function(s){
				var k = (1 * s.match(/\d/)[0]) + 1;
				return typeof args[k] !== 'undefined' ? args[k] : s
			});

			return str
		},
		'extendobj' : function(destination, source){
			for(var i in source){
				destination[i] = source[i]
			}
			return destination;
		},
		'objtoArray' : function(obj){
			//this will drop keys in source
			var result = new Array;
			for(var i in obj){
				result.push(obj[i]);
			}
			return result;
		},		
		'paddingLeft' : function(a, b, c){
			var d = '';
			for(var e=0;e<c;e++) d += b;
			return String(d + a).slice(-1 * c);
		},
		'formatToDate' : function(utils, time){
			var d = new Date;
			d.setTime(time);
			return utils.format('{0}-{1}-{2} {3}:{4}:{5}.{6}', 
				d.getFullYear(),
				utils.paddingLeft(d.getMonth() + 1, '0', 2),
				utils.paddingLeft(d.getDate(), '0', 2),
				utils.paddingLeft(d.getHours(), '0', 2),
				utils.paddingLeft(d.getMinutes(), '0', 2),
				utils.paddingLeft(d.getSeconds(), '0', 2),
				d.getMilliseconds()
			);
		}
	}
}]);