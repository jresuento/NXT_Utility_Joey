'use strict';

angular.
module('home').
component('homeView', {
	templateUrl: 'home/home.template.html',
	controller: ['$rootScope', '$resource', '$cookies', 'Utils',
		function HomeController($rootScope, $resource, $cookies, utils) {

			var self = this;

			self.sessionId = (typeof $rootScope.sessionId != 'undefined') ? $rootScope.sessionId : ((typeof $cookies.getObject('sessionId') != 'undefined') ? $cookies.getObject('sessionId') : '');

			self.submit = function(){
				 ($resource('https://api.sizmek.com/rest/login/login/', {}, {
					login : {
						'method' : 'POST',
						isArray: false
					}					
				})).login({}, utils.format('{username:"{0}", password: "{1}"}', self.username, self.password)).$promise.then(res => {
				 	$cookies.putObject('sessionId', $rootScope.sessionId = self.sessionId = res.result.sessionId)
				 });
			}
		}
	]
});
