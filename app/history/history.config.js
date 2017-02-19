'use strict';

angular.
module('history').
component('historyView', {
	templateUrl: 'history/history.template.html',
	controller: ['$rootScope', '$cookies', 'Utils', 'Rest',
		function HistoryController($rootScope, $cookies, utils, rest) {

			var self = this;
			self.entityConfig = rest.getEntityConfig.get()

			self.submit = function(){
				rest.getHistory.start({
					'entityID': self.entityID,
					'entityType': self.entityType
				}).$promise.then(res => {
					console.log('result', res)
				 	//log parser
				});
			}
		}
	]
});
