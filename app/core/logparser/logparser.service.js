'use strict';

angular.module('core.logparser').
factory('LogParser', ['Utils', 
function(Utils) {
	class LogParser{
		*start(){
			yield 1;
			yield 2;
		}
	}
	return new LogParser;
}]);