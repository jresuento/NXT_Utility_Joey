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
		paddingLeft(a, b, c){
			var d = '';
			for(var e=0;e<c;e++) d += b;
			return String(d + a).slice(-1 * c);
		}
		msToDateTime(time){
			var d = new Date;
			d.setTime(time)
			return this.format('{0}-{1}-{2} {3}:{4}:{5}.{6}',
				d.getFullYear(),
				this.paddingLeft(d.getMonth() + 1, '0', 2),
				this.paddingLeft(d.getDate(), '0', 2),
				this.paddingLeft(d.getHours(), '0', 2),
				this.paddingLeft(d.getMinutes(), '0', 2),
				this.paddingLeft(d.getSeconds(), '0', 2),
				d.getMilliseconds()
			);
		}
	}
	return new Utils;
}]);