'use strict';

angular.
module('JoeyNXTUtil').
config(['$locationProvider' ,'$routeProvider',
function config($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');
	$routeProvider.
	when('/home', {
		template: '<home-view></home-view>'
	}).
	when('/history', {
		template: '<history-view></history-view>'
	}).        
	otherwise('/home');
}
]);
