'use strict';

angular.
module('history').
component('historyView', {
	templateUrl: 'history/history.template.html',
	controller: ['$resource', 'Utils',
		function HistoryController($resource, utils) {

			var self = this;

			self.utils = utils;
			self.entitiesTypes = ($resource('config/entities.json')).get();
			self.isShowLogDetails = false;
			self.selectedHistoryID = null;
			self.selectedHistoryDetails = {};

			self.showLogDetails = function(){
				//console.log('self.selectedHistoryID', self.selectedHistoryID)

				angular.forEach(self.entityHistory.result, function(value) {
					if(value.id == self.selectedHistoryID) console.log('entityhistory', value);
				});

				self.isShowLogDetails = true
			}

			self.submit = function(){		
				self.entityHistory = ($resource('https://mdx.sizmek.com/rest/history/entityhistory?id=' + self.entityID + '&type=' + self.entityType + '&sort=changedDate&order=desc', {}, {
					getHistory : {
						'method' : 'GET',
						'headers' : {
							'Authorization' : self.authorization
						},
						isArray: false
					}					
				})).getHistory({}, function(){});				
			}			

			//testing only
				self.authorization = '9fc57cfc-24ed-4ac3-b823-bc9fb215a7a1';
				self.entityType = 'Ad';
				self.entityID = '1074084109';
			//
		}
	]
});
