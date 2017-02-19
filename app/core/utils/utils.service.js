'use strict';

angular.module('core.utils').
factory('Utils', [
function() {
	class Utils{
		format(){
			var str, args;
			(typeof arguments[0] == 'object') ? (str = arguments[0][0], args = arguments[0]) : (str = arguments[0], args = arguments);	

			if(args.length > 1 && !str.match(/{\d}/g)){
				return this.objtoArray(args).join(' ');
			}	

			str = str.replace(/{\d}/g, function(s){
				var k = (1 * s.match(/\d/)[0]) + 1;
				return typeof args[k] !== 'undefined' ? args[k] : s
			});
			return str
		}		
	}
	return new Utils;
}]);