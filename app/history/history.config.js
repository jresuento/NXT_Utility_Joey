'use strict';

angular.
module('history').
component('historyView', {
	templateUrl: 'history/history.template.html',
	controller: ['Utils', 'Rest', 'Cookies', 
		function HistoryController(Utils, Rest, Cookies) {

			var self = this;

			self.entityConfig = Rest.getEntityConfig.get();
			Rest.getStatusMessages.get().$promise.
			then(res => {
				self.statusMessages = res.messages
			})
			self.authorization = Cookies.getSSID();
			self.hasError = !1;
			self.hasMsg = !1;

			self.submit = function(){

				if(typeof self.authorization == 'undefined' || typeof self.entitytype == 'undefined' || typeof self.entityID == 'undefined'){
					self.showMsg(self.statusMessages.MissingFields, !0)
					return;
				}

				Rest.getHistory.start({
					'entityID': self.entityID,
					'entityType': self.entityType
				}).$promise
				.then(res => {
					console.log('result', res)
				 	//log parser
				})
				.catch(err => {		
					console.log('error:', err)			
					self.showMsg(err.status == 401 ? self.statusMessages.Unauthorized : JSON.stringify(err.data), !0)
				});
			}

			self.showMsg = function(msg, iserr){			
				!!iserr && (self.hasMsg = !1, self.hasError = !0) || (self.hasError = !1, self.hasMsg = !0)
				this.statusMsg = msg;

				setTimeout(function(){ 
					self.hasError = !1, self.hasMsg = !1; 
					//console.log('self', self)
				}, 3000);
			}
		}
	]
});
