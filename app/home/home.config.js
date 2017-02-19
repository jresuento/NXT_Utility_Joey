'use strict';

angular.
module('home').
component('homeView', {
	templateUrl: 'home/home.template.html',
	controller: ['$rootScope', '$cookies', 'Utils', 'Rest',
		function HomeController($rootScope, $cookies, utils, rest) {

			var self = this;

			//self.sessionId = (typeof $rootScope.sessionId != 'undefined') ? $rootScope.sessionId : ((typeof $cookies.getObject('sessionId') != 'undefined') ? $cookies.getObject('sessionId') : '');

			self.submit = function(){
				 nxtrest.login.start({}, utils.format('{username:"{0}", password: "{1}"}', self.username, self.password)).$promise.then(res => {
				 	$cookies.putObject('sessionId', $rootScope.sessionId = self.sessionId = res.result.sessionId)
				 });
			}
		}
	]
});
