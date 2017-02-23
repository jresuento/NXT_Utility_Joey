'use strict';

angular.module('core.logparser').
factory('LogParser', ['Utils', 
function(Utils) {
	class LogParser{
		constructor(){
			//DeliveryGroup
				//DeliveryGroup.rootContainer.subContainers.subContainers
		}
		*start(){
			yield 1;
			yield 2;
		}
	}
	return new LogParser;
}]);