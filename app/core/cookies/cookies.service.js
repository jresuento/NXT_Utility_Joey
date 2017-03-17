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
		getUserName(){
			return (typeof this.$cookies.getObject('username') != 'undefined') ? this.$cookies.getObject('username') : '';
		}
		getPassword(){
			return (typeof this.$cookies.getObject('password') != 'undefined') ? this.$cookies.getObject('password') : '';
		}
		shouldRemember(){
			return (typeof this.$cookies.getObject('remember') != 'undefined' && this.$cookies.getObject('remember') == 'yes')  ? !0 : !1;
		}
	}
	return new Cookies
}]);