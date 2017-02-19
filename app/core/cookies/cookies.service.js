'use strict';

angular.module('core.cookies').
factory('Cookies', ['$cookies',
function($cookies){	
	class Cookies{
		constructor(){
			this.$cookies = $cookies;
		}
		getSSID(){
			return (typeof this.$cookies.getObject('sessionId') != 'undefined') ? this.$cookies.getObject('sessionId') : '';
		}
	}
	return new Cookies
}]);