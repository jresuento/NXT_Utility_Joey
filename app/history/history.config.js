'use strict';

angular.
module('history').
component('historyView', {
	templateUrl: 'history/history.template.html',
	controller: ['Utils', 'Rest', 'Cookies', 'LogParser', 
		function HistoryController(Utils, Rest, Cookies, LogParser) {

			var self = this;

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

				Rest.getHistory().start({
					'entityID': self.entityID,
					'entityType': self.entityType
				}).$promise
				.then(res => {
					
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

			//testonly
			self.entityType = 'DeliveryGroup', self.entityID = '1073815164'
		}
	]
});
