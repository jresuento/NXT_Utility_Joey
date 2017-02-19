'use strict';

angular.
module('home').
component('homeView', {
	templateUrl: 'home/home.template.html',
	controller: ['Utils', 'Rest', 'Cookies',
		function HomeController(Utils, Rest, Cookies) {

			var self = this;
			self.sessionId = Cookies.getSSID();
			Rest.getStatusMessages.get().$promise.
			then(res => {
				self.statusMessages = res.messages
			})
			self.hasError = !1;
			self.hasMsg = !1;

			self.login = function(){
				if(typeof self.username == 'undefined' || typeof self.password == 'undefined'){
					self.showMsg(self.statusMessages.IncorrectCredentials, !0)
					return;
				}
				self.showMsg(self.statusMessages.RequestSSID);
				Rest.login.start({}, Utils.format('{username:"{0}", password: "{1}"}', self.username, self.password)).$promise.
				then(res => {
					self.hasError = !1, self.hasMsg = !1;
					Cookies.$cookies.putObject('sessionId', self.sessionId = res.result.sessionId);
				}).
				catch(err => {
					self.showMsg(err.status == 401 ? self.statusMessages.IncorrectCredentials : JSON.stringify(err.data), !0)
				});
			}

			self.addSessionID = function(){
				Cookies.$cookies.putObject('sessionId', self.sessionId), self.showMsg(self.statusMessages['CookieSaved']);
			}

			self.showMsg = function(msg, iserr){			
				!!iserr && (self.hasMsg = !1, self.hasError = !0) || (self.hasError = !1, self.hasMsg = !0)
				this.statusMsg = msg;

				setTimeout(function(){ 
					self.hasError = !1, self.hasMsg = !1; //buggy, only works if you interact in the page
				}, 3000);
			}
	}]
});
