'use strict';

angular.
module('history').
component('historyView', {
	templateUrl: 'history/history.template.html',
	controller: ['Utils', 'Rest', 'Cookies', 'LogParser', 
		function HistoryController(Utils, Rest, Cookies, LogParser) {

			var self = this;
			self.entityHistory = null,
			self.showLogDetailsObj = null

			Rest.getEntityConfig.get().$promise
			.then(res => {
				self.entityConfig = res
			})
			Rest.getStatusMessages.get().$promise
			.then(res => {
				self.statusMessages = res.messages
			})
			Rest.authorization = self.authorization = Cookies.getSSID();
			self.hasError = !1;
			self.hasMsg = !1;

			self.submit = function(){

				if(!self.authorization|| !self.entityType || !self.entityID){
					self.showMsg(self.statusMessages.MissingFields, !0)
					return;
				}
				self.entityHistory = null;
				Rest.getHistory().start({
					'entityID': self.entityID,
					'entityType': self.entityType
				}).$promise
				.then(res => {
					LogParser.constructEntityHistory(res), 
					console.log('res', res), 
					console.log('LogParser.entityHistory', LogParser.entityHistory),
					self.entityHistory = LogParser.entityHistory;
				})
				.catch(err => {		
					self.showMsg(err.status == 401 ? self.statusMessages.Unauthorized : JSON.stringify(err.data), !0)
				});
			}

			self.showMsg = function(msg, iserr){			
				!!iserr && (self.hasMsg = !1, self.hasError = !0) || (self.hasError = !1, self.hasMsg = !0)
				this.statusMsg = msg;

				setTimeout(function(){ 
					self.hasError = !1, self.hasMsg = !1;
				}, 3000);
			}

			self.showLogDetails = function(log){
				console.warn('showLogDetails', log)
				self.showLogDetailsObj = log;
			}

			self.hideLogDetails = function(){
				self.showLogDetailsObj = null;		
			}

			//testonly
			self.entityType = 'DeliveryGroup', self.entityID = '1073815164'
			//self.entityType = 'Ad', self.entityID = '1074164486'
		}
	]
});
